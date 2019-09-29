export default function ({ names, models }) {
  let itemTypes;

  if (!names) {
    throw new Error('Must pass at least one name of a model.');
  }

  if (Array.isArray(names)) {
    itemTypes = models.itemTypes.filter((m) => names.includes(m.name));
  } else {
    itemTypes = models.itemTypes.filter((m) => m.name === names);
  }

  if (itemTypes.length <= 0) {
    console.warn('Model not found.');
    return {
      itemTypes: [],
      fields: [],
    };
  }

  const fields = models.fields.filter((f) => f.itemType === itemTypes[0].id);

  return {
    itemTypes,
    fields,
  };
}
