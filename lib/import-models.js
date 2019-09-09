import { SiteClient } from 'datocms-client';

export default async function ({ apiKey, itemTypes }) {
  const client = new SiteClient(apiKey);
  const existingItemTypes = await client.itemTypes.all();
  const updatedItemTypes = []; // keep updated existing itemTypes and new itemTypes

  const getPropsFromItemType = function getPropsFromItemType(itemType) {
    const {
      id, singletonItem, fields, titleField, orderingField, ...itemTypeProps
    } = itemType;
    return itemTypeProps;
  };

  const getPropsFromField = function getPropsFromField(field) {
    const {
      id, position, validators, itemType, ...fieldProps
    } = field;
    return fieldProps;
  };

  await Promise.all(itemTypes.map(async (itemType) => {
    const existingItemType = existingItemTypes.find((i) => i.apiKey === itemType.apiKey);
    let currentItemType = existingItemType || itemType;
    const itemTypeProps = getPropsFromItemType(itemType);

    // check if itemType already exists in project, if so update it, else create it
    if (existingItemType) {
      console.info(`itemType ${currentItemType.apiKey} already exists, updating with`, itemTypeProps);
      currentItemType = await client.itemTypes.update(currentItemType.id, itemTypeProps);
    } else {
      console.info(`itemType ${currentItemType.apiKey} doesn't exist, creating with`, itemTypeProps);
      currentItemType = await client.itemTypes.create(itemTypeProps);
    }

    updatedItemTypes.push(currentItemType);
  }));

  await (Promise.all(itemTypes.map(async (itemType) => {
    const updatedItemType = updatedItemTypes.find((i) => i.apiKey === itemType.apiKey);
    const existingFields = await client.fields.all(updatedItemType.id);
    const updatedFields = [];
    const specialFieldsFilter = (i) => i.fieldType === 'slug';
    const defaultFields = itemType.fields.filter(specialFieldsFilter);
    const specialFields = itemType.fields.filter((i) => !specialFieldsFilter(i));
    const sortedFields = [...defaultFields, ...specialFields];

    // make sure all fields exist and are up2date
    await Promise.all(sortedFields.map(async (field) => {
      const fieldProps = getPropsFromField(field);
      const existingField = existingFields.find((f) => f.apiKey === field.apiKey);
      let currentField = existingField || field;

      const findItemTypeFromUpdatedItemTypesByID = (id) => {
        const oldApiKey = itemTypes.find((i) => i.id === id).apiKey;
        return updatedItemTypes.find((i) => i.apiKey === oldApiKey).id;
      };

      const findFieldFromUpdatedFieldsByID = (id) => {
        console.log('find field by', id, updatedFields.find((i) => i.id === id));
        return updatedFields.find((i) => i.id === id).id;
      };

      if (field.validators && field.validators.itemItemType && field.validators.itemItemType.itemTypes) {
        fieldProps.validators = { itemItemType: { itemTypes: [] } };
        fieldProps.validators.itemItemType.itemTypes = field.validators.itemItemType.itemTypes.map(findItemTypeFromUpdatedItemTypesByID);
      }

      if (field.validators && field.validators.slugTitleField && field.validators.slugTitleField.titleFieldId) {
        fieldProps.validators = { slugTitleField: { titleFieldId: '' } };
        fieldProps.validators.slugTitleField.titleFieldId = findFieldFromUpdatedFieldsByID(field.validators.slugTitleField.titleFieldId);
      }

      if (existingField) {
        console.info(`field ${currentField.apiKey} already exists, updating with`, fieldProps);
        currentField = await client.fields.update(currentField.id, fieldProps);
      } else {
        console.info(`field ${currentField.apiKey} doesn't exist, creating with`, fieldProps);
        currentField = await client.fields.create(updatedItemType.id, fieldProps);
      }

      updatedFields.push(currentField);
    }));

    // let newTitleField;
    // let newOrderingField;

    // if (itemType.titleField) {
    //   const oldApiKeyOfTitleField = itemType.fields.find((f) => f.id === itemType.titleField).apiKey;
    //   newTitleField = updatedFields.find((f) => f.apiKey === oldApiKeyOfTitleField);
    // }

    // if (itemType.orderingField) {
    //   const oldApiKeyOfOrderingFIeld = itemType.fields.find((f) => f.id === itemType.orderingField).apiKey;
    //   newOrderingField = updatedFields.find((f) => f.apiKey === oldApiKeyOfOrderingFIeld);
    // }

    // await client.itemTypes.update(updatedItemType.id, {
    //   ...getPropsFromItemType(itemType),
    //   titleField: newTitleField,
    //   orderingField: newOrderingField,
    // });
  })));
}
