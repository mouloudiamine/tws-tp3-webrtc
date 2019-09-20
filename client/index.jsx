import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header/index.jsx';
import Content from './components/Content/index.jsx';
import ButtonMaterialize from './components/ButtonMaterialize/index.jsx';

const Index = () => {

    return (
        <div className="container">
            <Header/>
            <Content/>
            <ButtonMaterialize/>
        </div>
    );
};
ReactDOM.render(<Index/>, document.getElementById('root'));