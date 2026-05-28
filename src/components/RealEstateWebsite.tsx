import { useState, useMemo, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, ArrowLeft, ChevronRight, Phone, Eye, Search,
  MapPin, Landmark, ShieldCheck, DollarSign, Calendar, MessageSquare, Send
} from 'lucide-react';
import salafiRealestate from '../assets/images/salafi_realestate_1779942569443.png';
import { Inquiry } from '../types';

interface RealEstateWebsiteProps {
  onBackToParent: () => void;
  onSubmitInquiry: (inquiry: Omit<Inquiry, 'id' | 'date'>) => void;
}

interface PropertyMock {
  id: string;
  title: string;
  category: 'residential' | 'commercial' | 'plot';
  price: string;
  location: string;
  size: string;
  vibe: string;
}

const MOCK_PROPERTIES: PropertyMock[] = [
  {
    id: 'prop-1',
    title: 'SGC Boulevard Commercial Plaza',
    category: 'commercial',
    price: '₹4.5 Crores',
    location: 'Rajbagh, Srinagar',
    size: '4200 Sq. Ft.',
    vibe: 'Ideal for premium retail stores, bank branches, or high-end corporate corporate offices. Premium dual road access with abundant parking slots.'
  },
  {
    id: 'prop-2',
    title: 'Pineview Premium Residential Villa',
    category: 'residential',
    price: '₹2.8 Crores',
    location: 'Gulmarg Road, Tangmarg',
    size: '4 BHK (3500 Sq. Ft.)',
    vibe: 'Fully heated luxury duplex villa overlooking pristine snow pines. Ornate woodwork, custom cedar pillars, and complete power grid back-up.'
  },
  {
    id: 'prop-3',
    title: 'Orchard Meadows Investment Land Plot',
    category: 'plot',
    price: '₹1.2 Crores',
    location: 'Zabarwan foothills, Srinagar',
    size: '2 Kanals (Premium Level)',
    vibe: 'Prime freehold apple orchard plot cleared for residential structures. Completely clear title verification done by Salafi Group in-house councils.'
  },
  {
    id: 'prop-4',
    title: 'SGC High-Street Retail Complex',
    category: 'commercial',
    price: '₹1.6 Crores',
    location: 'Lal Chowk Centre, Srinagar',
    size: '1800 Sq. Ft.',
    vibe: 'First floor premium showroom space inside the busiest market node of Srinagar. Guaranteed high commercial footfall and rental yields.'
  },
  {
    id: 'prop-5',
    title: 'Lakecrest Luxury Executive Apartment',
    category: 'residential',
    price: '₹95 Lakhs',
    location: 'Nigeen Lake Meadows',
    size: '3 BHK (1950 Sq. Ft.)',
    vibe: 'Exquisite modern lakeview apartments with smart heating controllers, high-speed fiber internet, and 24x7 military-certified security guards.'
  }
];

