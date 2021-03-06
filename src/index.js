import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux';

import './css/main.css';

import mainReducer from './ducks';
import App from './components/App';
import listen from './listen';

const store = createStore(
  mainReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

render(
  <Provider store={store}>
    <App listen={listen} />
  </Provider>,
  document.getElementById('root')
);
