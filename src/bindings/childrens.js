import common from './common';

export const bindChildrens = (parent, template, field, key, fn) => {
  let prevItems = [];
  const hashMap = new Map();

  const getKey = (item) => {
    if (typeof key === 'string') {
      return item[key];
    }

    return key(item);
  };

  return common(field, (value) => {
    let items;
    if (fn) {
      items = fn(value);
    } else {
      items = value;
    }

    const addItems = [];
    const removeItems = [];
    const updateItems = [];

    items.forEach((item) => {
      const itemKey = getKey(item);

      if (prevItems.findIndex((prevItem) => getKey(prevItem) === itemKey) === -1) {
        addItems.push(item);
      } else {
        updateItems.push(item);
      }
    });

    prevItems.forEach((prevItem) => {
      const itemKey = getKey(prevItem);
      if (items.findIndex((item) => getKey(item) === itemKey) === -1) {
        removeItems.push(prevItem);
      }
    });

    prevItems = [...items];

    removeItems.forEach((item) => {
      const itemKey = getKey(item);
      const element = hashMap.get(itemKey);

      element().destroy();

      hashMap.delete(itemKey);
    });

    addItems.forEach((item) => {
      const itemKey = getKey(item);
      const element = template(item);

      element().mount(parent);
      hashMap.set(itemKey, element);
    });

    updateItems.forEach((item) => {
      const itemKey = getKey(item);
      const element = hashMap.get(itemKey);

      element().update(item);
    });
  });
};
