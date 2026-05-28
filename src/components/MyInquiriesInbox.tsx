import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, Mail, Phone, Calendar, MessageSquare, Trash2, ClipboardCheck, 
  FileSpreadsheet, LogIn, LogOut, CheckCircle, RotateCw, ExternalLink, 
  Link, AlertCircle, Sparkles, CheckCheck
} from 'lucide-react';
import { Inquiry } from '../types';
import { googleSignIn, logout, initAuth, loadInquiriesFromFirestore, saveInquiryToFirestore } from '../lib/firebase';
import { 
  createLeadsSpreadsheet, 
  appendInquiriesToSpreadsheet, 
  verifySpreadsheetAccess 
} from '../lib/googleSheets';
import { sendInquiryEmail } from '../lib/gmail';

interface MyInquiriesInboxProps {
  isOpen: boolean;
  onClose: () => void;
  inquiries: Inquiry[];
  onDeleteInquiry: (id: string) => void;
  onUpdateInquiries: (updated: Inquiry[]) => void;
}

export default function MyInquiriesInbox({ 
  isOpen, 
  onClose, 
  inquiries, 
  onDeleteInquiry,
  onUpdateInquiries
}: MyInquiriesInboxProps) {
  
  // Core Google Sheets state management
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [spreadsheetId, setSpreadsheetId] = useState(() => localStorage.getItem('sgc_leads_spreadsheet_id') || '');
  const [spreadsheetUrl, setSpreadsheetUrl] = useState(() => localStorage.getItem('sgc_leads_spreadsheet_url') || '');
  
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [manualIdInput, setManualIdInput] = useState('');
  const [isTestingAccess, setIsTestingAccess] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Wire up the authentication listener
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, [isOpen]);

  // Load inquiries from Firestore cloud database when authenticated as admin
  useEffect(() => {
    if (!token || needsAuth || !isOpen) return;

    let active = true;
    const fetchFirestoreInquiries = async () => {
      try {
        const firestoreInquiries = await loadInquiriesFromFirestore();
        if (!active || !firestoreInquiries) return;
        
        // Merge with local state to ensure complete synchronization
        const mergedMap = new Map<string, Inquiry>();
        
        // Populate local state leads first
        inquiries.forEach(inq => mergedMap.set(inq.id, inq));
        
        // Merge/overwrite with Firestore cloud leads
        firestoreInquiries.forEach(inq => {
          const existing = mergedMap.get(inq.id);
          mergedMap.set(inq.id, {
            ...inq,
            syncedToSheets: inq.syncedToSheets || existing?.syncedToSheets || false
          });
        });
        
        const sorted = Array.from(mergedMap.values()).sort((a, b) => b.id.localeCompare(a.id));
        
        // Only run callback if there are structural differences to avoid infinite loops
        const countsDiffer = sorted.length !== inquiries.length;
        const matchesDiffer = !countsDiffer && sorted.some((item, i) => 
          item.id !== inquiries[i]?.id || item.syncedToSheets !== inquiries[i]?.syncedToSheets
        );
        
        if (countsDiffer || matchesDiffer) {
          onUpdateInquiries(sorted);
        }
      } catch (err) {
        console.warn('Could not load inquiries from Firestore database (operator check):', err);
      }
    };
    
    fetchFirestoreInquiries();
    return () => {
      active = false;
    };
  }, [token, needsAuth, isOpen, onUpdateInquiries]);

  if (!isOpen) return null;

  const unsyncedLeads = inquiries.filter(inq => !inq.syncedToSheets);

  // Authentication flows
  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setFeedbackMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        setFeedbackMsg({ type: 'success', text: `Authorized successfully as ${result.user.email}!` });
      }
    } catch (err: any) {
      console.error(err);
      setFeedbackMsg({ type: 'error', text: err.message || 'Google authentication interrupted.' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogOut = async () => {
    setFeedbackMsg(null);
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setFeedbackMsg({ type: 'success', text: 'Signed out of Google Workspace Services.' });
    } catch (err: any) {
      console.error(err);
    }
  };

  // Google Sheets integration logic
  const handleCreateSheet = async () => {
    if (!token) return;
    setIsCreatingSheet(true);
    setFeedbackMsg(null);
    try {
      const info = await createLeadsSpreadsheet(token);
      setSpreadsheetId(info.spreadsheetId);
      setSpreadsheetUrl(info.spreadsheetUrl);
      localStorage.setItem('sgc_leads_spreadsheet_id', info.spreadsheetId);
      localStorage.setItem('sgc_leads_spreadsheet_url', info.spreadsheetUrl);
      setFeedbackMsg({ 
        type: 'success', 
        text: 'Created "SGC Business Leads & Customer Inquiries" spreadsheet in your Google Sheets successfully!' 
      });
    } catch (err: any) {
      console.error(err);
      setFeedbackMsg({ 
        type: 'error', 
        text: err.message || 'Could not auto-create the spreadsheet.' 
      });
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleLinkExisting = async () => {
    if (!token || !manualIdInput.trim()) return;
    setIsTestingAccess(true);
    setFeedbackMsg(null);
    try {
      let extractedId = manualIdInput.trim();
      // Parse entire Sheets URL if the admin pasted the browser URL
      if (extractedId.includes('/d/')) {
        const parts = extractedId.split('/d/');
        if (parts[1]) {
          extractedId = parts[1].split('/')[0];
        }
      }

      const hasAccess = await verifySpreadsheetAccess(token, extractedId);
      if (hasAccess) {
        const url = `https://docs.google.com/spreadsheets/d/${extractedId}/edit`;
        setSpreadsheetId(extractedId);
        setSpreadsheetUrl(url);
        localStorage.setItem('sgc_leads_spreadsheet_id', extractedId);
        localStorage.setItem('sgc_leads_spreadsheet_url', url);
        setFeedbackMsg({ type: 'success', text: 'Spreadsheet linked and verified successfully!' });
        setManualIdInput('');
        setShowManualInput(false);
      } else {
        setFeedbackMsg({ 
          type: 'error', 
          text: 'Unable to verify spreadsheet ID. Verify sharing permissions or spreadsheet ID correctness.' 
        });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: 'Failed to access Google Sheets API.' });
    } finally {
      setIsTestingAccess(false);
    }
  };

  const handleUnlinkSheet = () => {
    const isConfirmed = window.confirm(
      'Unlink the current spreadsheet? This will not delete the file from your Google Drive storage but SGC inquiries will stop syncing to it.'
    );
    if (isConfirmed) {
      setSpreadsheetId('');
      setSpreadsheetUrl('');
      localStorage.removeItem('sgc_leads_spreadsheet_id');
      localStorage.removeItem('sgc_leads_spreadsheet_url');
      setFeedbackMsg({ type: 'success', text: 'Spreadsheet connection unlinked.' });
    }
  };

  const handleSyncPending = async () => {
    if (!token || !spreadsheetId) return;
    if (unsyncedLeads.length === 0) {
      setFeedbackMsg({ type: 'success', text: 'No pending inquiries left to sync.' });
      return;
    }

    setIsSyncing(true);
    setFeedbackMsg(null);
    try {
      // Append rows to Google Sheet
      await appendInquiriesToSpreadsheet(token, spreadsheetId, unsyncedLeads);

      // Deliver Gmail notifications for each unsynced lead to the admin email
      let emailSuccessCount = 0;
      let emailFailCount = 0;
      for (const lead of unsyncedLeads) {
        try {
          await sendInquiryEmail(token, 'muslimnazirlonekmr@gmail.com', lead);
          emailSuccessCount++;
        } catch (emailErr) {
          console.error(`Failed to send email for lead ${lead.id}:`, emailErr);
          emailFailCount++;
        }
      }

      // Sync state back to Firestore cloud database
      for (const lead of unsyncedLeads) {
        try {
          await saveInquiryToFirestore({ ...lead, syncedToSheets: true });
        } catch (dbErr) {
          console.error(`Failed to record synced flag in Firestore for lead ${lead.id}:`, dbErr);
        }
      }

      // Map local state to show synced indicators
      const updated = inquiries.map((inq) => {
        if (!inq.syncedToSheets) {
          return { ...inq, syncedToSheets: true };
        }
        return inq;
      });

      onUpdateInquiries(updated);
      
      const emailStatusText = emailFailCount === 0 
        ? 'and delivered email alerts to muslimnazirlonekmr@gmail.com successfully!' 
        : `with some Gmail alerts failing (sent: ${emailSuccessCount}, failed: ${emailFailCount}).`;

      setFeedbackMsg({ 
        type: 'success', 
        text: `Successfully synced ${unsyncedLeads.length} lead(s) to Google Sheets ${emailStatusText}` 
      });
    } catch (err: any) {
      console.error(err);
      setFeedbackMsg({ 
        type: 'error', 
        text: err.message || 'Failed to sync rows. Try re-signing in.' 
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getBusinessLabel = (sect: Inquiry['businessSection']) => {
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
              <p className="text-[10px] text-gray-400 font-light mt-0.5">Locally stored submissions and Google Sheets Syncing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-yellow-500 hover:text-[#060608] hover:rotate-90 transition-all duration-300 border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Google Sheets Live Integration Console */}
        <div className="bg-[#101424] border-b border-yellow-500/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-widest font-sans">
              <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-400" />
              <span>Google Sheets Integration</span>
            </div>
            
            {user ? (
              <div className="flex items-center gap-2 text-left">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Google avatar" className="w-5 h-5 rounded-full border border-yellow-500/30" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-yellow-500 text-slate-900 text-[10px] flex items-center justify-center font-bold">G</div>
                )}
                <span className="text-[10px] font-bold text-emerald-400 font-mono truncate max-w-[130px]">{user.email}</span>
                <button 
                  onClick={handleLogOut} 
                  title="Disconnect account"
                  className="p-1 rounded bg-red-500/10 hover:bg-red-500 hover:text-white transition-all text-red-400 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span className="text-[9px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">OFFLINE</span>
            )}
          </div>

          {/* Feedback messages */}
          {feedbackMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg text-xs flex gap-2 items-start text-left ${
                feedbackMsg.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {feedbackMsg.type === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
              <span className="leading-normal">{feedbackMsg.text}</span>
            </motion.div>
          )}

          {/* Core Controls */}
          {needsAuth ? (
            <div className="p-4 bg-[#0a0d18] border border-white/5 rounded-xl text-center space-y-3">
              <p className="text-[11px] text-gray-400 font-light max-w-sm mx-auto leading-relaxed">
                Connect your official Google account to automatically construct, link, and sync customer inquiries on-the-fly to a dedicated spreadsheet.
              </p>
              
              {/* Material Google Button */}
              <div className="flex justify-center pt-1.5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoggingIn}
                  className="relative flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow transition-all duration-300 text-gray-800 hover:bg-gray-50 active:bg-gray-100 cursor-pointer w-full font-sans font-semibold text-sm max-w-xs"
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4.5 h-4.5 shrink-0">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 font-sans">
              {/* Linked sheet display */}
              {spreadsheetId ? (
                <div className="p-3.5 bg-[#0a0d18] border border-emerald-500/25 rounded-xl space-y-3 text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider block w-max">CONNECTED</span>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mt-1.5">
                        SGC Business Leads & Customer Inquiries
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate max-w-[280px]">ID: {spreadsheetId}</p>
                    </div>
                    
                    <a 
                      href={spreadsheetUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-[#060608] transition-all flex items-center justify-center shrink-0 border border-yellow-500/10"
                      title="Open Google Sheet"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-white/[0.03]">
                    <button
                      onClick={handleSyncPending}
                      disabled={isSyncing || inquiries.length === 0}
                      className="flex-1 py-2 px-3 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isSyncing ? (
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RotateCw className="w-3.5 h-3.5" />
                      )}
                      <span>Sync {unsyncedLeads.length} Lead{unsyncedLeads.length !== 1 && 's'}</span>
                    </button>
                    <button
                      onClick={handleUnlinkSheet}
                      className="py-2 px-3 rounded bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Unlink
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#0a0d18] border border-white/5 rounded-xl text-center space-y-4">
                  <p className="text-[11px] text-gray-400 font-light max-w-sm mx-auto leading-relaxed">
                    Choose an setup alternative below to link a spreadsheet to sync customer inquiries.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    {/* Create Button */}
                    <button
                      onClick={handleCreateSheet}
                      disabled={isCreatingSheet}
                      className="flex-1 py-3 px-3 bg-yellow-500 shadow-md hover:bg-yellow-400 text-slate-950 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
                    >
                      {isCreatingSheet ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>Auto Create Sheet</span>
                    </button>

                    {/* Show manual input slide toggler */}
                    <button
                      onClick={() => setShowManualInput(!showManualInput)}
                      className="py-3 px-3.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      <Link className="w-3.5 h-3.5" />
                      <span>{showManualInput ? 'Cancel' : 'Link Custom'}</span>
                    </button>
                  </div>

                  {/* Manual sheet configuration picker */}
                  {showManualInput && (
                    <motion.div 
                      initial={{ scaleY: 0.9, opacity: 0 }} 
                      animate={{ scaleY: 1, opacity: 1 }}
                      className="pt-3 border-t border-white/[0.04] space-y-2 text-left"
                    >
                      <label className="text-[10px] font-bold text-gray-400 tracking-wider block uppercase">Google Spreadsheet ID or Browser URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={manualIdInput}
                          onChange={(e) => setManualIdInput(e.target.value)}
                          placeholder="https://docs.google.com/spreadsheets/d/your-id-here/edit"
                          className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500/40"
                        />
                        <button
                          onClick={handleLinkExisting}
                          disabled={isTestingAccess || !manualIdInput.trim()}
                          className="px-4 py-2 bg-white/10 hover:bg-yellow-500 hover:text-[#060608] text-white rounded text-xs font-bold disabled:opacity-40 shrink-0 transition-colors"
                        >
                          {isTestingAccess ? 'Testing...' : 'Verify'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Body List */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between text-left mb-2">
            <span className="text-[10px] font-sans font-bold text-gray-400 tracking-wider uppercase block">
              Inquiry Logs list ({inquiries.length})
            </span>
            {inquiries.length > 0 && unsyncedLeads.length > 0 && token && spreadsheetId && (
              <button 
                onClick={handleSyncPending}
                disabled={isSyncing}
                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync {unsyncedLeads.length} Pending</span>
              </button>
            )}
          </div>

          {inquiries.length > 0 ? (
            <div className="space-y-4">
              {inquiries.map((inq) => {
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
                      
                      {/* Sync status indicator */}
                      {inq.syncedToSheets ? (
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded flex items-center gap-1 font-sans">
                          <CheckCheck className="w-3 h-3 shrink-0" />
                          <span>Synced to Spreadsheet</span>
                        </span>
                      ) : (
                        <span className="text-[9px] bg-yellow-500/5 text-yellow-500/70 border border-yellow-500/15 px-1.5 py-0.5 rounded flex items-center gap-1 font-sans">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>Pending Sheets Sync</span>
                        </span>
                      )}
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
          Persist and sync official inquiry lead submissions directly using Google App APIs.
        </div>

      </motion.div>
    </div>
  );
}
