import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter, BrowserRouter } from 'react-router-dom'
import { store } from './_helpers';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// setup fake backend
import { configureFakeBackend } from './_helpers';
// configureFakeBackend();

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
