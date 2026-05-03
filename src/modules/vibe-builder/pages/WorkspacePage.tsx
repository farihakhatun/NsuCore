import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Site } from '../types';

const STORAGE_KEY = 'vibe_sites';
function loadAll(): any[] { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'); } catch { return []; } }
function saveAll(sites: any[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(sites)); }
function getUID(): string {
  let id = localStorage.getItem('user_id')||'';
  if (!id) { try { const p=JSON.parse(atob((localStorage.getItem('access_token')||'').split('.')[1])); id=p?.user_id||p?.sub||''; if(id) localStorage.setItem('user_id',id); } catch{} }
  return id;
}

export function WorkspacePage() {
  const navigate = useNavigate();
  const [sites, setSites] = useState<any[]>([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [newSiteName, setNewSiteName] = useState('My portfolio');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const id = getUID();
    setUserId(id);
    setSites(loadAll().filter((s:any) => s.userId === id));
    setLoading(false);
  }, []);

  function createSite() {
    if (!newSiteName.trim()) return;
    setCreating(true);
    const id = getUID();
    const slug = newSiteName.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
    const site: any = {
      id: `site_${Date.now()}`,
      name: newSiteName, slug,
      pages: [{ id: `page_${Date.now()}`, name: 'Home', slug: 'home', components: [] }],
      published: false, userId: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const all = loadAll();
    all.push(site);
    saveAll(all);
    setSites(all.filter((s:any) => s.userId === id));
    setCreating(false);
    navigate(`/app/sites/${site.id}/pages/${site.pages[0].id}`, { state: { site, userId: id } });
  }

  function handleDelete(site: any, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Delete "${site.name}"?`)) return;
    const all = loadAll().filter((s:any) => s.id !== site.id);
    saveAll(all);
    setSites(all.filter((s:any) => s.userId === userId));
  }

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#111',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontFamily:'system-ui'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:'40px',height:'40px',border:'3px solid #333',borderTopColor:'#6366f1',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 16px'}} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{color:'#888'}}>Loading workspace...</p>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#111',fontFamily:'system-ui,sans-serif',color:'#fff'}}>
      <div style={{background:'#1a1a1a',borderBottom:'1px solid #2a2a2a',padding:'14px 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'32px',height:'32px',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'16px'}}>V</div>
          <span style={{fontWeight:700,fontSize:'16px'}}>VibeBuilder</span>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }}
          style={{background:'transparent',border:'1px solid #333',color:'#888',padding:'6px 14px',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}}>
          Sign Out
        </button>
      </div>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'40px 24px'}}>
        <div style={{background:'linear-gradient(135deg,#1e1b4b,#312e81)',borderRadius:'20px',padding:'48px',marginBottom:'48px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'relative',zIndex:1,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'24px'}}>
            <div>
              <p style={{color:'rgba(255,255,255,0.5)',fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>WORKBENCH</p>
              <h1 style={{fontSize:'36px',fontWeight:800,margin:'0 0 12px'}}>Welcome back.</h1>
              <p style={{color:'rgba(255,255,255,0.6)',margin:0}}>Create a new vibe or continue where you left off.</p>
            </div>
            <div style={{background:'rgba(255,255,255,0.08)',borderRadius:'16px',padding:'24px',minWidth:'300px'}}>
              <p style={{fontSize:'13px',color:'#aaa',marginBottom:'10px'}}>Site Name</p>
              <div style={{display:'flex',gap:'8px'}}>
                <input value={newSiteName} onChange={e=>setNewSiteName(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&createSite()}
                  style={{flex:1,padding:'10px 14px',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'8px',color:'#fff',fontSize:'14px',outline:'none'}} />
                <button onClick={createSite} disabled={creating}
                  style={{background:'#6366f1',color:'#fff',border:'none',padding:'10px 18px',borderRadius:'8px',cursor:'pointer',fontWeight:600,fontSize:'14px'}}>
                  {creating?'...':'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'16px',marginBottom:'40px'}}>
          <div style={{background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'12px',padding:'20px'}}>
            <p style={{color:'#666',fontSize:'12px',marginBottom:'4px'}}>TOTAL SITES</p>
            <p style={{fontSize:'24px',fontWeight:700,margin:0}}>{sites.length}</p>
          </div>
          <div style={{background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'12px',padding:'20px'}}>
            <p style={{color:'#666',fontSize:'12px',marginBottom:'4px'}}>STATUS</p>
            <p style={{fontSize:'24px',fontWeight:700,color:'#22c55e',margin:0}}>Online</p>
          </div>
        </div>

        <h2 style={{fontSize:'20px',fontWeight:600,marginBottom:'20px'}}>Your Projects</h2>
        {sites.length===0 ? (
          <div style={{textAlign:'center',padding:'80px',background:'#161616',borderRadius:'16px',border:'1px dashed #333'}}>
            <p style={{fontSize:'40px',margin:'0 0 12px'}}>🌐</p>
            <p style={{color:'#555'}}>No sites yet. Create one above!</p>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'20px'}}>
            {sites.map((site:any) => (
              <div key={site.id}
                onClick={()=>navigate(`/app/sites/${site.id}/pages/${site.pages?.[0]?.id}`,{state:{site,userId}})}
                style={{background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'16px',overflow:'hidden',cursor:'pointer'}}
                onMouseEnter={e=>(e.currentTarget.style.borderColor='#6366f1')}
                onMouseLeave={e=>(e.currentTarget.style.borderColor='#2a2a2a')}>
                <div style={{height:'140px',background:'linear-gradient(135deg,#1e1b4b,#312e81)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px'}}>🌐</div>
                <div style={{padding:'20px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'start'}}>
                    <div>
                      <h3 style={{margin:'0 0 4px',fontSize:'16px'}}>{site.name}</h3>
                      <p style={{color:'#666',fontSize:'13px',margin:0}}>/{site.slug} · {site.pages?.length||1} page(s)</p>
                    </div>
                    <button onClick={e=>handleDelete(site,e)}
                      style={{background:'transparent',border:'none',color:'#555',cursor:'pointer',fontSize:'18px'}}>🗑</button>
                  </div>
                  <span style={{display:'inline-block',marginTop:'8px',background:site.published?'rgba(34,197,94,0.1)':'rgba(255,255,255,0.05)',color:site.published?'#22c55e':'#888',padding:'2px 10px',borderRadius:'20px',fontSize:'11px'}}>
                    {site.published?'Live':'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}