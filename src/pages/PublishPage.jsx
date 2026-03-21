import { useState } from 'react'
import { t } from '../i18n'
import { supabase } from '../lib/supabase'

export default function PublishPage({ lang }) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    type: '', listing_type: 'rent',
    title_zh: '', title_en: '',
    description_zh: '', description_en: '',
    city: 'Bangkok', district: '',
    address: '', bts_station: '', bts_walk_min: '',
    price: '', size: '', floor: '', min_lease: '1 year',
    parking: '0', cam_fee: '', deposit: '2 months', condition: 'furnished',
    contact_name: '', contact_phone: '', contact_whatsapp: '', contact_wechat: '', contact_line: '', contact_email: '',
  })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: err } = await supabase.from('properties').insert({
      type: form.type,
      listing_type: form.listing_type,
      title_zh: form.title_zh,
      title_en: form.title_en || form.title_zh,
      description_zh: form.description_zh,
      description_en: form.description_en,
      city: form.city,
      district: form.district,
      address: form.address,
      bts_station: form.bts_station,
      bts_walk_min: form.bts_walk_min ? parseInt(form.bts_walk_min) : null,
      price: parseFloat(form.price),
      size: parseFloat(form.size),
      floor: form.floor,
      min_lease: form.min_lease,
      parking: parseInt(form.parking) || 0,
      cam_fee: form.cam_fee ? parseFloat(form.cam_fee) : 0,
      deposit: form.deposit,
      condition: form.condition,
      furnished: form.condition === 'furnished',
      bts_nearby: !!form.bts_station,
      contact_name: form.contact_name,
      contact_phone: form.contact_phone,
      contact_whatsapp: form.contact_whatsapp,
      contact_wechat: form.contact_wechat,
      contact_line: form.contact_line,
      contact_email: form.contact_email,
      status: 'pending',
    })
    setSubmitting(false)
    if (err) {
      setError(lang === 'zh' ? `提交失败: ${err.message}` : `Submit failed: ${err.message}`)
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <main className="publish-page">
        <div className="container">
          <div className="form-card" style={{ textAlign: 'center', padding: '60px 32px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</p>
            <h2 style={{ color: 'var(--success)', marginBottom: '12px' }}>
              {lang === 'zh' ? '房源提交成功！' : 'Listing Submitted Successfully!'}
            </h2>
            <p style={{ color: 'var(--text-light)' }}>
              {lang === 'zh' ? '我们的团队将在24小时内审核您的房源。审核通过后将自动上线。' : 'Our team will review your listing within 24 hours. It will go live after approval.'}
            </p>
            <button className="btn-submit" style={{ maxWidth: '300px', margin: '24px auto 0' }} onClick={() => { setSubmitted(false); setForm({ type: '', listing_type: 'rent', title_zh: '', title_en: '', description_zh: '', description_en: '', city: 'Bangkok', district: '', address: '', bts_station: '', bts_walk_min: '', price: '', size: '', floor: '', min_lease: '1 year', parking: '0', cam_fee: '', deposit: '2 months', condition: 'furnished', contact_name: '', contact_phone: '', contact_whatsapp: '', contact_wechat: '', contact_line: '', contact_email: '' }) }}>
              {lang === 'zh' ? '继续发布' : 'Submit Another'}
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="publish-page">
      <div className="container">
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="form-card">
            <h2>{lang === 'zh' ? '📋 基本信息' : '📋 Basic Information'}</h2>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '物业类型 *' : 'Property Type *'}</label>
                <select required value={form.type} onChange={set('type')}>
                  <option value="">{lang === 'zh' ? '请选择' : 'Select...'}</option>
                  <option value="office">{t(lang, 'types.office')}</option>
                  <option value="warehouse">{t(lang, 'types.warehouse')}</option>
                  <option value="shop">{t(lang, 'types.shop')}</option>
                  <option value="condo">{t(lang, 'types.condo')}</option>
                  <option value="villa">{t(lang, 'types.villa')}</option>
                  <option value="building">{t(lang, 'types.building')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '租售类型 *' : 'Listing Type *'}</label>
                <select required value={form.listing_type} onChange={set('listing_type')}>
                  <option value="rent">{lang === 'zh' ? '出租' : 'For Rent'}</option>
                  <option value="sale">{lang === 'zh' ? '出售' : 'For Sale'}</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '标题（中文）*' : 'Title (Chinese) *'}</label>
                <input type="text" required value={form.title_zh} onChange={set('title_zh')} placeholder={lang === 'zh' ? '例如：Sathorn甲级写字楼60sqm' : 'e.g. Sathorn办公室60sqm'} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '标题（英文）' : 'Title (English)'}</label>
                <input type="text" value={form.title_en} onChange={set('title_en')} placeholder="e.g. Sathorn Grade A Office 60sqm" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '描述（中文）' : 'Description (Chinese)'}</label>
                <textarea value={form.description_zh} onChange={set('description_zh')} placeholder={lang === 'zh' ? '详细描述房源特点、周边配套、交通等...' : 'Describe features, nearby facilities, transport...'} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '描述（英文）' : 'Description (English)'}</label>
                <textarea value={form.description_en} onChange={set('description_en')} placeholder="Describe features, nearby facilities, transport..." />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-card">
            <h2>{lang === 'zh' ? '📍 位置信息' : '📍 Location'}</h2>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '城市 *' : 'City *'}</label>
                <select required value={form.city} onChange={set('city')}>
                  <option value="Bangkok">Bangkok</option>
                  <option value="Pattaya">Pattaya</option>
                  <option value="Chiang Mai">Chiang Mai</option>
                  <option value="Phuket">Phuket</option>
                </select>
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '区域 *' : 'District *'}</label>
                <select required value={form.district} onChange={set('district')}>
                  <option value="">{lang === 'zh' ? '请选择' : 'Select...'}</option>
                  <option>Sathorn</option><option>Asoke</option><option>Rama 9</option>
                  <option>Sukhumvit</option><option>Silom</option><option>Bangna</option>
                  <option>Lat Krabang</option><option>Jomtien</option><option>Other</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '详细地址' : 'Address'}</label>
                <input type="text" value={form.address} onChange={set('address')} placeholder={lang === 'zh' ? '楼宇名称、街道、门牌号' : 'Building, Street, Number'} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '近BTS/MRT站' : 'Nearest BTS/MRT'}</label>
                <input type="text" value={form.bts_station} onChange={set('bts_station')} placeholder="e.g. BTS Chong Nonsi" />
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '步行距离（分钟）' : 'Walking Distance (min)'}</label>
                <input type="number" value={form.bts_walk_min} onChange={set('bts_walk_min')} placeholder="5" />
              </div>
            </div>
          </div>

          {/* Price & Size */}
          <div className="form-card">
            <h2>{lang === 'zh' ? '💰 价格与面积' : '💰 Price & Size'}</h2>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '月租金（泰铢）*' : 'Monthly Rent (THB) *'}</label>
                <input type="number" required value={form.price} onChange={set('price')} placeholder="45000" />
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '面积（平方米）*' : 'Area (sqm) *'}</label>
                <input type="number" required value={form.size} onChange={set('size')} placeholder="60" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '押金' : 'Deposit'}</label>
                <select value={form.deposit} onChange={set('deposit')}>
                  <option value="2 months">2 months</option>
                  <option value="3 months">3 months</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '管理费（泰铢/sqm/月）' : 'CAM Fee (THB/sqm/mo)'}</label>
                <input type="number" value={form.cam_fee} onChange={set('cam_fee')} placeholder="180" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '楼层' : 'Floor'}</label>
                <input type="text" value={form.floor} onChange={set('floor')} placeholder="15F" />
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '最短租期' : 'Min. Lease'}</label>
                <select value={form.min_lease} onChange={set('min_lease')}>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                  <option value="3 years">3 years</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '停车位' : 'Parking Spots'}</label>
                <input type="number" value={form.parking} onChange={set('parking')} placeholder="2" />
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '装修情况' : 'Condition'}</label>
                <select value={form.condition} onChange={set('condition')}>
                  <option value="furnished">{lang === 'zh' ? '精装修带家具' : 'Furnished'}</option>
                  <option value="fitted">{lang === 'zh' ? '精装修不带家具' : 'Fitted, no furniture'}</option>
                  <option value="bare">{lang === 'zh' ? '毛坯' : 'Bare shell'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="form-card">
            <h2>{lang === 'zh' ? '📞 联系方式' : '📞 Contact Info'}</h2>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '联系人姓名 *' : 'Contact Name *'}</label>
                <input type="text" required value={form.contact_name} onChange={set('contact_name')} />
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '联系电话 *' : 'Phone *'}</label>
                <input type="tel" required value={form.contact_phone} onChange={set('contact_phone')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>WhatsApp</label>
                <input type="text" value={form.contact_whatsapp} onChange={set('contact_whatsapp')} />
              </div>
              <div className="form-group">
                <label>WeChat</label>
                <input type="text" value={form.contact_wechat} onChange={set('contact_wechat')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>LINE ID</label>
                <input type="text" value={form.contact_line} onChange={set('contact_line')} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.contact_email} onChange={set('contact_email')} />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ maxWidth: '800px', margin: '0 auto 16px', padding: '12px 16px', background: '#fff5f5', border: '1px solid #fc8181', borderRadius: '8px', color: '#c53030' }}>
              {error}
            </div>
          )}

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? (lang === 'zh' ? '⏳ 提交中...' : '⏳ Submitting...') : (lang === 'zh' ? '🚀 提交房源' : '🚀 Submit Listing')}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
