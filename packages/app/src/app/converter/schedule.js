import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { convert } from 'eventa'

import { addSchedule } from '../../store/schedules'

import { dateTimePeriod } from '../../utils/dateTime'

import { download } from '../../utils/files'

const useStyles = makeStyles({
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
})

const SCHEDULE = 'schedule'

const CALCULATED = 'calculated'

function getActions (type, schedule, onConvert, addSchedule, schedules) {
  const { fields, element } = schedule
  switch (type) {
    case SCHEDULE:
      return [ <Button onClick={() => onConvert({ ...convert(schedule), fields, element })} key="convertAction" >Конвертировать</Button> ]
    case CALCULATED:
      return [
        <Button onClick={() => addSchedule(schedule)} key="addAction" disabled={schedules.some(({ name }) => name === schedule.name)}>Добавить</Button>,
        <Button onClick={() => download(`${schedule.name}_converted.json`, schedule)} key="downloadAction" >Скачать</Button>
      ]
  }
}

function ScheduleDescription ({
  className,
  schedules,
  schedule,
  onConvert,
  addSchedule
}) {
  const classes = useStyles()
  const { name, events, period } = schedule
  const type = events ? SCHEDULE : CALCULATED
  return (
    <Card className={className}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {dateTimePeriod(period)}
        </Typography>
      </CardContent>
      <CardActions>
        {getActions(type, schedule, onConvert, addSchedule, schedules)}
      </CardActions>
    </Card>
  )
}

function mapStateToProps ({ schedules }) {
  return { schedules }
}

function mapDispatchToProps (dispatch) {
  return {
    addSchedule: bindActionCreators(addSchedule, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleDescription)
