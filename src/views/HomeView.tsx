import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

const HomeView: React.FC = () => {
  const navigate = useNavigate()

  const startGame = (mode: string) => {
    navigate(`/game/${mode}`)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '16px', color: 'white' }}>Выберите режим игры</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>Проверьте свои знания о фильмах!</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} onClick={() => startGame('frame')} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px var(--shadow)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
            <h3 style={{ marginBottom: '12px' }}>По кадру</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Угадайте фильм по изображению кадра</p>
            <button className="btn-primary" style={{ width: '100%' }}>Играть</button>
          </div>
          
          <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} onClick={() => startGame('video')} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px var(--shadow)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎥</div>
            <h3 style={{ marginBottom: '12px' }}>По видеофрагменту</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Угадайте фильм по видеоролику</p>
            <button className="btn-primary" style={{ width: '100%' }}>Играть</button>
          </div>
          
          <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} onClick={() => startGame('quote')} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px var(--shadow)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <h3 style={{ marginBottom: '12px' }}>По цитате</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Угадайте фильм по известной цитате</p>
            <button className="btn-primary" style={{ width: '100%' }}>Играть</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeView

