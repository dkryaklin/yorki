import common from './common';

export const bindAttached = (component, field, fn) => {
  const emptyNode = document.createElement('div');
  const parentNode = component().target().element;

  return common(field, (value) => {
    let isAttach;
    if (fn) {
      isAttach = fn(value);
    } else {
      isAttach = value;
    }

    if (isAttach && !component().element.parentNode) {
      parentNode.replaceChild(component().element, emptyNode);
    } else if (!isAttach && component().element.parentNode) {
      parentNode.replaceChild(emptyNode, component().element);
    }
  });
};
