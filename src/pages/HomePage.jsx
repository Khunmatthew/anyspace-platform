import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from '../i18n'
import { hotAreas, enterpriseServices, faqData } from '../data/mockData'
import { supabase } from '../lib/supabase'
import { mapProperty } from '../lib/mapProperty'

const categoryList = [
  { key: 'office', icon: '🏢' },
  { key: 'warehouse', icon: '🏭' },
  { key: 'shop', icon: '🏪' },
  { key: 'condo', icon: '🏠' },
  { key: 'villa', icon: '🏡' },
  { key: 'building', icon: '🏗️' },
]

export default function HomePage({ lang }) {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [searchType, setSearchType] = useState('')
  const [properties, setProperties] = useState([])

  useEffect(() => {
    supabase.from('properties').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(6)
      .then(({ data }) => { if (data) setProperties(data.map(mapProperty)) })
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchType) params.set('type', searchType)
    if (searchText) params.set('q', searchText)
    navigate(`/listings?${params.toString()}`)
  }

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content container">
          <h1>{t(lang, 'hero.title')}</h1>
          <p>{t(lang, 'hero.subtitle')}</p>
          <div className="search-box">
            <div className="search-field">
              <label>{t(lang, 'search.location')}</label>
              <input
                type="text"
                placeholder={t(lang, 'hero.searchPlaceholder')}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
            <div className="search-field">
              <label>{t(lang, 'search.type')}</label>
              <select value={searchType} onChange={e => setSearchType(e.target.value)}>
                <option value="">{t(lang, 'search.allTypes')}</option>
                <option value="office">{t(lang, 'types.office')}</option>
                <option value="warehouse">{t(lang, 'types.warehouse')}</option>
                <option value="shop">{t(lang, 'types.shop')}</option>
                <option value="condo">{t(lang, 'types.condo')}</option>
                <option value="villa">{t(lang, 'types.villa')}</option>
              </select>
            </div>
            <div className="search-field">
              <label>{t(lang, 'search.budget')}</label>
              <select>
                <option>{t(lang, 'search.allBudgets')}</option>
                <option>{'< 20,000 THB'}</option>
                <option>20,000 - 50,000 THB</option>
                <option>50,000 - 100,000 THB</option>
                <option>{'> 100,000 THB'}</option>
              </select>
            </div>
            <div className="search-field">
              <label>{t(lang, 'search.area')}</label>
              <select>
                <option>{t(lang, 'search.allAreas')}</option>
                <option>{'< 50 sqm'}</option>
                <option>50 - 100 sqm</option>
                <option>100 - 300 sqm</option>
                <option>{'> 300 sqm'}</option>
              </select>
            </div>
            <button className="search-btn" onClick={handleSearch}>{t(lang, 'hero.cta')}</button>
          </div>
        </div>
      </section>

      {/* HOT CATEGORIES */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">{t(lang, 'home.hotCategories')}</h2>
          <p className="section-subtitle">{lang === 'zh' ? '覆盖泰国全类型商业与居住空间' : 'All types of commercial and residential spaces in Thailand'}</p>
          <div className="category-grid">
            {categoryList.map(cat => (
              <div key={cat.key} className="category-card" onClick={() => navigate(`/listings/${cat.key}`)}>
                <div className="icon">{cat.icon}</div>
                <h3>{t(lang, `types.${cat.key}`)}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECOMMENDED LISTINGS */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <h2 className="section-title">{t(lang, 'home.recommendedListings')}</h2>
          <p className="section-subtitle">{lang === 'zh' ? '精选优质房源，均经过平台验证' : 'Handpicked quality listings, all verified'}</p>
          {properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
              {lang === 'zh' ? '加载中...' : 'Loading...'}
            </div>
          ) : (
            <div className="property-grid">
              {properties.map(p => (
                <div key={p.id} className="property-card" onClick={() => navigate(`/property/${p.id}`)}>
                  <div className="property-card-img">
                    <img src={p.image} alt={p.title[lang]} />
                    <div className="property-type-badge">{t(lang, `types.${p.type}`)}</div>
                  </div>
                  <div className="property-card-body">
                    <h3>{p.title[lang]}</h3>
                    <div className="property-location">📍 {p.location[lang]}</div>
                    <div className="property-meta">
                      <span>{p.size} {t(lang, 'home.sqm')}</span>
                      {p.furnished && <span>{t(lang, 'listing.furnished')}</span>}
                      {p.btsNearby && <span>{t(lang, 'listing.btsNearby')}</span>}
                      {p.canRegister && <span>{t(lang, 'listing.canRegister')}</span>}
                    </div>
                    <div className="property-price">
                      ฿{p.price.toLocaleString()} <small>{t(lang, 'home.perMonth')}</small>
                    </div>
                  </div>
                  <div className="property-card-footer">
                    <button className="btn-contact" onClick={e => { e.stopPropagation(); navigate(`/property/${p.id}`) }}>
                      {t(lang, 'home.contactAgent')}
                    </button>
                    <button className="btn-favorite">♡</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOT AREAS */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">{t(lang, 'home.hotAreas')}</h2>
          <p className="section-subtitle">{lang === 'zh' ? '曼谷及泰国主要商业区' : 'Bangkok and major commercial areas'}</p>
          <div className="area-grid">
            {hotAreas.map(area => (
              <div key={area.id} className="area-card" onClick={() => navigate(`/listings?area=${area.id}`)}>
                <img src={area.image} alt={area.name[lang]} />
                <div className="area-card-overlay">
                  <h3>{area.name[lang] || area.name.zh}</h3>
                  <p>{area.count} {lang === 'zh' ? '套房源' : 'listings'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENTERPRISE SERVICES */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <h2 className="section-title">{t(lang, 'home.enterpriseServices')}</h2>
          <p className="section-subtitle">{lang === 'zh' ? '不只是租房，更是一站式企业落地方案' : 'More than leasing — a complete business setup solution'}</p>
          <div className="services-grid">
            {enterpriseServices.map(s => (
              <div key={s.id} className="service-card">
                <div className="icon">{s.icon}</div>
                <h3>{s.title[lang] || s.title.zh}</h3>
                <p>{s.desc[lang] || s.desc.zh}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">{t(lang, 'home.whyUs')}</h2>
          <p className="section-subtitle">{lang === 'zh' ? '选择 AnySpace 的四大理由' : 'Four reasons to choose AnySpace'}</p>
          <div className="whyus-grid">
            {[1,2,3,4].map(i => (
              <div key={i} className="whyus-card">
                <h3>{t(lang, `whyUs.title${i}`)}</h3>
                <p>{t(lang, `whyUs.desc${i}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>{t(lang, 'home.faq')}</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>{lang === 'zh' ? '关于泰国租赁的常见问题' : 'Common questions about leasing in Thailand'}</p>
          <div className="faq-list">
            {faqData.map((faq, i) => (
              <div key={i} className="faq-item">
                <div className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q[lang] || faq.q.zh}</span>
                  <span>{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && (
                  <div className="faq-answer">{faq.a[lang] || faq.a.zh}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
