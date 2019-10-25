import { argv } from 'yargs';
import fse from 'fs-extra';
import { exportMenu } from '../lib';

const filePath = argv.output || './output/menu.json';
const { apiKey } = argv;

if (!apiKey) throw new Error('apiKey found in arguments.');

exportMenu({
  apiKey,
}).then((data) => {
  fse.outputFileSync(filePath, JSON.stringify(data));
});
