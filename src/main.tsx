import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initializeApp } from './services/init'

console.log('=== APP LOADING ===')
console.log('BASE_URL:', import.meta.env.BASE_URL)
console.log('PROD:', import.meta.env.PROD)
console.log('MODE:', import.meta.env.MODE)
console.log('Current location:', window.location.href)

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

console.log('Root element found:', rootElement)

try {
  initializeApp()
  console.log('App initialized successfully')
} catch (error) {
  console.error('Failed to initialize app:', error)
}

try {
  console.log('Rendering App component...')
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
  console.log('App rendered successfully')
} catch (error) {
  console.error('Failed to render app:', error)
  rootElement.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Ошибка загрузки приложения</h1><p>Проверьте консоль браузера для деталей.</p><pre>' + String(error) + '</pre></div>'
}
