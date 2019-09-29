export default function ({ apiKeys, models }) {
  let itemTypes;

  if (!apiKeys) {
    throw new Error('Must pass at least one name of a model.');
  }

  if (Array.isArray(apiKeys)) {
    itemTypes = models.itemTypes.filter((m) => apiKeys.includes(m.apiKey));
  } else {
    itemTypes = models.itemTypes.filter((m) => m.apiKey === apiKeys);
  }

  if (itemTypes.length <= 0) {
    console.warn('Model not found.');
    return {
      itemTypes: [],
      fields: [],
    };
  }

  const itemTypesFields = [];

  itemTypes.forEach((i) => {
    i.fields.forEach((f) => itemTypesFields.push(f));
  });

  const fields = models.fields.filter((f) => itemTypesFields.includes(f.id));

  fields.forEach((field) => {
    const newField = field;

    if (newField.validators && newField.validators.itemsItemType && newField.validators.itemsItemType.itemTypes) {
      newField.validators.itemsItemType.itemTypes.forEach((id) => {
        const relatedItemType = models.itemTypes.find((i) => i.id === id);
        itemTypes = [...itemTypes, relatedItemType];
      });
    }

    if (newField.validators && newField.validators.itemItemType && newField.validators.itemItemType.itemTypes) {
      newField.validators.itemItemType.itemTypes.forEach((id) => {
        const relatedItemType = models.itemTypes.find((i) => i.id === id);
        itemTypes = [...itemTypes, relatedItemType];
      });
    }

    if (newField.validators && newField.validators.richTextBlocks && newField.validators.richTextBlocks.itemTypes) {
      newField.validators.richTextBlocks.itemTypes.forEach((id) => {
        const relatedItemType = models.itemTypes.find((i) => i.id === id);
        const relatedFields = models.fields.filter((f) => relatedItemType.fields.includes(f.id));
        fields.push(...relatedFields);
        itemTypes.push(relatedItemType);
      });
    }

    return newField;
  });

  return {
    itemTypes,
    fields,
  };
}
