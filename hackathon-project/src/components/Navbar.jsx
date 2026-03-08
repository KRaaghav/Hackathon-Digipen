import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TreePine, LayoutDashboard, Search, CalendarDays, Gamepad2, Moon, Sun, BookOpen, Timer, Globe } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

const MotionLink = motion(Link)

const NAV_ITEMS = [
  { path: '/', icon: <LayoutDashboard size={17} />, labelKey: 'dashboard' },
  { path: '/explore', icon: <Search size={17} />, labelKey: 'explore' },
  { path: '/courses', icon: <BookOpen size={17} />, labelKey: 'courses' },
  { path: '/calendar', icon: <CalendarDays size={17} />, labelKey: 'calendar' },
  { path: '/timers', icon: <Timer size={17} />, labelKey: 'timers' },
]

export default function Navbar({ userProfile, zenMode, setZenMode, eventCount }) {
  const location = useLocation()
  const { isDarkMode, toggleTheme } = useTheme()
  const { t, language, setLanguage, LANGUAGE_OPTIONS } = useLanguage()

  const [zenOpen, setZenOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const dropdownRef = useRef(null)
  const langDropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setZenOpen(false)
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 1.5rem',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        height: 64,
        gap: '2rem'
      }}>

        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          flexShrink: 0
        }}>
          <motion.div
            whileHover={{ scale: 1.12, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c6af7, #f76af7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(124,106,247,0.4)',
              color: 'white'
            }}
          >
            <TreePine size={18} />
          </motion.div>

          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.15rem',
            background: 'linear-gradient(135deg, var(--accent), #f76af7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            {t('appName')}
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path

            return (
              <MotionLink
                key={item.path}
                to={item.path}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  background: active ? 'var(--accent-glow)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(124,106,247,0.3)' : 'transparent'}`,
                }}
              >
                {item.icon}
                {t(`nav.${item.labelKey}`)}

                {item.path === '/calendar' && eventCount > 0 && (
                  <span style={{
                    minWidth: 18,
                    height: 18,
                    borderRadius: '100px',
                    background: 'var(--accent)',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 5px'
                  }}>
                    {eventCount}
                  </span>
                )}
              </MotionLink>
            )
          })}

          {/* Zen Games dropdown */}
          <div
            ref={dropdownRef}
            onMouseEnter={() => setZenOpen(true)}
            style={{ position: 'relative' }}
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '7px 14px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <Gamepad2 size={17} />
              {t('nav.zenGames')}
            </motion.div>

            {zenOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                background: 'rgba(20,20,25,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                minWidth: 150,
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
              }}>
                <MotionLink
                  to="/zen"
                  whileHover={{ scale: 1.02, x: 4, backgroundColor: 'rgba(255,255,255,0.06)' }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                  }}
                >
                  {t('nav.zenGame')}
                </MotionLink>

                <MotionLink
                  to="/geometry"
                  whileHover={{ scale: 1.02, x: 4, backgroundColor: 'rgba(255,255,255,0.06)' }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                  }}
                >
                  {t('nav.zenDash')}
                </MotionLink>
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

          {/* Language dropdown */}
          <div ref={langDropdownRef} style={{ position: 'relative' }}>
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => setLangOpen(!langOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '7px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: langOpen ? 'var(--accent-glow)' : 'transparent',
                color: langOpen ? 'var(--accent)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 500
              }}
            >
              <Globe size={16} />
              {t('nav.language')}
            </motion.button>

            {langOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: 'rgba(20,20,25,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                minWidth: 140,
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                zIndex: 50
              }}>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => { setLanguage(opt.code); setLangOpen(false) }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: language === opt.code ? 'var(--accent-glow)' : 'transparent',
                      color: language === opt.code ? 'var(--accent)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontFamily: 'var(--font-body)',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle (icon only) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            title={isDarkMode ? t('nav.light') : t('nav.dark')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setZenMode(!zenMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '7px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: zenMode ? 'rgba(106,247,200,0.12)' : 'transparent',
              color: zenMode ? 'var(--accent3)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 500
            }}
          >
            <Moon size={15} />
            {t('nav.zen')}
          </motion.button>

          {userProfile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: '100px'
            }}>
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'white'
              }}>
                {userProfile.name?.[0]?.toUpperCase() || '?'}
              </div>

              <span style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-display)',
                fontWeight: 500
              }}>
                {userProfile.name}
              </span>
            </div>
          )}

        </div>
      </div>
    </nav>
  )
}