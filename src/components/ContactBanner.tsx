import { useState, useImperativeHandle, forwardRef, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, Send, Sparkles, Building, 
  Mail, MessageSquare, ArrowRight, Check,
  AlertCircle
} from 'lucide-react';
import { Inquiry } from '../types';

interface ContactBannerProps {
  onSubmitInquiry: (inquiry: Omit<Inquiry, 'id' | 'date'>) => void;
  prefillMessage: string;
  prefillBusiness: 'gold' | 'catering' | 'real_estate' | 'general';
  onClearPrefills: () => void;
}

export interface ContactBannerRef {
  focusForm: () => void;
}

export default forwardRef<ContactBannerRef, ContactBannerProps>(function ContactBanner(
  { onSubmitInquiry, prefillMessage, prefillBusiness, onClearPrefills },
  ref
) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessSection, setBusinessSection] = useState<'gold' | 'catering' | 'real_estate' | 'general'>('general');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const formElementRef = useRef<HTMLDivElement>(null);

  // Expose focus/reveal action upwards
  useImperativeHandle(ref, () => ({
    focusForm: () => {
      setShowForm(true);
      if (prefillBusiness) {
        setBusinessSection(prefillBusiness);
      }
      if (prefillMessage) {
        setMessage(prefillMessage);
      }
      setTimeout(() => {
        formElementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    },
  }));

  const handleToggleForm = () => {
    setShowForm(!showForm);
    if (!showForm && prefillMessage) {
      setMessage(prefillMessage);
      setBusinessSection(prefillBusiness);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Please input your name.');
      return;
    }
    if (!phone.trim()) {
      setValidationError('Please input your phone number.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 8) {
      setValidationError('Please input a valid phone number.');
      return;
    }

    setIsSubmitting(true);

    // Simulate standard server-side submission
    setTimeout(() => {
      onSubmitInquiry({
        name,
        email: email || 'No email provided',
        phone,
        businessSection: prefillBusiness !== 'general' ? prefillBusiness : businessSection,
        message: prefillMessage || message || 'Requesting general information packet.'
      });

      setIsSubmitting(false);
      setSubmittedSuccess(true);
      
      // Cleanup inputs
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      onClearPrefills();
      
      setTimeout(() => {
        setSubmittedSuccess(false);
        setShowForm(false);
      }, 4000);
    }, 1200);
  };

  return (
    <section id="contact" className="py-20 bg-[#060608] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mockup matching banner frame */}
        <div className="relative text-left rounded-3xl overflow-hidden bg-[#0d0f17] border border-yellow-500/25 p-8 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
          {/* Ornate Gold Border Trims */}
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-[#d4af37] via-amber-500 to-[#d4af37]"></div>
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]/40 pointer-events-none"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]/40 pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Banner Left Header */}
            <div className="lg:col-span-5 flex items-start gap-4 flex-col sm:flex-row">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-yellow-500/10 border border-yellow-500/20 shadow-inner shrink-0 text-yellow-500">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <p className="text-yellow-500 font-serif text-sm tracking-wide font-medium leading-none">
                  Let&apos;s Build a Better Future Together
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                  Get in Touch with Us
                </h3>
                <p className="text-xs text-gray-400 font-light pr-4 leading-normal">
                  We are here to help and answer your questions. Reach out directly or submit your prompt below.
                </p>
              </div>
            </div>

            {/* Banner Center Contact Actions */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 divide-y sm:divide-y-0 lg:divide-y divide-yellow-500/10">
              {/* Call card */}
              <a 
                href="tel:7889434741" 
                className="flex items-center gap-3.5 group cursor-pointer text-left sm:pr-4"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-500/5 group-hover:bg-yellow-500/10 border border-yellow-500/10 group-hover:border-yellow-500/30 transition-colors shrink-0 text-yellow-500">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none block">Call Us</span>
                  <span className="font-sans font-bold text-base text-white group-hover:text-yellow-400 mt-1 block">7889 434 741</span>
                </div>
              </a>

              {/* Whatsapp card */}
              <a 
                href="https://wa.me/917889434741" 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3.5 group cursor-pointer text-left pt-4 sm:pt-0 lg:pt-4 sm:pl-4 lg:pl-0"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/5 group-hover:bg-emerald-500/10 border border-emerald-500/10 group-hover:border-emerald-500/30 transition-colors shrink-0 text-emerald-400">
                  👑
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none block">WhatsApp Us</span>
                  <span className="font-sans font-bold text-base text-white group-hover:text-emerald-400 mt-1 block">7889 434 741</span>
                </div>
              </a>
            </div>

            {/* Banner Right Button */}
            <div className="lg:col-span-3 flex justify-end">
              <button
                onClick={handleToggleForm}
                className="w-full sm:w-auto bg-[#d4af37] hover:bg-yellow-500 text-[#090b11] font-bold text-xs tracking-widest uppercase px-6 py-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)]"
              >
                <span>{showForm ? 'CLOSE FORM' : 'SEND MESSAGE'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Collapsible Form Panel */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              ref={formElementRef}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="bg-[#0c0e18] border border-yellow-500/15 rounded-2xl p-6 md:p-8 space-y-6">
                
                {/* Form header details */}
                <div className="flex items-center justify-between border-b border-yellow-500/10 pb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-yellow-500" />
                    <h4 className="font-serif text-lg font-bold text-white">Direct Advisory Message Channel</h4>
                  </div>
                  
                  {/* Alert Prefill Status */}
                  {prefillMessage && (
                    <span className="text-[10px] bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-3 py-1 font-bold rounded flex items-center gap-1.5 animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      Prefilled by selected business
                    </span>
                  )}
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  
                  {validationError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Name input */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#111425] border border-white/5 focus:border-yellow-500/50 rounded p-3 text-xs outline-none text-white transition-colors"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#111425] border border-white/5 focus:border-yellow-500/50 rounded p-3 text-xs outline-none text-white transition-colors"
                      />
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 7889 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#111425] border border-white/5 focus:border-yellow-500/50 rounded p-3 text-xs outline-none text-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Business selector row */}
                  {!prefillMessage && (
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Which business are you contacting? *</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { id: 'general' as const, label: 'General Corporate' },
                          { id: 'gold' as const, label: 'SGC Gold Services' },
                          { id: 'catering' as const, label: 'Salafiya Catering' },
                          { id: 'real_estate' as const, label: 'Salafi Realestate' },
                        ].map((division) => (
                          <button
                            key={division.id}
                            type="button"
                            onClick={() => setBusinessSection(division.id)}
                            className={`py-3 px-1.5 rounded text-xs font-bold transition-all border outline-none text-center cursor-pointer ${
                              businessSection === division.id
                                ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500'
                                : 'bg-[#111425] border-white/5 text-gray-400 hover:text-white'
                            }`}
                          >
                            {division.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text area message box */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Inquiry / Requirements *</label>
                    <textarea
                      rows={4}
                      required
                      disabled={!!prefillMessage}
                      placeholder="Write your custom messages, project scopes, wedding sizing or real estate location requests here..."
                      value={prefillMessage || message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#111425] border border-white/5 focus:border-yellow-500/50 disabled:opacity-60 disabled:cursor-not-allowed rounded p-3 text-xs outline-none text-white transition-colors resize-none"
                    />
                  </div>

                  {/* Form Submission Action Buttons */}
                  <div className="flex md:justify-end gap-3 pt-2">
                    {prefillMessage && (
                      <button
                        type="button"
                        onClick={onClearPrefills}
                        className="p-3 px-4 rounded text-xs font-bold tracking-wider text-gray-400 hover:text-white bg-white/5 transition-colors cursor-pointer"
                      >
                        Reset Form Form
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || submittedSuccess}
                      className="w-full md:w-auto bg-[#d4af37] hover:bg-yellow-500 disabled:opacity-55 text-[#070912] px-6 py-3.5 rounded font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>TRANSMITTING MESSAGE...</span>
                      ) : submittedSuccess ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-4 h-4 text-green-700" /> INQUIRY SAVED SUCCESS
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5" /> DISPATCH INQUIRY
                        </span>
                      )}
                    </button>
                  </div>

                </form>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
});
