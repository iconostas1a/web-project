import { initializeQuestions } from '../data/questions'
import { storage } from './storage'

export function initializeApp() {
  try {
    const existing = storage.getQuestions()
    if (existing.length === 0) {
      initializeQuestions()
    }
  } catch (error) {
    console.error('Error initializing app:', error)
  }
}

