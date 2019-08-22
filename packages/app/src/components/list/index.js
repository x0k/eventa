import React from 'react'

import List from '@material-ui/core/List'

import Item from './item'

export default function SimpleList ({ className, items, onClick, selected }) {
  return (
    <List component="nav" className={className}>
      {items.map((props, i) => (
        <Item {...props}
          selected={i === selected}
          onClick={() => onClick(props, i)}
          key={i} />
      ))}
    </List>
  )
}
