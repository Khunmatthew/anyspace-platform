import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ListingPage from './pages/ListingPage'
import DetailPage from './pages/DetailPage'
import PublishPage from './pages/PublishPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import './index.css'

function App() {
  const [lang, setLang] = useState('zh')
  const [user, setUser] = useState(null)

  const handleLogin = (account) => {
    setUser(account)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Header lang={lang} setLang={setLang} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage lang={lang} />} />
        <Route path="/listings" element={<ListingPage lang={lang} />} />
        <Route path="/listings/:type" element={<ListingPage lang={lang} />} />
        <Route path="/property/:id" element={<DetailPage lang={lang} />} />
        <Route path="/publish" element={<PublishPage lang={lang} />} />
        <Route path="/login" element={
          user ? <Navigate to="/admin" /> : <LoginPage lang={lang} onLogin={handleLogin} />
        } />
        <Route path="/admin" element={
          user ? <AdminPage lang={lang} user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
        } />
      </Routes>
      <Footer lang={lang} />
    </BrowserRouter>
  )
}

export default App
