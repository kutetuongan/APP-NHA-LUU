import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import contentDataRaw from './data/contentData.json';
import { ContentData } from './types';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { FaqSection } from './components/FaqSection';
import { AppDownloadSection } from './components/AppDownloadSection';
import { FlappyGameSection } from './components/FlappyGameSection';
import { DepositCalculatorSection } from './components/DepositCalculatorSection';
import { LoanCalculatorSection } from './components/LoanCalculatorSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { BranchLocatorSection } from './components/BranchLocatorSection';
import { ConsultantModal } from './components/ConsultantModal';
import { Footer } from './components/Footer';

const contentData = contentDataRaw as unknown as ContentData;

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('faq');
  const [consultantModalOpen, setConsultantModalOpen] = useState<boolean>(false);
  const [consultantContextMessage, setConsultantContextMessage] = useState<string>('');

  const contentContainerRef = useRef<HTMLDivElement | null>(null);

  // GSAP animation on tab change
  useEffect(() => {
    if (contentContainerRef.current) {
      gsap.fromTo(
        contentContainerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  const handleOpenConsultant = (msg?: string) => {
    setConsultantContextMessage(msg || 'Quý khách đang cần hỗ trợ dịch vụ ngân hàng tại quầy');
    setConsultantModalOpen(true);
  };

  const handleCloseConsultant = () => {
    setConsultantModalOpen(false);
    setConsultantContextMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 text-slate-800 font-sans selection:bg-[#00529b] selection:text-white">
      {/* 1. Header (Top Bar Contract: Brand, Status, Primary CTA) */}
      <Header
        brand={contentData.brand}
        onOpenConsultant={handleOpenConsultant}
      />

      {/* 2. Navigation Tabs (7 Core Features) */}
      <NavigationTabs
        items={contentData.navigation}
        activeTab={activeTab}
        onSelectTab={(id) => {
          setActiveTab(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 3. Main Content Area */}
      <main className="flex-1 w-full" ref={contentContainerRef}>
        {activeTab === 'faq' && (
          <FaqSection
            data={contentData.faqSection}
            supportOfficer={contentData.brand.supportOfficer}
            onOpenConsultant={handleOpenConsultant}
            onBackToMainMenu={() => setActiveTab('faq')}
          />
        )}

        {activeTab === 'download_app' && (
          <AppDownloadSection data={contentData.appDownload} />
        )}

        {activeTab === 'game' && (
          <FlappyGameSection
            data={contentData.game}
            onBackToMenu={() => setActiveTab('faq')}
          />
        )}

        {activeTab === 'deposit' && (
          <DepositCalculatorSection
            data={contentData.depositCalculator}
            onOpenConsultant={handleOpenConsultant}
          />
        )}

        {activeTab === 'loan' && (
          <LoanCalculatorSection
            data={contentData.loanCalculator}
            onOpenConsultant={handleOpenConsultant}
          />
        )}

        {activeTab === 'products' && (
          <FeaturedProductsSection
            data={contentData.featuredProducts}
            supportOfficer={contentData.brand.supportOfficer}
          />
        )}

        {activeTab === 'branches' && (
          <BranchLocatorSection data={contentData.branchLocator} />
        )}
      </main>

      {/* 4. Consultant Quick Action Modal */}
      <ConsultantModal
        isOpen={consultantModalOpen}
        onClose={handleCloseConsultant}
        officer={contentData.brand.supportOfficer}
        contextMessage={consultantContextMessage}
      />

      {/* 5. Footer */}
      <Footer
        brand={contentData.brand}
        onOpenConsultant={handleOpenConsultant}
      />
    </div>
  );
}
