import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(300);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Selected product for detailed modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.products.getAll({
          category: selectedCategory,
          search: searchQuery,
          maxPrice,
          sortBy,
          inStockOnly: inStockOnly ? 'true' : 'false'
        }),
        api.products.getCategories()
      ]);

      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedCategory, sortBy, inStockOnly]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatalog();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, maxPrice]);

  return (
    <div style={{ padding: '32px 0 64px 0' }}>
      {/* Hero Banner with Modern Aesthetic */}
      <div
        className="glass-panel"
        style={{
          padding: '36px 32px',
          marginBottom: '36px',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)'
        }}
      >
        <div style={{ maxWidth: '650px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: '700', marginBottom: '14px' }}>
            <Sparkles size={14} />
            <span>2026 PREMIUM STOREFRONT & CRM PLATFORM</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', lineHeight: '1.15', letterSpacing: '-0.03em', color: '#fff', marginBottom: '12px' }}>
            Next-Gen E-Commerce with Integrated CRM.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '20px' }}>
            Experience instant cart calculations, multi-step checkout, real-time order tracking, and live merchant CRM inventory management.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#6ee7b7' }}>
              <CheckCircle2 size={16} />
              <span>Full React State & Reducers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#67e8f9' }}>
              <CheckCircle2 size={16} />
              <span>PostgreSQL & Neon DB Backed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#c4b5fd' }}>
              <CheckCircle2 size={16} />
              <span>Live CRM Management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '20px',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {/* Top Filter Row: Search & Sort */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '14px', alignItems: 'center' }}>
          {/* Search Input (Events: onChange, Form Control) */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name, specs or category..."
              className="form-input"
              style={{ paddingLeft: '40px', height: '44px' }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector (Events: onChange) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', whiteSpace: 'nowrap' }}>
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ minWidth: '150px', height: '44px' }}
            >
              <option value="featured">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          {/* Stock Filter Checkbox */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              whiteSpace: 'nowrap'
            }}
          >
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
            <span>In Stock Only</span>
          </label>
        </div>

        {/* Category Pills & Price Slider */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          {/* Category Filter Pills (Showcases List .map() and Events: onClick) */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`btn btn-sm ${selectedCategory === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.category}
                onClick={() => setSelectedCategory(c.category)}
                className={`btn btn-sm ${selectedCategory === c.category ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                <span>{c.category}</span>
                <span style={{ opacity: 0.7, fontSize: '0.75rem', marginLeft: '4px' }}>({c.count})</span>
              </button>
            ))}
          </div>

          {/* Price Range Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Max Price: <strong style={{ color: '#67e8f9' }}>${maxPrice}</strong>
            </span>
            <input
              type="range"
              min="20"
              max="300"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ accentColor: 'var(--accent-secondary)', width: '120px', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Catalog Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
            {selectedCategory === 'All' ? 'All Catalog Products' : `${selectedCategory} Collection`}
          </h2>
          <span className="badge badge-primary">{products.length} products</span>
        </div>

        <button onClick={fetchCatalog} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Product Grid (Showcases List .map()) */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-card" style={{ height: '380px', opacity: 0.4, animation: 'pulseGlow 1.5s infinite' }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <ShoppingBag size={48} color="var(--border-glow)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>No matching products found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '360px' }}>
            Try adjusting your search keywords, price filter slider, or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setMaxPrice(300);
            }}
            className="btn btn-primary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Quick View Product Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default ProductCatalog;
