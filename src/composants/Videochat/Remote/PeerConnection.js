class PeerConnection {
  constructor({
    gotRemoteTrack,
    signalingConnection,
    onClose,
    localStream,
    username,
    targetUsername,
    dataChannelLabel,
  }) {
    this.signalingConnection = signalingConnection;
    this.onClose = onClose;
    this.localStream = localStream;
    this.username = username;
    this.targetUsername = targetUsername;
    this.dataChannelLabel = dataChannelLabel;

    // eslint-disable-next-line no-undef
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          url: 'turn:numb.viagenie.ca',
          credential: 'jojolasurpise',
          username: '696upjj@mail3plus.net',
        },
      ],
    });
    this.peerConnection.onicecandidate = this.handleICECandidateEvent;
    this.peerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
    this.peerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
    this.peerConnection.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
    // this.peerConnection.onnegotiationneeded = this.offerConnection;
    this.peerConnection.ontrack = gotRemoteTrack;

    if (this.localStream) {
      // eslint-disable-next-line no-restricted-syntax
      for (const track of this.localStream.getTracks()) {
        // this.peerConnection.addTransceiver(track, {streams:[this.localStream]});
        this.peerConnection.addTrack(track, this.localStream);
      }
    }
    // eslint-disable-next-line no-console
    console.log('peerconnection created', this.peerConnection);
    this.handleICECandidateEvent = this.handleICECandidateEvent.bind(this);
    this.handleICEConnectionStateChangeEvent = this.handleICEConnectionStateChangeEvent.bind(this);
    this.handleSignalingStateChangeEvent = this.handleSignalingStateChangeEvent.bind(this);
    this.handleICEGatheringStateChangeEvent = this.handleICEGatheringStateChangeEvent.bind(this);
    this.offerConnection = this.offerConnection.bind(this);
    this.connectionOffer = this.connectionOffer.bind(this);
    this.connectionAnswer = this.connectionAnswer.bind(this);
    this.newICECandidate = this.newICECandidate.bind(this);
    this.onDataChannelMessage = this.onDataChannelMessage.bind(this);
    this.close = this.close.bind(this);
  }

  handleICECandidateEvent(event) {
    if (event.candidate) {
      this.signalingConnection.sendToServer({
        type: 'new-ice-candidate',
        target: this.targetUsername,
        candidate: event.candidate,
      });
    }
  }

  handleICEConnectionStateChangeEvent(event) {
    console.log(`ICE state : ${event}`);

    // eslint-disable-next-line default-case
    switch (this.peerConnection.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        this.close();
    }
  }

  handleSignalingStateChangeEvent() {
    // eslint-disable-next-line default-case
    if (this.peerConnection.signalingState === 'closed') { this.close(); }
  }

  // eslint-disable-next-line class-methods-use-this
  handleICEGatheringStateChangeEvent() {

  }

  offerConnection() {
    const { username, targetUsername } = this;

    console.log('creating offer');
    this.peerConnection
      .createOffer()
      .then((offer) => {
        console.log('attempting local description', offer);
        console.log('state', this.peerConnection.signalingState);

        return this.peerConnection.setLocalDescription(offer);
      })
      .then(() => {
        console.log(
          'Sending offer to',
          targetUsername,
          'from',
          username,
        );
        this.signalingConnection.sendToServer({
          name: username,
          target: targetUsername,
          type: 'connection-offer',
          sdp: this.peerConnection.localDescription,
        });
      })
      .catch((err) => {
        console.log('Error in handleNegotiationNeededEvent');
        console.error(err);
      });
  }

  connectionOffer({ sdp }) {
    const { username, targetUsername } = this;

    this.peerConnection
      // eslint-disable-next-line no-undef
      .setRemoteDescription(new RTCSessionDescription(sdp))
      .then(() => this.peerConnection.createAnswer())
      .then((answer) => this.peerConnection.setLocalDescription(answer))
      .then(() => {
        this.signalingConnection.sendToServer({
          name: username,
          target: targetUsername,
          type: 'connection-answer',
          sdp: this.peerConnection.localDescription,
        });
      })
      .catch((err) => {
        console.log('Error in connectionOffer');
        console.error(err);
      });
  }

  connectionAnswer({ sdp }) {
    this.peerConnection
      // eslint-disable-next-line no-undef
      .setRemoteDescription(new RTCSessionDescription(sdp))
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('Error in connectionAnswer');
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }

  newICECandidate({ candidate }) {
    // eslint-disable-next-line no-console
    console.log(`the candidate ${JSON.stringify(candidate)}`);

    // eslint-disable-next-line no-undef
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      .then((r) => console.log(`ice condidate succeed ${r}`))
      .catch((err) => console.log(`ice condidate error ${err}`));
  }

  // eslint-disable-next-line class-methods-use-this
  onDataChannelMessage(msg) {
    console.log('Data channel message received', msg);
  }

  close() {
    const { username, targetUsername } = this;

    this.signalingConnection.sendToServer({
      name: username,
      target: targetUsername,
      type: 'hang-up',
    });
    this.peerConnection.close();
    this.peerConnection = null;

    this.onClose();
  }
}

export default PeerConnection;
