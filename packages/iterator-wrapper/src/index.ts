export type TWrapper<T, R> = (value: T) => IterableIterator<R>

export type TPredicate<T> = (value: T) => boolean

export function * wrapIterable<T, V, R> (
  iterable: IterableIterator<T>,
  wrapper: TWrapper<V, R>,
  initialState: V,
  merge?: (state: V, item: T) => V
) {
  let state = initialState
  for (const item of iterable) {
    state = yield * wrapper(merge ? merge(state, item) : Object.assign(state, item))
  }
}

export function * restrictIterable<T> (
  iterable: IterableIterator<T>,
  predicate: TPredicate<T>,
) {
  let item = iterable.next()
  while (!item.done && predicate(item.value)) {
    yield item.value
    item = iterable.next()
  }
  return item.value
}

export function * mapIterable<T, R> (
  iterable: IterableIterator<T>,
  callback: (value: T) => R
) {
  let item = iterable.next()
  while (!item.done) {
    yield callback(item.value)
    item = iterable.next()
  }
  return callback(item.value)
}

export function * filterIterable<T> (
  iterable: IterableIterator<T>,
  predicate: TPredicate<T>,
) {
  let item = iterable.next()
  while (!item.done) {
    const { value } =item
    if (predicate(value)) {
      yield value
    }
    item = iterable.next()
  }
  return item.value
}

export function * reduceIterable<T, R> (
  iterable: IterableIterator<T>,
  separator: (previous: R, current: T, index: number) => boolean,
  reducer: (previous: R, current: T, index: number) => R,
  initialValue: R
) {
  let item = iterable.next()
  let accumulator = initialValue
  let index = 0
  while (!item.done) {
    const { value } = item
    if (separator(accumulator, value, index)) {
      accumulator = reducer(accumulator, value, index)
    } else {
      yield accumulator
      accumulator = reducer(initialValue, value, index)
    }
    index++
    item = iterable.next()
  }
  yield accumulator
}