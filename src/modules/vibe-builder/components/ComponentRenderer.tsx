import { Component } from '../types';

export function ComponentRenderer({ component, onEdit }: { component: Component; onEdit?: () => void }) {
  const { type, props } = component;

  const editStyle: React.CSSProperties = onEdit ? {
    cursor: 'pointer', outline: '2px solid transparent', transition: 'outline 0.2s'
  } : {};

  switch (type) {
    case 'navbar':
      return (
        <nav style={{ background: props.bg || '#fff', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', ...editStyle }} onClick={onEdit}>
          <div style={{ fontWeight: 700, fontSize: '20px', color: props.color || '#1a1a1a' }}>{props.brand || 'My Brand'}</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {(props.links || ['Home', 'About', 'Contact']).map((link: string, i: number) => (
              <a key={i} href="#" style={{ color: props.linkColor || '#555', textDecoration: 'none', fontSize: '14px' }}>{link}</a>
            ))}
          </div>
          {props.ctaText && <button style={{ background: props.ctaBg || '#6366f1', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>{props.ctaText}</button>}
        </nav>
      );

    case 'hero':
      return (
        <div style={{ background: props.bg || 'linear-gradient(135deg,#667eea,#764ba2)', padding: '80px 48px', textAlign: props.align || 'center', ...editStyle }} onClick={onEdit}>
          {props.eyebrow && <p style={{ color: props.eyebrowColor || 'rgba(255,255,255,0.7)', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>{props.eyebrow}</p>}
          <h1 style={{ fontSize: props.titleSize || '56px', fontWeight: 800, color: props.color || '#fff', margin: '0 0 16px', lineHeight: 1.1 }}>{props.title || 'Build Your Dream Site'}</h1>
          {props.subtitle && <p style={{ fontSize: '20px', color: props.subtitleColor || 'rgba(255,255,255,0.8)', margin: '0 0 32px' }}>{props.subtitle}</p>}
          <div style={{ display: 'flex', gap: '12px', justifyContent: props.align === 'left' ? 'flex-start' : 'center', flexWrap: 'wrap' }}>
            {props.btnText && <button style={{ background: props.btnBg || '#fff', color: props.btnColor || '#6366f1', border: 'none', padding: '14px 32px', borderRadius: '10px', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>{props.btnText}</button>}
            {props.btn2Text && <button style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.5)', padding: '14px 32px', borderRadius: '10px', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>{props.btn2Text}</button>}
          </div>
        </div>
      );

    case 'heading':
      return (
        <div style={{ padding: '40px 48px', textAlign: props.align || 'left', background: props.bg || 'transparent', ...editStyle }} onClick={onEdit}>
          <h2 style={{ fontSize: props.size || '36px', fontWeight: 700, color: props.color || '#1a1a1a', margin: 0 }}>{props.text || 'Section Heading'}</h2>
          {props.subtitle && <p style={{ color: '#666', marginTop: '8px', fontSize: '16px' }}>{props.subtitle}</p>}
        </div>
      );

    case 'text':
      return (
        <div style={{ padding: '24px 48px', background: props.bg || 'transparent', ...editStyle }} onClick={onEdit}>
          <p style={{ fontSize: props.size || '16px', color: props.color || '#444', lineHeight: 1.8, margin: 0, maxWidth: props.maxWidth || '800px' }}>{props.text || 'Your text content here. Click to edit.'}</p>
        </div>
      );

    case 'image':
      return (
        <div style={{ padding: '24px 48px', textAlign: 'center', background: props.bg || 'transparent', ...editStyle }} onClick={onEdit}>
          {props.src
            ? <img src={props.src} alt={props.alt || ''} style={{ maxWidth: '100%', width: props.width || '100%', borderRadius: props.radius || '0', objectFit: 'cover' }} />
            : <div style={{ background: '#f0f0f0', height: '300px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '48px' }}>🖼️</div>
          }
          {props.caption && <p style={{ color: '#888', fontSize: '13px', marginTop: '8px' }}>{props.caption}</p>}
        </div>
      );

    case 'features':
      return (
        <div style={{ padding: '60px 48px', background: props.bg || '#f9fafb', ...editStyle }} onClick={onEdit}>
          {props.title && <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 700, marginBottom: '40px', color: '#1a1a1a' }}>{props.title}</h2>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '24px' }}>
            {(props.items || [{ icon: '⚡', title: 'Fast', desc: 'Lightning fast performance' }, { icon: '🔒', title: 'Secure', desc: 'Enterprise-grade security' }, { icon: '🎨', title: 'Beautiful', desc: 'Stunning design out of the box' }]).map((item: any, i: number) => (
              <div key={i} style={{ background: '#fff', padding: '28px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '8px', color: '#1a1a1a' }}>{item.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'contact':
      return (
        <div style={{ padding: '60px 48px', background: props.bg || '#fff', ...editStyle }} onClick={onEdit}>
          {props.title && <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>{props.title}</h2>}
          {props.subtitle && <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>{props.subtitle}</p>}
          <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input placeholder="Your name" style={{ padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
            <input placeholder="Your email" style={{ padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
            <textarea placeholder="Your message" rows={4} style={{ padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
            <button style={{ background: props.btnBg || '#6366f1', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '15px' }}>{props.btnText || 'Send Message'}</button>
          </div>
        </div>
      );

    case 'footer':
      return (
        <footer style={{ background: props.bg || '#1a1a1a', color: props.color || '#aaa', padding: '40px 48px', textAlign: 'center', ...editStyle }} onClick={onEdit}>
          <p style={{ margin: 0, fontSize: '14px' }}>{props.text || '© 2025 My Site. All rights reserved.'}</p>
        </footer>
      );

    default:
      return null;
  }
}