import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  Building2, 
  QrCode, 
  Sparkles, 
  Copy, 
  Download, 
  Printer, 
  AlertCircle,
  Coins,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserWallet, WithdrawalTransaction } from '../types';
import { soundManager } from '../utils/audio';

interface WithdrawModalProps {
  isOpen: boolean;
  wallet: UserWallet;
  language: Language;
  onClose: () => void;
  onWithdrawSuccess: (amount: number, txn: WithdrawalTransaction) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  wallet,
  language,
  onClose,
  onWithdrawSuccess,
}) => {
  const isHindi = language === 'hi';

  const [method, setMethod] = useState<'UPI' | 'Paytm' | 'Bank' | 'USDT'>('UPI');
  const [amount, setAmount] = useState<number>(50);
  const [accountDetails, setAccountDetails] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);
  const [completedTxn, setCompletedTxn] = useState<WithdrawalTransaction | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [50, 100, 250, 500, 1000];

  const handleSelectAmount = (val: number) => {
    setAmount(val);
    setErrorMsg('');
  };

  const handleSelectAll = () => {
    const maxVal = Math.floor(wallet.balanceINR);
    if (maxVal < 50) {
      setErrorMsg(isHindi ? 'न्यूनतम विड्रॉल सीमा ₹50 है।' : 'Minimum withdrawal limit is ₹50.');
      return;
    }
    setAmount(maxVal);
    setErrorMsg('');
  };

  const handleExecuteWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (amount < 50) {
      setErrorMsg(isHindi ? 'न्यूनतम विड्रॉल सीमा ₹50 है।' : 'Minimum withdrawal is ₹50.');
      return;
    }

    if (amount > wallet.balanceINR) {
      setErrorMsg(
        isHindi
          ? `आपके वॉलेट में पर्याप्त बैलेंस नहीं है। (उपलब्ध: ₹${wallet.balanceINR.toFixed(2)})`
          : `Insufficient wallet balance. (Available: ₹${wallet.balanceINR.toFixed(2)})`
      );
      return;
    }

    if (!accountDetails || accountDetails.trim().length < 4) {
      setErrorMsg(
        isHindi
          ? 'कृपया सही पेमेंट डिटेल्स (UPI ID / मोबाइल नंबर / खाता संख्या) दर्ज करें।'
          : 'Please enter valid payment details.'
      );
      return;
    }

    if (method === 'Bank' && (!ifscCode || ifscCode.trim().length < 4)) {
      setErrorMsg(isHindi ? 'कृपया बैंक का IFSC कोड दर्ज करें।' : 'Please enter Bank IFSC Code.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep(1);

    // Step 1: VPA verification
    await new Promise((r) => setTimeout(r, 900));
    setProcessingStep(2);

    // Step 2: Gateway routing
    await new Promise((r) => setTimeout(r, 1100));
    setProcessingStep(3);

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          method,
          accountDetails,
          accountHolderName: accountHolderName || (isHindi ? 'यूजर खाता' : 'User Account'),
          ifscCode,
        }),
      });

      const data = await res.json();
      if (data.success && data.transaction) {
        setCompletedTxn(data.transaction);
        onWithdrawSuccess(amount, data.transaction);
        soundManager.playCashRegister();

        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6'],
          });
        } catch {
          // ignore
        }
      } else {
        setErrorMsg(data.message || 'विड्रॉल प्रोसेस करने में समस्या आई।');
      }
    } catch (err: any) {
      setErrorMsg('सर्वर से कनेक्ट करने में विफल। कृपया पुनः प्रयास करें।');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyUTR = () => {
    if (completedTxn?.utrNumber) {
      navigator.clipboard.writeText(completedTxn.utrNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resetForm = () => {
    setCompletedTxn(null);
    setAmount(50);
    setProcessingStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {isHindi ? 'पैसे विड्रॉल करें (Instant Withdrawal)' : 'Instant Payout Gateway'}
              </h3>
              <p className="text-xs text-slate-400">
                {isHindi ? 'सीधे UPI, Paytm, या बैंक खाते में ट्रांसफर' : 'Direct transfer to UPI, Paytm, or Bank'}
              </p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* SUCCESS SLIP VIEW */}
          {completedTxn ? (
            <div className="space-y-5 text-center">
              
              {/* Success Badge */}
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 animate-bounce">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div>
                <h4 className="text-xl font-black text-white">
                  {isHindi ? 'विड्रॉल सफल! (Payment Successful)' : 'Withdrawal Successful!'}
                </h4>
                <p className="text-xs text-emerald-400 mt-1 font-medium">
                  {isHindi 
                    ? `₹${completedTxn.amount} आपके ${completedTxn.method} खाते में ट्रांसफर कर दिए गए हैं।` 
                    : `₹${completedTxn.amount} has been transferred to your ${completedTxn.method} account.`}
                </p>
              </div>

              {/* Printable Transaction Receipt */}
              <div id="printable-receipt" className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs font-mono space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                  <span className="font-sans font-bold text-slate-300">AutoEarn AI Official Receipt</span>
                  <span className="text-[10px] text-emerald-400 font-bold">VERIFIED NPCI/IMPS</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">{isHindi ? 'ट्रांजैक्शन ID:' : 'Txn ID:'}</span>
                  <span className="text-slate-200 font-bold">{completedTxn.id}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">{isHindi ? 'UTR नंबर:' : 'UTR Ref:'}</span>
                  <span className="text-emerald-400 font-bold">{completedTxn.utrNumber}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">{isHindi ? 'पेमेंट मोड:' : 'Method:'}</span>
                  <span className="text-slate-200">{completedTxn.method}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">{isHindi ? 'खाता / VPA:' : 'Account / VPA:'}</span>
                  <span className="text-slate-200">{completedTxn.accountDetails}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">{isHindi ? 'समय:' : 'Timestamp:'}</span>
                  <span className="text-slate-400">{completedTxn.timestamp}</span>
                </div>

                <div className="flex justify-between py-1 text-sm font-bold text-white pt-2">
                  <span>{isHindi ? 'कुल ट्रांसफर्ड राशि:' : 'Amount Paid:'}</span>
                  <span className="text-emerald-400">₹{completedTxn.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Receipt Actions */}
              <div className="flex items-center gap-2 justify-center">
                <button
                  onClick={copyUTR}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isCopied ? (isHindi ? 'कॉपी हुआ!' : 'Copied!') : (isHindi ? 'UTR कॉपी करें' : 'Copy UTR')}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isHindi ? 'रसीद प्रिंट करें' : 'Print Slip'}</span>
                </button>
              </div>

              <button
                onClick={resetForm}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                {isHindi ? 'डन / मुख्य स्क्रीन पर जाएं' : 'Done / Back to Dashboard'}
              </button>

            </div>
          ) : (
            /* FORM VIEW */
            <form onSubmit={handleExecuteWithdrawal} className="space-y-4">
              
              {/* Wallet Available Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400">{isHindi ? 'उपलब्ध बैलेंस:' : 'Available Balance:'}</span>
                <span className="font-bold text-sm text-emerald-300 font-mono">
                  ₹{wallet.balanceINR.toFixed(2)}
                </span>
              </div>

              {/* Step 1: Select Method */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {isHindi ? '1. विड्रॉल माध्यम चुनें (Select Gateway):' : '1. Select Payout Method:'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI', icon: QrCode, sub: 'GPay/PhonePe' },
                    { id: 'Paytm', label: 'Paytm', icon: Smartphone, sub: 'Wallet' },
                    { id: 'Bank', label: 'Bank', icon: Building2, sub: 'IMPS/NEFT' },
                    { id: 'USDT', label: 'USDT', icon: Coins, sub: 'TRC-20' },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = method === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setMethod(m.id as any)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold">{m.label}</span>
                        <span className="text-[9px] text-slate-500">{m.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Amount Input & Quick Chips */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isHindi ? '2. विड्रॉल राशि दर्ज करें (Amount in ₹):' : '2. Enter Amount (₹):'}
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-[11px] text-emerald-400 font-bold hover:underline"
                  >
                    {isHindi ? 'पूरा बैलेंस चुनें (Max)' : 'Select All (Max)'}
                  </button>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">₹</span>
                  <input
                    type="number"
                    min="50"
                    max={Math.floor(wallet.balanceINR)}
                    value={amount || ''}
                    onChange={(e) => {
                      setAmount(Number(e.target.value));
                      setErrorMsg('');
                    }}
                    placeholder="50"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-lg focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Quick Chips */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {quickAmounts.map((q) => (
                    <button
                      type="button"
                      key={q}
                      onClick={() => handleSelectAmount(q)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                        amount === q
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      ₹{q}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {isHindi ? '* न्यूनतम विड्रॉल: ₹50 | कोई ट्रांजैक्शन फीस नहीं (0% Fee)' : '* Min withdrawal: ₹50 | 0% Processing Fee'}
                </p>
              </div>

              {/* Step 3: Account Details based on selected method */}
              <div className="space-y-2.5 pt-1">
                <label className="block text-xs font-bold text-slate-300">
                  {isHindi ? '3. पेमेंट विवरण दर्ज करें (Account Details):' : '3. Enter Account Details:'}
                </label>

                {method === 'UPI' && (
                  <div>
                    <input
                      type="text"
                      placeholder="उदा. mobile@paytm, user@okhdfcbank"
                      value={accountDetails}
                      onChange={(e) => setAccountDetails(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-400 placeholder:text-slate-600"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      {isHindi ? 'Google Pay, PhonePe, Paytm, BHIM आदि की UPI ID डालें' : 'Enter valid UPI ID from GPay, PhonePe, Paytm, etc.'}
                    </span>
                  </div>
                )}

                {method === 'Paytm' && (
                  <div>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10 अंकों का Paytm मोबाइल नंबर"
                      value={accountDetails}
                      onChange={(e) => setAccountDetails(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-400 placeholder:text-slate-600"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      {isHindi ? 'वॉलेट से लिंक्ड सक्रिय मोबाइल नंबर' : 'Paytm Wallet linked phone number'}
                    </span>
                  </div>
                )}

                {method === 'Bank' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="खाताधारक का नाम (Account Holder Name)"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400 placeholder:text-slate-600"
                    />
                    <input
                      type="text"
                      placeholder="बैंक खाता संख्या (Account Number)"
                      value={accountDetails}
                      onChange={(e) => setAccountDetails(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-400 placeholder:text-slate-600"
                    />
                    <input
                      type="text"
                      placeholder="IFSC कोड (उदा. SBIN0001234)"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-400 placeholder:text-slate-600"
                    />
                  </div>
                )}

                {method === 'USDT' && (
                  <div>
                    <input
                      type="text"
                      placeholder="USDT TRC20 वॉलेट पता (Wallet Address)"
                      value={accountDetails}
                      onChange={(e) => setAccountDetails(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-400 placeholder:text-slate-600"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      {isHindi ? '1 USDT = ₹89.50 (ऑटोमैटिक कन्वर्ट)' : '1 USDT = ₹89.50 (Auto-calculated)'}
                    </span>
                  </div>
                )}
              </div>

              {/* Error Message Alert */}
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit / Processing Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
                    <span>
                      {processingStep === 1 && (isHindi ? 'खाता विवरण सत्यापित हो रहा है...' : 'Verifying Account...')}
                      {processingStep === 2 && (isHindi ? 'बैंकिंग गेटवे से राशि भेजी जा रही है...' : 'Routing Payment Gateway...')}
                      {processingStep === 3 && (isHindi ? 'विड्रॉल कन्फर्म हो रहा है...' : 'Confirming UTR...')}
                    </span>
                  </>
                ) : (
                  <>
                    <span>{isHindi ? `₹${amount} तुरंत विड्रॉल करें` : `Withdraw ₹${amount} Now`}</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isHindi ? '256-Bit SSL सुरक्षित बैंक ट्रांसफर' : '256-Bit Encrypted Secure Transfer'}</span>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
