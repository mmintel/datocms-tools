import fs from 'fs';
import { importModels } from '../lib';

const filePath = './output/data.json';
const itemTypes = JSON.parse(fs.readFileSync(filePath));
const apiKey = process.env.DATOCMS_API_KEY;

if (!apiKey) throw new Error('DATOCMS_API_KEY not found in environment variables.');

importModels({
  itemTypes,
  apiKey,
});
