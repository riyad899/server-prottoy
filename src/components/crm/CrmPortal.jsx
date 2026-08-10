import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import CrmDashboard from './CrmDashboard';
import CrmOrders from './CrmOrders';
import CrmInventory from './CrmInventory';
import CrmCustomers from './CrmCustomers';
import CrmSupport from './CrmSupport';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  MessageSquare,
  Shield,
  Sparkles,
  Lock
} from 'lucide-react';

export const CrmPortal = ({ openAuthModal }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, isAdmin, switchDemoAccount } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Analytics', icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: 'Order Management', icon: <ShoppingBag size={18} /> },
    { id: 'inventory', label: 'Inventory Control', icon: <Package size={18} /> },
    { id: 'customers', label: 'Customer Profiles', icon: <Users size={18} /> },
    { id: 'support', label: 'Support Desk', icon: <MessageSquare size={18} /> }
  ];

  // If user is not logged in as Admin, show an elegant Admin Gate with 1-Click Demo Login
  if (!isAdmin) {
    return (
      <div style={{ padding: '60px 0' }}>
        <div
          className="glass-panel"
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            padding: '40px 32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Shield size={28} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>
            CRM Merchant Portal
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Administrative tools for real-time inventory management, order fulfillment, customer relationship profiles, support ticketing, and revenue analytics.
          </p>

          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px dashed rgba(99, 102, 241, 0.3)',
              width: '100%',
              marginTop: '8px'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#a5b4fc', marginBottom: '8px' }}>
              ⚡ QUICK 1-CLICK ACCESS FOR TESTING & EVALUATION
            </div>
            <button
              onClick={() => switchDemoAccount('admin')}
              className="btn btn-primary"
              style={{ width: '100%', gap: '8px' }}
            >
              <Sparkles size={16} />
              <span>Sign In as Demo CRM Admin / Manager</span>
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Or{' '}
            <button
              onClick={() => openAuthModal('login')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              sign in with custom admin credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 0 64px 0' }}>
      {/* Sub-Navigation Tabs */}
      <div
        className="glass-panel"
        style={{
          padding: '8px',
          marginBottom: '28px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto'
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                borderRadius: 'var(--radius-md)',
                padding: '10px 18px',
                gap: '8px',
                border: isActive ? 'none' : '1px solid transparent'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'dashboard' && <CrmDashboard onNavigateTab={(tab) => setActiveTab(tab)} />}
      {activeTab === 'orders' && <CrmOrders />}
      {activeTab === 'inventory' && <CrmInventory />}
      {activeTab === 'customers' && <CrmCustomers />}
      {activeTab === 'support' && <CrmSupport />}
    </div>
  );
};

export default CrmPortal;
