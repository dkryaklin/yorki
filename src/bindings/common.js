const common = (field, callback) => {
  callback(field().value());

  const callbackWrapper = field().subscribe(callback);

  return () => {
    return {
      destroy() {
        field().unsubscribe(callbackWrapper);
      },
    };
  };
};

export default common;
