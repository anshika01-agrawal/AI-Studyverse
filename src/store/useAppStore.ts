import { create } from 'zustand';
import { User, FocusSession, StudyRoom, Goal } from '../types';
import { demoUser, demoLeaderboard, demoStudyRooms, demoGoals } from '../data/demoData';

interface AppStore {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Focus session state
  currentSession: FocusSession | null;
  isStudying: boolean;
  focusTime: number; // current session time in seconds
  focusScore: number; // real-time AI focus score
  startSession: (subject: string) => void;
  stopSession: () => void;
  updateFocusTime: (seconds: number) => void;
  updateFocusScore: (score: number) => void;
  
  // Study rooms state
  currentRoom: StudyRoom | null;
  availableRooms: StudyRoom[];
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  setAvailableRooms: (rooms: StudyRoom[]) => void;
  
  // Goals state
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  
  // App state
  activeView: 'focus' | 'learn' | 'connect' | 'insights' | 'goals';
  setActiveView: (view: 'focus' | 'learn' | 'connect' | 'insights' | 'goals') => void;
  notifications: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state with demo data
  user: demoUser as any,
  currentSession: null,
  isStudying: false,
  focusTime: 0,
  focusScore: 85,
  currentRoom: null,
  availableRooms: demoStudyRooms as any,
  goals: demoGoals as any,
  activeView: 'focus',
  notifications: [],

  // User actions
  setUser: (user) => set({ user }),

  // Focus session actions
  startSession: (subject) => {
    const session: FocusSession = {
      id: Date.now().toString(),
      userId: get().user?.id || 'anonymous',
      startTime: new Date(),
      duration: 0,
      focusScore: 100,
      subject,
      distractions: 0,
    };
    set({ currentSession: session, isStudying: true, focusTime: 0, focusScore: 100 });
  },

  stopSession: () => {
    const currentSession = get().currentSession;
    if (currentSession) {
      const endedSession = {
        ...currentSession,
        endTime: new Date(),
        duration: get().focusTime,
        focusScore: get().focusScore,
      };
      // Here you would save to Firebase
      console.log('Session ended:', endedSession);
    }
    set({ currentSession: null, isStudying: false, focusTime: 0, focusScore: 0 });
  },

  updateFocusTime: (seconds) => set({ focusTime: seconds }),
  updateFocusScore: (score) => set({ focusScore: score }),

  // Study room actions
  joinRoom: (roomId) => {
    const room = get().availableRooms.find(r => r.id === roomId);
    if (room) {
      set({ currentRoom: room });
    }
  },

  leaveRoom: () => set({ currentRoom: null }),
  setAvailableRooms: (rooms) => set({ availableRooms: rooms }),

  // Goals actions
  setGoals: (goals) => set({ goals }),
  addGoal: (goal) => set({ goals: [...get().goals, goal] }),
  updateGoal: (goalId, updates) => {
    const goals = get().goals.map(g => 
      g.id === goalId ? { ...g, ...updates } : g
    );
    set({ goals });
  },

  // App actions
  setActiveView: (view) => set({ activeView: view }),
  
  addNotification: (message, type) => {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
    };
    set({ notifications: [...get().notifications, notification] });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(notification.id);
    }, 5000);
  },

  removeNotification: (id) => {
    set({ 
      notifications: get().notifications.filter(n => n.id !== id) 
    });
  },
}));