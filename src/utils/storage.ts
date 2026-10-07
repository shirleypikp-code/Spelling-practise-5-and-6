import { UserProfile } from '../types/spelling';

const STORAGE_KEY = 'spellquest_user_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Spelling Hero',
  grade: 'Primary 5',
  avatar: {
    base: 'owl',
    bgColor: '#EEF2FF',
    accessory: 'glasses',
    frame: 'golden',
  },
  xp: 450,
  stars: 35,
  streak: 3,
  lastActiveDate: '',
  wordsMastered: ['word-8', 'word-15'], // hygiene, curiosity initially mastered
  wordStats: {},
  completedQuests: [],
  unlockedAccessories: ['none', 'glasses', 'sunglasses'],
  soundEnabled: true,
  voicePitch: 1.0,
  voiceRate: 0.9,
};

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
}

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as UserProfile;
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      avatar: {
        ...DEFAULT_PROFILE.avatar,
        ...(parsed.avatar || {}),
      },
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}
