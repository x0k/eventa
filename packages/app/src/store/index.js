import { createBrowserHistory } from 'history'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import { routerMiddleware, connectRouter } from 'connected-react-router'
import { createLogger } from 'redux-logger'

import generator from './middleware/generator'

import application from './application'

import schedules from './schedules'

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
})

const loggerMiddleware = createLogger()

const initialState = {
  application: {
    drawerOpen: false,
    schedule: -1
  },
  schedules: []
}

const reducer = combineReducers({
  application,
  schedules,
  router: connectRouter(history)
})

const middleware = [generator, routerMiddleware(history)]

if (process.env.NODE_ENV === 'development') {
  middleware.push(loggerMiddleware)
}

export const store = createStore(
  reducer,
  initialState,
  applyMiddleware(...middleware)
)
