import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Calculator, Info, CheckCircle, 
  Plus, Minus, Hash, IndianRupee, MapPin, 
  Maximize2, BedDouble, Bath, ChevronRight, 
  SlidersHorizontal, Sparkles, Filter 
} from 'lucide-react';
import { GoldPurity, MenuItem, PropertyListing, PropertyType } from '../types';
import { GOLD_RATES, CATERING_MENU_ITEMS, REAL_ESTATE_LISTINGS } from '../data';

interface SubsidariesModalsProps {
  activeSection: 'gold' | 'catering' | 'real_estate' | null;
  onClose: () => void;
  onInquire: (business: 'gold' | 'catering' | 'real_estate', details: string) => void;
}

export default function SubsidariesModals({ activeSection, onClose, onInquire }: SubsidariesModalsProps) {

  // --- SGC GOLD CALCULATOR STATE ---
  const [goldWeight, setGoldWeight] = useState<number>(10);
  const [goldPurity, setGoldPurity] = useState<GoldPurity>('22K');
  const serviceChargePercent = 1.5; // SGC Service margin

  const goldCalculation = useMemo(() => {
    const rateGram = GOLD_RATES[goldPurity];
    const totalMarketValue = goldWeight * rateGram;
    const serviceCharge = (totalMarketValue * serviceChargePercent) / 100;
    const estimatedPayout = totalMarketValue - serviceCharge;

    return {
      ratePerGram: rateGram,
      marketValue: totalMarketValue,
      serviceCharge,
      payout: estimatedPayout,
    };
  }, [goldWeight, goldPurity]);


  // --- RESTAURANT / CATERING STATE ---
  const [guestCount, setGuestCount] = useState<number>(150);
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>(['app-1', 'main-2', 'des-1', 'bev-1']); // default selected recipe IDs

  const handleToggleMenuItem = (id: string) => {
    setSelectedMenuItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const menuCalculation = useMemo(() => {
    const baseItems = CATERING_MENU_ITEMS.filter(item => selectedMenuItems.includes(item.id));
    const costPerPlate = baseItems.reduce((acc, item) => acc + item.pricePerPerson, 0);
    const subtotal = costPerPlate * guestCount;
    const serviceFeePercent = 10; // staff and crockery setup
    const serviceCharge = (subtotal * serviceFeePercent) / 100;
    const grandTotal = subtotal + serviceCharge;

    return {
      costPerPlate,
      subtotal,
      serviceCharge,
      grandTotal,
      selectedCount: baseItems.length,
      itemsSummary: baseItems.map(i => i.name).join(', ')
    };
  }, [guestCount, selectedMenuItems]);


  // --- REALESTATE FILTER STATE ---
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'All' | PropertyType>('All');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(40000000); // 4 Cr Max

  const filteredProperties = useMemo(() => {
    return REAL_ESTATE_LISTINGS.filter(prop => {
      const typeMatch = selectedTypeFilter === 'All' || prop.type === selectedTypeFilter;
      const budgetMatch = prop.priceNum <= maxPriceFilter;
      return typeMatch && budgetMatch;
    });
  }, [selectedTypeFilter, maxPriceFilter]);


  // --- HELPERS ---
  const handleCateringBooking = () => {
    onInquire(
      'catering', 
      `Plan for ${guestCount} guests. Menu includes: ${menuCalculation.itemsSummary}. Total Plate Cost: ₹${menuCalculation.costPerPlate}. Est: ₹${menuCalculation.grandTotal.toLocaleString('en-IN')}`
    );
  };

  const handleGoldBooking = () => {
    onInquire(
      'gold', 
      `Request Quote - Weight: ${goldWeight}g Purity: ${goldPurity}. Est payout: ₹${goldCalculation.payout.toLocaleString('en-IN')}`
    );
  };

  const handlePropertyBooking = (prop: PropertyListing) => {
    onInquire(
      'real_estate', 
      `Interested in commercial/residential property: "${prop.title}" (${prop.id}) located in ${prop.location} valued at ${prop.price}.`
    );
  };

  return (
    <AnimatePresence>
      {activeSection && (
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4">
          
          {/* Dark Overlay Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#060608]/90 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative bg-[#0d101a] border border-yellow-500/20 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10 p-6 md:p-8 text-left"
          >
            {/* Elegant Header corner accents */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-600"></div>
            
            {/* Close Button top-right */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-yellow-500 hover:text-[#060608] hover:rotate-90 transition-all duration-300 border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Render 1 of 3 Dynamic Modes based on active sectional click */}
            {activeSection === 'gold' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-yellow-500">SGC Gold Division</span>
                  <h3 className="font-serif text-3xl font-bold text-white mt-1">
                    Gold Liquidation & Settlement Services
                  </h3>
                  <p className="text-sm text-gray-400 font-sans mt-2 max-w-2xl font-light">
                    SGC Gold operates with maximum precision using state-of-the-art gold testing machinery. We provide spot market value estimation with fully secure, ultra-transparent operations in high-privacy suites.
                  </p>
                </div>

                {/* Subsidaries Section Core Rows */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Information Card */}
                  <div className="lg:col-span-5 space-y-5">
                    <div className="bg-[#101423] border border-yellow-500/10 p-5 rounded-xl space-y-4 shadow-inner">
                      <h4 className="font-serif text-lg font-bold text-yellow-500 flex items-center gap-2">
                        <Info className="w-4 h-4 text-yellow-400" />
                        Our Gold Services
                      </h4>
                      <ul className="space-y-3.5">
                        <li className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-gray-200">Gold Buying & Exchanges</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 font-light">We acquire direct gold ornaments, gold coins and bullion at official market payouts.</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-gray-200">Gold Loan Settlements</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 font-light">Overburdened by bank interest? We settle your bank or gold loan directly, reclaim your locked ornaments, and pay you the remaining cash surplus immediately.</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-gray-200">Tamper-Proof Cabinets</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 font-light">Gold melting and purity evaluations happen entirely in front of your eyes using certified testing technology.</p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-amber-500/5 border border-yellow-500/20 p-4 rounded-xl text-xs text-amber-500 flex gap-2.5 items-start">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="font-light leading-relaxed">
                        <strong>Requirements for Payout:</strong> Valid government identity card (Aadhaar / PAN/ Passport), original purchase bill or jewelry invoices (if available) for seamless ownership assurance.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Premium Active Gold Payout Estimator Calculator */}
                  <div className="lg:col-span-7 bg-[#111525] border border-yellow-500/15 p-6 rounded-xl space-y-6 shadow-2xl relative overflow-hidden">
                    
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full filter blur-[40px] pointer-events-none"></div>

                    {/* Calculator title */}
                    <div className="flex items-center gap-2.5 pb-3 border-b border-yellow-500/10">
                      <Calculator className="w-5 h-5 text-yellow-500" />
                      <h4 className="font-serif text-lg font-bold text-white">Live Gold Payout Estimator</h4>
                    </div>

                    {/* Weight controller input */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-gray-300 font-semibold uppercase tracking-wider">Gold Net Weight (Grams)</label>
                        <span className="font-sans font-bold text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded text-sm">{goldWeight} g</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setGoldWeight(w => Math.max(1, w - 5))}
                          className="w-10 h-10 rounded bg-[#1c2136] hover:bg-yellow-500 hover:text-black flex items-center justify-center font-bold text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="range"
                          min="1"
                          max="250"
                          value={goldWeight}
                          onChange={(e) => setGoldWeight(Number(e.target.value))}
                          className="flex-1 accent-yellow-500 cursor-pointer h-1 bg-[#1a1d2e] rounded-lg"
                        />
                        <button
                          onClick={() => setGoldWeight(w => Math.min(500, w + 5))}
                          className="w-10 h-10 rounded bg-[#1c2136] hover:bg-yellow-500 hover:text-black flex items-center justify-center font-bold text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Carat Purity Grid buttons */}
                    <div className="space-y-2">
                      <label className="text-xs text-gray-300 font-semibold uppercase tracking-wider block">Select Purity Caratage</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(Object.keys(GOLD_RATES) as GoldPurity[]).map((carat) => (
                          <button
                            key={carat}
                            onClick={() => setGoldPurity(carat)}
                            className={`py-3 px-1 rounded-lg text-xs font-bold border transition-all duration-300 cursor-pointer ${
                              goldPurity === carat
                                ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                                : 'bg-[#151a2e] border-yellow-500/15 hover:border-yellow-500/40 text-gray-300 hover:text-yellow-500'
                            }`}
                          >
                            {carat}
                            <span className="block text-[8px] font-light opacity-80 mt-0.5">
                              {carat === '24K' ? '99.9%' : carat === '22K' ? '91.6%' : carat === '18K' ? '75%' : '58%'} pure
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Breakdown Ledger */}
                    <div className="bg-[#0b0e1b] rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Rate / Gram ({goldPurity})</span>
                        <span className="font-mono text-gray-200">₹{goldCalculation.ratePerGram.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Pure Content Value</span>
                        <span className="font-mono text-gray-200">₹{goldCalculation.marketValue.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Service Charge ({serviceChargePercent}%)</span>
                        <span className="font-mono text-red-400">- ₹ {goldCalculation.serviceCharge.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-t border-yellow-500/10 pt-2 flex justify-between items-center mt-2">
                        <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Estimated Cash Payout</span>
                        <span className="font-mono text-lg font-bold text-emerald-400">
                          ₹{Math.round(goldCalculation.payout).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Book Action */}
                    <button
                      onClick={handleGoldBooking}
                      className="w-full bg-[#d4af37] hover:bg-yellow-500 text-[#070912] font-bold text-xs tracking-widest uppercase py-4 rounded transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>Book Instant Payout Consultation</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            )}

            {activeSection === 'catering' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-emerald-400">Salafiya Enterprises</span>
                  <h3 className="font-serif text-3xl font-bold text-white mt-1">
                    Catering Hospitality & Menu Coordinator
                  </h3>
                  <p className="text-sm text-gray-400 font-sans mt-2 max-w-2xl font-light">
                    From grand traditional Kashmiri weddings serving multi-course Saffron Wazwan feasts, to high-end corporate summits and gatherings. We combine pristine kitchen hygiene with exquisite, mouthwatering culinary excellence.
                  </p>
                </div>

                {/* Subsidaries Section Core Rows */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Menu Items list */}
                  <div className="lg:col-span-7 bg-[#111525] border border-emerald-500/15 p-6 rounded-xl space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-500/10">
                      <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                        Select Items to Build Your Party Menu
                      </h4>
                      <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 font-bold rounded">
                        Kashmiri Heritage & Premium Veg/Non-Veg
                      </span>
                    </div>

                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                      {['appetizers', 'mains', 'desserts', 'beverages'].map((cat) => (
                        <div key={cat} className="space-y-2">
                          <h5 className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em] bg-emerald-500/5 py-1 px-2.5 rounded border-l border-emerald-500/30">
                            {cat}
                          </h5>
                          <div className="grid grid-cols-1 gap-2">
                            {CATERING_MENU_ITEMS.filter(item => item.category === cat).map((item) => {
                              const isChecked = selectedMenuItems.includes(item.id);
                              return (
                                <div
                                  key={item.id}
                                  onClick={() => handleToggleMenuItem(item.id)}
                                  className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all duration-300 ${
                                    isChecked
                                      ? 'bg-emerald-500/5 border-emerald-500 text-white'
                                      : 'bg-[#151a2e] border-white/5 hover:border-emerald-500/30 text-gray-300'
                                  }`}
                                >
                                  <div className="flex gap-2.5 items-start">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {}} // toggled on container tap
                                      className="accent-emerald-500 rounded mt-0.5 shrink-0"
                                    />
                                    <div>
                                      <p className="font-bold">{item.name}</p>
                                      <p className="text-[10px] text-gray-400 mt-0.5 font-light">{item.description}</p>
                                    </div>
                                  </div>
                                  <span className="font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded shrink-0">
                                    ₹{item.pricePerPerson} <span className="text-[9px] font-normal text-gray-400">/plate</span>
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Dynamic Price Planner Calculator */}
                  <div className="lg:col-span-5 bg-[#111525] border border-emerald-500/15 p-6 rounded-xl space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-[40px] pointer-events-none"></div>

                    {/* Calculator title */}
                    <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-500/10">
                      <Calculator className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-serif text-lg font-bold text-white">Event Budget Estimates</h4>
                    </div>

                    {/* Guests controller input */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-gray-300 font-semibold uppercase tracking-wider">Expected Guest Count</label>
                        <span className="font-sans font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded text-sm">{guestCount} Guests</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setGuestCount(g => Math.max(50, g - 50))}
                          className="w-10 h-10 rounded bg-[#1c2136] hover:bg-emerald-500 hover:text-black flex items-center justify-center font-bold text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="range"
                          min="50"
                          max="2000"
                          step="25"
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number(e.target.value))}
                          className="flex-1 accent-emerald-400 cursor-pointer h-1 bg-[#1a1d2e] rounded-lg"
                        />
                        <button
                          onClick={() => setGuestCount(g => Math.min(3000, g + 50))}
                          className="w-10 h-10 rounded bg-[#1c2136] hover:bg-emerald-500 hover:text-black flex items-center justify-center font-bold text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Selected dishes checklist */}
                    <div className="space-y-1.5 p-3 rounded-lg bg-[#0c0f1b] border border-white/5">
                      <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest block">Selected Menu Items ({menuCalculation.selectedCount})</span>
                      <p className="text-xs text-gray-300 overflow-hidden line-clamp-2 leading-relaxed">
                        {menuCalculation.selectedCount > 0 ? menuCalculation.itemsSummary : 'No items selected yet. Choose items on the left.'}
                      </p>
                    </div>

                    {/* Budget Ledger breakdown */}
                    <div className="space-y-2 rounded-lg bg-[#0c0f1b] p-4 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>Plate Cost (Food only)</span>
                        <span className="font-mono text-gray-200">₹{menuCalculation.costPerPlate} / Plat</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Food Subtotal ({guestCount} plates)</span>
                        <span className="font-mono text-gray-200">₹{menuCalculation.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Setup, Hospitality & Staff (10%)</span>
                        <span className="font-mono text-gray-200">₹{menuCalculation.serviceCharge.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-t border-emerald-500/10 pt-2 flex justify-between mt-2 font-bold text-sm">
                        <span className="text-emerald-400 uppercase tracking-wider text-xs">Estimated Event Budget</span>
                        <span className="font-mono text-lg text-emerald-400">
                          ₹{menuCalculation.grandTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Book Action */}
                    <button
                      onClick={handleCateringBooking}
                      disabled={menuCalculation.selectedCount === 0}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-[#070912] font-bold text-xs tracking-widest uppercase py-4 rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Submit Food Menu Inquiry</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            )}

            {activeSection === 'real_estate' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-sky-400">Salafi Realestate</span>
                  <h3 className="font-serif text-3xl font-bold text-white mt-1">
                    Premium Real Estate & Property Investments
                  </h3>
                  <p className="text-sm text-gray-400 font-sans mt-2 max-w-2xl font-light">
                    SGC Property and Land Developers offers verified, conflict-free, high-return residential lands, commercial development sites, retail office zones, and elegant houses across Srinagar. We ensure clean title transfers and transparent pricing.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Filters Bar Row */}
                  <div className="bg-[#111525] border border-sky-500/10 p-4 rounded-xl flex flex-wrap gap-4 justify-between items-center">
                    
                    <div className="flex items-center gap-2.5">
                      <Filter className="w-4 h-4 text-sky-400" />
                      <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Filter Properties:</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {['All', 'Commercial', 'Residential Sale', 'Residential Rental', 'Plot / Land'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedTypeFilter(type as any)}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-all duration-200 cursor-pointer ${
                            selectedTypeFilter === type
                              ? 'bg-sky-500 text-[#0d101a]'
                              : 'bg-[#151a2e] hover:bg-[#1a213b] text-gray-300 border border-white/5'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Max Budget:</span>
                      <select
                        value={maxPriceFilter}
                        onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                        className="bg-[#151a2e] border border-sky-500/20 text-sky-400 text-xs font-bold rounded px-2.5 py-1.5 outline-none"
                      >
                        <option value={500000}>Under ₹5 Lakhs (Rent)</option>
                        <option value={10000000}>Under ₹1 Crore</option>
                        <option value={20000000}>Under ₹2 Crore</option>
                        <option value={50000000}>Under ₹5 Crore</option>
                      </select>
                    </div>
                  </div>

                  {/* Listings Grids container */}
                  {filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProperties.map((prop) => (
                        <div
                          key={prop.id}
                          className="bg-[#111525] border border-white/5 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-sky-500/40 transition-colors"
                        >
                          <div>
                            {/* Listing Image */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <img
                                src={prop.image}
                                alt={prop.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute top-3 left-3 bg-sky-500 text-[#0d101a] text-[9px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
                                {prop.tag}
                              </div>
                            </div>

                            {/* Info */}
                            <div className="p-4 space-y-3">
                              <span className="text-[10px] text-sky-400 font-semibold tracking-wider block leading-none uppercase">
                                {prop.type}
                              </span>
                              <h5 className="font-serif text-base font-bold text-white group-hover:text-sky-400 transition-colors leading-snug">
                                {prop.title}
                              </h5>
                              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                                <span className="truncate">{prop.location}</span>
                              </div>

                              {/* Attributes */}
                              <div className="flex items-center gap-3 pt-2 text-[11px] text-gray-400 border-t border-sky-500/5">
                                <span className="flex items-center gap-1">
                                  <Maximize2 className="w-3.5 h-3.5 text-sky-500/80" /> {prop.area}
                                </span>
                                {prop.bedrooms && (
                                  <span className="flex items-center gap-1 border-l border-white/10 pl-3">
                                    <BedDouble className="w-3.5 h-3.5 text-sky-500/80" /> {prop.bedrooms} Bed
                                  </span>
                                )}
                                {prop.bathrooms && (
                                  <span className="flex items-center gap-1 border-l border-white/10 pl-3">
                                    <Bath className="w-3.5 h-3.5 text-sky-500/80" /> {prop.bathrooms} Bath
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Purchase Actions footer */}
                          <div className="p-4 pt-1 bg-[#0c101c] border-t border-white/5 flex items-center justify-between gap-4">
                            <span className="font-mono text-base font-bold text-emerald-400">
                              {prop.price}
                            </span>
                            <button
                              onClick={() => handlePropertyBooking(prop)}
                              className="bg-sky-500 hover:bg-sky-400 hover:shadow-lg hover:shadow-sky-500/10 text-[#0d101a] py-2 px-3.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                            >
                              <span>Inquire</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-[#111525] border border-dashed border-white/10 rounded-xl space-y-2">
                      <p className="text-base text-gray-300 font-bold">No Properties Found</p>
                      <p className="text-xs text-gray-500 max-w-xs mx-auto">Try selecting a different filter type or increase your budget range to view available plots.</p>
                      <button
                        onClick={() => { setSelectedTypeFilter('All'); setMaxPriceFilter(40000000); }}
                        className="text-xs text-sky-400 font-bold underline hover:text-sky-300 pt-2 block mx-auto"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer terms checklist */}
            <div className="mt-8 pt-5 border-t border-yellow-500/10 text-[10px] text-gray-500 flex flex-wrap gap-4 justify-between items-center">
              <span>SGC Corporate Group Verification Protocols in Effect Office: Lal Chowk, Kashmir.</span>
              <div className="flex gap-4">
                <span>Safe Locker Vaults</span>
                <span>Government Authorized Developer</span>
                <span>ISO 9001 Food Quality Certified</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
