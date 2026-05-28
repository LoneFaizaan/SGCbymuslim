import { useState, useMemo, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, ArrowLeft, ChevronRight, Phone, Clock, 
  UtensilsCrossed, Calendar, Sparkles, AlertCircle, ShoppingBag 
} from 'lucide-react';
import salafiyaCatering from '../assets/images/salafiya_catering_1779942543592.png';
import { Inquiry } from '../types';

interface CateringWebsiteProps {
  onBackToParent: () => void;
  onSubmitInquiry: (inquiry: Omit<Inquiry, 'id' | 'date'>) => void;
}

interface DishItem {
  id: string;
  name: string;
  category: 'starter' | 'mains' | 'rice' | 'dessert';
  basePrice: number;
}

const MENU_OPTIONS: DishItem[] = [
  { id: 'rogan', name: 'Rogan Josh (Mutton Classic)', category: 'mains', basePrice: 180 },
  { id: 'rista', name: 'Rista (Minced Mutton Balls)', category: 'mains', basePrice: 190 },
  { id: 'kabab', name: 'Mutton Seekh Kebab (Skewered)', category: 'starter', basePrice: 85 },
  { id: 'tabak', name: 'Tabak Maaz (Crispy Ribs)', category: 'starter', basePrice: 140 },
  { id: 'gushtaba', name: 'Gushtaba (Creamy Gravy Ball)', category: 'mains', basePrice: 200 },
  { id: 'daniwal', name: 'Daniwal Korma (Coriander Lamb)', category: 'mains', basePrice: 130 },
  { id: 'rice_premium', name: 'Premium Saffron Basmati Rice', category: 'rice', basePrice: 40 },
  { id: 'pulao', name: 'Royal Kashmiri Pulao (Nuts & Saffron)', category: 'rice', basePrice: 70 },
  { id: 'phirni', name: 'Saffron Semolina Phirni (Clay cups)', category: 'dessert', basePrice: 45 },
  { id: 'kahwa', name: 'Traditional Almond Saffron Kahwa', category: 'dessert', basePrice: 30 }
];

