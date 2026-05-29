import { motion } from 'motion/react';
import { ShieldAlert, Award, Star, Lock, HeartHandshake } from 'lucide-react';

export default function WhyChooseSGC() {
  const promises = [
    {
      icon: <ShieldAlert className="w-6 h-6 text-yellow-500" />,
      title: 'Trust & Integrity',
      desc: 'We believe in building lasting relationships based on absolute honesty and ethical practices.',
    },
    {
      icon: <Award className="w-6 h-6 text-yellow-500" />,
      title: 'Quality Services',
      desc: 'Excellence is not an accident. We implement rigorous standard procedures in everything we do.',
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      title: 'Customer First',
      desc: 'Your absolute peace of mind and long term satisfaction is our primary driving priority.',
    },
    {
      icon: <Lock className="w-6 h-6 text-yellow-500" />,
      title: 'Transparency',
      desc: 'Honest rates, computerized evaluations, and transparent receipts in all business transactions.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-yellow-500" />,
      title: 'Commitment',
      desc: 'Dedicated to delivering on every single prompt and promise, without compromises.',
    },
  ];

  return (
    <section id="why-sgc" className="py-24 bg-[#090b11] relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Header Titles */}
        <div className="flex flex-col items-center justify-center space-y-2 mb-16">
          <span className="text-xs sm:text-sm font-bold text-yellow-500 uppercase tracking-[0.3em]">
            WHY CHOOSE SGC?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-white tracking-tight leading-tight mt-1">
            Our Promise to You
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-sans font-light max-w-xl mt-3 leading-relaxed">
            Four years of consistent quality, building communities with standard defining services across divisions.
          </p>
        </div>

        {/* Highlighted Promises 5 Columns Row/Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {promises.map((prom, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#0e111d] border border-yellow-500/10 p-6 rounded-xl flex flex-col items-center text-center space-y-4 hover:border-yellow-500/35 hover:translate-y-[-5px] transition-all duration-300 shadow-md group"
            >
              {/* Star Ornamented Circle Icon Frame */}
              <div className="relative w-14 h-14 rounded-full flex items-center justify-center bg-yellow-500/5 border border-yellow-500/25 group-hover:bg-yellow-500/15 group-hover:border-yellow-500 transition-colors duration-300">
                {prom.icon}
                
                {/* Micro ornament stars */}
                <span className="absolute -top-1 right-2 text-[8px] opacity-40 group-hover:opacity-100 transition-opacity">✦</span>
                <span className="absolute -bottom-1 left-2 text-[8px] opacity-40 group-hover:opacity-100 transition-opacity">✦</span>
              </div>

              {/* Title heading */}
              <h4 className="font-serif text-lg font-bold text-white group-hover:text-yellow-500 transition-colors">
                {prom.title}
              </h4>

              {/* Description Body */}
              <p className="text-xs text-gray-400 font-sans font-light leading-relaxed">
                {prom.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
