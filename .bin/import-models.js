#!/usr/bin/env node
const fse = require('fs-extra');
const prompts = require('prompts');
const { importModels } = require('..');

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
    message: 'Where are your models saved?',
    initial: './output/models.json',
  },
];

const run = async function run() {
  const response = await prompts(questions);
  const { apiKey } = response;

  const models = JSON.parse(fse.readFileSync(response.input));

  importModels({
    models,
    apiKey,
  });
};

run();
