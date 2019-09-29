import { argv } from 'yargs';
import fse from 'fs-extra';
import { exportModels } from '../lib';

const filePath = argv.output || './output/models.json';
const { apiKey } = argv;

if (!apiKey) throw new Error('apiKey found in arguments.');

exportModels({
  apiKey,
}).then((data) => {
  fse.outputFileSync(filePath, JSON.stringify(data));
});
