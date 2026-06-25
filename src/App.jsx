import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import BusinessSection from './components/BusinessSection';
import SubsidariesModals from './components/SubsidariesModals';
import AboutUs from './components/AboutUs';
import WhyChooseSGC from './components/WhyChooseSGC';
import ContactBanner from './components/ContactBanner';
import Footer from './components/Footer';
import MyInquiriesInbox from './components/MyInquiriesInbox';
import CompanyAdminDashboard from './components/CompanyAdminDashboard';
import GoldWebsite from './components/GoldWebsite';
import CateringWebsite from './components/CateringWebsite';
import RealEstateWebsite from './components/RealEstateWebsite';
import AboutPage from './components/AboutPage';
import { saveInquiryToFirestore, auth, subscribeToFirestoreInquiries } from './lib/firestorePlaceholder';
import { onAuthStateChanged } from 'firebase/auth';
import { appendInquiriesToSpreadsheet } from './lib/googleSheets';
import { sendInquiryEmail } from './lib/gmail';
import ToastContainer from './components/ToastContainer';

export const ADMIN_EMAILS = [
  'salafimubashirlone@gmail.com',
  'salafiyagroupodcompanies@gmail.com',
  'salafiyagroupofcompanies@gmail.com',
  'muslimnazirlonekmr@gmail.com'
];

