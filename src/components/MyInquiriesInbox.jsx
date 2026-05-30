import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, Mail, Phone, Calendar, MessageSquare, Trash2, ClipboardCheck, 
  AlertCircle, CheckCheck
} from 'lucide-react';

export default function MyInquiriesInbox({ 
  isOpen, 
  onClose, 
  inquiries, 
  onDeleteInquiry,
  onUpdateInquiries
}) {
  
  const [displayedInquiries, setDisplayedInquiries] = useState(inquiries);

  useEffect(() => {
    setDisplayedInquiries(inquiries);
  }, [inquiries]);

  if (!isOpen) return null;

  const getBusinessLabel = (sect) => {
    switch (sect) {
      case 'gold': return { text: 'SGC Gold Quote', style: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
      case 'catering': return { text: 'Salafiya Catering Plan', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'real_estate': return { text: 'Realestate Deal', style: 'bg-sky-500/10 text-sky-400 border-sky-500/20' };
      default: return { text: 'General Corporate', style: 'bg-gray-500/10 text-gray-300 border-gray-500/20' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Black Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#060608]/85 backdrop-blur-sm cursor-pointer"
      />

      {/* Floating Side Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg h-full bg-[#0d101a] border-l border-yellow-500/15 shadow-[0_0_50px_rgba(0,0,0,0.85)] z-10 flex flex-col justify-between overflow-hidden"
      >
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-yellow-500/10 flex items-center justify-between bg-[#111525]">
          <div className="flex items-center gap-2.5 text-left">
            <ClipboardCheck className="w-5 h-5 text-yellow-500 animate-pulse" />
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Your Inquiries Inbox</h3>
              <p className="text-[10px] text-gray-400 font-light mt-0.5">Locally stored submissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-yellow-500 hover:text-[#060608] hover:rotate-90 transition-all duration-300 border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body List */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between text-left mb-2">
            <span className="text-[10px] font-sans font-bold text-gray-400 tracking-wider uppercase block">
              Inquiry Logs list ({displayedInquiries.length})
            </span>
          </div>

          {displayedInquiries.length > 0 ? (
            <div className="space-y-4">
              {displayedInquiries.map((inq) => {
                const label = getBusinessLabel(inq.businessSection);
                return (
                  <motion.div
                    key={inq.id}
                    layout
                    className="p-4 rounded-xl bg-[#111525] border border-white/5 space-y-3 relative text-left group hover:border-yellow-500/20 transition-all"
                  >
                    
                    {/* Delete action */}
                    <button
                      onClick={() => onDeleteInquiry(inq.id)}
                      className="absolute top-4 right-4 p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Delete log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Metadata tags */}
                    <div className="flex items-center gap-2 flex-wrap pr-5">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${label.style}`}>
                        {label.text}
                      </span>
                      <span className="text-[9px] text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {inq.date}
                      </span>
                    </div>

                    {/* Customer info */}
                    <div className="space-y-1 pt-1.5">
                      <h4 className="font-sans font-bold text-sm text-white">{inq.name}</h4>
                      <div className="flex flex-col gap-1 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-yellow-500/50" /> {inq.phone}
                        </span>
                        {inq.email && (
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-yellow-500/50" /> {inq.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content message block */}
                    <div className="bg-[#0b0e1b] rounded-lg p-3 text-xs text-gray-300 italic border-l-2 border-yellow-500/30 flex gap-2 items-start">
                      <MessageSquare className="w-3.5 h-3.5 text-yellow-500/40 mt-0.5 shrink-0" />
                      <p className="leading-relaxed whitespace-pre-line">{inq.message}</p>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/15 flex items-center justify-center animate-pulse">
                👑
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-white">Inbox is Empty</h4>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed font-light font-sans">
                  Submit a query through the contact form at the bottom, or use the Business Calculators to register immediate interest leads.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer helpful guides */}
        <div className="p-4 bg-[#111525] border-t border-yellow-500/10 text-[10px] text-gray-500 text-center">
          Persistently saved and registered in your client portal.
        </div>

      </motion.div>
    </div>
  );
}
