import React from 'react';
import { AvatarConfig } from '../../types/spelling';

interface AvatarDisplayProps {
  avatar: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showFrame?: boolean;
  className?: string;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatar,
  size = 'md',
  showFrame = true,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const frameClasses = {
    classic: 'ring-2 ring-slate-200 shadow-sm',
    golden: 'ring-4 ring-amber-400 shadow-amber-300/50 shadow-md',
    neon: 'ring-4 ring-cyan-400 shadow-cyan-300/50 shadow-md',
    stars: 'ring-4 ring-fuchsia-400 shadow-fuchsia-300/50 shadow-md',
  };

  const renderBase = () => {
    switch (avatar.base) {
      case 'owl':
        return (
          <g>
            {/* Owl body & ears */}
            <circle cx="50" cy="55" r="32" fill="#8B5CF6" />
            <polygon points="30,30 42,12 45,35" fill="#7C3AED" />
            <polygon points="70,30 58,12 55,35" fill="#7C3AED" />
            {/* Tummy */}
            <circle cx="50" cy="62" r="20" fill="#DDD6FE" />
            {/* Big Eyes */}
            <circle cx="38" cy="48" r="11" fill="#FFFFFF" stroke="#6D28D9" strokeWidth="2" />
            <circle cx="62" cy="48" r="11" fill="#FFFFFF" stroke="#6D28D9" strokeWidth="2" />
            <circle cx="39" cy="48" r="5" fill="#1E1B4B" />
            <circle cx="61" cy="48" r="5" fill="#1E1B4B" />
            <circle cx="41" cy="46" r="2" fill="#FFFFFF" />
            <circle cx="63" cy="46" r="2" fill="#FFFFFF" />
            {/* Beak */}
            <polygon points="50,53 46,62 54,62" fill="#F59E0B" />
          </g>
        );

      case 'robot':
        return (
          <g>
            {/* Antenna */}
            <line x1="50" y1="12" x2="50" y2="25" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="11" r="5" fill="#EF4444" />
            {/* Head */}
            <rect x="22" y="24" width="56" height="52" rx="14" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
            {/* Screen Visor */}
            <rect x="29" y="34" width="42" height="24" rx="8" fill="#0F172A" />
            {/* Pixel Eyes */}
            <circle cx="39" cy="45" r="4" fill="#38BDF8" />
            <circle cx="61" cy="45" r="4" fill="#38BDF8" />
            {/* Mouth grill */}
            <line x1="38" y1="64" x2="62" y2="64" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
            {/* Bolt ears */}
            <rect x="16" y="42" width="6" height="14" rx="2" fill="#94A3B8" />
            <rect x="78" y="42" width="6" height="14" rx="2" fill="#94A3B8" />
          </g>
        );

      case 'cat':
        return (
          <g>
            {/* Ears */}
            <polygon points="26,36 20,15 42,26" fill="#F97316" />
            <polygon points="28,33 24,19 39,26" fill="#FDBA74" />
            <polygon points="74,36 80,15 58,26" fill="#F97316" />
            <polygon points="72,33 76,19 61,26" fill="#FDBA74" />
            {/* Head */}
            <circle cx="50" cy="54" r="30" fill="#FB923C" />
            {/* Eyes */}
            <ellipse cx="38" cy="48" rx="6" ry="8" fill="#15803D" />
            <ellipse cx="62" cy="48" rx="6" ry="8" fill="#15803D" />
            <ellipse cx="38" cy="48" rx="2.5" ry="6" fill="#052E16" />
            <ellipse cx="62" cy="48" rx="2.5" ry="6" fill="#052E16" />
            <circle cx="39" cy="45" r="1.5" fill="#FFFFFF" />
            <circle cx="63" cy="45" r="1.5" fill="#FFFFFF" />
            {/* Nose & Mouth */}
            <polygon points="50,57 47,60 53,60" fill="#F43F5E" />
            <path d="M46 62 Q50 66 50 61 Q50 66 54 62" stroke="#7C2D12" strokeWidth="2" fill="none" />
            {/* Whiskers */}
            <line x1="20" y1="56" x2="34" y2="58" stroke="#7C2D12" strokeWidth="1.5" />
            <line x1="20" y1="62" x2="34" y2="62" stroke="#7C2D12" strokeWidth="1.5" />
            <line x1="80" y1="56" x2="66" y2="58" stroke="#7C2D12" strokeWidth="1.5" />
            <line x1="80" y1="62" x2="66" y2="62" stroke="#7C2D12" strokeWidth="1.5" />
          </g>
        );

      case 'astronaut':
        return (
          <g>
            {/* Helmet */}
            <circle cx="50" cy="52" r="32" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
            {/* Golden reflective visor */}
            <ellipse cx="50" cy="52" rx="24" ry="19" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <ellipse cx="50" cy="52" rx="22" ry="17" fill="url(#astroVisor)" />
            {/* Visor Glint */}
            <path d="M36 44 Q50 36 64 42" stroke="#FEF3C7" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
            {/* Base collar */}
            <rect x="32" y="76" width="36" height="10" rx="4" fill="#0EA5E9" />
          </g>
        );

      case 'fox':
        return (
          <g>
            {/* Ears */}
            <polygon points="24,35 18,12 44,24" fill="#EA580C" />
            <polygon points="26,30 22,17 38,24" fill="#FEF08A" />
            <polygon points="76,35 82,12 56,24" fill="#EA580C" />
            <polygon points="74,30 78,17 62,24" fill="#FEF08A" />
            {/* Face */}
            <circle cx="50" cy="54" r="30" fill="#F97316" />
            {/* Cheeks */}
            <path d="M22 56 C26 76, 50 82, 50 82 C50 82, 74 76, 78 56 Z" fill="#FFFBEB" />
            {/* Eyes */}
            <ellipse cx="37" cy="47" rx="5" ry="6" fill="#1C1917" />
            <ellipse cx="63" cy="47" rx="5" ry="6" fill="#1C1917" />
            <circle cx="39" cy="45" r="1.8" fill="#FFFFFF" />
            <circle cx="65" cy="45" r="1.8" fill="#FFFFFF" />
            {/* Cute black nose */}
            <ellipse cx="50" cy="67" rx="4" ry="3" fill="#1C1917" />
          </g>
        );

      case 'wizard':
        return (
          <g>
            {/* Robe & Head */}
            <circle cx="50" cy="54" r="28" fill="#FED7AA" />
            {/* Beard */}
            <path d="M30 62 C34 84, 50 88, 50 88 C50 88, 66 84, 70 62 C62 68, 38 68, 30 62 Z" fill="#E2E8F0" />
            {/* Kind Eyes & Eyebrows */}
            <path d="M34 44 Q40 40 46 44" stroke="#64748B" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M54 44 Q60 40 66 44" stroke="#64748B" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="49" r="3.5" fill="#1E293B" />
            <circle cx="60" cy="49" r="3.5" fill="#1E293B" />
            {/* Wizard Pointy Hat */}
            <polygon points="50,6 20,38 80,38" fill="#6366F1" />
            <ellipse cx="50" cy="38" rx="34" ry="7" fill="#4F46E5" />
            <polygon points="50,22 53,28 59,28 54,32 56,38 50,34 44,38 46,32 41,28 47,28" fill="#FBBF24" />
          </g>
        );

      case 'superkid':
        return (
          <g>
            {/* Cape behind */}
            <path d="M26 65 L14 88 L34 82 Z" fill="#EF4444" />
            <path d="M74 65 L86 88 L66 82 Z" fill="#EF4444" />
            {/* Head */}
            <circle cx="50" cy="52" r="28" fill="#FED7AA" />
            {/* Hair */}
            <path d="M22 45 C24 24, 76 24, 78 45 C70 32, 60 30, 50 36 C40 30, 30 32, 22 45 Z" fill="#451A03" />
            {/* Superhero Domino Mask */}
            <path d="M26 44 Q50 49 74 44 Q68 59 50 56 Q32 59 26 44 Z" fill="#2563EB" />
            <ellipse cx="38" cy="49" rx="4" ry="4" fill="#FFFFFF" />
            <ellipse cx="62" cy="49" rx="4" ry="4" fill="#FFFFFF" />
            <circle cx="39" cy="49" r="2.2" fill="#0F172A" />
            <circle cx="63" cy="49" r="2.2" fill="#0F172A" />
            {/* Big confident smile */}
            <path d="M42 62 Q50 69 58 62" stroke="#B45309" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'dino':
      default:
        return (
          <g>
            {/* Dino spikes */}
            <polygon points="46,16 54,16 50,8" fill="#15803D" />
            <polygon points="34,22 42,22 38,14" fill="#15803D" />
            <polygon points="24,32 30,32 26,24" fill="#15803D" />
            {/* Head */}
            <circle cx="50" cy="54" r="30" fill="#22C55E" />
            {/* Cheerful snout */}
            <rect x="44" y="48" width="28" height="20" rx="10" fill="#4ADE80" />
            <circle cx="64" cy="54" r="2.5" fill="#166534" />
            {/* Big Dino Eye */}
            <circle cx="40" cy="43" r="8" fill="#FFFFFF" stroke="#166534" strokeWidth="2" />
            <circle cx="41" cy="43" r="4.5" fill="#14532D" />
            <circle cx="43" cy="41" r="1.5" fill="#FFFFFF" />
            {/* Friendly tooth */}
            <polygon points="56,66 60,60 64,66" fill="#FFFFFF" />
          </g>
        );
    }
  };

  const renderAccessory = () => {
    switch (avatar.accessory) {
      case 'glasses':
        return (
          <g>
            <circle cx="38" cy="48" r="9" fill="none" stroke="#0F172A" strokeWidth="3" />
            <circle cx="62" cy="48" r="9" fill="none" stroke="#0F172A" strokeWidth="3" />
            <line x1="47" y1="48" x2="53" y2="48" stroke="#0F172A" strokeWidth="3" />
            <line x1="29" y1="46" x2="21" y2="42" stroke="#0F172A" strokeWidth="2.5" />
            <line x1="71" y1="46" x2="79" y2="42" stroke="#0F172A" strokeWidth="2.5" />
          </g>
        );

      case 'sunglasses':
        return (
          <g>
            <rect x="28" y="42" width="19" height="12" rx="4" fill="#0F172A" />
            <rect x="53" y="42" width="19" height="12" rx="4" fill="#0F172A" />
            <line x1="47" y1="45" x2="53" y2="45" stroke="#0F172A" strokeWidth="3" />
            <line x1="30" y1="45" x2="43" y2="50" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="55" y1="45" x2="68" y2="50" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case 'crown':
        return (
          <g>
            <polygon points="30,26 36,8 50,18 64,8 70,26" fill="#FBBF24" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="36" cy="8" r="2.5" fill="#EF4444" />
            <circle cx="50" cy="18" r="2.5" fill="#3B82F6" />
            <circle cx="64" cy="8" r="2.5" fill="#10B981" />
          </g>
        );

      case 'headphones':
        return (
          <g>
            {/* Headband */}
            <path d="M22 48 C22 22, 78 22, 78 48" fill="none" stroke="#DC2626" strokeWidth="5" strokeLinecap="round" />
            {/* Ear cups */}
            <rect x="15" y="42" width="9" height="18" rx="4" fill="#B91C1C" />
            <rect x="76" y="42" width="9" height="18" rx="4" fill="#B91C1C" />
            <circle cx="19" cy="51" r="2.5" fill="#FCA5A5" />
            <circle cx="81" cy="51" r="2.5" fill="#FCA5A5" />
          </g>
        );

      case 'grad_cap':
        return (
          <g>
            <polygon points="50,14 84,24 50,34 16,24" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
            <polygon points="32,29 68,29 64,36 36,36" fill="#0F172A" />
            {/* Tassel */}
            <line x1="50" y1="24" x2="66" y2="28" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="66" cy="28" r="2" fill="#D97706" />
            <line x1="66" y1="28" x2="68" y2="38" stroke="#F59E0B" strokeWidth="2" />
          </g>
        );

      case 'star_badge':
        return (
          <g>
            <polygon points="76,64 79,72 87,72 81,77 83,85 76,80 69,85 71,77 65,72 73,72" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          </g>
        );

      case 'detective_hat':
        return (
          <g>
            <ellipse cx="50" cy="28" rx="34" ry="6" fill="#78350F" />
            <path d="M26 28 C26 14, 74 14, 74 28 Z" fill="#92400E" />
            <rect x="26" y="24" width="48" height="4" fill="#451A03" />
          </g>
        );

      case 'bow':
        return (
          <g>
            <polygon points="50,22 36,15 36,29" fill="#EC4899" />
            <polygon points="50,22 64,15 64,29" fill="#EC4899" />
            <circle cx="50" cy="22" r="4" fill="#F43F5E" />
          </g>
        );

      case 'none':
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden transition-transform duration-200 ${
        sizeMap[size]
      } ${showFrame ? frameClasses[avatar.frame] : ''} ${className}`}
      style={{ backgroundColor: avatar.bgColor || '#E0E7FF' }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="astroVisor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F59E0B" />
            <stop offset="50%" stop-color="#D97706" />
            <stop offset="100%" stop-color="#78350F" />
          </linearGradient>
        </defs>
        {renderBase()}
        {renderAccessory()}
      </svg>
    </div>
  );
};
