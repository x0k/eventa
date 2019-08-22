const SCHEDULES = 'schedules'

function load (key, defaultValue) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : defaultValue
}

function save (key) {
  return (data) => {
    localStorage.setItem(key, JSON.stringify(data))
    return data
  }
}

export function loadSchedules () {
  return Promise.resolve(load(SCHEDULES, []))
}

export function addSchedule (schedule) {
  return loadSchedules()
    .then(schedules => schedules.concat(schedule))
    .then(save(SCHEDULES))
}

export function delSchedule ({ name: filter }) {
  return loadSchedules()
    .then(schedules => schedules.filter(({ name }) => name !== filter))
    .then(save(SCHEDULES))
}
