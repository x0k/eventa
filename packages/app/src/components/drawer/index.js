import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import { makeStyles } from '@material-ui/core'

import { drawerWidth } from '../../constants'

const useStyles = makeStyles({
  drawerPaper: {
    width: drawerWidth
  }
})

export default function ResponsiveDrawer ({ className, children, mobileOpen, onClose }) {
  const classes = useStyles()
  const paper = { paper: classes.drawerPaper }
  return (
    <nav className={className}>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={onClose}
          classes={paper}
          ModalProps={{ keepMounted: true }}
        >
          {children}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          classes={paper}
          variant="permanent"
          open
        >
          {children}
        </Drawer>
      </Hidden>
    </nav>
  )
}
