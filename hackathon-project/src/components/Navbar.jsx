import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, LayoutDashboard, Search, CalendarDays, Gamepad2, Moon, Sun, X, Menu, BookOpen } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext.jsx'

const NAV_ITEMS = [
  { path: '/', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
  { path: '/explore', icon: <Search size={17} />, label: 'Explore ECs' },
  { path: '/courses', icon: <BookOpen size={17} />, label: 'Courses' },
  { path: '/calendar', icon: <CalendarDays size={17} />, label: 'My Calendar' },
  { path: '/zen', icon: <Gamepad2 size={17} />, label: 'Zen Space' },
]

export default function Navbar({ userProfile, zenMode, setZenMode, eventCount }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 1.5rem',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        height: 64, gap: '2rem'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          textDecoration: 'none', flexShrink: 0
        }}>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent), #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px var(--accent-glow)'
            }}
          >
            <Compass size={18} color="white" />
          </motion.div>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: '1.15rem', color: 'var(--text)',
            letterSpacing: '-0.02em'
          }}>
            Path<span style={{ color: 'var(--accent)' }}>Finder</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '7px 14px', borderRadius: '10px',
                  textDecoration: 'none', fontSize: '0.875rem',
                  fontFamily: 'var(--font-display)', fontWeight: active ? 600 : 500,
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  background: active ? 'var(--accent-glow)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(124,106,247,0.3)' : 'transparent'}`,
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {item.icon}
                {item.label}
                {item.path === '/calendar' && eventCount > 0 && (
                  <span style={{
                    minWidth: 18, height: 18, borderRadius: '100px',
                    background: 'var(--accent)', color: 'white',
                    fontSize: '0.65rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 5px'
                  }}>
                    {eventCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '7px 14px', borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer', fontSize: '0.85rem',
              fontFamily: 'var(--font-display)', fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            {isDarkMode ? 'Light' : 'Dark'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setZenMode(!zenMode)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '7px 14px', borderRadius: '10px',
              border: '1px solid var(--border)',
              background: zenMode ? 'rgba(106,247,200,0.12)' : 'transparent',
              color: zenMode ? 'var(--accent3)' : 'var(--text-muted)',
              cursor: 'pointer', fontSize: '0.85rem',
              fontFamily: 'var(--font-display)', fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
          >
            <Moon size={15} />
            Zen
          </motion.button>

          {userProfile && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: '100px'
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: 'white',
                fontFamily: 'var(--font-display)'
              }}>
                {userProfile.name?.[0]?.toUpperCase() || '?'}
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 500 }}>
                {userProfile.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}