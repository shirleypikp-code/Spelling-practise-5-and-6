import React, { useState, useEffect } from 'react';
import { SpellingWord } from '../../types/spelling';
import { Sound } from '../../utils/sound';
import { Volume2, Shuffle, RotateCcw, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LetterScrambleGameProps {
  words: SpellingWord[];
  onFinish: (score: number, masteredWordIds: string[]) => void;
  onExit: () => void;
}

interface TileItem {
  id: number;
  letter: string;
}

export const LetterScrambleGame: React.FC<LetterScrambleGameProps> = ({
  words,
  onFinish,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [availableTiles, setAvailableTiles] = useState<TileItem[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<TileItem[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (currentWord) {
      const letters = currentWord.word.toLowerCase().split('');
      // Shuffle letters ensuring it is not already in correct order
      let shuffled = [...letters];
      for (let i = 0; i < 5; i++) {
        shuffled = shuffled.sort(() => Math.random() - 0.5);
        if (shuffled.join('') !== currentWord.word.toLowerCase()) break;
      }
      setAvailableTiles(
        shuffled.map((letter, idx) => ({
          id: idx,
          letter,
        }))
      );
      setSelectedTiles([]);
      setIsAnswered(false);
      setIsCorrect(false);
    }
  }, [currentIndex, currentWord]);

  const handleTileSelect = (tile: TileItem) => {
    if (isAnswered) return;
    Sound.pop();
    setAvailableTiles((prev) => prev.filter((t) => t.id !== tile.id));
    const nextSelected = [...selectedTiles, tile];
    setSelectedTiles(nextSelected);

    // Auto check if all letters are placed
    if (nextSelected.length === currentWord.word.length) {
      checkSpelling(nextSelected);
    }
  };

  const handleReturnTile = (tile: TileItem) => {
    if (isAnswered) return;
    Sound.click();
    setSelectedTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setAvailableTiles((prev) => [...prev, tile]);
  };

  const checkSpelling = (tiles: TileItem[]) => {
    const spelled = tiles.map((t) => t.letter).join('');
    const right = spelled === currentWord.word.toLowerCase();
    setIsAnswered(true);
    setIsCorrect(right);

    if (right) {
      Sound.correct();
      const points = 120 + streak * 20;
      setScore((s) => s + points);
      setStreak((st) => st + 1);
      setMasteredIds((prev) => [...prev, currentWord.id]);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    } else {
      Sound.incorrect();
      setStreak(0);
    }
  };

  const handleShuffleAvailable = () => {
    Sound.click();
    setAvailableTiles((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const handleResetCurrent = () => {
    Sound.click();
    if (currentWord) {
      const allTiles = [...selectedTiles, ...availableTiles].sort(() => Math.random() - 0.5);
      setSelectedTiles([]);
      setAvailableTiles(allTiles);
      setIsAnswered(false);
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

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col justify-between min-h-[560px]">
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm text-slate-500">
              Puzzle {currentIndex + 1} of {words.length}
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
              <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                {streak}x Combo 🔥
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

        {/* Clue box */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <button
              onClick={() => {
                Sound.click();
                Sound.speakWord(currentWord.word);
              }}
              className="p-1.5 rounded-full bg-white hover:bg-purple-100 text-purple-700 shadow-xs cursor-pointer transition-all"
              title="Hear word"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
              Word Clue ({currentWord.partOfSpeech})
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-lg mx-auto">
            {currentWord.definition}
          </p>
        </div>

        {/* Selected Answer Slot Slots */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-slate-500">
              Your Answer ({selectedTiles.length}/{currentWord.word.length}):
            </span>
            {selectedTiles.length > 0 && !isAnswered && (
              <button
                onClick={handleResetCurrent}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 min-h-[64px] p-3 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200">
            {currentWord.word.split('').map((_, i) => {
              const tile = selectedTiles[i];
              return (
                <div
                  key={i}
                  onClick={() => tile && handleReturnTile(tile)}
                  className={`w-10 h-12 sm:w-12 sm:h-14 rounded-xl flex items-center justify-center text-lg sm:text-xl font-black uppercase transition-all select-none ${
                    tile
                      ? isAnswered
                        ? isCorrect
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-rose-500 text-white shadow-md'
                        : 'bg-indigo-600 text-white shadow-md hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-indigo-300'
                      : 'border-2 border-slate-200 bg-white/70 text-slate-300'
                  }`}
                >
                  {tile ? tile.letter : ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrambled Available Letter Blocks */}
        {!isAnswered ? (
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-slate-500">
                Tap letters in correct order:
              </span>
              <button
                onClick={handleShuffleAvailable}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer font-bold"
              >
                <Shuffle className="w-3.5 h-3.5" /> Shuffle
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
              {availableTiles.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => handleTileSelect(tile)}
                  className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl bg-white hover:bg-indigo-500 hover:text-white active:scale-90 text-slate-800 border-2 border-indigo-200 hover:border-indigo-500 shadow-sm font-black text-lg sm:text-xl uppercase transition-all cursor-pointer flex items-center justify-center"
                >
                  {tile.letter}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            className={`p-4 rounded-2xl border text-center animate-pop ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-2 font-bold text-base">
              <CheckCircle2
                className={`w-5 h-5 ${isCorrect ? 'text-emerald-600' : 'text-rose-500'}`}
              />
              <span>{isCorrect ? 'Spell Solved! Bravo!' : 'Not quite right!'}</span>
            </div>

            <div className="mb-2">
              <span className="text-2xl font-black text-slate-900 tracking-wider">
                {currentWord.displayWord}
              </span>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Syllables: {currentWord.syllables.join(' · ')}
              </p>
            </div>

            <p className="text-xs text-indigo-800 font-medium max-w-md mx-auto mb-3">
              💡 {currentWord.mnemonic}
            </p>

            <button
              onClick={handleNextWord}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>{currentIndex + 1 < words.length ? 'Next Anagram' : 'Finish Game'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>Tap any selected letter to return it to the tray</span>
        <span>Primary 5 &amp; 6 Standard</span>
      </div>
    </div>
  );
};
