var app = async () => {
  var index = (await import("./WebhookAppRouter")).default;
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

