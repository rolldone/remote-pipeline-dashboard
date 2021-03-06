export interface WebSocketCreatedInterface {
  webSocket: WebSocket
  key: string
}
export default function (key): Promise<WebSocketCreatedInterface> {
  // Connect websocket
  return new Promise((resolve: Function) => {
    let wsProtocol = 'ws';
    switch (window.location.protocol) {
      case 'https:':
        wsProtocol = 'wss'
        break;
      case 'http:':
        break;
    }
    let webSocket = new WebSocket(`${wsProtocol}://${window.location.host}`);
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