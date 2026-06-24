import { Facebook, Instagram, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer({ onOpenAboutPage }) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-[#090b11] border-t border-yellow-500/10 pt-16 pb-8 relative overflow-hidden text-left">
      {/* Background shape */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-yellow-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Left Column Brand Details */}
        <div className="md:col-span-5 space-y-5">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection('home')}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-yellow-500/40 bg-yellow-500/5">
              <span className="font-serif text-sm font-bold text-yellow-500 tracking-wider">SGC</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-serif font-black text-lg text-yellow-500 tracking-wider">SALAFIYA</span>
              </div>
              <span className="text-[9px] text-gray-400 font-sans tracking-[0.25em] leading-none uppercase">
                Group of Companies
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 font-sans font-light leading-relaxed max-w-sm">
            Salafiya Group of Companies (SGC) was established in 2021 with a visionary roadmap to provide trusted, reliable, and premium quality services across multiple commercial divisions in Kashmir.
          </p>

          <p className="text-[10px] text-gray-500 font-serif">
            ESTABLISHED IN 2021 • INCORPORATED SGC
          </p>
        </div>

        {/* Center Column 1 Quick Links */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="font-serif text-xs font-bold text-yellow-500 uppercase tracking-[0.25em]">
            QUICK LINKS
          </h4>
          <ul className="space-y-2 text-xs">
            {['HOME', 'ABOUT US', 'OUR BUSINESSES', 'WHY SGC', 'CONTACT US'].map((link) => {
              const ids = {
                'HOME': 'home',
                'ABOUT US': 'about',
                'OUR BUSINESSES': 'businesses',
                'WHY SGC': 'why-sgc',
                'CONTACT US': 'contact'
              };
              return (
                <li key={link}>
                  <button
                    onClick={() => {
                      if (link === 'ABOUT US' && onOpenAboutPage) {
                        onOpenAboutPage();
                      } else {
                        scrollToSection(ids[link]);
                      }
                    }}
                    className="text-gray-400 hover:text-yellow-500 transition-colors font-light hover:underline underline-offset-4"
                  >
                    {link}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Center Column 2 Operating divisions lists */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="font-serif text-xs font-bold text-yellow-500 uppercase tracking-[0.25em]">
            OUR BUSINESSES
          </h4>
          <ul className="space-y-2 text-xs">
            {[
              { label: 'SGC Gold Services', id: 'businesses' },
              { label: 'Salafiya Enterprises', id: 'businesses' },
              { label: 'Salafi Realestate', id: 'businesses' },
            ].map((biz, idx) => (
              <li key={idx}>
                <button
                  onClick={() => scrollToSection(biz.id)}
                  className="text-gray-400 hover:text-yellow-400 transition-colors font-light hover:underline underline-offset-4"
                >
                  {biz.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column Contact Details */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="font-serif text-xs font-bold text-yellow-500 uppercase tracking-[0.25em]">
            CONTACT INFO
          </h4>
          <ul className="space-y-3.5 text-xs text-gray-400 font-sans font-light">
            <li className="flex gap-2.5 items-start">
              <MapPin className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <span>
                Salafiya Group of Companies (SGC),<br className="hidden sm:inline" />
                Lal Chowk, Srinagar, Jammu &amp; Kashmir, India
              </span>
            </li>
            <li className="flex gap-2.5 items-center">
              <Phone className="w-4 h-4 text-yellow-500 shrink-0" />
              <a href="tel:7889434741" className="hover:text-yellow-500 transition-colors">
                7889 434 741
              </a>
            </li>
            <li className="flex gap-2.5 items-center">
              <Mail className="w-4 h-4 text-yellow-500 shrink-0" />
              <a href="mailto:info@salafiyagroup.com" className="hover:text-yellow-500 transition-colors">
                info@salafiyagroup.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar Rights and Social handles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-yellow-500/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <p className="text-[11px] text-gray-500 tracking-wide font-sans font-light">
          &copy; {new Date().getFullYear()} Salafiya Group of Companies (SGC). All Rights Reserved.
        </p>

        {/* Social vectors */}
        <div className="flex items-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/15 border border-white/10 hover:border-yellow-500/30 transition-all cursor-pointer"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/15 border border-white/10 hover:border-yellow-500/30 transition-all cursor-pointer"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/917889434741"
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>

      </div>
    </footer>
  );
}
