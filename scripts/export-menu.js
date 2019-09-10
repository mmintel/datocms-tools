import fse from 'fs-extra';
import { exportMenu } from '../lib';

const filePath = './output/menu.json';
const apiKey = process.env.DATOCMS_API_KEY;

if (!apiKey) throw new Error('DATOCMS_API_KEY not found in environment variables.');

exportMenu({
  apiKey,
}).then((data) => {
  fse.outputFileSync(filePath, JSON.stringify(data));
});
