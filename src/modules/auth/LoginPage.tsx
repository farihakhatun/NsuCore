import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/state/store/auth';
import { isLocalhost } from '@/lib/utils/localhost-checker/locahost-checker';

export function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const localHostChecker = isLocalhost();
  const API_BASE = localHostChecker ? '' : 'https://api.seliseblocks.com';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const projectKey = import.meta.env.VITE_X_BLOCKS_KEY;

      if (isRegister) {
        const res = await fetch(`${API_BASE}/identifier/v1/People/Signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-blocks-key': projectKey },
          body: JSON.stringify({
            email, password, displayName,
            firstName: displayName.split(' ')[0],
            lastName: displayName.split(' ')[1] || '',
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err?.message || err?.error_description || 'Signup failed');
        }
        setError('Account created! Please check your email to activate, then sign in.');
        setIsRegister(false);
      } else {
        const formData = new URLSearchParams();
        formData.append('grant_type', 'password');
        formData.append('username', email);
        formData.append('password', password);

        const res = await fetch(`${API_BASE}/idp/v1/Authentication/Token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-blocks-key': projectKey,
          },
          credentials: 'include',
          body: formData,
        });

        const result = await res.json();
        console.log('Login response:', result);

        if (!res.ok) {
          throw new Error(result?.error_description || result?.message || 'Login failed. Check credentials.');
        }

        function decodeJWT(token: string) {
          try {
            const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(decodeURIComponent(
              atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            ));
          } catch { return null; }
        }

        const token = result?.access_token || result?.accessToken || result?.data?.access_token;
        const refreshToken = result?.refresh_token || result?.refreshToken;

        if (token) {
          const authStore = useAuthStore.getState();
          authStore.setAccessToken(token);
          localStorage.setItem('access_token', token);
          if (refreshToken) localStorage.setItem('refresh_token', refreshToken);

          const decoded = decodeJWT(token);
          const userId = decoded?.user_id || decoded?.sub || decoded?.userId || result?.userId || '';
          if (userId) localStorage.setItem('user_id', userId);
          navigate('/app');
        } else {
          setError('Login failed. Check credentials.');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.6)',
    border: '1px solid rgba(91,184,212,0.3)',
    borderRadius: '12px', color: '#1a3a4a',
    fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', backdropFilter: 'blur(4px)',
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#e8f4f8 0%,#d4eaf7 40%,#c8e6f5 100%)', fontFamily:'Segoe UI,sans-serif', padding:'20px' }}>
      <div style={{ position:'fixed', top:'10%', left:'5%', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(100,200,230,0.15)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.3)', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:'15%', right:'8%', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(150,210,240,0.2)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.3)', zIndex:0 }} />
      <div style={{ position:'fixed', top:'40%', left:'2%', width:'120px', height:'120px', borderRadius:'20px', background:'rgba(180,220,245,0.2)', backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.3)', zIndex:0, transform:'rotate(15deg)' }} />

      <div style={{ background:'rgba(255,255,255,0.08)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'24px', padding:'48px 40px', width:'100%', maxWidth:'420px', position:'relative', zIndex:1, boxShadow:'0 25px 60px rgba(100,180,220,0.2)' }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ width:'64px', height:'64px', borderRadius:'18px', background:'linear-gradient(135deg,#5bb8d4,#3a9ec2)', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', boxShadow:'0 8px 24px rgba(91,184,212,0.4)' }}>⚡</div>
          <h1 style={{ color:'#1a3a4a', margin:'0 0 4px', fontSize:'26px', fontWeight:700 }}>NsuCore</h1>
          <p style={{ color:'rgba(30,80,100,0.6)', margin:0, fontSize:'13px' }}>Universal Profile Engine</p>
        </div>

        <form onSubmit={handleSubmit}>
          <h2 style={{ color:'#1a3a4a', fontSize:'20px', marginBottom:'24px', fontWeight:600 }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>

          {isRegister && (
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', color:'rgba(20,60,80,0.7)', fontSize:'13px', marginBottom:'6px', fontWeight:500 }}>Display Name</label>
              <input type="text" value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Your full name" required style={inputStyle} />
            </div>
          )}

          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', color:'rgba(20,60,80,0.7)', fontSize:'13px', marginBottom:'6px', fontWeight:500 }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} />
          </div>

          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', color:'rgba(20,60,80,0.7)', fontSize:'13px', marginBottom:'6px', fontWeight:500 }}>Password</label>
            <div style={{ position:'relative' }}>
              <input type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required minLength={8}
                style={{ ...inputStyle, paddingRight:'44px' }} />
              <button type="button" onClick={()=>setShowPassword(!showPassword)}
                style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'18px', color:'rgba(20,60,80,0.5)', padding:0 }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background:error.includes('created')?'rgba(80,200,120,0.15)':'rgba(255,80,80,0.1)', border:`1px solid ${error.includes('created')?'rgba(80,200,120,0.4)':'rgba(255,80,80,0.3)'}`, color:error.includes('created')?'#2d8a5e':'#c0392b', padding:'10px 14px', borderRadius:'10px', fontSize:'13px', marginBottom:'16px' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#5bb8d4,#3a9ec2)', border:'none', borderRadius:'12px', color:'#fff', fontSize:'15px', fontWeight:600, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1, boxShadow:'0 8px 24px rgba(91,184,212,0.4)', marginTop:'8px' }}>
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', color:'rgba(20,60,80,0.6)', fontSize:'13px', marginTop:'20px' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={()=>{ setIsRegister(!isRegister); setError(''); }}
            style={{ background:'none', border:'none', color:'#3a9ec2', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}