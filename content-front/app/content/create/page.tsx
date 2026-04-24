"use client";
import { useState, useEffect, useRef } from "react";

/* ══ DATA ══════════════════════════════════════════════════════ */
const POST_TYPES = [
  { id:"blog",    label:"Blog Post",    icon:"✍️", color:"#a78bfa", desc:"Long-form article with SEO structure" },
  { id:"social",  label:"Social Media", icon:"📡", color:"#fd79a8", desc:"Platform-native posts with hashtags" },
  { id:"product", label:"Product Drop", icon:"🛍️", color:"#fbbf24", desc:"Sales copy that converts" },
  { id:"youtube", label:"YouTube",      icon:"▶️", color:"#f87171", desc:"Titles, descriptions & tags" },
  { id:"tiktok",  label:"TikTok",       icon:"🎵", color:"#34d399", desc:"Hooks, captions & viral angles" },
];

const PLATFORMS = [
  { id:"instagram", label:"IG", full:"Instagram",   color:"#e1306c" },
  { id:"twitter",   label:"𝕏",  full:"X / Twitter", color:"#1d9bf0" },
  { id:"linkedin",  label:"in", full:"LinkedIn",     color:"#0a66c2" },
  { id:"facebook",  label:"f",  full:"Facebook",     color:"#1877f2" },
  { id:"threads",   label:"@",  full:"Threads",      color:"#a78bfa" },
  { id:"pinterest", label:"P",  full:"Pinterest",    color:"#e60023" },
];

const TONES = [
  { id:"casual",        label:"Casual",  emoji:"😊" },
  { id:"professional",  label:"Pro",     emoji:"💼" },
  { id:"funny",         label:"Funny",   emoji:"😂" },
  { id:"inspirational", label:"Inspire", emoji:"✨" },
  { id:"educational",   label:"Educate", emoji:"📚" },
  { id:"persuasive",    label:"Persuade",emoji:"🎯" },
];

/* ══ PROMPT ════════════════════════════════════════════════════ */
function buildPrompt({ topic, postType, platforms, length, tone }: { topic: string; postType: string; platforms: string[]; length: "short" | "medium" | "long"; tone: string }) {
  const wm = { short:"short (under 100 words)", medium:"medium (150–250 words)", long:"long and detailed (400+ words)" };
  const base = `You are CreatorAI. Generate ${wm[length]||"medium"} content in a ${tone} tone about: "${topic}".`;
  if (postType==="blog")    return `${base}\n\nWrite a blog post: catchy title, intro, 3 sections with ## subheadings, conclusion.`;
  if (postType==="social")  return `${base}\n\nWrite tailored posts for: ${platforms.join(", ")||"social media"}. Label each with the platform as ## heading. Include platform-specific hashtags.`;
  if (postType==="product") return `${base}\n\nWrite a product post: headline, bullet-point benefits, description, call-to-action.`;
  if (postType==="youtube") return `${base}\n\nWrite: 3 YouTube title options, an SEO description (with CTA), and 10 tags.`;
  if (postType==="tiktok")  return `${base}\n\nWrite: hook (first 3 seconds), main caption with emojis, 10 trending hashtags, brief content idea.`;
  return base;
}

/* ══ RICH TEXT ═════════════════════════════════════════════════ */
function RichText({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="font-sans">
      {text.split("\n").map((line: string, i: number) => {
        if (line.startsWith("## ")) return <h3 key={i} className="text-violet-300 font-bold text-xs tracking-widest uppercase mt-4 mb-1">{line.slice(3)}</h3>;
        if (line.startsWith("# "))  return <h2 key={i} className="text-white font-extrabold text-base mt-3 mb-1.5">{line.slice(2)}</h2>;
        if (line.startsWith("- ")||line.startsWith("• "))
          return <div key={i} className="flex gap-2 mt-1"><span className="text-violet-500 text-xs mt-0.5">▸</span><span className="text-white/75 text-xs leading-relaxed">{line.slice(2)}</span></div>;
        if (/^\d+\./.test(line)) return <p key={i} className="text-white/75 text-xs leading-relaxed my-1">{line}</p>;
        if (line==="") return <div key={i} className="h-2" />;
        return <p key={i} className="text-white/70 text-xs leading-relaxed my-0.5">{line}</p>;
      })}
    </div>
  );
}

