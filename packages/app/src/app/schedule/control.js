import React from 'react'

import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import { makeStyles } from '@material-ui/core'

import { compose } from '../../utils'

import { toZeroBased } from '../../utils/grouper'

const useStyles = makeStyles({
  controlPanel: {
    display: 'flex'
  },
  textField: {
    margin: '0 8px',
    width: 142
  },
  groupBy: {
    marginLeft: 'auto'
  }
})

function getValue ({ target: { value } }) {
  return value
}

function strToDate (value) {
  const [yyyy, mm, dd] = value.split('-')
  const date = new Date(yyyy, mm - 1, dd)
  return date.getTime()
}

function dateToStr (ms) {
  const date = new Date(ms)
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  ].map(toZeroBased).join('-')
}

export default function ({
  start,
  onStartChange,
  end,
  onEndChange,
  partition,
  onSelectPartition,
  partitions
}) {
  const classes = useStyles()
  const toDate = compose(getValue, strToDate)
  const startHandler = compose(toDate, onStartChange)
  const endHandler = compose(toDate, onEndChange)
  const partitionHandler = compose(getValue, onSelectPartition)
  return (
    <div className={classes.controlPanel}>
      <TextField
        label="Начало"
        type="date"
        value={dateToStr(start)}
        className={classes.textField}
        onChange={startHandler}
      />
      <TextField
        label="Конец"
        type="date"
        value={dateToStr(end)}
        className={classes.textField}
        onChange={endHandler}
      />
      <FormControl className={classes.groupBy}>
        <InputLabel shrink htmlFor="group-by-select">
          Период
        </InputLabel>
        <Select
          value={partition}
          onChange={partitionHandler}
          input={<Input id="group-by-select" />}
        >
          {Object.keys(partitions).map(key => (
            <MenuItem key={key} value={key}>{partitions[key]}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
