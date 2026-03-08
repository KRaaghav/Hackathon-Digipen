import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Plus, Trash2, Clock, Tag, Sparkles, X, Check, Heart, Wind } from 'lucide-react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const STRESS_LEVELS = ['Low', 'Medium', 'High']
const STRESS_COLORS = { Low: '#6af7c8', Medium: '#f7a26a', High: '#f76a6a' }
const STRESS_POINTS = { Low: 1, Medium: 2, High: 3 }

const WELLNESS_TIPS = [
  "Take deep breaths: Inhale for 4 counts, hold for 4, exhale for 6.",
  "Step away from screens for 10 minutes and go for a walk.",
  "Write down 3 things you're grateful for today.",
  "Talk to a friend about how you're feeling.",
  "Do something creative that brings you joy.",
  "Set a small, achievable goal for the day.",
  "Practice positive self-talk and be kind to yourself.",
  "Get enough sleep - aim for 8 hours tonight.",
  "Eat a healthy snack and stay hydrated.",
  "Listen to your favorite music and dance it out."
]

export default function Calendar({ calendarEvents, addCalendarEvent, removeCalendarEvent }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [view, setView] = useState('year') // 'year' | 'list' | 'week'
  const [newEvent, setNewEvent] = useState({ title: '', category: 'Academic', description: '', meetingDay: 'Mondays', commitment: '', color: '#7c6af7', stressLevel: 'Low', frequency: 'weekly', startDate: new Date().toISOString().split('T')[0] })
  const [currentTip, setCurrentTip] = useState(WELLNESS_TIPS[Math.floor(Math.random() * WELLNESS_TIPS.length)])
  const [selectedDate, setSelectedDate] = useState(null)

  const today = new Date()
  const currentYear = today.getFullYear()

  const COLORS = ['#7c6af7', '#f7a26a', '#6af7c8', '#f76a6a', '#6ab8f7', '#f76af7', '#f7f76a']
  const CATEGORIES = ['Academic', 'Sports', 'Arts', 'Community', 'Professional', 'Leadership', 'Personal']
  const DAYS_OF_WEEK = ['Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays', 'Flexible']

  // Helper function to check if event should appear on a given date
  const shouldShowEventOnDate = (event, date) => {
    const dayMap = {
      'Mondays': 1, 'Tuesdays': 2, 'Wednesdays': 3, 'Thursdays': 4,
      'Fridays': 5, 'Saturdays': 6, 'Sundays': 0
    }
    
    // Check if day of week matches
    if (event.meetingDay && event.meetingDay !== 'Flexible' && dayMap[event.meetingDay] !== date.getDay()) {
      return false
    }
    
    // Check frequency
    if (event.frequency === 'one-time') {
      const eventDate = event.startDate ? new Date(event.startDate) : new Date()
      return eventDate.toDateString() === date.toDateString()
    }
    
    if (event.frequency === 'weekly') {
      return true
    }
    
    if (event.frequency === 'biweekly') {
      const startDate = event.startDate ? new Date(event.startDate) : new Date()
      const diffTime = Math.abs(date - startDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const weeksDiff = Math.floor(diffDays / 7)
      return weeksDiff % 2 === 0
    }
    
    return true
  }

  const groupedByDay = DAYS_OF_WEEK.reduce((acc, day) => {
    const evs = calendarEvents.filter(e => e.meetingDay === day || (day === 'Flexible' && e.meetingDay === 'Flexible'))
    if (evs.length) acc[day] = evs
    return acc
  }, {})

  const getDayStress = (events) => {
    const total = events.reduce((sum, ev) => sum + (STRESS_POINTS[ev.stressLevel] || 1), 0)
    if (total <= 2) return { level: 'Low', color: STRESS_COLORS.Low }
    if (total <= 4) return { level: 'Medium', color: STRESS_COLORS.Medium }
    return { level: 'High', color: STRESS_COLORS.High }
  }

  const getDayTimeCommitment = (events) => {
    return events.reduce((total, ev) => {
      const commitment = ev.commitment || ''
      // Extract hours from commitment string (e.g., "3 hrs/week" -> 3, "24 hrs (one-time)" -> 24)
      const hourMatch = commitment.match(/(\d+)\s*hrs?/i)
      if (hourMatch) {
        return total + parseInt(hourMatch[1])
      }
      return total
    }, 0)
  }

  const handleAdd = () => {
    if (!newEvent.title.trim()) return
    addCalendarEvent({ ...newEvent, type: 'manual' })
    setNewEvent({ title: '', category: 'Academic', description: '', meetingDay: 'Mondays', commitment: '', color: '#7c6af7', stressLevel: 'Low', frequency: 'weekly', startDate: new Date().toISOString().split('T')[0] })
    setShowAddModal(false)
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span className="chip chip-orange"><CalendarDays size={10} /> Calendar</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.3rem' }}>
              Calendar
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {calendarEvents.length} {calendarEvents.length === 1 ? 'activity' : 'activities'} planned
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* View toggle */}
            <div style={{ display: 'flex', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '3px' }}>
              {['year', 'list', 'week'].map(v => (
                <button key={v} onClick={() => { setView(v); setSelectedDate(null) }} style={{
                  padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: view === v ? 'var(--accent)' : 'transparent',
                  color: view === v ? 'white' : 'var(--text-muted)',
                  fontSize: '0.8rem', fontFamily: 'var(--font-display)', fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}>
                  {v === 'year' ? '📅 Year' : v === 'list' ? '≡ List' : '⊞ Week'}
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
            <motion.a
              href="/zen-game"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-ghost"
              style={{ textDecoration: 'none' }}
            >
              <Wind size={16} /> Relax
            </motion.a>
          </div>
        </div>

        {/* Wellness Tip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #6af7c8, #7c6af7)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.1, fontSize: '4rem' }}>💚</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
            <Heart size={20} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Wellness Tip</span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
            {currentTip}
          </p>
          <button
            onClick={() => setCurrentTip(WELLNESS_TIPS[Math.floor(Math.random() * WELLNESS_TIPS.length)])}
            style={{
              marginTop: '1rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            New Tip
          </button>
        </motion.div>

        {/* Year view */}
        {view === 'year' && (
          <YearCalendar events={calendarEvents} year={currentYear} onDateClick={(date) => {
            setSelectedDate(date)
            setView('week')
          }} />
        )}

        {/* Empty state */}
        {calendarEvents.length === 0 && view !== 'year' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>📅</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '0.75rem' }}>Your calendar is empty</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: 380, margin: '0 auto 1.5rem' }}>
              Add activities manually or explore extracurriculars to fill your schedule.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> Add Manually</button>
              <a href="/explore" className="btn btn-ghost" style={{ textDecoration: 'none' }}><Sparkles size={16} /> ECs</a>
              <a href="/zen-game" className="btn btn-ghost" style={{ textDecoration: 'none' }}><Wind size={16} /> Take a Break</a>
            </div>
          </motion.div>
        )}

        {/* List view */}
        {calendarEvents.length > 0 && view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {Object.entries(groupedByDay).map(([day, events]) => {
              const stress = getDayStress(events)
              const totalTime = getDayTimeCommitment(events)
              return (
                <motion.div key={day} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {day}
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} color="var(--text-dim)" />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                          {totalTime}hrs
                        </span>
                      </div>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: stress.color,
                        boxShadow: `0 0 8px ${stress.color}40`
                      }} />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                        {stress.level}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{events.length}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
                    {events.map((ev, i) => (
                      <EventCard key={ev.id} event={ev} index={i} onRemove={() => removeCalendarEvent(ev.id)} />
                    ))}
                  </div>
                </motion.div>
              )
            })}

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
          <div>
            {selectedDate && (
              <button onClick={() => { setSelectedDate(null); setView('year') }} 
                style={{ marginBottom: '1rem', padding: '8px 16px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
                ← Back to Year View
              </button>
            )}
            <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(130px, 1fr))', gap: '0.5rem', minWidth: 900 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                // Determine which actual date this day of the week represents
                let displayDate = new Date()
                if (selectedDate) {
                  // If a date was selected (from year view), find that week's Monday and calculate from there
                  const weekStart = new Date(selectedDate)
                  weekStart.setDate(weekStart.getDate() - (weekStart.getDay() || 7) + 1) // Set to Monday
                  displayDate = new Date(weekStart)
                  displayDate.setDate(displayDate.getDate() + (i === 6 ? 6 : i)) // Adjust for day
                } else {
                  // Show current week
                  const currentDate = new Date()
                  const weekStart = new Date(currentDate)
                  weekStart.setDate(weekStart.getDate() - (weekStart.getDay() || 7) + 1) // Set to Monday
                  displayDate = new Date(weekStart)
                  displayDate.setDate(displayDate.getDate() + (i === 6 ? 6 : i)) // Adjust for day
                }
                
                const fullDay = ['Mondays','Tuesdays','Wednesdays','Thursdays','Fridays','Saturdays','Sundays'][i]
                const dayEvents = calendarEvents.filter(e => {
                  if (e.meetingDay === 'Flexible') return e.meetingDay === 'Flexible'
                  return shouldShowEventOnDate(e, displayDate)
                })
                const isToday = today.toDateString() === displayDate.toDateString()
                const stress = getDayStress(dayEvents)
                const totalTime = getDayTimeCommitment(dayEvents)
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
                      {dayEvents.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                          <div style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: stress.color,
                            boxShadow: `0 0 6px ${stress.color}40`
                          }} />
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                            {totalTime}hrs
                          </span>
                        </div>
                      )}
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
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 500 }}>Frequency</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['one-time', 'weekly', 'biweekly'].map(freq => (
                      <button key={freq} onClick={() => setNewEvent(p => ({ ...p, frequency: freq }))} style={{
                        padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: newEvent.frequency === freq ? 'var(--accent)' : 'var(--bg3)',
                        color: newEvent.frequency === freq ? 'white' : 'var(--text)',
                        cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s ease'
                      }}>
                        {freq === 'one-time' ? 'One-Time' : freq === 'weekly' ? 'Weekly' : 'Biweekly'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Commitment</label>
                  <input className="input" placeholder="e.g. 2-3 hrs/week" value={newEvent.commitment} onChange={e => setNewEvent(p => ({ ...p, commitment: e.target.value }))} />
                </div>

                <div>                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 500 }}>Stress Level</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {STRESS_LEVELS.map(level => (
                      <button key={level} onClick={() => setNewEvent(p => ({ ...p, stressLevel: level }))} style={{
                        padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: newEvent.stressLevel === level ? STRESS_COLORS[level] : 'var(--bg3)',
                        color: newEvent.stressLevel === level ? 'white' : 'var(--text)',
                        cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s ease'
                      }}>
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Description (optional)</label>
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
          {event.stressLevel && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem',
              color: STRESS_COLORS[event.stressLevel] || 'var(--text-dim)',
              fontWeight: 600
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: STRESS_COLORS[event.stressLevel] || '#ccc'
              }} />
              {event.stressLevel} Stress
            </span>
          )}
          {event.frequency && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              🔄 {event.frequency === 'one-time' ? 'One-Time' : event.frequency === 'weekly' ? 'Weekly' : 'Biweekly'}
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

function YearCalendar({ events, year, onDateClick }) {
  const getDayEvents = (date) => {
    return events.filter(e => {
      const dayMap = {
        'Mondays': 1, 'Tuesdays': 2, 'Wednesdays': 3, 'Thursdays': 4,
        'Fridays': 5, 'Saturdays': 6, 'Sundays': 0
      }
      
      // Check if day of week matches
      if (dayMap[e.meetingDay] !== date.getDay()) return false
      
      // Check frequency
      if (e.frequency === 'one-time') {
        // For one-time events, check if it's the exact date
        const eventDate = e.startDate ? new Date(e.startDate) : new Date()
        return eventDate.toDateString() === date.toDateString()
      }
      
      if (e.frequency === 'weekly') {
        // Weekly events always show if day matches
        return true
      }
      
      if (e.frequency === 'biweekly') {
        // For biweekly, calculate week difference from start date
        const startDate = e.startDate ? new Date(e.startDate) : new Date()
        const diffTime = Math.abs(date - startDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        const weeksDiff = Math.floor(diffDays / 7)
        // Show on event start week and every other week after
        return weeksDiff % 2 === 0
      }
      
      return false
    })
  }

  const getMonthDays = (month) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          {year} Calendar
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {MONTHS.map((month, monthIndex) => {
            const { daysInMonth, startingDayOfWeek } = getMonthDays(monthIndex)
            const days = []
            
            // Add empty cells for days before month starts
            for (let i = 0; i < startingDayOfWeek; i++) {
              days.push(null)
            }
            
            // Add day cells
            for (let day = 1; day <= daysInMonth; day++) {
              days.push(day)
            }

            const today = new Date()
            const isCurrentMonth = today.getFullYear() === year && today.getMonth() === monthIndex

            return (
              <motion.div
                key={month}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: monthIndex * 0.02 }}
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1rem',
                  overflow: 'hidden'
                }}
              >
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                  {month}
                </h3>
                
                {/* Day headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '0.5rem' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', padding: '4px 0' }}>
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                  {days.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} style={{ aspectRatio: '1' }} />
                    }

                    const date = new Date(year, monthIndex, day)
                    const dayEvents = getDayEvents(date)
                    const isToday = isCurrentMonth && day === today.getDate()
                    const hasEvents = dayEvents.length > 0

                    return (
                      <motion.button
                        key={day}
                        onClick={() => onDateClick(date)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          aspectRatio: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          gap: '2px',
                          borderRadius: '8px',
                          border: isToday ? '2px solid var(--accent)' : hasEvents ? '1px solid var(--border)' : '1px solid transparent',
                          background: isToday ? 'var(--accent-glow)' : hasEvents ? 'var(--bg3)' : 'transparent',
                          cursor: hasEvents ? 'pointer' : 'default',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: 'var(--text)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>{day}</span>
                        {dayEvents.length > 0 && (
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {dayEvents.slice(0, 2).map((ev, i) => (
                              <div
                                key={i}
                                style={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: '50%',
                                  background: ev.color || '#7c6af7'
                                }}
                              />
                            ))}
                            {dayEvents.length > 2 && (
                              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>+{dayEvents.length - 2}</div>
                            )}
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}