// Redmond High School (RHS) course catalog — grade ranges from official list
// grades: '9' = 9 only, '10-12' = 10,11,12, '9-12' = all four, '10-11' = 10,11, '9-10' = 9,10

const GRADES = ['9th Grade (Freshman)', '10th Grade (Sophomore)', '11th Grade (Junior)', '12th Grade (Senior)']

const cr = (title, difficulty = 'Medium', credits = 1, prerequisite = null) =>
  ({ title, difficulty, credits, ...(prerequisite != null && prerequisite !== '' && { prerequisite }) })

function gradesToIndices(range) {
  const r = String(range).replace(/–/g, '-').trim()
  if (r === '9') return [0]
  if (r === '10') return [1]
  if (r === '11') return [2]
  if (r === '12') return [3]
  if (r === '9-12') return [0, 1, 2, 3]
  if (r === '10-12') return [1, 2, 3]
  if (r === '11-12') return [2, 3]
  if (r === '10-11') return [1, 2]
  if (r === '9-10') return [0, 1]
  return []
}

const MATH = [
  [cr('Secondary Math Foundations'), '10-11'], [cr('Algebra 1'), '9-12'], [cr('Algebra 2'), '9-12'],
  [cr('Algebra 2 Honors'), '9-12'], [cr('Geometry', 'Medium', 1, 'Algebra 1'), '9-12'], [cr('Pre-Calculus', 'Hard', 1, 'Algebra 2'), '9-12'],
  [cr('Honors Pre-Calculus', 'Hard', 1, 'Algebra 2'), '9-12'], [cr('Calculus'), '10-12'], [cr('AP Calculus AB', 'Hard', 1, 'Pre-Calculus'), '9-12'],
  [cr('AP Calculus BC', 'Hard', 1, 'AB or strong Pre-Calc'), '9-12'], [cr('Statistics'), '10-12'], [cr('AP Statistics', 'Hard', 1, 'Algebra 2'), '10-12'],
  [cr('Modeling Our World with Math'), '9-12'],
]

const SCIENCE = [
  [cr('Biology in the Earth System'), '9'], [cr('Physics in the Universe'), '10'], [cr('Physics', 'Hard', 1, 'Algebra 2 recommended'), '10-12'],
  [cr('Chemistry', 'Hard', 1, 'Biology'), '10-12'], [cr('Chemistry in the Earth System'), '11'], [cr('AP Biology', 'Hard', 1, 'Biology + Chemistry'), '10-12'],
  [cr('AP Chemistry', 'Hard', 1, 'Chemistry'), '10-12'], [cr('AP Physics C: Mechanics', 'Hard', 1, 'Physics + Pre-Calc recommended'), '11-12'],
  [cr('Astronomy'), '9-12'], [cr('Oceanography'), '10-12'], [cr('Marine Science I'), '10-12'],
  [cr('AP Environmental Science', 'Hard'), '10-12'], [cr('Biotechnology I'), '10-12'],
  [cr('Anatomy & Physiology I/II', 'Hard'), '11-12'], [cr('STEM Health Science'), '11-12'],
  [cr('Forensic Science I/II'), '10-12'],
]

const ENGLISH = [
  [cr('English 9'), '9'], [cr('Honors English 9', 'Hard'), '9'], [cr('English 10', 'Medium', 1, 'English 9'), '10'],
  [cr('Honors English 10', 'Hard', 1, 'English 9'), '10'], [cr('English 11'), '11'], [cr('English 12'), '12'],
  [cr('Honors English 12', 'Hard'), '12'], [cr('AP English Language & Composition', 'Hard', 1, 'English 10'), '11'],
  [cr('AP English Literature & Composition', 'Hard', 1, 'English 11'), '12'], [cr('Creative Writing', 'Easy'), '10-12'],
  [cr('Film Analysis'), '11-12'], [cr('Speech and Debate'), '9-12'],
]

const SOCIAL_STUDIES = [
  [cr('World History 1'), '9'], [cr('Honors World History 1', 'Hard'), '9'], [cr('World History 2'), '10'],
  [cr('AP World History', 'Hard'), '10'], [cr('U.S. History'), '11'], [cr('AP U.S. History', 'Hard'), '11'],
  [cr('Civics'), '12'], [cr('AP U.S. Government', 'Hard'), '12'], [cr('Washington State History'), '11-12'],
  [cr('International Relations'), '10-12'], [cr('History Through Film'), '10-12'], [cr('Psychology'), '9-12'],
  [cr('AP Psychology', 'Hard'), '10-12'], [cr('UW Psychology 101', 'Hard'), '11-12'],
  [cr('AP Macroeconomics / Microeconomics', 'Hard'), '10-12'],
]

const CS_ENG = [
  [cr('Engineering Design'), '9-12'], [cr('Engineering Applications', 'Hard', 1, 'Engineering Design'), '10-12'],
  [cr('AP Computer Science Principles', 'Hard'), '9-12'], [cr('AP Computer Science A', 'Hard', 1, 'CSP recommended'), '10-12'],
  [cr('Video Game Design'), '9-12'], [cr('Industrial Design / 3D Printing'), '9-12'],
]

const BUSINESS = [
  [cr('Business & Marketing Foundations I/II'), '9-12'], [cr('Business & Marketing Management I/II'), '10-12'],
  [cr('Retail Operations I/II'), '10-12'], [cr('Retail Management I/II'), '10-12'],
  [cr('Personal Finance'), '10-12'],
]

