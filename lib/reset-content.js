import { SiteClient } from 'datocms-client';
import sortByRelation from './util/sort-by-relation';

export default async function ({ apiKey }) {
  if (!apiKey) {
    throw new Error('Must pass apiKey.');
  }

  const client = new SiteClient(apiKey);
  const items = await client.items.all();

  if (!items.length) return;

  const sortedItems = sortByRelation(items, items[0]).reverse();

  await Promise.all(sortedItems.map(async (item) => {
    await client.items.destroy(item.id);
  }));
}
