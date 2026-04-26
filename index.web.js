import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

var rootElement = document.getElementById('root');
if (rootElement) {
  var root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
}
