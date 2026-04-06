"use client";

import { useState, useEffect, useRef } from "react";

/* ─── Slide mockups ─────────────────────────────────────────── */

function CaptionMockup() {
  const [typed, setTyped] = useState("");
  const full =
    "Your new fall collection deserves all the hype ✨ Shop the drop before it's gone — link in bio! #fashion #newcollection";
  const idx = useRef(0);
  useEffect(() => {
    idx.current = 0;
    setTyped("");
    const iv = setInterval(() => {
      idx.current++;
      setTyped(full.slice(0, idx.current));
      if (idx.current >= full.length) clearInterval(iv);
    }, 38);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10">
      <div className="flex gap-2 mb-3 items-center">
        {/* AI badge */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-[#6C5CE7] flex items-center justify-center text-[11px] text-white font-bold shrink-0">
          AI
        </div>
        <span className="text-white/50 text-[11px]">Generating caption…</span>
        <div className="ml-auto flex gap-1">
          {["IG", "TT", "LI"].map((p) => (
            <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
              {p}
            </span>
          ))}
        </div>
      </div>
      <p className="text-slate-200 text-[12px] leading-relaxed m-0 min-h-[60px]">
        {typed}
        <span className="opacity-50 animate-[blink_1s_infinite]">|</span>
      </p>
      <div className="flex gap-2 mt-3">
        {["Casual", "Professional", "Funny"].map((t) => (
          <span
            key={t}
            className="text-[10px] px-2 py-0.5 rounded-full bg-[#6C5CE7]/30 text-violet-300 border border-[#6C5CE7]/40"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function TrendMockup() {
  const trends = [
    { tag: "#AIContent", score: 94, delta: "+12%" },
    { tag: "#CreatorEconomy", score: 87, delta: "+8%" },
    { tag: "#ViralReels", score: 76, delta: "+5%" },
  ];
  return (
    <div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10">
      <p className="text-white/50 text-[11px] m-0 mb-3 uppercase tracking-widest">Trending now</p>
      {trends.map((t, i) => (
        <div key={i} className="flex items-center gap-2.5 mb-2.5 last:mb-0">
          <span className="text-[#00cec9] text-[12px] font-semibold min-w-[120px]">{t.tag}</span>
          <div className="flex-1 h-1 rounded bg-white/10">
            <div
              className="h-full rounded bg-gradient-to-r from-[#00b894] to-[#00cec9]"
              style={{ width: `${t.score}%` }}
            />
          </div>
          <span className="text-[#00b894] text-[11px] min-w-[36px]">{t.delta}</span>
        </div>
      ))}
    </div>
  );
}

function CalendarMockup() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const slots = [
    { label: "Reel idea", color: "#fd79a8" },
    { label: "Thread", color: "#a78bfa" },
    { label: "Story poll", color: "#00b894" },
    { label: "Collab post", color: "#fdcb6e" },
    { label: "Newsletter", color: "#74b9ff" },
  ];
  return (
    <div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10">
      <div className="flex gap-1.5">
        {days.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <p className="text-white/40 text-[10px] m-0 mb-1.5 uppercase tracking-[0.05em]">{d}</p>
            <div
              className="rounded-lg py-1.5 px-1"
              style={{
                background: slots[i].color + "33",
                border: `1px solid ${slots[i].color}55`,
              }}
            >
              <p className="text-[10px] m-0 font-semibold leading-tight" style={{ color: slots[i].color }}>
                {slots[i].label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Slide data ─────────────────────────────────────────────── */

const SLIDES = [
  {
    tag: "AI Caption Generator",
    headline: "Write once,\npost everywhere.",
    sub: "Generate platform-optimized captions for Instagram, TikTok, LinkedIn and X — in seconds.",
    accent: "#6C5CE7",
    bg: "linear-gradient(145deg,#1a1040 0%,#2d1b69 60%,#3d2090 100%)",
    Mockup: CaptionMockup,
  },
  {
    tag: "Trend Intelligence",
    headline: "Ride trends\nbefore they peak.",
    sub: "Real-time trend monitoring across platforms so your content is always timely and relevant.",
    accent: "#00b894",
    bg: "linear-gradient(145deg,#00261c 0%,#003d2c 60%,#005240 100%)",
    Mockup: TrendMockup,
  },
  {
    tag: "Content Calendar",
    headline: "Plan a month\nin five minutes.",
    sub: "AI-powered scheduling fills your calendar with tailored content ideas — automatically.",
    accent: "#fd79a8",
    bg: "linear-gradient(145deg,#2d0018 0%,#4a0028 60%,#6b003c 100%)",
    Mockup: CalendarMockup,
  },
];

/* ─── Main component ─────────────────────────────────────────── */

export default function LoginPage() {
  const [slide, setSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    const iv = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4500);
    return () => clearInterval(iv);
  }, []);

  const validate = () => {
    const e: typeof errors = {};
    if (!email.includes("@")) e.email = "Enter a valid email address";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleLogin = (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const s = SLIDES[slide];
  const { Mockup } = s;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');

        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes spin   { to{transform:rotate(360deg)} }

        .slide-in { animation: fadeUp 0.5s ease both; }

        .inp {
          display: block;
          width: 100%;
          padding: 14px 44px 14px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
          background: #f8faff;
          border: 1.5px solid #e2e8f0;
          color: #1e293b;
          box-sizing: border-box;
        }
        .inp:focus {
          background: #fff;
          border-color: #6C5CE7;
          box-shadow: 0 0 0 3px rgba(108,92,231,.12);
        }
        .inp.err {
          border-color: #e74c3c;
          background: #fff5f5;
        }

        @media (max-width:768px) {
          .left-panel  { display:none !important; }
          .right-panel { width:100% !important; padding:40px 24px !important; min-height:100vh; }
          .card-shell  { border-radius:0 !important; box-shadow:none !important; max-width:100% !important; }
          .page-bg     { padding:0 !important; align-items:flex-start !important; }
        }
      `}</style>

      {/* Page background */}
      <div
        className="page-bg min-h-screen flex items-center justify-center p-6"
        style={{
          background: "linear-gradient(135deg,#ede9fe 0%,#dbeafe 50%,#fce7f3 100%)",
          fontFamily: "'Sora',sans-serif",
        }}
      >
        {/* Card shell */}
        <div
          className="card-shell w-full max-w-[980px] flex rounded-[28px] overflow-hidden min-h-[620px]"
          style={{ boxShadow: "0 32px 80px rgba(0,0,0,.16)" }}
        >
          {/* ── LEFT PANEL ──────────────────────────────────── */}
          <div
            className="left-panel w-[48%] shrink-0 relative flex flex-col justify-between overflow-hidden"
            style={{ padding: "40px 36px", background: s.bg, transition: "background .8s ease" }}
          >
            {/* Glow orbs */}
            <div
              className="absolute w-[300px] h-[300px] rounded-full opacity-[0.12] pointer-events-none top-[10%] -right-[10%]"
              style={{ background: s.accent, filter: "blur(60px)", transition: "background .8s" }}
            />
            <div
              className="absolute w-[200px] h-[200px] rounded-full opacity-[0.08] pointer-events-none bottom-[20%] -left-[5%]"
              style={{ background: s.accent, filter: "blur(40px)" }}
            />

            {/* Logo */}
            <div className="flex items-center gap-2.5 z-10">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#6C5CE7] to-purple-500 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9Q9 4 14 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                  <path d="M4 12Q9 7 14 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                  <circle cx="14" cy="13" r="3" fill="white"/>
                  <path d="M12.8 13l.9.9 1.5-1.8" stroke="#6C5CE7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-white font-bold text-base tracking-[-0.02em]">CreatorAI</span>
            </div>

            {/* Slide content */}
            <div
              key={slide}
              className="slide-in flex-1 flex flex-col justify-center gap-5 z-10"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 mb-4">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: s.accent, animation: "pulse 1.5s infinite" }}
                  />
                  <span className="text-white/80 text-[11px] font-semibold uppercase tracking-[0.08em]">
                    {s.tag}
                  </span>
                </div>
                <h2
                  className="text-white text-[30px] font-bold leading-[1.2] tracking-[-0.03em] whitespace-pre-line mb-3"
                >
                  {s.headline}
                </h2>
                <p className="text-white/60 text-[13px] leading-[1.7] max-w-[280px]">{s.sub}</p>
              </div>
              <Mockup />
            </div>

            {/* Stats row */}
            <div className="flex gap-5 mb-5 z-10">
              {[["50K+", "Creators"], ["2.4M", "Posts made"], ["9.1/10", "Avg rating"]].map(([v, l]) => (
                <div key={l}>
                  <p className="text-white font-bold text-[15px]">{v}</p>
                  <p className="text-white/45 text-[11px]">{l}</p>
                </div>
              ))}
            </div>

            {/* Slide dots */}
            <div className="flex gap-1.5 z-10">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className="h-1.5 border-none cursor-pointer p-0 rounded-[3px] transition-all duration-300"
                  style={{
                    width: slide === i ? 22 : 6,
                    background: slide === i ? "white" : "rgba(255,255,255,.3)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL ─────────────────────────────────── */}
          <div className="right-panel flex-1 bg-white px-11 py-12 flex flex-col justify-center">

            <div className="mb-8">
              <h1 className="text-[28px] font-bold text-slate-900 tracking-[-0.03em] mb-2">
                Welcome back
              </h1>
              <p className="text-slate-400 text-[14px] leading-relaxed">
                Sign in to keep creating content that actually converts.
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">

              {/* Email */}
              <div className="relative">
                <label
                  className="absolute left-3.5 bg-white px-1 pointer-events-none transition-all duration-200 z-10"
                  style={{
                    top: emailFocus || email ? -10 : 14,
                    fontSize: emailFocus || email ? 11 : 14,
                    fontWeight: emailFocus || email ? 600 : 400,
                    color: emailFocus ? "#6C5CE7" : "#94a3b8",
                  }}
                >
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => { setEmail(e.target.value); setErrors((v) => ({ ...v, email: undefined })); }}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  className={`inp${errors.email ? " err" : ""}`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,14 22,4"/>
                  </svg>
                </span>
                {errors.email && (
                  <p className="text-red-500 text-[11px] mt-1 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label
                  className="absolute left-3.5 bg-white px-1 pointer-events-none transition-all duration-200 z-10"
                  style={{
                    top: pwFocus || password ? -10 : 14,
                    fontSize: pwFocus || password ? 11 : 14,
                    fontWeight: pwFocus || password ? 600 : 400,
                    color: pwFocus ? "#6C5CE7" : "#94a3b8",
                  }}
                >
                  Password
                </label>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => { setPassword(e.target.value); setErrors((v) => ({ ...v, password: undefined })); }}
                  onFocus={() => setPwFocus(true)}
                  onBlur={() => setPwFocus(false)}
                  className={`inp${errors.password ? " err" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-400 p-0"
                >
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-[11px] mt-1 ml-1">{errors.password}</p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setRemember((v) => !v)}
                    className="w-[18px] h-[18px] rounded-[5px] cursor-pointer flex items-center justify-center shrink-0 transition-all duration-200"
                    style={{
                      border: `2px solid ${remember ? "#6C5CE7" : "#e2e8f0"}`,
                      background: remember ? "#6C5CE7" : "white",
                    }}
                  >
                    {remember && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <polyline points="2,5 4,7 8,3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-[13px] text-slate-500">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-[13px] text-[#6C5CE7] font-semibold bg-transparent border-none cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-[15px] rounded-xl border-none cursor-pointer text-[15px] font-semibold text-white bg-gradient-to-br from-[#6C5CE7] to-purple-500 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_25px_rgba(108,92,231,.35)] active:translate-y-0"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      style={{ animation: "spin .8s linear infinite" }}
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,.3)" strokeWidth="2"/>
                      <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-slate-400 text-[12px]">or continue with</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Google */}
              <button
                type="button"
                className="w-full py-[13px] rounded-xl border-[1.5px] border-slate-200 cursor-pointer text-[14px] font-medium text-slate-700 bg-white flex items-center justify-center gap-2.5 transition-all duration-200 hover:bg-[#f8faff] hover:border-violet-300"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </form>

            <p className="text-center mt-[22px] text-[13px] text-slate-400">
              No account yet?{" "}
              <button className="text-[#6C5CE7] font-bold bg-transparent border-none cursor-pointer text-[13px]">
                Start free →
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}