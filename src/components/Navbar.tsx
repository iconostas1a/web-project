import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{ background: 'var(--bg-card)', padding: '20px', boxShadow: '0 2px 10px var(--shadow)', marginBottom: '40px', transition: 'background 0.3s ease, box-shadow 0.3s ease' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#667eea', margin: 0 }}>Movie Quizzer</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={toggleTheme} className="theme-toggle" title={isDark ? 'Светлая тема' : 'Темная тема'}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <span style={{ color: 'var(--text-secondary)' }}>{user?.nickname}</span>
          <Link to="/profile" style={{ textDecoration: 'none', color: '#667eea', fontWeight: 600 }}>Профиль</Link>
          <Link to="/leaderboard" style={{ textDecoration: 'none', color: '#667eea', fontWeight: 600 }}>Рейтинг</Link>
          <button onClick={handleLogout} className="btn-secondary">Выйти</button>
        </div>
      </div>
    </nav>
  )
}

