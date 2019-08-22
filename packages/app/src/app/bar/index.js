import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AppBar from '../../components/appBar'

import { setDrawer, open } from '../../store/application'

import { drawerWidth } from '../../constants'
import PATHS, { PATHS_DICTIONARY } from '../../constants/paths'

const useStyle = makeStyles(theme => ({
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  title: {
    flexGrow: 1
  }
}))

function Bar ({ drawerOpen, setDrawer, open, schedule, schedules, path }) {
  const classes = useStyle()
  const title = PATHS_DICTIONARY[path] || (schedules[schedule] ? schedules[schedule].name : '404')
  return (
    <AppBar className={classes.appBar}>
      <IconButton
        color="inherit"
        aria-label="Open drawer"
        edge="start"
        onClick={() => setDrawer(!drawerOpen)}
        className={classes.menuButton}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" className={classes.title} noWrap>
        {title}
      </Typography>
      {PATHS.map(path => PATHS_DICTIONARY[path] !== title && (
        <Button color="inherit" key={path} onClick={() => open(path)} >{PATHS_DICTIONARY[path]}</Button>)
      )}
    </AppBar>
  )
}

function mapStateToProps ({ application, schedules, router: { location: { pathname: path } } }) {
  return { ...application, schedules, path }
}

function mapDispatchToProps (dispatch) {
  return {
    setDrawer: bindActionCreators(setDrawer, dispatch),
    open: bindActionCreators(open, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
