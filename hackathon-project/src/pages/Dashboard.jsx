import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, TrendingUp, CalendarDays, Search, ArrowRight, BookOpen, Target, Clock, Star } from 'lucide-react'
import Antigravity from '../components/Antigravity'

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

const TIPS_BY_MAJOR = {
  "Computer Science": ["Build a GitHub portfolio", "Contribute to open source", "Learn system design", "Practice LeetCode daily"],
  "Software Engineering": ["Master full-stack development", "Deploy side projects", "Learn DevOps basics", "Study clean code principles"],
  "Data Science": ["Build predictive models", "Master Python & SQL", "Create visualizations", "Participate in Kaggle competitions"],
  "Cybersecurity": ["Get security certifications", "Capture The Flag competitions", "Learn penetration testing", "Study network security"],
  "Business Administration": ["Network on LinkedIn", "Join a business club", "Read the WSJ daily", "Find a mentor in industry"],
  "Finance": ["Learn financial modeling", "Follow the market daily", "Get CFA certifications", "Intern at investment firms"],
  "Marketing": ["Build a personal brand", "Study consumer psychology", "Create marketing campaigns", "Learn analytics tools"],
  "Accounting": ["Master Excel & accounting software", "Get CPA exam prep started", "Intern at accounting firms", "Stay updated on tax law"],
  "Economics": ["Study economic theory deeply", "Read economics journals", "Learn econometrics", "Analyze real-world markets"],
  "Psychology": ["Volunteer at a counseling center", "Read academic journals", "Join APA student division", "Apply for research positions"],
  "Sociology": ["Conduct field research", "Read sociological studies", "Join sociology club", "Explore social issues deeply"],
  "Political Science": ["Intern in government", "Follow current politics", "Mock debate competitions", "Study policy papers"],
  "International Relations": ["Learn multiple languages", "Study geopolitics", "Join Model UN", "Intern at international orgs"],
  "Biology": ["Find a research lab", "Shadow a professional", "Study for MCAT early", "Join science honor society"],
  "Chemistry": ["Master lab techniques", "Join research groups", "Study for GRE early", "Participate in science olympiad"],
  "Physics": ["Build physics projects", "Study quantum mechanics deeply", "Join physics clubs", "Attend physics symposiums"],
  "Environmental Science": ["Work on conservation projects", "Study climate change research", "Join environmental clubs", "Volunteer for cleanups"],
  "Neuroscience": ["Find brain research labs", "Study neurobiology deeply", "Read neuroscience journals", "Shadow neuroscientists"],
  "Mechanical Engineering": ["Build robots or engines", "Learn CAD software", "Join engineering competitions", "Intern at tech companies"],
  "Electrical Engineering": ["Master circuit design", "Build electronics projects", "Learn microcontrollers", "Intern at tech firms"],
  "Civil Engineering": ["Design infrastructure projects", "Use CAD software", "Intern at engineering firms", "Study sustainability"],
  "Biomedical Engineering": ["Research medical devices", "Study human physiology", "Join biomedical clubs", "Intern at medical companies"],
  "Pre-Med": ["Volunteer at hospitals", "Maintain high GPA", "Get clinical experience", "Prepare for MCAT"],
  "Nursing": ["Get clinical certifications", "Volunteer in hospitals", "Study anatomy thoroughly", "Network with nurses"],
  "Public Health": ["Work on health projects", "Study epidemiology", "Intern at health organizations", "Learn data analysis"],
  "Pharmacy": ["Intern at pharmacies", "Study biochemistry deeply", "Prepare for PCAT", "Get healthcare certifications"],
  "English Literature": ["Read widely and critically", "Join writing workshops", "Build writing portfolio", "Submit to literary journals"],
  "Journalism": ["Write for student publications", "Build journalism portfolio", "Learn multimedia reporting", "Intern at news outlets"],
  "Communications": ["Study media & rhetoric", "Build communication skills", "Intern in communications", "Create media projects"],
  "Media Studies": ["Analyze films & media", "Create media projects", "Intern at media companies", "Study digital culture"],
  "Art & Design": ["Build visual portfolio", "Practice design daily", "Exhibit your work", "Follow design trends"],
  "Architecture": ["Master architecture software", "Explore building design", "Intern at firms", "Attend architecture lectures"],
  "Film & Media": ["Create short films", "Build filmmaking portfolio", "Attend film festivals", "Study cinematography"],
  "Music": ["Practice your instrument", "Perform regularly", "Learn music theory deeply", "Collaborate with musicians"],
  "History": ["Read historical sources", "Write research papers", "Study primary documents", "Intern at museums"],
  "Philosophy": ["Read philosophy widely", "Engage in debates", "Write analytical essays", "Explore ethics deeply"],
  "Anthropology": ["Study human cultures", "Read ethnographies", "Volunteer in communities", "Explore fieldwork methods"],
  "Religious Studies": ["Study world religions", "Read sacred texts", "Engage in discussions", "Explore comparative religion"],
  "Mathematics": ["Solve complex problems", "Study pure math deeply", "Join math clubs", "Participate in competitions"],
  "Statistics": ["Learn R and Python", "Analyze real datasets", "Study statistical theory", "Intern at data companies"],
  "Actuarial Science": ["Pass actuarial exams", "Study probability deeply", "Learn financial math", "Intern at insurance firms"],
  "Education": ["Tutor students regularly", "Intern at schools", "Study pedagogy", "Volunteer in classrooms"],
  "Social Work": ["Volunteer with communities", "Get certifications", "Intern at social agencies", "Study social policy"],
  "Criminal Justice": ["Intern in law enforcement", "Study criminology", "Shadow professionals", "Learn investigative methods"],
  "Undecided / Exploring": ["Explore various majors", "Take diverse electives", "Talk to career advisors", "Attend major info sessions"]
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
  // Initialize from localStorage if available, otherwise from userProfile
  const [selectedMajor, setSelectedMajor] = useState(() => {
    const saved = localStorage.getItem('userMajor')
    return saved || userProfile?.major || 'Computer Science'
  })
  const [majorInput, setMajorInput] = useState(() => {
    const saved = localStorage.getItem('userMajor')
    return saved || userProfile?.major || 'Computer Science'
  })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const tips = TIPS_BY_MAJOR[selectedMajor] || TIPS_BY_MAJOR.default

  // Save major to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userMajor', selectedMajor)
  }, [selectedMajor])

  // Fuzzy search to find matching majors
  const findMatchingMajors = (query) => {
    if (!query.trim()) return MAJORS
    
    const lowerQuery = query.toLowerCase()
    
    // Exact match
    const exactMatch = MAJORS.filter(m => m.toLowerCase() === lowerQuery)
    if (exactMatch.length > 0) return exactMatch
    
    // Starts with
    const startsWithMatch = MAJORS.filter(m => m.toLowerCase().startsWith(lowerQuery))
    if (startsWithMatch.length > 0) return startsWithMatch
    
    // Contains
    const containsMatch = MAJORS.filter(m => m.toLowerCase().includes(lowerQuery))
    if (containsMatch.length > 0) return containsMatch
    
    // Fuzzy: matching individual words
    const words = lowerQuery.split(' ')
    const fuzzyMatch = MAJORS.filter(major => {
      const majorWords = major.toLowerCase().split(' ')
      return words.some(word => majorWords.some(mWord => mWord.startsWith(word)))
    })
    
    return fuzzyMatch.length > 0 ? fuzzyMatch : []
  }

  const handleMajorInputChange = (value) => {
    setMajorInput(value)
    const matches = findMatchingMajors(value)
    setSuggestions(matches)
    setShowSuggestions(matches.length > 0)
  }

  const handleMajorSelect = (major) => {
    setSelectedMajor(major)
    setMajorInput(major)
    setShowSuggestions(false)
    setSuggestions([])
    // TODO: Update in database
    // await updateUserProfile({ major })
  }

  const handleMajorInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150)
  }

  const handleMajorKeyDown = (e) => {
    if (e.key === 'Enter') {
      const matches = findMatchingMajors(majorInput)
      if (matches.length > 0) {
        handleMajorSelect(matches[0])
      }
    }
  }

  const fetchInsight = async () => {
    if (insightFetched) return
    setLoadingInsight(true)
    // Set a motivational default message without API call (to avoid CORS issues)
    setAiInsight("Stay consistent with your studies and look for hands-on opportunities to apply your knowledge this semester.")
    setInsightFetched(true)
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
    <div className="page-container" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
      {/* Antigravity Background */}
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        <Antigravity
          count={300}
          magnetRadius={6}
          ringRadius={7}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={2}
          lerpSpeed={0.05}
          color="#5227FF"
          autoAnimate
          particleVariance={1.5}
          rotationSpeed={0}
          depthFactor={1}
          pulseSpeed={3}
          particleShape="circle"
          fieldStrength={10}
        />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Hero Section with Pathfinder */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.320, 1] }}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          marginBottom: '3rem',
          position: 'relative'
        }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.320, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em',
            backgroundImage: 'linear-gradient(135deg, #7c6af7 0%, #f7a26a 50%, #6af7c8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          PathFinder
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            fontSize: 'clamp(1.25rem, 3.5vw, 1.8rem)',
            color: 'var(--text-muted)',
            maxWidth: 700,
            lineHeight: 1.9,
            marginBottom: '3rem',
            fontWeight: 400,
            letterSpacing: '0.3px',
            textAlign: 'center'
          }}
        >
          Here's your personalized academic command center. Let's make today count.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
            style={{
              fontSize: '1.05rem',
              padding: '16px 40px',
              borderRadius: '12px',
              fontWeight: 600
            }}
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-ghost"
            style={{
              fontSize: '1.05rem',
              padding: '16px 40px',
              borderRadius: '12px',
              fontWeight: 600,
              border: '1px solid var(--border)'
            }}
          >
            Learn More
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Scroll to explore</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: '1.5rem' }}
          >
            ↓
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.320, 1] }}
      >
        {/* Hero greeting with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.320, 1] }}
          style={{ marginBottom: '3rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="chip chip-accent"
              style={{
                backdropFilter: 'blur(12px)',
                background: 'linear-gradient(135deg, rgba(124,106,247,0.15), rgba(124,106,247,0.05))',
                border: '1.5px solid rgba(124,106,247,0.4)',
                borderRadius: '50px',
                padding: '10px 20px',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 12px 40px rgba(124,106,247,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                cursor: 'pointer',
                transition: 'all 0.05s ease'
              }}
            >
              <Sparkles size={14} style={{ marginRight: '6px' }} /> AI-Powered
            </motion.span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ position: 'relative', flex: '0 1 auto' }}>
              <motion.input
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                type="text"
                placeholder="What's your major?"
                value={majorInput}
                onChange={(e) => handleMajorInputChange(e.target.value)}
                onFocus={() => setShowSuggestions(majorInput.trim().length > 0)}
                onBlur={handleMajorInputBlur}
                onKeyDown={handleMajorKeyDown}
                style={{
                  backdropFilter: 'blur(12px)',
                  background: 'linear-gradient(135deg, rgba(247,162,106,0.15), rgba(247,162,106,0.05))',
                  border: '1.5px solid rgba(247,162,106,0.4)',
                  borderRadius: '50px',
                  padding: '12px 20px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 12px 40px rgba(247,162,106,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                  color: 'var(--text)',
                  outline: 'none',
                  width: '280px',
                  transition: 'all 0.2s ease',
                  '::placeholder': {
                    color: 'var(--text-muted)'
                  }
                }}
              />
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '8px',
                    background: 'linear-gradient(135deg, rgba(50,30,100,0.95), rgba(40,20,80,0.95))',
                    backdropFilter: 'blur(20px)',
                    border: '1.5px solid rgba(247,162,106,0.3)',
                    borderRadius: '20px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 100,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.3)'
                  }}
                >
                  {suggestions.slice(0, 8).map(major => (
                    <motion.div
                      key={major}
                      whileHover={{ backgroundColor: 'rgba(247,162,106,0.1)' }}
                      onClick={() => handleMajorSelect(major)}
                      style={{
                        padding: '12px 20px',
                        cursor: 'pointer',
                        color: selectedMajor === major ? 'var(--accent)' : 'var(--text)',
                        fontWeight: selectedMajor === major ? 700 : 500,
                        transition: 'all 0.1s ease',
                        borderBottom: major !== suggestions[Math.min(7, suggestions.length - 1)] ? '1px solid rgba(247,162,106,0.1)' : 'none'
                      }}
                    >
                      {major}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="chip chip-green"
              style={{
                backdropFilter: 'blur(12px)',
                background: 'linear-gradient(135deg, rgba(106,247,162,0.15), rgba(106,247,162,0.05))',
                border: '1.5px solid rgba(106,247,162,0.4)',
                borderRadius: '50px',
                padding: '10px 20px',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 12px 40px rgba(106,247,162,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                cursor: 'pointer',
                transition: 'all 0.05s ease'
              }}
            >
              {userProfile?.year || ''}
            </motion.span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.23, 1, 0.320, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 6vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, var(--text) 0%, var(--accent) 50%, var(--accent2) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {greeting}, {userProfile?.name || 'Scholar'} 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.6 }}
            style={{
              color: 'var(--text)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              maxWidth: 650,
              lineHeight: 1.8,
              fontWeight: 700,
              letterSpacing: '0.3px',
              padding: '2rem 2.5rem',
              borderRadius: '80px',
              background: 'linear-gradient(135deg, rgba(247,100,100,0.12), rgba(247,100,100,0.06))',
              border: '1.5px solid rgba(247,100,100,0.25)',
              boxShadow: '0 8px 32px rgba(247,100,100,0.15), inset 0 1px 2px rgba(255,255,255,0.1)',
              margin: '0 auto'
            }}
          >
            Here's your personalized academic command center. Let's make today count.
          </motion.p>
        </motion.div>

        {/* AI Insight card with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.23, 1, 0.320, 1] }}
          whileHover={{ scale: 1.01, boxShadow: '0 20px 60px rgba(124,106,247,0.2)' }}
          style={{
            background: 'linear-gradient(135deg, rgba(124,106,247,0.08) 0%, rgba(168,85,247,0.04) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(124,106,247,0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            marginBottom: '2.5rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(124,106,247,0.1)'
          }}
        >
          <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(124,106,247,0.08)', filter: 'blur(30px)' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', position: 'relative' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              style={{
                width: 48, height: 48, borderRadius: '14px', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--accent), #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(124,106,247,0.3)'
              }}
            >
              <Sparkles size={20} color="white" />
            </motion.div>
            <div style={{ flex: 1 }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem',
                  color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em',
                  marginBottom: '0.75rem'
                }}
              >
                ✨ AI Advisor · Today's Insight
              </motion.div>
              {loadingInsight ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="skeleton" style={{ height: 16, width: '90%' }} />
                  <div className="skeleton" style={{ height: 16, width: '70%' }} />
                </div>
              ) : (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  style={{ color: 'var(--text)', fontSize: '1rem', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}
                >
                  "{aiInsight}"
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick stats - Bigger and centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}
        >
          {QUICK_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.12, translateY: -8 }}
              className="card"
              style={{
                textAlign: 'center',
                padding: '2.5rem 2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <motion.div
                style={{ color: stat.color, marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}
                whileHover={{ rotate: 15, scale: 1.3 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {stat.icon}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 + i * 0.1, duration: 0.5 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: stat.color,
                  lineHeight: 1,
                  marginBottom: '0.5rem'
                }}
              >
                {stat.value}
              </motion.div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {stat.label}
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ scale: 1.12, translateY: -8 }}
            className="card"
            style={{ textAlign: 'center', padding: '2.5rem 2rem', cursor: 'pointer' }}
          >
            <motion.div
              style={{ color: 'var(--accent2)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}
              whileHover={{ rotate: 15, scale: 1.3 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CalendarDays size={24} />
            </motion.div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--accent2)',
              lineHeight: 1,
              marginBottom: '0.5rem'
            }}
            >
              {calendarEvents.length}
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Saved ECs
            </div>
          </motion.div>
        </motion.div>

        {/* Two column section - Centered and bigger */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          marginBottom: '4rem'
        }}>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              marginBottom: '2rem',
              fontSize: '1.4rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <TrendingUp size={24} color="var(--accent)" /> Quick Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { to: '/explore', icon: <Search size={24} />, label: 'Find Extracurriculars', desc: 'AI-powered EC discovery', color: 'var(--accent)' },
                { to: '/calendar', icon: <CalendarDays size={24} />, label: 'My EC Calendar', desc: `${calendarEvents.length} activities planned`, color: 'var(--accent2)' },
                { to: '/zen', icon: <span style={{ fontSize: '1.3rem' }}>🎮</span>, label: 'Zen Space', desc: 'Relax & recharge', color: 'var(--accent3)' },
              ].map((item, idx) => (
                <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.85 + idx * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.08, boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    className="card glass-hover"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      padding: '1.5rem 2rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <motion.div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: '12px',
                        flexShrink: 0,
                        background: `${item.color}22`,
                        color: item.color,
                        fontSize: '1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      whileHover={{ rotate: 20, scale: 1.2 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div style={{ flex: 1 }}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 + idx * 0.1 }}
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600,
                          fontSize: '1.05rem',
                          marginBottom: '0.3rem'
                        }}
                      >
                        {item.label}
                      </motion.div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                    <motion.div
                      animate={{ x: [0, 6, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight size={20} color="var(--text-dim)" />
                    </motion.div>
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
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              marginBottom: '2rem',
              fontSize: '1.4rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <BookOpen size={24} color="var(--accent2)" /> Tips for {selectedMajor || 'Your Major'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tips.map((tip, i) => (
                <motion.div
                  key={tip}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85 + i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.06, boxShadow: '0 12px 40px rgba(247,162,106,0.15)' }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1.5rem 1.5rem',
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.1, type: 'spring', stiffness: 300 }}
                    whileHover={{ scale: 1.25, rotate: 360 }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      flexShrink: 0,
                      background: 'rgba(247,162,106,0.2)',
                      color: 'var(--accent2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-display)'
                    }}
                  >
                    {i + 1}
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.95 + i * 0.1 }}
                    style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}
                  >
                    {tip}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Daily Affirmation Section */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.7, ease: [0.23, 1, 0.320, 1] }}
          whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(106,247,200,0.15)' }}
          style={{
            marginTop: '3rem',
            padding: '2.5rem',
            background: 'linear-gradient(135deg, rgba(106,247,200,0.08) 0%, rgba(106,247,162,0.04) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(106,247,200,0.2)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            boxShadow: '0 8px 32px rgba(106,247,200,0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: 'rgba(106,247,162,0.08)', filter: 'blur(30px)' }} />
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.3, type: 'spring', stiffness: 200 }}
            style={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(106,247,162,0.3), rgba(106,247,200,0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}
          >
            🌿
          </motion.div>
          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.35 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: 'var(--accent3)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.5rem'
              }}
            >
              Daily Reminder
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                margin: 0,
                lineHeight: 1.7,
                fontWeight: 400
              }}
            >
              Taking breaks is scientifically proven to improve focus and reduce stress. You're not wasting time — you're investing in your best performance. 🌿
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.45 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-ghost"
            style={{
              fontSize: '0.82rem',
              padding: '8px 16px',
              position: 'relative',
              zIndex: 1,
              whiteSpace: 'nowrap'
            }}
            onClick={() => {
              const affirmations = ["You're doing great!", "Rest is productive too.", "One bubble at a time 🫧", "Progress over perfection.", "Breathe. You've got this.", "You are capable of amazing things."]
              alert(affirmations[Math.floor(Math.random() * affirmations.length)])
            }}
          >
            ✨ Get Affirmation
          </motion.button>
        </motion.div>
      </motion.div>
      </div>
    </div>
  )
}
