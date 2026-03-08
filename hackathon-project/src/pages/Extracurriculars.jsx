import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, Plus, Check, MapPin, Clock, Users, Star, Filter, Loader } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const ALL_EXTRACURRICULARS = [
  // One-Time Events & Competitions (25)
  { title: "Hackathon: MLH Local Hack Day", category: "Competition", description: "24-hour coding competition with prizes and networking.", commitment: "24 hrs (one-time)", teamSize: "1-4 members", rating: 4.9, meetingDay: "Saturdays", skills: ["Coding", "Problem Solving", "Teamwork"], why: "Build portfolio projects and network with tech companies.", type: "one-time", prepTime: "2-4 weeks", website: "https://mlh.io", location: "Campus", date: "March 15-16, 2026", prizes: "$5,000+", sponsors: ["Google", "Microsoft", "Amazon"] },
  { title: "Case Competition: Deloitte Challenge", category: "Competition", description: "Solve real business cases against top teams.", commitment: "48 hrs (one-time)", teamSize: "3-5 members", rating: 4.8, meetingDay: "Saturdays", skills: ["Business Analysis", "Presentation", "Strategy"], why: "Direct consulting interview prep.", type: "one-time", prepTime: "1-2 weeks", website: "https://deloitte.com", location: "Campus", date: "April 5-6, 2026", prizes: "$10,000+", sponsors: ["Deloitte", "PwC", "EY"] },
  { title: "Hackathon: PennApps", category: "Competition", description: "University of Pennsylvania's premier hackathon.", commitment: "36 hrs (one-time)", teamSize: "1-4 members", rating: 4.9, meetingDay: "Fridays", skills: ["Full-Stack Development", "Innovation", "Prototyping"], why: "Most prestigious East Coast hackathon.", type: "one-time", prepTime: "3-6 weeks", website: "https://pennapps.com", location: "Philadelphia, PA", date: "September 12-14, 2026", prizes: "$15,000+", sponsors: ["Facebook", "Apple", "Stripe"] },
  { title: "Startup Pitch Competition", category: "Competition", description: "Pitch startup ideas to real venture capitalists.", commitment: "2 hrs (one-time)", teamSize: "1-3 members", rating: 4.7, meetingDay: "Thursdays", skills: ["Pitching", "Entrepreneurship", "Business Planning"], why: "Real VC feedback and potential funding.", type: "one-time", prepTime: "1 month", website: "https://startupcompetition.edu", location: "Campus", date: "May 20, 2026", prizes: "$50,000+", sponsors: ["Y Combinator", "Sequoia", "Andreessen Horowitz"] },
  { title: "Data Science Competition: Kaggle Challenge", category: "Competition", description: "Compete in machine learning and data science challenges.", commitment: "Variable (one-time)", teamSize: "1-3 members", rating: 4.8, meetingDay: "Flexible", skills: ["Machine Learning", "Data Analysis", "Python"], why: "Build ML portfolio and Kaggle ranking.", type: "one-time", prepTime: "1-3 weeks", website: "https://kaggle.com", location: "Online", date: "Ongoing", prizes: "$100,000+", sponsors: ["Google", "NVIDIA", "Microsoft"] },
  { title: "Robotics Competition: FIRST Robotics", category: "Competition", description: "Build and compete with robots in regional tournaments.", commitment: "6 months prep + 3 days", teamSize: "10-20 members", rating: 4.9, meetingDay: "Saturdays", skills: ["Robotics", "Engineering", "Programming"], why: "Premier robotics competition worldwide.", type: "seasonal", prepTime: "6 months", website: "https://firstinspires.org", location: "Regional venues", date: "March-April 2026", prizes: "Championship berth", sponsors: ["NASA", "Boeing", "Google"] },
  { title: "Math Competition: Putnam Exam", category: "Competition", description: "America's premier undergraduate mathematics competition.", commitment: "6 hrs (one-time)", teamSize: "Individual", rating: 4.9, meetingDay: "Saturdays", skills: ["Advanced Mathematics", "Problem Solving", "Logic"], why: "Most prestigious math competition.", type: "one-time", prepTime: "Semester-long", website: "https://maa.org", location: "Campus", date: "December 6, 2025", prizes: "$2,500", sponsors: ["MAA", "NSF"] },
  { title: "Debate Tournament: CEDA Nationals", category: "Competition", description: "National parliamentary debate championship.", commitment: "3 days (one-time)", teamSize: "2 members", rating: 4.8, meetingDay: "Saturdays", skills: ["Debate", "Public Speaking", "Research"], why: "Highest level of competitive debate.", type: "one-time", prepTime: "Year-round", website: "https://cedadebate.org", location: "National venues", date: "April 2026", prizes: "National title", sponsors: ["CEDA", "Universities"] },
  { title: "Business Plan Competition", category: "Competition", description: "Develop and pitch comprehensive business plans.", commitment: "3 months prep + 1 day", teamSize: "3-5 members", rating: 4.7, meetingDay: "Fridays", skills: ["Business Planning", "Financial Modeling", "Pitching"], why: "Real-world entrepreneurship experience.", type: "one-time", prepTime: "3 months", website: "https://businessplan.edu", location: "Campus", date: "November 2025", prizes: "$25,000+", sponsors: ["Local VCs", "Corporations"] },
  { title: "Hackathon: HackMIT", category: "Competition", description: "MIT's annual hackathon with global participants.", commitment: "24 hrs (one-time)", teamSize: "1-4 members", rating: 4.9, meetingDay: "Saturdays", skills: ["Innovation", "Rapid Prototyping", "Collaboration"], why: "Most selective and prestigious hackathon.", type: "one-time", prepTime: "1-2 months", website: "https://hackmit.org", location: "Cambridge, MA", date: "September 2026", prizes: "$50,000+", sponsors: ["MIT", "Google", "Facebook"] },
  { title: "Science Fair: Intel ISEF", category: "Competition", description: "International Science and Engineering Fair.", commitment: "1 year prep + 1 week", teamSize: "1-3 members", rating: 4.9, meetingDay: "Saturdays", skills: ["Scientific Research", "Experimentation", "Presentation"], why: "World's largest science competition.", type: "annual", prepTime: "1 year", website: "https://societyforscience.org", location: "National venues", date: "May 2026", prizes: "$75,000+", sponsors: ["Intel", "Google", "Regeneron"] },
  { title: "Entrepreneurship Competition: Hult Prize", category: "Competition", description: "Solve global challenges with social entrepreneurship.", commitment: "6 months prep + 1 day", teamSize: "3-4 members", rating: 4.8, meetingDay: "Thursdays", skills: ["Social Entrepreneurship", "Innovation", "Global Issues"], why: "Address real-world problems with business.", type: "annual", prepTime: "6 months", website: "https://hultprize.org", location: "Campus", date: "March 2026", prizes: "$1M+", sponsors: ["Hult International", "UN"] },
  { title: "Design Competition: Adobe Design Achievement Awards", category: "Competition", description: "Showcase creative design work and digital media.", commitment: "3 months prep + 1 day", teamSize: "Individual", rating: 4.7, meetingDay: "Fridays", skills: ["Design", "Digital Media", "Creativity"], why: "Premier design competition for students.", type: "annual", prepTime: "3 months", website: "https://adobe.com", location: "Online", date: "June 2026", prizes: "$20,000+", sponsors: ["Adobe", "Design Schools"] },
  { title: "Engineering Competition: ASME Design Competition", category: "Competition", description: "Design and build engineering solutions.", commitment: "4 months prep + 2 days", teamSize: "4-6 members", rating: 4.8, meetingDay: "Saturdays", skills: ["Engineering Design", "Prototyping", "CAD"], why: "Professional engineering competition.", type: "annual", prepTime: "4 months", website: "https://asme.org", location: "Regional venues", date: "April 2026", prizes: "Scholarships", sponsors: ["ASME", "Engineering Firms"] },
  { title: "AI Competition: NeurIPS Challenge", category: "Competition", description: "Compete in cutting-edge AI and machine learning.", commitment: "3 months prep + 1 day", teamSize: "1-4 members", rating: 4.9, meetingDay: "Sundays", skills: ["AI/ML", "Research", "Innovation"], why: "Top-tier AI research competition.", type: "annual", prepTime: "3 months", website: "https://neurips.cc", location: "Online", date: "December 2025", prizes: "$50,000+", sponsors: ["Google", "OpenAI", "Meta"] },

  // Conferences & Workshops (20)
  { title: "TEDx University Conference", category: "Conference", description: "Organize and attend TED-style talks on campus.", commitment: "6 months prep + 1 day", teamSize: "20-50 members", rating: 4.8, meetingDay: "Saturdays", skills: ["Event Planning", "Public Speaking", "Networking"], why: "Build event management and speaking skills.", type: "annual", prepTime: "6 months", website: "https://tedx.com", location: "Campus", date: "October 2025", cost: "$25", speakers: "15+", sponsors: ["TED", "Local Sponsors"] },
  { title: "Career Fair: Tech Companies", category: "Conference", description: "Network with top tech companies and interview on-site.", commitment: "1 day (one-time)", teamSize: "500+ attendees", rating: 4.7, meetingDay: "Thursdays", skills: ["Networking", "Interviewing", "Professional Development"], why: "Direct access to tech internships.", type: "one-time", prepTime: "1 week", website: "https://careerfair.edu", location: "Campus", date: "February 15, 2026", cost: "Free", companies: "50+", sponsors: ["Major Tech Firms"] },
  { title: "Research Symposium", category: "Conference", description: "Present research findings to faculty and peers.", commitment: "3 months prep + 1 day", teamSize: "100-200 attendees", rating: 4.8, meetingDay: "Fridays", skills: ["Research Presentation", "Academic Writing", "Public Speaking"], why: "Essential for graduate school applications.", type: "annual", prepTime: "3 months", website: "https://researchsymposium.edu", location: "Campus", date: "April 2026", cost: "Free", sponsors: ["University", "Research Grants"] },
  { title: "Leadership Summit", category: "Conference", description: "Leadership workshops and networking with executives.", commitment: "2 days (one-time)", teamSize: "200-300 attendees", rating: 4.7, meetingDay: "Saturdays", skills: ["Leadership", "Networking", "Professional Development"], why: "Accelerate leadership development.", type: "annual", prepTime: "1 month", website: "https://leadershipsummit.edu", location: "Campus", date: "January 2026", cost: "$50", speakers: "20+", sponsors: ["Corporate Partners"] },
  { title: "Innovation Workshop Series", category: "Workshop", description: "Hands-on workshops in emerging technologies.", commitment: "3 hrs/session (6 sessions)", teamSize: "20-30 participants", rating: 4.6, meetingDay: "Wednesdays", skills: ["Innovation", "Technology", "Prototyping"], why: "Learn cutting-edge skills from industry experts.", type: "series", prepTime: "None", website: "https://innovationworkshops.edu", location: "Campus", date: "Ongoing", cost: "$10/session", instructors: "Industry Experts" },
  { title: "Entrepreneurship Bootcamp", category: "Workshop", description: "Intensive startup creation and business planning.", commitment: "40 hrs (one week)", teamSize: "25-40 participants", rating: 4.8, meetingDay: "Mondays", skills: ["Entrepreneurship", "Business Planning", "Pitching"], why: "Launch your startup idea.", type: "intensive", prepTime: "2 weeks", website: "https://entrepreneurshipbootcamp.edu", location: "Campus", date: "Summer 2026", cost: "$200", mentors: "10+", sponsors: ["Local VCs"] },
  { title: "Data Science Workshop", category: "Workshop", description: "Learn Python, R, and machine learning fundamentals.", commitment: "20 hrs (one month)", teamSize: "30-50 participants", rating: 4.7, meetingDay: "Tuesdays", skills: ["Data Science", "Programming", "Statistics"], why: "Fast-track data science career.", type: "course", prepTime: "None", website: "https://datascienceworkshop.edu", location: "Campus", date: "Spring 2026", cost: "$150", instructors: "PhD Students" },
  { title: "Public Speaking Masterclass", category: "Workshop", description: "Overcome fear and master presentation skills.", commitment: "8 hrs (one weekend)", teamSize: "20-30 participants", rating: 4.6, meetingDay: "Saturdays", skills: ["Public Speaking", "Presentation", "Confidence"], why: "Essential communication skills.", type: "weekend", prepTime: "None", website: "https://publicspeaking.edu", location: "Campus", date: "March 2026", cost: "$75", instructor: "Professional Speaker" },
  { title: "UX/UI Design Workshop", category: "Workshop", description: "Learn user-centered design and prototyping.", commitment: "16 hrs (two weeks)", teamSize: "25-35 participants", rating: 4.7, meetingDay: "Thursdays", skills: ["UX Design", "Prototyping", "User Research"], why: "Build design portfolio.", type: "course", prepTime: "None", website: "https://uxworkshop.edu", location: "Campus", date: "Fall 2025", cost: "$125", tools: ["Figma", "Adobe XD"] },
  { title: "Blockchain Development Workshop", category: "Workshop", description: "Build decentralized applications and smart contracts.", commitment: "24 hrs (three weeks)", teamSize: "20-30 participants", rating: 4.8, meetingDay: "Mondays", skills: ["Blockchain", "Smart Contracts", "Web3"], why: "Enter the Web3 space.", type: "course", prepTime: "Basic programming", website: "https://blockchainworkshop.edu", location: "Campus", date: "Spring 2026", cost: "$200", languages: ["Solidity", "JavaScript"] },

  // Internships & Programs (15)
  { title: "Summer Research Internship", category: "Internship", description: "Paid research position with faculty mentor.", commitment: "40 hrs/week (10 weeks)", teamSize: "Individual", rating: 4.9, meetingDay: "Full-time", skills: ["Research", "Lab Work", "Academic Writing"], why: "Essential for graduate school and research careers.", type: "summer", prepTime: "Application process", website: "https://researchinternship.edu", location: "Campus/Remote", date: "Summer 2026", stipend: "$5,000-$8,000", departments: "All STEM" },
  { title: "Tech Startup Internship", category: "Internship", description: "Work at local startup with equity potential.", commitment: "40 hrs/week (12 weeks)", teamSize: "Individual", rating: 4.8, meetingDay: "Full-time", skills: ["Software Development", "Agile", "Innovation"], why: "Real startup experience.", type: "summer", prepTime: "Portfolio prep", website: "https://startupinternship.edu", location: "Local startups", date: "Summer 2026", compensation: "$20-30/hr + equity", companies: "50+" },
  { title: "Consulting Case Team", category: "Internship", description: "Work on real consulting projects for nonprofits.", commitment: "20 hrs/week (semester)", teamSize: "4-6 members", rating: 4.7, meetingDay: "Flexible", skills: ["Consulting", "Business Analysis", "Client Management"], why: "Consulting interview prep.", type: "semester", prepTime: "Case prep", website: "https://consultinginternship.edu", location: "Campus", date: "Fall/Spring", compensation: "Unpaid", clients: "Local nonprofits" },
  { title: "Teaching Assistant Program", category: "Internship", description: "Assist professors and lead discussion sections.", commitment: "15 hrs/week (semester)", teamSize: "Individual", rating: 4.6, meetingDay: "Flexible", skills: ["Teaching", "Communication", "Subject Expertise"], why: "Develop teaching skills.", type: "semester", prepTime: "GPA requirement", website: "https://teachingassistant.edu", location: "Campus", date: "Fall/Spring", stipend: "$1,500/semester", courses: "Undergraduate" },
  { title: "Journalism Internship", category: "Internship", description: "Write articles and produce content for student media.", commitment: "20 hrs/week (semester)", teamSize: "Individual", rating: 4.7, meetingDay: "Flexible", skills: ["Writing", "Journalism", "Multimedia"], why: "Build media portfolio.", type: "semester", prepTime: "Writing samples", website: "https://journalisminternship.edu", location: "Campus", date: "Fall/Spring", compensation: "Unpaid", publications: "Student newspaper" },

  // Volunteer & Service (15)
  { title: "Hospital Volunteer Program", category: "Service", description: "Assist patients and staff at local hospital.", commitment: "4 hrs/week (semester)", teamSize: "Individual", rating: 4.8, meetingDay: "Flexible", skills: ["Compassion", "Healthcare", "Communication"], why: "Healthcare experience for pre-med.", type: "ongoing", prepTime: "Background check", website: "https://hospitalvolunteer.edu", location: "Local hospital", date: "Ongoing", impact: "Patient care", requirements: "18+ years old" },
  { title: "Environmental Cleanup Initiative", category: "Service", description: "Organize and participate in local environmental restoration.", commitment: "3 hrs/week (seasonal)", teamSize: "20-50 volunteers", rating: 4.6, meetingDay: "Weekends", skills: ["Environmental Stewardship", "Teamwork", "Leadership"], why: "Direct environmental impact.", type: "seasonal", prepTime: "None", website: "https://environmentalcleanup.edu", location: "Local parks", date: "Spring/Fall", impact: "Habitat restoration", partners: "Local government" },
  { title: "Youth Mentorship Program", category: "Service", description: "Mentor high school students in academic and career guidance.", commitment: "2 hrs/week (semester)", teamSize: "Individual", rating: 4.7, meetingDay: "Flexible", skills: ["Mentorship", "Communication", "Leadership"], why: "Make difference in young lives.", type: "semester", prepTime: "Interview", website: "https://youthmentorship.edu", location: "Local schools", date: "Fall/Spring", impact: "Academic success", mentees: "5-10 students" },
  { title: "Food Bank Distribution", category: "Service", description: "Sort, pack, and distribute food to low-income families.", commitment: "2 hrs/week (ongoing)", teamSize: "20-40 volunteers", rating: 4.6, meetingDay: "Flexible", skills: ["Organization", "Teamwork", "Compassion"], why: "Address food insecurity.", type: "ongoing", prepTime: "None", website: "https://foodbank.edu", location: "Local food bank", date: "Ongoing", impact: "Meals distributed", partners: "Local charities" },
  { title: "Animal Shelter Care", category: "Service", description: "Care for animals and assist with adoptions.", commitment: "3 hrs/week (ongoing)", teamSize: "30-60 volunteers", rating: 4.7, meetingDay: "Flexible", skills: ["Animal Care", "Compassion", "Communication"], why: "Help find homes for animals.", type: "ongoing", prepTime: "None", website: "https://animalshelter.edu", location: "Local shelter", date: "Ongoing", impact: "Animals helped", animals: "Dogs, cats, others" },

  // Travel & Cultural (10)
  { title: "Study Abroad Program", category: "Travel", description: "Academic semester in another country.", commitment: "Full semester", teamSize: "Class sizes vary", rating: 4.9, meetingDay: "Full-time", skills: ["Cultural Adaptation", "Language", "Independence"], why: "Transformative cultural experience.", type: "semester", prepTime: "Application process", website: "https://studyabroad.edu", location: "International", date: "Fall/Spring", cost: "$15,000-$25,000", countries: "50+", languages: "Multiple" },
  { title: "Cultural Immersion Trip", category: "Travel", description: "Short cultural exchange and language immersion.", commitment: "2 weeks (one-time)", teamSize: "15-25 participants", rating: 4.8, meetingDay: "Two weeks", skills: ["Cultural Awareness", "Language", "Adaptability"], why: "Intensive cultural experience.", type: "short", prepTime: "Language prep", website: "https://culturalimmersion.edu", location: "International", date: "Summer 2026", cost: "$3,000-$5,000", activities: "Language classes, cultural activities" },
  { title: "Service Learning Trip", category: "Travel", description: "Volunteer work combined with cultural learning.", commitment: "3 weeks (one-time)", teamSize: "20-30 participants", rating: 4.7, meetingDay: "Three weeks", skills: ["Service", "Cultural Learning", "Teamwork"], why: "Service with global perspective.", type: "short", prepTime: "None", website: "https://servicelearning.edu", location: "Developing countries", date: "Summer 2026", cost: "$4,000-$6,000", projects: "Community development" },

  // Academic (40) - keeping existing ones but adding new properties
  { title: "Computer Science Club", category: "Academic", description: "Collaborate on projects, hackathons, and competitive programming.", commitment: "3 hrs/week", teamSize: "50-100 members", rating: 4.8, meetingDay: "Wednesdays", skills: ["Problem Solving", "Teamwork", "Coding"], why: "Directly boosts technical skills and networking.", type: "club", website: "https://csclub.edu", location: "Campus", meetings: "Weekly", leadership: "President, Officers" },
  { title: "Undergraduate Research Program", category: "Academic", description: "Work alongside faculty on cutting-edge research projects.", commitment: "8-10 hrs/week", teamSize: "5-15 members", rating: 4.9, meetingDay: "Flexible", skills: ["Research", "Critical Thinking", "Writing"], why: "Essential for graduate school applications." },
  { title: "Debate Club", category: "Academic", description: "Compete in parliamentary and policy debate tournaments.", commitment: "6 hrs/week", teamSize: "20-40 members", rating: 4.7, meetingDay: "Tuesdays & Thursdays", skills: ["Public Speaking", "Critical Thinking", "Research"], why: "Improves communication and persuasion skills." },
  { title: "Math Olympiad Team", category: "Academic", description: "Prepare for national and international math competitions.", commitment: "4 hrs/week", teamSize: "15-25 members", rating: 4.9, meetingDay: "Saturdays", skills: ["Problem Solving", "Mathematical Thinking", "Persistence"], why: "Top choice for STEM majors and grad school." },
  { title: "Engineering Design Club", category: "Academic", description: "Build functional projects using CAD, fabrication, and electronics.", commitment: "5 hrs/week", teamSize: "30-60 members", rating: 4.8, meetingDay: "Thursdays", skills: ["CAD", "Problem Solving", "Teamwork"], why: "Build portfolio projects for internships." },
  { title: "Model United Nations", category: "Academic", description: "Represent countries at global conferences and debates.", commitment: "4 hrs/week", teamSize: "40-80 members", rating: 4.6, meetingDay: "Mondays & Wednesdays", skills: ["Public Speaking", "Diplomacy", "Research"], why: "Great for international relations and business careers." },
  { title: "Robotics Club", category: "Academic", description: "Design and build robots for FIRST and VEX competitions.", commitment: "8 hrs/week", teamSize: "25-50 members", rating: 4.9, meetingDay: "Flexible", skills: ["Programming", "Electronics", "Mechanical Design"], why: "Hands-on experience for engineering careers." },
  { title: "Data Science Club", category: "Academic", description: "Learn machine learning, analytics, and big data techniques.", commitment: "3 hrs/week", teamSize: "30-60 members", rating: 4.8, meetingDay: "Tuesdays", skills: ["Data Analysis", "Python", "Machine Learning"], why: "Perfect for CS and analytics career paths." },
  { title: "Biology Research Lab", category: "Academic", description: "Conduct experiments in molecular and cellular biology.", commitment: "10 hrs/week", teamSize: "5-10 members", rating: 4.8, meetingDay: "Flexible", skills: ["Lab Technique", "Scientific Writing", "Analysis"], why: "Crucial for pre-med and biology graduate programs." },
  { title: "Philosophy Club", category: "Academic", description: "Discuss ethics, metaphysics, epistemology, and social theory.", commitment: "2 hrs/week", teamSize: "15-30 members", rating: 4.5, meetingDay: "Thursdays", skills: ["Critical Thinking", "Discussion", "Analysis"], why: "Develops clear thinking and communication." },
  { title: "Economics Club", category: "Academic", description: "Explore economic theory and participate in trading competitions.", commitment: "3 hrs/week", teamSize: "20-40 members", rating: 4.6, meetingDay: "Wednesdays", skills: ["Analysis", "Trading", "Economic Theory"], why: "Excellent for finance and business careers." },
  { title: "Chemistry Club", category: "Academic", description: "Perform experiments, demonstrations, and chemistry outreach.", commitment: "3 hrs/week", teamSize: "20-35 members", rating: 4.7, meetingDay: "Fridays", skills: ["Lab Skills", "Safety", "Teaching"], why: "Build chemistry skills and mentoring experience." },
  { title: "Physics Society", category: "Academic", description: "Explore experimental and theoretical physics through projects.", commitment: "4 hrs/week", teamSize: "15-30 members", rating: 4.8, meetingDay: "Thursdays", skills: ["Physics Concepts", "Experimentation", "Analysis"], why: "Deepens physics understanding beyond coursework." },
  { title: "Neuroscience Journal Club", category: "Academic", description: "Review and discuss latest neuroscience research papers.", commitment: "2 hrs/week", teamSize: "10-20 members", rating: 4.7, meetingDay: "Tuesdays", skills: ["Research Analysis", "Presentation", "Discussion"], why: "Essential for pre-med and neuroscience majors." },
  { title: "Astrophysics Club", category: "Academic", description: "Observe celestial objects and learn space physics.", commitment: "3 hrs/week", teamSize: "15-25 members", rating: 4.8, meetingDay: "Saturdays", skills: ["Observation", "Physics", "Data Analysis"], why: "Perfect for physics and astronomy enthusiasts." },
  { title: "Case Competitions Club", category: "Academic", description: "Solve business cases and compete in management competitions.", commitment: "4 hrs/week", teamSize: "20-40 members", rating: 4.7, meetingDay: "Tuesdays & Fridays", skills: ["Problem Solving", "Business Analysis", "Presentation"], why: "Top preparation for consulting internships." },
  { title: "Actuarial Science Club", category: "Academic", description: "Prepare for actuarial exams and learn insurance math.", commitment: "4 hrs/week", teamSize: "15-30 members", rating: 4.9, meetingDay: "Thursdays", skills: ["Mathematics", "Statistics", "Finance"], why: "Essential for actuarial science majors." },
  { title: "Biomedical Engineering Club", category: "Academic", description: "Build medical devices and implant prototypes.", commitment: "6 hrs/week", teamSize: "20-40 members", rating: 4.8, meetingDay: "Flexible", skills: ["Engineering", "Biocompatibility", "Design"], why: "Great for pre-med engineers." },
  { title: "Environmental Science Club", category: "Academic", description: "Study sustainability, ecology, and climate science.", commitment: "3 hrs/week", teamSize: "20-40 members", rating: 4.6, meetingDay: "Wednesdays", skills: ["Environmental Science", "Sustainability", "Research"], why: "Perfect for environmental and ecology majors." },
  { title: "Astronomy Club", category: "Academic", description: "Star gazing, space exploration discussions, and planetarium visits.", commitment: "2 hrs/week", teamSize: "25-50 members", rating: 4.7, meetingDay: "Fridays", skills: ["Observation", "Astronomy", "Teaching"], why: "Accessible for all majors interested in space." },
  { title: "Coding Bootcamp", category: "Academic", description: "Intensive programming workshops in multiple languages.", commitment: "5 hrs/week", teamSize: "30-60 members", rating: 4.8, meetingDay: "Saturdays", skills: ["Programming", "Web Dev", "Problem Solving"], why: "Accelerate coding skills for tech careers." },
  { title: "Architecture & Design Club", category: "Academic", description: "Learn CAD, architecture, and interior design principles.", commitment: "3 hrs/week", teamSize: "20-35 members", rating: 4.6, meetingDay: "Thursdays", skills: ["Design", "CAD", "Creativity"], why: "Perfect for architecture and design students." },
  { title: "Psychology Research Lab", category: "Academic", description: "Conduct behavioral and cognitive psychology studies.", commitment: "8 hrs/week", teamSize: "5-12 members", rating: 4.8, meetingDay: "Flexible", skills: ["Research", "Data Analysis", "Participant Interaction"], why: "Essential for psychology graduate programs." },
  { title: "Quantum Computing Club", category: "Academic", description: "Learn quantum mechanics and quantum computing principles.", commitment: "4 hrs/week", teamSize: "15-25 members", rating: 4.9, meetingDay: "Tuesdays", skills: ["Quantum Physics", "Programming", "Mathematics"], why: "Cutting-edge for computer science majors." },
  { title: "Patent Law Club", category: "Academic", description: "Study intellectual property and patent applications.", commitment: "2 hrs/week", teamSize: "10-20 members", rating: 4.6, meetingDay: "Mondays", skills: ["Legal Thinking", "Patent Research", "Writing"], why: "Great for pre-law and STEM students." },
  { title: "Healthcare Ethics Club", category: "Academic", description: "Discuss bioethical dilemmas and healthcare policy.", commitment: "2 hrs/week", teamSize: "15-30 members", rating: 4.7, meetingDay: "Thursdays", skills: ["Ethics", "Critical Thinking", "Healthcare Knowledge"], why: "Essential for pre-med students." },
  { title: "Linear Algebra Study Group", category: "Academic", description: "Collaborative problem-solving for advanced mathematics.", commitment: "3 hrs/week", teamSize: "8-15 members", rating: 4.8, meetingDay: "Sundays", skills: ["Mathematics", "Collaboration", "Teaching"], why: "Boost grades in challenging math courses." },
  { title: "Genetics & Molecular Biology Club", category: "Academic", description: "Explore CRISPR, genetic engineering, and molecular techniques.", commitment: "3 hrs/week", teamSize: "20-30 members", rating: 4.8, meetingDay: "Tuesdays", skills: ["Molecular Biology", "Genetics", "Lab Technique"], why: "Perfect for biology and pre-med majors." },
  { title: "Urban Planning Club", category: "Academic", description: "Design sustainable cities and study urban development.", commitment: "3 hrs/week", teamSize: "15-25 members", rating: 4.6, meetingDay: "Wednesdays", skills: ["City Planning", "Sustainability", "Design"], why: "Great for environmental and civil engineering majors." },
  { title: "Blockchain & Crypto Club", category: "Academic", description: "Learn distributed systems, cryptography, and Web3.", commitment: "3 hrs/week", teamSize: "25-50 members", rating: 4.7, meetingDay: "Fridays", skills: ["Cryptography", "Web3", "Economics"], why: "Cutting-edge for CS and finance majors." },
  { title: "Immunology Research Lab", category: "Academic", description: "Study immune system function and vaccine development.", commitment: "10 hrs/week", teamSize: "5-10 members", rating: 4.9, meetingDay: "Flexible", skills: ["Lab Technique", "Immunology", "Research"], why: "Essential for immunology and pre-med careers." },

  // Professional (35)
  { title: "Student Government Association", category: "Leadership", description: "Represent student interests and shape campus policies.", commitment: "5 hrs/week", teamSize: "30-60 members", rating: 4.6, meetingDay: "Mondays", skills: ["Leadership", "Public Speaking", "Advocacy"], why: "Builds leadership skills valued by employers." },
  { title: "Entrepreneurship Club", category: "Professional", description: "Build startup ideas, pitch competitions, and connect with founders.", commitment: "4 hrs/week", teamSize: "40-80 members", rating: 4.8, meetingDay: "Thursdays", skills: ["Entrepreneurship", "Pitching", "Networking"], why: "Perfect for entrepreneurial career goals." },
  { title: "McKinsey Consulting Club", category: "Professional", description: "Prepare for consulting interviews and solve real business cases.", commitment: "4 hrs/week", teamSize: "30-60 members", rating: 4.9, meetingDay: "Tuesdays & Fridays", skills: ["Business Analysis", "Consulting", "Presentation"], why: "Target preparation for top consulting firms." },
  { title: "Goldman Sachs Investment Club", category: "Professional", description: "Learn investment analysis and stock market trading.", commitment: "3 hrs/week", teamSize: "25-50 members", rating: 4.8, meetingDay: "Wednesdays", skills: ["Finance", "Analysis", "Trading"], why: "Ideal for finance and business careers." },
  { title: "Tech Innovation Club", category: "Professional", description: "Explore emerging technologies and startup ecosystems.", commitment: "3 hrs/week", teamSize: "40-80 members", rating: 4.7, meetingDay: "Thursdays", skills: ["Technology", "Innovation", "Entrepreneurship"], why: "Network with tech industry professionals." },
  { title: "Real Estate Investment Club", category: "Professional", description: "Learn property investment, valuation, and development.", commitment: "2 hrs/week", teamSize: "20-40 members", rating: 4.6, meetingDay: "Mondays", skills: ["Real Estate", "Investment", "Finance"], why: "Great for business and finance majors." },
  { title: "Private Equity Club", category: "Professional", description: "Study leveraged buyouts and portfolio company management.", commitment: "3 hrs/week", teamSize: "20-40 members", rating: 4.8, meetingDay: "Tuesdays", skills: ["Finance", "M&A", "Valuation"], why: "Top choice for finance careers." },
  { title: "Venture Capital Club", category: "Professional", description: "Pitch ideas to VCs, learn startup funding, and network.", commitment: "3 hrs/week", teamSize: "30-50 members", rating: 4.7, meetingDay: "Thursdays", skills: ["Entrepreneurship", "Pitching", "Investment"], why: "Essential for startup founders." },
  { title: "Management Consulting Club", category: "Professional", description: "Case interviews, client projects, and consulting skills.", commitment: "4 hrs/week", teamSize: "25-45 members", rating: 4.8, meetingDay: "Wednesdays", skills: ["Business Analysis", "Consulting", "Teamwork"], why: "Direct prep for consulting interviews." },
  { title: "Corporate Finance Club", category: "Professional", description: "Learn financial modeling, valuation, and corporate strategy.", commitment: "3 hrs/week", teamSize: "20-40 members", rating: 4.7, meetingDay: "Fridays", skills: ["Financial Modeling", "Finance", "Analysis"], why: "Perfect for investment banking prep." },
  { title: "Marketing Strategy Club", category: "Professional", description: "Analyze brands, develop marketing campaigns, compete in battles.", commitment: "3 hrs/week", teamSize: "25-45 members", rating: 4.6, meetingDay: "Thursdays", skills: ["Marketing", "Strategy", "Branding"], why: "Great for marketing and business majors." },
  { title: "Product Management Club", category: "Professional", description: "Learn PM skills, build products, and analyze user needs.", commitment: "3 hrs/week", teamSize: "30-60 members", rating: 4.8, meetingDay: "Tuesdays", skills: ["Product Development", "Data Analysis", "User Research"], why: "Essential for PM career path." },
  { title: "Sales & Trading Club", category: "Professional", description: "Learn trading strategies, derivatives, and market dynamics.", commitment: "3 hrs/week", teamSize: "20-35 members", rating: 4.7, meetingDay: "Wednesdays", skills: ["Trading", "Markets", "Finance"], why: "Direct path to trading careers." },
  { title: "Corporate Law Club", category: "Professional", description: "Study M&A, securities law, and corporate transactions.", commitment: "2 hrs/week", teamSize: "15-30 members", rating: 4.6, meetingDay: "Mondays", skills: ["Legal Analysis", "M&A", "Contracts"], why: "Perfect for pre-law students." },
  { title: "Startup Accelerator Program", category: "Professional", description: "Intensive program to launch startups with mentorship and funding.", commitment: "12 hrs/week", teamSize: "5-15 teams", rating: 4.9, meetingDay: "Flexible", skills: ["Entrepreneurship", "All Skills"], why: "Best option for building a startup." },
  { title: "Digital Marketing Club", category: "Professional", description: "Learn SEO, social media, content marketing, and analytics.", commitment: "3 hrs/week", teamSize: "30-50 members", rating: 4.7, meetingDay: "Fridays", skills: ["Digital Marketing", "Analytics", "Content"], why: "Essential for modern marketing careers." },
  { title: "Business Analytics Club", category: "Professional", description: "Master data analytics tools and business intelligence.", commitment: "3 hrs/week", teamSize: "25-40 members", rating: 4.8, meetingDay: "Tuesdays", skills: ["Data Analysis", "Analytics", "Business Acumen"], why: "Top demand in corporate America." },
  { title: "Executive Leadership Development", category: "Professional", description: "One-on-one executive coaching and leadership mentoring.", commitment: "2 hrs/week", teamSize: "10-20 members", rating: 4.9, meetingDay: "Flexible", skills: ["Leadership", "Communication", "Strategy"], why: "Most exclusive development program." },
  { title: "Supply Chain Management Club", category: "Professional", description: "Study logistics, procurement, and operations management.", commitment: "2 hrs/week", teamSize: "15-30 members", rating: 4.6, meetingDay: "Wednesdays", skills: ["Supply Chain", "Operations", "Optimization"], why: "Essential for operations and logistics careers." },
  { title: "Human Resources Club", category: "Professional", description: "Learn HR strategy, recruitment, and employee relations.", commitment: "2 hrs/week", teamSize: "15-30 members", rating: 4.5, meetingDay: "Thursdays", skills: ["HR Strategy", "Recruitment", "Relations"], why: "Great for HR and organizational development." },
  { title: "Insurance & Risk Management Club", category: "Professional", description: "Study risk assessment and insurance products.", commitment: "2 hrs/week", teamSize: "10-20 members", rating: 4.6, meetingDay: "Mondays", skills: ["Risk Analysis", "Insurance", "Finance"], why: "Perfect for actuaries and risk managers." },
  { title: "Executive MBA Club", category: "Professional", description: "Prepare for MBA programs through case studies.", commitment: "3 hrs/week", teamSize: "20-40 members", rating: 4.8, meetingDay: "Tuesdays", skills: ["Business Strategy", "Leadership", "Analysis"], why: "Essential MBA exam preparation." },
  { title: "International Business Club", category: "Professional", description: "Study global markets, trade, and international strategy.", commitment: "2 hrs/week", teamSize: "20-40 members", rating: 4.6, meetingDay: "Fridays", skills: ["Global Business", "Trade", "Strategy"], why: "Great for international business careers." },
  { title: "Fintech Innovation Club", category: "Professional", description: "Explore financial technology and blockchain applications.", commitment: "3 hrs/week", teamSize: "25-45 members", rating: 4.8, meetingDay: "Thursdays", skills: ["Fintech", "Programming", "Finance"], why: "Perfect for fintech industry careers." },
  { title: "Sustainability Business Club", category: "Professional", description: "Study ESG investing and corporate sustainability.", commitment: "2 hrs/week", teamSize: "20-35 members", rating: 4.7, meetingDay: "Wednesdays", skills: ["Sustainability", "ESG", "Business"], why: "Growing field in responsible investing." },
  { title: "Negotiation & Conflict Resolution", category: "Professional", description: "Develop negotiation skills through simulations and case studies.", commitment: "2 hrs/week", teamSize: "15-30 members", rating: 4.7, meetingDay: "Thursdays", skills: ["Negotiation", "Communication", "Strategy"], why: "Essential skill for all business roles." },
  { title: "Executive Networking Breakfast", category: "Professional", description: "Monthly breakfast with C-level executives and industry leaders.", commitment: "1 hr/month", teamSize: "50-100 members", rating: 4.9, meetingDay: "Monthly", skills: ["Networking", "Professional Development"], why: "Unmatched networking opportunities." },
  { title: "Business Ethics & Compliance Club", category: "Professional", description: "Study corporate ethics, compliance, and corporate governance.", commitment: "2 hrs/week", teamSize: "15-25 members", rating: 4.6, meetingDay: "Tuesdays", skills: ["Ethics", "Compliance", "Governance"], why: "Essential for corporate careers." },
  { title: "Corporate Innovation Lab", category: "Professional", description: "Develop innovation strategies for large corporations.", commitment: "4 hrs/week", teamSize: "15-30 members", rating: 4.8, meetingDay: "Flexible", skills: ["Innovation", "Strategy", "Entrepreneurship"], why: "Bridge between corporate and startup thinking." },

  // Leadership (25)
  { title: "Volunteer Tutoring Corps", category: "Community", description: "Tutor local high school students in STEM subjects.", commitment: "2 hrs/week", teamSize: "20-40 members", rating: 4.7, meetingDay: "Saturdays", skills: ["Communication", "Mentorship", "Patience"], why: "Strengthens your own knowledge while giving back." },
  { title: "Community Service Steering Committee", category: "Leadership", description: "Lead community service initiatives and volunteer programs.", commitment: "4 hrs/week", teamSize: "10-20 members", rating: 4.8, meetingDay: "Mondays", skills: ["Leadership", "Organization", "Community"], why: "Direct leadership in social impact." },
  { title: "Class President", category: "Leadership", description: "Lead your class with events, decisions, and representation.", commitment: "3 hrs/week", teamSize: "300-500 members", rating: 4.7, meetingDay: "Flexible", skills: ["Leadership", "Communication", "Organization"], why: "Most prestigious student leadership role." },
  { title: "Resident Advisor (RA)", category: "Leadership", description: "Lead residential community with mentoring and programming.", commitment: "10 hrs/week", teamSize: "30-50 members", rating: 4.8, meetingDay: "Flexible", skills: ["Leadership", "Mentorship", "Community Building"], why: "Paid position with residential leadership." },
  { title: "Orientation Leader", category: "Leadership", description: "Welcome new students and lead first-year orientation.", commitment: "6 hrs/week", teamSize: "30-60 leaders", rating: 4.7, meetingDay: "Summer/Fall", skills: ["Leadership", "Communication", "Mentorship"], why: "Shape first impressions for new students." },
  { title: "Dean's Student Leadership Council", category: "Leadership", description: "Direct advisory role to deans on student issues.", commitment: "3 hrs/week", teamSize: "12-25 members", rating: 4.9, meetingDay: "Tuesdays", skills: ["Leadership", "Advocacy", "Strategy"], why: "Highest advisory position for students." },
  { title: "Campus Safe Ride Coordinator", category: "Leadership", description: "Manage safe ride programs and volunteer drivers.", commitment: "4 hrs/week", teamSize: "20-40 drivers", rating: 4.8, meetingDay: "Flexible", skills: ["Organization", "Safety", "Coordination"], why: "Directly impacts campus safety." },
  { title: "Student Ambassador Program", category: "Leadership", description: "Represent campus at recruitment events and school visits.", commitment: "3 hrs/week", teamSize: "20-40 ambassadors", rating: 4.6, meetingDay: "Flexible", skills: ["Communication", "Representation", "Networking"], why: "Face of the institution." },
  { title: "Peer Mentoring Program", category: "Leadership", description: "Mentor first-year students through transition to college.", commitment: "2 hrs/week", teamSize: "30-60 mentors", rating: 4.7, meetingDay: "Flexible", skills: ["Mentorship", "Communication", "Support"], why: "Meaningful impact on new student success." },
  { title: "Cultural Affinity Group President", category: "Leadership", description: "Lead cultural community celebrations and advocacy.", commitment: "5 hrs/week", teamSize: "30-80 members", rating: 4.8, meetingDay: "Flexible", skills: ["Leadership", "Cultural Awareness", "Advocacy"], why: "Build inclusive campus community." },
  { title: "Sports Club President", category: "Leadership", description: "Lead student-run sports club with officers and members.", commitment: "5 hrs/week", teamSize: "20-100 members", rating: 4.7, meetingDay: "Flexible", skills: ["Leadership", "Sports Management", "Organization"], why: "Leadership in athletic community." },
  { title: "Greek Life Officer", category: "Leadership", description: "Lead Greek letter organization with chapter responsibilities.", commitment: "8 hrs/week", teamSize: "50-150 members", rating: 4.6, meetingDay: "Flexible", skills: ["Leadership", "Community", "Organization"], why: "Significant leadership in brotherhood/sisterhood." },
  { title: "Student Media Director", category: "Leadership", description: "Lead student newspaper, magazine, or broadcast media.", commitment: "8 hrs/week", teamSize: "20-50 members", rating: 4.8, meetingDay: "Flexible", skills: ["Leadership", "Journalism", "Communication"], why: "Guide campus media and student voice." },
  { title: "Accessibility & Disability Services Peer Advocate", category: "Leadership", description: "Advocate for students with disabilities and lead accessibility initiatives.", commitment: "3 hrs/week", teamSize: "10-20 advocates", rating: 4.9, meetingDay: "Flexible", skills: ["Advocacy", "Leadership", "Accessibility"], why: "Champion inclusive campus environment." },
  { title: "International Student Mentor", category: "Leadership", description: "Guide international students in campus adjustment.", commitment: "2 hrs/week", teamSize: "20-40 mentors", rating: 4.7, meetingDay: "Flexible", skills: ["Mentorship", "Communication", "Cultural Awareness"], why: "Support global student community." },
  { title: "Academic Success Coach", category: "Leadership", description: "Coach peers on study skills, time management, and academics.", commitment: "2 hrs/week", teamSize: "15-30 coaches", rating: 4.8, meetingDay: "Flexible", skills: ["Coaching", "Mentorship", "Teaching"], why: "Direct impact on peer academic success." },
  { title: "Career Services Student Ambassador", category: "Leadership", description: "Promote career services and help peers with job search.", commitment: "2 hrs/week", teamSize: "10-20 ambassadors", rating: 4.7, meetingDay: "Flexible", skills: ["Career Guidance", "Mentorship", "Networking"], why: "Guide peers in career exploration." },
  { title: "Environmental Sustainability Leader", category: "Leadership", description: "Spearhead campus sustainability and green initiatives.", commitment: "3 hrs/week", teamSize: "15-30 members", rating: 4.8, meetingDay: "Wednesdays", skills: ["Leadership", "Sustainability", "Advocacy"], why: "Lead environmental change on campus." },
  { title: "Mental Health Awareness Advocate", category: "Leadership", description: "Champion mental health awareness and peer support programs.", commitment: "3 hrs/week", teamSize: "20-40 members", rating: 4.9, meetingDay: "Flexible", skills: ["Advocacy", "Mental Health", "Community"], why: "Vital role in student wellbeing." },
  { title: "Diversity & Inclusion Officer", category: "Leadership", description: "Lead diversity initiatives and inclusive programming.", commitment: "4 hrs/week", teamSize: "20-40 members", rating: 4.8, meetingDay: "Flexible", skills: ["Leadership", "Diversity", "Advocacy"], why: "Build equitable campus culture." },

  // Community (30)
  { title: "Habitat for Humanity", category: "Community", description: "Build homes for families in need in your local community.", commitment: "3 hrs/week", teamSize: "40-80 members", rating: 4.8, meetingDay: "Saturdays", skills: ["Construction", "Teamwork", "Community Service"], why: "Direct impact on housing for vulnerable families." },
  { title: "Local Food Bank Volunteer", category: "Community", description: "Sort, pack, and distribute food to low-income families.", commitment: "2 hrs/week", teamSize: "50-100 members", rating: 4.6, meetingDay: "Sundays", skills: ["Organization", "Teamwork", "Compassion"], why: "Address food insecurity in your community." },
  { title: "Big Brothers Big Sisters Mentoring", category: "Community", description: "Mentor at-risk youth one-on-one for positive growth.", commitment: "4 hrs/week", teamSize: "30-60 mentors", rating: 4.9, meetingDay: "Flexible", skills: ["Mentorship", "Compassion", "Patience"], why: "Transform lives of vulnerable youth." },
  { title: "Crisis Hotline Counselor", category: "Community", description: "Provide peer support to people in emotional crisis.", commitment: "4 hrs/week", teamSize: "20-50 counselors", rating: 4.9, meetingDay: "Evening", skills: ["Listening", "Crisis Support", "Compassion"], why: "Life-saving peer mental health support." },
  { title: "Animal Shelter Volunteer", category: "Community", description: "Care for animals and assist with adoptions.", commitment: "2 hrs/week", teamSize: "40-80 volunteers", rating: 4.7, meetingDay: "Weekends", skills: ["Animal Care", "Compassion", "Communication"], why: "Help find homes for animals in need." },
  { title: "Environmental Cleanup Initiative", category: "Community", description: "Organize and participate in local environmental restoration.", commitment: "2 hrs/week", teamSize: "30-60 members", rating: 4.6, meetingDay: "Saturdays", skills: ["Environmental Stewardship", "Teamwork", "Leadership"], why: "Direct environmental impact." },
  { title: "Hospital Patient Advocate", category: "Community", description: "Support hospitalized patients and their families.", commitment: "3 hrs/week", teamSize: "20-40 volunteers", rating: 4.8, meetingDay: "Flexible", skills: ["Compassion", "Communication", "Support"], why: "Improve hospital experiences for patients." },
  { title: "Elderly Community Center Assistant", category: "Community", description: "Provide companionship and assistance to seniors.", commitment: "2 hrs/week", teamSize: "25-50 volunteers", rating: 4.7, meetingDay: "Flexible", skills: ["Compassion", "Patience", "Communication"], why: "Combat elderly isolation and loneliness." },
  { title: "Elementary School Science Outreach", category: "Community", description: "Lead science activities for elementary students.", commitment: "2 hrs/week", teamSize: "20-40 volunteers", rating: 4.7, meetingDay: "Saturdays", skills: ["Science", "Teaching", "Communication"], why: "Inspire young students in STEM." },
  { title: "Homeless Services Volunteer", category: "Community", description: "Provide meals, clothing, and support to homeless individuals.", commitment: "3 hrs/week", teamSize: "40-80 volunteers", rating: 4.8, meetingDay: "Flexible", skills: ["Compassion", "Service", "Teamwork"], why: "Direct assistance to homeless community." },
  { title: "Literacy Program Tutor", category: "Community", description: "Teach adult literacy and basic education skills.", commitment: "2 hrs/week", teamSize: "20-40 tutors", rating: 4.7, meetingDay: "Evenings", skills: ["Teaching", "Patience", "Education"], why: "Empower adults through education." },
  { title: "Disaster Relief Volunteer", category: "Community", description: "Respond to natural disasters with immediate aid.", commitment: "Variable", teamSize: "Variable", rating: 4.9, meetingDay: "As needed", skills: ["Crisis Response", "Teamwork", "Resilience"], why: "Help communities recover from disasters." },
  { title: "Youth Sports Coach", category: "Community", description: "Coach youth sports and teach athletic fundamentals.", commitment: "3 hrs/week", teamSize: "20-50 coaches", rating: 4.8, meetingDay: "Weekends", skills: ["Coaching", "Sports", "Mentorship"], why: "Develop young athletes and character." },
  { title: "Afterschool Mentoring Program", category: "Community", description: "Provide homework help and mentoring to disadvantaged youth.", commitment: "3 hrs/week", teamSize: "30-60 mentors", rating: 4.8, meetingDay: "Weekday Afternoons", skills: ["Mentorship", "Teaching", "Support"], why: "Critical academic support for at-risk youth." },
  { title: "Park Restoration Project", category: "Community", description: "Maintain and restore local parks and green spaces.", commitment: "2 hrs/week", teamSize: "30-60 volunteers", rating: 4.6, meetingDay: "Saturdays", skills: ["Environmental Stewardship", "Teamwork", "Landscaping"], why: "Improve community quality of life." },
  { title: "Community Garden Organizer", category: "Community", description: "Organize and maintain community gardens for food access.", commitment: "2 hrs/week", teamSize: "25-50 members", rating: 4.7, meetingDay: "Flexible", skills: ["Gardening", "Organization", "Community"], why: "Promote food security and sustainability." },
  { title: "Free Legal Clinic Volunteer", category: "Community", description: "Assist with free legal aid for low-income families.", commitment: "2 hrs/week", teamSize: "15-30 volunteers", rating: 4.7, meetingDay: "Evenings", skills: ["Legal Research", "Communication", "Service"], why: "Expand access to legal justice." },
  { title: "Refugee Integration Mentor", category: "Community", description: "Help refugee families integrate into community.", commitment: "3 hrs/week", teamSize: "20-40 mentors", rating: 4.9, meetingDay: "Flexible", skills: ["Cultural Awareness", "Mentorship", "Compassion"], why: "Welcome vulnerable new community members." },
  { title: "School Supply Drive Organizer", category: "Community", description: "Organize drives to provide school supplies to students in need.", commitment: "Variable", teamSize: "50-100 volunteers", rating: 4.6, meetingDay: "Flexible", skills: ["Organization", "Leadership", "Community"], why: "Remove barriers to education access." },
  { title: "Mental Health Peer Support Group", category: "Community", description: "Facilitate peer support for mental health and wellness.", commitment: "2 hrs/week", teamSize: "10-20 members", rating: 4.8, meetingDay: "Flexible", skills: ["Peer Support", "Active Listening", "Compassion"], why: "Create safe space for mental health." },
  { title: "Community Health Clinic Assistant", category: "Community", description: "Assist with free community health screenings and education.", commitment: "2 hrs/week", teamSize: "20-40 volunteers", rating: 4.7, meetingDay: "Saturdays", skills: ["Healthcare", "Community Outreach", "Compassion"], why: "Improve health equity in community." },
  { title: "Job Training Workshop Mentor", category: "Community", description: "Coach unemployed adults in job search and interview skills.", commitment: "2 hrs/week", teamSize: "15-30 mentors", rating: 4.7, meetingDay: "Evenings", skills: ["Career Coaching", "Communication", "Mentorship"], why: "Help adults gain employment." },
  { title: "Prison Pen Pal Program", category: "Community", description: "Provide correspondence and support to incarcerated individuals.", commitment: "1 hr/week", teamSize: "20-40 participants", rating: 4.6, meetingDay: "Flexible", skills: ["Communication", "Compassion", "Perspective"], why: "Maintain human connection for incarcerated." },
  { title: "Community Art Center Volunteer", category: "Community", description: "Assist with art programs in underserved neighborhoods.", commitment: "2 hrs/week", teamSize: "20-40 volunteers", rating: 4.7, meetingDay: "Flexible", skills: ["Art", "Community Outreach", "Creativity"], why: "Bring art access to all communities." },
  { title: "Disability Services Peer Mentor", category: "Community", description: "Support people with disabilities in community integration.", commitment: "2 hrs/week", teamSize: "15-30 mentors", rating: 4.8, meetingDay: "Flexible", skills: ["Accessibility", "Mentorship", "Compassion"], why: "Champion disability inclusion." },

  // Arts (30)
  { title: "Photography & Media Society", category: "Arts", description: "Document campus life, learn editing, and build a creative portfolio.", commitment: "2-3 hrs/week", teamSize: "25-50 members", rating: 4.5, meetingDay: "Fridays", skills: ["Creativity", "Visual Storytelling", "Design"], why: "Great creative outlet to balance academic stress." },
  { title: "Theater & Performing Arts Club", category: "Arts", description: "Act, direct, and produce theatrical productions.", commitment: "5-8 hrs/week", teamSize: "30-80 members", rating: 4.8, meetingDay: "Flexible", skills: ["Acting", "Creativity", "Performance"], why: "Express yourself through dramatic arts." },
  { title: "Student Film Festival", category: "Arts", description: "Create, edit, and showcase short films.", commitment: "4 hrs/week", teamSize: "20-40 members", rating: 4.7, meetingDay: "Flexible", skills: ["Filmmaking", "Editing", "Storytelling"], why: "Perfect for aspiring filmmakers." },
  { title: "Creative Writing Club", category: "Arts", description: "Share and critique original fiction, poetry, and essays.", commitment: "2 hrs/week", teamSize: "15-35 members", rating: 4.6, meetingDay: "Thursdays", skills: ["Writing", "Creativity", "Feedback"], why: "Develop writing voice and craft." },
  { title: "Musical Theater Production", category: "Arts", description: "Sing, dance, and act in full-scale musical productions.", commitment: "8-10 hrs/week", teamSize: "50-150 members", rating: 4.9, meetingDay: "Flexible", skills: ["Singing", "Acting", "Dancing"], why: "Combine music, theater, and dance." },
  { title: "Improv & Comedy Club", category: "Arts", description: "Learn improvisation and perform at comedy shows.", commitment: "3 hrs/week", teamSize: "20-50 members", rating: 4.7, meetingDay: "Tuesdays & Thursdays", skills: ["Humor", "Creativity", "Performance"], why: "Build confidence through comedy." },
  { title: "Jazz Ensemble", category: "Arts", description: "Play jazz music and perform at campus events.", commitment: "3-4 hrs/week", teamSize: "10-20 musicians", rating: 4.8, meetingDay: "Tuesdays & Thursdays", skills: ["Music", "Jazz", "Collaboration"], why: "Perfect for jazz enthusiasts." },
  { title: "String Quartet", category: "Arts", description: "Perform chamber music with strings.", commitment: "3 hrs/week", teamSize: "4-8 members", rating: 4.8, meetingDay: "Mondays & Thursdays", skills: ["Music", "Strings", "Precision"], why: "Refined classical music experience." },
  { title: "A Cappella Singing Group", category: "Arts", description: "Sing in harmony without instruments.", commitment: "4 hrs/week", teamSize: "15-30 singers", rating: 4.8, meetingDay: "Tuesdays & Thursdays", skills: ["Singing", "Harmony", "Performance"], why: "Showcase vocal talents." },
  { title: "Rock Band", category: "Arts", description: "Play rock music with drums, guitar, bass, and vocals.", commitment: "4 hrs/week", teamSize: "4-6 members", rating: 4.7, meetingDay: "Flexible", skills: ["Instruments", "Rock Music", "Collaboration"], why: "Electric music and stage performance." },
  { title: "Hip Hop Dance Crew", category: "Arts", description: "Learn and perform hip hop choreography.", commitment: "3 hrs/week", teamSize: "15-30 dancers", rating: 4.8, meetingDay: "Mondays & Fridays", skills: ["Dance", "Hip Hop", "Performance"], why: "Modern urban dance expression." },
  { title: "Ballet Company", category: "Arts", description: "Study and perform classical ballet.", commitment: "6-8 hrs/week", teamSize: "20-40 dancers", rating: 4.9, meetingDay: "Flexible", skills: ["Ballet", "Grace", "Discipline"], why: "Master classical dance technique." },
  { title: "Visual Art Studio", category: "Arts", description: "Paint, draw, and sculpt in open studio setting.", commitment: "4 hrs/week", teamSize: "20-40 artists", rating: 4.7, meetingDay: "Saturdays", skills: ["Painting", "Drawing", "Sculpture"], why: "Develop visual art portfolio." },
  { title: "Digital Art & Design Studio", category: "Arts", description: "Create digital art, graphics, and design projects.", commitment: "3 hrs/week", teamSize: "20-40 members", rating: 4.7, meetingDay: "Thursdays", skills: ["Digital Design", "Software", "Creativity"], why: "Master modern digital art tools." },
  { title: "Ceramics & Pottery Club", category: "Arts", description: "Learn pottery wheel and hand-building techniques.", commitment: "3 hrs/week", teamSize: "15-30 members", rating: 4.6, meetingDay: "Tuesdays", skills: ["Pottery", "Craftsmanship", "Creativity"], why: "Create functional and artistic ceramics." },
  { title: "Photography Competition Team", category: "Arts", description: "Compete in national photography competitions.", commitment: "4 hrs/week", teamSize: "10-20 members", rating: 4.8, meetingDay: "Flexible", skills: ["Photography", "Competition", "Technical Skills"], why: "Showcase photography at highest level." },
  { title: "Graphic Design Club", category: "Arts", description: "Design logos, posters, websites, and branding.", commitment: "3 hrs/week", teamSize: "20-40 members", rating: 4.7, meetingDay: "Wednesdays", skills: ["Graphic Design", "Branding", "Software"], why: "Build professional design portfolio." },
  { title: "Fashion Design & Styling Club", category: "Arts", description: "Design clothes, host fashion shows, and learn styling.", commitment: "3 hrs/week", teamSize: "20-40 members", rating: 4.6, meetingDay: "Fridays", skills: ["Fashion Design", "Styling", "Creativity"], why: "Express yourself through fashion." },
  { title: "Sculpture & Installation Art", category: "Arts", description: "Create large-scale sculptures and installations.", commitment: "4 hrs/week", teamSize: "15-25 members", rating: 4.7, meetingDay: "Saturdays", skills: ["Sculpture", "Spatial Design", "Craftsmanship"], why: "Create impactful public art." },
  { title: "Comic Book & Graphic Novel Club", category: "Arts", description: "Create and share comic books and graphic novels.", commitment: "2 hrs/week", teamSize: "15-30 members", rating: 4.6, meetingDay: "Thursdays", skills: ["Comic Art", "Storytelling", "Drawing"], why: "Combine art and narrative." },
  { title: "Poetry Slam", category: "Arts", description: "Write and perform spoken word poetry.", commitment: "2 hrs/week", teamSize: "20-40 members", rating: 4.7, meetingDay: "Tuesdays", skills: ["Poetry", "Performance", "Expression"], why: "Powerful personal expression through poetry." },
  { title: "Mural & Street Art Initiative", category: "Arts", description: "Create public art murals in the community.", commitment: "3 hrs/week", teamSize: "20-40 members", rating: 4.8, meetingDay: "Saturdays", skills: ["Street Art", "Community Engagement", "Design"], why: "Transform communities with public art." },
  { title: "Animation Studio", category: "Arts", description: "Learn 2D and 3D animation techniques.", commitment: "4 hrs/week", teamSize: "15-30 members", rating: 4.8, meetingDay: "Flexible", skills: ["Animation", "Software", "Storytelling"], why: "Master modern animation." },
  { title: "Documentary Film Society", category: "Arts", description: "Create and screen documentary films.", commitment: "3 hrs/week", teamSize: "15-30 members", rating: 4.7, meetingDay: "Fridays", skills: ["Documentary", "Filmmaking", "Storytelling"], why: "Tell important stories through film." },
  { title: "Music Production Club", category: "Arts", description: "Learn music production, mixing, and beat-making.", commitment: "3 hrs/week", teamSize: "20-40 members", rating: 4.8, meetingDay: "Tuesdays", skills: ["Music Production", "Software", "Audio"], why: "Produce professional-quality music." },

  // Sports (40)
  { title: "Varsity Soccer", category: "Sports", description: "Compete in collegiate soccer with top-tier athletes.", commitment: "15 hrs/week", teamSize: "25-35 members", rating: 4.9, meetingDay: "Daily", skills: ["Soccer", "Athleticism", "Teamwork"], why: "Elite athletic competition." },
  { title: "Club Volleyball", category: "Sports", description: "Competitive club volleyball without NCAA commitment.", commitment: "8-10 hrs/week", teamSize: "15-20 members", rating: 4.7, meetingDay: "3x/week", skills: ["Volleyball", "Teamwork", "Athleticism"], why: "Competitive volleyball without varsity demands." },
  { title: "Ultimate Frisbee Club", category: "Sports", description: "Play competitive ultimate frisbee tournaments.", commitment: "4-6 hrs/week", teamSize: "20-30 members", rating: 4.6, meetingDay: "Tuesdays & Thursdays", skills: ["Ultimate", "Athleticism", "Strategy"], why: "Growing competitive sport." },
  { title: "Rock Climbing Club", category: "Sports", description: "Indoor and outdoor rock climbing expeditions.", commitment: "3-4 hrs/week", teamSize: "20-40 members", rating: 4.7, meetingDay: "Weekends", skills: ["Climbing", "Problem Solving", "Strength"], why: "Adventure and physical challenge." },
  { title: "Marathons & Running Club", category: "Sports", description: "Train and run marathons with community support.", commitment: "4-6 hrs/week", teamSize: "30-60 members", rating: 4.8, meetingDay: "Flexible", skills: ["Running", "Endurance", "Discipline"], why: "Build running endurance and community." },
  { title: "Cycling Club", category: "Sports", description: "Road cycling and mountain biking adventures.", commitment: "4 hrs/week", teamSize: "25-50 members", rating: 4.7, meetingDay: "Weekends", skills: ["Cycling", "Endurance", "Bike Maintenance"], why: "Explore outdoors by bike." },
  { title: "Club Swimming", category: "Sports", description: "Competitive club swimming without NCAA constraints.", commitment: "8 hrs/week", teamSize: "15-25 members", rating: 4.7, meetingDay: "3x/week", skills: ["Swimming", "Technique", "Endurance"], why: "Competitive swimming community." },
  { title: "Martial Arts Society", category: "Sports", description: "Learn karate, taekwondo, kung fu, or judo.", commitment: "3-4 hrs/week", teamSize: "20-40 members", rating: 4.8, meetingDay: "2x/week", skills: ["Martial Arts", "Discipline", "Self Defense"], why: "Master martial arts techniques." },
  { title: "Rowing Club", category: "Sports", description: "Compete in rowing with team racing events.", commitment: "10-12 hrs/week", teamSize: "20-40 members", rating: 4.9, meetingDay: "Daily", skills: ["Rowing", "Teamwork", "Water Skills"], why: "Elite rowing competition." },
  { title: "Tennis Club", category: "Sports", description: "Competitive tennis with singles and doubles play.", commitment: "4-6 hrs/week", teamSize: "20-30 members", rating: 4.6, meetingDay: "3x/week", skills: ["Tennis", "Athleticism", "Strategy"], why: "Competitive individual and team sport." },
  { title: "Basketball Intramural League", category: "Sports", description: "Recreational basketball games and tournaments.", commitment: "3-4 hrs/week", teamSize: "Team varies", rating: 4.5, meetingDay: "Flexible", skills: ["Basketball", "Teamwork", "Athleticism"], why: "Casual competitive basketball." },
  { title: "Cricket Club", category: "Sports", description: "Competitive cricket with matches and tournaments.", commitment: "6-8 hrs/week", teamSize: "15-25 members", rating: 4.7, meetingDay: "Weekends", skills: ["Cricket", "Teamwork", "Athleticism"], why: "Popular international sport." },
  { title: "Rugby Club", category: "Sports", description: "Competitive rugby with scrums and tackles.", commitment: "6-8 hrs/week", teamSize: "20-30 members", rating: 4.8, meetingDay: "3x/week", skills: ["Rugby", "Strength", "Teamwork"], why: "High-intensity contact sport." },
  { title: "Badminton Club", category: "Sports", description: "Play competitive badminton matches.", commitment: "3 hrs/week", teamSize: "15-30 members", rating: 4.6, meetingDay: "2x/week", skills: ["Badminton", "Hand-Eye Coordination", "Agility"], why: "Fast-paced racket sport." },
  { title: "Squash Club", category: "Sports", description: "Competitive squash with professional coaching.", commitment: "3-4 hrs/week", teamSize: "15-25 members", rating: 4.7, meetingDay: "2x/week", skills: ["Squash", "Agility", "Endurance"], why: "Elite racket sport." },
  { title: "Bowling Team", category: "Sports", description: "Competitive bowling league and tournaments.", commitment: "2-3 hrs/week", teamSize: "8-15 members", rating: 4.5, meetingDay: "Fridays", skills: ["Bowling", "Precision", "Teamwork"], why: "Social competitive sport." },
  { title: "Hockey Club", category: "Sports", description: "Ice hockey with competitive matches.", commitment: "8-10 hrs/week", teamSize: "20-30 members", rating: 4.8, meetingDay: "3x/week", skills: ["Ice Hockey", "Athleticism", "Teamwork"], why: "Fast-paced ice sport." },
  { title: "Skiing & Snowboarding Club", category: "Sports", description: "Winter sports trips and slope adventures.", commitment: "Variable", teamSize: "30-60 members", rating: 4.7, meetingDay: "Winter weekends", skills: ["Skiing", "Snowboarding", "Risk Management"], why: "Winter adventure and athleticism." },
  { title: "Lacrosse Club", category: "Sports", description: "Competitive lacrosse with matches and tournaments.", commitment: "6-8 hrs/week", teamSize: "20-30 members", rating: 4.8, meetingDay: "3x/week", skills: ["Lacrosse", "Agility", "Teamwork"], why: "High-speed ball sport." },
  { title: "Field Hockey Club", category: "Sports", description: "Competitive field hockey games.", commitment: "6 hrs/week", teamSize: "15-20 members", rating: 4.6, meetingDay: "2x/week", skills: ["Field Hockey", "Strategy", "Teamwork"], why: "Strategic field sport." },
  { title: "Water Polo Club", category: "Sports", description: "Competitive water polo with intense matches.", commitment: "6-8 hrs/week", teamSize: "12-20 members", rating: 4.8, meetingDay: "3x/week", skills: ["Water Polo", "Swimming", "Athleticism"], why: "Intense pool sport." },
  { title: "Fencing Club", category: "Sports", description: "Competitive fencing in foil, épée, and sabre.", commitment: "4-6 hrs/week", teamSize: "15-30 members", rating: 4.8, meetingDay: "2x/week", skills: ["Fencing", "Strategy", "Precision"], why: "Elegant combat sport." },
  { title: "Archery Club", category: "Sports", description: "Target archery and competitive tournaments.", commitment: "3 hrs/week", teamSize: "15-25 members", rating: 4.7, meetingDay: "Weekends", skills: ["Archery", "Precision", "Focus"], why: "Precision ancient sport." },
  { title: "Equestrian Club", category: "Sports", description: "Horseback riding and show jumping events.", commitment: "6-8 hrs/week", teamSize: "15-25 members", rating: 4.8, meetingDay: "Flexible", skills: ["Horseback Riding", "Equine Care", "Athleticism"], why: "Elite equestrian sport." },
  { title: "Golf Club", category: "Sports", description: "Competitive golf tournaments and practice.", commitment: "4-5 hrs/week", teamSize: "20-35 members", rating: 4.6, meetingDay: "Weekends", skills: ["Golf", "Precision", "Patience"], why: "Gentleman's sport." },
  { title: "Volleyball Intramural", category: "Sports", description: "Recreational volleyball league.", commitment: "2 hrs/week", teamSize: "Team varies", rating: 4.5, meetingDay: "Flexible", skills: ["Volleyball", "Teamwork", "Athleticism"], why: "Casual volleyball fun." },
  { title: "Racquetball Club", category: "Sports", description: "Competitive racquetball matches.", commitment: "3 hrs/week", teamSize: "10-20 members", rating: 4.6, meetingDay: "2x/week", skills: ["Racquetball", "Agility", "Hand-Eye Coordination"], why: "Fast indoor racket sport." },
  { title: "Gymnastics Club", category: "Sports", description: "Acrobatics, tumbling, and artistic gymnastics.", commitment: "5-6 hrs/week", teamSize: "15-25 members", rating: 4.8, meetingDay: "3x/week", skills: ["Gymnastics", "Strength", "Flexibility"], why: "Elite acrobatic sport." },
  { title: "Parkour Club", category: "Sports", description: "Learn parkour, free-running, and urban exploration.", commitment: "3 hrs/week", teamSize: "20-40 members", rating: 4.7, meetingDay: "Weekends", skills: ["Parkour", "Athleticism", "Creativity"], why: "Urban athletic expression." },
  { title: "Ballroom Dance Club", category: "Sports", description: "Learn and compete in ballroom dancing.", commitment: "3-4 hrs/week", teamSize: "20-40 members", rating: 4.7, meetingDay: "2x/week", skills: ["Ballroom Dance", "Coordination", "Elegance"], why: "Graceful competitive dancing." },
  { title: "American Football Intramural", category: "Sports", description: "Recreational American football leagues.", commitment: "3-4 hrs/week", teamSize: "20-30 members", rating: 4.6, meetingDay: "Flexible", skills: ["Football", "Strategy", "Teamwork"], why: "Casual competitive football." },
]

