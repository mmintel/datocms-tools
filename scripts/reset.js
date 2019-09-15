import { reset } from '../lib';

const apiKey = process.env.DATOCMS_API_KEY;

if (!apiKey) throw new Error('DATOCMS_API_KEY not found in environment variables.');

reset({
  apiKey,
});
