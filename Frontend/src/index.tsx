import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";
import Global from "./Styles/Global";

ReactDOM.render(
  <React.StrictMode>
    <Global />
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
