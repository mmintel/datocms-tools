#!/usr/bin/env node
const prompts = require('prompts');
const { importMenu } = require('..');

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
  {
    type: 'text',
    name: 'input',
    message: 'Where are your menuItems saved?',
    initial: './output/menu.json',
  },
];

const run = async function run() {
  const response = await prompts(questions);
  const { apiKey } = response;

  let menuItems;
  let models;

  try {
    menuItems = JSON.parse(fs.readFileSync(response.menuItems));
  } catch (e) {
    throw new Error('Could not read menu.json, did you export first?');
  }

  try {
    models = JSON.parse(fs.readFileSync(response.models));
  } catch (e) {
    throw new Error('Could not read models.json, did you export first?');
  }

  importMenu({
    menuItems,
    models,
    apiKey,
  });
};

run();
