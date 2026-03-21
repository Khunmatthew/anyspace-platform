import { Link, useNavigate, useLocation } from 'react-router-dom'
import { t } from '../i18n'

const typeIcons = {
  office: { icon: '🏢', path: '/listings/office' },
  warehouse: { icon: '🏭', path: '/listings/warehouse' },
  shop: { icon: '🏪', path: '/listings/shop' },
  condo: { icon: '🏠', path: '/listings/condo' },
  villa: { icon: '🏡', path: '/listings/villa' },
}

export default function Header({ lang, setLang, user, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Hide header on admin and login pages
  if (location.pathname.startsWith('/admin') || location.pathname === '/login') return null

  return (
    <header className="header">
      <div className="container header-top">
        <Link to="/" className="logo">
          Any<span>Space</span>
        </Link>
        <div className="header-actions">
          <div className="lang-switch">
            <button className={lang === 'zh' ? 'active' : ''} onClick={() => setLang('zh')}>中文</button>
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
            <button className={lang === 'th' ? 'active' : ''} onClick={() => setLang('th')}>ไทย</button>
          </div>
          <button onClick={() => navigate('/publish')} className="btn-publish">{t(lang, 'nav.publish')}</button>
          {user ? (
            <>
              <button onClick={() => navigate('/admin')} style={{ fontSize: '13px' }}>
                {user.name} ({user.roleName})
              </button>
              <button onClick={onLogout} style={{ fontSize: '13px' }}>
                {lang === 'zh' ? '退出' : 'Logout'}
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/login')}>{t(lang, 'nav.login')}</button>
          )}
        </div>
      </div>
      <nav className="nav">
        <div className="container">
          <ul className="nav-list">
            <li><Link to="/">{t(lang, 'nav.home')}</Link></li>
            {Object.entries(typeIcons).map(([key, val]) => (
              <li key={key}>
                <Link to={val.path}>{val.icon} {t(lang, `types.${key}`)}</Link>
              </li>
            ))}
            <li><Link to="/listings">{t(lang, 'nav.services')}</Link></li>
            <li><Link to="/listings">{t(lang, 'nav.blog')}</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
