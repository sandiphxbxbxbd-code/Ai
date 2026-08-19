import React, { useState } from 'react';
import { Sparkles, MessageSquare, Send, Bot, RefreshCw, Lightbulb, Zap } from 'lucide-react';
import { Language, UserWallet } from '../types';

interface AiAdvisorProps {
  wallet: UserWallet;
  language: Language;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ wallet, language }) => {
  const isHindi = language === 'hi';

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [adviceResponse, setAdviceResponse] = useState<string | null>(null);

  const quickPrompts = isHindi
    ? [
        'ऑटो-बॉट से 3 गुना ज्यादा पैसे कैसे कमाएं?',
        'UPI विड्रॉल कब और कैसे प्राप्त होता है?',
        'डेली स्ट्रीक और लकी व्हील से मैक्सिमम कमाई कैसे करें?',
        'दोस्तों को रेफर करके पैसिव इनकम कैसे बनाएं?',
      ]
    : [
        'How to 3x earnings with Auto-Bot?',
        'When and how do I receive UPI payouts?',
        'How to maximize daily streak and wheel rewards?',
        'How to build passive commission through referrals?',
      ];

  const handleAsk = async (customPrompt?: string) => {
    const q = customPrompt || question;
    if (!q || q.trim().length === 0 || loading) return;

    setLoading(true);
    setAdviceResponse(null);

    try {
      const res = await fetch('/api/ai/earn-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          balance: wallet.balanceINR,
          currentLevel: wallet.botLevel,
          language,
          questions: q,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAdviceResponse(data.advice);
      }
    } catch (e) {
      setAdviceResponse(
        isHindi
          ? 'बॉट को एक्टिव रखें, डेली चेक-इन पूरा करें और बॉट लेवल अपग्रेड करके कमाई बढ़ाएं!'
          : 'Keep the bot active, complete daily check-ins, and upgrade your bot level!'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
              <span>{isHindi ? 'Gemini AI मनी एडवाइजर' : 'Gemini AI Money Advisor'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                AI Powered
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isHindi ? 'AI से पूछें कि अपनी ऑटोमैटिक कमाई को और अधिक कैसे बढ़ाएं' : 'Ask AI smart strategies to maximize passive income'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(p)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors text-left"
          >
            💡 {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder={isHindi ? 'अपना सवाल लिखें (उदा. मुझे और ज्यादा पैसे कमाने हैं)...' : 'Ask anything about earning faster...'}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-400 placeholder:text-slate-600"
        />
        <button
          onClick={() => handleAsk()}
          disabled={loading || !question.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>{isHindi ? 'पूछें' : 'Ask'}</span>
        </button>
      </div>

      {/* AI Advice Response Box */}
      {adviceResponse && (
        <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/30 text-xs text-slate-200 leading-relaxed font-sans space-y-2 whitespace-pre-line animate-fadeIn">
          <div className="flex items-center gap-1.5 text-teal-400 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>{isHindi ? 'AI रणनीति और सुझाव:' : 'AI Strategy Advice:'}</span>
          </div>
          <p className="text-slate-300">{adviceResponse}</p>
        </div>
      )}

    </div>
  );
};
