import React from 'react';
import ReactDOM from 'react-dom';
import 'materialize-css/dist/css/materialize.css'
import LOGO from "../../assert/logo.jpg";

export default class Content extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col m4">
                        <h1>Lyon</h1>
                    </div>
                    <div className="col m8">
                        <img width={"400"} src={LOGO} alt="Logo"/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className=" col m12">
                        Lyon, ville française de la région historique Rhône-Alpes, se trouve à la jonction du Rhône et
                        de la Saône. Son centre témoigne de 2 000 ans d'histoire, avec son amphithéâtre romain des Trois
                        Gaules, l'architecture médiévale et Renaissance du Vieux Lyon et la modernité du quartier de la
                        Confluence sur la Presqu'île. Les Traboules, passages couverts entre les immeubles, relient le
                        Vieux Lyon à la colline de La Croix-Rousse.
                    </div>
                </div>
            </div>
        )
    }
}
