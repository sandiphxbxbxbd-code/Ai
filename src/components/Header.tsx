import React from 'react';
import { Wallet, Coins, Volume2, VolumeX, Globe, ArrowUpRight, ShieldCheck, Sparkles, Activity } from 'lucide-react';
import { Language, UserWallet } from '../types';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  wallet: UserWallet;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenWithdraw: () => void;
  onOpenCoinConvert: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  language,
  onLanguageChange,
  onOpenWithdraw,
  onOpenCoinConvert,
}) => {
  const [isMuted, setIsMuted] = React.useState(soundManager.getMuted());

  const toggleSound = () => {
    const next = !isMuted;
    soundManager.setMuted(next);
    setIsMuted(next);
    if (!next) {
      soundManager.playCoin();
    }
  };

  const isHindi = language === 'hi';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-emerald-500/20 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/25">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                  AutoEarn <span className="text-emerald-400">AI</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  {isHindi ? 'वेरिफाइड विड्रॉल' : 'Instant Payout'}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden xs:block">
                {isHindi ? 'ऑटोमैटिक कमाई & रियल-टाइम बैंक विड्रॉल' : 'Automated Cloud Yield & Direct UPI Transfers'}
              </p>
            </div>
          </div>

          {/* Right Action: Live Balances & Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Coins Balance Chip */}
            <button
              onClick={onOpenCoinConvert}
              title={isHindi ? 'कॉइन्स को रुपये में बदलें' : 'Convert Coins to INR'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all text-amber-300 group"
            >
              <Coins className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <div className="text-left leading-tight">
                <div className="text-[10px] text-amber-400/80 font-medium">
                  {isHindi ? 'कॉइन्स' : 'Coins'}
                </div>
                <div className="text-xs sm:text-sm font-bold font-mono">
                  {wallet.balanceCoins}
                </div>
              </div>
            </button>

            {/* Main INR Cash Wallet */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 shadow-inner">
              <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <span>{isHindi ? 'कुल बैलेंस' : 'Cash Balance'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <div className="text-base sm:text-lg font-black text-emerald-300 font-mono">
                  ₹{wallet.balanceINR.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Instant Withdraw Button */}
            <button
              id="header-withdraw-btn"
              onClick={onOpenWithdraw}
              className="relative inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-md shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              <span>{isHindi ? 'विड्रॉल करें' : 'Withdraw'}</span>
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(isHindi ? 'en' : 'hi')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHindi ? 'Eng' : 'हिन्दी'}</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
