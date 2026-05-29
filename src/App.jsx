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
import { getAccessToken, saveInquiryToFirestore, deleteInquiryFromFirestore, loadInquiriesFromFirestore } from './lib/firebase';
import { appendInquiriesToSpreadsheet } from './lib/googleSheets';
import { sendInquiryEmail } from './lib/gmail';

export default function App() {
  const [activeWebsite, setActiveWebsite] = useState('sgc');
  const [activeModalSection, setActiveModalSection] = useState(null);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]);

  // Prefill buffers for contacting/inquiring directly from calculators or listings
  const [contactPrefillMsg, setContactPrefillMsg] = useState('');
  const [contactPrefillBiz, setContactPrefillBiz] = useState('general');

  const contactBannerRef = useRef(null);

  // Load inquiries from localStorage on mount, then synchronize with Cloud Firestore
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sgc_customer_inquiries');
      if (stored) {
        setInquiries(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to read gold/catering logs from local storage', e);
    }

    const syncWithCloud = async () => {
      try {
        const cloudInquiries = await loadInquiriesFromFirestore();
        if (cloudInquiries && cloudInquiries.length > 0) {
          setInquiries(prev => {
            const map = new Map();
            prev.forEach(inq => map.set(inq.id, inq));
            cloudInquiries.forEach(inq => map.set(inq.id, inq));
            
            return Array.from(map.values()).sort((a, b) => {
              const idA = Number(a.id.replace('inq-', '')) || 0;
              const idB = Number(b.id.replace('inq-', '')) || 0;
              return idB - idA;
            });
          });
        }
      } catch (err) {
        console.warn('Initial Firestore query pending:', err);
      }
    };

    syncWithCloud();
  }, []);

  // Sync / refresh database is performed when the Admin Console transitions to active
  useEffect(() => {
    if (!isAdminDashboardOpen) return;

    const refreshDashboardInquiries = async () => {
      try {
        const cloudInquiries = await loadInquiriesFromFirestore();
        if (cloudInquiries) {
          setInquiries(prev => {
            const map = new Map();
            prev.forEach(inq => map.set(inq.id, inq));
            cloudInquiries.forEach(inq => map.set(inq.id, inq));

            return Array.from(map.values()).sort((a, b) => {
              const idA = Number(a.id.replace('inq-', '')) || 0;
              const idB = Number(b.id.replace('inq-', '')) || 0;
              return idB - idA;
            });
          });
        }
      } catch (err) {
        console.error('Failed to sync master dashboard with cloud database on load:', err);
      }
    };

    refreshDashboardInquiries();
  }, [isAdminDashboardOpen]);

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
      syncedToSheets: false
    };

    // First, save immediately to Firestore cloud database (rules permit writing by any user)
    try {
      await saveInquiryToFirestore(formattedInq);
    } catch (dbErr) {
      console.error('Failed to save inquiry to Firestore DB:', dbErr);
    }

    // Now, attempt direct real-time sync with Google Sheets & send Gmail notifications if an active authenticated admin session is found
    try {
      const spreadsheetId = localStorage.getItem('sgc_leads_spreadsheet_id');
      const token = await getAccessToken();
      if (spreadsheetId && token) {
        // Appending to Sheets
        await appendInquiriesToSpreadsheet(token, spreadsheetId, [formattedInq]);
        formattedInq.syncedToSheets = true;

        // Sync synced state back to Firestore as well
        try {
          await saveInquiryToFirestore(formattedInq);
        } catch (dbErr) {
          console.error('Failed to update synced status in Firestore DB:', dbErr);
        }

        // Send Email Alert
        try {
          await sendInquiryEmail(token, 'muslimnazirlonekmr@gmail.com', formattedInq);
        } catch (emailErr) {
          console.error('Failed to send real-time Gmail appointment alert:', emailErr);
        }
      }
    } catch (e) {
      console.warn('Real-time Google Sheets or Gmail sync pending (signed-in session not active):', e);
    }

    const updated = [formattedInq, ...inquiries];
    saveInquiriesToStorage(updated);
  };

  // Delete inquiries
  const handleDeleteInquiry = async (id) => {
    const filtered = inquiries.filter(i => i.id !== id);
    saveInquiriesToStorage(filtered);

    // Also attempt mirroring deletion in Firestore database
    try {
      await deleteInquiryFromFirestore(id);
    } catch (e) {
      console.warn('Failed to delete query from Firestore DB:', e);
    }
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

  return (
    <div className="relative min-h-screen bg-[#060608] font-sans antialiased text-[#f3f4f6]">
      
      {/* Primary Sticky Header */}
      <Navbar 
        onOpenInquiries={() => setIsInboxOpen(true)}
        inquiriesCount={inquiries.length}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      <main className="relative pb-4">
        
        {/* Hero Section */}
        <Hero 
          onExploreBusinesses={() => scrollToSection('businesses')}
          onAboutSgc={() => scrollToSection('about')}
        />

        {/* Translucent Key Statistics Bar overlay */}
        <StatsBar />

        {/* About the parent company structure (SGC) and values */}
        <AboutUs />

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
      <Footer />

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

    </div>
  );
}
