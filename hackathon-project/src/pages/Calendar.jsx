import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
<<<<<<< Updated upstream
import { CalendarDays, Plus, Trash2, Clock, Tag, Sparkles, X, Check, Heart, Wind } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
=======
import {
  CalendarDays,
  Plus,
  Trash2,
  Clock,
  Heart,
  Wind,
  Download,
  RefreshCcw,
  X,
  MapPin,
  FileText,
  Tag
} from 'lucide-react'
import ICAL from 'ical.js'
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
export default function Calendar({ calendarEvents, addCalendarEvent, removeCalendarEvent }) {
  const { t } = useLanguage()
=======
const COLORS = ['#7c6af7', '#f7a26a', '#6af7c8', '#f76a6a', '#6ab8f7', '#f76af7', '#f7f76a']
const CATEGORIES = ['Academic', 'Sports', 'Arts', 'Community', 'Professional', 'Leadership', 'Personal']
const DAYS_OF_WEEK = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Flexible']

function normalizeDateOnly(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function startOfWeek(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  return d
}

function formatDateLabel(dateString) {
  if (!dateString) return 'No date'
  const d = new Date(dateString)
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

function formatTimeRange(startDateTime, endDateTime, allDay) {
  if (!startDateTime && !endDateTime) return allDay ? 'All day' : 'No time'
  if (allDay) return 'All day'

  const start = startDateTime ? new Date(startDateTime) : null
  const end = endDateTime ? new Date(endDateTime) : null

  const format = (d) =>
    d.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    })

  if (start && end) return `${format(start)} – ${format(end)}`
  if (start) return format(start)
  return 'No time'
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}
function formatShortDay(date) {
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

export default function Calendar({
  calendarEvents = [],
  addCalendarEvent,
  removeCalendarEvent
}) {
>>>>>>> Stashed changes
  const [showAddModal, setShowAddModal] = useState(false)
  const [view, setView] = useState('year')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [currentTip, setCurrentTip] = useState(
    WELLNESS_TIPS[Math.floor(Math.random() * WELLNESS_TIPS.length)]
  )
  const [selectedDayInfo, setSelectedDayInfo] = useState(null)

  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Academic',
    description: '',
    meetingDay: 'Mondays',
    commitment: '',
    color: '#7c6af7',
    stressLevel: 'Low',
    frequency: 'weekly',
    startDate: new Date().toISOString().split('T')[0]
  })

  const [canvasURL, setCanvasURL] = useState(localStorage.getItem('canvasICS') || '')
  const [syncingCanvas, setSyncingCanvas] = useState(false)
  const [canvasError, setCanvasError] = useState('')

  const today = new Date()
  const currentYear = today.getFullYear()
  const formatCommitmentHours = (events) => {
  const total = getDayTimeCommitment(events)
  return total > 0 ? `${Math.round(total * 10) / 10} hr` : '—'
  }

  const safeAddEvent = (event) => {
    if (typeof addCalendarEvent === 'function') {
      addCalendarEvent(event)
    } else {
      console.warn('addCalendarEvent prop is missing')
    }
  }

  const safeRemoveEvent = (id) => {
    if (typeof removeCalendarEvent === 'function') {
      removeCalendarEvent(id)
    } else {
      console.warn('removeCalendarEvent prop is missing')
    }
  }

  const shouldShowEventOnDate = (event, date) => {
    const currentDate = new Date(date)
    currentDate.setHours(0, 0, 0, 0)

    if (event.frequency === 'one-time' || event.type === 'canvas') {
      const eventDate = new Date(event.startDate)
      eventDate.setHours(0, 0, 0, 0)
      return sameDay(eventDate, currentDate)
    }

    const dayMap = {
      Sundays: 0,
      Mondays: 1,
      Tuesdays: 2,
      Wednesdays: 3,
      Thursdays: 4,
      Fridays: 5,
      Saturdays: 6
    }

    const startDateValue = new Date(event.startDate)
    startDateValue.setHours(0, 0, 0, 0)

    if (currentDate < startDateValue) return false

    if (event.meetingDay && event.meetingDay !== 'Flexible' && dayMap[event.meetingDay] !== currentDate.getDay()) {
      return false
    }

    if (event.frequency === 'weekly') return true

    if (event.frequency === 'biweekly') {
      const diffDays = Math.floor((currentDate - startDateValue) / (1000 * 60 * 60 * 24))
      return Math.floor(diffDays / 7) % 2 === 0
    }

    return true
  }

  const getEventsForDate = (date) => {
    return calendarEvents
      .filter((event) => shouldShowEventOnDate(event, date))
      .sort((a, b) => {
        const aTime = a.startDateTime ? new Date(a.startDateTime).getTime() : 0
        const bTime = b.startDateTime ? new Date(b.startDateTime).getTime() : 0
        return aTime - bTime
      })
  }
  const groupedByDay = DAYS_OF_WEEK
    .filter((day) => day !== 'Flexible')
    .reduce((acc, day) => {
      acc[day] = calendarEvents.filter((e) => e.meetingDay === day)
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
      const hourMatch = (ev.commitment || '').match(/(\d+(\.\d+)?)\s*hrs?/i)
      if (hourMatch) return total + parseFloat(hourMatch[1])

      if (ev.type === 'canvas') return total + 1

      return total
    }, 0)
  }

  const handleAdd = () => {
    if (!newEvent.title.trim()) return

    safeAddEvent({
      ...newEvent,
      id: `manual-${Date.now()}`,
      type: 'manual'
    })

    setNewEvent({
      title: '',
      category: 'Academic',
      description: '',
      meetingDay: 'Mondays',
      commitment: '',
      color: '#7c6af7',
      stressLevel: 'Low',
      frequency: 'weekly',
      startDate: new Date().toISOString().split('T')[0]
    })

    setShowAddModal(false)
  }

