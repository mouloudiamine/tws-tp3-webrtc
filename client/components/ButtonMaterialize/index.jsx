import React from 'react';
import ReactDOM from 'react-dom';
import 'materialize-css/dist/css/materialize.css'

export default class ButtonMaterialize extends React.Component {
    render() {
        return <div className="container">
            <h6> Intégration du framework "Materialize" pour améliorer le rendu</h6>
            <hr/>
            <a href="https://materializecss.com" className="waves-effect waves-light btn  center-align blue"><i
                className="material-icons left">cloud</i>Ceci est un button du framework Materialize</a>
        </div>
    }
}
