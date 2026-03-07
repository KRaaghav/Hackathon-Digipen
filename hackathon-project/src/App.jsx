import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import OnboardingModal from './components/OnboardingModal'
import Navbar from './components/Navbar'
import ZenMode from './components/ZenMode'
import Dashboard from './pages/Dashboard'
import Extracurriculars from './pages/Extracurriculars'
import Calendar from './pages/Calendar'
import ZenGame from './pages/ZenGame'
import Courses from './pages/Courses'

export default function App() {
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('pf_profile')
    return saved ? JSON.parse(saved) : null
  })
  const [calendarEvents, setCalendarEvents] = useState(() => {
    const saved = localStorage.getItem('pf_calendar')
    return saved ? JSON.parse(saved) : []
  })
  const [zenMode, setZenMode] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('pf_profile'))

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('pf_profile', JSON.stringify(userProfile))
    }
  }, [userProfile])

  useEffect(() => {
    localStorage.setItem('pf_calendar', JSON.stringify(calendarEvents))
  }, [calendarEvents])

  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile)
    setShowOnboarding(false)
  }

  const addCalendarEvent = (event) => {
    const newEvent = {
      id: Date.now(),
      ...event,
      addedAt: new Date().toISOString()
    }
    setCalendarEvents(prev => [...prev, newEvent])
  }

  const removeCalendarEvent = (id) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id))
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-root" style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Background orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <AnimatePresence>
          {showOnboarding && (
            <OnboardingModal onComplete={handleOnboardingComplete} />
          )}
        </AnimatePresence>

        {!showOnboarding && (
          <>
            <Navbar
              userProfile={userProfile}
              zenMode={zenMode}
              setZenMode={setZenMode}
              eventCount={calendarEvents.length}
            />

            <AnimatePresence>
              {zenMode && <ZenMode onExit={() => setZenMode(false)} />}
            </AnimatePresence>

            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    userProfile={userProfile}
                    calendarEvents={calendarEvents}
                  />
                }
              />
              <Route
                path="/explore"
                element={
                  <Extracurriculars
                    userProfile={userProfile}
                    addCalendarEvent={addCalendarEvent}
                    calendarEvents={calendarEvents}
                  />
                }
              />
              <Route
                path="/courses"
                element={
                  <Courses
                    userProfile={userProfile}
                    calendarEvents={calendarEvents}
                    addCalendarEvent={addCalendarEvent}
                    removeCalendarEvent={removeCalendarEvent}
                  />
                }
              />
              <Route
                path="/calendar"
                element={
                  <Calendar
                    calendarEvents={calendarEvents}
                    addCalendarEvent={addCalendarEvent}
                    removeCalendarEvent={removeCalendarEvent}
                  />
                }
              />
              <Route path="/zen" element={<ZenGame />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </div>
    </BrowserRouter>
  )
}