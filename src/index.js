import React from 'react';
import ReactDOM from 'react-dom';
import Home from './composants/Videochat';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assert/monstyle.css';

const Index = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Home />
);

// eslint-disable-next-line no-undef
ReactDOM.render(<Index />, document.getElementById('root'));
