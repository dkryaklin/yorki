export const state = (defaultState = {}) => {
  const innerState = {};
  const callbacks = {};
  const callbacksAsync = new Map();

  Object.keys(defaultState).forEach(field => {
    innerState[field] = defaultState[field];
    callbacks[field] = [];
  });

  const result = () => {
    return {
      set(newState) {
        Object.keys(newState).forEach(field => {
          if (!callbacks[field]) {
            console.warn("you are trying to set not inited field");
            return;
          }

          if (newState[field] === innerState[field]) {
            return;
          }

          innerState[field] = newState[field];

          callbacks[field].forEach(callback => {
            if (callbacksAsync.has(callback)) {
              const af = callbacksAsync.get(callback);
              cancelAnimationFrame(af);
            }

            callbacksAsync.set(
              callback,
              requestAnimationFrame(() => {
                if (callbacks[field].includes(callback)) {
                  callback(innerState);
                }
              })
            );
          });
        });
      },
      value() {
        return innerState;
      },
      subscribe(fields, callback) {
        if (!Array.isArray(fields)) {
          fields = [fields];
        }

        fields.forEach(field => {
          if (!callbacks[field]) {
            console.warn("you are trying to subscribe to not inited field");
            return;
          }

          callbacks[field].push(callback);
        });
      },
      destroy() {
        innerState = null;
        callbacks = null;

        callbacksAsync.forEach(af => {
          cancelAnimationFrame(af);
        });

        callbacksAsync = null;
      }
    };
  };

  Object.keys(defaultState).forEach(field => {
    result[field] = () => {
      return {
        value() {
          if (!callbacks[field]) {
            console.warn("you are trying to get value for not inited field");
            return;
          }

          return innerState[field];
        },
        subscribe: callback => {
          const callbackWrapper = () => callback(innerState[field]);
          result().subscribe(field, callbackWrapper);

          return callbackWrapper;
        },
        unsubscribe: callbackWrapper => {
          const index = callbacks[field].indexOf(callbackWrapper);
          if (index !== -1) {
            callbacks[field][index] = null;
          }
        },
        set: newValue => {
          result().set({ [field]: newValue });
        }
      };
    };
  });

  return result;
};
