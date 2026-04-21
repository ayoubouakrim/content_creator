"use client";
import { useState, useEffect, useRef } from "react";

/* ── Animated typing caption mockup ── */
function CaptionMockup() {
  const [typed, setTyped] = useState("");
  const full = "Your new fall collection deserves all the hype ✨ Shop the drop before it's gone — link in bio! #fashion #newcollection";
  const idx = useRef(0);
  useEffect(() => {
    idx.current = 0; setTyped("");
    const iv = setInterval(() => {
      idx.current++;
      setTyped(full.slice(0, idx.current));
      if (idx.current >= full.length) clearInterval(iv);
    }, 38);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
      <div className="flex gap-2 mb-3 items-center">
        <div className="w-7 h-7 rounded-full bg-linear-to-br from-violet-400 to-violet-600 flex items-center justify-center text-xs text-white font-bold shrink-0">AI</div>
        <span className="text-white/50 text-xs">Generating caption…</span>
        <div className="ml-auto flex gap-1">
          {["IG","TT","LI"].map(p=><span key={p} className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-white/60">{p}</span>)}
        </div>
      </div>
      <p className="text-slate-200 text-xs leading-relaxed min-h-16">{typed}<span className="opacity-50 animate-pulse">|</span></p>
      <div className="flex gap-2 mt-3 flex-wrap">
        {["Casual","Professional","Funny"].map(t=>(
          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/30 text-violet-300 border border-violet-500/40">{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Trend mockup ── */
function TrendMockup() {
  const trends = [
    { tag: "#AIContent", score: 94, delta: "+12%" },
    { tag: "#CreatorEconomy", score: 87, delta: "+8%" },
    { tag: "#ViralReels", score: 76, delta: "+5%" },
  ];
  return (
    <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
      <p className="text-white/50 text-xs mb-3 uppercase tracking-widest">Trending now</p>
      {trends.map((t,i)=>(
        <div key={i} className="flex items-center gap-2.5 mb-2.5 last:mb-0">
          <span className="text-teal-400 text-xs font-semibold w-32">{t.tag}</span>
          <div className="flex-1 h-1 rounded bg-white/10">
            <div className="h-full rounded bg-linear-to-r from-teal-500 to-cyan-400" style={{width:`${t.score}%`}}/>
          </div>
          <span className="text-teal-400 text-xs w-9">{t.delta}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Calendar mockup ── */
function CalendarMockup() {
  const days = ["Mon","Tue","Wed","Thu","Fri"];
  const slots = [
    {label:"Reel idea",color:"#fd79a8"},
    {label:"Thread",color:"#a78bfa"},
    {label:"Story poll",color:"#00b894"},
    {label:"Collab post",color:"#fdcb6e"},
    {label:"Newsletter",color:"#74b9ff"},
  ];
  return (
    <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
      <div className="flex gap-1.5">
        {days.map((d,i)=>(
          <div key={i} className="flex-1 text-center">
            <p className="text-white/40 text-xs mb-1.5 uppercase tracking-wide">{d}</p>
            <div className="rounded-lg py-1.5 px-1" style={{background:slots[i].color+"33",border:`1px solid ${slots[i].color}55`}}>
              <p className="text-xs font-semibold leading-tight" style={{color:slots[i].color}}>{slots[i].label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Stat counter ── */
function Counter({end, suffix = ""}: {end: number; suffix?: string}) {
  const [val,setVal] = useState(0);
  useEffect(()=>{
    let start=0; const step=Math.ceil(end/60);
    const iv=setInterval(()=>{start+=step;if(start>=end){setVal(end);clearInterval(iv);}else setVal(start);},20);
    return ()=>clearInterval(iv);
  },[end]);
  return <>{val.toLocaleString()}{suffix}</>;
}

/* ── Feature card ── */
function FeatureCard({icon,title,desc,accent}: {icon: string; title: string; desc: string; accent: string}) {
  return (
    <div className="group relative rounded-2xl p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" style={{background:accent}}/>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{background:accent+"22",border:`1px solid ${accent}44`}}>
        {icon}
      </div>
      <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ── Testimonial card ── */
function TestiCard({name,role,avatar,text,stars}: {name: string; role: string; avatar: string; text: string; stars: number}) {
  return (
    <div className="rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col gap-4">
      <div className="flex gap-0.5">{Array.from({length:stars}).map((_,i)=><span key={i} className="text-yellow-400 text-sm">★</span>)}</div>
      <p className="text-white/70 text-sm leading-relaxed flex-1">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-violet-400 to-pink-400 flex items-center justify-center text-sm font-bold text-white">{avatar}</div>
        <div><p className="text-white text-sm font-semibold">{name}</p><p className="text-white/40 text-xs">{role}</p></div>
      </div>
    </div>
  );
}

/* ── Pricing card ── */
function PriceCard({plan,price,desc,features,popular}: {plan: string; price: number; desc: string; features: string[]; popular: boolean}) {
  return (
    <div className={`relative rounded-2xl p-7 border flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 ${popular?"border-violet-500 bg-violet-600/20":"border-white/10 bg-white/5"} backdrop-blur-sm`}>
      {popular&&<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-violet-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</div>}
      <div>
        <p className="text-white/60 text-sm font-medium mb-1">{plan}</p>
        <div className="flex items-end gap-1">
          <span className="text-white text-4xl font-bold">${price}</span>
          {price>0&&<span className="text-white/40 text-sm pb-1">/month</span>}
        </div>
        <p className="text-white/40 text-sm mt-1">{desc}</p>
      </div>
      <ul className="flex flex-col gap-2.5 flex-1">
        {features.map((f,i)=>(
          <li key={i} className="flex items-center gap-2 text-sm text-white/70">
            <span className="text-teal-400 text-xs">✓</span>{f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-px ${popular?"bg-linear-to-r from-violet-500 to-purple-500 text-white hover:shadow-xl hover:shadow-violet-500/30":"bg-white/10 text-white hover:bg-white/20 border border-white/20"}`}>
        {price===0?"Start Free":"Get Started"}
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN LANDING PAGE
════════════════════════════════════════════ */
export default function Home() {
  const [menuOpen,setMenuOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const [activeSlide,setActiveSlide]=useState(0);

  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>40);
    window.addEventListener("scroll",onScroll);
    return ()=>window.removeEventListener("scroll",onScroll);
  },[]);

  useEffect(()=>{
    const iv=setInterval(()=>setActiveSlide(s=>(s+1)%3),4500);
    return ()=>clearInterval(iv);
  },[]);

  const features = [
    {icon:"✨",title:"AI Caption Generator",desc:"Generate platform-optimized captions for Instagram, TikTok, LinkedIn and X in seconds, tailored to your brand voice.",accent:"#6C5CE7"},
    {icon:"📈",title:"Trend Intelligence",desc:"Real-time trend monitoring across all major platforms. Always be first to ride a wave before it peaks.",accent:"#00b894"},
    {icon:"📅",title:"Content Calendar",desc:"AI-powered scheduling fills your entire month with tailored content ideas — automatically, no thinking required.",accent:"#fd79a8"},
    {icon:"🎨",title:"Visual Assets",desc:"Generate on-brand graphics, carousels, and story templates that match your aesthetic in one click.",accent:"#fdcb6e"},
    {icon:"🔄",title:"Auto-Repurpose",desc:"Turn one blog post into 10 pieces of content. Automatically repurpose long-form content for every platform.",accent:"#74b9ff"},
    {icon:"📊",title:"Analytics Dashboard",desc:"Track what's working, what's not, and get AI recommendations to double down on your best-performing content.",accent:"#a78bfa"},
  ];

  const testimonials = [
    {name:"Aria Chen",role:"Fashion Creator · 240K followers",avatar:"A",text:"CreatorAI completely changed how I batch my content. I now produce a week's worth of captions in under 20 minutes.",stars:5},
    {name:"Marcus Reid",role:"Marketing Director @ Bloom Co.",avatar:"M",text:"The trend intelligence tool alone is worth 10x the price. We caught three viral waves before our competitors even noticed.",stars:5},
    {name:"Sofia Morales",role:"Lifestyle Blogger",avatar:"S",text:"Finally a tool that actually sounds like ME. I've tried 6 AI caption tools and this is the only one that nails my tone.",stars:5},
  ];

  const plans = [
    {plan:"Free",price:0,desc:"For creators just getting started",features:["50 AI captions/month","Basic trend insights","3 calendar slots/week","1 social profile"],popular:false},
    {plan:"Pro",price:29,desc:"For serious content creators",features:["Unlimited AI captions","Real-time trend monitoring","Full content calendar","10 social profiles","Analytics dashboard","Priority support"],popular:true},
    {plan:"Agency",price:99,desc:"For teams and agencies",features:["Everything in Pro","Unlimited team members","White-label exports","API access","Custom brand voices","Dedicated account manager"],popular:false},
  ];

  const mockups = [<CaptionMockup key="cap"/>,<TrendMockup key="trend"/>,<CalendarMockup key="cal"/>];
  const heroSlides=[
    {tag:"AI Caption Generator",headline:"Write once,\npost everywhere.",sub:"Generate platform-optimized captions for Instagram, TikTok, LinkedIn and X — in seconds."},
    {tag:"Trend Intelligence",headline:"Ride trends\nbefore they peak.",sub:"Real-time trend monitoring across platforms so your content is always timely and relevant."},
    {tag:"Content Calendar",headline:"Plan a month\nin five minutes.",sub:"AI-powered scheduling fills your calendar with tailored content ideas — automatically."},
  ];

  const hs = heroSlides[activeSlide];

  return (
    <div style={{fontFamily:"'Sora',sans-serif",background:"linear-gradient(160deg,#0d0820 0%,#110d2e 40%,#0a1a18 100%)",minHeight:"100vh",color:"white"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse2{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        .fade-up{animation:fadeUp .6s ease both}
        .float{animation:floatY 4s ease-in-out infinite}
        .hero-headline{animation:fadeUp .5s ease both}
        .grad-text{
          background:linear-gradient(135deg,#a78bfa,#7c3aed,#06b6d4,#a78bfa);
          background-size:300% 300%;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:gradShift 4s ease infinite;
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled?"bg-black/40 backdrop-blur-xl border-b border-white/10":"bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9Q9 4 14 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <path d="M4 12Q9 7 14 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <circle cx="14" cy="13" r="3" fill="white"/>
                <path d="M12.8 13l.9.9 1.5-1.8" stroke="#6C5CE7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-white font-bold text-base tracking-tight">CreatorAI</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            {["Features","Pricing","Use Cases","Blog"].map(n=>(
              <a key={n} href="#" className="hover:text-white transition-colors">{n}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="text-white/60 hover:text-white text-sm transition-colors px-3 py-1.5">Sign in</button>
            <button className="bg-linear-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:-translate-y-px hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-200">Start Free</button>
          </div>

          <button className="md:hidden text-white/60 hover:text-white" onClick={()=>setMenuOpen(v=>!v)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>

        {menuOpen&&(
          <div className="md:hidden bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 py-5 flex flex-col gap-4">
            {["Features","Pricing","Use Cases","Blog"].map(n=>(
              <a key={n} href="#" className="text-white/70 hover:text-white text-sm">{n}</a>
            ))}
            <button className="bg-linear-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl w-full">Start Free</button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none" style={{background:"#6C5CE7",filter:"blur(80px)"}}/>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 pointer-events-none" style={{background:"#00b894",filter:"blur(80px)"}}/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5 pointer-events-none" style={{background:"#fd79a8",filter:"blur(60px)"}}/>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 fade-up">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"/>
          <span className="text-white/70 text-xs font-medium">Trusted by 50,000+ creators worldwide</span>
        </div>

        {/* Headline */}
        <div key={activeSlide} className="text-center max-w-3xl mb-4 hero-headline">
          <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-0.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"/>
            <span className="text-violet-300 text-xs font-semibold uppercase tracking-wider">{hs.tag}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-5 whitespace-pre-line">
            <span className="grad-text">{hs.headline.split("\n")[0]}</span>
            {"\n"}
            <span className="text-white">{hs.headline.split("\n")[1]}</span>
          </h1>
          <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">{hs.sub}</p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-14 fade-up" style={{animationDelay:"0.2s"}}>
          <button className="bg-linear-to-r from-violet-500 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/40 transition-all duration-200 text-base">
            Start Creating Free →
          </button>
          <button className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/15 transition-all duration-200 text-base flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
            Watch Demo
          </button>
        </div>

        {/* Slide dots */}
        <div className="flex gap-1.5 mb-12">
          {[0,1,2].map(i=>(
            <button key={i} onClick={()=>setActiveSlide(i)} className="h-1.5 rounded-sm border-none cursor-pointer transition-all duration-300"
              style={{width:activeSlide===i?22:6,background:activeSlide===i?"white":"rgba(255,255,255,.3)"}}/>
          ))}
        </div>

        {/* Hero mockup floating card */}
        <div className="w-full max-w-md float fade-up" style={{animationDelay:"0.3s"}}>
          {mockups[activeSlide]}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-10 justify-center mt-16">
          {[
            {val:50000,suffix:"K+",label:"Creators"},
            {val:2400000,suffix:"M",label:"Posts Generated"},
            {val:9,suffix:".1/10",label:"Avg Rating"},
          ].map((s,i)=>(
            <div key={i} className="text-center">
              <p className="text-white text-2xl font-bold"><Counter end={s.val} suffix={s.suffix}/></p>
              <p className="text-white/40 text-sm mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL LOGOS (trust bar) ── */}
      <section className="border-y border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8 opacity-30">
          {["Instagram","TikTok","LinkedIn","YouTube","Pinterest","X / Twitter"].map(n=>(
            <span key={n} className="text-white font-semibold text-sm tracking-wide">{n}</span>
          ))}
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 mb-5">
              <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">The Problem</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-5">
              Content creation is <span style={{color:"#fd79a8"}}>exhausting</span> and time-consuming.
            </h2>
            <ul className="flex flex-col gap-3 text-white/50 text-sm">
              {["Spending hours crafting captions that get zero engagement","Missing viral trends because you discovered them too late","Content calendar always empty, posting reactively","Hiring agencies is too expensive","Burnout from the never-ending content hamster wheel"].map((p,i)=>(
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 shrink-0">✕</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1 mb-5">
              <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider">The Solution</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-5">
              CreatorAI handles the heavy lifting <span style={{color:"#00b894"}}>for you</span>.
            </h2>
            <ul className="flex flex-col gap-3 text-white/50 text-sm">
              {["AI captions in seconds, tuned to your unique voice","Trend alerts before they reach mainstream","Month of content planned in under 5 minutes","10x cheaper than hiring a content team","More time for creating, less time for strategizing"].map((p,i)=>(
                <li key={i} className="flex items-start gap-2">
                  <span className="text-teal-400 mt-0.5 shrink-0">✓</span>{p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-4">
              <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need to <span className="grad-text">go viral</span>
            </h2>
            <p className="text-white/40 text-base max-w-xl mx-auto">One platform to plan, create, schedule, and analyze your entire content strategy.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f: typeof features[0], i: number)=><FeatureCard key={i} {...f}/>)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Up and running in <span className="grad-text">3 steps</span></h2>
          <p className="text-white/40 text-base">No learning curve. No complex setup. Just results.</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {step:"01",title:"Connect your profiles",desc:"Link your Instagram, TikTok, LinkedIn and other social accounts in one click.",icon:"🔗"},
            {step:"02",title:"Describe your brand",desc:"Tell us your niche, tone, and audience. CreatorAI learns your voice in minutes.",icon:"🎙️"},
            {step:"03",title:"Generate & schedule",desc:"Get AI-powered content ideas, captions, and a full calendar — ready to post.",icon:"🚀"},
          ].map((s,i)=>(
            <div key={i} className="relative rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-sm text-center">
              <div className="text-4xl mb-4">{s.icon}</div>
              <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-2">{s.step}</div>
              <h3 className="text-white font-semibold text-base mb-2">{s.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
              {i<2&&<div className="hidden md:block absolute top-1/2 -right-4 text-white/20 text-xl">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Built for <span className="grad-text">every creator</span></h2>
            <p className="text-white/40 text-base">Whether you're solo or a full team, CreatorAI scales with you.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {title:"Content Creators",desc:"Batch a month of content in one afternoon.",icon:"🎬",color:"#a78bfa"},
              {title:"Marketers",desc:"Launch campaigns faster and always stay on-trend.",icon:"📣",color:"#00b894"},
              {title:"eCommerce Brands",desc:"Generate product captions that actually convert.",icon:"🛍️",color:"#fd79a8"},
              {title:"Agencies",desc:"Manage multiple client profiles from one dashboard.",icon:"🏢",color:"#fdcb6e"},
            ].map((u,i)=>(
              <div key={i} className="rounded-2xl p-5 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/8 transition-all duration-200">
                <div className="text-3xl mb-3">{u.icon}</div>
                <h3 className="text-white font-semibold text-sm mb-1.5">{u.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Loved by <span className="grad-text">creators</span></h2>
            <p className="text-white/40 text-base">Join thousands of creators already saving hours every week.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t,i)=><TestiCard key={i} {...t}/>)}
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-12 opacity-25">
            {["Forbes","TechCrunch","Product Hunt","The Verge","Wired"].map(m=>(
              <span key={m} className="text-white font-bold text-sm tracking-wide">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-4">
              <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">Pricing</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Simple, transparent <span className="grad-text">pricing</span></h2>
            <p className="text-white/40 text-base">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 items-start">
            {plans.map((p: typeof plans[0], i: number)=><PriceCard key={i} {...p}/>)}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">Frequently asked <span className="grad-text">questions</span></h2>
          {[
            {q:"How does the AI learn my brand voice?",a:"Just answer a few questions about your niche, audience, and communication style. Our AI refines its understanding with every caption you approve or edit."},
            {q:"Is the generated content unique?",a:"Yes. Every caption and content idea is generated fresh for you. We never reuse outputs across accounts."},
            {q:"Which platforms are supported?",a:"Instagram, TikTok, LinkedIn, X (Twitter), Pinterest, YouTube, and Facebook. More coming soon."},
            {q:"Can I cancel anytime?",a:"Absolutely. No contracts, no cancellation fees. Cancel from your account settings at any time."},
            {q:"Do you offer a free trial?",a:"Yes — the Free plan is free forever with 50 captions/month. No credit card required to start."},
          ].map((f,i)=>(
            <FaqItem key={i} q={f.q} a={f.a}/>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 rounded-3xl opacity-10 pointer-events-none" style={{background:"linear-gradient(135deg,#6C5CE7,#00b894)",filter:"blur(40px)"}}/>
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-14">
            <div className="text-5xl mb-5">🚀</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Start creating content <span className="grad-text">that converts</span></h2>
            <p className="text-white/50 text-base leading-relaxed mb-8 max-w-md mx-auto">Join 50,000+ creators who've already transformed their content game. Free forever. No credit card required.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-linear-to-r from-violet-500 to-purple-600 text-white font-semibold px-10 py-4 rounded-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/40 transition-all duration-200 text-base">
                Start Free — No Credit Card
              </button>
              <button className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/15 transition-all duration-200 text-base">
                Talk to Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                    <path d="M4 9Q9 4 14 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                    <path d="M4 12Q9 7 14 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                    <circle cx="14" cy="13" r="3" fill="white"/>
                  </svg>
                </div>
                <span className="text-white font-bold text-sm">CreatorAI</span>
              </div>
              <p className="text-white/30 text-xs leading-relaxed">The AI platform for creators who want to grow faster without burning out.</p>
            </div>
            {[
              {title:"Product",links:["Features","Pricing","Changelog","Roadmap"]},
              {title:"Company",links:["About","Blog","Careers","Press"]},
              {title:"Legal",links:["Privacy Policy","Terms of Service","Cookie Policy","Security"]},
            ].map(col=>(
              <div key={col.title}>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">{col.title}</p>
                <ul className="flex flex-col gap-2">
                  {col.links.map(l=><li key={l}><a href="#" className="text-white/30 text-xs hover:text-white/70 transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/25 text-xs">© 2025 CreatorAI. All rights reserved.</p>
            <div className="flex gap-4">
              {["Twitter","Instagram","LinkedIn","YouTube"].map(s=>(
                <a key={s} href="#" className="text-white/25 hover:text-white/60 text-xs transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── FAQ accordion item ── */
function FaqItem({q,a}: {q: string; a: string}) {
  const [open,setOpen]=useState(false);
  return (
    <div className="border-b border-white/10 py-4">
      <button className="w-full flex items-center justify-between text-left gap-4 bg-transparent border-none cursor-pointer" onClick={()=>setOpen(v=>!v)}>
        <span className="text-white font-medium text-sm">{q}</span>
        <span className="text-white/40 text-lg shrink-0 transition-transform duration-200" style={{transform:open?"rotate(45deg)":"none"}}>+</span>
      </button>
      {open&&<p className="text-white/50 text-sm leading-relaxed mt-3">{a}</p>}
    </div>
  );
}