import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, Plus, Check, MapPin, Clock, Users, Star, Filter, Loader, BookOpen } from 'lucide-react'

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

export default function Extracurriculars({ userProfile, addCalendarEvent, calendarEvents }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [addedIds, setAddedIds] = useState(new Set())
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedMajor, setSelectedMajor] = useState(() => {
    const saved = localStorage.getItem('userMajor')
    return saved || userProfile?.major || 'Computer Science'
  })

  const tips = TIPS_BY_MAJOR[selectedMajor] || TIPS_BY_MAJOR.default

  // Sync major from localStorage whenever component mounts
  useEffect(() => {
    const saved = localStorage.getItem('userMajor')
    if (saved) {
      setSelectedMajor(saved)
    }
  }, [])

  const FILTERS = ['All', 'Academic', 'Sports', 'Arts', 'Community', 'Professional', 'Leadership']
  const alreadyInCalendar = (title) => calendarEvents.some(e => e.title === title)

  const getCategoryColor = (cat) => {
    const map = { Academic: '#7c6af7', Sports: '#f76a6a', Arts: '#f7a26a', Community: '#6af7a2', Professional: '#6ab8f7', Leadership: '#f76af7' }
    return map[cat] || '#7c6af7'
  }

const ALL_EXTRACURRICULARS = [
  // Academic - Tech Heavy
  { title: "Computer Science Club", category: "Academic", description: "Collaborate on projects, hackathons, and competitive programming.", commitment: "3 hrs/week", teamSize: "50-100 members", rating: 4.8, meetingDay: "Wednesdays", skills: ["Problem Solving", "Teamwork", "Coding"], why: "Perfect for CS majors - boost your portfolio." },
  { title: "Competitive Programming Club", category: "Academic", description: "Prepare for coding competitions and improve algorithmic skills.", commitment: "5 hrs/week", teamSize: "25-40 members", rating: 4.8, meetingDay: "Thursdays", skills: ["Algorithms", "C++/Java", "Problem-Solving"], why: "Direct path to FAANG internships." },
  { title: "Data Science Society", category: "Academic", description: "Learn machine learning, data analysis, and build real projects.", commitment: "4 hrs/week", teamSize: "30-60 members", rating: 4.7, meetingDay: "Tuesdays", skills: ["Python", "Analytics", "ML"], why: "Essential for data science majors." },
  { title: "Artificial Intelligence Club", category: "Academic", description: "Explore AI/ML concepts and build intelligent systems.", commitment: "4 hrs/week", teamSize: "40-70 members", rating: 4.8, meetingDay: "Mondays", skills: ["Machine Learning", "Python", "Innovation"], why: "Cutting-edge field with high demand." },
  { title: "Cybersecurity Club", category: "Academic", description: "Learn hacking, security, and participate in CTF competitions.", commitment: "4 hrs/week", teamSize: "35-50 members", rating: 4.7, meetingDay: "Wednesdays", skills: ["Security", "Hacking", "Networking"], why: "Perfect for cybersecurity majors." },
  { title: "Web Development Club", category: "Academic", description: "Build full-stack web applications and deploy live projects.", commitment: "4-5 hrs/week", teamSize: "40-60 members", rating: 4.8, meetingDay: "Fridays", skills: ["React", "Node.js", "Databases"], why: "Build portfolio projects that impress employers." },
  { title: "Mobile App Development Club", category: "Academic", description: "Create iOS and Android apps from scratch.", commitment: "5 hrs/week", teamSize: "30-50 members", rating: 4.7, meetingDay: "Mondays & Wednesdays", skills: ["Swift", "Kotlin", "UI Design"], why: "Great for software engineering majors." },
  { title: "Game Development Club", category: "Academic", description: "Design and program video games using Unity/Unreal.", commitment: "6-8 hrs/week", teamSize: "35-60 members", rating: 4.8, meetingDay: "Weekends", skills: ["Game Dev", "Graphics", "C#"], why: "Fun and challenging creative outlet." },
  { title: "Robotics Team", category: "Academic", description: "Build and compete with robots in national competitions.", commitment: "10-15 hrs/week", teamSize: "20-40 members", rating: 4.9, meetingDay: "Daily", skills: ["Engineering", "Electronics", "Teamwork"], why: "Hands-on experience employers love." },
  { title: "Undergraduate Research Program", category: "Academic", description: "Work alongside faculty on cutting-edge research projects.", commitment: "8-10 hrs/week", teamSize: "5-15 members", rating: 4.9, meetingDay: "Flexible", skills: ["Research", "Critical Thinking", "Writing"], why: "Essential for grad school." },
  { title: "Blockchain & Crypto Club", category: "Academic", description: "Learn blockchain technology and cryptocurrency development.", commitment: "3-4 hrs/week", teamSize: "25-40 members", rating: 4.7, meetingDay: "Thursdays", skills: ["Blockchain", "Smart Contracts", "Finance"], why: "Future-proof tech skills." },
  { title: "Chemical Society", category: "Academic", description: "Conduct experiments, attend seminars, and network with chemists.", commitment: "3 hrs/week", teamSize: "40-60 members", rating: 4.6, meetingDay: "Fridays", skills: ["Chemistry", "Lab Work", "Analysis"], why: "Essential for chemistry majors." },
  { title: "Physics Club", category: "Academic", description: "Discuss physics concepts, conduct experiments, and compete.", commitment: "3-4 hrs/week", teamSize: "30-50 members", rating: 4.7, meetingDay: "Tuesdays", skills: ["Physics", "Problem-Solving", "Experimentation"], why: "Great for physics majors." },
  { title: "Mathematics Club", category: "Academic", description: "Solve challenging proofs and compete in math competitions.", commitment: "3 hrs/week", teamSize: "20-35 members", rating: 4.8, meetingDay: "Mondays", skills: ["Abstract Math", "Proofs", "Competition"], why: "Perfect for math majors." },
  { title: "Pre-Med Club", category: "Academic", description: "Prepare for medical school with MCAT prep and shadowing.", commitment: "4-5 hrs/week", teamSize: "30-50 members", rating: 4.7, meetingDay: "Wednesdays", skills: ["MCAT Prep", "Healthcare", "Science"], why: "Essential for pre-med students." },
  { title: "Biology Club", category: "Academic", description: "Explore biology through field trips, seminars, and research.", commitment: "2-3 hrs/week", teamSize: "25-40 members", rating: 4.6, meetingDay: "Thursdays", skills: ["Biology", "Lab Work", "Ecology"], why: "Great for biology majors." },
  { title: "Environmental Science Club", category: "Academic", description: "Work on climate research and conservation projects.", commitment: "3-4 hrs/week", teamSize: "35-55 members", rating: 4.7, meetingDay: "Tuesdays", skills: ["Environmental Science", "Conservation", "Research"], why: "Perfect for environmental majors." },
  { title: "Neuroscience Research Club", category: "Academic", description: "Study brain science and conduct neuroscience experiments.", commitment: "4-5 hrs/week", teamSize: "20-35 members", rating: 4.8, meetingDay: "Thursdays", skills: ["Neuroscience", "Lab Work", "Research"], why: "Ideal for neuroscience majors." },

  // Professional & Business
  { title: "Business Case Competition Team", category: "Professional", description: "Solve business cases and compete in regional/national competitions.", commitment: "5-6 hrs/week", teamSize: "8-15 members", rating: 4.9, meetingDay: "Saturdays", skills: ["Business Analysis", "Strategy", "Presentation"], why: "Direct networking with recruiters." },
  { title: "Consulting Club", category: "Professional", description: "Learn consulting frameworks and solve business problems.", commitment: "4 hrs/week", teamSize: "30-60 members", rating: 4.8, meetingDay: "Thursdays", skills: ["Consulting", "Analysis", "Communication"], why: "Gateway to McKinsey, BCG, Bain." },
  { title: "Finance & Investment Club", category: "Professional", description: "Analyze stocks, manage a portfolio, and learn about markets.", commitment: "3-4 hrs/week", teamSize: "40-70 members", rating: 4.7, meetingDay: "Tuesdays", skills: ["Finance", "Trading", "Valuation"], why: "Essential for business and finance majors." },
  { title: "Product Management Club", category: "Professional", description: "Learn product thinking and work on real product problems.", commitment: "3-4 hrs/week", teamSize: "25-45 members", rating: 4.8, meetingDay: "Wednesdays", skills: ["Product Strategy", "Analytics", "User Research"], why: "Perfect for PM internship prep." },
  { title: "Entrepreneurship Club", category: "Professional", description: "Build startup ideas and connect with founders.", commitment: "4 hrs/week", teamSize: "40-80 members", rating: 4.8, meetingDay: "Thursdays", skills: ["Entrepreneurship", "Pitching", "Innovation"], why: "For future founders." },
  { title: "Marketing & Brand Strategy Club", category: "Professional", description: "Develop marketing campaigns and learn brand strategy.", commitment: "3 hrs/week", teamSize: "35-55 members", rating: 4.7, meetingDay: "Fridays", skills: ["Marketing", "Branding", "Analytics"], why: "Essential for marketing majors." },
  { title: "Real Estate Club", category: "Professional", description: "Learn real estate investing and development principles.", commitment: "2-3 hrs/week", teamSize: "20-35 members", rating: 4.6, meetingDay: "Mondays", skills: ["Real Estate", "Finance", "Negotiation"], why: "Great for business students." },
  { title: "Accounting Society", category: "Professional", description: "Prepare for CPA exam and learn accounting practices.", commitment: "3-4 hrs/week", teamSize: "30-50 members", rating: 4.7, meetingDay: "Wednesdays", skills: ["Accounting", "Excel", "Tax"], why: "Essential for accounting majors." },
  { title: "Economics Society", category: "Professional", description: "Study economic theory and analyze global markets.", commitment: "2-3 hrs/week", teamSize: "25-40 members", rating: 4.6, meetingDay: "Mondays", skills: ["Economics", "Analysis", "Research"], why: "Perfect for economics majors." },
  { title: "Sales & Business Development Club", category: "Professional", description: "Learn sales techniques and B2B business development.", commitment: "3 hrs/week", teamSize: "30-45 members", rating: 4.7, meetingDay: "Tuesdays", skills: ["Sales", "Negotiation", "Relationship Building"], why: "Great for business development careers." },
  { title: "Private Equity Club", category: "Professional", description: "Learn LBO modeling and investment strategies.", commitment: "4-5 hrs/week", teamSize: "15-25 members", rating: 4.8, meetingDay: "Saturdays", skills: ["Finance", "Modeling", "Valuation"], why: "Ideal for finance career paths." },
  { title: "Startup Accelerator Program", category: "Professional", description: "Incubate your startup idea with mentorship and funding.", commitment: "10+ hrs/week", teamSize: "10-20 teams", rating: 4.9, meetingDay: "Flexible", skills: ["Entrepreneurship", "Fundraising", "Execution"], why: "Launch your own company." },

  // Leadership & Service
  { title: "Student Government Association", category: "Leadership", description: "Represent student interests and shape campus policies.", commitment: "5 hrs/week", teamSize: "30-60 members", rating: 4.6, meetingDay: "Mondays", skills: ["Leadership", "Public Speaking", "Advocacy"], why: "Develop leadership skills." },
  { title: "Debate Team", category: "Leadership", description: "Compete in debates on policy, public forum, and parliamentary.", commitment: "6-8 hrs/week", teamSize: "15-30 members", rating: 4.8, meetingDay: "Tuesdays & Thursdays", skills: ["Public Speaking", "Critical Thinking", "Debate"], why: "Perfect for law and politics majors." },
  { title: "Model United Nations", category: "Leadership", description: "Represent countries in UN simulations and develop diplomacy.", commitment: "4-5 hrs/week", teamSize: "50-100 members", rating: 4.7, meetingDay: "Mondays & Wednesdays", skills: ["Diplomacy", "Public Speaking", "Research"], why: "Ideal for IR majors." },
  { title: "Toastmasters Public Speaking Club", category: "Leadership", description: "Develop public speaking and leadership skills.", commitment: "2 hrs/week", teamSize: "20-35 members", rating: 4.9, meetingDay: "Thursdays", skills: ["Public Speaking", "Leadership", "Confidence"], why: "Universally valuable skill." },
  { title: "Leadership Honor Society", category: "Leadership", description: "Exclusive organization for emerging student leaders.", commitment: "3 hrs/week", teamSize: "30-50 members", rating: 4.8, meetingDay: "Varies", skills: ["Leadership", "Service", "Networking"], why: "Prestigious credential." },
  { title: "Residential Advisor Program", category: "Leadership", description: "Lead residence hall communities and mentor residents.", commitment: "8-10 hrs/week", teamSize: "40-60 members", rating: 4.8, meetingDay: "Flexible", skills: ["Leadership", "Mentorship", "Communication"], why: "Great leadership experience." },
  { title: "Orientation Leader Program", category: "Leadership", description: "Guide new students through orientation week.", commitment: "5-7 hrs/week", teamSize: "50-100 members", rating: 4.7, meetingDay: "Variable", skills: ["Leadership", "Public Speaking", "Mentorship"], why: "Shape campus culture." },
  { title: "Greek Life Leadership", category: "Leadership", description: "Lead fraternity/sorority organizations and communities.", commitment: "5-8 hrs/week", teamSize: "Varies", rating: 4.7, meetingDay: "Variable", skills: ["Leadership", "Community Building", "Fundraising"], why: "Build lifelong networks." },
  { title: "Class Officer Council", category: "Leadership", description: "Represent and organize your class year.", commitment: "3-4 hrs/week", teamSize: "8-12 members", rating: 4.6, meetingDay: "Bi-weekly", skills: ["Leadership", "Organization", "Event Planning"], why: "Get involved in class activities." },

  // Community Service
  { title: "Volunteer Tutoring Corps", category: "Community", description: "Tutor local high school students in STEM subjects.", commitment: "2 hrs/week", teamSize: "20-40 members", rating: 4.7, meetingDay: "Saturdays", skills: ["Teaching", "Mentorship", "Communication"], why: "Give back while reinforcing knowledge." },
  { title: "Community Outreach Program", category: "Community", description: "Organize community service events and help communities.", commitment: "3-4 hrs/week", teamSize: "60-100 members", rating: 4.6, meetingDay: "Saturdays & Sundays", skills: ["Service", "Organization", "Empathy"], why: "Make real community impact." },
  { title: "Habitat for Humanity", category: "Community", description: "Build homes for families in need.", commitment: "4-6 hrs/week", teamSize: "50-80 members", rating: 4.8, meetingDay: "Saturdays", skills: ["Teamwork", "Service", "Construction"], why: "Meaningful work with direct impact." },
  { title: "Food Bank Volunteer Program", category: "Community", description: "Organize and distribute food to families in need.", commitment: "2 hrs/week", teamSize: "40-60 members", rating: 4.7, meetingDay: "Sundays", skills: ["Organization", "Service", "Teamwork"], why: "Fight food insecurity." },
  { title: "Mentorship for First-Generation Students", category: "Community", description: "Mentor first-generation college students.", commitment: "2-3 hrs/week", teamSize: "30-50 members", rating: 4.9, meetingDay: "Flexible", skills: ["Mentorship", "Guidance", "Support"], why: "Help future leaders succeed." },
  { title: "Environmental Club", category: "Community", description: "Work on campus sustainability and conservation.", commitment: "3 hrs/week", teamSize: "40-70 members", rating: 4.7, meetingDay: "Tuesdays", skills: ["Environmentalism", "Activism", "Sustainability"], why: "Protect the planet." },
  { title: "Community Health Outreach", category: "Community", description: "Provide health education and wellness programs to communities.", commitment: "3-4 hrs/week", teamSize: "25-40 members", rating: 4.7, meetingDay: "Saturdays", skills: ["Healthcare", "Education", "Community Health"], why: "Promote public health." },
  { title: "Animal Shelter Volunteering", category: "Community", description: "Care for animals and help at local shelters.", commitment: "2-3 hrs/week", teamSize: "20-35 members", rating: 4.6, meetingDay: "Weekends", skills: ["Compassion", "Care", "Teamwork"], why: "Help animals in need." },
  { title: "Senior Citizen Mentorship", category: "Community", description: "Mentor and spend time with senior citizens.", commitment: "2 hrs/week", teamSize: "15-25 members", rating: 4.8, meetingDay: "Flexible", skills: ["Mentorship", "Compassion", "Listening"], why: "Build intergenerational bonds." },
  { title: "Homeless Outreach Initiative", category: "Community", description: "Provide support and resources to homeless populations.", commitment: "3-4 hrs/week", teamSize: "35-50 members", rating: 4.8, meetingDay: "Saturdays & Sundays", skills: ["Compassion", "Organization", "Advocacy"], why: "Combat homelessness." },
  { title: "International Service Corps", category: "Community", description: "Volunteer internationally in underserved communities.", commitment: "Variable", teamSize: "15-30 members", rating: 4.9, meetingDay: "Flexible", skills: ["Service", "Global Awareness", "Leadership"], why: "Make worldwide impact." },
  { title: "Youth Mentorship Program", category: "Community", description: "Be a positive role model for at-risk youth.", commitment: "3 hrs/week", teamSize: "30-50 members", rating: 4.8, meetingDay: "Flexible", skills: ["Mentorship", "Patience", "Leadership"], why: "Change lives." },

  // Arts & Culture
  { title: "Theater & Performing Arts Club", category: "Arts", description: "Perform in plays, musicals, and theatrical productions.", commitment: "6-10 hrs/week", teamSize: "40-70 members", rating: 4.8, meetingDay: "Daily rehearsals", skills: ["Acting", "Performance", "Creativity"], why: "Great for performing arts majors." },
  { title: "Music Performance Ensemble", category: "Arts", description: "Join orchestra, band, or choir and perform.", commitment: "3-4 hrs/week", teamSize: "30-60 members", rating: 4.7, meetingDay: "Tuesdays & Thursdays", skills: ["Music", "Teamwork", "Performance"], why: "Essential for music majors." },
  { title: "Visual Arts Studio Club", category: "Arts", description: "Paint, sculpt, draw, and develop artistic skills.", commitment: "3 hrs/week", teamSize: "20-35 members", rating: 4.6, meetingDay: "Wednesdays & Saturdays", skills: ["Drawing", "Painting", "Sculpture"], why: "Essential for art majors." },
  { title: "Film & Videography Club", category: "Arts", description: "Create short films, documentaries, and videos.", commitment: "5-6 hrs/week", teamSize: "30-50 members", rating: 4.8, meetingDay: "Weekends", skills: ["Filmmaking", "Editing", "Storytelling"], why: "Perfect for film majors." },
  { title: "Photography & Media Society", category: "Arts", description: "Explore photography, editing, and visual storytelling.", commitment: "2-3 hrs/week", teamSize: "25-50 members", rating: 4.5, meetingDay: "Fridays", skills: ["Photography", "Design", "Composition"], why: "Build creative portfolio." },
  { title: "Comic & Graphic Novel Club", category: "Arts", description: "Create comics and develop illustration skills.", commitment: "2-3 hrs/week", teamSize: "20-40 members", rating: 4.5, meetingDay: "Fridays", skills: ["Illustration", "Storytelling", "Design"], why: "Fun creative community." },
  { title: "Creative Writing Club", category: "Arts", description: "Write poetry, prose, and share your work.", commitment: "2-3 hrs/week", teamSize: "20-35 members", rating: 4.7, meetingDay: "Mondays", skills: ["Writing", "Storytelling", "Critique"], why: "Perfect for writing majors." },
  { title: "Poetry & Slam Club", category: "Arts", description: "Write and perform spoken word poetry.", commitment: "2-3 hrs/week", teamSize: "15-30 members", rating: 4.8, meetingDay: "Thursdays", skills: ["Poetry", "Performance", "Expression"], why: "Artistic expression." },
  { title: "Improv Comedy Club", category: "Arts", description: "Perform improvisational comedy and sketches.", commitment: "3 hrs/week", teamSize: "20-35 members", rating: 4.7, meetingDay: "Fridays", skills: ["Comedy", "Performance", "Creativity"], why: "Have fun while performing." },
  { title: "Design & UX Club", category: "Arts", description: "Learn design principles, UX/UI, and create digital designs.", commitment: "3-4 hrs/week", teamSize: "25-40 members", rating: 4.8, meetingDay: "Wednesdays", skills: ["Design", "UX", "Creativity"], why: "Great for design majors." },
  { title: "Music Production Club", category: "Arts", description: "Learn music production and create original tracks.", commitment: "4-5 hrs/week", teamSize: "15-30 members", rating: 4.8, meetingDay: "Tuesdays & Thursdays", skills: ["Music Production", "Sound Design", "Creativity"], why: "Perfect for aspiring producers." },
  { title: "Dance Club", category: "Arts", description: "Learn various dance styles and perform.", commitment: "3-4 hrs/week", teamSize: "30-50 members", rating: 4.7, meetingDay: "Mondays & Wednesdays", skills: ["Dance", "Performance", "Fitness"], why: "Artistic expression through movement." },

  // Sports & Recreation
  { title: "Soccer Club", category: "Sports", description: "Play recreational soccer in intramural leagues.", commitment: "4-5 hrs/week", teamSize: "30-50 members", rating: 4.7, meetingDay: "Tuesdays & Thursdays", skills: ["Teamwork", "Fitness", "Strategy"], why: "Great fitness and bonding." },
  { title: "Rowing Team", category: "Sports", description: "Competitive rowing with water and gym training.", commitment: "8-10 hrs/week", teamSize: "40-60 members", rating: 4.8, meetingDay: "Daily", skills: ["Teamwork", "Strength", "Discipline"], why: "Builds incredible bonds." },
  { title: "Rock Climbing Club", category: "Sports", description: "Indoor and outdoor rock climbing.", commitment: "3-4 hrs/week", teamSize: "25-40 members", rating: 4.6, meetingDay: "Wednesdays & Weekends", skills: ["Problem-Solving", "Strength", "Courage"], why: "Fun challenge activity." },
  { title: "Running & Cross Country Club", category: "Sports", description: "Train for and compete in running races.", commitment: "4-5 hrs/week", teamSize: "30-50 members", rating: 4.7, meetingDay: "Daily", skills: ["Fitness", "Discipline", "Perseverance"], why: "Build endurance." },
  { title: "Ultimate Frisbee Club", category: "Sports", description: "Play competitive ultimate frisbee.", commitment: "3-4 hrs/week", teamSize: "40-60 members", rating: 4.8, meetingDay: "Tuesdays & Thursdays", skills: ["Athleticism", "Teamwork", "Agility"], why: "Fast-paced and fun." },
  { title: "Martial Arts Club", category: "Sports", description: "Learn karate, taekwondo, or boxing.", commitment: "3-4 hrs/week", teamSize: "30-50 members", rating: 4.8, meetingDay: "Mondays & Wednesdays", skills: ["Discipline", "Self-Defense", "Confidence"], why: "Build confidence." },
  { title: "Tennis Club", category: "Sports", description: "Play tennis competitively or recreationally.", commitment: "3-4 hrs/week", teamSize: "25-40 members", rating: 4.6, meetingDay: "Tuesdays & Thursdays", skills: ["Racquet Skills", "Fitness", "Precision"], why: "Lifetime sport." },
  { title: "Basketball Club", category: "Sports", description: "Play competitive and recreational basketball.", commitment: "3-4 hrs/week", teamSize: "35-55 members", rating: 4.7, meetingDay: "Mondays & Wednesdays", skills: ["Teamwork", "Fitness", "Strategy"], why: "Classic team sport." },
  { title: "Volleyball Club", category: "Sports", description: "Play competitive and intramural volleyball.", commitment: "3-4 hrs/week", teamSize: "30-50 members", rating: 4.6, meetingDay: "Tuesdays & Thursdays", skills: ["Teamwork", "Coordination", "Fitness"], why: "Fun team sport." },
  { title: "Swimming & Diving Club", category: "Sports", description: "Swim competitively and recreationally.", commitment: "4-6 hrs/week", teamSize: "25-40 members", rating: 4.7, meetingDay: "Daily", skills: ["Swimming", "Fitness", "Endurance"], why: "Full-body workout." },
  { title: "Cycling Club", category: "Sports", description: "Road cycling, mountain biking, and bike touring.", commitment: "3-4 hrs/week", teamSize: "30-45 members", rating: 4.7, meetingDay: "Weekends", skills: ["Cycling", "Endurance", "Outdoor Skills"], why: "Explore outdoors." },
  { title: "Fitness & Wellness Club", category: "Sports", description: "Yoga, pilates, and general fitness activities.", commitment: "2-3 hrs/week", teamSize: "50-100 members", rating: 4.8, meetingDay: "Flexible", skills: ["Fitness", "Wellness", "Mindfulness"], why: "Holistic health." },
  { title: "Outdoor Adventure Club", category: "Sports", description: "Hiking, camping, rock climbing, and outdoor exploration.", commitment: "4-5 hrs/week", teamSize: "35-55 members", rating: 4.8, meetingDay: "Weekends", skills: ["Outdoor Skills", "Leadership", "Teamwork"], why: "Explore nature." },
]

  const handleSearch = async (customQuery) => {
    const searchQ = (customQuery || query).toLowerCase()
    setLoading(true)
    setHasSearched(true)
    setResults([])
    
    // Simulate API delay
    setTimeout(() => {
      let filtered = ALL_EXTRACURRICULARS
      
      // Filter by search query
      if (searchQ.trim()) {
        filtered = filtered.filter(ec => 
          ec.title.toLowerCase().includes(searchQ) ||
          ec.description.toLowerCase().includes(searchQ) ||
          ec.skills.some(skill => skill.toLowerCase().includes(searchQ)) ||
          ec.category.toLowerCase().includes(searchQ)
        )
      }
      
      setResults(filtered)
      setLoading(false)
    }, 500)
  }

  const handleAdd = (activity) => {
    if (alreadyInCalendar(activity.title)) return
    addCalendarEvent({ title: activity.title, category: activity.category, description: activity.description, commitment: activity.commitment, meetingDay: activity.meetingDay, color: getCategoryColor(activity.category), type: 'extracurricular' })
    setAddedIds(prev => new Set([...prev, activity.title]))
  }

  const handleBrowseAll = () => {
    setQuery('')
    setResults(ALL_EXTRACURRICULARS)
    setHasSearched(true)
    setActiveFilter('All')
  }

  const filtered = activeFilter === 'All' ? results : results.filter(r => r.category === activeFilter)

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <span className="chip chip-accent"><Sparkles size={10} /> AI Discovery</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
            Explore Extracurriculars
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500 }}>Ask AI to find the perfect activities for your major, goals, and schedule.</p>
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input className="input" style={{ paddingLeft: '42px' }} placeholder={`Find ECs for ${selectedMajor || 'your major'}...`} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-primary" onClick={() => handleSearch()} disabled={loading}>
              {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />}
              {loading ? 'Finding...' : 'Find ECs'}
            </motion.button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Try:</span>
            {[`Best ECs for ${selectedMajor || 'CS'} students`, 'Leadership opportunities', 'ECs for grad school', 'Community service'].map(p => (
              <button key={p} onClick={() => { setQuery(p); handleSearch(p) }} style={{ padding: '5px 12px', borderRadius: '100px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'var(--font-body)' }}
                onMouseOver={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)' }}
                onMouseOut={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)' }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {results.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={15} style={{ color: 'var(--text-dim)' }} />
            {FILTERS.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{ padding: '5px 14px', borderRadius: '100px', border: `1.5px solid ${activeFilter === f ? 'var(--accent)' : 'var(--border)'}`, background: activeFilter === f ? 'var(--accent-glow)' : 'transparent', color: activeFilter === f ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 500, transition: 'all 0.2s ease' }}>
                {f}
              </button>
            ))}
          </div>
        )}

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

        {!loading && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
            {filtered.map((ec, i) => <ECCard key={ec.title} ec={ec} index={i} isAdded={addedIds.has(ec.title) || alreadyInCalendar(ec.title)} onAdd={() => handleAdd(ec)} color={getCategoryColor(ec.category)} />)}
          </div>
        )}

        {!loading && hasSearched && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😅</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No ECs found for "{query}"</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: 500, margin: '0 auto 1.5rem' }}>Try a different search term or explore all ECs in our community.</p>
            <button className="btn btn-primary" onClick={() => handleBrowseAll()}><Sparkles size={16} /> Browse All ECs</button>
          </motion.div>
        )}

        {!loading && !hasSearched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Ready to discover your extracurriculars?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Ask AI to find activities tailored to your major and goals.</p>
            <button className="btn btn-primary" onClick={() => handleBrowseAll()}><Sparkles size={16} /> Browse All ECs for {selectedMajor}</button>
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border)'
          }}
        >
          <h2 style={{
            fontSize: '1.4rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            marginBottom: '2rem',
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
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.06, boxShadow: '0 12px 40px rgba(247,162,106,0.15)' }}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  background: 'linear-gradient(135deg, rgba(247,162,106,0.05), rgba(247,162,106,0.02))',
                  border: '1px solid rgba(247,162,106,0.2)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f7a26a, #e8915a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1rem',
                  flexShrink: 0
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '1rem',
                    color: 'var(--text)',
                    margin: 0,
                    lineHeight: 1.6
                  }}>
                    {tip}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

