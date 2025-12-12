import { storage, hashPassword } from './storage'
import type { User, Session, Question, Answer } from './storage'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function calculateScore(correct: boolean, elapsedMs: number): number {
  if (!correct) return 0
  let score = 10
  if (elapsedMs < 30000) {
    const bonus = Math.floor(5 * (30000 - elapsedMs) / 30000)
    score += bonus
  }
  return score
}

export const mockApi = {
  async register(email: string, password: string, nickname: string): Promise<void> {
    const existing = storage.getUserByEmail(email)
    if (existing) {
      throw new Error('User already exists')
    }
    
    const user: User = {
      id: storage.getNextUserId(),
      email,
      passwordHash: hashPassword(password),
      nickname,
      createdAt: new Date().toISOString()
    }
    
    storage.saveUser(user)
  },

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = storage.getUserByEmail(email)
    if (!user || user.passwordHash !== hashPassword(password)) {
      throw new Error('Invalid credentials')
    }
    
    return { token: `token-${user.id}` }
  },

  async getCurrentUser(token: string): Promise<{ id: number; email: string; nickname: string }> {
    const userId = parseInt(token.replace('token-', ''))
    const user = storage.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname
    }
  },

  async startSession(userId: number, mode: string): Promise<{ session: { id: number; mode: string; status: string; total_questions: number }; question: Question }> {
    const questions = storage.getQuestions().filter(q => q.type === mode)
    
    if (questions.length === 0) {
      throw new Error(`no questions available for mode ${mode}`)
    }
    
    const totalQuestions = Math.min(questions.length, 10)
    const selectedQuestions = shuffleArray(questions).slice(0, totalQuestions)
    
    selectedQuestions.forEach(q => {
      q.options = shuffleArray(q.options)
    })
    
    const session: Session = {
      id: storage.getNextSessionId(),
      user_id: userId,
      mode,
      status: 'in_progress',
      total_questions: totalQuestions,
      created_at: new Date().toISOString(),
      questions: selectedQuestions,
      current_question_index: 0,
      answers: []
    }
    
    storage.saveSession(session)
    
    const firstQuestion = {
      id: selectedQuestions[0].id,
      type: selectedQuestions[0].type,
      text: selectedQuestions[0].text,
      image_url: selectedQuestions[0].image_url,
      video_url: selectedQuestions[0].video_url,
      options: selectedQuestions[0].options,
      correct_answer: selectedQuestions[0].correct_answer
    }
    
    return {
      session: {
        id: session.id,
        mode: session.mode,
        status: session.status,
        total_questions: session.total_questions
      },
      question: firstQuestion
    }
  },

  async submitAnswer(userId: number, sessionId: number, questionId: number, answer: string, elapsedMs: number): Promise<{ correct: boolean; score: number; session_status: string }> {
    const session = storage.getSessionById(sessionId)
    if (!session || session.user_id !== userId) {
      throw new Error('Session not found')
    }
    
    const question = session.questions.find(q => q.id === questionId)
    if (!question) {
      throw new Error('Question not found')
    }
    
    const correct = answer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase()
    const score = calculateScore(correct, elapsedMs)
    
    const answerData: Answer = {
      question_id: questionId,
      answer,
      correct,
      score,
      elapsed_ms: elapsedMs
    }
    
    session.answers.push(answerData)
    session.current_question_index++
    
    const isFinished = session.current_question_index >= session.questions.length
    
    if (isFinished) {
      session.status = 'finished'
      session.finished_at = new Date().toISOString()
    }
    
    storage.saveSession(session)
    
    return {
      correct,
      score,
      session_status: isFinished ? 'finished' : 'in_progress'
    }
  },

  async getNextQuestion(userId: number, sessionId: number): Promise<any> {
    const session = storage.getSessionById(sessionId)
    if (!session || session.user_id !== userId) {
      throw new Error('Session not found')
    }
    
    if (session.current_question_index >= session.questions.length) {
      throw new Error('No more questions')
    }
    
    const question = session.questions[session.current_question_index]
    
    return {
      id: question.id,
      type: question.type,
      text: question.text,
      image_url: question.image_url,
      video_url: question.video_url,
      options: question.options,
      correct_answer: question.correct_answer
    }
  },

  async getSessionSummary(userId: number, sessionId: number): Promise<any> {
    const session = storage.getSessionById(sessionId)
    if (!session || session.user_id !== userId) {
      throw new Error('Session not found')
    }
    
    const correctAnswers = session.answers.filter(a => a.correct).length
    const totalScore = session.answers.reduce((sum, a) => sum + a.score, 0)
    
    return {
      session_id: sessionId,
      total_questions: session.total_questions,
      correct_answers: correctAnswers,
      score: totalScore
    }
  },

  async getProfile(userId: number): Promise<any> {
    const sessions = storage.getUserSessions(userId).filter(s => s.status === 'finished')
    const totalSessions = sessions.length
    let totalAnswers = 0
    let correctAnswers = 0
    let totalScore = 0
    
    sessions.forEach(session => {
      totalAnswers += session.answers.length
      correctAnswers += session.answers.filter(a => a.correct).length
      totalScore += session.answers.reduce((sum, a) => sum + a.score, 0)
    })
    
    const accuracyPercent = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0
    
    return {
      total_sessions: totalSessions,
      total_answers: totalAnswers,
      correct_answers: correctAnswers,
      total_score: totalScore,
      accuracy_percent: accuracyPercent
    }
  },

  async getGlobalLeaderboard(limit: number = 100): Promise<Array<{ user_id: number; nickname: string; score: number; accuracy: number; position: number }>> {
    const users = storage.getUsers()
    const leaderboard: Array<{ user_id: number; nickname: string; score: number; accuracy: number }> = []
    
    users.forEach(user => {
      const sessions = storage.getUserSessions(user.id).filter(s => s.status === 'finished')
      let totalScore = 0
      let totalAnswers = 0
      let correctAnswers = 0
      
      sessions.forEach(session => {
        totalScore += session.answers.reduce((sum, a) => sum + a.score, 0)
        totalAnswers += session.answers.length
        correctAnswers += session.answers.filter(a => a.correct).length
      })
      
      if (totalAnswers > 0) {
        const accuracy = (correctAnswers / totalAnswers) * 100
        leaderboard.push({
          user_id: user.id,
          nickname: user.nickname,
          score: totalScore,
          accuracy
        })
      }
    })
    
    leaderboard.sort((a, b) => b.score - a.score)
    
    return leaderboard.slice(0, limit).map((entry, index) => ({
      ...entry,
      position: index + 1
    })) as Array<{ user_id: number; nickname: string; score: number; accuracy: number; position: number }>
  },

  async getMyLeaderboardEntry(userId: number): Promise<{ user_id: number; nickname: string; score: number; accuracy: number; position: number }> {
    const leaderboard = await this.getGlobalLeaderboard(100)
    const entry = leaderboard.find(e => e.user_id === userId)
    
    if (!entry) {
      const sessions = storage.getUserSessions(userId).filter(s => s.status === 'finished')
      let totalScore = 0
      let totalAnswers = 0
      let correctAnswers = 0
      
      sessions.forEach(session => {
        totalScore += session.answers.reduce((sum, a) => sum + a.score, 0)
        totalAnswers += session.answers.length
        correctAnswers += session.answers.filter(a => a.correct).length
      })
      
      const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0
      const user = storage.getUserById(userId)
      
      return {
        user_id: userId,
        nickname: user?.nickname || 'Unknown',
        score: totalScore,
        accuracy,
        position: leaderboard.length + 1
      }
    }
    
    return entry
  }
}

