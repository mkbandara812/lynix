import React, { useState, useEffect } from 'react';
import { Truck, Sparkles } from 'lucide-react';
import { supabase } from '../supabase';

export default function TopBanner() {
  const [promo, setPromo] = useState(null);

  useEffect(() => {
    async function fetchPromo() {
      try {
        const { data, error } = await supabase.from('promotions').select('*').eq('id', 1).single();
        if (error) throw error;
        
        if (data && (data.is_free_shipping_active || data.is_bulk_discount_active)) {
          setPromo(data);
        } else {
          setPromo(null);
        }
      } catch (err) { 
        console.error("TopBanner Error:", err.message); 
      }
    }
    fetchPromo();
  }, []);

  if (!promo) return null;

  return (
    <div style={{
      background: promo.is_bulk_discount_active ? '#f43f5e' : 'var(--primary)',
      backgroundImage: promo.is_bulk_discount_active ? 'linear-gradient(135deg, #f43f5e, #e11d48)' : 'var(--gradient-1)',
      color: '#fff',
      padding: '10px',
      textAlign: 'center',
      fontSize: '0.85rem',
      fontWeight: '800',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      letterSpacing: '1px',
      textTransform: 'uppercase'
    }}>
      {promo.is_bulk_discount_active ? <Sparkles size={18} /> : <Truck size={18} />}
      {promo.is_bulk_discount_active ? promo.bulk_discount_banner_text : promo.free_shipping_banner_text}
    </div>
  );
}
