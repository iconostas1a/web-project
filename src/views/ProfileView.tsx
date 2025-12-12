import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import api from '../api'

interface Profile {
  total_sessions: number
  total_answers: number
  correct_answers: number
  total_score: number
  accuracy_percent: number
}

const ProfileView: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const response = await api.get('/profile')
      setProfile(response.data)
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '40px' }}>
      <Navbar />
      
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '24px' }}>Профиль</h2>
          {user && (
            <div style={{ marginBottom: '32px' }}>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}><strong>Никнейм:</strong> {user.nickname}</p>
              <p style={{ fontSize: '18px' }}><strong>Email:</strong> {user.email}</p>
            </div>
          )}
        </div>
        
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '24px' }}>Статистика</h2>
          {loading ? (
            <div>Загрузка...</div>
          ) : profile ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div style={{ textAlign: 'center', padding: '24px', background: 'var(--bg-table)', borderRadius: '8px', transition: 'background 0.3s ease' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea', marginBottom: '8px' }}>
                    {profile.total_sessions}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>Сыграно раундов</div>
                </div>
                <div style={{ textAlign: 'center', padding: '24px', background: 'var(--bg-table)', borderRadius: '8px', transition: 'background 0.3s ease' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea', marginBottom: '8px' }}>
                    {profile.total_answers}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>Всего ответов</div>
                </div>
                <div style={{ textAlign: 'center', padding: '24px', background: 'var(--bg-table)', borderRadius: '8px', transition: 'background 0.3s ease' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea', marginBottom: '8px' }}>
                    {profile.correct_answers}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>Правильных ответов</div>
                </div>
                <div style={{ textAlign: 'center', padding: '24px', background: 'var(--bg-table)', borderRadius: '8px', transition: 'background 0.3s ease' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea', marginBottom: '8px' }}>
                    {profile.total_score}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>Всего очков</div>
                </div>
              </div>
              <div style={{ marginTop: '24px', padding: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {profile.accuracy_percent.toFixed(1)}%
                </div>
                <div style={{ fontSize: '18px' }}>Точность ответов</div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ProfileView

