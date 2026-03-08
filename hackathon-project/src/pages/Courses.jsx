import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, Plus, Clock, Users, BookOpen, Loader, Trash2, ChevronLeft } from 'lucide-react'
import { EHS_COURSE_DATABASE } from '../data/eastlakeCourses'
import { RHS_COURSE_DATABASE } from '../data/redmondCourses'
import { TESLA_STEM_COURSE_DATABASE } from '../data/teslaStemCourses'

export default function Courses({ userProfile, calendarEvents, addCalendarEvent, removeCalendarEvent }) {
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [currentGrade, setCurrentGrade] = useState('9th Grade (Freshman)') // For browsing within selected school
  const [viewMode, setViewMode] = useState('browse') // 'browse', 'all-grades', 'transcript'
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
    { name: 'Redmond High School', abbr: 'RHS' },
    { name: 'Eastlake High School', abbr: 'EHS' },
    { name: 'Tesla STEM High School', abbr: 'TSTEM' }
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
    'RHS': RHS_COURSE_DATABASE,
    'EHS': EHS_COURSE_DATABASE,
    'TSTEM': TESLA_STEM_COURSE_DATABASE,
  }

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school)
    setSelectedGrade(null)
    setCurrentGrade('9th Grade (Freshman)')
    setQuery('')
    setSelectedSubjects(new Set())
    setCourses([])
    setHasSearched(false)
    setViewMode('browse')
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
      const gradeData = COURSE_DATABASE[selectedSchool.abbr]?.[selectedGrade] || {}
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

  // Get all courses across all grades
  const getAllCourses = () => {
    if (!selectedSchool) return {}
    const schoolData = COURSE_DATABASE[selectedSchool.abbr] || {}
    const allGradesCourses = {}
    
    GRADES.forEach(grade => {
      const gradeData = schoolData[grade] || {}
      allGradesCourses[grade] = []
      Object.entries(gradeData).forEach(([subject, courseList]) => {
        allGradesCourses[grade] = allGradesCourses[grade].concat(
          courseList.map(c => ({ ...c, subject }))
        )
      })
    })
    
    return allGradesCourses
  }

  // Credit requirements: EHS minimums (24 total), plus reference columns for Public 4-Year and Highly Selective
  const TOTAL_CREDITS_REQUIRED = 24
  const CREDIT_REQUIREMENTS_TABLE = [
    { subject: 'English', ehs: '4 credits', public4yr: '4 credits', highlySelective: '4 credits' },
    { subject: 'Math', ehs: '3 credits (ALG 1, GEO & ALG 2)', public4yr: '3 credits (Min ALG 1 & GEO AND ALG 2 AND 1.0 cr Math in Senior Year)', highlySelective: '3–4 credits' },
    { subject: 'Science', ehs: '3 credits', public4yr: '2 credits Lab Science (algebra-based biology, chemistry, or physics)', highlySelective: '3–4 credits' },
    { subject: 'Social Studies', ehs: '3 credits', public4yr: '3 credits', highlySelective: '3–4 credits' },
    { subject: 'World Language', ehs: '2 credits', public4yr: '2 credits (same language)', highlySelective: '3–4 credits' },
    { subject: 'Visual or Performing Arts', ehs: '2 credits', public4yr: '1 credit', highlySelective: '2–3 credits' },
    { subject: 'Health & Fitness', ehs: '1.5 Fitness + 0.5 Health', public4yr: 'Varies by school', highlySelective: '—' },
    { subject: 'Career & Technical Education', ehs: '1.0 credit', public4yr: '—', highlySelective: '—' },
    { subject: 'Elective', ehs: 'To meet 24 total', public4yr: '—', highlySelective: '—' },
  ]

  // EHS minimum credits per category (used for progress). Elective = remainder to reach 24.
  const EHS_REQUIREMENTS = {
    'English': 4,
    'Math': 3,
    'Science': 3,
    'Social Studies': 3,
    'World Language': 2,
    'Visual or Performing Arts': 2,
    'Health & Fitness': 2,
    'Career & Technical Education': 1,
    'Elective': 4, // 24 - (4+3+3+3+2+2+2+1) = 4
  }

  // Map course subject (from SUBJECT_CATEGORIES) to requirement category
  const SUBJECT_TO_REQUIREMENT = {
    'English': 'English',
    'Mathematics': 'Math',
    'Science': 'Science',
    'Social Studies': 'Social Studies',
    'World Languages': 'World Language',
    'Visual Arts': 'Visual or Performing Arts',
    'Music': 'Visual or Performing Arts',
    'Theater': 'Visual or Performing Arts',
    'Physical Education': 'Health & Fitness',
    'Computer Science / Technology': 'Career & Technical Education',
    'Engineering / STEM': 'Career & Technical Education',
    'Other Electives': 'Elective',
  }

  // Graduation requirements (for display and progress) — deep copy with completed credits
  const getGraduationRequirements = () => ({
    'English': { required: EHS_REQUIREMENTS['English'], completed: 0 },
    'Math': { required: EHS_REQUIREMENTS['Math'], completed: 0 },
    'Science': { required: EHS_REQUIREMENTS['Science'], completed: 0 },
    'Social Studies': { required: EHS_REQUIREMENTS['Social Studies'], completed: 0 },
    'World Language': { required: EHS_REQUIREMENTS['World Language'], completed: 0 },
    'Visual or Performing Arts': { required: EHS_REQUIREMENTS['Visual or Performing Arts'], completed: 0 },
    'Health & Fitness': { required: EHS_REQUIREMENTS['Health & Fitness'], completed: 0 },
    'Career & Technical Education': { required: EHS_REQUIREMENTS['Career & Technical Education'], completed: 0 },
    'Elective': { required: EHS_REQUIREMENTS['Elective'], completed: 0 },
  })

  // Count completed credits per requirement category (using actual course credits from database)
  const getCompletedRequirements = () => {
    const reqs = getGraduationRequirements()
    const allGradesCourses = getAllCourses()
    const selectedCourseEvents = calendarEvents.filter(e => e.type === 'course')

    selectedCourseEvents.forEach(event => {
      const parts = event.description?.split('•').map(s => s?.trim()) || []
      const grade = parts[1]
      const subject = parts[2]
      const courseList = grade && allGradesCourses[grade] ? allGradesCourses[grade] : []
      const fullCourse = courseList.find(c => c.title === event.title)
      const credits = fullCourse?.credits ?? 1
      const requirementKey = SUBJECT_TO_REQUIREMENT[subject] || 'Elective'
      if (reqs[requirementKey]) {
        reqs[requirementKey].completed += credits
      }
    })

    return reqs
  }

  const selectedCourses = calendarEvents.filter(e => e.type === 'course')
  const completedReqs = getCompletedRequirements()

  // School Selection View
  if (!selectedSchool) {
    return (
      <div className="page-container" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', padding: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', padding: '8px 16px', borderRadius: '100px', background: 'rgba(124, 106, 247, 0.15)', border: '1px solid rgba(124, 106, 247, 0.3)' }}>
              <BookOpen size={14} color="#7c6af7" />
              <span style={{ fontSize: '0.85rem', color: '#7c6af7', fontWeight: 600 }}>Course Planner on Ascend</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Choose Your School
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
              Select your school to explore available courses for your grade level
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

  // Transcript View - Show selected courses and requirements
  if (viewMode === 'transcript') {
    const allGradesCourses = getAllCourses()
    
    // Group selected courses by grade
    const coursesByGrade = {}
    GRADES.forEach(grade => { coursesByGrade[grade] = [] })
    
    selectedCourses.forEach(course => {
      const grade = course.description?.split('•')[1]?.trim()
      if (grade && coursesByGrade.hasOwnProperty(grade)) {
        coursesByGrade[grade].push(course)
      }
    })
    
    // Calculate total credits and groupby grade
    const creditsByGrade = {}
    Object.entries(coursesByGrade).forEach(([grade, courses]) => {
      creditsByGrade[grade] = courses.reduce((sum, course) => {
        const fullCourse = GRADES.flatMap(g => Object.values(allGradesCourses[g] || {})).find(c => c.title === course.title)
        return sum + (fullCourse?.credits || 0)
      }, 0)
    })
    
    const totalCredits = Object.values(creditsByGrade).reduce((sum, credits) => sum + credits, 0)
    
    return (
      <div className="page-container" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', padding: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, margin: 0 }}>📋 My Course Transcript</h1>
              <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Courses by year with difficulty levels and total credits</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('browse')}
                style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem' }}
              >
                Browse Courses
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('all-grades')}
                style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem' }}
              >
                All Grades
              </motion.button>
            </div>
          </div>

          {/* Courses by Grade */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            {GRADES.map((grade, idx) => {
              const gradeCourses = coursesByGrade[grade] || []
              const gradeCredits = creditsByGrade[grade] || 0
              
              return (
                <motion.div
                  key={grade}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    borderLeft: '4px solid var(--accent)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>
                      {grade}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(124, 106, 247, 0.15)', border: '1px solid rgba(124, 106, 247, 0.3)', borderRadius: 'var(--radius)', fontSize: '0.75rem', fontWeight: 600, color: '#7c6af7' }}>
                        📚 {gradeCourses.length} courses
                      </span>
                      <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(106, 247, 162, 0.15)', border: '1px solid rgba(106, 247, 162, 0.3)', borderRadius: 'var(--radius)', fontSize: '0.75rem', fontWeight: 600, color: '#6af7a2' }}>
                        ⭐ {gradeCredits} credits
                      </span>
                    </div>
                  </div>
                  
                  {gradeCourses.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
                      {gradeCourses.map((course, i) => {
                        const fullCourse = allGradesCourses[grade]?.find(c => c.title === course.title)
                        const diffColor = fullCourse?.difficulty === 'Easy' ? '#6af7a2' : fullCourse?.difficulty === 'Medium' ? '#f7d66a' : '#f76a6a'
                        
                        return (
                          <div
                            key={`${course.id}-${i}`}
                            style={{
                              background: 'var(--bg)',
                              padding: '0.75rem 1rem',
                              borderRadius: 'var(--radius)',
                              border: '1px solid var(--border)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, fontSize: '0.9rem' }}>{course.title}</p>
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: `${diffColor}22`, color: diffColor, borderRadius: '3px', fontWeight: 600 }}>
                                  {fullCourse?.difficulty}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {fullCourse?.credits} cr
                                </span>
                              </div>
                              {fullCourse?.prerequisite && (
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem', color: 'var(--text-dim)' }}>Prereq: {fullCourse.prerequisite}</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>No courses selected for this year</p>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Summary and Requirements */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            {/* Total Credits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem'
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📊 Course Summary
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Credits Enrolled</p>
                  <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>
                    {totalCredits} / {TOTAL_CREDITS_REQUIRED}
                  </p>
                </div>
                <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Courses Selected</p>
                  <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>
                    {selectedCourses.length}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Graduation Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem'
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎓 EHS Graduation Requirements (24 credits)
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(completedReqs).map(([req, data]) => (
                  <div key={req}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.25rem',
                      fontSize: '0.85rem'
                    }}>
                      <span>{req}</span>
                      <span style={{ fontWeight: 600, color: data.completed >= data.required ? '#6af7a2' : 'var(--text-muted)' }}>
                        {data.completed.toFixed(1)} / {data.required}
                      </span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: 'var(--bg)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (data.completed / data.required) * 100)}%` }}
                        transition={{ duration: 0.6 }}
                        style={{
                          height: '100%',
                          background: data.completed >= data.required ? '#6af7a2' : 'var(--accent)',
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Credit Requirements Reference Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              marginBottom: '2rem',
              overflowX: 'auto'
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📋 Credit Requirements Reference
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Minimum requirements for EHS graduation (24 credits total). Public 4-year and highly selective colleges may expect more — check each institution.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '0.6rem 0.5rem', fontWeight: 600, color: 'var(--text)' }}>Subject</th>
                  <th style={{ textAlign: 'left', padding: '0.6rem 0.5rem', fontWeight: 600, color: 'var(--accent)' }}>EHS Minimum</th>
                  <th style={{ textAlign: 'left', padding: '0.6rem 0.5rem', fontWeight: 600, color: 'var(--text)' }}>Public 4-Year Colleges</th>
                  <th style={{ textAlign: 'left', padding: '0.6rem 0.5rem', fontWeight: 600, color: 'var(--text)' }}>Highly Selective</th>
                </tr>
              </thead>
              <tbody>
                {CREDIT_REQUIREMENTS_TABLE.map((row, i) => (
                  <tr key={row.subject} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 500, color: 'var(--text)' }}>{row.subject}</td>
                    <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text)' }}>{row.ehs}</td>
                    <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text-muted)' }}>{row.public4yr}</td>
                    <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text-muted)' }}>{row.highlySelective}</td>
                  </tr>
                ))}
                <tr style={{ borderBottom: 'none', background: 'var(--bg)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--text)' }}>Total</td>
                  <td colSpan={3} style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'var(--accent)' }}>{TOTAL_CREDITS_REQUIRED} credits</td>
                </tr>
              </tbody>
            </table>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', marginBottom: 0 }}>
              Students need a minimum 2.00 cumulative GPA at time of application. Most colleges require Algebra 2 or higher. Requirements vary by school — verify with each institution.
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('browse')}
            style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            ← Back to Browse
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // All Grades View
  if (viewMode === 'all-grades') {
    const allGradesCourses = getAllCourses()
    return (
      <div className="page-container" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', padding: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, margin: 0 }}>All Courses by Grade</h1>
              <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>View all courses available across your entire high school journey</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('transcript')}
                style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem' }}
              >
                Transcript
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('browse')}
                style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem' }}
              >
                Browse by Grade
              </motion.button>
            </div>
          </div>

          {GRADES.map((grade, gradeIdx) => (
            <motion.div
              key={grade}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gradeIdx * 0.1 }}
              style={{ marginBottom: '2rem' }}
            >
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)' }}>
                {grade}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                {allGradesCourses[grade]?.map((course, i) => (
                  <CourseCard key={`${course.title}-${i}`} course={course} index={i} isAdded={isAdded(course)} onAdd={() => handleAddCourse(course)} onRemove={() => handleRemoveCourse(course)} />
                ))}
              </div>
            </motion.div>
          ))}
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('transcript')}
                style={{ padding: '0.4rem 0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--accent)', background: 'rgba(124, 106, 247, 0.1)', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.75rem' }}
              >
                📋 Transcript
              </motion.button>
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
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={() => setViewMode('transcript')}
                    style={{ 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: 'var(--radius)', 
                      border: '1px solid var(--accent)', 
                      background: 'rgba(124, 106, 247, 0.1)', 
                      color: 'var(--accent)', 
                      fontSize: '0.8rem', 
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600
                    }}
                  >
                    📋 View Transcript
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
  
  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Easy') return '#6af7a2'
    if (difficulty === 'Medium') return '#f7d66a'
    if (difficulty === 'Hard') return '#f76a6a'
    return '#7c6af7'
  }
  
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
            <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 600, background: `${getDifficultyColor(course.difficulty)}22`, color: getDifficultyColor(course.difficulty), border: `1px solid ${getDifficultyColor(course.difficulty)}` }}>
              {course.difficulty}
            </span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', lineHeight: 1.3, marginBottom: '0.5rem' }}>{course.title}</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            📚 {course.credits} credits
          </p>
          {course.prerequisite && (
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Prerequisite: {course.prerequisite}
            </p>
          )}
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
