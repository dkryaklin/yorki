const portalCache = new Map();

export const portal = (target, component) => {
  const componentEl = component().el;

  if (!componentEl) {
    console.error(
      "Passed component into yorki portal is not yorki tag component"
    );
    return;
  }

  const portalId = Math.round(Math.random() * 10 ** 10) + Date.now();

  portalCache.set(portalId, { target, component });
  target.appendChild(componentEl);

  return portalId;
};

export const destroy = portalId => {
  if (!portalCache.has(portalId)) {
    return;
  }

  const { target, component } = portalCache.get(portalId);

  target.removeChild(component().el);
  component().destroy();

  portalCache.delete(portalId);
};
