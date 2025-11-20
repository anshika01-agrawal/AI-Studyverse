// Demo data for the Focus OS platform
export const demoUser = {
  id: 'demo-user-1',
  name: 'Alex Chen',
  email: 'alex@demo.com',
  avatar: '/api/placeholder/40/40',
  totalFocusTime: 12450, // in minutes
  streak: 7,
  level: 12,
  badges: ['Deep Focus Master', 'Study Streak Champion'],
  joinDate: '2024-01-15',
  preferences: {
    pomodoroLength: 25,
    shortBreak: 5,
    longBreak: 15,
    notifications: true,
    theme: 'dark'
  }
};

export const demoLeaderboard = [
  {
    id: '1',
    name: 'Sarah Kim',
    avatar: '/api/placeholder/40/40',
    totalFocusTime: 18720,
    streak: 12,
    level: 18,
    badges: ['Study Legend', 'Focus Master'],
    rank: 1
  },
  {
    id: '2', 
    name: 'Alex Chen',
    avatar: '/api/placeholder/40/40',
    totalFocusTime: 12450,
    streak: 7,
    level: 12,
    badges: ['Deep Focus Master'],
    rank: 2
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    avatar: '/api/placeholder/40/40', 
    totalFocusTime: 9840,
    streak: 5,
    level: 9,
    badges: ['Consistency King'],
    rank: 3
  },
  {
    id: '4',
    name: 'Emma Thompson',
    avatar: '/api/placeholder/40/40',
    totalFocusTime: 8520,
    streak: 9,
    level: 11,
    badges: ['Study Warrior'],
    rank: 4
  },
  {
    id: '5',
    name: 'David Park',
    avatar: '/api/placeholder/40/40',
    totalFocusTime: 7200,
    streak: 3,
    level: 8,
    badges: ['Rising Star'],
    rank: 5
  }
];

export const demoStudyRooms = [
  {
    id: 'room-1',
    name: 'CS Study Group',
    subject: 'Computer Science',
    participants: 12,
    maxParticipants: 20,
    isActive: true,
    description: 'Studying algorithms and data structures',
    tags: ['Programming', 'Algorithms', 'Interview Prep']
  },
  {
    id: 'room-2', 
    name: 'Math Warriors',
    subject: 'Mathematics',
    participants: 8,
    maxParticipants: 15,
    isActive: true,
    description: 'Calculus and linear algebra focus session',
    tags: ['Calculus', 'Linear Algebra', 'Problem Solving']
  },
  {
    id: 'room-3',
    name: 'Med School Prep',
    subject: 'Medicine',
    participants: 15,
    maxParticipants: 25,
    isActive: false,
    description: 'MCAT preparation and biology review',
    tags: ['Biology', 'Chemistry', 'MCAT']
  }
];

export const demoGoals = [
  {
    id: 'goal-1',
    title: 'Complete React Course',
    description: 'Finish the Advanced React course by end of month',
    targetHours: 40,
    completedHours: 28,
    deadline: '2024-12-31',
    priority: 'high',
    category: 'Programming'
  },
  {
    id: 'goal-2',
    title: 'Daily Focus Sessions',
    description: 'Maintain 2+ hours of focused study daily',
    targetHours: 60,
    completedHours: 42,
    deadline: '2024-12-31', 
    priority: 'medium',
    category: 'Habits'
  }
];

export const demoInsights = {
  weeklyFocus: [
    { day: 'Mon', hours: 3.5 },
    { day: 'Tue', hours: 2.8 },
    { day: 'Wed', hours: 4.2 },
    { day: 'Thu', hours: 3.1 },
    { day: 'Fri', hours: 2.5 },
    { day: 'Sat', hours: 5.0 },
    { day: 'Sun', hours: 4.8 }
  ],
  focusScore: 87,
  improvement: '+12%',
  totalSessions: 156,
  averageSession: 42 // minutes
};