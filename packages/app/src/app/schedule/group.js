import React from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { headerPartitionToString, periodToString } from '../../utils/grouper'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto'
  },
  day: {
    margin: 20
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0
  }
}))

export default function Group ({
  partition,
  start,
  items,
  builder
}) {
  const classes = useStyles()
  const date = new Date(start)
  return (
    <div>
      <Typography variant="h6" className={classes.day}>{headerPartitionToString(partition, date)}</Typography>
      <List className={classes.root} subheader={<li />}>
        <li className={classes.listSection}>
          {items.map(({ period, value }, itemId) => (
            <ul className={classes.ul} key={itemId}>
              <ListSubheader>{periodToString(partition, period)}</ListSubheader>
              <ListItem key={`item-${itemId}`}>
                {builder(value)}
              </ListItem>
            </ul>
          ))}
        </li>
      </List>
    </div>
  )
}
