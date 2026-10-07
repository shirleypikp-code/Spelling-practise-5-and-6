export interface SpellingWord {
  id: string;
  word: string;
  displayWord: string;
  syllables: string[];
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb';
  level: 'Primary 5' | 'Primary 6' | 'Both';
  definition: string;
  sentence: string; // Has {{word}} placeholder or used for context
  mnemonic: string;
  trickyParts: string[];
  commonMisspellings: string[];
  difficulty: 1 | 2 | 3; // 1 = Medium, 2 = Hard, 3 = Expert
  origin?: string;
}

export type AvatarBase = 
  | 'owl' 
  | 'robot' 
  | 'cat' 
  | 'astronaut' 
  | 'fox' 
  | 'wizard' 
  | 'superkid' 
  | 'dino';

export type AvatarAccessory = 
  | 'none' 
  | 'glasses' 
  | 'sunglasses' 
  | 'crown' 
  | 'headphones' 
  | 'grad_cap' 
  | 'star_badge' 
  | 'detective_hat'
  | 'bow';

export interface AvatarConfig {
  base: AvatarBase;
  bgColor: string;
  accessory: AvatarAccessory;
  frame: 'classic' | 'golden' | 'neon' | 'stars';
}

export interface UserProfile {
  name: string;
  grade: 'Primary 5' | 'Primary 6';
  avatar: AvatarConfig;
  xp: number;
  stars: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  wordsMastered: string[]; // ids of words
  wordStats: Record<string, {
    attempts: number;
    correct: number;
    lastPracticed: number;
  }>;
  completedQuests: string[]; // quest ids completed today
  unlockedAccessories: string[];
  soundEnabled: boolean;
  voicePitch: number;
  voiceRate: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  grade: 'Primary 5' | 'Primary 6';
  avatar: AvatarConfig;
  score: number;
  wordsMastered: number;
  streak: number;
  isCurrentUser?: boolean;
}

export type GameMode = 
  | 'listen-spell' 
  | 'letter-scramble' 
  | 'bubble-pop' 
  | 'word-detective' 
  | 'speed-blitz';

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  rewardStars: number;
  rewardXp: number;
  completed: boolean;
}
