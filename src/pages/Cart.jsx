import React, { useState } from 'react';
import { Trash2, CreditCard, ShoppingBag, Minus, Plus, MapPin, Phone, Mail, User, ChevronRight, Shield, Truck, RotateCcw, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../CartContext';
import { supabase } from '../supabase';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customer, setCustomer] = useState({ 
    firstName: '', lastName: '', email: '', phone: '', phone2: '', address: '', city: '', district: '', paymentMethod: 'COD'
  });
  const [step, setStep] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);
  const [promo, setPromo] = useState(null);

  React.useEffect(() => {
    async function fetchPromo() {
      try {
        const { data } = await supabase.from('promotions').select('*').eq('id', 1).single();
        if (data) {
          setPromo(data);
        }
      } catch (err) { console.error(err); }
    }
    fetchPromo();
  }, []);

  const applyPromo = () => {
    if (promo && promo.is_active && promoCode.toUpperCase() === promo.code.toUpperCase()) {
      setDiscountPercent(promo.discount_percentage / 100);
      alert(`🎁 ${promo.discount_percentage}% Premium Discount Applied!`);
    } else {
      setDiscountPercent(0);
      alert('❌ Invalid or expired Promo Code.');
    }
  };

  // Dynamic Free shipping logic
  const isFreeShipping = promo && promo.is_free_shipping_active && cartTotal >= promo.free_shipping_threshold;
  const DELIVERY_CHARGE = isFreeShipping ? 0 : 450;
  
  // Automatic Bulk Discount logic
  const isBulkDiscountMet = promo && promo.is_bulk_discount_active && cartTotal >= promo.bulk_discount_threshold;
  const bulkDiscountPercent = isBulkDiscountMet ? (promo.bulk_discount_percentage / 100) : 0;
  
  // Apply BOTH promo code and bulk discount (they stack!)
  const promoDiscountAmount = cartTotal * discountPercent;
  const bulkDiscountAmount = cartTotal * bulkDiscountPercent;
  const totalDiscountAmount = promoDiscountAmount + bulkDiscountAmount;
  const finalTotal = cartTotal - totalDiscountAmount + DELIVERY_CHARGE;

  const handleCheckout = async () => {
    if (!customer.firstName || !customer.phone || !customer.address || !customer.city || !customer.district) {
      alert("Please fill in all required (*) delivery details."); return;
    }
    setIsProcessing(true);
    try {
      const orderData = {
        customer_name: `${customer.firstName} ${customer.lastName} (${customer.email || 'No Email'})`,
        customer_phone: customer.phone,
        address: `${customer.address}, ${customer.district}`,
        city: customer.city,
        total_amount: finalTotal,
        items: JSON.stringify(cartItems),
        status: 'Pending'
      };
      const { error } = await supabase.from('orders').insert([orderData]);
      if (error) throw error;

      const itemsList = cartItems.map(item => {
        const sub = [];
        if (item.selectedSize) sub.push(`Size: ${item.selectedSize}`);
        if (item.selectedColor) sub.push(`Color: ${item.selectedColor}`);
        return `• ${item.name}${sub.length ? ` [${sub.join(', ')}]` : ''} x${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}`;
      }).join('\n');

      const waMessage = `*LYNIX - NEW ORDER*\n\n` +
        `*Customer:* ${customer.firstName} ${customer.lastName}\n` +
        `*Phone:* ${customer.phone}\n` +
        `*Address:* ${customer.address}, ${customer.city}, ${customer.district}\n\n` +
        `*Items:*\n${itemsList}\n\n` +
        `*Subtotal:* Rs. ${cartTotal.toLocaleString()}\n` +
        (promoDiscountAmount > 0 ? `*Promo Discount (${discountPercent * 100}%):* - Rs. ${promoDiscountAmount.toLocaleString()}\n` : '') +
        (bulkDiscountAmount > 0 ? `*Bulk Discount (${bulkDiscountPercent * 100}%):* - Rs. ${bulkDiscountAmount.toLocaleString()}\n` : '') +
        `*Shipping:* Rs. ${DELIVERY_CHARGE.toLocaleString()}\n` +
        `*Total:* Rs. ${finalTotal.toLocaleString()}\n\n` +
        `*Payment:* ${customer.paymentMethod}\n\n` +
        `Please confirm this order.`;

      const waUrl = `https://wa.me/94783065482?text=${encodeURIComponent(waMessage)}`;
      setTimeout(() => { window.location.href = waUrl; }, 600);
      clearCart();
    } catch (err) {
      alert(`Order failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '4rem 2rem' }}>
          <ShoppingBag size={80} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '2rem' }} />
          <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '1rem' }}>Empty Cart</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Discover our curated collection of premium essentials.</p>
          <Link to="/" className="btn-primary" style={{ padding: '1rem 2.5rem' }}>Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}><ArrowLeft size={20}/></button>
        <div><h1 style={{ fontSize: '2rem', fontWeight: '900' }}>Checkout</h1><p style={{ color: 'var(--text-muted)' }}>{step === 1 ? 'Review your selection' : step === 2 ? 'Delivery information' : 'Secure payment'}</p></div>
      </div>

      <div className="checkout-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {cartItems.map(item => (
                <div key={item.id} className="glass-card cart-item" style={{ padding: '1.5rem' }}>
                  <img src={item.image} style={{ width: '100px', height: '100px', borderRadius: '16px', objectFit: 'cover', background: '#fff' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: '800', marginBottom: '4px' }}>{item.name}</h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {item.selectedSize && <span style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>{item.selectedSize}</span>}
                      {item.selectedColor && <span style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>{item.selectedColor}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '4px' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '4px', background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}><Minus size={14}/></button>
                        <span style={{ padding: '0 10px', fontWeight: '800' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '4px', background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}><Plus size={14}/></button>
                      </div>
                      <span style={{ fontWeight: '900', color: 'var(--primary)' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div className="form-row">
                <div className="form-group"><label>First Name</label><input type="text" className="form-input" value={customer.firstName} onChange={e => setCustomer({...customer, firstName: e.target.value})} /></div>
                <div className="form-group"><label>Last Name</label><input type="text" className="form-input" value={customer.lastName} onChange={e => setCustomer({...customer, lastName: e.target.value})} /></div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}><label>Email Address</label><input type="email" className="form-input" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label>Phone Number</label><input type="tel" className="form-input" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} /></div>
                <div className="form-group"><label>District</label><input type="text" className="form-input" value={customer.district} onChange={e => setCustomer({...customer, district: e.target.value})} /></div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}><label>Shipping Address</label><input type="text" className="form-input" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} /></div>
              <div className="form-group"><label>City</label><input type="text" className="form-input" value={customer.city} onChange={e => setCustomer({...customer, city: e.target.value})} /></div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {['COD', 'Bank Deposit', 'KOKO', 'Payzy'].map(method => (
                <div key={method} onClick={() => setCustomer({...customer, paymentMethod: method})} style={{ padding: '1.8rem', borderRadius: '20px', border: `2px solid ${customer.paymentMethod === method ? 'var(--primary)' : 'var(--border)'}`, background: 'rgba(15, 20, 30, 0.7)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>{method === 'COD' ? 'Cash on Delivery' : method}</span>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{customer.paymentMethod === method && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }} />}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="checkout-summary-container">
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: '900' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
              <input type="text" placeholder="Promo Code" className="form-input" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} style={{ padding: '0.8rem 1rem', height: 'auto' }} />
              <button onClick={applyPromo} className="btn-primary" style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', fontSize: '0.9rem' }}>Apply</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-soft)' }}><span>Subtotal</span><span>Rs. {cartTotal.toLocaleString()}</span></div>
            
            {promoDiscountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: 'var(--success)', fontWeight: '800' }}>
                <span>Promo Code ({discountPercent * 100}%)</span><span>- Rs. {promoDiscountAmount.toLocaleString()}</span>
              </div>
            )}
            {bulkDiscountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--success)', fontWeight: '800' }}>
                <span>Bulk Discount ({bulkDiscountPercent * 100}%)</span><span>- Rs. {bulkDiscountAmount.toLocaleString()}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: DELIVERY_CHARGE === 0 ? 'var(--success)' : 'var(--text-soft)', fontWeight: DELIVERY_CHARGE === 0 ? '800' : 'normal' }}>
               <span>Shipping</span>
               <span>{DELIVERY_CHARGE === 0 ? `FREE (Over Rs.${promo?.free_shipping_threshold || 2000})` : `Rs. ${DELIVERY_CHARGE}`}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '800' }}>Total</span><span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary)' }}>Rs. {finalTotal.toLocaleString()}</span>
            </div>
            <button onClick={() => step < 3 ? setStep(step + 1) : handleCheckout()} disabled={isProcessing} className="btn-primary full-width" style={{ marginTop: '2rem', height: '60px' }}>{isProcessing ? 'Processing...' : step === 3 ? 'Confirm Order' : 'Continue'}</button>
            <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}><Shield size={20} color="var(--success)" /><span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: '700' }}>Lynix Purchase Protection</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
