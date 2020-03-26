export const isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';

export const applyAttributes = (element, attributes) => {
  Object.keys(attributes).forEach((attribute) => {
    element.setAttribute(attribute, attributes[attribute]);
  });
};

export const applyEvents = (element, events) => {
  Object.keys(events).forEach((event) => {
    element.addEventListener(event, events[event]);
  });
};

export const removeEvents = (element, events) => {
  Object.keys(events).forEach((event) => {
    element.removeEventListener(event, events[event]);
  });
};

export const elementWrapper = (element, target) => {
  return {
    element,
    target,
    mount(target) {},
    update(props) {},
    destroy() {},
  };
};

export const defaultData = {
  tag: 'div',
  className: '',
  attributes: {},
  events: {},
  state: {},
  props: {},
  childrens: (state, props) => {
    return [];
  },
  bindings: (tree, state, bindings) => {
    return [];
  },
  onMount: (tree, state, props) => {},
  onUpdate: (tree, state, props, prevProps) => {},
  onDestroy: () => {},
};

export const appendChild = (target, child) => {
  if (typeof child === 'string') {
    const textNode = document.createTextNode(child);

    target().element.appendChild(textNode);
    return () => elementWrapper(textNode, target);
  }

  if (typeof child === 'function' && child().mount) {
    child().mount(target);
    return child;
  }

  target().element.appendChild(child);
  return () => elementWrapper(child, target);
};

export const appendChildrens = (component, childrens) => {
  return childrens.map((child) => {
    if (!child) {
      console.warn('children is not defined');
    }

    let wrapper;
    if (isObject(child)) {
      const childKey = Object.keys(child)[0];
      wrapper = appendChild(component, child[childKey]);
      component[childKey] = wrapper;
    } else {
      wrapper = appendChild(component, child);
    }

    return wrapper;
  });
};
