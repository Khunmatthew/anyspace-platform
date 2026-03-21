import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { mapProperty } from '../lib/mapProperty'

const mockUsers = [
  { id: 1, name: 'Admin', email: 'admin@anyspace.th', role: 'admin', status: 'active', created: '2026-01-01' },
  { id: 2, name: 'Lisa Chen', email: 'lisa@anyspace.th', role: 'staff', status: 'active', created: '2026-01-15' },
  { id: 3, name: 'Tom Wang', email: 'tom@anyspace.th', role: 'staff', status: 'active', created: '2026-02-01' },
  { id: 4, name: 'May Zhang', email: 'may@anyspace.th', role: 'agent', status: 'active', created: '2026-02-10' },
  { id: 5, name: '泰好地产', email: 'partner@thaigood.com', role: 'agent', status: 'active', created: '2026-02-20' },
  { id: 6, name: '曼谷房产通', email: 'info@bkkproperty.com', role: 'agent', status: 'pending', created: '2026-03-10' },
]

const statusMap = {
  new: { zh: '新询盘', color: '#e53e3e' },
  contacted: { zh: '已联系', color: '#dd6b20' },
  viewing: { zh: '已看房', color: '#3182ce' },
  negotiating: { zh: '谈判中', color: '#805ad5' },
  closed: { zh: '已成交', color: '#38a169' },
}

const roleMap = {
  admin: { zh: '超级管理员', en: 'Admin', color: '#e53e3e' },
  staff: { zh: '运营员工', en: 'Staff', color: '#3182ce' },
  agent: { zh: '合作中介', en: 'Agent', color: '#38a169' },
}

