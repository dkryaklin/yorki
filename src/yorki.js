import YorkiState from './state';
import { applyAttributes, applyEvents, removeEvents, elementWrapper, appendChildrens, defaultData } from './utils';
import { bindClassName, bindAttribute, bindStyle, bindAttached, bindChildrens } from './bindings';

const BINDINGS = {
  bindClassName,
  bindAttribute,
  bindStyle,
  bindAttached,
  bindChildrens,
};

const Yorki = (data) => {
  data = { ...defaultData, ...data };

  const state = YorkiState(data.state);

  let props = data.props;
  let prevProps;

  const element = document.createElement(data.tag);
  element.className = data.className;

  let childrens = data.childrens(state, props);

  const wrapper = elementWrapper(element);
  const tree = () => wrapper;

  applyAttributes(element, data.attributes);

  const events = {};
  Object.keys(data.events).forEach((event) => {
    events[event] = (ev) => {
      data.events[event](ev, tree, state, props);
    };
  });
  applyEvents(element, events);

  childrens = appendChildrens(tree, childrens);
  const bindings = data.bindings(tree, state, BINDINGS);

  wrapper.mount = (target) => {
    wrapper.target = target;
    target().element.appendChild(element);

    data.onMount(tree, state, props);
  };

  wrapper.update = (newProps) => {
    prevProps = props;
    props = newProps;

    data.onUpdate(tree, state, newProps, prevProps);
  };

  wrapper.destroy = () => {
    removeEvents(element, events);

    bindings.forEach((binding) => binding.destroy());
    childrens.forEach((children) => children().destroy());

    state().destroy();
    data.onDestroy();

    wrapper.target().element.removeChild(element);
  };

  return tree;
};

Yorki.portalCache = new Map();

Yorki.portal = (target, component) => {
  const portalId = Math.round(Math.random() * 10 ** 10) + Date.now();

  Yorki.portalCache.set(portalId, component);
  component().mount(() => elementWrapper(target));

  return portalId;
};

Yorki.destroy = (portalId) => {
  if (!Yorki.portalCache.has(portalId)) {
    return;
  }

  const component = Yorki.portalCache.get(portalId);
  component().destroy();

  Yorki.portalCache.delete(portalId);
};

Yorki.state = YorkiState;

export default Yorki;
