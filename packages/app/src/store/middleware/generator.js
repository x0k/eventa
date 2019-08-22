async function resolve (store, iterable, next) {
  const { done, value } = await iterable.next(store)
  if (!done) {
    next(value)
    return resolve(store, iterable, next)
  }
  return value
}

export default store => next => action => {
  if (Symbol.asyncIterator in action) {
    return resolve(store, action, next)
  }
  return next(action)
}
