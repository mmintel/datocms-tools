import { removeModels } from '@/';
import models from './sample/models.json';

jest.spyOn(global.console, 'warn');

describe('removeModels', () => {
  it('should throw an error if no arguments passed', () => {
    expect(() => removeModels());
  });

  it('should throw an error if no apiKeys and models passed', () => {
    expect(() => removeModels({}));
  });

  it('should throw an error if no apiKeys passed', () => {
    expect(() => removeModels({ models }));
  });

  it('should throw an error if no models passed', () => {
    expect(() => removeModels({ apiKeys: 'layout' }));
  });

  it('should throw an error if no models.itemTypes passed', () => {
    expect(() => removeModels({
      apiKeys: 'layout',
      models: {
        fields: models.fields,
      },
    }));
  });

  it('should throw an error if no models.fields passed', () => {
    expect(() => removeModels({
      apiKeys: 'layout',
      models: {
        itemTypes: models.itemTypes,
      },
    }));
  });

  it('should throw an error if apiKeys is nor string or array', () => {
    expect(() => removeModels({
      apiKeys: 123,
      models,
    }));
  });

  it('should return the same models if apiKeys not found', () => {
    const filteredModels = removeModels({
      apiKeys: 'somethingthatdoesntexist',
      models,
    });
    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledWith('Model not found.');
    expect(filteredModels).toEqual(models);
  });

  it('should remove the itemTypes of a single model', () => {
    const apiKey = 'teaser';
    const filteredModels = removeModels({
      apiKeys: apiKey,
      models,
    });
    expect(filteredModels.itemTypes.find((m) => m.apiKey === apiKey)).toBeUndefined();
  });

  it('should remove the fields of a single model', () => {
    const apiKey = 'teaser';
    const filteredModels = removeModels({
      apiKeys: apiKey,
      models,
    });
    const modelToRemove = models.itemTypes.find((m) => m.apiKey === apiKey);
    modelToRemove.fields.forEach((fieldID) => {
      expect(filteredModels.fields.find((f) => f.id === fieldID)).toBeUndefined();
    });
  });

  it('should remove all relations of the model', () => {
    const apiKey = 'teaser';
    const filteredModels = removeModels({
      apiKeys: apiKey,
      models,
    });
    const modelToRemove = models.itemTypes.find((m) => m.apiKey === apiKey);

    filteredModels.fields.forEach((filteredField) => {
      if (filteredField.validators.itemsItemType && filteredField.validators.itemsItemType.itemTypes) {
        expect(filteredField.validators.itemsItemType.itemTypes.includes(modelToRemove.id)).toEqual(false);
      }

      if (filteredField.validators.itemItemType && filteredField.validators.itemItemType.itemTypes) {
        expect(filteredField.validators.itemItemType.itemTypes.includes(modelToRemove.id)).toEqual(false);
      }

      if (filteredField.validators.richTextBlocks && filteredField.validators.richTextBlocks.itemTypes) {
        expect(filteredField.validators.richTextBlocks.itemTypes.includes(modelToRemove.id)).toEqual(false);
      }
    });
  });
});
