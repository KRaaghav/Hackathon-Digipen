// Eastlake High School (EHS) course catalog — grade ranges from official list
// grades: '9' = 9 only, '10-12' = 10,11,12, '9-12' = all four

const GRADES = ['9th Grade (Freshman)', '10th Grade (Sophomore)', '11th Grade (Junior)', '12th Grade (Senior)']

const cr = (title, difficulty = 'Medium', credits = 1, prerequisite = null) =>
  ({ title, difficulty, credits, ...(prerequisite != null && prerequisite !== '' && { prerequisite }) })

// Parse "9", "10-12", "9-12", "11-12" → array of grade indices 0–3
function gradesToIndices(range) {
  if (range === '9') return [0]
  if (range === '10') return [1]
  if (range === '11') return [2]
  if (range === '12') return [3]
  if (range === '9-12') return [0, 1, 2, 3]
  if (range === '10-12') return [1, 2, 3]
  if (range === '11-12') return [2, 3]
  return []
}

// Course lists: [ [course, gradeRange], ... ]. Add to each grade object by subject.
const MATH = [
  [cr('Algebra 1'), '9-12'], [cr('Algebra 2'), '9-12'], [cr('Algebra 2 Honors'), '9-12'],
  [cr('Geometry', 'Medium', 1, 'Algebra 1'), '9-12'], [cr('Pre-Calculus'), '9-12'], [cr('Calculus'), '10-12'],
  [cr('AP Calculus AB'), '9-12'], [cr('AP Calculus BC'), '9-12'], [cr('Statistics'), '10-12'],
  [cr('AP Statistics'), '10-12'], [cr('Financial Algebra'), '11-12'],
  [cr('Modeling Our World with Math'), '9-12'], [cr('UW Precalculus'), '9-12'],
]

const SCIENCE = [
  [cr('Biology in the Earth System'), '9'], [cr('Biology in the Earth System Honors', 'Hard'), '9'],
  [cr('Chemistry in the Earth System', 'Hard', 1, 'Biology'), '9-12'], [cr('Chemistry in the Earth System Honors', 'Hard'), '9-12'],
  [cr('Physics in the Universe', 'Hard', 1, 'Algebra 2 recommended'), '10-12'], [cr('AP Physics 1', 'Hard'), '10-12'],
  [cr('AP Physics 2', 'Hard'), '11-12'], [cr('AP Biology', 'Hard', 1, 'Biology + Chemistry'), '10-12'],
  [cr('AP Chemistry', 'Hard', 1, 'Chemistry'), '10-12'], [cr('Environmental Botany'), '10-12'],
  [cr('Marine Science I'), '10-12'], [cr('Anatomy & Physiology I', 'Hard'), '10-12'],
  [cr('Anatomy & Physiology II', 'Hard'), '10-12'], [cr('Biotechnology I'), '10-12'],
  [cr('Biotechnology II', 'Hard'), '11-12'], [cr('AP Environmental Science', 'Hard'), '10-12'],
  [cr('UW Astronomy'), '10-12'], [cr('Forensic Science I'), '10-12'], [cr('Forensic Science II'), '11-12'],
]

const ENGLISH = [
  [cr('English 9'), '9'], [cr('English 10', 'Medium', 1, 'English 9'), '10'], [cr('English 11'), '11'], [cr('English 12'), '12'],
  [cr('AP English Language', 'Hard', 1, 'English 10'), '11'], [cr('AP English Literature', 'Hard', 1, 'English 11'), '12'],
  [cr('Creative Writing', 'Easy'), '10-12'], [cr('Creative Writing 2'), '10-12'],
  [cr('Film as Literature'), '11-12'], [cr('Mystery and Detective Fiction'), '9-12'],
  [cr('Public Speaking'), '10-12'], [cr('UW Composition', 'Hard'), '12'],
]

