import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile, getProfile, uploadMedia, type ProfileData } from '../../lib/selise-api';

const empty: ProfileData = { displayName:'', headline:'', bioText:'', profileImageUrl:'', headerImageUrl:'', linkedinUrl:'', githubUrl:'', portfolioUrl:'' };

export function EditorPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>(empty);
  const [userId, setUserId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('access_token');
        let id = '';
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token payload:', payload);
            id = payload?.user_id || payload?.sub || payload?.userId || payload?.id || '';
          } catch(e) { console.log('Token parse error:', e); }
        }
        if (!id) id = localStorage.getItem('user_id') || '';
        console.log('User ID:', id);
        setUserId(id);
        if (id) {
          localStorage.setItem('user_id', id);
          const existing: any = await getProfile(id);
          console.log('Existing profile:', existing);
          if (existing?.data) setProfile({ ...empty, ...existing.data });
        } else {
          setError('Could not get user ID. Sign out and sign in again.');
        }
      } catch (err) {
        console.error('Load error:', err);
        setError('Failed to load. Please refresh.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    if (!userId) { alert('No user ID. Sign out and in again.'); return; }
    setSaving(true); setError('');
    try {
      await saveProfile(userId, profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError('Save failed: ' + (err?.message || 'Unknown error'));
    } finally { setSaving(false); }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'profileImageUrl' | 'headerImageUrl') {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadMedia(file);
      if (!url) throw new Error('No URL returned');
      setProfile(p => ({ ...p, [field]: url }));
    } catch { alert('Upload failed.'); }
  }

  function set(field: keyof ProfileData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setProfile(p => ({ ...p, [field]: e.target.value }));
  }

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#e8f4f8,#d4eaf7)',flexDirection:'column',gap:'16px',fontFamily:'Segoe UI,sans-serif'}}>
      <div style={{width:'36px',height:'36px',border:'3px solid rgba(91,184,212,0.2)',borderTopColor:'#5bb8d4',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{color:'#3a7a9c'}}>Loading your profile...</p>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#e8f4f8 0%,#d4eaf7 40%,#c8e6f5 100%)',fontFamily:'Segoe UI,sans-serif'}}>
      <div style={{position:'fixed',top:'5%',right:'5%',width:'250px',height:'250px',borderRadius:'50%',background:'rgba(91,184,212,0.1)',border:'1px solid rgba(255,255,255,0.4)',zIndex:0}} />
      <div style={{position:'fixed',bottom:'10%',left:'3%',width:'180px',height:'180px',borderRadius:'30px',background:'rgba(150,210,240,0.12)',border:'1px solid rgba(255,255,255,0.4)',zIndex:0,transform:'rotate(20deg)'}} />

      <div style={{position:'sticky',top:0,zIndex:10,background:'rgba(255,255,255,0.6)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.6)',padding:'14px 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'linear-gradient(135deg,#5bb8d4,#3a9ec2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>⚡</div>
          <span style={{fontSize:'18px',fontWeight:700,color:'#1a3a4a'}}>Profile Editor</span>
        </div>
        <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
          {userId && (
            <a href={`/profile/${userId}`} target="_blank" rel="noreferrer"
              style={{padding:'8px 16px',background:'rgba(91,184,212,0.15)',border:'1px solid rgba(91,184,212,0.3)',borderRadius:'10px',color:'#3a9ec2',textDecoration:'none',fontSize:'13px',fontWeight:600}}>
              View Public Profile
            </a>
          )}
          <button onClick={() => { localStorage.clear(); navigate('/login'); }}
            style={{padding:'8px 16px',background:'rgba(255,255,255,0.6)',border:'1px solid rgba(0,0,0,0.1)',borderRadius:'10px',color:'rgba(20,60,80,0.7)',cursor:'pointer',fontSize:'13px'}}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{maxWidth:'800px',margin:'40px auto',padding:'0 24px',position:'relative',zIndex:1}}>
        {error && <div style={{background:'rgba(255,80,80,0.1)',border:'1px solid rgba(255,80,80,0.3)',borderRadius:'12px',padding:'12px 16px',marginBottom:'20px',color:'#c0392b',fontSize:'14px'}}>⚠️ {error}</div>}
        {userId && <div style={{background:'rgba(91,184,212,0.1)',border:'1px solid rgba(91,184,212,0.2)',borderRadius:'10px',padding:'8px 14px',marginBottom:'16px',fontSize:'12px',color:'#3a7a9c'}}>Logged in as: <strong>{userId}</strong></div>}

        <div style={{background:'rgba(255,255,255,0.7)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.8)',borderRadius:'20px',padding:'32px',marginBottom:'24px',boxShadow:'0 8px 32px rgba(100,180,220,0.1)'}}>
          <h2 style={{fontSize:'17px',fontWeight:700,margin:'0 0 24px',paddingBottom:'16px',borderBottom:'1px solid rgba(91,184,212,0.15)',color:'#1a3a4a'}}>Identity</h2>
          <div style={{display:'flex',gap:'24px',marginBottom:'24px',flexWrap:'wrap'}}>
            <div>
              <label style={{display:'block',color:'rgba(20,60,80,0.7)',fontSize:'13px',marginBottom:'6px',fontWeight:500}}>Profile Picture</label>
              {profile.profileImageUrl && <img src={profile.profileImageUrl} style={{width:'80px',height:'80px',borderRadius:'50%',objectFit:'cover',display:'block',marginBottom:'8px',border:'3px solid rgba(91,184,212,0.3)'}} />}
              <label style={{display:'inline-block',padding:'8px 14px',background:'rgba(91,184,212,0.1)',border:'1px solid rgba(91,184,212,0.25)',borderRadius:'8px',color:'#3a9ec2',fontSize:'12px',cursor:'pointer',fontWeight:500}}>
                Upload Photo<input type="file" accept="image/*" onChange={e => handleUpload(e,'profileImageUrl')} style={{display:'none'}} />
              </label>
            </div>
            <div>
              <label style={{display:'block',color:'rgba(20,60,80,0.7)',fontSize:'13px',marginBottom:'6px',fontWeight:500}}>Header Banner</label>
              {profile.headerImageUrl && <img src={profile.headerImageUrl} style={{width:'200px',height:'80px',borderRadius:'10px',objectFit:'cover',display:'block',marginBottom:'8px',border:'2px solid rgba(91,184,212,0.3)'}} />}
              <label style={{display:'inline-block',padding:'8px 14px',background:'rgba(91,184,212,0.1)',border:'1px solid rgba(91,184,212,0.25)',borderRadius:'8px',color:'#3a9ec2',fontSize:'12px',cursor:'pointer',fontWeight:500}}>
                Upload Banner<input type="file" accept="image/*" onChange={e => handleUpload(e,'headerImageUrl')} style={{display:'none'}} />
              </label>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            <div>
              <label style={{display:'block',color:'rgba(20,60,80,0.7)',fontSize:'13px',marginBottom:'6px',fontWeight:500}}>Display Name</label>
              <input style={{width:'100%',padding:'11px 14px',background:'rgba(255,255,255,0.8)',border:'1px solid rgba(91,184,212,0.25)',borderRadius:'10px',color:'#1a3a4a',fontSize:'14px',outline:'none',fontFamily:'inherit',boxSizing:'border-box'}} value={profile.displayName} onChange={set('displayName')} placeholder="Your name" />
            </div>
            <div>
              <label style={{display:'block',color:'rgba(20,60,80,0.7)',fontSize:'13px',marginBottom:'6px',fontWeight:500}}>Headline</label>
              <input style={{width:'100%',padding:'11px 14px',background:'rgba(255,255,255,0.8)',border:'1px solid rgba(91,184,212,0.25)',borderRadius:'10px',color:'#1a3a4a',fontSize:'14px',outline:'none',fontFamily:'inherit',boxSizing:'border-box'}} value={profile.headline} onChange={set('headline')} placeholder="e.g. Full Stack Developer" />
            </div>
          </div>
          <div style={{marginTop:'16px'}}>
            <label style={{display:'block',color:'rgba(20,60,80,0.7)',fontSize:'13px',marginBottom:'6px',fontWeight:500}}>About Me</label>
            <textarea style={{width:'100%',padding:'11px 14px',background:'rgba(255,255,255,0.8)',border:'1px solid rgba(91,184,212,0.25)',borderRadius:'10px',color:'#1a3a4a',fontSize:'14px',outline:'none',fontFamily:'inherit',boxSizing:'border-box',resize:'vertical'}} rows={5} value={profile.bioText} onChange={set('bioText')} placeholder="Tell the world about yourself..." />
          </div>
        </div>

        <div style={{background:'rgba(255,255,255,0.7)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.8)',borderRadius:'20px',padding:'32px',marginBottom:'24px',boxShadow:'0 8px 32px rgba(100,180,220,0.1)'}}>
          <h2 style={{fontSize:'17px',fontWeight:700,margin:'0 0 24px',paddingBottom:'16px',borderBottom:'1px solid rgba(91,184,212,0.15)',color:'#1a3a4a'}}>Social Links</h2>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',color:'rgba(20,60,80,0.7)',fontSize:'13px',marginBottom:'6px',fontWeight:500}}>LinkedIn URL</label>
            <input style={{width:'100%',padding:'11px 14px',background:'rgba(255,255,255,0.8)',border:'1px solid rgba(91,184,212,0.25)',borderRadius:'10px',color:'#1a3a4a',fontSize:'14px',outline:'none',fontFamily:'inherit',boxSizing:'border-box'}} value={profile.linkedinUrl} onChange={set('linkedinUrl')} placeholder="https://linkedin.com/in/yourname" />
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',color:'rgba(20,60,80,0.7)',fontSize:'13px',marginBottom:'6px',fontWeight:500}}>GitHub URL</label>
            <input style={{width:'100%',padding:'11px 14px',background:'rgba(255,255,255,0.8)',border:'1px solid rgba(91,184,212,0.25)',borderRadius:'10px',color:'#1a3a4a',fontSize:'14px',outline:'none',fontFamily:'inherit',boxSizing:'border-box'}} value={profile.githubUrl} onChange={set('githubUrl')} placeholder="https://github.com/yourname" />
          </div>
          <div>
            <label style={{display:'block',color:'rgba(20,60,80,0.7)',fontSize:'13px',marginBottom:'6px',fontWeight:500}}>Portfolio URL</label>
            <input style={{width:'100%',padding:'11px 14px',background:'rgba(255,255,255,0.8)',border:'1px solid rgba(91,184,212,0.25)',borderRadius:'10px',color:'#1a3a4a',fontSize:'14px',outline:'none',fontFamily:'inherit',boxSizing:'border-box'}} value={profile.portfolioUrl} onChange={set('portfolioUrl')} placeholder="https://yourportfolio.com" />
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'16px',paddingBottom:'40px'}}>
          {saved && <span style={{color:'#2d8a5e',fontSize:'14px',fontWeight:500}}>Saved successfully!</span>}
          <button onClick={handleSave} disabled={saving}
            style={{padding:'12px 36px',background:'linear-gradient(135deg,#5bb8d4,#3a9ec2)',border:'none',borderRadius:'12px',color:'#fff',fontSize:'15px',fontWeight:600,cursor:saving?'not-allowed':'pointer',opacity:saving?0.6:1,boxShadow:'0 8px 24px rgba(91,184,212,0.35)'}}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}