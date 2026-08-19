import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Wallet, 
  Gift, 
  Sparkles, 
  Receipt, 
  Users, 
  HelpCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  TrendingUp,
  MessageSquare,
  Briefcase
} from 'lucide-react';
import { Language, UserWallet, WithdrawalTransaction, TaskLogItem } from './types';
import { 
  getStoredWallet, 
  saveStoredWallet, 
  getStoredTransactions, 
  saveStoredTransactions, 
  getStoredLogs, 
  saveStoredLogs 
} from './utils/storage';
import { Header } from './components/Header';
import { LiveTicker } from './components/LiveTicker';
import { AutoBotCard } from './components/AutoBotCard';
import { WithdrawModal } from './components/WithdrawModal';
import { WithdrawHistory } from './components/WithdrawHistory';
import { DailyRewards } from './components/DailyRewards';
import { UpgradeBotModal } from './components/UpgradeBotModal';
import { CoinConvertModal } from './components/CoinConvertModal';
import { AiAdvisor } from './components/AiAdvisor';
import { ReferralTab } from './components/ReferralTab';
import { HowItWorksModal } from './components/HowItWorksModal';
import { TaskLogsList } from './components/TaskLogsList';
import { EarningsTrendChart } from './components/EarningsTrendChart';
import { RealWorkHub } from './components/RealWorkHub';

