import React from 'react';
import { useCart } from '../../context/CartContext';
import { Star, ShoppingCart, Eye, AlertCircle, Check } from 'lucide-react';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Product Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '65%',
          backgroundColor: '#1f2937',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image_url}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />

        {/* Category Pill */}
        <span
          className="badge"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(17, 24, 39, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#e5e7eb',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          {product.category}
        </span>

        {/* Stock Badge */}
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          {isOutOfStock ? (
            <span className="badge badge-danger">Out of Stock</span>
          ) : isLowStock ? (
            <span className="badge badge-warning" style={{ animation: 'pulseGlow 2s infinite' }}>
              Only {product.stock} left
            </span>
          ) : (
            <span className="badge badge-success">In Stock</span>
          )}
        </div>
      </div>

      {/* Product Content */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '10px' }}>
        {/* Rating and Reviews */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#f9fafb' }}>
            {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Verified)</span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onQuickView(product)}
          style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: '#f9fafb',
            cursor: 'pointer',
            lineHeight: '1.3',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6rem'
          }}
        >
          {product.name}
        </h3>

        {/* Product Description */}
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexGrow: 1
          }}
        >
          {product.description}
        </p>

        {/* Price & Action Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '10px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#67e8f9' }}>
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onQuickView(product)}
              className="btn btn-secondary btn-sm"
              title="Quick Details"
              style={{ padding: '8px' }}
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
              className="btn btn-primary btn-sm"
              style={{ gap: '6px' }}
            >
              <ShoppingCart size={15} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