export default function RealEstateWebsite({ onBackToParent, onSubmitInquiry }: RealEstateWebsiteProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'residential' | 'commercial' | 'plot'>('all');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('prop-1');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const listingsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const filteredProperties = useMemo(() => {
    if (activeCategory === 'all') return MOCK_PROPERTIES;
    return MOCK_PROPERTIES.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const selectedProperty = useMemo(() => {
    return MOCK_PROPERTIES.find(p => p.id === selectedPropertyId) || MOCK_PROPERTIES[0];
  }, [selectedPropertyId]);

  const scrollToListings = () => {
    listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleRequestSiteVisit = (title: string, loc: string) => {
    scrollToContact();
    setMsg(`I am interested in requesting a verified site-visit and complete title-deeds log file for property: "${title}" located at ${loc}. Please register my telephone slot.`);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitInquiry({
        name,
        email: 'No email provided (Salafi Realestate Portal)',
        phone,
        businessSection: 'real_estate',
        message: msg || `Real-estate consultation requested regarding catalog property holdings.`
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setName('');
      setPhone('');
      setMsg('');
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-sky-50 flex flex-col justify-between selection:bg-sky-500/20 selection:text-sky-300">
      
      {/* SGC Real Estate Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#070b13]/95 backdrop-blur-md border-b border-sky-500/10 py-3 sm:py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToParent}
              className="flex items-center gap-1.5 bg-sky-500/10 hover:bg-sky-500 hover:text-black text-sky-400 p-2 rounded-lg transition-all text-xs font-bold mr-1 group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">GROUP HOME</span>
            </button>
            <div className="w-9 h-9 rounded-full border border-sky-500/30 bg-sky-500/5 flex items-center justify-center">
              <span className="text-sky-400 text-xs font-bold">🏢</span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 leading-none">
                <span className="font-serif font-black text-xs sm:text-sm tracking-wide text-white font-sans uppercase">SALAFI REALESTATE</span>
              </div>
              <span className="text-[7.5px] text-sky-400 font-sans tracking-[0.2em] leading-none uppercase block">Certified Land &amp; Property</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-[10px] font-bold tracking-[0.2em] text-sky-100">
            <button onClick={scrollToListings} className="hover:text-sky-400 transition-colors">DEEDS CATALOG</button>
            <button onClick={() => {}} className="hover:text-sky-400 transition-colors cursor-default">DUE DILIGENCE</button>
            <button onClick={scrollToContact} className="hover:text-sky-400 transition-colors">VIP SITE VISIT</button>
          </div>

          <a
            href="tel:9622956795"
            className="text-xs bg-sky-500 text-black px-4 py-2 rounded font-bold tracking-wider hover:bg-sky-400 transition-all shadow-[0_4px_15px_rgba(14,165,233,0.15)] flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>9622 956 795</span>
          </a>
        </div>
      </header>

      {/* Hero Block */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#070b13] via-[#0d1627] to-[#070b13]">
        
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-sky-500/20 bg-sky-500/5 text-[9px] font-bold tracking-[0.2em] text-sky-300 uppercase">
              🛡️ LITIGATION-FREE VERIFED LAND &amp; COMMERCIAL SPACES
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Invest with Absolute Assurance and Safety <br />
              <span className="text-sky-400 italic font-medium">100% Conflict-Free Title Clearances.</span>
            </h1>

            <p className="text-sm text-sky-150/85 leading-relaxed font-light">
              Kashmir land acquisitions require unmatched local scrutiny. At <strong>Salafi Realestate</strong>, our properties undergo exhaustive triple legal validation, revenue department checks, and full mutation registration prior to matching. No disputes, no grey-zones. Just premium wealth creation.
            </p>

            <div className="grid grid-cols-3 gap-4 py-2 border-y border-sky-500/10">
              <div>
                <span className="font-serif text-lg font-bold text-sky-400 block">100%</span>
                <span className="text-[10px] text-sky-300 uppercase tracking-widest font-sans font-light">Mutated Revenue Records</span>
              </div>
              <div className="border-x border-sky-500/10 px-4">
                <span className="font-serif text-lg font-bold text-sky-400 block">Zabarwan</span>
                <span className="text-[10px] text-sky-300 uppercase tracking-widest font-sans font-light">High Growth Corridors</span>
              </div>
              <div className="pl-2">
                <span className="font-serif text-lg font-bold text-sky-400 block">Verified</span>
                <span className="text-[10px] text-sky-300 uppercase tracking-widest font-sans font-light">Zero Dispute Deeds</span>
              </div>
            </div>

            <div className="flex gap-4 pt-3 flex-wrap">
              <button
                onClick={scrollToListings}
                className="bg-sky-500 text-black px-6 py-4 rounded font-bold text-xs tracking-widest uppercase hover:bg-sky-400 transition-all shadow-lg flex items-center gap-2"
              >
                <span>EXPLORE SECURE LISTINGS</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={scrollToContact}
                className="border border-sky-500/40 hover:border-sky-500 text-sky-400 px-6 py-4 rounded font-bold text-xs tracking-widest uppercase hover:bg-sky-500/5 transition-all"
              >
                CHAT WITH LAND LAWYER
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-[480px] aspect-square rounded-2xl overflow-hidden border border-sky-500/20 shadow-2xl">
              <img
                src={salafiRealestate}
                alt="Salafi premium villa development"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b13] via-transparent to-transparent flex flex-col justify-end p-6">
                <div>
                  <span className="text-[9px] text-sky-400 font-bold tracking-widest uppercase">Secured Assets Portfolio</span>
                  <h3 className="font-serif text-xl font-bold text-white leading-none">Luxury Residential &amp; Commerical Zones</h3>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Verification Pillar Panel */}
      <section className="py-20 bg-[#040810] border-y border-white/5 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center justify-center space-y-2 mb-16 text-center">
            <span className="text-sky-400 text-xs font-bold tracking-[0.25em] uppercase">SGC DUE-DILIGENCE DECALOGUE</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">Why Real Estate is Safer with SGC</h2>
            <p className="text-xs text-sky-300/60 leading-relaxed font-light max-w-sm">Eliminating the legendary roadblocks of Kashmir property investments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Exhaustive Revenue Scan',
                desc: 'Every plot is vetted deep into the Jammu & Kashmir revenue archives (Patwar logs) going back 35 years to confirm direct undisputed hierarchy records.'
              },
              {
                title: 'Clean RERA & Mutation Compliance',
                desc: 'We facilitate immediate formal mutation (Intikhab transfers) and ensure compliance with municipal and state urban regulations.'
              },
              {
                title: 'Infrastructure Ready Plots',
                desc: 'All plots supplied are pre-configured with active high-load transformer power access lines, municipal water, and macadamized approach roads.'
              }
            ].map((pillar, idx) => (
              <div key={idx} className="bg-[#09101f] p-6 rounded-xl border border-sky-500/10 space-y-3">
                <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/25">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white mt-1">{pillar.title}</h4>
                <p className="text-xs text-sky-200/60 font-light leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Interactive Catalog and Selector page */}
      <section ref={listingsRef} className="py-20 bg-[#070b13] text-left relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs text-sky-400 tracking-[0.25em] font-bold block uppercase">VERIFIED HOLDINGS</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">Featured Luxury Listings portfolio</h2>
              <p className="text-xs text-sky-300/60 font-light leading-relaxed">Filter property logs below and tap details to request a private escorted tour.</p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'residential', 'commercial', 'plot'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveCategory(tab);
                    // Reset selected to first match
                    const match = MOCK_PROPERTIES.find(p => tab === 'all' || p.category === tab);
                    if (match) setSelectedPropertyId(match.id);
                  }}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                    activeCategory === tab
                      ? 'bg-sky-500 border-sky-500 text-black shadow-lg shadow-sky-500/10'
                      : 'bg-[#0a101f] border-sky-500/10 hover:border-sky-500/30 text-gray-400 hover:text-sky-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Properties List Column */}
            <div className="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredProperties.map((prop) => {
                const isSelected = selectedPropertyId === prop.id;
                return (
                  <button
                    key={prop.id}
                    onClick={() => setSelectedPropertyId(prop.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-sky-500/10 border-sky-400 text-white'
                        : 'bg-[#0a101f] border-sky-500/5 hover:border-sky-500/20 text-gray-300'
                    }`}
                  >
                    <span className="text-[8px] uppercase tracking-wider font-bold text-sky-400 mb-1 block">
                      {prop.category} • {prop.location}
                    </span>
                    <h4 className="font-serif text-sm font-bold leading-tight">{prop.title}</h4>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-sky-500/10 text-xs font-mono font-bold">
                      <span className="text-gray-400">{prop.size}</span>
                      <span className="text-sky-400">{prop.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Property Preview Dashboard */}
            <div className="lg:col-span-7 bg-[#091124] border border-sky-500/15 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
              
              <div className="space-y-2">
                <div className="inline-block bg-sky-500/15 text-sky-400 text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border border-sky-400/20">
                  MUTATION TRANSFER READY
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">{selectedProperty.title}</h3>
                <p className="text-xs text-sky-400 font-mono flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {selectedProperty.location}
                </p>
              </div>

              {/* Specs box Grid */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-sky-500/10 text-xs text-left">
                <div>
                  <span className="text-gray-400 font-bold block">Pricing Tier</span>
                  <span className="font-mono text-sm text-sky-400 font-bold">{selectedProperty.price}</span>
                </div>
                <div className="border-x border-sky-500/10 px-4">
                  <span className="text-gray-400 font-bold block">Documented Area</span>
                  <span className="font-mono text-sm text-white">{selectedProperty.size}</span>
                </div>
                <div className="pl-2">
                  <span className="text-gray-400 font-bold block">Title Deed</span>
                  <span className="text-emerald-400 font-bold">100% Certified Clear</span>
                </div>
              </div>

              {/* Deep review block */}
              <div className="bg-[#040812] rounded-lg p-5 text-xs text-gray-300 space-y-3 leading-relaxed border-l-2 border-sky-500/30 font-light">
                <p className="italic font-normal">{selectedProperty.vibe}</p>
                <div className="pt-2 border-t border-sky-500/5 text-[10px] text-sky-400 flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4" /> REVENUE MUTATION SECURED IN SGC DEEDS OFFICE
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => handleRequestSiteVisit(selectedProperty.title, selectedProperty.location)}
                  className="flex-1 bg-sky-500 hover:bg-sky-400 text-black py-4 rounded font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(14,165,233,0.2)]"
                >
                  <span>REQUEST VERIFIED SITE VISIT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Lead capture contact form */}
      <section ref={contactRef} className="py-20 bg-[#040810] text-left border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-sky-400 font-bold uppercase tracking-[0.2em]">Contact Salafi Real Estate Desk</span>
            <h2 className="font-serif text-3xl font-bold text-white">Arrange Secure Property Consultations</h2>
            <p className="text-xs text-sky-300/60 leading-normal max-w-sm mx-auto font-light">Mutated deeds, verification audits, and site logistics coordinated with utmost confidentiality.</p>
          </div>

          <div className="bg-[#070b13] border border-sky-500/15 rounded-2xl p-6 sm:p-8 shadow-xl">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-sky-400 uppercase font-bold tracking-wider">Investor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0a101f] border border-white/5 focus:border-sky-500/50 rounded p-3 text-xs outline-none text-white transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-sky-400 uppercase font-bold tracking-wider">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0a101f] border border-white/5 focus:border-sky-500/50 rounded p-3 text-xs outline-none text-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-sky-400 uppercase font-bold tracking-wider">Remarks / Budget Range / Property reference</label>
                <textarea
                  rows={3}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Enter any reference plots, expected budget range (e.g. ₹50L - ₹3Cr) or specific legal queries."
                  className="w-full bg-[#0a101f] border border-white/5 focus:border-sky-500/50 rounded p-3 text-xs outline-none text-white transition-colors resize-none"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-sky-500">🏢 Audited by legal counsel of Salafiya Group of Companies.</span>
                
                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-black px-6 py-3 rounded font-bold text-xs tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>MUTATING RECORDS...</span>
                  ) : submitSuccess ? (
                    <span className="flex items-center gap-1"><Check className="w-4 h-4 text-sky-950" /> SLOT SECURED</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /> REQUEST DEED COPY</span>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* Mini gold footer */}
      <footer className="bg-[#03050a] border-t border-sky-500/10 py-8 text-center text-xs text-sky-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p>© {new Date().getFullYear()} Salafi Realestate. Certified mutations registry, Jammu &amp; Kashmir.</p>
          <div className="flex justify-center gap-6 text-[10px]">
            <span>Advisory Chambers: Lal Chowk, Srinagar</span>
            <span>Tel: 9622 956 795</span>
            <button onClick={onBackToParent} className="text-sky-400 font-bold underline hover:text-sky-300 cursor-pointer">
              SGC MAIN GROUP WEBSITE
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
