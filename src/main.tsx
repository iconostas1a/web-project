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

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