const SOCIAL_STUDIES = [
  [cr('World History 1'), '9'], [cr('World History 2'), '10'], [cr('AP World History', 'Hard'), '10'],
  [cr('U.S. History'), '11'], [cr('AP U.S. History', 'Hard'), '11'], [cr('Civics'), '9-12'],
  [cr('Contemporary America in the World'), '11-12'], [cr('Sociology'), '10-12'],
  [cr('Psychology'), '11-12'], [cr('UW Psychology', 'Hard'), '11-12'], [cr('World Religions'), '11-12'],
  [cr('Current Events & American Politics'), '10-12'], [cr('AP Comparative Government', 'Hard'), '10-12'],
  [cr('AP U.S. Government', 'Hard'), '11-12'], [cr('AP Comparative Gov & AP US Gov', 'Hard'), '11-12'],
  [cr('AP African American Studies', 'Hard'), '10-12'], [cr('AP Macro/Microeconomics', 'Hard'), '10-12'],
  [cr('America in Film'), '11-12'],
]

const CS_ENG = [
  [cr('Robotics I'), '9-12'], [cr('Engineering Design'), '9-12'], [cr('Engineering Applications', 'Hard', 1, 'Engineering Design'), '10-12'],
  [cr('Material Science I'), '9-12'], [cr('Material Science II', 'Hard'), '10-12'],
  [cr('AP Computer Science Principles', 'Hard', 1, 'Intro to Computer Science recommended'), '9-12'], [cr('AP Computer Science A', 'Hard', 1, 'Programming course'), '10-12'],
  [cr('Data Structures', 'Hard', 1, 'AP CS A'), '11-12'],
]

const WORLD_LANG = [
  [cr('French 1'), '9-12'], [cr('French 2'), '9-12'], [cr('French 3'), '9-12'], [cr('French 4'), '9-12'],
  [cr('French 5', 'Hard'), '12'], [cr('AP French', 'Hard'), '9-12'],
  [cr('Japanese 1'), '9-12'], [cr('Japanese 2'), '9-12'], [cr('Japanese 3'), '9-12'], [cr('Japanese 4'), '9-12'],
  [cr('Japanese 5', 'Hard'), '11-12'], [cr('AP Japanese', 'Hard'), '9-12'],
  [cr('Spanish 1'), '9-12'], [cr('Spanish 2'), '9-12'], [cr('Spanish 3'), '9-12'], [cr('Spanish 4'), '9-12'],
  [cr('Spanish 5', 'Hard'), '12'], [cr('Spanish for Heritage Learners'), '9-12'], [cr('AP Spanish', 'Hard'), '9-12'],
  [cr('American Sign Language I'), '9-12'], [cr('American Sign Language II'), '10-12'],
  [cr('American Sign Language III'), '11-12'], [cr('American Sign Language IV', 'Hard'), '12'],
]

const VISUAL_ARTS = [
  [cr('2D Art 1A'), '9-12'], [cr('2D Art 1B'), '9-12'], [cr('2D Art 2'), '10-12'], [cr('2D Art 3'), '11-12'],
  [cr('3D Art 1A'), '9-12'], [cr('3D Art 1B'), '9-12'], [cr('3D Art 2'), '10-12'], [cr('3D Art 3'), '11-12'],
  [cr('AP 2D Art', 'Hard'), '11-12'], [cr('AP 3D Art', 'Hard'), '11-12'], [cr('AP Drawing', 'Hard'), '11-12'],
  [cr('AP Art History', 'Hard'), '10-12'],
]

const MUSIC = [
  [cr('Band 1'), '9-12'], [cr('Band 2'), '9-12'], [cr('Band 4', 'Hard'), '9-12'],
  [cr('Orchestra 1'), '9-12'], [cr('Orchestra 2'), '9-12'], [cr('Orchestra 3'), '9-12'], [cr('Orchestra 4', 'Hard'), '9-12'],
  [cr('Choir 1'), '9-12'], [cr('Choir 2'), '9-12'], [cr('Choir 4', 'Hard'), '9-12'],
  [cr('Wind Ensemble Honors', 'Hard'), '9-12'], [cr('Jazz Band', 'Hard'), '9-12'],
  [cr('Percussion Ensemble'), '9-12'], [cr('Guitar 1'), '9-12'], [cr('Guitar 2'), '9-12'],
  [cr('Piano 1'), '9-12'], [cr('Piano 2'), '9-12'], [cr('Music Technology'), '10-12'],
]

