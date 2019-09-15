import { SiteClient } from 'datocms-client';

export default async function ({ apiKey }) {
  const client = new SiteClient(apiKey);
  const items = await client.items.all();
  const menuItems = await client.menuItems.all();

  const deleteItemTypes = async () => {
    console.log('deleting item types...');
    const itemTypes = await client.itemTypes.all();
    return Promise.all(itemTypes.map(async (itemType) => client.itemTypes.destroy(itemType.id)));
  };

  try {
    console.log('deleting menu items...');
    await Promise.all(menuItems.map(async (menuItem) => client.menuItems.destroy(menuItem.id)));
  } catch (e) {
    console.log(e);
  }

  try {
    console.info('deleting items...');
    await Promise.all(items.map(async (item) => client.items.destroy(item.id)));
  } catch (e) {
    console.log(e);
  }

  let errorDeletingItemTypes = false;
  do {
    try {
      await deleteItemTypes();
      errorDeletingItemTypes = false;
    } catch (e) {
      errorDeletingItemTypes = true;
    }
  } while (errorDeletingItemTypes);
}
