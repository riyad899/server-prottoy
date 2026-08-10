import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, X, ShoppingBag } from 'lucide-react';

export const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    couponCode,
    discountPercent,
    discountAmount,
    totalItems,
    subtotal,
    tax,
    shipping,
    grandTotal
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon) {
      applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  return (
    <>
      <div className="drawer-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="drawer-content">
        {/* Header */}
        <div className="modal-header" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingCart size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Your Shopping Cart</h3>
            <span className="badge badge-primary">{totalItems} items</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Cart Item List (Showcases React List .map()) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                gap: '12px',
                color: 'var(--text-muted)'
              }}
            >
              <ShoppingBag size={48} strokeWidth={1.5} color="var(--border-glow)" />
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Your cart is empty
              </div>
              <p style={{ fontSize: '0.825rem', maxWidth: '240px' }}>
                Explore our catalog and add premium gadgets to your cart!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn btn-primary btn-sm"
                style={{ marginTop: '8px' }}
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  padding: '12px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                    backgroundColor: '#1f2937'
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#f9fafb',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#67e8f9', fontWeight: '700', marginTop: '2px' }}>
                    ${Number(item.price).toFixed(2)}
                  </div>

                  {/* Quantity Stepper (Events: onClick) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(0, 0, 0, 0.4)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fff',
                          padding: '3px 7px',
                          cursor: 'pointer'
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', minWidth: '24px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fff',
                          padding: '3px 7px',
                          cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                          opacity: item.quantity >= item.stock ? 0.3 : 1
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-danger)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Line Item Total */}
                <div style={{ textAlign: 'right', fontWeight: '700', fontSize: '0.9rem', color: '#fff' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Summary (Only if items exist) */}
        {items.length > 0 && (
          <div
            style={{
              padding: '20px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(15, 23, 42, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* Promo Code Input (Controlled Form) */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Coupon (e.g. REACT2026)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '32px', fontSize: '0.8rem', padding: '8px 12px 8px 32px' }}
                />
                <Tag size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              </div>
              <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '8px 14px' }}>
                Apply
              </button>
            </form>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal ({totalItems} items):</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>${subtotal.toFixed(2)}</span>
              </div>

              {discountPercent > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Discount ({couponCode} - {discountPercent}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Tax (8%):</span>
                <span style={{ color: '#fff' }}>${tax.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping:</span>
                <span>
                  {shipping === 0 ? (
                    <span style={{ color: '#10b981', fontWeight: '600' }}>FREE (Orders &gt; $100)</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  color: '#fff',
                  paddingTop: '8px',
                  borderTop: '1px dashed var(--border-subtle)',
                  marginTop: '4px'
                }}
              >
                <span>Total:</span>
                <span style={{ color: '#67e8f9' }}>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', gap: '8px' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
