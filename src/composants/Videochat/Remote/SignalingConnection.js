class SignalingConnection {
  connection = null;

  messageListeners = [];

  constructor({
    socketURL,
    onOpen,
    onMessage,
  }) {
    this.socketURL = socketURL;
    this.onOpen = onOpen;
    this.messageListeners = [onMessage];
    this.connectToSocket();
  }

  sendToServer = (msg) => {
    const msgJSON = JSON.stringify(msg);
    this.connection.send(msgJSON);
  };

  connectToSocket = () => {
    let scheme;
    // eslint-disable-next-line no-undef
    if (document.location.protocol === 'https:') {
      scheme = 'wss:';
    } else {
      scheme = 'ws';
    }
    const serverUrl = `${scheme}://${this.socketURL}`;

    // eslint-disable-next-line no-undef
    this.connection = new WebSocket(serverUrl, 'json');
    this.connection.onopen = () => this.onOpen();

    this.connection.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      this.messageListeners.forEach((func) => func(msg));
    };

    this.connection.onerror = (err) => {
      console.error('ws: error : ', err);
    };
  };
}


export default SignalingConnection;
