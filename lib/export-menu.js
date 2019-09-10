import { SiteClient } from 'datocms-client';

export default async function ({ apiKey }) {
  const client = new SiteClient(apiKey);
  return client.menuItems.all();
}
