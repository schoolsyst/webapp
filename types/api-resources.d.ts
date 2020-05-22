type WeekType = 'Q1' | 'Q2' | 'BOTH'

interface ApiResourceSubject {
  name: string
  color: string
}

interface ApiResourceEvent {
  day: number
  room: string
  start: number
  end: number
  subject: ApiResourceSubject
  // eslint-disable-next-line camelcase
  week_type: WeekType
  uuid: string | undefined
}
