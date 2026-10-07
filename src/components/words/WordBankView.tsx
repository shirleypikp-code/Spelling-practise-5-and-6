import React, { useState } from 'react';
import { SpellingWord, UserProfile } from '../../types/spelling';
import { Sound } from '../../utils/sound';
import { Volume2, Search, CheckCircle2, Star, Sparkles, BookOpen, Lightbulb, Play } from 'lucide-react';

interface WordBankViewProps {
  words: SpellingWord[];
  profile: UserProfile;
  onPracticeSingleWord: (word: SpellingWord) => void;
}

export const WordBankView: React.FC<WordBankViewProps> = ({
  words,
  profile,
  onPracticeSingleWord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Primary 5' | 'Primary 6' | 'Mastered' | 'To Learn'>('All');
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);

  const filteredWords = words.filter((w) => {
    const isMastered = profile.wordsMastered.includes(w.id);
    if (selectedFilter === 'Primary 5' && w.level !== 'Primary 5' && w.level !== 'Both') return false;
    if (selectedFilter === 'Primary 6' && w.level !== 'Primary 6' && w.level !== 'Both') return false;
    if (selectedFilter === 'Mastered' && !isMastered) return false;
    if (selectedFilter === 'To Learn' && isMastered) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        w.word.toLowerCase().includes(term) ||
        w.definition.toLowerCase().includes(term) ||
        w.syllables.join('').toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-xl border border-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Curriculum Word Bank ({words.length} Words)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Key vocabulary, tricky phonetics &amp; memory mnemonics for Primary 5 &amp; 6
          </p>
        </div>

        {/* Mastered progress counter */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-2xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-900">
            {profile.wordsMastered.length} of {words.length} Mastered
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search words, definitions, or tricky letters..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {(['All', 'Primary 5', 'Primary 6', 'Mastered', 'To Learn'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                Sound.click();
                setSelectedFilter(tab);
              }}
              className={`py-1.5 px-2.5 text-xs font-bold rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                selectedFilter === tab
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredWords.map((word) => {
          const isMastered = profile.wordsMastered.includes(word.id);
          const isExpanded = expandedWordId === word.id;

          return (
            <div
              key={word.id}
              className={`p-4 rounded-2xl border transition-all ${
                isMastered
                  ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      Sound.click();
                      Sound.speakWord(word.word);
                    }}
                    className="p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 cursor-pointer transition-all shadow-xs"
                    title="Pronounce word"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 capitalize tracking-wide">
                      {word.word}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <span>[{word.syllables.join(' · ')}]</span>
                      <span aria-hidden="true">&bull;</span>
                      <span className="italic">{word.partOfSpeech}</span>
                      <span aria-hidden="true">&bull;</span>
                      <span className="text-indigo-600 font-semibold">{word.level}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isMastered && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Mastered
                    </span>
                  )}
                  <button
                    onClick={() => {
                      Sound.pop();
                      onPracticeSingleWord(word);
                    }}
                    className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs transition-all active:scale-95"
                    title="Quick practice this word"
                  >
                    <Play className="w-3 h-3 fill-white" />
                  </button>
                </div>
              </div>

              {/* Definition */}
              <p className="text-xs text-slate-600 font-medium mb-2 line-clamp-2">
                {word.definition}
              </p>

              {/* Mnemonic Hint & Tricky Letters */}
              <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100/70 text-xs space-y-1">
                <div className="flex items-start gap-1.5 text-indigo-900 font-medium">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{word.mnemonic}</span>
                </div>

                <div className="text-[11px] text-slate-500 pt-0.5 flex items-center gap-1.5">
                  <span className="font-semibold text-rose-600">Tricky trap:</span>
                  <span className="line-through text-slate-400">
                    {word.commonMisspellings[0]}
                  </span>
                  <span>&rarr;</span>
                  <span className="font-bold text-emerald-700">{word.word}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="py-12 text-center text-slate-400">
          <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold">No words match your filter criteria.</p>
        </div>
      )}
    </div>
  );
};
