import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ShoppingBag, Search, Filter, RefreshCw, Eye, CheckCircle2, Truck, X } from 'lucide-react';

export const CrmOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { success, error: toastError } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.orders.getAll({
        status: statusFilter,
        search: searchQuery
      });
      setOrders(res.orders || []);
    } catch (err) {
      console.error('Failed to load orders for CRM:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.orders.updateStatus(orderId, newStatus);
      success(`Order #${orderId} status updated to '${newStatus}'.`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toastError(err.message || 'Failed to update order status.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return 'badge-success';
      case 'Shipped': return 'badge-info';
      case 'Processing': return 'badge-primary';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>
            CRM Order Management & Fulfillment
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            View, track, and update fulfillment lifecycle for all customer orders
          </p>
        </div>

        <button onClick={fetchOrders} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, or order ID..."
            className="form-input"
            style={{ paddingLeft: '38px', height: '40px' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '6px 12px', fontSize: '0.75rem' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table (Showcases List .map()) */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="table-responsive">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer Info</th>
                <th>Items</th>
                <th>Total Value</th>
                <th>Current Status</th>
                <th>Update Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No customer orders match the selected criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id}>
                    <td style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>
                      #{ord.id}
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                        {new Date(ord.created_at).toLocaleDateString()}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: '600', color: '#fff' }}>{ord.customer_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.customer_email}</div>
                    </td>

                    <td style={{ fontSize: '0.8rem', color: '#e5e7eb' }}>
                      {ord.items?.length || 1} items
                    </td>

                    <td style={{ fontWeight: '800', color: '#67e8f9', fontSize: '0.95rem' }}>
                      ${Number(ord.total_amount).toFixed(2)}
                    </td>

                    <td>
                      <span className={`badge ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>

                    {/* Status Dropdown (Events: onChange, Form Control) */}
                    <td>
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', height: '32px', minWidth: '120px' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td>
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '4px' }}
                      >
                        <Eye size={14} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                  CRM Order Review #{selectedOrder.id}
                </h3>
                <span className={`badge ${getStatusBadge(selectedOrder.status)}`} style={{ marginTop: '4px' }}>
                  {selectedOrder.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Customer & Shipping Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>CUSTOMER</div>
                  <div style={{ fontWeight: '600', color: '#fff', marginTop: '2px' }}>{selectedOrder.customer_name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{selectedOrder.customer_email}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>DESTINATION ADDRESS</div>
                  <div style={{ fontSize: '0.85rem', color: '#e5e7eb', marginTop: '2px' }}>
                    {selectedOrder.shipping_address}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Purchased Items
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedOrder.items?.map((it, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {it.product_image && (
                          <img src={it.product_image} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                        )}
                        <div>
                          <div style={{ fontWeight: '600', color: '#fff', fontSize: '0.875rem' }}>{it.product_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Quantity: {it.quantity} × ${Number(it.unit_price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: '700', color: '#67e8f9' }}>
                        ${(Number(it.unit_price) * it.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Payment Method: <strong>{selectedOrder.payment_method}</strong></span>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#67e8f9' }}>
                  Total: ${Number(selectedOrder.total_amount).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedOrder(null)} className="btn btn-primary btn-sm">
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmOrders;
