import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Mail, Phone, Calendar, MessageSquare, Trash2, ClipboardCheck, 
  FileSpreadsheet, LogIn, LogOut, CheckCircle, RotateCw, ExternalLink, 
  Link, AlertCircle, Sparkles, CheckCheck, Eye, EyeOff, Search, Filter, 
  Download, FileText, Check, Save, ArrowLeft, Building, HelpCircle, HardDrive
} from 'lucide-react';
import { googleSignIn, logout, initAuth, saveInquiryToFirestore, testRtdbConnections } from '../lib/firebase';
import { 
  createLeadsSpreadsheet, 
  appendInquiriesToSpreadsheet, 
  verifySpreadsheetAccess 
} from '../lib/googleSheets';
import { sendInquiryEmail } from '../lib/gmail';

export default function CompanyAdminDashboard({
  isOpen,
  onClose,
  inquiries,
  onDeleteInquiry,
  onUpdateInquiries
}) {

  // Login authentication state
  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return sessionStorage.getItem('sgc_admin_authorized') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Core Google Sheets state management
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [spreadsheetId, setSpreadsheetId] = useState(() => localStorage.getItem('sgc_leads_spreadsheet_id') || '');
  const [spreadsheetUrl, setSpreadsheetUrl] = useState(() => localStorage.getItem('sgc_leads_spreadsheet_url') || '');

  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [manualIdInput, setManualIdInput] = useState('');
  const [isTestingAccess, setIsTestingAccess] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Realtime Database diagnostic state
  const [rtdbTests, setRtdbTests] = useState([]);
  const [isTestingRtdb, setIsTestingRtdb] = useState(false);

  // Auto-run RTDDB diagnostics on load
  const runRtdbDiagnostics = async () => {
    setIsTestingRtdb(true);
    try {
      const res = await testRtdbConnections();
      setRtdbTests(res);
    } catch (e) {
      console.error('Failed to run RTDDB diagnostics', e);
    } finally {
      setIsTestingRtdb(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdminAuth) {
      runRtdbDiagnostics();
    }
  }, [isOpen, isAdminAuth]);

  // Filter & search states
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('all');
  const [syncFilter, setSyncFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected Inquiry for Detail Inspector
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [adminNotesText, setAdminNotesText] = useState('');

  // Wire up the Google Workspace authentication listener
  useEffect(() => {
    if (!isOpen || !isAdminAuth) return;

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
  }, [isOpen, isAdminAuth]);

  if (!isOpen) return null;

  // Handle credentials authentication for Mubashir Lone
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const formattedUser = usernameInput.trim().toUpperCase();
    const cleanPassword = passwordInput.trim();

    if (formattedUser === 'MUBASHIRLONE' && cleanPassword === 'MUBASHIR@90') {
      setIsAdminAuth(true);
      sessionStorage.setItem('sgc_admin_authorized', 'true');
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setLoginError('Invalid Administrator credentials. Please verify username and passcode.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuth(false);
    sessionStorage.removeItem('sgc_admin_authorized');
  };

  // Google Workspace Authentication flows (GSheets, Gmail)
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
    } catch (err) {
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
    } catch (err) {
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
        text: 'Successfully constructed "SGC Business Leads & Customer Inquiries" in Google Sheets!' 
      });
    } catch (err) {
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
        setFeedbackMsg({ type: 'success', text: 'Google Spreadsheet verified and linked successfully!' });
        setManualIdInput('');
        setShowManualInput(false);
      } else {
        setFeedbackMsg({ 
          type: 'error', 
          text: 'Unable to access sheet. Verify sharing and permission settings or ID structure.' 
        });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'Failed to communicate with Google Sheets API.' });
    } finally {
      setIsTestingAccess(false);
    }
  };

  const handleUnlinkSheet = () => {
    const isConfirmed = window.confirm(
      'Unlink the current spreadsheet? This does not delete any files from your Google Drive but stops automatic inquiry syncing.'
    );
    if (isConfirmed) {
      setSpreadsheetId('');
      setSpreadsheetUrl('');
      localStorage.removeItem('sgc_leads_spreadsheet_id');
      localStorage.removeItem('sgc_leads_spreadsheet_url');
      setFeedbackMsg({ type: 'success', text: 'Spreadsheet connection unlinked.' });
    }
  };

  const handleSyncPendingLeads = async () => {
    if (!token || !spreadsheetId) return;
    
    const unsyncedLeads = inquiries.filter(inq => !inq.syncedToSheets);
    if (unsyncedLeads.length === 0) {
      setFeedbackMsg({ type: 'success', text: 'All inquiries are already synced.' });
      return;
    }

    setIsSyncing(true);
    setFeedbackMsg(null);
    try {
      // Direct write to the designated spreadsheet
      await appendInquiriesToSpreadsheet(token, spreadsheetId, unsyncedLeads);

      // Email notifications
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

      // Mark local state & prop callback
      const updated = inquiries.map((inq) => {
        if (!inq.syncedToSheets) {
          return { ...inq, syncedToSheets: true };
        }
        return inq;
      });

      onUpdateInquiries(updated);
      
      const emailText = emailFailCount === 0 
        ? 'and delivered email alerts to muslimnazirlonekmr@gmail.com successfully!'
        : `with some Gmail alerts failing (sent: ${emailSuccessCount}, failed: ${emailFailCount}).`;

      setFeedbackMsg({ 
        type: 'success', 
        text: `Successfully synced ${unsyncedLeads.length} lead(s) to Google Sheets ${emailText}` 
      });
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ 
        type: 'error', 
        text: err.message || 'Failed to sync rows. Try re-signing into your Google account.' 
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Helper labels & styling mappings
  const getBusinessLabel = (sect) => {
    switch (sect) {
      case 'gold': return { text: 'SGC Gold Quote', style: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/25' };
      case 'catering': return { text: 'Salafiya Catering', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' };
      case 'real_estate': return { text: 'Salafi Real Estate', style: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25' };
      default: return { text: 'General SGC', style: 'bg-gray-500/10 text-gray-300 border-gray-500/25' };
    }
  };

  const getStatusLabelAndStyles = (status) => {
    const activeStatus = status || 'new';
    switch (activeStatus) {
      case 'new': return { text: 'New Appointment', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/25 animate-pulse' };
      case 'contacted': return { text: 'In Touch', color: 'text-blue-400 bg-blue-500/10 border-blue-500/25' };
      case 'processed': return { text: 'Processed / Deal Closed', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' };
      case 'declined': return { text: 'Declined / Archival', color: 'text-gray-400 bg-gray-500/10 border-gray-500/25' };
      default: return { text: 'New Appointment', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/25' };
    }
  };

  // Update status or notes for an inquiry both locally and in parent
  const handleUpdateInquiryField = async (id, updatedFields) => {
    const target = inquiries.find(i => i.id === id);
    if (!target) return;

    const merged = { ...target, ...updatedFields };

    const updated = inquiries.map(inq => {
      if (inq.id === id) {
        return merged;
      }
      return inq;
    });

    onUpdateInquiries(updated);

    // If matching active inspector, sync details
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry(merged);
    }

    // Save notes or status updates direct to Firestore database
    try {
      await saveInquiryToFirestore(merged);
    } catch (err) {
      console.error('Failed to update inquiry state in Firestore:', err);
    }
  };

  // Single-customer detail modal inspector trigger
  const openInquiryInspector = (inq) => {
    setSelectedInquiry(inq);
    setAdminNotesText(inq.adminNotes || '');
  };

  const saveAdminNotesOfInquiry = () => {
    if (!selectedInquiry) return;
    handleUpdateInquiryField(selectedInquiry.id, { adminNotes: adminNotesText });
    setFeedbackMsg({ type: 'success', text: `Saved notes for customer ${selectedInquiry.name} successfully.` });
  };

  // Download individual customer detailed summary file
  const downloadSingleCustomerReport = (inq) => {
    const reportHeadline = `=== SALAFIYA GROUP OF COMPANIES - CUSTOMER DETAIL REPORT ===\n`;
    const reportData = [
      `Inquiry ID:          ${inq.id}`,
      `Submited On (IST):   ${inq.date}`,
      `Client Full Name:    ${inq.name}`,
      `Email Address:       ${inq.email || 'N/A'}`,
      `Phone Number:        ${inq.phone}`,
      `Business Division:   ${getBusinessLabel(inq.businessSection).text}`,
      `Google Sync Status:  ${inq.syncedToSheets ? "Synced in Excel Spreadsheet" : "Pending Sheets Sync (Local DB only)"}`,
      `Lead Triage Status:  ${(inq.status || 'new').toUpperCase()}`,
      `\n--- BUSINESS ADVISORY REQUIREMENTS & MESSAGE ---`,
      `${inq.message}`,
      `\n--- INTERNAL ADMINISTRATIVE NOTES ---`,
      `${inq.adminNotes || 'No notes currently recorded by admin.'}\n`
    ].join('\n');

    const combinedBlob = new Blob([reportHeadline + reportData], { type: 'text/plain;charset=utf-8' });
    const localUrl = URL.createObjectURL(combinedBlob);
    
    const clickTrigger = document.createElement('a');
    clickTrigger.href = localUrl;
    clickTrigger.download = `SGC_Lead_Report_${inq.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(clickTrigger);
    clickTrigger.click();
    document.body.removeChild(clickTrigger);
    URL.revokeObjectURL(localUrl);
  };

  // Download Company-wide Consolidated spreadsheet as CSV file (excel compatible)
  const downloadConsolidatedSpreadsheet = () => {
    if (inquiries.length === 0) {
      alert('No data points to compile into Excel spreadsheet.');
      return;
    }

    // Wrap elements with commas in quotes
    const formatCSVField = (val) => {
      if (!val) return '""';
      const cleanVal = val.replace(/"/g, '""');
      return `"${cleanVal}"`;
    };

    const csvHeaders = [
      'Inquiry ID',
      'Date & Time (IST)',
      'Customer Name',
      'Email Address',
      'Phone Number',
      'Business Division',
      'Customer Message/Requirements',
      'Google Sheets Synced?',
      'Admin Status',
      'Administrative Notes'
    ].join(',');

    const csvRows = inquiries.map(inq => {
      return [
        formatCSVField(inq.id),
        formatCSVField(inq.date),
        formatCSVField(inq.name),
        formatCSVField(inq.email || ''),
        formatCSVField(inq.phone),
        formatCSVField(getBusinessLabel(inq.businessSection).text),
        formatCSVField(inq.message),
        formatCSVField(inq.syncedToSheets ? 'YES' : 'NO'),
        formatCSVField(inq.status || 'new'),
        formatCSVField(inq.adminNotes || '')
      ].join(',');
    });

    const csvContent = '\uFEFF' + [csvHeaders, ...csvRows].join('\n'); // UTF-8 BOM indicator for Microsoft Excel support
    const compiledBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const localUrl = URL.createObjectURL(compiledBlob);

    const clickTrigger = document.createElement('a');
    clickTrigger.href = localUrl;
    clickTrigger.download = `SGC_Business_Leads_Consolidated_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(clickTrigger);
    clickTrigger.click();
    document.body.removeChild(clickTrigger);
    URL.revokeObjectURL(localUrl);
  };

  // Raw JSON Backup downloadeer
  const downloadJSONBackup = () => {
    const jsonStr = JSON.stringify(inquiries, null, 2);
    const compiledBlob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const localUrl = URL.createObjectURL(compiledBlob);

    const clickTrigger = document.createElement('a');
    clickTrigger.href = localUrl;
    clickTrigger.download = `SGC_System_Backup_Inquiries_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(clickTrigger);
    clickTrigger.click();
    document.body.removeChild(clickTrigger);
    URL.revokeObjectURL(localUrl);
  };

  // Filter application pipeline
  const filteredInquiries = inquiries.filter(inq => {
    // 1. Text Search matching
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      inq.name.toLowerCase().includes(searchLower) ||
      inq.phone.toLowerCase().includes(searchLower) ||
      (inq.email && inq.email.toLowerCase().includes(searchLower)) ||
      inq.message.toLowerCase().includes(searchLower) ||
      inq.id.toLowerCase().includes(searchLower);

    // 2. Division filter Matcher
    const matchesDivision = divisionFilter === 'all' || inq.businessSection === divisionFilter;

    // 3. Sync state filter Matcher
    const matchesSync = syncFilter === 'all' || 
      (syncFilter === 'synced' && inq.syncedToSheets) ||
      (syncFilter === 'pending' && !inq.syncedToSheets);

    // 4. Custom Status status Matcher
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'new' && (!inq.status || inq.status === 'new')) ||
      inq.status === statusFilter;

    return matchesSearch && matchesDivision && matchesSync && matchesStatus;
  });

  // Calculate stats parameters
  const totalLeadsCount = inquiries.length;
  const pendingSyncCount = inquiries.filter(inq => !inq.syncedToSheets).length;
  const syncedCount = inquiries.filter(inq => inq.syncedToSheets).length;
  const goldCount = inquiries.filter(inq => inq.businessSection === 'gold').length;
  const cateringCount = inquiries.filter(inq => inq.businessSection === 'catering').length;
  const realEstateCount = inquiries.filter(inq => inq.businessSection === 'real_estate').length;
  const generalCount = inquiries.filter(inq => inq.businessSection === 'general').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#060810] flex flex-col min-h-screen">
      
      {/* Upper Status/Notification Bar */}
      <div className="bg-[#0b0e19] border-b border-yellow-500/10 px-4 py-2 flex justify-between items-center text-xs font-mono select-none">
        <div className="flex items-center gap-2 text-yellow-500">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping"></span>
          <span>SGC SECURE ADMIN GATEWAY</span>
        </div>
        <div className="text-gray-400 hidden sm:block">
          ADMIN CONSOLE: <strong>{isAdminAuth ? 'MUBASHIRLONE (ACTIVE)' : 'ANONYMOUS'}</strong>
        </div>
      </div>

      {/* Main Container workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-start">
        
        {/* LOGIN GATE */}
        <AnimatePresence mode="wait">
          {!isAdminAuth ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full mx-auto my-auto bg-[#0d111d] rounded-2xl border border-yellow-500/20 shadow-[0_0_50px_rgba(234,179,8,0.08)] overflow-hidden"
            >
              {/* Luxury header */}
              <div className="p-8 bg-[#101525] border-b border-yellow-500/10 text-center relative">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-14 h-14 rounded-full border border-yellow-500/30 bg-yellow-500/5 mx-auto flex items-center justify-center mb-4">
                  <span className="text-xl">👑</span>
                </div>

                <h2 className="font-serif text-2xl font-black tracking-wide text-yellow-500">SALAFIYA GROUP</h2>
                <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mt-1 font-sans font-light">Central Administrative Vault</p>
              </div>

              {/* Login Credentials Form form */}
              <form onSubmit={handleAdminLogin} className="p-8 space-y-5 text-left">
                {loginError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-xs text-red-400 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Administrator Username</label>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter Username"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
                  />
                  <span className="text-[9px] text-gray-500 italic block">Default: MUBASHIRLONE</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Passcode Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter Passcode"
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[9px] text-gray-500 italic block">Default: MUBASHIR@90</span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-extrabold text-xs tracking-widest uppercase rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Authenticate Console</span>
                  </button>
                </div>
              </form>

              <div className="p-4 bg-black/20 text-center border-t border-white/[0.03]">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-yellow-500/70 hover:text-yellow-500 flex items-center gap-1 mx-auto transition-colors font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Public Website</span>
                </button>
              </div>

            </motion.div>
          ) : (
            
            // ADMIN WORKSPACE DASHBOARD VIEWS
            <motion.div
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Dashboard header controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs">ADMIN</span>
                    <h1 className="font-serif text-3xl font-black text-white tracking-tight">SGC Group Dashboard</h1>
                  </div>
                  <p className="text-xs text-gray-400 font-sans">
                    View customer inquiries, manage appointments, and synchronize data safely to Google Sheets & Gmail pipelines.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* CSV Export Excel excel sheet button */}
                  <button
                    onClick={downloadConsolidatedSpreadsheet}
                    className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/10"
                    title="Generate a fully styled CSV table spreadsheet"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Excel file</span>
                  </button>

                  <button
                    onClick={downloadJSONBackup}
                    className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10"
                    title="Export backup in raw JSON structure"
                  >
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    <span>Download JSON</span>
                  </button>

                  {/* Log Out */}
                  <button
                    onClick={handleAdminLogout}
                    className="py-2.5 px-3 hover:bg-red-500/10 text-red-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-red-500/15"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout Admin</span>
                  </button>

                  {/* Return home link toggler */}
                  <button
                    onClick={onClose}
                    className="py-2.5 px-3 bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-slate-950 rounded-lg text-xs font-bold transition-all border border-yellow-500/20 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Portal</span>
                  </button>
                </div>
              </div>

              {/* STATS BREAKDOWN GRID PANEL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Stats widget total */}
                <div className="p-5 rounded-2xl bg-[#0e111d] border border-white/5 flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center text-lg border border-yellow-500/15">
                    👑
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-sans block">Total Leads Logged</span>
                    <h3 className="font-sans text-2xl font-black text-white mt-0.5">{totalLeadsCount}</h3>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">SGC Corporate Wide</div>
                  </div>
                </div>

                {/* Stat Pending Sheets Sync */}
                <div className="p-5 rounded-2xl bg-[#0e111d] border border-white/5 flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center text-lg border border-orange-500/15">
                    <RotateCw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-sans block">Pending Sync</span>
                    <h3 className="font-sans text-2xl font-black text-orange-400 mt-0.5">{pendingSyncCount}</h3>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">Awaiting Sheet insertion</div>
                  </div>
                </div>

                {/* Stat Synced */}
                <div className="p-5 rounded-2xl bg-[#0e111d] border border-white/5 flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg border border-emerald-500/15">
                    <CheckCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-sans block">Spreadsheet Synced</span>
                    <h3 className="font-sans text-2xl font-black text-emerald-400 mt-0.5">{syncedCount}</h3>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">Inserted in Google Excel</div>
                  </div>
                </div>

                {/* Division Breakdown Metrics Bar */}
                <div className="p-4 rounded-2xl bg-[#0e111d] border border-white/5 text-left flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 font-sans">Divisional Distribution</span>
                    <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 rounded px-1.5 py-0.5" title="Connected to Google Firebase Realtime Database">
                      <span className="w-1 h-1 rounded-full bg-yellow-500 animate-pulse shrink-0"></span>
                      <span className="text-[8px] font-mono font-bold text-yellow-500 uppercase tracking-widest">RTDDB LIVE</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                      <span className="text-yellow-500 font-bold">Gold Request:</span>
                      <span className="text-white">{goldCount} ({totalLeadsCount > 0 ? Math.round((goldCount / totalLeadsCount) * 100) : 0}%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                      <span className="text-emerald-400 font-semibold">Catering Booking:</span>
                      <span className="text-white">{cateringCount} ({totalLeadsCount > 0 ? Math.round((cateringCount / totalLeadsCount) * 100) : 0}%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                      <span className="text-indigo-400">Real Estate Deal:</span>
                      <span className="text-white">{realEstateCount} ({totalLeadsCount > 0 ? Math.round((realEstateCount / totalLeadsCount) * 100) : 0}%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                      <span className="text-gray-400">General Corp:</span>
                      <span className="text-white">{generalCount} ({totalLeadsCount > 0 ? Math.round((generalCount / totalLeadsCount) * 100) : 0}%)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* GOOGLE SHEETS LIVE CLOUD SYNC CONTROL UNIT */}
              <div className="bg-[#101424] border border-yellow-500/15 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-left">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-200 uppercase tracking-widest font-sans">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                      <span>Cloud Integration Portal (Google Sheets & Gmail alert Engine)</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 font-sans">
                      Provides authentication context for syncing client leads dynamically and executing appointment alert deliveries.
                    </p>
                  </div>

                  {user ? (
                    <div className="flex items-center gap-2 text-left shrink-0 bg-emerald-500/5 px-3 py-1.5 border border-emerald-500/20 rounded-xl">
                      {user.photoURL && (
                        <img src={user.photoURL} alt="Google avatar" className="w-5 h-5 rounded-full border border-yellow-500/30" referrerPolicy="no-referrer" />
                      )}
                      <div className="leading-tight">
                        <span className="text-[10px] font-bold text-emerald-400 font-mono block truncate max-w-[150px]">{user.email}</span>
                        <span className="text-[8px] text-gray-400 block uppercase font-bold tracking-wider">AUTHORIZED ADMIN</span>
                      </div>
                      <button 
                        onClick={handleLogOut} 
                        title="Disconnect system Google credentials"
                        className="p-1 px-1.5 rounded bg-red-500/15 hover:bg-red-500 hover:text-white transition-all text-red-400 cursor-pointer text-[10px]"
                      >
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <span className="text-[9px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider block shrink-0 w-max h-max">OFFLINE INTEGRATION MODE</span>
                  )}
                </div>

                {/* Feedback message display */}
                {feedbackMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3.5 rounded-xl text-xs flex gap-2.5 items-start text-left ${
                      feedbackMsg.type === 'success' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/25'
                    }`}
                  >
                    {feedbackMsg.type === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                    <span className="leading-normal">{feedbackMsg.text}</span>
                  </motion.div>
                )}

                {needsAuth ? (
                  <div className="p-5 bg-black/30 border border-white/5 rounded-xl text-center space-y-3.5">
                    <p className="text-xs text-gray-400 max-w-xl mx-auto leading-relaxed">
                      Connect your google workspace profile. Once signed-in, inquiries submitted in the applet will save to the cloud database, construct an appointment report Excel file, and fire transaction summaries to <strong>muslimnazirlonekmr@gmail.com</strong>.
                    </p>
                    
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoggingIn}
                        className="relative flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow transition-all duration-300 text-gray-800 hover:bg-gray-50 active:bg-gray-100 cursor-pointer font-sans font-semibold text-xs uppercase tracking-wider"
                      >
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        </svg>
                        <span>{isLoggingIn ? 'Connecting...' : 'Authorize Google Account for Sheets & Gmail'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Column 1: Connected Active spreadsheet */}
                    <div className="p-4 bg-black/20 rounded-xl border border-white/5 flex flex-col justify-between text-left space-y-4">
                      {spreadsheetId ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Linked GSheets Database</h4>
                          </div>

                          <div className="bg-black/50 p-2.5 rounded-lg border border-white/5 space-y-1">
                            <span className="text-[10px] font-bold text-gray-200 block truncate">SGC Business Leads & Customer Inquiries</span>
                            <span className="text-[9px] font-mono text-gray-500 block truncate">ID: {spreadsheetId}</span>
                          </div>

                          <div className="flex gap-2">
                            <a 
                              href={spreadsheetUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500 hover:text-slate-950 text-yellow-500 font-bold transition-all text-[11px] flex items-center justify-center gap-1 shrink-0 border border-yellow-500/20"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Sheet</span>
                            </a>

                            <button
                              onClick={handleUnlinkSheet}
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-white font-bold transition-all text-[11px]"
                            >
                              Unlink
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">No Sheet Connected</h4>
                          <p className="text-[11.5px] text-gray-400 max-w-sm font-light">
                            Construct a spreadsheet inside Google Sheets or link an existing one to initialize live sync.
                          </p>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={handleCreateSheet}
                              disabled={isCreatingSheet}
                              className="py-2 px-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-lg text-[10px] font-extrabold tracking-widest uppercase transition-all flex items-center gap-1 disabled:opacity-40"
                            >
                              {isCreatingSheet ? <RotateCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                              <span>Auto Create Sheet</span>
                            </button>

                            <button
                              onClick={() => setShowManualInput(!showManualInput)}
                              className="py-2 px-3 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-bold transition-all border border-white/10 flex items-center gap-1"
                            >
                              <Link className="w-3 h-3 text-gray-400" />
                              <span>Link Custom ID</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {showManualInput && !spreadsheetId && (
                        <div className="pt-2.5 border-t border-white/5 space-y-1.5">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">ID or full URL</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={manualIdInput}
                              onChange={(e) => setManualIdInput(e.target.value)}
                              placeholder="https://docs.google.com/spreadsheets/d/your-id-here/edit"
                              className="flex-1 bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-500/50"
                            />
                            <button
                              onClick={handleLinkExisting}
                              disabled={isTestingAccess || !manualIdInput.trim()}
                              className="px-3 py-1.5 bg-white/10 hover:bg-yellow-500 hover:text-slate-950 text-white rounded text-xs font-bold disabled:opacity-40 shrink-0 transition-all font-mono"
                            >
                              {isTestingAccess ? '...' : 'Link'}
                            </button>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Column 2: Manual Trigger Sync Queue */}
                    <div className="p-4 bg-black/20 rounded-xl border border-white/5 flex flex-col justify-between text-left">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Sync Queue Controller</h4>
                        <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-lg border border-white/5">
                          <div>
                            <span className="text-[11px] text-gray-400 font-sans block">Client leads pending sync:</span>
                            <span className="text-[14px] font-black tracking-widest text-orange-400 block mt-0.5">{pendingSyncCount} inquiry(s)</span>
                          </div>
                          
                          <span className="text-[10px] bg-yellow-500/5 text-yellow-500 border border-yellow-500/10 rounded px-2 py-0.5 italic text-right">
                            Requires manual sync
                          </span>
                        </div>
                      </div>

                      <div className="pt-3">
                        <button
                          onClick={handleSyncPendingLeads}
                          disabled={isSyncing || pendingSyncCount === 0 || !spreadsheetId}
                          className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          {isSyncing ? <RotateCw className="w-4 h-4 animate-spin" /> : <RotateCw className="w-4 h-4" />}
                          <span>Sync {pendingSyncCount} Pending Leads & Deliver Emails</span>
                        </button>
                        <span className="text-[8.5px] text-gray-500 text-center block mt-1.5 font-light">
                          Sync process writes records to spreadsheet AND triggers formatted HTML email alerts to muslimnazirlonekmr@gmail.com
                        </span>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* REALTIME DATABASE CONNECTION DIAGNOSTIC MONITOR */}
              <div className="bg-[#101424] border border-yellow-500/15 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="text-left">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-200 uppercase tracking-widest font-sans">
                      <HardDrive className="w-5 h-5 text-yellow-500" />
                      <span>Firebase Realtime Database Diagnostics Portal</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 font-sans">
                      Monitored and resolved live sync channels under corporate project: <strong className="text-yellow-500 font-mono">sgc1-d1cab</strong>.
                    </p>
                  </div>
                  <button
                    onClick={runRtdbDiagnostics}
                    disabled={isTestingRtdb}
                    className="px-3.5 py-1.5 bg-yellow-500/10 hover:bg-yellow-500 hover:text-slate-950 font-bold text-yellow-500 text-[10px] uppercase font-sans border border-yellow-500/20 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <RotateCw className={`w-3 h-3 ${isTestingRtdb ? 'animate-spin' : ''}`} />
                    <span>Run Connection Diagnostics</span>
                  </button>
                </div>

                {/* Regional Probes List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  {rtdbTests.map((t, idx) => (
                    <div key={idx} className="p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white uppercase font-sans">{t.region}</span>
                          {t.status === 'success' ? (
                            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                              ACTIVE (OK)
                            </span>
                          ) : t.status === 'permission_denied' ? (
                            <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/25 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                              LOCKED (RULES)
                            </span>
                          ) : (
                            <span className="text-[8px] bg-gray-500/10 text-gray-400 border border-gray-500/25 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                              UNREACHABLE
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] font-mono text-gray-500 truncate mt-1">{t.url}</p>
                        <p className="text-[11px] text-gray-300 font-sans mt-2.5 leading-normal">
                          {t.details}
                        </p>
                      </div>

                      {t.status === 'permission_denied' && (
                        <div className="bg-red-500/5 p-2 rounded border border-red-500/10 space-y-1.5 text-[10px] leading-relaxed">
                          <div className="flex items-center gap-1 text-red-400 font-bold">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Action Required:</span>
                          </div>
                          <p className="text-gray-400">
                            Your Realtime Database in {t.region} is active but has locked security rules. Go to your <a href="https://console.firebase.google.com/u/0/project/sgc1-d1cab/database/sgc1-d1cab-default-rtdb/rules" target="_blank" rel="noopener noreferrer" className="text-yellow-500 underline hover:text-yellow-400">Firebase Database Rules tab</a> and update them to:
                          </p>
                          <pre className="text-[9px] font-mono bg-black/40 p-2 rounded text-yellow-500 overflow-x-auto leading-tight">
{`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}

                  {rtdbTests.length === 0 && (
                    <div className="col-span-3 text-center py-6 text-xs text-gray-500 font-sans">
                      {isTestingRtdb ? 'Probing regional Realtime Database clusters...' : 'Click "Run Connection Diagnostics" above to test active region paths.'}
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-[#1e2540] text-[11px] border border-white/5 leading-relaxed text-gray-400 text-left flex gap-2.5 items-start">
                  <HelpCircle className="w-4.5 h-4.5 text-yellow-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-gray-300 block">Vercel Deployment Notes & Realtime Database Sync</span>
                    <p>
                      Since you deployed this site on Vercel, any client leads submitted by public visitors will instantly trigger our multi-database connector. This will mirror data securely across Firestore, and write to whichever regional Realtime Database you configured! If database rules allow writing, leads will instantly populate on your Firebase Database console and display beautifully on this admin dashboard.
                    </p>
                  </div>
                </div>
              </div>

              {/* SEARCH, FILTER & DATA CONTROL TABLE */}
              <div className="bg-[#0e111d] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
                
                {/* Visual filter controller panel */}
                <div className="p-5 border-b border-white/5 bg-[#111525] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Search query box */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search inquiries by name, phone, message requirements..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs px-2"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Filter selector dropdowns row */}
                  <div className="flex flex-wrap items-center gap-3">
                    
                    {/* Filter division */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-400 font-medium">Division:</span>
                      <select
                        value={divisionFilter}
                        onChange={(e) => setDivisionFilter(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded-lg text-xs text-white px-3 py-1.5 focus:outline-none focus:border-yellow-500/50 cursor-pointer"
                      >
                        <option value="all">All Divisions</option>
                        <option value="gold">Gold Quote</option>
                        <option value="catering">Catering</option>
                        <option value="real_estate">Real Estate</option>
                        <option value="general">General SGC</option>
                      </select>
                    </div>

                    {/* Filter sync */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-400 font-medium font-sans">Sync State:</span>
                      <select
                        value={syncFilter}
                        onChange={(e) => setSyncFilter(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded-lg text-xs text-white px-3 py-1.5 focus:outline-none focus:border-yellow-500/50 cursor-pointer"
                      >
                        <option value="all">All Statuses</option>
                        <option value="synced">Synced (Excel)</option>
                        <option value="pending">Pending Sheets Sync</option>
                      </select>
                    </div>

                    {/* Filter triage/process status */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-400 font-medium">Lead Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded-lg text-xs text-white px-3 py-1.5 focus:outline-none focus:border-yellow-500/50 cursor-pointer"
                      >
                        <option value="all">All Triage (All)</option>
                        <option value="new">New Appointments</option>
                        <option value="contacted">In Touch / Connected</option>
                        <option value="processed">Processed / Deal Closed</option>
                        <option value="declined">Declined</option>
                      </select>
                    </div>

                    {/* Reset filtering states button */}
                    {(divisionFilter !== 'all' || syncFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setDivisionFilter('all');
                          setSyncFilter('all');
                          setStatusFilter('all');
                        }}
                        className="p-1.5 text-xs bg-yellow-500/10 hover:bg-yellow-500 hover:text-[#060608] text-yellow-500 border border-yellow-500/15 rounded-lg transition-colors font-medium cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    )}

                  </div>

                </div>

                {/* Spreadsheet client representation data table */}
                <div className="overflow-x-auto">
                  {filteredInquiries.length > 0 ? (
                    <table className="w-full text-left border-collapse table-auto">
                      <thead>
                        <tr className="bg-[#111525] border-b border-white/5 text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest">
                          <th className="px-5 py-4">Submission Date</th>
                          <th className="px-5 py-4">Business Client</th>
                          <th className="px-5 py-4">Division Section</th>
                          <th className="px-5 py-4">Google Sheet Sync</th>
                          <th className="px-5 py-4">Triage Status</th>
                          <th className="px-5 py-4 text-right">Administrative</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03] text-xs">
                        {filteredInquiries.map((inq) => {
                          const division = getBusinessLabel(inq.businessSection);
                          const statusInfo = getStatusLabelAndStyles(inq.status);
                          
                          return (
                            <tr 
                              key={inq.id}
                              className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                              onClick={() => openInquiryInspector(inq)}
                            >
                              
                              {/* Date submission */}
                              <td className="px-5 py-4 text-gray-400 font-mono whitespace-nowrap">
                                {inq.date}
                              </td>

                              {/* Customer name / contact info */}
                              <td className="px-5 py-4 text-left">
                                <div className="space-y-0.5">
                                  <h4 className="font-bold text-white group-hover:text-yellow-500 transition-colors">{inq.name}</h4>
                                  <div className="flex flex-col text-[10.5px] text-gray-500 font-mono">
                                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 scale-90" /> {inq.phone}</span>
                                    {inq.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 scale-90" /> {inq.email}</span>}
                                  </div>
                                </div>
                              </td>

                              {/* Division badge label */}
                              <td className="px-5 py-4 whitespace-nowrap">
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${division.style}`}>
                                  {division.text}
                                </span>
                              </td>

                              {/* Sheets sync status indicator */}
                              <td className="px-5 py-4 whitespace-nowrap">
                                {inq.syncedToSheets ? (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                                    <CheckCheck className="w-3 h-3 shrink-0" />
                                    <span>SYNCED (EXCEL)</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full font-mono">
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    <span>PENDING SYNC</span>
                                  </span>
                                )}
                              </td>

                              {/* Administrative process state */}
                              <td className="px-5 py-4 whitespace-nowrap">
                                <span className={`text-[9px] font-bold uppercase tracking-wide px-2.5 py-1 border rounded-lg whitespace-nowrap ${statusInfo.color}`}>
                                  {statusInfo.text}
                                </span>
                              </td>

                              {/* Actions container column */}
                              <td className="px-5 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  
                                  {/* Quick inspector action trigger */}
                                  <button
                                    onClick={() => openInquiryInspector(inq)}
                                    className="p-1 px-2 rounded-lg bg-white/5 hover:bg-yellow-500 hover:text-slate-950 font-bold text-[10.5px] text-gray-300 transition-all flex items-center gap-1"
                                    title="Inspect requirements details"
                                  >
                                    <span>Inspect</span>
                                  </button>

                                  {/* Delete action */}
                                  <button
                                    onClick={() => {
                                      const confirmDelete = window.confirm(`Permanently remove client log ${inq.name}? This will attempt to erase from database.`);
                                      if (confirmDelete) {
                                        onDeleteInquiry(inq.id);
                                        setFeedbackMsg({ type: 'success', text: `Lead ${inq.name} deleted successfully.` });
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all border border-red-500/10"
                                    title="Delete inquiry database item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                </div>
                              </td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-16 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-xl">
                        🔍
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif text-lg font-bold text-white">No Matched Inquiry Records</h4>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                          Your current combination of search keywords and division filters do not correspond with any data elements in current memory storage.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Table Footer info indicators */}
                <div className="p-4 bg-[#111525] border-t border-white/5 text-[10px] text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-2">
                  <span>Showing {filteredInquiries.length} of {totalLeadsCount} records across all subsidiaries</span>
                  <span>Click on any table row to update customer appointment status and edit internal notes</span>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* DETAILED LEAD INSPECTOR MODAL */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-center items-center p-4">
            {/* Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInquiry(null)}
              className="absolute inset-0 bg-[#060608]/90 backdrop-blur-md cursor-pointer"
            />

            {/* Central modal inspector */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-2xl bg-[#0d101a] border border-yellow-500/15 shadow-[0_0_50px_rgba(0,0,0,0.85)] rounded-2xl z-10 flex flex-col overflow-hidden max-h-[90vh] text-left"
            >
              
              {/* Modal header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#111525]">
                <div className="flex items-center gap-2 text-left">
                  <ClipboardCheck className="w-5 h-5 text-yellow-500" />
                  <div>
                    <h3 className="font-serif text-base font-extrabold text-white">Client Portfolio & Appointment Inspector</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Unique ID: {selectedInquiry.id} &bull; Received IST {selectedInquiry.date}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal scroll area */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                
                {/* 2-Column Client Profile Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="bg-black/25 p-4 rounded-xl border border-white/5 space-y-3">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 font-mono block">CLIENT INFO DETAILS</span>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-gray-500 block">Full Name:</span>
                        <h4 className="text-sm font-bold text-white font-sans">{selectedInquiry.name}</h4>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-500 block">Phone Connection:</span>
                        <a href={`tel:${selectedInquiry.phone}`} className="text-xs font-bold text-yellow-500 hover:underline flex items-center gap-1 font-mono mt-0.5">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{selectedInquiry.phone}</span>
                        </a>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-500 block">Contact Email:</span>
                        {selectedInquiry.email ? (
                          <a href={`mailto:${selectedInquiry.email}`} className="text-xs text-yellow-400 hover:underline flex items-center gap-1 font-mono mt-0.5">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{selectedInquiry.email}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-gray-500 italic block mt-0.5">No email address left</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/25 p-4 rounded-xl border border-white/5 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 font-mono block">DIVISION ROUTING</span>
                      
                      <div className="mt-2.5">
                        <span className="text-[10px] text-gray-500 block">Assigned Segment:</span>
                        <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border rounded ${getBusinessLabel(selectedInquiry.businessSection).style}`}>
                          {getBusinessLabel(selectedInquiry.businessSection).text}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[10px] text-gray-500 block">Google Sheets Synced:</span>
                      {selectedInquiry.syncedToSheets ? (
                        <span className="text-[10.5px] font-bold text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                          <CheckCheck className="w-4 h-4 shrink-0" />
                          <span>SYNCED TO SPREADSHEET</span>
                        </span>
                      ) : (
                        <span className="text-[10.5px] font-semibold text-orange-400 flex items-center gap-1 mt-1 font-mono">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>PENDING OUTBOX SYNC</span>
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Message Requirements Box */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 font-mono block">CLIENT REQUIREMENTS MESSAGE</span>
                  <div className="bg-[#0b0e1a] rounded-xl p-4 text-xs text-gray-300 border-l-4 border-yellow-500/40 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Status Triage Interactive Block */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 font-mono block">TRIAGE APPOINTMENT WORKING STATE</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    
                    {/* Status New */}
                    <button
                      onClick={() => handleUpdateInquiryField(selectedInquiry.id, { status: 'new' })}
                      className={`p-2.5 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        (!selectedInquiry.status || selectedInquiry.status === 'new')
                          ? 'bg-yellow-500 border-yellow-500 text-slate-950 font-black shadow-md'
                          : 'bg-black/50 border-white/5 text-yellow-500 hover:bg-white/5'
                      }`}
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>New Appt</span>
                    </button>

                    {/* Status In touch */}
                    <button
                      onClick={() => handleUpdateInquiryField(selectedInquiry.id, { status: 'contacted' })}
                      className={`p-2.5 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        selectedInquiry.status === 'contacted'
                          ? 'bg-blue-500 border-blue-500 text-white font-black shadow-md'
                          : 'bg-black/50 border-white/5 text-blue-400 hover:bg-white/5'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>In Touch</span>
                    </button>

                    {/* Status processed */}
                    <button
                      onClick={() => handleUpdateInquiryField(selectedInquiry.id, { status: 'processed' })}
                      className={`p-2.5 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        selectedInquiry.status === 'processed'
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-black shadow-md'
                          : 'bg-black/50 border-white/5 text-emerald-400 hover:bg-white/5'
                      }`}
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Deal Done</span>
                    </button>

                    {/* Status Declined */}
                    <button
                      onClick={() => handleUpdateInquiryField(selectedInquiry.id, { status: 'declined' })}
                      className={`p-2.5 rounded-xl border text-[11px] font-bold tracking-wider transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        selectedInquiry.status === 'declined'
                          ? 'bg-white/10 border-white/20 text-white font-black'
                          : 'bg-black/50 border-white/5 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Declined</span>
                    </button>

                  </div>
                </div>

                {/* Editable Admin notes section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                    <span className="uppercase font-bold tracking-wider text-gray-400">INTERNAL ADMINISTRATIVE ANNOTATIONS</span>
                    <span className="text-gray-500">Private admin-only notes</span>
                  </div>
                  <div className="space-y-2">
                    <textarea
                      value={adminNotesText}
                      onChange={(e) => setAdminNotesText(e.target.value)}
                      placeholder="Type details of conversations, quotes, follow-up dates, or pricing calculations here..."
                      rows={4}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 leading-relaxed font-sans"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={saveAdminNotesOfInquiry}
                        className="py-1.5 px-3 bg-white/10 hover:bg-yellow-500 hover:text-slate-950 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Notes on Lead</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal footer with action handlers */}
              <div className="p-4 bg-[#111525] border-t border-white/5 flex flex-wrap gap-2.5 justify-between items-center">
                
                {/* Print individual PDF/TXT customer file */}
                <button
                  type="button"
                  onClick={() => downloadSingleCustomerReport(selectedInquiry)}
                  className="py-2 px-3 bg-[#0d101a] hover:bg-white/5 text-gray-300 font-bold text-[11px] hover:text-white rounded-lg transition-colors flex items-center gap-1.5 border border-white/5"
                >
                  <FileText className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Download Lead Report (.txt)</span>
                </button>

                {/* Close trigger handles */}
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="py-2 px-4 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-sm"
                >
                  Close Inspector
                </button>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
