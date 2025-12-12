export interface User {
  id: number
  email: string
  passwordHash: string
  nickname: string
  createdAt: string
}

export interface Question {
  id: number
  type: string
  text?: string
  image_url?: string
  video_url?: string
  options: string[]
  correct_answer: string
}

export interface Answer {
  question_id: number
  answer: string
  correct: boolean
  score: number
  elapsed_ms: number
}

export interface Session {
  id: number
  user_id: number
  mode: string
  status: string
  total_questions: number
  created_at: string
  finished_at?: string
  questions: Question[]
  current_question_index: number
  answers: Answer[]
}

const STORAGE_KEYS = {
  USERS: 'quiz_users',
  SESSIONS: 'quiz_sessions',
  QUESTIONS: 'quiz_questions',
  NEXT_USER_ID: 'quiz_next_user_id',
  NEXT_SESSION_ID: 'quiz_next_session_id',
  NEXT_QUESTION_ID: 'quiz_next_question_id'
}

export const storage = {
  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS)
    return data ? JSON.parse(data) : []
  },

  saveUser(user: User): void {
    const users = this.getUsers()
    users.push(user)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  },

  getUserByEmail(email: string): User | undefined {
    const users = this.getUsers()
    return users.find(u => u.email === email)
  },

  getUserById(id: number): User | undefined {
    const users = this.getUsers()
    return users.find(u => u.id === id)
  },

  getSessions(): Session[] {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS)
    return data ? JSON.parse(data) : []
  },

  saveSession(session: Session): void {
    const sessions = this.getSessions()
    const index = sessions.findIndex(s => s.id === session.id)
    if (index >= 0) {
      sessions[index] = session
    } else {
      sessions.push(session)
    }
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions))
  },

  getSessionById(id: number): Session | undefined {
    const sessions = this.getSessions()
    return sessions.find(s => s.id === id)
  },

  getUserSessions(userId: number): Session[] {
    const sessions = this.getSessions()
    return sessions.filter(s => s.user_id === userId)
  },

  getQuestions(): Question[] {
    const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS)
    return data ? JSON.parse(data) : []
  },

  saveQuestions(questions: Question[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions))
  },

  getNextUserId(): number {
    const id = parseInt(localStorage.getItem(STORAGE_KEYS.NEXT_USER_ID) || '1')
    localStorage.setItem(STORAGE_KEYS.NEXT_USER_ID, String(id + 1))
    return id
  },

  getNextSessionId(): number {
    const id = parseInt(localStorage.getItem(STORAGE_KEYS.NEXT_SESSION_ID) || '1')
    localStorage.setItem(STORAGE_KEYS.NEXT_SESSION_ID, String(id + 1))
    return id
  },

  getNextQuestionId(): number {
    const id = parseInt(localStorage.getItem(STORAGE_KEYS.NEXT_QUESTION_ID) || '1')
    localStorage.setItem(STORAGE_KEYS.NEXT_QUESTION_ID, String(id + 1))
    return id
  }
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString()
}

export function hashPassword(password: string): string {
  return simpleHash(password).toString()
}
