'use client';

import React from 'react';
import { Trophy, Medal, Star, TrendingUp, Clock } from 'lucide-react';
import { formatTime, getInitials, generateAvatarColor } from '../lib/utils';
import { demoLeaderboard } from '../data/demoData';

interface User {
  id: string;
  displayName?: string;
  totalFocusTime: number;
  streak: number;
  level: number;
}

interface LeaderboardProps {
  users: User[];
  currentUserId?: string;
  className?: string;
}

export function Leaderboard({ users, currentUserId, className = '' }: LeaderboardProps) {
  const sortedUsers = [...users].sort((a, b) => b.totalFocusTime - a.totalFocusTime);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-500" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-gray-300 text-sm font-bold">
            {rank}
          </div>
        );
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <div className={`bg-gray-900 p-6 rounded-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Global Leaderboard</h3>
            <p className="text-gray-400">Top focusers this week</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>Live Rankings</span>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {sortedUsers.slice(0, 10).map((user, index) => {
          const rank = index + 1;
          const isCurrentUser = user.id === currentUserId;

          return (
            <div
              key={user.id}
              className={`relative flex items-center p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                isCurrentUser
                  ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/50'
                  : 'bg-gray-800/50 hover:bg-gray-700/50'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center mr-4 min-w-[2rem]">
                {getRankIcon(rank)}
              </div>

              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 ${generateAvatarColor(user.id)}`}>
                {getInitials(user.displayName || 'User')}
              </div>

              {/* User Info */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className={`font-semibold truncate ${isCurrentUser ? 'text-indigo-300' : 'text-white'}`}>
                    {user.displayName || 'User'}
                    {isCurrentUser && <span className="ml-2 text-xs bg-indigo-500 px-2 py-1 rounded">You</span>}
                  </h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400 font-medium">Lv.{user.level}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-400">{formatTime(user.totalFocusTime)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm text-gray-400">{user.streak} day streak</span>
                  </div>
                </div>
              </div>

              {/* Focus Time Badge */}
              <div className={`px-3 py-1 rounded-lg text-sm font-bold text-white ${getRankBadge(rank)}`}>
                {formatTime(user.totalFocusTime)}
              </div>

              {/* Rank Badge for Top 3 */}
              {rank <= 3 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center border-2 border-current">
                  <span className="text-xs font-bold">{rank}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current User Position (if not in top 10) */}
      {currentUserId && !sortedUsers.slice(0, 10).find(u => u.id === currentUserId) && (
        <>
          <div className="my-4 border-t border-gray-600"></div>
          <div className="text-center text-gray-400 text-sm mb-2">...</div>
          {(() => {
            const currentUserIndex = sortedUsers.findIndex(u => u.id === currentUserId);
            const currentUser = sortedUsers[currentUserIndex];
            if (!currentUser) return null;

            return (
              <div className="flex items-center p-4 rounded-xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/50">
                <div className="flex items-center justify-center mr-4 min-w-[2rem]">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                    {currentUserIndex + 1}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 ${generateAvatarColor(currentUser.id)}`}>
                  {getInitials(currentUser.displayName || 'User')}
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-indigo-300 flex items-center">
                    {currentUser.displayName || 'User'}
                    <span className="ml-2 text-xs bg-indigo-500 px-2 py-1 rounded">You</span>
                  </h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-400">{formatTime(currentUser.totalFocusTime)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-sm text-gray-400">{currentUser.streak} day streak</span>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-lg text-sm font-bold text-white bg-indigo-600">
                  {formatTime(currentUser.totalFocusTime)}
                </div>
              </div>
            );
          })()}
        </>
      )}

      {/* Empty State */}
      {sortedUsers.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h4 className="text-gray-400 font-medium mb-2">No rankings yet</h4>
          <p className="text-gray-500 text-sm">Start your first focus session to join the leaderboard!</p>
        </div>
      )}
    </div>
  );
}