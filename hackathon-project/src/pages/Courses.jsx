import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, Plus, Clock, Users, BookOpen, Loader, Trash2, ChevronLeft } from 'lucide-react'

export default function Courses({ userProfile, calendarEvents, addCalendarEvent, removeCalendarEvent }) {
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [query, setQuery] = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [addedCourses, setAddedCourses] = useState(new Set())

  const SCHOOLS = [
    { name: 'Lake Forest High School', abbr: 'LFHS' },
    { name: 'Mercer Island High School', abbr: 'MIHS' },
    { name: 'Inglemoor High School', abbr: 'IHS' },
    { name: 'Edmonds-Woodway High School', abbr: 'EWHS' },
    { name: 'Mountlake Terrace High School', abbr: 'MTHS' },
    { name: 'Bothell High School', abbr: 'BHS' },
    { name: 'Shoreline High School', abbr: 'SHS' },
    { name: 'Shorewood High School', abbr: 'SWHS' },
    { name: 'Edmonds High School', abbr: 'EHS' }
  ]

  const GRADES = ['9th Grade (Freshman)', '10th Grade (Sophomore)', '11th Grade (Junior)', '12th Grade (Senior)']

  const COURSE_DATABASE = {
    'Lake Forest High School': {
      '9th Grade (Freshman)': {
        'Math': [
          { title: 'Algebra 1', teacher: 'Ms. Johnson', period: '1st', room: '201', capacity: '28', enrolled: '24' },
          { title: 'Algebra 1', teacher: 'Mr. Chen', period: '3rd', room: '205', capacity: '28', enrolled: '26' },
          { title: 'Geometry', teacher: 'Ms. Wilson', period: '2nd', room: '203', capacity: '28', enrolled: '22' },
        ],
        'Science': [
          { title: 'Biology I', teacher: 'Dr. Smith', period: '1st', room: '301', capacity: '30', enrolled: '28' },
          { title: 'Biology I', teacher: 'Ms. Lee', period: '4th', room: '305', capacity: '30', enrolled: '27' },
          { title: 'Physical Science', teacher: 'Mr. Rodriguez', period: '2nd', room: '302', capacity: '30', enrolled: '25' },
        ],
        'English': [
          { title: 'English 9', teacher: 'Ms. Anderson', period: '1st', room: '101', capacity: '25', enrolled: '24' },
          { title: 'English 9', teacher: 'Mr. Thompson', period: '3rd', room: '105', capacity: '25', enrolled: '23' },
          { title: 'English 9 Honors', teacher: 'Dr. Martinez', period: '2nd', room: '103', capacity: '20', enrolled: '19' },
        ],
      },
      '10th Grade (Sophomore)': {
        'Math': [
          { title: 'Geometry', teacher: 'Ms. Wilson', period: '1st', room: '203', capacity: '28', enrolled: '25' },
          { title: 'Algebra 2', teacher: 'Mr. Kim', period: '2nd', room: '204', capacity: '28', enrolled: '26' },
          { title: 'Algebra 2 Honors', teacher: 'Dr. Patel', period: '3rd', room: '206', capacity: '24', enrolled: '22' },
        ],
        'Science': [
          { title: 'Chemistry I', teacher: 'Mr. Jackson', period: '1st', room: '303', capacity: '30', enrolled: '29' },
          { title: 'Biology II', teacher: 'Ms. Garcia', period: '2nd', room: '304', capacity: '30', enrolled: '28' },
        ],
      },
      '11th Grade (Junior)': {
        'Math': [
          { title: 'Pre-Calculus', teacher: 'Mr. Park', period: '1st', room: '207', capacity: '26', enrolled: '24' },
          { title: 'AP Calculus AB', teacher: 'Dr. Nguyen', period: '2nd', room: '209', capacity: '22', enrolled: '20' },
        ],
        'Science': [
          { title: 'Physics I', teacher: 'Mr. Webb', period: '1st', room: '307', capacity: '28', enrolled: '26' },
          { title: 'AP Biology', teacher: 'Dr. Smith', period: '2nd', room: '309', capacity: '24', enrolled: '22' },
        ],
      },
    },
    'Mercer Island High School': {
      '9th Grade (Freshman)': {
        'Math': [
          { title: 'Algebra 1', teacher: 'Mr. Stone', period: '1st', room: '301', capacity: '28', enrolled: '26' },
          { title: 'Geometry', teacher: 'Ms. Price', period: '2nd', room: '302', capacity: '28', enrolled: '27' },
        ],
        'Science': [
          { title: 'Biology I', teacher: 'Dr. Berg', period: '1st', room: '401', capacity: '30', enrolled: '29' },
        ],
      },
    },
    'Inglemoor High School': {
      '9th Grade (Freshman)': {
        'Math': [
          { title: 'Algebra 1', teacher: 'Ms. Hood', period: '1st', room: '201', capacity: '28', enrolled: '25' },
          { title: 'Geometry', teacher: 'Mr. Field', period: '2nd', room: '202', capacity: '28', enrolled: '26' },
        ],
      },
    },
  }

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school)
    setSelectedGrade(null)
    setQuery('')
    setCourses([])
    setHasSearched(false)
  }

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade)
  }

  const handleSearch = async (searchQuery) => {
    if (!selectedSchool || !selectedGrade) return
    
    setLoading(true)
    setHasSearched(true)
    
    setTimeout(() => {
      const schoolName = selectedSchool.name
      const gradeData = COURSE_DATABASE[schoolName]?.[selectedGrade] || {}
      let results = []

      const lowerQuery = searchQuery.toLowerCase()
      
      Object.entries(gradeData).forEach(([subject, courseList]) => {
        if (subject.toLowerCase().includes(lowerQuery) || lowerQuery === '') {
          results = results.concat(courseList.map(c => ({ ...c, subject })))
        } else {
          const filtered = courseList.filter(c => c.title.toLowerCase().includes(lowerQuery))
          results = results.concat(filtered.map(c => ({ ...c, subject })))
        }
      })

      setCourses(results)
      setLoading(false)
    }, 500)
  }

  const handleAddCourse = (course) => {
    const courseId = `${course.title}-${course.teacher}-${course.period}`
    if (addedCourses.has(courseId)) return
    
    addCalendarEvent({
      title: course.title,
      description: `${selectedSchool.name} • ${selectedGrade} • Teacher: ${course.teacher}`,
      commitment: `Period: ${course.period}`,
      meetingDay: `Room ${course.room}`,
      color: '#7c6af7',
      type: 'course'
    })
    setAddedCourses(prev => new Set([...prev, courseId]))
  }

  const handleRemoveCourse = (course) => {
    const courseId = `${course.title}-${course.teacher}-${course.period}`
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
    const courseId = `${course.title}-${course.teacher}-${course.period}`
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
              Select an LWSD school to explore available courses for your grade level
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
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input className="input" style={{ paddingLeft: '42px' }} placeholder="Search courses (Math, Science, English...)..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch(query)} />
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-primary" onClick={() => handleSearch(query)} disabled={loading}>
                  {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />}
                  {loading ? 'Searching...' : 'Search'}
                </motion.button>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Grade: {selectedGrade}</p>
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
                {courses.map((course, i) => <CourseCard key={`${course.title}-${course.teacher}-${i}`} course={course} index={i} isAdded={isAdded(course)} onAdd={() => handleAddCourse(course)} onRemove={() => handleRemoveCourse(course)} />)}
              </div>
            )}

            {!loading && !hasSearched && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Ready to explore courses?</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Search for courses by subject to see all available options for your grade level.</p>
              </motion.div>
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
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Teacher: {course.teacher}</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-dim)' }}><Clock size={12} /> Period {course.period}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-dim)' }}><Users size={12} /> {course.enrolled}/{course.capacity}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>📍 Room {course.room}</div>
      </div>
    </motion.div>
  )
}
