import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Menu, X, Building2, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenInquiries, inquiriesCount, onOpenAdminDashboard, onOpenAboutPage, onSelectGoldWebsite }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Simple active link detection
      const sections = ['home', 'about', 'businesses', 'why-sgc', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { name: 'HOME', id: 'home' },
    { name: 'ABOUT US', id: 'about' },
    { name: 'OUR BUSINESSES', id: 'businesses' },
    { name: 'WHY SGC', id: 'why-sgc' },
    { name: 'CONTACT US', id: 'contact' },
  ];

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#090b11]/95 backdrop-blur-md border-b border-yellow-500/10 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : 'bg-gradient-to-b from-[#060608]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection('home')}
          >
            {/* Elegant SVG/CSS Logo mirroring SGC Crown logo */}
            <div className="relative w-12 h-12 flex items-center justify-center rounded-full border-2 border-yellow-500/40 bg-gradient-to-tr from-yellow-600/15 to-amber-500/5 group-hover:border-yellow-500 transition-all duration-300">
              {/* Outer rotating ring on hover */}
              <div className="absolute inset-px rounded-full border border-dashed border-yellow-500/20 group-hover:rotate-45 transition-transform duration-1000"></div>
              
              {/* SGC Letters and Crown */}
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-yellow-500 font-bold tracking-widest leading-none -mt-1 block">👑</span>
                <span className="font-serif text-sm font-bold text-yellow-500 tracking-wider">SGC</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-serif font-black text-lg sm:text-xl text-yellow-500 tracking-wider">SALAFIYA</span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-gray-400 font-sans tracking-[0.25em] leading-none uppercase">Group of Companies</span>
            </div>
          </div>

          {/* Desktop Navlinks */}
          <div className="hidden md:flex items-center space-x-5 lg:space-x-7">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  if (link.id === 'about' && onOpenAboutPage) {
                    onOpenAboutPage();
                  } else {
                    scrollToSection(link.id);
                  }
                }}
                className={`relative py-2 text-xs font-semibold tracking-widest transition-colors ${
                  activeSection === link.id
                    ? 'text-yellow-500'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}

            <button
              onClick={onSelectGoldWebsite}
              className="relative py-1.5 text-[11px] font-bold tracking-widest text-yellow-500 hover:text-yellow-400 transition-all flex items-center gap-1.5 cursor-pointer uppercase border border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 px-2.5 rounded shadow-sm"
              title="Go straight to the high-converting SGC Gold landing page"
              id="navbar-desktop-gold-link"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
              SGC Gold Desk
            </button>
          </div>

          {/* Right Controls: Inquiries Inbox & Get In Touch CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenAdminDashboard}
              className="relative p-2 text-yellow-500 hover:text-yellow-400 font-sans transition-all flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/15 rounded-full px-3 py-1.5 border border-yellow-500/20 text-xs font-bold shadow-sm cursor-pointer"
              title="Access central admin console"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>ADMIN PORTAL</span>
            </button>

            {inquiriesCount > 0 && (
              <button
                onClick={onOpenInquiries}
                className="relative p-2 text-gray-400 hover:text-yellow-500 transition-colors flex items-center gap-1 bg-[#121520] hover:bg-[#191d2d] rounded-full px-3 py-1.5 border border-yellow-500/10 text-xs font-medium"
                title="View submitted inquiries"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>Inquiries ({inquiriesCount})</span>
              </button>
            )}

            <button
              onClick={() => scrollToSection('contact')}
              className="flex items-center gap-2 bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-[#060608] border border-yellow-500/50 hover:border-yellow-500 px-4 py-2 rounded-md font-semibold text-xs tracking-widest transition-all duration-300 transform active:scale-95 cursor-pointer shadow-[0_4px_15px_rgba(234,179,8,0.1)] hover:shadow-[0_4px_20px_rgba(234,179,8,0.25)]"
            >
              <Phone className="w-3.5 h-3.5" />
              GET IN TOUCH
            </button>
          </div>

          {/* Mobile hamburger menu & notifications */}
          <div className="flex md:hidden items-center gap-3">
            {inquiriesCount > 0 && (
              <button
                onClick={onOpenInquiries}
                className="relative p-1.5 text-gray-300 hover:text-yellow-500 bg-[#121520] rounded-full border border-yellow-500/10"
              >
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center font-bold">
                  {inquiriesCount}
                </div>
                <Building2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-300 hover:text-white transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#090b11]/98 border-b border-yellow-500/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    if (link.id === 'about' && onOpenAboutPage) {
                      setIsOpen(false);
                      onOpenAboutPage();
                    } else {
                      scrollToSection(link.id);
                    }
                  }}
                  className={`block w-full text-left py-3 px-4 text-sm font-semibold tracking-widest rounded-lg transition-all ${
                    activeSection === link.id
                      ? 'text-yellow-500 bg-yellow-500/5 border-l-2 border-yellow-500 pl-3'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </button>
              ))}

              <button
                onClick={() => {
                  setIsOpen(false);
                  onSelectGoldWebsite();
                }}
                className="w-full text-left py-3.5 px-4 text-sm font-bold tracking-widest rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center gap-2 cursor-pointer"
                id="navbar-mobile-gold-link"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                SGC GOLD DESK
              </button>

              <div className="pt-4 border-t border-yellow-500/10 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAdminDashboard();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#121520] hover:bg-[#191d2d] text-yellow-500 px-4 py-3 rounded-md font-bold text-xs tracking-widest transition-all duration-350 border border-yellow-500/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  ADMIN PORTAL
                </button>

                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-[#060608] px-4 py-3 rounded-md font-bold text-xs tracking-widest transition-all duration-300"
                >
                  <Phone className="w-4 h-4" />
                  GET IN TOUCH
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
