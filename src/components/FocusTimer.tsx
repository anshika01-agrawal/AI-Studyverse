'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  Play, 
  Pause, 
  Square,
  TrendingUp,
  Trophy,
  Target,
  Brain,
  Sparkles,
  Timer
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatTime } from '../lib/utils';

interface FocusTimerProps {
  className?: string;
}

export function FocusTimer({ className = '' }: FocusTimerProps) {
  const {
    isStudying,
    focusTime,
    focusScore,
    currentSession,
    startSession,
    stopSession,
    updateFocusTime,
    updateFocusScore,
    addNotification
  } = useAppStore();

  const [subject, setSubject] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(0);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStudying && !isBreakTime) {
      interval = setInterval(() => {
        updateFocusTime(focusTime + 1);
      }, 1000);
    } else if (isBreakTime) {
      interval = setInterval(() => {
        if (breakTimeRemaining > 0) {
          setBreakTimeRemaining(prev => prev - 1);
        } else {
          setIsBreakTime(false);
          addNotification('Break time is over! Back to studying.', 'info');
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isStudying, focusTime, updateFocusTime, isBreakTime, breakTimeRemaining, addNotification]);

  // Mock AI Focus Score simulation
  useEffect(() => {
    if (isStudying && !isBreakTime) {
      const interval = setInterval(() => {
        // Simulate focus score fluctuation (75-99%)
        const newScore = Math.floor(75 + Math.random() * 24);
        updateFocusScore(newScore);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isStudying, updateFocusScore, isBreakTime]);

  const handleStartSession = () => {
    if (!subject.trim()) {
      addNotification('Please enter a study subject first!', 'error');
      return;
    }
    startSession(subject);
    addNotification(`Started studying ${subject}`, 'success');
  };

  const handleStopSession = async () => {
    if (currentSession) {
      // Mock AI analysis
      addNotification('Analyzing your focus session...', 'info');
      
      // Simulate API delay
      setTimeout(() => {
        addNotification(`Great job! You focused for ${formatTime(focusTime)} with an average score of ${focusScore}%`, 'success');
      }, 2000);
    }
    stopSession();
    setSubject('');
    setSessionNotes('');
  };

  const handleBreak = () => {
    setIsBreakTime(true);
    setBreakTimeRemaining(5 * 60); // 5 minute break
    addNotification('Break time started! Take a 5-minute break.', 'info');
  };

  const getSessionStatus = () => {
    if (!isStudying) return 'Ready to Focus';
    if (isBreakTime) return 'Break Time';
    return 'Deep Focus Mode';
  };

  const getScoreColor = () => {
    if (focusScore >= 90) return 'text-green-400';
    if (focusScore >= 80) return 'text-yellow-400';
    if (focusScore >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className={`bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Deep Work Engine</h2>
            <p className="text-gray-400">AI-Powered Focus Sessions</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
          isStudying 
            ? isBreakTime 
              ? 'bg-yellow-500/20 text-yellow-300' 
              : 'bg-green-500/20 text-green-300'
            : 'bg-gray-600/20 text-gray-400'
        }`}>
          {getSessionStatus()}
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="text-center mb-8">
        <div className="relative">
          <div className="text-7xl font-mono font-light text-white mb-4">
            {isBreakTime ? formatTime(breakTimeRemaining) : formatTime(focusTime)}
          </div>
          <div className="flex items-center justify-center text-indigo-400 text-lg">
            <Timer className="w-5 h-5 mr-2" />
            {isBreakTime ? 'Break Time Remaining' : 'Focus Time Elapsed'}
          </div>
        </div>
      </div>

      {/* Focus Score */}
      {isStudying && !isBreakTime && (
        <div className="flex items-center justify-center mb-8">
          <div className="glass-card p-6 rounded-xl flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <Sparkles className="w-8 h-8 text-purple-400 mb-2" />
              <span className="text-sm text-gray-300">AI Focus Score</span>
            </div>
            <div className={`text-4xl font-bold ${getScoreColor()}`}>
              {focusScore}%
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="w-8 h-8 text-blue-400 mb-2" />
              <span className="text-sm text-gray-300">Real-time</span>
            </div>
          </div>
        </div>
      )}

      {/* Study Subject Input */}
      {!isStudying && (
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            What are you studying today?
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Advanced Calculus, React Components, Spanish Grammar"
            className="w-full px-4 py-3 bg-slate-800 border border-blue-800/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      )}

      {/* Session Notes */}
      {isStudying && (
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Session Notes (Optional)
          </label>
          <textarea
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Jot down key insights, difficulties, or breakthroughs..."
            rows={3}
            className="w-full px-4 py-3 bg-slate-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 resize-none"
          />
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-col space-y-4">
        {!isStudying ? (
          <button
            onClick={handleStartSession}
            disabled={!subject.trim()}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed focus-glow"
          >
            <Play className="w-5 h-5" />
            <span>Start Deep Work Session</span>
          </button>
        ) : (
          <div className="flex space-x-4">
            {!isBreakTime && (
              <button
                onClick={handleBreak}
                className="flex-1 bg-yellow-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-yellow-700 transition duration-300 flex items-center justify-center space-x-2"
              >
                <Pause className="w-4 h-4" />
                <span>Take Break</span>
              </button>
            )}
            <button
              onClick={handleStopSession}
              className="flex-1 bg-red-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-red-700 transition duration-300 flex items-center justify-center space-x-2"
            >
              <Square className="w-4 h-4" />
              <span>End Session</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {isStudying && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{Math.floor(focusTime / 60)}</div>
              <div className="text-sm text-gray-400">Minutes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{focusScore}%</div>
              <div className="text-sm text-gray-400">Focus Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">0</div>
              <div className="text-sm text-gray-400">Distractions</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}