import yargs from 'yargs';
import fse from 'fs-extra';
import { extractModel } from '../lib';

const { argv } = yargs.array('names');

const input = argv.input || './output/models.json';
const output = argv.output || './output/extracted.json';
let models;

try {
  models = JSON.parse(fse.readFileSync(input));
} catch (e) {
  console.log('Could not read models', e);
}

if (!argv.names) {
  throw new Error('Could not find "names" in passed arguments.');
}

const data = extractModel({
  names: argv.names,
  models,
});
fse.outputFileSync(output, JSON.stringify(data));
