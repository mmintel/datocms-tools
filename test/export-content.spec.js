import { exportContent } from '@/';
import content from './sample/content.json';

describe('exportContent', () => {
  it('should return an error if no arguments passed', async () => {
    await expect(exportContent()).rejects.toThrow();
  });

  it('should return an error if no apiKey passed', async () => {
    await expect(exportContent({})).rejects.toThrow();
  });

  it('should return the correct content', async () => {
    const exportedContent = await exportContent({ apiKey: 'xxx' });
    expect(exportedContent).toEqual(content);
  });
});
