import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Target, ShieldCheck, Award, Briefcase, 
  GraduationCap, Quote, Compass, Users, Sparkles, CheckCircle2, ChevronRight, Phone, Mail
} from 'lucide-react';

// Import leadership profile pictures
import mubashirPhoto from '../assets/images/mubashir_ahmad_lone.jpeg';
import mohitPhoto from '../assets/images/mohit_kalia.jpeg';
import nasirPhoto from '../assets/images/syed_nasir.jpeg';

// Simple helper component for animated counters
function AnimatedCounter({ endValue, duration = 1500, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    // Extract numbers from endValue string if it contains '+' or ','
    const target = parseInt(endValue.toString().replace(/[^0-9]/g, ''), 10);
    if (isNaN(target)) return;
    
    const stepTime = Math.max(Math.floor(duration / target), 10);
    const timer = setInterval(() => {
      start += Math.ceil(target / 40); // increment size
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [endValue, duration]);

  // Format with commas if large number
  const formattedCount = count >= 1000 ? count.toLocaleString() : count;

  return (
    <span>
      {formattedCount}
      {suffix}
    </span>
  );
}

export default function AboutPage({ 
  onBackToParent, 
  onOpenInquiries, 
  inquiriesCount, 
  onOpenAdminDashboard,
  onSubmitInquiry 
}) {
  const [scrolled, setScrolled] = useState(false);
  const [activeLeader, setActiveLeader] = useState('mubashir');

  // Contact form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitInquiry({
        name,
        email: 'No email provided (About Page)',
        phone,
        businessSection: 'general',
        message: message || 'Inquiry initiated from the corporate About page leadership section.'
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setName('');
      setPhone('');
      setMessage('');
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1000);
  };

  const leaders = {
    mubashir: {
      name: 'Mubashir Ahmad Lone',
      title: 'Founder & Managing Director',
      photo: mubashirPhoto,
      quote: "Success is built on trust, strengthened by integrity, and sustained through excellence.",
      qualification: 'Postgraduate Degree (PG) in English Literature',
      experience: 'Over 12 years of professional experience',
      bio: `Mubashir Ahmad Lone, born in May 1995, is the Founder and Managing Director of SGC Group of Companies. Throughout his career, Mubashir has established a reputation for integrity, customer-focused solutions, and result-oriented leadership. As an experienced Real Estate Advisor and Portfolio Manager, he has successfully guided individuals, investors, and businesses in making informed investment decisions, wealth preservation strategies, and property acquisitions.`,
      expertise: [
        'Real Estate Advisory',
        'Portfolio Management',
        'Business Development',
        'Client Relationship Management',
        'Investment Planning',
        'Asset Management',
        'Strategic Business Growth'
      ]
    },
    mohit: {
      name: 'Mohit Kalia',
      title: 'Co-Founder',
      photo: mohitPhoto,
      quote: "Strategic execution and customer transparency are the twin pillars of long-term business growth.",
      qualification: 'Automobile Industry Certification & Executive Credentials',
      experience: 'Over 10 years of professional experience',
      bio: `Mohit Kalia serves as the Co-Founder of SGC Group of Companies. With more than 10 years of experience in the automobile industry, he brings extensive industry knowledge, operational expertise, and business management skills to the organization. His experience in handling customer relations, operations, and business development has contributed significantly to the company's growth and expansion initiatives.`,
      expertise: [
        'Automobile Industry Operations',
        'Business Development',
        'Customer Relationship Management',
        'Strategic Planning',
        'Team Leadership'
      ]
    },
    nasir: {
      name: 'Syed Nasir',
      title: 'Co-Founder',
      photo: nasirPhoto,
      quote: "A business grows when its community flourishes. Ethical operations are non-negotiable.",
      qualification: 'Business Administration & Operational Strategy Practitioner',
      experience: 'Experienced Operations Manager',
      bio: `Syed Nasir is a Co-Founder of SGC Group of Companies and plays a key role in supporting the company's growth and strategic objectives. As part of the leadership team, he contributes to business operations, partnership development, and organizational expansion.`,
      expertise: [
        'Business Operations',
        'Strategic Growth',
        'Client Relations',
        'Business Coordination',
        'Organizational Development'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-gray-200 font-sans antialiased selection:bg-yellow-500/30 selection:text-white">
      
      {/* 1. STICKY HEADER / NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#090b11]/95 backdrop-blur-md border-b border-yellow-500/10 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'bg-[#060608]/90 border-b border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Go Back Trigger */}
            <button
              onClick={onBackToParent}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold font-sans text-yellow-500 hover:text-white bg-yellow-500/10 hover:bg-yellow-500 border border-yellow-500/20 hover:border-yellow-500 transition-all duration-300 shadow-sm cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>RETURN TO SGC HOME</span>
            </button>

            {/* Core Brand */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/5">
                <span className="text-[8px] leading-none">👑</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif font-bold text-sm tracking-wider text-yellow-500">SGC CORPORATE</span>
                <span className="text-[8px] uppercase tracking-widest text-gray-400">About SGC Group</span>
              </div>
            </div>

            {/* Desktop Admin Options */}
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAdminDashboard}
                className="hidden sm:flex items-center gap-1 bg-[#101424] hover:bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              >
                ADMIN PORTAL
              </button>
              {inquiriesCount > 0 && (
                <button
                  onClick={onOpenInquiries}
                  className="hidden sm:flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/15 border border-yellow-500/20 rounded-full px-3 py-1.5 text-xs text-yellow-400 font-bold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span>Inquiries ({inquiriesCount})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. CORPORATE HERO SECTION */}
      <header className="relative pt-32 pb-20 bg-gradient-to-b from-[#0e111d] to-[#060608] overflow-hidden border-b border-white/5">
        {/* Abstract Gold Background Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-yellow-600/5 rounded-full filter blur-[90px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3.5 py-1 rounded-full"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-500 font-sans">
              CORPORATE PROFILE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
          >
            About SGC Group <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600">
              of Companies
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-300 font-sans font-light leading-relaxed max-w-2xl mx-auto"
          >
            SGC Group of Companies is a diversified business group operating across gold buying, gold loan settlement, real estate advisory, and business services. Built on the foundations of trust, integrity, and excellence, the company is dedicated to providing transparent, customer-focused, and value-driven solutions.
          </motion.p>
        </div>
      </header>

      {/* 3. DYNAMIC ANIMATED COUNTERS */}
      <section className="bg-[#090b11] py-12 border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 bg-[#0e111d]/50 border border-yellow-500/10 rounded-2xl text-center space-y-1 hover:border-yellow-500/35 transition-colors duration-300">
              <div className="text-4xl sm:text-5xl font-serif font-extrabold text-yellow-500">
                <AnimatedCounter endValue="30" suffix="+" />
              </div>
              <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Years of Combined Leadership</div>
              <p className="text-[11px] text-gray-500">Extensive deep industry expertise across automobile, gold, and estate operations.</p>
            </div>

            <div className="p-6 bg-[#0e111d]/50 border border-yellow-500/10 rounded-2xl text-center space-y-1 hover:border-yellow-500/35 transition-colors duration-300">
              <div className="text-4xl sm:text-5xl font-serif font-extrabold text-yellow-500">
                <AnimatedCounter endValue="1200" suffix="+" />
              </div>
              <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Clients Served & Families Consulted</div>
              <p className="text-[11px] text-gray-500">Trusted consulting partners delivering ethical transactions with high customer ratings.</p>
            </div>

            <div className="p-6 bg-[#0e111d]/50 border border-yellow-500/10 rounded-2xl text-center space-y-1 hover:border-yellow-500/35 transition-colors duration-300">
              <div className="text-4xl sm:text-5xl font-serif font-extrabold text-yellow-500">
                <AnimatedCounter endValue="4" suffix="" />
              </div>
              <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Active Business Divisions</div>
              <p className="text-[11px] text-gray-500">Gold Buying, Gold Loan Settlement, Real Estate Advisory, and Premium Catering Services.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MEET THE LEADERSHIP TEAM */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2">
              <span className="w-6 h-px bg-yellow-500"></span>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-yellow-500">EXECUTIVE DIRECTORS</span>
              <span className="w-6 h-px bg-yellow-500"></span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              SGC Group Leadership Board
            </h2>
            <p className="text-sm text-gray-400 font-sans font-light">
              Meet the founders and strategic guides directing SGC&apos;s commitment to ethical transparency, wealth conservation, and operational excellence.
            </p>
          </div>

          {/* Interactive Leader Selector Menu */}
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {Object.keys(leaders).map((key) => (
              <button
                key={key}
                onClick={() => setActiveLeader(key)}
                className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer border ${
                  activeLeader === key
                    ? 'bg-yellow-500 text-slate-950 border-yellow-500 shadow-[0_4px_15px_rgba(234,179,8,0.25)]'
                    : 'bg-[#0d101a] text-gray-400 border-white/5 hover:border-yellow-500/30 hover:text-white'
                }`}
              >
                {leaders[key].name}
              </button>
            ))}
          </div>

          {/* Detailed Selected Leader Spotlight Card */}
          <div className="bg-[#0e111d] rounded-3xl border border-yellow-500/10 overflow-hidden shadow-2xl p-6 sm:p-8 lg:p-12 mb-16 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full filter blur-[80px] pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Leader Photo column with premium circular frame and gold ring */}
              <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full p-2 border-2 border-yellow-500/40 bg-gradient-to-tr from-[#0e111d] to-yellow-500/10 shadow-xl overflow-hidden group">
                  <div className="absolute inset-2 rounded-full border border-dashed border-yellow-500/20 group-hover:rotate-12 transition-transform duration-500"></div>
                  <img 
                    src={leaders[activeLeader].photo} 
                    alt={leaders[activeLeader].name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover object-center relative z-10 transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">{leaders[activeLeader].name}</h3>
                  <p className="text-yellow-500 text-sm font-semibold tracking-wider font-sans mt-0.5">{leaders[activeLeader].title}</p>
                </div>
              </div>

              {/* Leader Details column */}
              <div className="lg:col-span-7 text-left space-y-6">
                
                {/* Quote block */}
                <div className="relative p-5 bg-[#070911] border-l-4 border-yellow-500 rounded-r-xl space-y-1.5 shadow-sm">
                  <Quote className="absolute top-3 right-4 w-12 h-12 text-yellow-500/5 shrink-0 pointer-events-none" />
                  <p className="text-sm italic font-serif text-gray-300 leading-relaxed pr-6">
                    &ldquo;{leaders[activeLeader].quote}&rdquo;
                  </p>
                  <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest font-sans">— {leaders[activeLeader].name}</p>
                </div>

                {/* Professional background narrative */}
                <div className="space-y-3 font-sans text-sm font-light text-gray-300 leading-relaxed">
                  <p>{leaders[activeLeader].bio}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="flex gap-2.5 items-start">
                      <GraduationCap className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Credential/Education</span>
                        <span className="text-xs text-white font-medium">{leaders[activeLeader].qualification}</span>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <Award className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Professional Stand</span>
                        <span className="text-xs text-white font-medium">{leaders[activeLeader].experience}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specific Focus Areas / Core Competencies Tag Pills */}
                <div className="space-y-2.5 pt-3">
                  <span className="text-[10px] uppercase font-bold text-yellow-500 tracking-wider block">Areas of Strategic Contribution</span>
                  <div className="flex flex-wrap gap-2">
                    {leaders[activeLeader].expertise.map((exp, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-yellow-500/5 hover:bg-yellow-500/10 border border-yellow-500/10 hover:border-yellow-500/30 rounded-full text-xs text-gray-300 transition-colors"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Quick Team Grid Summary Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.keys(leaders).map((key) => (
              <div 
                key={key} 
                onClick={() => {
                  setActiveLeader(key);
                  const el = document.getElementById('navbar');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-6 rounded-2xl border text-left cursor-pointer transition-all duration-300 hover:translate-y-[-4px] group flex gap-4 items-center ${
                  activeLeader === key 
                    ? 'bg-[#101424] border-yellow-500/40 shadow-lg' 
                    : 'bg-[#0d101a]/70 border-white/5 hover:border-yellow-500/20'
                }`}
              >
                <div className="w-14 h-14 rounded-full border border-yellow-500/25 p-0.5 overflow-hidden shrink-0 group-hover:border-yellow-500 transition-colors">
                  <img 
                    src={leaders[key].photo} 
                    alt={leaders[key].name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-serif text-sm font-bold text-white group-hover:text-yellow-500 transition-colors">
                    {leaders[key].name}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans">{leaders[key].title}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. MISSION & VISION STATEMENT PANEL */}
      <section className="py-24 bg-[#090b11] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Vision card (left side) */}
            <div className="lg:col-span-5 bg-[#0e111d] rounded-3xl border border-yellow-500/10 p-8 flex flex-col justify-between hover:border-yellow-500/20 transition-all shadow-md relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-yellow-500/5 rounded-full filter blur-[50px] pointer-events-none"></div>
              
              <div className="space-y-6 text-left">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center">
                  <Compass className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="font-serif text-2xl font-extrabold text-white tracking-tight">
                  Our Corporate Vision
                </h3>
                <p className="text-sm font-light leading-relaxed text-gray-300">
                  To become a trusted and leading business group by delivering innovative, transparent, and customer-centric solutions across all sectors we serve while creating sustainable value for customers, employees, partners, and communities.
                </p>
              </div>

              <div className="pt-8 border-t border-white/5 mt-8 flex items-center gap-2 text-xs font-bold text-yellow-500 font-sans">
                <span>DRIVING REGIONAL PROSPERITY</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Mission column (right side) */}
            <div className="lg:col-span-7 bg-[#0e111d]/50 rounded-3xl border border-white/5 p-8 flex flex-col justify-between text-left">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center">
                  <Target className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="font-serif text-2xl font-extrabold text-white tracking-tight">
                  Our Corporate Mission
                </h3>
                <p className="text-sm font-light text-gray-400">
                  At SGC Group, our day-to-day operations are dedicated to making a concrete difference in J&K&apos;s financial, housing, and food service landscape.
                </p>
                
                <div className="space-y-4 pt-2">
                  {[
                    'To provide ethical and transparent business solutions.',
                    'To help clients maximize value and achieve their financial goals.',
                    'To build long-term relationships based on trust and reliability.',
                    'To continuously innovate and expand while maintaining the highest professional standards.'
                  ].map((mission, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mt-0.5 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-yellow-500" />
                      </div>
                      <span className="text-sm text-gray-300 font-light font-sans">{mission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. OUR CORE VALUES SECTION */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-yellow-500 block">NON-NEGOTIABLE PRINCIPLES</span>
            <h2 className="font-serif text-3xl font-extrabold text-white tracking-tight">Corporate Values</h2>
            <p className="text-sm text-gray-400 font-sans font-light">
              We anchor every division, contract, valuation, and transaction upon three core values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            <div className="p-8 rounded-2xl bg-[#0e111d] border border-yellow-500/10 space-y-4 hover:border-yellow-500/25 transition-all">
              <div className="text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span>Trust</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-light font-sans">
                Building lasting relationships through honesty, consistency, and absolute transparency. We believe real corporate capital is the goodwill of the people.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0e111d] border border-yellow-500/10 space-y-4 hover:border-yellow-500/25 transition-all">
              <div className="text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span>Integrity</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-light font-sans">
                Maintaining the highest ethical standards in every customer interaction, rate calculation, and business collaboration. No compromise, ever.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0e111d] border border-yellow-500/10 space-y-4 hover:border-yellow-500/25 transition-all">
              <div className="text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span>Excellence</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-light font-sans">
                Delivering exceptional, customized, and value-driven services while continually striving for professional and technological development.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. CONNECT WITH LEADERSHIP DIRECT ADVISORY CONTACT BANNER */}
      <section className="py-20 bg-gradient-to-t from-[#0e111d] to-[#060608] border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="bg-[#090b11] border border-yellow-500/15 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
            <div className="text-center space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 font-sans block">SGC LEADERSHIP ADVISORY FORUM</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Request an Executive Consultation
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
                Connect directly with the SGC Group Director&apos;s panel for high-value portfolio inquiries, business proposals, real estate joint-ventures, or commercial catering operations.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Full Legal Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mubashir Ahmad"
                  className="w-full bg-[#101424] border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-yellow-500 text-white font-sans transition-all"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Mobile Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 95960 XXXXX"
                  className="w-full bg-[#101424] border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-yellow-500 text-white font-sans transition-all"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Strategic Proposal / Customer Requirements</label>
                <textarea 
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your interest, estate location, or commercial gold loan details..."
                  className="w-full bg-[#101424] border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-yellow-500 text-white font-sans transition-all resize-none"
                ></textarea>
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-600/50 text-slate-950 text-xs tracking-widest uppercase font-black py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {isSubmitting ? 'TRANSMITTING PROPOSAL...' : 'SUBMIT ADVISORY REQUEST'}
                </button>
              </div>

              {submitSuccess && (
                <div className="sm:col-span-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-xs font-bold text-emerald-400">
                  ✔ Proposal successfully transmitted to SGC Directors! We will reach out within 1 business day.
                </div>
              )}
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-gray-400 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-500" />
                <span>info@sgccorporate.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-yellow-500" />
                <span>+91 95960 12345</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SIMPLIFIED FOOTER */}
      <footer className="py-8 bg-[#040507] text-center text-xs text-gray-500 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="font-serif font-bold text-gray-400 text-sm">SALAFIYA GROUP OF COMPANIES</p>
          <p>© 2026 SGC Group. All rights reserved. Secure Offline-First Sandbox Environment.</p>
        </div>
      </footer>

    </div>
  );
}
