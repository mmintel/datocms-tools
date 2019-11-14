import { SiteClient } from 'datocms-client';
import couldBeID from './util/could-be-id';
import sortByRelation from './util/sort-by-relation';

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
  const items = await client.items.all();
  const itemMap = [];

  if (items.length) {
    throw new Error('You already have content in this project.');
  }

  const sortedContent = sortByRelation(content, content[0]);

  const newItems = sortedContent.map((item) => {
    const existingItemType = models.itemTypes.find((i) => i.id === item.itemType);

    if (!existingItemType) {
      throw new Error('Could not find matching itemType. Are you sure you provided the right models?');
    }

    const newItemType = itemTypes.find((i) => i.apiKey === existingItemType.apiKey);
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
        const newID = itemMap.find((mapping) => mapping.old.id === val).new.id;
        if (newID) {
          newItem[key] = newID;
        }
      }
    });

    const freshItem = await client.items.create(newItem);
    itemMap.push({
      old: item,
      new: freshItem,
    });
  }

  const freshItems = await client.items.all();

  console.log('FRESH ITEMS', freshItems);

  for (const item of freshItems) {
    const existingItem = itemMap.find((mapping) => mapping.new.id === item.id).old;
    const parentMapping = itemMap.find((mapping) => mapping.old.id === existingItem.parentId);
    const parentId = parentMapping ? parentMapping.new.id : null;
    const update = {
      position: existingItem.position,
      parentId,
    };
    console.log('updating with', update);
    await client.items.update(item.id, update);
  }
}
