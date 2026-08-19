import React, { useState } from 'react';
import { 
  Receipt, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Smartphone, 
  QrCode, 
  Coins, 
  ExternalLink,
  Copy,
  Printer,
  X
} from 'lucide-react';
import { Language, WithdrawalTransaction } from '../types';

interface WithdrawHistoryProps {
  transactions: WithdrawalTransaction[];
  language: Language;
}

export const WithdrawHistory: React.FC<WithdrawHistoryProps> = ({
  transactions,
  language,
}) => {
  const isHindi = language === 'hi';
  const [selectedTxn, setSelectedTxn] = useState<WithdrawalTransaction | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'UPI':
        return <QrCode className="w-4 h-4 text-emerald-400" />;
      case 'Paytm':
        return <Smartphone className="w-4 h-4 text-blue-400" />;
      case 'Bank':
        return <Building2 className="w-4 h-4 text-amber-400" />;
      case 'USDT':
        return <Coins className="w-4 h-4 text-purple-400" />;
      default:
        return <Receipt className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">
              {isHindi ? 'विड्रॉल हिस्ट्री और रसीद (Payout History)' : 'Withdrawal Ledger & Receipts'}
            </h3>
            <p className="text-xs text-slate-400">
              {isHindi ? 'सभी पूर्व ट्रांसफर और UTR नंबर्स का रिकॉर्ड' : 'Verified records of previous payouts and UTR tracking'}
            </p>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {transactions.length} {isHindi ? 'रिकॉर्ड्स' : 'Records'}
        </span>
      </div>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>{isHindi ? 'अभी तक कोई विड्रॉल नहीं हुआ है।' : 'No withdrawal records yet.'}</p>
          <p className="text-[11px] text-slate-600 mt-1">
            {isHindi ? '₹50 होते ही विड्रॉल करें और तुरंत पैसे पाएं।' : 'Earn ₹50 and execute your first payout!'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto no-scrollbar">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-950/40 px-2 rounded-xl transition-colors"
            >
              {/* Left Details */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  {getMethodIcon(txn.method)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">
                      ₹{txn.amount.toFixed(2)}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {isHindi ? 'सफल' : 'SUCCESS'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span>{txn.method}: {txn.accountDetails}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500 text-[10px]">{txn.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Right Action: UTR & Receipt View */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTxn(txn)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1"
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{isHindi ? 'रसीद' : 'Slip'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Slip Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">
                  {isHindi ? 'विड्रॉल प्रमाण पत्र (Payment Slip)' : 'Payment Slip & UTR'}
                </h4>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="text-slate-200 font-bold">{selectedTxn.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Bank UTR / Ref:</span>
                <span className="text-emerald-400 font-bold">{selectedTxn.utrNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Gateway Method:</span>
                <span className="text-slate-200">{selectedTxn.method}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Beneficiary VPA/Acc:</span>
                <span className="text-slate-200">{selectedTxn.accountDetails}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Transfer Time:</span>
                <span className="text-slate-400">{selectedTxn.timestamp}</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold text-white pt-2">
                <span>Net Transferred Amount:</span>
                <span className="text-emerald-400">₹{selectedTxn.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(selectedTxn.utrNumber, selectedTxn.id)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-emerald-400" />
                <span>{copiedId === selectedTxn.id ? (isHindi ? 'कॉपी हुआ!' : 'Copied!') : (isHindi ? 'UTR कॉपी करें' : 'Copy UTR')}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isHindi ? 'प्रिंट' : 'Print'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
