import { argv } from 'yargs';
import fs from 'fs';
import { importModels } from '../lib';

const filePath = argv.input || './output/models.json';
const models = JSON.parse(fs.readFileSync(filePath));
const { apiKey } = argv;

if (!apiKey) throw new Error('apiKey found in arguments.');

importModels({
  models,
  apiKey,
});
