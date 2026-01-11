Enterimport { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TerminalPage from './pages/TerminalPage'
import { AuthContext } from './context/AuthContext'
import './styles/App.css'

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]))
      setUser(userData)
    }
  }, [token])

  return (
    <AuthContext. Provider value={{ token, setToken, user }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={token ? <DashboardPage /> :  <Navigate to="/login" />} />
          <Route path="/terminal/: sessionId" element={token ? <TerminalPage /> :  <Navigate to="/login" />} />
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
