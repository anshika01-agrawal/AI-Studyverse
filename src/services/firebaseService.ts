import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  arrayUnion,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { User, FocusSession, StudyRoom, Goal, Achievement } from '@/types';

export class FirebaseService {
  private appId = 'focus-os-studyverse';

  // User Management
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const userDoc = {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, `users/${user.uid}`), userDoc);
    return { id: user.uid, ...userData };
  }

  async getUser(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, `users/${userId}`));
    if (!userDoc.exists()) return null;

    return { id: userDoc.id, ...userDoc.data() } as User;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await updateDoc(doc(db, `users/${userId}`), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // Focus Sessions
  async saveFocusSession(sessionData: Omit<FocusSession, 'id'>): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const sessionDoc = doc(collection(db, `artifacts/${this.appId}/users/${user.uid}/focus_sessions`));
    
    await setDoc(sessionDoc, {
      ...sessionData,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    // Update user's total focus time
    await this.updateUserFocusTime(user.uid, sessionData.duration);
    
    return sessionDoc.id;
  }

  async getUserFocusSessions(userId: string, limitCount: number = 10): Promise<FocusSession[]> {
    const sessionsQuery = query(
      collection(db, `artifacts/${this.appId}/users/${userId}/focus_sessions`),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(sessionsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime?.toDate(),
      endTime: doc.data().endTime?.toDate(),
    })) as FocusSession[];
  }

  private async updateUserFocusTime(userId: string, additionalTime: number): Promise<void> {
    const userRef = doc(db, `users/${userId}`);
    const leaderboardRef = doc(db, `artifacts/${this.appId}/public/data/leaderboard_scores`, userId);

    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const leaderboardDoc = await transaction.get(leaderboardRef);

      const currentTotalTime = userDoc.exists() ? (userDoc.data().totalFocusTime || 0) : 0;
      const newTotalTime = currentTotalTime + additionalTime;

      // Update private user data
      transaction.update(userRef, {
        totalFocusTime: newTotalTime,
        lastSessionAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update public leaderboard data
      transaction.set(leaderboardRef, {
        userId,
        totalFocusTime: newTotalTime,
        lastUpdate: serverTimestamp(),
      }, { merge: true });
    });
  }

  // Leaderboard
  subscribeToLeaderboard(callback: (users: any[]) => void, limitCount: number = 10): () => void {
    const leaderboardQuery = query(
      collection(db, `artifacts/${this.appId}/public/data/leaderboard_scores`),
      orderBy('totalFocusTime', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(leaderboardQuery, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(users);
    });
  }

  // Study Rooms
  async createStudyRoom(roomData: Omit<StudyRoom, 'id'>): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const roomDoc = doc(collection(db, `artifacts/${this.appId}/public/data/study_rooms`));
    
    await setDoc(roomDoc, {
      ...roomData,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      isActive: true,
    });

    return roomDoc.id;
  }

  async joinStudyRoom(roomId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const roomRef = doc(db, `artifacts/${this.appId}/public/data/study_rooms`, roomId);
    const userRef = doc(db, `users/${user.uid}`);

    await runTransaction(db, async (transaction) => {
      const roomDoc = await transaction.get(roomRef);
      const userDoc = await transaction.get(userRef);

      if (!roomDoc.exists()) {
        throw new Error('Study room not found');
      }

      const room = roomDoc.data() as StudyRoom;
      const userData = userDoc.data();

      if (room.participants.length >= room.maxParticipants) {
        throw new Error('Study room is full');
      }

      if (room.participants.some(p => p.id === user.uid)) {
        throw new Error('Already in this study room');
      }

      const newParticipant = {
        id: user.uid,
        displayName: userData?.displayName || 'Anonymous',
        photoURL: userData?.photoURL || null,
      };

      transaction.update(roomRef, {
        participants: arrayUnion(newParticipant),
        updatedAt: serverTimestamp(),
      });
    });
  }

  async leaveStudyRoom(roomId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const roomRef = doc(db, `artifacts/${this.appId}/public/data/study_rooms`, roomId);

    await runTransaction(db, async (transaction) => {
      const roomDoc = await transaction.get(roomRef);
      
      if (!roomDoc.exists()) {
        throw new Error('Study room not found');
      }

      const room = roomDoc.data() as StudyRoom;
      const updatedParticipants = room.participants.filter(p => p.id !== user.uid);

      // If room is empty, deactivate it
      if (updatedParticipants.length === 0) {
        transaction.update(roomRef, {
          participants: [],
          isActive: false,
          updatedAt: serverTimestamp(),
        });
      } else {
        transaction.update(roomRef, {
          participants: updatedParticipants,
          updatedAt: serverTimestamp(),
        });
      }
    });
  }

  subscribeToStudyRooms(callback: (rooms: StudyRoom[]) => void): () => void {
    const roomsQuery = query(
      collection(db, `artifacts/${this.appId}/public/data/study_rooms`),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(roomsQuery, (snapshot) => {
      const rooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as StudyRoom[];
      callback(rooms);
    });
  }

  // Goals
  async saveGoal(goalData: Omit<Goal, 'id'>): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const goalDoc = doc(collection(db, `artifacts/${this.appId}/users/${user.uid}/goals`));
    
    await setDoc(goalDoc, {
      ...goalData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return goalDoc.id;
  }

  async getUserGoals(userId: string): Promise<Goal[]> {
    const goalsQuery = query(
      collection(db, `artifacts/${this.appId}/users/${userId}/goals`),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(goalsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      deadline: doc.data().deadline?.toDate(),
    })) as Goal[];
  }

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await updateDoc(doc(db, `artifacts/${this.appId}/users/${user.uid}/goals`, goalId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  async deleteGoal(goalId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await deleteDoc(doc(db, `artifacts/${this.appId}/users/${user.uid}/goals`, goalId));
  }

  // Analytics and Insights
  async getUserAnalytics(userId: string, days: number = 7): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sessionsQuery = query(
      collection(db, `artifacts/${this.appId}/users/${userId}/focus_sessions`),
      where('startTime', '>=', Timestamp.fromDate(startDate)),
      orderBy('startTime', 'desc')
    );

    const snapshot = await getDocs(sessionsQuery);
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime?.toDate(),
      endTime: doc.data().endTime?.toDate(),
    })) as FocusSession[];

    // Calculate analytics
    const totalTime = sessions.reduce((acc, session) => acc + session.duration, 0);
    const averageScore = sessions.reduce((acc, session) => acc + session.focusScore, 0) / sessions.length || 0;
    const totalSessions = sessions.length;
    const subjectStats = this.calculateSubjectStats(sessions);

    return {
      totalTime,
      averageScore,
      totalSessions,
      subjectStats,
      dailyBreakdown: this.calculateDailyBreakdown(sessions, days),
    };
  }

  private calculateSubjectStats(sessions: FocusSession[]) {
    const stats: Record<string, { time: number; sessions: number; avgScore: number }> = {};

    sessions.forEach(session => {
      if (!stats[session.subject]) {
        stats[session.subject] = { time: 0, sessions: 0, avgScore: 0 };
      }
      stats[session.subject].time += session.duration;
      stats[session.subject].sessions++;
      stats[session.subject].avgScore += session.focusScore;
    });

    // Calculate average scores
    Object.keys(stats).forEach(subject => {
      stats[subject].avgScore = stats[subject].avgScore / stats[subject].sessions;
    });

    return stats;
  }

  private calculateDailyBreakdown(sessions: FocusSession[], days: number) {
    const breakdown: Record<string, { time: number; sessions: number }> = {};
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      breakdown[dateKey] = { time: 0, sessions: 0 };
    }

    sessions.forEach(session => {
      const dateKey = session.startTime.toISOString().split('T')[0];
      if (breakdown[dateKey]) {
        breakdown[dateKey].time += session.duration;
        breakdown[dateKey].sessions++;
      }
    });

    return breakdown;
  }
}

export const firebaseService = new FirebaseService();