// Major-specific EC suggestions - now functional keywords
const MAJOR_SUGGESTIONS = {
  "Computer Science": ["Competition", "AI/ML", "Startup", "Open Source"],
  "Software Engineering": ["Full-stack", "DevOps", "Mobile", "Backend"],
  "Data Science": ["Machine Learning", "Analytics", "Data Analysis", "Kaggle"],
  "Cybersecurity": ["Hacking", "Security", "Network", "CTF"],
  "Business Administration": ["Consulting", "Business", "Strategy", "Leadership"],
  "Finance": ["Investment", "Trading", "Financial", "Banking"],
  "Marketing": ["Marketing", "Digital", "Brand", "Analytics"],
  "Accounting": ["Accounting", "Finance", "CPA", "Audit"],
  "Economics": ["Economics", "Market", "Trading", "Analysis"],
  "Psychology": ["Research", "Counseling", "Behavior", "Mental Health"],
  "Sociology": ["Research", "Community", "Social", "Culture"],
  "Political Science": ["Model UN", "Policy", "Government", "Debate"],
  "International Relations": ["Model UN", "Global", "International", "Travel"],
  "Biology": ["Research", "Lab", "Medical", "Environmental"],
  "Chemistry": ["Lab", "Research", "Chemistry", "Experiment"],
  "Physics": ["Physics", "Research", "Robotics", "Engineering"],
  "Environmental Science": ["Environmental", "Conservation", "Sustainability", "Climate"],
  "Neuroscience": ["Research", "Brain", "Medical", "Lab"],
  "Mechanical Engineering": ["Robotics", "CAD", "Engineering", "Design"],
  "Electrical Engineering": ["Circuit", "Electronics", "Robotics", "Engineering"],
  "Civil Engineering": ["Engineering", "Infrastructure", "Sustainability", "Design"],
  "Biomedical Engineering": ["Medical", "Engineering", "Robotics", "Design"],
  "Pre-Med": ["Research", "Hospital", "Medical", "Healthcare"],
  "Nursing": ["Healthcare", "Hospital", "Clinical", "Medical"],
  "Public Health": ["Health", "Community", "Research", "Policy"],
  "Pharmacy": ["Healthcare", "Medical", "Research", "Lab"],
  "English Literature": ["Writing", "Literature", "Creative", "Journal"],
  "Journalism": ["Journalism", "Writing", "Media", "Publication"],
  "Communications": ["Communications", "Media", "Public Speaking", "Leadership"],
  "Media Studies": ["Film", "Media", "Production", "Creative"],
  "Art & Design": ["Design", "Art", "Creative", "Exhibition"],
  "Architecture": ["Design", "Architecture", "CAD", "Urban"],
  "Film & Media": ["Film", "Video", "Production", "Creative"],
  "Music": ["Music", "Performance", "Ensemble", "Production"],
  "History": ["Research", "History", "Museum", "Culture"],
  "Philosophy": ["Philosophy", "Ethics", "Discussion", "Debate"],
  "Anthropology": ["Research", "Culture", "Anthropology", "Field"],
  "Religious Studies": ["Religion", "Culture", "Ethics", "Discussion"],
  "Mathematics": ["Math", "Competition", "Research", "Tutoring"],
  "Statistics": ["Statistics", "Data", "Analysis", "Research"],
  "Actuarial Science": ["Actuarial", "Math", "Finance", "Statistics"],
  "Education": ["Teaching", "Tutoring", "Education", "Leadership"],
  "Social Work": ["Community", "Social", "Advocacy", "Service"],
  "Criminal Justice": ["Law", "Policy", "Justice", "Research"],
  "Undecided / Exploring": ["Leadership", "Community", "Research", "Internship"]
}

