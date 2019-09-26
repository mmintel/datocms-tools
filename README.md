# datocms-tools
Provides tools to import, export or reset [DatoCMS](http://datocms.com) projects. Will also make sure to update existing models.

[Read more at this Medium article](https://medium.com/baretheme/duplicate-a-datocms-project-without-its-data-798b5dcabd15)

## Important Note
This script is not battle proven yet! You may risk to loose data so use with care!!

## Installation
```
npm i -S @mmintel/datocms-tools
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
| `importMenu` | `{ apiKey, menuItems, models }` | Imports menu items to the project with given `apiKey`. Will also delete all menuItems that do not exist in the given data.
| `exportMenu` | `{ apiKey }` | Will export menuItems from the project with given `apiKey`

### Via CLI
I created scripts for each of the methods so you can use them from your command line. Each script is also registered as an npm command. However you need to pass an API token from DatoCMS with write access.

#### Via NPM
```
DATOCMS_API_KEY=xxxx npm run import-models
```

#### Via node
* `DATOCMS_API_KEY=xxxx node ./scripts/import-models.js`
* `DATOCMS_API_KEY=xxxx node ./scripts/export-models.js`
* `DATOCMS_API_KEY=xxxx node ./scripts/import-menu.js`
* `DATOCMS_API_KEY=xxxx node ./scripts/exoprt-menu.js`