import React, { useState } from 'react';
import { UserProfile, LeaderboardEntry } from '../../types/spelling';
import { AvatarDisplay } from '../avatar/AvatarDisplay';
import { Sound } from '../../utils/sound';
import { Trophy, Medal, Flame, Star, Sparkles, Swords } from 'lucide-react';

interface LeaderboardViewProps {
  profile: UserProfile;
  onOpenChallenge: () => void;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'user-1',
    name: 'Cheryl W.',
    grade: 'Primary 6',
    avatar: { base: 'owl', bgColor: '#EEF2FF', accessory: 'crown', frame: 'golden' },
    score: 2450,
    wordsMastered: 20,
    streak: 12,
    isCurrentUser: false,
  },
  {
    id: 'user-2',
    name: 'Lucas Tan',
    grade: 'Primary 5',
    avatar: { base: 'cat', bgColor: '#FEF3C7', accessory: 'sunglasses', frame: 'stars' },
    score: 2180,
    wordsMastered: 19,
    streak: 9,
    isCurrentUser: false,
  },
  {
    id: 'user-3',
    name: 'Aiden Koh',
    grade: 'Primary 6',
    avatar: { base: 'robot', bgColor: '#E0F2FE', accessory: 'headphones', frame: 'neon' },
    score: 1940,
    wordsMastered: 18,
    streak: 7,
    isCurrentUser: false,
  },
  {
    id: 'user-4',
    name: 'Marcus Lim',
    grade: 'Primary 5',
    avatar: { base: 'dino', bgColor: '#D1FAE5', accessory: 'glasses', frame: 'classic' },
    score: 1720,
    wordsMastered: 16,
    streak: 5,
    isCurrentUser: false,
  },
  {
    id: 'user-5',
    name: 'Maya Seng',
    grade: 'Primary 6',
    avatar: { base: 'fox', bgColor: '#FFEDD5', accessory: 'star_badge', frame: 'golden' },
    score: 1650,
    wordsMastered: 15,
    streak: 6,
    isCurrentUser: false,
  },
  {
    id: 'user-6',
    name: 'Hannah B.',
    grade: 'Primary 5',
    avatar: { base: 'superkid', bgColor: '#FCE7F3', accessory: 'grad_cap', frame: 'classic' },
    score: 1480,
    wordsMastered: 14,
    streak: 4,
    isCurrentUser: false,
  },
  {
    id: 'user-7',
    name: 'Ethan Raj',
    grade: 'Primary 6',
    avatar: { base: 'wizard', bgColor: '#F3E8FF', accessory: 'detective_hat', frame: 'classic' },
    score: 1320,
    wordsMastered: 13,
    streak: 3,
    isCurrentUser: false,
  },
];

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  profile,
  onOpenChallenge,
}) => {
  const [filter, setFilter] = useState<'All' | 'Primary 5' | 'Primary 6'>('All');

  // Inject current user into leaderboard
  const currentUserEntry: LeaderboardEntry = {
    id: 'current-user',
    name: `${profile.name} (You)`,
    grade: profile.grade,
    avatar: profile.avatar,
    score: profile.xp,
    wordsMastered: profile.wordsMastered.length,
    streak: profile.streak,
    isCurrentUser: true,
  };

  const combinedList = [...MOCK_LEADERBOARD, currentUserEntry].sort((a, b) => b.score - a.score);

  const filteredList = combinedList.filter((item) => {
    if (filter === 'All') return true;
    return item.grade === filter;
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-xl border border-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Class Champions Leaderboard
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Updated live &bull; Compete with Primary 5 &amp; 6 spellers
          </p>
        </div>

        <button
          onClick={() => {
            Sound.pop();
            onOpenChallenge();
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all active:scale-95"
        >
          <Swords className="w-4 h-4" />
          <span>Challenge Friend</span>
        </button>
      </div>

      {/* Filter Segmented Control (Interactive buttons as required by anti-slop rules) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-xs mb-6">
        {(['All', 'Primary 5', 'Primary 6'] as const).map((grade) => (
          <button
            key={grade}
            onClick={() => {
              Sound.click();
              setFilter(grade);
            }}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filter === grade
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {grade === 'All' ? 'All Classes' : grade}
          </button>
        ))}
      </div>

      {/* Podium Top 3 (if filtered has at least 3) */}
      {filteredList.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 pt-4 items-end max-w-xl mx-auto text-center">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <AvatarDisplay avatar={filteredList[1].avatar} size="lg" />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-black text-slate-700">
                2
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[100px]">
              {filteredList[1].name}
            </span>
            <span className="text-xs font-extrabold text-indigo-600">
              {filteredList[1].score} XP
            </span>
            <div className="w-full h-16 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-2xl mt-2 flex items-center justify-center font-bold text-slate-500 text-sm">
              🥈 Silver
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center -mt-6">
            <div className="relative mb-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-amber-500 animate-float">
                👑
              </div>
              <AvatarDisplay avatar={filteredList[0].avatar} size="xl" />
              <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-xs font-black text-amber-950 shadow-sm">
                1
              </span>
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900 truncate max-w-[120px]">
              {filteredList[0].name}
            </span>
            <span className="text-sm font-black text-amber-600">
              {filteredList[0].score} XP
            </span>
            <div className="w-full h-24 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-2xl mt-2 flex items-center justify-center font-black text-amber-800 text-sm shadow-xs">
              🥇 Champion
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <AvatarDisplay avatar={filteredList[2].avatar} size="lg" />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white border-2 border-white flex items-center justify-center text-xs font-black">
                3
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[100px]">
              {filteredList[2].name}
            </span>
            <span className="text-xs font-extrabold text-indigo-600">
              {filteredList[2].score} XP
            </span>
            <div className="w-full h-12 bg-gradient-to-t from-amber-700/20 to-amber-700/10 rounded-t-2xl mt-2 flex items-center justify-center font-bold text-amber-900 text-xs sm:text-sm">
              🥉 Bronze
            </div>
          </div>
        </div>
      )}

      {/* Roster List */}
      <div className="space-y-2">
        {filteredList.map((entry, index) => {
          const rank = index + 1;
          const isMe = entry.isCurrentUser;

          return (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl transition-all ${
                isMe
                  ? 'bg-indigo-50 border-2 border-indigo-400 shadow-sm'
                  : 'bg-slate-50/70 border border-slate-100 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-6 text-center font-black text-sm ${
                    rank === 1
                      ? 'text-amber-500'
                      : rank === 2
                      ? 'text-slate-500'
                      : rank === 3
                      ? 'text-amber-700'
                      : 'text-slate-400'
                  }`}
                >
                  #{rank}
                </span>

                <AvatarDisplay avatar={entry.avatar} size="sm" />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold truncate ${
                        isMe ? 'text-indigo-900 font-black' : 'text-slate-800'
                      }`}
                    >
                      {entry.name}
                    </span>
                  </div>

                  {/* Clean unboxed metadata with typographic separators (anti-slop rule) */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span>{entry.grade}</span>
                    <span aria-hidden="true">&bull;</span>
                    <span>{entry.wordsMastered}/20 Mastered</span>
                    {entry.streak > 0 && (
                      <>
                        <span aria-hidden="true">&bull;</span>
                        <span className="text-amber-600 font-bold">{entry.streak}d streak 🔥</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <div>
                  <span className="text-sm sm:text-base font-black text-indigo-700 block">
                    {entry.score} XP
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
