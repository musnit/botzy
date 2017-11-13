import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux';

import './css/main.css';
import reducer from './ducks';

const App = require('./components/App');
const listen = require('./listen');

let store = createStore(reducer)

window.globalState = {};
window.globalPairs = {};

listen(window.globalState, window.globalPairs);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
