import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Star, Zap } from 'lucide-react';

const pageStyle = {
  maxWidth: '860px',
  margin: '3rem auto',
  padding: '0 1rem',
};

const heroStyle = {
  padding: '3rem 2.5rem',
  borderRadius: '24px',
  background: 'rgba(15, 20, 30, 0.85)',
  border: '1px solid rgba(124, 58, 237, 0.2)',
  backdropFilter: 'blur(16px)',
  marginBottom: '2rem',
  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
};

const sectionStyle = {
  padding: '2rem 2.5rem',
  borderRadius: '16px',
  background: 'rgba(15, 20, 30, 0.6)',
  border: '1px solid var(--border)',
  marginBottom: '1.5rem',
};

const h1Style = {
  fontSize: 'clamp(2rem, 4vw, 3rem)',
  fontWeight: '900',
  letterSpacing: '-1px',
  marginBottom: '1rem',
  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const h2Style = {
  fontSize: '1.3rem',
  fontWeight: '700',
  marginBottom: '1rem',
  color: '#f1f5f9',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const pStyle = {
  color: 'var(--text-soft)',
  lineHeight: '1.85',
  fontSize: '1rem',
};

// =================== ABOUT US ===================
export function AboutUs() {
  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <h1 style={h1Style}>About Trendify</h1>
        <p style={{ ...pStyle, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          Welcome to <strong style={{ color: '#fff' }}>Trendify</strong> — Sri Lanka's premier online destination for trending gadgets, lifestyle accessories, and unbeatable deals. We're dedicated to bringing you the world's most innovative products at prices that make sense.
        </p>
        <p style={pStyle}>
          Founded in 2026, Trendify started with a single mission: make quality, trending products accessible to everyone in Sri Lanka. We directly source every item to eliminate unnecessary markups, so you get the best value for your money with fast island-wide delivery.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { icon: <Zap size={28} color="#7c3aed" />, title: 'Curated Selection', text: 'Every product is hand-picked for quality and value.' },
          { icon: <Truck size={28} color="#06b6d4" />, title: 'Island-Wide Delivery', text: 'Fast and reliable delivery to your doorstep across Sri Lanka.' },
          { icon: <ShieldCheck size={28} color="#10b981" />, title: 'Quality Assured', text: 'We verify every product before it reaches our store.' },
          { icon: <RotateCcw size={28} color="#a855f7" />, title: '14-Day Returns', text: 'Not happy? Easy return policy, no questions asked.' },
        ].map(({ icon, title, text }, i) => (
          <div key={i} style={{ ...sectionStyle, textAlign: 'center', marginBottom: 0 }}>
            <div style={{ marginBottom: '1rem' }}>{icon}</div>
            <h3 style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#fff' }}>{title}</h3>
            <p style={{ ...pStyle, fontSize: '0.9rem' }}>{text}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.9rem 2rem', textDecoration: 'none' }}>
          Browse Our Products
        </Link>
      </div>
    </div>
  );
}

// =================== CONTACT US ===================
export function ContactUs() {
  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <h1 style={h1Style}>Contact Us</h1>
        <p style={{ ...pStyle, fontSize: '1.1rem' }}>
          Need help with an order, have a question about a product, or just want to say hello? We'd love to hear from you. Our team typically responds within 1–2 business hours.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {[
          {
            icon: '📍', title: 'Our Location', line1: 'Colombo, Sri Lanka', line2: 'Online Store', href: null,
          },
          {
            icon: '📞', title: 'Phone / WhatsApp', line1: '+94 78 306 5482', line2: 'Mon–Sat, 9AM – 6PM', href: 'tel:+94783065482',
          },
          {
            icon: '📧', title: 'Email Support', line1: 'hello@lynix.lk', line2: 'We reply within 24 hours', href: 'mailto:hello@lynix.lk',
          },
        ].map(({ icon, title, line1, line2, href }, i) => (
          <div key={i} style={{ ...sectionStyle, marginBottom: 0, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
            <h3 style={{ fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>{title}</h3>
            {href ? (
              <a href={href} style={{ color: 'var(--primary-light)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>{line1}</a>
            ) : (
              <p style={{ color: '#fff', marginBottom: '4px', fontWeight: '600' }}>{line1}</p>
            )}
            <p style={{ ...pStyle, fontSize: '0.88rem' }}>{line2}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// =================== PRIVACY POLICY ===================
export function PrivacyPolicy() {
  return (
    <div style={pageStyle}>
      <div style={{ ...heroStyle, textAlign: 'center' }}>
        <h1 style={h1Style}>Privacy Policy</h1>
        <p style={pStyle}>Last updated: March 2026 | Effective immediately</p>
      </div>

      {[
        {
          title: '1. Information We Collect',
          content: `When you place an order or create an account on Trendify, we collect personal information including your name, email address, phone number, and delivery address. We also collect non-personal technical data such as browser type and IP address to improve our services.`,
        },
        {
          title: '2. How We Use Your Information',
          content: `Your information is used solely to: process and deliver your orders, send you order confirmations and shipping updates, respond to your customer support requests, and improve our website. We do not sell, rent, or trade your personal data to any third parties.`,
        },
        {
          title: '3. Data Security',
          content: `We take your privacy seriously. All transactions are processed through PayHere's secure, PCI-compliant payment gateway. We never store your payment card details on our servers. Your account data is encrypted and stored securely via Supabase.`,
        },
        {
          title: '4. Cookies',
          content: `Our website uses minimal, essential cookies to keep your shopping cart active during your session. We do not use third-party tracking or advertising cookies.`,
        },
        {
          title: '5. Your Rights',
          content: `You have the right to access, correct, or delete the personal data we hold about you. To make a request, please contact us at hello@trendify.lk and we will respond within 5 business days.`,
        },
      ].map(({ title, content }, i) => (
        <div key={i} style={sectionStyle}>
          <h2 style={h2Style}>{title}</h2>
          <p style={pStyle}>{content}</p>
        </div>
      ))}
    </div>
  );
}

// =================== TERMS & CONDITIONS ===================
export function TermsConditions() {
  return (
    <div style={pageStyle}>
      <div style={{ ...heroStyle, textAlign: 'center' }}>
        <h1 style={h1Style}>Terms & Conditions</h1>
        <p style={pStyle}>Last updated: March 2026 | By using Trendify, you agree to these terms.</p>
      </div>

      {[
        {
          title: '1. Acceptance of Terms',
          content: `By accessing or using the Trendify website (trendify.lk), you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, please do not use our service.`,
        },
        {
          title: '2. Products & Pricing',
          content: `All prices are listed in Sri Lankan Rupees (LKR) and are inclusive of taxes where applicable. We reserve the right to modify prices at any time without prior notice. Prices shown at the time of checkout are final for that transaction.`,
        },
        {
          title: '3. Orders & Payments',
          content: `An order is confirmed only after successful payment. We accept payments through PayHere which supports major credit/debit cards and online banking. Your order will be processed within 1–2 business days of payment confirmation.`,
        },
        {
          title: '4. Delivery',
          content: `We deliver island-wide across Sri Lanka. Delivery typically takes 2–4 business days. Delivery is free on all orders. We are not responsible for delays caused by circumstances outside our control.`,
        },
        {
          title: '5. Prohibited Use',
          content: `You agree not to use Lynix for any unlawful purpose or in a way that could damage, disable, or impair our service. Any attempt to access restricted areas of the website is strictly prohibited.`,
        },
        {
          title: '6. Limitation of Liability',
          content: `Lynix shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount paid for the specific order in question.`,
        },
      ].map(({ title, content }, i) => (
        <div key={i} style={sectionStyle}>
          <h2 style={h2Style}>{title}</h2>
          <p style={pStyle}>{content}</p>
        </div>
      ))}
    </div>
  );
}

// =================== REFUND POLICY ===================
export function RefundPolicy() {
  return (
    <div style={pageStyle}>
      <div style={{ ...heroStyle, textAlign: 'center' }}>
        <h1 style={h1Style}>Refund Policy</h1>
        <p style={pStyle}>We stand behind every product we sell. Your satisfaction is our priority.</p>
      </div>

      <div style={{ ...sectionStyle, background: 'rgba(16, 185, 129, 0.07)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
        <h2 style={{ ...h2Style, color: '#10b981' }}>✅ Our 14-Day Return Guarantee</h2>
        <p style={pStyle}>
          If you're not satisfied with your purchase for any reason, you may return eligible items within <strong style={{ color: '#fff' }}>14 days</strong> of receiving your order for a full refund or replacement — no questions asked.
        </p>
      </div>

      {[
        {
          title: '🔍 Eligibility',
          content: `Items must be returned in their original condition and packaging. Products that are damaged due to misuse, or items that are consumable/hygiene products, are not eligible for returns.`,
        },
        {
          title: '📦 How to Return',
          content: `To initiate a return, email us at hello@trendify.lk with your Order ID and photos of the item. Our team will review and approve your return request within 24–48 hours and provide you with return instructions.`,
        },
        {
          title: '💸 Refunds',
          content: `Approved refunds will be processed within 5–7 business days back to your original payment method. For cash-on-delivery orders, refunds will be issued via bank transfer to your provided account.`,
        },
        {
          title: '🔄 Exchanges',
          content: `If you received a defective or incorrect item, we will ship a replacement at no additional cost once the return is approved. Exchanges are subject to stock availability.`,
        },
      ].map(({ title, content }, i) => (
        <div key={i} style={sectionStyle}>
          <h2 style={h2Style}>{title}</h2>
          <p style={pStyle}>{content}</p>
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/contact" style={{ color: 'var(--primary-light)', fontWeight: '600' }}>Contact us for any return queries →</Link>
      </div>
    </div>
  );
}
