import { SiteClient } from 'datocms-client';

export default async function ({ apiKey, data }) {
  const client = new SiteClient(apiKey);
  let existingItemTypes = [];
  let existingFields = [];
  const { itemTypes, fields } = data;

  existingItemTypes = await client.itemTypes.all();

  const getPropsFromItemType = function getPropsFromItemType(itemType) {
    const {
      // eslint-disable-next-line no-shadow
      id, singletonItem, fields, titleField, orderingField, ...itemTypeProps
    } = itemType;
    return itemTypeProps;
  };

  const getPropsFromField = function getPropsFromField(field) {
    const {
      id, position, itemType, ...fieldProps
    } = field;
    return fieldProps;
  };

  const mapOldItemTypeIDToNewItemTypeID = (id) => {
    const oldApiKey = itemTypes.find((i) => i.id === id).apiKey;
    return existingItemTypes.find((i) => i.apiKey === oldApiKey).id;
  };

  const mapOldFieldIDToNewFieldID = (id, existingItemType) => {
    const oldExistingField = fields.find((f) => f.id === id);
    const existingField = existingFields.find((i) => i.apiKey === oldExistingField.apiKey && i.itemType === existingItemType.id);
    return existingField.id;
  };

  // get all existing fields
  await Promise.all(existingItemTypes.map(async (itemType) => {
    const existingFieldsOfItemType = await client.fields.all(itemType.id);
    existingFields = [...existingFields, ...existingFieldsOfItemType];
  }));

  // make sure all itemTypes exist and are updated
  await Promise.all(itemTypes.map(async (itemType) => {
    const existingItemType = existingItemTypes.find((i) => i.apiKey === itemType.apiKey);
    let currentItemType = existingItemType || itemType;
    const itemTypeProps = getPropsFromItemType(itemType);

    // check if itemType already exists in project, if so update it, else create it
    if (existingItemType) {
      console.info(`itemType ${currentItemType.apiKey} already exists, updating...`);
      currentItemType = await client.itemTypes.update(currentItemType.id, itemTypeProps);
    } else {
      console.info(`itemType ${currentItemType.apiKey} doesn't exist, creating...`);
      currentItemType = await client.itemTypes.create(itemTypeProps);
    }

    existingItemTypes = [...existingItemTypes, currentItemType];
  }));

  // find fields that depend on other fields and put them last so
  // the other fields already exist before we deal with those
  const dependingFieldsFilter = (i) => i.fieldType !== 'slug';
  const defaultFields = fields.filter(dependingFieldsFilter);
  const dependingFields = fields.filter((i) => !dependingFieldsFilter(i));
  const sortedFields = [...defaultFields, ...dependingFields];

  for (const field of sortedFields) {
    const oldItemTypeOfField = itemTypes.find((i) => i.id === field.itemType);
    const existingItemTypeOfField = existingItemTypes.find((i) => i.apiKey === oldItemTypeOfField.apiKey);
    const fieldProps = getPropsFromField(field);
    const existingField = existingFields.find((f) => f.apiKey === field.apiKey && f.itemType === existingItemTypeOfField.id);
    let currentField = existingField || field;

    if (
      field.validators
      && field.validators.itemItemType
      && field.validators.itemItemType.itemTypes
    ) {
      fieldProps.validators = { itemItemType: { itemTypes: [] } };
      // eslint-disable-next-line max-len
      fieldProps.validators.itemItemType.itemTypes = field.validators.itemItemType.itemTypes.map(mapOldItemTypeIDToNewItemTypeID);
    }

    if (
      field.validators
      && field.validators.slugTitleField
      && field.validators.slugTitleField.titleFieldId
    ) {
      fieldProps.validators = { ...field.validators };
      fieldProps.validators.slugTitleField = { titleFieldId: '' };
      // eslint-disable-next-line max-len
      fieldProps.validators.slugTitleField.titleFieldId = mapOldFieldIDToNewFieldID(field.validators.slugTitleField.titleFieldId, existingItemTypeOfField);
    }

    if (existingField) {
      console.info(`field ${currentField.apiKey} already exists, updating ...`);
      currentField = await client.fields.update(existingField.id, fieldProps);
      existingFields = existingFields.map((f) => (f.id === currentField.id ? currentField : f));
    } else {
      console.info(`field ${currentField.apiKey} doesn't exist, creating ...`);
      currentField = await client.fields.create(existingItemTypeOfField.id, fieldProps);
      existingFields = [...existingFields, currentField];
    }
  }

  // resolve itemType props that depend on fields
  for (const itemType of itemTypes) {
    let newTitleField;
    let newOrderingField;
    const existingItemType = existingItemTypes.find((i) => i.apiKey === itemType.apiKey);

    if (itemType.titleField) {
      // eslint-disable-next-line max-len
      const oldApiKeyOfTitleField = fields.find((f) => f.id === itemType.titleField).apiKey;
      newTitleField = existingFields.find((f) => f.apiKey === oldApiKeyOfTitleField).id;
    }

    if (itemType.orderingField) {
      // eslint-disable-next-line max-len
      const oldApiKeyOfOrderingFIeld = fields.find((f) => f.id === itemType.orderingField).apiKey;
      newOrderingField = existingFields.find((f) => f.apiKey === oldApiKeyOfOrderingFIeld).id;
    }

    const updateData = {
      ...getPropsFromItemType(existingItemType),
      titleField: newTitleField,
      orderingField: newOrderingField,
    };

    await client.itemTypes.update(existingItemType.id, updateData);
  }
}