export default function App() {
  const [language, setLanguage] = useState<Language>('hi');
  const [wallet, setWallet] = useState<UserWallet>(getStoredWallet);
  const [transactions, setTransactions] = useState<WithdrawalTransaction[]>(getStoredTransactions);
  const [logs, setLogs] = useState<TaskLogItem[]>(getStoredLogs);

  // Modals state
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Active Main View Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'real_work' | 'rewards' | 'history' | 'advisor' | 'referral'>('dashboard');

  const isHindi = language === 'hi';

  // Sync to local storage
  useEffect(() => {
    saveStoredWallet(wallet);
  }, [wallet]);

  useEffect(() => {
    saveStoredTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveStoredLogs(logs);
  }, [logs]);

  const handleUpdateWallet = (updated: Partial<UserWallet>) => {
    setWallet((prev) => ({ ...prev, ...updated }));
  };

  const handleAddLog = (newLog: TaskLogItem) => {
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleWithdrawSuccess = (amount: number, newTxn: WithdrawalTransaction) => {
    const updatedINR = Number((wallet.balanceINR - amount).toFixed(2));
    const updatedWithdrawn = Number((wallet.totalWithdrawnINR + amount).toFixed(2));

    handleUpdateWallet({
      balanceINR: updatedINR,
      totalWithdrawnINR: updatedWithdrawn,
    });

    setTransactions((prev) => [newTxn, ...prev]);

    handleAddLog({
      id: 'log-' + Date.now(),
      title: isHindi ? `विड्रॉल सफल (-₹${amount})` : `Withdrawal Successful (-₹${amount})`,
      rewardINR: -amount,
      rewardCoins: 0,
      summary: isHindi ? `₹${amount} का विड्रॉल ${newTxn.method} खाते में भेजा गया। UTR: ${newTxn.utrNumber}` : `₹${amount} paid to ${newTxn.method}. UTR: ${newTxn.utrNumber}`,
      timestamp: new Date().toLocaleTimeString(isHindi ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      type: 'ai_task',
    });
  };

  const handleUpgradeSuccess = (newLevel: number, costCoins: number) => {
    handleUpdateWallet({
      botLevel: newLevel,
      balanceCoins: wallet.balanceCoins - costCoins,
    });
    setIsUpgradeOpen(false);

    handleAddLog({
      id: 'log-' + Date.now(),
      title: isHindi ? `AI बॉट लेवल ${newLevel} पर अपग्रेड` : `AI Bot Upgraded to LVL ${newLevel}`,
      rewardINR: 0,
      rewardCoins: -costCoins,
      summary: isHindi ? `बॉट की स्पीड और अर्निंग रेट बढ़ गई है।` : `Bot speed and earning rates boosted.`,
      timestamp: new Date().toLocaleTimeString(isHindi ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      type: 'ai_task',
    });
  };

  const handleConvertSuccess = (coinsUsed: number, inrReceived: number) => {
    handleUpdateWallet({
      balanceCoins: wallet.balanceCoins - coinsUsed,
      balanceINR: Number((wallet.balanceINR + inrReceived).toFixed(2)),
      totalEarnedINR: Number((wallet.totalEarnedINR + inrReceived).toFixed(2)),
    });

    handleAddLog({
      id: 'log-' + Date.now(),
      title: isHindi ? `कॉइन्स कन्वर्ट किए (+₹${inrReceived})` : `Coins Converted (+₹${inrReceived})`,
      rewardINR: inrReceived,
      rewardCoins: -coinsUsed,
      summary: isHindi ? `${coinsUsed} कॉइन्स को कैश वॉलेट में बदला गया।` : `${coinsUsed} coins swapped into cash.`,
      timestamp: new Date().toLocaleTimeString(isHindi ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      type: 'ai_task',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Header with balances & instant controls */}
      <Header
        wallet={wallet}
        language={language}
        onLanguageChange={setLanguage}
        onOpenWithdraw={() => setIsWithdrawOpen(true)}
        onOpenCoinConvert={() => setIsConvertOpen(true)}
      />

      {/* 2. Real-time Live Network & Payouts Ticker */}
      <LiveTicker language={language} />

      {/* 3. Main Navigation Tab Bar */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-4">
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
          {[
            { id: 'dashboard', labelHi: 'ऑटो-बॉट डैशबोर्ड', labelEn: 'Auto-Bot Dashboard', icon: Bot },
            { id: 'real_work', labelHi: '💼 रियल वर्क & गिग्स (₹15-₹25)', labelEn: '💼 Real Gigs (₹15-₹25)', icon: Briefcase, highlight: true },
            { id: 'rewards', labelHi: 'डेली रिवार्ड्स & स्पिन', labelEn: 'Daily Rewards & Spin', icon: Gift },
            { id: 'history', labelHi: 'विड्रॉल हिस्ट्री & रसीद', labelEn: 'Withdrawal Ledger', icon: Receipt },
            { id: 'advisor', labelHi: 'AI मनी एडवाइजर', labelEn: 'AI Advisor', icon: Sparkles },
            { id: 'referral', labelHi: 'रेफर & अर्न (15%)', labelEn: 'Refer & Earn (15%)', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : tab.highlight
                    ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span>{isHindi ? tab.labelHi : tab.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 4. Main Body Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        
        {/* TAB 1: AUTO-BOT DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Quick Action Top Alert */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {isHindi ? 'ऑटोमैटिक कमाई चालू है (Auto-Earning Active)' : 'Automated Cloud Yield is Running'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isHindi 
                      ? 'आपका AI बॉट बैकग्राउंड में माइक्रो-टास्क पूरा कर रहा है। जैसे ही ₹50 होंगे, तुरंत विड्रॉल करें।' 
                      : 'AI Bot is completing cloud micro-gigs in the background. Withdraw directly to UPI once balance reaches ₹50.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setActiveTab('real_work')}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>{isHindi ? 'रियल गिग्स करें (₹15-₹25)' : 'Start Real Gigs'}</span>
                </button>
                <button
                  onClick={() => setIsWithdrawOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                  <span>{isHindi ? 'पैसे निकालें (Withdraw)' : 'Withdraw Cash'}</span>
                </button>
              </div>
            </div>

            {/* Core Auto-Bot Card */}
            <AutoBotCard
              wallet={wallet}
              language={language}
              onUpdateWallet={handleUpdateWallet}
              onAddLog={handleAddLog}
              onOpenUpgradeModal={() => setIsUpgradeOpen(true)}
              onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            />

            {/* Earnings Trend Line Chart using Recharts */}
            <EarningsTrendChart wallet={wallet} language={language} />

            {/* Sub Section: Daily Rewards Preview + Live Task Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <DailyRewards
                  wallet={wallet}
                  language={language}
                  onUpdateWallet={handleUpdateWallet}
                  onAddLog={handleAddLog}
                />
              </div>
              <div className="lg:col-span-6">
                <TaskLogsList logs={logs} language={language} />
              </div>
            </div>

          </div>
        )}

        {/* TAB 1.5: REAL MONEY WORK & FREELANCE GIGS */}
        {activeTab === 'real_work' && (
          <div className="space-y-6 animate-fadeIn">
            <RealWorkHub
              wallet={wallet}
              language={language}
              onUpdateWallet={handleUpdateWallet}
              onAddLog={handleAddLog}
              onOpenWithdraw={() => setIsWithdrawOpen(true)}
            />
          </div>
        )}

        {/* TAB 2: DAILY REWARDS & LUCKY SPIN */}
        {activeTab === 'rewards' && (
          <div className="space-y-6 animate-fadeIn">
            <DailyRewards
              wallet={wallet}
              language={language}
              onUpdateWallet={handleUpdateWallet}
              onAddLog={handleAddLog}
            />
            <TaskLogsList logs={logs} language={language} />
          </div>
        )}

        {/* TAB 3: WITHDRAWAL LEDGER & RECEIPTS */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Quick Withdraw Banner */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-xs text-slate-400">{isHindi ? 'कुल विड्रॉल की गई राशि:' : 'Total Cash Withdrawn:'}</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  ₹{wallet.totalWithdrawnINR.toFixed(2)}
                </div>
              </div>
              <button
                onClick={() => setIsWithdrawOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                <span>{isHindi ? 'नया विड्रॉल करें' : 'New Withdrawal'}</span>
              </button>
            </div>

            <WithdrawHistory transactions={transactions} language={language} />
          </div>
        )}

        {/* TAB 4: GEMINI AI ADVISOR */}
        {activeTab === 'advisor' && (
          <div className="space-y-6 animate-fadeIn">
            <AiAdvisor wallet={wallet} language={language} />
          </div>
        )}

        {/* TAB 5: REFER & EARN */}
        {activeTab === 'referral' && (
          <div className="space-y-6 animate-fadeIn">
            <ReferralTab
              wallet={wallet}
              language={language}
              onUpdateWallet={handleUpdateWallet}
              onAddLog={handleAddLog}
            />
          </div>
        )}

      </main>

      {/* 5. Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-medium">AutoEarn AI — Automated Micro-Gig & Instant Payout Network</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setIsHowItWorksOpen(true)} className="hover:text-slate-300 underline">
              {isHindi ? 'नियम व शर्तें' : 'Terms & FAQ'}
            </button>
            <button onClick={() => setIsHowItWorksOpen(true)} className="hover:text-slate-300 underline">
              {isHindi ? 'यह कैसे काम करता है?' : 'How It Works'}
            </button>
            <span>© 2026 AutoEarn AI</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <WithdrawModal
        isOpen={isWithdrawOpen}
        wallet={wallet}
        language={language}
        onClose={() => setIsWithdrawOpen(false)}
        onWithdrawSuccess={handleWithdrawSuccess}
      />

      <UpgradeBotModal
        isOpen={isUpgradeOpen}
        wallet={wallet}
        language={language}
        onClose={() => setIsUpgradeOpen(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
      />

      <CoinConvertModal
        isOpen={isConvertOpen}
        wallet={wallet}
        language={language}
        onClose={() => setIsConvertOpen(false)}
        onConvertSuccess={handleConvertSuccess}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        language={language}
        onClose={() => setIsHowItWorksOpen(false)}
      />

    </div>
  );
}
