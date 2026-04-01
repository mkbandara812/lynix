import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { ShoppingBag, Package, Clock, CheckCircle, Truck, User, Mail, MapPin, Phone, LogOut, ChevronRight, Settings, Heart, Bell, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../CartContext';

export default function Profile() {
  const { cartItems, removeFromCart, cartTotal } = useCart();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();

  useEffect(() => {
    async function getProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);
      
      const { data } = await supabase
        .from('orders')
        .select('*')
        .ilike('customer_name', `%${session.user.email}%`) // Check name for email as we stored it there
        .order('created_at', { ascending: false });
      
      if (data) setOrders(data);
      setLoading(false);
    }
    getProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem 2rem', color: 'var(--text-muted)' }}>
    <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
    <p>Loading your Lynix Profile...</p>
  </div>;

  const totalSpent = orders.reduce((total, order) => total + (order.total_amount || 0), 0);

  return (
    <div style={{ maxWidth: '1100px', margin: '3rem auto', padding: '0 1rem' }}>
      
      {/* Premium Profile Header */}
      <div style={{ 
        background: 'rgba(15, 20, 30, 0.7)', padding: '3rem', borderRadius: '32px', border: '1px solid var(--border)', 
        marginBottom: '2.5rem', backdropFilter: 'blur(30px)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(150px)', opacity: '0.2', pointerEvents: 'none' }}></div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', position: 'relative' }}>
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '32px', 
            background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '900', color: '#fff', 
            boxShadow: '0 15px 35px rgba(124,58,237,0.4)', border: '2px solid rgba(255,255,255,0.1)'
          }}>
            {user.email[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '900', margin: '0 0 0.6rem', letterSpacing: '-0.8px', color: '#fff' }}>
              Welcome back, {user.email.split('@')[0]}!
            </h1>
            <div style={{ display: 'flex', gap: '1.2rem', color: 'var(--text-muted)', fontSize: '0.95rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={16} color="var(--primary)"/> {user.email}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} color="var(--accent)"/> Member since {new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
          <button onClick={handleLogout} style={{ 
            background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', 
            padding: '0.9rem 1.8rem', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', 
            display: 'flex', alignItems: 'center', gap: '10px', transition: '0.3s'
          }} className="btn-hover-scale">
            <LogOut size={20} /> Sign Out
          </button>
        </div>

        {/* Stats Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
          {[
            { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={20} color="var(--primary)"/> },
            { label: 'Saved Items', value: '0', icon: <Heart size={20} color="#ec4899"/> },
            { label: 'Total Savings', value: `Rs. ${(totalSpent * 0.1).toLocaleString()}`, icon: <Bell size={20} color="#f59e0b"/> }
          ].map((stat, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {stat.icon} {stat.label}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff' }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-grid">
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', background: 'rgba(15,20,30,0.5)', padding: '1rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
          {[
            { id: 'orders', label: 'My Orders', icon: <Package size={20}/> },
            { id: 'cart', label: 'My Cart', icon: <ShoppingCart size={20}/> },
            { id: 'wishlist', label: 'Wishlist', icon: <Heart size={20}/> },
            { id: 'settings', label: 'Settings', icon: <Settings size={20}/> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%', padding: '1rem 1.2rem', borderRadius: '16px', border: 'none',
                background: activeTab === tab.id ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-soft)',
                display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700', 
                cursor: 'pointer', transition: '0.3s', textAlign: 'left'
              }}
            >
              {tab.icon} {tab.label}
              {tab.id === 'orders' && orders.length > 0 && <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>{orders.length}</span>}
              {tab.id === 'cart' && cartItems.length > 0 && <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>{cartItems.length}</span>}
            </button>
          ))}
        </div>

        {/* Content Column */}
        <div style={{ minHeight: '400px' }}>
          
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Recent Orders</h2>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Showing {orders.length} orders</span>
              </div>

              {orders.length === 0 ? (
                <div style={{ background: 'rgba(15,20,30,0.4)', padding: '5rem 2rem', borderRadius: '32px', border: '1px dotted var(--border)', textAlign: 'center' }}>
                  <Package size={64} style={{ color: 'var(--border)', marginBottom: '1.5rem' }} />
                  <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.8rem' }}>No orders placed yet</h3>
                  <p style={{ color: 'var(--text-soft)', marginBottom: '2rem' }}>Discover our latest premium items and place your first order today!</p>
                  <Link to="/" className="btn-primary" style={{ display: 'inline-flex', padding: '1rem 2.5rem', borderRadius: '16px' }}>Explore Lynix Store</Link>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} style={{ 
                    background: 'rgba(15, 20, 30, 0.8)', borderRadius: '24px', border: '1px solid var(--border)', 
                    overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transition: 'transform 0.2s'
                  }}>
                    {/* Order Header */}
                    <div style={{ padding: '1.5rem 2rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '2rem' }}>
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', marginBottom: '4px' }}>ORDER ID</div>
                          <div style={{ fontWeight: '800', color: '#fff' }}>#LYN-{order.id.toString().slice(0, 8).toUpperCase()}</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', marginBottom: '4px' }}>PLACED ON</div>
                          <div style={{ fontWeight: '600', color: 'var(--text-soft)' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div style={{ 
                        padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '900',
                        background: order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(124, 58, 237, 0.15)',
                        color: order.status === 'Delivered' ? '#10b981' : 'var(--primary)',
                        border: `1px solid ${order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`,
                        display: 'flex', alignItems: 'center', gap: '8px'
                      }}>
                        {order.status === 'Delivered' ? <CheckCircle size={16}/> : <Truck size={16}/>}
                        {order.status || 'Processing'}
                      </div>
                    </div>
                    
                    {/* Order Body */}
                    <div style={{ padding: '2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
                        {JSON.parse(order.items || '[]').map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ width: '60px', height: '60px', background: '#fff', borderRadius: '12px', padding: '5px', flexShrink: 0 }}>
                              <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt={item.name} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#fff', marginBottom: '3px' }}>{item.name}</div>
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Quantity: <strong style={{ color: 'var(--text-soft)' }}>{item.quantity}</strong></span>
                                {item.selectedSize && <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--primary)' }}>Size: {item.selectedSize}</span>}
                                {item.selectedColor && <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--accent)' }}>Color: {item.selectedColor}</span>}
                              </div>
                            </div>
                            <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#fff' }}>Rs. {(item.price * item.quantity).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div style={{ 
                        background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-soft)', fontSize: '0.95rem' }}>
                            <MapPin size={18} color="var(--primary)" /> <span>{order.city}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-soft)', fontSize: '0.95rem' }}>
                            <Phone size={18} color="var(--primary)" /> <span>{order.customer_phone}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '800' }}>TOTAL AMOUNT</div>
                          <div style={{ fontWeight: '900', fontSize: '1.6rem', background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Rs. {order.total_amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'cart' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Active Shopping Cart</h2>
                <Link to="/cart" className="btn-primary" style={{ padding: '0.6rem 1.4rem', borderRadius: '12px', fontSize: '0.9rem' }}>Proceed to Checkout</Link>
              </div>

              {cartItems.length === 0 ? (
                <div style={{ background: 'rgba(15,20,30,0.4)', padding: '5rem 2rem', borderRadius: '32px', border: '1px dotted var(--border)', textAlign: 'center' }}>
                  <ShoppingCart size={64} style={{ color: 'var(--border)', marginBottom: '1.5rem' }} />
                  <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.8rem' }}>Your cart is empty</h3>
                  <Link to="/" className="btn-primary" style={{ display: 'inline-flex', padding: '1rem 2.5rem', borderRadius: '16px' }}>Explore Lynix Store</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {cartItems.map((item, idx) => (
                    <div key={idx} style={{ 
                      background: 'rgba(15, 20, 30, 0.8)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ width: '80px', height: '80px', background: '#fff', borderRadius: '16px', padding: '5px', flexShrink: 0 }}>
                        <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt={item.name} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px' }}>{item.name}</h4>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Qty: <strong style={{ color: 'var(--text-soft)' }}>{item.quantity}</strong></span>
                          {item.selectedSize && <span style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>Size: {item.selectedSize}</span>}
                          {item.selectedColor && <span style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>Color: {item.selectedColor}</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#fff', marginBottom: '6px' }}>Rs. {(item.price * item.quantity).toLocaleString()}</div>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '10px', cursor: 'pointer', transition: '0.2s' }} className="btn-hover-scale">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div style={{ 
                    padding: '1.8rem', background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.1))', 
                    borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem'
                  }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700' }}>SUBTOTAL</div>
                      <div style={{ fontWeight: '900', fontSize: '1.8rem', color: 'var(--primary)' }}>Rs. {cartTotal.toLocaleString()}</div>
                    </div>
                    <Link to="/cart" className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '16px', fontWeight: '800' }}>Confirm & Checkout</Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(15,20,30,0.4)', borderRadius: '32px', border: '1px dotted var(--border)' }}>
              <Heart size={48} color="var(--text-muted)" style={{ marginBottom: '1.2rem' }} />
              <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your Wishlist is Empty</h2>
              <p style={{ color: 'var(--text-soft)' }}>Save your favorite luxury items for later!</p>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div style={{ background: 'rgba(15,20,30,0.6)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--border)' }}>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={28} color="var(--primary)"/> Account Settings
              </h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Display Name</label>
                  <input type="text" className="form-input" defaultValue={user.email.split('@')[0]} readOnly />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-input" defaultValue={user.email} readOnly />
                </div>
                <button className="btn-primary" style={{ background: 'rgba(124, 58, 237, 0.2)', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '1rem', width: 'fit-content' }}>
                  Update Preferences
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
