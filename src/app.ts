var dashboard = async () => {
  var index = (await import("./index")).default;
  index();
}
dashboard();


