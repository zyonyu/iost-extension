import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import App from './containers/App';
import style from './style.less'

import store from "./stores";

ReactDOM.render(
  <Provider rootStore={store}>
    <App />
  </Provider>, 
  document.getElementById('root')
)