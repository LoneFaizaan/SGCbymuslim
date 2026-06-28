import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, ShieldCheck, Scale, Award, Info, 
  ChevronRight, ArrowLeft, Sliders, Calculator, 
  MapPin, Phone, Mail, Send, Check, AlertCircle,
  FileText, Shield, UserCheck, HelpCircle, ChevronDown
} from 'lucide-react';
import sgcGold from '../assets/images/sgc_gold_jewelry_1779942518913.png';
import elderlyLadyGold from '../assets/images/elderly_lady_gold_1779958425132.png';
import sgcLogo from '../assets/images/sgc_logo_uploaded.png';
import { GOLD_RATES } from '../data';

export default function GoldWebsite({ onBackToParent, onSubmitInquiry }) {
  // Calculator States
  const [goldWeight, setGoldWeight] = useState(15);
  const [goldPurity, setGoldPurity] = useState('22K');
  const [isPledged, setIsPledged] = useState(false);
  const [loanAmount, setLoanAmount] = useState('');
  const serviceChargePercent = 1.5;

  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Accordion FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Clipboard link state
  const [copied, setCopied] = useState(false);

  // References
  const calculatorRef = useRef(null);
  const contactRef = useRef(null);
  const infoRef = useRef(null);

  const handleCopyLandingUrl = () => {
    try {
      // Use the bulletproof query param method so hard reloads on any host never throw a 404
      const directUrl = window.location.origin + '/?division=gold';
      navigator.clipboard.writeText(directUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy direct URL', err);
    }
  };

  // Inject structured JSON-LD SEO Schema and dynamic SEO tags on Mount
  useEffect(() => {
    // Save original title and descriptions to restore them upon navigating back to group portal
    const previousTitle = document.title;
    
    // Manage dynamic metadata elements for gold business SEO optimization
    let descMeta = document.querySelector('meta[name="description"]');
    const previousDesc = descMeta ? descMeta.getAttribute('content') : '';
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }

    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    const previousKeywords = keywordsMeta ? keywordsMeta.getAttribute('content') : '';
    if (!keywordsMeta) {
      keywordsMeta = document.createElement('meta');
      keywordsMeta.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsMeta);
    }

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    const previousOgTitle = ogTitleMeta ? ogTitleMeta.getAttribute('content') : '';
    if (!ogTitleMeta) {
      ogTitleMeta = document.createElement('meta');
      ogTitleMeta.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleMeta);
    }

    let ogDescMeta = document.querySelector('meta[property="og:description"]');
    const previousOgDesc = ogDescMeta ? ogDescMeta.getAttribute('content') : '';
    if (!ogDescMeta) {
      ogDescMeta = document.createElement('meta');
      ogDescMeta.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescMeta);
    }

    let ogUrlMeta = document.querySelector('meta[property="og:url"]');
    const previousOgUrl = ogUrlMeta ? ogUrlMeta.getAttribute('content') : '';
    if (!ogUrlMeta) {
      ogUrlMeta = document.createElement('meta');
      ogUrlMeta.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrlMeta);
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    const previousCanonical = canonicalLink ? canonicalLink.getAttribute('href') : '';
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }

    // Set high-converting, fully SEO-optimized titles and search descriptions
    document.title = "Gold Loan Chandigarh & Trusted Gold Buyer - Settle & Release Pledged Loans | SGC Gold";
    descMeta.setAttribute('content', "SGC Gold is Chandigarh & Srinagar's premium trusted gold buyer. We settle outstanding pledged gold loans from Muthoot, Manappuram, IIFL & banks, releasing mortgaged gold in Chandigarh, Mohali, Panchkula, Zirakpur & Srinagar. Highest spot rates with zero melting loss.");
    keywordsMeta.setAttribute('content', "Gold Loan Chandigarh, Gold Finance Chandigarh, Gold Buyer Chandigarh, Sell Gold Chandigarh, Buy Gold Chandigarh, Gold Loan Settlement Chandigarh, Gold Loan Assistance Chandigarh, Gold Loan Consultant Chandigarh, Gold Valuation Chandigarh, Best Gold Loan Chandigarh, Instant Gold Loan Chandigarh, Gold Financing Chandigarh, Trusted Gold Buyer Chandigarh, Gold Mortgage Chandigarh, Gold Loan Near Me, Gold Buyers Near Me, Sell Old Gold Chandigarh, Best Gold Rate Chandigarh, Gold Finance Company Chandigarh, Gold Settlement Services Chandigarh, Loan Settlement Experts Chandigarh, Gold Loan Closure Chandigarh, Gold Loan Transfer Chandigarh, Srinagar gold buyer, cash for gold Kashmir");
    ogTitleMeta.setAttribute('content', "SGC Gold - Gold Loan Settlement & Gold Buyer Chandigarh Tricity");
    ogDescMeta.setAttribute('content', "Release your pledged gold loan at Muthoot, Manappuram or IIFL. SGC Group settles your bank dues and buys back your gold surplus at the highest spot rates across Chandigarh, Mohali, Panchkula & Srinagar.");
    ogUrlMeta.setAttribute('content', window.location.origin + '/?division=gold');
    canonicalLink.setAttribute('href', window.location.origin + '/?division=gold');

    // Schema Markup
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "FinancialService",
          "@id": window.location.origin + "/?division=gold#financialservice",
          "name": "SGC Gold Buying & Pledged Gold Loan Settlement Desk",
          "description": "SGC Gold is the Chandigarh Tricity and Srinagar region's premier gold buyer and finance consultancy, specializing in releasing pledged gold loans from Muthoot, Manappuram, IIFL and commercial banks, with XRF spectrometer testing.",
          "url": window.location.origin + "/?division=gold",
          "telephone": "+917889434741",
          "priceRange": "₹₹₹",
          "image": window.location.origin + "/src/assets/images/sgc_gold_jewelry_1779942518913.png",
          "address": [
            {
              "@type": "PostalAddress",
              "streetAddress": "Sector 17 Commercial Area",
              "addressLocality": "Chandigarh",
              "addressRegion": "Chandigarh Tricity",
              "postalCode": "160017",
              "addressCountry": "IN"
            },
            {
              "@type": "PostalAddress",
              "streetAddress": "Lal Chowk",
              "addressLocality": "Srinagar",
              "addressRegion": "Jammu & Kashmir",
              "postalCode": "190001",
              "addressCountry": "IN"
            }
          ],
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "30.7333",
            "longitude": "76.7794"
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "09:30",
            "closes": "19:00"
          },
          "areaServed": [
            {
              "@type": "AdministrativeArea",
              "name": "Chandigarh"
            },
            {
              "@type": "AdministrativeArea",
              "name": "Mohali"
            },
            {
              "@type": "AdministrativeArea",
              "name": "Panchkula"
            },
            {
              "@type": "AdministrativeArea",
              "name": "Zirakpur"
            },
            {
              "@type": "AdministrativeArea",
              "name": "Tricity Region"
            },
            {
              "@type": "AdministrativeArea",
              "name": "Srinagar"
            }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "SGC Gold Solutions",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Pledged Gold Loan Settlement & Release",
                  "description": "We pay off outstanding principal and high interest gold loan balances at Muthoot, Manappuram, IIFL, or nationalized banks on your behalf, release the mortgaged gold ornaments, and return the maximum cash surplus instantly."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Instant Cash For Gold Ornaments",
                  "description": "Transparent gold purchasing for old, damaged, or scrap gold jewelry at real-time market-leading spot bullion rates."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Computerized XRF Spectrometer Assay Verification",
                  "description": "Non-destructive purity scanning using advanced German spectrometer technology for 100% accurate results with zero weight or melting loss."
                }
              }
            ]
          }
        },
        {
          "@type": "FAQPage",
          "@id": window.location.origin + "/?division=gold#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How does gold loan settlement work in Chandigarh Tricity?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "SGC Gold provides an ethical alternative to auction foreclosures. When your gold is pledged with lenders (like Muthoot Finance, Manappuram Finance, IIFL, or banks) and interest is mounting, our executive accompanies you to the branch, settles all outstanding bank dues, releases the physical gold ornaments, tests them via our non-destructive XRF spectrometer, and pays you the remaining valuation balance in instant cash, UPI, or bank transfer."
              }
            },
            {
              "@type": "Question",
              "name": "Where can I get the best rate to sell old gold in Chandigarh, Mohali, or Panchkula?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "SGC Gold offers top-value payouts based on real-time daily spot gold prices. By utilizing computerized German spectrometer purity analysis instead of outdated acid scratch testing, we prevent any melting or weight loss deductions, ensuring you receive the absolute highest valuation for your 24k, 22k, 18k, or 14k gold in the Tricity region."
              }
            },
            {
              "@type": "Question",
              "name": "What are the service charges for releasing pledged gold loan accounts?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "SGC Gold charges a transparent flat fee of only 1.5% as a handling and processing service charge on the absolute gross value of your gold. There are absolutely no hidden administrative fees, melt fees, or weight deduction penalties, giving you the best possible financial outcome."
              }
            }
          ]
        }
      ]
    };

    const scriptId = 'sgc-gold-seo-schema';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      // Restore previous SEO states when unmounting
      document.title = previousTitle;
      if (previousDesc) descMeta.setAttribute('content', previousDesc);
      if (previousKeywords) keywordsMeta.setAttribute('content', previousKeywords);
      if (previousOgTitle) ogTitleMeta.setAttribute('content', previousOgTitle);
      if (previousOgDesc) ogDescMeta.setAttribute('content', previousOgDesc);
      if (previousOgUrl) ogUrlMeta.setAttribute('content', previousOgUrl);
      if (previousCanonical) {
        canonicalLink.setAttribute('href', previousCanonical);
      } else {
        canonicalLink.remove();
      }

      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Compute live calculations
  const goldCalculation = useMemo(() => {
    const rateGram = GOLD_RATES[goldPurity] || 6920;
    const totalMarketValue = goldWeight * rateGram;
    const serviceCharge = (totalMarketValue * serviceChargePercent) / 100;
    const estimatedValueBeforeLoan = totalMarketValue - serviceCharge;
    
    const parsedLoan = parseFloat(loanAmount) || 0;
    const netSurplusPayout = estimatedValueBeforeLoan - parsedLoan;

    return {
      ratePerGram: rateGram,
      marketValue: totalMarketValue,
      serviceCharge,
      payoutBeforeLoan: estimatedValueBeforeLoan,
      netSurplus: netSurplusPayout,
      loanDeduction: parsedLoan,
    };
  }, [goldWeight, goldPurity, isPledged, loanAmount]);

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToInfo = () => {
    infoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCalculateSubmit = (e) => {
    e.preventDefault();
    scrollToContact();
    let computedMessage = `I calculated my payout on SGC Gold Website: weight of ${goldWeight}g in ${goldPurity} purity.`;
    if (isPledged && goldCalculation.loanDeduction > 0) {
      computedMessage += ` Outstanding loan of ₹${goldCalculation.loanDeduction.toLocaleString('en-IN')} needs bank release assistance. Estimated surplus payout is ₹${Math.round(goldCalculation.netSurplus).toLocaleString('en-IN')}.`;
    } else {
      computedMessage += ` Estimated payout is ₹${Math.round(goldCalculation.payoutBeforeLoan).toLocaleString('en-IN')}.`;
    }
    computedMessage += ` Please book an assay slot.`;
    setMsg(computedMessage);
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
        message: msg || `Spot appraisal and gold assessment request. Purity: ${goldPurity}, Weight: ${goldWeight}g.`
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setName('');
      setPhone('');
      setMsg('');
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1500);
  };

  // Toggle FAQ Accordion
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "What is Pledged Gold Loan Settlement in Chandigarh Tricity or Srinagar?",
      a: "If your gold ornaments are locked or mortgaged with local gold loan companies, banks, or NBFCs like Muthoot Finance, Manappuram Finance, or IIFL in Chandigarh, Mohali, Panchkula, Zirakpur, or Srinagar, and you are trapped under high interest, SGC Gold offers professional clearance services. Our designated executive accompanies you to the bank branch, settles your entire outstanding dues on your behalf, releases your physical gold, tests it via a computerized German spectrometer, and pays you the high remaining cash surplus on the spot."
    },
    {
      q: "Who is the most trusted Gold Buyer in Chandigarh and the Tricity region?",
      a: "SGC Gold is recognized as a premier trusted gold buyer in Chandigarh, Mohali, Panchkula, and Zirakpur. By using advanced non-destructive X-Ray Fluorescence (XRF) spectrometer scanners instead of outdated acid scratch methods, we ensure zero weight loss or melting deductions. You receive the absolute highest valuation for your jewelry according to the day's live spot rates."
    },
    {
      q: "What documents are required to sell gold or close a gold loan?",
      a: "To ensure absolute compliance with guidelines in Chandigarh & Srinagar, sellers must be 21+ years old and provide: (1) Aadhaar Card or Passport for local address verification, (2) PAN Card for tax compliance, (3) The original purchase invoice of your jewelry if available, and (4) The original pledge receipt or pawn ticket issued by your lender."
    },
    {
      q: "Are there any hidden fees or deductions at SGC Gold desk?",
      a: "No, we follow a strictly transparent pricing policy. SGC Gold charges a nominal processing and service fee of only 1.5% on the gross value of your gold. Unlike local jewelers, we do not apply hidden melting charges, stone weight deductions, or standard custom discounts, resulting in the maximum cash surplus payout."
    },
    {
      q: "How can I check the live gold loan release value before visiting?",
      a: "You can use our online Live Gold Loan Surplus Estimator above. Enter the weight of your ornaments, select the purity, and enter your outstanding loan amount. The calculator will estimate the current gross value and show you the exact cash surplus you will take home."
    }
  ];

  return (
    <div className="min-h-screen bg-[#060608] text-gray-100 flex flex-col justify-between selection:bg-yellow-500/20 selection:text-yellow-400 font-sans">
      
      {/* 1. STICKY SUB-BRAND HEADER */}
      <header className="sticky top-0 z-40 bg-[#060608]/95 backdrop-blur-md border-b border-yellow-500/10 py-3 sm:py-4 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToParent}
              className="flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500 hover:text-black text-yellow-500 px-3 py-1.5 rounded transition-all text-[11px] font-bold group cursor-pointer border border-yellow-500/20"
              id="gold-back-to-group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>GROUP PORTAL</span>
            </button>
            <div className="relative w-8 h-8 flex items-center justify-center hidden xs:flex shrink-0">
              <img 
                src={sgcLogo} 
                alt="SGC Logo" 
                referrerPolicy="no-referrer"
                className="absolute w-10 h-10 max-w-none object-contain" 
              />
            </div>
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="font-serif font-black text-sm tracking-wide text-yellow-500">SGC GOLD BUYERS</span>
              </div>
              <span className="text-[8px] text-gray-400 font-sans tracking-[0.18em] leading-none uppercase block mt-0.5">Pledge Release &amp; Spot Cash Desk</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6 text-[10px] font-bold tracking-[0.15em] text-gray-300">
            <button onClick={scrollToInfo} className="hover:text-yellow-500 transition-colors uppercase cursor-pointer">PLEDGE RELEASE GUIDE</button>
            <button onClick={scrollToCalculator} className="hover:text-yellow-500 transition-colors uppercase cursor-pointer">LIVE SURPLUS CALCULATOR</button>
            <button onClick={scrollToContact} className="hover:text-yellow-500 transition-colors uppercase cursor-pointer">BOOK SLOT</button>
            
            <button
              onClick={handleCopyLandingUrl}
              className="flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500 hover:text-black px-2.5 py-1.5 rounded transition-all text-[9px] font-mono tracking-normal border border-yellow-500/20 cursor-pointer font-bold"
              title="Click to copy direct bookmarkable landing page URL"
              id="gold-copy-header-link"
            >
              <span>URL: /SGC Gold</span>
              {copied ? (
                <span className="text-emerald-400 font-bold ml-1">✓ COPIED</span>
              ) : (
                <span className="text-yellow-500 ml-1">📋</span>
              )}
            </button>
          </div>

          <a
            href="tel:7889434741"
            className="text-xs bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-4 py-2 rounded font-bold tracking-wider hover:from-yellow-500 hover:to-yellow-400 transition-all shadow-[0_4px_15px_rgba(234,179,8,0.2)] flex items-center gap-1.5 border border-yellow-400/20"
            id="gold-call-support"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="font-mono">7889 434 741</span>
          </a>
        </div>
      </header>

      {/* 2. PREMIUM HERO BLOCK */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#060608] via-[#0b0c12] to-[#060608]">
        {/* Soft gold backdrop glowing spot */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-500/[0.03] rounded-full filter blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex flex-wrap gap-2.5 items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-yellow-500/20 bg-yellow-500/5 text-[9px] font-bold tracking-[0.15em] text-yellow-500 uppercase">
                🏆 ISO 9001:2015 CERTIFIED TRUSTED GOLD LIQUIDATION AGENTS
              </div>
              <button
                onClick={handleCopyLandingUrl}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 text-[9px] sm:text-[10px] font-mono text-yellow-500 transition-all cursor-pointer font-semibold shadow-sm hover:border-yellow-500"
                title="Click to copy direct bookmarkable landing page URL to your clipboard"
                id="gold-hero-copy-url"
              >
                <span>🔗 DIRECT LINK: /SGC Gold</span>
                {copied ? (
                  <span className="text-emerald-400 font-sans font-bold">✓ COPIED</span>
                ) : (
                  <span className="text-gray-400 font-sans">📋 COPY</span>
                )}
              </button>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Best Price For Your Gold — <br />
              <span className="text-yellow-500 italic font-medium">Settle &amp; Release Pledged Bank Loans Instantly</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Are you paying heavy compound interest rates on your mortgaged gold? Don't lose your family heirloom ornaments to auction foreclosures. <strong>SGC Gold</strong> is Chandigarh &amp; Srinagar's most trusted gold buyer and gold loan settlement expert. We clear your outstanding gold loan at Muthoot Finance, Manappuram, IIFL or commercial banks in Chandigarh, Mohali, Panchkula, Zirakpur &amp; Srinagar, recover your ornaments, assay them via computerized German spectrometer, and pay you the remaining cash surplus instantly.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-yellow-500/10">
              <div className="space-y-1">
                <span className="font-serif text-lg sm:text-xl font-bold text-yellow-500 block">100% Zero</span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-sans font-light">Melting Weight Loss</span>
              </div>
              <div className="space-y-1 border-l border-yellow-500/10 pl-4">
                <span className="font-serif text-lg sm:text-xl font-bold text-yellow-500 block">Computerized</span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-sans font-light">German Assay Scan</span>
              </div>
              <div className="space-y-1 border-l border-yellow-500/10 pl-4">
                <span className="font-serif text-lg sm:text-xl font-bold text-yellow-500 block">Bank Release</span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-sans font-light">Direct Cash Funding</span>
              </div>
              <div className="space-y-1 border-l border-yellow-500/10 pl-4">
                <span className="font-serif text-lg sm:text-xl font-bold text-yellow-500 block">Spot Payout</span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-sans font-light">IMPS / RTGS / Cash</span>
              </div>
            </div>

            <div className="flex gap-4 pt-3 flex-wrap">
              <button
                onClick={scrollToCalculator}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3.5 rounded font-bold text-xs tracking-widest uppercase transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-yellow-400/20"
                id="hero-open-calculator"
              >
                <Calculator className="w-4 h-4" />
                <span>OPEN LIVE SURPLUS ESTIMATOR</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={scrollToInfo}
                className="border border-yellow-500/30 hover:border-yellow-500 text-yellow-500 px-6 py-3.5 rounded font-bold text-xs tracking-widest uppercase hover:bg-yellow-500/5 transition-all cursor-pointer"
                id="hero-read-guide"
              >
                RELEASE PROCESS GUIDE
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-xl overflow-hidden border border-yellow-500/20 shadow-2xl">
              <img
                src={sgcGold}
                alt="SGC Certified Gold Buyers - Computerized Purity Testing &amp; Mortgaged Gold Loan Release Desk"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-transparent flex flex-col justify-end p-6">
                <div className="bg-[#0c0d16]/90 backdrop-blur-md p-4 rounded border border-yellow-500/15">
                  <span className="text-[9px] text-yellow-500 font-bold tracking-widest uppercase block">ESTABLISHED TRUST</span>
                  <h3 className="font-serif text-base font-bold text-white leading-tight mt-1">Chandigarh &amp; Srinagar Vault Centers</h3>
                  <p className="text-[10px] text-gray-400 font-sans mt-1 leading-normal">Serving Chandigarh Tricity &amp; Jammu Kashmir with secure high-density vaults and digital spectrometer assay verification.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CORE EXPLANATION: HOW TO RELEASE PLEDGED GOLD (JEWEL HOUSE STYLE) */}
      <section ref={infoRef} className="py-20 bg-[#0a0a0f] border-y border-white/5 text-left scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-16">
            <span className="text-yellow-500 text-xs font-bold tracking-[0.25em] uppercase">PLEDGED GOLD SETTLEMENT SERVICE</span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-white">How SGC Gold Releases Your Pledged Gold Ornaments</h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto font-light">
              Are you trapped under high interest gold loans at national banks or financial institutions? SGC Gold helps you release your pledged gold ornaments with 100% transparency and pays you the high remaining cash surplus.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#10111a] p-6 rounded-lg border border-yellow-500/5 hover:border-yellow-500/15 transition-all space-y-4">
              <div className="w-12 h-12 rounded bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-yellow-400">Step 1: Evaluation &amp; Booking</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                Visit our Chandigarh Sector 17 vaults, Lal Chowk vaults, or submit our online estimator. Provide your bank gold loan document (pledge letter). SGC specialists will estimate the current gross value of your ornaments based on spot bullion rates and calculate your potential cash surplus.
              </p>
            </div>

            <div className="bg-[#10111a] p-6 rounded-lg border border-yellow-500/5 hover:border-yellow-500/15 transition-all space-y-4">
              <div className="w-12 h-12 rounded bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-yellow-400">Step 2: Bank Dues Settlement</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                Our designated professional executive will accompany you to the bank/NBFC (Muthoot, Manappuram, IIFL, etc.). SGC pays off your complete outstanding loan amount, collects the physical gold ornaments in your presence, and seals them securely.
              </p>
            </div>

            <div className="bg-[#10111a] p-6 rounded-lg border border-yellow-500/5 hover:border-yellow-500/15 transition-all space-y-4">
              <div className="w-12 h-12 rounded bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-yellow-400">Step 3: Assay &amp; Cash Surplus</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                We bring the gold back to our corporate desk. Purity is scanned via the XRF spectrometer in 1 minute with 100% computer precision. SGC deducts the cleared loan amount and a flat 1.5% service charge, paying you the rest instantly in cash or bank transfer.
              </p>
            </div>
          </div>

          {/* SGC Spectrometer Advantage vs Local Jewelers */}
          <div className="mt-16 bg-gradient-to-r from-[#0d0d16] to-[#0c0d15] border border-yellow-500/15 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-yellow-500 text-xs font-bold tracking-wider uppercase bg-yellow-500/10 px-2.5 py-1 rounded">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Spectrometer Technology vs Acid Testing</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-black text-white">Why Computerized German Assay Testing is Crucial</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                Traditional gold buyers and local jewelers use nitric acid on stone (Kasauti) or melt your gold. This alters your jewelry and results in high melting weight losses (often costing you 5% to 15% of your gold value). 
              </p>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                At SGC, our computerized XRF spectrometer uses advanced X-ray scans. It is non-destructive, causes <strong>zero weight loss</strong>, <strong>zero melting damage</strong>, and reads accurate metal composition percentages inside 60 seconds.
              </p>
            </div>
            <div className="lg:col-span-5 grid grid-cols-1 gap-3 font-sans">
              <div className="bg-[#06060a] p-4 rounded border border-emerald-500/10 flex gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">SGC Spectrometer Scan</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">100% digital precision, zero melting loss, done in front of your eyes within 1 minute.</p>
                </div>
              </div>
              <div className="bg-[#06060a] p-4 rounded border border-red-500/10 flex gap-3">
                <span className="text-red-500 text-sm font-bold shrink-0 mt-0.5">✕</span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Archaic Local Acid/Melting</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Damages jewelry, causes 5% to 15% arbitrary melting deductions, completely subjective.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE BANK RELEASE & SURPLUS ESTIMATOR (JEWEL HOUSE STYLE) */}
      <section ref={calculatorRef} className="py-20 bg-[#060608] text-left scroll-mt-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs text-yellow-500 tracking-[0.25em] font-bold block uppercase">PROFESSIONAL CALCULATOR</span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">Interactive Gold Loan Release Calculator</h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                Calculate the surplus payout you will receive from SGC Gold after we pay off your bank loan. Choose the weight, purity, and input your outstanding loan amount below to see the transparent math.
              </p>

              <div className="p-4 rounded bg-yellow-500/5 border border-yellow-500/10 text-xs text-yellow-500/90 space-y-1">
                <p className="font-bold flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Current Spot Bullion Price (May 2026):</p>
                <div className="grid grid-cols-2 gap-2 pt-2 font-mono text-[11px] text-gray-300">
                  <div>24K Pure Gold: <span className="text-yellow-500 font-bold">₹7,550/g</span></div>
                  <div>22K Jewelry: <span className="text-yellow-500 font-bold">₹6,920/g</span></div>
                  <div>18K Gold: <span className="text-yellow-500 font-bold">₹5,660/g</span></div>
                  <div>14K Gold: <span className="text-yellow-500 font-bold">₹4,400/g</span></div>
                </div>
              </div>

              <div className="border-t border-yellow-500/10 pt-4 space-y-3">
                <h4 className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-yellow-500" /> Required Documents (21+ Years):
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-400">
                  <li className="flex items-center gap-1.5">✓ Aadhaar Card</li>
                  <li className="flex items-center gap-1.5">✓ PAN Card</li>
                  <li className="flex items-center gap-1.5">✓ Original Jewelry Invoice</li>
                  <li className="flex items-center gap-1.5">✓ Pledge Ticket (if Pledged)</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#0b0c14] border border-yellow-500/15 p-6 sm:p-8 rounded-xl shadow-2xl relative">
              <form onSubmit={handleCalculateSubmit} className="space-y-6">
                
                {/* Weight Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-gray-300 font-semibold uppercase tracking-wider">Ornaments weight (Grams)</label>
                    <span className="font-mono text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1 font-bold rounded">
                      {goldWeight} g
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setGoldWeight(w => Math.max(1, w - 5))}
                      className="w-10 h-10 rounded bg-[#131521] border border-white/5 hover:border-yellow-500/50 hover:bg-yellow-500 hover:text-black flex items-center justify-center font-bold text-white transition-all cursor-pointer"
                    >
                      -5g
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="300"
                      value={goldWeight}
                      onChange={(e) => setGoldWeight(Number(e.target.value))}
                      className="flex-1 accent-yellow-500 cursor-pointer h-1.5 bg-[#171a2e] rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setGoldWeight(w => Math.min(500, w + 5))}
                      className="w-10 h-10 rounded bg-[#131521] border border-white/5 hover:border-yellow-500/50 hover:bg-yellow-500 hover:text-black flex items-center justify-center font-bold text-white transition-all cursor-pointer"
                    >
                      +5g
                    </button>
                  </div>
                </div>

                {/* Carat Option */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-300 font-semibold uppercase block">Select Gold Purity</label>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.keys(GOLD_RATES).map((carat) => (
                      <button
                        type="button"
                        key={carat}
                        onClick={() => setGoldPurity(carat)}
                        className={`py-2.5 px-1 rounded text-xs font-bold border transition-all cursor-pointer ${
                          goldPurity === carat
                            ? 'bg-yellow-500 border-yellow-500 text-black shadow-md'
                            : 'bg-[#131521] border-yellow-500/10 hover:border-yellow-500/30 text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        {carat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Is Pledged Toggle */}
                <div className="bg-[#121320] p-4 rounded border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-xs text-white font-bold uppercase tracking-wider block">Is this gold pledged at a bank?</label>
                      <span className="text-[10px] text-gray-400 block">Select if locked at Muthoot, Manappuram, or local bank</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isPledged} 
                        onChange={(e) => {
                          setIsPledged(e.target.checked);
                          if (!e.target.checked) setLoanAmount('');
                        }} 
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-[#1e2030] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-500 peer-checked:after:bg-black peer-checked:after:border-black"></div>
                    </label>
                  </div>

                  {isPledged && (
                    <div className="space-y-1.5 animate-fadeIn">
                      <label className="text-[11px] text-yellow-500 uppercase font-bold tracking-wider block">Outstanding Bank Loan Amount (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3 text-gray-400 text-xs font-mono font-bold">₹</span>
                        <input
                          type="number"
                          placeholder="e.g. 50000"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(e.target.value)}
                          className="w-full bg-[#171a2a] border border-[#2d3148] focus:border-yellow-500/50 rounded p-2.5 pl-7 text-xs outline-none text-white transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Calculation breakdown */}
                <div className="bg-[#07080f] rounded-lg p-5 space-y-3 font-sans text-xs sm:text-sm text-gray-400 border border-white/5">
                  <div className="flex justify-between">
                    <span>Rate Per Gram ({goldPurity})</span>
                    <span className="font-mono text-gray-200">₹{goldCalculation.ratePerGram.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gold Market Value ({goldWeight}g)</span>
                    <span className="font-mono text-gray-200">₹{goldCalculation.marketValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGC Service Fee ({serviceChargePercent}%)</span>
                    <span className="font-mono text-red-400">- ₹{goldCalculation.serviceCharge.toLocaleString('en-IN')}</span>
                  </div>

                  {isPledged && goldCalculation.loanDeduction > 0 && (
                    <div className="flex justify-between border-t border-dashed border-white/10 pt-2 text-red-400">
                      <span>Cleared Bank Loan (Outstanding)</span>
                      <span className="font-mono">- ₹{goldCalculation.loanDeduction.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {isPledged && goldCalculation.netSurplus < 0 ? (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded text-red-400 text-xs flex gap-2 items-center mt-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p>Warning: Outstanding bank loan dues exceed the estimated gold market value. Please contact us to inspect possibilities.</p>
                    </div>
                  ) : (
                    <div className="border-t border-yellow-500/20 pt-3 flex justify-between items-center text-sm font-bold mt-2">
                      <span className="text-yellow-500 uppercase tracking-wider text-xs">
                        {isPledged ? 'Your Net Profit Surplus' : 'Estimated Cash Payout'}
                      </span>
                      <span className="font-mono text-lg text-emerald-400">
                        ₹{Math.round(isPledged ? goldCalculation.netSurplus : goldCalculation.payoutBeforeLoan).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Proceed Button */}
                <button
                  type="submit"
                  disabled={isPledged && goldCalculation.netSurplus < 0}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-black py-4 rounded font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(234,179,8,0.2)]"
                  id="gold-calculate-submit"
                >
                  <Send className="w-4 h-4" />
                  <span>DISPATCH CUSTOM ESTIMATE QUOTE</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 5. EDITORIAL APPRAISAL CHECKLIST SECTION */}
      <section className="py-20 bg-[#faf6f0] text-slate-900 relative text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Image with soft drop shadow */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[1.1] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(112,98,82,0.18)] border border-[#e5d9c9]">
                <img
                  src={elderlyLadyGold}
                  alt="Gold Jewellery Verification &amp; Computerized Assaying - SGC Gold Buyers Chandigarh, Mohali, Panchkula &amp; Srinagar"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column: Detailed checklists */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="text-[#a6804d] text-xs font-bold tracking-[0.25em] block uppercase">COMPLIANCE &amp; STANDARDS</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  How We Appraise Your Gold Dues
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  SGC Gold follows strict compliance protocols to give you the highest possible payout under legal frameworks. Here is our assessment checklist:
                </p>
              </div>

              <ul className="space-y-3.5">
                {[
                  { title: "Physical Verification", desc: "Ornaments are checked for gross weights on Class-I digital balances calibrated to Indian metrology standards." },
                  { title: "Spectrometer XRF Reading", desc: "Non-destructive computerized scanning determines gold composition down to karats (18K, 22K, 24K)." },
                  { title: "Deduction of Stone Weight", desc: "If ornaments contain heavy stones or gems, their actual weight is transparently deducted so you are paid exactly for the gold." },
                  { title: "Live Market Valuation", desc: "Calculations are mapped instantly to today's spot bullion rates with no subjective reductions or arbitrary local markdowns." }
                ].map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-yellow-500/35 shrink-0 bg-amber-500/10 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>
                    </div>
                    <div>
                      <h4 className="text-slate-900 text-xs font-bold uppercase tracking-wider">{item.title}</h4>
                      <p className="text-slate-700 text-xs leading-relaxed font-normal mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Live Indian Standard Market Price Box */}
              <div className="bg-white border border-[#e5d9c9] rounded-xl overflow-hidden shadow-lg max-w-xl">
                <div className="bg-[#e4b24f] px-6 py-3.5 text-center">
                  <h4 className="text-slate-950 font-serif text-xs sm:text-sm font-black tracking-wide leading-none uppercase">
                    SGC Spot Reference rates
                  </h4>
                </div>
                <div className="grid grid-cols-3 divide-x divide-[#e5d9c9] text-center bg-white font-sans text-xs">
                  <div className="p-4">
                    <span className="text-slate-500 font-bold block">24K Pure Gold</span>
                    <span className="text-[#090b11] text-sm sm:text-base font-mono font-black mt-1 block">
                      ₹7,550/g
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-slate-500 font-bold block">22K Jewelry</span>
                    <span className="text-[#090b11] text-sm sm:text-base font-mono font-black mt-1 block">
                      ₹6,920/g
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-slate-500 font-bold block">18K Standard</span>
                    <span className="text-[#090b11] text-sm sm:text-base font-mono font-black mt-1 block">
                      ₹5,660/g
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 6. APPOINTMENT SLOT BOOKING FORM */}
      <section ref={contactRef} className="py-20 bg-[#0b0b12] text-left border-t border-white/5 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-yellow-500 font-bold uppercase tracking-[0.2em]">SGC COVETED VAULTS ASSIST</span>
            <h2 className="font-serif text-3xl font-bold text-white">Book Your Gold Inspection Slot</h2>
            <p className="text-xs text-gray-400 max-w-sm mx-auto font-light">Submit details securely below. Our executive will reach out to schedule bank visit or instore assay.</p>
          </div>

          <div className="bg-[#060608] border border-yellow-500/15 rounded-2xl p-6 sm:p-8 shadow-xl">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#111322] border border-white/5 focus:border-yellow-500/50 rounded p-3 text-xs outline-none text-white transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9906XXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#111322] border border-white/5 focus:border-yellow-500/50 rounded p-3 text-xs outline-none text-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Remarks / Loan Outstanding Details</label>
                <textarea
                  rows={4}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="e.g. I have 45g of gold pledged at Muthoot with 1.2L loan outstanding, please guide me on releasing it and payout surplus."
                  className="w-full bg-[#111322] border border-white/5 focus:border-yellow-500/50 rounded p-3 text-xs outline-none text-white transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                <span className="text-[10px] text-gray-500 text-center sm:text-left">🔒 Encryption active. We never share customer gold ownership details with third parties.</span>
                
                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-black px-6 py-3 rounded font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  id="gold-form-submit"
                >
                  {isSubmitting ? (
                    <span>TRANSMITTING...</span>
                  ) : submitSuccess ? (
                    <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-900" /> APPOINTMENT SECURED</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /> SECURE RESERVATION</span>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* 7. DETAILED FAQS SECTION (JEWEL HOUSE STYLE) */}
      <section className="py-20 bg-[#060608] text-left border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-12">
            <HelpCircle className="w-8 h-8 text-yellow-500 mx-auto" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-gray-400 font-light">Got questions about gold buying or loan release? Read our guides below.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="border border-[#1f2030] bg-[#0c0d16] rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-white font-serif font-bold text-sm sm:text-base hover:bg-yellow-500/5 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-yellow-500 transition-transform duration-300 shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 border-t border-[#1f2030] bg-[#07080f] text-xs sm:text-sm text-gray-300 leading-relaxed font-light animate-slideDown">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. MINI FOOTER SECTION */}
      <footer className="bg-[#050507] border-t border-yellow-500/10 py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p>© {new Date().getFullYear()} SGC Gold division of Salafiya Group of Companies. Licensed gold buying &amp; bank settlement desk.</p>
          <div className="flex justify-center gap-6 text-[10px] flex-wrap mt-2">
            <span>Corporate Offices: Sector 17, Chandigarh | Lal Chowk, Srinagar</span>
            <span>Tel: +91 7889 434 741</span>
            <button onClick={onBackToParent} className="text-yellow-500 font-bold underline hover:text-yellow-400 cursor-pointer">
              SGC CORPORATE HOME
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
