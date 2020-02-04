#!/usr/bin/env node
const fse = require('fs-extra');
const prompts = require('prompts');
const { exportMenu } = require('..');

const questions = [
  {
    type: 'text',
    name: 'apiKey',
    message: 'Please enter your full-access DatoCMS key',
    validate: (v) => v.length >= 10,
  },
  {
    type: 'text',
    name: 'output',
    message: 'Where would you like to save the file?',
    initial: './output/menu.json',
  },
];

const run = async function run() {
  const response = await prompts(questions);
  const { apiKey } = response;

  exportMenu({
    apiKey,
  }).then((data) => {
    fse.outputFileSync(response.output, JSON.stringify(data));
  });
};

run();

