import { motion } from 'motion/react';
import { Target, Eye, Compass, ShieldCheck } from 'lucide-react';

export default function AboutUs() {
  const tenets = [
    {
      icon: <Target className="w-5 h-5 text-yellow-500" />,
      title: 'Our Mission',
      desc: 'To deliver exceptional operations in gold services, food catering, and real estate, based on unwavering ethical standards and client first transparency.',
    },
    {
      icon: <Eye className="w-5 h-5 text-yellow-500" />,
      title: 'Our Vision',
      desc: 'To consolidate as Jammu & Kashmir&apos;s most trusted multi-sector leader, recognized for elevating service quality and community contribution.',
    },
    {
      icon: <Compass className="w-5 h-5 text-yellow-500" />,
      title: 'Our Direction',
      desc: 'Adapting computerized precision in physical trades, premium health safety in culinary sectors, and transparent title transfers in land deals.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#090b11] relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Description Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-px bg-yellow-500/50"></span>
              <span className="text-xs sm:text-sm font-bold text-yellow-500 uppercase tracking-[0.3em]">
                ABOUT THE PARENT BRAND
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-white tracking-tight leading-tight">
              One Connected Group,<br className="hidden sm:inline" />
              Unified Under SGC Excellence
            </h2>

            <p className="text-sm text-gray-300 font-sans font-light leading-relaxed">
              Established in 2021, <strong>Salafiya Group of Companies (SGC)</strong> serves as the central umbrella brand powering specialized local divisions. Rather than operating as fully detached companies, SGC Gold, Salafiya Enterprises, and Salafi Realestate operate as closely connected operations sharing a singular connected brand identity, financial backing, and long-term commitment to community welfare.
            </p>

            <div className="p-5 border border-yellow-500/10 rounded-xl bg-[#0e111d] flex gap-4 items-start shadow-md">
              <ShieldCheck className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-serif text-sm font-bold text-yellow-400">Umbrella Brand Synergies</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  All subsidiaries follow SGC&apos;s stringent corporate governance protocols. When you transact with SGC Gold, dine with Salafiya Enterprises, or settle assets with Salafi Realestate, you are supported by the collective strength and security of SGC.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column Mission/Vision/Values Row */}
          <div className="lg:col-span-6 space-y-6">
            {tenets.map((ten, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-[#0e111d] border border-yellow-500/10 hover:border-yellow-500/25 p-6 rounded-xl flex gap-4 text-left items-start transition-all duration-300 hover:translate-x-1.5 shadow-md group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-500/10 border border-yellow-500/20 group-hover:bg-yellow-500/20 group-hover:border-yellow-500 transition-colors shrink-0">
                  {ten.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-white group-hover:text-yellow-500 transition-colors">
                    {ten.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    {ten.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
