import React, { useEffect, useState } from 'react';
import { ShoppingCart, Star, Search, Filter, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase';
import { useCart } from '../CartContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Electronics', 'Clothing', 'Accessories', 'Home & Lifestyle', 'Gifts'];

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) setErrorMsg(error.message);
        else if (data) setProducts(data);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const prodCat = product.category || 'Accessories';
    const matchesCategory = selectedCategory === 'All' || prodCat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app-container">
      {/* Premium Filter Bar */}
      <div style={{ 
        position: 'sticky', 
        top: 'var(--nav-height)', 
        zIndex: 900, 
        background: 'rgba(2, 6, 23, 0.5)', 
        backdropFilter: 'blur(32px)', 
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        padding: '1.2rem 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '3rem', padding: '0 2.5rem' }}>
          
          {/* Categories */}
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{ 
                  background: 'none', border: 'none',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1.5px',
                  cursor: 'pointer', padding: '4px 0', position: 'relative', transition: '0.3s'
                }}
              >
                {cat}
                {selectedCategory === cat && (
                  <div style={{ position: 'absolute', bottom: '-4px', left: '0', width: '100%', height: '2.5px', background: 'var(--gradient-1)', borderRadius: '2px' }} />
                )}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '320px', flexShrink: 0 }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="form-input" 
              style={{ paddingLeft: '3.2rem', height: '44px', borderRadius: '50px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '4rem 2.5rem 6rem' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10rem 0' }}><div className="spinner"></div></div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '10rem 0', opacity: 0.5 }}>
            <h2 style={{ fontWeight: '300', letterSpacing: '4px' }}>NO DISCOVERIES FOUND</h2>
          </div>
        ) : (
          <div className="product-grid" style={{ animation: 'fade-in 0.8s ease-out' }}>
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card" style={{ opacity: product.in_stock === false ? 0.75 : 1 }}>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                  <div className="product-img-wrapper" style={{ borderRadius: '28px', background: '#fff', border: '1px solid rgba(0,0,0,0.02)', position: 'relative' }}>
                    <img src={product.image} alt={product.name} className="product-img" />
                    <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(255,255,255,0.95)', color: '#000', padding: '6px 12px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <Star size={12} fill="#000" /> {product.rating || '4.5'}
                    </div>
                    {product.in_stock === false && (
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ background: '#ef4444', color: '#fff', fontWeight: '900', padding: '8px 18px', borderRadius: '50px', fontSize: '0.8rem', letterSpacing: '1px' }}>OUT OF STOCK</span>
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{product.category}</div>
                    <h3 className="product-title" style={{ fontSize: '1.3rem', fontWeight: '900', letterSpacing: '-0.5px' }}>{product.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.45rem', fontWeight: '900', color: 'var(--primary)' }}>Rs. {Number(product.price || 0).toLocaleString()}</span>
                      {product.original_price && (
                        <span style={{ fontSize: '1rem', textDecoration: 'line-through', color: 'var(--text-muted)', fontWeight: '500' }}>Rs. {Number(product.original_price).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
                <div style={{ marginTop: '2rem' }}>
                  <button
                    onClick={() => product.in_stock !== false && addToCart(product)}
                    disabled={product.in_stock === false}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1rem', borderRadius: '20px', gap: '12px', fontSize: '0.9rem', fontWeight: '900', opacity: product.in_stock === false ? 0.5 : 1, cursor: product.in_stock === false ? 'not-allowed' : 'pointer' }}
                  >
                    {product.in_stock === false ? 'OUT OF STOCK' : <>ADD TO CART <ArrowRight size={18} /></>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