export default function Extracurriculars({ userProfile, addCalendarEvent, calendarEvents }) {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [addedIds, setAddedIds] = useState(new Set())
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedEC, setSelectedEC] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [autofillSuggestions, setAutofillSuggestions] = useState([])
  const [showAutofill, setShowAutofill] = useState(false)

  const userMajor = userProfile?.major || 'Computer Science'
  const majorSuggestions = MAJOR_SUGGESTIONS[userMajor] || MAJOR_SUGGESTIONS['Undecided / Exploring']

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.trim()) {
        const filtered = ALL_EXTRACURRICULARS.filter(ec => {
          const titleMatch = ec.title.toLowerCase().includes(searchQuery.toLowerCase())
          const descMatch = ec.description.toLowerCase().includes(searchQuery.toLowerCase())
          const skillsMatch = ec.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
          const catMatch = ec.category.toLowerCase().includes(searchQuery.toLowerCase())
          return titleMatch || descMatch || skillsMatch || catMatch
        })
        setResults(filtered)
        setHasSearched(true)
        setLoading(false)
      } else {
        setResults([])
        setHasSearched(false)
      }
    }, 300),
    []
  )

  // Autofill suggestions based on query
  const getAutofillSuggestions = useCallback((searchQuery) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setAutofillSuggestions([])
      setShowAutofill(false)
      return
    }

    const suggestions = ALL_EXTRACURRICULARS
      .filter(ec => ec.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5) // Limit to 5 suggestions
      .map(ec => ec.title)

    setAutofillSuggestions(suggestions)
    setShowAutofill(suggestions.length > 0)
  }, [])

  // Handle input change with real-time search and autofill
  const handleInputChange = (value) => {
    setQuery(value)
    setLoading(true)
    
    if (value.trim()) {
      getAutofillSuggestions(value)
      debouncedSearch(value)
    } else {
      setResults([])
      setHasSearched(false)
      setAutofillSuggestions([])
      setShowAutofill(false)
      setLoading(false)
    }
  }

  // Select autofill suggestion
  const selectAutofillSuggestion = (suggestion) => {
    setQuery(suggestion)
    setShowAutofill(false)
    setAutofillSuggestions([])
    
    // Trigger search for the selected suggestion
    const filtered = ALL_EXTRACURRICULARS.filter(ec => ec.title === suggestion)
    setResults(filtered)
    setHasSearched(true)
    setLoading(false)
  }

  // Debounce utility function
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  const FILTERS = ['All', 'Competition', 'Conference', 'Workshop', 'Internship', 'Service', 'Travel', 'Academic', 'Sports', 'Arts', 'Community', 'Professional', 'Leadership']
  const alreadyInCalendar = (title) => calendarEvents.some(e => e.title === title)

  const getCategoryColor = (cat) => {
    const map = { 
      Academic: '#7c6af7', 
      Sports: '#f76a6a', 
      Arts: '#f7a26a', 
      Community: '#6af7a2', 
      Professional: '#6ab8f7', 
      Leadership: '#f76af7',
      Competition: '#ff6b6b',
      Conference: '#4ecdc4',
      Workshop: '#45b7d1',
      Internship: '#96ceb4',
      Service: '#ffeaa7',
      Travel: '#dda0dd'
    }
    return map[cat] || '#7c6af7'
  }

  const handleSearch = async (customQuery) => {
    const searchQ = (customQuery || query).toLowerCase()
    setLoading(true); setHasSearched(true); setResults([]); setShowAutofill(false)
    
    // Filter ALL_EXTRACURRICULARS by search query
    const filtered = searchQ ? ALL_EXTRACURRICULARS.filter(ec => {
      const titleMatch = ec.title.toLowerCase().includes(searchQ)
      const descMatch = ec.description.toLowerCase().includes(searchQ)
      const skillsMatch = ec.skills?.some(s => s.toLowerCase().includes(searchQ))
      const catMatch = ec.category.toLowerCase().includes(searchQ)
      return titleMatch || descMatch || skillsMatch || catMatch
    }) : ALL_EXTRACURRICULARS
    
    setTimeout(() => {
      setResults(filtered)
      setLoading(false)
    }, 300)
  }

  const handleBrowseAll = () => {
    setQuery('')
    setResults(ALL_EXTRACURRICULARS)
    setHasSearched(true)
    setActiveFilter('All')
  }

  const handleAdd = (activity) => {
    if (alreadyInCalendar(activity.title)) return
    // Determine stress level based on commitment time
    let stressLevel = 'Low'
    const commitment = activity.commitment || ''
    if (commitment.includes('40 hrs') || commitment.includes('6 months') || commitment.includes('1 year')) {
      stressLevel = 'High'
    } else if (commitment.includes('20 hrs') || commitment.includes('3 months') || commitment.includes('Semester')) {
      stressLevel = 'Medium'
    }
    
    addCalendarEvent({ 
      title: activity.title, 
      category: activity.category, 
      description: activity.description, 
      commitment: activity.commitment, 
      meetingDay: activity.meetingDay, 
      color: getCategoryColor(activity.category), 
      type: 'extracurricular',
      stressLevel: stressLevel,
      frequency: activity.type === 'one-time' ? 'one-time' : 'weekly' // Default to weekly for recurring ECs
    })
    setAddedIds(prev => new Set([...prev, activity.title]))
  }

  const handleLearnMore = (ec) => {
    setSelectedEC(ec)
    setShowDetailsModal(true)
  }

  const handleVisitWebsite = (website) => {
    window.open(website, '_blank')
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
            Discover Opportunities
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500 }}>Ask AI to find activities perfectly matched to your major, goals, and interests on Tranquility.</p>
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', position: 'relative' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', zIndex: 1 }} />
              <input 
                className="input" 
                style={{ paddingLeft: '42px' }} 
                placeholder={t('explore.findECs', { major: userMajor })} 
                value={query} 
                onChange={e => handleInputChange(e.target.value)}
                onFocus={() => query && setShowAutofill(autofillSuggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowAutofill(false), 200)} // Delay to allow click on suggestions
              />
              
              {/* Autofill Suggestions Dropdown */}
              <AnimatePresence>
                {showAutofill && autofillSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      zIndex: 1000,
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}
                  >
                    {autofillSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => selectAutofillSuggestion(suggestion)}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderBottom: index < autofillSuggestions.length - 1 ? '1px solid var(--border)' : 'none',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseOver={e => e.target.style.backgroundColor = 'var(--bg2)'}
                        onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Search size={14} style={{ color: 'var(--text-dim)' }} />
                          <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{suggestion}</span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-primary" onClick={() => handleSearch()} disabled={loading}>
              {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />}
              {loading ? t('explore.finding') : t('explore.findECsButton')}
            </motion.button>
          </div>
          
          {/* Major-specific suggestion buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{t('explore.popularFor', { major: userMajor })}</span>
            {majorSuggestions.map(p => (
              <button key={p} onClick={() => { handleInputChange(p); handleSearch(p); }} style={{ padding: '5px 12px', borderRadius: '100px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'var(--font-body)' }}
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
            {filtered.map((ec, i) => <ECCard key={ec.title} ec={ec} index={i} isAdded={addedIds.has(ec.title) || alreadyInCalendar(ec.title)} onAdd={() => handleAdd(ec)} onLearnMore={() => handleLearnMore(ec)} onVisitWebsite={() => handleVisitWebsite(ec.website)} color={getCategoryColor(ec.category)} />)}
          </div>
        )}

        {!loading && !hasSearched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t('explore.readyToDiscover')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t('explore.askAI')}</p>
            <button className="btn btn-primary" onClick={() => handleInputChange(`Best ECs for ${userMajor} students`)}><Sparkles size={16} /> {t('explore.showECs')}</button>
          </motion.div>
        )}
      </motion.div>
      <ECDetailsModal
        ec={selectedEC}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onAdd={() => handleAdd(selectedEC)}
        isAdded={selectedEC ? addedIds.has(selectedEC.title) || alreadyInCalendar(selectedEC.title) : false}
        color={selectedEC ? getCategoryColor(selectedEC.category) : '#7c6af7'}
      />
    </div>
  )
}

function ECCard({ ec, index, isAdded, onAdd, onLearnMore, onVisitWebsite, color }) {
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
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLearnMore}
          className="btn btn-ghost"
          style={{ flex: 1, fontSize: '0.8rem', padding: '8px 12px' }}
        >
          {t('explore.learnMore')}
        </motion.button>
        {ec.website && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onVisitWebsite}
            className="btn btn-ghost"
            style={{ fontSize: '0.8rem', padding: '8px 12px' }}
          >
            🌐 Website
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

// Details Modal Component
function ECDetailsModal({ ec, isOpen, onClose, onAdd, isAdded, color }) {
  const { t } = useLanguage()
  if (!isOpen || !ec) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '2rem',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontFamily: 'var(--font-display)', fontWeight: 600, background: `${color}22`, color, border: `1px solid ${color}44` }}>{ec.category}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={14} fill="var(--accent2)" color="var(--accent2)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--accent2)', fontWeight: 600 }}>{ec.rating}</span>
              </div>
              {ec.type && (
                <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontFamily: 'var(--font-display)', fontWeight: 600, background: 'var(--bg3)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  {ec.type === 'one-time' ? 'One-Time Event' : ec.type === 'seasonal' ? 'Seasonal' : ec.type === 'annual' ? 'Annual' : ec.type === 'series' ? 'Series' : ec.type === 'intensive' ? 'Intensive' : ec.type === 'course' ? 'Course' : ec.type === 'semester' ? 'Semester' : ec.type === 'short' ? 'Short Program' : ec.type === 'ongoing' ? 'Ongoing' : 'Club'}
                </span>
              )}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem' }}>{ec.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>{ec.description}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '1.5rem',
              padding: '4px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="var(--text-dim)" />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t('explore.commitment')}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{ec.commitment}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="var(--text-dim)" />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t('explore.teamSize')}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{ec.teamSize}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="var(--text-dim)" />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t('explore.meetingDay')}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{ec.meetingDay}</div>
            </div>
          </div>
          {ec.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="var(--text-dim)" />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t('explore.location')}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{ec.location}</div>
              </div>
            </div>
          )}
        </div>

        {ec.prepTime && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>{t('explore.prepTime')}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>⏰ {ec.prepTime}</div>
          </div>
        )}

        {ec.date && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>{t('explore.date')}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>📅 {ec.date}</div>
          </div>
        )}

        {(ec.prizes || ec.cost || ec.stipend || ec.compensation) && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>{t('explore.compensationPrizes')}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
              {ec.prizes && `🏆 ${ec.prizes}`}
              {ec.stipend && `💰 ${ec.stipend}`}
              {ec.compensation && `💼 ${ec.compensation}`}
              {ec.cost && `💵 ${ec.cost}`}
            </div>
          </div>
        )}

        {ec.sponsors && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>{t('explore.sponsors')}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>🤝 {Array.isArray(ec.sponsors) ? ec.sponsors.join(', ') : ec.sponsors}</div>
          </div>
        )}

        {ec.why && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '12px', background: 'rgba(124,106,247,0.08)', border: '1px solid rgba(124,106,247,0.15)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.5rem' }}>✨ Why Join?</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>{ec.why}</p>
          </div>
        )}

        {ec.skills && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.5rem' }}>{t('explore.skillsGain')}</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {ec.skills.map(skill => (
                <span key={skill} className="tag" style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>{skill}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          {ec.website && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(ec.website, '_blank')}
              className="btn btn-ghost"
              style={{ fontSize: '0.9rem', padding: '10px 16px' }}
            >
              🌐 Visit Website
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAdd}
            disabled={isAdded}
            className="btn btn-primary"
            style={{ fontSize: '0.9rem', padding: '10px 16px' }}
          >
            {isAdded ? `✓ ${t('explore.addedToCalendar')}` : `+ ${t('explore.addToCalendar')}`}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}