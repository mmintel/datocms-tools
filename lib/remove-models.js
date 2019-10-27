import { get } from 'lodash';

export default function ({ apiKeys, models }) {
  let itemTypes;

  if (!apiKeys) {
    throw new Error('Must pass one or more apiKeys.');
  }

  if (!(typeof apiKeys === 'string') && !(Array.isArray(apiKeys))) {
    throw new Error('apiKeys must be string or array.');
  }

  if (!models || !models.itemTypes || !models.fields) {
    throw new Error('Must pass models containing itemTypes and fields.');
  }

  if (Array.isArray(apiKeys)) {
    itemTypes = models.itemTypes.filter((m) => apiKeys.includes(m.apiKey));
  } else {
    itemTypes = models.itemTypes.filter((m) => m.apiKey === apiKeys);
  }

  if (itemTypes.length <= 0) {
    console.warn('No matching model in:', apiKeys);
    return models;
  }

  const filteredModels = { ...models };

  itemTypes.forEach((itemType) => {
    filteredModels.itemTypes = filteredModels.itemTypes.filter((i) => i.apiKey !== itemType.apiKey);
    filteredModels.fields = filteredModels.fields.filter((f) => !itemType.fields.includes(f.id));

    filteredModels.fields.forEach((filteredField) => {
      const cleanedField = { ...filteredField };
      const paths = [
        'validators.itemsItemType.itemTypes',
        'validators.itemItemType.itemTypes',
        'validators.richTextBlocks.itemTypes',
      ];

      paths.forEach((path) => {
        const relatedItemTypes = get(filteredField, path);
        if (relatedItemTypes && relatedItemTypes.includes(itemType.id)) {
          cleanedField.validators.itemsItemType.itemTypes = filteredField.validators.itemsItemType.itemTypes.filter((i) => i !== itemType.id);
        }
      });
    });
  });

  return filteredModels;
}
