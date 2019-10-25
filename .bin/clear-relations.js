#!/usr/bin/env node
const prompts = require('prompts');
const { clearRelations } = require('..');

const questions = [
  {
    type: 'text',
    name: 'apiKey',
    message: 'Please enter your full-access DatoCMS key',
    validate: (v) => v.length >= 10,
  },
  {
    type: 'text',
    name: 'input',
    message: 'Where are your models stored?',
    initial: './output/models.json',
  },
  {
    type: 'text',
    name: 'output',
    message: 'Where would you like to save the file?',
    initial: './output/cleared-models.json',
  },
];

const run = async function run() {
  const response = await prompts(questions);
  const { apiKey } = response;

  clearRelations({
    models,
  }).then((data) => {
    fse.outputFileSync(output, JSON.stringify(data));
  });
};

run();
