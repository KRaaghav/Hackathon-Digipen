import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, Plus, Clock, Users, BookOpen, Loader, Trash2, ChevronLeft } from 'lucide-react'

export default function Courses({ userProfile, calendarEvents, addCalendarEvent, removeCalendarEvent }) {
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState(new Set())
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [addedCourses, setAddedCourses] = useState(new Set())

  // Auto-update courses when subjects change
  useEffect(() => {
    if (selectedSchool && selectedGrade) {
      handleSearch()
    }
  }, [selectedSubjects, selectedSchool, selectedGrade])

  const SCHOOLS = [
    { name: 'Redmond High School', abbr: 'RHS' }
  ]

  const GRADES = ['9th Grade (Freshman)', '10th Grade (Sophomore)', '11th Grade (Junior)', '12th Grade (Senior)']

  const SUBJECT_CATEGORIES = [
    'English',
    'Mathematics', 
    'Science',
    'Social Studies',
    'World Languages',
    'Computer Science / Technology',
    'Engineering / STEM',
    'Visual Arts',
    'Music',
    'Theater',
    'Physical Education',
    'Other Electives'
  ]

  const COURSE_DATABASE = {
    'Redmond High School': {
      '9th Grade (Freshman)': {
        'English': [
          { title: 'English 9' },
          { title: 'English 9 Honors' },
        ],
        'Mathematics': [
          { title: 'Algebra 1' },
          { title: 'Geometry' },
        ],
        'Science': [
          { title: 'Biology' },
          { title: 'Biology Honors' },
        ],
        'Social Studies': [
          { title: 'World History' },
        ],
        'World Languages': [
          { title: 'Spanish 1' },
          { title: 'Spanish 2' },
          { title: 'French 1' },
          { title: 'French 2' },
          { title: 'French 3' },
          { title: 'French 4' },
          { title: 'Japanese 1' },
          { title: 'Japanese 2' },
          { title: 'Japanese 3' },
          { title: 'Japanese 4' },
          { title: 'Chinese (Mandarin) 1' },
          { title: 'Chinese (Mandarin) 2' },
          { title: 'Chinese (Mandarin) 3' },
          { title: 'Chinese (Mandarin) 4' },
        ],
        'Computer Science / Technology': [
          { title: 'Introduction to Computer Science' },
          { title: 'Web Design' },
        ],
        'Engineering / STEM': [
          { title: 'Engineering Design' },
          { title: 'Robotics' },
          { title: 'Manufacturing / Technology' },
        ],
        'Visual Arts': [
          { title: 'Drawing' },
          { title: 'Painting' },
          { title: 'Ceramics' },
          { title: 'Sculpture' },
          { title: 'Photography' },
          { title: 'Digital Art' },
        ],
        'Music': [
          { title: 'Concert Band' },
          { title: 'Symphonic Band' },
          { title: 'Jazz Band' },
          { title: 'Orchestra' },
          { title: 'Choir' },
        ],
        'Theater': [
          { title: 'Drama / Acting' },
          { title: 'Theater Production' },
          { title: 'Stagecraft' },
        ],
        'Physical Education': [
          { title: 'PE 9' },
          { title: 'Health' },
          { title: 'Fitness / Weight Training' },
          { title: 'Team Sports' },
        ],
        'Other Electives': [
          { title: 'AVID' },
          { title: 'Study Skills / Academic Support' },
        ],
      },
      '10th Grade (Sophomore)': {
        'English': [
          { title: 'English 10' },
          { title: 'English 10 Honors' },
          { title: 'Creative Writing' },
          { title: 'Journalism' },
          { title: 'Newspaper / Yearbook' },
          { title: 'Film Studies' },
          { title: 'Mythology' },
          { title: 'Public Speaking' },
        ],
        'Mathematics': [
          { title: 'Algebra 1' },
          { title: 'Geometry' },
          { title: 'Algebra 2' },
          { title: 'Algebra 2 Honors' },
        ],
        'Science': [
          { title: 'Chemistry' },
          { title: 'Chemistry Honors' },
        ],
        'Social Studies': [
          { title: 'World History' },
          { title: 'AP World History' },
        ],
        'World Languages': [
          { title: 'Spanish 1' },
          { title: 'Spanish 2' },
          { title: 'Spanish 3' },
          { title: 'French 1' },
          { title: 'French 2' },
          { title: 'French 3' },
          { title: 'French 4' },
          { title: 'Japanese 1' },
          { title: 'Japanese 2' },
          { title: 'Japanese 3' },
          { title: 'Japanese 4' },
          { title: 'Chinese (Mandarin) 1' },
          { title: 'Chinese (Mandarin) 2' },
          { title: 'Chinese (Mandarin) 3' },
          { title: 'Chinese (Mandarin) 4' },
        ],
        'Computer Science / Technology': [
          { title: 'Introduction to Computer Science' },
          { title: 'AP Computer Science Principles' },
          { title: 'AP Computer Science A' },
          { title: 'Web Design' },
          { title: 'Programming / Software Development' },
        ],
        'Engineering / STEM': [
          { title: 'Engineering Design' },
          { title: 'Robotics' },
          { title: 'Electronics' },
          { title: 'Manufacturing / Technology' },
        ],
        'Visual Arts': [
          { title: 'Drawing' },
          { title: 'Painting' },
          { title: 'Ceramics' },
          { title: 'Sculpture' },
          { title: 'Photography' },
          { title: 'Digital Art' },
        ],
        'Music': [
          { title: 'Concert Band' },
          { title: 'Symphonic Band' },
          { title: 'Jazz Band' },
          { title: 'Orchestra' },
          { title: 'Choir' },
        ],
        'Theater': [
          { title: 'Drama / Acting' },
          { title: 'Theater Production' },
          { title: 'Stagecraft' },
        ],
        'Physical Education': [
          { title: 'Fitness / Weight Training' },
          { title: 'Team Sports' },
          { title: 'Lifetime Fitness' },
        ],
        'Other Electives': [
          { title: 'Leadership' },
          { title: 'Service Learning' },
          { title: 'AVID' },
          { title: 'Study Skills / Academic Support' },
        ],
      },
      '11th Grade (Junior)': {
        'English': [
          { title: 'American Literature' },
          { title: 'American Literature Honors' },
          { title: 'AP English Language & Composition' },
          { title: 'Creative Writing' },
          { title: 'Journalism' },
          { title: 'Newspaper / Yearbook' },
          { title: 'Film Studies' },
          { title: 'Mythology' },
          { title: 'Public Speaking' },
        ],
        'Mathematics': [
          { title: 'Geometry' },
          { title: 'Algebra 2' },
          { title: 'Algebra 2 Honors' },
          { title: 'Precalculus' },
          { title: 'Precalculus Honors' },
          { title: 'AP Precalculus' },
          { title: 'AP Calculus AB' },
          { title: 'AP Statistics' },
        ],
        'Science': [
          { title: 'Physics' },
          { title: 'Physics Honors' },
          { title: 'AP Biology' },
          { title: 'AP Chemistry' },
          { title: 'AP Physics 1' },
          { title: 'Environmental Science' },
          { title: 'Anatomy & Physiology' },
          { title: 'Forensic Science' },
        ],
        'Social Studies': [
          { title: 'U.S. History' },
          { title: 'AP U.S. History' },
          { title: 'Psychology' },
          { title: 'AP Psychology' },
        ],
        'World Languages': [
          { title: 'Spanish 1' },
          { title: 'Spanish 2' },
          { title: 'Spanish 3' },
          { title: 'Spanish 4' },
          { title: 'AP Spanish Language' },
          { title: 'French 1' },
          { title: 'French 2' },
          { title: 'French 3' },
          { title: 'French 4' },
          { title: 'AP French' },
          { title: 'Japanese 1' },
          { title: 'Japanese 2' },
          { title: 'Japanese 3' },
          { title: 'Japanese 4' },
          { title: 'AP Japanese' },
          { title: 'Chinese (Mandarin) 1' },
          { title: 'Chinese (Mandarin) 2' },
          { title: 'Chinese (Mandarin) 3' },
          { title: 'Chinese (Mandarin) 4' },
          { title: 'AP Chinese' },
        ],
        'Computer Science / Technology': [
          { title: 'Introduction to Computer Science' },
          { title: 'AP Computer Science Principles' },
          { title: 'AP Computer Science A' },
          { title: 'Web Design' },
          { title: 'Programming / Software Development' },
        ],
        'Engineering / STEM': [
          { title: 'Engineering Design' },
          { title: 'Robotics' },
          { title: 'Electronics' },
          { title: 'Manufacturing / Technology' },
        ],
        'Visual Arts': [
          { title: 'Drawing' },
          { title: 'Painting' },
          { title: 'Ceramics' },
          { title: 'Sculpture' },
          { title: 'Photography' },
          { title: 'Digital Art' },
          { title: 'AP Studio Art' },
        ],
        'Music': [
          { title: 'Concert Band' },
          { title: 'Symphonic Band' },
          { title: 'Jazz Band' },
          { title: 'Orchestra' },
          { title: 'Choir' },
        ],
        'Theater': [
          { title: 'Drama / Acting' },
          { title: 'Theater Production' },
          { title: 'Stagecraft' },
        ],
        'Physical Education': [
          { title: 'Fitness / Weight Training' },
          { title: 'Team Sports' },
          { title: 'Lifetime Fitness' },
        ],
        'Other Electives': [
          { title: 'Leadership' },
          { title: 'Teacher Assistant' },
          { title: 'Service Learning' },
          { title: 'AVID' },
          { title: 'Study Skills / Academic Support' },
        ],
      },
      '12th Grade (Senior)': {
        'English': [
          { title: 'AP English Literature & Composition' },
          { title: 'Creative Writing' },
          { title: 'Journalism' },
          { title: 'Newspaper / Yearbook' },
          { title: 'Film Studies' },
          { title: 'Mythology' },
          { title: 'Public Speaking' },
        ],
        'Mathematics': [
          { title: 'Precalculus' },
          { title: 'Precalculus Honors' },
          { title: 'AP Precalculus' },
          { title: 'AP Calculus AB' },
          { title: 'AP Calculus BC' },
          { title: 'AP Statistics' },
        ],
        'Science': [
          { title: 'Physics' },
          { title: 'Physics Honors' },
          { title: 'AP Biology' },
          { title: 'AP Chemistry' },
          { title: 'AP Physics 1' },
          { title: 'AP Physics C' },
          { title: 'Environmental Science' },
          { title: 'Anatomy & Physiology' },
          { title: 'Forensic Science' },
        ],
        'Social Studies': [
          { title: 'Civics / Government' },
          { title: 'AP U.S. Government' },
          { title: 'Economics' },
          { title: 'AP Macroeconomics' },
          { title: 'Psychology' },
          { title: 'AP Psychology' },
        ],
        'World Languages': [
          { title: 'Spanish 1' },
          { title: 'Spanish 2' },
          { title: 'Spanish 3' },
          { title: 'Spanish 4' },
          { title: 'AP Spanish Language' },
          { title: 'French 1' },
          { title: 'French 2' },
          { title: 'French 3' },
          { title: 'French 4' },
          { title: 'AP French' },
          { title: 'Japanese 1' },
          { title: 'Japanese 2' },
          { title: 'Japanese 3' },
          { title: 'Japanese 4' },
          { title: 'AP Japanese' },
          { title: 'Chinese (Mandarin) 1' },
          { title: 'Chinese (Mandarin) 2' },
          { title: 'Chinese (Mandarin) 3' },
          { title: 'Chinese (Mandarin) 4' },
          { title: 'AP Chinese' },
        ],
        'Computer Science / Technology': [
          { title: 'Introduction to Computer Science' },
          { title: 'AP Computer Science Principles' },
          { title: 'AP Computer Science A' },
          { title: 'Web Design' },
          { title: 'Programming / Software Development' },
        ],
        'Engineering / STEM': [
          { title: 'Engineering Design' },
          { title: 'Robotics' },
          { title: 'Electronics' },
          { title: 'Manufacturing / Technology' },
        ],
        'Visual Arts': [
          { title: 'Drawing' },
          { title: 'Painting' },
          { title: 'Ceramics' },
          { title: 'Sculpture' },
          { title: 'Photography' },
          { title: 'Digital Art' },
          { title: 'AP Studio Art' },
        ],
        'Music': [
          { title: 'Concert Band' },
          { title: 'Symphonic Band' },
          { title: 'Jazz Band' },
          { title: 'Orchestra' },
          { title: 'Choir' },
        ],
        'Theater': [
          { title: 'Drama / Acting' },
          { title: 'Theater Production' },
          { title: 'Stagecraft' },
        ],
        'Physical Education': [
          { title: 'Fitness / Weight Training' },
          { title: 'Team Sports' },
          { title: 'Lifetime Fitness' },
        ],
        'Other Electives': [
          { title: 'Leadership' },
          { title: 'Teacher Assistant' },
          { title: 'Service Learning' },
          { title: 'AVID' },
          { title: 'Study Skills / Academic Support' },
        ],
      },
    }
  }

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school)
    setSelectedGrade(null)
    setQuery('')
    setSelectedSubjects(new Set())
    setCourses([])
    setHasSearched(false)
  }

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade)
    // Automatically show all courses for the selected grade
    handleSearch()
  }

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(subject)) {
        newSet.delete(subject)
      } else {
        newSet.add(subject)
      }
      return newSet
    })
  }

  const handleSelectAllSubjects = () => {
    setSelectedSubjects(new Set(SUBJECT_CATEGORIES))
  }

  const handleClearAllSubjects = () => {
    setSelectedSubjects(new Set())
  }

  const handleSearch = async () => {
    if (!selectedSchool || !selectedGrade) return
    
    setLoading(true)
    setHasSearched(true)
    
    setTimeout(() => {
      const schoolName = selectedSchool.name
      const gradeData = COURSE_DATABASE[schoolName]?.[selectedGrade] || {}
      let results = []

      if (selectedSubjects.size === 0) {
        // If no subjects selected, show all courses
        Object.entries(gradeData).forEach(([subject, courseList]) => {
          results = results.concat(courseList.map(c => ({ ...c, subject })))
        })
      } else {
        // Filter by selected subjects
        selectedSubjects.forEach(selectedSubject => {
          const courseList = gradeData[selectedSubject] || []
          results = results.concat(courseList.map(c => ({ ...c, subject: selectedSubject })))
        })
      }

      setCourses(results)
      setLoading(false)
    }, 500)
  }

  const handleAddCourse = (course) => {
    const courseId = `${course.title}`
    if (addedCourses.has(courseId)) return
    
    addCalendarEvent({
      title: course.title,
      description: `${selectedSchool.name} • ${selectedGrade} • ${course.subject}`,
      commitment: `Course`,
      meetingDay: `Redmond High School`,
      color: '#7c6af7',
      type: 'course'
    })
    setAddedCourses(prev => new Set([...prev, courseId]))
  }

  const handleRemoveCourse = (course) => {
    const courseId = `${course.title}`
    const event = calendarEvents.find(e => e.title === course.title && e.type === 'course')
    if (event) {
      removeCalendarEvent(event.id)
      setAddedCourses(prev => {
        const newSet = new Set(prev)
        newSet.delete(courseId)
        return newSet
      })
    }
  }

  const isAdded = (course) => {
    const courseId = `${course.title}`
    return addedCourses.has(courseId) || calendarEvents.some(e => e.title === course.title && e.type === 'course')
  }

  // School Selection View
  if (!selectedSchool) {
    return (
      <div className="page-container" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', padding: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', padding: '8px 16px', borderRadius: '100px', background: 'rgba(124, 106, 247, 0.15)', border: '1px solid rgba(124, 106, 247, 0.3)' }}>
              <BookOpen size={14} color="#7c6af7" />
              <span style={{ fontSize: '0.85rem', color: '#7c6af7', fontWeight: 600 }}>Course Planner</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Choose Your School
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
              Select Redmond High School to explore available courses for your grade level
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {SCHOOLS.map((school, i) => (
              <motion.button
                key={school.abbr}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSchoolSelect(school)}
                style={{
                  padding: '1.75rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--border)',
                  background: 'var(--bg2)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(124, 106, 247, 0.2)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏫</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
                  {school.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{school.abbr}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  // Grade Selection & Course Search View
  return (
    <div className="page-container" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { setSelectedSchool(null); setSelectedGrade(null); setCourses([]); setHasSearched(false) }}
            style={{ width: 40, height: 40, borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={18} />
          </motion.button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span className="chip chip-accent"><BookOpen size={10} /> {selectedSchool.abbr}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, margin: 0 }}>
              Find Your Courses
            </h1>
          </div>
        </div>

        {/* Grade Selection */}
        {!selectedGrade && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>Select your grade level at {selectedSchool.name}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {GRADES.map(grade => (
                <motion.button
                  key={grade}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGradeSelect(grade)}
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '2px solid var(--border)',
                    background: 'var(--bg2)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)' }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: 0 }}>
                    {grade}
                  </h3>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Course Search */}
        {selectedGrade && (
          <>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', margin: '0 0 0.75rem 0' }}>
                  Filter by Subject Areas
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={handleSelectAllSubjects}
                    style={{ 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: 'var(--radius)', 
                      border: '1px solid var(--border)', 
                      background: 'var(--bg)', 
                      color: 'var(--text-muted)', 
                      fontSize: '0.8rem', 
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    Select All
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={handleClearAllSubjects}
                    style={{ 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: 'var(--radius)', 
                      border: '1px solid var(--border)', 
                      background: 'var(--bg)', 
                      color: 'var(--text-muted)', 
                      fontSize: '0.8rem', 
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    Clear All
                  </motion.button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                  {SUBJECT_CATEGORIES.map(subject => (
                    <label key={subject} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-body)', color: 'var(--text)' }}>
                      <input
                        type="checkbox"
                        checked={selectedSubjects.has(subject)}
                        onChange={() => handleSubjectToggle(subject)}
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          accentColor: 'var(--primary)',
                          cursor: 'pointer'
                        }}
                      />
                      {subject}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Grade: {selectedGrade}</p>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-primary" onClick={handleSearch} disabled={loading}>
                  {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />}
                  {loading ? 'Loading...' : 'Show Courses'}
                </motion.button>
              </div>
            </div>

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

            {!loading && courses.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                {courses.map((course, i) => <CourseCard key={`${course.title}-${i}`} course={course} index={i} isAdded={isAdded(course)} onAdd={() => handleAddCourse(course)} onRemove={() => handleRemoveCourse(course)} />)}
              </div>
            )}

            {!loading && hasSearched && courses.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>No courses found for that search. Try a different subject.</p>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}

function CourseCard({ course, index, isAdded, onAdd, onRemove }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.06 }}
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden', transition: 'border-color 0.25s ease' }}
      onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
      onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#7c6af7' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 600, background: 'rgba(124, 106, 247, 0.15)', color: '#7c6af7', border: '1px solid rgba(124, 106, 247, 0.3)' }}>{course.subject}</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', lineHeight: 1.3, marginBottom: '0.25rem' }}>{course.title}</h3>
        </div>
        {isAdded ? (
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onRemove} style={{ width: 38, height: 38, borderRadius: '12px', flexShrink: 0, border: '2px solid var(--success)', background: 'rgba(106, 247, 162, 0.15)', color: 'var(--success)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s ease' }}>
            <Trash2 size={16} />
          </motion.button>
        ) : (
          <motion.button whileHover={{ scale: 1.15, rotate: 45 }} whileTap={{ scale: 0.9 }} onClick={onAdd} onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)} style={{ width: 38, height: 38, borderRadius: '12px', flexShrink: 0, border: `2px solid ${hovered ? '#7c6af7' : 'var(--border)'}`, background: hovered ? 'rgba(124, 106, 247, 0.15)' : 'transparent', color: hovered ? '#7c6af7' : 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s ease' }}>
            <Plus size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
