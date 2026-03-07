import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, Plus, Check, MapPin, Clock, Users, Star, Filter, Loader } from 'lucide-react'

export default function Extracurriculars({ userProfile, addCalendarEvent, calendarEvents }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [addedIds, setAddedIds] = useState(new Set())
  const [activeFilter, setActiveFilter] = useState('All')

  const FILTERS = ['All', 'Academic', 'Sports', 'Arts', 'Community', 'Professional', 'Leadership']
  const alreadyInCalendar = (title) => calendarEvents.some(e => e.title === title)

  const getCategoryColor = (cat) => {
    const map = { Academic: '#7c6af7', Sports: '#f76a6a', Arts: '#f7a26a', Community: '#6af7a2', Professional: '#6ab8f7', Leadership: '#f76af7' }
    return map[cat] || '#7c6af7'
  }

  const handleSearch = async (customQuery) => {
    const searchQ = customQuery || query
    setLoading(true); setHasSearched(true); setResults([])
    // Use fallback data without API call (to avoid CORS/auth issues)
    setResults([
      { title: "Computer Science Club", category: "Academic", description: "Collaborate on projects, hackathons, and competitive programming.", commitment: "3 hrs/week", teamSize: "50-100 members", rating: 4.8, meetingDay: "Wednesdays", skills: ["Problem Solving", "Teamwork", "Coding"], why: "Directly boosts technical skills and networking." },
      { title: "Undergraduate Research Program", category: "Academic", description: "Work alongside faculty on cutting-edge research projects.", commitment: "8-10 hrs/week", teamSize: "5-15 members", rating: 4.9, meetingDay: "Flexible", skills: ["Research", "Critical Thinking", "Writing"], why: "Essential for graduate school applications." },
      { title: "Student Government Association", category: "Leadership", description: "Represent student interests and shape campus policies.", commitment: "5 hrs/week", teamSize: "30-60 members", rating: 4.6, meetingDay: "Mondays", skills: ["Leadership", "Public Speaking", "Advocacy"], why: "Builds leadership skills valued by employers." },
      { title: "Volunteer Tutoring Corps", category: "Community", description: "Tutor local high school students in STEM subjects.", commitment: "2 hrs/week", teamSize: "20-40 members", rating: 4.7, meetingDay: "Saturdays", skills: ["Communication", "Mentorship", "Patience"], why: "Strengthens your own knowledge while giving back." },
      { title: "Entrepreneurship Club", category: "Professional", description: "Build startup ideas, pitch competitions, and connect with founders.", commitment: "4 hrs/week", teamSize: "40-80 members", rating: 4.8, meetingDay: "Thursdays", skills: ["Entrepreneurship", "Pitching", "Networking"], why: "Perfect for entrepreneurial career goals." },
      { title: "Photography & Media Society", category: "Arts", description: "Document campus life, learn editing, and build a creative portfolio.", commitment: "2-3 hrs/week", teamSize: "25-50 members", rating: 4.5, meetingDay: "Fridays", skills: ["Creativity", "Visual Storytelling", "Design"], why: "Great creative outlet to balance academic stress." }
    ])
    setLoading(false)
  }

  const handleAdd = (activity) => {
    if (alreadyInCalendar(activity.title)) return
    addCalendarEvent({ title: activity.title, category: activity.category, description: activity.description, commitment: activity.commitment, meetingDay: activity.meetingDay, color: getCategoryColor(activity.category), type: 'extracurricular' })
    setAddedIds(prev => new Set([...prev, activity.title]))
  }

  const filtered = activeFilter === 'All' ? results : results.filter(r => r.category === activeFilter)

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <span className="chip chip-accent"><Sparkles size={10} /> AI Discovery</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
            Explore Extracurriculars
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500 }}>Ask AI to find the perfect activities for your major, goals, and schedule.</p>
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input className="input" style={{ paddingLeft: '42px' }} placeholder={`Find ECs for ${userProfile?.major || 'your major'}...`} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-primary" onClick={() => handleSearch()} disabled={loading}>
              {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />}
              {loading ? 'Finding...' : 'Find ECs'}
            </motion.button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Try:</span>
            {[`Best ECs for ${userProfile?.major || 'CS'} students`, 'Leadership opportunities', 'ECs for grad school', 'Community service'].map(p => (
              <button key={p} onClick={() => { setQuery(p); handleSearch(p) }} style={{ padding: '5px 12px', borderRadius: '100px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'var(--font-body)' }}
                onMouseOver={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)' }}
                onMouseOut={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)' }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {results.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={15} style={{ color: 'var(--text-dim)' }} />
            {FILTERS.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{ padding: '5px 14px', borderRadius: '100px', border: `1.5px solid ${activeFilter === f ? 'var(--accent)' : 'var(--border)'}`, background: activeFilter === f ? 'var(--accent-glow)' : 'transparent', color: activeFilter === f ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 500, transition: 'all 0.2s ease' }}>
                {f}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
                <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: 14, width: '100%', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: 14, width: '80%' }} />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
            {filtered.map((ec, i) => <ECCard key={ec.title} ec={ec} index={i} isAdded={addedIds.has(ec.title) || alreadyInCalendar(ec.title)} onAdd={() => handleAdd(ec)} color={getCategoryColor(ec.category)} />)}
          </div>
        )}

        {!loading && !hasSearched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Ready to discover your extracurriculars?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Ask AI to find activities tailored to your major and goals.</p>
            <button className="btn btn-primary" onClick={() => handleSearch()}><Sparkles size={16} /> Show me ECs for my major</button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

function ECCard({ ec, index, isAdded, onAdd, color }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.06 }}
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden', transition: 'border-color 0.25s ease' }}
      onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
      onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '16px 16px 0 0' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 600, background: `${color}22`, color, border: `1px solid ${color}44` }}>{ec.category}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={11} fill="var(--accent2)" color="var(--accent2)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--accent2)', fontWeight: 600 }}>{ec.rating}</span>
            </div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', lineHeight: 1.3 }}>{ec.title}</h3>
        </div>
        <motion.button whileHover={{ scale: 1.15, rotate: isAdded ? 0 : 45 }} whileTap={{ scale: 0.9 }}
          onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
          onClick={onAdd} disabled={isAdded}
          style={{ width: 38, height: 38, borderRadius: '12px', flexShrink: 0, border: `2px solid ${isAdded ? 'var(--success)' : hovered ? color : 'var(--border)'}`, background: isAdded ? 'rgba(106,247,162,0.15)' : hovered ? `${color}22` : 'transparent', color: isAdded ? 'var(--success)' : hovered ? color : 'var(--text-dim)', cursor: isAdded ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s ease' }}>
          {isAdded ? <Check size={16} /> : <Plus size={16} />}
        </motion.button>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{ec.description}</p>
      {ec.why && <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(124,106,247,0.08)', border: '1px solid rgba(124,106,247,0.15)' }}><p style={{ fontSize: '0.78rem', color: 'var(--accent)', margin: 0 }}>✨ {ec.why}</p></div>}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-dim)' }}><Clock size={12} /> {ec.commitment}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-dim)' }}><Users size={12} /> {ec.teamSize}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-dim)' }}><MapPin size={12} /> {ec.meetingDay}</div>
      </div>
      {ec.skills && <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{ec.skills.map(s => <span key={s} className="tag">{s}</span>)}</div>}
    </motion.div>
  )
}