// Tesla STEM High School course catalog — grade ranges from official list
// Same style as RHS/EHS: '9', '10', '9-12', '10-12', '11-12', '9-10'

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
  if (r === '9-10') return [0, 1]
  return []
}

const MATH = [
  [cr('Algebra 1'), '9-12'], [cr('Geometry', 'Medium', 1, 'Algebra 1'), '9-12'], [cr('Algebra 2 Honors', 'Hard', 1, 'Geometry'), '9-12'],
  [cr('Pre-Calculus', 'Hard', 1, 'Algebra 2'), '9-12'], [cr('AP Calculus AB', 'Hard', 1, 'Pre-Calculus'), '9-12'], [cr('AP Calculus BC', 'Hard', 1, 'Pre-Calculus or AB'), '9-12'],
  [cr('Multivariable Calculus', 'Hard', 1, 'AP Calculus BC'), '9-12'], [cr('AP Statistics', 'Hard', 1, 'Algebra 2'), '10-12'],
]

const SCIENCE = [
  [cr('Inquiry Physics (Honors)', 'Hard'), '9'], [cr('General Biology (Honors Biology)', 'Hard', 1, 'Inquiry Physics'), '10'],
  [cr('AP Biology', 'Hard', 1, 'Biology'), '10-12'], [cr('Chemistry (Honors)', 'Hard', 1, 'Biology'), '10-12'],
  [cr('AP Chemistry', 'Hard', 1, 'Chemistry'), '10-12'], [cr('AP Physics C: Mechanics', 'Hard', 1, 'Calculus + Physics'), '11-12'],
  [cr('AP Physics C: Electricity & Magnetism', 'Hard', 1, 'Calculus + Physics'), '12'], [cr('AP Environmental Science', 'Hard'), '10-12'],
  [cr('Anatomy & Physiology I/II', 'Hard'), '11-12'], [cr('Advanced Biomedical Lab', 'Hard'), '12'],
]

const ENGLISH = [
  [cr('Honors English 9', 'Hard'), '9'], [cr('Honors English 10', 'Hard', 1, 'English 9'), '10'],
  [cr('AP English Language & Composition', 'Hard', 1, 'English 10'), '11'], [cr('Analytical & Critical Reading Honors', 'Hard'), '12'],
]

const SOCIAL_STUDIES = [
  [cr('U.S. History Honors', 'Hard'), '11'], [cr('Civics'), '12'],
  [cr('Contemporary World Problems (Honors)', 'Hard'), '12'], [cr('AP Psychology', 'Hard'), '10-12'],
  [cr('Economics'), '10-12'],
]

const CS_TECH = [
  [cr('AP Computer Science Principles', 'Hard'), '9-12'], [cr('AP Computer Science A', 'Hard', 1, 'CSP or programming experience'), '10-12'],
  [cr('Data Structures', 'Hard', 1, 'AP CS A'), '11-12'], [cr('Advanced Projects in Computer Science', 'Hard', 1, 'Data Structures'), '11-12'],
]

const ENGINEERING = [
  [cr('Engineering I'), '9-12'], [cr('Engineering II', 'Medium', 1, 'Engineering I'), '10-12'], [cr('Engineering III', 'Hard', 1, 'Engineering II'), '11-12'],
  [cr('Sustainable Design & Environmental Engineering', 'Hard', 1, 'Engineering pathway'), '11-12'],
]

const WORLD_LANG = [
  [cr('Honors Spanish 1', 'Hard'), '9'], [cr('Honors Spanish 2', 'Hard'), '9-10'], [cr('Honors Spanish 3', 'Hard'), '9-12'],
]

const BUSINESS = [
  [cr('Business & Marketing Foundations II'), '9-12'], [cr('Business & Marketing Management'), '10-12'],
  [cr('Digital Marketing & Social Media'), '9-12'],
]

const ARTS_MEDIA = [
  [cr('Orchestra 1'), '9-12'], [cr('Graphic Production & Design'), '9-12'],
]

const LEADERSHIP = [
  [cr('Leadership 1'), '9-12'], [cr('Leadership 2'), '11-12'], [cr('Peer Tutor'), '10-12'],
]

const HEALTH = [
  [cr('High School Health'), '9-12'],
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

function buildTeslaSTEMDatabase() {
  const gradeArrays = [{}, {}, {}, {}]
  addToGradeByRange(MATH, 'Mathematics', gradeArrays)
  addToGradeByRange(SCIENCE, 'Science', gradeArrays)
  addToGradeByRange(ENGLISH, 'English', gradeArrays)
  addToGradeByRange(SOCIAL_STUDIES, 'Social Studies', gradeArrays)
  addToGradeByRange(CS_TECH, 'Computer Science / Technology', gradeArrays)
  addToGradeByRange(ENGINEERING, 'Engineering / STEM', gradeArrays)
  addToGradeByRange(WORLD_LANG, 'World Languages', gradeArrays)
  addToGradeByRange(BUSINESS, 'Other Electives', gradeArrays)
  addToGradeByRange([[cr('Orchestra 1'), '9-12']], 'Music', gradeArrays)
  addToGradeByRange([[cr('Graphic Production & Design'), '9-12']], 'Visual Arts', gradeArrays)
  addToGradeByRange(LEADERSHIP, 'Other Electives', gradeArrays)
  addToGradeByRange(HEALTH, 'Physical Education', gradeArrays)

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

export const TESLA_STEM_COURSE_DATABASE = buildTeslaSTEMDatabase()
