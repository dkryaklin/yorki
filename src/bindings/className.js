import common from './common';

export const bindClassName = (component, className, field, fn) => {
  return common(field, (value) => {
    let isAddClass;
    if (fn) {
      isAddClass = fn(value);
    } else {
      isAddClass = value;
    }

    if (isAddClass) {
      component().element.classList.add(className);
    } else {
      component().element.classList.remove(className);
    }
  });
};
