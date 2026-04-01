import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {
  LayoutDashboard, ShoppingBag, Trash2, CheckCircle, Truck, Loader2,
  Package, DollarSign, Tag, Sparkles, Settings, LogOut, Plus, X,
  BarChart3, TrendingUp, ShoppingCart, Zap, Image as ImageIcon
} from 'lucide-react';

const Label = ({ children }) => (
  <p style={{ fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>
    {children}
  </p>
);

const GlassInput = ({ style = {}, ...props }) => (
  <input className="form-input" style={{ width: '100%', ...style }} {...props} />
);

export default function AdminDashboard() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [promo, setPromo] = useState({ id: 1, is_active: false, code: '', discount_percentage: 0, banner_text: '', description: '', is_free_shipping_active: false, free_shipping_threshold: 2000, free_shipping_banner_text: '', is_bulk_discount_active: false, bulk_discount_threshold: 10000, bulk_discount_percentage: 10, bulk_discount_banner_text: '' });
  const [newProduct, setNewProduct] = useState({ name: '', price: '', original_price: '', category: 'Electronics', rating: '4.5', sizes: '', colors: '' });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) { fetchProducts(); fetchOrders(); fetchPromo(); }
  }, [isAuthenticated]);

  async function fetchPromo() {
    const { data } = await supabase.from('promotions').select('*').eq('id', 1).single();
    if (data) setPromo(data);
  }
  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProductsList(data);
  }
  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrdersList(data);
  }

  const handleUpdateOrderStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      await fetchOrders();
    } catch (err) { alert('Status update failed: ' + err.message); }
    finally { setUpdatingId(null); }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Delete this order permanently?')) return;
    try { await supabase.from('orders').delete().eq('id', id); fetchOrders(); }
    catch (err) { alert(err.message); }
  };

  const handleUpdatePromo = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { error } = await supabase.from('promotions').upsert({ id: 1, ...promo });
      if (error) throw error;
      alert('✅ Promotion Updated!');
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || (!editingProductId && imageFiles.length === 0)) {
      alert('Please fill Name, Price, and select at least 1 Image.'); return;
    }
    setLoading(true);
    try {
      const uploadedUrls = [];
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
          if (uploadError) throw uploadError;
          const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
          uploadedUrls.push(urlData.publicUrl);
        }
      }

      const baseCost = parseFloat((newProduct.price || 0).toString().replace(/,/g, ''));
      const profit = Math.round(baseCost * 0.25);
      const finalPrice = baseCost + profit;

      let finalImages = uploadedUrls;
      if (editingProductId && uploadedUrls.length === 0) {
        const existing = productsList.find(p => p.id === editingProductId);
        finalImages = existing.images ? JSON.parse(existing.images) : [existing.image];
      }

      const productPayload = {
        ...newProduct,
        price: finalPrice,
        original_price: newProduct.original_price ? parseFloat(newProduct.original_price.toString().replace(/,/g, '')) : null,
        image: finalImages[0],
        images: JSON.stringify(finalImages),
        rating: parseFloat(newProduct.rating || 4.5)
      };

      if (editingProductId) {
        const { error } = await supabase.from('products').update(productPayload).eq('id', editingProductId);
        if (error) throw error;
        alert(`✅ Product Updated!`);
      } else {
        const { error } = await supabase.from('products').insert([productPayload]);
        if (error) throw error;
        alert(`✅ Published with ${uploadedUrls.length} image(s)!`);
      }

      setNewProduct({ name: '', price: '', original_price: '', category: 'Electronics', rating: '4.5', sizes: '', colors: '' });
      setImageFiles([]);
      setEditingProductId(null);
      fetchProducts();
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  // ─── PIN SCREEN ───
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow orbs */}
        <div style={{ position: 'absolute', top: '-200px', left: '-200px', width: '600px', height: '600px', background: 'var(--primary)', filter: 'blur(200px)', opacity: 0.08, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', background: 'var(--accent)', filter: 'blur(160px)', opacity: 0.06, pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(10, 14, 26, 0.8)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', padding: '3rem', textAlign: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 15px 35px rgba(139,92,246,0.4)' }}>
            <LayoutDashboard size={36} color="#fff" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px', marginBottom: '0.5rem' }}>LYNIX</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Manager Access</p>
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (pin === 'makemoney' ? setIsAuthenticated(true) : alert('Wrong PIN'))}
            className="form-input"
            style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.4rem', marginBottom: '1.5rem', height: '64px' }}
          />
          <button
            onClick={() => pin === 'makemoney' ? setIsAuthenticated(true) : alert('Wrong PIN')}
            className="btn-primary full-width"
            style={{ height: '56px', fontSize: '1rem', letterSpacing: '1px' }}
          >
            Unlock Dashboard
          </button>
        </div>
      </div>
    );
  }

  const activeOrders = ordersList.filter(o => o.status !== 'Delivered');
  const archivedOrders = ordersList.filter(o => o.status === 'Delivered');
  const totalRevenue = ordersList.reduce((s, o) => s + (o.total_amount || 0), 0);
  
  // Calculate exact profit by extracting exactly 20% (which equals the 25% markup) from each item's price
  const totalProfit = ordersList.reduce((total, order) => {
    try {
      if (!order.items) return total;
      const parsedItems = JSON.parse(order.items);
      const orderProfit = parsedItems.reduce((sum, item) => sum + (Math.round(Number(item.price) * 0.2) * Number(item.quantity)), 0);
      return total + orderProfit;
    } catch { return total; }
  }, 0);

  const tabs = [
    { id: 'products', label: 'Products', icon: <ShoppingBag size={18} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={18} />, badge: activeOrders.length },
    { id: 'promotions', label: 'Promotions', icon: <Tag size={18} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '0 0 6rem' }}>

      {/* ─── TOP HEADER BAR ─── */}
      <div style={{ background: 'rgba(3, 7, 18, 0.9)', backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '1.2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontWeight: '900', letterSpacing: '-1px', fontSize: '1.3rem', lineHeight: 1 }}>LYNIX</h2>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>Manager Panel</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', padding: '5px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '0.55rem 1.2rem', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.3px', transition: '0.25s',
                background: activeTab === tab.id ? 'linear-gradient(135deg, var(--primary), #6366f1)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                boxShadow: activeTab === tab.id ? '0 4px 16px rgba(139,92,246,0.35)' : 'none',
                position: 'relative'
              }}
            >
              {tab.icon} {tab.label}
              {tab.badge > 0 && (
                <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: '900', padding: '1px 6px', borderRadius: '20px', marginLeft: '2px' }}>{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        <button onClick={() => setIsAuthenticated(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '0.6rem 1.2rem', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', transition: '0.2s' }}>
          <LogOut size={16} /> Exit
        </button>
      </div>

      <div className="container" style={{ padding: '2.5rem 2rem' }}>

        {/* ─── STATS ROW ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
          {[
            { icon: <ShoppingBag size={20} color="var(--primary)" />, label: 'Products', value: productsList.length, color: 'var(--primary)' },
            { icon: <Package size={20} color="var(--accent)" />, label: 'Active Orders', value: activeOrders.length, color: 'var(--accent)' },
            { icon: <CheckCircle size={20} color="#10b981" />, label: 'Completed', value: archivedOrders.length, color: '#10b981' },
            { icon: <DollarSign size={20} color="#f59e0b" />, label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, color: '#f59e0b' },
            { icon: <TrendingUp size={20} color="#10b981" />, label: 'Net Profit', value: `Rs. ${totalProfit.toLocaleString()}`, color: '#10b981' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', backdropFilter: 'blur(10px)', transition: '0.3s' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '3px' }}>{stat.label}</p>
                <p style={{ fontWeight: '900', fontSize: '1.25rem', color: '#fff', letterSpacing: '-0.5px' }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── PRODUCTS TAB ─── */}
        {activeTab === 'products' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '2rem', alignItems: 'start' }}>

            {/* Add Product Form */}
            <div style={{ background: 'rgba(10, 15, 28, 0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '28px', padding: '2rem', backdropFilter: 'blur(20px)', position: 'sticky', top: '90px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={18} color="#fff" />
                  </div>
                  <h3 style={{ fontWeight: '900', fontSize: '1.1rem' }}>{editingProductId ? 'Edit Product' : 'Post New Item'}</h3>
                </div>
                {editingProductId && (
                  <button type="button" onClick={() => { setEditingProductId(null); setNewProduct({ name: '', price: '', original_price: '', category: 'Electronics', rating: '4.5', sizes: '', colors: '' }); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Cancel</button>
                )}
              </div>

              <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <Label>Product Name</Label>
                  <GlassInput placeholder="e.g. iPhone 15 Pro Max" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <Label>Product Actual Cost (Rs.)</Label>
                    <GlassInput placeholder="e.g. 1115" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                    {newProduct.price && (
                      <p style={{ marginTop: '6px', fontSize: '0.75rem', color: '#10b981', fontWeight: '800' }}>
                        Customer sees: Rs. {(Number(newProduct.price) + Math.round(Number(newProduct.price) * 0.25)).toLocaleString()} <span style={{ opacity: 0.8, fontWeight: 'normal' }}>(+Rs. {Math.round(Number(newProduct.price) * 0.25)} profit)</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Original Price</Label>
                    <GlassInput placeholder="Rs." value={newProduct.original_price} onChange={e => setNewProduct({ ...newProduct, original_price: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <Label>Category</Label>
                    <select className="form-input" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} style={{ width: '100%' }}>
                      {['Electronics', 'Clothing', 'Accessories', 'Home & Lifestyle', 'Gifts'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <GlassInput placeholder="4.5" type="number" step="0.1" min="1" max="5" value={newProduct.rating} onChange={e => setNewProduct({ ...newProduct, rating: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Sizes (comma separated)</Label>
                  <GlassInput placeholder="e.g. S, M, L, XL" value={newProduct.sizes} onChange={e => setNewProduct({ ...newProduct, sizes: e.target.value })} />
                </div>
                <div>
                  <Label>Colors (comma separated)</Label>
                  <GlassInput placeholder="e.g. Black, White, Red" value={newProduct.colors} onChange={e => setNewProduct({ ...newProduct, colors: e.target.value })} />
                </div>

                {/* Image Upload */}
                <div>
                  <Label>Images (max 5)</Label>
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '1.5rem', border: '2px dashed rgba(139,92,246,0.3)', borderRadius: '16px', background: 'rgba(139,92,246,0.04)', cursor: 'pointer', transition: '0.2s' }}>
                    <ImageIcon size={28} color="var(--primary)" />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700' }}>Click to select images</span>
                    <input type="file" accept="image/*" multiple onChange={e => setImageFiles(Array.from(e.target.files).slice(0, 5))} style={{ display: 'none' }} />
                  </label>
                  {imageFiles.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                      {imageFiles.map((file, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={URL.createObjectURL(file)} alt="" style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: i === 0 ? '2px solid var(--primary)' : '2px solid var(--border)' }} />
                          {i === 0 && <span style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.5rem', fontWeight: '900', color: 'var(--primary)', whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.6)', padding: '1px 5px', borderRadius: '4px' }}>MAIN</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.5rem', height: '54px', fontSize: '1rem', borderRadius: '16px', letterSpacing: '0.5px' }}>
                  {loading ? `Working...` : editingProductId ? '💾 Save Changes' : '🚀 Publish Product'}
                </button>
              </form>
            </div>

            {/* Inventory List */}
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: '900', fontSize: '1.2rem' }}>Active Inventory <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.9rem' }}>({productsList.length} items)</span></h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {productsList.length === 0 && <p style={{ opacity: 0.4, textAlign: 'center', padding: '3rem' }}>No products yet. Add your first item →</p>}
                {productsList.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', background: p.in_stock === false ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.03)', border: `1px solid ${p.in_stock === false ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'}`, padding: '1rem 1.2rem', borderRadius: '18px', transition: '0.3s', backdropFilter: 'blur(10px)' }}>
                    <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0 }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#fff', padding: '4px', overflow: 'hidden', opacity: p.in_stock === false ? 0.5 : 1 }}>
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: '800', color: p.in_stock === false ? 'var(--text-muted)' : '#fff', fontSize: '0.95rem', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>{p.category}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Rs. {Number(p.price || 0).toLocaleString()}</span>
                        {p.in_stock === false && (
                          <span style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '900', border: '1px solid rgba(239,68,68,0.3)' }}>OUT OF STOCK</span>
                        )}
                      </div>
                    </div>
                    {/* Stock Toggle */}
                    <button
                      onClick={async () => {
                        const newStock = p.in_stock === false ? true : false;
                        await supabase.from('products').update({ in_stock: newStock }).eq('id', p.id);
                        fetchProducts();
                      }}
                      title={p.in_stock === false ? 'Mark as In Stock' : 'Mark as Out of Stock'}
                      style={{ padding: '6px 12px', borderRadius: '10px', border: `1px solid ${p.in_stock === false ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, background: p.in_stock === false ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)', color: p.in_stock === false ? '#10b981' : '#ef4444', fontSize: '0.7rem', fontWeight: '900', cursor: 'pointer', transition: '0.2s', flexShrink: 0, whiteSpace: 'nowrap' }}
                    >
                      {p.in_stock === false ? '✓ IN STOCK' : '✕ OUT OF STOCK'}
                    </button>
                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        setEditingProductId(p.id);
                        setNewProduct({
                          name: p.name,
                          price: Math.round(Number(p.price) / 1.25).toString(),
                          original_price: p.original_price || '',
                          category: p.category || 'Electronics',
                          rating: p.rating || 4.5,
                          sizes: p.sizes || '',
                          colors: p.colors || ''
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s', flexShrink: 0 }}
                      title="Edit Product"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button
                      onClick={async () => { if (window.confirm('Delete this product?')) { await supabase.from('products').delete().eq('id', p.id); fetchProducts(); } }}
                      style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s', flexShrink: 0 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── ORDERS TAB ─── */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div>
              <h2 style={{ marginBottom: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '900' }}>{activeOrders.length}</span> Active Orders
              </h2>
              {activeOrders.length === 0 && <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.4 }}>No active orders right now 🎉</div>}
              {activeOrders.map(order => (
                <div key={order.id} style={{ background: 'rgba(10,14,26,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '1.8rem', marginBottom: '1.2rem', backdropFilter: 'blur(20px)', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: order.status === 'Shipped' ? '#10b981' : 'var(--primary)' }} />
                  <div style={{ paddingLeft: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <h4 style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '1rem' }}>#{order.id.split('-')[0].toUpperCase()}</h4>
                          <span style={{ padding: '3px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900', background: order.status === 'Shipped' ? 'rgba(16,185,129,0.15)' : 'rgba(139,92,246,0.15)', color: order.status === 'Shipped' ? '#10b981' : 'var(--primary)', border: `1px solid ${order.status === 'Shipped' ? 'rgba(16,185,129,0.3)' : 'rgba(139,92,246,0.3)'}` }}>
                            {order.status || 'Pending'}
                          </span>
                        </div>
                        <p style={{ opacity: 0.4, fontSize: '0.8rem' }}>{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                      <h3 style={{ fontWeight: '900', fontSize: '1.3rem', background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Rs. {order.total_amount?.toLocaleString()}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <p style={{ fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{order.customer_name}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{order.customer_phone}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{order.address}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                        <button onClick={() => handleDeleteOrder(order.id)} style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                        <button
                          disabled={updatingId === order.id}
                          onClick={() => handleUpdateOrderStatus(order.id, order.status === 'Shipped' ? 'Delivered' : 'Shipped')}
                          className="btn-primary"
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.65rem 1.3rem', borderRadius: '14px', fontSize: '0.88rem' }}
                        >
                          {updatingId === order.id ? <Loader2 size={16} className="animate-spin" /> : order.status === 'Shipped' ? <><CheckCircle size={16} /> Mark Delivered</> : <><Truck size={16} /> Mark Shipped</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {archivedOrders.length > 0 && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', opacity: 0.4, fontWeight: '900' }}>Completed Orders ({archivedOrders.length})</h2>
                {archivedOrders.map(order => (
                  <div key={order.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.2rem 1.5rem', borderRadius: '18px', marginBottom: '0.8rem', opacity: 0.55, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: '800', fontSize: '0.85rem' }}>#{order.id.split('-')[0].toUpperCase()}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customer_name} — Rs. {order.total_amount?.toLocaleString()}</p>
                    </div>
                    <button onClick={() => handleDeleteOrder(order.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── PROMOTIONS TAB ─── */}
        {activeTab === 'promotions' && (
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={22} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontWeight: '900', fontSize: '1.4rem', lineHeight: 1 }}>Manage Promotions</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Control discount codes and free shipping banners</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePromo} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Discount Code Section */}
              <div style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '24px', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}><Tag size={18} color="var(--primary)" /> Discount Code</h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: promo.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)', padding: '8px 16px', borderRadius: '12px', border: `1px solid ${promo.is_active ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`, transition: '0.3s' }}>
                    <input type="checkbox" checked={promo.is_active} onChange={e => setPromo({ ...promo, is_active: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                    <span style={{ fontWeight: '800', fontSize: '0.875rem', color: promo.is_active ? '#10b981' : 'var(--text-muted)' }}>{promo.is_active ? 'ACTIVE' : 'DISABLED'}</span>
                  </label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  <div><Label>Promo Code</Label><GlassInput value={promo.code} onChange={e => setPromo({ ...promo, code: e.target.value })} placeholder="PREMIUM15" /></div>
                  <div><Label>Discount %</Label><GlassInput type="number" value={promo.discount_percentage} onChange={e => setPromo({ ...promo, discount_percentage: Number(e.target.value) })} placeholder="15" /></div>
                </div>
                <div style={{ marginBottom: '1.2rem' }}><Label>Banner Title</Label><GlassInput value={promo.banner_text} onChange={e => setPromo({ ...promo, banner_text: e.target.value })} placeholder="Flash Sale 🎁" /></div>
                <div><Label>Description</Label><textarea className="form-input" rows={2} value={promo.description} onChange={e => setPromo({ ...promo, description: e.target.value })} placeholder="Experience luxury for less..." style={{ width: '100%', resize: 'vertical' }} /></div>
              </div>

              {/* Free Shipping Section */}
              <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '24px', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}><Truck size={18} color="#10b981" /> Free Shipping</h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: promo.is_free_shipping_active ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)', padding: '8px 16px', borderRadius: '12px', border: `1px solid ${promo.is_free_shipping_active ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`, transition: '0.3s' }}>
                    <input type="checkbox" checked={promo.is_free_shipping_active} onChange={e => setPromo({ ...promo, is_free_shipping_active: e.target.checked, is_bulk_discount_active: e.target.checked ? false : promo.is_bulk_discount_active })} style={{ width: '18px', height: '18px', accentColor: '#10b981' }} />
                    <span style={{ fontWeight: '800', fontSize: '0.875rem', color: promo.is_free_shipping_active ? '#10b981' : 'var(--text-muted)' }}>{promo.is_free_shipping_active ? 'ACTIVE' : 'DISABLED'}</span>
                  </label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.2rem' }}>
                  <div><Label>Min. Amount (Rs.)</Label><GlassInput type="number" value={promo.free_shipping_threshold} onChange={e => setPromo({ ...promo, free_shipping_threshold: Number(e.target.value) })} placeholder="2000" /></div>
                  <div><Label>Top Banner Text</Label><GlassInput value={promo.free_shipping_banner_text} onChange={e => setPromo({ ...promo, free_shipping_banner_text: e.target.value })} placeholder="🎉 FREE SHIPPING on orders over Rs. 2000!" /></div>
                </div>
              </div>

              {/* Bulk Discount Section */}
              <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.15)', borderRadius: '24px', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={18} color="#f43f5e" /> Automatic Bulk Discount</h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: promo.is_bulk_discount_active ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255,255,255,0.04)', padding: '8px 16px', borderRadius: '12px', border: `1px solid ${promo.is_bulk_discount_active ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255,255,255,0.08)'}`, transition: '0.3s' }}>
                    <input type="checkbox" checked={promo.is_bulk_discount_active} onChange={e => setPromo({ ...promo, is_bulk_discount_active: e.target.checked, is_free_shipping_active: e.target.checked ? false : promo.is_free_shipping_active })} style={{ width: '18px', height: '18px', accentColor: '#f43f5e' }} />
                    <span style={{ fontWeight: '800', fontSize: '0.875rem', color: promo.is_bulk_discount_active ? '#f43f5e' : 'var(--text-muted)' }}>{promo.is_bulk_discount_active ? 'ACTIVE' : 'DISABLED'}</span>
                  </label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(100px, 1fr) 2fr', gap: '1.2rem' }}>
                  <div><Label>Min. Amount (Rs.)</Label><GlassInput type="number" value={promo.bulk_discount_threshold || 10000} onChange={e => setPromo({ ...promo, bulk_discount_threshold: Number(e.target.value) })} placeholder="10000" /></div>
                  <div><Label>Discount %</Label><GlassInput type="number" value={promo.bulk_discount_percentage || 10} onChange={e => setPromo({ ...promo, bulk_discount_percentage: Number(e.target.value) })} placeholder="10" /></div>
                  <div><Label>Top Banner Text</Label><GlassInput value={promo.bulk_discount_banner_text || ''} onChange={e => setPromo({ ...promo, bulk_discount_banner_text: e.target.value })} placeholder="🎉 10% OFF on orders over Rs. 10k!" /></div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ height: '58px', fontSize: '1rem', borderRadius: '18px', letterSpacing: '0.5px' }}>
                {loading ? 'Saving...' : '✨ Publish Promotion Updates'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
