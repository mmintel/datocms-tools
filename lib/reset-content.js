import { SiteClient } from 'datocms-client';

export default async function ({ apiKey }) {
  if (!apiKey) {
    throw new Error('Must pass apiKey.');
  }

  const client = new SiteClient(apiKey);
  const items = await client.items.all();

  await Promise.all(items.map(async (item) => {
    const itemWithoutRelationships = Object.keys(item).reduce((acc, key) => {
      const val = item[key];

      if (!Array.isArray(val)) return acc;

      return {
        ...acc,
        [key]: [],
      };
    }, {});

    await client.items.update(item.id, itemWithoutRelationships);
  }));

  await Promise.all(items.map(async (item) => {
    await client.items.destroy(item.id);
  }));
}
