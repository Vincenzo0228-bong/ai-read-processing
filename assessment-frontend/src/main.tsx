import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App title="Hello World" blurb="You can modify this project as you like to complete your assessment." />
  </StrictMode>,
)