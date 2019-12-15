import React from 'react';
import {
  Col, Row,
} from 'react-bootstrap';

class Local extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startAvailable: true,
      callAvailable: false,
      hangupAvailable: false,
    };
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();
    this.localStreamRef = React.createRef();
    this.client1Ref = React.createRef();
    this.client2Ref = React.createRef();
    this.gotRemoteStream = React.createRef();

    this.start = this.start.bind(this);
    this.call = this.call.bind(this);
    this.gotStream = this.gotStream.bind(this);
    this.onCreateOfferSuccess = this.onCreateOfferSuccess.bind(this);
    this.onCreateAnswerSuccess = this.onCreateAnswerSuccess.bind(this);
    this.onIceCandidate = this.onIceCandidate.bind(this);
    this.hangUp = this.hangUp.bind(this);
  }

  // eslint-disable-next-line react/sort-comp
  start() {
    this.setState({ startAvailable: false });
    // eslint-disable-next-line no-undef
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(this.gotStream)
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e);
      });
  }

  gotStream(stream) {
    this.localVideoRef.current.srcObject = stream;
    // On fait en sorte d'activer le bouton permettant de commencer un appel
    this.setState({ callAvailable: true });
    this.localStreamRef.current = stream;
  }

  gotRemoteStream(event) {
    // eslint-disable-next-line prefer-destructuring
    this.remoteVideoRef.current.srcObject = event.streams[0];
  }

  call() {
    this.setState({ callAvailable: false });
    this.setState({ hangupAvailable: true });

    // eslint-disable-next-line no-undef
    this.client1Ref.current = new RTCPeerConnection();
    // eslint-disable-next-line no-undef
    this.client2Ref.current = new RTCPeerConnection();

    this.client1Ref.current.onicecandidate = (e) => this.onIceCandidate(this.client1Ref.current, e);

    this.client1Ref.current.oniceconnectionstatechange = (e) => {
      console.log('Connexion request');
      // eslint-disable-next-line no-undef
      onIceStateChange(this.client1Ref.current, e);
    };

    this.client2Ref.current.onicecandidate = (e) => this.onIceCandidate(this.client2Ref.current, e);
    // eslint-disable-next-line no-undef,max-len
    this.client2Ref.current.oniceconnectionstatechange = (e) => onIceStateChange(this.client2Ref.current, e);
    // eslint-disable-next-line max-len,prefer-destructuring
    this.client2Ref.current.ontrack = (e) => { this.remoteVideoRef.current.srcObject = e.streams[0]; };

    this.localStreamRef.current
      .getTracks()
      .forEach((track) => this.client1Ref.current.addTrack(track, this.localStreamRef.current));

    this.client1Ref.current.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
    })
      .then(this.onCreateOfferSuccess, (error) => console.error(
        'Failed to create session description',
        error.toString(),
      ));
  }

  onCreateOfferSuccess(desc) {
    this.client1Ref.current.setLocalDescription(desc).then(() => console.log('client1 setLocalDescription complete createOffer'),
      (error) => console.error(
        'client1 Failed to set session description in createOffer',
        error.toString(),
      ));

    this.client2Ref.current.setRemoteDescription(desc).then(() => {
      console.log('client2 setRemoteDescription complete createOffer');
      this.client2Ref.current.createAnswer()
        .then(this.onCreateAnswerSuccess, (error) => console.error(
          'client2 Failed to set session description in createAnswer',
          error.toString(),
        ));
    },
    (error) => console.error(
      'client2 Failed to set session description in createOffer',
      error.toString(),
    ));
  }

  onCreateAnswerSuccess(desc) {
    this.client1Ref.current.setRemoteDescription(desc)
      .then(() => console.log('client1 setRemoteDescription complete createAnswer'),
        (error) => console.error(
          'client1 Failed to set session description in onCreateAnswer',
          error.toString(),
        ));

    this.client2Ref.current.setLocalDescription(desc)
      .then(() => console.log('client2 setLocalDescription complete createAnswer'),
        (error) => console.error(
          'client2 Failed to set session description in onCreateAnswer',
          error.toString(),
        ));
  }

  onIceCandidate(pc, event) {
    console.log(`${pc}!!!!pc`);
    const otherPc = pc === this.client1Ref ? this.client2Ref.current : this.client1Ref.current;

    otherPc
      .addIceCandidate(event.candidate)
      .then(
        () => console.log('addIceCandidate success'),
        (error) => console.error(
          'failed to add ICE Candidate',
          error.toString(),
        ),
      );
  }

  hangUp() {
    this.client1Ref.current.close();
    this.client2Ref.current.close();

    this.client1Ref.current = null;
    this.client2Ref.current = null;

    this.setState({ hangupAvailable: false });
    this.setState({ callAvailable: true });
  }

  render() {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <Row className="vh-100 ">
        <Col>
          <Row className="h-75">
            <Col xs={6}>
              <video
                className="w-100  mt-4 container"
                ref={this.localVideoRef}
                autoPlay
                muted
              />
            </Col>
            <Col xs={6}>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                className="w-100 mt-4 container"
                ref={this.remoteVideoRef}
                autoPlay
              />
            </Col>
          </Row>
          <Row className="h-25 align-content-center justify-content-center">
            <Col className="text-center flex-row justify-content-center align-content-center">
              {/* eslint-disable-next-line react/button-has-type */}
              <button
                className="btn-floating  grey darken-3"
                onClick={this.start}
                disabled={!this.state.startAvailable}
              >
                <i className="material-icons">
                    videocam
                </i>
              </button>
              {/* eslint-disable-next-line react/button-has-type */}
              <button
                className="btn-floating  green darken-2"
                onClick={this.call}
                disabled={!this.state.callAvailable}
              >
                <i className="material-icons">
                    call
                </i>
              </button>
              {/* eslint-disable-next-line react/button-has-type */}
              <button
                className="btn-floating  deep-orange lighten-1"
                onClick={this.hangUp}
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
    );
  }
}

export default Local;