export default function AdminPage({ lang, user, onLogout }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [inquiryFilter, setInquiryFilter] = useState('all')

  if (!user) { navigate('/login'); return null }

  const menuItems = [
    { key: 'dashboard', icon: '📊', label: '数据概览', en: 'Dashboard', roles: ['admin', 'staff', 'agent'] },
    { key: 'properties', icon: '🏢', label: '房源管理', en: 'Properties', roles: ['admin', 'staff', 'agent'] },
    { key: 'inquiries', icon: '📋', label: '询盘管理', en: 'Inquiries', roles: ['admin', 'staff', 'agent'] },
    { key: 'users', icon: '👥', label: '用户管理', en: 'Users', roles: ['admin'] },
    { key: 'agents', icon: '🤝', label: '中介管理', en: 'Agents', roles: ['admin', 'staff'] },
    { key: 'content', icon: '📝', label: '内容管理', en: 'Content', roles: ['admin', 'staff'] },
    { key: 'ads', icon: '📢', label: '广告位管理', en: 'Ads', roles: ['admin'] },
    { key: 'settings', icon: '⚙️', label: '系统设置', en: 'Settings', roles: ['admin'] },
  ]

  const visibleMenu = menuItems.filter(m => m.roles.includes(user.role))

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo" onClick={() => navigate('/')}>Any<span>Space</span></div>
        <div className="admin-user-card">
          <div className="admin-user-avatar">{user.name[0]}</div>
          <div>
            <div className="admin-user-name">{user.name}</div>
            <div className="admin-user-role" style={{ color: roleMap[user.role]?.color }}>
              {lang === 'zh' ? roleMap[user.role]?.zh : roleMap[user.role]?.en}
            </div>
          </div>
        </div>
        <nav className="admin-nav">
          {visibleMenu.map(item => (
            <button key={item.key} className={`admin-nav-item ${activeTab === item.key ? 'active' : ''}`} onClick={() => setActiveTab(item.key)}>
              <span className="admin-nav-icon">{item.icon}</span>
              {lang === 'zh' ? item.label : item.en}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-nav-item" onClick={() => navigate('/')}><span className="admin-nav-icon">🌐</span>{lang === 'zh' ? '前往网站' : 'View Site'}</button>
          <button className="admin-nav-item" onClick={onLogout}><span className="admin-nav-icon">🚪</span>{lang === 'zh' ? '退出登录' : 'Logout'}</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {visibleMenu.find(m => m.key === activeTab)?.icon}{' '}
            {lang === 'zh' ? visibleMenu.find(m => m.key === activeTab)?.label : visibleMenu.find(m => m.key === activeTab)?.en}
          </h1>
          <div className="admin-header-right">
            <span style={{ fontSize: '13px', color: '#718096' }}>{new Date().toLocaleDateString('zh-CN')}</span>
          </div>
        </header>

        <div className="admin-content">
          {activeTab === 'dashboard' && <DashboardPanel lang={lang} user={user} />}
          {activeTab === 'properties' && <PropertiesPanel lang={lang} user={user} />}
          {activeTab === 'inquiries' && <InquiriesPanel lang={lang} user={user} filter={inquiryFilter} setFilter={setInquiryFilter} />}
          {activeTab === 'users' && <UsersPanel lang={lang} />}
          {activeTab === 'agents' && <AgentsPanel lang={lang} />}
          {activeTab === 'content' && <PlaceholderPanel icon="📝" title={lang === 'zh' ? '内容管理' : 'Content'} />}
          {activeTab === 'ads' && <PlaceholderPanel icon="📢" title={lang === 'zh' ? '广告位管理' : 'Ad Management'} />}
          {activeTab === 'settings' && <PlaceholderPanel icon="⚙️" title={lang === 'zh' ? '系统设置' : 'System Settings'} />}
        </div>
      </main>
    </div>
  )
}

function DashboardPanel({ lang, user }) {
  const [counts, setCounts] = useState({ total: 0, active: 0, pending: 0, inquiries: 0 })
  const [recentInquiries, setRecentInquiries] = useState([])
  const [pendingProperties, setPendingProperties] = useState([])

  useEffect(() => {
    supabase.from('properties').select('status').then(({ data }) => {
      if (data) {
        setCounts(c => ({ ...c, total: data.length, active: data.filter(p => p.status === 'active').length, pending: data.filter(p => p.status === 'pending').length }))
      }
    })
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5).then(({ data }) => {
      if (data) setRecentInquiries(data)
    })
    supabase.from('properties').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(5).then(({ data }) => {
      if (data) setPendingProperties(data)
    })
    supabase.from('inquiries').select('id').then(({ data }) => {
      if (data) setCounts(c => ({ ...c, inquiries: data.length }))
    })
  }, [])

  const stats = user.role === 'agent'
    ? [
        { label: '活跃房源', en: 'Active Listings', value: counts.active, icon: '🏢', color: '#3182ce' },
        { label: '询盘总数', en: 'Total Inquiries', value: counts.inquiries, icon: '📋', color: '#dd6b20' },
        { label: '待审核', en: 'Pending Review', value: counts.pending, icon: '⏳', color: '#805ad5' },
      ]
    : [
        { label: '总房源数', en: 'Total Listings', value: counts.total, icon: '🏢', color: '#3182ce' },
        { label: '活跃房源', en: 'Active', value: counts.active, icon: '✅', color: '#38a169' },
        { label: '待审核', en: 'Pending Review', value: counts.pending, icon: '⏳', color: '#dd6b20' },
        { label: '总询盘数', en: 'Total Inquiries', value: counts.inquiries, icon: '📋', color: '#805ad5' },
      ]

  const approveProperty = async (id) => {
    await supabase.from('properties').update({ status: 'active' }).eq('id', id)
    setPendingProperties(p => p.filter(x => x.id !== id))
    setCounts(c => ({ ...c, pending: c.pending - 1, active: c.active + 1 }))
  }

  const rejectProperty = async (id) => {
    await supabase.from('properties').update({ status: 'rejected' }).eq('id', id)
    setPendingProperties(p => p.filter(x => x.id !== id))
    setCounts(c => ({ ...c, pending: c.pending - 1 }))
  }

  return (
    <div>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.color + '15', color: s.color }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{lang === 'zh' ? s.label : s.en}</div>
          </div>
        ))}
      </div>

      <div className="admin-grid-2">
        <div className="admin-card">
          <h3>{lang === 'zh' ? '最新询盘' : 'Recent Inquiries'}</h3>
          {recentInquiries.length === 0 ? (
            <p style={{ color: '#718096', fontSize: '14px' }}>{lang === 'zh' ? '暂无询盘' : 'No inquiries yet'}</p>
          ) : (
            <table className="admin-table">
              <thead><tr><th>{lang === 'zh' ? '客户' : 'Client'}</th><th>{lang === 'zh' ? '物业' : 'Property'}</th><th>{lang === 'zh' ? '时间' : 'Date'}</th></tr></thead>
              <tbody>
                {recentInquiries.map(inq => (
                  <tr key={inq.id}>
                    <td><strong>{inq.name}</strong><br /><small style={{ color: '#718096' }}>{inq.phone}</small></td>
                    <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.property_title || '-'}</td>
                    <td>{new Date(inq.created_at).toLocaleDateString('zh-CN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-card">
          <h3>{lang === 'zh' ? '待审核房源' : 'Pending Listings'}</h3>
          {pendingProperties.length === 0 ? (
            <p style={{ color: '#718096', fontSize: '14px' }}>{lang === 'zh' ? '暂无待审核房源' : 'No pending listings'}</p>
          ) : (
            <div className="pending-list">
              {pendingProperties.map(p => (
                <div key={p.id} className="pending-item">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{p.title_zh}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>{p.contact_name} · ฿{p.price?.toLocaleString()}/mo</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="admin-btn-sm admin-btn-success" onClick={() => approveProperty(p.id)}>{lang === 'zh' ? '通过' : 'Approve'}</button>
                    <button className="admin-btn-sm admin-btn-danger" onClick={() => rejectProperty(p.id)}>{lang === 'zh' ? '拒绝' : 'Reject'}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PropertiesPanel({ lang, user }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  const pStatusMap = {
    active: { zh: '上架中', color: '#38a169' },
    pending: { zh: '审核中', color: '#dd6b20' },
    rejected: { zh: '已拒绝', color: '#e53e3e' },
    inactive: { zh: '已下架', color: '#718096' },
  }

  const fetchProperties = async () => {
    setLoading(true)
    let q = supabase.from('properties').select('*').order('created_at', { ascending: false })
    if (statusFilter !== 'all') q = q.eq('status', statusFilter)
    const { data } = await q
    if (data) setProperties(data)
    setLoading(false)
  }

  useEffect(() => { fetchProperties() }, [statusFilter])

  const updateStatus = async (id, status) => {
    await supabase.from('properties').update({ status }).eq('id', id)
    fetchProperties()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'active', 'pending', 'rejected', 'inactive'].map(s => (
            <button key={s} className={`admin-filter-btn ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s === 'all' ? (lang === 'zh' ? '全部' : 'All') : pStatusMap[s]?.zh}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>加载中...</div>
        ) : properties.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>{lang === 'zh' ? '暂无房源' : 'No listings'}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{lang === 'zh' ? '房源' : 'Property'}</th>
                <th>{lang === 'zh' ? '类型' : 'Type'}</th>
                <th>{lang === 'zh' ? '价格' : 'Price'}</th>
                <th>{lang === 'zh' ? '联系人' : 'Contact'}</th>
                <th>{lang === 'zh' ? '提交时间' : 'Submitted'}</th>
                <th>{lang === 'zh' ? '状态' : 'Status'}</th>
                <th>{lang === 'zh' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {p.image && <img src={p.image} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                      <div style={{ maxWidth: '200px' }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title_zh}</div>
                        <div style={{ fontSize: '11px', color: '#718096' }}>{p.district}, {p.city}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.type}</td>
                  <td style={{ fontWeight: 600 }}>฿{p.price?.toLocaleString()}</td>
                  <td><div style={{ fontSize: '13px' }}>{p.contact_name}</div><div style={{ fontSize: '11px', color: '#718096' }}>{p.contact_phone}</div></td>
                  <td style={{ fontSize: '12px' }}>{new Date(p.created_at).toLocaleDateString('zh-CN')}</td>
                  <td>
                    <span className="status-badge" style={{ background: (pStatusMap[p.status]?.color || '#718096') + '15', color: pStatusMap[p.status]?.color || '#718096' }}>
                      {pStatusMap[p.status]?.zh || p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {p.status === 'pending' && (
                        <>
                          <button className="admin-btn-sm admin-btn-success" onClick={() => updateStatus(p.id, 'active')}>{lang === 'zh' ? '通过' : 'Approve'}</button>
                          <button className="admin-btn-sm admin-btn-danger" onClick={() => updateStatus(p.id, 'rejected')}>{lang === 'zh' ? '拒绝' : 'Reject'}</button>
                        </>
                      )}
                      {p.status === 'active' && (
                        <button className="admin-btn-sm admin-btn-danger" onClick={() => updateStatus(p.id, 'inactive')}>{lang === 'zh' ? '下架' : 'Unpublish'}</button>
                      )}
                      {(p.status === 'inactive' || p.status === 'rejected') && (
                        <button className="admin-btn-sm admin-btn-success" onClick={() => updateStatus(p.id, 'active')}>{lang === 'zh' ? '上架' : 'Publish'}</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function InquiriesPanel({ lang, user, filter, setFilter }) {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    let q = supabase.from('inquiries').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)
    q.then(({ data }) => { if (data) setInquiries(data); setLoading(false) })
  }, [filter])

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'new', 'contacted', 'viewing', 'negotiating', 'closed'].map(s => (
          <button key={s} className={`admin-filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? (lang === 'zh' ? '全部' : 'All') : statusMap[s]?.zh}
          </button>
        ))}
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>加载中...</div>
        ) : inquiries.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>{lang === 'zh' ? '暂无询盘' : 'No inquiries yet'}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{lang === 'zh' ? '客户' : 'Client'}</th>
                <th>{lang === 'zh' ? '联系方式' : 'Contact'}</th>
                <th>{lang === 'zh' ? '意向物业' : 'Property'}</th>
                <th>{lang === 'zh' ? '留言' : 'Message'}</th>
                <th>{lang === 'zh' ? '时间' : 'Date'}</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inq => (
                <tr key={inq.id}>
                  <td><strong>{inq.name}</strong></td>
                  <td>
                    <div style={{ fontSize: '12px' }}>{inq.phone}</div>
                    <div style={{ fontSize: '11px', color: '#718096' }}>{inq.email}</div>
                    {inq.wechat && <div style={{ fontSize: '11px', color: '#718096' }}>WeChat: {inq.wechat}</div>}
                  </td>
                  <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.property_title || '-'}</td>
                  <td style={{ maxWidth: '200px', fontSize: '12px', color: '#4a5568' }}>{inq.message || '-'}</td>
                  <td style={{ fontSize: '12px' }}>{new Date(inq.created_at).toLocaleDateString('zh-CN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function UsersPanel({ lang }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px' }}>{lang === 'zh' ? '共 ' + mockUsers.length + ' 个用户' : mockUsers.length + ' users total'}</h3>
      </div>
      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="admin-table">
          <thead><tr><th>ID</th><th>{lang === 'zh' ? '姓名' : 'Name'}</th><th>{lang === 'zh' ? '邮箱' : 'Email'}</th><th>{lang === 'zh' ? '角色' : 'Role'}</th><th>{lang === 'zh' ? '状态' : 'Status'}</th><th>{lang === 'zh' ? '注册时间' : 'Created'}</th></tr></thead>
          <tbody>
            {mockUsers.map(u => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td><span className="status-badge" style={{ background: roleMap[u.role].color + '15', color: roleMap[u.role].color }}>{lang === 'zh' ? roleMap[u.role].zh : roleMap[u.role].en}</span></td>
                <td><span className="status-badge" style={{ background: u.status === 'active' ? '#38a16915' : '#dd6b2015', color: u.status === 'active' ? '#38a169' : '#dd6b20' }}>{u.status === 'active' ? (lang === 'zh' ? '正常' : 'Active') : (lang === 'zh' ? '待审核' : 'Pending')}</span></td>
                <td>{u.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AgentsPanel({ lang }) {
  const agents = mockUsers.filter(u => u.role === 'agent')
  return (
    <div>
      <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>{lang === 'zh' ? '合作中介管理' : 'Partner Agent Management'}</h3>
      <div className="admin-grid-3">
        {agents.map(a => (
          <div key={a.id} className="admin-card agent-profile-card">
            <div className="agent-profile-avatar">{a.name[0]}</div>
            <h3>{a.name}</h3>
            <p>{a.email}</p>
            <span className="status-badge" style={{ background: a.status === 'active' ? '#38a16915' : '#dd6b2015', color: a.status === 'active' ? '#38a169' : '#dd6b20' }}>
              {a.status === 'active' ? (lang === 'zh' ? '合作中' : 'Active') : (lang === 'zh' ? '待审核' : 'Pending')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlaceholderPanel({ icon, title }) {
  return (
    <div className="admin-card" style={{ textAlign: 'center', padding: '60px' }}>
      <p style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</p>
      <h3 style={{ marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: '#718096' }}>Coming soon...</p>
    </div>
  )
}
