import { useState } from 'react'
import { t } from '../i18n'

export default function PublishPage({ lang }) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
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
            <button
              className="btn-submit"
              style={{ maxWidth: '300px', margin: '24px auto 0' }}
              onClick={() => setSubmitted(false)}
            >
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
                <select required>
                  <option value="">{lang === 'zh' ? '请选择' : 'Select...'}</option>
                  <option value="office">{t(lang, 'types.office')}</option>
                  <option value="warehouse">{t(lang, 'types.warehouse')}</option>
                  <option value="shop">{t(lang, 'types.shop')}</option>
                  <option value="condo">{t(lang, 'types.condo')}</option>
                  <option value="villa">{t(lang, 'types.villa')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '租售类型 *' : 'Listing Type *'}</label>
                <select required>
                  <option value="rent">{lang === 'zh' ? '出租' : 'For Rent'}</option>
                  <option value="sale">{lang === 'zh' ? '出售' : 'For Sale'}</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '标题（中文）*' : 'Title (Chinese) *'}</label>
                <input type="text" placeholder={lang === 'zh' ? '例如：Sathorn甲级写字楼60sqm' : 'e.g. Sathorn Grade A Office 60sqm'} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '标题（英文）*' : 'Title (English) *'}</label>
                <input type="text" placeholder="e.g. Sathorn Grade A Office 60sqm" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '描述（中文）' : 'Description (Chinese)'}</label>
                <textarea placeholder={lang === 'zh' ? '详细描述房源特点、周边配套、交通等...' : 'Describe features, nearby facilities, transport...'}></textarea>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '描述（英文）' : 'Description (English)'}</label>
                <textarea placeholder="Describe features, nearby facilities, transport..."></textarea>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-card">
            <h2>{lang === 'zh' ? '📍 位置信息' : '📍 Location'}</h2>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '城市 *' : 'City *'}</label>
                <select required>
                  <option value="bangkok">Bangkok</option>
                  <option value="pattaya">Pattaya</option>
                  <option value="chiangmai">Chiang Mai</option>
                  <option value="phuket">Phuket</option>
                </select>
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '区域 *' : 'District *'}</label>
                <select required>
                  <option value="">Select...</option>
                  <option>Sathorn</option>
                  <option>Asoke</option>
                  <option>Rama 9</option>
                  <option>Sukhumvit</option>
                  <option>Silom</option>
                  <option>Bangna</option>
                  <option>Lat Krabang</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '详细地址' : 'Address'}</label>
                <input type="text" placeholder={lang === 'zh' ? '楼宇名称、街道、门牌号' : 'Building, Street, Number'} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '近BTS/MRT站' : 'Nearest BTS/MRT'}</label>
                <input type="text" placeholder="e.g. BTS Chong Nonsi" />
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '步行距离（分钟）' : 'Walking Distance (min)'}</label>
                <input type="number" placeholder="5" />
              </div>
            </div>
          </div>

          {/* Price & Size */}
          <div className="form-card">
            <h2>{lang === 'zh' ? '💰 价格与面积' : '💰 Price & Size'}</h2>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '月租金（泰铢）*' : 'Monthly Rent (THB) *'}</label>
                <input type="number" placeholder="45000" required />
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '面积（平方米）*' : 'Area (sqm) *'}</label>
                <input type="number" placeholder="60" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '押金' : 'Deposit'}</label>
                <select>
                  <option>2 months</option>
                  <option>3 months</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '管理费（泰铢/sqm/月）' : 'CAM Fee (THB/sqm/mo)'}</label>
                <input type="number" placeholder="180" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '楼层' : 'Floor'}</label>
                <input type="text" placeholder="15F" />
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '最短租期' : 'Min. Lease'}</label>
                <select>
                  <option>1 year</option>
                  <option>2 years</option>
                  <option>3 years</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '停车位' : 'Parking Spots'}</label>
                <input type="number" placeholder="2" />
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '装修情况' : 'Condition'}</label>
                <select>
                  <option>{lang === 'zh' ? '精装修带家具' : 'Furnished'}</option>
                  <option>{lang === 'zh' ? '精装修不带家具' : 'Fitted, no furniture'}</option>
                  <option>{lang === 'zh' ? '毛坯' : 'Bare shell'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="form-card">
            <h2>{lang === 'zh' ? '📷 图片上传' : '📷 Photos'}</h2>
            <div className="upload-zone">
              <p style={{ fontSize: '32px', marginBottom: '8px' }}>📁</p>
              <p>{lang === 'zh' ? '点击或拖拽上传图片（最多20张）' : 'Click or drag to upload photos (max 20)'}</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>{lang === 'zh' ? '支持 JPG, PNG, WEBP，单张不超过5MB' : 'JPG, PNG, WEBP — max 5MB each'}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="form-card">
            <h2>{lang === 'zh' ? '📞 联系方式' : '📞 Contact Info'}</h2>
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'zh' ? '联系人姓名 *' : 'Contact Name *'}</label>
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>{lang === 'zh' ? '联系电话 *' : 'Phone *'}</label>
                <input type="tel" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>WhatsApp</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>WeChat</label>
                <input type="text" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>LINE ID</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" />
              </div>
            </div>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button type="submit" className="btn-submit">
              {lang === 'zh' ? '🚀 提交房源' : '🚀 Submit Listing'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
