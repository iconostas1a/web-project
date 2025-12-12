import React, { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LoginView: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await login(email, password)
      navigate('/home')
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Ошибка входа'
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="card" style={{ maxWidth: '400px', margin: '100px auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '32px', color: '#667eea' }}>Movie Quizzer</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Вход</h2>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email</label>
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Пароль</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '16px' }} disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
          
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            Нет аккаунта?{' '}
            <Link to="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600 }}>
              Зарегистрироваться
            </Link>
          </div>
          
          {error && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'var(--error-bg)', color: 'var(--error-text)', borderRadius: '8px', textAlign: 'center' }}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default LoginView

