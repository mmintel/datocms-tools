import { exportModels } from '@/';
import models from './sample/models.json';

describe('exportModels', () => {
  it('should return an error if no arguments passed', async () => {
    await expect(exportModels()).rejects.toThrow();
  });

  it('should return an error if no apiKey passed', async () => {
    await expect(exportModels({})).rejects.toThrow();
  });

  it('should return an object containing fields and itemTypes', async () => {
    const exportedModels = await exportModels({ apiKey: 'xxx' });
    expect(typeof exportedModels).toBe('object');
    expect(Array.isArray(exportedModels.itemTypes)).toBe(true);
    expect(Array.isArray(exportedModels.fields)).toBe(true);
  });

  it('should return the correct data', async () => {
    const exportedModels = await exportModels({ apiKey: 'xxx' });
    expect(exportedModels.itemTypes).toEqual(models.itemTypes);
    expect(exportedModels.fields).toEqual(models.fields);
  });
});
