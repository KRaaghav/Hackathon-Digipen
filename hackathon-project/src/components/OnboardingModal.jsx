import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, BookOpen, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import GalaxyTree from './GalaxyTree'
import { useLanguage } from '../contexts/LanguageContext'

const MAJORS = [
  "Computer Science", "Software Engineering", "Data Science", "Cybersecurity",
  "Business Administration", "Finance", "Marketing", "Accounting", "Economics",
  "Psychology", "Sociology", "Political Science", "International Relations",
  "Biology", "Chemistry", "Physics", "Environmental Science", "Neuroscience",
  "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Biomedical Engineering",
  "Pre-Med", "Nursing", "Public Health", "Pharmacy",
  "English Literature", "Journalism", "Communications", "Media Studies",
  "Art & Design", "Architecture", "Film & Media", "Music",
  "History", "Philosophy", "Anthropology", "Religious Studies",
  "Mathematics", "Statistics", "Actuarial Science",
  "Education", "Social Work", "Criminal Justice",
  "Undecided / Exploring"
]

const YEARS = ["Freshman (1st Year)", "Sophomore (2nd Year)", "Junior (3rd Year)", "Senior (4th Year)", "Graduate Student"]

const GOALS = [
  "Get into graduate school", "Land a job at a top company", "Start my own business",
  "Research & academia", "Make a social impact", "Travel & work abroad",
  "Work in healthcare", "Creative career", "Public service / government"
]

const QUIZ_QUESTIONS = [
  {
    id: 'passion',
    question: "What excites you most?",
    options: [
      { label: "Building & creating things", value: "engineering" },
      { label: "Understanding people & society", value: "social" },
      { label: "Solving complex problems", value: "stem" },
      { label: "Telling stories & making art", value: "arts" },
      { label: "Healing & helping others", value: "health" },
      { label: "Money & markets", value: "business" }
    ]
  },
  {
    id: 'style',
    question: "How do you prefer to work?",
    options: [
      { label: "Hands-on experiments", value: "lab" },
      { label: "Analyzing data & patterns", value: "analytical" },
      { label: "Collaborating with teams", value: "social" },
      { label: "Independent deep work", value: "solo" },
      { label: "Leading & organizing", value: "leadership" },
      { label: "Creative exploration", value: "creative" }
    ]
  },
  {
    id: 'impact',
    question: "What kind of impact do you want?",
    options: [
      { label: "Technological innovation", value: "tech" },
      { label: "Social justice & equity", value: "social" },
      { label: "Scientific discovery", value: "science" },
      { label: "Economic prosperity", value: "economy" },
      { label: "Cultural & artistic enrichment", value: "culture" },
      { label: "Healthcare & wellness", value: "health" }
    ]
  }
]

