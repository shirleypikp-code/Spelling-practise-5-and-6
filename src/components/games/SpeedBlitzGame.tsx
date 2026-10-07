import React, { useState, useEffect } from 'react';
import { SpellingWord } from '../../types/spelling';
import { Sound } from '../../utils/sound';
import { Timer, Zap, Check, X, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpeedBlitzGameProps {
  words: SpellingWord[];
  onFinish: (score: number, masteredWordIds: string[]) => void;
  onExit: () => void;
}

interface BlitzQuestion {
  wordObj: SpellingWord;
  displayText: string;
  isActuallyCorrect: boolean;
}

export const SpeedBlitzGame: React.FC<SpeedBlitzGameProps> = ({
  words,
  onFinish,
  onExit,
}) => {
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [questions, setQuestions] = useState<BlitzQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<'right' | 'wrong' | null>(null);

  // Prepare questions pool
  const setupGame = () => {
    const list: BlitzQuestion[] = [];
    // Duplicate pool to provide plenty of rapid fire items
    const shuffledWords = [...words, ...words].sort(() => Math.random() - 0.5);

    shuffledWords.forEach((w) => {
      const showCorrect = Math.random() > 0.5;
      if (showCorrect) {
        list.push({
          wordObj: w,
          displayText: w.word,
          isActuallyCorrect: true,
        });
      } else {
        const typo =
          w.commonMisspellings[Math.floor(Math.random() * w.commonMisspellings.length)] ||
          w.word + 'e';
        list.push({
          wordObj: w,
          displayText: typo,
          isActuallyCorrect: false,
        });
      }
    });

    setQuestions(list);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setTotalAnswered(0);
    setTimeLeft(45);
    setIsPlaying(true);
    setLastResult(null);
  };

  useEffect(() => {
    setupGame();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      Sound.fanfare();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const currentQ = questions[currentIndex];

  const handleAnswer = (userGuessCorrect: boolean) => {
    if (!isPlaying || !currentQ) return;

    const isMatch = userGuessCorrect === currentQ.isActuallyCorrect;
    setTotalAnswered((t) => t + 1);

    if (isMatch) {
      Sound.correct();
      setLastResult('right');
      const addPoints = 50 + streak * 15;
      setScore((s) => s + addPoints);
      setStreak((st) => st + 1);
      setCorrectCount((c) => c + 1);
      if (currentQ.isActuallyCorrect) {
        setMasteredIds((prev) => [...prev, currentQ.wordObj.id]);
      }
    } else {
      Sound.incorrect();
      setLastResult('wrong');
      setStreak(0);
    }

    // Advance to next question immediately
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setupGame();
    }
  };

  if (!isPlaying && timeLeft <= 0) {
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    return (
      <div className="w-full max-w-lg mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-slate-100 text-center animate-pop">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-9 h-9" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-1">Blitz Time's Up!</h2>
        <p className="text-xs text-slate-500 mb-6">Incredible lightning reflexes!</p>

        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl mb-6">
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase">Score</span>
            <span className="text-xl font-extrabold text-indigo-600">{score} XP</span>
          </div>
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase">Solved</span>
            <span className="text-xl font-extrabold text-slate-800">
              {correctCount}/{totalAnswered}
            </span>
          </div>
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase">Accuracy</span>
            <span className="text-xl font-extrabold text-emerald-600">{accuracy}%</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={setupGame}
            className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
          <button
            onClick={() => onFinish(score, masteredIds)}
            className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md cursor-pointer transition-all active:scale-95"
          >
            Collect XP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col justify-between min-h-[500px]">
      <div>
        {/* Top Timer & Score Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-xs sm:text-sm ${
                timeLeft <= 10
                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium block">Score</span>
              <span className="text-lg font-black text-indigo-600">{score} XP</span>
            </div>
            {streak > 1 && (
              <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                {streak}x Streak!
              </span>
            )}
            <button
              onClick={onExit}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Quit
            </button>
          </div>
        </div>

        {/* Time Progress bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft <= 10 ? 'bg-rose-500' : 'bg-amber-500'
            }`}
            style={{ width: `${(timeLeft / 45) * 100}%` }}
          />
        </div>

        {/* Big Word Card */}
        {currentQ && (
          <div
            className={`p-8 rounded-3xl border-2 text-center shadow-lg transition-all mb-8 ${
              lastResult === 'right'
                ? 'bg-emerald-50/70 border-emerald-200 ring-2 ring-emerald-300'
                : lastResult === 'wrong'
                ? 'bg-rose-50/70 border-rose-200 ring-2 ring-rose-300'
                : 'bg-gradient-to-b from-indigo-50/60 to-slate-50 border-indigo-100'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 block mb-2">
              Is this word spelled correctly?
            </span>

            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-wider font-mono py-2">
              {currentQ.displayText}
            </div>

            <p className="text-xs text-slate-500 mt-2 italic">
              Hint: {currentQ.wordObj.definition}
            </p>
          </div>
        )}
      </div>

      {/* Rapid Action Buttons */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <button
          onClick={() => handleAnswer(false)}
          className="py-5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-lg sm:text-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <X className="w-6 h-6 stroke-[3]" />
          <span>WRONG ❌</span>
        </button>

        <button
          onClick={() => handleAnswer(true)}
          className="py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-lg sm:text-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Check className="w-6 h-6 stroke-[3]" />
          <span>CORRECT ✅</span>
        </button>
      </div>
    </div>
  );
};
