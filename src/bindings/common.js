const common = (field, callback) => {
  callback(field().value());

  const callbackWrapper = field().subscribe(callback);

  return () => {
    field().unsubscribe(callbackWrapper);
  };
};

export default common;
