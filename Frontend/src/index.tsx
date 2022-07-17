import React from 'react';
import { createRoot } from 'react-dom/client';
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
  
);
