import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, TrendingUp, Users, Zap } from 'lucide-react';
import { Language, LiveStatsData } from '../types';

interface LiveTickerProps {
  language: Language;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ language }) => {
  const isHindi = language === 'hi';
  const [stats, setStats] = useState<LiveStatsData>({
    onlineUsers: 1468,
    activeAutoBots: 3942,
    totalPaidOutINR: 489240,
    totalTasksCompleted: 130120,
    systemStatus: '100% Operational',
    recentTransactions: [],
  });

  const [simulatedRecent, setSimulatedRecent] = useState([
    { name: 'Rohan K.', upi: 'roh***@okhdfcbank', amount: 500, time: '2 मिनट पहले' },
    { name: 'Priya S.', upi: 'pri***@paytm', amount: 1200, time: '4 मिनट पहले' },
    { name: 'Manoj G.', upi: '98*****891@ybl', amount: 250, time: '6 मिनट पहले' },
    { name: 'Kavita M.', upi: 'kav***@sbi', amount: 1500, time: '8 मिनट पहले' },
    { name: 'Vikram R.', upi: 'vik***@axisbank', amount: 750, time: '11 मिनट पहले' },
  ]);

  useEffect(() => {
    // Fetch live backend stats
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats((prev) => ({ ...prev, ...data }));
        }
      } catch (e) {
        // use fallback
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 border-b border-slate-800 text-xs py-2 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        
        {/* Left: Live Community Metrics */}
        <div className="flex items-center flex-wrap gap-4 text-slate-300">
          <div className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <Zap className="w-3.5 h-3.5" />
            <span>{isHindi ? 'लाइव बॉट नेटवर्क:' : 'Live Network:'}</span>
            <strong className="text-white font-mono">{stats.activeAutoBots.toLocaleString()} {isHindi ? 'बॉट सक्रिय' : 'Active Bots'}</strong>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>{isHindi ? 'ऑनलाइन यूजर्स:' : 'Online Users:'}</span>
            <span className="text-slate-200 font-mono">{stats.onlineUsers.toLocaleString()}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>{isHindi ? 'आज का कुल पेआउट:' : 'Total Paid Out Today:'}</span>
            <span className="text-emerald-400 font-bold font-mono">₹{stats.totalPaidOutINR.toLocaleString()}</span>
          </div>
        </div>

        {/* Right: Streaming Payout Ticker */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto justify-start md:justify-end">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isHindi ? 'लाइव विड्रॉल:' : 'Live Payout:'}</span>
          </div>
          
          <div className="flex items-center gap-3 animate-marquee whitespace-nowrap text-slate-300">
            {simulatedRecent.slice(0, 3).map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                <span className="text-slate-400">{item.upi}</span>
                <span className="text-emerald-400 font-bold font-mono">₹{item.amount}</span>
                <span className="text-[10px] text-emerald-500 font-medium">{isHindi ? 'सफल' : 'Paid'}</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
