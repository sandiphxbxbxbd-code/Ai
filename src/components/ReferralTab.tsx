import React, { useState } from 'react';
import { Users, Copy, Check, Share2, Sparkles, Gift, QrCode, TrendingUp } from 'lucide-react';
import { Language, UserWallet, TaskLogItem } from '../types';
import { soundManager } from '../utils/audio';

interface ReferralTabProps {
  wallet: UserWallet;
  language: Language;
  onUpdateWallet: (updated: Partial<UserWallet>) => void;
  onAddLog: (log: TaskLogItem) => void;
}

export const ReferralTab: React.FC<ReferralTabProps> = ({
  wallet,
  language,
  onUpdateWallet,
  onAddLog,
}) => {
  const isHindi = language === 'hi';
  const [copied, setCopied] = useState(false);
  const [isSimulatingInvite, setIsSimulatingInvite] = useState(false);

  const referralUrl = `https://autoearn.ai/join?ref=${wallet.referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(wallet.referralCode);
    setCopied(true);
    soundManager.playCoin();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateInvite = () => {
    setIsSimulatingInvite(true);
    setTimeout(() => {
      setIsSimulatingInvite(false);
      const bonusINR = 20;
      const bonusCoins = 50;

      onUpdateWallet({
        balanceINR: Number((wallet.balanceINR + bonusINR).toFixed(2)),
        balanceCoins: wallet.balanceCoins + bonusCoins,
        totalEarnedINR: Number((wallet.totalEarnedINR + bonusINR).toFixed(2)),
        referralEarnings: wallet.referralEarnings + bonusINR,
        invitedFriendsCount: wallet.invitedFriendsCount + 1,
      });

      soundManager.playSuccess();

      onAddLog({
        id: 'log-' + Date.now(),
        title: isHindi ? 'रेफरल बोनस प्राप्त (+₹20)' : 'Referral Bonus Credited (+₹20)',
        rewardINR: bonusINR,
        rewardCoins: bonusCoins,
        summary: isHindi ? 'नया दोस्त आपके लिंक से जुड़ा! 15% लाइफटाइम कमीशन सक्रिय हुआ।' : 'New friend joined! 15% lifetime commission activated.',
        timestamp: new Date().toLocaleTimeString(isHindi ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'referral',
      });
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">
              {isHindi ? 'रेफर करें और 15% लाइफटाइम ऑटो-अर्निंग पाएं' : 'Invite Friends & Earn 15% Lifetime Commission'}
            </h3>
            <p className="text-xs text-slate-400">
              {isHindi ? 'प्रत्येक दोस्त के जुड़ने पर ₹20 तुरंत + उनकी कमाई का 15% हमेशा' : 'Get instant ₹20 per friend + 15% on all their automated earnings'}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">{isHindi ? 'कुल आमंत्रित मित्र' : 'Invited Friends'}</span>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {wallet.invitedFriendsCount}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">{isHindi ? 'रेफरल से कुल कमाई' : 'Referral Cash Earned'}</span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            ₹{wallet.referralEarnings.toFixed(2)}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">{isHindi ? 'कमीशन दर' : 'Commission Rate'}</span>
          <div className="text-xl font-bold text-blue-400 font-mono mt-1">
            15% Lifetime
          </div>
        </div>
      </div>

      {/* Referral Code Box */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <label className="block text-xs font-bold text-slate-300">
          {isHindi ? 'आपका यूनिक रेफरल कोड और इनवाइट लिंक:' : 'Your Unique Referral Code & Link:'}
        </label>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex-1 w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm">
            <span className="text-amber-400">{wallet.referralCode}</span>
            <span className="text-[11px] text-slate-400 font-normal truncate ml-2">
              autoearn.ai/join?ref={wallet.referralCode}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
            <span>{copied ? (isHindi ? 'कॉपी हुआ!' : 'Copied!') : (isHindi ? 'लिंक कॉपी करें' : 'Copy Link')}</span>
          </button>
        </div>

        {/* Demo Invite Simulator Button */}
        <div className="pt-2">
          <button
            onClick={handleSimulateInvite}
            disabled={isSimulatingInvite}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Gift className="w-4 h-4" />
            <span>
              {isSimulatingInvite
                ? (isHindi ? 'दोस्त जुड़ रहा है...' : 'Friend joining...')
                : (isHindi ? 'दोस्त को इनवाइट करें (+₹20 तुरंत टेस्ट करें)' : 'Simulate Friend Invite (+₹20 Instant)')}
            </span>
          </button>
        </div>

      </div>

    </div>
  );
};
