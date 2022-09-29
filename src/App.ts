var dashboard = async () => {
  var index = (await import("./AppRouter")).default;
  let theApp = index({
    css: /* css */``
  })
  let gg = new theApp();
  // console.log("aaaaaaaaaaaaaaa :: ",gg.toHTML());
  // console.log("aaaaaaaaaaaaaaa :: ",gg.toCSS());
  return {
    css: gg.toCSS(),
    html: gg.toHTML(),
    gg
  }
}

dashboard().then((result) => {
  // console.log(result.html);
  // console.log(result.css);
});

