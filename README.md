# datocms-tools [![Build Status](https://travis-ci.com/mmintel/datocms-tools.svg?branch=master)](https://travis-ci.com/mmintel/datocms-tools) [![Greenkeeper badge](https://badges.greenkeeper.io/mmintel/datocms-tools.svg)](https://greenkeeper.io/) ![David](https://img.shields.io/david/mmintel/datocms-tools)
Provides tools to import, export or reset [DatoCMS](http://datocms.com) projects. Will also make sure to update existing models.
![datocms-tools](/assets/image.png)
[Read more at this Medium article](https://medium.com/baretheme/duplicate-a-datocms-project-without-its-data-798b5dcabd15)

## Important Note
This script is not battle proven yet! You may risk to loose data so use with care!!

## Installation
```
npm i -S @mmintel/datocms-tools
```

or globally
```
npm i -G @mmintel/datocms-tools
```

## Usage
### In Javascript
Either import the whole object:
```JS
import DatoCMSTools from '@mmintel/datocms-tools';
```

or single methods like so:
```JS
import { importModels, exportModels, importMenu, exportMenu } from '@mmintel/datocms-tools';
```

To transfer data from one project to another use it like this:
```JS
import { importModels, exportModels, importMenu, exportMenu } from '@mmintel/datocms-tools';

export default async function() {
  const apiKey = 'xxx';
  const models = await exportModels({ apiKey });
  const menuItems = await exportMenu({ apiKey });

  await importModels({
    apiKey,
    models,
  })

  await importMenu({
    apiKey,
    models,
    menuItems,
  })
}
```

#### Methods
| Method | Arguments | Description
| --- | --- | --- |
| `importModels` | `{ apiKey, data }` | Imports given data to the project available with the `apiKey`. Data must contain `itemTypes` and `fields`.
| `exportModels` | `{ apiKey }` | Exports `itemTypes` and `fields` from the project available with the given `apiKey`
| `extractModels` | `{ apiKeys, models }` | Extracts `itemTypes` and `fields` from given models. Expects apiKeys to search for, can be `String` or `Array`.
| `importMenu` | `{ apiKey, menuItems, models }` | Imports menu items to the project with given `apiKey`. Will also delete all menuItems that do not exist in the given data.
| `exportMenu` | `{ apiKey }` | Will export menuItems from the project with given `apiKey`
| `clearRelations` | `{ models }` | Removes related fields, e.g. from modular content fields
| `removeModels` | `{ apiKeys, models }` | Removes one or more models including all their relations.
| `exportContent` | `{ apiKey }` | Exports all items of your project.
| `importContent` | `{ apiKey, content, models? }` | Imports items into a project. Models are required if you want to move content from one project to another.

### Via CLI
DatoCMS tools provides CLI commands matching the method names.

* import-models
* export-models
* extract-models
* import-menu
* export-menu
* clear-relations
* remove-models
* export-content
* import-content
