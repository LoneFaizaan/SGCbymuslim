import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Utensils, Building2 } from 'lucide-react';
import sgcGold from '../assets/images/sgc_gold_jewelry_1779942518913.png';
import salafiyaCatering from '../assets/images/salafiya_catering_1779942543592.png';
import salafiRealestate from '../assets/images/salafi_realestate_1779942569443.png';

export default function BusinessSection({ onExploreBusiness }) {
  const businesses = [
    {
      id: 'gold',
      name: 'SGC Gold',
      image: sgcGold,
      icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
      bullets: [
        'Gold Buying Services',
        'Gold Loan Settlement',
        'Instant Cash for Gold',
        'Safe & Transparent Process',
      ],
      btnText: 'EXPLORE SGC GOLD',
      btnClassName: 'bg-[#d4af37] hover:bg-yellow-400 text-[#090b11] font-bold shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.35)]',
      cardBg: 'bg-[#0c0904]',
      colorGlow: 'shadow-[0_15px_30px_rgba(212,175,55,0.08)] border-yellow-500/15 hover:border-yellow-500/40',
      badge: 'GOLD EXPERTISE',
      badgeColor: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      bulletColor: 'border-yellow-500/40 bg-yellow-500'
    },
    {
      id: 'catering',
      name: 'Salafiya Enterprises',
      image: salafiyaCatering,
      icon: <Utensils className="w-5 h-5 text-emerald-500" />,
      bullets: [
        'Catering Services',
        'Food Service Operations',
        'Events & Occasions',
        'Quality You Can Trust',
      ],
      btnText: 'EXPLORE ENTERPRISES',
      btnClassName: 'border border-emerald-500/50 text-emerald-400 hover:text-[#090b11] hover:bg-emerald-500 font-bold',
      cardBg: 'bg-[#030d07]',
      colorGlow: 'shadow-[0_15px_30px_rgba(16,185,129,0.06)] border-emerald-500/15 hover:border-emerald-500/40',
      badge: 'CATERING & FOODS',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      bulletColor: 'border-emerald-500/40 bg-emerald-550'
    },
    {
      id: 'real_estate',
      name: 'Salafi Realestate',
      image: salafiRealestate,
      icon: <Building2 className="w-5 h-5 text-sky-500" />,
      bullets: [
        'Real Estate Services',
        'Property Buying & Selling',
        'Investment Solutions',
        'Trusted Property Deals',
      ],
      btnText: 'EXPLORE REALESTATE',
      btnClassName: 'bg-sky-950/50 border border-sky-500 text-sky-300 hover:bg-sky-500 hover:text-black font-bold',
      cardBg: 'bg-[#040811]',
      colorGlow: 'shadow-[0_15px_30px_rgba(14,165,233,0.06)] border-sky-500/20 hover:border-sky-500/45',
      badge: 'PROPERTIES & REALESTATE',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      bulletColor: 'border-sky-500/40 bg-sky-500'
    },
  ];

  return (
    <section id="businesses" className="py-16 bg-[#060608] relative px-4 sm:px-6 md:px-8 lg:px-12">
      {/* Background patterns */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-yellow-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      {/* Creamy Off-white Elegant Container */}
      <div className="max-w-7xl mx-auto bg-[#fdfaf4] border border-[#eaddcd]/80 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden text-center">
        
        {/* Soft elegant warm background lighting */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/[0.03] rounded-full filter blur-[80px] pointer-events-none" />

        {/* Header Title with elegant decorative lines */}
        <div className="flex flex-col items-center justify-center space-y-3 mb-16 relative z-10">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#ad8043]/30"></span>
            <span className="text-xs sm:text-sm font-bold text-[#ad8043] uppercase tracking-[0.3em]">
              OUR BUSINESSES
            </span>
            <span className="w-8 h-[2px] bg-[#ad8043]/30"></span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-slate-900 tracking-tight leading-tight mt-1">
            Diverse Services, One Commitment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans font-light max-w-xl mx-auto mt-2.5 leading-relaxed">
            Every business division under SGC operates with identical standards of absolute transparency, superior hospitality, and long-term customer trust.
          </p>
        </div>

        {/* Operating Businesses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative z-10">
          {businesses.map((biz) => (
            <motion.div
              key={biz.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:translate-y-[-6px] hover:shadow-[0_25px_45px_rgba(0,0,0,0.4)] ${biz.cardBg} ${biz.colorGlow}`}
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative aspect-[4/3] overflow-hidden border-b border-yellow-500/5">
                  <img
                    src={biz.image}
                    alt={
                      biz.id === 'gold'
                        ? "SGC Gold Buyers Chandigarh - Settle Pledged Gold Loans & Get Instant Cash for Gold in Chandigarh, Mohali, Panchkula, Zirakpur"
                        : biz.id === 'catering'
                        ? "Salafiya Catering Enterprises - Premium Wedding, Corporate & Event Kashmiri Caterers in Chandigarh, Srinagar & Tricity"
                        : "Salafi Realestate & Land Developers - Commercial Plots, Premium Lands, & Office Spaces in Srinagar & Chandigarh"
                    }
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Floating Division Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase border backdrop-blur-md ${biz.badgeColor}`}>
                      {biz.badge}
                    </span>
                  </div>

                  {/* Icon Emblem Circle overlapping the divider line */}
                  <div className="absolute -bottom-6 left-6 w-12 h-12 rounded-full border-2 border-yellow-550/30 bg-[#060608] flex items-center justify-center shadow-lg group-hover:border-yellow-500/60 transition-colors z-10">
                    {biz.icon}
                  </div>
                </div>

                {/* Card Content body */}
                <div className="p-6 pt-10 space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-white group-hover:text-yellow-500 transition-colors">
                    {biz.name}
                  </h3>

                  {/* Custom bullets list - target points like on user screenshot */}
                  <ul className="space-y-3 pt-1">
                    {biz.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-4.5 h-4.5 rounded-full border border-yellow-500/25 shrink-0 bg-transparent">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                        </div>
                        <span className="text-gray-300 font-sans text-xs sm:text-sm font-light">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button footer */}
              <div className="p-6 pt-2 border-t border-yellow-500/[0.03] bg-black/35">
                <button
                  onClick={() => onExploreBusiness(biz.id)}
                  className={`w-full py-4 px-4 rounded-md text-xs tracking-widest font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${biz.btnClassName}`}
                >
                  <span>{biz.btnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
