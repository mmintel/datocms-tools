import { SiteClient } from 'datocms-client';

export default async function ({ apiKey, menuItems, models }) {
  const client = new SiteClient(apiKey);
  const existingItemTypes = await client.itemTypes.all();
  let existingMenuItems = await client.menuItems.all();

  const getPropsOfMenuItem = (menuItem) => {
    const { id, ...menuItemProps } = menuItem;
    return menuItemProps;
  };

  for (const menuItem of menuItems) {
    const itemType = models.itemTypes.find((i) => i.id === menuItem.itemType);
    const existingItemType = existingItemTypes.find((i) => i.apiKey === itemType.apiKey);
    const existingMenuItem = existingMenuItems.find((m) => m.itemType === existingItemType.id);
    const menuItemProps = {
      ...getPropsOfMenuItem(menuItem),
      itemType: existingItemType.id,
    };
    let currentMenuItem = existingMenuItem || menuItem;

    if (existingMenuItem) {
      currentMenuItem = await client.menuItems.update(existingMenuItem.id, menuItemProps);
      existingMenuItems = existingMenuItems.map((m) => (m.id === currentMenuItem ? currentMenuItem : m));
    } else {
      currentMenuItem = await client.menuItems.create(menuItemProps);
      existingMenuItems = [...existingMenuItem, currentMenuItem];
    }
  }

  for (const existingMenuItem of existingMenuItems) {
    const existingItemType = existingItemTypes.find((i) => i.id === existingMenuItem.itemType);
    const itemType = models.itemTypes.find((i) => i.apiKey === existingItemType.apiKey);
    const menuItem = menuItems.find((m) => m.itemType === itemType.id);

    if (!menuItem) {
      await client.menuItems.destroy(existingMenuItem.id);
    }
  }
}
