import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import api from '../api'

interface LeaderboardEntry {
  user_id: number
  nickname: string
  score: number
  accuracy: number
  position: number
}

const LeaderboardView: React.FC = () => {
  const { logout, user } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const [globalRes, myRes] = await Promise.all([
        api.get('/leaderboard/global'),
        api.get('/leaderboard/me')
      ])
      setLeaderboard(globalRes.data)
      setMyEntry(myRes.data)
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
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
        {myEntry && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ marginBottom: '24px' }}>Ваша позиция</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white', transition: 'all 0.3s ease' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>#{myEntry.position}</div>
                <div>Позиция</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>{myEntry.score}</div>
                <div>Очков</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>{myEntry.accuracy.toFixed(1)}%</div>
                <div>Точность</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="card">
          <h2 style={{ marginBottom: '24px' }}>Глобальный рейтинг</h2>
          {loading ? (
            <div>Загрузка...</div>
          ) : leaderboard.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Рейтинг пуст</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-table)', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Позиция</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Никнейм</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}>Очки</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}>Точность</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr
                    key={entry.user_id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      background: entry.user_id === myEntry?.user_id ? (isDark ? '#2a3a4e' : '#e3f2fd') : 'transparent'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-table-hover)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = entry.user_id === myEntry?.user_id ? (isDark ? '#2a3a4e' : '#e3f2fd') : 'transparent' }}
                  >
                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#667eea' }}>
                      {entry.position === 1 ? '🥇' : entry.position === 2 ? '🥈' : entry.position === 3 ? '🥉' : `#${entry.position}`}
                    </td>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{entry.nickname}</td>
                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600 }}>{entry.score}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>{entry.accuracy.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeaderboardView

