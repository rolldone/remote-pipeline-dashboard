const SmartUrlSearchParams = function (props) {
  for (let key in props) {
    if (props[key] == null) {
      delete props[key];
    }
  }
  let query = new URLSearchParams(props as any);
  return query;
}

export default SmartUrlSearchParams;