import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n' // Initialize i18next
import App from './App.jsx'
import { ToastProvider } from './components'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Suspense>
  </StrictMode>,
)
