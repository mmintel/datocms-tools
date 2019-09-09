import { SiteClient } from 'datocms-client';

export default async function ({ apiKey }) {
  const client = new SiteClient(apiKey);
  const itemTypes = await client.itemTypes.all();
  const fields = await Promise.all(itemTypes.map(async (itemType) => client.fields.all(itemType.id)));
  return {
    itemTypes,
    fields: fields.flat(),
  };
}
