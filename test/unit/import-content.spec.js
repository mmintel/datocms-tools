import { importContent } from '@/';
import content from './sample/content.json';
import models from './sample/models.json';

describe('importContent', () => {
  it('should throw an error if no arguments passed', async () => {
    await expect(importContent()).rejects.toThrow();
  });

  it('should throw an error if no apiKey passed', async () => {
    await expect(importContent({ models, content })).rejects.toThrow();
  });

  it('should throw an error if no models passed', async () => {
    await expect(importContent({ apiKey: 'test', content })).rejects.toThrow();
  });

  it('should throw an error if no content passed', async () => {
    await expect(importContent({ apiKey: 'test', models })).rejects.toThrow();
  });
});
