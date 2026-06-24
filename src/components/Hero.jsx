import { motion } from 'motion/react';
import { ArrowRight, Building2, HelpCircle } from 'lucide-react';
import sgcBuilding from '../assets/images/sgc_building_1779942492829.png';

export default function Hero({ onExploreBusinesses, onAboutSgc }) {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-24 pb-16 flex items-center overflow-hidden bg-gradient-to-b from-[#090b11] via-[#060608] to-[#0a0b11]"
    >
      {/* Background ambient gold glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Headline and Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-6 flex flex-col items-start text-left space-y-6"
        >
          {/* Trust Quality Commitment Pinhole Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-yellow-500/35 bg-yellow-500/5 text-[10px] font-bold tracking-[0.25em] text-yellow-500 uppercase leading-none">
            Trust • Quality • Commitment
          </div>

          {/* Majestic Hero Title */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-white tracking-tight leading-[1.1]">
            Salafiya Group <br className="hidden sm:inline" />
            of Companies <span className="text-yellow-500 font-serif leading-none italic font-semibold">(SGC)</span>
          </h1>

          {/* High-Contrast Subtitle */}
          <p className="text-lg font-sans font-medium text-amber-500/90 tracking-wide border-l-2 border-yellow-500/40 pl-3">
            Building Trust. Delivering Excellence.
          </p>

          <p className="text-sm sm:text-base text-gray-400 font-sans font-light max-w-xl leading-relaxed">
            Established in 2021, Salafiya Group of Companies (SGC) is a trusted conglomerate with high-impact enterprises. We operate with standard-definition focus in gold-buying operations, catering hospitality, and premium real estate, serving all of our communities with absolute integrity and deep dedication.
          </p>

          {/* Action Callouts */}
          <div className="flex flex-wrap gap-4 pt-2 w-full sm:w-auto">
            <button
              onClick={onExploreBusinesses}
              className="group flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-yellow-500 text-[#090b11] font-bold text-xs tracking-widest uppercase px-6 py-4 rounded-md transition-all duration-300 transform shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.45)] cursor-pointer"
            >
              EXPLORE OUR BUSINESSES
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={onAboutSgc}
              className="flex items-center justify-center gap-2 bg-[#121520]/80 hover:bg-[#191d2d] text-white hover:text-yellow-400 border border-yellow-500/30 hover:border-yellow-500/70 font-semibold text-xs tracking-widest uppercase px-6 py-4 rounded-md transition-all duration-300 cursor-pointer shadow-md"
            >
              <Building2 className="w-4 h-4 text-yellow-500" />
              ABOUT SGC
            </button>
          </div>
        </motion.div>

        {/* Right Column: Stunning Mockup Premium SGC Building Image Frame */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="lg:col-span-6 relative flex justify-center w-full"
        >
          {/* Framed Image Container with ambient gold glows */}
          <div className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-yellow-500/20 group">
            
            {/* Top gold line highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-amber-600 z-10"></div>
            
            <img
              src={sgcBuilding}
              alt="SGC Group of Companies Headquarters - Trusted Gold Buyer &amp; Gold Loan Settlement Hub in Chandigarh, Mohali, Panchkula &amp; Zirakpur"
              referrerPolicy="no-referrer"
              fetchPriority="high"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            
            {/* Dark gradient overlay to frame bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060608]/90 via-[#060608]/20 to-transparent flex flex-col justify-end p-6">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] text-yellow-400 uppercase font-bold tracking-widest">SGC Corporate HQ</span>
                  <h4 className="font-serif text-base font-bold text-white leading-none">Salafiya Group Landmark</h4>
                </div>
                <div className="bg-yellow-500/20 backdrop-blur-sm p-1.5 rounded-full border border-yellow-500/30">
                  <span className="text-[9px] text-yellow-500 font-bold px-1.5 uppercase tracking-wider block">PREMIUM HQ</span>
                </div>
              </motion.div>
            </div>
            
            {/* Soft gold decorative corner accents */}
            <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-yellow-500/60 z-10 pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-yellow-500/60 z-10 pointer-events-none"></div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
