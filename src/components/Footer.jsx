import { useLocation } from 'react-router-dom'
import { t } from '../i18n'

export default function Footer({ lang }) {
  const location = useLocation()
  if (location.pathname.startsWith('/admin') || location.pathname === '/login') return null

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>AnySpace</h4>
            <p>{t(lang, 'footer.description')}</p>
          </div>
          <div>
            <h4>{lang === 'zh' ? '物业类型' : 'Property Types'}</h4>
            <ul className="footer-links">
              <li><a href="/listings/office">{t(lang, 'types.office')}</a></li>
              <li><a href="/listings/warehouse">{t(lang, 'types.warehouse')}</a></li>
              <li><a href="/listings/shop">{t(lang, 'types.shop')}</a></li>
              <li><a href="/listings/condo">{t(lang, 'types.condo')}</a></li>
              <li><a href="/listings/villa">{t(lang, 'types.villa')}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t(lang, 'home.enterpriseServices')}</h4>
            <ul className="footer-links">
              <li><a href="#">{t(lang, 'services.companyReg')}</a></li>
              <li><a href="#">{t(lang, 'services.visa')}</a></li>
              <li><a href="#">{t(lang, 'services.legal')}</a></li>
              <li><a href="#">{t(lang, 'services.renovation')}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t(lang, 'footer.contact')}</h4>
            <ul className="footer-links">
              <li><a href="#">📞 +66-2-XXX-XXXX</a></li>
              <li><a href="#">📱 WhatsApp: +66-8X-XXX-XXXX</a></li>
              <li><a href="#">💬 WeChat: AnySpace</a></li>
              <li><a href="#">📧 info@anyspace.th</a></li>
              <li><a href="#">📍 Bangkok, Thailand</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          {t(lang, 'footer.copyright')}
        </div>
      </div>
    </footer>
  )
}
