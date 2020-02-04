#!/usr/bin/env node
const prompts = require('prompts');
const { reset } = require('..');

const questions = [
  {
    type: 'text',
    name: 'apiKey',
    message: 'Please enter your full-access DatoCMS key',
    validate: (v) => v.length >= 10,
  },
];

const run = async function run() {
  const response = await prompts(questions);
  const { apiKey } = response;

  reset({
    apiKey,
  });
};

run();
