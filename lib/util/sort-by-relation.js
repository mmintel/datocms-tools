import couldBeID from './could-be-id';

const sortByRelation = (items, item, collection = []) => {
  const index = items.findIndex((i) => i.id === item.id);
  const nextItem = items[index + 1];
  const sorted = collection.find((i) => i.id === item.id);

  if (sorted) return collection;

  Object.keys(item).forEach((key) => {
    const val = item[key];
    const relatedFields = [];

    if (key !== 'id' && couldBeID(val)) {
      relatedFields.push(key);
    }

    if (relatedFields.includes(key)) {
      const relation = items.find((i) => i.id === val);
      if (relation) {
        return sortByRelation(items, relation, collection);
      }
    }

    if (Array.isArray(val)) {
      val.forEach((relatedID) => {
        const relation = items.find((i) => i.id === relatedID);
        return sortByRelation(items, relation, collection);
      });
    }
  });

  collection.push(item);

  if (nextItem) {
    return sortByRelation(items, nextItem, collection);
  }

  return collection;
};

export default sortByRelation;
