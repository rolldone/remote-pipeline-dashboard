var app = async () => {
  var index = (await import("./variable/VariableAppRouter")).default;
  let theApp = new index({
    css: /* css */``,
  })
  return {
    css: theApp.toCSS(),
    html: theApp.toHTML(),
    theApp
  }
}

app().then((result) => {});

