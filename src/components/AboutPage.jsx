import { motion } from 'motion/react';
import { ArrowLeft, Mail, Award, BookOpen, Users, Shield, Compass, Target } from 'lucide-react';
import shwetaImg from '../assets/images/Shweta_katoch_1.png';
import mubashirImg from '../assets/images/Mubashir Ahmad Lone.jpeg';
import mubashirImg1 from '../assets/images/Mubashir Ahmad Lone 1.jpeg';
import nasirImg from '../assets/images/Sayed Nasir.jpeg';
import mohitImg from '../assets/images/Mohit Kalia.jpeg';

export default function AboutPage({ onBackToParent, onOpenInquiries, inquiriesCount, onOpenAdminDashboard }) {
  const leadershipTeam = [
    {
      name: 'Mubashir Ahmad Lone',
      role: 'Founder & Managing Director',
      experience: 'Visionary Entrepreneur',
      bio: 'SGC Founder and Group director since 2021. Establishes the foundational group standards for gold services, premium culinary catering, and transparent land transfers across Jammu & Kashmir.',
      image: mubashirImg1,
      badge: 'Founder',
      initials: 'MAL',
      objectPosition: 'center 15%'
    },
    {
      name: 'Sayed Nasir',
      role: 'Co-Founder & Executive Director',
      experience: 'Strategic Development Leader',
      bio: 'Co-Founder of Salafiya Group of Companies. Directs the strategic expansion of physical operations, joint partnerships, and SGC Real Estate division transfers with uncompromising transparency.',
      image: nasirImg,
      badge: 'Co-Founder',
      initials: 'SN',
      objectPosition: 'center 15%'
    },
    {
      name: 'Mohit Kalia',
      role: 'Co-Founder & Director of SGC Gold',
      experience: 'Bullion & Procurement Expert',
      bio: 'Co-Founder and Division head. Oversees wholesale procurement, secure trade logistics, and gold assaying quality standards to ensure SGC Gold remains Jammu & Kashmir’s most trusted source.',
      image: mohitImg,
      badge: 'Co-Founder',
      initials: 'MK',
      objectPosition: 'center 15%'
    },
    {
      name: 'Shweta Katoch',
      role: 'Operations Head',
      experience: '5 Years of Banking-Grade Operations Management',
      bio: 'Having 5 years of experience in Operations management background in financial banking sector. She drives operational efficiency, compliance, financial audit protocols, and structured group synergies.',
      image: shwetaImg,
      badge: 'Operations Head',
      initials: 'SK',
      objectPosition: 'center 15%'
    }
  ];

  const coreValues = [
    {
      icon: <Target className="w-5 h-5 text-yellow-500" />,
      title: "Ethical Integration",
      desc: "Operating with absolute clarity and strict moral standards across physical commodities and real estate transfers."
    },
    {
      icon: <Shield className="w-5 h-5 text-yellow-500" />,
      title: "Corporate Governance",
      desc: "Robust banking-grade compliance and operational workflows, supervised by experienced banking sector operations leaders."
    },
    {
      icon: <Compass className="w-5 h-5 text-yellow-500" />,
      title: "Regional Leadership",
      desc: "Committed to delivering premium-level services and employment opportunities across J&K's physical markets."
    }
  ];

  return (
    <div className="min-h-screen bg-[#060810] text-[#f3f4f6] font-sans">
      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-[#060810]/85 backdrop-blur-md border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onBackToParent}
            className="group flex items-center gap-2 px-4 py-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-yellow-500/30 rounded-xl text-gray-300 hover:text-yellow-500 text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back To Homepage</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-lg border border-yellow-500/20 font-bold font-mono uppercase tracking-wider">
              SGC Group Profile
            </span>
          </div>
        </div>
      </header>

      {/* HERO HEROICS */}
      <section className="relative py-20 overflow-hidden border-b border-white/[0.03] bg-gradient-to-b from-slate-950 to-[#060810]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-semibold text-yellow-500 tracking-wider uppercase"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Meet Our Management</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
          >
            The Pillars of <br className="sm:hidden" />
            <span className="text-yellow-500">SGC Operations</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-400 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Salafiya Group of Companies combines deep regional insight with elite modern operations management. We bring institutional discipline to every sector we touch.
          </motion.p>
        </div>
      </section>

      {/* LEADERSHIP PROFILE SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-3xl font-bold text-white tracking-tight">Executive Management</h2>
          <p className="text-sm text-gray-400 font-light">
            Bringing elite operational processes, corporate governance, and continuous strategic growth to Jammu & Kashmir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {leadershipTeam.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="bg-[#0e111d] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center space-y-6 shadow-xl relative overflow-hidden group hover:border-yellow-500/20 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute top-4 right-4 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-yellow-500/20">
                {member.badge}
              </div>

              {/* IMAGE / MONOGRAM AVATAR CONTAINER */}
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-white/15 group-hover:border-yellow-500/40 transition-colors duration-500 shadow-md flex items-center justify-center bg-slate-900 shrink-0">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: member.objectPosition || 'center top' }}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = 'none';
                      const fallback = e.target.nextSibling;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-yellow-500/10 to-amber-500/5 text-yellow-500 select-none"
                  style={{ display: member.image ? 'none' : 'flex' }}
                >
                  <span className="text-4xl font-serif font-black tracking-wide">{member.initials}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest mt-1 text-gray-500 text-center px-2">{member.badge}</span>
                </div>
              </div>

              {/* BIO CONTENT */}
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-yellow-500 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest">{member.role}</p>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">{member.experience}</p>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed max-w-sm mx-auto">
                  {member.bio}
                </p>

                <div className="pt-4 border-t border-white/[0.04] flex items-center justify-center gap-3 text-xs text-gray-400">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">Operations Compliance Verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STRATEGIC CAPABILITIES (VALUES) */}
      <section className="py-20 bg-slate-950/40 border-t border-b border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((val, idx) => (
              <div key={idx} className="p-6 bg-[#0e111d]/50 border border-white/5 rounded-2xl flex flex-col text-left space-y-3">
                <div className="w-9 h-9 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center border border-yellow-500/20">
                  {val.icon}
                </div>
                <h4 className="font-serif text-base font-bold text-white">{val.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-light">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTION STATEMENT FOOTER */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4 space-y-6 relative z-10">
        <h3 className="font-serif text-2xl font-bold text-white">Integrity-First Infrastructure</h3>
        <p className="text-sm text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
          Through structured, professional management systems directed by certified leaders, SGC guarantees security, delivery compliance, and real-time support across physical commerce.
        </p>
        <button
          onClick={onBackToParent}
          className="px-6 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-[0_4px_15px_rgba(234,179,8,0.25)] cursor-pointer active:scale-95"
        >
          Explore Business Divisions
        </button>
      </section>
    </div>
  );
}
