import { exportModels, reset, importModels } from '@/';
import models from './models';

jest.setTimeout(20000);
jest.unmock('datocms-client');

const apiKey = process.env.DATOCMS_API_KEY;

describe('Models', () => {
  let exportedModels;

  it('reset models', async () => {
    await reset({ apiKey });
    const current = await exportModels({ apiKey });
    expect(current.itemTypes).toEqual([]);
    expect(current.fields).toEqual([]);
  });

  it('should import models', async () => {
    await importModels({ apiKey, models });
  });

  it('should export models', async () => {
    exportedModels = await exportModels({ apiKey });
    expect(exportedModels.itemTypes.length).toEqual(models.itemTypes.length);
    expect(exportedModels.fields.length).toEqual(models.fields.length);
  });
});