export default function OnboardingModal({ onComplete }) {
  const { t } = useLanguage()
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState(null)
  const [profile, setProfile] = useState({ name: '', major: '', year: '', goals: [] })
  const [quizAnswers, setQuizAnswers] = useState({})

  // Step layout:
  // Both modes: 0=choose mode, 1=name+year
  // Dropdown: 2=major, 3=goals
  // Quiz: 2=Q1, 3=Q2, 4=Q3, 5=goals

  const isLastStep = () => {
    if (mode === 'dropdown') return step === 3
    if (mode === 'quiz') return step === 5
    return false
  }

  const totalDots = mode === 'quiz' ? 6 : mode === 'dropdown' ? 4 : 4

  const canProceed = () => {
    if (step === 0) return !!mode
    if (step === 1) return profile.name.trim().length > 0
    if (mode === 'dropdown') {
      if (step === 2) return !!profile.major && !!profile.year
      if (step === 3) return profile.goals.length > 0
    }
    if (mode === 'quiz') {
      if (step === 2) return !!quizAnswers['passion']
      if (step === 3) return !!quizAnswers['style']
      if (step === 4) return !!quizAnswers['impact']
      if (step === 5) return profile.goals.length > 0
    }
    return true
  }

  const suggestMajor = () => {
    const map = {
      engineering: "Software Engineering", stem: "Computer Science", social: "Psychology",
      arts: "Art & Design", health: "Nursing", business: "Business Administration",
      lab: "Biology", analytical: "Data Science", leadership: "Business Administration",
      creative: "Film & Media", solo: "Mathematics", tech: "Computer Science",
      science: "Biology", economy: "Finance", culture: "English Literature"
    }
    const vals = Object.values(quizAnswers)
    const counts = {}
    vals.forEach(v => { counts[v] = (counts[v] || 0) + 1 })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
    return map[top] || "Undecided / Exploring"
  }

  const handleNext = () => {
    if (canProceed() && !isLastStep()) setStep(s => s + 1)
  }

  const handleComplete = () => {
    onComplete({
      ...profile,
      major: mode === 'quiz' ? suggestMajor() : profile.major,
      discoveryMode: mode,
      createdAt: new Date().toISOString()
    })
  }

  const toggleGoal = (g) => {
    setProfile(p => ({
      ...p,
      goals: p.goals.includes(g) ? p.goals.filter(x => x !== g) : [...p.goals, g]
    }))
  }

  const getQuizQuestion = () => QUIZ_QUESTIONS[step - 2]

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        style={{
          width: '100%', maxWidth: '560px',
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: '24px', overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.8)'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)',
          padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GalaxyTree size={20} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'white' }}>{t('appName')}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{t('onboarding.subtitle')}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
            {Array.from({ length: totalDots }).map((_, i) => (
              <div key={i} style={{
                width: i === step ? 20 : 8, height: 8, borderRadius: '100px',
                background: i <= step ? 'white' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease'
              }} />
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '2rem' }}>
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>

            {/* Step 0: Choose mode */}
            {step === 0 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {t('onboarding.welcome')} 🎓
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  {t('onboarding.howDiscover')}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <ModeCard selected={mode === 'dropdown'} onClick={() => setMode('dropdown')} icon={<BookOpen size={22} />} title={t('onboarding.knowMajor')} desc={t('onboarding.knowMajorDesc')} />
                  <ModeCard selected={mode === 'quiz'} onClick={() => setMode('quiz')} icon={<Sparkles size={22} />} title={t('onboarding.helpMe')} desc={t('onboarding.helpMeDesc')} badge={t('onboarding.aiPowered')} />
                </div>
              </div>
            )}

            {/* Step 1: Name + Year */}
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t('onboarding.whatCallYou')}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{t('onboarding.personalize')}</p>
                <input className="input" placeholder={t('onboarding.namePlaceholder')} value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} autoFocus style={{ fontSize: '1rem', padding: '14px 16px', marginBottom: '1rem' }} onKeyDown={e => e.key === 'Enter' && canProceed() && handleNext()} />
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>{t('onboarding.yearLabel')}</label>
                <select className="input" value={profile.year} onChange={e => setProfile(p => ({ ...p, year: e.target.value }))}>
                  <option value="">{t('onboarding.selectYear')}</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}

            {/* Step 2 dropdown: Choose major */}
            {step === 2 && mode === 'dropdown' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t('onboarding.whatsMajor', { name: profile.name })}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{t('onboarding.selectMajor')}</p>
                <select className="input" value={profile.major} onChange={e => setProfile(p => ({ ...p, major: e.target.value }))} style={{ fontSize: '0.95rem' }}>
                  <option value="">{t('onboarding.selectMajorOption')}</option>
                  {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}

            {/* Steps 2-4 quiz: Quiz questions */}
            {mode === 'quiz' && step >= 2 && step <= 4 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <span className="chip chip-accent">{t('onboarding.questionOf', { n: step - 1 })}</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                  {getQuizQuestion() && t(`onboarding.${getQuizQuestion().id}`)}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {getQuizQuestion().options.map(opt => {
                    const selected = quizAnswers[getQuizQuestion().id] === opt.value
                    return (
                      <button key={opt.value} onClick={() => setQuizAnswers(prev => ({ ...prev, [getQuizQuestion().id]: opt.value }))}
                        style={{
                          padding: '14px 16px', borderRadius: '12px',
                          border: `2px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                          background: selected ? 'var(--accent-glow)' : 'rgba(255,255,255,0.03)',
                          color: selected ? 'var(--accent)' : 'var(--text-muted)',
                          cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                          transition: 'all 0.2s ease', textAlign: 'left'
                        }}>
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Goals step — dropdown step 3, quiz step 5 */}
            {((mode === 'dropdown' && step === 3) || (mode === 'quiz' && step === 5)) && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t('onboarding.whatGoals')}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{t('onboarding.goalsSub')}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {GOALS.map(g => {
                    const selected = profile.goals.includes(g)
                    return (
                      <button key={g} onClick={() => toggleGoal(g)}
                        style={{
                          padding: '8px 16px', borderRadius: '100px',
                          border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                          background: selected ? 'var(--accent-glow)' : 'transparent',
                          color: selected ? 'var(--accent)' : 'var(--text-muted)',
                          cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-body)',
                          transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                        {selected && <Check size={12} />}
                        {g}
                      </button>
                    )
                  })}
                </div>
                {profile.goals.length > 0 && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--accent)', marginTop: '0.75rem' }}>
                    ✓ {t('onboarding.goalsSelected', { n: profile.goals.length })}
                  </p>
                )}
              </div>
            )}

          </motion.div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-ghost" onClick={() => setStep(s => Math.max(0, s - 1))} style={{ visibility: step === 0 ? 'hidden' : 'visible' }}>
            <ChevronLeft size={16} /> {t('onboarding.back')}
          </button>

          {isLastStep() ? (
            <button className="btn btn-primary" onClick={handleComplete} disabled={!canProceed()} style={{ opacity: canProceed() ? 1 : 0.4, cursor: canProceed() ? 'pointer' : 'not-allowed' }}>
              <Sparkles size={16} /> {t('onboarding.letsGo')}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleNext} disabled={!canProceed()} style={{ opacity: canProceed() ? 1 : 0.4, cursor: canProceed() ? 'pointer' : 'not-allowed' }}>
              {t('onboarding.continue')} <ChevronRight size={16} />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function ModeCard({ selected, onClick, icon, title, desc, badge }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
      borderRadius: '14px', border: `2px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
      background: selected ? 'var(--accent-glow)' : 'rgba(255,255,255,0.03)',
      cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s ease'
    }}>
      <div style={{ width: 44, height: 44, borderRadius: '12px', flexShrink: 0, background: selected ? 'var(--accent)' : 'rgba(255,255,255,0.08)', color: selected ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem', color: selected ? 'var(--accent)' : 'var(--text)' }}>
          {title}
          {badge && <span className="chip chip-accent" style={{ fontSize: '0.65rem' }}>{badge}</span>}
        </div>
        <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>{desc}</div>
      </div>
      <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, border: `2px solid ${selected ? 'var(--accent)' : 'var(--border)'}`, background: selected ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}>
        {selected && <Check size={11} color="white" />}
      </div>
    </button>
  )
}