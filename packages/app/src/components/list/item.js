import React from 'react'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

export default function SimpleList ({ primary, secondary, onClick, selected, action }) {
  return (
    <ListItem button key={primary} onClick={onClick} selected={selected}>
      <ListItemText primary={primary} secondary={secondary} />
      {action && (
        <ListItemSecondaryAction>
          {action}
        </ListItemSecondaryAction>
      )}
    </ListItem>
  )
}
