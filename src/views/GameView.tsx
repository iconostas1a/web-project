import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import api from '../api'
import '../styles/GameView.css'

interface Question {
  id: number
  type: string
  text?: string
  image_url?: string
  video_url?: string
  options?: string[]
}

interface AnswerResult {
  correct: boolean
  score: number
  session_status: string
  next_question?: Question
}

interface SessionSummary {
  score: number
  correct_answers: number
  total_questions: number
}

const GameView: React.FC = () => {
  const { mode } = useParams<{ mode: string }>()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [timeLeft, setTimeLeft] = useState(60)
  const [loading, setLoading] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [textAnswer, setTextAnswer] = useState('')
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null)
  const [sessionStatus, setSessionStatus] = useState('in_progress')
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null)
  const [imageError, setImageError] = useState(false)
  const [videoError, setVideoError] = useState(false)
  
  const timerRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getMediaUrl = (url: string | null): string => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url
    const basePath = import.meta.env.PROD ? '/web-project' : ''
    return `${basePath}/media/${cleanUrl}`
  }

  const startTimer = () => {
    setTimeLeft(60)
    startTimeRef.current = Date.now()
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const handleTimeout = async () => {
    stopTimer()
    if (!answered && question) {
      await submitAnswer('', true)
    }
  }

  const startSession = async () => {
    if (!mode) return
    setLoading(true)
    try {
      const response = await api.post('/game/sessions', { mode })
      const sessionIdValue = response.data.session.id
      setSessionId(sessionIdValue)
      setQuestion(response.data.question)
      setTotalQuestions(response.data.session.total_questions || 10)
      startTimer()
    } catch (error) {
      console.error('Failed to start session:', error)
      const message = error instanceof Error ? error.message : 'Unknown error'
      alert(`Ошибка создания сессии: ${message}`)
      navigate('/home')
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async (answer: string, timeout = false) => {
    if (answered || !sessionId || !question) return
    
    setAnswered(true)
    stopTimer()
    
    const elapsedMs = Date.now() - startTimeRef.current
    
    try {
      const response = await api.post(`/game/sessions/${sessionId}/answers`, {
        question_id: question.id,
        answer: timeout ? '' : answer,
        elapsed_ms: elapsedMs
      })
      
      setAnswerResult(response.data)
      setSessionStatus(response.data.session_status)
      
      if (response.data.session_status === 'finished') {
        await loadSessionSummary()
      } else {
        setTimeout(async () => {
          await loadNextQuestion()
        }, 2000)
      }
    } catch (error) {
      console.error('Ошибка отправки ответа:', error)
      const message = error instanceof Error ? error.message : 'Unknown error'
      alert(`Ошибка отправки ответа: ${message}`)
      setAnswered(false)
      startTimer()
    }
  }

  const loadNextQuestion = async () => {
    if (!sessionId) return
    
    setLoading(true)
    setAnswered(false)
    setSelectedAnswer('')
    setTextAnswer('')
    setAnswerResult(null)
    setImageError(false)
    setVideoError(false)
    
    try {
      const response = await api.get(`/game/sessions/${sessionId}/next`)
      setQuestion(response.data)
      setCurrentQuestionNumber(prev => prev + 1)
      startTimer()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ''
      if (errorMessage.includes('No more questions') || errorMessage.includes('404')) {
        setSessionStatus('finished')
        await loadSessionSummary()
      }
    } finally {
      setLoading(false)
    }
  }

  const loadSessionSummary = async () => {
    if (!sessionId) return
    try {
      const response = await api.get(`/game/sessions/${sessionId}`)
      setSessionSummary(response.data)
    } catch (error) {
      console.error('Failed to load summary:', error)
    }
  }

  const handleOptionClick = (option: string) => {
    if (answered || loading) return
    setSelectedAnswer(option)
    submitAnswer(option)
  }

  const handleSubmitClick = () => {
    if (textAnswer && !answered) {
      submitAnswer(textAnswer)
    }
  }

  const startNewGame = async () => {
    stopTimer()
    setSessionId(null)
    setQuestion(null)
    setCurrentQuestionNumber(1)
    setTotalQuestions(10)
    setTimeLeft(60)
    setAnswered(false)
    setSelectedAnswer('')
    setTextAnswer('')
    setAnswerResult(null)
    setSessionStatus('in_progress')
    setSessionSummary(null)
    setImageError(false)
    setVideoError(false)
    setLoading(false)
    await startSession()
  }

  useEffect(() => {
    if (mode) {
      startSession()
    }
    return () => {
      stopTimer()
    }
  }, [mode])

  return (
    <div className="game-container">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Вопрос {currentQuestionNumber} / {totalQuestions}</h2>
            <div className={`timer ${timeLeft < 20 ? 'timer-warning' : ''} ${timeLeft < 10 ? 'timer-danger' : ''}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Загрузка вопроса...</p>
            </div>
          ) : sessionStatus === 'finished' ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h2 style={{ marginBottom: '24px' }}>Раунд завершен!</h2>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '24px', marginBottom: '8px' }}>Ваш результат:</p>
                <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>{sessionSummary?.score || 0} очков</p>
                <p style={{ marginTop: '16px' }}>Правильных ответов: {sessionSummary?.correct_answers || 0} / {sessionSummary?.total_questions || 0}</p>
              </div>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button onClick={() => navigate('/home')} className="btn-primary">На главную</button>
                <button onClick={startNewGame} className="btn-secondary">Новая игра</button>
              </div>
            </div>
          ) : question ? (
            <div style={{ position: 'relative', zIndex: 10 }}>
              {question.type === 'frame' && question.image_url && (
                <div style={{ marginBottom: '24px' }}>
                  <img
                    src={getMediaUrl(question.image_url)}
                    alt="Кадр из фильма"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '8px' }}
                  />
                  {imageError && (
                    <div style={{ padding: '20px', background: 'var(--bg-table)', borderRadius: '8px', color: 'var(--text-secondary)', border: '2px solid var(--border-color)' }}>
                      <p>⚠️ Изображение не загружено.</p>
                      <p style={{ fontSize: '12px', marginTop: '8px' }}>Путь: {question.image_url}</p>
                    </div>
                  )}
                </div>
              )}
              
              {question.type === 'video' && question.video_url && (
                <div style={{ marginBottom: '24px' }}>
                  <video
                    src={getMediaUrl(question.video_url)}
                    onError={() => setVideoError(true)}
                    controls
                    autoPlay
                    style={{ width: '100%', maxHeight: '400px', borderRadius: '8px' }}
                  />
                  {videoError && (
                    <div style={{ padding: '20px', background: 'var(--bg-table)', borderRadius: '8px', color: 'var(--text-secondary)', marginTop: '8px', border: '2px solid var(--border-color)' }}>
                      <p>⚠️ Видео не загружено.</p>
                      <p style={{ fontSize: '12px', marginTop: '8px' }}>Путь: {question.video_url}</p>
                    </div>
                  )}
                </div>
              )}
              
              {question.type === 'quote' && question.text && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ background: 'var(--bg-table)', padding: '24px', borderRadius: '8px', borderLeft: '4px solid #667eea', transition: 'background 0.3s ease' }}>
                    <p style={{ fontSize: '20px', fontStyle: 'italic', color: 'var(--text-primary)' }}>"{question.text}"</p>
                  </div>
                </div>
              )}
              
              {question.options && question.options.length > 0 ? (
                <div style={{ display: 'grid', gap: '12px', marginBottom: '24px', position: 'relative', zIndex: 100 }}>
                  {question.options.map((option, index) => (
                    <button
                      key={`option-${index}-${option}`}
                      onClick={() => handleOptionClick(option)}
                      disabled={answered || loading}
                      className={`btn-option ${selectedAnswer === option ? 'btn-option-selected' : ''}`}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ marginBottom: '24px' }}>
                  <input
                    type="text"
                    placeholder="Введите название фильма"
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && handleSubmitClick()}
                    disabled={answered}
                    style={{ marginBottom: '16px' }}
                  />
                  <button
                    onClick={handleSubmitClick}
                    disabled={answered || !textAnswer}
                    className="btn-primary"
                    style={{ width: '100%' }}
                  >
                    Ответить
                  </button>
                </div>
              )}
              
              {answerResult && (
                <div
                  style={{
                    marginTop: '24px',
                    padding: '16px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    background: answerResult.correct ? (isDark ? '#1e3a2e' : '#d4edda') : (isDark ? '#3d1a1a' : '#f8d7da'),
                    color: answerResult.correct ? (isDark ? '#4ade80' : '#155724') : (isDark ? '#ff6b6b' : '#721c24')
                  }}
                >
                  <p style={{ fontWeight: 600, marginBottom: '8px' }}>
                    {answerResult.correct ? '' : ''}
                  </p>
                  <p>Начислено очков: {answerResult.score}</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default GameView

