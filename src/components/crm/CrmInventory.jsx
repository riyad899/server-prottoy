import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  X,
  Image as ImageIcon
} from 'lucide-react';

export const CrmInventory = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State (Controlled Form)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Electronics',
    image_url: '',
    rating: '4.8',
    is_featured: false
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.products.getAll({
        category: categoryFilter,
        search: searchQuery
      });
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'Electronics',
      image_url: '',
      rating: '4.8',
      is_featured: false
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description || '',
      price: prod.price.toString(),
      stock: prod.stock.toString(),
      category: prod.category,
      image_url: prod.image_url || '',
      rating: (prod.rating || 5.0).toString(),
      is_featured: Boolean(prod.is_featured)
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errs.price = 'Valid price greater than 0 required';
    }
    if (formData.stock === '' || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      errs.stock = 'Valid stock count (>= 0) required';
    }
    if (!formData.category.trim()) errs.category = 'Category is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        category: formData.category,
        image_url: formData.image_url.trim() || undefined,
        rating: parseFloat(formData.rating || 5.0),
        is_featured: formData.is_featured
      };

      if (editingProduct) {
        await api.products.update(editingProduct.id, payload);
        success(`Product '${formData.name}' updated in inventory.`);
      } else {
        await api.products.create(payload);
        success(`New product '${formData.name}' added to catalog.`);
      }

      setIsModalOpen(false);
      await fetchProducts();
    } catch (err) {
      toastError(err.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete '${name}' from inventory?`)) return;

    try {
      await api.products.delete(id);
      success(`Product deleted from catalog.`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toastError(err.message || 'Failed to delete product.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>
            CRM Inventory Control & Catalog Manager
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Add, update, adjust stock levels, and monitor low inventory items
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchProducts} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button onClick={handleOpenCreateModal} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inventory by title or description..."
            className="form-input"
            style={{ paddingLeft: '38px', height: '40px' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['All', 'Electronics', 'Fashion', 'Home & Living'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '6px 12px', fontSize: '0.75rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table (Showcases List .map()) */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="table-responsive">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Units</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No products found in inventory.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const isLow = prod.stock > 0 && prod.stock <= 10;
                  const isOut = prod.stock <= 0;

                  return (
                    <tr key={prod.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={prod.image_url}
                            alt=""
                            style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover', background: '#1f2937' }}
                          />
                          <div>
                            <div style={{ fontWeight: '600', color: '#fff' }}>{prod.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{prod.id}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="badge badge-primary">{prod.category}</span>
                      </td>

                      <td style={{ fontWeight: '700', color: '#67e8f9', fontSize: '0.95rem' }}>
                        ${Number(prod.price).toFixed(2)}
                      </td>

                      <td>
                        {isOut ? (
                          <span className="badge badge-danger">Out of Stock</span>
                        ) : isLow ? (
                          <span className="badge badge-warning">Low Stock ({prod.stock})</span>
                        ) : (
                          <span className="badge badge-success">In Stock</span>
                        )}
                      </td>

                      <td style={{ fontWeight: '700', color: '#fff' }}>
                        {prod.stock}
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '4px' }}
                            title="Edit Product"
                          >
                            <Edit2 size={13} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal (Controlled Form Control) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                {editingProduct ? `Edit Product #${editingProduct.id}` : 'Add New Catalog Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ultra-Fast Wireless Charger"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Price ($ USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="99.99"
                      className={`form-input ${errors.price ? 'error' : ''}`}
                    />
                    {errors.price && <div className="form-error">{errors.price}</div>}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Stock Quantity *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="25"
                      className={`form-input ${errors.stock ? 'error' : ''}`}
                    />
                    {errors.stock && <div className="form-error">{errors.stock}</div>}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="form-select"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home & Living">Home & Living</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Image URL (Unsplash or direct image link)</label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Detailed Product Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Key specifications, materials, and features..."
                    className="form-textarea"
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#fff' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                  <span>Mark as Featured Product in Storefront</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmInventory;
