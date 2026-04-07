"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Share2, BarChart3, Hash, Zap } from 'lucide-react';
import Footer from "@/components/Footer";

/* ─── Mini chart component ───────────────────────────────────── */
function SparkLine({ data, color }: { data: number[]; color: string }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const w = 80, h = 28;
    const coords = data.map((v, i) => ({
        x: (i / (data.length - 1)) * w,
        y: h - ((v - min) / (max - min || 1)) * h,
    }));
    const path = coords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const fill = `${path} L ${w} ${h} L 0 ${h} Z`;
    const gradId = `sg-${color.replace("#", "")}`;
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-20 h-7">
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={fill} fill={`url(#${gradId})`} />
            <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ─── AI Input Bar ───────────────────────────────────────────── */
function AIBar() {
    const [val, setVal] = useState("");
    const [loading, setLoading] = useState(false);
    

    const handleGenerate = () => {
        if (!val.trim()) return;
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <div className="rounded-[20px] p-7 pb-6 border border-[rgba(108,92,231,0.3)] shadow-[0_0_40px_rgba(108,92,231,0.12)]"
            style={{ background: "linear-gradient(135deg,#1a1040 0%,#2d1b69 100%)" }}>
            {/* Header row */}
            <div className="flex items-center gap-2.5 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#6C5CE7] animate-pulse" />
                <span className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-[0.1em] font-semibold">
                    AI Content Generator
                </span>
                
            </div>

            {/* Textarea + button */}
            <div className="flex gap-2.5 items-end">
                <textarea
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    placeholder="Describe your post… e.g. 'Launching our new fall collection, edgy and playful tone'"
                    className="flex-1 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] rounded-[14px] px-4 py-[14px] text-white text-sm font-[Sora,sans-serif] resize-none outline-none min-h-[52px] leading-relaxed transition-all duration-200
            focus:border-[rgba(108,92,231,0.6)] focus:shadow-[0_0_0_3px_rgba(108,92,231,0.12)]"
                    rows={2}
                />
                <button
                    onClick={handleGenerate}
                    className="px-[22px] py-[14px] rounded-[14px] border-none cursor-pointer text-white text-sm font-semibold font-[Sora,sans-serif] whitespace-nowrap flex items-center gap-2 transition-all duration-200 hover:-translate-y-px"
                    style={{ background: "linear-gradient(135deg,#6C5CE7,#a78bfa)" }}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin" width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,.3)" strokeWidth="2" />
                                <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Generating…
                        </>
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            Generate
                        </>
                    )}
                </button>
            </div>

            {/* Quick fill chips */}
            <div className="flex gap-2 mt-3 flex-wrap">
                {["New product launch", "Behind the scenes", "Weekly tips thread", "Viral hook reel"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setVal(s)}
                        className="px-3 py-1 rounded-full border border-[rgba(108,92,231,0.3)] bg-[rgba(108,92,231,0.1)] text-[#a78bfa] text-[11px] cursor-pointer font-[Sora,sans-serif] transition-all duration-150
              hover:bg-[rgba(108,92,231,0.2)] hover:border-[rgba(108,92,231,0.5)]"
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ─── Stat Card ──────────────────────────────────────────────── */
function StatCard({ label, value, delta, positive, spark, color }: {
    label: string; value: string; delta: string; positive: boolean; spark: number[]; color: string;
}) {
    return (
        <div className="bg-white rounded-2xl px-[22px] py-5 border border-[#f1f5f9] flex-1 min-w-0">
            <div className="flex justify-between items-start">
                <div>
                    <p className="m-0 text-[12px] text-[#94a3b8] font-medium uppercase tracking-[0.07em]">{label}</p>
                    <p className="m-0 mt-[6px] text-[26px] font-bold text-[#1e293b] tracking-[-0.03em]">{value}</p>
                </div>
                <SparkLine data={spark} color={color} />
            </div>
            <p className={`m-0 mt-2.5 text-xs font-semibold ${positive ? "text-[#00b894]" : "text-[#e74c3c]"}`}>
                {positive ? "↑" : "↓"} {delta}{" "}
                <span className="text-[#cbd5e1] font-normal">vs last week</span>
            </p>
        </div>
    );
}

/* ─── Scheduled Post Card ────────────────────────────────────── */
function ScheduledCard({ time, platform, caption, status, color }: {
    time: string; platform: string; caption: string; status: "scheduled" | "draft" | "live"; color: string;
}) {
    const statusStyles = {
        scheduled: "bg-[rgba(108,92,231,0.1)] text-[#6C5CE7]",
        draft: "bg-[rgba(148,163,184,0.12)] text-[#94a3b8]",
        live: "bg-[rgba(0,184,148,0.1)] text-[#00b894]",
    };

    return (
        <div
            className="flex items-center gap-3.5 px-4 py-[14px] rounded-[14px] bg-white border border-[#f1f5f9] cursor-pointer transition-all duration-150
        hover:border-[#e2e8f0] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
        >
            <div
                className="w-[38px] h-[38px] rounded-[10px] flex-shrink-0 flex items-center justify-center text-[11px] font-bold"
                style={{ background: color + "18", color }}
            >
                {platform}
            </div>
            <div className="flex-1 min-w-0">
                <p className="m-0 text-[13px] font-semibold text-[#1e293b] truncate">{caption}</p>
                <p className="m-0 mt-[2px] text-[11px] text-[#94a3b8]">{time}</p>
            </div>
            <span className={`px-2.5 py-[3px] rounded-full text-[11px] font-semibold flex-shrink-0 ${statusStyles[status]}`}>
                {status}
            </span>
        </div>
    );
}

/* ─── Trend Row ──────────────────────────────────────────────── */
function TrendRow({ tag, delta, volume }: { tag: string; delta: string; volume: number }) {
    return (
        <div className="flex items-center gap-2.5 py-2.5 border-b border-[#f8faff]">
            <span className="text-[13px] font-semibold text-[#6C5CE7] flex-1">{tag}</span>
            <div className="w-20 h-1 rounded bg-[#f1f5f9] overflow-hidden">
                <div
                    className="h-full rounded"
                    style={{ width: `${volume}%`, background: "linear-gradient(90deg,#6C5CE7,#a78bfa)" }}
                />
            </div>
            <span className="text-[11px] font-semibold text-[#00b894] min-w-[36px] text-right">{delta}</span>
        </div>
    );
}

/* ─── Main Dashboard ─────────────────────────────────────────── */
export default function DashboardPage() {
    const [activeNav, setActiveNav] = useState("home");
    const router = useRouter();

    const navItems = [
        {
            id: "home", label: "Home",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>,
        },
        {
            id: "create", label: "Create",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
        },
        {
            id: "calendar", label: "Calendar",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
        },
        {
            id: "analytics", label: "Analytics",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
        },
        {
            id: "trends", label: "Trends",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18" /><polyline points="17,6 23,6 23,12" /></svg>,
        },
        {
            id: "brand", label: "Brand Kit",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>,
        },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp .4s ease both; }
        .animate-fade-up-slow { animation: fadeUp .45s ease both; }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Sora', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.2); border-radius: 4px; }
      `}</style>

            <div className="flex flex-col min-h-screen bg-[#f8faff] font-[Sora,sans-serif]">

                {/* ── NAVBAR ──────────────────────────────────── */}
                <nav
                    className="flex items-center px-6 h-[60px] gap-1 sticky top-0 z-[100] flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#1a1040 0%,#2d1b69 100%)" }}
                >
                    {/* Logo */}
                    <div
                        className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center mr-5 flex-shrink-0"
                        style={{ background: "linear-gradient(135deg,#6C5CE7,#a78bfa)" }}
                    >
                        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                            <path d="M4 9Q9 4 14 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                            <path d="M4 12Q9 7 14 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                            <circle cx="14" cy="13" r="3" fill="white" />
                            <path d="M12.8 13l.9.9 1.5-1.8" stroke="#6C5CE7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    {/* Nav items */}
                    <div className="flex items-center gap-0.5 flex-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveNav(item.id)}
                                className={`relative flex items-center gap-[7px] px-3.5 py-2 rounded-[10px] border-none cursor-pointer font-[Sora,sans-serif] text-[13px] font-semibold transition-all duration-200
                  ${activeNav === item.id
                                        ? "bg-[rgba(108,92,231,0.25)] text-white"
                                        : "bg-transparent text-[rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.07)] hover:text-[rgba(255,255,255,0.75)]"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                                {activeNav === item.id && (
                                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#a78bfa]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2.5 ml-auto">
                        <button className="w-9 h-9 rounded-[10px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.07)] flex items-center justify-center cursor-pointer text-[rgba(255,255,255,0.6)]">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 01-3.46 0" />
                            </svg>
                        </button>

                        <button
                            className="px-4 py-2 rounded-[10px] border-none cursor-pointer text-white text-[13px] font-semibold font-[Sora,sans-serif] flex items-center gap-1.5"
                            style={{ background: "linear-gradient(135deg,#6C5CE7,#a78bfa)" }}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            New Post
                        </button>

                        <div
                            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold text-white cursor-pointer flex-shrink-0"
                            style={{ background: "linear-gradient(135deg,#fd79a8,#6C5CE7)" }}
                        >
                            JD
                        </div>
                    </div>
                </nav>

                {/* ── MAIN ────────────────────────────────────── */}
                <main className="flex-1 overflow-y-auto p-8 px-7">

                    {/* Header */}
                    <div className="mb-7">
                        <h1 className="m-0 text-2xl font-bold text-[#1e293b] tracking-[-0.03em]">
                            Good morning, Jordan 👋
                        </h1>
                        <p className="m-0 mt-1 text-[13px] text-[#94a3b8]">
                            Your audience is most active in{" "}
                            <strong className="text-[#6C5CE7]">2 hours</strong> — perfect time to schedule something.
                        </p>
                    </div>

                    {/* Stats row */}
                    <div className="flex gap-3.5 mb-7 animate-fade-up-slow">
                        <StatCard label="Total reach" value="84.2K" delta="18% this week" positive spark={[40, 55, 48, 62, 58, 75, 84]} color="#6C5CE7" />
                        <StatCard label="Engagement" value="6.4%" delta="0.8% this week" positive spark={[5, 5.2, 4.9, 5.8, 5.5, 6.1, 6.4]} color="#00b894" />
                        <StatCard label="New followers" value="+1,247" delta="3% this week" positive={false} spark={[1400, 1320, 1380, 1290, 1310, 1260, 1247]} color="#fd79a8" />
                        <StatCard label="Posts this week" value="9" delta="2 posts" positive spark={[4, 6, 5, 7, 6, 8, 9]} color="#fdcb6e" />
                    </div>

                    {/* AI Bar */}
                    <div className="mb-7 animate-fade-up">
                        <AIBar />
                    </div>



                    {/* Bottom two-column */}
                    <div className="grid grid-cols-[1fr_340px] gap-5">

                        {/* Left: Scheduled posts */}
                        <div>
                            {/* Quick create */}
                            <div className="mt-4">
                                <h2 className="m-0 mb-4 text-base font-bold text-[#1e293b]">Quick create</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {[
                                        {
                                            label: "Blog Post",
                                            sub: "AI-written and seo optimized",
                                            color: "#6C5CE7",
                                            icon: FileText,
                                            span: "col-span-1"
                                        },
                                        {
                                            label: "Social media post",
                                            sub: "AI-written",
                                            color: "#fd79a8",
                                            icon: Share2,
                                            span: "col-span-1"
                                        },
                                        {
                                            label: "Review seo score",
                                            sub: "Get a detailed analysis",
                                            color: "#1da1f2",
                                            icon: BarChart3,
                                            span: "col-span-2 md:col-span-1"
                                        },
                                        {
                                            label: "Trending hashtags",
                                            sub: "Get 30 relevant tags to your post",
                                            color: "#fdcb6e",
                                            icon: Hash,
                                            span: "col-span-1"
                                        },
                                        {
                                            label: "Improve your seo score",
                                            sub: "Get actionable tips",
                                            color: "#00b894",
                                            icon: Zap,
                                            span: "col-span-1"
                                        },
                                    ].map((a) => {
                                        const Icon = a.icon;
                                        return (
                                            <div
                                                key={a.label}
                                                className={`group ${a.span} p-4 rounded-[14px] bg-white border border-[#e2e8f0] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 overflow-hidden relative`}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = a.color;
                                                    e.currentTarget.style.boxShadow = `0 12px 24px ${a.color}22`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = "#e2e8f0";
                                                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                                                }}
                                            >
                                                {/* Gradient Background Overlay */}
                                                <div
                                                    className="absolute inset-0 opacity-0 group-hover:opacity-4 transition-opacity duration-200"
                                                    style={{ backgroundColor: a.color }}
                                                />

                                                {/* Icon Container */}
                                                <div
                                                    className="relative w-10 h-10 rounded-[10px] flex items-center justify-center mb-3 transition-all duration-200 group-hover:scale-110"
                                                    style={{ backgroundColor: a.color + "20" }}
                                                >
                                                    <Icon
                                                        size={20}
                                                        style={{ color: a.color }}
                                                        strokeWidth={2.5}
                                                    />
                                                </div>

                                                {/* Content */}
                                                <div className="relative">
                                                    <p className="m-0 text-sm font-semibold text-[#1e293b] mb-1.5 line-clamp-2">
                                                        {a.label}
                                                    </p>
                                                    <p className="m-0 text-xs text-[#64748b] leading-relaxed line-clamp-2">
                                                        {a.sub}
                                                    </p>
                                                </div>

                                                {/* Bottom Accent Line */}
                                                <div
                                                    className="absolute bottom-0 left-0 w-0 h-1 group-hover:w-full transition-all duration-300"
                                                    style={{ backgroundColor: a.color }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-3.5 mt-8">
                                <h2 className="m-0 text-base font-bold text-[#1e293b]">Upcoming posts</h2>
                                <button className="bg-transparent border-none text-[#6C5CE7] text-[13px] font-semibold cursor-pointer font-[Sora,sans-serif]">
                                    View calendar →
                                </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                <ScheduledCard time="Today · 3:00 PM" platform="IG" caption="New fall collection drop — link in bio! ✨ #fashion" status="scheduled" color="#fd79a8" />
                                <ScheduledCard time="Today · 6:00 PM" platform="TT" caption="POV: You found the perfect outfit for under $50" status="scheduled" color="#1e293b" />
                                <ScheduledCard time="Tomorrow · 9:00 AM" platform="X" caption="Thread: 5 social media mistakes killing your reach 🧵" status="draft" color="#1da1f2" />
                                <ScheduledCard time="Tomorrow · 12:00 PM" platform="LI" caption="How we grew our Instagram by 12K followers in 60 days" status="draft" color="#0077b5" />
                                <ScheduledCard time="Live now" platform="IG" caption="Behind the scenes: Our studio setup for fall 🍂" status="live" color="#fd79a8" />
                            </div>
                        </div>

                        {/* Right: Trends + best time */}
                        <div className="flex flex-col gap-4">

                            {/* AI tip */}
                            <div
                                className="rounded-2xl px-5 py-[18px] border border-[rgba(108,92,231,0.3)]"
                                style={{ background: "linear-gradient(135deg,#1a1040,#2d1b69)" }}
                            >
                                <div className="flex items-center gap-2 mb-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00b894] animate-pulse" />
                                    <span className="text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-[0.08em] font-semibold">
                                        AI Insight
                                    </span>
                                </div>
                                <p className="m-0 text-white text-[13px] leading-relaxed">
                                    Posts with <strong className="text-[#a78bfa]">emojis + a question</strong> in the caption get{" "}
                                    <strong className="text-[#00b894]">2.3× more comments</strong> from your audience this week.
                                </p>
                            </div>

                            {/* Trending now */}
                            <div className="bg-white rounded-2xl p-5 border border-[#f1f5f9] flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h2 className="m-0 text-[15px] font-bold text-[#1e293b]">Trending in your niche</h2>
                                    <span className="text-[11px] text-[#94a3b8]">Live</span>
                                </div>
                                <TrendRow tag="#FallFashion2025" delta="+34%" volume={92} />
                                <TrendRow tag="#CreatorEconomy" delta="+21%" volume={78} />
                                <TrendRow tag="#AIContent" delta="+18%" volume={65} />
                                <TrendRow tag="#StyleInspo" delta="+12%" volume={54} />
                                <TrendRow tag="#GRWM" delta="+9%" volume={41} />
                            </div>

                            {/* Best times */}
                            <div className="bg-white rounded-2xl p-5 border border-[#f1f5f9]">
                                <h2 className="m-0 mb-3.5 text-[15px] font-bold text-[#1e293b]">Best time to post</h2>
                                {[
                                    { platform: "IG", time: "3:00 – 5:00 PM", color: "#fd79a8" },
                                    { platform: "TT", time: "7:00 – 9:00 PM", color: "#1e293b" },
                                    { platform: "LI", time: "8:00 – 10:00 AM", color: "#0077b5" },
                                ].map((b) => (
                                    <div key={b.platform} className="flex items-center gap-2.5 mb-2.5">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold"
                                            style={{ background: b.color + "18", color: b.color }}
                                        >
                                            {b.platform}
                                        </div>
                                        <span className="text-[13px] text-[#475569] font-medium">{b.time}</span>
                                        <div className="ml-auto w-2 h-2 rounded-full bg-[#00b894]" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}