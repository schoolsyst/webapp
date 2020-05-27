// eslint-disable camelcase
type WeekType = 'Q1' | 'Q2' | 'BOTH'

interface ApiResource {
  uuid: string
  updated_at: string | null
  created_at: string
}

interface ApiResourceSubject extends ApiResource {
  name: string
  color: string
}

interface ApiResourceEvent extends ApiResource {
  day: number
  room: string
  start: number
  end: number
  subject: ApiResourceSubject
  week_type: WeekType
  uuid: string | undefined
}

type NoteContentType = 'html' | 'markdown' | 'asciidoc' | 'external'

interface ApiResourceNote extends ApiResource {
  title: string | null
  content: string
  thumbnail: string | null
  type: NoteContentType
  quizzes: string[]
}

interface ApiResourceQuizQuestion extends ApiResource {
  name: string
  correct_answer: string
}

interface ApiResourceQuizAnswer extends ApiResource {
  answer: string
  question: ApiResourceQuizQuestion
}

interface ApiResourceQuizSession extends ApiResource {
  start: String
  end: String
  answers: ApiResourceQuizAnswer[]
}

interface ApiResourceQuiz extends ApiResource {
  name: string
  questions: ApiResourceQuizQuestion[]
  tries: { test: number; train: number }
  modified_at: string
  time_spent: number
  sessions: ApiResourceQuizSession[]
  description: string
}

type HomeworkType = 'test' | 'coursework' | 'to_bring' | 'exercise'

interface ApiResourceHomework extends ApiResource {
  title: string
  subject: ApiResourceSubject
  type: HomeworkType
  completed_at: string | null
  due_at: string
  progress: number | null
  notes: string[]
  grades: string[]
  quizzes: string[]
  details: string
}
