import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  CreditCard,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  X,
  Truck,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export const CheckoutModal = ({ isOpen, onClose, onOrderPlaced }) => {
  const { user } = useAuth();
  const { items, clearCart, grandTotal, subtotal, tax, shipping, discountAmount } = useCart();
  const { success, error: toastError } = useToast();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: 'New York',
    zip: '10001',
    paymentMethod: 'Credit Card',
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isOpen) return null;

  const validateShipping = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    if (!formData.address.trim()) errs.address = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.zip.trim()) errs.zip = 'ZIP code is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateShipping()) {
      setStep(2);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullShippingAddress = `${formData.address}, ${formData.city}, ${formData.zip} (Phone: ${formData.phone || 'N/A'})`;

    try {
      const payload = {
        items: items.map((it) => ({
          product_id: it.id,
          id: it.id,
          quantity: it.quantity,
          unit_price: it.price
        })),
        shipping_address: fullShippingAddress,
        payment_method: formData.paymentMethod
      };

      const res = await api.orders.checkout(payload);
      setPlacedOrder(res.order);
      clearCart();
      success('Order placed successfully! Receipt generated.');
      setStep(3);
      if (onOrderPlaced) onOrderPlaced(res.order);
    } catch (err) {
      toastError(err.message || 'Failed to complete checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={step === 3 ? onClose : undefined}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Lock size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Secure Checkout Flow</h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {step === 1 ? 'Step 1 of 2: Shipping Destination' : step === 2 ? 'Step 2 of 2: Payment & Review' : 'Order Confirmed'}
              </div>
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

        {/* Progress Bar */}
        <div style={{ display: 'flex', height: '4px', background: 'rgba(255, 255, 255, 0.05)' }}>
          <div
            style={{
              width: step === 1 ? '50%' : '100%',
              background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-success))',
              transition: 'width 0.3s ease'
            }}
          />
        </div>

        <div className="modal-body">
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <MapPin size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Shipping Information</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Jane Doe"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jane@example.com"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="742 Evergreen Terrace"
                  className={`form-input ${errors.address ? 'error' : ''}`}
                />
                {errors.address && <div className="form-error">{errors.address}</div>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Springfield"
                    className={`form-input ${errors.city ? 'error' : ''}`}
                  />
                  {errors.city && <div className="form-error">{errors.city}</div>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">ZIP Code *</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="97477"
                    className={`form-input ${errors.zip ? 'error' : ''}`}
                  />
                  {errors.zip && <div className="form-error">{errors.zip}</div>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Payment & Order Confirmation */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="var(--accent-secondary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Payment Method</h3>
              </div>

              {/* Payment Method Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {['Credit Card', 'PayPal', 'Apple Pay'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: method }))}
                    className={`btn btn-sm ${formData.paymentMethod === method ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '12px 8px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {/* Simulated Card Form */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Expires</label>
                    <input
                      type="text"
                      name="cardExp"
                      value={formData.cardExp}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">CVC Code</label>
                    <input
                      type="text"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Order Items Preview */}
              <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  PURCHASE SUMMARY ({items.length} unique items)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {items.map((it) => (
                    <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                      <span style={{ color: '#e5e7eb' }}>
                        {it.name} <span style={{ color: 'var(--text-muted)' }}>× {it.quantity}</span>
                      </span>
                      <span style={{ color: '#fff', fontWeight: '600' }}>
                        ${(it.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    fontWeight: '800',
                    fontSize: '1rem',
                    color: '#67e8f9'
                  }}
                >
                  <span>Grand Total to Pay:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Order Success Screen */}
          {step === 3 && placedOrder && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '20px 0',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981'
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
                  Order Confirmed!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
                  Thank you, <strong style={{ color: '#fff' }}>{formData.name}</strong>. Your order has been placed into our fulfillment pipeline.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div
                className="glass-card"
                style={{
                  width: '100%',
                  padding: '18px',
                  textAlign: 'left',
                  background: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Order Reference:</span>
                  <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>#{placedOrder.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                  <span className="badge badge-warning">{placedOrder.status || 'Pending'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Paid:</span>
                  <span style={{ fontWeight: '700', color: '#67e8f9' }}>${Number(placedOrder.total_amount).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Delivery Destination:</span>
                  <span style={{ color: '#e5e7eb', maxWidth: '60%', textAlign: 'right' }}>{placedOrder.shipping_address}</span>
                </div>
              </div>

              <button onClick={onClose} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        {step !== 3 && (
          <div className="modal-footer">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px' }}
                disabled={isSubmitting}
              >
                <ArrowLeft size={15} />
                <span>Back to Shipping</span>
              </button>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
                style={{ gap: '8px' }}
              >
                <span>Continue to Payment</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="btn btn-success btn-lg"
                style={{ gap: '8px' }}
              >
                <CheckCircle2 size={18} />
                <span>{isSubmitting ? 'Processing Payment...' : `Confirm & Pay $${grandTotal.toFixed(2)}`}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
