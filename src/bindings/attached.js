import common from "./common";

export const attached = (element, field, fn) => {
  const emptyNode = document.createElement("div");

  let parentNode = element().el.parentNode;
  if (element().parent && element().parent().el) {
    parentNode = element().parent().el;
  }

  return common(field, value => {
    let isAttach;
    if (fn) {
      isAttach = fn(value);
    } else {
      isAttach = value;
    }

    if (isAttach && !element().el.parentNode) {
      parentNode.replaceChild(element().el, emptyNode);
    } else if (!isAttach && element().el.parentNode) {
      parentNode.replaceChild(emptyNode, element().el);
    }
  });
};
