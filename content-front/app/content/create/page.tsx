"use client";
import { useState, useEffect, useRef } from "react";

/* ══ DATA ══════════════════════════════════════════════════════ */
const POST_TYPES = [
  { id:"blog",     label:"Blog Post",     icon:"✍️",  color:"#a78bfa", desc:"Long-form article with SEO structure" },
  { id:"social",   label:"Social Media",  icon:"📡",  color:"#fd79a8", desc:"Platform-native posts with hashtags" },
  { id:"product",  label:"Product Drop",  icon:"🛍️",  color:"#fbbf24", desc:"Sales copy that converts" },
  { id:"youtube",  label:"YouTube",       icon:"▶️",  color:"#f87171", desc:"Titles, descriptions & tags" },
  { id:"tiktok",   label:"TikTok",        icon:"🎵",  color:"#34d399", desc:"Hooks, captions & viral angles" },
];

const PLATFORMS = [
  { id:"instagram", label:"IG",       full:"Instagram", color:"#e1306c" },
  { id:"twitter",   label:"𝕏",        full:"X / Twitter", color:"#1d9bf0" },
  { id:"linkedin",  label:"in",       full:"LinkedIn", color:"#0a66c2" },
  { id:"facebook",  label:"f",        full:"Facebook", color:"#1877f2" },
  { id:"threads",   label:"@",        full:"Threads", color:"#a78bfa" },
  { id:"pinterest", label:"P",        full:"Pinterest", color:"#e60023" },
];

const TONES = [
  { id:"casual",        label:"Casual",        emoji:"😊" },
  { id:"professional",  label:"Pro",           emoji:"💼" },
  { id:"funny",         label:"Funny",         emoji:"😂" },
  { id:"inspirational", label:"Inspire",       emoji:"✨" },
  { id:"educational",   label:"Educate",       emoji:"📚" },
  { id:"persuasive",    label:"Persuade",      emoji:"🎯" },
];

/* ══ PROMPT BUILDER ════════════════════════════════════════════ */
function buildPrompt({ topic, postType, platforms, length, tone }: { topic: string; postType: string; platforms: string[]; length: string; tone: string }) {
  const wordMap = { short:"short (under 100 words)", medium:"medium (150–250 words)", long:"long and detailed (400+ words)" };
  const base = `You are CreatorAI. Generate ${wordMap[length as keyof typeof wordMap]||"medium"} content in a ${tone} tone about: "${topic}".`;
  if (postType==="blog")    return `${base}\n\nWrite a blog post: catchy title, intro, 3 sections with subheadings (use ## for headings), conclusion. Use markdown.`;
  if (postType==="social")  return `${base}\n\nWrite tailored posts for: ${platforms.join(", ")||"social media"}. Label each with the platform as ## heading. Include platform-specific hashtags.`;
  if (postType==="product") return `${base}\n\nWrite a product post: headline, bullet-point benefits, short description, call-to-action.`;
  if (postType==="youtube") return `${base}\n\nWrite: 3 YouTube title options, an SEO description (with CTA), and 10 tags.`;
  if (postType==="tiktok")  return `${base}\n\nWrite: hook (first 3 seconds), main caption with emojis, 10 trending hashtags, brief content idea.`;
  return base;
}

/* ══ RENDER MARKDOWN ═══════════════════════════════════════════ */
function RichText({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div style={{fontFamily:"'DM Sans',sans-serif"}}>
      {text.split("\n").map((line: string, i: number) => {
        if (line.startsWith("## ")) return <h3 key={i} style={{color:"#c4b5fd",fontWeight:700,fontSize:13,marginTop:16,marginBottom:4,letterSpacing:"0.05em",textTransform:"uppercase"}}>{line.slice(3)}</h3>;
        if (line.startsWith("# "))  return <h2 key={i} style={{color:"white",fontWeight:800,fontSize:17,marginTop:12,marginBottom:6}}>{line.slice(2)}</h2>;
        if (line.startsWith("- ")||line.startsWith("• ")) return <div key={i} style={{display:"flex",gap:8,marginTop:4}}><span style={{color:"#6C5CE7",marginTop:2}}>▸</span><span style={{color:"rgba(255,255,255,.75)",fontSize:13,lineHeight:1.7}}>{line.slice(2)}</span></div>;
        if (/^\d+\./.test(line)) return <p key={i} style={{color:"rgba(255,255,255,.75)",fontSize:13,margin:"4px 0",lineHeight:1.7}}>{line}</p>;
        if (line==="") return <div key={i} style={{height:8}}/>;
        return <p key={i} style={{color:"rgba(255,255,255,.72)",fontSize:13,margin:"2px 0",lineHeight:1.8}}>{line}</p>;
      })}
    </div>
  );
}

