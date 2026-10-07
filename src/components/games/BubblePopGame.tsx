import React, { useState, useEffect } from 'react';
import { SpellingWord } from '../../types/spelling';
import { Sound } from '../../utils/sound';
import { Sparkles, Zap, Volume2, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BubblePopGameProps {
  words: SpellingWord[];
  onFinish: (score: number, masteredWordIds: string[]) => void;
  onExit: () => void;
}

interface ChoiceOption {
  text: string;
  isCorrect: boolean;
  color: string;
}

const BUBBLE_COLORS = [
  'from-blue-500 to-indigo-600 border-blue-400 text-white',
  'from-emerald-500 to-teal-600 border-emerald-400 text-white',
  'from-purple-500 to-violet-600 border-purple-400 text-white',
  'from-amber-500 to-orange-600 border-amber-400 text-white',
];

export const BubblePopGame: React.FC<BubblePopGameProps> = ({
  words,
  onFinish,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<ChoiceOption[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (currentWord) {
      setSelectedChoice(null);
      // Combine 1 correct + 3 misspellings
      const options: ChoiceOption[] = [
        { text: currentWord.word, isCorrect: true, color: BUBBLE_COLORS[0] },
      ];

      // Add common misspellings
      const traps = [...currentWord.commonMisspellings];
      // If fewer than 3, add custom typos
      while (traps.length < 3) {
        if (currentWord.word.length > 5) {
          const mutated = currentWord.word.slice(0, 3) + currentWord.word.slice(4);
          if (!traps.includes(mutated) && mutated !== currentWord.word) {
            traps.push(mutated);
          } else {
            traps.push(currentWord.word + 'e');
          }
        }
      }

      traps.slice(0, 3).forEach((trap, idx) => {
        options.push({
          text: trap,
          isCorrect: false,
          color: BUBBLE_COLORS[(idx + 1) % BUBBLE_COLORS.length],
        });
      });

      // Shuffle options
      setChoices(options.sort(() => Math.random() - 0.5));
    }
  }, [currentIndex, currentWord]);

  const handleChoice = (option: ChoiceOption) => {
    if (selectedChoice) return;
    setSelectedChoice(option.text);

    if (option.isCorrect) {
      Sound.pop();
      Sound.correct();
      const points = 100 + combo * 30;
      setScore((s) => s + points);
      setCombo((c) => c + 1);
      setMasteredIds((prev) => [...prev, currentWord.id]);
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
      });
    } else {
      Sound.incorrect();
      setCombo(0);
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
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm text-slate-500">
              Round {currentIndex + 1} of {words.length}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              Bubble Pop
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium block">Score</span>
              <span className="text-base font-extrabold text-indigo-600">{score} XP</span>
            </div>
            {combo > 1 && (
              <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                {combo}x Pop Combo!
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

        {/* Prompt Card */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl text-white shadow-md mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h3 className="text-base sm:text-lg font-bold">Pop the Correctly Spelled Word!</h3>
          </div>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-md mx-auto">
            {currentWord.definition}
          </p>

          <button
            onClick={() => {
              Sound.click();
              Sound.speakWord(currentWord.word);
            }}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-xs transition-all cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Hear Target Word</span>
          </button>
        </div>

        {/* Floating Bubble Choices (2x2 Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6">
          {choices.map((option, idx) => {
            const isSelected = selectedChoice === option.text;
            let buttonStyle = `bg-gradient-to-r ${option.color} hover:scale-102 hover:shadow-lg border-2`;

            if (selectedChoice) {
              if (option.isCorrect) {
                buttonStyle =
                  'bg-emerald-600 border-emerald-400 text-white ring-4 ring-emerald-300 scale-102';
              } else if (isSelected && !option.isCorrect) {
                buttonStyle = 'bg-rose-600 border-rose-400 text-white ring-4 ring-rose-300';
              } else {
                buttonStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={!!selectedChoice}
                onClick={() => handleChoice(option)}
                className={`p-5 rounded-2xl font-black text-lg sm:text-xl tracking-wide shadow-md transition-all active:scale-95 cursor-pointer relative overflow-hidden text-center flex items-center justify-center min-h-[80px] ${buttonStyle}`}
              >
                {/* Bubble highlight reflection effect */}
                <div className="absolute top-1 left-2 w-8 h-3 rounded-full bg-white/20 -rotate-12 pointer-events-none" />

                <span>{option.text}</span>

                {selectedChoice && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 absolute right-4 text-emerald-200" />
                )}
                {selectedChoice && isSelected && !option.isCorrect && (
                  <XCircle className="w-5 h-5 absolute right-4 text-rose-200" />
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Explanation upon answering */}
        {selectedChoice && (
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 animate-pop">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-sm sm:text-base">
                {selectedChoice === currentWord.word
                  ? '🎯 Bullseye! Great eye!'
                  : '🔍 Watch out for this trap!'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium mb-1">
              Correct: <strong className="text-indigo-900 text-base">{currentWord.displayWord}</strong>
            </p>
            <p className="text-xs text-indigo-800 mb-2">
              Memory rule: {currentWord.mnemonic}
            </p>
            <p className="text-[11px] text-slate-500">
              Common trap(s) to avoid in exams: {currentWord.commonMisspellings.join(', ')}
            </p>
          </div>
        )}
      </div>

      {selectedChoice && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
          >
            <span>{currentIndex + 1 < words.length ? 'Next Round' : 'See Results'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
