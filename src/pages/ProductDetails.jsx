import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useCart } from '../CartContext';
import { ShoppingCart, Star, ArrowLeft, ShieldCheck, Truck, Minus, Plus } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [qty, setQty] = useState(1);

  // ✅ ALL hooks must be BEFORE any conditional return
  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        if (data) setProduct(data);
      } catch (err) {
        console.error('ProductDetails fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const sizes = product.sizes
      ? product.sizes.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const colors = product.colors
      ? product.colors.split(',').map(c => c.trim()).filter(Boolean)
      : [];
    if (sizes.length > 0) setSelectedSize(sizes[0]);
    if (colors.length > 0) setSelectedColor(colors[0]);
    // Set initial active image
    setActiveImage(product.image || '');
  }, [product]);

  // ✅ Conditional returns AFTER all hooks
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '8rem', color: 'var(--text-soft)' }}>
        <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '8rem' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '1.5rem', fontSize: '1.8rem' }}>Product not found.</h2>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '1rem 2rem' }}>
          ← Go Back Home
        </button>
      </div>
    );
  }

  const sizes = product.sizes
    ? product.sizes.split(',').map(s => s.trim()).filter(Boolean)
    : [];
  const colors = product.colors
    ? product.colors.split(',').map(c => c.trim()).filter(Boolean)
    : [];
  const price = Number(product.price) || 0;
  const originalPrice = product.original_price ? Number(product.original_price) : null;

  // Parse all images — fallback to single image if no array
  let allImages = [product.image];
  try {
    if (product.images) {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) allImages = parsed;
    }
  } catch (_) {}

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'transparent', color: 'var(--text-muted)', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '2.5rem', fontSize: '0.95rem', fontWeight: '600', transition: '0.2s'
        }}
      >
        <ArrowLeft size={20} /> Back to Products
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        background: 'rgba(15, 20, 30, 0.85)',
        padding: '2.5rem',
        borderRadius: '28px',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(20px)'
      }}>

        {/* Left: Image Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main Image */}
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '350px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}>
            <img
              src={activeImage || product.image}
              alt={product.name}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', transition: 'opacity 0.3s ease' }}
            />
          </div>

          {/* Thumbnail Strip — only show if multiple images */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {allImages.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(imgUrl)}
                  style={{
                    width: '70px', height: '70px', borderRadius: '12px', padding: '4px',
                    background: '#fff', cursor: 'pointer', flexShrink: 0,
                    border: `2.5px solid ${activeImage === imgUrl ? 'var(--primary)' : 'transparent'}`,
                    boxShadow: activeImage === imgUrl ? '0 0 12px rgba(139,92,246,0.5)' : '0 2px 8px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease', overflow: 'hidden'
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`view-${i}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          {/* Rating + Category */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24',
              padding: '5px 12px', borderRadius: '50px', fontWeight: '800', fontSize: '0.88rem'
            }}>
              <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
              {product.rating || '4.8'} / 5.0
            </div>
            <span style={{
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)',
              padding: '5px 12px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '700',
              border: '1px solid var(--border)'
            }}>
              {product.category || 'Premium Collection'}
            </span>
          </div>

          {/* Name */}
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '1.2rem',
            color: '#fff', letterSpacing: '-1px', fontWeight: '900', lineHeight: 1.1
          }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
              Rs. {price.toLocaleString()}
            </span>
            {originalPrice && (
              <span style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                Rs. {originalPrice.toLocaleString()}
              </span>
            )}
            <span style={{
              background: product.in_stock === false ? 'rgba(239,68,68,0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: product.in_stock === false ? '#ef4444' : '#10b981',
              padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '800',
              border: `1px solid ${product.in_stock === false ? 'rgba(239,68,68,0.3)' : 'rgba(16, 185, 129, 0.3)'}`
            }}>
              {product.in_stock === false ? 'OUT OF STOCK' : 'IN STOCK'}
            </span>
          </div>

          {/* Sizes */}
          {sizes.length > 0 && (
            <div style={{ marginBottom: '1.8rem' }}>
              <p style={{ fontWeight: '800', marginBottom: '0.8rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)' }}>
                Select Size
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '0.65rem 1.2rem', borderRadius: '12px',
                      border: `2px solid ${selectedSize === size ? 'var(--primary)' : 'var(--border)'}`,
                      background: selectedSize === size ? 'rgba(139,92,246,0.12)' : 'transparent',
                      color: selectedSize === size ? 'var(--primary)' : 'var(--text-soft)',
                      fontWeight: '700', cursor: 'pointer', transition: '0.2s', minWidth: '52px'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontWeight: '800', marginBottom: '0.8rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)' }}>
                Select Color
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: '0.6rem 1.1rem', borderRadius: '12px',
                      border: `2px solid ${selectedColor === color ? 'var(--primary)' : 'var(--border)'}`,
                      background: selectedColor === color ? 'rgba(139,92,246,0.12)' : 'transparent',
                      color: selectedColor === color ? 'var(--primary)' : 'var(--text-soft)',
                      fontWeight: '600', cursor: 'pointer', transition: '0.2s'
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <p style={{ color: 'var(--text-soft)', lineHeight: '1.8', marginBottom: '2rem', fontSize: '1rem' }}>
            {product.description ||
              `Experience the ultimate quality with our ${product.name}. Carefully sourced by Lynix to ensure premium performance and durability.`}
          </p>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <Truck size={18} color="var(--primary)" /> Fast Island-wide Delivery
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <ShieldCheck size={18} color="#10b981" /> Quality Verified
            </div>
          </div>

          {/* ─── Quantity Selector ─── */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontWeight: '800', marginBottom: '0.8rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)' }}>
              Quantity
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{
                  width: '48px', height: '52px', borderRadius: '14px 0 0 14px',
                  border: '2px solid var(--border)', borderRight: 'none',
                  background: 'rgba(255,255,255,0.05)', color: '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: '0.2s', fontSize: '1.1rem'
                }}
              >
                <Minus size={16} />
              </button>
              <div style={{
                width: '70px', height: '52px', border: '2px solid var(--border)',
                background: 'rgba(139,92,246,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '900', fontSize: '1.3rem', color: '#fff', letterSpacing: '-0.5px'
              }}>
                {qty}
              </div>
              <button
                onClick={() => setQty(q => Math.min(99, q + 1))}
                style={{
                  width: '48px', height: '52px', borderRadius: '0 14px 14px 0',
                  border: '2px solid var(--border)', borderLeft: 'none',
                  background: 'rgba(255,255,255,0.05)', color: '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: '0.2s'
                }}
              >
                <Plus size={16} />
              </button>
              {qty > 1 && (
                <span style={{ marginLeft: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.95rem' }}>
                  = Rs. {(Number(product.price || 0) * qty).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => {
              if (product.in_stock === false) return;
              addToCart({ ...product, selectedSize, selectedColor }, qty);
              alert(`✅ ${qty} item(s) added to cart!`);
            }}
            disabled={product.in_stock === false}
            className="btn-primary"
            style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              gap: '12px', padding: '1.2rem', fontSize: '1.1rem',
              fontWeight: '900', borderRadius: '20px', width: '100%',
              opacity: product.in_stock === false ? 0.5 : 1,
              cursor: product.in_stock === false ? 'not-allowed' : 'pointer'
            }}
          >
            <ShoppingCart size={22} />
            {product.in_stock === false ? 'Out of Stock' : `Add ${qty > 1 ? `${qty} Items` : 'To Cart'}`}
          </button>
        </div>
      </div>
    </div>
  );
}
