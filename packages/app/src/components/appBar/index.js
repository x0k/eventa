import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

export default function FixedBar ({ children, className }) {
  return (
    <AppBar position="fixed" className={className}>
      <Toolbar>
        {children}
      </Toolbar>
    </AppBar>
  )
}
