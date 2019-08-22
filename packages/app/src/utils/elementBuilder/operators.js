import React from 'react'

import { Typography, ListItemText, ListItemSecondaryAction } from '@material-ui/core'

const ELEMENTS = {
  Typography,
  ListItemText,
  ListItemSecondaryAction
}

export const operators = {
  extract (template, dictionary) {
    const regexp = /%(.+?)\b/g
    let str = template
    let result = regexp.exec(str)
    while (result) {
      const [match, name] = result
      str = str.replace(match, dictionary[name])
      result = regexp.exec(str)
    }
    return str
  },
  element (name, ...props) {
    const Element = ELEMENTS[name]
    const data = Object.assign({}, ...props)
    return React.createElement(Element, data)
  },
  property (name, value, base = {}) {
    return { ...base, [name]: value }
  },
  compose (...args) {
    const len = args.length
    const last = args[len - 1]
    return args.slice(0, len - 1).map(handler => handler(last))
  },
  flat (action, defaultArgs, ...args) {
    return action(...defaultArgs, ...args)
  }
}
