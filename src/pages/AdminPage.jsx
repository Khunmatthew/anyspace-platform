import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { properties } from '../data/mockData'

// Mock data for admin
const mockInquiries = [
  { id: 1, name: '张先生', phone: '+86-138-xxxx-xxxx', email: 'zhang@qq.com', property: 'Sathorn Square 甲级写字楼', status: 'new', date: '2026-03-19', agent: '未分配' },
  { id: 2, name: 'Mr. Smith', phone: '+66-89-xxx-xxxx', email: 'smith@gmail.com', property: 'Bangna 物流仓库', status: 'contacted', date: '2026-03-18', agent: 'Tom Wang' },
  { id: 3, name: '李女士', phone: '+86-139-xxxx-xxxx', email: 'li@163.com', property: 'Asoke 临街商铺', status: 'viewing', date: '2026-03-17', agent: 'Lisa Chen' },
  { id: 4, name: '王总', phone: '+86-186-xxxx-xxxx', email: 'wang@company.cn', property: 'Rama 9 新CBD 甲级办公', status: 'negotiating', date: '2026-03-16', agent: 'Tom Wang' },
  { id: 5, name: 'David Chen', phone: '+66-81-xxx-xxxx', email: 'david@outlook.com', property: 'The Line Sukhumvit 2BR', status: 'closed', date: '2026-03-15', agent: 'May Zhang' },
]

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

  if (!user) {
    navigate('/login')
    return null
  }

  // Role-based menu
  const menuItems = [
    { key: 'dashboard', icon: '📊', label: '数据概览', en: 'Dashboard', roles: ['admin', 'staff', 'agent'] },
    { key: 'properties', icon: '🏢', label: '房源管理', en: 'Properties', roles: ['admin', 'staff', 'agent'] },
    { key: 'inquiries', icon: '📋', label: '询盘管理', en: 'Inquiries', roles: ['admin', 'staff', 'agent'] },
    { key: 'users', icon: '👥', label: '用户管理', en: 'Users', roles: ['admin'] },
    { key: 'agents', icon: '🤝', label: '中介管理', en: 'Agents', roles: ['admin', 'staff'] },
    { key: 'content', icon: '📝', label: '内容管理', en: 'Content', roles: ['admin', 'staff'] },
    { key: 'ads', icon: '📢', label: '广告位管理', en: 'Ads', roles: ['admin'] },
    { key: 'seo', icon: '🔍', label: 'SEO管理', en: 'SEO', roles: ['admin', 'staff'] },
    { key: 'settings', icon: '⚙️', label: '系统设置', en: 'Settings', roles: ['admin'] },
  ]

  const visibleMenu = menuItems.filter(m => m.roles.includes(user.role))

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-logo" onClick={() => navigate('/')}>
          Any<span>Space</span>
        </div>
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
            <button
              key={item.key}
              className={`admin-nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {lang === 'zh' ? item.label : item.en}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-nav-item" onClick={() => navigate('/')}>
            <span className="admin-nav-icon">🌐</span>
            {lang === 'zh' ? '前往网站' : 'View Site'}
          </button>
          <button className="admin-nav-item" onClick={onLogout}>
            <span className="admin-nav-icon">🚪</span>
            {lang === 'zh' ? '退出登录' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {visibleMenu.find(m => m.key === activeTab)?.icon}{' '}
            {lang === 'zh'
              ? visibleMenu.find(m => m.key === activeTab)?.label
              : visibleMenu.find(m => m.key === activeTab)?.en
            }
          </h1>
          <div className="admin-header-right">
            <span style={{ fontSize: '13px', color: '#718096' }}>2026-03-19</span>
          </div>
        </header>

        <div className="admin-content">
          {activeTab === 'dashboard' && <DashboardPanel lang={lang} user={user} />}
          {activeTab === 'properties' && <PropertiesPanel lang={lang} user={user} />}
          {activeTab === 'inquiries' && <InquiriesPanel lang={lang} user={user} filter={inquiryFilter} setFilter={setInquiryFilter} />}
          {activeTab === 'users' && <UsersPanel lang={lang} />}
          {activeTab === 'agents' && <AgentsPanel lang={lang} />}
          {activeTab === 'content' && <ContentPanel lang={lang} />}
          {activeTab === 'ads' && <PlaceholderPanel icon="📢" title={lang === 'zh' ? '广告位管理' : 'Ad Management'} />}
          {activeTab === 'seo' && <PlaceholderPanel icon="🔍" title={lang === 'zh' ? 'SEO管理' : 'SEO Management'} />}
          {activeTab === 'settings' && <PlaceholderPanel icon="⚙️" title={lang === 'zh' ? '系统设置' : 'System Settings'} />}
        </div>
      </main>
    </div>
  )
}

function DashboardPanel({ lang, user }) {
  const stats = user.role === 'agent'
    ? [
        { label: '我的房源', en: 'My Listings', value: '12', icon: '🏢', color: '#3182ce' },
        { label: '我的询盘', en: 'My Inquiries', value: '8', icon: '📋', color: '#dd6b20' },
        { label: '本月成交', en: 'Monthly Deals', value: '2', icon: '✅', color: '#38a169' },
        { label: '佣金收入', en: 'Commission', value: '฿45,000', icon: '💰', color: '#805ad5' },
      ]
    : [
        { label: '总房源数', en: 'Total Listings', value: '1,248', icon: '🏢', color: '#3182ce' },
        { label: '本月新增询盘', en: 'New Inquiries', value: '156', icon: '📋', color: '#dd6b20' },
        { label: '活跃用户', en: 'Active Users', value: '3,420', icon: '👥', color: '#38a169' },
        { label: '本月成交', en: 'Deals This Month', value: '23', icon: '✅', color: '#805ad5' },
        { label: '合作中介', en: 'Partner Agents', value: '45', icon: '🤝', color: '#c9a96e' },
        { label: '平台收入', en: 'Revenue', value: '฿289K', icon: '💰', color: '#e53e3e' },
      ]

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
          <table className="admin-table">
            <thead>
              <tr>
                <th>{lang === 'zh' ? '客户' : 'Client'}</th>
                <th>{lang === 'zh' ? '物业' : 'Property'}</th>
                <th>{lang === 'zh' ? '状态' : 'Status'}</th>
                <th>{lang === 'zh' ? '日期' : 'Date'}</th>
              </tr>
            </thead>
            <tbody>
              {mockInquiries.slice(0, 5).map(inq => (
                <tr key={inq.id}>
                  <td><strong>{inq.name}</strong></td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.property}</td>
                  <td>
                    <span className="status-badge" style={{ background: statusMap[inq.status].color + '15', color: statusMap[inq.status].color }}>
                      {statusMap[inq.status].zh}
                    </span>
                  </td>
                  <td>{inq.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <h3>{lang === 'zh' ? '待审核房源' : 'Pending Listings'}</h3>
          <div className="pending-list">
            {[
              { title: 'Sukhumvit Soi 23 商铺 80sqm', by: '泰好地产', time: '2小时前' },
              { title: 'Rama 3 仓库 1200sqm', by: '曼谷房产通', time: '4小时前' },
              { title: 'Silom Tower 15F 办公室', by: 'Lisa Chen', time: '昨天' },
            ].map((item, i) => (
              <div key={i} className="pending-item">
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>{lang === 'zh' ? '提交者' : 'By'}: {item.by} · {item.time}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="admin-btn-sm admin-btn-success">{lang === 'zh' ? '通过' : 'Approve'}</button>
                  <button className="admin-btn-sm admin-btn-danger">{lang === 'zh' ? '拒绝' : 'Reject'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PropertiesPanel({ lang, user }) {
  const [statusFilter, setStatusFilter] = useState('all')

  const propertyList = properties.map((p, i) => ({
    ...p,
    status: ['active', 'active', 'active', 'pending', 'inactive', 'active'][i] || 'active',
    views: [1240, 890, 2100, 560, 780, 1560][i],
    inquiries: [15, 8, 22, 3, 6, 12][i],
    publishedBy: ['Lisa Chen', 'Tom Wang', 'Lisa Chen', 'May Zhang', 'May Zhang', 'Tom Wang'][i],
  }))

  const pStatusMap = {
    active: { zh: '上架中', color: '#38a169' },
    pending: { zh: '审核中', color: '#dd6b20' },
    inactive: { zh: '已下架', color: '#718096' },
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'active', 'pending', 'inactive'].map(s => (
            <button
              key={s}
              className={`admin-filter-btn ${statusFilter === s ? 'active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'all' ? (lang === 'zh' ? '全部' : 'All') : pStatusMap[s]?.zh}
            </button>
          ))}
        </div>
        <button className="admin-btn-primary">{lang === 'zh' ? '+ 添加房源' : '+ Add Listing'}</button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{lang === 'zh' ? '房源' : 'Property'}</th>
              <th>{lang === 'zh' ? '类型' : 'Type'}</th>
              <th>{lang === 'zh' ? '价格' : 'Price'}</th>
              <th>{lang === 'zh' ? '浏览' : 'Views'}</th>
              <th>{lang === 'zh' ? '询盘' : 'Inquiries'}</th>
              <th>{lang === 'zh' ? '发布者' : 'Publisher'}</th>
              <th>{lang === 'zh' ? '状态' : 'Status'}</th>
              <th>{lang === 'zh' ? '操作' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {propertyList
              .filter(p => statusFilter === 'all' || p.status === statusFilter)
              .map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={p.image} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ maxWidth: '200px' }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.title.zh}
                        </div>
                        <div style={{ fontSize: '11px', color: '#718096' }}>{p.location.zh}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.type}</td>
                  <td style={{ fontWeight: 600 }}>฿{p.price.toLocaleString()}</td>
                  <td>{p.views}</td>
                  <td>{p.inquiries}</td>
                  <td>{p.publishedBy}</td>
                  <td>
                    <span className="status-badge" style={{ background: pStatusMap[p.status].color + '15', color: pStatusMap[p.status].color }}>
                      {pStatusMap[p.status].zh}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="admin-btn-sm">{lang === 'zh' ? '编辑' : 'Edit'}</button>
                      <button className="admin-btn-sm admin-btn-danger">{lang === 'zh' ? '下架' : 'Hide'}</button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function InquiriesPanel({ lang, user, filter, setFilter }) {
  const filtered = filter === 'all' ? mockInquiries : mockInquiries.filter(i => i.status === filter)

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'new', 'contacted', 'viewing', 'negotiating', 'closed'].map(s => (
          <button
            key={s}
            className={`admin-filter-btn ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? (lang === 'zh' ? '全部' : 'All') : statusMap[s]?.zh}
            {s === 'new' && ' (1)'}
          </button>
        ))}
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{lang === 'zh' ? '客户姓名' : 'Client'}</th>
              <th>{lang === 'zh' ? '联系方式' : 'Contact'}</th>
              <th>{lang === 'zh' ? '意向物业' : 'Property'}</th>
              <th>{lang === 'zh' ? '分配顾问' : 'Agent'}</th>
              <th>{lang === 'zh' ? '状态' : 'Status'}</th>
              <th>{lang === 'zh' ? '时间' : 'Date'}</th>
              <th>{lang === 'zh' ? '操作' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inq => (
              <tr key={inq.id}>
                <td>#{inq.id}</td>
                <td><strong>{inq.name}</strong></td>
                <td>
                  <div style={{ fontSize: '12px' }}>{inq.phone}</div>
                  <div style={{ fontSize: '11px', color: '#718096' }}>{inq.email}</div>
                </td>
                <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.property}</td>
                <td>
                  {inq.agent === '未分配'
                    ? <span style={{ color: '#e53e3e', fontWeight: 600 }}>{inq.agent}</span>
                    : inq.agent
                  }
                </td>
                <td>
                  <span className="status-badge" style={{ background: statusMap[inq.status].color + '15', color: statusMap[inq.status].color }}>
                    {statusMap[inq.status].zh}
                  </span>
                </td>
                <td>{inq.date}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="admin-btn-sm">{lang === 'zh' ? '查看' : 'View'}</button>
                    {user.role !== 'agent' && inq.agent === '未分配' && (
                      <button className="admin-btn-sm admin-btn-success">{lang === 'zh' ? '分配' : 'Assign'}</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UsersPanel({ lang }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px' }}>{lang === 'zh' ? '共 ' + mockUsers.length + ' 个用户' : mockUsers.length + ' users total'}</h3>
        <button className="admin-btn-primary">{lang === 'zh' ? '+ 添加用户' : '+ Add User'}</button>
      </div>
      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{lang === 'zh' ? '姓名' : 'Name'}</th>
              <th>{lang === 'zh' ? '邮箱' : 'Email'}</th>
              <th>{lang === 'zh' ? '角色' : 'Role'}</th>
              <th>{lang === 'zh' ? '状态' : 'Status'}</th>
              <th>{lang === 'zh' ? '注册时间' : 'Created'}</th>
              <th>{lang === 'zh' ? '操作' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(u => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>
                  <span className="status-badge" style={{ background: roleMap[u.role].color + '15', color: roleMap[u.role].color }}>
                    {lang === 'zh' ? roleMap[u.role].zh : roleMap[u.role].en}
                  </span>
                </td>
                <td>
                  <span className="status-badge" style={{
                    background: u.status === 'active' ? '#38a16915' : '#dd6b2015',
                    color: u.status === 'active' ? '#38a169' : '#dd6b20'
                  }}>
                    {u.status === 'active' ? (lang === 'zh' ? '正常' : 'Active') : (lang === 'zh' ? '待审核' : 'Pending')}
                  </span>
                </td>
                <td>{u.created}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="admin-btn-sm">{lang === 'zh' ? '编辑' : 'Edit'}</button>
                    {u.status === 'pending' && (
                      <button className="admin-btn-sm admin-btn-success">{lang === 'zh' ? '审核' : 'Approve'}</button>
                    )}
                  </div>
                </td>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px' }}>{lang === 'zh' ? '合作中介管理' : 'Partner Agent Management'}</h3>
        <button className="admin-btn-primary">{lang === 'zh' ? '+ 邀请中介' : '+ Invite Agent'}</button>
      </div>
      <div className="admin-grid-3">
        {agents.map(a => (
          <div key={a.id} className="admin-card agent-profile-card">
            <div className="agent-profile-avatar">{a.name[0]}</div>
            <h3>{a.name}</h3>
            <p>{a.email}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '12px 0', fontSize: '13px' }}>
              <div><strong>{Math.floor(Math.random() * 20 + 5)}</strong><br />{lang === 'zh' ? '房源' : 'Listings'}</div>
              <div><strong>{Math.floor(Math.random() * 15 + 2)}</strong><br />{lang === 'zh' ? '询盘' : 'Inquiries'}</div>
              <div><strong>{Math.floor(Math.random() * 5 + 1)}</strong><br />{lang === 'zh' ? '成交' : 'Deals'}</div>
            </div>
            <span className="status-badge" style={{
              background: a.status === 'active' ? '#38a16915' : '#dd6b2015',
              color: a.status === 'active' ? '#38a169' : '#dd6b20'
            }}>
              {a.status === 'active' ? (lang === 'zh' ? '合作中' : 'Active') : (lang === 'zh' ? '待审核' : 'Pending')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContentPanel({ lang }) {
  const articles = [
    { id: 1, title: '2026年曼谷写字楼租赁市场报告', status: 'published', date: '2026-03-15', views: 2340 },
    { id: 2, title: '泰国仓库选址指南：从邦纳到EEC', status: 'published', date: '2026-03-10', views: 1890 },
    { id: 3, title: '在泰国注册公司的办公地址要求', status: 'draft', date: '2026-03-18', views: 0 },
    { id: 4, title: 'Asoke vs Sathorn：办公区域对比分析', status: 'published', date: '2026-03-05', views: 3120 },
  ]
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px' }}>{lang === 'zh' ? '文章与资讯' : 'Articles & Content'}</h3>
        <button className="admin-btn-primary">{lang === 'zh' ? '+ 新建文章' : '+ New Article'}</button>
      </div>
      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{lang === 'zh' ? '标题' : 'Title'}</th>
              <th>{lang === 'zh' ? '状态' : 'Status'}</th>
              <th>{lang === 'zh' ? '浏览量' : 'Views'}</th>
              <th>{lang === 'zh' ? '日期' : 'Date'}</th>
              <th>{lang === 'zh' ? '操作' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(a => (
              <tr key={a.id}>
                <td>#{a.id}</td>
                <td><strong>{a.title}</strong></td>
                <td>
                  <span className="status-badge" style={{
                    background: a.status === 'published' ? '#38a16915' : '#dd6b2015',
                    color: a.status === 'published' ? '#38a169' : '#dd6b20'
                  }}>
                    {a.status === 'published' ? (lang === 'zh' ? '已发布' : 'Published') : (lang === 'zh' ? '草稿' : 'Draft')}
                  </span>
                </td>
                <td>{a.views.toLocaleString()}</td>
                <td>{a.date}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="admin-btn-sm">{lang === 'zh' ? '编辑' : 'Edit'}</button>
                    <button className="admin-btn-sm admin-btn-danger">{lang === 'zh' ? '删除' : 'Delete'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