const syncCanvasCalendar = async () => {
  if (!canvasURL) return
  setCanvasError('')

  try {
    setSyncingCanvas(true)

    const response = await fetch(`http://localhost:3001/api/canvas-ics?url=${encodeURIComponent(canvasURL)}`)

    if (!response.ok) {
      const msg = await response.text()
      throw new Error(msg || `Failed to fetch ICS: ${response.status}`)
    }

    const text = await response.text()
    const jcalData = ICAL.parse(text)
    const component = new ICAL.Component(jcalData)
    const events = component.getAllSubcomponents('vevent')
events.forEach(async (vevent) => {
  const event = new ICAL.Event(vevent)
  const start = event.startDate?.toJSDate?.()
  const end = event.endDate?.toJSDate?.()

  if (!start) return

  const id = `canvas-${event.uid}`
  const alreadyExists = calendarEvents.some((e) => e.id === id)
  if (alreadyExists) return

  let estimatedHours = ''

  try {
    const estimateResponse = await fetch('http://localhost:3001/api/estimate-workload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: event.summary || '',
        description: event.description || ''
      })
    })

    if (estimateResponse.ok) {
      const estimateData = await estimateResponse.json()
      if (estimateData?.hours) {
        estimatedHours = `${estimateData.hours} hrs`
      }
    }
  } catch (err) {
    console.error('Failed to estimate workload', err)
  }

  safeAddEvent({
    id,
    title: event.summary || 'Canvas Event',
    description: event.description || '',
    location: vevent.getFirstPropertyValue('location') || '',
    meetingDay: DAYS_OF_WEEK[start.getDay()],
    commitment: estimatedHours,
    color: '#6ab8f7',
    stressLevel: 'Medium',
    frequency: 'one-time',
    startDate: normalizeDateOnly(start),
    startDateTime: start.toISOString(),
    endDateTime: end ? end.toISOString() : '',
    allDay: !!event.startDate?.isDate,
    category: 'Academic',
    type: 'canvas',
    source: 'Canvas',
    url: vevent.getFirstPropertyValue('url') || ''
  })
})
  } catch (err) {
    console.error('Canvas sync failed', err)
    setCanvasError(err.message || 'Canvas import failed.')
  } finally {
    setSyncingCanvas(false)
  }
}

  useEffect(() => {
    if (!canvasURL) return
    syncCanvasCalendar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasURL])

  useEffect(() => {
    if (!canvasURL) return
    const interval = setInterval(syncCanvasCalendar, 10 * 60 * 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasURL])

  const yearMonths = useMemo(() => {
    return Array.from({ length: 12 }, (_, monthIndex) => {
      const firstDay = new Date(currentYear, monthIndex, 1)
      const lastDay = new Date(currentYear, monthIndex + 1, 0)
      const leadingBlanks = firstDay.getDay()
      const totalDays = lastDay.getDate()

      const cells = []

      for (let i = 0; i < leadingBlanks; i += 1) {
        cells.push(null)
      }

      for (let day = 1; day <= totalDays; day += 1) {
        cells.push(new Date(currentYear, monthIndex, day))
      }

      return {
        monthIndex,
        name: MONTHS[monthIndex],
        cells
      }
    })
  }, [currentYear])

  const listEvents = useMemo(() => {
    return [...calendarEvents].sort((a, b) => {
      const aDate = new Date(a.startDateTime || `${a.startDate}T00:00:00`).getTime()
      const bDate = new Date(b.startDateTime || `${b.startDate}T00:00:00`).getTime()
      return aDate - bDate
    })
  }, [calendarEvents])

  const weekStart = startOfWeek(selectedDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

const renderYearView = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1rem'
    }}
  >
    {yearMonths.map((month) => (
      <motion.div
        key={month.monthIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '18px',
          padding: '1rem'
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: '0.9rem',
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem'
          }}
        >
          {month.name}
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: '6px',
            marginBottom: '0.5rem'
          }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, idx) => (
            <div
              key={`${month.monthIndex}-head-${idx}`}
              style={{
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 700,
                paddingBottom: '0.2rem'
              }}
            >
              {d}
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: '6px'
          }}
        >
          {month.cells.map((date, idx) => {
            if (!date) {
              return (
                <div
                  key={`${month.monthIndex}-blank-${idx}`}
                  style={{
                    height: 88,
                    borderRadius: '12px'
                  }}
                />
              )
            }

            const dayEvents = getEventsForDate(date)
            const stress = getDayStress(dayEvents)
            const isToday = sameDay(date, today)

            return (
              <button
                key={`${month.monthIndex}-${date.getDate()}`}
                onClick={() => setSelectedDayInfo(date)}
                style={{
                  height: 88,
                  borderRadius: '12px',
                  border: isToday ? '2px solid var(--accent)' : '1px solid var(--border)',
                  background: dayEvents.length ? 'var(--bg2)' : 'transparent',
                  padding: '8px 6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    marginBottom: '4px',
                    color: isToday ? 'var(--accent)' : 'var(--text)'
                  }}
                >
                  {date.getDate()}
                </div>

                <div style={{ display: 'grid', gap: '3px' }}>
                {dayEvents.slice(0, 2).map((ev) => (
                  <button
                    key={ev.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedEvent(ev)
                    }}
                    style={{
                      background: ev.color || '#7c6af7',
                      color: 'white',
                      borderRadius: '6px',
                      padding: '2px 5px',
                      fontSize: '0.62rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {ev.title}
                  </button>
                ))}

                  {dayEvents.length > 2 && (
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>

                {dayEvents.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 8,
                      height: 8,
                      borderRadius: '999px',
                      background: stress.color
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </motion.div>
    ))}
  </div>
)

  const renderListView = () => (
    <div style={{ display: 'grid', gap: '0.85rem' }}>
      {listEvents.length === 0 && (
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '1.25rem',
            color: 'var(--text-muted)'
          }}
        >
          No activities yet.
        </div>
      )}

      {listEvents.map((event) => (
        <motion.button
          key={event.id}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setSelectedEvent(event)}
          style={{
            width: '100%',
            textAlign: 'left',
            border: '1px solid var(--border)',
            background: 'var(--card)',
            borderRadius: '16px',
            padding: '1rem',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '0.35rem'
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '999px',
                    background: event.color || '#7c6af7',
                    display: 'inline-block'
                  }}
                />
                <span style={{ fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                  {event.title}
                </span>
              </div>

              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {formatDateLabel(event.startDate)} · {formatTimeRange(event.startDateTime, event.endDateTime, event.allDay)}
              </div>

              {event.description && (
                <div
                  style={{
                    marginTop: '0.45rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                    lineHeight: 1.5
                  }}
                >
                  {event.description.length > 140
                    ? `${event.description.slice(0, 140)}...`
                    : event.description}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="chip" style={{ background: 'var(--bg2)' }}>
                <Tag size={12} /> {event.category}
              </span>
              {event.type === 'canvas' && (
                <span className="chip" style={{ background: 'rgba(106,184,247,0.15)', color: '#6ab8f7' }}>
                  Canvas
                </span>
              )}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  )

const renderWeekView = () => (
  <div style={{ display: 'grid', gap: '1rem' }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}
    >
      <h3 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>
        Week of {weekStart.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
      </h3>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          className="btn btn-ghost"
          onClick={() => {
            const d = new Date(selectedDate)
            d.setDate(d.getDate() - 7)
            setSelectedDate(d)
          }}
        >
          ← Prev
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => setSelectedDate(new Date())}
        >
          Today
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => {
            const d = new Date(selectedDate)
            d.setDate(d.getDate() + 7)
            setSelectedDate(d)
          }}
        >
          Next →
        </button>
      </div>
    </div>

    {/* Desktop 7-day header */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
        gap: '1rem'
      }}
    >
      {weekDays.map((day) => {
        const dayEvents = getEventsForDate(day)
        const hours = getDayTimeCommitment(dayEvents)
        const stress = getDayStress(dayEvents)
        const isToday = sameDay(day, today)

        return (
          <div
            key={day.toISOString()}
            style={{
              background: 'var(--card)',
              border: isToday ? '2px solid var(--accent)' : '1px solid var(--border)',
              borderRadius: '16px',
              padding: '0.9rem',
              minHeight: '360px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <button
              onClick={() => setSelectedDayInfo(day)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: '0.9rem'
              }}
            >
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.25rem',
                  fontWeight: 700
                }}
              >
                {DAYS[day.getDay()]}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: isToday ? 'var(--accent)' : 'var(--text)'
                }}
              >
                {MONTHS[day.getMonth()].slice(0, 3)} {day.getDate()}
              </div>
            </button>

            <div
              style={{
                display: 'flex',
                gap: '0.4rem',
                flexWrap: 'wrap',
                marginBottom: '0.9rem'
              }}
            >
              <span
                className="chip"
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  fontSize: '0.7rem'
                }}
              >
                {dayEvents.length} item{dayEvents.length === 1 ? '' : 's'}
              </span>

              <span
                className="chip"
                style={{
                  background: `${stress.color}22`,
                  color: stress.color,
                  border: `1px solid ${stress.color}55`,
                  fontSize: '0.7rem'
                }}
              >
                {stress.level}
              </span>

              {hours > 0 && (
                <span className="chip" style={{ background: 'var(--bg2)', fontSize: '0.7rem' }}>
                {Math.round(hours * 10) / 10} hr
                </span>
              )}
            </div>

            <div
              style={{
                display: 'grid',
                gap: '0.55rem',
                overflowY: 'auto',
                paddingRight: '2px'
              }}
            >
              {dayEvents.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Nothing scheduled.
                </div>
              )}

              {dayEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  style={{
                    textAlign: 'left',
                    border: '1px solid var(--border)',
                    background: 'var(--bg2)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '0.35rem'
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '999px',
                        background: event.color || '#7c6af7',
                        display: 'inline-block',
                        flexShrink: 0
                      }}
                    />
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        fontFamily: 'var(--font-display)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {event.title}
                    </div>
                  </div>

                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {formatTimeRange(event.startDateTime, event.endDateTime, event.allDay)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  </div>
)

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span className="chip chip-orange"><CalendarDays size={10} /> {t('calendar.calendar')}</span>
            </div>
<<<<<<< Updated upstream
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.3rem' }}>
              {t('calendar.calendar')}
=======
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 800,
                marginBottom: '0.3rem'
              }}
            >
              Calendar
>>>>>>> Stashed changes
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {calendarEvents.length === 1 ? t('calendar.planned', { n: calendarEvents.length }) : t('calendar.plannedPlural', { n: calendarEvents.length })}
            </p>
          </div>
<<<<<<< Updated upstream
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
                  {v === 'year' ? `📅 ${t('calendar.yearView')}` : v === 'list' ? `≡ ${t('calendar.listView')}` : `⊞ ${t('calendar.weekView')}`}
=======

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-ghost"
              onClick={() => {
                const url = prompt('Paste your Canvas Calendar Feed URL')
                if (url) {
                  setCanvasURL(url)
                  localStorage.setItem('canvasICS', url)
                }
              }}
            >
              <Download size={16} /> Connect Canvas
            </motion.button>

            {canvasURL && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-ghost"
                onClick={syncCanvasCalendar}
              >
                <RefreshCcw size={16} /> {syncingCanvas ? 'Syncing...' : 'Sync'}
              </motion.button>
            )}

            <div
              style={{
                display: 'flex',
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '3px'
              }}
            >
              {['year', 'list', 'week'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: view === v ? 'var(--accent)' : 'transparent',
                    color: view === v ? 'white' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {v === 'year' ? '📅 Year' : v === 'list' ? '≡ List' : '⊞ Week'}
>>>>>>> Stashed changes
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} /> {t('calendar.addActivity')}
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
<<<<<<< Updated upstream
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{t('calendar.wellnessTip')}</span>
=======
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>
              Wellness Tip
            </span>
>>>>>>> Stashed changes
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>{currentTip}</p>
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

<<<<<<< Updated upstream
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
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '0.75rem' }}>{t('calendar.calendarEmpty')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: 380, margin: '0 auto 1.5rem' }}>
              Add activities manually or explore extracurriculars to fill your schedule.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> Add Manually</button>
              <a href="/explore" className="btn btn-ghost" style={{ textDecoration: 'none' }}><Sparkles size={16} /> {t('calendar.ecs')}</a>
              <a href="/zen-game" className="btn btn-ghost" style={{ textDecoration: 'none' }}><Wind size={16} /> {t('calendar.takeBreak')}</a>
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
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('calendar.other')}</span>
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
                ← {t('calendar.backToYearView')}
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
=======
        {canvasError && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid rgba(247,106,106,0.35)',
              background: 'rgba(247,106,106,0.08)',
              color: 'var(--text)'
            }}
          >
            {canvasError}
          </div>
        )}

        {Object.keys(groupedByDay).length > 0 && view !== 'list' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}
          >
            {Object.entries(groupedByDay).map(([day, events]) => {
              const stress = getDayStress(events)
              return (
                <div
                  key={day}
                  style={{
                    minWidth: '180px',
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    padding: '0.8rem'
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontFamily: 'var(--font-display)',
                      marginBottom: '0.35rem'
                    }}
                  >
                    {day}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  {events.length} item{events.length === 1 ? '' : 's'} · {formatCommitmentHours(events)}
                  </div>
                  <div
                    style={{
                      fontSize: '0.76rem',
                      color: stress.color,
                      fontWeight: 700
                    }}
                  >
                    {stress.level} stress
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === 'year' && renderYearView()}
        {view === 'list' && renderListView()}
        {view === 'week' && renderWeekView()}

        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem'
              }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 10, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '560px',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '1.25rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}
                >
                  <h2 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>Add Activity</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '0.85rem' }}>
                  <input
                    className="input"
                    placeholder="Title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent((prev) => ({ ...prev, title: e.target.value }))}
                  />

                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent((prev) => ({ ...prev, description: e.target.value }))}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <select
                      className="input"
                      value={newEvent.category}
                      onChange={(e) => setNewEvent((prev) => ({ ...prev, category: e.target.value }))}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    <select
                      className="input"
                      value={newEvent.meetingDay}
                      onChange={(e) => setNewEvent((prev) => ({ ...prev, meetingDay: e.target.value }))}
                    >
                      {DAYS_OF_WEEK.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <input
                      className="input"
                      type="date"
                      value={newEvent.startDate}
                      onChange={(e) => setNewEvent((prev) => ({ ...prev, startDate: e.target.value }))}
                    />

                    <select
                      className="input"
                      value={newEvent.frequency}
                      onChange={(e) => setNewEvent((prev) => ({ ...prev, frequency: e.target.value }))}
                    >
                      <option value="one-time">One-time</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly</option>
                    </select>

                    <select
                      className="input"
                      value={newEvent.stressLevel}
                      onChange={(e) => setNewEvent((prev) => ({ ...prev, stressLevel: e.target.value }))}
                    >
                      {STRESS_LEVELS.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'center' }}>
                    <input
                      className="input"
                      placeholder="Commitment (e.g. 2 hrs)"
                      value={newEvent.commitment}
                      onChange={(e) => setNewEvent((prev) => ({ ...prev, commitment: e.target.value }))}
                    />
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewEvent((prev) => ({ ...prev, color }))}
>>>>>>> Stashed changes
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '999px',
                            border: newEvent.color === color ? '2px solid var(--text)' : '1px solid var(--border)',
                            background: color,
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </div>
<<<<<<< Updated upstream
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
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem' }}>{t('calendar.addActivity')}</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '8px' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: 500 }}>{t('calendar.activityName')}</label>
                  <input className="input" placeholder="e.g. Chess Club" value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: 500 }}>{t('calendar.category')}</label>
                    <select className="input" value={newEvent.category} onChange={e => setNewEvent(p => ({ ...p, category: e.target.value }))}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: 500 }}>{t('calendar.meetingDay')}</label>
                    <select className="input" value={newEvent.meetingDay} onChange={e => setNewEvent(p => ({ ...p, meetingDay: e.target.value }))}>
                      {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 500 }}>{t('calendar.frequency')}</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['one-time', 'weekly', 'biweekly'].map(freq => (
                      <button key={freq} onClick={() => setNewEvent(p => ({ ...p, frequency: freq }))} style={{
                        padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: newEvent.frequency === freq ? 'var(--accent)' : 'var(--bg3)',
                        color: newEvent.frequency === freq ? 'white' : 'var(--text)',
                        cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s ease'
                      }}>
                        {freq === 'one-time' ? t('calendar.oneTime') : freq === 'weekly' ? t('calendar.weekly') : t('calendar.biweekly')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: 500 }}>{t('calendar.commitment')}</label>
                  <input className="input" placeholder="e.g. 2-3 hrs/week" value={newEvent.commitment} onChange={e => setNewEvent(p => ({ ...p, commitment: e.target.value }))} />
                </div>

                <div>                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 500 }}>{t('calendar.stressLevel')}</label>
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

                <div>                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: 500 }}>{t('calendar.descriptionOptional')}</label>
                  <input className="input" placeholder="Brief description..." value={newEvent.description} onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))} />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 500 }}>{t('calendar.color')}</label>
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
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>{t('calendar.cancel')}</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleAdd} disabled={!newEvent.title.trim()}>
                  <Plus size={16} /> {t('calendar.addToCalendar')}
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
              🔄 {event.frequency === 'one-time' ? t('calendar.oneTime') : event.frequency === 'weekly' ? t('calendar.weekly') : t('calendar.biweekly')}
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
=======
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAdd}>
                    Save
                  </button>
