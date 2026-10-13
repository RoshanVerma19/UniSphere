/**
 * ===================================================================
 * UNISPHERE DEMO DATA STORE
 * ===================================================================
 * NOTICE: This file contains structured demonstration and mockup data
 * for the UniSphere frontend development preview.
 *
 * In production, these objects map directly to backend API models
 * from REST/GraphQL endpoints (/api/v1/students, /api/v1/faculty, etc.).
 * No sensitive or private student records are exposed.
 * ===================================================================
 */

export const IS_DEMO_MODE = true;

// -------------------------------------------------------------
// STUDENT PROFILE & ACADEMIC DATA
// -------------------------------------------------------------
export const initialStudentData = {
  id: "STU-2026-8819",
  name: "Kartikey Patel",
  email: "kartikey.patel@unisphere.edu",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  program: "B.Tech in Artificial Intelligence & Data Science",
  department: "School of Computing & Intelligence",
  batch: "2023 - 2027",
  semester: 6,
  section: "A",
  rollNumber: "23AI089",
  advisor: "Dr. Arvind Sharma",
  
  // Academic Metrics
  cgpa: 8.94,
  targetCgpa: 9.20,
  completedCredits: 114,
  totalCredits: 160,
  rank: "4th of 128 students",
  attendanceOverall: 89.4, // percentage
  attendanceTotalClasses: 312,
  attendanceAttended: 279,
  
  // Subject-wise summary
  subjects: [
    {
      code: "AI-601",
      name: "Neural Networks & Deep Learning",
      faculty: "Dr. Arvind Sharma",
      credits: 4,
      attendance: 92.5,
      attended: 37,
      total: 40,
      internalMarks: 44, // out of 50
      midTerm: 46, // out of 50
      gradeEstimate: "A+",
      status: "Safe",
      color: "#2563eb"
    },
    {
      code: "AI-602",
      name: "Natural Language Processing",
      faculty: "Prof. Sunita Rao",
      credits: 4,
      attendance: 87.0,
      attended: 40,
      total: 46,
      internalMarks: 41,
      midTerm: 43,
      gradeEstimate: "A",
      status: "Safe",
      color: "#0d9488"
    },
    {
      code: "CS-603",
      name: "Distributed Cloud Architectures",
      faculty: "Dr. Rajesh Kothari",
      credits: 3,
      attendance: 78.5,
      attended: 29,
      total: 37,
      internalMarks: 36,
      midTerm: 39,
      gradeEstimate: "B+",
      status: "Attention Needed",
      color: "#f59e0b"
    },
    {
      code: "AI-604",
      name: "Reinforcement Learning & Robotics",
      faculty: "Dr. Arvind Sharma",
      credits: 4,
      attendance: 95.0,
      attended: 38,
      total: 40,
      internalMarks: 47,
      midTerm: 48,
      gradeEstimate: "O (Outstanding)",
      status: "Safe",
      color: "#10b981"
    },
    {
      code: "HS-605",
      name: "Engineering Ethics & AI Policy",
      faculty: "Dr. Meenakshi Iyer",
      credits: 2,
      attendance: 91.2,
      attended: 21,
      total: 23,
      internalMarks: 45,
      midTerm: 44,
      gradeEstimate: "A+",
      status: "Safe",
      color: "#14b8a6"
    }
  ],

  // Upcoming Examinations
  upcomingExams: [
    {
      id: "EX-101",
      subjectCode: "AI-601",
      subjectName: "Neural Networks & Deep Learning",
      examType: "End-Semester Theory",
      date: "2026-10-28",
      time: "09:30 AM - 12:30 PM",
      hall: "Hall 4B - Block C",
      syllabusCovered: 95,
      urgency: "High"
    },
    {
      id: "EX-102",
      subjectCode: "AI-602",
      subjectName: "Natural Language Processing",
      examType: "End-Semester Theory",
      date: "2026-10-31",
      time: "09:30 AM - 12:30 PM",
      hall: "Hall 4B - Block C",
      syllabusCovered: 88,
      urgency: "Medium"
    },
    {
      id: "EX-103",
      subjectCode: "CS-603",
      subjectName: "Distributed Cloud Architectures",
      examType: "End-Semester Theory",
      date: "2026-11-04",
      time: "02:00 PM - 05:00 PM",
      hall: "Hall 2A - Main Academic",
      syllabusCovered: 76,
      urgency: "Medium"
    }
  ],

  // Pending & Submitted Assignments
  assignments: [
    {
      id: "ASN-601",
      title: "Vision Transformer Fine-Tuning on CIFAR-100",
      subject: "Neural Networks & Deep Learning",
      subjectCode: "AI-601",
      dueDate: "Tomorrow, 11:59 PM",
      dueTimestamp: "2026-10-14T23:59:00",
      points: "50 pts",
      status: "Pending",
      priority: "Urgent",
      submissionFormat: ".zip / GitHub URL"
    },
    {
      id: "ASN-602",
      title: "RAG Pipeline implementation with Vector Store",
      subject: "Natural Language Processing",
      subjectCode: "AI-602",
      dueDate: "Oct 19, 2026",
      dueTimestamp: "2026-10-19T23:59:00",
      points: "40 pts",
      status: "In Progress",
      priority: "Normal",
      submissionFormat: "Jupyter Notebook"
    },
    {
      id: "ASN-603",
      title: "Kubernetes Cluster Scalability Benchmarking",
      subject: "Distributed Cloud Architectures",
      subjectCode: "CS-603",
      dueDate: "Oct 24, 2026",
      dueTimestamp: "2026-10-24T23:59:00",
      points: "30 pts",
      status: "Submitted",
      grade: "28/30",
      priority: "Completed",
      submissionFormat: "PDF Report"
    }
  ],

  // Today's Personalized Study Plan (AI Generated)
  todayStudyPlan: [
    {
      id: "SP-1",
      time: "04:30 PM - 05:45 PM",
      title: "ViT Self-Attention Implementation",
      subject: "Neural Networks & Deep Learning",
      reason: "High exam weightage (22%) and pending lab submission",
      completed: true
    },
    {
      id: "SP-2",
      time: "06:15 PM - 07:30 PM",
      title: "Paxos vs Raft Consensus Walkthrough",
      subject: "Distributed Cloud",
      reason: "Identified knowledge gap from quiz #3",
      completed: false
    },
    {
      id: "SP-3",
      time: "08:45 PM - 09:30 PM",
      title: "Flashcard Review: RL Q-Learning convergence bounds",
      subject: "Reinforcement Learning",
      reason: "Spaced repetition scheduled for today",
      completed: false
    }
  ],

  // Weekly Progress Metrics
  weeklyProgress: {
    studyHoursTarget: 25,
    studyHoursDone: 18.5,
    quizAverage: "91%",
    attendanceStreak: "14 days",
    tasksCompleted: 9,
    tasksTotal: 12
  },

  // Important Notifications
  notifications: [
    {
      id: "NOTIF-1",
      title: "Mid-Term Exam Moderation Results Released",
      description: "Scores for AI-601 and AI-604 are published. Review your evaluated answer scripts.",
      timestamp: "1 hour ago",
      type: "academic",
      unread: true
    },
    {
      id: "NOTIF-2",
      title: "Placement Drive: NVIDIA Campus Interview Shortlist",
      description: "Congratulations! You have been shortlisted for Round 2 of the AI Research Internship.",
      timestamp: "4 hours ago",
      type: "career",
      unread: true
    },
    {
      id: "NOTIF-3",
      title: "Library Advisory: Return Borrowed Reference Books",
      description: "Please return 'Deep Learning by Ian Goodfellow' before Oct 18.",
      timestamp: "Yesterday",
      type: "campus",
      unread: false
    }
  ],

  // Timetable (Today & Week)
  timetableToday: [
    {
      time: "09:00 - 10:15 AM",
      code: "AI-601",
      name: "Neural Networks & Deep Learning",
      hall: "Hall 302",
      faculty: "Dr. Arvind Sharma",
      isLive: false,
      isPassed: true
    },
    {
      time: "10:30 - 11:45 AM",
      code: "AI-602",
      name: "Natural Language Processing",
      hall: "Lab 4A",
      faculty: "Prof. Sunita Rao",
      isLive: true, // Currently ongoing
      isPassed: false
    },
    {
      time: "01:30 - 03:00 PM",
      code: "CS-603",
      name: "Cloud Systems Lab Session",
      hall: "Computing Lab 2",
      faculty: "Dr. Rajesh Kothari",
      isLive: false,
      isPassed: false
    },
    {
      time: "03:15 - 04:30 PM",
      code: "AI-604",
      name: "Reinforcement Learning & Robotics",
      hall: "Smart Room 108",
      faculty: "Dr. Arvind Sharma",
      isLive: false,
      isPassed: false
    }
  ]
};

