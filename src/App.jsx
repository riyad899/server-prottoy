import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/common/Navbar';
import ConceptsGuideModal from './components/common/ConceptsGuideModal';
import AuthModal from './components/auth/AuthModal';

import ProductCatalog from './components/ecommerce/ProductCatalog';
import CartDrawer from './components/ecommerce/CartDrawer';
import CheckoutModal from './components/ecommerce/CheckoutModal';
import OrderHistoryModal from './components/ecommerce/OrderHistoryModal';
import CustomerSupportModal from './components/ecommerce/CustomerSupportModal';

import CrmPortal from './components/crm/CrmPortal';
import { Layers, ShoppingBag, LayoutDashboard, Heart, Sparkles } from 'lucide-react';

function AppContent() {
  const [appMode, setAppMode] = useState('store'); // 'store' or 'crm'
  
  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');
  const [isConceptsOpen, setIsConceptsOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const { user } = useAuth();

  const handleOpenAuth = (mode = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      handleOpenAuth('login');
    } else {
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        appMode={appMode}
        setAppMode={setAppMode}
        openAuthModal={handleOpenAuth}
        openConceptsModal={() => setIsConceptsOpen(true)}
        openOrderHistory={() => setIsOrderHistoryOpen(true)}
        openSupportModal={() => setIsSupportOpen(true)}
      />

      {/* Main Container */}
      <main className="container" style={{ flex: 1 }}>
        {appMode === 'store' ? (
          <ProductCatalog />
        ) : (
          <CrmPortal openAuthModal={handleOpenAuth} />
        )}
      </main>

      {/* Cart Slide-out Drawer */}
      <CartDrawer onProceedToCheckout={handleProceedToCheckout} />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authInitialMode}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={() => setIsOrderHistoryOpen(true)}
      />

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
      />

      <CustomerSupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      <ConceptsGuideModal
        isOpen={isConceptsOpen}
        onClose={() => setIsConceptsOpen(false)}
      />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(11, 15, 23, 0.95)',
          padding: '24px 0',
          marginTop: 'auto'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '700', color: '#fff' }}>AeroNexus Platform</span>
            <span>• E-Commerce & Customer Relationship Management (CRM)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setIsConceptsOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#a5b4fc',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '600'
              }}
            >
              <Layers size={14} />
              <span>5 React Concepts Breakdown</span>
            </button>
            <span>Node.js • Express • PostgreSQL / Neon DB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