const WORLD_LANG = [
  [cr('ASL I'), '9-12'], [cr('ASL II'), '10-12'], [cr('ASL III'), '11-12'],
  [cr('French 1'), '9-12'], [cr('French 2'), '9-12'], [cr('French 3'), '9-12'], [cr('French 4'), '9-12'],
  [cr('AP French Language & Culture', 'Hard'), '9-12'],
  [cr('Japanese 1'), '9-12'], [cr('Japanese 2'), '9-12'], [cr('Japanese 3'), '9-12'],
  [cr('AP Japanese Language & Culture', 'Hard'), '9-12'],
  [cr('Spanish 1'), '9-12'], [cr('Spanish 2'), '9-12'], [cr('Spanish 3'), '9-12'], [cr('Spanish 4'), '9-12'],
  [cr('AP Spanish Language & Culture', 'Hard'), '9-12'],
]

const VISUAL_ARTS = [
  [cr('Art 1'), '9-12'], [cr('Art 2: Drawing/Painting'), '9-12'], [cr('Art 3: Drawing/Painting'), '10-12'],
  [cr('Art 2: Ceramics/Pottery'), '9-12'], [cr('Art 3: Ceramics/Pottery'), '10-12'],
  [cr('Art History 1'), '10-12'], [cr('Art History 2'), '10-12'], [cr('AP Art History', 'Hard'), '10-12'],
  [cr('AP Drawing', 'Hard'), '11-12'], [cr('AP 2D Art & Design', 'Hard'), '11-12'], [cr('AP 3D Art & Design', 'Hard'), '11-12'],
  [cr('Photography I'), '9-12'], [cr('Photography II'), '10-12'],
  [cr('Commercial Art & Design I'), '10-12'], [cr('Commercial Art & Design II'), '10-12'],
  [cr('Graphic Production & Design I'), '9-12'], [cr('Art & Animation'), '9-12'],
]

const MUSIC = [
  [cr('Orchestra 1'), '9'], [cr('Orchestra 2'), '9-12'], [cr('Orchestra 3'), '9-12'], [cr('Orchestra 4', 'Hard'), '9-12'],
  [cr('String Ensemble'), '9-12'], [cr('Band 1'), '9'], [cr('Band 2'), '9-12'], [cr('Band 3'), '9-12'], [cr('Band 4', 'Hard'), '9-12'],
  [cr('Jazz Band', 'Hard'), '9-12'], [cr('Choir 1'), '9-12'], [cr('Choir 2'), '9-12'], [cr('Choir 3'), '9-12'], [cr('Choir 4', 'Hard'), '9-12'],
  [cr('Jazz Choir', 'Hard'), '9-12'], [cr('Piano 1'), '9-12'], [cr('Digital Music Production'), '9-12'],
  [cr('Music Appreciation'), '9-12'], [cr('AP Music Theory', 'Hard'), '11-12'],
]

const THEATER = [
  [cr('Drama 1'), '9-12'], [cr('Drama 2'), '9-12'], [cr('Musical Theater'), '9-12'], [cr('Technical Theater'), '9-12'],
]

const HEALTH_PE = [
  [cr('High School Health & Lifetime Wellness'), '9'], [cr('High School Physical Education Level 1'), '9-10'],
  [cr('High School Physical Education Level 2'), '10-12'], [cr('Walking & Wellness'), '10-12'],
  [cr('Competitive Physical Education'), '11-12'], [cr('Team Sports'), '10-12'], [cr('Racquet & Net Sports'), '10-12'],
  [cr('Golf 1'), '10-12'], [cr('Strength Training 1'), '10-12'], [cr('Strength Training 2'), '10-12'],
  [cr("Women's Fitness"), '10-12'], [cr('Partner PE'), '10-12'],
]

const HUMAN_SERVICES = [
  [cr('Personal & Professional Readiness'), '11-12'], [cr('Child Development I-A'), '9-12'],
  [cr('Family Health'), '10-12'], [cr('Teacher Education Academy I'), '10-12'],
  [cr('Culinary Arts I'), '9-12'], [cr('Food Science'), '9-12'],
]

const MEDIA_TECH = [
  [cr('Yearbook I'), '10-12'], [cr('Video Production I'), '9-12'], [cr('Video Production II'), '10-12'],
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

function buildRHSDatabase() {
  const gradeArrays = [{}, {}, {}, {}]
  addToGradeByRange(MATH, 'Mathematics', gradeArrays)
  addToGradeByRange(SCIENCE, 'Science', gradeArrays)
  addToGradeByRange(ENGLISH, 'English', gradeArrays)
  addToGradeByRange(SOCIAL_STUDIES, 'Social Studies', gradeArrays)
  addToGradeByRange(CS_ENG, 'Computer Science / Technology', gradeArrays)
  addToGradeByRange(CS_ENG, 'Engineering / STEM', gradeArrays)
  addToGradeByRange(BUSINESS, 'Other Electives', gradeArrays)
  addToGradeByRange(WORLD_LANG, 'World Languages', gradeArrays)
  addToGradeByRange(VISUAL_ARTS, 'Visual Arts', gradeArrays)
  addToGradeByRange(MUSIC, 'Music', gradeArrays)
  addToGradeByRange(THEATER, 'Theater', gradeArrays)
  addToGradeByRange(HEALTH_PE, 'Physical Education', gradeArrays)
  addToGradeByRange(HUMAN_SERVICES, 'Other Electives', gradeArrays)
  addToGradeByRange(MEDIA_TECH, 'Other Electives', gradeArrays)

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

export const RHS_COURSE_DATABASE = buildRHSDatabase()
