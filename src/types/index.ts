export interface User {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  totalFocusTime: number;
  streak: number;
  level: number;
  achievements: string[];
}

export interface FocusSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  focusScore: number; // 0-100
  subject: string;
  notes?: string;
  aiFeedback?: string;
  distractions: number;
}

export interface StudyRoom {
  id: string;
  name: string;
  subject: string;
  participants: User[];
  maxParticipants: number;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  settings: {
    allowChat: boolean;
    focusMode: boolean;
    breakInterval: number; // minutes
  };
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'pdf' | 'image' | 'text';
    url: string;
    name: string;
  }[];
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetHours: number;
  currentHours: number;
  deadline: Date;
  isCompleted: boolean;
  category: 'study' | 'project' | 'skill' | 'habit';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  criteria: {
    type: 'focus_time' | 'streak' | 'sessions' | 'goals_completed';
    target: number;
  };
}