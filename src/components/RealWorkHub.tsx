import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  Zap, 
  Coins, 
  ArrowRight, 
  RefreshCw, 
  Play, 
  Pause, 
  Award, 
  ExternalLink,
  DollarSign,
  FileText,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserWallet, TaskLogItem } from '../types';
import { soundManager } from '../utils/audio';

interface RealWorkHubProps {
  wallet: UserWallet;
  language: Language;
  onUpdateWallet: (updated: Partial<UserWallet>) => void;
  onAddLog: (log: TaskLogItem) => void;
  onOpenWithdraw: () => void;
}

interface GigItem {
  id: string;
  titleHi: string;
  titleEn: string;
  client: string;
  payoutINR: number;
  payoutCoins: number;
  category: string;
  descriptionHi: string;
  descriptionEn: string;
  samplePromptHi: string;
  samplePromptEn: string;
  tag: string;
}

export const RealWorkHub: React.FC<RealWorkHubProps> = ({
  wallet,
  language,
  onUpdateWallet,
  onAddLog,
  onOpenWithdraw,
}) => {
  const isHindi = language === 'hi';

  const gigs: GigItem[] = [
    {
      id: 'gig-1',
      titleHi: 'ई-कॉमर्स प्रोडक्ट सेल्स एड-कॉपी (Amazon / Flipkart)',
      titleEn: 'E-commerce Product Ad Copy (Amazon / Flipkart)',
      client: 'RetailMax India Pvt Ltd',
      payoutINR: 15.00,
      payoutCoins: 100,
      category: 'Copywriting',
      descriptionHi: 'ऑनलाइन सेलर्स के लिए हाई-कन्वर्टिंग प्रोडक्ट डिस्क्रिप्शन और एड-कॉपी तैयार करें।',
      descriptionEn: 'Generate high-converting product descriptions & ad copy for e-commerce brands.',
      samplePromptHi: 'स्मार्टवॉच और फिटनेस ट्रैकर के लिए Amazon लिस्टिंग कॉपी',
      samplePromptEn: 'Amazon listing copy for a premium Fitness Smartwatch',
      tag: '🔥 सबसे ज्यादा मांग',
    },
    {
      id: 'gig-2',
      titleHi: 'यूट्यूब शॉर्ट्स & रील्स 30-सेकंड वायरल स्क्रिप्ट',
      titleEn: 'YouTube Shorts & Reels 30s Viral Script',
      client: 'TrendPulse Creators Network',
      payoutINR: 22.50,
      payoutCoins: 150,
      category: 'Scriptwriting',
      descriptionHi: 'सोशल मीडिया कंटेंट क्रिएटर्स के लिए वायरल हुक और कॉल-टू-एक्शन स्क्रिप्ट लिखें।',
      descriptionEn: 'Write viral 30-second scripts with high-retention hooks and CTAs for creators.',
      samplePromptHi: 'पैसिव इनकम और ऑनलाइन अर्निंग पर 30-सेकंड वायरल रील स्क्रिप्ट',
      samplePromptEn: '30-second viral reel script on building passive income with AI',
      tag: '⚡ हाई पेआउट',
    },
    {
      id: 'gig-3',
      titleHi: 'इंग्लिश से हिंदी बिजनेस ट्रांसलेशन & लोकलाइजेशन',
      titleEn: 'English to Hindi Business Localization',
      client: 'GlobalTech Media Solutions',
      payoutINR: 18.00,
      payoutCoins: 120,
      category: 'Translation',
      descriptionHi: 'बिजनेस आर्टिकल्स और टेक गाइड्स का शुद्ध एवं पेशेवर हिंदी में रूपांतरण।',
      descriptionEn: 'Accurate and fluent English to Hindi business localization and proofreading.',
      samplePromptHi: 'डिजिटल पेमेंट और UPI सुरक्षा नियमों का हिंदी अनुवाद',
      samplePromptEn: 'Digital payment security & UPI guidelines translated to Hindi',
      tag: '⭐ वेरिफाइड क्लाइंट',
    },
    {
      id: 'gig-4',
      titleHi: 'हाई-सीपीएम ब्लॉग एसईओ (SEO) कीवर्ड्स व मेटा-टैग्स',
      titleEn: 'High-CPM Blog SEO Keywords & Meta-Tags',
      client: 'DigiRank Digital Marketing',
      payoutINR: 20.00,
      payoutCoins: 140,
      category: 'SEO Marketing',
      descriptionHi: 'गूगल रैंकिंग के लिए हाई-CPC सर्च कीवर्ड्स, मेटा टाइटल और डिस्क्रिप्शन तैयार करें।',
      descriptionEn: 'High-CPC search keywords, structured meta titles, and descriptions for publishers.',
      samplePromptHi: 'फाइनेंस और इन्वेस्टमेंट ब्लॉग के लिए टॉप 10 हाई-CPC कीवर्ड्स',
      samplePromptEn: 'Top 10 High-CPC keywords and meta tags for Personal Finance blog',
      tag: '📈 ट्रेंडिंग',
    },
    {
      id: 'gig-5',
      titleHi: 'प्रोफेशनल रेज्यूमे & लिंक्डइन समरी ऑप्टिमाइज़र',
      titleEn: 'Professional Resume & LinkedIn Summary Optimizer',
      client: 'TalentHub HR Services',
      payoutINR: 25.00,
      payoutCoins: 160,
      category: 'Career Gig',
      descriptionHi: 'जॉब चाहने वालों के लिए प्रभावशाली लिंक्डइन अबाउट समरी और उपलब्धियां बनाएं।',
      descriptionEn: 'Craft high-impact LinkedIn summaries and achievement bullets for professionals.',
      samplePromptHi: 'सीनियर सॉफ्टवेयर इंजीनियर और डिजिटल मार्केटर का लिंक्डइन बायो',
      samplePromptEn: 'Senior Software Engineer & Digital Marketer LinkedIn bio',
      tag: '💎 प्रीमियम गिग',
    },
  ];

  const [selectedGig, setSelectedGig] = useState<GigItem>(gigs[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [completedResult, setCompletedResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-Freelancer Loop Mode
  const [isAutoGigRunning, setIsAutoGigRunning] = useState(false);

  const handleExecuteGig = async (gigToRun?: GigItem) => {
    const gig = gigToRun || selectedGig;
    setIsExecuting(true);
    setCompletedResult(null);

    try {
      const res = await fetch('/api/ai/execute-gig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gigId: gig.id,
          customTopic: customTopic || (isHindi ? gig.samplePromptHi : gig.samplePromptEn),
          language,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCompletedResult(data);

        // Update Wallet balance
        const updatedINR = Number((wallet.balanceINR + data.payoutINR).toFixed(2));
        const updatedCoins = wallet.balanceCoins + data.payoutCoins;
        const updatedEarned = Number((wallet.totalEarnedINR + data.payoutINR).toFixed(2));

        onUpdateWallet({
          balanceINR: updatedINR,
          balanceCoins: updatedCoins,
          totalEarnedINR: updatedEarned,
        });

        soundManager.playCashRegister();

        // Confetti celebration
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        // Add to Task Logs
        onAddLog({
          id: 'gig-' + Date.now(),
          title: `${isHindi ? 'फ्रीलांस कार्य पूर्ण' : 'Gig Delivered'}: ${data.title}`,
          rewardINR: data.payoutINR,
          rewardCoins: data.payoutCoins,
          summary: isHindi
            ? `क्लाइंट '${data.client}' द्वारा कार्य स्वीकृत (क्वालिटी: ${data.qualityScore})। ₹${data.payoutINR} खाते में क्रेडिट!`
            : `Delivered to '${data.client}' with ${data.qualityScore} score. ₹${data.payoutINR} credited!`,
          timestamp: data.timestamp,
          type: 'ai_task',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecuting(false);
    }
  };

  // Auto Gig Interval
  useEffect(() => {
    let interval: any;
    if (isAutoGigRunning) {
      interval = setInterval(() => {
        const randomGig = gigs[Math.floor(Math.random() * gigs.length)];
        setSelectedGig(randomGig);
        handleExecuteGig(randomGig);
      }, 16000);
    }
    return () => clearInterval(interval);
  }, [isAutoGigRunning, wallet]);

  const handleCopyDeliverable = () => {
    if (!completedResult?.deliverable) return;
    navigator.clipboard.writeText(completedResult.deliverable);
    setCopied(true);
    soundManager.playCoin();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Real Indian Rupees Earning Hub */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-white">
                {isHindi ? 'रियल मनी वर्क & फ्रीलांस गिग्स (Real Digital Work in ₹ INR)' : 'Real Money Work & Freelance Gigs Hub'}
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black">
                100% Instant ₹ Payouts
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isHindi
                ? 'AI आपके लिए असली कंपनियों व ऑनलाइन सेलर्स के लिए काम (कंटेंट राइटिंग, ट्रांसलेशन, स्क्रिप्ट्स, SEO) पूरा करता है और प्रति टास्क ₹15 से ₹25 सीधे आपके वॉलेट में क्रेडिट करता है जिसे आप तुरंत UPI/Paytm पर निकाल सकते हैं।'
                : 'AI automatically executes real-world client deliverables (Copywriting, Video Scripts, Translations, SEO) and credits ₹15-₹25 per task directly to your cash wallet.'}
            </p>
          </div>
        </div>

        {/* Auto Freelancer Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsAutoGigRunning(!isAutoGigRunning)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
              isAutoGigRunning
                ? 'bg-amber-500 text-slate-950 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isAutoGigRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current text-emerald-400" />}
            <span>
              {isAutoGigRunning
                ? (isHindi ? 'ऑटो-फ्रीलांसर चालू है...' : 'Auto-Gigs Running...')
                : (isHindi ? 'ऑटो-फ्रीलांसर ऑन करें' : 'Start Auto-Freelancer')}
            </span>
          </button>

          <button
            onClick={onOpenWithdraw}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <DollarSign className="w-4 h-4 stroke-[3]" />
            <span>{isHindi ? 'विड्रॉल करें' : 'Withdraw ₹'}</span>
          </button>
        </div>
      </div>

      {/* Main Gigs Grid & Live Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Available Paid Gigs List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span>{isHindi ? 'उपलब्ध पेड माइक्रो-गिग्स (Available Tasks)' : 'Available Paid Micro-Gigs'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {gigs.length} Live Gigs
              </span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              {isHindi ? 'तत्काल भुगतान' : 'Instant ₹ Credit'}
            </span>
          </div>

          <div className="space-y-2.5">
            {gigs.map((gig) => {
              const isSelected = selectedGig.id === gig.id;
              return (
                <div
                  key={gig.id}
                  onClick={() => {
                    setSelectedGig(gig);
                    setCustomTopic('');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-400 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">
                          {isHindi ? gig.titleHi : gig.titleEn}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-slate-800 text-teal-300 border border-slate-700">
                          {gig.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {isHindi ? gig.descriptionHi : gig.descriptionEn}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="text-slate-400">🏢 {gig.client}</span>
                        <span>•</span>
                        <span className="text-amber-400 flex items-center gap-0.5">
                          <Coins className="w-3 h-3" />
                          +{gig.payoutCoins} coins
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base sm:text-lg font-black font-mono text-emerald-400">
                        +₹{gig.payoutINR.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {isSelected ? (isHindi ? '✓ चुना गया' : 'Selected') : (isHindi ? 'चुनें' : 'Select')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Interactive AI Worker & Submission Terminal (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    {isHindi ? 'AI गिग एग्जीक्यूशन कंसोल' : 'AI Gig Execution Console'}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {isHindi ? selectedGig.titleHi : selectedGig.titleEn}
                  </span>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-emerald-400 text-sm">
                +₹{selectedGig.payoutINR.toFixed(2)}
              </div>
            </div>

            {/* Custom context input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                {isHindi ? 'कस्टम विषय / प्रोडक्ट (वैकल्पिक):' : 'Custom Topic / Product (Optional):'}
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder={isHindi ? selectedGig.samplePromptHi : selectedGig.samplePromptEn}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-400 placeholder:text-slate-600"
              />
            </div>

            {/* Run button */}
            <button
              onClick={() => handleExecuteGig()}
              disabled={isExecuting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isHindi ? 'AI कार्य तैयार और सबमिट कर रहा है...' : 'AI Generating Deliverable...'}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>
                    {isHindi
                      ? `AI से काम करवाएं और तुरंत ₹${selectedGig.payoutINR.toFixed(2)} पाएं`
                      : `Execute Task & Earn ₹${selectedGig.payoutINR.toFixed(2)}`}
                  </span>
                </>
              )}
            </button>

            {/* Deliverable Result Box */}
            {completedResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    {isHindi ? 'कार्य स्वीकृत • ₹ क्रेडिट हुआ' : 'Approved • ₹ Credited'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    Quality: {completedResult.qualityScore}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 whitespace-pre-line max-h-48 overflow-y-auto no-scrollbar font-sans leading-relaxed p-2 bg-slate-900/80 rounded-lg">
                  {completedResult.deliverable}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleCopyDeliverable}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-teal-400" />}
                    <span>{copied ? (isHindi ? 'कॉपी हुआ!' : 'Copied!') : (isHindi ? 'कार्य कॉपी करें' : 'Copy Work')}</span>
                  </button>

                  <button
                    onClick={onOpenWithdraw}
                    className="text-xs text-emerald-400 hover:underline font-bold"
                  >
                    {isHindi ? 'तुरंत विड्रॉल करें →' : 'Withdraw Cash →'}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Direct Freelance Monetization Guide */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{isHindi ? 'रियल क्लाइंट्स से पैसे कैसे कमाएं?' : 'Direct Client Monetization Tip'}</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isHindi
                ? 'यहाँ जनरेट किए गए कंटेंट को आप सीधे Fiverr, Freelancer, Upwork या WhatsApp क्लाइंट्स को ₹500 से ₹2000 प्रति प्रोजेक्ट बेच सकते हैं। "कार्य कॉपी करें" बटन का उपयोग करें।'
                : 'You can sell deliverables generated here to clients on Fiverr, Freelancer, and Upwork for ₹500 - ₹2000 per project. Use the "Copy Work" button.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
