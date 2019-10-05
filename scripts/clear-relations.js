import { argv } from 'yargs';
import fse from 'fs-extra';
import { clearRelations } from '../lib';

const input = argv.input || './output/models.json';
const output = argv.output || input;

let models;

try {
  models = JSON.parse(fse.readFileSync(input));
} catch (e) {
  throw new Error('Could not read input.');
}

clearRelations({
  models,
}).then((data) => {
  fse.outputFileSync(output, JSON.stringify(data));
});
