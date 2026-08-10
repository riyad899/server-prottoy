import React, { useState } from 'react';
import { Layers, MousePointer, Cpu, ListFilter, FileText, CheckCircle2, X } from 'lucide-react';

export const ConceptsGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('components');

  if (!isOpen) return null;

  const concepts = [
    {
      id: 'components',
      title: '1. Components',
      icon: <Layers size={18} />,
      badge: 'Architecture & Hierarchy',
      summary: 'Modular, reusable building blocks composed into rich interfaces.',
      details: [
        { name: 'Navbar & Modals', desc: 'Reusable overlay dialogs for Auth, Checkout, Order History, and Support.' },
        { name: 'ProductCard & Catalog', desc: 'Encapsulates item display, hover states, rating stars, and cart action.' },
        { name: 'CRM Modules', desc: 'CrmDashboard, CrmOrders, CrmInventory, CrmCustomers, and CrmSupport.' },
        { name: 'Props & Children', desc: 'Seamlessly passing callback handlers, data objects, and slot elements.' }
      ]
    },
    {
      id: 'events',
      title: '2. Events',
      icon: <MousePointer size={18} />,
      badge: 'Interactive UI',
      summary: 'Comprehensive event handlers responding seamlessly to user interactions.',
      details: [
        { name: 'Form Submissions (onSubmit)', desc: 'preventDefault() used in Login, Register, Checkout, Product CRUD, and Support Chat.' },
        { name: 'Real-time Inputs (onChange)', desc: 'Live search debouncing, price range slider adjustments, and category dropdowns.' },
        { name: 'Button & Action Clicks (onClick)', desc: 'Cart drawers, status toggles, demo role switchers, and ticket resolutions.' },
        { name: 'Keyboard Navigation (onKeyDown)', desc: 'Submitting support messages with Enter, closing modals on Escape.' }
      ]
    },
    {
      id: 'state',
      title: '3. State',
      icon: <Cpu size={18} />,
      badge: 'useState / useContext',
      summary: 'Multi-tiered local and global state architecture across the application.',
      details: [
        { name: 'AuthContext (Global)', desc: 'Stores current user session, JWT token persistence, and role-based permissions.' },
        { name: 'CartContext (Global)', desc: 'Maintains cart items array, promo codes, drawer visibility, and live subtotal.' },
        { name: 'ToastContext (Global)', desc: 'Ephemeral notification queue with auto-dismiss timers.' },
        { name: 'Local Component State', desc: 'Search query, active filters, editing item IDs, modal steps, and loading flags.' }
      ]
    },
    {
      id: 'lists',
      title: '4. List Operations',
      icon: <ListFilter size={18} />,
      badge: 'Array Methods',
      summary: 'Active utilization of ES6 list manipulation methods across every screen.',
      details: [
        { name: '.map()', desc: 'Renders product grids, cart rows, order status steps, and analytics tables.' },
        { name: '.filter()', desc: 'Instant category filtering, search term matching, removing cart items, and ticket status filters.' },
        { name: '.reduce()', desc: 'Computes total cart quantity, discount subtotals, CRM lifetime customer spend, and total sales revenue.' },
        { name: '.sort() & .find()', desc: 'Sorts products by price/rating and locates existing cart items to update quantities.' }
      ]
    },
    {
      id: 'forms',
      title: '5. Form Control',
      icon: <FileText size={18} />,
      badge: 'Controlled Inputs',
      summary: 'Strict two-way data binding with dynamic validation and error feedback.',
      details: [
        { name: 'Controlled State', desc: 'Inputs bound to React state: value={formData.field} onChange={handleChange}.' },
        { name: 'Checkout Form', desc: 'Multi-step validation for Shipping Name, Address, City, ZIP, and simulated Payment Card.' },
        { name: 'Inventory Management Form', desc: 'Admin product creator with numeric parsing for Price & Stock, category selectors, and image previews.' },
        { name: 'Support System Form', desc: 'Customer ticket creator with priority pickers and live threaded messaging.' }
      ]
    }
  ];

  const currentConcept = concepts.find((c) => c.id === activeTab);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Layers size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>React Core Concepts Showcase</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Demonstrating all 5 required curriculum concepts in action
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '12px',
              marginBottom: '20px',
              overflowX: 'auto'
            }}
          >
            {concepts.map((concept) => (
              <button
                key={concept.id}
                onClick={() => setActiveTab(concept.id)}
                className={`btn btn-sm ${activeTab === concept.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '8px', gap: '6px' }}
              >
                {concept.icon}
                <span>{concept.title}</span>
              </button>
            ))}
          </div>

          {/* Active Concept Details */}
          {currentConcept && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}
              >
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
                  {currentConcept.title}
                </h3>
                <span className="badge badge-primary">{currentConcept.badge}</span>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                {currentConcept.summary}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {currentConcept.details.map((item, idx) => (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#f3f4f6', marginBottom: '4px' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Got it, explore app!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConceptsGuideModal;
