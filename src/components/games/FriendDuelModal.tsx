import React, { useState } from 'react';
import { SpellingWord, UserProfile } from '../../types/spelling';
import { AvatarDisplay } from '../avatar/AvatarDisplay';
import { Sound } from '../../utils/sound';
import { Swords, Copy, Check, Users, ArrowRight, Trophy, Sparkles, Volume2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FriendDuelModalProps {
  words: SpellingWord[];
  profile: UserProfile;
  onClose: () => void;
}

export const FriendDuelModal: React.FC<FriendDuelModalProps> = ({
  words,
  profile,
  onClose,
}) => {
  const [duelMode, setDuelMode] = useState<'lobby' | 'pass-and-play' | 'challenge-code'>('lobby');
  const [friendName, setFriendName] = useState('Alex');
  const [copiedCode, setCopiedCode] = useState(false);

  // 2-Player Pass and Play State
  const [duelWords, setDuelWords] = useState<SpellingWord[]>([]);
  const [round, setRound] = useState(0); // 0 to 5
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [pInput, setPInput] = useState('');
  const [pAnswered, setPAnswered] = useState(false);
  const [pIsCorrect, setPIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startPassAndPlay = () => {
    Sound.pop();
    const selected = [...words].sort(() => Math.random() - 0.5).slice(0, 6);
    setDuelWords(selected);
    setRound(0);
    setActivePlayer(1);
    setP1Score(0);
    setP2Score(0);
    setPInput('');
    setPAnswered(false);
    setGameOver(false);
    setDuelMode('pass-and-play');
  };

  const handleDuelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pAnswered || !pInput.trim() || !duelWords[round]) return;

    const currentW = duelWords[round];
    const isRight = pInput.trim().toLowerCase() === currentW.word.toLowerCase();
    setPAnswered(true);
    setPIsCorrect(isRight);

    if (isRight) {
      Sound.correct();
      if (activePlayer === 1) setP1Score((s) => s + 100);
      else setP2Score((s) => s + 100);
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
    } else {
      Sound.incorrect();
    }
  };

  const handleNextTurn = () => {
    Sound.click();
    setPInput('');
    setPAnswered(false);

    if (activePlayer === 1) {
      setActivePlayer(2);
    } else {
      // both finished this round's word
      if (round + 1 < duelWords.length) {
        setRound((r) => r + 1);
        setActivePlayer(1);
      } else {
        setGameOver(true);
        Sound.fanfare();
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
      }
    }
  };

  const challengeCode = `SPELL-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleCopyCode = () => {
    Sound.click();
    navigator.clipboard.writeText(`Hey! Challenge me on SpellQuest Primary 5/6! My challenge code is ${challengeCode}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-pop my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-300" />
            <h2 className="text-xl font-black">Challenge Friends</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {duelMode === 'lobby' && (
          <div className="p-6 space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 text-center">
              Test your spelling power against your classmates or friends!
            </p>

            {/* Mode 1: Pass & Play Duel */}
            <div className="p-4 rounded-2xl border-2 border-indigo-100 bg-indigo-50/40 hover:border-indigo-300 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pass &amp; Play 2-Player Duel</h3>
                  <p className="text-[11px] text-slate-500">
                    Play turn-by-turn together on this device!
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={friendName}
                  maxLength={15}
                  onChange={(e) => setFriendName(e.target.value)}
                  placeholder="Friend's name (e.g. Alex)"
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={startPassAndPlay}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  Start Duel!
                </button>
              </div>
            </div>

            {/* Mode 2: Share Challenge Code */}
            <div className="p-4 rounded-2xl border-2 border-amber-100 bg-amber-50/40 hover:border-amber-300 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Classroom Challenge Code</h3>
                  <p className="text-[11px] text-slate-500">
                    Share a seed code so friends practice the exact same 5 words!
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-200">
                <span className="font-mono text-sm font-black text-amber-900 flex-1 pl-2">
                  {challengeCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mode Pass & Play Game screen */}
        {duelMode === 'pass-and-play' && !gameOver && duelWords[round] && (
          <div className="p-6">
            {/* Scoreboard bar */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-4 text-center">
              <div
                className={`p-2 rounded-xl transition-all ${
                  activePlayer === 1
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-slate-700'
                }`}
              >
                <span className="text-[10px] font-bold block uppercase">
                  Player 1: {profile.name}
                </span>
                <span className="text-lg font-black">{p1Score} XP</span>
              </div>
              <div
                className={`p-2 rounded-xl transition-all ${
                  activePlayer === 2
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white text-slate-700'
                }`}
              >
                <span className="text-[10px] font-bold block uppercase">
                  Player 2: {friendName || 'Alex'}
                </span>
                <span className="text-lg font-black">{p2Score} XP</span>
              </div>
            </div>

            <div className="text-center mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Round {round + 1} of {duelWords.length} &bull; Turn:{' '}
                <strong className={activePlayer === 1 ? 'text-indigo-600' : 'text-rose-600'}>
                  {activePlayer === 1 ? profile.name : friendName}
                </strong>
              </span>
            </div>

            {/* Audio & clue */}
            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-center mb-4">
              <p className="text-xs text-indigo-700 font-semibold mb-2">
                Clue: {duelWords[round].definition}
              </p>
              <button
                type="button"
                onClick={() => {
                  Sound.click();
                  Sound.speakWord(duelWords[round].word);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Volume2 className="w-4 h-4" /> Listen to Word
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleDuelSubmit} className="space-y-3">
              <input
                type="text"
                autoFocus
                disabled={pAnswered}
                value={pInput}
                onChange={(e) => setPInput(e.target.value.toLowerCase())}
                placeholder={`${activePlayer === 1 ? profile.name : friendName}, spell the word...`}
                className={`w-full py-3 px-4 rounded-xl text-center text-lg font-black tracking-wider border-2 focus:outline-hidden ${
                  pAnswered
                    ? pIsCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-rose-500 bg-rose-50 text-rose-900'
                    : 'border-slate-200 focus:border-indigo-600'
                }`}
              />

              {!pAnswered ? (
                <button
                  type="submit"
                  disabled={!pInput.trim()}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  Submit Spelling
                </button>
              ) : (
                <div className="space-y-2">
                  <div
                    className={`p-2.5 rounded-xl text-center text-xs font-bold ${
                      pIsCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                    }`}
                  >
                    {pIsCorrect ? '✅ Correct! (+100 XP)' : `❌ Correct was: ${duelWords[round].displayWord}`}
                  </div>
                  <button
                    type="button"
                    onClick={handleNextTurn}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Pass to {activePlayer === 1 ? friendName : profile.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Game Over Screen */}
        {duelMode === 'pass-and-play' && gameOver && (
          <div className="p-6 text-center animate-pop">
            <Trophy className="w-14 h-14 text-amber-500 mx-auto mb-2" />
            <h3 className="text-2xl font-black text-slate-900 mb-1">
              {p1Score > p2Score
                ? `🏆 ${profile.name} Wins the Duel!`
                : p2Score > p1Score
                ? `🏆 ${friendName} Wins the Duel!`
                : '🤝 Outstanding Draw! Both are Champs!'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Final Score: {p1Score} XP vs {p2Score} XP
            </p>

            <div className="flex gap-2">
              <button
                onClick={startPassAndPlay}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer"
              >
                Rematch!
              </button>
              <button
                onClick={() => setDuelMode('lobby')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer"
              >
                Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
