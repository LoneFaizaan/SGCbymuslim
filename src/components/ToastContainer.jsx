import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, Loader2, X } from 'lucide-react';

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div 
      id="toast-container"
      className="fixed top-24 right-4 sm:right-6 md:right-8 z-[9999] flex flex-col gap-3 w-full max-w-[380px] pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const { message, type = 'success', description } = toast;

  // Icons and color definitions based on toast type
  let Icon = Info;
  let iconClass = 'text-blue-400';
  let borderClass = 'border-blue-900/40';
  let bgClass = 'bg-[#0f121d]/95';
  let titleClass = 'text-blue-100';

  if (type === 'success') {
    Icon = CheckCircle2;
    iconClass = 'text-green-400';
    borderClass = 'border-green-900/50';
    bgClass = 'bg-[#0b1011]/95';
    titleClass = 'text-green-500 font-semibold';
  } else if (type === 'syncing') {
    Icon = Loader2;
    iconClass = 'text-amber-400 animate-spin';
    borderClass = 'border-amber-900/40';
    bgClass = 'bg-[#11100e]/95';
    titleClass = 'text-amber-400 font-semibold';
  } else if (type === 'error') {
    Icon = AlertCircle;
    iconClass = 'text-red-400';
    borderClass = 'border-red-900/50';
    bgClass = 'bg-[#130b0b]/95';
    titleClass = 'text-red-400 font-semibold';
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto relative w-full flex items-start gap-3 p-4 rounded-xl border ${borderClass} ${bgClass} shadow-[0_8px_30px_rgb(0,0,0,0.5)] backdrop-blur-xl overflow-hidden`}
    >
      {/* Visual glowing highlight accent */}
      <div className={`absolute top-0 left-0 w-[3px] h-full ${
        type === 'success' ? 'bg-green-500' :
        type === 'syncing' ? 'bg-amber-500' :
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
      }`} />

      {/* Main content body */}
      <div className="flex-1 flex gap-3">
        <div className="mt-0.5 shrink-0">
          <Icon className={`w-5 h-5 ${iconClass}`} />
        </div>
        <div className="flex-1 flex flex-col gap-0.5">
          <h4 className={`text-sm font-medium ${titleClass}`}>
            {message}
          </h4>
          {description && (
            <p className="text-xs text-gray-400 font-normal leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Simple elegant Close Button */}
      <button 
        onClick={onClose}
        className="shrink-0 p-1 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all focus:outline-none pointer-events-auto"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Duration Visual Progress Bar */}
      <ProgressBar duration={toast.duration || 5000} type={type} />
    </motion.div>
  );
}

function ProgressBar({ duration, type }) {
  if (type === 'syncing') return null; // No auto-duration progress for active syncs

  let barBg = 'bg-blue-500/50';
  if (type === 'success') barBg = 'bg-green-500/50';
  if (type === 'error') barBg = 'bg-red-500/50';

  return (
    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={`h-full ${barBg}`}
      />
    </div>
  );
}
