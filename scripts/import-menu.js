import fs from 'fs';
import { importMenu } from '../lib';

const menuFilePath = './output/menu.json';
const modelsFilePath = './output/models.json';
let menuItems;
let models;

try {
  menuItems = JSON.parse(fs.readFileSync(menuFilePath));
} catch (e) {
  throw new Error('Could not read menu.json, did you export first?');
}

try {
  models = JSON.parse(fs.readFileSync(modelsFilePath));
} catch (e) {
  throw new Error('Could not read models.json, did you export first?');
}

const apiKey = process.env.DATOCMS_API_KEY;

if (!apiKey) throw new Error('DATOCMS_API_KEY not found in environment variables.');

importMenu({
  menuItems,
  models,
  apiKey,
});
