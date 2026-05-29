import { motion } from 'motion/react';
import { Calendar, Layers, Users, ShieldCheck, Handshake } from 'lucide-react';

export default function StatsBar() {
  const stats = [
    {
      icon: <Calendar className="w-5 h-5 text-yellow-500" />,
      label: 'SINCE',
      value: '2021',
      desc: 'Established',
    },
    {
      icon: <Layers className="w-5 h-5 text-yellow-500" />,
      label: 'PORTFOLIO',
      value: '3+',
      desc: 'Businesses',
    },
    {
      icon: <Users className="w-5 h-5 text-yellow-500" />,
      label: 'REACH',
      value: 'Thousands',
      desc: 'Happy Customers',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-yellow-500" />,
      label: 'TRUST',
      value: 'Trust',
      desc: 'Our Strength',
    },
    {
      icon: <Handshake className="w-5 h-5 text-yellow-500" />,
      label: 'COMMITMENT',
      value: 'Commitment',
      desc: 'Our Promise',
    },
  ];

  return (
    <section className="relative z-20 -mt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-yellow-500/10 bg-[#0d0f17]/90 backdrop-blur-md border border-yellow-500/20 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`p-6 flex items-center gap-4 transition-colors duration-300 hover:bg-yellow-500/5 ${
              idx % 2 === 0 && idx === stats.length - 1 ? 'col-span-2 md:col-span-1 border-t md:border-t-0' : ''
            }`}
          >
            {/* Round Icon Frame */}
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-500/10 border border-yellow-500/20 shadow-inner group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">
                {stat.label}
              </span>
              <span className="font-serif text-lg font-bold text-yellow-400 mt-1 leading-none">
                {stat.value}
              </span>
              <span className="text-xs text-gray-400 font-sans mt-0.5 font-light leading-none">
                {stat.desc}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
