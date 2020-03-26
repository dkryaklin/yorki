import common from './common';

export const bindStyle = (component, style, field, fn) => {
  return common(field, (value) => {
    let styleValue;
    if (fn) {
      styleValue = fn(value);
    } else {
      styleValue = value;
    }

    component().element.style[style] = styleValue;
  });
};
