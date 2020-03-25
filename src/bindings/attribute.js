import common from "./common";

export const attribute = (component, attribute, field, fn) => {
  return common(field, value => {
    let attributeValue;
    if (fn) {
      attributeValue = fn(value);
    } else {
      attributeValue = value;
    }

    if (attributeValue) {
      component().el.setAttribute(attribute, attributeValue);
    } else {
      component().el.removeAttribute(attribute);
    }
  });
};
