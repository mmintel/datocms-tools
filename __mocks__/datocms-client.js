import models from '../test/sample/models.json';
import content from '../test/sample/content.json';

export class SiteClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.itemTypes = {
      all() {
        return models.itemTypes;
      },
    };
    this.fields = {
      all(itemTypeID) {
        return models.fields.filter((f) => f.itemType === itemTypeID);
      },
    };

    this.items = {
      all() {
        return content;
      },
    };
  }
}

export default {
  SiteClient,
};
