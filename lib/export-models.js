import { SiteClient } from 'datocms-client';
import { chain } from 'lodash';

export default async function ({ apiKey }) {
  if (!apiKey) {
    throw new Error('Must pass apiKey.');
  }
  const client = new SiteClient(apiKey);
  const itemTypes = await client.itemTypes.all();
  const fields = await Promise.all(itemTypes.map(async (itemType) => client.fields.all(itemType.id)));
  return {
    itemTypes,
    fields: chain(fields).flatten().sortBy('position').value(),
  };
}
