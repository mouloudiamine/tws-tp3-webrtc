import React from 'react';
import Button from 'react-bootstrap/Button';
import {
  Col, Container, FormControl, InputGroup, Row,
} from 'react-bootstrap';
import SignalingConnection from './SignalingConnection';
import PeerConnection from './PeerConnection';
import Index from './Users';

class Remote extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startAvailable: true,
      callAvailable: true,
      hangupAvailable: false,
      userId: 0,
      userName: 'user',
      usersList: [],
    };

    // Refs
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();
    this.localStreamRef = React.createRef();
    this.usernameInput = React.createRef();
  }

  componentDidMount() {
    this.signalingConnection = new SignalingConnection({
      socketURL: window.location.host,
      onOpen: () => {
      },
      onMessage: this.onSignalingMessage,
    });
  }

  onSignalingMessage = (msg) => {
    // eslint-disable-next-line default-case
    switch (msg.type) {
      case 'id':
        this.setState({ userId: msg.id });
        console.log(`changed user id ${JSON.stringify(this.state)}`);
        break;
      case 'rejectusername':
        this.usernameInput.current.value = msg.name;
        this.setState({ userName: msg.name });
        break;
      case 'userlist':
        this.setState({ usersList: [...msg.users], userName: this.usernameInput.current.value });
        break;

      // Signaling messages: these messages are used to trade WebRTC
      // signaling information during negotiations leading up to a video
      // call.
      case 'connection-offer': // Invitation and offer to chat
        this.targetUsername = msg.name;
        this.createPeerConnection();
        this.peerConnection.connectionOffer(msg);
        break;

      case 'connection-answer': // Callee has answered our offer
        this.peerConnection.connectionAnswer(msg);
        break;

      case 'new-ice-candidate': // A new ICE candidate has been received
        this.peerConnection.newICECandidate(msg);
        break;

      case 'hang-up': // The other peer has hung up the call
        this.close();
        break;
    }
  };

  pushUsername = () => {
    this.signalingConnection.sendToServer({
      name: this.usernameInput.current.value,
      date: Date.now(),
      id: this.state.userId,
      type: 'username',
    });
  };


  start = () => {
    this.setState({ startAvailable: false });
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(this.gotStream)
      .catch((e) => {
        console.log(e);
        alert(`getUserMedia() error:${e.name}`);
      });
  };

  call = (user) => {
    // eslint-disable-next-line react/destructuring-assignment
    const username = this.state.userName;
    if (user === username) {
      return;
    }
    if (!this.localStreamRef.current) {
      alert('Veuillez activer la cam ');
      return;
    }
    this.targetUsername = user; // ref et non state
    this.createPeerConnection();
    this.peerConnection.offerConnection();
    this.setState({
      callAvailable: false,
      hangupAvailable: true,
    });
  };

  createPeerConnection = () => {
    if (this.peerConnection) return;
    this.peerConnection = new PeerConnection({
      gotRemoteStream: this.gotRemoteStream,
      gotRemoteTrack: this.gotRemoteTrack,
      signalingConnection: this.signalingConnection,
      onClose: this.closeVideoCall,
      localStream: this.localStreamRef.current,
      username: this.state.userName,
      targetUsername: this.targetUsername.value,
    });
  };

  gotStream = (stream) => {
    this.localVideoRef.current.srcObject = stream;
    this.setState({ callAvailable: true });
    this.localStreamRef.current = stream;
  };

  gotRemoteTrack = (event) => {
    const remoteVideo = this.remoteVideoRef.current;
    if (remoteVideo.srcObject !== event.streams[0]) {
      // eslint-disable-next-line prefer-destructuring
      remoteVideo.srcObject = event.streams[0];
    }
    this.setState({ hangupAvailable: true });
  };

  gotRemoteStream = (event) => {
    const remoteVideo = this.remoteVideoRef.current;
    if (remoteVideo.srcObject !== event.streams[0]) {
      // eslint-disable-next-line prefer-destructuring
      remoteVideo.srcObject = event.streams[0];
    }
  };

  close = () => {
    this.peerConnection.close();
    this.peerConnection = null;
    this.closeVideoCall();
  };

  closeVideoCall = () => {
    this.remoteVideoRef.current.srcObject
    && this.remoteVideoRef.current.srcObject
      .getTracks()
      .forEach((track) => track.stop());
    this.remoteVideoRef.current.src = null;

    // Mettre à jour l'état des boutons, et supprimer targetUsername.
    this.setState({
      callAvailable: true,
      hangupAvailable: false,
    });
    this.targetUsername = null;
  };

  render() {
    const userList = [];
    for (let i = 0; i < this.state.usersList.length; i += 1) {
      userList.push(
        <Index
          key={i}
          user={this.state.usersList[i]}
          callAvailable={this.state.callAvailable}
          callback={this.call}
        />,
      );
    }

    return (
      <Container fluid className="vh-100  skypeColor">
        <Row className="h-100 ">
          <Col xs={2} className="bg-white ">
            <Row>
              <Col>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Skype_logo_%282019%E2%80%93present%29.svg/1200px-Skype_logo_%282019%E2%80%93present%29.svg.png" alt="logo" width={100} height={100} />
                <InputGroup className="mb-3 mt-5" size="sm">
                  <FormControl
                    ref={this.usernameInput}
                    placeholder="Nom d'utilisateur"
                    aria-label="Username"
                    aria-describedby="basic-addon2"
                  />
                  <InputGroup.Append>
                    <Button
                      onClick={() => {
                        this.pushUsername();
                      }}
                      variant="danger"
                    >
                      <i className="material-icons">add</i>
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
            </Row>
            <Col>
              <h6 className="text-white-50">  </h6>
              {userList}
            </Col>
            <Row />
          </Col>
          <Col xs={10}>
            <Row className="vh-100">
              <Col>
                <Row className="h-75">
                  <Col xs={6}>
                    <video
                      className="w-100 mt-4"
                      ref={this.localVideoRef}
                      autoPlay
                      muted
                    />
                  </Col>
                  <Col xs={6}>
                    <video
                      className="w-100 mt-4"
                      ref={this.remoteVideoRef}
                      autoPlay
                    />
                  </Col>
                </Row>
                <Row className="h-25 align-content-center justify-content-center">
                  <Col className="text-center flex-row justify-content-center align-content-center">
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button
                      className="btn-floating waves-effect waves-light btn-large  green darken-1"
                      onClick={this.start}
                      disabled={!this.state.startAvailable}
                    >
                      <i className="material-icons">
                        videocam
                      </i>
                    </button>
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button
                      className=" ml-2 btn-floating waves-effect waves-light btn-large  deep-orange lighten-1"
                      onClick={this.close}
                      disabled={!this.state.hangupAvailable}
                    >
                      <i className="material-icons">
                        call_end
                      </i>
                    </button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Remote;
