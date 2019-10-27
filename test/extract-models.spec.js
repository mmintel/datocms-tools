import { extractModels } from '@/';
import models from './sample/models.json';
import extractExampleModels from './sample/extract-example-models.json';

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
    expect(console.warn).toHaveBeenCalled();
    expect(extracted.itemTypes).toEqual([]);
    expect(extracted.fields).toEqual([]);
  });

  it('should extract all fields included by the model', () => {
    const apiKey = 'layout';
    const extracted = extractModels({
      apiKeys: apiKey,
      models,
    });
    const extractedItemType = extracted.itemTypes.find((m) => m.apiKey === apiKey);
    extractedItemType.fields.forEach((fieldID) => {
      expect(extracted.fields.find((f) => f.id === fieldID)).toBeDefined();
    });
  });

  it('should not include any other itemTypes and fields', () => {
    const apiKey = 'document';
    const extracted = extractModels({
      apiKeys: apiKey,
      models: extractExampleModels,
    });
    const allowedItemTypes = [apiKey, 'text'];
    const allowedFields = ['blocks'];
    const otherItemTypes = extracted.itemTypes.filter((itemType) => !allowedItemTypes.includes(itemType.apiKey));
    const otherFields = extracted.fields.filter((field) => !allowedFields.includes(field.apiKey));
    expect(otherItemTypes).toEqual([]);
    expect(otherFields).toEqual([]);
  });
});
