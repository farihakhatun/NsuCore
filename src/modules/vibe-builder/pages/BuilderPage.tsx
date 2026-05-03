import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ComponentPanel } from '../components/ComponentPanel';
import { ComponentRenderer } from '../components/ComponentRenderer';
import { PropsEditor } from '../components/PropsEditor';
import { saveSite } from '../vibe-api';
import { Component, Page, Site } from '../types';

export function BuilderPage() {
  const { siteId, pageId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [site, setSite] = useState<Site | null>(location.state?.site || null);
  const [userId] = useState(location.state?.userId || localStorage.getItem('user_id') || '');
  const [currentPageId, setCurrentPageId] = useState(pageId || '');
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [panel, setPanel] = useState<'insert' | 'edit' | 'page' | 'site'>('insert');

  const currentPage = site?.pages.find(p => p.id === currentPageId);
  const selectedComponent = currentPage?.components.find(c => c.id === selected);

  function updateComponents(components: Component[]) {
    if (!site) return;
    setSite({
      ...site,
      pages: site.pages.map(p => p.id === currentPageId ? { ...p, components } : p)
    });
  }

  function addComponent(c: Component) {
    if (!currentPage) return;
    updateComponents([...currentPage.components, c]);
    setSelected(c.id);
    setPanel('edit');
  }

  function updateComponent(id: string, props: Record<string, any>) {
    if (!currentPage) return;
    updateComponents(currentPage.components.map(c => c.id === id ? { ...c, props } : c));
  }

  function deleteComponent(id: string) {
    if (!currentPage) return;
    updateComponents(currentPage.components.filter(c => c.id !== id));
    setSelected(null);
    setPanel('insert');
  }

  function moveComponent(id: string, dir: 'up' | 'down') {
    if (!currentPage) return;
    const comps = [...currentPage.components];
    const idx = comps.findIndex(c => c.id === id);
    if (dir === 'up' && idx > 0) [comps[idx - 1], comps[idx]] = [comps[idx], comps[idx - 1]];
    if (dir === 'down' && idx < comps.length - 1) [comps[idx + 1], comps[idx]] = [comps[idx], comps[idx + 1]];
    updateComponents(comps);
  }

  function addPage() {
    if (!site) return;
    const name = prompt('Page name:');
    if (!name) return;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const newPage: Page = { id: `page_${Date.now()}`, name, slug, components: [] };
    setSite({ ...site, pages: [...site.pages, newPage] });
    setCurrentPageId(newPage.id);
  }

  async function handleSave() {
    if (!site || !userId) return;
    setSaving(true);
    try {
      await saveSite(userId, { ...site, updatedAt: new Date().toISOString() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    setSaving(false);
  }

  async function handlePublish() {
    if (!site || !userId) return;
    const updated = { ...site, published: true, updatedAt: new Date().toISOString() };
    setSite(updated);
    setSaving(true);
    try {
      await saveSite(userId, updated);
      alert(`✅ Published! Live at /site/${site.slug}`);
    } catch (e) { console.error(e); }
    setSaving(false);
  }

  if (!site) return (
    <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '48px' }}>😕</p>
        <p>Site not found.</p>
        <button onClick={() => navigate('/app')} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Go to Workspace</button>
      </div>
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui,sans-serif', background: '#111', color: '#fff' }}>
      {/* Top Bar */}
      <div style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#888' }}>
          <button onClick={() => navigate('/app')} style={{ background: 'transparent', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>Workspace</button>
          <span>/</span>
          <span>{site.name}</span>
          <span>/</span>
          <span style={{ color: '#fff' }}>{currentPage?.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {saved && <span style={{ color: '#22c55e', fontSize: '13px' }}>✓ Saved</span>}
          <button onClick={handleSave} disabled={saving}
            style={{ background: '#2a2a2a', border: '1px solid #3a3a3a', color: '#fff', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
            {saving ? '...' : '💾 Save'}
          </button>
          <button onClick={handlePublish}
            style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            🚀 Publish
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel */}
        <div style={{ width: '260px', background: '#1a1a1a', borderRight: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Panel Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #2a2a2a', flexShrink: 0 }}>
            {[{ id: 'insert', icon: '＋', label: 'Insert' }, { id: 'edit', icon: '✏️', label: 'Edit' }, { id: 'page', icon: '📄', label: 'Page' }, { id: 'site', icon: '🌐', label: 'Site' }].map(tab => (
              <button key={tab.id} onClick={() => setPanel(tab.id as any)}
                style={{ flex: 1, padding: '10px 4px', background: 'transparent', border: 'none', color: panel === tab.id ? '#6366f1' : '#888', cursor: 'pointer', fontSize: '11px', fontWeight: 600, borderBottom: panel === tab.id ? '2px solid #6366f1' : '2px solid transparent' }}>
                <div style={{ fontSize: '16px' }}>{tab.icon}</div>
                <div>{tab.label}</div>
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {panel === 'insert' && <ComponentPanel onAdd={addComponent} />}
            {panel === 'edit' && selectedComponent && (
              <PropsEditor component={selectedComponent} onChange={props => updateComponent(selectedComponent.id, props)} onDelete={() => deleteComponent(selectedComponent.id)} />
            )}
            {panel === 'edit' && !selectedComponent && (
              <div style={{ padding: '24px', color: '#888', textAlign: 'center' }}>
                <p style={{ fontSize: '32px' }}>👆</p>
                <p style={{ fontSize: '13px' }}>Click a component on the canvas to edit it</p>
              </div>
            )}
            {panel === 'page' && (
              <div style={{ padding: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Pages</p>
                <p style={{ fontSize: '11px', color: '#666', marginBottom: '16px' }}>Structure</p>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#aaa', marginBottom: '4px' }}>Current page</p>
                <input value={currentPage?.name || ''} readOnly style={{ width: '100%', padding: '8px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box', marginBottom: '12px', outline: 'none' }} />
                {site.pages.map(p => (
                  <div key={p.id} onClick={() => setCurrentPageId(p.id)}
                    style={{ padding: '10px 12px', background: p.id === currentPageId ? '#6366f1' : '#2a2a2a', borderRadius: '8px', cursor: 'pointer', marginBottom: '6px', fontSize: '13px', fontWeight: p.id === currentPageId ? 600 : 400 }}>
                    {p.name}
                  </div>
                ))}
                <button onClick={addPage} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px dashed #444', borderRadius: '8px', color: '#888', cursor: 'pointer', fontSize: '13px', marginTop: '8px' }}>
                  ＋ Add page
                </button>
              </div>
            )}
            {panel === 'site' && (
              <div style={{ padding: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Publish tools</p>
                <div style={{ background: '#2a2a2a', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                  <p style={{ fontWeight: 600, margin: '0 0 4px', fontSize: '14px' }}>{site.name}</p>
                  <p style={{ color: '#888', fontSize: '12px', margin: '0 0 8px' }}>/{site.slug}</p>
                  <p style={{ color: '#666', fontSize: '11px', margin: 0 }}>Draft edits stay private until you publish</p>
                </div>
                <button onClick={() => navigate(`/site/${site.slug}`)} style={{ width: '100%', padding: '10px', background: '#2a2a2a', border: '1px solid #3a3a3a', color: '#888', cursor: 'pointer', borderRadius: '8px', fontSize: '13px', marginBottom: '8px' }}>
                  🌐 View live site
                </button>
                <button onClick={handlePublish} style={{ width: '100%', padding: '10px', background: '#6366f1', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                  🚀 Publish
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#222', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', minHeight: '600px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            {!currentPage?.components.length ? (
              <div style={{ padding: '80px', textAlign: 'center', color: '#aaa' }}>
                <p style={{ fontSize: '48px' }}>🎨</p>
                <p style={{ fontWeight: 600, fontSize: '18px', color: '#555', marginBottom: '8px' }}>Canvas is empty</p>
                <p style={{ fontSize: '14px' }}>Click components from the Insert panel to add them</p>
              </div>
            ) : (
              currentPage.components.map((comp, idx) => (
                <div key={comp.id} style={{ position: 'relative', outline: selected === comp.id ? '2px solid #6366f1' : '2px solid transparent', transition: 'outline 0.15s' }}>
                  <ComponentRenderer component={comp} onEdit={() => { setSelected(comp.id); setPanel('edit'); }} />
                  {selected === comp.id && (
                    <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px', zIndex: 10 }}>
                      <button onClick={() => moveComponent(comp.id, 'up')} disabled={idx === 0} style={{ background: '#6366f1', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>↑</button>
                      <button onClick={() => moveComponent(comp.id, 'down')} disabled={idx === (currentPage?.components.length || 0) - 1} style={{ background: '#6366f1', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>↓</button>
                      <button onClick={() => { deleteComponent(comp.id); }} style={{ background: '#ef4444', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}