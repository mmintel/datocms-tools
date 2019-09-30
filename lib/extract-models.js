import { get } from 'lodash';

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

  const fields = [];

  itemTypes.forEach((itemType) => {
    const resolveRelations = (i) => {
      // collect each itemType
      if (!itemTypes.find((collectedItemType) => collectedItemType.id === i.id)) {
        itemTypes.push(i);
      }

      i.fields.forEach((fieldID) => {
        // collect each field
        const field = models.fields.find((modelField) => modelField.id === fieldID);

        if (!fields.find((collectedField) => collectedField.id === field.id)) {
          fields.push(field);
        } else {
          return;
        }

        const paths = [
          'validators.itemsItemType.itemTypes',
          'validators.itemItemType.itemTypes',
          'validators.richTextBlocks.itemTypes',
        ];

        paths.forEach((path) => {
          const itemTypeIDs = get(field, path);

          if (!itemTypeIDs) return;

          itemTypeIDs.forEach((id) => {
            const relatedItemType = models.itemTypes.find((modelItemType) => modelItemType.id === id);
            resolveRelations(relatedItemType);
          });
        });
      });
    };

    resolveRelations(itemType);
  });

  return {
    itemTypes,
    fields,
  };
}