export default function CateringWebsite({ onBackToParent, onSubmitInquiry }: CateringWebsiteProps) {
  const [selectedDishes, setSelectedDishes] = useState<string[]>(['rogan', 'kabab', 'rice_premium', 'phirni']);
  const [headcount, setHeadcount] = useState<number>(350);
  const [eventType, setEventType] = useState<string>('Wedding');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const pricing = useMemo(() => {
    let perPlateSum = 0;
    selectedDishes.forEach(id => {
      const match = MENU_OPTIONS.find(item => item.id === id);
      if (match) perPlateSum += match.basePrice;
    });

    // Volume discount
    let discount = 0;
    if (headcount > 500) {
      discount = 0.08; // 8% discount
    } else if (headcount > 250) {
      discount = 0.04; // 4% discount
    }

    const priceAfterDiscount = perPlateSum * (1 - discount);
    const totalEventCost = priceAfterDiscount * headcount;

    return {
      rawPerPlate: perPlateSum,
      discountPercent: Math.round(discount * 100),
      perPlateFinal: Math.round(priceAfterDiscount),
      totalEstimate: Math.round(totalEventCost)
    };
  }, [selectedDishes, headcount]);

  const toggleDish = (id: string) => {
    setSelectedDishes(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const scrollToMenuDesigner = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCateringSubmit = (e: FormEvent) => {
    e.preventDefault();
    scrollToContact();
    const dishNames = selectedDishes
      .map(id => MENU_OPTIONS.find(m => m.id === id)?.name || '')
      .filter(Boolean)
      .join(', ');
    setMsg(`I designed a custom layout for my ${eventType} event (headcount of ${headcount} plates). Included items are: [${dishNames}]. Calculated rate is ₹${pricing.perPlateFinal}/plate. Please contact me for professional booking.`);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitInquiry({
        name,
        email: 'No email provided (Salafiya Catering Portal)',
        phone,
        businessSection: 'catering',
        message: msg || `Catering arrangement requested for approximately ${headcount} guests.`
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
    <div className="min-h-screen bg-[#04120c] text-emerald-50 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Ornate Header */}
      <header className="sticky top-0 z-40 bg-[#04120c]/95 backdrop-blur-md border-b border-emerald-500/10 py-3 sm:py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToParent}
              className="flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500 hover:text-black text-emerald-400 p-2 rounded-lg transition-all text-xs font-bold mr-1 group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">GROUP HOME</span>
            </button>
            <div className="w-9 h-9 rounded-full border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center">
              <span className="text-emerald-400 text-xs font-serif font-bold">🍲</span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 leading-none">
                <span className="font-serif font-black text-xs sm:text-sm tracking-wide text-white">SALAFIYA ENTERPRISES</span>
              </div>
              <span className="text-[7.5px] text-emerald-400 font-sans tracking-[0.2em] leading-none uppercase block">Royal Catering &amp; Wazwan</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-[10px] font-bold tracking-[0.2em] text-emerald-100">
            <button onClick={scrollToMenuDesigner} className="hover:text-emerald-400 transition-colors">PLATE CALCULATOR</button>
            <button onClick={() => {}} className="hover:text-emerald-400 transition-colors cursor-default">GRAND MEALS</button>
            <button onClick={scrollToContact} className="hover:text-emerald-400 transition-colors">EVENT BOOKING</button>
          </div>

          <a
            href="tel:9622956795"
            className="text-xs bg-emerald-500 text-black px-4 py-2 rounded font-bold tracking-wider hover:bg-emerald-400 transition-all shadow-[0_4px_15px_rgba(16,185,129,0.15)] flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>9622 956 795</span>
          </a>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#04120c] via-[#071d13] to-[#04120c]">
        
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold tracking-[0.2em] text-emerald-300 uppercase">
              👑 ELITE BANQUETING AND TRADITIONAL KASHMIRI WAZWAN
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              A Feast Crafted for the Finest Royalty <br />
              <span className="text-emerald-400 italic font-medium">Prepared by Expert Vastas.</span>
            </h1>

            <p className="text-sm text-emerald-100/80 leading-relaxed font-light">
              Elevate your weddings, corporate socials, and grand family gatherings with authentic Kashmiri flavors. Our signature <strong>Salafiya Enterprises</strong> catering employs legendary local master chefs (Vastas), premium handpicked spices, and completely hygienic modern processing lines.
            </p>

            <div className="grid grid-cols-3 gap-4 py-2 border-y border-emerald-500/10">
              <div>
                <span className="font-serif text-lg font-bold text-emerald-400 block">100%</span>
                <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-sans font-light">Zabihah Halal</span>
              </div>
              <div className="border-x border-emerald-500/10 px-4">
                <span className="font-serif text-lg font-bold text-emerald-400 block">Grade-A</span>
                <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-sans font-light">Saffron Sourced</span>
              </div>
              <div className="pl-2">
                <span className="font-serif text-lg font-bold text-emerald-400 block">Cleanliness</span>
                <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-sans font-light">ISO Sanitized Kitchens</span>
              </div>
            </div>

            <div className="flex gap-4 pt-3 flex-wrap">
              <button
                onClick={scrollToMenuDesigner}
                className="bg-emerald-500 text-black px-6 py-4 rounded font-bold text-xs tracking-widest uppercase hover:bg-emerald-400 transition-all shadow-lg flex items-center gap-2"
              >
                <span>OPEN DIGITAL MENU DESIGNER</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={scrollToContact}
                className="border border-emerald-500/40 hover:border-emerald-500 text-emerald-400 px-6 py-4 rounded font-bold text-xs tracking-widest uppercase hover:bg-emerald-500/5 transition-all"
              >
                REQUEST DIRECT CALLBACK
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-[480px] aspect-square rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl">
              <img
                src={salafiyaCatering}
                alt="Salafiya fine Kashmiri catering"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04120c] via-transparent to-transparent flex flex-col justify-end p-6">
                <div>
                  <span className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase">Gourmet Catering Standard</span>
                  <h3 className="font-serif text-xl font-bold text-white leading-none">Traditional Copper Tramis Preparation</h3>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Signature Specialties Detail Grid */}
      <section className="py-20 bg-[#020b07] border-y border-white/5 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center justify-center space-y-2 mb-16 text-center">
            <span className="text-emerald-400 text-xs font-bold tracking-[0.25em] uppercase">CULINARY EXQUISITENESS</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">Our Royal Signature Offerings</h2>
            <p className="text-xs text-emerald-300/60 leading-relaxed font-light max-w-sm">Crafted with the finest local ingredients and absolute cleanliness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🍗',
                title: 'Live Barbecue & Starters',
                desc: 'Smoking hot charcoal embers preparing mutton seekhs, tabak maaz ribs, and spicy mint chutneys in live open-air premium stalls.'
              },
              {
                icon: '🍲',
                title: 'Traditional 36-Dish Wazwan',
                desc: 'Traditional banquets structured to serve multi-course master meals to 4-person trami tables, maintaining supreme Kashmir ethos.'
              },
              {
                icon: '🍮',
                title: 'Royal Saffron Desserts',
                desc: 'Creamy cold phirnis, sweet saffron-infused rice desserts, and warm almond-garnished Kahwa herbal drinks served in traditional styles.'
              }
            ].map((spec, idx) => (
              <div key={idx} className="bg-[#04140e] p-6 rounded-xl border border-emerald-500/10 space-y-4">
                <span className="text-3xl filter saturate-150 block">{spec.icon}</span>
                <h4 className="font-serif text-lg font-bold text-white">{spec.title}</h4>
                <p className="text-xs text-emerald-200/60 font-light leading-relaxed">{spec.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Menu Designer Page Sub-section */}
      <section ref={menuRef} className="py-20 bg-[#04120c] text-left relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs text-emerald-400 tracking-[0.25em] font-bold block uppercase">INTERACTIVE CUSTOMIZER</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">Design Your Custom Feast Menu</h2>
              <p className="text-xs sm:text-sm text-emerald-200/70 leading-relaxed font-light">
                Tailor a custom catering experience for your special day. Toggle items on the menu catalog to immediately see estimated pricing, including bulk discounts for larger headcounts.
              </p>

              <div className="bg-[#020b07] border border-emerald-500/10 p-5 rounded-xl space-y-3">
                <h4 className="font-serif text-sm font-bold text-white flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-400" /> SGC Bulk Discount Tier</h4>
                <div className="space-y-1 text-xs text-emerald-200/60 font-light">
                  <p className="flex justify-between"><span>250 - 500 Guests:</span> <span className="text-emerald-400 font-bold">4% Off plate rate</span></p>
                  <p className="flex justify-between"><span>500+ Guests:</span> <span className="text-emerald-400 font-bold">8% Off plate rate</span></p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#061e14] border border-emerald-500/15 p-6 sm:p-8 rounded-xl shadow-2xl relative">
              <form onSubmit={handleCateringSubmit} className="space-y-6">
                
                {/* Event Metadata selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Occasion Type</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full bg-[#04120c]/90 border border-emerald-500/20 rounded p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                    >
                      <option value="Wedding">Traditional Kashmiri Wedding</option>
                      <option value="Nikah">Nikah Ceremonial Gathering</option>
                      <option value="Corporate">Corporate Conference Banquet</option>
                      <option value="Private">VIP Private Dinner</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Estimated Headcount</label>
                    <input
                      type="number"
                      min="50"
                      max="3000"
                      value={headcount}
                      onChange={(e) => setHeadcount(Number(e.target.value))}
                      className="w-full bg-[#04120c]/90 border border-emerald-500/20 rounded p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Grid Item selections */}
                <div className="space-y-2">
                  <label className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Dish Selections &amp; Starters</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                    {MENU_OPTIONS.map((item) => {
                      const isSelected = selectedDishes.includes(item.id);
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => toggleDish(item.id)}
                          className={`p-3 rounded-lg border text-left transition-all flex justify-between items-center cursor-pointer ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500/10 text-white'
                              : 'border-emerald-500/10 bg-[#04120c] text-emerald-200/50 hover:border-emerald-500/35'
                          }`}
                        >
                          <div>
                            <span className="text-[9px] uppercase text-emerald-400 font-bold tracking-widest block font-sans">
                              {item.category}
                            </span>
                            <span className="text-xs font-serif font-bold text-gray-100">{item.name}</span>
                          </div>
                          <span className="font-mono text-xs text-emerald-400 bg-[#04120c]/50 px-2 py-0.5 rounded">
                            ₹{item.basePrice}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bill Estimate block */}
                <div className="p-5 bg-[#030e09] border border-emerald-500/10 rounded-xl space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between text-emerald-200/70">
                    <span>Base Per-Plate rate:</span>
                    <span>₹{pricing.rawPerPlate}</span>
                  </div>
                  {pricing.discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Volume Discount ({pricing.discountPercent}%):</span>
                      <span>- ₹{Math.round(pricing.rawPerPlate - pricing.perPlateFinal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold">
                    <span>Final Per-Plate cost:</span>
                    <span className="text-emerald-400">₹{pricing.perPlateFinal} / plate</span>
                  </div>
                  <div className="border-t border-emerald-500/10 pt-3 flex justify-between items-center text-sm font-bold">
                    <span className="text-white uppercase text-xs">Estimated Event Budget ({headcount} guests)</span>
                    <span className="font-mono text-lg text-emerald-400">₹{pricing.totalEstimate.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Submittal */}
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
                >
                  <span>REQUEST FREE MEAL ESTIMATION</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Main Form Booking details */}
      <section ref={contactRef} className="py-20 bg-[#020b07] text-left border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-[0.2em]">Contact Salafiya Catering Division</span>
            <h2 className="font-serif text-3xl font-bold text-white">Book Your Special Day Banquet</h2>
            <p className="text-xs text-emerald-300/60 leading-normal max-w-sm mx-auto font-light">Submit your booking request and secure our team of legendary Kashmiri head chefs.</p>
          </div>

          <div className="bg-[#04120c] border border-emerald-500/15 rounded-2xl p-6 sm:p-8 shadow-xl">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Organizer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#061e14] border border-white/5 focus:border-emerald-500/50 rounded p-3 text-xs outline-none text-white transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Phone-No *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#061e14] border border-white/5 focus:border-emerald-500/50 rounded p-3 text-xs outline-none text-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Remarks / Event Date / Customizations</label>
                <textarea
                  rows={3}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Specify event date, location venue, or alternative menu items required."
                  className="w-full bg-[#061e14] border border-white/5 focus:border-emerald-500/50 rounded p-3 text-xs outline-none text-white transition-colors resize-none"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-emerald-500/70">🍲 Managed directly by Salafiya Enterprises food division.</span>
                
                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black px-6 py-3 rounded font-bold text-xs tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>DISPATCHING...</span>
                  ) : submitSuccess ? (
                    <span className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-950" /> CALLBACK SECURED</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><UtensilsCrossed className="w-3.5 h-3.5" /> SECURE EXECUTIVE CALENDAR</span>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* Mini gold footer */}
      <footer className="bg-[#040e09] border-t border-emerald-500/10 py-8 text-center text-xs text-emerald-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p>© {new Date().getFullYear()} Salafiya Enterprises catering division. Fully regulated under Kashmiri traditional guidelines.</p>
          <div className="flex justify-center gap-6 text-[10px]">
            <span>Corporate Banquets Office: Srinagar, Kashmir</span>
            <span>Tel: 9622 956 795</span>
            <button onClick={onBackToParent} className="text-emerald-400 font-bold underline hover:text-emerald-300 cursor-pointer">
              SGC MAIN GROUP WEBSITE
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
