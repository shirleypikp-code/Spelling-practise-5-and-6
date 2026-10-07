import React, { useState } from 'react';
import { UserProfile, AvatarBase, AvatarAccessory } from '../../types/spelling';
import { AvatarDisplay } from './AvatarDisplay';
import { Sound } from '../../utils/sound';
import { Sparkles, Check, X, Palette, Crown, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AvatarCustomizerProps {
  profile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
}

const BASES: { id: AvatarBase; name: string; emoji: string }[] = [
  { id: 'owl', name: 'Wise Owl', emoji: '🦉' },
  { id: 'robot', name: 'Cyber Bot', emoji: '🤖' },
  { id: 'cat', name: 'Smart Cat', emoji: '🐱' },
  { id: 'astronaut', name: 'Astro Speller', emoji: '🧑‍🚀' },
  { id: 'fox', name: 'Clever Fox', emoji: '🦊' },
  { id: 'wizard', name: 'Spell Wizard', emoji: '🧙‍♂️' },
  { id: 'superkid', name: 'Super Hero', emoji: '🦸' },
  { id: 'dino', name: 'Word-o-saur', emoji: '🦖' },
];

const BG_COLORS = [
  { hex: '#EEF2FF', name: 'Soft Indigo' },
  { hex: '#FEF3C7', name: 'Sunny Gold' },
  { hex: '#E0F2FE', name: 'Sky Breeze' },
  { hex: '#D1FAE5', name: 'Fresh Mint' },
  { hex: '#FCE7F3', name: 'Bubblegum' },
  { hex: '#FFEDD5', name: 'Warm Peach' },
  { hex: '#F3E8FF', name: 'Magic Violet' },
  { hex: '#CFFAFE', name: 'Cyan Glow' },
];

const ACCESSORIES: { id: AvatarAccessory; name: string; minStars: number }[] = [
  { id: 'none', name: 'None', minStars: 0 },
  { id: 'glasses', name: 'Study Glasses', minStars: 0 },
  { id: 'sunglasses', name: 'Cool Shades', minStars: 10 },
  { id: 'crown', name: 'Royal Crown', minStars: 30 },
  { id: 'headphones', name: 'DJ Headphones', minStars: 15 },
  { id: 'grad_cap', name: 'Graduation Cap', minStars: 25 },
  { id: 'star_badge', name: 'Star Badge', minStars: 20 },
  { id: 'detective_hat', name: 'Detective Hat', minStars: 18 },
  { id: 'bow', name: 'Cute Bow', minStars: 5 },
];

const FRAMES: { id: 'classic' | 'golden' | 'neon' | 'stars'; name: string; minLevel: number }[] = [
  { id: 'classic', name: 'Classic Silver', minLevel: 1 },
  { id: 'golden', name: 'Champion Gold', minLevel: 2 },
  { id: 'neon', name: 'Cyber Glow', minLevel: 3 },
  { id: 'stars', name: 'Cosmic Sparks', minLevel: 4 },
];

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({
  profile,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(profile.name);
  const [grade, setGrade] = useState<'Primary 5' | 'Primary 6'>(profile.grade);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [activeTab, setActiveTab] = useState<'character' | 'colors' | 'gear' | 'frame'>('character');

  const handleSave = () => {
    Sound.correct();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    onSave({
      name: name.trim() || 'Spelling Star',
      grade,
      avatar,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-pop my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h2 className="text-xl font-bold tracking-tight">Avatar Creator Studio</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Preview & Name input */}
        <div className="p-5 bg-gradient-to-b from-indigo-50/50 to-white flex flex-col items-center border-b border-slate-100">
          <div className="relative mb-3 group cursor-pointer" onClick={() => Sound.pop()}>
            <AvatarDisplay avatar={avatar} size="xl" showFrame={true} />
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
              {grade}
            </span>
          </div>

          <div className="w-full max-w-xs space-y-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Student Nickname
              </label>
              <input
                type="text"
                value={name}
                maxLength={18}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-center text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Grade Switch */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  Sound.click();
                  setGrade('Primary 5');
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  grade === 'Primary 5'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Primary 5
              </button>
              <button
                type="button"
                onClick={() => {
                  Sound.click();
                  setGrade('Primary 6');
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  grade === 'Primary 6'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Primary 6
              </button>
            </div>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-100 px-4 pt-2 gap-1 bg-slate-50/60 text-xs font-bold text-slate-600">
          <button
            onClick={() => {
              Sound.click();
              setActiveTab('character');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 cursor-pointer transition-all ${
              activeTab === 'character'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Smile className="w-3.5 h-3.5" /> Character
          </button>
          <button
            onClick={() => {
              Sound.click();
              setActiveTab('colors');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 cursor-pointer transition-all ${
              activeTab === 'colors'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Color
          </button>
          <button
            onClick={() => {
              Sound.click();
              setActiveTab('gear');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 cursor-pointer transition-all ${
              activeTab === 'gear'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5" /> Gear ({profile.stars}⭐)
          </button>
          <button
            onClick={() => {
              Sound.click();
              setActiveTab('frame');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 cursor-pointer transition-all ${
              activeTab === 'frame'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Frame
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-56 overflow-y-auto">
          {activeTab === 'character' && (
            <div className="grid grid-cols-4 gap-2.5">
              {BASES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    Sound.pop();
                    setAvatar((prev) => ({ ...prev, base: b.id }));
                  }}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                    avatar.base === b.id
                      ? 'border-indigo-600 bg-indigo-50 shadow-xs scale-105'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <AvatarDisplay
                    avatar={{ ...avatar, base: b.id, accessory: 'none', frame: 'classic' }}
                    size="sm"
                    showFrame={false}
                  />
                  <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">
                    {b.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="grid grid-cols-4 gap-3">
              {BG_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    Sound.pop();
                    setAvatar((prev) => ({ ...prev, bgColor: c.hex }));
                  }}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                    avatar.bgColor === c.hex
                      ? 'border-indigo-600 ring-2 ring-indigo-300'
                      : 'border-slate-100 hover:scale-105'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full border border-slate-300 shadow-inner flex items-center justify-center"
                    style={{ backgroundColor: c.hex }}
                  >
                    {avatar.bgColor === c.hex && <Check className="w-4 h-4 text-indigo-800" />}
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">{c.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'gear' && (
            <div className="grid grid-cols-3 gap-2.5">
              {ACCESSORIES.map((acc) => {
                const isUnlocked = profile.stars >= acc.minStars;
                return (
                  <button
                    key={acc.id}
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (isUnlocked) {
                        Sound.pop();
                        setAvatar((prev) => ({ ...prev, accessory: acc.id }));
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                      avatar.accessory === acc.id
                        ? 'border-indigo-600 bg-indigo-50 font-bold'
                        : isUnlocked
                        ? 'border-slate-100 hover:border-slate-200 bg-white'
                        : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800 mb-0.5">{acc.name}</span>
                    {isUnlocked ? (
                      <span className="text-[10px] text-emerald-600 font-semibold">Unlocked</span>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-semibold">
                        🔒 {acc.minStars} ⭐ needed
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'frame' && (
            <div className="grid grid-cols-2 gap-3">
              {FRAMES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    Sound.pop();
                    setAvatar((prev) => ({ ...prev, frame: f.id }));
                  }}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    avatar.frame === f.id
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-800">{f.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Stylized avatar aura</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Check className="w-4 h-4" /> Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
};
