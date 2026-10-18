import React, { useState, useEffect } from 'react';
import * as dataService from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Package,
  ShoppingBag,
  DollarSign,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  X,
  Search,
  Sparkles,
  Layers
} from 'lucide-react';

const FAMILIES = ['Floral', 'Woody', 'Citrus', 'Oriental', 'Fresh'];
const GENDERS = ['Unisex', 'Women', 'Men'];
const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function Admin() {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search filter for products
  const [productSearch, setProductSearch] = useState('');

  // Add/Edit Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalForm, setModalForm] = useState({
    name: '',
    brand: 'Maison Botanique',
    price: 130,
    family: 'Floral',
    gender: 'Unisex',
    notesTop: '',
    notesMiddle: '',
    notesBase: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    stock: 25,
    isFeatured: false
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        dataService.getProducts(),
        dataService.getAllOrders()
      ]);
      setProducts(prods);
      setOrders(ords);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Open modal for new product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setModalForm({
      name: '',
      brand: 'Maison Botanique',
      price: 135,
      family: 'Floral',
      gender: 'Unisex',
      notesTop: 'Bergamot, Pink Pepper',
      notesMiddle: 'Damask Rose, Jasmine',
      notesBase: 'Cedarwood, Amber, White Musk',
      description: 'An ethereal handcrafted botanical formulation distilled in micro batches.',
      imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      stock: 20,
      isFeatured: false
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setModalForm({
      name: p.name,
      brand: p.brand,
      price: p.price,
      family: p.family,
      gender: p.gender,
      notesTop: p.notesTop,
      notesMiddle: p.notesMiddle,
      notesBase: p.notesBase,
      description: p.description,
      imageUrl: p.imageUrl,
      stock: p.stock,
      isFeatured: p.isFeatured || false
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!modalForm.name.trim()) {
      setFormError('Please enter a fragrance name.');
      return;
    }

    try {
      if (editingProduct) {
        const updated = await dataService.updateProduct(editingProduct.id, modalForm);
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      } else {
        const created = await dataService.createProduct(modalForm);
        setProducts(prev => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save product.');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you certain you wish to retire "${name}" from the catalog?`)) {
      try {
        await dataService.deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (err) {
        alert('Failed to delete product.');
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await dataService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalItemsSold = orders.reduce((acc, o) => acc + (o.items ? o.items.reduce((s, i) => s + i.quantity, 0) : 0), 0);
  const lowStockCount = products.filter(p => p.stock < 15).length;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.family.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold-700">
              Conservatory Management
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sage-950 mt-1">
            Artisan Curator Dashboard
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-sage-800 hover:bg-sage-900 text-cream-50 px-5 py-3 rounded-full text-xs uppercase font-semibold tracking-wider transition shadow-soft self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Fragrance</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 p-5 rounded-2xl border border-sage-200/80 shadow-soft">
          <div className="flex items-center justify-between text-sage-500 mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider">Catalog Size</span>
            <Layers size={18} className="text-sage-700" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-sage-950">{products.length}</div>
          <p className="text-[11px] text-sage-500 mt-1">Active perfume formulations</p>
        </div>

        <div className="bg-white/80 p-5 rounded-2xl border border-sage-200/80 shadow-soft">
          <div className="flex items-center justify-between text-sage-500 mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider">Acquisitions</span>
            <Package size={18} className="text-sage-700" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-sage-950">{orders.length}</div>
          <p className="text-[11px] text-sage-500 mt-1">{totalItemsSold} flacons dispatched</p>
        </div>

        <div className="bg-white/80 p-5 rounded-2xl border border-sage-200/80 shadow-soft">
          <div className="flex items-center justify-between text-sage-500 mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider">Total Revenue</span>
            <DollarSign size={18} className="text-gold-600" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-sage-950">${totalRevenue.toFixed(2)}</div>
          <p className="text-[11px] text-sage-500 mt-1">Gross sales</p>
        </div>

        <div className="bg-white/80 p-5 rounded-2xl border border-sage-200/80 shadow-soft">
          <div className="flex items-center justify-between text-sage-500 mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider">Restock Alerts</span>
            <ShoppingBag size={18} className="text-amber-600" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-sage-950">{lowStockCount}</div>
          <p className="text-[11px] text-amber-700 mt-1">Under 15 flacons left</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sage-200 space-x-6 text-sm">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 font-semibold transition border-b-2 ${
            activeTab === 'products'
              ? 'border-sage-900 text-sage-950'
              : 'border-transparent text-sage-500 hover:text-sage-800'
          }`}
        >
          Fragrance Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 font-semibold transition border-b-2 ${
            activeTab === 'orders'
              ? 'border-sage-900 text-sage-950'
              : 'border-transparent text-sage-500 hover:text-sage-800'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
      </div>

      {/* Products Tab Content */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400 w-4 h-4" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Filter by perfume name, brand, or family..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-sage-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div className="bg-white/90 rounded-3xl border border-sage-200/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-sage-700">
                <thead className="bg-cream-100/70 border-b border-sage-200 uppercase tracking-wider text-[11px] font-bold text-sage-800">
                  <tr>
                    <th className="py-3.5 px-4">Fragrance</th>
                    <th className="py-3.5 px-4">Family / Gender</th>
                    <th className="py-3.5 px-4">Base Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Featured</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-cream-50/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} alt={p.name} className="w-10 h-12 object-cover rounded-lg bg-cream-100" />
                          <div>
                            <span className="font-semibold text-sage-950 text-sm block">{p.name}</span>
                            <span className="text-[11px] text-sage-500">{p.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-sage-100 text-sage-800 px-2 py-0.5 rounded-full font-medium mr-1.5">
                          {p.family}
                        </span>
                        <span className="text-sage-500">{p.gender}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sage-950">${p.price}</td>
                      <td className="py-3.5 px-4">
                        <span className={`font-semibold px-2 py-0.5 rounded-full ${p.stock < 15 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-800'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {p.isFeatured ? (
                          <span className="text-gold-600 font-bold">★ Featured</span>
                        ) : (
                          <span className="text-sage-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-sage-600 hover:text-sage-900 hover:bg-sage-100 rounded-lg transition"
                            title="Edit Product"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-blush-500 hover:text-blush-700 hover:bg-blush-50 rounded-lg transition"
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab Content */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white/90 rounded-3xl border border-sage-200/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-sage-700">
                <thead className="bg-cream-100/70 border-b border-sage-200 uppercase tracking-wider text-[11px] font-bold text-sage-800">
                  <tr>
                    <th className="py-3.5 px-4">Order ID & Date</th>
                    <th className="py-3.5 px-4">Customer & Destination</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-cream-50/50 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-sage-950 block">{o.id}</span>
                        <span className="text-[10px] text-sage-500">
                          {new Date(o.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-sage-900 block">{o.address?.fullName || 'Guest'}</span>
                        <span className="text-[10px] text-sage-500">{o.address?.city}, {o.address?.state}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {o.items?.map((item, idx) => (
                            <div key={idx} className="text-[11px]">
                              {item.quantity}× {item.name} ({item.size})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sage-950 text-sm">
                        ${o.total?.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-sage-300 bg-white text-xs font-semibold text-sage-800 focus:outline-none focus:ring-2 focus:ring-gold-400 cursor-pointer shadow-sm"
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-sage-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-sage-200 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-sage-100">
              <h3 className="font-serif text-xl font-bold text-sage-950">
                {editingProduct ? 'Edit Botanical Fragrance' : 'Formulate New Fragrance'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sage-400 hover:text-sage-800 p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <p className="text-xs text-blush-500 bg-blush-50 p-2.5 rounded-xl border border-blush-200">
                {formError}
              </p>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                    Perfume Name *
                  </label>
                  <input
                    type="text"
                    value={modalForm.name}
                    onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                    required
                    placeholder="e.g. Damascus Moon"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                    Brand Atelier *
                  </label>
                  <input
                    type="text"
                    value={modalForm.brand}
                    onChange={(e) => setModalForm({ ...modalForm, brand: e.target.value })}
                    required
                    placeholder="e.g. Maison Botanique"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                    Scent Family
                  </label>
                  <select
                    value={modalForm.family}
                    onChange={(e) => setModalForm({ ...modalForm, family: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 bg-white focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    {FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                    Audience / Gender
                  </label>
                  <select
                    value={modalForm.gender}
                    onChange={(e) => setModalForm({ ...modalForm, gender: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 bg-white focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                    Base Price (50ml Flacon) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={modalForm.price}
                    onChange={(e) => setModalForm({ ...modalForm, price: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                    Inventory Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={modalForm.stock}
                    onChange={(e) => setModalForm({ ...modalForm, stock: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  Unsplash Image URL
                </label>
                <input
                  type="url"
                  value={modalForm.imageUrl}
                  onChange={(e) => setModalForm({ ...modalForm, imageUrl: e.target.value })}
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-sage-700 mb-1">
                    Top Notes
                  </label>
                  <input
                    type="text"
                    value={modalForm.notesTop}
                    onChange={(e) => setModalForm({ ...modalForm, notesTop: e.target.value })}
                    placeholder="e.g. Lemon, Cardamom"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-sage-700 mb-1">
                    Middle Notes
                  </label>
                  <input
                    type="text"
                    value={modalForm.notesMiddle}
                    onChange={(e) => setModalForm({ ...modalForm, notesMiddle: e.target.value })}
                    placeholder="e.g. Rose, Clove"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-sage-700 mb-1">
                    Base Notes
                  </label>
                  <input
                    type="text"
                    value={modalForm.notesBase}
                    onChange={(e) => setModalForm({ ...modalForm, notesBase: e.target.value })}
                    placeholder="e.g. Oud, Amber"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  Poetic Fragrance Description
                </label>
                <textarea
                  rows={2}
                  value={modalForm.description}
                  onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                  placeholder="Describe the mood, ingredients, and olfactory landscape..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={modalForm.isFeatured}
                  onChange={(e) => setModalForm({ ...modalForm, isFeatured: e.target.checked })}
                  className="rounded text-gold-500 focus:ring-gold-400 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="featuredToggle" className="text-xs font-semibold text-sage-800 cursor-pointer">
                  Feature in Curator's Highlights on Homepage
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-sage-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-sage-300 text-xs font-semibold text-sage-700 hover:bg-sage-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sage-800 hover:bg-sage-900 text-cream-50 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition shadow-soft"
                >
                  {editingProduct ? 'Update Fragrance' : 'Formulate Fragrance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
