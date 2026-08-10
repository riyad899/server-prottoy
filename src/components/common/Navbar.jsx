import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  ShoppingBag,
  LayoutDashboard,
  ShoppingCart,
  Clock,
  HelpCircle,
  LogIn,
  LogOut,
  User,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

export const Navbar = ({
  appMode,
  setAppMode,
  openAuthModal,
  openConceptsModal,
  openOrderHistory,
  openSupportModal
}) => {
  const { user, isAdmin, logout, switchDemoAccount } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        background: 'rgba(11, 15, 23, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '20px' }}>
        {/* Brand Logo & Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            onClick={() => setAppMode('store')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
              }}
            >
              <ShoppingBag size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AERO<span style={{ color: 'var(--accent-secondary)' }}>NEXUS</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em', fontWeight: '700', textTransform: 'uppercase' }}>
                E-Commerce + CRM System
              </div>
            </div>
          </div>

          {/* Mode Switcher Pill (Store <-> CRM) */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '4px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
              marginLeft: '12px'
            }}
          >
            <button
              onClick={() => setAppMode('store')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: appMode === 'store' ? 'var(--accent-primary)' : 'transparent',
                color: appMode === 'store' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <ShoppingBag size={14} />
              Shopper Store
            </button>
            <button
              onClick={() => setAppMode('crm')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: appMode === 'crm' ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'transparent',
                color: appMode === 'crm' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <LayoutDashboard size={14} />
              CRM Portal
              {isAdmin && <span className="badge badge-primary" style={{ padding: '1px 5px', fontSize: '0.65rem' }}>Admin</span>}
            </button>
          </div>
        </div>

        {/* Right Action Icons & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* React Concepts Modal Opener */}
          <button
            onClick={openConceptsModal}
            className="btn btn-secondary btn-sm"
            style={{
              gap: '6px',
              background: 'rgba(139, 92, 246, 0.1)',
              borderColor: 'rgba(139, 92, 246, 0.3)',
              color: '#c4b5fd'
            }}
          >
            <Layers size={14} />
            <span>5 React Concepts</span>
          </button>

          {/* Shopper Store Actions */}
          {appMode === 'store' && (
            <>
              {/* Order History */}
              <button
                onClick={openOrderHistory}
                className="btn btn-secondary btn-sm"
                title="View Past Orders"
                style={{ gap: '6px' }}
              >
                <Clock size={15} />
                <span className="hidden-sm">My Orders</span>
              </button>

              {/* Customer Support */}
              <button
                onClick={openSupportModal}
                className="btn btn-secondary btn-sm"
                title="Customer Support Inquiries"
                style={{ gap: '6px' }}
              >
                <HelpCircle size={15} />
                <span className="hidden-sm">Support</span>
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="btn btn-primary btn-sm"
                style={{ position: 'relative', gap: '8px', padding: '8px 16px' }}
              >
                <ShoppingCart size={16} />
                <span>Cart</span>
                {totalItems > 0 && (
                  <span
                    style={{
                      background: 'var(--accent-secondary)',
                      color: '#0b0f17',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      borderRadius: 'var(--radius-full)',
                      padding: '1px 6px',
                      minWidth: '20px',
                      textAlign: 'center'
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </>
          )}

          {/* User Account / Auth Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {user.role === 'admin' ? (
                  <Shield size={16} color="#6366f1" />
                ) : (
                  <User size={16} color="#10b981" />
                )}
                <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>{user.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {user.role === 'admin' ? 'Store Manager' : 'Customer'}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                title="Sign Out"
                style={{ padding: '8px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => openAuthModal('login')}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px' }}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => switchDemoAccount('customer')}
                className="btn btn-sm"
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#6ee7b7',
                  gap: '4px'
                }}
                title="Quick 1-Click Login for Shopper"
              >
                <Sparkles size={13} />
                <span>Demo User</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
