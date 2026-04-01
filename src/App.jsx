// Lynix Premium E-commerce
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LogIn, Store, Menu, X, LogOut, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetails from './pages/ProductDetails';
import { AboutUs, ContactUs, PrivacyPolicy, TermsConditions, RefundPolicy } from './pages/InfoPages';
import Footer from './components/Footer';
import { CartProvider, useCart } from './CartContext';
import FloatingDiscount from './components/FloatingDiscount';
import TopBanner from './components/TopBanner';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Navbar() {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user || null));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="navbar" style={{ background: 'rgba(2, 6, 23, 0.7)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 2rem' }}>
        <Link to="/" className="nav-brand" style={{ fontSize: '2.2rem', letterSpacing: '-2.5px' }}>
          LYNIX
        </Link>

        <div className="nav-links" style={{ gap: '2.5rem' }}>
          <Link to="/" className="nav-item" style={{ fontSize: '0.85rem', letterSpacing: '1.5px', fontWeight: '800' }}>HOME</Link>
          <Link to="/profile" className="nav-item" style={{ fontSize: '0.85rem', letterSpacing: '1.5px', fontWeight: '800' }}>
            {user ? 'ACCOUNT' : 'LOGIN'}
          </Link>
          <Link to="/cart" className="btn-primary" style={{ height: '44px', padding: '0 1.4rem', borderRadius: '14px', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '0.5px' }}>
            CART ({cartCount})
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <FloatingDiscount />
      <TopBanner />
      <div className="app-container">
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/refund" element={<RefundPolicy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