>>>>>>> Stashed changes
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1100,
                padding: '1rem'
              }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 10, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '620px',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '1.25rem',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.18)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '999px',
                          background: selectedEvent.color || '#6ab8f7',
                          display: 'inline-block'
                        }}
                      />
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {selectedEvent.source || selectedEvent.category || 'Event'}
                      </span>
                    </div>

                    <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
                      {selectedEvent.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => setSelectedEvent(null)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)' }}>
                    <CalendarDays size={16} />
                    <span>{formatDateLabel(selectedEvent.startDate)}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)' }}>
                    <Clock size={16} />
                    <span>{formatTimeRange(selectedEvent.startDateTime, selectedEvent.endDateTime, selectedEvent.allDay)}</span>
                  </div>

                  {selectedEvent.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)' }}>
                      <MapPin size={16} />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)' }}>
                    <Tag size={16} />
                    <span>{selectedEvent.category || 'General'}</span>
                  </div>

                  {selectedEvent.description && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        borderRadius: '14px',
                        padding: '1rem'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '0.5rem',
                          fontWeight: 700
                        }}
                      >
                        <FileText size={16} />
                        Description
                      </div>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {selectedEvent.description}
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  {selectedEvent.type !== 'canvas' && (
                    <button
                      className="btn btn-ghost"
                      onClick={() => {
                        safeRemoveEvent(selectedEvent.id)
                        setSelectedEvent(null)
                      }}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}

                  <button className="btn btn-primary" onClick={() => setSelectedEvent(null)}>
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}