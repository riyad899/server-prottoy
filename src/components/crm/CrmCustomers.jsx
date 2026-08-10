import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Search, RefreshCw, Eye, ShoppingBag, DollarSign, Calendar, MapPin, X } from 'lucide-react';

export const CrmCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetailsLoading, setCustomerDetailsLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.crm.getCustomers();
      setCustomers(res.customers || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleInspectCustomer = async (id) => {
    setCustomerDetailsLoading(true);
    try {
      const res = await api.crm.getCustomerById(id);
      setSelectedCustomer(res.customer);
    } catch (err) {
      console.error('Failed to fetch customer profile details:', err);
    } finally {
      setCustomerDetailsLoading(false);
    }
  };

  // List Operations .filter()
  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>
            CRM Customer Directory & Lifetime Value
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Track shopper engagement, order frequencies, and lifetime revenue contribution
          </p>
        </div>

        <button onClick={fetchCustomers} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Customers</span>
        </button>
      </div>

      {/* Search Bar (Form Control) */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, email, or phone..."
            className="form-input"
            style={{ paddingLeft: '38px', height: '40px' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        </div>
      </div>

      {/* Customer Profiles Table (Showcases List .map()) */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="table-responsive">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Member Since</th>
                <th>Total Orders</th>
                <th>Lifetime Spend (LTV)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No registered customers match your search query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: '#fff' }}>{cust.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{cust.id}</div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>{cust.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cust.phone || 'No phone'}</div>
                    </td>

                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(cust.created_at).toLocaleDateString()}
                    </td>

                    <td style={{ fontWeight: '700', color: '#fff' }}>
                      {cust.total_orders} orders
                    </td>

                    <td style={{ fontWeight: '800', color: '#6ee7b7', fontSize: '0.95rem' }}>
                      ${Number(cust.lifetime_spend).toFixed(2)}
                    </td>

                    <td>
                      <span className={`badge ${cust.total_orders > 0 ? 'badge-success' : 'badge-primary'}`}>
                        {cust.status}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() => handleInspectCustomer(cust.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '4px' }}
                      >
                        <Eye size={14} />
                        <span>View Orders</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Drilldown Modal */}
      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                  Customer Profile: {selectedCustomer.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {selectedCustomer.email} • ID #{selectedCustomer.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* LTV & Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div className="glass-card" style={{ padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LIFETIME SPEND</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#6ee7b7', marginTop: '4px' }}>
                    ${Number(selectedCustomer.lifetime_spend).toFixed(2)}
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL ORDERS</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
                    {selectedCustomer.total_orders}
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MEMBER SINCE</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#a5b4fc', marginTop: '6px' }}>
                    {new Date(selectedCustomer.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Address details */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>REGISTERED SHIPPING ADDRESS</div>
                <div style={{ fontSize: '0.85rem', color: '#e5e7eb', marginTop: '4px' }}>
                  {selectedCustomer.address || 'No default address stored on file'}
                </div>
              </div>

              {/* Purchase History */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Purchase Order History ({selectedCustomer.orders?.length || 0})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                  {selectedCustomer.orders?.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px' }}>
                      No orders placed by this customer yet.
                    </div>
                  ) : (
                    selectedCustomer.orders?.map((ord) => (
                      <div
                        key={ord.id}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(255, 255, 255, 0.03)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.875rem' }}>Order #{ord.id}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(ord.created_at).toLocaleDateString()} • {ord.payment_method}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className="badge badge-primary">{ord.status}</span>
                          <span style={{ fontWeight: '700', color: '#67e8f9', fontSize: '0.95rem' }}>
                            ${Number(ord.total_amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedCustomer(null)} className="btn btn-primary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmCustomers;
