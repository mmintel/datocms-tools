#!/usr/bin/env node
const fse = require('fs-extra');
const prompts = require('prompts');
const { extractModel } = require('..');

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
];

const run = async function run() {
  const response = await prompts(questions);
  const { apiKey } = response;

  let models;

  try {
    models = JSON.parse(fse.readFileSync(response.input));
  } catch (e) {
    console.log('Could not read models', e);
  }

  const data = extractModel({
    apiKey,
    models,
  });
  fse.outputFileSync(response.output, JSON.stringify(data));
};

run();