export default function App() {
  const [activeWebsite, setActiveWebsite] = useState('sgc');
  const [activeModalSection, setActiveModalSection] = useState(null);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Toast dispatch and management helpers
  const addToast = (message, type = 'success', description = '', duration = 5000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type, description, duration }]);
    
    if (type !== 'syncing') {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Prefill buffers for contacting/inquiring directly from calculators or listings
  const [contactPrefillMsg, setContactPrefillMsg] = useState('');
  const [contactPrefillBiz, setContactPrefillBiz] = useState('general');

  const contactBannerRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const prevInquiryIdsRef = useRef(null);

  // Load local cache exclusively
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sgc_customer_inquiries');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setInquiries(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to read cached inquiries from local storage', e);
    }
  }, []);

  // Sync with Firestore in Real-time if admin is logged in
  useEffect(() => {
    let unsubscribeSnap = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && ADMIN_EMAILS.includes(user.email)) {
        console.log('[App] Admin verified. Initializing Firestore real-time listener.');
        unsubscribeSnap = subscribeToFirestoreInquiries((liveInquiries) => {
          // Detect and alert on new real-time inquiries/leads
          if (prevInquiryIdsRef.current !== null && Array.isArray(liveInquiries)) {
            const currentIds = new Set(prevInquiryIdsRef.current);
            const newlyAdded = liveInquiries.filter(inq => inq && inq.id && !currentIds.has(inq.id));
            
            if (newlyAdded.length > 0) {
              newlyAdded.forEach((newInq) => {
                const sourceLabel = newInq.source ? ` (${newInq.source.toUpperCase()})` : '';
                addToast(
                  `New Lead Received!`,
                  'success',
                  `${newInq.name || 'A customer'} submitted an inquiry${sourceLabel}.`,
                  8000
                );
              });
            }
          }
          // Update tracking ref with latest IDs
          if (Array.isArray(liveInquiries)) {
            prevInquiryIdsRef.current = liveInquiries.map(inq => inq.id).filter(Boolean);
          }

          setInquiries(liveInquiries);
          try {
            localStorage.setItem('sgc_customer_inquiries', JSON.stringify(liveInquiries));
          } catch (e) {
            console.error('Failed to sync to local storage', e);
          }
        }, (err) => {
          console.error('[App] Firestore snapshot error:', err);
        });
      } else {
        // Reset ref on signout
        prevInquiryIdsRef.current = null;
        // If logged out, reload from local storage to revert to personal cached inquiries
        if (unsubscribeSnap) {
          unsubscribeSnap();
          unsubscribeSnap = null;
        }
        try {
          const stored = localStorage.getItem('sgc_customer_inquiries');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              setInquiries(parsed);
            }
          }
        } catch (e) {
          console.error('Failed to read local cache on signout', e);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) {
        unsubscribeSnap();
      }
    };
  }, []);

  // Save inquiries to localStorage when modified
  const saveInquiriesToStorage = (updatedList) => {
    setInquiries(updatedList);
    try {
      localStorage.setItem('sgc_customer_inquiries', JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to write inquiries database logs to local storage', e);
    }
  };

  // Callback to submit a new client inquiry
  const handleAddInquiry = async (newInq) => {
    const formattedInq = {
      ...newInq,
      id: `inq-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      syncedToSheets: false,
      syncedToDatabase: true
    };

    console.log('[App] Storing lead in local storage for ID:', formattedInq.id);
    const updated = [formattedInq, ...inquiries];
    saveInquiriesToStorage(updated);

    // 1. FUTURE FIRESTORE INTEGRATION HOOK
    // This function conforms exactly to the database schema and handles the trigger.
    // Your developer/friend can connect the live database in 'src/lib/firestorePlaceholder.js'.
    try {
      await saveInquiryToFirestore(formattedInq);
    } catch (dbErr) {
      console.warn('[App] Firestore blueprint placeholder logged an issue:', dbErr);
    }

    // 1.5. FORMSPREE LEAD ROUTING WORKFLOW
    // Send form data automatically to the requested Formspree endpoint: https://formspree.io/f/xzdldwdo
    try {
      fetch('https://formspree.io/f/xzdldwdo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          inquiryId: formattedInq.id,
          name: formattedInq.name,
          phone: formattedInq.phone,
          email: formattedInq.email || 'Not provided',
          division: formattedInq.businessSection,
          message: formattedInq.message || 'No additional details provided',
          dateSubmitted: formattedInq.date
        })
      }).then(res => {
        if (res.ok) {
          console.log('[App] Successfully dispatched lead to Formspree.');
        } else {
          console.warn('[App] Formspree returned non-ok status.');
        }
      }).catch(err => {
        console.error('[App] Error dispatching to Formspree:', err);
      });
    } catch (formspreeErr) {
      console.error('[App] Formspree submission failed:', formspreeErr);
    }

    addToast(
      'Inquiry Submitted!',
      'success',
      `Saved locally. Redirecting to SGC WhatsApp Desk...`,
      4000
    );

    // 2. WHATSAPP REDIRECTION WORKFLOW
    // Centralized redirection to the SGC J&K Mobile WhatsApp Desk: +91 78894 34741
    const divisionLabels = {
      gold: '👑 SGC Gold Buying & Loan Settlement',
      real_estate: '🏢 SGC Real Estate Advisory',
      catering: '🍽️ Salafiya Premium Catering Services',
      general: '💼 General Corporate Business Inquiry'
    };

    const label = divisionLabels[formattedInq.businessSection] || divisionLabels.general;
    const whatsappMessage = `*SGC GROUP OF COMPANIES - CUSTOMER INQUIRY*\n\n` +
      `*Division:* ${label}\n` +
      `*Client Name:* ${formattedInq.name}\n` +
      `*Contact Number:* ${formattedInq.phone}\n` +
      `*Email Address:* ${formattedInq.email || 'Not provided'}\n` +
      `*Message / Request Details:* ${formattedInq.message || 'No additional details provided'}\n\n` +
      `_Sent securely via SGC Corporate Portal_`;

    const encodedText = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/917889434741?text=${encodedText}`;

    // Perform secure, responsive redirect after 1.2s so the user sees the confirmation toast
    setTimeout(() => {
      try {
        const opened = window.open(whatsappUrl, '_blank');
        if (!opened || opened.closed || typeof opened.closed === 'undefined') {
          // Fallback if browser popup blocker stops new tab
          window.location.href = whatsappUrl;
        }
      } catch (err) {
        window.location.href = whatsappUrl;
      }
    }, 1200);
  };

  // Delete inquiries
  const handleDeleteInquiry = async (id) => {
    const filtered = inquiries.filter(i => i.id !== id);
    saveInquiriesToStorage(filtered);

    addToast(
      'Inquiry Deleted',
      'success',
      'The inquiry has been removed successfully from your active sessions.',
      3500
    );
  };

  // Handles clicking "Submit Menu Quote" or "Book Payout Portfolio" in modal
  const handleModalInquire = (business, details) => {
    setActiveModalSection(null); // Close the active dialog modal
    setContactPrefillBiz(business);
    setContactPrefillMsg(details);

    // Call focus form on ContactBanner to slide it open and scroll smoothly
    setTimeout(() => {
      contactBannerRef.current?.focusForm();
    }, 100);
  };

  // Helper scroll triggers
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

  const handleClearPrefills = () => {
    setContactPrefillMsg('');
    setContactPrefillBiz('general');
  };

  if (activeWebsite === 'gold') {
    return (
      <GoldWebsite 
        onBackToParent={() => {
          setActiveWebsite('sgc');
          window.scrollTo(0, 0);
        }}
        onSubmitInquiry={handleAddInquiry}
      />
    );
  }

  if (activeWebsite === 'catering') {
    return (
      <CateringWebsite 
        onBackToParent={() => {
          setActiveWebsite('sgc');
          window.scrollTo(0, 0);
        }}
        onSubmitInquiry={handleAddInquiry}
      />
    );
  }

  if (activeWebsite === 'real_estate') {
    return (
      <RealEstateWebsite 
        onBackToParent={() => {
          setActiveWebsite('sgc');
          window.scrollTo(0, 0);
        }}
        onSubmitInquiry={handleAddInquiry}
      />
    );
  }

  if (activeWebsite === 'about') {
    return (
      <AboutPage 
        onBackToParent={() => {
          setActiveWebsite('sgc');
          window.scrollTo(0, 0);
        }}
        onOpenInquiries={() => setIsInboxOpen(true)}
        inquiriesCount={inquiries.length}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onSubmitInquiry={handleAddInquiry}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#060608] font-sans antialiased text-[#f3f4f6]">
      
      {/* Primary Sticky Header */}
      <Navbar 
        onOpenInquiries={() => setIsInboxOpen(true)}
        inquiriesCount={inquiries.length}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenAboutPage={() => {
          setActiveWebsite('about');
          window.scrollTo(0, 0);
        }}
      />

      <main className="relative pb-4">
        
        {/* Hero Section */}
        <Hero 
          onExploreBusinesses={() => scrollToSection('businesses')}
          onAboutSgc={() => {
            setActiveWebsite('about');
            window.scrollTo(0, 0);
          }}
        />

        {/* Translucent Key Statistics Bar overlay */}
        <StatsBar />

        {/* About the parent company structure (SGC) and values */}
        <AboutUs 
          onOpenAboutPage={() => {
            setActiveWebsite('about');
            window.scrollTo(0, 0);
          }}
        />

        {/* Core modular business divisions (cards with details popup trigger) */}
        <BusinessSection 
          onExploreBusiness={(id) => {
            setActiveWebsite(id);
            window.scrollTo(0, 0);
          }}
        />

        {/* Why Choose SGC / Commitments Grid */}
        <WhyChooseSGC />

        {/* Contact Ornate Banner & Advisory form */}
        <ContactBanner
          ref={contactBannerRef}
          onSubmitInquiry={handleAddInquiry}
          prefillMessage={contactPrefillMsg}
          prefillBusiness={contactPrefillBiz}
          onClearPrefills={handleClearPrefills}
        />

      </main>

      {/* Ornate Sitemaps Footer */}
      <Footer 
        onOpenAboutPage={() => {
          setActiveWebsite('about');
          window.scrollTo(0, 0);
        }}
      />

      {/* Subsidary Interactive Dialog Modals (Gold estimator, Catering cost menu planner) */}
      <SubsidariesModals
        activeSection={activeModalSection}
        onClose={() => setActiveModalSection(null)}
        onInquire={handleModalInquire}
      />

      {/* Submitted Inquiries Customer Drawer inbox */}
      <MyInquiriesInbox
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        inquiries={inquiries}
        onDeleteInquiry={handleDeleteInquiry}
        onUpdateInquiries={saveInquiriesToStorage}
      />

      {/* Central Secured Corporate Admin Dashboard */}
      {isAdminDashboardOpen && (
        <CompanyAdminDashboard
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
          inquiries={inquiries}
          onDeleteInquiry={handleDeleteInquiry}
          onUpdateInquiries={saveInquiriesToStorage}
        />
      )}

      {/* Modern Fixed Toast notifications banner container overlay */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

    </div>
  );
}
