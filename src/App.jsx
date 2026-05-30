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
import { getAccessToken, saveInquiryToFirestore, deleteInquiryFromFirestore, loadInquiriesFromFirestore, subscribeToInquiries } from './lib/firebase';
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

  // Load local cache and establish real-time subscription to Firebase Realtime Database
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sgc_customer_inquiries');
      if (stored) {
        setInquiries(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to read cached inquiries from local storage', e);
    }

    // Subscribe to multi-region Realtime Database live nodes
    const unsubscribe = subscribeToInquiries((rtdbInquiries) => {
      if (rtdbInquiries) {
        setInquiries(rtdbInquiries);
        try {
          localStorage.setItem('sgc_customer_inquiries', JSON.stringify(rtdbInquiries));
        } catch (e) {
          console.error('Failed to update local storage cache with live RTDDB data', e);
        }
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
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
      syncedToSheets: false
    };

    // Save lead record immediately to the Realtime Database (handles multi-region fallback automatically)
    try {
      await saveInquiryToFirestore(formattedInq);
      console.log('[App] Lead stored successfully in RTDDB:', formattedInq.id);
    } catch (dbErr) {
      console.error('[App] Critical fail storing lead to Realtime Database:', dbErr);
      alert('Your inquiry submission failed. Please check network connection or database rules.');
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
