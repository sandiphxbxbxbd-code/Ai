import React, { useState } from 'react';
import { 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Coins, 
  RotateCw, 
  Trophy,
  PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserWallet, TaskLogItem } from '../types';
import { soundManager } from '../utils/audio';

interface DailyRewardsProps {
  wallet: UserWallet;
  language: Language;
  onUpdateWallet: (updated: Partial<UserWallet>) => void;
  onAddLog: (log: TaskLogItem) => void;
}

export const DailyRewards: React.FC<DailyRewardsProps> = ({
  wallet,
  language,
  onUpdateWallet,
  onAddLog,
}) => {
  const isHindi = language === 'hi';

  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [spinPrizeMsg, setSpinPrizeMsg] = useState<string | null>(null);
  const [claimedToday, setClaimedToday] = useState(false);

  const streakDays = [
    { day: 1, rewardINR: 5, coins: 20 },
    { day: 2, rewardINR: 8, coins: 30 },
    { day: 3, rewardINR: 12, coins: 40 },
    { day: 4, rewardINR: 18, coins: 50 },
    { day: 5, rewardINR: 25, coins: 60 },
    { day: 6, rewardINR: 35, coins: 80 },
    { day: 7, rewardINR: 50, coins: 150, isMega: true },
  ];

  const currentStreak = wallet.dailyStreak || 1;

  const handleClaimDaily = (dayIndex: number) => {
    if (claimedToday) return;

    const dayObj = streakDays[dayIndex];
    if (!dayObj) return;

    const updatedINR = Number((wallet.balanceINR + dayObj.rewardINR).toFixed(2));
    const updatedCoins = wallet.balanceCoins + dayObj.coins;
    const nextStreak = currentStreak >= 7 ? 1 : currentStreak + 1;

    onUpdateWallet({
      balanceINR: updatedINR,
      balanceCoins: updatedCoins,
      totalEarnedINR: Number((wallet.totalEarnedINR + dayObj.rewardINR).toFixed(2)),
      dailyStreak: nextStreak,
      lastClaimDate: new Date().toISOString(),
    });

    setClaimedToday(true);
    soundManager.playCashRegister();

    onAddLog({
      id: 'log-' + Date.now(),
      title: isHindi ? `डेली स्ट्रीक रिवॉर्ड (Day ${dayObj.day})` : `Daily Streak Reward (Day ${dayObj.day})`,
      rewardINR: dayObj.rewardINR,
      rewardCoins: dayObj.coins,
      summary: isHindi ? `डे ${dayObj.day} का चेक-इन बोनस सफलतापूर्वक वॉलेट में क्रेडिट हुआ।` : `Day ${dayObj.day} check-in bonus credited to wallet.`,
      timestamp: new Date().toLocaleTimeString(isHindi ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      type: 'daily_reward',
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSpinPrizeMsg(null);
    soundManager.playCoin();

    // Wheel prizes
    const prizes = [
      { label: '₹2', inr: 2, coins: 10, deg: 30 },
      { label: '50 Coins', inr: 5, coins: 50, deg: 90 },
      { label: '₹10', inr: 10, coins: 20, deg: 150 },
      { label: '₹5', inr: 5, coins: 15, deg: 210 },
      { label: '100 Coins', inr: 10, coins: 100, deg: 270 },
      { label: '₹25 BUMPER', inr: 25, coins: 50, deg: 330 },
    ];

    const chosenPrize = prizes[Math.floor(Math.random() * prizes.length)];
    const extraRotations = 5 * 360;
    const finalDeg = wheelRotation + extraRotations + chosenPrize.deg;

    setWheelRotation(finalDeg);

    setTimeout(() => {
      setIsSpinning(false);
      const updatedINR = Number((wallet.balanceINR + chosenPrize.inr).toFixed(2));
      const updatedCoins = wallet.balanceCoins + chosenPrize.coins;

      onUpdateWallet({
        balanceINR: updatedINR,
        balanceCoins: updatedCoins,
        totalEarnedINR: Number((wallet.totalEarnedINR + chosenPrize.inr).toFixed(2)),
      });

      setSpinPrizeMsg(
        isHindi
          ? `🎉 बधाई! आपने लकी स्पिन से ₹${chosenPrize.inr} (+${chosenPrize.coins} कॉइन्स) जीते!`
          : `🎉 Congratulations! You won ₹${chosenPrize.inr} (+${chosenPrize.coins} coins)!`
      );

      soundManager.playSuccess();

      onAddLog({
        id: 'log-' + Date.now(),
        title: isHindi ? 'लकी फॉर्च्यून स्पिन' : 'Lucky Fortune Spin',
        rewardINR: chosenPrize.inr,
        rewardCoins: chosenPrize.coins,
        summary: isHindi ? `लकी व्हील से ₹${chosenPrize.inr} का कैश प्राइज प्राप्त हुआ।` : `Won ₹${chosenPrize.inr} cash from Lucky Wheel.`,
        timestamp: new Date().toLocaleTimeString(isHindi ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'spin_wheel',
      });

      try {
        confetti({
          particleCount: 70,
          spread: 65,
          origin: { y: 0.6 },
        });
      } catch {}
    }, 3200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 7-Day Streak Card */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
                <span>{isHindi ? '7-दिन डेली चेक-इन स्ट्रीक' : '7-Day Daily Check-in Streak'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentStreak} {isHindi ? 'दिन' : 'Days'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isHindi ? 'रोजाना लॉग इन करें और फ्री कैश व कॉइन्स क्लेम करें' : 'Claim guaranteed daily cash rewards every day'}
              </p>
            </div>
          </div>
        </div>

        {/* 7 Days Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 my-4">
          {streakDays.map((item, idx) => {
            const isCompleted = idx < currentStreak - 1;
            const isCurrent = idx === currentStreak - 1;
            const isFuture = idx > currentStreak - 1;

            return (
              <div
                key={item.day}
                className={`p-2.5 rounded-xl border text-center relative flex flex-col items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-b from-amber-500/20 to-slate-950 border-amber-400 text-white shadow-lg shadow-amber-500/10 scale-105'
                    : isCompleted
                    ? 'bg-slate-950/80 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                {item.isMega && (
                  <span className="absolute -top-2 px-1.5 py-0.2 rounded bg-rose-500 text-white font-bold text-[8px] uppercase tracking-wider">
                    MEGA
                  </span>
                )}
                <span className="text-[10px] font-bold">Day {item.day}</span>
                <div className="my-1.5">
                  <Gift className={`w-5 h-5 ${isCurrent ? 'text-amber-400 animate-bounce' : isCompleted ? 'text-emerald-400' : 'text-slate-600'}`} />
                </div>
                <div className="font-bold text-xs font-mono text-white">
                  ₹{item.rewardINR}
                </div>
                <span className="text-[9px] text-amber-400/80 font-medium">
                  +{item.coins}c
                </span>

                {isCompleted && (
                  <div className="mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Claim Button */}
        <button
          onClick={() => handleClaimDaily(currentStreak - 1)}
          disabled={claimedToday}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
            claimedToday
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 active:scale-95 shadow-amber-500/20'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>
            {claimedToday
              ? (isHindi ? 'आज का बोनस क्लेम हो चुका है ✓' : 'Today\'s Reward Claimed ✓')
              : (isHindi ? `डे ${currentStreak} का बोनस क्लेम करें (+₹${streakDays[currentStreak - 1]?.rewardINR})` : `Claim Day ${currentStreak} Reward (+₹${streakDays[currentStreak - 1]?.rewardINR})`)}
          </span>
        </button>

      </div>

      {/* Lucky Wheel Spin Card */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                {isHindi ? 'लकी फॉर्च्यून स्पिन' : 'Lucky Fortune Spin'}
              </h3>
              <p className="text-xs text-slate-400">
                {isHindi ? 'स्पिन करें और तुरंत ₹2 से ₹25 तक जीतें' : 'Spin to win instant cash up to ₹25'}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Wheel Representation */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative w-36 h-36 flex items-center justify-center">
            
            {/* Arrow Pointer */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-rose-500 drop-shadow-md"></div>

            {/* Rotating Disc */}
            <div
              className="w-36 h-36 rounded-full border-4 border-purple-500/40 bg-gradient-to-tr from-purple-900 via-indigo-950 to-slate-900 flex items-center justify-center shadow-2xl relative transition-transform duration-3000 ease-out"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              <div className="absolute inset-2 rounded-full border border-dashed border-purple-400/40"></div>
              
              {/* Prize text labels around circle */}
              <span className="absolute top-2 text-[10px] font-bold text-amber-300">₹25</span>
              <span className="absolute bottom-2 text-[10px] font-bold text-emerald-300">₹10</span>
              <span className="absolute left-2 text-[10px] font-bold text-cyan-300">50c</span>
              <span className="absolute right-2 text-[10px] font-bold text-rose-300">₹5</span>

              <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-purple-400 flex items-center justify-center text-purple-300 shadow-md">
                <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>

          </div>

          {spinPrizeMsg && (
            <p className="text-xs font-bold text-emerald-400 mt-2 text-center animate-bounce">
              {spinPrizeMsg}
            </p>
          )}
        </div>

        {/* Spin Action Button */}
        <button
          onClick={handleSpinWheel}
          disabled={isSpinning}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
        >
          <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>
            {isSpinning
              ? (isHindi ? 'पहिया घूम रहा है...' : 'Spinning Wheel...')
              : (isHindi ? 'फ्री स्पिन करें (Spin Now)' : 'Free Spin Now')}
          </span>
        </button>

      </div>

    </div>
  );
};
