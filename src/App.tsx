import React, { useState, useEffect } from 'react';
import { SpellingWord, UserProfile, GameMode } from './types/spelling';
import { PRIMARY_SPELLING_WORDS } from './data/words';
import { loadUserProfile, saveUserProfile, getTodayDateString } from './utils/storage';
import { Sound } from './utils/sound';
import { AvatarDisplay } from './components/avatar/AvatarDisplay';
import { AvatarCustomizer } from './components/avatar/AvatarCustomizer';
import { PWAInstallButton } from './components/pwa/PWAInstallButton';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { ListenAndSpellGame } from './components/games/ListenAndSpellGame';
import { LetterScrambleGame } from './components/games/LetterScrambleGame';
import { BubblePopGame } from './components/games/BubblePopGame';
import { WordDetectiveGame } from './components/games/WordDetectiveGame';
import { SpeedBlitzGame } from './components/games/SpeedBlitzGame';
import { FriendDuelModal } from './components/games/FriendDuelModal';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { WordBankView } from './components/words/WordBankView';
import { DailyChallengeCard } from './components/daily/DailyChallengeCard';

import {
  Sparkles,
  Flame,
  Star,
  Trophy,
  BookOpen,
  Volume2,
  VolumeX,
  Swords,
  Gamepad2,
  CheckCircle2,
  Award,
  Zap,
  RotateCcw,
  Play,
  Heart,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(loadUserProfile);
  const [activeTab, setActiveTab] = useState<'games' | 'words' | 'leaderboard'>('games');
  const [activeGame, setActiveGame] = useState<GameMode | null>(null);
  const [showAvatarStudio, setShowAvatarStudio] = useState(false);
  const [showFriendDuel, setShowFriendDuel] = useState(false);
  const [gameResult, setGameResult] = useState<{ score: number; mastered: string[] } | null>(null);

  // Save profile changes automatically to localStorage
  useEffect(() => {
    saveUserProfile(profile);
  }, [profile]);

  // Derive Daily 5 Words based on current calendar date
  const todayStr = getTodayDateString();
  const dateHash = todayStr.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
  const dailyWords = [
    PRIMARY_SPELLING_WORDS[(dateHash + 0) % PRIMARY_SPELLING_WORDS.length],
    PRIMARY_SPELLING_WORDS[(dateHash + 3) % PRIMARY_SPELLING_WORDS.length],
    PRIMARY_SPELLING_WORDS[(dateHash + 7) % PRIMARY_SPELLING_WORDS.length],
    PRIMARY_SPELLING_WORDS[(dateHash + 11) % PRIMARY_SPELLING_WORDS.length],
    PRIMARY_SPELLING_WORDS[(dateHash + 15) % PRIMARY_SPELLING_WORDS.length],
  ];

  const isDailyCompleted = profile.lastActiveDate === todayStr;

  // Level computation (1 Level per 500 XP)
  const currentLevel = Math.max(1, Math.floor(profile.xp / 500) + 1);
  const currentLevelTitle =
    currentLevel >= 6
      ? 'Orthography Master 👑'
      : currentLevel >= 4
      ? 'Word Wizard 🧙'
      : currentLevel >= 2
      ? 'Spelling Scout 🌟'
      : 'Spelling Apprentice ✏️';

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleStartGame = (mode: GameMode) => {
    Sound.pop();
    setActiveGame(mode);
    setGameResult(null);
  };

  const handleStartDailyChallenge = () => {
    Sound.pop();
    // Launch Listen & Spell with the 5 daily words
    setActiveGame('listen-spell');
    setGameResult(null);
  };

  const handleFinishGame = (earnedXp: number, masteredWordIds: string[]) => {
    const earnedStars = Math.max(5, Math.floor(earnedXp / 40));

    // Update streak if today is newly recorded
    let newStreak = profile.streak;
    if (profile.lastActiveDate !== todayStr) {
      newStreak = profile.streak + 1;
    }

    // Merge mastered word ids
    const updatedMastered = Array.from(new Set([...profile.wordsMastered, ...masteredWordIds]));

    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + earnedXp,
      stars: prev.stars + earnedStars,
      streak: newStreak,
      lastActiveDate: todayStr,
      wordsMastered: updatedMastered,
    }));

    setGameResult({
      score: earnedXp,
      mastered: masteredWordIds,
    });
    setActiveGame(null);
    Sound.fanfare();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePracticeSingleWord = (word: SpellingWord) => {
    Sound.pop();
    setActiveTab('games');
    setActiveGame('listen-spell');
    setGameResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-slate-50 to-purple-50/40 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 py-2.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div
            onClick={() => {
              Sound.click();
              setActiveGame(null);
              setActiveTab('games');
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Spell<span className="text-indigo-600">Quest</span>
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md">
                  P5 &bull; P6
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Curriculum Spelling Champ
              </p>
            </div>
          </div>

          {/* Center / Right: Stats & Profile Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Daily Streak */}
            <div
              className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 sm:px-2.5 py-1 rounded-xl text-amber-900 font-bold text-xs shadow-2xs"
              title="Daily Active Streak"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{profile.streak}d</span>
            </div>

            {/* Stars Counter */}
            <div
              className="flex items-center gap-1 bg-indigo-50 border border-indigo-200/80 px-2 sm:px-2.5 py-1 rounded-xl text-indigo-900 font-bold text-xs shadow-2xs"
              title="Stars earned for Avatar Gear"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{profile.stars}</span>
            </div>

            {/* In-App PWA Install Button */}
            <PWAInstallButton />

            {/* Avatar Pill & Studio Opener */}
            <button
              onClick={() => {
                Sound.pop();
                setShowAvatarStudio(true);
              }}
              className="flex items-center gap-2 p-1 pr-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer transition-all active:scale-95"
              title="Customize Avatar & Profile"
            >
              <AvatarDisplay avatar={profile.avatar} size="sm" showFrame={false} />
              <div className="text-left hidden md:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight">
                  {profile.name}
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold">
                  Lv.{currentLevel} {profile.grade}
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-5">
        {/* If Game is Active: Render Game Component */}
        {activeGame ? (
          <div>
            {activeGame === 'listen-spell' && (
              <ListenAndSpellGame
                words={PRIMARY_SPELLING_WORDS}
                onFinish={handleFinishGame}
                onExit={() => setActiveGame(null)}
              />
            )}
            {activeGame === 'letter-scramble' && (
              <LetterScrambleGame
                words={PRIMARY_SPELLING_WORDS}
                onFinish={handleFinishGame}
                onExit={() => setActiveGame(null)}
              />
            )}
            {activeGame === 'bubble-pop' && (
              <BubblePopGame
                words={PRIMARY_SPELLING_WORDS}
                onFinish={handleFinishGame}
                onExit={() => setActiveGame(null)}
              />
            )}
            {activeGame === 'word-detective' && (
              <WordDetectiveGame
                words={PRIMARY_SPELLING_WORDS}
                onFinish={handleFinishGame}
                onExit={() => setActiveGame(null)}
              />
            )}
            {activeGame === 'speed-blitz' && (
              <SpeedBlitzGame
                words={PRIMARY_SPELLING_WORDS}
                onFinish={handleFinishGame}
                onExit={() => setActiveGame(null)}
              />
            )}
          </div>
        ) : (
          /* Normal Dashboard View */
          <div className="space-y-6">
            {/* Level Banner & Quick Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs gap-3">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => setShowAvatarStudio(true)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  <AvatarDisplay avatar={profile.avatar} size="md" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-slate-900">{profile.name}</h2>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      {currentLevelTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                    <span>{profile.grade}</span>
                    <span aria-hidden="true">&bull;</span>
                    <span>{profile.xp} Total XP</span>
                    <span aria-hidden="true">&bull;</span>
                    <span className="text-emerald-700 font-bold">
                      {profile.wordsMastered.length}/20 Words Mastered
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    Sound.pop();
                    setShowFriendDuel(true);
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-all active:scale-95"
                >
                  <Swords className="w-4 h-4" />
                  <span>Challenge Friends</span>
                </button>
                <button
                  onClick={() => {
                    Sound.pop();
                    setShowAvatarStudio(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                >
                  Edit Avatar
                </button>
              </div>
            </div>

            {/* Daily Challenge Hero Card */}
            <DailyChallengeCard
              profile={profile}
              dailyWords={dailyWords}
              isCompletedToday={isDailyCompleted}
              onStartDailyChallenge={handleStartDailyChallenge}
            />

            {/* Primary View Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    Sound.click();
                    setActiveTab('games');
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                    activeTab === 'games'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Mini Games</span>
                </button>

                <button
                  onClick={() => {
                    Sound.click();
                    setActiveTab('words');
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                    activeTab === 'words'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Word Bank (20)</span>
                </button>

                <button
                  onClick={() => {
                    Sound.click();
                    setActiveTab('leaderboard');
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                    activeTab === 'leaderboard'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Leaderboard</span>
                </button>
              </div>
            </div>

            {/* View 1: Mini Games Grid */}
            {activeTab === 'games' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Choose Your Spelling Mini Game
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    All games run 100% offline
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Game 1: Listen & Spell */}
                  <div
                    onClick={() => handleStartGame('listen-spell')}
                    className="p-5 rounded-3xl bg-white border-2 border-indigo-100 hover:border-indigo-500 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Volume2 className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                          Spelling Bee
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        Listen &amp; Spell
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        Listen to the word spoken aloud, check context sentences, and type the
                        accurate spelling with instant hints!
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                      <span>Practice Phonetics</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Game 2: Letter Scramble */}
                  <div
                    onClick={() => handleStartGame('letter-scramble')}
                    className="p-5 rounded-3xl bg-white border-2 border-purple-100 hover:border-purple-500 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                          Anagram Quest
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                        Letter Scramble
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        Tap and assemble scrambled letter tiles into the correct sequence using
                        syllable and definition clues!
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
                      <span>Build Words</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Game 3: Bubble Pop Ninja */}
                  <div
                    onClick={() => handleStartGame('bubble-pop')}
                    className="p-5 rounded-3xl bg-white border-2 border-emerald-100 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Zap className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                          Spot The Imposter
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                        Word Bubble Pop
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        3 bubbles are tricky common misspellings; only 1 is correct! Pop the right
                        bubble to maintain your combo!
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                      <span>Trap Recognition</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Game 4: Word Detective */}
                  <div
                    onClick={() => handleStartGame('word-detective')}
                    className="p-5 rounded-3xl bg-white border-2 border-amber-100 hover:border-amber-500 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Award className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                          Tricky Letters
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                        Word Detective
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        Solve missing double consonants (cc, mm, rr, ss) and silent letters that
                        frequently trip students up in exams!
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                      <span>Crack The Code</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Game 5: Speed Blitz */}
                  <div
                    onClick={() => handleStartGame('speed-blitz')}
                    className="p-5 rounded-3xl bg-white border-2 border-rose-100 hover:border-rose-500 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Flame className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                          45s Lightning
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                        Speed Blitz
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        Rapid-fire True/False challenge! Test your instant orthographic memory
                        before the timer hits zero!
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
                      <span>Race The Clock</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Game 6: Friend Duel Card */}
                  <div
                    onClick={() => setShowFriendDuel(true)}
                    className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 to-purple-900 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition-transform">
                          <Swords className="w-6 h-6 text-amber-300" />
                        </div>
                        <span className="text-xs font-black text-amber-300 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-xs">
                          2-Player Duel
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                        Challenge Friends
                      </h4>
                      <p className="text-xs text-indigo-200 font-medium mt-1 leading-relaxed">
                        Pass &amp; play on this device with a classmate or share challenge codes to
                        see who scores highest!
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold text-amber-300">
                      <span>Start Showdown</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View 2: Word Bank View */}
            {activeTab === 'words' && (
              <WordBankView
                words={PRIMARY_SPELLING_WORDS}
                profile={profile}
                onPracticeSingleWord={handlePracticeSingleWord}
              />
            )}

            {/* View 3: Leaderboard View */}
            {activeTab === 'leaderboard' && (
              <LeaderboardView
                profile={profile}
                onOpenChallenge={() => setShowFriendDuel(true)}
              />
            )}
          </div>
        )}

        {/* Game Result Celebration Dialog */}
        {gameResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-pop">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center border border-slate-100">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">Practice Complete!</h3>
              <p className="text-xs text-slate-500 mb-4">You did a fantastic job!</p>

              <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50 rounded-2xl mb-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">XP Earned</span>
                  <span className="text-xl font-black text-indigo-700">+{gameResult.score} XP</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Stars</span>
                  <span className="text-xl font-black text-amber-500">
                    +{Math.max(5, Math.floor(gameResult.score / 40))} ⭐
                  </span>
                </div>
              </div>

              <button
                onClick={() => setGameResult(null)}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md cursor-pointer transition-all active:scale-95"
              >
                Continue Adventure
              </button>
            </div>
          </div>
        )}

        {/* Avatar Customizer Studio Modal */}
        {showAvatarStudio && (
          <AvatarCustomizer
            profile={profile}
            onSave={handleUpdateProfile}
            onClose={() => setShowAvatarStudio(false)}
          />
        )}

        {/* Friend Duel Modal */}
        {showFriendDuel && (
          <FriendDuelModal
            words={PRIMARY_SPELLING_WORDS}
            profile={profile}
            onClose={() => setShowFriendDuel(false)}
          />
        )}
      </main>

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
}
