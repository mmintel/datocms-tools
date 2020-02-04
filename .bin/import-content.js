#!/usr/bin/env node
const prompts = require('prompts');
const { importContent } = require('..');
const fse = require('fs-extra');

const questions = [
  {
    type: 'text',
    name: 'apiKey',
    message: 'Please enter your full-access DatoCMS key',
    validate: (v) => v.length >= 10,
  },
  {
    type: 'text',
    name: 'content',
    message: 'Where is your content stored?',
    initial: './output/content.json',
  },
  {
    type: 'text',
    name: 'models',
    message: 'Where are your models stored?',
    initial: './output/models.json',
  },
];

const run = async function run() {
  const response = await prompts(questions);
  const { apiKey } = response;

  const models = JSON.parse(fse.readFileSync(response.models));
  const content = JSON.parse(fse.readFileSync(response.content));

  importContent({
    apiKey,
    models,
    content
  });
};

run();
