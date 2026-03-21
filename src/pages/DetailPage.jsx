import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { t } from '../i18n'
import { supabase } from '../lib/supabase'
import { mapProperty } from '../lib/mapProperty'

export default function DetailPage({ lang }) {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [inquirySubmitted, setInquirySubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', wechat: '', message: '' })

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true)
      const { data } = await supabase.from('properties').select('*').eq('id', id).single()
      if (data) {
        const mapped = mapProperty(data)
        setProperty(mapped)
        // fetch similar
        const { data: sim } = await supabase.from('properties').select('*')
          .eq('status', 'active').eq('type', data.type).neq('id', id).limit(3)
        if (sim) setSimilar(sim.map(mapProperty))
      }
      setLoading(false)
    }
    fetchProperty()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await supabase.from('inquiries').insert({
      property_id: id,
      property_title: property?.title?.zh,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      wechat: formData.wechat,
      message: formData.message,
    })
    setSubmitting(false)
    setInquirySubmitted(true)
    setFormData({ name: '', phone: '', email: '', wechat: '', message: '' })
    setTimeout(() => setInquirySubmitted(false), 4000)
  }

  if (loading) {
    return (
      <main className="detail-page">
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</p>
          <p style={{ color: 'var(--text-light)' }}>{lang === 'zh' ? '加载中...' : 'Loading...'}</p>
        </div>
      </main>
    )
  }

  if (!property) {
    return (
      <main className="detail-page">
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: '48px' }}>😕</p>
          <h2>{lang === 'zh' ? '房源未找到' : 'Property not found'}</h2>
          <Link to="/listings" style={{ color: 'var(--accent)', marginTop: '16px', display: 'inline-block' }}>
            {lang === 'zh' ? '返回房源列表' : 'Back to Listings'}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">{t(lang, 'nav.home')}</Link>
          <span>›</span>
          <Link to={`/listings/${property.type}`}>{t(lang, `types.${property.type}`)}</Link>
          <span>›</span>
          <span>{property.title[lang]}</span>
        </div>

        <div className="detail-grid">
          {/* LEFT CONTENT */}
          <div>
            {/* Gallery */}
            <div className="detail-gallery">
              <img src={property.images[activeImg]} alt="" />
              <div className="gallery-thumbs">
                {property.images.map((img, i) => (
                  <img key={i} src={img} alt="" className={i === activeImg ? 'active' : ''} onClick={() => setActiveImg(i)} />
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="detail-info">
              <h1 className="detail-title">{property.title[lang]}</h1>
              <div className="detail-location">📍 {property.location[lang]}</div>

              <div className="detail-price-row">
                <div className="detail-price-item">
                  <div className="label">{t(lang, 'detail.monthlyRent')}</div>
                  <div className="value highlight">฿{property.price.toLocaleString()}</div>
                </div>
                <div className="detail-price-item">
                  <div className="label">{t(lang, 'detail.pricePerSqm')}</div>
                  <div className="value">฿{property.pricePerSqm}/sqm</div>
                </div>
                <div className="detail-price-item">
                  <div className="label">{t(lang, 'detail.area')}</div>
                  <div className="value">{property.size} sqm</div>
                </div>
                <div className="detail-price-item">
                  <div className="label">{t(lang, 'detail.deposit')}</div>
                  <div className="value" style={{ fontSize: '14px' }}>{property.deposit}</div>
                </div>
              </div>

              <div className="detail-tags">
                {property.furnished && <span className="detail-tag">✅ {t(lang, 'listing.furnished')}</span>}
                {property.btsNearby && <span className="detail-tag">🚆 {t(lang, 'listing.btsNearby')}</span>}
                {property.canRegister && <span className="detail-tag">🏢 {t(lang, 'listing.canRegister')}</span>}
                {property.parking > 0 && <span className="detail-tag">🅿️ {t(lang, 'listing.parking')}: {property.parking}</span>}
                {property.floor && <span className="detail-tag">🏗️ {property.floor}</span>}
              </div>
            </div>

            {/* Description */}
            {property.description[lang] && (
              <div className="detail-info">
                <div className="detail-section">
                  <h3>{lang === 'zh' ? '房源描述' : 'Description'}</h3>
                  <p>{property.description[lang]}</p>
                </div>
                <div className="detail-section">
                  <h3>{lang === 'zh' ? '租赁条款' : 'Lease Terms'}</h3>
                  <ul className="detail-list">
                    <li>{t(lang, 'detail.deposit')}: {property.deposit}</li>
                    <li>{t(lang, 'listing.minLease')}: {property.minLease}</li>
                    {property.managementFee > 0 && <li>{t(lang, 'detail.managementFee')}: ฿{property.managementFee}/sqm</li>}
                    {property.floor && <li>{t(lang, 'listing.floor')}: {property.floor}</li>}
                  </ul>
                </div>
              </div>
            )}

            {/* Similar */}
            {similar.length > 0 && (
              <div className="detail-info">
                <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--primary)' }}>
                  {t(lang, 'detail.similarListings')}
                </h3>
                <div className="property-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                  {similar.map(p => (
                    <Link key={p.id} to={`/property/${p.id}`} className="property-card" style={{ cursor: 'pointer' }}>
                      <div className="property-card-img" style={{ height: '140px' }}>
                        <img src={p.image} alt="" />
                      </div>
                      <div className="property-card-body" style={{ padding: '12px' }}>
                        <h3 style={{ fontSize: '14px' }}>{p.title[lang]}</h3>
                        <div className="property-price" style={{ fontSize: '16px' }}>
                          ฿{p.price.toLocaleString()} <small>/mo</small>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="detail-sidebar">
            <div className="sidebar-card">
              <div className="agent-card">
                <img src={property.agent.image} alt="" className="agent-avatar" />
                <div>
                  <div className="agent-name">{property.agent.name}</div>
                  <div className="agent-title">{lang === 'zh' ? '资深租赁顾问' : 'Senior Leasing Consultant'}</div>
                </div>
              </div>
              <div className="contact-btns">
                {property.contact.phone && (
                  <a href={`tel:${property.contact.phone}`} className="contact-btn primary">📞 {t(lang, 'detail.callNow')}</a>
                )}
                {property.contact.whatsapp && (
                  <a href={`https://wa.me/${property.contact.whatsapp}`} className="contact-btn whatsapp" target="_blank" rel="noreferrer">💬 WhatsApp</a>
                )}
                {property.contact.wechat && (
                  <button className="contact-btn wechat">💚 WeChat: {property.contact.wechat}</button>
                )}
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="sidebar-card">
              <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--primary)' }}>
                {t(lang, 'detail.inquiry')}
              </h3>
              {inquirySubmitted ? (
                <div className="success-msg">
                  {lang === 'zh' ? '✅ 询盘已提交！顾问将尽快联系您。' : '✅ Inquiry submitted! Our consultant will contact you soon.'}
                </div>
              ) : (
                <form className="inquiry-form" onSubmit={handleSubmit}>
                  <input type="text" placeholder={t(lang, 'detail.name')} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  <input type="tel" placeholder={t(lang, 'detail.phone')} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                  <input type="email" placeholder={t(lang, 'detail.email')} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  <input type="text" placeholder="WeChat ID" value={formData.wechat} onChange={e => setFormData({...formData, wechat: e.target.value})} />
                  <textarea placeholder={t(lang, 'detail.message')} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                  <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? (lang === 'zh' ? '提交中...' : 'Submitting...') : t(lang, 'detail.submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
