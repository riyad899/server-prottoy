import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  Package,
  Clock,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

export const CrmDashboard = ({ onNavigateTab }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.crm.getAnalytics();
      setMetrics(res.metrics);
    } catch (err) {
      console.error('Failed to load CRM analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !metrics) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading CRM Business Metrics...</div>
      </div>
    );
  }

  const {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    lowStockCount,
    orderStatusBreakdown,
    lowStockProducts,
    categorySales,
    recentOrders
  } = metrics;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
            CRM Analytics & Performance Dashboard
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Centralized business intelligence, inventory alerts, and real-time revenue telemetry
          </p>
        </div>

        <button onClick={fetchAnalytics} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* 4 Key Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px' }}>
        {/* Total Revenue */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Total Revenue</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#6ee7b7' }}>
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} color="#10b981" />
            <span style={{ color: '#10b981', fontWeight: '600' }}>Active Sales</span> from online shoppers
          </div>
        </div>

        {/* Total Orders */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Total Orders</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="stat-value">{totalOrders}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Pending: {orderStatusBreakdown?.['Pending'] || 0} • Shipped: {orderStatusBreakdown?.['Shipped'] || 0}
          </div>
        </div>

        {/* Total Customers */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Registered Shoppers</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="stat-value">{totalCustomers}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Centralized customer profiles
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="stat-card" style={{ borderColor: lowStockCount > 0 ? 'rgba(245, 158, 11, 0.4)' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Low Inventory Alerts</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: lowStockCount > 0 ? '#fcd34d' : '#10b981' }}>
            {lowStockCount} <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>items</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: lowStockCount > 0 ? '#fcd34d' : 'var(--text-muted)' }}>
            {lowStockCount > 0 ? 'Requires stock replenishment' : 'All stock levels healthy'}
          </div>
        </div>
      </div>

      {/* Middle Grid: Category Sales & Low Stock Alerts Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Category Revenue Distribution */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Revenue by Category</h3>
            <span className="badge badge-info">{categorySales?.length || 0} Categories</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categorySales?.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No category sales recorded yet.</div>
            ) : (
              categorySales?.map((cat) => {
                const percentage = totalRevenue > 0 ? ((cat.revenue / totalRevenue) * 100).toFixed(1) : 0;
                return (
                  <div key={cat.category} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: '600', color: '#fff' }}>{cat.category}</span>
                      <span style={{ color: '#67e8f9', fontWeight: '700' }}>
                        ${cat.revenue.toFixed(2)} ({percentage}%)
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.max(8, percentage)}%`,
                          background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                          borderRadius: '99px'
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Low Stock Warning List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
              Inventory Warning Monitor
            </h3>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('inventory')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              >
                Manage Inventory
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
            {lowStockProducts?.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#10b981', fontSize: '0.85rem' }}>
                ✅ All inventory items have adequate stock above 10 units.
              </div>
            ) : (
              lowStockProducts?.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#fff' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.category} • ${Number(p.price).toFixed(2)}</div>
                  </div>
                  <span className="badge badge-warning" style={{ fontWeight: '800' }}>
                    {p.stock} in stock
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Recent Shopper Orders</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live feed of the latest orders</p>
          </div>
          {onNavigateTab && (
            <button onClick={() => onNavigateTab('orders')} className="btn btn-primary btn-sm">
              View All Orders
            </button>
          )}
        </div>

        <div className="table-responsive">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date Placed</th>
                <th>Total</th>
                <th>Fulfillment Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((ord) => (
                <tr key={ord.id}>
                  <td style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>#{ord.id}</td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#fff' }}>{ord.customer_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.customer_email}</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{new Date(ord.created_at).toLocaleDateString()}</td>
                  <td style={{ fontWeight: '700', color: '#67e8f9' }}>${Number(ord.total_amount).toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        ord.status === 'Delivered'
                          ? 'badge-success'
                          : ord.status === 'Shipped'
                          ? 'badge-info'
                          : ord.status === 'Processing'
                          ? 'badge-primary'
                          : ord.status === 'Cancelled'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CrmDashboard;
