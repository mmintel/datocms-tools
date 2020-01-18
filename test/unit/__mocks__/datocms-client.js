import models from '../sample/models.json';
import content from '../sample/content.json';

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
