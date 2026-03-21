import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Demo accounts for testing
const demoAccounts = [
  { email: 'admin@anyspace.th', password: 'admin123', name: 'Admin', role: 'admin', roleName: '超级管理员' },
  { email: 'staff@anyspace.th', password: 'staff123', name: 'Lisa', role: 'staff', roleName: '运营员工' },
  { email: 'agent@anyspace.th', password: 'agent123', name: 'Tom', role: 'agent', roleName: '合作中介' },
]

export default function LoginPage({ lang, onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const account = demoAccounts.find(a => a.email === email && a.password === password)
    if (account) {
      onLogin(account)
      navigate('/admin')
    } else {
      setError(lang === 'zh' ? '账号或密码错误' : 'Invalid email or password')
    }
  }

  const quickLogin = (account) => {
    onLogin(account)
    navigate('/admin')
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Any<span>Space</span></h1>
            <p>{lang === 'zh' ? '后台管理系统' : 'Management System'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label>{lang === 'zh' ? '邮箱账号' : 'Email'}</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="login-field">
              <label>{lang === 'zh' ? '密码' : 'Password'}</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="********"
                required
              />
            </div>
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="login-btn">
              {lang === 'zh' ? '登 录' : 'Sign In'}
            </button>
          </form>

          <div className="login-divider">
            <span>{lang === 'zh' ? '快速体验' : 'Quick Demo'}</span>
          </div>

          <div className="demo-accounts">
            {demoAccounts.map(acc => (
              <button
                key={acc.role}
                className={`demo-btn demo-${acc.role}`}
                onClick={() => quickLogin(acc)}
              >
                <div className="demo-role">{acc.roleName}</div>
                <div className="demo-email">{acc.email}</div>
              </button>
            ))}
          </div>

          <div className="login-footer">
            <a href="/">{lang === 'zh' ? '← 返回首页' : '← Back to Home'}</a>
          </div>
        </div>
      </div>
    </div>
  )
}
