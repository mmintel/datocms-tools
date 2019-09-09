import fse from 'fs-extra';
import { exportModels } from '../lib';

const filePath = './output/data.json';
const apiKey = process.env.DATOCMS_API_KEY;

if (!apiKey) throw new Error('DATOCMS_API_KEY not found in environment variables.');

exportModels({
  apiKey,
}).then((data) => {
  fse.outputFileSync(filePath, JSON.stringify(data));
});
