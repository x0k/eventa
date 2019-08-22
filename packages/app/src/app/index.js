import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'

import { makeStyles } from '@material-ui/core/styles'

import Bar from './bar'
import Menu from './menu'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: '0 20px'
  }
}))

export default function App ({ children }) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Bar />
      <Menu />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  )
}