/* ══ PARTICLES ═════════════════════════════════════════════════ */
function Particles({ active }: { active: boolean }) {
  const [ps, setPs] = useState<Array<{ id: number; x: number; y: number; tx: number; ty: number; size: number; color: string; delay: number }>>([]);
  useEffect(() => {
    if (!active) return;
    const list = Array.from({ length:24 }, (_,i) => ({
      id:i, x:50+Math.cos(i/24*Math.PI*2)*40, y:50+Math.sin(i/24*Math.PI*2)*40,
      tx:(30+Math.random()*40-50)*3, ty:(20+Math.random()*60-50)*3,
      size:2+Math.random()*3, color:["#6C5CE7","#00cec9","#fd79a8","#fbbf24"][i%4],
      delay:Math.random()*0.4,
    }));
    setPs(list);
    const t = setTimeout(()=>setPs([]),1200);
    return ()=>clearTimeout(t);
  },[active]);
  if (!ps.length) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {ps.map(p=>(
        <div key={p.id} className="absolute rounded-full"
          style={{ left:`${p.x}%`, top:`${p.y}%`, width:p.size, height:p.size,
            background:p.color, animation:`particle 0.9s ease-out ${p.delay}s both`,
            "--tx":`${p.tx}px`, "--ty":`${p.ty}px` } as React.CSSProperties} />
      ))}
    </div>
  );
}

