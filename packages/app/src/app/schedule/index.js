import React, { useEffect } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { open } from '../../store/application'

import Schedule from './schedule'

function ScheduleWrapper ({ schedule, open }) {
  useEffect(() => {
    if (!schedule) {
      open('/')
    }
  })
  if (!schedule) {
    return null
  }
  return (
    <Schedule schedule={schedule} />
  )
}

function mapStateToProps ({ schedules, application: { schedule: index } }) {
  return { schedule: schedules[index] }
}

function mapDispatchToProps (dispatch) {
  return {
    open: bindActionCreators(open, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleWrapper)
