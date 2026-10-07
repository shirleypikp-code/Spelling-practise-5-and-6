import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, Sparkles } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-3 left-3 sm:left-6 z-50 flex items-center gap-2.5 rounded-2xl bg-amber-600/95 text-white px-3.5 py-2 text-xs font-semibold shadow-xl border border-amber-400 backdrop-blur-xs animate-pop">
      <div className="w-2 h-2 rounded-full bg-amber-200 animate-ping" />
      <WifiOff className="w-4 h-4 text-amber-200" />
      <span>
        Offline Mode Active &bull; <strong className="text-amber-100">All games and words are ready!</strong>
      </span>
      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
    </div>
  );
};
