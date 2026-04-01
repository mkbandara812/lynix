import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer" style={{ borderTop: '1px solid var(--border)', background: 'transparent', marginTop: '5rem', padding: '5rem 0' }}>
      <div className="container" style={{ padding: '0 2.5rem' }}>
        <div className="footer-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h4 style={{ fontSize: '2rem', letterSpacing: '-2px', color: '#fff' }}>LYNIX</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '300px', lineHeight: '1.8' }}>
              Sri Lanka's premier destination for curated luxury finds and everyday excellence. Quality you can trust.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h5 style={{ color: '#fff', fontSize: '0.9rem', letterSpacing: '1px' }}>EXPLORE</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>About Us</Link>
              <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Contact Us</Link>
              <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Shop Collection</Link>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h5 style={{ color: '#fff', fontSize: '0.9rem', letterSpacing: '1px' }}>LEGAL</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service</Link>
              <Link to="/refund" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Refund Policy</Link>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h5 style={{ color: '#fff', fontSize: '0.9rem', letterSpacing: '1px' }}>CONTACT</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <p>+94 78 306 5482</p>
              <p>support@lynix.com</p>
              <a 
                href="https://wa.me/94783065482" 
                target="_blank" 
                rel="noreferrer" 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', 
                  textDecoration: 'none', fontWeight: 'bold' 
                }}
              >
                <MessageSquare size={16} /> WhatsApp Support
              </a>
              <p style={{ marginTop: '5px' }}>Colombo, Sri Lanka</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', marginTop: '5rem', paddingTop: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '1px' }}>&copy; 2026 LYNIX PREMIUM STORE. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}