/* ══ PARTICLES ═════════════════════════════════════════════════ */
function Particles({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; tx: number; ty: number; size: number; color: string; delay: number }[]>([]);
  useEffect(() => {
    if (!active) return;
    const ps = Array.from({length:24}, (_,i) => ({
      id:i, x:50+Math.cos(i/24*Math.PI*2)*40, y:50+Math.sin(i/24*Math.PI*2)*40,
      tx:30+Math.random()*40, ty:20+Math.random()*60,
      size:2+Math.random()*3, color:["#6C5CE7","#00cec9","#fd79a8","#fbbf24"][i%4],
      delay:Math.random()*0.4,
    }));
    setParticles(ps);
    const t = setTimeout(()=>setParticles([]),1200);
    return ()=>clearTimeout(t);
  },[active]);
  if (!particles.length) return null;
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:10}}>
      {particles.map(p=>(
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:`${p.y}%`,
          width:p.size, height:p.size, borderRadius:"50%", background:p.color,
          animation:`particle 0.9s ease-out ${p.delay}s both`,
          "--tx":`${(p.tx-p.x)*3}px`, "--ty":`${(p.ty-p.y)*3}px`,
        } as React.CSSProperties}/>
      ))}
    </div>
  );
}

/* ══ COPY BUTTON ═══════════════════════════════════════════════ */
function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={()=>{navigator.clipboard.writeText(text);setOk(true);setTimeout(()=>setOk(false),2000);}}
      style={{background:ok?"rgba(0,200,160,.15)":"rgba(255,255,255,.06)",border:`1px solid ${ok?"rgba(0,200,160,.4)":"rgba(255,255,255,.12)"}`,
        color:ok?"#4fffca":"rgba(255,255,255,.5)",borderRadius:10,padding:"6px 14px",fontSize:11,cursor:"pointer",
        transition:"all .2s",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.04em"}}>
      {ok?"✓ Copied":"⎘ Copy"}
    </button>
  );
}

