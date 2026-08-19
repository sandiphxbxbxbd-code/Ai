import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Play, 
  Pause, 
  Zap, 
  ArrowUpCircle, 
  Cpu, 
  Coins, 
  Sparkles, 
  Activity, 
  CheckCircle, 
  RefreshCw, 
  Sliders, 
  HelpCircle,
  Clock,
  TrendingUp,
  Terminal
} from 'lucide-react';
import { Language, UserWallet, TaskLogItem } from '../types';
import { BOT_LEVELS } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface AutoBotCardProps {
  wallet: UserWallet;
  language: Language;
  onUpdateWallet: (updated: Partial<UserWallet>) => void;
  onAddLog: (log: TaskLogItem) => void;
  onOpenUpgradeModal: () => void;
  onOpenHowItWorks: () => void;
}

export const AutoBotCard: React.FC<AutoBotCardProps> = ({
  wallet,
  language,
  onUpdateWallet,
  onAddLog,
  onOpenUpgradeModal,
  onOpenHowItWorks,
}) => {
  const isHindi = language === 'hi';
  const currentBot = BOT_LEVELS.find((b) => b.level === wallet.botLevel) || BOT_LEVELS[0];

  const [isProcessingTask, setIsProcessingTask] = useState(false);
  const [currentActionText, setCurrentActionText] = useState(
    isHindi ? 'AI क्लाउड माइक्रो-गिग्स ऑटोमैटिक प्रोसेस कर रहा है...' : 'AI is processing automated cloud micro-gigs...'
  );
  const [sessionEarnedINR, setSessionEarnedINR] = useState(0);

  // Background Auto-Earning Loop: Every 4 seconds, if bot is active, accrue passive micro-yield
  useEffect(() => {
    if (!wallet.isBotActive) return;

    const interval = setInterval(async () => {
      // Calculate micro earning based on bot level and speed multiplier
      const baseReward = 0.15 * currentBot.speedMultiplier * wallet.botSpeedMultiplier;
      const coinReward = Math.round(baseReward * 10);

      // Increment wallet balance
      onUpdateWallet({
        balanceINR: Number((wallet.balanceINR + baseReward).toFixed(2)),
        balanceCoins: wallet.balanceCoins + coinReward,
        totalEarnedINR: Number((wallet.totalEarnedINR + baseReward).toFixed(2)),
        totalTasksDone: wallet.totalTasksDone + 1,
      });

      setSessionEarnedINR((prev) => Number((prev + baseReward).toFixed(2)));
      soundManager.playCoin();

      const taskDescriptionsHi = [
        'ई-कॉमर्स एफिलिएट एड-कॉपी ऑप्टिमाइज़ेशन पूर्ण (+₹' + baseReward.toFixed(2) + ')',
        'AI डेटा-एनोटेशन माइक्रो-बैच सत्यापित (+₹' + baseReward.toFixed(2) + ')',
        'हाई-सीपीएम कीवर्ड इंडेक्सिंग डिलीवर (+₹' + baseReward.toFixed(2) + ')',
        'क्लाउड कंप्यूटिंग रिवेन्यू शेयर क्रेडिट (+₹' + baseReward.toFixed(2) + ')',
      ];
      const taskDescriptionsEn = [
        'E-commerce Affiliate Copy Optimization completed (+₹' + baseReward.toFixed(2) + ')',
        'AI Data-Annotation micro-batch verified (+₹' + baseReward.toFixed(2) + ')',
        'High-CPM Keyword Indexing delivered (+₹' + baseReward.toFixed(2) + ')',
        'Cloud Computing Revenue Share credited (+₹' + baseReward.toFixed(2) + ')',
      ];

      const desc = isHindi
        ? taskDescriptionsHi[Math.floor(Math.random() * taskDescriptionsHi.length)]
        : taskDescriptionsEn[Math.floor(Math.random() * taskDescriptionsEn.length)];

      setCurrentActionText(desc);
    }, 4000);

    return () => clearInterval(interval);
  }, [wallet.isBotActive, wallet.botLevel, wallet.botSpeedMultiplier, wallet.balanceINR, wallet.balanceCoins]);

  // Trigger Instant Gemini Task
  const handleTriggerManualTask = async () => {
    if (isProcessingTask) return;
    setIsProcessingTask(true);
    setCurrentActionText(isHindi ? 'Gemini AI सुपर-टास्क प्रोसेस कर रहा है...' : 'Processing High-Yield Gemini AI task...');

    try {
      const res = await fetch('/api/ai/auto-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'content_monetization',
          botLevel: wallet.botLevel,
          language,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const rewardINR = data.rewardINR || 2.5;
        const rewardCoins = data.rewardCoins || 25;

        onUpdateWallet({
          balanceINR: Number((wallet.balanceINR + rewardINR).toFixed(2)),
          balanceCoins: wallet.balanceCoins + rewardCoins,
          totalEarnedINR: Number((wallet.totalEarnedINR + rewardINR).toFixed(2)),
          totalTasksDone: wallet.totalTasksDone + 1,
        });

        setSessionEarnedINR((prev) => Number((prev + rewardINR).toFixed(2)));
        soundManager.playCashRegister();

        onAddLog({
          id: 'log-' + Date.now(),
          title: data.taskTitle || 'Gemini AI Super Gig',
          rewardINR,
          rewardCoins,
          summary: data.summary || 'AI टास्क पूरा हुआ।',
          timestamp: new Date().toLocaleTimeString(isHindi ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
          type: 'ai_task',
        });

        setCurrentActionText(
          isHindi
            ? `⚡ सुपर टास्क पूरा हुआ! +₹${rewardINR.toFixed(2)} और +${rewardCoins} कॉइन्स मिले`
            : `⚡ Super Task Done! +₹${rewardINR.toFixed(2)} & +${rewardCoins} Coins credited`
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingTask(false);
    }
  };

  const toggleBotActive = () => {
    const nextState = !wallet.isBotActive;
    onUpdateWallet({ isBotActive: nextState });
    if (nextState) {
      soundManager.playSuccess();
    }
  };

  const setSpeedMultiplier = (multiplier: number) => {
    onUpdateWallet({ botSpeedMultiplier: multiplier });
    soundManager.playCoin();
  };

  return (
    <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Bot Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${currentBot.color} flex items-center justify-center text-slate-950 font-bold shadow-lg`}>
              <Bot className="w-7 h-7" />
            </div>
            {wallet.isBotActive && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                {isHindi ? currentBot.titleHi : currentBot.titleEn}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LVL {wallet.botLevel}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              <span>
                {isHindi ? 'अनुमानित गति:' : 'Earning Power:'}
                <strong className="text-emerald-400 ml-1">
                  ~₹{(currentBot.minEarningPerMin * wallet.botSpeedMultiplier * 4).toFixed(2)} / min
                </strong>
              </span>
            </p>
          </div>
        </div>

        {/* Upgrade & Info Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>{isHindi ? 'यह कैसे कमाता है?' : 'How It Works?'}</span>
          </button>

          <button
            onClick={onOpenUpgradeModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowUpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{isHindi ? 'बॉट अपग्रेड करें' : 'Upgrade Bot'}</span>
          </button>
        </div>
      </div>

      {/* Main Bot Center: Visual Radar & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 relative z-10">
        
        {/* Left Widget: Interactive Bot Core */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 relative">
          
          {/* Animated Pulsing Halo */}
          <div className="relative flex items-center justify-center w-36 h-36">
            {wallet.isBotActive ? (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping opacity-25"></div>
                <div className="absolute inset-2 rounded-full border-2 border-teal-400/40 animate-spin" style={{ animationDuration: '8s' }}></div>
                <div className="absolute inset-4 rounded-full border border-dashed border-emerald-400/60 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
              </>
            ) : (
              <div className="absolute inset-0 rounded-full border border-slate-700 opacity-40"></div>
            )}
            
            {/* Center Core Circle */}
            <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center text-center p-2 shadow-2xl transition-all ${
              wallet.isBotActive 
                ? 'bg-gradient-to-b from-emerald-900 to-slate-950 border-2 border-emerald-400 shadow-emerald-500/30' 
                : 'bg-slate-900 border border-slate-700 text-slate-500'
            }`}>
              <Sparkles className={`w-6 h-6 mb-1 ${wallet.isBotActive ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-300">
                {wallet.isBotActive ? (isHindi ? 'ऑटो-माइनिंग' : 'AUTO-MINING') : (isHindi ? 'पॉज़' : 'PAUSED')}
              </span>
              <span className="text-[10px] font-bold text-emerald-400">
                {wallet.botSpeedMultiplier}x Speed
              </span>
            </div>
          </div>

          {/* Start/Stop Main Button */}
          <div className="mt-4 flex flex-col items-center gap-2 w-full">
            <button
              onClick={toggleBotActive}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                wallet.isBotActive
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950'
              }`}
            >
              {wallet.isBotActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>{isHindi ? 'बॉट को पॉज़ करें' : 'Pause Auto-Bot'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isHindi ? 'ऑटोमैटिक कमाई शुरू करें' : 'Start Auto-Earnings'}</span>
                </>
              )}
            </button>

            {/* Speed Multiplier Bar */}
            <div className="w-full flex items-center justify-between gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
              <span className="text-[10px] font-semibold text-slate-400 px-2 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-emerald-400" />
                {isHindi ? 'स्पीड:' : 'Speed:'}
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 5].map((mult) => (
                  <button
                    key={mult}
                    onClick={() => setSpeedMultiplier(mult)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      wallet.botSpeedMultiplier === mult
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white bg-slate-800'
                    }`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Widget: Live Metrics & AI Action Stream */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Session Yield */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isHindi ? 'इस सेशन की कमाई' : 'Session Earned'}</span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
                ₹{sessionEarnedINR.toFixed(2)}
              </div>
              <div className="text-[10px] text-emerald-500/80 mt-0.5">
                {isHindi ? 'लाइव क्रेडिट चालू' : 'Live Auto-accruing'}
              </div>
            </div>

            {/* Total Tasks Done */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>{isHindi ? 'कुल टास्क पूर्ण' : 'Tasks Completed'}</span>
              </div>
              <div className="text-xl font-bold font-mono text-white mt-1">
                {wallet.totalTasksDone}
              </div>
              <div className="text-[10px] text-blue-400/80 mt-0.5">
                {isHindi ? '100% सक्सेस रेट' : '100% Success Rate'}
              </div>
            </div>

            {/* Lifetime Earning */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHindi ? 'लाइफटाइम कमाई' : 'Lifetime Total'}</span>
              </div>
              <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                ₹{wallet.totalEarnedINR.toFixed(2)}
              </div>
              <div className="text-[10px] text-amber-500/80 mt-0.5">
                {isHindi ? 'वॉलेट + विड्रॉल' : 'Wallet + Payouts'}
              </div>
            </div>

          </div>

          {/* Real-time AI Work Terminal */}
          <div className="bg-slate-950 rounded-xl p-3.5 border border-emerald-500/20 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between text-slate-400 pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
                <span className="font-bold text-[11px] uppercase tracking-wider">
                  {isHindi ? 'AI ऑटो-वर्कर टर्मिनल' : 'AI Autonomous Terminal'}
                </span>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                <Clock className="w-3 h-3" />
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-emerald-400 select-none animate-pulse">{'>'}</span>
              <p className="leading-relaxed text-xs">
                {currentActionText}
              </p>
            </div>
          </div>

          {/* On-Demand Fast High-Yield AI Gig Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleTriggerManualTask}
              disabled={isProcessingTask}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isProcessingTask ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isHindi ? 'Gemini AI टास्क प्रोसेस हो रहा है...' : 'Processing with Gemini AI...'}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{isHindi ? '⚡ फास्ट AI सुपर-टास्क करें (+₹2.50 तुरंत)' : '⚡ Run Fast AI Super-Gig (+₹2.50 Instantly)'}</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
