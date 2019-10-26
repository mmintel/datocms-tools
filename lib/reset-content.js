import { SiteClient } from 'datocms-client';

export default async function ({ apiKey }) {
  if (!apiKey) {
    throw new Error('Must pass apiKey.');
  }

  const client = new SiteClient(apiKey);
  const items = await client.items.all();

  await Promise.all(items.map(async (item) => client.items.destroy(item.id)));
}
