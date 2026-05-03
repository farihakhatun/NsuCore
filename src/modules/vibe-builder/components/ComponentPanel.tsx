import { Component } from '../types';

const COMPONENTS = [
  { type: 'navbar', label: 'Navbar', icon: '🧭', desc: 'Top navigation bar' },
  { type: 'hero', label: 'Hero Section', icon: '🦸', desc: 'Headline, subtitle, CTA' },
  { type: 'heading', label: 'Heading', icon: '📝', desc: 'Big title text' },
  { type: 'text', label: 'Text Block', icon: '📄', desc: 'Paragraph text' },
  { type: 'image', label: 'Image', icon: '🖼️', desc: 'Image block' },
  { type: 'features', label: 'Features', icon: '⚡', desc: '3-column feature grid' },
  { type: 'contact', label: 'Contact Form', icon: '✉️', desc: 'Contact form' },
  { type: 'footer', label: 'Footer', icon: '⬇️', desc: 'Page footer' },
];

const defaultProps: Record<string, any> = {
  navbar: { brand: 'My Brand', links: ['Home', 'About', 'Contact'], ctaText: 'Get Started', bg: '#fff' },
  hero: { title: 'Build Something Amazing', subtitle: 'The fastest way to launch your site', btnText: 'Get Started', btn2Text: 'Learn More', bg: 'linear-gradient(135deg,#667eea,#764ba2)' },
  heading: { text: 'Section Heading', subtitle: 'A brief description of this section', align: 'left' },
  text: { text: 'Your text content here. Edit this to add your own content and tell your story.' },
  image: { src: '', alt: 'Image', width: '100%', radius: '12px' },
  features: { title: 'Why Choose Us', items: [{ icon: '⚡', title: 'Fast', desc: 'Lightning fast performance' }, { icon: '🔒', title: 'Secure', desc: 'Enterprise-grade security' }, { icon: '🎨', title: 'Beautiful', desc: 'Stunning design' }] },
  contact: { title: 'Get In Touch', subtitle: 'We would love to hear from you', btnText: 'Send Message' },
  footer: { text: '© 2025 My Site. All rights reserved.', bg: '#1a1a1a' },
};

export function ComponentPanel({ onAdd }: { onAdd: (c: Component) => void }) {
  function addComponent(type: string) {
    const id = `${type}_${Date.now()}`;
    onAdd({ id, type: type as any, props: { ...defaultProps[type] } });
  }

  return (
    <div style={{ padding: '16px', overflowY: 'auto', height: '100%' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Components</p>
      <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '16px' }}>Click to add to canvas</p>
      {COMPONENTS.map(c => (
        <div key={c.type} onClick={() => addComponent(c.type)}
          style={{ padding: '12px', marginBottom: '8px', background: '#2a2a2a', borderRadius: '8px', cursor: 'pointer', border: '1px solid #333', transition: 'all 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#333')}
          onMouseLeave={e => (e.currentTarget.style.background = '#2a2a2a')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>{c.icon}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#fff' }}>{c.label}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>{c.desc}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}