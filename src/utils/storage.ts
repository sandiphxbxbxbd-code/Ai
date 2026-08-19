import { UserWallet, WithdrawalTransaction, TaskLogItem, BotUpgradeInfo } from '../types';

const WALLET_STORAGE_KEY = 'autoearn_user_wallet_v1';
const TXN_STORAGE_KEY = 'autoearn_txns_v1';
const LOGS_STORAGE_KEY = 'autoearn_logs_v1';

export const BOT_LEVELS: BotUpgradeInfo[] = [
  {
    level: 1,
    titleHi: 'AI माइक्रो-वर्कर V1 (बेसिक)',
    titleEn: 'AI Micro-Worker V1 (Basic)',
    costCoins: 0,
    speedMultiplier: 1.0,
    minEarningPerMin: 0.5,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    level: 2,
    titleHi: 'AI टर्बो डेटा-माइनर V2',
    titleEn: 'AI Turbo Data-Miner V2',
    costCoins: 50,
    speedMultiplier: 1.8,
    minEarningPerMin: 1.2,
    color: 'from-blue-500 to-cyan-600',
  },
  {
    level: 3,
    titleHi: 'AI एफिलिएट ऑटो-एजेंट V3',
    titleEn: 'AI Affiliate Auto-Agent V3',
    costCoins: 120,
    speedMultiplier: 2.8,
    minEarningPerMin: 2.5,
    color: 'from-purple-500 to-indigo-600',
  },
  {
    level: 4,
    titleHi: 'AI अल्ट्रा रेवेन्यू क्लस्टर V4',
    titleEn: 'AI Ultra Revenue Cluster V4',
    costCoins: 300,
    speedMultiplier: 4.5,
    minEarningPerMin: 5.0,
    color: 'from-amber-500 to-orange-600',
  },
  {
    level: 5,
    titleHi: 'AI क्वांटम वेल्थ मास्टर V5',
    titleEn: 'AI Quantum Wealth Master V5',
    costCoins: 750,
    speedMultiplier: 8.0,
    minEarningPerMin: 10.0,
    color: 'from-rose-500 to-red-600',
  },
];

export const INITIAL_WALLET: UserWallet = {
  balanceINR: 35.0, // Welcome starter bonus
  balanceCoins: 100, // Starter 100 coins (= ₹10)
  totalEarnedINR: 35.0,
  totalWithdrawnINR: 0.0,
  botLevel: 1,
  botSpeedMultiplier: 1.0,
  isBotActive: true,
  totalTasksDone: 8,
  dailyStreak: 1,
  lastClaimDate: null,
  referralCode: 'EARN' + Math.floor(1000 + Math.random() * 9000),
  referralEarnings: 0,
  invitedFriendsCount: 0,
};

export const INITIAL_LOGS: TaskLogItem[] = [
  {
    id: 'log-1',
    title: 'वेलकम साइन-अप बोनस (Welcome Bonus)',
    rewardINR: 25.0,
    rewardCoins: 50,
    summary: 'नए यूजर अकाउंट एक्टिवेशन पर ₹25 + 50 कॉइन्स का वेलकम बोनस प्राप्त हुआ।',
    timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
    type: 'daily_reward',
  },
  {
    id: 'log-2',
    title: 'AI ऑटो-माइनिंग प्रारंभ (AI Auto-Mining Start)',
    rewardINR: 10.0,
    rewardCoins: 50,
    summary: 'AI बॉट ने बैकग्राउंड क्लाउड माइक्रो-गिग्स ऑटोमैटिक रूप से शुरू कर दिया है।',
    timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
    type: 'auto_mine',
  },
];

export function getStoredWallet(): UserWallet {
  try {
    const data = localStorage.getItem(WALLET_STORAGE_KEY);
    if (data) {
      return { ...INITIAL_WALLET, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load wallet', e);
  }
  return INITIAL_WALLET;
}

export function saveStoredWallet(wallet: UserWallet): void {
  try {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
  } catch (e) {
    console.error('Failed to save wallet', e);
  }
}

export function getStoredTransactions(): WithdrawalTransaction[] {
  try {
    const data = localStorage.getItem(TXN_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load transactions', e);
  }
  return [];
}

export function saveStoredTransactions(txns: WithdrawalTransaction[]): void {
  try {
    localStorage.setItem(TXN_STORAGE_KEY, JSON.stringify(txns));
  } catch (e) {
    console.error('Failed to save transactions', e);
  }
}

export function getStoredLogs(): TaskLogItem[] {
  try {
    const data = localStorage.getItem(LOGS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load logs', e);
  }
  return INITIAL_LOGS;
}

export function saveStoredLogs(logs: TaskLogItem[]): void {
  try {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs.slice(0, 30)));
  } catch (e) {
    console.error('Failed to save logs', e);
  }
}
