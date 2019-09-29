import { argv } from 'yargs';
import fs from 'fs';
import { importMenu } from '../lib';

const menuFilePath = argv.menu || './output/menu.json';
const modelsFilePath = argv.models || './output/models.json';
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

const { apiKey } = argv;

if (!apiKey) throw new Error('apiKey found in arguments.');

importMenu({
  menuItems,
  models,
  apiKey,
});
