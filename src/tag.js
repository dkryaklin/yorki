const isObject = obj =>
  Object.prototype.toString.call(obj) === "[object Object]";

const applyAttributes = (el, attrs = {}) => {
  if (isObject(attrs)) {
    Object.keys(attrs).forEach(attrKey => {
      if (typeof attrs[attrKey] !== "function") {
        el.setAttribute(attrKey, attrs[attrKey]);
      }
    });

    return;
  }

  el.setAttribute("class", attrs);
};

const applyEvents = (el, events = {}) => {
  if (!isObject(events)) {
    return;
  }

  Object.keys(events).forEach(eventKey => {
    if (typeof events[eventKey] === "function") {
      el.addEventListener(eventKey, events[eventKey]);
    }
  });
};

const removeEvents = (el, events = {}) => {
  if (!isObject(events)) {
    return;
  }

  Object.keys(events).forEach(eventKey => {
    if (typeof events[eventKey] === "function") {
      el.removeEventListener(eventKey, events[eventKey]);
    }
  });
};

const appendChild = (element, child) => {
  if (typeof child === "string") {
    const textNode = document.createTextNode(child);

    element().el.appendChild(textNode);
    return () => ({ el: textNode, parent: element, destroy() {} });
  }

  if (typeof child === "function" && child().el) {
    element().el.appendChild(child().el);
    child().parent = element;
    return child;
  }

  element().el.appendChild(child);
  return () => ({ el: child, parent: element, destroy() {} });
};

export const tag = (tag, attrs, childrens = [], hooks = {}) => {
  if (!Array.isArray(childrens)) {
    childrens = [childrens];
  }

  let el = document.createElement(tag);

  let bindingsToDestroy = [];

  applyAttributes(el, attrs);
  applyEvents(el, attrs);

  let treeObj = {
    el,
    bind(bindings = []) {
      if (!Array.isArray(bindings)) {
        bindingsToDestroy.push(bindings);
      } else {
        bindingsToDestroy.push(...bindings);
      }
    },
    update(newProps) {
      hooks.onUpdate && hooks.onUpdate(newProps);
    },
    destroy() {
      removeEvents();

      bindingsToDestroy.forEach(binding => {
        binding();
      });

      childrens.forEach(child => {
        if (isObject(child)) {
          const childKey = Object.keys(child)[0];
          tree[childKey]().destroy();
        } else if (typeof child === "function" && child().el) {
          child().destroy();
        }
      });

      hooks.onDestroy && hooks.onDestroy();

      el = null;
      tree = null;
    }
  };

  let tree = () => treeObj;

  childrens.forEach(child => {
    if (!child) {
      console.warn("children is not defined");
    }

    if (isObject(child)) {
      const childKey = Object.keys(child)[0];
      tree[childKey] = appendChild(tree, child[childKey]);
    } else {
      appendChild(tree, child);
    }
  });

  return tree;
};
