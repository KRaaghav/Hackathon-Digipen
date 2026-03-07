import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Plus, Trash2, Clock, Tag, Sparkles, X, Check } from 'lucide-react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function Calendar({ calendarEvents, addCalendarEvent, removeCalendarEvent }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [view, setView] = useState('list') // 'list' | 'week'
  const [newEvent, setNewEvent] = useState({ title: '', category: 'Academic', description: '', meetingDay: 'Mondays', commitment: '', color: '#7c6af7' })

  const today = new Date()

  const COLORS = ['#7c6af7', '#f7a26a', '#6af7c8', '#f76a6a', '#6ab8f7', '#f76af7', '#f7f76a']
  const CATEGORIES = ['Academic', 'Sports', 'Arts', 'Community', 'Professional', 'Leadership', 'Personal']
  const DAYS_OF_WEEK = ['Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays', 'Flexible']

  const groupedByDay = DAYS_OF_WEEK.reduce((acc, day) => {
    const evs = calendarEvents.filter(e => e.meetingDay === day || (day === 'Flexible' && e.meetingDay === 'Flexible'))
    if (evs.length) acc[day] = evs
    return acc
  }, {})

  const handleAdd = () => {
    if (!newEvent.title.trim()) return
    addCalendarEvent({ ...newEvent, type: 'manual' })
    setNewEvent({ title: '', category: 'Academic', description: '', meetingDay: 'Mondays', commitment: '', color: '#7c6af7' })
    setShowAddModal(false)
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span className="chip chip-orange"><CalendarDays size={10} /> EC Calendar</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.3rem' }}>
              My EC Calendar
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {calendarEvents.length} {calendarEvents.length === 1 ? 'activity' : 'activities'} planned
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* View toggle */}
            <div style={{ display: 'flex', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '3px' }}>
              {['list', 'week'].map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: view === v ? 'var(--accent)' : 'transparent',
                  color: view === v ? 'white' : 'var(--text-muted)',
                  fontSize: '0.8rem', fontFamily: 'var(--font-display)', fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}>
                  {v === 'list' ? '≡ List' : '⊞ Week'}
                </button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} /> Add Activity
            </motion.button>
          </div>
        </div>

        {/* Empty state */}
        {calendarEvents.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>📅</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '0.75rem' }}>Your calendar is empty</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: 380, margin: '0 auto 1.5rem' }}>
              Add activities manually or explore extracurriculars to fill your schedule.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> Add Manually</button>
              <a href="/explore" className="btn btn-ghost" style={{ textDecoration: 'none' }}><Sparkles size={16} /> Explore ECs</a>
            </div>
          </motion.div>
        )}

        {/* List view */}
        {calendarEvents.length > 0 && view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {Object.entries(groupedByDay).map(([day, events]) => (
              <motion.div key={day} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {day}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{events.length}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
                  {events.map((ev, i) => (
                    <EventCard key={ev.id} event={ev} index={i} onRemove={() => removeCalendarEvent(ev.id)} />
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Events without specific day */}
            {calendarEvents.filter(e => !DAYS_OF_WEEK.includes(e.meetingDay)).length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Other</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
                  {calendarEvents.filter(e => !DAYS_OF_WEEK.includes(e.meetingDay)).map((ev, i) => (
                    <EventCard key={ev.id} event={ev} index={i} onRemove={() => removeCalendarEvent(ev.id)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Week view */}
        {calendarEvents.length > 0 && view === 'week' && (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(130px, 1fr))', gap: '0.5rem', minWidth: 900 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const fullDay = ['Mondays','Tuesdays','Wednesdays','Thursdays','Fridays','Saturdays','Sundays'][i]
                const dayEvents = calendarEvents.filter(e => e.meetingDay === fullDay)
                const isToday = today.getDay() === (i + 1) % 7
                return (
                  <div key={day}>
                    <div style={{
                      textAlign: 'center', padding: '10px 8px',
                      fontFamily: 'var(--font-display)', fontWeight: 700,
                      fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase',
                      color: isToday ? 'var(--accent)' : 'var(--text-muted)',
                      borderBottom: `2px solid ${isToday ? 'var(--accent)' : 'var(--border)'}`,
                      marginBottom: '0.5rem'
                    }}>
                      {day}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minHeight: 200 }}>
                      {dayEvents.map(ev => (
                        <motion.div
                          key={ev.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={{
                            padding: '8px 10px', borderRadius: '8px',
                            background: `${ev.color || '#7c6af7'}22`,
                            border: `1px solid ${ev.color || '#7c6af7'}44`,
                            borderLeft: `3px solid ${ev.color || '#7c6af7'}`,
                            cursor: 'default'
                          }}
                        >
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.75rem', color: 'var(--text)', marginBottom: '2px', lineHeight: 1.3 }}>
                            {ev.title}
                          </div>
                          {ev.commitment && <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{ev.commitment}</div>}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </motion.div>

      {/* Add event modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={e => e.target === e.currentTarget && setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: 480, boxShadow: 'var(--shadow-lg)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem' }}>Add Activity</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '8px' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Activity Name *</label>
                  <input className="input" placeholder="e.g. Chess Club" value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Category</label>
                    <select className="input" value={newEvent.category} onChange={e => setNewEvent(p => ({ ...p, category: e.target.value }))}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Meeting Day</label>
                    <select className="input" value={newEvent.meetingDay} onChange={e => setNewEvent(p => ({ ...p, meetingDay: e.target.value }))}>
                      {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Commitment</label>
                  <input className="input" placeholder="e.g. 2-3 hrs/week" value={newEvent.commitment} onChange={e => setNewEvent(p => ({ ...p, commitment: e.target.value }))} />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Description (optional)</label>
                  <input className="input" placeholder="Brief description..." value={newEvent.description} onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))} />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 500 }}>Color</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setNewEvent(p => ({ ...p, color: c }))} style={{
                        width: 28, height: 28, borderRadius: '8px', background: c, border: `2px solid ${newEvent.color === c ? 'white' : 'transparent'}`,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease'
                      }}>
                        {newEvent.color === c && <Check size={12} color="white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleAdd} disabled={!newEvent.title.trim()}>
                  <Plus size={16} /> Add to Calendar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EventCard({ event, index, onRemove }) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.04 }}
      style={{
        background: 'var(--bg3)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '1rem',
        borderLeft: `4px solid ${event.color || '#7c6af7'}`,
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        transition: 'all 0.2s ease'
      }}
      onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
      onMouseOut={e => e.currentTarget.style.borderLeftColor = event.color || '#7c6af7'}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {event.title}
          </span>
          {event.type === 'extracurricular' && (
            <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '100px', background: 'var(--accent-glow)', color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 600, flexShrink: 0 }}>
              AI Added
            </span>
          )}
        </div>
        {event.description && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 6px', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {event.description}
          </p>
        )}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {event.commitment && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              <Clock size={10} /> {event.commitment}
            </span>
          )}
          {event.category && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              <Tag size={10} /> {event.category}
            </span>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showConfirm ? (
          <motion.div key="confirm" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            <button onClick={onRemove} style={{ padding: '5px 10px', borderRadius: '7px', background: 'rgba(247,106,106,0.2)', border: '1px solid rgba(247,106,106,0.4)', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}>Yes</button>
            <button onClick={() => setShowConfirm(false)} style={{ padding: '5px 10px', borderRadius: '7px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.72rem' }}>No</button>
          </motion.div>
        ) : (
          <motion.button key="trash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowConfirm(true)}
            style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(247,106,106,0.15)'; e.currentTarget.style.color = 'var(--danger)' }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-dim)' }}>
            <Trash2 size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}