/* ══ MAIN ══════════════════════════════════════════════════════ */
export default function ContentStudio() {
  const [topic,      setTopic]      = useState<string>("");
  const [postType,   setPostType]   = useState<string>("social");
  const [platforms,  setPlatforms]  = useState<string[]>(["instagram","twitter"]);
  const [length,     setLength]     = useState<number>(1); // 0=short 1=medium 2=long
  const [tone,       setTone]       = useState<string>("casual");
  const [output,     setOutput]     = useState<string>("");
  const [loading,    setLoading]    = useState<boolean>(false);
  const [burst,      setBurst]      = useState<boolean>(false);
  const [error,      setError]      = useState<string>("");
  const [carouselIdx,setCarouselIdx]= useState<number>(0); // for type carousel
  const outputRef = useRef<HTMLDivElement>(null);

  // Keep postType in sync with carousel
  useEffect(()=>{ setPostType(POST_TYPES[carouselIdx].id); },[carouselIdx]);

  const togglePlatform = (id: string) => setPlatforms(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const lengths = ["Short","Medium","Long"];
  const lengthKeys = ["short","medium","long"];
  const activeType = POST_TYPES[carouselIdx];

  const generate = async () => {
    if (!topic.trim()) { setError("What's your topic?"); return; }
    if (postType==="social"&&platforms.length===0) { setError("Pick at least one platform."); return; }
    setError(""); setOutput(""); setLoading(true); setBurst(true);
    setTimeout(()=>setBurst(false),1000);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user",content:buildPrompt({topic,postType,platforms,length:lengthKeys[length],tone})}],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((b: any)=>b.text||"").join("")||"No content generated.";
      setOutput(text);
      setTimeout(()=>outputRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),200);
    } catch { setError("Generation failed. Try again."); }
    finally { setLoading(false); }
  };

  /* carousel nav */
  const prev = () => setCarouselIdx(i=>(i-1+POST_TYPES.length)%POST_TYPES.length);
  const next = () => setCarouselIdx(i=>(i+1)%POST_TYPES.length);

  /* visible cards: prev, active, next */
  const getCard = (offset: number) => POST_TYPES[(carouselIdx+offset+POST_TYPES.length)%POST_TYPES.length];

  return (
    <div style={{fontFamily:"'Sora',sans-serif",minHeight:"100vh",overflowX:"hidden",
      background:"radial-gradient(ellipse 120% 80% at 50% -10%,#1a0a3a 0%,#0a1a1a 50%,#060610 100%)",
      color:"white"}}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes particle{to{transform:translate(var(--tx),var(--ty));opacity:0}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes gridFade{0%,100%{opacity:.03}50%{opacity:.07}}
        @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes transmit{from{opacity:0;clip-path:inset(0 100% 0 0)}to{opacity:1;clip-path:inset(0 0% 0 0)}}
        @keyframes ringPulse{0%{transform:scale(1);opacity:.5}100%{transform:scale(2.2);opacity:0}}
        @keyframes scanline{from{transform:translateY(-100%)}to{transform:translateY(100%)}}
        @keyframes glitch{0%,100%{transform:none;opacity:1}92%{transform:none;opacity:1}93%{transform:translate(2px,-1px);opacity:.8}94%{transform:translate(-2px,1px);opacity:.9}95%{transform:none;opacity:1}96%{transform:translate(1px,2px);opacity:.8}97%{transform:none;opacity:1}}
        @keyframes orbitDot{0%{opacity:0;transform:scale(0)}50%{opacity:1}100%{opacity:0;transform:scale(1.5)}}
        @keyframes inputGlow{0%,100%{box-shadow:0 0 0 0 rgba(108,92,231,0)}50%{box-shadow:0 0 40px 4px rgba(108,92,231,.2)}}

        .card-active{animation:floatUp 4s ease-in-out infinite}
        .grid-bg{
          background-image:linear-gradient(rgba(108,92,231,.06) 1px,transparent 1px),
                           linear-gradient(90deg,rgba(108,92,231,.06) 1px,transparent 1px);
          background-size:48px 48px;
        }
        .grad-text{
          background:linear-gradient(135deg,#c4b5fd 0%,#818cf8 40%,#22d3ee 80%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .gen-btn{
          background:linear-gradient(135deg,#5b21b6,#6C5CE7,#0891b2,#6C5CE7);
          background-size:300% 300%;
          animation:gradShift 3s ease infinite;
          transition:transform .2s,box-shadow .2s;
        }
        .gen-btn:hover{transform:translateY(-3px) scale(1.01);box-shadow:0 20px 60px rgba(108,92,231,.5)!important}
        .gen-btn:active{transform:translateY(0) scale(.99)}
        .tone-chip{transition:transform .15s,background .15s,border-color .15s}
        .tone-chip:hover{transform:scale(1.06)}
        .platform-node{transition:transform .2s,box-shadow .2s}
        .platform-node:hover{transform:scale(1.12)}
        .carousel-card{transition:all .4s cubic-bezier(.34,1.56,.64,1)}
        textarea:focus{outline:none}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(108,92,231,.5);border-radius:2px}
      `}</style>

      {/* Grid background */}
      <div className="grid-bg" style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}/>

      {/* Ambient orbs */}
      <div style={{position:"fixed",top:"10%",left:"5%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(108,92,231,.12) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:"10%",right:"5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,206,201,.09) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"50%",right:"20%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(253,121,168,.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      {/* Nav */}
      <nav style={{position:"relative",zIndex:10,padding:"20px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#6C5CE7,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9Q9 4 14 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
              <path d="M4 12Q9 7 14 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
              <circle cx="14" cy="13" r="3" fill="white"/>
              <path d="M12.8 13l.9.9 1.5-1.8" stroke="#6C5CE7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{fontWeight:700,fontSize:15,letterSpacing:"-.02em"}}>CreatorAI</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:20,padding:"6px 14px"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#00cec9",animation:"ringPulse 2s ease-out infinite"}}/>
          <span style={{color:"rgba(255,255,255,.4)",fontSize:11,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.08em"}}>STUDIO LIVE</span>
        </div>
      </nav>

      <div style={{position:"relative",zIndex:5,maxWidth:900,margin:"0 auto",padding:"48px 24px 80px"}}>

        {/* ── STAGE TITLE ── */}
        <div style={{textAlign:"center",marginBottom:56}}>
          <p style={{color:"rgba(255,255,255,.3)",fontSize:11,letterSpacing:"0.2em",fontFamily:"'DM Sans',sans-serif",marginBottom:12,textTransform:"uppercase"}}>Content Studio</p>
          <h1 style={{fontSize:"clamp(32px,6vw,58px)",fontWeight:800,lineHeight:1.05,letterSpacing:"-.04em",margin:0}}>
            <span className="grad-text">Transmit</span> your idea<br/>
            <span style={{color:"rgba(255,255,255,.25)",fontSize:"0.55em",fontWeight:400,letterSpacing:"0.02em"}}>into content that moves people</span>
          </h1>
        </div>

        {/* ════════════════════════════════════
            STEP 1 — TOPIC  (spotlight input)
        ════════════════════════════════════ */}
        <div style={{position:"relative",marginBottom:64}}>
          {/* Step label */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#6C5CE7,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>1</div>
            <span style={{color:"rgba(255,255,255,.5)",fontSize:12,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>Drop your idea</span>
            <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(108,92,231,.4),transparent)"}}/>
          </div>

          {/* The spotlight textarea */}
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",inset:-1,borderRadius:20,background:"linear-gradient(135deg,rgba(108,92,231,.5),rgba(0,206,201,.3),rgba(253,121,168,.2))",animation:topic?"inputGlow 3s ease infinite":"none",opacity:topic?1:0,transition:"opacity .4s"}}/>
            <textarea
              value={topic}
              onChange={e=>{setTopic(e.target.value);setError("");}}
              placeholder="What's your story? A product launch, a morning routine tip, a hot take, a tutorial…"
              rows={3}
              style={{
                position:"relative",display:"block",width:"100%",boxSizing:"border-box",
                background:"rgba(12,8,28,.8)",
                border:"1px solid rgba(255,255,255,.1)",
                borderRadius:20,padding:"22px 28px",
                fontSize:16,color:"white",resize:"none",
                fontFamily:"'Sora',sans-serif",fontWeight:300,lineHeight:1.7,
                backdropFilter:"blur(20px)",
                transition:"border-color .3s",
                borderColor:topic?"rgba(108,92,231,.6)":"rgba(255,255,255,.1)",
              }}
            />
            <div style={{position:"absolute",bottom:16,right:20,fontSize:11,color:"rgba(255,255,255,.2)",fontFamily:"'DM Sans',sans-serif"}}>{topic.length} chars</div>
          </div>
          {error && <p style={{color:"#f87171",fontSize:12,marginTop:8,fontFamily:"'DM Sans',sans-serif"}}>⚠ {error}</p>}
        </div>

        {/* ════════════════════════════════════
            STEP 2 — POST TYPE CAROUSEL ARC
        ════════════════════════════════════ */}
        <div style={{marginBottom:64}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#fd79a8,#e84393)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>2</div>
            <span style={{color:"rgba(255,255,255,.5)",fontSize:12,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>Content format</span>
            <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(253,121,168,.4),transparent)"}}/>
          </div>

          {/* Carousel */}
          <div style={{position:"relative",height:190,display:"flex",alignItems:"center",justifyContent:"center",userSelect:"none"}}>

            {/* Curved track line */}
            <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} preserveAspectRatio="none">
              <path d="M 60 160 Q 450 60 840 160" fill="none" stroke="rgba(108,92,231,.15)" strokeWidth="1.5" strokeDasharray="6 4"/>
            </svg>

            {/* Prev ghost */}
            <div className="carousel-card" onClick={prev} style={{
              position:"absolute",left:"4%",top:"28%",
              width:140,padding:"16px 14px",borderRadius:16,cursor:"pointer",
              background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",
              transform:"scale(.82) translateY(12px)",opacity:.45,
              display:"flex",flexDirection:"column",alignItems:"center",gap:6,textAlign:"center",
            }}>
              <span style={{fontSize:28}}>{getCard(-1).icon}</span>
              <span style={{color:"rgba(255,255,255,.6)",fontSize:12,fontWeight:600}}>{getCard(-1).label}</span>
            </div>

            {/* Active card */}
            <div className="card-active" style={{
              position:"relative",width:180,padding:"22px 18px",borderRadius:22,
              background:`linear-gradient(145deg,${activeType.color}22,rgba(0,0,0,.6))`,
              border:`1.5px solid ${activeType.color}88`,
              boxShadow:`0 0 40px ${activeType.color}44, 0 20px 60px rgba(0,0,0,.5)`,
              display:"flex",flexDirection:"column",alignItems:"center",gap:8,textAlign:"center",
              zIndex:5,
            }}>
              {/* Ring pulse */}
              <div style={{position:"absolute",inset:-12,borderRadius:28,border:`1px solid ${activeType.color}33`,animation:"ringPulse 2.5s ease-out infinite"}}/>
              <span style={{fontSize:40}}>{activeType.icon}</span>
              <span style={{color:"white",fontSize:14,fontWeight:700,letterSpacing:"-.01em"}}>{activeType.label}</span>
              <span style={{color:`${activeType.color}cc`,fontSize:11,lineHeight:1.4,fontFamily:"'DM Sans',sans-serif"}}>{activeType.desc}</span>
              {/* Active dot */}
              <div style={{width:6,height:6,borderRadius:"50%",background:activeType.color,marginTop:2}}/>
            </div>

            {/* Next ghost */}
            <div className="carousel-card" onClick={next} style={{
              position:"absolute",right:"4%",top:"28%",
              width:140,padding:"16px 14px",borderRadius:16,cursor:"pointer",
              background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",
              transform:"scale(.82) translateY(12px)",opacity:.45,
              display:"flex",flexDirection:"column",alignItems:"center",gap:6,textAlign:"center",
            }}>
              <span style={{fontSize:28}}>{getCard(1).icon}</span>
              <span style={{color:"rgba(255,255,255,.6)",fontSize:12,fontWeight:600}}>{getCard(1).label}</span>
            </div>

            {/* Nav arrows */}
            <button onClick={prev} style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"50%",width:36,height:36,cursor:"pointer",color:"rgba(255,255,255,.6)",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",zIndex:10}} onMouseEnter={e=>e.currentTarget.style.background="rgba(108,92,231,.3)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.06)"}>‹</button>
            <button onClick={next} style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"50%",width:36,height:36,cursor:"pointer",color:"rgba(255,255,255,.6)",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",zIndex:10}} onMouseEnter={e=>e.currentTarget.style.background="rgba(108,92,231,.3)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.06)"}>›</button>

            {/* Dot indicators */}
            <div style={{position:"absolute",bottom:-20,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>
              {POST_TYPES.map((_,i)=>(
                <div key={i} onClick={()=>setCarouselIdx(i)} style={{
                  width:i===carouselIdx?20:5,height:5,borderRadius:3,cursor:"pointer",
                  background:i===carouselIdx?activeType.color:"rgba(255,255,255,.2)",
                  transition:"all .3s",
                }}/>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════
            STEP 3 — PLATFORMS (orbital ring)  
            Only shown for social
        ════════════════════════════════════ */}
        {postType==="social" && (
          <div style={{marginBottom:64}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#00cec9,#0984e3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>3</div>
              <span style={{color:"rgba(255,255,255,.5)",fontSize:12,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>Broadcast to</span>
              <span style={{color:"rgba(255,255,255,.25)",fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>— select multiple</span>
              <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(0,206,201,.4),transparent)"}}/>
            </div>

            {/* Platform nodes in a horizontal orbit row */}
            <div style={{display:"flex",gap:14,flexWrap:"wrap",paddingLeft:8}}>
              {PLATFORMS.map(p=>{
                const active = platforms.includes(p.id);
                return (
                  <button key={p.id} onClick={()=>togglePlatform(p.id)}
                    className="platform-node"
                    style={{
                      display:"flex",alignItems:"center",gap:10,
                      background:active?`${p.color}18`:"rgba(255,255,255,.03)",
                      border:`1.5px solid ${active?p.color+"88":"rgba(255,255,255,.08)"}`,
                      borderRadius:50,padding:"10px 18px",cursor:"pointer",
                      boxShadow:active?`0 0 24px ${p.color}44`:"none",
                      transition:"all .2s",
                    }}>
                    {/* Icon circle */}
                    <div style={{width:26,height:26,borderRadius:"50%",background:active?p.color:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"white",flexShrink:0,transition:"background .2s"}}>
                      {p.label}
                    </div>
                    <span style={{fontSize:12,fontWeight:600,color:active?"white":"rgba(255,255,255,.45)",fontFamily:"'DM Sans',sans-serif",transition:"color .2s"}}>{p.full}</span>
                    {active && <span style={{fontSize:10,color:p.color,marginLeft:2}}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 4 — LENGTH & TONE  side by side
        ════════════════════════════════════ */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:64}}>

          {/* LENGTH — custom track slider */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#fbbf24,#f59e0b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{postType==="social"?"4":"3"}</div>
              <span style={{color:"rgba(255,255,255,.5)",fontSize:12,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>Length</span>
            </div>

            {/* Track */}
            <div style={{position:"relative",padding:"0 8px"}}>
              <div style={{height:2,background:"rgba(255,255,255,.08)",borderRadius:2,position:"relative",margin:"20px 0 32px"}}>
                <div style={{position:"absolute",left:0,width:`${length*50}%`,height:"100%",background:"linear-gradient(90deg,#6C5CE7,#fbbf24)",borderRadius:2,transition:"width .3s"}}/>
                {[0,1,2].map(i=>(
                  <button key={i} onClick={()=>setLength(i)} style={{
                    position:"absolute",top:"50%",left:`${i*50}%`,transform:"translate(-50%,-50%)",
                    width:i===length?18:12,height:i===length?18:12,
                    borderRadius:"50%",border:"none",cursor:"pointer",
                    background:i<=length?"linear-gradient(135deg,#6C5CE7,#fbbf24)":"rgba(255,255,255,.2)",
                    boxShadow:i===length?"0 0 16px rgba(108,92,231,.6)":"none",
                    transition:"all .25s",
                  }}/>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                {lengths.map((l,i)=>(
                  <button key={i} onClick={()=>setLength(i)} style={{
                    background:"none",border:"none",cursor:"pointer",
                    color:i===length?"white":"rgba(255,255,255,.3)",
                    fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:i===length?700:400,
                    transition:"color .2s",padding:0,
                  }}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          {/* TONE — chip grid */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#a78bfa,#c084fc)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{postType==="social"?"5":"4"}</div>
              <span style={{color:"rgba(255,255,255,.5)",fontSize:12,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>Tone</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {TONES.map(t=>(
                <button key={t.id} className="tone-chip" onClick={()=>setTone(t.id)} style={{
                  background:tone===t.id?"rgba(167,139,250,.18)":"rgba(255,255,255,.03)",
                  border:`1.5px solid ${tone===t.id?"rgba(167,139,250,.7)":"rgba(255,255,255,.07)"}`,
                  borderRadius:12,padding:"10px 6px",cursor:"pointer",
                  display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                  boxShadow:tone===t.id?"0 0 20px rgba(167,139,250,.25)":"none",
                }}>
                  <span style={{fontSize:18}}>{t.emoji}</span>
                  <span style={{fontSize:10,fontFamily:"'DM Sans',sans-serif",fontWeight:600,color:tone===t.id?"#c4b5fd":"rgba(255,255,255,.4)",letterSpacing:"0.04em"}}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════
            TRANSMIT BUTTON
        ════════════════════════════════════ */}
        <div style={{position:"relative",textAlign:"center",marginBottom:72}}>
          <Particles active={burst}/>

          {/* Summary ribbon */}
          <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap",marginBottom:20}}>
            {[activeType.label, lengths[length], tone, ...(postType==="social"?platforms.map(p=>PLATFORMS.find(x=>x.id===p)?.full||p):[])].map((tag,i)=>(
              <span key={i} style={{
                fontSize:10,padding:"3px 10px",borderRadius:20,fontFamily:"'DM Sans',sans-serif",
                background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",
                color:"rgba(255,255,255,.4)",letterSpacing:"0.04em",
              }}>{tag}</span>
            ))}
          </div>

          <button className="gen-btn" onClick={generate} disabled={loading}
            style={{
              width:"100%",maxWidth:480,padding:"22px 40px",borderRadius:22,border:"none",
              color:"white",fontSize:17,fontWeight:700,cursor:loading?"not-allowed":"pointer",
              fontFamily:"'Sora',sans-serif",letterSpacing:"-.01em",opacity:loading?.7:1,
              position:"relative",overflow:"hidden",
            }}>
            {/* Scanline effect */}
            {loading && <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent,rgba(255,255,255,.05),transparent)",height:"40%",animation:"scanline 1.2s linear infinite"}}/>}
            {loading ? (
              <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
                <svg style={{animation:"spin .8s linear infinite",flexShrink:0}} width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,.2)" strokeWidth="2.5"/>
                  <path d="M12 3a9 9 0 019 9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                Transmitting…
              </span>
            ) : (
              <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                <span style={{fontSize:20}}>⚡</span>
                Generate Content
              </span>
            )}
          </button>
        </div>

        {/* ════════════════════════════════════
            OUTPUT — transmission terminal
        ════════════════════════════════════ */}
        {(output||loading) && (
          <div ref={outputRef} style={{
            position:"relative",
            background:"rgba(6,4,18,.85)",
            border:"1px solid rgba(108,92,231,.3)",
            borderRadius:24,overflow:"hidden",
            backdropFilter:"blur(20px)",
            boxShadow:"0 0 80px rgba(108,92,231,.15), 0 40px 80px rgba(0,0,0,.6)",
            animation:"transmit .6s ease both",
          }}>
            {/* Terminal header */}
            <div style={{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"14px 20px",
              borderBottom:"1px solid rgba(108,92,231,.2)",
              background:"rgba(108,92,231,.06)",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{display:"flex",gap:5}}>
                  {["#f87171","#fbbf24","#4ade80"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
                </div>
                <span style={{color:"rgba(255,255,255,.3)",fontSize:11,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.1em"}}>TRANSMISSION — {activeType.label.toUpperCase()}</span>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#00cec9",animation:"ringPulse 1.5s ease-out infinite"}}/>
              </div>
              {output && (
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{color:"rgba(255,255,255,.2)",fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>{output.length} chars</span>
                  <CopyBtn text={output}/>
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{padding:"28px 28px 24px",minHeight:180,maxHeight:520,overflowY:"auto"}}>
              {loading && (
                <div style={{display:"flex",flexDirection:"column",gap:12,opacity:.6}}>
                  {[90,70,85,55,75,40].map((w,i)=>(
                    <div key={i} style={{height:8,borderRadius:4,background:`rgba(108,92,231,.3)`,width:`${w}%`,animation:`glitch ${1+i*.3}s ease-in-out infinite`}}/>
                  ))}
                </div>
              )}
              {output && <RichText text={output}/>}
            </div>

            {/* Footer actions */}
            {output && (
              <div style={{
                padding:"12px 20px",borderTop:"1px solid rgba(255,255,255,.05)",
                display:"flex",gap:8,justifyContent:"flex-end",background:"rgba(0,0,0,.2)",
              }}>
                <button onClick={generate} style={{
                  background:"rgba(108,92,231,.12)",border:"1px solid rgba(108,92,231,.3)",
                  borderRadius:10,padding:"8px 16px",color:"#c4b5fd",fontSize:11,cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif",fontWeight:600,letterSpacing:"0.04em",transition:"all .2s",
                }} onMouseEnter={e=>e.currentTarget.style.background="rgba(108,92,231,.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(108,92,231,.12)"}>
                  ↺ Regenerate
                </button>
                <CopyBtn text={output}/>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}