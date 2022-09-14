const GetQueryUrl = (pathUrl = window.location.search) => {
  const urlSearchParams = new URLSearchParams(pathUrl);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params;
}

export default GetQueryUrl;