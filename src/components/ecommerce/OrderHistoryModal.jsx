import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Clock, Package, CheckCircle, Truck, AlertCircle, X, RefreshCw, ChevronRight } from 'lucide-react';

export const OrderHistoryModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.orders.getMyOrders();
      setOrders(res.orders || []);
      if (res.orders?.length > 0 && !selectedOrder) {
        setSelectedOrder(res.orders[0]);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered': return 'badge-success';
      case 'Shipped': return 'badge-info';
      case 'Processing': return 'badge-primary';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  const getStepIndex = (status) => {
    if (status === 'Cancelled') return -1;
    return steps.indexOf(status);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Clock size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>My Order History & Live Tracking</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Track fulfillment progress and view receipts
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={fetchOrders}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 12px' }}
              title="Refresh Orders"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {!user ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <AlertCircle size={40} style={{ margin: '0 auto 12px', color: 'var(--accent-warning)' }} />
              <div style={{ fontWeight: '600', fontSize: '1rem', color: '#fff' }}>Sign in required</div>
              <p style={{ fontSize: '0.875rem', marginTop: '4px' }}>
                Please sign in to view your personalized purchase history and tracking details.
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <Package size={44} style={{ margin: '0 auto 12px', color: 'var(--border-glow)' }} />
              <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#fff' }}>No Orders Found</div>
              <p style={{ fontSize: '0.875rem', marginTop: '4px' }}>
                You haven't placed any orders yet. Add items to your cart and experience our instant checkout!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '20px' }}>
              {/* Order List Column (Showcases List .map()) */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  maxHeight: '480px',
                  overflowY: 'auto',
                  paddingRight: '6px'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Orders Placed ({orders.length})
                </div>

                {orders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="glass-card"
                      style={{
                        padding: '14px',
                        cursor: 'pointer',
                        borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', color: '#fff' }}>Order #{order.id}</span>
                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span>{new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span style={{ fontWeight: '700', color: '#67e8f9' }}>${Number(order.total_amount).toFixed(2)}</span>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {order.items?.length || 0} items • {order.payment_method}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Order Detail View */}
              {selectedOrder && (
                <div
                  className="glass-card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    background: 'rgba(17, 24, 39, 0.8)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                        Order #{selectedOrder.id}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(selectedOrder.status)}`} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  {/* Fulfillment Status Tracker Visualizer */}
                  {selectedOrder.status !== 'Cancelled' ? (
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>
                        Fulfillment Progress
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                        {steps.map((st, idx) => {
                          const currentStepIdx = getStepIndex(selectedOrder.status);
                          const isDone = idx <= currentStepIdx;
                          const isCurrent = idx === currentStepIdx;

                          return (
                            <div key={st} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: isDone ? '#10b981' : '#1f2937',
                                  color: isDone ? '#fff' : 'var(--text-muted)',
                                  border: isCurrent ? '3px solid #6ee7b7' : '2px solid rgba(255, 255, 255, 0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: '700',
                                  fontSize: '0.8rem',
                                  transition: 'all 0.3s'
                                }}
                              >
                                {isDone ? <CheckCircle size={16} /> : idx + 1}
                              </div>
                              <span style={{ fontSize: '0.75rem', color: isDone ? '#fff' : 'var(--text-muted)', marginTop: '6px', fontWeight: isDone ? '600' : 'normal' }}>
                                {st}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.85rem' }}>
                      This order was cancelled. Please contact customer support if you have questions.
                    </div>
                  )}

                  {/* Itemized list */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase' }}>
                      Purchased Items
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                      {selectedOrder.items?.map((it, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '6px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {it.product_image && (
                              <img src={it.product_image} alt="" style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                            )}
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>{it.product_name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Qty: {it.quantity} × ${Number(it.unit_price).toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#67e8f9' }}>
                            ${(Number(it.unit_price) * it.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Destination and Summary */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Ship To:</div>
                      <div style={{ color: '#e5e7eb', marginTop: '2px' }}>{selectedOrder.shipping_address}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--text-muted)' }}>Total Amount:</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#67e8f9', marginTop: '2px' }}>
                        ${Number(selectedOrder.total_amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryModal;
