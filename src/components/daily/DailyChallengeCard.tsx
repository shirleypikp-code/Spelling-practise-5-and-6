import React from 'react';
import { SpellingWord, UserProfile } from '../../types/spelling';
import { Sound } from '../../utils/sound';
import { Flame, Star, Sparkles, CheckCircle2, Play, Calendar, Zap, Gift } from 'lucide-react';

interface DailyChallengeCardProps {
  profile: UserProfile;
  dailyWords: SpellingWord[];
  isCompletedToday: boolean;
  onStartDailyChallenge: () => void;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  profile,
  dailyWords,
  isCompletedToday,
  onStartDailyChallenge,
}) => {
  // Streak multiplier formula
  const streakMultiplier = profile.streak >= 7 ? '1.5x' : profile.streak >= 3 ? '1.2x' : '1.0x';

  return (
    <div className="w-full bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
      {/* Background festive decorative circles */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute top-2 right-1/3 w-20 h-20 rounded-full bg-amber-400/20 blur-lg pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-lg">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-amber-950" />
              {profile.streak} Day Streak
            </span>

            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-white">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              {streakMultiplier} Bonus XP
            </span>

            <span className="flex items-center gap-1 text-xs text-indigo-200 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              Daily Quest
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Daily Spelling Gauntlet (5 Words)
          </h2>

          <p className="text-xs sm:text-sm text-indigo-100 font-normal">
            Master today’s 5 targeted Primary 5 &amp; 6 words to maintain your streak and unlock
            avatar gear stars!
          </p>

          {/* Word preview badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {dailyWords.map((w) => (
              <span
                key={w.id}
                className="px-2.5 py-0.5 rounded-lg bg-white/15 text-white text-xs font-bold backdrop-blur-xs"
              >
                {w.displayWord}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button & Reward preview */}
        <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-2xl backdrop-blur-xs text-xs font-bold text-amber-300">
            <Gift className="w-4 h-4 text-amber-300" />
            <span>Reward: +250 XP &bull; +25 ⭐</span>
          </div>

          {isCompletedToday ? (
            <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/90 text-white font-black text-sm shadow-md">
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              <span>Completed Today!</span>
            </div>
          ) : (
            <button
              onClick={() => {
                Sound.pop();
                onStartDailyChallenge();
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black text-sm sm:text-base shadow-lg shadow-amber-400/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Play className="w-4 h-4 fill-amber-950" />
              <span>Start Challenge</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
