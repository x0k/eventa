import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'

import { Provider } from 'react-redux'

import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'

import { store, history } from './store'

import App from './app'

import Converter from './app/converter'
import Schedule from './app/schedule'

ReactDOM.render(
  <Provider store={store}>
    <App>
      <ConnectedRouter history={history}>
        <Route exact path="/" component={Converter} />
        <Route path="/schedule" component={Schedule} />
      </ConnectedRouter>
    </App>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
