var app = async () => {
  var index = (await import("./QueueRecordAppRouter")).default;
  let theApp = new index({
    css: /* css */``,
  })
  // let gg = new theApp();
  // console.log("aaaaaaaaaaaaaaa :: ",gg.toHTML());
  // console.log("aaaaaaaaaaaaaaa :: ",gg.toCSS());
  return {
    css: theApp.toCSS(),
    html: theApp.toHTML(),
    theApp
  }
}

app().then((result) => {
  // console.log(result.html);
  // console.log(result.css);
});

