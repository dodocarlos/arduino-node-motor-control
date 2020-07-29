import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import Layout from './pages/Layout';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
