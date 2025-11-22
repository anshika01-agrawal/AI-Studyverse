'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  BookOpen,
  Users,
  BarChart3,
  Target,
  Settings,
  Bell,
  Search,
  Plus,
  Zap,
  Trophy,
  Calendar,
  Clock,
  User,
  Shield,
  Moon,
  Sun,
  MessageSquare,
  X,
  Globe,
  Database
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { FocusTimer } from '@/components/FocusTimer';
import { Leaderboard } from '@/components/Leaderboard';
import { formatTime, getGreeting, getInitials, generateAvatarColor } from '@/lib/utils';

import { demoLeaderboard, demoStudyRooms } from '@/data/demoData';

// Mock data for demonstration - using proper format
const mockUsers = demoLeaderboard.map((user, index) => ({
  ...user,
  name: user.displayName || 'User',
  rank: index + 1
}));

const mockStudyRooms = demoStudyRooms.map(room => ({
  id: room.id,
  name: room.name,
  subject: room.subject,
  participants: room.participants.length,
  isActive: room.isActive
}));

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
}

function NavItem({ icon: Icon, label, isActive, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 text-sm font-medium group ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <div className="flex items-center">
        <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
        {label}
      </div>
      {badge && (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

function InsightsCard({ totalFocusTime }: { totalFocusTime: number }) {
  const weeklyTarget = 30 * 3600; // 30 hours
  const progress = Math.min(100, (totalFocusTime / weeklyTarget) * 100);

  return (
    <div className="bg-gray-900 p-6 rounded-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-600 rounded-xl">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Weekly Progress</h3>
          <p className="text-gray-400">Goal: 30 hours deep work</p>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-white mb-2">{formatTime(totalFocusTime)}</div>
        <div className="text-gray-400">Total Focus Time This Week</div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{Math.round(progress)}% Complete</span>
          <span>Target: 30:00:00</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-green-400">
          <Trophy className="w-4 h-4 mr-1" />
          <span>7-day streak</span>
        </div>
        <div className="text-blue-400">
          Level 4 • {formatTime(weeklyTarget - totalFocusTime)} to Level 5
        </div>
      </div>
    </div>
  );
}

function CommunityCard() {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-600 rounded-xl">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Study Rooms</h3>
          <p className="text-gray-400">Join live study sessions</p>
        </div>
      </div>

      <div className="space-y-3">
        {mockStudyRooms.map((room) => (
          <div key={room.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer">
            <div>
              <h4 className="font-semibold text-white">{room.name}</h4>
              <p className="text-sm text-gray-400">{room.subject}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[...Array(Math.min(room.participants, 3))].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-blue-500 rounded-full border-2 border-gray-800"></div>
                ))}
              </div>
              <div className={`w-3 h-3 rounded-full ${room.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition duration-300 flex items-center justify-center space-x-2">
        <Plus className="w-4 h-4" />
        <span>Create Study Room</span>
      </button>
    </div>
  );
}

function AILearningHub() {
  const [message, setMessage] = useState('');

  return (
    <div className="bg-gray-900 p-6 rounded-2xl h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-600 rounded-xl">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">AI Learning Coach</h3>
          <p className="text-gray-400">Your personalized study assistant</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow bg-gray-800/30 rounded-xl p-4 mb-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-700 rounded-xl rounded-tl-none p-3 max-w-xs">
              <p className="text-white text-sm">
                Hi! I'm your AI study coach. I can help you with study strategies, create personalized quizzes, 
                and analyze your learning patterns. What would you like to work on today?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about study techniques, upload notes, or request a quiz..."
          className="flex-grow px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
        <button className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition duration-300">
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {['Generate Quiz', 'Study Plan', 'Note Summary', 'Focus Tips'].map((action) => (
          <button key={action} className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors">
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { activeView, setActiveView, user, addNotification } = useAppStore();
  const [currentUser] = useState({
    id: 'demo-user-1',
    displayName: 'Alex Chen',
    totalFocusTime: 12450,
    streak: 7,
    level: 12,
    achievements: ['Deep Focus Master']
  }); // Mock current user

  // Debug log
  console.log('Current activeView:', activeView);

  useEffect(() => {
    // Mock user setup
    if (!user) {
      useAppStore.getState().setUser(currentUser as any);
    }
  }, [user, currentUser]);

  const renderMainContent = () => {
    switch (activeView) {
      case 'focus':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FocusTimer />
            </div>
            <div className="space-y-6">
              <CommunityCard />
              <div className="bg-gray-900 p-4 rounded-2xl">
                <h4 className="font-bold text-white mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                  Today's Goals
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-300">Complete React tutorial</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-300">Study for 2 hours</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-300">Review yesterday's notes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'learn':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <AILearningHub />
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Upload Materials</h3>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">Drop PDFs, images, or text files</p>
                  <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                    Choose Files
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Recent Sessions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-white">React Components</h4>
                      <p className="text-sm text-gray-400">2 hours ago</p>
                    </div>
                    <div className="text-green-400 text-sm font-semibold">95%</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-white">Advanced Calculus</h4>
                      <p className="text-sm text-gray-400">Yesterday</p>
                    </div>
                    <div className="text-yellow-400 text-sm font-semibold">88%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'connect':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Active Study Rooms</h3>
              <div className="space-y-4">
                {mockStudyRooms.filter(room => room.isActive).map((room) => (
                  <div key={room.id} className="bg-gray-800/50 p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{room.name}</h4>
                        <p className="text-gray-400 text-sm">{room.subject}</p>
                      </div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {[...Array(room.participants)].map((_, i) => (
                          <div key={i} className="w-8 h-8 bg-teal-500 rounded-full border-2 border-gray-800"></div>
                        ))}
                      </div>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                        Join Room
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Create Study Room</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Room name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400"
                />
                <select className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white">
                  <option>Max 2 participants</option>
                  <option>Max 4 participants</option>
                  <option>Max 6 participants</option>
                </select>
                <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition duration-300">
                  Create Room
                </button>
              </div>
            </div>
          </div>
        );

      case 'insights':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InsightsCard totalFocusTime={currentUser.totalFocusTime} />
            <Leaderboard users={mockUsers} currentUserId={currentUser.id} />
          </div>
        );

      case 'goals':
        return (
          <div className="bg-gray-900 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Study Goals</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition duration-300 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Goal</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Master React.js', progress: 65, deadline: '2 weeks' },
                { title: 'Complete Calculus Course', progress: 40, deadline: '1 month' },
                { title: 'Build Portfolio Website', progress: 80, deadline: '1 week' },
                { title: 'Learn TypeScript', progress: 20, deadline: '3 weeks' },
              ].map((goal, index) => (
                <div key={index} className="bg-gray-800/50 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{goal.title}</h4>
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>{goal.progress}% Complete</span>
                      <span>{goal.deadline} left</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gray-700 text-white py-2 px-3 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                      View
                    </button>
                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-gray-900 p-6 rounded-2xl">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Settings</h3>
              <p className="text-gray-400">Customize your study experience</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Settings */}
              <div className="bg-gray-800/50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white">Profile</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Display Name</label>
                    <input 
                      type="text" 
                      value={currentUser?.displayName || ''}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      value="alex@demo.com"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                      disabled
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Update Profile
                  </button>
                </div>
              </div>

              {/* Study Settings */}
              <div className="bg-gray-800/50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white">Study Preferences</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Focus Session Duration</label>
                    <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                      <option>25 minutes (Pomodoro)</option>
                      <option>45 minutes</option>
                      <option>60 minutes</option>
                      <option>90 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Break Duration</label>
                    <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                      <option>5 minutes</option>
                      <option>10 minutes</option>
                      <option>15 minutes</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Notifications</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className="w-12 h-6 bg-blue-600 rounded-full shadow-inner"></div>
                      <div className="absolute w-4 h-4 bg-white rounded-full shadow top-1 right-1"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="bg-gray-800/50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Moon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white">Appearance</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Theme</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-900 border-2 border-blue-600 rounded-lg cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <Moon className="w-4 h-4 text-white" />
                          <span className="text-white text-sm">Dark</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-700 border-2 border-gray-600 rounded-lg cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <Sun className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-sm">Light</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Accent Color</label>
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white cursor-pointer"></div>
                      <div className="w-8 h-8 bg-green-600 rounded-full border-2 border-transparent cursor-pointer"></div>
                      <div className="w-8 h-8 bg-purple-600 rounded-full border-2 border-transparent cursor-pointer"></div>
                      <div className="w-8 h-8 bg-red-600 rounded-full border-2 border-transparent cursor-pointer"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-gray-800/50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white">Privacy & Data</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-300 font-medium">Show in Leaderboard</span>
                      <p className="text-gray-500 text-sm">Display your stats publicly</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className="w-12 h-6 bg-blue-600 rounded-full shadow-inner"></div>
                      <div className="absolute w-4 h-4 bg-white rounded-full shadow top-1 right-1"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-300 font-medium">AI Data Usage</span>
                      <p className="text-gray-500 text-sm">Use my data to improve AI features</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className="w-12 h-6 bg-blue-600 rounded-full shadow-inner"></div>
                      <div className="absolute w-4 h-4 bg-white rounded-full shadow top-1 right-1"></div>
                    </div>
                  </div>
                  <button className="text-red-400 hover:text-red-300 transition-colors text-sm">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
            
            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button 
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                onClick={() => addNotification('Settings saved successfully!', 'success')}
              >
                Save Changes
              </button>
            </div>
          </div>
        );

      default:
        return <div className="text-white">Select a view from the sidebar</div>;
    }
  };

  const updateSetting = (key: string, value: any) => {
    addNotification(`${key} updated successfully!`, 'success');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 mx-6 mt-6 p-4 rounded-2xl flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Studyverse</h1>
            <p className="text-gray-400 text-sm">{getGreeting(currentUser?.displayName)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
            {getInitials(currentUser?.displayName)}
          </div>
        </div>
      </header>

      <div className="flex gap-6 p-6">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-gray-900 p-4 rounded-2xl self-start">
          <div className="space-y-2">
            <NavItem 
              icon={Zap} 
              label="Deep Focus" 
              isActive={activeView === 'focus'} 
              onClick={() => setActiveView('focus')} 
            />
            <NavItem 
              icon={BookOpen} 
              label="AI Learning Hub" 
              isActive={activeView === 'learn'} 
              onClick={() => setActiveView('learn')} 
            />
            <NavItem 
              icon={Users} 
              label="Study Rooms" 
              isActive={activeView === 'connect'} 
              onClick={() => setActiveView('connect')} 
            />
            <NavItem 
              icon={Target} 
              label="Goals" 
              isActive={activeView === 'goals'} 
              onClick={() => setActiveView('goals')} 
            />
            <NavItem 
              icon={BarChart3} 
              label="Insights" 
              isActive={activeView === 'insights'} 
              onClick={() => setActiveView('insights')} 
            />
            
            <div className="h-px bg-gray-700 my-4"></div>
            
            <NavItem 
              icon={Settings} 
              label="Settings" 
              isActive={activeView === 'settings'} 
              onClick={() => setActiveView('settings')} 
            />
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-8rem)]">
          {renderMainContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6">
        © 2024 Focus OS • Re-engineering attention for mastery
      </footer>
    </div>
  );
}