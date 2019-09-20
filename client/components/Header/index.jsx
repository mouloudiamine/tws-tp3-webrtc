import React from 'react';
import ReactDOM from 'react-dom';
import LOGO from "../../assert/logo.jpg";

export default class Content extends React.Component{
    render() {
        return (<img width={260} src={LOGO} alt="Logo" />)
    }
}
