import { Col, FormControl, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import React from 'react';

// eslint-disable-next-line react/prefer-stateless-function
class Users extends React.Component {
  render() {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <InputGroup className="mb-3" size="sm">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Skype_logo_%282019%E2%80%93present%29.svg/1200px-Skype_logo_%282019%E2%80%93present%29.svg.png" alt="logo" width={40} height={40} />
        <FormControl
          plaintext
          readOnly

          defaultValue={this.props.user === null ? '' : this.props.user}
        />
        <InputGroup.Append>
          <Button
            onClick={() => { this.props.callback(this.props.user); }}
            disabled={!this.props.callAvailable}
            variant="success"
          >
            <i className="material-icons">
              call
            </i>
          </Button>
        </InputGroup.Append>
      </InputGroup>
    );
  }
}

export default Users;
