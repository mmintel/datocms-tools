export default function ({ models }) {
  const { fields } = models;

  const sanitizedFields = fields.map((field) => {
    const newField = field;

    if (newField.validators && newField.validators.itemsItemType) {
      newField.validators.itemsItemType.itemTypes = [];
    }

    if (newField.validators && newField.validators.itemItemType) {
      newField.validators.itemItemType.itemTypes = [];
    }

    if (newField.validators && newField.validators.richTextBlocks) {
      newField.validators.richTextBlocks.itemTypes = [];
    }

    return newField;
  });

  return {
    itemTypes: models.itemTypes,
    fields: sanitizedFields,
  };
}
