import common from "./common";

export const style = (component, style, field, fn) => {
  return common(field, value => {
    let styleValue;
    if (fn) {
      styleValue = fn(value);
    } else {
      styleValue = value;
    }

    component().el.style[style] = styleValue;
  });
};
