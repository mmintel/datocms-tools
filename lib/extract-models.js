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

  const fields = models.fields.filter((f) => f.itemType === itemTypes[0].id);
  const newFields = fields.map((field) => {
    const newField = field;

    if (newField.validators && newField.validators.itemsItemType && newField.validators.itemsItemType.itemTypes) {
      newField.validators.itemsItemType.itemTypes.forEach((id) => {
        const relatedItemType = models.itemTypes.find((i) => i.id === id);
        itemTypes = [...itemTypes, relatedItemType];
      });
    }

    return newField;
  });

  return {
    itemTypes,
    fields: newFields,
  };
}
