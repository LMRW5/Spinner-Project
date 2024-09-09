import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Index from './index.jsx'
import { BrowserRouter as router, Route, Routes, BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element = {<Index />}/>
      <Route path="/play" element = {<App />}/>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
