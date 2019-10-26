#!/usr/bin/env node
const fse = require('fs-extra');
const prompts = require('prompts');
const { removeModels } = require('..');

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
    message: 'Where would you like to store the filtered models?',
    initial: './output/filtered.json',
  },
  {
    type: 'list',
    name: 'apiKeys',
    message: 'Which models do you want to remove? (Comma separated list)',
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

  const data = removeModels({
    apiKeys,
    models,
  });
  fse.outputFileSync(response.output, JSON.stringify(data));
};

run();
