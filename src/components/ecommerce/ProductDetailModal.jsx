import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Star, ShoppingCart, Check, ShieldCheck, Truck, RefreshCw, X, Plus, Minus } from 'lucide-react';

export const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="badge badge-primary">{product.category}</span>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Image */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: '#1e293b', maxHeight: '380px' }}>
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: '#f59e0b' }}>
                <Star size={16} fill="#f59e0b" />
                <span style={{ marginLeft: '4px', fontWeight: '700', color: '#fff', fontSize: '0.9rem' }}>
                  {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
                </span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>• 128 Customer Reviews</span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', lineHeight: '1.2' }}>
              {product.name}
            </h2>

            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#67e8f9' }}>
              ${Number(product.price).toFixed(2)}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              {product.description}
            </p>

            {/* Stock status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Availability:</span>
              {isOutOfStock ? (
                <span className="badge badge-danger">Out of Stock</span>
              ) : isLowStock ? (
                <span className="badge badge-warning">Low Stock ({product.stock} units left)</span>
              ) : (
                <span className="badge badge-success">In Stock ({product.stock} units available)</span>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  Quantity:
                </span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    padding: '2px'
                  }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 10px', border: 'none' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ minWidth: '36px', textAlign: 'center', fontWeight: '700', fontSize: '0.9rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 10px', border: 'none' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn btn-primary"
                style={{ flex: 1, gap: '8px' }}
              >
                <ShoppingCart size={18} />
                <span>Add {quantity} to Cart • ${(Number(product.price) * quantity).toFixed(2)}</span>
              </button>
            </div>

            {/* Perks */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginTop: '12px',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <Truck size={16} color="#6366f1" style={{ margin: '0 auto 4px' }} />
                <span>Free Shipping</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={16} color="#10b981" style={{ margin: '0 auto 4px' }} />
                <span>2-Year Warranty</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <RefreshCw size={16} color="#06b6d4" style={{ margin: '0 auto 4px' }} />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
