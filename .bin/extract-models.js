#!/usr/bin/env node
const fse = require('fs-extra');
const prompts = require('prompts');
const { extractModels } = require('..');

const questions = [
  {
    type: 'text',
    name: 'input',
    message: 'Where are your models stored?',
    initial: './output/models.json',
  },
  {
    type: 'text',
    name: 'output',
    message: 'Where would you like to store the extracted models?',
    initial: './output/extracted.json',
  },
  {
    type: 'list',
    name: 'apiKeys',
    message: 'Which models do you want to extract? (Comma separated list)',
  },
];

const run = async function run() {
  const response = await prompts(questions);
  const { apiKeys } = response;

  let models;

  try {
    models = JSON.parse(fse.readFileSync(response.input));
  } catch (e) {
    console.log('Could not read models', e);
  }

  console.log(apiKeys);

  const data = extractModels({
    apiKeys,
    models,
  });
  fse.outputFileSync(response.output, JSON.stringify(data));
};

run();
