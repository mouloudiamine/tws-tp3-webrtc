import React from 'react';
import ReactDOM from 'react-dom';

// eslint-disable-next-line import/named
import { Videochat } from './composants/Videochat';

const Index = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Videochat />
);

// eslint-disable-next-line no-undef
ReactDOM.render(<Index />, document.getElementById('root'));
