var dashboard = async () => {
  var index = (await import("./dashboard/AppRouter")).default;
  let theApp = index({
    css: /* css */``
  })
  let gg = new theApp();
  return {
    css: gg.toCSS(),
    html: gg.toHTML(),
    gg
  }
}

dashboard().then((result) => {});

