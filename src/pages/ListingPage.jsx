import { useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { t } from '../i18n'
import { properties } from '../data/mockData'

export default function ListingPage({ lang }) {
  const { type } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('newest')
  const [favorites, setFavorites] = useState([])
  const [filterType, setFilterType] = useState(type || searchParams.get('type') || '')

  let filtered = properties
  const activeType = filterType || type
  if (activeType) {
    filtered = filtered.filter(p => p.type === activeType)
  }

  if (sortBy === 'priceLow') filtered = [...filtered].sort((a,b) => a.price - b.price)
  if (sortBy === 'priceHigh') filtered = [...filtered].sort((a,b) => b.price - a.price)
  if (sortBy === 'areaLarge') filtered = [...filtered].sort((a,b) => b.size - a.size)

  const toggleFav = (id) => {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id])
  }

  const pageTitle = activeType ? t(lang, `types.${activeType}`) : (lang === 'zh' ? '全部房源' : 'All Listings')

  return (
    <main className="listing-page">
      <div className="container">
        <div className="breadcrumb">
          <a href="/">{t(lang, 'nav.home')}</a>
          <span>›</span>
          <span>{pageTitle}</span>
        </div>

        {/* FILTERS */}
        <div className="listing-filters">
          <div className="filters-row">
            <div className="filter-group">
              <label>{t(lang, 'search.type')}</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="">{t(lang, 'search.allTypes')}</option>
                <option value="office">{t(lang, 'types.office')}</option>
                <option value="warehouse">{t(lang, 'types.warehouse')}</option>
                <option value="shop">{t(lang, 'types.shop')}</option>
                <option value="condo">{t(lang, 'types.condo')}</option>
                <option value="villa">{t(lang, 'types.villa')}</option>
              </select>
            </div>
            <div className="filter-group">
              <label>{lang === 'zh' ? '区域' : 'Area'}</label>
              <select>
                <option>{lang === 'zh' ? '全部区域' : 'All Areas'}</option>
                <option>Sathorn</option>
                <option>Asoke</option>
                <option>Rama 9</option>
                <option>Sukhumvit</option>
                <option>Bangna</option>
                <option>Silom</option>
              </select>
            </div>
            <div className="filter-group">
              <label>{t(lang, 'search.budget')}</label>
              <select>
                <option>{t(lang, 'search.allBudgets')}</option>
                <option>{'< 20,000 THB'}</option>
                <option>20,000 - 50,000</option>
                <option>50,000 - 100,000</option>
                <option>{'> 100,000 THB'}</option>
              </select>
            </div>
            <div className="filter-group">
              <label>{t(lang, 'search.area')}</label>
              <select>
                <option>{t(lang, 'search.allAreas')}</option>
                <option>{'< 50 sqm'}</option>
                <option>50-100 sqm</option>
                <option>100-300 sqm</option>
                <option>{'> 300 sqm'}</option>
              </select>
            </div>
            <div className="filter-group">
              <label>{t(lang, 'listing.decoration')}</label>
              <select>
                <option>{lang === 'zh' ? '不限' : 'Any'}</option>
                <option>{t(lang, 'listing.furnished')}</option>
                <option>{t(lang, 'listing.unfurnished')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* HEADER */}
        <div className="listing-header">
          <h2 style={{ fontSize: '20px', color: 'var(--primary-dark)' }}>
            {pageTitle} — {filtered.length} {t(lang, 'listing.results')}
          </h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="newest">{t(lang, 'listing.newest')}</option>
              <option value="priceLow">{t(lang, 'listing.priceLow')}</option>
              <option value="priceHigh">{t(lang, 'listing.priceHigh')}</option>
              <option value="areaLarge">{t(lang, 'listing.areaLarge')}</option>
            </select>
          </div>
        </div>

        {/* RESULTS */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
            <p>{lang === 'zh' ? '暂无符合条件的房源，请调整筛选条件' : 'No listings found. Try adjusting your filters.'}</p>
          </div>
        ) : (
          <div className="property-grid">
            {filtered.map(p => (
              <div key={p.id} className="property-card" onClick={() => navigate(`/property/${p.id}`)}>
                <div className="property-card-img">
                  <img src={p.image} alt={p.title[lang] || p.title.zh} />
                  <div className="property-type-badge">{t(lang, `types.${p.type}`)}</div>
                </div>
                <div className="property-card-body">
                  <h3>{p.title[lang] || p.title.zh}</h3>
                  <div className="property-location">📍 {p.location[lang] || p.location.zh}</div>
                  <div className="property-meta">
                    <span>{p.size} sqm</span>
                    <span>{p.floor}</span>
                    {p.furnished && <span>{t(lang, 'listing.furnished')}</span>}
                    {p.btsNearby && <span>🚆 BTS/MRT</span>}
                    {p.canRegister && <span>✅ {t(lang, 'listing.canRegister')}</span>}
                    {p.parking > 0 && <span>🅿️ {p.parking}</span>}
                  </div>
                  <div className="property-price">
                    ฿{p.price.toLocaleString()} <small>/month</small>
                  </div>
                </div>
                <div className="property-card-footer">
                  <button className="btn-contact" onClick={e => { e.stopPropagation(); navigate(`/property/${p.id}`) }}>
                    {t(lang, 'listing.details')}
                  </button>
                  <button
                    className={`btn-favorite ${favorites.includes(p.id) ? 'active' : ''}`}
                    onClick={e => { e.stopPropagation(); toggleFav(p.id) }}
                  >
                    {favorites.includes(p.id) ? '♥' : '♡'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