// -------------------------------------------------------------
// FACULTY PROFILE & ACADEMIC MANAGEMENT DATA
// -------------------------------------------------------------
export const initialFacultyData = {
  id: "FAC-ENG-402",
  name: "Dr. Arvind Sharma",
  title: "Associate Professor & AI Lab Director",
  email: "arvind.sharma@unisphere.edu",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
  department: "Department of Artificial Intelligence & Data Science",
  cabin: "Block C, Faculty Wing #412",
  phone: "+91 (0) 11 4820 9100",
  experienceYears: 14,
  specialization: "Deep Learning, Autonomous Agents & Neuro-Symbolic AI",
  
  // High-level overview metrics
  totalClassesAssigned: 3,
  totalStudentsAssigned: 184,
  averageAttendanceAcrossClasses: 91.2,
  todayClassesTotal: 3,
  todayClassesMarked: 2,
  pendingEvaluationsCount: 28,

  // Assigned Classes
  assignedClasses: [
    {
      id: "CLS-AI-6A",
      course: "B.Tech AI & Data Science",
      semester: 6,
      section: "A",
      subjectCode: "AI-601",
      subjectName: "Neural Networks & Deep Learning",
      studentCount: 62,
      attendanceAvg: 92.5,
      room: "Hall 302",
      nextClassTime: "Today, 09:00 AM (Completed)",
      syllabusProgress: 88,
      status: "Active"
    },
    {
      id: "CLS-AI-6A-RL",
      course: "B.Tech AI & Data Science",
      semester: 6,
      section: "A",
      subjectCode: "AI-604",
      subjectName: "Reinforcement Learning & Robotics",
      studentCount: 62,
      attendanceAvg: 94.8,
      room: "Smart Room 108",
      nextClassTime: "Today, 03:15 PM",
      syllabusProgress: 82,
      status: "Active"
    },
    {
      id: "CLS-CSE-4B",
      course: "B.Tech Computer Science & Engg",
      semester: 4,
      section: "B",
      subjectCode: "CS-403",
      subjectName: "Data Structures & Algorithms in C++",
      studentCount: 60,
      attendanceAvg: 86.4,
      room: "Lecture Complex 104",
      nextClassTime: "Tomorrow, 11:30 AM",
      syllabusProgress: 75,
      status: "Active"
    }
  ],

  // Today's Faculty Schedule
  todaySchedule: [
    {
      time: "09:00 - 10:15 AM",
      classCode: "AI-601 (Sec A)",
      subject: "Neural Networks & Deep Learning",
      room: "Hall 302",
      status: "Completed",
      attendanceStatus: "Marked (58/62 Present)"
    },
    {
      time: "01:30 - 02:30 PM",
      classCode: "Academic Council",
      subject: "Syllabus Review & NBA Accreditation Meeting",
      room: "Boardroom 1",
      status: "Upcoming",
      attendanceStatus: "N/A"
    },
    {
      time: "03:15 - 04:30 PM",
      classCode: "AI-604 (Sec A)",
      subject: "Reinforcement Learning Lab & Lecture",
      room: "Smart Room 108",
      status: "Upcoming",
      attendanceStatus: "Pending Attendance"
    }
  ],

  // Announcements by Faculty
  announcements: [
    {
      id: "ANN-1",
      title: "Submission Guidelines for Vision Transformer Assignment",
      targetClass: "B.Tech AI - Sem 6A",
      date: "Oct 12, 2026",
      views: 59,
      pinned: true,
      content: "Please ensure your PyTorch code includes tensorboard loss plots and testing on unseen CIFAR-100 batches before pushing to GitHub."
    },
    {
      id: "ANN-2",
      title: "Mid-Term Answer Paper Verification Session",
      targetClass: "All Assigned Classes",
      date: "Oct 10, 2026",
      views: 142,
      pinned: false,
      content: "Students desiring scrutiny of their Mid-Term marks can meet in Cabin #412 on Wednesday between 2 PM and 4 PM."
    }
  ]
};

