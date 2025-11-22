// Demo data for the Focus OS platform
export const demoUser = {
  id: 'demo-user-1',
  email: 'alex@demo.com',
  displayName: 'Alex Chen',
  photoURL: '/api/placeholder/40/40',
  totalFocusTime: 12450, // in seconds
  streak: 7,
  level: 12,
  achievements: ['Deep Focus Master', 'Study Streak Champion']
};

export const demoLeaderboard = [
  {
    id: '1',
    displayName: 'Sarah Kim',
    photoURL: '/api/placeholder/40/40',
    totalFocusTime: 18720,
    streak: 12,
    level: 18,
    achievements: ['Study Legend', 'Focus Master']
  },
  {
    id: '2', 
    displayName: 'Alex Chen',
    photoURL: '/api/placeholder/40/40',
    totalFocusTime: 12450,
    streak: 7,
    level: 12,
    achievements: ['Deep Focus Master']
  },
  {
    id: '3',
    displayName: 'Marcus Johnson',
    photoURL: '/api/placeholder/40/40', 
    totalFocusTime: 9840,
    streak: 5,
    level: 9,
    achievements: ['Consistency King']
  },
  {
    id: '4',
    displayName: 'Emma Thompson',
    photoURL: '/api/placeholder/40/40',
    totalFocusTime: 8520,
    streak: 9,
    level: 11,
    achievements: ['Study Warrior']
  },
  {
    id: '5',
    displayName: 'David Park',
    photoURL: '/api/placeholder/40/40',
    totalFocusTime: 7200,
    streak: 3,
    level: 8,
    achievements: ['Rising Star']
  }
];

export const demoStudyRooms = [
  {
    id: 'room-1',
    name: 'CS Study Group',
    subject: 'Computer Science',
    participants: [],
    maxParticipants: 20,
    isActive: true,
    createdBy: 'demo-user-1',
    createdAt: new Date('2024-01-15'),
    settings: {
      allowChat: true,
      focusMode: true,
      breakInterval: 25
    }
  },
  {
    id: 'room-2', 
    name: 'Math Warriors',
    subject: 'Mathematics',
    participants: [],
    maxParticipants: 15,
    isActive: true,
    createdBy: 'demo-user-2',
    createdAt: new Date('2024-01-15'),
    settings: {
      allowChat: true,
      focusMode: true,
      breakInterval: 30
    }
  },
  {
    id: 'room-3',
    name: 'Med School Prep',
    subject: 'Medicine',
    participants: [],
    maxParticipants: 25,
    isActive: false,
    createdBy: 'demo-user-3',
    createdAt: new Date('2024-01-15'),
    settings: {
      allowChat: true,
      focusMode: false,
      breakInterval: 25
    }
  }
];

export const demoGoals = [
  {
    id: 'goal-1',
    userId: 'demo-user-1',
    title: 'Complete React Course',
    description: 'Finish the Advanced React course by end of month',
    targetHours: 40,
    currentHours: 28,
    deadline: new Date('2024-12-31'),
    isCompleted: false,
    category: 'skill' as const
  },
  {
    id: 'goal-2',
    userId: 'demo-user-1',
    title: 'Daily Focus Sessions',
    description: 'Maintain 2+ hours of focused study daily',
    targetHours: 60,
    currentHours: 42,
    deadline: new Date('2024-12-31'), 
    isCompleted: false,
    category: 'habit' as const
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