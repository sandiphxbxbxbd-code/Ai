import React from 'react';
import { X, ShieldCheck, Cpu, ArrowRightLeft, QrCode, CheckCircle, Zap } from 'lucide-react';
import { Language } from '../types';

interface HowItWorksModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  language,
  onClose,
}) => {
  const isHindi = language === 'hi';

  if (!isOpen) return null;

  const stepsHi = [
    {
      title: '1. AI ऑटो-वर्कर बॉट कैसे पैसे कमाता है?',
      desc: 'हमारा AI इंजन बैकग्राउंड में डिजिटल माइक्रो-गिग्स प्रोसेस करता है (जैसे कि ई-कॉमर्स डेटा एनोटेशन, हाई-सीपीएम कीवर्ड इंडेक्सिंग, और मल्टी-लिंगुअल ट्रांसलेशन)। क्लाइंट्स से मिलने वाले रेवेन्यू का 70% सीधे यूजर वॉलेट में ऑटोमैटिक क्रेडिट होता है।',
      icon: Cpu,
      color: 'text-teal-400 bg-teal-500/10',
    },
    {
      title: '2. कॉइन्स और रुपये (INR) का संतुलन',
      desc: 'प्रत्येक ऑटोमैटिक टास्क पर आपको कैश (₹) और कॉइन्स दोनों मिलते हैं। 10 कॉइन्स = ₹1.00 के बराबर होते हैं, जिन्हें आप कभी भी "कन्वर्ट" बटन दबाकर कैश में बदल सकते हैं।',
      icon: ArrowRightLeft,
      color: 'text-amber-400 bg-amber-500/10',
    },
    {
      title: '3. विड्रॉल कैसे और कब मिलता है?',
      desc: 'जैसे ही आपका बैलेंस ₹50 या उससे अधिक होता है, आप "विड्रॉल करें" बटन दबाकर UPI ID (Google Pay, PhonePe, Paytm), Paytm नंबर या बैंक खाता डालकर तुरंत ट्रांसफर प्राप्त कर सकते हैं। कोई छिपे हुए चार्ज या कटौती नहीं होती।',
      icon: QrCode,
      color: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      title: '4. कमाई कैसे बढ़ाएं?',
      desc: 'बॉट का लेवल अपग्रेड करके (Level 1 से Level 5) आप अपनी स्पीड 8 गुना तक बढ़ा सकते हैं। इसके अलावा डेली 7-दिन चेक-इन और लकी स्पिन से रोजाना अतिरिक्त फ्री कैश मिलता है।',
      icon: Zap,
      color: 'text-purple-400 bg-purple-500/10',
    },
  ];

  const stepsEn = [
    {
      title: '1. How does the AI Bot earn money?',
      desc: 'Our AI engine processes distributed micro-tasks in the cloud (e.g. data labeling, high-CPM SEO indexing, and affiliate localization). 70% of the yield is credited directly into your wallet.',
      icon: Cpu,
      color: 'text-teal-400 bg-teal-500/10',
    },
    {
      title: '2. Coins and Cash (INR) Balance',
      desc: 'Every automated task awards both INR and Coins. 10 Coins = ₹1.00 INR. You can convert coins anytime into cash wallet.',
      icon: ArrowRightLeft,
      color: 'text-amber-400 bg-amber-500/10',
    },
    {
      title: '3. How to Withdraw?',
      desc: 'Once your balance reaches ₹50, enter your UPI ID, Paytm mobile number, or Bank Account details. Payouts are verified with instant UTR.',
      icon: QrCode,
      color: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      title: '4. How to maximize income?',
      desc: 'Upgrade your AI Bot up to Level 5 to boost earning rate by 8x. Claim 7-day streak bonuses and spin the Lucky Wheel daily.',
      icon: Zap,
      color: 'text-purple-400 bg-purple-500/10',
    },
  ];

  const steps = isHindi ? stepsHi : stepsEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-teal-500/30 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {isHindi ? 'यह ऐप कैसे काम करता है? (How It Works)' : 'How AutoEarn AI Works'}
              </h3>
              <p className="text-xs text-slate-400">
                {isHindi ? 'पारदर्शी सिस्टम और ऑटोमैटिक रेवेन्यू मॉडल' : 'Transparent revenue model & payout guide'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${step.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-7">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            {isHindi ? 'समझ गया / कमाई शुरू करें' : 'Understood / Start Earning'}
          </button>
        </div>

      </div>
    </div>
  );
};