// -------------------------------------------------------------
// ROSTER OF STUDENTS (FOR FACULTY STUDENT DIRECTORY & ATTENDANCE)
// -------------------------------------------------------------
export const mockStudentsRoster = [
  {
    id: "STU-2026-8819",
    name: "Kartikey Patel",
    email: "kartikey.patel@unisphere.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    classId: "CLS-AI-6A",
    course: "B.Tech AI & Data Science",
    semester: 6,
    section: "A",
    rollNumber: "23AI089",
    attendancePercent: 92.5,
    attendanceToday: "Present",
    cgpa: 8.94,
    gradeCategory: "Top Performer",
    needsSupport: false,
    notes: "Consistently submits ahead of deadline. Strong grasp of backpropagation."
  },
  {
    id: "STU-2026-8820",
    name: "Aanya Sen Sharma",
    email: "aanya.sen@unisphere.edu",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    classId: "CLS-AI-6A",
    course: "B.Tech AI & Data Science",
    semester: 6,
    section: "A",
    rollNumber: "23AI090",
    attendancePercent: 95.0,
    attendanceToday: "Present",
    cgpa: 9.42,
    gradeCategory: "Top Performer",
    needsSupport: false,
    notes: "Batch topper in NLP and Neural Architectures."
  },
  {
    id: "STU-2026-8821",
    name: "Rohan Varma",
    email: "rohan.varma@unisphere.edu",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    classId: "CLS-AI-6A",
    course: "B.Tech AI & Data Science",
    semester: 6,
    section: "A",
    rollNumber: "23AI091",
    attendancePercent: 71.2, // Below 75% threshold!
    attendanceToday: "Absent",
    cgpa: 6.35,
    gradeCategory: "Needs Intervention",
    needsSupport: true,
    notes: "Attendance below mandatory 75% limit. Missed last 2 lab evaluations."
  },
  {
    id: "STU-2026-8822",
    name: "Pooja Hegde",
    email: "pooja.hegde@unisphere.edu",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    classId: "CLS-AI-6A",
    course: "B.Tech AI & Data Science",
    semester: 6,
    section: "A",
    rollNumber: "23AI092",
    attendancePercent: 88.0,
    attendanceToday: "Present",
    cgpa: 8.10,
    gradeCategory: "Good Standing",
    needsSupport: false,
    notes: "Active participant in seminar discussions."
  },
  {
    id: "STU-2026-8823",
    name: "Devendra Singhania",
    email: "devendra.s@unisphere.edu",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    classId: "CLS-AI-6A",
    course: "B.Tech AI & Data Science",
    semester: 6,
    section: "A",
    rollNumber: "23AI093",
    attendancePercent: 68.4, // Warning!
    attendanceToday: "Late",
    cgpa: 6.12,
    gradeCategory: "Needs Intervention",
    needsSupport: true,
    notes: "Parent consultation recommended regarding medical absence."
  },
  {
    id: "STU-2026-8824",
    name: "Ishita Banerjee",
    email: "ishita.b@unisphere.edu",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    classId: "CLS-AI-6A",
    course: "B.Tech AI & Data Science",
    semester: 6,
    section: "A",
    rollNumber: "23AI094",
    attendancePercent: 91.0,
    attendanceToday: "Present",
    cgpa: 8.75,
    gradeCategory: "Good Standing",
    needsSupport: false,
    notes: "Published an undergraduate workshop paper in CVPR."
  },
  {
    id: "STU-2026-8825",
    name: "Vikramaditya Roy",
    email: "vikram.roy@unisphere.edu",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    classId: "CLS-CSE-4B",
    course: "B.Tech Computer Science & Engg",
    semester: 4,
    section: "B",
    rollNumber: "24CS042",
    attendancePercent: 86.0,
    attendanceToday: "Present",
    cgpa: 8.20,
    gradeCategory: "Good Standing",
    needsSupport: false,
    notes: "Consistent problem solver in competitive programming club."
  },
  {
    id: "STU-2026-8826",
    name: "Tanvi Deshmukh",
    email: "tanvi.d@unisphere.edu",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    classId: "CLS-CSE-4B",
    course: "B.Tech Computer Science & Engg",
    semester: 4,
    section: "B",
    rollNumber: "24CS043",
    attendancePercent: 74.0,
    attendanceToday: "Present",
    cgpa: 7.15,
    gradeCategory: "Needs Intervention",
    needsSupport: true,
    notes: "Requires remedial session for Dynamic Programming."
  }
];

