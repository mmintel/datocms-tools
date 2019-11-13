import { SiteClient } from 'datocms-client';

export default async function ({ apiKey, content, models }) {
  if (!apiKey) {
    throw new Error('Must pass apiKey.');
  }

  if (!content) {
    throw new Error('Must pass an array containing items.');
  }

  if (!models) {
    throw new Error('Must pass array of models containing itemTypes and fields.');
  }

  const client = new SiteClient(apiKey);
  const itemTypes = await client.itemTypes.all();
  const couldBeID = (val) => /^\d+$/.test(val) && val.length > 4;
  const idMap = {};

  const sortedContent = [];

  const sortByRelation = (item) => {
    const index = content.findIndex((i) => i.id === item.id);
    let hasRelations = false;

    Object.keys(item).forEach((key) => {
      const val = item[key];
      const relatedFields = [];

      if (key !== 'id' && couldBeID(val)) {
        relatedFields.push(key);
      }

      if (relatedFields.includes(key)) {
        const relation = content.find((i) => i.id === val);
        if (relation) {
          sortByRelation(relation);
        }
      }

      if (Array.isArray(val)) {
        hasRelations = !!val.length;
        val.forEach((relatedID) => {
          const relation = content.find((i) => i.id === relatedID);
          sortByRelation(relation);
        });
      }
    });

    if (!hasRelations) {
      const nextItem = content[index + 1];
      if (nextItem) {
        sortByRelation(content[index + 1]);
      }
    }

    if (!sortedContent.find((i) => i.id === item.id)) {
      sortedContent.push(item);
    }
  };

  sortByRelation(content[0]);

  const newItems = sortedContent.map((item) => {
    const existingItemType = models.itemTypes.find((i) => i.id === item.itemType);
    const newItemType = itemTypes.find((i) => i.id === existingItemType.id);
    const newItem = { ...item };
    newItem.itemType = newItemType.id;
    return newItem;
  });

  for (const item of newItems) {
    const {
      id, meta, creator, updatedAt, createdAt, ...props
    } = item;
    const newItem = { ...props };

    Object.keys(newItem).forEach((key) => {
      const val = newItem[key];

      if (val && typeof val === 'string' && !val.length) {
        newItem[key] = null;
      }

      if (val && key !== 'itemType' && couldBeID(val)) {
        const newID = idMap[val];
        if (newID) {
          newItem[key] = newID;
        }
      }
    });

    const freshItem = await client.items.create(newItem);
    idMap[item.id] = freshItem.id;
  }
}