/* ══ COPY BTN ══════════════════════════════════════════════════ */
function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={()=>{navigator.clipboard.writeText(text);setOk(true);setTimeout(()=>setOk(false),2000);}}
      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-wide border cursor-pointer transition-all duration-200 ${ok?"bg-teal-500/15 border-teal-400/40 text-teal-300":"bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10"}`}>
      {ok?"✓ Copied":"⎘ Copy"}
    </button>
  );
}

/* ══ STEP LABEL ════════════════════════════════════════════════ */
function StepLabel({ num, label, c1, c2 }: { num: number | string; label: string; c1: string; c2: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
        style={{ background:`linear-gradient(135deg,${c1},${c2})` }}>{num}</div>
      <span className="text-white/40 text-[11px] font-semibold tracking-[0.12em] uppercase"
        style={{ fontFamily:"'DM Sans',sans-serif" }}>{label}</span>
      <div className="flex-1 h-px" style={{ background:`linear-gradient(90deg,${c1}55,transparent)` }} />
    </div>
  );
}

/* ══ MAIN ══════════════════════════════════════════════════════ */
export default function ContentStudio() {
  const [topic,       setTopic]       = useState("");
  const [postType,    setPostType]    = useState("social");
  const [platforms,   setPlatforms]   = useState(["instagram","twitter"]);
  const [length,      setLength]      = useState(1);
  const [tone,        setTone]        = useState("casual");
  const [output,      setOutput]      = useState("");
  const [loading,     setLoading]     = useState(false);
  const [burst,       setBurst]       = useState(false);
  const [error,       setError]       = useState("");
  const [cIdx,        setCIdx]        = useState(0);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{ setPostType(POST_TYPES[cIdx].id); },[cIdx]);

  const toggle = (id: string) => setPlatforms(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const lengths    = ["Short","Medium","Long"];
  const lengthKeys = ["short","medium","long"];
  const at  = POST_TYPES[cIdx];
  const gc  = (off: number) => POST_TYPES[(cIdx+off+POST_TYPES.length)%POST_TYPES.length];
  const prev = () => setCIdx(i=>(i-1+POST_TYPES.length)%POST_TYPES.length);
  const next = () => setCIdx(i=>(i+1)%POST_TYPES.length);

  const generate = async () => {
    if (!topic.trim()) { setError("What's your topic?"); return; }
    if (postType==="social"&&platforms.length===0) { setError("Pick at least one platform."); return; }
    setError(""); setOutput(""); setLoading(true); setBurst(true);
    setTimeout(()=>setBurst(false),1000);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user",content:buildPrompt({topic,postType,platforms,length:lengthKeys[length] as "short" | "medium" | "long",tone})}] }),
      });
      const data = await res.json();
      const text = data.content?.map((b: any)=>b.text||"").join("")||"No content generated.";
      setOutput(text);
      setTimeout(()=>outputRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),200);
    } catch { setError("Generation failed. Try again."); }
    finally { setLoading(false); }
  };

  const stepNum = (n: number) => postType==="social" ? n : n-1;

  return (
    <div className="min-h-screen text-white overflow-x-hidden"
      style={{ fontFamily:"'Sora',sans-serif", background:"radial-gradient(ellipse 120% 80% at 50% -10%,#1a0a3a 0%,#0a1a1a 50%,#060610 100%)" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes particle  { to { transform:translate(var(--tx),var(--ty)); opacity:0 } }
        @keyframes spin      { to { transform:rotate(360deg) } }
        @keyframes floatUp   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes transmit  { from{opacity:0;clip-path:inset(0 100% 0 0)} to{opacity:1;clip-path:inset(0 0% 0 0)} }
        @keyframes ringPulse { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(2.2);opacity:0} }
        @keyframes scanline  { from{transform:translateY(-100%)} to{transform:translateY(100%)} }
        @keyframes glitch    { 0%,94%,100%{transform:none;opacity:1} 95%{transform:translate(2px,-1px);opacity:.8} 97%{transform:translate(-2px,1px);opacity:.9} }
        @keyframes inputGlow { 0%,100%{box-shadow:0 0 0 0 rgba(108,92,231,0)} 50%{box-shadow:0 0 40px 6px rgba(108,92,231,.2)} }
        .card-float { animation:floatUp 4s ease-in-out infinite }
        .gen-btn {
          background:linear-gradient(135deg,#5b21b6,#6C5CE7,#0891b2,#6C5CE7);
          background-size:300% 300%;
          animation:gradShift 3s ease infinite;
        }
        .gen-btn:hover  { transform:translateY(-3px) scale(1.01); box-shadow:0 20px 60px rgba(108,92,231,.5)!important }
        .gen-btn:active { transform:translateY(0) scale(.99) }
        textarea:focus  { outline:none }
        ::-webkit-scrollbar       { width:3px }
        ::-webkit-scrollbar-thumb { background:rgba(108,92,231,.45); border-radius:2px }
      `}</style>

      {/* Grid BG */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundImage:"linear-gradient(rgba(108,92,231,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(108,92,231,.055) 1px,transparent 1px)", backgroundSize:"48px 48px" }} />

      {/* Orbs */}
      <div className="fixed top-[10%] left-[5%] w-120 h-120 rounded-full pointer-events-none z-0" style={{ background:"radial-gradient(circle,rgba(108,92,231,.12) 0%,transparent 70%)" }}/>
      <div className="fixed bottom-[10%] right-[5%] w-95 h-95 rounded-full pointer-events-none z-0" style={{ background:"radial-gradient(circle,rgba(0,206,201,.09) 0%,transparent 70%)" }}/>
      <div className="fixed top-1/2 right-[20%] w-70 h-70 rounded-full pointer-events-none z-0" style={{ background:"radial-gradient(circle,rgba(253,121,168,.07) 0%,transparent 70%)" }}/>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background:"linear-gradient(135deg,#6C5CE7,#8b5cf6)" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9Q9 4 14 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
              <path d="M4 12Q9 7 14 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
              <circle cx="14" cy="13" r="3" fill="white"/>
              <path d="M12.8 13l.9.9 1.5-1.8" stroke="#6C5CE7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-[15px] tracking-tight">CreatorAI</span>
        </div>
        <div className="flex items-center gap-2 bg-white/4 border border-white/8 rounded-full px-3.5 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-400" style={{ animation:"ringPulse 2s ease-out infinite" }}/>
          <span className="text-white/35 text-[11px] tracking-[0.08em] uppercase" style={{ fontFamily:"'DM Sans',sans-serif" }}>Studio Live</span>
        </div>
      </nav>

      <div className="relative z-5 max-w-215 mx-auto px-6 py-12 pb-28">

        {/* Title */}
        <div className="text-center mb-14">
          <p className="text-white/25 text-[11px] tracking-[0.2em] uppercase mb-3" style={{ fontFamily:"'DM Sans',sans-serif" }}>Content Studio</p>
          <h1 className="text-[clamp(30px,6vw,54px)] font-extrabold leading-[1.05] tracking-[-0.04em] m-0">
            <span style={{ background:"linear-gradient(135deg,#c4b5fd 0%,#818cf8 40%,#22d3ee 80%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Transmit</span>
            {" "}your idea
            <br/>
            <span className="font-light text-white/20 text-[0.52em] tracking-[0.02em]">into content that moves people</span>
          </h1>
        </div>

        {/* ─── STEP 1: TOPIC ─────────────────────────── */}
        <div className="relative mb-16">
          <StepLabel num="1" label="Drop your idea" c1="#6C5CE7" c2="#8b5cf6"/>
          <div className="relative">
            {/* dynamic glow border */}
            <div className="absolute -inset-px rounded-[20px] pointer-events-none transition-opacity duration-500"
              style={{ background:"linear-gradient(135deg,rgba(108,92,231,.6),rgba(0,206,201,.35),rgba(253,121,168,.2))",
                opacity:topic?1:0, animation:topic?"inputGlow 3s ease infinite":"none" }}/>
            <textarea
              value={topic}
              onChange={e=>{setTopic(e.target.value);setError("");}}
              placeholder="What's your story? A product launch, a morning routine tip, a hot take, a tutorial…"
              rows={3}
              className="relative block w-full rounded-[20px] px-7 py-5 text-base text-white placeholder-white/20 resize-none leading-relaxed backdrop-blur-xl transition-all duration-300"
              style={{ fontFamily:"'Sora',sans-serif", fontWeight:300,
                background:"rgba(12,8,28,.8)",
                border:`1px solid ${topic?"rgba(108,92,231,.6)":"rgba(255,255,255,.1)"}` }}/>
            <span className="absolute bottom-4 right-5 text-[11px] text-white/20 pointer-events-none"
              style={{ fontFamily:"'DM Sans',sans-serif" }}>{topic.length}</span>
          </div>
          {error && <p className="text-red-400 text-xs mt-2" style={{ fontFamily:"'DM Sans',sans-serif" }}>⚠ {error}</p>}
        </div>

        {/* ─── STEP 2: POST TYPE CAROUSEL ────────────── */}
        <div className="mb-16">
          <StepLabel num="2" label="Content format" c1="#fd79a8" c2="#e84393"/>
          <div className="relative h-47 flex items-center justify-center select-none">
            {/* curved track */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <path d="M 60 155 Q 430 55 800 155" fill="none" stroke="rgba(108,92,231,.13)" strokeWidth="1.5" strokeDasharray="6 4"/>
            </svg>

            {/* Prev ghost */}
            <button onClick={prev}
              className="absolute left-[4%] top-[26%] w-33.5 flex flex-col items-center gap-1.5 rounded-2xl py-4 px-3 border border-white/[0.07] bg-white/3 cursor-pointer transition-all duration-300 hover:opacity-60 text-center"
              style={{ transform:"scale(.83) translateY(10px)", opacity:.4 }}>
              <span className="text-3xl">{gc(-1).icon}</span>
              <span className="text-white/55 text-xs font-semibold">{gc(-1).label}</span>
            </button>

            {/* Active card — color only inline */}
            <div className="card-float relative flex flex-col items-center gap-2 text-center rounded-[22px] py-5 px-5 z-10 w-43"
              style={{ background:`linear-gradient(145deg,${at.color}22,rgba(0,0,0,.6))`,
                border:`1.5px solid ${at.color}88`,
                boxShadow:`0 0 40px ${at.color}44, 0 20px 60px rgba(0,0,0,.5)` }}>
              <div className="absolute -inset-3 rounded-[28px] pointer-events-none"
                style={{ border:`1px solid ${at.color}28`, animation:"ringPulse 2.5s ease-out infinite" }}/>
              <span className="text-[38px]">{at.icon}</span>
              <span className="text-white font-bold text-sm tracking-tight">{at.label}</span>
              <span className="text-[11px] leading-snug" style={{ color:`${at.color}cc`, fontFamily:"'DM Sans',sans-serif" }}>{at.desc}</span>
              <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ background:at.color }}/>
            </div>

            {/* Next ghost */}
            <button onClick={next}
              className="absolute right-[4%] top-[26%] w-33.5 flex flex-col items-center gap-1.5 rounded-2xl py-4 px-3 border border-white/[0.07] bg-white/3 cursor-pointer transition-all duration-300 hover:opacity-60 text-center"
              style={{ transform:"scale(.83) translateY(10px)", opacity:.4 }}>
              <span className="text-3xl">{gc(1).icon}</span>
              <span className="text-white/55 text-xs font-semibold">{gc(1).label}</span>
            </button>

            {/* Arrows */}
            {[{fn:prev,pos:"left-0",icon:"‹"},{fn:next,pos:"right-0",icon:"›"}].map(({fn,pos,icon})=>(
              <button key={pos} onClick={fn}
                className={`absolute ${pos} top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-white/10 bg-white/6 text-white/50 text-base flex items-center justify-center z-10 cursor-pointer transition-all duration-200 hover:bg-violet-500/30 hover:text-white`}>
                {icon}
              </button>
            ))}

            {/* Dots */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
              {POST_TYPES.map((_,i)=>(
                <button key={i} onClick={()=>setCIdx(i)}
                  className="h-1.25 rounded-sm border-none cursor-pointer transition-all duration-300"
                  style={{ width:i===cIdx?20:5, background:i===cIdx?at.color:"rgba(255,255,255,.2)" }}/>
              ))}
            </div>
          </div>
        </div>

        {/* ─── STEP 3: PLATFORMS ─────────────────────── */}
        {postType==="social" && (
          <div className="mb-16">
            <StepLabel num="3" label="Broadcast to" c1="#00cec9" c2="#0984e3"/>
            <p className="text-white/25 text-[11px] -mt-2 mb-5" style={{ fontFamily:"'DM Sans',sans-serif" }}>Select one or more — each gets a tailored post.</p>
            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map(p=>{
                const on=platforms.includes(p.id);
                return (
                  <button key={p.id} onClick={()=>toggle(p.id)}
                    className="flex items-center gap-2.5 rounded-full px-4 py-2.5 border cursor-pointer transition-all duration-200 hover:scale-105"
                    style={{ background:on?`${p.color}18`:"rgba(255,255,255,.03)",
                      borderColor:on?`${p.color}80`:"rgba(255,255,255,.08)",
                      boxShadow:on?`0 0 22px ${p.color}3d`:"none" }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shrink-0 transition-colors duration-200"
                      style={{ background:on?p.color:"rgba(255,255,255,.12)" }}>
                      {p.label}
                    </div>
                    <span className="text-xs font-semibold transition-colors duration-200"
                      style={{ color:on?"white":"rgba(255,255,255,.4)", fontFamily:"'DM Sans',sans-serif" }}>
                      {p.full}
                    </span>
                    {on && <span className="text-[10px]" style={{ color:p.color }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── STEP 4: LENGTH  ───────────────── */}
        <div className="mb-16">

          {/* LENGTH */}
          <div>
            <StepLabel num={postType==="social"?4:3} label="Length" c1="#fbbf24" c2="#f59e0b"/>
            <div className="px-2">
              <div className="relative h-px bg-white/8 rounded my-5 mb-8">
                {/* fill */}
                <div className="absolute left-0 top-0 h-full rounded transition-all duration-300"
                  style={{ width:`${length*50}%`, background:"linear-gradient(90deg,#6C5CE7,#fbbf24)" }}/>
                {/* dots */}
                {[0,1,2].map(i=>(
                  <button key={i} onClick={()=>setLength(i)}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-none cursor-pointer transition-all duration-200"
                    style={{ left:`${i*50}%`,
                      width:i===length?18:12, height:i===length?18:12,
                      background:i<=length?"linear-gradient(135deg,#6C5CE7,#fbbf24)":"rgba(255,255,255,.2)",
                      boxShadow:i===length?"0 0 14px rgba(108,92,231,.6)":"none" }}/>
                ))}
              </div>
              <div className="flex justify-between">
                {lengths.map((l,i)=>(
                  <button key={i} onClick={()=>setLength(i)}
                    className="bg-transparent border-none cursor-pointer text-[11px] p-0 transition-colors duration-200"
                    style={{ color:i===length?"white":"rgba(255,255,255,.28)", fontWeight:i===length?700:400, fontFamily:"'DM Sans',sans-serif" }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          
        </div>

        {/* ─── STEP 5:  TONE ───────────────── */}
        <div className="mb-16">

          

          {/* TONE */}
          <div>
            <StepLabel num={postType==="social"?5:4} label="Tone" c1="#a78bfa" c2="#c084fc"/>
            <div className="grid grid-cols-3 gap-2">
              {TONES.map(t=>(
                <button key={t.id} onClick={()=>setTone(t.id)}
                  className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border cursor-pointer transition-all duration-150 hover:scale-105"
                  style={{ background:tone===t.id?"rgba(167,139,250,.17)":"rgba(255,255,255,.03)",
                    borderColor:tone===t.id?"rgba(167,139,250,.65)":"rgba(255,255,255,.07)",
                    boxShadow:tone===t.id?"0 0 18px rgba(167,139,250,.22)":"none" }}>
                  <span className="text-lg">{t.emoji}</span>
                  <span className="text-[10px] font-semibold tracking-wide transition-colors duration-200"
                    style={{ color:tone===t.id?"#c4b5fd":"rgba(255,255,255,.38)", fontFamily:"'DM Sans',sans-serif" }}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── TRANSMIT BUTTON ───────────────────────── */}
        <div className="relative text-center mb-20">
          <Particles active={burst}/>

          {/* Summary tags */}
          <div className="flex justify-center flex-wrap gap-1.5 mb-5">
            {[at.label, lengths[length], tone, ...(postType==="social"?platforms.map(p=>PLATFORMS.find(x=>x.id===p)?.full||p):[])].map((tag,i)=>(
              <span key={i} className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 bg-white/4 text-white/35 tracking-wide"
                style={{ fontFamily:"'DM Sans',sans-serif" }}>{tag}</span>
            ))}
          </div>

          <button className="gen-btn w-full max-w-115 py-5.5 rounded-[22px] border-none text-white text-[17px] font-bold tracking-tight cursor-pointer relative overflow-hidden transition-transform duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={generate} disabled={loading}
            style={{ fontFamily:"'Sora',sans-serif" }}>
            {loading && <div className="absolute inset-0 pointer-events-none"
              style={{ background:"linear-gradient(transparent,rgba(255,255,255,.05),transparent)", animation:"scanline 1.2s linear infinite" }}/>}
            {loading
              ? <span className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5 shrink-0" style={{ animation:"spin .8s linear infinite" }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,.2)" strokeWidth="2.5"/>
                    <path d="M12 3a9 9 0 019 9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  Transmitting…
                </span>
              : <span className="flex items-center justify-center gap-2.5"><span className="text-xl">⚡</span>Generate Content</span>
            }
          </button>
        </div>

        {/* ─── OUTPUT TERMINAL ───────────────────────── */}
        {(output||loading) && (
          <div ref={outputRef}
            className="relative rounded-3xl overflow-hidden backdrop-blur-2xl"
            style={{ background:"rgba(6,4,18,.87)",
              border:"1px solid rgba(108,92,231,.28)",
              boxShadow:"0 0 80px rgba(108,92,231,.13), 0 40px 80px rgba(0,0,0,.6)",
              animation:"transmit .6s ease both" }}>

            {/* Chrome bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b bg-violet-500/6"
              style={{ borderColor:"rgba(108,92,231,.2)" }}>
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  {["#f87171","#fbbf24","#4ade80"].map(c=><div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background:c }}/>)}
                </div>
                <span className="text-white/25 text-[11px] tracking-widest uppercase" style={{ fontFamily:"'DM Sans',sans-serif" }}>
                  TRANSMISSION — {at.label.toUpperCase()}
                </span>
                <div className="w-1.25 h-1.25 rounded-full bg-teal-400" style={{ animation:"ringPulse 1.5s ease-out infinite" }}/>
              </div>
              {output && (
                <div className="flex items-center gap-2">
                  <span className="text-white/20 text-[11px]" style={{ fontFamily:"'DM Sans',sans-serif" }}>{output.length} chars</span>
                  <CopyBtn text={output}/>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="px-7 py-7 min-h-45 max-h-130 overflow-y-auto">
              {loading && (
                <div className="flex flex-col gap-3 opacity-60">
                  {[90,70,85,55,75,40].map((w,i)=>(
                    <div key={i} className="h-2 rounded-full bg-violet-500/30"
                      style={{ width:`${w}%`, animation:`glitch ${1+i*.3}s ease-in-out infinite` }}/>
                  ))}
                </div>
              )}
              {output && <RichText text={output}/>}
            </div>

            {/* Footer */}
            {output && (
              <div className="flex justify-end gap-2 px-5 py-3 border-t bg-black/20"
                style={{ borderColor:"rgba(255,255,255,.05)" }}>
                <button onClick={generate}
                  className="px-4 py-2 rounded-xl text-[11px] font-semibold text-violet-300 border border-violet-500/30 bg-violet-500/10 cursor-pointer transition-all duration-200 hover:bg-violet-500/25"
                  style={{ fontFamily:"'DM Sans',sans-serif" }}>
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