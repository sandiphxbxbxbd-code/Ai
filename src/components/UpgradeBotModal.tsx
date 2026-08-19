import React from 'react';
import { X, ArrowUpCircle, Check, Zap, Coins, Bot, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserWallet } from '../types';
import { BOT_LEVELS } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface UpgradeBotModalProps {
  isOpen: boolean;
  wallet: UserWallet;
  language: Language;
  onClose: () => void;
  onUpgradeSuccess: (newLevel: number, costCoins: number) => void;
}

export const UpgradeBotModal: React.FC<UpgradeBotModalProps> = ({
  isOpen,
  wallet,
  language,
  onClose,
  onUpgradeSuccess,
}) => {
  const isHindi = language === 'hi';

  if (!isOpen) return null;

  const handleUpgrade = (targetLevel: number, cost: number) => {
    if (wallet.balanceCoins < cost) {
      alert(
        isHindi
          ? `आपके पास पर्याप्त कॉइन्स नहीं हैं। आवश्यक: ${cost} कॉइन्स, आपके पास: ${wallet.balanceCoins} कॉइन्स।`
          : `Insufficient coins. Required: ${cost} coins, You have: ${wallet.balanceCoins} coins.`
      );
      return;
    }

    onUpgradeSuccess(targetLevel, cost);
    soundManager.playCashRegister();

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 },
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {isHindi ? 'AI बॉट पावर अपग्रेड (Level Up)' : 'Upgrade AI Auto-Bot Power'}
              </h3>
              <p className="text-xs text-slate-400">
                {isHindi ? 'बॉट की स्पीड और प्रति मिनट कमाई को 8x तक बढ़ाएं' : 'Boost automated earning rates up to 8x'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body List of Levels */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto no-scrollbar">
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs mb-4">
            <span className="text-slate-400">{isHindi ? 'आपके पास उपलब्ध कॉइन्स:' : 'Your Available Coins:'}</span>
            <span className="font-bold text-amber-300 flex items-center gap-1 font-mono text-sm">
              <Coins className="w-4 h-4 text-amber-400" />
              {wallet.balanceCoins}
            </span>
          </div>

          {BOT_LEVELS.map((lvl) => {
            const isCurrent = wallet.botLevel === lvl.level;
            const isUnlocked = wallet.botLevel >= lvl.level;
            const canAfford = wallet.balanceCoins >= lvl.costCoins;

            return (
              <div
                key={lvl.level}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-emerald-950/40 border-emerald-400 shadow-md shadow-emerald-500/10'
                    : isUnlocked
                    ? 'bg-slate-950/60 border-slate-800 opacity-80'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${lvl.color} flex items-center justify-center text-slate-950 font-bold shrink-0`}>
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {isHindi ? lvl.titleHi : lvl.titleEn}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-800 text-slate-300">
                        LVL {lvl.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {lvl.speedMultiplier}x स्पीड
                      </span>
                      <span>•</span>
                      <span className="text-slate-300">~₹{(lvl.minEarningPerMin * 4).toFixed(2)}/min</span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="w-full sm:w-auto text-right">
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      <Check className="w-3.5 h-3.5" />
                      {isHindi ? 'सक्रिय (Active)' : 'Current Bot'}
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-xs text-slate-500 font-medium">
                      {isHindi ? 'अनलॉक्ड' : 'Unlocked'}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(lvl.level, lvl.costCoins)}
                      disabled={!canAfford}
                      className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20 cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>{lvl.costCoins} कॉइन्स में अनलॉक</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
};
