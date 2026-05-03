import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfile, type ProfileData } from '../../lib/selise-api';

export function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      if (!userId) { setNotFound(true); setLoading(false); return; }
      try {
        const result: any = await getProfile(userId);
        if (result?.data) setProfile(result.data);
        else setNotFound(true);
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    }
    load();
  }, [userId]);

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#e8f4f8,#d4eaf7)', fontFamily:'Segoe UI,sans-serif', gap:'12px' }}>
      <div style={{ width:'32px', height:'32px', border:'3px solid rgba(91,184,212,0.2)', borderTopColor:'#5bb8d4', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color:'#3a7a9c' }}>Loading profile...</p>
    </div>
  );

  if (notFound || !profile) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#e8f4f8,#d4eaf7)', fontFamily:'Segoe UI,sans-serif', gap:'12px', textAlign:'center' }}>
      <span style={{ fontSize:'56px' }}>😶</span>
      <h2 style={{ color:'#1a3a4a', margin:0 }}>Profile not found</h2>
      <p style={{ color:'rgba(20,60,80,0.5)', margin:0 }}>This user hasn't set up their profile yet.</p>
      <button onClick={() => navigate('/login')}
        style={{ marginTop:'16px', padding:'12px 24px', background:'linear-gradient(135deg,#5bb8d4,#3a9ec2)', border:'none', borderRadius:'10px', color:'#fff', fontSize:'14px', fontWeight:600, cursor:'pointer' }}>
        Get Started
      </button>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#e8f4f8 0%,#d4eaf7 40%,#c8e6f5 100%)', fontFamily:'Segoe UI,sans-serif' }}>
      <div style={{ position:'fixed', top:'5%', right:'5%', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(91,184,212,0.08)', border:'1px solid rgba(255,255,255,0.5)', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:'10%', left:'3%', width:'200px', height:'200px', borderRadius:'30px', background:'rgba(150,210,240,0.1)', border:'1px solid rgba(255,255,255,0.5)', zIndex:0, transform:'rotate(20deg)' }} />

      {/* Banner */}
      <div style={{ height:'220px', backgroundImage: profile.headerImageUrl ? `url(${profile.headerImageUrl})` : 'linear-gradient(135deg,#5bb8d4,#3a9ec2)', backgroundSize:'cover', backgroundPosition:'center', position:'relative', zIndex:1 }} />

      <div style={{ maxWidth:'680px', margin:'0 auto', padding:'0 24px 60px', position:'relative', zIndex:1 }}>
        {/* Avatar */}
        <div style={{ marginTop:'-60px', marginBottom:'20px' }}>
          {profile.profileImageUrl
            ? <img src={profile.profileImageUrl} alt={profile.displayName} style={{ width:'120px', height:'120px', borderRadius:'50%', objectFit:'cover', border:'4px solid #fff', boxShadow:'0 8px 30px rgba(91,184,212,0.3)' }} />
            : <div style={{ width:'120px', height:'120px', borderRadius:'50%', background:'linear-gradient(135deg,#5bb8d4,#3a9ec2)', border:'4px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'48px', fontWeight:700, color:'#fff', boxShadow:'0 8px 30px rgba(91,184,212,0.3)' }}>
                {profile.displayName?.[0]?.toUpperCase() || '?'}
              </div>
          }
        </div>

        {/* Name & Headline */}
        <h1 style={{ fontSize:'32px', fontWeight:800, margin:'0 0 8px', color:'#1a3a4a', letterSpacing:'-0.5px' }}>{profile.displayName || 'Anonymous'}</h1>
        {profile.headline && <p style={{ color:'rgba(20,60,80,0.6)', fontSize:'16px', margin:'0 0 28px' }}>{profile.headline}</p>}

        {/* Get Started Button */}
        <button onClick={() => navigate('/login')}
          style={{ marginBottom:'28px', padding:'12px 28px', background:'linear-gradient(135deg,#5bb8d4,#3a9ec2)', border:'none', borderRadius:'10px', color:'#fff', fontSize:'14px', fontWeight:600, cursor:'pointer', boxShadow:'0 4px 15px rgba(91,184,212,0.3)' }}>
          🚀 Get Started — Build Your Own
        </button>

        {/* Bio */}
        {profile.bioText && (
          <div style={{ background:'rgba(255,255,255,0.7)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.8)', borderRadius:'20px', padding:'24px', marginBottom:'24px', boxShadow:'0 8px 32px rgba(91,184,212,0.1)' }}>
            <h3 style={{ fontSize:'12px', textTransform:'uppercase', letterSpacing:'1.5px', color:'rgba(20,60,80,0.4)', margin:'0 0 12px', fontWeight:600 }}>About</h3>
            <p style={{ color:'rgba(20,60,80,0.8)', lineHeight:1.7, margin:0, whiteSpace:'pre-wrap' }}>{profile.bioText}</p>
          </div>
        )}

        {/* Links */}
        {(profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl) && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', marginBottom:'40px' }}>
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer"
                style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 20px', background:'rgba(255,255,255,0.7)', backdropFilter:'blur(10px)', border:'1px solid rgba(10,102,194,0.2)', borderRadius:'14px', color:'#0a66c2', textDecoration:'none', fontSize:'14px', fontWeight:600 }}>
                <span style={{ background:'#0a66c2', color:'#fff', fontWeight:800, padding:'2px 6px', borderRadius:'4px', fontSize:'11px' }}>in</span> LinkedIn
              </a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer"
                style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 20px', background:'rgba(255,255,255,0.7)', backdropFilter:'blur(10px)', border:'1px solid rgba(0,0,0,0.1)', borderRadius:'14px', color:'#1a3a4a', textDecoration:'none', fontSize:'14px', fontWeight:600 }}>
                🐙 GitHub
              </a>
            )}
            {profile.portfolioUrl && (
              <a href={profile.portfolioUrl} target="_blank" rel="noreferrer"
                style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 20px', background:'rgba(255,255,255,0.7)', backdropFilter:'blur(10px)', border:'1px solid rgba(91,184,212,0.25)', borderRadius:'14px', color:'#3a9ec2', textDecoration:'none', fontSize:'14px', fontWeight:600 }}>
                🌐 Portfolio
              </a>
            )}
          </div>
        )}

        <div style={{ textAlign:'center', color:'rgba(20,60,80,0.35)', fontSize:'12px', paddingTop:'20px', borderTop:'1px solid rgba(91,184,212,0.15)' }}>
          Powered by <strong style={{ color:'rgba(20,60,80,0.5)' }}>NsuCore</strong> · Universal Profile Engine
        </div>
      </div>
    </div>
  );
}