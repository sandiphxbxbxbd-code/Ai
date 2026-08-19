import React, { useState } from 'react';
import { X, Coins, ArrowRightLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserWallet, TaskLogItem } from '../types';
import { soundManager } from '../utils/audio';

interface CoinConvertModalProps {
  isOpen: boolean;
  wallet: UserWallet;
  language: Language;
  onClose: () => void;
  onConvertSuccess: (coinsUsed: number, inrReceived: number) => void;
}

export const CoinConvertModal: React.FC<CoinConvertModalProps> = ({
  isOpen,
  wallet,
  language,
  onClose,
  onConvertSuccess,
}) => {
  const isHindi = language === 'hi';
  const [coinsToConvert, setCoinsToConvert] = useState<number>(50);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const inrEquivalent = Number((coinsToConvert / 10).toFixed(2));

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (coinsToConvert < 10) {
      alert(isHindi ? 'कम से कम 10 कॉइन्स कन्वर्ट करें।' : 'Minimum 10 coins required to convert.');
      return;
    }

    if (coinsToConvert > wallet.balanceCoins) {
      alert(isHindi ? 'आपके पास पर्याप्त कॉइन्स नहीं हैं।' : 'Insufficient coins in wallet.');
      return;
    }

    onConvertSuccess(coinsToConvert, inrEquivalent);
    soundManager.playCashRegister();

    setSuccessMsg(
      isHindi
        ? `${coinsToConvert} कॉइन्स सफलतापूर्वक ₹${inrEquivalent} में कन्वर्ट होकर वॉलेट में जुड़ गए!`
        : `Successfully converted ${coinsToConvert} coins into ₹${inrEquivalent} cash!`
    );

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 2000);
  };

  const handleMax = () => {
    setCoinsToConvert(wallet.balanceCoins);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">
              {isHindi ? 'कॉइन्स को रुपये में बदलें' : 'Convert Coins to INR Cash'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <p className="text-sm font-bold text-white">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleConvert} className="space-y-4">
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400">{isHindi ? 'कन्वर्जन रेट:' : 'Conversion Rate:'}</span>
              <span className="font-bold text-amber-300 font-mono">10 Coins = ₹1.00 INR</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400">{isHindi ? 'उपलब्ध कॉइन्स:' : 'Available Coins:'}</span>
              <span className="font-bold text-white font-mono flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                {wallet.balanceCoins}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {isHindi ? 'कन्वर्ट करने के लिए कॉइन्स दर्ज करें:' : 'Coins to convert:'}
                </label>
                <button
                  type="button"
                  onClick={handleMax}
                  className="text-xs text-amber-400 font-bold hover:underline"
                >
                  {isHindi ? 'सभी कॉइन्स चुनें (Max)' : 'Select All'}
                </button>
              </div>

              <input
                type="number"
                min="10"
                max={wallet.balanceCoins}
                value={coinsToConvert || ''}
                onChange={(e) => setCoinsToConvert(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-base focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
              <span className="text-xs text-slate-400">{isHindi ? 'आपको प्राप्त होंगे:' : 'You will receive:'}</span>
              <div className="text-2xl font-black text-emerald-300 font-mono mt-0.5">
                ₹{inrEquivalent.toFixed(2)} INR
              </div>
            </div>

            <button
              type="submit"
              disabled={wallet.balanceCoins < 10}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isHindi ? 'तुरंत कन्वर्ट करें' : 'Convert Instantly'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