// -------------------------------------------------------------
// FACULTY ASSIGNMENTS & EVALUATIONS DATA
// -------------------------------------------------------------
export const mockFacultyAssignments = [
  {
    id: "F-ASN-01",
    title: "Vision Transformer Fine-Tuning on CIFAR-100",
    classId: "CLS-AI-6A",
    className: "B.Tech AI - Sem 6A",
    subjectCode: "AI-601",
    totalSubmissions: 54,
    totalExpected: 62,
    evaluatedCount: 26,
    pendingCount: 28,
    deadline: "Oct 14, 2026 - 11:59 PM",
    maxMarks: 50,
    status: "Evaluation in Progress"
  },
  {
    id: "F-ASN-02",
    title: "Policy Gradient & PPO Implementation on CartPole",
    classId: "CLS-AI-6A-RL",
    className: "B.Tech AI - Sem 6A",
    subjectCode: "AI-604",
    totalSubmissions: 61,
    totalExpected: 62,
    evaluatedCount: 61,
    pendingCount: 0,
    deadline: "Oct 08, 2026 - 11:59 PM",
    maxMarks: 40,
    status: "Completed & Published"
  },
  {
    id: "F-ASN-03",
    title: "Red-Black Tree Self-Balancing Benchmarks",
    classId: "CLS-CSE-4B",
    className: "B.Tech CSE - Sem 4B",
    subjectCode: "CS-403",
    totalSubmissions: 48,
    totalExpected: 60,
    evaluatedCount: 15,
    pendingCount: 33,
    deadline: "Oct 18, 2026 - 11:59 PM",
    maxMarks: 30,
    status: "Accepting Submissions"
  }
];

