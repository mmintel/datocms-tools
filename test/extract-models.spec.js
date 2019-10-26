import { extractModels } from '@/';
import models from './sample/models.json';

jest.spyOn(global.console, 'warn');

describe('extractModels', () => {
  it('should throw an error if no arguments passed', () => {
    expect(() => extractModels()).toThrow();
  });

  it('should throw an error if no apiKey passed', () => {
    expect(() => extractModels({ models })).toThrow();
  });

  it('should throw an error if no models passed', () => {
    expect(() => extractModels({ apiKey: 'test' })).toThrow();
  });

  it('should throw an error if no models.itemTypes passed', () => {
    expect(() => extractModels({ apiKey: 'layout', models: { fields: models.fields } })).toThrow();
  });

  it('should throw an error if no models.fields passed', () => {
    expect(() => extractModels({ apiKey: 'layout', models: { itemTypes: models.itemTypes } })).toThrow();
  });

  it('should extract a single model', () => {
    const apiKey = 'layout';
    const extracted = extractModels({
      apiKeys: apiKey,
      models,
    });
    expect(extracted.itemTypes.find((m) => m.apiKey === apiKey)).toBeDefined();
  });

  it('should extract multiple models', () => {
    const apiKeys = ['document', 'collection'];
    const extracted = extractModels({
      apiKeys,
      models,
    });
    apiKeys.forEach((apiKey) => {
      expect(extracted.itemTypes.find((m) => m.apiKey === apiKey)).toBeDefined();
    });
  });

  it('should return empty arrays if model not found', () => {
    const apiKey = 'somethingthatdoesntexist';
    const extracted = extractModels({
      apiKeys: apiKey,
      models,
    });
    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledWith('Model not found.');
    expect(extracted.itemTypes).toEqual([]);
    expect(extracted.fields).toEqual([]);
  });

  it('should extract all fields included by the model', () => {
    const apiKey = 'layout';
    const extracted = extractModels({
      apiKeys: apiKey,
      models,
    });
    const extractedModel = extracted.itemTypes.find((m) => m.apiKey === apiKey);
    extractedModel.fields.forEach((fieldID) => {
      expect(extracted.fields.find((f) => f.id === fieldID)).toBeDefined();
    });
  });
});
