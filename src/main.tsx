import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initializeApp } from './services/init'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

try {
  initializeApp()
} catch (error) {
  console.error('Failed to initialize app:', error)
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
} catch (error) {
  console.error('Failed to render app:', error)
  rootElement.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>ошибка загрузки</h1><p></p></div>'
}