// -------------------------------------------------------------
// FACULTY EXAMS & MARKS ENTRY LIST
// -------------------------------------------------------------
export const mockFacultyExams = [
  {
    id: "EX-M1-AI601",
    examName: "Mid-Term Exam #1",
    subjectCode: "AI-601",
    subjectName: "Neural Networks & Deep Learning",
    classId: "CLS-AI-6A",
    className: "B.Tech AI (Sem 6 - Sec A)",
    examDate: "2026-09-24",
    maxMarks: 50,
    weightage: "25%",
    marksEntered: 62,
    totalStudents: 62,
    averageScore: 41.2,
    highestScore: 49,
    lowestScore: 24,
    status: "Published"
  },
  {
    id: "EX-M2-AI601",
    examName: "Mid-Term Exam #2",
    subjectCode: "AI-601",
    subjectName: "Neural Networks & Deep Learning",
    classId: "CLS-AI-6A",
    className: "B.Tech AI (Sem 6 - Sec A)",
    examDate: "2026-10-22",
    maxMarks: 50,
    weightage: "25%",
    marksEntered: 0,
    totalStudents: 62,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    status: "Scheduled"
  },
  {
    id: "EX-LAB-AI604",
    examName: "Continuous Evaluation Lab Assessment",
    subjectCode: "AI-604",
    subjectName: "Reinforcement Learning & Robotics",
    classId: "CLS-AI-6A-RL",
    className: "B.Tech AI (Sem 6 - Sec A)",
    examDate: "2026-10-10",
    maxMarks: 50,
    weightage: "30%",
    marksEntered: 52,
    totalStudents: 62,
    averageScore: 43.6,
    highestScore: 50,
    lowestScore: 28,
    status: "In Progress (Draft)"
  }
];

// -------------------------------------------------------------
// AI SUCCESS COACH SAMPLE PROMPTS & CAPABILITIES
// -------------------------------------------------------------
export const aiCoachSuggestions = [
  {
    id: "p1",
    title: "Diagnose My Weak Academic Areas",
    prompt: "Analyze my recent mid-term exam marks and quiz performance in AI-601 and CS-603. Which specific concepts need urgent revision before end-semesters?",
    tag: "Exam Strategy"
  },
  {
    id: "p2",
    title: "Generate 7-Day Study Schedule",
    prompt: "Build an optimized 7-day study plan balancing my ViT assignment deadline and upcoming Distributed Cloud exams based on my current attendance and grades.",
    tag: "Study Planner"
  },
  {
    id: "p3",
    title: "Mock Interview Simulation: NLP Engineer",
    prompt: "Ask me 3 technical interview questions regarding attention mechanisms, tokenization, and vector databases at the level of top AI research labs.",
    tag: "Career"
  },
  {
    id: "p4",
    title: "Explain Complex Topic: Backprop Math",
    prompt: "Can you provide an intuitive, step-by-step breakdown of how gradients flow through multi-head self-attention with mathematical derivations?",
    tag: "Concept Clarifier"
  }
];
