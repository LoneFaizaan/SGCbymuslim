import { useState, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, ShieldCheck, Scale, Award, Info, 
  ChevronRight, ArrowLeft, Sliders, Calculator, 
  MapPin, Phone, Mail, Send, Check 
} from 'lucide-react';
import sgcGold from '../assets/images/sgc_gold_jewelry_1779942518913.png';
import elderlyLadyGold from '../assets/images/elderly_lady_gold_1779958425132.png';
import { GOLD_RATES } from '../data';

export default function GoldWebsite({ onBackToParent, onSubmitInquiry }) {
  const [goldWeight, setGoldWeight] = useState(15);
  const [goldPurity, setGoldPurity] = useState('22K');
  const serviceChargePercent = 1.5;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const calculatorRef = useRef(null);
  const contactRef = useRef(null);

  const goldCalculation = useMemo(() => {
    const rateGram = GOLD_RATES[goldPurity];
    const totalMarketValue = goldWeight * rateGram;
    const serviceCharge = (totalMarketValue * serviceChargePercent) / 100;
    const estimatedPayout = totalMarketValue - serviceCharge;

    return {
      ratePerGram: rateGram,
      marketValue: totalMarketValue,
      serviceCharge,
      payout: estimatedPayout,
    };
  }, [goldWeight, goldPurity]);

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCalculateSubmit = (e) => {
    e.preventDefault();
    scrollToContact();
    setMsg(`I calculated my payout on SGC Gold Website: net weight of ${goldWeight}g in ${goldPurity} purity. Please provide a formal counter-rate estimate or book an assay slot.`);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitInquiry({
        name,
        email: 'No email provided (SGC Gold Portal)',
        phone,
        businessSection: 'gold',
        message: msg || `Standard validation audit requested for client's gold assets.`
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setName('');
      setPhone('');
      setMsg('');
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-gray-100 flex flex-col justify-between selection:bg-yellow-500/20 selection:text-yellow-400">
      
      {/* Dedicate SGC Gold Banner Header */}
      <header className="sticky top-0 z-40 bg-[#07070a]/95 backdrop-blur-md border-b border-yellow-500/10 py-3 sm:py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Sub-brand logo representation */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToParent}
              className="flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500 hover:text-[#060608] text-yellow-500 p-2 rounded-lg transition-all text-xs font-bold mr-1 group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">GROUP HOME</span>
            </button>
            <div className="w-9 h-9 rounded-full border border-yellow-500/40 bg-yellow-500/5 flex items-center justify-center">
              <span className="text-yellow-500 text-xs font-sans font-bold">✨</span>
            </div>
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="font-serif font-black text-sm tracking-wide text-yellow-500">SGC GOLD</span>
              </div>
              <span className="text-[8px] text-gray-400 font-sans tracking-[0.2em] leading-none uppercase block">Certified Buyers</span>
            </div>
          </div>

          {/* Sub navigation items */}
          <div className="hidden md:flex items-center space-x-6 text-[10px] font-bold tracking-[0.2em] text-gray-300">
            <button onClick={scrollToCalculator} className="hover:text-yellow-500 transition-colors">PROFIT ESTIMATOR</button>
            <button onClick={() => {}} className="hover:text-yellow-500 transition-colors cursor-default">VALUATION STANDARDS</button>
            <button onClick={scrollToContact} className="hover:text-yellow-500 transition-colors">SECURE SLOT BOOKING</button>
          </div>

          {/* Call support quick item */}
          <a
            href="tel:7889434741"
            className="text-xs bg-yellow-500 text-black px-4 py-2 rounded font-bold tracking-wider hover:bg-yellow-400 transition-all shadow-[0_4px_15px_rgba(234,179,8,0.15)] flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>7889 434 741</span>
          </a>
        </div>
      </header>

      {/* Hero presentation block */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#07070a] via-[#0d0d12] to-[#07070a]">
        
        {/* Soft gold backdrop glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-[9px] font-bold tracking-[0.2em] text-yellow-500 uppercase">
              ✨ HIGH VALUE GOLD LIQUIDATION &amp; REPURCHASES
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Unlock the Maximum Value of Your Ornaments <br />
              <span className="text-yellow-500 italic font-medium">Instantly. Securely.</span>
            </h1>

            <p className="text-sm text-gray-300 leading-relaxed font-light">
              Do not let hefty banking interest rates devalue your jewelry assets. At <strong>SGC Gold</strong>, we offer direct cash buyouts, clear gold loan settlements directly with banks, and completely computerized spectrometer assays. Walk out with maximum spot market valuations instantly.
            </p>

            <div className="grid grid-cols-3 gap-4 py-2 border-y border-yellow-500/10">
              <div>
                <span className="font-serif text-lg font-bold text-yellow-500 block">100%</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-sans font-light">Spectrometer Assay</span>
              </div>
              <div className="border-x border-yellow-500/10 px-4">
                <span className="font-serif text-lg font-bold text-yellow-500 block">₹ 0</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-sans font-light">Hidden Charge</span>
              </div>
              <div className="pl-2">
                <span className="font-serif text-lg font-bold text-yellow-500 block">Immediate</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-sans font-light">Gold Loan Settlements</span>
              </div>
            </div>

            <div className="flex gap-4 pt-3 flex-wrap">
              <button
                onClick={scrollToCalculator}
                className="bg-yellow-500 text-black px-6 py-4 rounded font-bold text-xs tracking-widest uppercase hover:bg-yellow-400 transition-all shadow-lg flex items-center gap-2"
              >
                <span>OPEN LIVE VALUATOR</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={scrollToContact}
                className="border border-yellow-500/40 hover:border-yellow-500 text-yellow-500 px-6 py-4 rounded font-bold text-xs tracking-widest uppercase hover:bg-yellow-500/5 transition-all"
              >
                BOOK INSPECTION SECONDS
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-[480px] aspect-square rounded-2xl overflow-hidden border border-yellow-500/20 shadow-2xl">
              <img
                src={sgcGold}
                alt="SGC Pure Gold repurchasers"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-transparent to-transparent flex flex-col justify-end p-6">
                <div>
                  <span className="text-[9px] text-yellow-500 font-bold tracking-widest uppercase">Purity Guaranteed</span>
                  <h3 className="font-serif text-xl font-bold text-white leading-none">Traditional &amp; Certified Gold Bullion</h3>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature section: Process block */}
      <section className="py-20 bg-[#0b0c12] border-y border-white/5 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center justify-center space-y-2 mb-16 text-center">
            <span className="text-yellow-500 text-xs font-bold tracking-[0.25em] uppercase">SYSTEMATIC FLOW</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">Our Transparent Acquisition Process</h2>
            <p className="text-xs text-gray-400 leading-relaxed font-light max-w-sm">Every step of the valuation happens directly in front of the customer.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Weight Verification',
                desc: 'Gold weight is measured on ultra-precise certified electronic balances right before your eyes, down to 0.001 grams precision.'
              },
              {
                step: '02',
                title: 'Assay Spectrometry',
                desc: 'No traditional nitric acid or scratching method. SGC uses non-destructive German-designed XRF spectrometers to estimate exact gold carat purity.'
              },
              {
                step: '03',
                title: 'Gold Loan Settlement',
                desc: 'If your gold is locked in cooperative or national banks under debt, our executives settle the dues, free the gold, and payout your balance profits.'
              },
              {
                step: '04',
                title: 'Instant SGC Cash',
                desc: 'A complete itemized computer receipt generated on spot with instant safe bank transfers or cashier-managed payouts as preferred.'
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-[#101323] p-6 rounded-xl border border-yellow-500/5 relative space-y-4">
                <span className="text-4xl font-serif font-black text-yellow-500/20 absolute top-4 right-6">{step.step}</span>
                <h4 className="font-serif text-lg font-bold text-yellow-400 relative z-10">{step.title}</h4>
                <p className="text-xs text-gray-300 font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Editorial Valuation Breakdown - "How Much is My Gold Worth?" */}
      <section className="py-20 bg-[#faf6f0] text-slate-900 border-y border-[#e5d9c9] relative text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/[0.02] rounded-full filter blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] sm:aspect-[1.1] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(112,98,82,0.15)] border border-[#e5d9c9]">
                <img
                  src={elderlyLadyGold}
                  alt="Examining precious gold ornament jewelry"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#faf6f0]/50 via-transparent to-transparent"></div>
              </div>
            </div>

            {/* Right Column: Detailed checklist and Live standard matrix */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4">
                <span className="text-[#a6804d] text-xs font-bold tracking-[0.25em] block uppercase">VALUE ASSESSMENT SPECIALISM</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  How Much is My Gold Worth?
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  We want to give you the best possible price for your gold. Here's how we evaluate your offer:
                </p>
              </div>

              {/* Bullet checklist with custom golden ring indicators */}
              <ul className="space-y-4">
                {[
                  "Examine your items for gold, silver, platinum, or other precious metals.",
                  "Determine the purity of your precious metals.",
                  "Gather the total weight of your precious metals.",
                  "Evaluate if your item is an antique, designer brand, or has numismatic value."
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-yellow-500/35 shrink-0 bg-amber-500/10 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    </div>
                    <span className="text-slate-800 font-sans text-sm font-medium leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                We take all of this into account, along with the day’s <span className="text-amber-700 font-semibold">current market price for precious metals</span>, to calculate your payout.
              </p>

              {/* Today's Market Price Card */}
              <div className="bg-white border border-[#e5d9c9] rounded-xl overflow-hidden shadow-[0_12px_30px_rgba(112,98,82,0.08)] max-w-xl">
                {/* Gold header bar */}
                <div className="bg-[#e4b24f] px-6 py-4 text-center">
                  <h4 className="text-slate-950 font-serif text-sm sm:text-base font-black tracking-wide leading-none">
                    Today’s Market Price: May 28, 2026
                  </h4>
                  <span className="text-[10px] text-slate-900 font-sans tracking-widest uppercase block mt-1 font-bold">
                    Indian Standard Market Rates
                  </span>
                </div>

                {/* Rates columns */}
                <div className="grid grid-cols-3 divide-x divide-[#e5d9c9] text-center bg-white">
                  <div className="p-4 sm:p-5 font-sans">
                    <span className="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider block">Gold (24K)</span>
                    <span className="text-slate-400 text-[9px] block mt-0.5">per 10 Grams</span>
                    <span className="text-[#090b11] text-base sm:text-lg font-mono font-black italic block mt-1">
                      ₹75,500
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 font-sans">
                    <span className="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider block">Silver</span>
                    <span className="text-slate-400 text-[9px] block mt-0.5">per 1 Kilogram</span>
                    <span className="text-[#090b11] text-base sm:text-lg font-mono font-black italic block mt-1">
                      ₹95,000
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 font-sans">
                    <span className="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider block">Platinum</span>
                    <span className="text-slate-400 text-[9px] block mt-0.5">per 10 Grams</span>
                    <span className="text-[#090b11] text-base sm:text-lg font-mono font-black italic block mt-1">
                      ₹36,500
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Gold Calculator Estimator Block section */}
      <section ref={calculatorRef} className="py-20 bg-[#07070a] text-left relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs text-yellow-500 tracking-[0.25em] font-bold block uppercase">CALCULATE NOW</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">Live Gold Payout &amp; Value Estimator</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
                Use our dynamic estimator tool to preview approximate payouts based on spot Indian Bullion rates. Select weight in grams and purity carats below to get an audit statement instantly.
              </p>
              <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-xs text-yellow-500/95 space-y-1">
                <p className="font-bold flex items-center gap-1.5"><Info className="w-3.5 h-3.5 shrink-0" /> Spot Reference Rates:</p>
                <p className="font-light">Spot standards refresh in correspondence with India Gold Market rates. Rates are calculated per fine gram of certified gold purity without manual deductibles.</p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#0d101a] border border-yellow-500/15 p-6 sm:p-8 rounded-xl shadow-2xl relative">
              <form onSubmit={handleCalculateSubmit} className="space-y-6">
                
                {/* Weight Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-gray-300 font-semibold uppercase tracking-wider">Weight (Grams)</label>
                    <span className="font-mono text-sm text-yellow-400 bg-yellow-500/10 px-3 py-1 font-bold rounded">
                      {goldWeight} g
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setGoldWeight(w => Math.max(1, w - 5))}
                      className="w-10 h-10 rounded bg-[#151a2e] hover:bg-yellow-500 hover:text-black flex items-center justify-center font-bold text-white transition-colors"
                    >
                      -5g
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="200"
                      value={goldWeight}
                      onChange={(e) => setGoldWeight(Number(e.target.value))}
                      className="flex-1 accent-yellow-500 cursor-pointer h-1.5 bg-[#171a2e] rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setGoldWeight(w => Math.min(500, w + 5))}
                      className="w-10 h-10 rounded bg-[#151a2e] hover:bg-yellow-500 hover:text-black flex items-center justify-center font-bold text-white transition-colors"
                    >
                      +5g
                    </button>
                  </div>
                </div>

                {/* Carat Option */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-300 font-semibold uppercase block">Select Gold Purity</label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {Object.keys(GOLD_RATES).map((carat) => (
                      <button
                        type="button"
                        key={carat}
                        onClick={() => setGoldPurity(carat)}
                        className={`py-3 px-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          goldPurity === carat
                            ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/10'
                            : 'bg-[#151a2e] border-yellow-500/10 hover:border-yellow-500/30 text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        {carat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estimation Breakdown ledger */}
                <div className="bg-[#080a14] rounded-lg p-5 space-y-3 font-sans text-xs sm:text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Rate Per Gram ({goldPurity})</span>
                    <span className="font-mono text-gray-200">₹{goldCalculation.ratePerGram.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gold Market Value</span>
                    <span className="font-mono text-gray-200">₹{goldCalculation.marketValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGC Service Fee ({serviceChargePercent}%)</span>
                    <span className="font-mono text-red-400">- ₹{goldCalculation.serviceCharge.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-yellow-500/10 pt-3 flex justify-between items-center text-sm font-bold mt-2">
                    <span className="text-yellow-500 uppercase tracking-wider text-xs">Estimated Spot Payout</span>
                    <span className="font-mono text-lg text-emerald-400">
                      ₹{Math.round(goldCalculation.payout).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Proceed button */}
                <button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(234,179,8,0.2)]"
                >
                  <span>REQUEST QUOTE STATEMENT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Secure Slot Contact Form Booking Section */}
      <section ref={contactRef} className="py-20 bg-[#0d0d12] text-left border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-yellow-500 font-bold uppercase tracking-[0.2em]">Contact SGC Gold Division</span>
            <h2 className="font-serif text-3xl font-bold text-white">Book an Appointment or Spot Assay</h2>
            <p className="text-xs text-gray-400 leading-normal max-w-sm mx-auto font-light">Submit your details below to schedule direct service at our Lal Chowk vaults office.</p>
          </div>

          <div className="bg-[#07070a] border border-yellow-500/15 rounded-2xl p-6 sm:p-8 shadow-xl">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#111425] border border-white/5 focus:border-yellow-500/50 rounded p-3 text-xs outline-none text-white transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#111425] border border-white/5 focus:border-yellow-500/50 rounded p-3 text-xs outline-none text-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Remarks / Assay Weight (if any)</label>
                <textarea
                  rows={3}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Tell us about your gold ornaments weight or gold loan bank if you want a settlement"
                  className="w-full bg-[#111425] border border-white/5 focus:border-yellow-500/50 rounded p-3 text-xs outline-none text-white transition-colors resize-none"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-gray-500">🔒 Secure end-to-end user privacy guaranteed.</span>
                
                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-black px-6 py-3 rounded font-bold text-xs tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>TRANSMITTING...</span>
                  ) : submitSuccess ? (
                    <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-800" /> APPOINTMENT SECURED</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /> DISPATCH REQUEST</span>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* Mini gold footer */}
      <footer className="bg-[#07070a] border-t border-yellow-500/10 py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p>© {new Date().getFullYear()} SGC Gold division of Salafiya Group of Companies. Licensed buyers standard audit protocols.</p>
          <div className="flex justify-center gap-6 text-[10px]">
            <span>Gold Vaults: Lal Chowk, Kashmir</span>
            <span>Tel: 7889 434 741</span>
            <button onClick={onBackToParent} className="text-yellow-500 font-bold underline hover:text-yellow-400 cursor-pointer">
              SGC MAIN GROUP WEBSITE
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
