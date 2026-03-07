import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, TrendingUp, CalendarDays, Search, ArrowRight, BookOpen, Target, Clock, Star } from 'lucide-react'

const TIPS_BY_MAJOR = {
  "Computer Science": ["Build a GitHub portfolio", "Contribute to open source", "Learn system design", "Practice LeetCode daily"],
  "Business Administration": ["Network on LinkedIn", "Join a business club", "Read the WSJ daily", "Find a mentor in industry"],
  "Biology": ["Find a research lab", "Shadow a professional", "Study for MCAT early", "Join science honor society"],
  "Psychology": ["Volunteer at a counseling center", "Read academic journals", "Join APA student division", "Apply for research positions"],
  "default": ["Join a club related to your major", "Find an internship or research position", "Build your LinkedIn profile", "Connect with a faculty mentor"]
}

const QUICK_STATS = [
  { label: "Days Until Finals", value: "42", icon: <Clock size={18} />, color: 'var(--accent2)' },
  { label: "Clubs Available", value: "200+", icon: <Star size={18} />, color: 'var(--accent)' },
  { label: "Internships Posted", value: "1.2k", icon: <Target size={18} />, color: 'var(--accent3)' },
]

export default function Dashboard({ userProfile, calendarEvents }) {
  const [aiInsight, setAiInsight] = useState('')
  const [loadingInsight, setLoadingInsight] = useState(false)
  const [insightFetched, setInsightFetched] = useState(false)

  const tips = TIPS_BY_MAJOR[userProfile?.major] || TIPS_BY_MAJOR.default

  const fetchInsight = async () => {
    if (insightFetched) return
    setLoadingInsight(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are an academic advisor AI for PathFinder, a student platform. Give a warm, motivating 2-sentence personalized tip for a ${userProfile?.year || 'college'} student majoring in ${userProfile?.major || 'college'}. Their goals include: ${userProfile?.goals?.join(', ') || 'academic success'}. Be specific, actionable, and encouraging. No bullet points, just 2 flowing sentences.`
          }]
        })
      })
      const data = await res.json()
      setAiInsight(data.content?.[0]?.text || "Keep pushing forward — every step counts toward your goals!")
      setInsightFetched(true)
    } catch {
      setAiInsight("Stay consistent with your studies and look for hands-on opportunities to apply your knowledge this semester.")
      setInsightFetched(true)
    }
    setLoadingInsight(false)
  }

  useEffect(() => {
    if (userProfile) {
      const timer = setTimeout(fetchInsight, 800)
      return () => clearTimeout(timer)
    }
  }, [userProfile])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero greeting */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <span className="chip chip-accent">
              <Sparkles size={10} /> AI-Powered
            </span>
            <span className="chip chip-orange">{userProfile?.major || 'Student'}</span>
            <span className="chip chip-green">{userProfile?.year || ''}</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, var(--text) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            {greeting}, {userProfile?.name || 'Scholar'} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 500 }}>
            Here's your personalized academic command center. Let's make today count.
          </p>
        </div>

        {/* AI Insight card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            background: 'linear-gradient(135deg, rgba(124,106,247,0.15) 0%, rgba(168,85,247,0.08) 100%)',
            border: '1px solid rgba(124,106,247,0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2rem',
            position: 'relative', overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(124,106,247,0.1)', filter: 'blur(20px)' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', position: 'relative' }}>
            <div style={{
              width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--accent), #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px var(--accent-glow)'
            }}>
              <Sparkles size={18} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem',
                color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: '0.5rem'
              }}>
                AI Advisor · Today's Insight
              </div>
              {loadingInsight ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="skeleton" style={{ height: 16, width: '90%' }} />
                  <div className="skeleton" style={{ height: 16, width: '70%' }} />
                </div>
              ) : (
                <p style={{ color: 'var(--text)', fontSize: '0.97rem', lineHeight: 1.7, fontStyle: 'italic' }}>
                  "{aiInsight}"
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem', marginBottom: '2rem'
        }}>
          {QUICK_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="card"
              style={{ textAlign: 'center', padding: '1.25rem' }}
            >
              <div style={{ color: stat.color, marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
                {stat.label}
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
            style={{ textAlign: 'center', padding: '1.25rem' }}
          >
            <div style={{ color: 'var(--accent2)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
              <CalendarDays size={18} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent2)', lineHeight: 1 }}>
              {calendarEvents.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
              Saved ECs
            </div>
          </motion.div>
        </div>

        {/* Two column section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--accent)" /> Quick Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { to: '/explore', icon: <Search size={18} />, label: 'Find Extracurriculars', desc: 'AI-powered EC discovery', color: 'var(--accent)' },
                { to: '/calendar', icon: <CalendarDays size={18} />, label: 'My EC Calendar', desc: `${calendarEvents.length} activities planned`, color: 'var(--accent2)' },
                { to: '/zen', icon: <span>🎮</span>, label: 'Zen Space', desc: 'Relax & recharge', color: 'var(--accent3)' },
              ].map(item => (
                <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="card glass-hover"
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', cursor: 'pointer' }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: '11px', flexShrink: 0,
                      background: `${item.color}22`,
                      color: item.color, fontSize: '1rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                    <ArrowRight size={15} color="var(--text-dim)" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Major tips */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--accent2)" /> Tips for {userProfile?.major || 'Your Major'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {tips.map((tip, i) => (
                <motion.div
                  key={tip}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '0.9rem 1rem',
                    background: 'var(--bg2)', border: '1px solid var(--border)',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: '8px', flexShrink: 0,
                    background: 'rgba(247,162,106,0.15)', color: 'var(--accent2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-display)'
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: '0.87rem', color: 'var(--text-muted)' }}>{tip}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}