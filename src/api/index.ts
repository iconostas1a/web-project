import { mockApi } from '../services/mockApi'

let authToken: string | null = null

export const setAuthToken = (token: string | null) => {
  authToken = token
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

function getUserId(): number | null {
  const token = authToken || localStorage.getItem('token')
  if (!token) return null
  const userId = parseInt(token.replace('token-', ''))
  return isNaN(userId) ? null : userId
}

const api = {
  async post(url: string, data: unknown): Promise<{ data: unknown }> {
    const userId = getUserId()
    
    if (url === '/auth/register') {
      await mockApi.register(data.email, data.password, data.nickname)
      return { data: { token: null } }
    }
    
    if (url === '/auth/login') {
      const result = await mockApi.login(data.email, data.password)
      return { data: result }
    }
    
    if (url === '/game/sessions') {
      if (!userId) throw new Error('Unauthorized')
      const result = await mockApi.startSession(userId, data.mode)
      return { data: result }
    }
    
    if (url.match(/^\/game\/sessions\/\d+\/answers$/)) {
      if (!userId) throw new Error('Unauthorized')
      const sessionId = parseInt(url.match(/\/(\d+)\/answers$/)?.[1] || '0')
      const result = await mockApi.submitAnswer(
        userId,
        sessionId,
        data.question_id,
        data.answer,
        data.elapsed_ms
      )
      return { data: result }
    }
    
    throw new Error(`Unknown endpoint: ${url}`)
  },

  async get(url: string): Promise<{ data: unknown }> {
    const userId = getUserId()
    if (!userId) throw new Error('Unauthorized')
    
    if (url === '/auth/me') {
      const user = await mockApi.getCurrentUser(`token-${userId}`)
      return { data: user }
    }
    
    if (url.match(/^\/game\/sessions\/\d+\/next$/)) {
      const sessionId = parseInt(url.match(/\/(\d+)\/next$/)?.[1] || '0')
      const question = await mockApi.getNextQuestion(userId, sessionId)
      return { data: question }
    }
    
    if (url.match(/^\/game\/sessions\/\d+$/)) {
      const sessionId = parseInt(url.match(/\/(\d+)$/)?.[1] || '0')
      const summary = await mockApi.getSessionSummary(userId, sessionId)
      return { data: summary }
    }
    
    if (url === '/profile') {
      const profile = await mockApi.getProfile(userId)
      return { data: profile }
    }
    
    if (url === '/leaderboard/global') {
      const leaderboard = await mockApi.getGlobalLeaderboard()
      return { data: leaderboard }
    }
    
    if (url === '/leaderboard/me') {
      const entry = await mockApi.getMyLeaderboardEntry(userId)
      return { data: entry }
    }
    
    throw new Error(`Unknown endpoint: ${url}`)
  }
}

export default api

