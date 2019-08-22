export function createAction (type) {
  return (payload) => ({ type, payload })
}

export function createReducer (reducers, defaultState = {}) {
  return (state, action) => {
    const { type } = action
    const reducer = reducers[type]
    if (reducer) {
      return reducer(state, action)
    }
    return state || defaultState
  }
}
