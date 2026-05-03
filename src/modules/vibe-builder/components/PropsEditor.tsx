import { Component } from '../types';

export function PropsEditor({ component, onChange, onDelete }: {
  component: Component;
  onChange: (props: Record<string, any>) => void;
  onDelete: () => void;
}) {
  function update(key: string, value: any) {
    onChange({ ...component.props, [key]: value });
  }

  const inp: React.CSSProperties = {
    width:'100%',padding:'8px 10px',background:'#2a2a2a',border:'1px solid #444',
    borderRadius:'6px',color:'#fff',fontSize:'13px',outline:'none',boxSizing:'border-box'
  };
  const lbl: React.CSSProperties = { display:'block',fontSize:'11px',color:'#aaa',marginBottom:'4px',fontWeight:500 };
  const group: React.CSSProperties = { marginBottom:'16px' };

  const renderFields = () => {
    const p = component.props;
    switch (component.type) {
      case 'navbar': return (<>
        <div style={group}><label style={lbl}>Brand Name</label><input style={inp} value={p.brand||''} onChange={e=>update('brand',e.target.value)} /></div>
        <div style={group}><label style={lbl}>CTA Text</label><input style={inp} value={p.ctaText||''} onChange={e=>update('ctaText',e.target.value)} /></div>
        <div style={group}><label style={lbl}>Background</label><input type="color" style={{...inp,padding:'4px',height:'36px'}} value={p.bg||'#ffffff'} onChange={e=>update('bg',e.target.value)} /></div>
      </>);
      case 'hero': return (<>
        <div style={group}><label style={lbl}>Title</label><input style={inp} value={p.title||''} onChange={e=>update('title',e.target.value)} /></div>
        <div style={group}><label style={lbl}>Subtitle</label><input style={inp} value={p.subtitle||''} onChange={e=>update('subtitle',e.target.value)} /></div>
        <div style={group}><label style={lbl}>Button 1 Text</label><input style={inp} value={p.btnText||''} onChange={e=>update('btnText',e.target.value)} /></div>
        <div style={group}><label style={lbl}>Button 2 Text</label><input style={inp} value={p.btn2Text||''} onChange={e=>update('btn2Text',e.target.value)} /></div>
        <div style={group}><label style={lbl}>Align</label>
          <select style={inp} value={p.align||'center'} onChange={e=>update('align',e.target.value)}>
            <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
          </select>
        </div>
      </>);
      case 'heading': return (<>
        <div style={group}><label style={lbl}>Text</label><input style={inp} value={p.text||''} onChange={e=>update('text',e.target.value)} /></div>
        <div style={group}><label style={lbl}>Subtitle</label><input style={inp} value={p.subtitle||''} onChange={e=>update('subtitle',e.target.value)} /></div>
        <div style={group}><label style={lbl}>Color</label><input type="color" style={{...inp,padding:'4px',height:'36px'}} value={p.color||'#1a1a1a'} onChange={e=>update('color',e.target.value)} /></div>
      </>);
      case 'text': return (<>
        <div style={group}><label style={lbl}>Content</label><textarea style={{...inp,resize:'vertical'}} rows={6} value={p.text||''} onChange={e=>update('text',e.target.value)} /></div>
        <div style={group}><label style={lbl}>Color</label><input type="color" style={{...inp,padding:'4px',height:'36px'}} value={p.color||'#444444'} onChange={e=>update('color',e.target.value)} /></div>
      </>);
      case 'image': return (<>
        <div style={group}><label style={lbl}>Image URL</label><input style={inp} value={p.src||''} onChange={e=>update('src',e.target.value)} placeholder="https://..." /></div>
        <div style={group}><label style={lbl}>Alt Text</label><input style={inp} value={p.alt||''} onChange={e=>update('alt',e.target.value)} /></div>
        <div style={group}><label style={lbl}>Border Radius</label><input style={inp} value={p.radius||'0'} onChange={e=>update('radius',e.target.value)} placeholder="12px" /></div>
      </>);
      case 'features': return (<>
        <div style={group}><label style={lbl}>Section Title</label><input style={inp} value={p.title||''} onChange={e=>update('title',e.target.value)} /></div>
        <div style={group}><label style={lbl}>Background</label><input type="color" style={{...inp,padding:'4px',height:'36px'}} value={p.bg||'#f9fafb'} onChange={e=>update('bg',e.target.value)} /></div>
      </>);
      case 'contact': return (<>
        <div style={group}><label style={lbl}>Title</label><input style={inp} value={p.title||''} onChange={e=>update('title',e.target.value)} /></div>
        <div style={group}><label style={lbl}>Button Text</label><input style={inp} value={p.btnText||''} onChange={e=>update('btnText',e.target.value)} /></div>
      </>);
      case 'footer': return (<>
        <div style={group}><label style={lbl}>Footer Text</label><input style={inp} value={p.text||''} onChange={e=>update('text',e.target.value)} /></div>
        <div style={group}><label style={lbl}>Background</label><input type="color" style={{...inp,padding:'4px',height:'36px'}} value={p.bg||'#1a1a1a'} onChange={e=>update('bg',e.target.value)} /></div>
      </>);
      default: return null;
    }
  };

  return (
    <div style={{padding:'16px',overflowY:'auto',height:'100%'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
        <p style={{fontSize:'13px',fontWeight:600,color:'#fff',margin:0,textTransform:'capitalize'}}>{component.type}</p>
        <button onClick={onDelete} style={{background:'rgba(239,68,68,0.2)',border:'1px solid rgba(239,68,68,0.4)',color:'#ef4444',padding:'4px 10px',borderRadius:'6px',cursor:'pointer',fontSize:'12px'}}>Delete</button>
      </div>
      {renderFields()}
    </div>
  );
}