export default function (key): Promise<{
  webSocket: WebSocket
  key: string
}> {
  // Connect websocket
  return new Promise((resolve: Function) => {
    let webSocket = new WebSocket("ws://" + window.location.host);
    webSocket.onopen = function (event) {
      window.websocket = webSocket;
      webSocket.send(JSON.stringify({
        action: "join",
        return: {
          key: key// (Math.random() + 1).toString(36).substring(7)
        }
      }))
      resolve({
        webSocket,
        key
      })
    };
  })
}