function ECCard({ ec, index, isAdded, onAdd, color }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.06 }}
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden', transition: 'border-color 0.25s ease' }}
      onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
      onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '16px 16px 0 0' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 600, background: `${color}22`, color, border: `1px solid ${color}44` }}>{ec.category}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={11} fill="var(--accent2)" color="var(--accent2)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--accent2)', fontWeight: 600 }}>{ec.rating}</span>
            </div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', lineHeight: 1.3 }}>{ec.title}</h3>
        </div>
        <motion.button whileHover={{ scale: 1.15, rotate: isAdded ? 0 : 45 }} whileTap={{ scale: 0.9 }}
          onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
          onClick={onAdd} disabled={isAdded}
          style={{ width: 38, height: 38, borderRadius: '12px', flexShrink: 0, border: `2px solid ${isAdded ? 'var(--success)' : hovered ? color : 'var(--border)'}`, background: isAdded ? 'rgba(106,247,162,0.15)' : hovered ? `${color}22` : 'transparent', color: isAdded ? 'var(--success)' : hovered ? color : 'var(--text-dim)', cursor: isAdded ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s ease' }}>
          {isAdded ? <Check size={16} /> : <Plus size={16} />}
        </motion.button>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{ec.description}</p>
      {ec.why && <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(124,106,247,0.08)', border: '1px solid rgba(124,106,247,0.15)' }}><p style={{ fontSize: '0.78rem', color: 'var(--accent)', margin: 0 }}>✨ {ec.why}</p></div>}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-dim)' }}><Clock size={12} /> {ec.commitment}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-dim)' }}><Users size={12} /> {ec.teamSize}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-dim)' }}><MapPin size={12} /> {ec.meetingDay}</div>
      </div>
      {ec.skills && <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{ec.skills.map(s => <span key={s} className="tag">{s}</span>)}</div>}
    </motion.div>
  )
}