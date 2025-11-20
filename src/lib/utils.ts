import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

export function formatTimeShort(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
}

export function getTimeOfDay(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'morning';
  } else if (hour < 17) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}

export function getGreeting(name?: string): string {
  const timeOfDay = getTimeOfDay();
  const greeting = `Good ${timeOfDay}`;
  
  return name ? `${greeting}, ${name}!` : `${greeting}!`;
}

export function calculateLevel(totalFocusTime: number): number {
  // Level up every 10 hours of focus time
  return Math.floor(totalFocusTime / (10 * 3600)) + 1;
}

export function getNextLevelProgress(totalFocusTime: number): {
  currentLevel: number;
  nextLevel: number;
  progress: number; // 0-100
  timeToNext: number; // seconds
} {
  const currentLevel = calculateLevel(totalFocusTime);
  const currentLevelTime = (currentLevel - 1) * 10 * 3600;
  const nextLevelTime = currentLevel * 10 * 3600;
  const progress = ((totalFocusTime - currentLevelTime) / (nextLevelTime - currentLevelTime)) * 100;
  
  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    progress: Math.floor(progress),
    timeToNext: nextLevelTime - totalFocusTime,
  };
}

export function generateAvatarColor(userId: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

export function getInitials(name: string): string {
  if (!name) return 'U';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  
  return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}