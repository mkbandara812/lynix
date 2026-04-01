import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, LogOut, CheckCircle } from 'lucide-react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in directly
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth changes automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // In Supabase, if email confirmation is turned off, they sign in automatically
        setStatus({ type: 'success', message: 'Registration Successful! (If email confirmation is required, check your inbox).' });
        if(data.user?.role === 'authenticated') {
           setTimeout(() => navigate('/'), 1500);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setStatus({ type: 'success', message: 'Logged in successfully!' });
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'An error occurred during authentication.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 3rem', width: '100%', maxWidth: '500px' }}>
          <CheckCircle size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem', display: 'block' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem' }}>Welcome, {user.email?.split('@')[0]}!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
            You are successfully logged in to Lynix. You can now shop, place orders and track them easily.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary full-width" style={{ marginBottom: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
            Start Shopping
          </button>
          <button onClick={handleSignOut} style={{ background: 'transparent', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '1rem', borderRadius: '16px', width: '100%', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.3s' }}>
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '3rem 2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem', textAlign: 'center' }}>{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          {isSignUp ? 'Join Lynix to track orders and save your favorite items.' : 'Login to your account to manage orders and view your cart.'}
        </p>

        {status.message && (
          <div style={{ padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', background: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: status.type === 'error' ? '#ef4444' : '#10b981', border: `1px solid ${status.type === 'error' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`, fontWeight: '600', fontSize: '0.9rem', textAlign: 'center' }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', marginLeft: '4px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="form-input" placeholder="you@example.com" style={{ paddingLeft: '48px', width: '100%' }} />
            </div>
          </div>
          
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', marginLeft: '4px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" className="form-input" placeholder="••••••••" style={{ paddingLeft: '48px', width: '100%' }} />
            </div>
          </div>

          {!isSignUp && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', transition: '0.3s' }}>Forgot Password?</a>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary full-width" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-muted)', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
          <span onClick={() => {setIsSignUp(!isSignUp); setStatus({type:'', message:''});}} style={{ color: 'var(--primary)', fontWeight: '800', cursor: 'pointer', marginLeft: '5px' }}>
            {isSignUp ? 'Sign In' : 'Create Account'}
          </span>
        </div>
      </div>
    </div>
  );
}
