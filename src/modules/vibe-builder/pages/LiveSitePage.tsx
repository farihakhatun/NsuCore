import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicSite } from '../vibe-api';
import { ComponentRenderer } from '../components/ComponentRenderer';
import { Site } from '../types';

export function LiveSitePage() {
  const { siteSlug, pageSlug } = useParams();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      if (!siteSlug) { setNotFound(true); setLoading(false); return; }
      const data = await getPublicSite('', siteSlug);
      if (data) setSite(data);
      else setNotFound(true);
      setLoading(false);
    }
    load();
  }, [siteSlug]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #e0e0e0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: '#888' }}>Loading site...</p>
      </div>
    </div>
  );

  if (notFound || !site) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', textAlign: 'center' }}>
      <div>
        <p style={{ fontSize: '56px' }}>😶</p>
        <h2>Site not found</h2>
        <p style={{ color: '#888' }}>This site doesn't exist or hasn't been published.</p>
      </div>
    </div>
  );

  const currentPage = site.pages.find(p => p.slug === (pageSlug || 'home')) || site.pages[0];

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui,sans-serif' }}>
      {currentPage?.components.map(comp => (
        <ComponentRenderer key={comp.id} component={comp} />
      ))}
    </div>
  );
}