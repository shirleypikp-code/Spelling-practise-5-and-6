import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, Share } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-3 py-1.5 text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
        title="Install SpellQuest for offline play"
      >
        <Download className="w-4 h-4 text-amber-900" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border border-indigo-200 font-semibold px-3 py-1.5 text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
          title="Add to iOS Home Screen"
        >
          <Smartphone className="w-4 h-4 text-indigo-600" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-800 border border-slate-100 animate-pop">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Install SpellQuest on iOS</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                  <p>
                    Tap the <strong>Share</strong> button <Share className="inline w-3.5 h-3.5 text-indigo-600 mx-0.5" /> in Safari's bottom toolbar.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                  <p>
                    Scroll down and tap <strong>Add to Home Screen</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                  <p className="text-emerald-800 font-medium">
                    Enjoy full offline access, full-screen games, and instant loading anytime!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-sm font-bold shadow-md cursor-pointer transition-all"
              >
                Got It!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for desktop or non-PWA browser
  return (
    <button
      onClick={() => {
        alert('To install SpellQuest on desktop or tablet: Open your browser menu and click "Install SpellQuest" or "Add to Home Screen"!');
      }}
      className="hidden sm:flex items-center gap-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1.5 text-xs font-semibold cursor-pointer border border-indigo-200"
      title="Install Web App for Offline Use"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Install App</span>
    </button>
  );
};
