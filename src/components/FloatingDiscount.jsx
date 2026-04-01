import React, { useState, useEffect } from 'react';
import { Gift, X, Copy, Check, Sparkles } from 'lucide-react';
import { supabase } from '../supabase';

export default function FloatingDiscount() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);
  const [promo, setPromo] = useState(null);

  useEffect(() => {
    async function fetchPromo() {
      try {
        const { data } = await supabase.from('promotions').select('*').eq('id', 1).single();
        if (data && data.is_active === true) {
          setPromo(data);
          const timer = setTimeout(() => {
            setShow(true);
            setIsOpen(true);
          }, 2000);
          return () => clearTimeout(timer);
        } else {
          setPromo(null);
          setShow(false);
          setIsOpen(false);
        }
      } catch (err) {
        console.error("Failed to fetch promo", err);
      }
    }
    fetchPromo();
  }, []);

  const handleCopy = () => {
    if (promo) {
      navigator.clipboard.writeText(promo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!show || !promo) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      left: '30px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '15px'
    }}>
      {/* Unique Glassmorphic Promo Card */}
      <div style={{
         background: 'rgba(15, 23, 42, 0.75)',
         backdropFilter: 'blur(24px)',
         WebkitBackdropFilter: 'blur(24px)',
         border: '1px solid rgba(139, 92, 246, 0.3)',
         borderRadius: '24px',
         padding: '1.5rem',
         width: '320px',
         boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(139, 92, 246, 0.15)',
         transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
         opacity: isOpen ? 1 : 0,
         visibility: isOpen ? 'visible' : 'hidden',
         transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
         position: 'relative',
         overflow: 'hidden'
      }}>
        {/* Animated Glow Elements */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: 'var(--primary)', filter: 'blur(60px)', opacity: 0.5, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '80px', height: '80px', background: 'var(--accent)', filter: 'blur(50px)', opacity: 0.3, pointerEvents: 'none' }}></div>
        
        <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: '0.2s', zIndex: 10 }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '1.2rem', position: 'relative', zIndex: 5 }}>
          <div style={{ 
            width: '45px', height: '45px', borderRadius: '14px', 
            background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)'
          }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <h4 style={{ fontWeight: '900', color: '#fff', fontSize: '1.15rem', letterSpacing: '-0.5px', marginBottom: '2px' }}>{promo.banner_text}</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '800' }}>Save {promo.discount_percentage}% Today</div>
          </div>
        </div>

        <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6', position: 'relative', zIndex: 5 }}>
          {promo.description}
        </p>

        <div style={{ 
          background: 'rgba(0,0,0,0.5)', borderRadius: '14px', border: '1px dashed var(--primary)',
          padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'relative', zIndex: 5
        }}>
          <span style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '3px', color: '#fff', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>{promo.code}</span>
          <button onClick={handleCopy} style={{ 
            background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(124,58,237,0.2)', 
            border: `1px solid ${copied ? 'var(--success)' : 'transparent'}`, 
            color: copied ? 'var(--success)' : 'var(--primary)', 
            padding: '8px', borderRadius: '10px', cursor: 'pointer', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' 
          }} className="btn-hover-scale">
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {(!isOpen) && (
        <button onClick={() => setIsOpen(true)} style={{
          width: '60px', height: '60px', borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          border: 'border: 2px solid rgba(255,255,255,0.2)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(139, 92, 246, 0.5), inset 0 0 15px rgba(255,255,255,0.3)',
          transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          animation: 'fade-in 0.5s ease-out'
        }} className="btn-hover-scale">
          <Gift size={26} color="#fff" />
        </button>
      )}

    </div>
  );
}
