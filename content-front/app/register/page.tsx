"use client";

import { useState, useEffect } from "react";

/* ─── Slide mockups ─────────────────────────────────────────── */

function AnalyticsMockup() {
  const bars = [40, 65, 50, 80, 60, 90, 75];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setActive((a) => (a + 1) % bars.length), 600);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10">
      <div className="flex justify-between items-center mb-3">
        <span className="text-white/50 text-[11px] uppercase tracking-widest">Weekly reach</span>
        <span className="text-[#6C5CE7] text-[11px] font-semibold">+24% ↑</span>
      </div>
      <div className="flex items-end gap-1.5 h-14">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-sm transition-all duration-300"
              style={{
                height: `${h * 0.56}px`,
                background: i === active
                  ? "linear-gradient(180deg,#a78bfa,#6C5CE7)"
                  : "rgba(255,255,255,0.15)",
              }}
            />
            <span className="text-white/30 text-[9px]">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AudienceMockup() {
  const segments = [
    { label: "18–24", pct: 38, color: "#6C5CE7" },
    { label: "25–34", pct: 31, color: "#a78bfa" },
    { label: "35–44", pct: 19, color: "#fd79a8" },
    { label: "45+",   pct: 12, color: "#fdcb6e" },
  ];
  return (
    <div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10">
      <span className="text-white/50 text-[11px] uppercase tracking-widest">Audience breakdown</span>
      <div className="flex gap-1 mt-3 h-2 rounded-full overflow-hidden">
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-white/60 text-[10px]">{s.label}</span>
            <span className="text-white/40 text-[10px]">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrowthMockup() {
  const points = [20, 35, 28, 50, 42, 68, 60, 82, 75, 95];
  const max = 95;
  const w = 200, h = 60;
  const coords = points.map((v, i) => ({
    x: (i / (points.length - 1)) * w,
    y: h - (v / max) * h,
  }));
  const path = coords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const fill = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10">
      <div className="flex justify-between items-center mb-3">
        <span className="text-white/50 text-[11px] uppercase tracking-widest">Follower growth</span>
        <span className="text-[#00b894] text-[11px] font-semibold">12.4K total</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 60 }}>
        <defs>
          <linearGradient id="gGrow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fd79a8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fd79a8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fill} fill="url(#gGrow)" />
        <path d={path} fill="none" stroke="#fd79a8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ─── Slide data ─────────────────────────────────────────────── */

const SLIDES = [
  {
    tag: "Content Analytics",
    headline: "Know what\nworks — always.",
    sub: "Deep performance insights across every platform, so you double down on what drives results.",
    accent: "#6C5CE7",
    bg: "linear-gradient(145deg,#1a1040 0%,#2d1b69 60%,#3d2090 100%)",
    Mockup: AnalyticsMockup,
  },
  {
    tag: "Audience Insights",
    headline: "Reach the\nright people.",
    sub: "Understand who's engaging with your content and tailor every post for maximum impact.",
    accent: "#a78bfa",
    bg: "linear-gradient(145deg,#160d30 0%,#2a1260 60%,#3b1880 100%)",
    Mockup: AudienceMockup,
  },
  {
    tag: "Growth Tracking",
    headline: "Watch your\naudience grow.",
    sub: "Track follower growth, engagement spikes, and viral moments — all in one dashboard.",
    accent: "#fd79a8",
    bg: "linear-gradient(145deg,#2d0018 0%,#4a0028 60%,#6b003c 100%)",
    Mockup: GrowthMockup,
  },
];

/* ─── Password strength ──────────────────────────────────────── */

function getStrength(pw: string) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#e74c3c", "#fdcb6e", "#00b894", "#6C5CE7"];

/* ─── Main component ─────────────────────────────────────────── */

export default function RegisterPage() {
  const [slide, setSlide] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [agreed, setAgreed]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});

  const [focus, setFocus] = useState<Record<string, boolean>>({});
  const setF = (k: string, v: boolean) => setFocus((f) => ({ ...f, [k]: v }));

  const strength = getStrength(password);

  useEffect(() => {
    const iv = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4500);
    return () => clearInterval(iv);
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim())  e.lastName  = "Last name is required";
    if (!email.includes("@")) e.email  = "Enter a valid email address";
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (!agreed) e.agreed = "You must agree to the terms";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const s = SLIDES[slide];
  const { Mockup } = s;

  const floatLabel = (key: string, val: string) => focus[key] || val;

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
        .inp.err { border-color: #e74c3c; background: #fff5f5; }
        .inp-no-icon { padding-right: 16px; }

        @media (max-width: 768px) {
          .left-panel  { display: none !important; }
          .right-panel { width: 100% !important; padding: 36px 24px !important; min-height: 100vh; }
          .card-shell  { border-radius: 0 !important; box-shadow: none !important; max-width: 100% !important; }
        }
      `}</style>

      {/* Page bg */}
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{
          background: "linear-gradient(135deg,#ede9fe 0%,#dbeafe 50%,#fce7f3 100%)",
          fontFamily: "'Sora', sans-serif",
        }}
      >
        {/* Card */}
        <div
          className="card-shell w-full max-w-[980px] flex rounded-[28px] overflow-hidden"
          style={{ minHeight: 680, boxShadow: "0 32px 80px rgba(0,0,0,.16)" }}
        >

          {/* ── LEFT PANEL ─────────────────────────────── */}
          <div
            className="left-panel w-[48%] shrink-0 relative flex flex-col justify-between overflow-hidden"
            style={{ padding: "40px 36px", background: s.bg, transition: "background .8s ease" }}
          >
            {/* Glow orbs */}
            <div className="absolute w-[300px] h-[300px] rounded-full opacity-[0.12] pointer-events-none top-[10%] -right-[10%]"
              style={{ background: s.accent, filter: "blur(60px)", transition: "background .8s" }} />
            <div className="absolute w-[200px] h-[200px] rounded-full opacity-[0.08] pointer-events-none bottom-[20%] -left-[5%]"
              style={{ background: s.accent, filter: "blur(40px)" }} />

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
            <div key={slide} className="slide-in flex-1 flex flex-col justify-center gap-5 z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.accent, animation: "pulse 1.5s infinite" }} />
                  <span className="text-white/80 text-[11px] font-semibold uppercase tracking-[0.08em]">{s.tag}</span>
                </div>
                <h2 className="text-white text-[30px] font-bold leading-[1.2] tracking-[-0.03em] whitespace-pre-line mb-3">
                  {s.headline}
                </h2>
                <p className="text-white/60 text-[13px] leading-[1.7] max-w-[280px]">{s.sub}</p>
              </div>
              <Mockup />
            </div>

            {/* Stats */}
            <div className="flex gap-5 mb-5 z-10">
              {[["50K+", "Creators"], ["2.4M", "Posts made"], ["9.1/10", "Avg rating"]].map(([v, l]) => (
                <div key={l}>
                  <p className="text-white font-bold text-[15px] m-0">{v}</p>
                  <p className="text-white/45 text-[11px] m-0">{l}</p>
                </div>
              ))}
            </div>

            {/* Dots */}
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

          {/* ── RIGHT PANEL ────────────────────────────── */}
          <div
            className="right-panel flex-1 bg-white flex flex-col justify-center"
            style={{ padding: "40px 44px" }}
          >
            <div className="mb-6">
              <h1 className="text-[26px] font-bold text-slate-900 tracking-[-0.03em] mb-1.5 m-0">
                Create your account 🚀
              </h1>
              <p className="text-slate-400 text-[14px] leading-relaxed m-0">
                Join 50,000+ creators already using CreatorAI.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* First + Last name row */}
              <div className="flex gap-3">
                {/* First name */}
                <div className="relative flex-1">
                  <label
                    className="absolute left-3.5 bg-white px-1 pointer-events-none transition-all duration-200 z-10"
                    style={{
                      top: floatLabel("firstName", firstName) ? -10 : 14,
                      fontSize: floatLabel("firstName", firstName) ? 11 : 14,
                      fontWeight: floatLabel("firstName", firstName) ? 600 : 400,
                      color: focus.firstName ? "#6C5CE7" : "#94a3b8",
                    }}
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    autoComplete="given-name"
                    onChange={(e) => { setFirstName(e.target.value); setErrors((v) => ({ ...v, firstName: "" })); }}
                    onFocus={() => setF("firstName", true)}
                    onBlur={() => setF("firstName", false)}
                    className={`inp inp-no-icon${errors.firstName ? " err" : ""}`}
                  />
                  {errors.firstName && <p className="text-red-500 text-[11px] mt-1 ml-1 m-0">{errors.firstName}</p>}
                </div>

                {/* Last name */}
                <div className="relative flex-1">
                  <label
                    className="absolute left-3.5 bg-white px-1 pointer-events-none transition-all duration-200 z-10"
                    style={{
                      top: floatLabel("lastName", lastName) ? -10 : 14,
                      fontSize: floatLabel("lastName", lastName) ? 11 : 14,
                      fontWeight: floatLabel("lastName", lastName) ? 600 : 400,
                      color: focus.lastName ? "#6C5CE7" : "#94a3b8",
                    }}
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    autoComplete="family-name"
                    onChange={(e) => { setLastName(e.target.value); setErrors((v) => ({ ...v, lastName: "" })); }}
                    onFocus={() => setF("lastName", true)}
                    onBlur={() => setF("lastName", false)}
                    className={`inp inp-no-icon${errors.lastName ? " err" : ""}`}
                  />
                  {errors.lastName && <p className="text-red-500 text-[11px] mt-1 ml-1 m-0">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <label
                  className="absolute left-3.5 bg-white px-1 pointer-events-none transition-all duration-200 z-10"
                  style={{
                    top: floatLabel("email", email) ? -10 : 14,
                    fontSize: floatLabel("email", email) ? 11 : 14,
                    fontWeight: floatLabel("email", email) ? 600 : 400,
                    color: focus.email ? "#6C5CE7" : "#94a3b8",
                  }}
                >
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => { setEmail(e.target.value); setErrors((v) => ({ ...v, email: "" })); }}
                  onFocus={() => setF("email", true)}
                  onBlur={() => setF("email", false)}
                  className={`inp${errors.email ? " err" : ""}`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,14 22,4"/>
                  </svg>
                </span>
                {errors.email && <p className="text-red-500 text-[11px] mt-1 ml-1 m-0">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="relative">
                <label
                  className="absolute left-3.5 bg-white px-1 pointer-events-none transition-all duration-200 z-10"
                  style={{
                    top: floatLabel("password", password) ? -10 : 14,
                    fontSize: floatLabel("password", password) ? 11 : 14,
                    fontWeight: floatLabel("password", password) ? 600 : 400,
                    color: focus.password ? "#6C5CE7" : "#94a3b8",
                  }}
                >
                  Password
                </label>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => { setPassword(e.target.value); setErrors((v) => ({ ...v, password: "" })); }}
                  onFocus={() => setF("password", true)}
                  onBlur={() => setF("password", false)}
                  className={`inp${errors.password ? " err" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-[15px] bg-transparent border-none cursor-pointer text-slate-400 p-0"
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

                {/* Strength meter */}
                {password && (
                  <div className="mt-2 px-0.5">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((lvl) => (
                        <div
                          key={lvl}
                          className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{ background: lvl <= strength ? strengthColor[strength] : "#e2e8f0" }}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] m-0" style={{ color: strengthColor[strength] }}>
                      {strengthLabel[strength]}
                    </p>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-[11px] mt-1 ml-1 m-0">{errors.password}</p>}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <div
                    onClick={() => { setAgreed((v) => !v); setErrors((v2) => ({ ...v2, agreed: "" })); }}
                    className="w-[18px] h-[18px] rounded-[5px] cursor-pointer flex items-center justify-center shrink-0 transition-all duration-200 mt-0.5"
                    style={{
                      border: `2px solid ${agreed ? "#6C5CE7" : errors.agreed ? "#e74c3c" : "#e2e8f0"}`,
                      background: agreed ? "#6C5CE7" : "white",
                    }}
                  >
                    {agreed && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <polyline points="2,5 4,7 8,3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-[13px] text-slate-500 leading-snug">
                    I agree to the{" "}
                    <button type="button" className="text-[#6C5CE7] font-semibold bg-transparent border-none cursor-pointer text-[13px] p-0">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button type="button" className="text-[#6C5CE7] font-semibold bg-transparent border-none cursor-pointer text-[13px] p-0">
                      Privacy Policy
                    </button>
                  </span>
                </label>
                {errors.agreed && <p className="text-red-500 text-[11px] mt-1 ml-7 m-0">{errors.agreed}</p>}
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
                    <svg style={{ animation: "spin .8s linear infinite" }} width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,.3)" strokeWidth="2"/>
                      <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  "Create account"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-slate-400 text-[12px]">or sign up with</span>
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
                Sign up with Google
              </button>
            </form>

            <p className="text-center mt-5 text-[13px] text-slate-400 m-0">
              Already have an account?{" "}
              <button className="text-[#6C5CE7] font-bold bg-transparent border-none cursor-pointer text-[13px]">
                Sign in →
              </button>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}