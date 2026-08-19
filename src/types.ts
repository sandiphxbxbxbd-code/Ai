export type Language = 'hi' | 'en';

export interface UserWallet {
  balanceINR: number;
  balanceCoins: number; // 10 coins = ₹1
  totalEarnedINR: number;
  totalWithdrawnINR: number;
  botLevel: number;
  botSpeedMultiplier: number;
  isBotActive: boolean;
  totalTasksDone: number;
  dailyStreak: number;
  lastClaimDate: string | null;
  referralCode: string;
  referralEarnings: number;
  invitedFriendsCount: number;
}

export interface TaskLogItem {
  id: string;
  title: string;
  rewardINR: number;
  rewardCoins: number;
  summary: string;
  timestamp: string;
  type: 'ai_task' | 'auto_mine' | 'daily_reward' | 'spin_wheel' | 'referral';
}

export interface WithdrawalTransaction {
  id: string;
  amount: number;
  method: 'UPI' | 'Paytm' | 'Bank' | 'USDT';
  accountDetails: string;
  accountHolderName?: string;
  ifscCode?: string;
  timestamp: string;
  status: 'SUCCESS' | 'PROCESSING' | 'PENDING';
  utrNumber: string;
  fees: number;
  netPayout: number;
}

export interface BotUpgradeInfo {
  level: number;
  titleHi: string;
  titleEn: string;
  costCoins: number;
  speedMultiplier: number;
  minEarningPerMin: number;
  color: string;
}

export interface LiveStatsData {
  onlineUsers: number;
  activeAutoBots: number;
  totalPaidOutINR: number;
  totalTasksCompleted: number;
  systemStatus: string;
  recentTransactions: WithdrawalTransaction[];
}
