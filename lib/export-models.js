import { SiteClient } from 'datocms-client';

export default async function ({ apiKey }) {
  const client = new SiteClient(apiKey);
  const itemTypes = await client.itemTypes.all();
  return Promise.all(itemTypes.map(async (itemType) => {
    const fields = await client.fields.all(itemType.id);
    return {
      ...itemType,
      fields,
    };
  }));
}
