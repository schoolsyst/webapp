type WeekType = 'Q1' | 'Q2' | 'BOTH'

interface Subject {
  name: string
  color: string
}

interface Event {
  day: number
  room: string
  start: number
  end: number
  subject: Subject
  // eslint-disable-next-line camelcase
  week_type: WeekType
  uuid: string | undefined
}
