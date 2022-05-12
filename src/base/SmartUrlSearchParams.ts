export default function (props) {
  for (let key in props) {
    if (props[key] == null) {
      delete props[key];
    }
  }
  let query = new URLSearchParams(props as any);
  return query;
}