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
      // eslint-disable-next-line no-undef
      const scheme = document.location.protocol === 'https:' ? 'wss' : 'ws';
      const serverUrl = `${scheme}://${this.socketURL}`;

      // eslint-disable-next-line no-undef
      this.connection = new WebSocket(serverUrl, 'json');
      this.connection.onopen = () => this.onOpen();

      this.connection.onmessage = (event) => {
        console.log(`ws: data received : ${event.data}`);
        const msg = JSON.parse(event.data);
        this.messageListeners.forEach((func) => func(msg));
      };

      this.connection.onerror = (err) => {
        console.error('ws: error : ', err);
      };
    };

    addMsgListener = (func) => {
      this.messageListeners = [...this.messageListeners, func];
      return () => {
        this.messageListeners = this.messageListeners.filter((f) => f !== func);
      };
    }
}


export default SignalingConnection;
