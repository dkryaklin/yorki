import common from './common';

export const bindAttribute = (component, attribute, field, fn) => {
  return common(field, (value) => {
    let attributeValue;
    if (fn) {
      attributeValue = fn(value);
    } else {
      attributeValue = value;
    }

    if (attributeValue) {
      component().element.setAttribute(attribute, attributeValue);
    } else {
      component().element.removeAttribute(attribute);
    }
  });
};
