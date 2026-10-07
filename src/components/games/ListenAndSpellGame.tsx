import React, { useState, useEffect, useRef } from 'react';
import { SpellingWord } from '../../types/spelling';
import { Sound } from '../../utils/sound';
import { Volume2, VolumeX, Lightbulb, HelpCircle, CheckCircle2, RotateCcw, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ListenAndSpellGameProps {
  words: SpellingWord[];
  onFinish: (score: number, masteredWordIds: string[]) => void;
  onExit: () => void;
}

export const ListenAndSpellGame: React.FC<ListenAndSpellGameProps> = ({
  words,
  onFinish,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSentence, setShowSentence] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (currentWord) {
      setUserInput('');
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
      setShowSentence(false);
      // Auto speak word once
      const timer = setTimeout(() => {
        Sound.speakWord(currentWord.word);
        if (inputRef.current) inputRef.current.focus();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentWord]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAnswered || !userInput.trim()) return;

    const cleanInput = userInput.trim().toLowerCase();
    const isRight = cleanInput === currentWord.word.toLowerCase();

    setIsAnswered(true);
    setIsCorrect(isRight);

    if (isRight) {
      Sound.correct();
      const points = 100 + streak * 25 + (showHint ? 0 : 30);
      setScore((s) => s + points);
      setStreak((st) => st + 1);
      setMasteredIds((prev) => [...prev, currentWord.id]);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      Sound.incorrect();
      setStreak(0);
    }
  };

  const handleNextWord = () => {
    Sound.click();
    if (currentIndex + 1 < words.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      Sound.fanfare();
      onFinish(score, masteredIds);
    }
  };

  // On-screen keyboard keys for touch devices (younger students on iPads/tablets)
  const KEYBOARD_ROWS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];

  const handleKeyClick = (char: string) => {
    if (isAnswered) return;
    Sound.click();
    setUserInput((prev) => prev + char);
  };

  const handleBackspace = () => {
    if (isAnswered) return;
    Sound.click();
    setUserInput((prev) => prev.slice(0, -1));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col justify-between min-h-[560px]">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm text-slate-500">
              Word {currentIndex + 1} of {words.length}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {currentWord.level}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium block">Score</span>
              <span className="text-base font-extrabold text-indigo-600">{score} XP</span>
            </div>
            {streak > 1 && (
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                <span className="text-xs font-black text-amber-700">{streak}x Streak 🔥</span>
              </div>
            )}
            <button
              onClick={onExit}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Quit
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>

        {/* Audio Center Station */}
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-50/70 to-blue-50/40 rounded-2xl border border-indigo-100/70 mb-5 text-center">
          <p className="text-xs font-bold text-indigo-700 tracking-wider uppercase mb-2">
            Listen carefully to the word:
          </p>

          <div className="flex items-center gap-3 mb-3">
            <button
              type="button"
              onClick={() => {
                Sound.click();
                Sound.speakWord(currentWord.word);
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold px-5 py-3 rounded-2xl shadow-md shadow-indigo-300/40 transition-all cursor-pointer"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>Hear Word</span>
            </button>

            <button
              type="button"
              onClick={() => {
                Sound.click();
                Sound.speakWord(currentWord.word, true);
              }}
              className="flex items-center gap-1.5 bg-white hover:bg-indigo-50 text-indigo-700 font-semibold px-4 py-3 rounded-2xl border border-indigo-200 shadow-xs transition-all cursor-pointer text-xs sm:text-sm"
              title="Hear word pronounced slowly with clear syllables"
            >
              <span>Slow (0.6x)</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                Sound.click();
                setShowSentence(!showSentence);
                if (!showSentence) {
                  Sound.speakSentence(currentWord.sentence, currentWord.word);
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200 cursor-pointer font-medium transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>{showSentence ? 'Hide Sentence' : 'Sentence Clue'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                Sound.click();
                setShowHint(!showHint);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200 cursor-pointer font-medium transition-all"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{showHint ? 'Hide Hint' : 'Memory Trick'}</span>
            </button>
          </div>

          {/* Expanded clues */}
          {showSentence && (
            <div className="mt-3 p-3 bg-white rounded-xl border border-indigo-100 text-xs sm:text-sm text-slate-700 max-w-md animate-pop">
              <span className="font-bold text-indigo-700">Example: </span>
              "{currentWord.sentence.replace(/\{\{word\}\}/gi, '_______')}"
            </div>
          )}

          {showHint && (
            <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 max-w-md animate-pop">
              <span className="font-bold">Mnemonic: </span>
              {currentWord.mnemonic}
            </div>
          )}
        </div>

        {/* Spelling Input Box */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              disabled={isAnswered}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.toLowerCase())}
              placeholder="Type your spelling here..."
              className={`w-full text-center text-xl sm:text-2xl font-bold tracking-widest py-3.5 px-4 rounded-2xl border-2 transition-all focus:outline-hidden ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-rose-500 bg-rose-50 text-rose-900'
                  : 'border-indigo-200 focus:border-indigo-600 bg-white text-slate-900 shadow-inner'
              }`}
            />
          </div>

          {!isAnswered ? (
            <button
              type="submit"
              disabled={!userInput.trim()}
              className="mt-3 w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-base shadow-md cursor-pointer transition-all active:scale-98"
            >
              Check Spelling
            </button>
          ) : null}
        </form>

        {/* Feedback Area */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border mb-4 animate-pop ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-5 h-5 ${isCorrect ? 'text-emerald-600' : 'text-rose-500'}`}
                />
                <span className="font-bold text-sm sm:text-base">
                  {isCorrect ? 'Outstanding! Correct!' : 'Good try! Here is the correct spelling:'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-baseline gap-2 mb-2">
              <span className="text-xl sm:text-2xl font-black tracking-wide text-slate-900">
                {currentWord.displayWord}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                [{currentWord.syllables.join(' · ')}]
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-1">
              <strong className="text-slate-800">Definition:</strong> {currentWord.definition}
            </p>
            <p className="text-xs text-indigo-700 font-medium">
              💡 {currentWord.mnemonic}
            </p>

            <button
              onClick={handleNextWord}
              className="mt-3 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>{currentIndex + 1 < words.length ? 'Next Word' : 'See Results'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Touch Screen Virtual Keyboard for Mobile / Tablet Users */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="space-y-1.5 select-none">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
              {row.map((char) => (
                <button
                  key={char}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleKeyClick(char)}
                  className="w-8 h-10 sm:w-10 sm:h-11 rounded-lg bg-slate-100 hover:bg-indigo-100 active:bg-indigo-200 disabled:opacity-40 text-slate-800 font-bold text-sm uppercase shadow-2xs border border-slate-200 transition-all cursor-pointer flex items-center justify-center"
                >
                  {char}
                </button>
              ))}
              {rIdx === 2 && (
                <button
                  type="button"
                  disabled={isAnswered || !userInput}
                  onClick={handleBackspace}
                  className="px-2.5 h-10 sm:h-11 rounded-lg bg-rose-100 hover:bg-rose-200 active:bg-rose-300 disabled:opacity-40 text-rose-800 font-bold text-xs shadow-2xs border border-rose-200 transition-all cursor-pointer flex items-center justify-center"
                >
                  ⌫
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
