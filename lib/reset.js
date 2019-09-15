import { SiteClient } from 'datocms-client';

export default async function ({ apiKey }) {
  const client = new SiteClient(apiKey);
  const items = await client.items.all();
  const itemTypes = await client.itemTypes.all();
  const menuItems = await client.menuItems.all();

  items.forEach((item) => client.items.destroy(item.id));
  itemTypes.forEach((itemType) => client.itemTypes.destroy(itemType.id));
  menuItems.forEach((menuItem) => client.menuItems.destroy(menuItem.id));
}
