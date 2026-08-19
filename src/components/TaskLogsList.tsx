import React from 'react';
import { Activity, Zap, Gift, Trophy, ArrowRightLeft, Users, Clock } from 'lucide-react';
import { Language, TaskLogItem } from '../types';

interface TaskLogsListProps {
  logs: TaskLogItem[];
  language: Language;
}

export const TaskLogsList: React.FC<TaskLogsListProps> = ({ logs, language }) => {
  const isHindi = language === 'hi';

  const getTypeBadge = (type: TaskLogItem['type']) => {
    switch (type) {
      case 'ai_task':
        return {
          icon: Zap,
          color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
          label: isHindi ? 'AI सुपर-गिग' : 'AI Gig',
        };
      case 'auto_mine':
        return {
          icon: Activity,
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          label: isHindi ? 'ऑटो-माइनिंग' : 'Auto Yield',
        };
      case 'daily_reward':
        return {
          icon: Gift,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          label: isHindi ? 'डेली बोनस' : 'Daily Streak',
        };
      case 'spin_wheel':
        return {
          icon: Trophy,
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
          label: isHindi ? 'लकी स्पिन' : 'Lucky Spin',
        };
      case 'referral':
        return {
          icon: Users,
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
          label: isHindi ? 'रेफरल' : 'Referral',
        };
      default:
        return {
          icon: Activity,
          color: 'text-slate-400 bg-slate-800 border-slate-700',
          label: 'Activity',
        };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">
              {isHindi ? 'लाइव एक्टिविटी और टास्क हिस्ट्री' : 'Live Earning Stream & Task Logs'}
            </h3>
            <p className="text-xs text-slate-400">
              {isHindi ? 'बॉट द्वारा पूरे किए गए रीसेंट कार्य और रिवार्ड्स' : 'Real-time feed of credits and completed micro-jobs'}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto no-scrollbar space-y-2">
        {logs.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">
            {isHindi ? 'कोई एक्टिविटी नहीं मिली।' : 'No activity logged yet.'}
          </div>
        ) : (
          logs.map((log) => {
            const badge = getTypeBadge(log.type);
            const Icon = badge.icon;

            return (
              <div
                key={log.id}
                className="pt-2 pb-2 flex items-start justify-between gap-3 hover:bg-slate-950/40 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 mt-0.5">
                    <Icon className="w-4 h-4 text-slate-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">{log.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{log.summary}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold font-mono text-emerald-400">
                    +₹{log.rewardINR.toFixed(2)}
                  </div>
                  {log.rewardCoins > 0 && (
                    <div className="text-[10px] font-mono text-amber-400/80">
                      +{log.rewardCoins} coins
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
