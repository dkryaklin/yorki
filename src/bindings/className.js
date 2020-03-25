import common from "./common";

export const className = (component, className, field, fn) => {
  return common(field, value => {
    let isAddClass;
    if (fn) {
      isAddClass = fn(value);
    } else {
      isAddClass = value;
    }

    if (isAddClass) {
      component().el.classList.add(className);
    } else {
      component().el.classList.remove(className);
    }
  });
};
