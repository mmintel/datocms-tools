import { SiteClient } from 'datocms-client';

export default async function ({ apiKey, content, models }) {
  if (!apiKey) {
    throw new Error('Must pass apiKey.');
  }

  const client = new SiteClient(apiKey);
  const itemTypes = await client.itemTypes.all();
  const couldBeID = (val) => /^\d+$/.test(val) && val.length > 5;
  const idMap = {};

  await Promise.all(content.map(async (item) => {
    const {
      id, meta, creator, updatedAt, createdAt, ...props
    } = item;
    const newItem = { ...props };

    Object.keys(props).forEach((key) => {
      const currentProp = props[key];

      if (couldBeID(currentProp)) {
        const existingItemType = models.itemTypes.find((i) => i.id === currentProp);

        if (existingItemType) {
          const newItemType = itemTypes.find((i) => i.id === existingItemType.id);
          console.log(`found existing itemType for ${key}. Replacing ${currentProp} with ${newItemType.id}...`);
          newItem[key] = newItemType.id;
        } else {
          console.log(`id ${currentProp} of prop ${key} was not found, setting to null.`);
          newItem[key] = null;
        }
      } else {
        newItem[key] = currentProp;
      }
    });

    const freshItem = await client.items.create(newItem);

    idMap[item.id] = freshItem.id;
  }));

  const freshItems = await client.items.all();
  await Promise.all(content.map(async (existingItem) => {
    const {
      id, meta, creator, updatedAt, createdAt, ...props
    } = existingItem;
    const update = {};
    const newID = idMap[existingItem.id];
    const item = freshItems.find((i) => i.id === newID);

    console.log('current item is', item);

    Object.keys(props).forEach((key) => {
      const currentProp = props[key];

      if (couldBeID(currentProp)) {
        const existingRelatedItem = content.find((i) => i.id === currentProp);

        console.log('found existingRelatedItem', existingRelatedItem);

        if (existingRelatedItem) {
          const newItem = freshItems.find((i) => i.id === existingRelatedItem.id);

          if (newItem) {
            console.log(`found existing item for ${key}. Replacing ${currentProp} with ${newItem.id}...`);
            update[key] = newItem.id;
          }
        }
      }
    });

    await client.item.update(item.id, update);
  }));
}
