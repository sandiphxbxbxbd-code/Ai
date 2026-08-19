import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, Calendar, ArrowUpRight, Sparkles, Filter } from 'lucide-react';
import { Language, UserWallet } from '../types';

interface EarningsTrendChartProps {
  wallet: UserWallet;
  language: Language;
}

export const EarningsTrendChart: React.FC<EarningsTrendChartProps> = ({ wallet, language }) => {
  const isHindi = language === 'hi';
  const [metricView, setMetricView] = useState<'total' | 'detailed'>('total');

  // Generate 7-day data with the last day (Today) including live wallet earnings
  const daysOfWeekHi = ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'आज'];
  const daysOfWeekEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];

  const daysLabel = isHindi ? daysOfWeekHi : daysOfWeekEn;

  // Base daily earnings over past week
  const pastWeekData = [
    { day: daysLabel[0], date: '13 Aug', earnings: 28.50, autoBot: 18.00, bonus: 10.50 },
    { day: daysLabel[1], date: '14 Aug', earnings: 42.00, autoBot: 27.00, bonus: 15.00 },
    { day: daysLabel[2], date: '15 Aug', earnings: 65.50, autoBot: 45.50, bonus: 20.00 },
    { day: daysLabel[3], date: '16 Aug', earnings: 54.00, autoBot: 38.00, bonus: 16.00 },
    { day: daysLabel[4], date: '17 Aug', earnings: 78.20, autoBot: 55.20, bonus: 23.00 },
    { day: daysLabel[5], date: '18 Aug', earnings: 92.40, autoBot: 67.40, bonus: 25.00 },
    { 
      day: daysLabel[6], 
      date: 'Today', 
      earnings: Number((55.00 + wallet.balanceINR).toFixed(2)), 
      autoBot: Number((40.00 + wallet.balanceINR * 0.75).toFixed(2)), 
      bonus: Number((15.00 + wallet.balanceINR * 0.25).toFixed(2)) 
    },
  ];

  const totalWeekly = pastWeekData.reduce((acc, curr) => acc + curr.earnings, 0);
  const avgDaily = (totalWeekly / 7).toFixed(2);
  const peakDay = pastWeekData.reduce((prev, current) => (prev.earnings > current.earnings) ? prev : current);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1 font-semibold text-slate-300">
            <span>{data.day} ({data.date})</span>
            <span className="text-emerald-400 font-mono font-bold">₹{data.earnings.toFixed(2)}</span>
          </div>
          <div className="space-y-1 text-[11px] pt-1">
            <div className="flex justify-between gap-4 text-teal-300">
              <span>{isHindi ? '• AI ऑटो-बॉट:' : '• AI Auto-Bot:'}</span>
              <span className="font-mono font-medium">₹{data.autoBot.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4 text-amber-300">
              <span>{isHindi ? '• बोनस & रिवार्ड्स:' : '• Bonus & Rewards:'}</span>
              <span className="font-mono font-medium">₹{data.bonus.toFixed(2)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm sm:text-base">
                {isHindi ? 'साप्ताहिक कमाई ट्रेंड (Earnings Trend)' : 'Weekly Earnings Trend'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5 font-bold">
                <ArrowUpRight className="w-3 h-3" />
                +24.8% {isHindi ? 'वृद्धि' : 'Growth'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isHindi ? 'पिछले 7 दिनों की दैनिक आय और ऑटो-अर्निंग ग्राफ' : 'Daily income over the past 7 days'}
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setMetricView('total')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              metricView === 'total'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isHindi ? 'कुल आय (Total)' : 'Total Yield'}
          </button>
          <button
            onClick={() => setMetricView('detailed')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              metricView === 'detailed'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isHindi ? 'विस्तृत (Breakdown)' : 'Breakdown'}
          </button>
        </div>
      </div>

      {/* Summary KPI Chips */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">{isHindi ? '7 दिन की कुल कमाई' : '7-Day Total'}</div>
          <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 mt-0.5">
            ₹{totalWeekly.toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">{isHindi ? 'दैनिक औसत (Avg)' : 'Daily Average'}</div>
          <div className="text-base sm:text-lg font-bold font-mono text-teal-300 mt-0.5">
            ₹{avgDaily}
          </div>
        </div>
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">{isHindi ? 'उच्चतम दिन (Peak)' : 'Peak Day'}</div>
          <div className="text-base sm:text-lg font-bold font-mono text-amber-300 mt-0.5">
            {peakDay.day} (₹{peakDay.earnings.toFixed(0)})
          </div>
        </div>
      </div>

      {/* Line / Area Chart Container */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={pastWeekData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />

            {metricView === 'total' ? (
              <>
                <Area
                  type="monotone"
                  dataKey="earnings"
                  name={isHindi ? 'कुल आय (₹)' : 'Total Income (₹)'}
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#emeraldGradient)"
                  dot={{ r: 4, fill: '#10b981', stroke: '#022c22', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#34d399', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </>
            ) : (
              <>
                <Area
                  type="monotone"
                  dataKey="autoBot"
                  name={isHindi ? 'AI ऑटो-बॉट' : 'AI Auto-Bot'}
                  stroke="#14b8a6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#emeraldGradient)"
                  dot={{ r: 3, fill: '#14b8a6' }}
                />
                <Area
                  type="monotone"
                  dataKey="bonus"
                  name={isHindi ? 'बोनस & स्पिन' : 'Bonus & Spin'}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#amberGradient)"
                  dot={{ r: 3, fill: '#f59e0b' }}
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicator */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800/80 mt-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            {isHindi ? 'दैनिक अर्निंग (₹ INR)' : 'Daily Yield (₹ INR)'}
          </span>
          {metricView === 'detailed' && (
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              {isHindi ? 'बोनस स्ट्रीम' : 'Bonus Stream'}
            </span>
          )}
        </div>
        <span className="text-slate-400">
          {isHindi ? '⚡ ऑटो-सिंक सक्रिय' : '⚡ Live Synced'}
        </span>
      </div>

    </div>
  );
};
