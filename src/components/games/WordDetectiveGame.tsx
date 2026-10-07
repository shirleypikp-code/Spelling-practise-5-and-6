import React, { useState, useEffect } from 'react';
import { SpellingWord } from '../../types/spelling';
import { Sound } from '../../utils/sound';
import { Search, Volume2, ArrowRight, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WordDetectiveGameProps {
  words: SpellingWord[];
  onFinish: (score: number, masteredWordIds: string[]) => void;
  onExit: () => void;
}

interface MissingLetterScenario {
  prefix: string;
  missing: string;
  suffix: string;
  options: string[];
}

export const WordDetectiveGame: React.FC<WordDetectiveGameProps> = ({
  words,
  onFinish,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scenario, setScenario] = useState<MissingLetterScenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (currentWord) {
      setSelectedOption(null);
      // Select the primary tricky part
      const trickyPart = currentWord.trickyParts[0] || currentWord.word.slice(2, 4);
      const wordStr = currentWord.word.toLowerCase();
      const idx = wordStr.indexOf(trickyPart.toLowerCase());

      let prefix = '';
      let missing = trickyPart;
      let suffix = '';

      if (idx !== -1) {
        prefix = wordStr.slice(0, idx);
        suffix = wordStr.slice(idx + trickyPart.length);
      } else {
        // fallback mid slice
        const mid = Math.floor(wordStr.length / 2);
        prefix = wordStr.slice(0, mid - 1);
        missing = wordStr.slice(mid - 1, mid + 1);
        suffix = wordStr.slice(mid + 1);
      }

      // Generate 3 plausible alternatives
      const distractors: string[] = [];
      if (missing === 'cc') distractors.push('c', 'ck', 'k');
      else if (missing === 'mm') distractors.push('m', 'mn', 'nm');
      else if (missing === 'rr') distractors.push('r', 'rh', 'l');
      else if (missing === 'ss') distractors.push('s', 'sc', 'z');
      else if (missing === 'gg') distractors.push('g', 'j', 'dg');
      else if (missing === 'sc') distractors.push('s', 'c', 'sh');
      else if (missing === 'ie') distractors.push('ei', 'e', 'y');
      else if (missing === 'ei') distractors.push('ie', 'e', 'ai');
      else if (missing === 'y') distractors.push('i', 'e', 'ui');
      else if (missing === 'e') distractors.push('a', 'i', 'o');
      else if (missing === 'ou') distractors.push('u', 'o', 'au');
      else if (missing === 'au') distractors.push('aw', 'o', 'ou');
      else {
        // generic
        distractors.push(
          missing.slice(0, 1),
          missing.length > 1 ? missing[1] + missing[0] : missing + 'e',
          missing === 'a' ? 'e' : 'a'
        );
      }

      const options = Array.from(new Set([missing, ...distractors])).slice(0, 4);
      setScenario({
        prefix,
        missing,
        suffix,
        options: options.sort(() => Math.random() - 0.5),
      });
    }
  }, [currentIndex, currentWord]);

  const handleSelectOption = (opt: string) => {
    if (selectedOption || !scenario) return;
    setSelectedOption(opt);

    const isRight = opt === scenario.missing;
    if (isRight) {
      Sound.correct();
      const points = 110 + streak * 25;
      setScore((s) => s + points);
      setStreak((st) => st + 1);
      setMasteredIds((prev) => [...prev, currentWord.id]);
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
    } else {
      Sound.incorrect();
      setStreak(0);
    }
  };

  const handleNext = () => {
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
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm text-slate-500">
              Clue Case #{currentIndex + 1} of {words.length}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
              Word Detective
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium block">Score</span>
              <span className="text-base font-extrabold text-indigo-600">{score} XP</span>
            </div>
            {streak > 1 && (
              <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                {streak}x Streak 🕵️
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

        {/* Clue Prompt */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl mb-6 shadow-md text-center">
          <div className="flex items-center justify-center gap-2 mb-1 text-amber-400">
            <Search className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Solve the Tricky Letter Gap
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            {currentWord.definition}
          </p>

          <button
            onClick={() => {
              Sound.click();
              Sound.speakWord(currentWord.word);
            }}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Pronounce Word</span>
          </button>
        </div>

        {/* Word Display with Blank */}
        {scenario && (
          <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center mb-6">
            <div className="inline-flex items-center justify-center font-mono text-2xl sm:text-3xl font-black text-slate-900 tracking-wider">
              <span>{scenario.prefix}</span>
              <span
                className={`mx-1.5 px-3 py-1 rounded-xl border-2 transition-all ${
                  selectedOption
                    ? selectedOption === scenario.missing
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-800'
                      : 'border-rose-500 bg-rose-100 text-rose-800'
                    : 'border-amber-400 bg-amber-100 text-amber-900 animate-pulse'
                }`}
              >
                {selectedOption ? selectedOption : '_'.repeat(Math.max(2, scenario.missing.length))}
              </span>
              <span>{scenario.suffix}</span>
            </div>
          </div>
        )}

        {/* Detective Options */}
        {scenario && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {scenario.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              let style = 'bg-white border-2 border-slate-200 hover:border-indigo-400 text-slate-800 hover:bg-indigo-50/50';

              if (selectedOption) {
                if (opt === scenario.missing) {
                  style = 'bg-emerald-600 border-2 border-emerald-500 text-white shadow-md scale-105';
                } else if (isSelected && opt !== scenario.missing) {
                  style = 'bg-rose-600 border-2 border-rose-500 text-white shadow-md';
                } else {
                  style = 'bg-slate-100 border-slate-200 text-slate-400 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={!!selectedOption}
                  onClick={() => handleSelectOption(opt)}
                  className={`py-4 px-2 rounded-2xl font-mono text-xl sm:text-2xl font-black uppercase transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 ${style}`}
                >
                  <span>{opt}</span>
                  {selectedOption && opt === scenario.missing && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  )}
                  {selectedOption && isSelected && opt !== scenario.missing && (
                    <XCircle className="w-4 h-4 text-rose-200" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback explanation */}
        {selectedOption && scenario && (
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 animate-pop">
            <p className="text-sm font-bold mb-1">
              Complete Word: <strong className="text-indigo-900 text-base">{currentWord.displayWord}</strong>
            </p>
            <p className="text-xs text-indigo-800">
              💡 {currentWord.mnemonic}
            </p>
          </div>
        )}
      </div>

      {selectedOption && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
          >
            <span>{currentIndex + 1 < words.length ? 'Next Mystery' : 'Case Solved!'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
