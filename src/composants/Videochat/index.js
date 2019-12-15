import React from 'react';
// eslint-disable-next-line no-unused-vars
import {
  Button, ButtonGroup,
} from 'react-bootstrap';
import Local from './Local';
// eslint-disable-next-line import/named
import { Remote } from './Remote';


class Home extends React.Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    firstVisit: true,
    local: true,
  };

  render() {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <div>
        {/* eslint-disable-next-line no-nested-ternary,react/destructuring-assignment */}
        {this.state.firstVisit
          ? (
            <div>
              <div id="skype-logo">
                <span className="skype-s">S</span>
                <span className="skype-text">pyke</span>
              </div>
              {/* eslint-disable-next-line react/jsx-no-undef */}
              <ButtonGroup aria-label="Basic example ">
                <Button
                  onClick={() => this.setState({ firstVisit: false })}
                >
                  Version locale
                </Button>
                <Button
                  onClick={() => this.setState({ firstVisit: false, local: false })}
                >
                  Version remote
                </Button>
              </ButtonGroup>
            </div>
          )
          // eslint-disable-next-line react/destructuring-assignment
          : (this.state.local ? <Local /> : <Remote />)}
      </div>
    );
  }
}

export default Home;
