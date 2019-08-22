import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import ScheduleCard from './schedule'

import { readFile, upload } from '../../utils/files'

import demoSchedule from '../../assets/schedule.json'

function read ({ path: [{ files: [ file ] }] }) {
  return readFile(file)
}

function parse ({ target: { result } }) {
  return JSON.parse(result)
}

const useStyles = makeStyles({
  line: {
    margin: '20px 0'
  }
})

export default function Converter () {
  const classes = useStyles()
  const [schedules, setSchedules] = useState([])
  const addSchedule = schedule => setSchedules(schedules.concat(schedule))
  const onConvert = (index) => (converted) => setSchedules(schedules.map((schedule, i) => i === index ? converted : schedule))
  const clickHandler = () => upload()
    .then(read)
    .then(parse)
    .then(addSchedule)
  const demoHandler = () => addSchedule(demoSchedule)
  return (
    <div>
      <div className={classes.line}>
        <Button onClick={demoHandler}>Демонстрационное расписание</Button>
        <Button onClick={clickHandler}>Загрузить расписание</Button>
      </div>
      {schedules.map((schedule, index) => (
        <ScheduleCard
          key={schedule.name + index}
          className={classes.line}
          schedule={schedule}
          onConvert={onConvert(index)}
        />
      ))}
    </div>
  )
}