const THEATER = [
  [cr('Intro to Theater'), '9-12'], [cr('Drama 1'), '9-12'], [cr('Drama 2'), '9-12'],
  [cr('Writing for Stage & Screen'), '9-12'], [cr('Writing for Stage & Screen 2', 'Hard'), '9-12'],
  [cr('Technical Theater'), '9-12'], [cr('Technical Theater II', 'Hard'), '10-12'],
  [cr('Theater Production A'), '9-12'], [cr('Theater Production B', 'Hard'), '9-12'],
]

const HEALTH_PE = [
  [cr('High School Health & PE'), '9'], [cr('High School Health'), '10-12'], [cr('High School Health (Grade 9)'), '9'],
  [cr('Walking & Wellness'), '10-12'], [cr('Team Sports'), '10-12'], [cr('Racquet & Net Sports'), '10-12'],
  [cr('Golf 1'), '10-12'], [cr('Outdoor Adventures'), '10-12'], [cr('Lifetime Sports'), '10-12'],
  [cr('Strength Training 1'), '10-12'], [cr('Strength Training 2'), '10-12'],
  [cr("Women's Strength Training"), '9-12'], [cr('Sports Medicine', 'Hard'), '9-12'],
]

// Other Electives: Business / Human Services — 9-12 (not in grade table)
const OTHER = [
  [cr('Accounting IA'), '9-12'], [cr('Accounting IB'), '9-12'], [cr('Business and Marketing Foundations'), '9-12'],
  [cr('Personal Finance'), '9-12'], [cr('Yearbook I'), '9-12'], [cr('Yearbook II'), '9-12'],
  [cr('Child Development I-A'), '9-12'], [cr('Child Development I-B'), '9-12'], [cr('Child Development II-A'), '9-12'],
  [cr('Peer Tutor – Transition Students'), '9-12'],
]

function addToGradeByRange(list, subject, gradeArrays) {
  list.forEach(([course, range]) => {
    const indices = gradesToIndices(range)
    indices.forEach(i => {
      if (!gradeArrays[i][subject]) gradeArrays[i][subject] = []
      gradeArrays[i][subject].push(course)
    })
  })
}

function buildEHSDatabase() {
  const gradeArrays = [{}, {}, {}, {}]
  addToGradeByRange(MATH, 'Mathematics', gradeArrays)
  addToGradeByRange(SCIENCE, 'Science', gradeArrays)
  addToGradeByRange(ENGLISH, 'English', gradeArrays)
  addToGradeByRange(SOCIAL_STUDIES, 'Social Studies', gradeArrays)
  addToGradeByRange(CS_ENG, 'Computer Science / Technology', gradeArrays)
  addToGradeByRange(CS_ENG, 'Engineering / STEM', gradeArrays)
  addToGradeByRange(WORLD_LANG, 'World Languages', gradeArrays)
  addToGradeByRange(VISUAL_ARTS, 'Visual Arts', gradeArrays)
  addToGradeByRange(MUSIC, 'Music', gradeArrays)
  addToGradeByRange(THEATER, 'Theater', gradeArrays)
  addToGradeByRange(HEALTH_PE, 'Physical Education', gradeArrays)
  addToGradeByRange(OTHER, 'Other Electives', gradeArrays)

  const out = {}
  GRADES.forEach((name, i) => {
    out[name] = {
      'English': gradeArrays[i]['English'] || [],
      'Mathematics': gradeArrays[i]['Mathematics'] || [],
      'Science': gradeArrays[i]['Science'] || [],
      'Social Studies': gradeArrays[i]['Social Studies'] || [],
      'World Languages': gradeArrays[i]['World Languages'] || [],
      'Computer Science / Technology': gradeArrays[i]['Computer Science / Technology'] || [],
      'Engineering / STEM': gradeArrays[i]['Engineering / STEM'] || [],
      'Visual Arts': gradeArrays[i]['Visual Arts'] || [],
      'Music': gradeArrays[i]['Music'] || [],
      'Theater': gradeArrays[i]['Theater'] || [],
      'Physical Education': gradeArrays[i]['Physical Education'] || [],
      'Other Electives': gradeArrays[i]['Other Electives'] || [],
    }
  })
  return out
}

export const EHS_COURSE_DATABASE = buildEHSDatabase()
