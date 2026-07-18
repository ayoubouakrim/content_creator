"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { getHashtags } from "@/service/contentService";
import {
  Hash,
  Copy,
  Check,
  Sparkles,
  Info,
} from "lucide-react";

/* ══ PLATFORMS — same set/colors used across the app ══ */
const PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#e1306c" },
  { id: "twitter", label: "X / Twitter", color: "#1d9bf0" },
  { id: "linkedin", label: "LinkedIn", color: "#0a66c2" },
  { id: "tiktok", label: "TikTok", color: "#34d399" },
  { id: "pinterest", label: "Pinterest", color: "#e60023" },
  { id: "youtube", label: "YouTube", color: "#f87171" },
];

/* ══ TIER META ══ */
const TIERS: Record<string, { label: string; color: string; blurb: string }> = {
  broad: { label: "Broad", color: "#22d3ee", blurb: "High volume, high competition — reach, but easy to get buried in" },
  moderate: { label: "Moderate", color: "#a78bfa", blurb: "Decent volume, more realistic odds of visibility" },
  niche: { label: "Niche", color: "#34d399", blurb: "Low competition, most likely to actually surface your post" },
};

function StepLabel({ num, label, c1, c2 }: { num: number; label: string; c1: string; c2: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
        style={{ background: `linear-gradient(135deg,${c1},${c2})` }}
      >
        {num}
      </div>
      <span className="text-white/40 text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ fontFamily: "'DM Sans',sans-serif" }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,${c1}55,transparent)` }} />
    </div>
  );
}

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1800);
      }}
      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-wide border cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
        ok
          ? "bg-teal-500/15 border-teal-400/40 text-teal-300"
          : "bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10"
      }`}
    >
      {ok ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={1.75} />}
      {ok ? "Copied" : label}
    </button>
  );
}

export default function HashtagsPage() {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [report, setReport] = useState<any>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const platformMeta = PLATFORMS.find((p) => p.id === platform)!;

  const grouped = useMemo(() => {
    if (!report?.hashtags) return {};
    return report.hashtags.reduce((acc: Record<string, any[]>, h: any) => {
      acc[h.tier] = acc[h.tier] || [];
      acc[h.tier].push(h);
      return acc;
    }, {});
  }, [report]);

  const toggle = (tag: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  const analyze = async () => {
    if (!content.trim()) {
      setError("Paste your content or topic first.");
      return;
    }
    setError("");
    setLoading(true);
    setReport(null);
    setSelected(new Set());
    try {
      // Wire this to the HashtagsAnalyzerAgent endpoint.
      // Expected shape: { platform, content_summary, hashtags: [{tag, tier, reason}], recommended_count, notes }
      const data = await getHashtags(content, platform);
      setReport(data);
    } catch (err) {
      console.error("❌ Hashtag analysis error:", err);
      setError("Couldn't generate hashtags. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const allTags = report?.hashtags?.map((h: any) => h.tag) ?? [];
  const selectedTags = allTags.filter((t: string) => selected.has(t));

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ fontFamily: "'Sora',sans-serif", background: "radial-gradient(ellipse 120% 80% at 50% -10%,#1a0a3a 0%,#0d0e2e 50%,#060610 100%)" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes inputGlow { 0%,100%{box-shadow:0 0 0 0 rgba(108,92,231,0)} 50%{box-shadow:0 0 40px 6px rgba(108,92,231,.18)} }
        .fade-up { animation:fadeUp .5s ease both }
        .gen-btn { background:linear-gradient(135deg,#5b21b6,#6C5CE7,#0891b2,#6C5CE7); background-size:300% 300%; animation:gradShift 3s ease infinite }
        .gen-btn:hover { transform:translateY(-2px); box-shadow:0 16px 44px rgba(108,92,231,.45) }
        textarea:focus { outline:none }
        ::-webkit-scrollbar { width:3px }
        ::-webkit-scrollbar-thumb { background:rgba(108,92,231,.45); border-radius:2px }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(108,92,231,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(108,92,231,.055) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Navbar />

      <div className="relative z-[5] max-w-[1200px] mx-auto px-6 py-10 pb-24">
        <div className="text-center mb-10 fade-up">
          <h1 className="text-[clamp(26px,5vw,42px)] font-extrabold tracking-tight leading-tight m-0">
            <span
              style={{
                background: "linear-gradient(135deg,#c4b5fd 0%,#818cf8 40%,#22d3ee 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Hashtags
            </span>
          </h1>
          <p className="text-white/35 text-sm mt-2" style={{ fontFamily: "'DM Sans',sans-serif" }}>
            Get relevant, tiered hashtag suggestions for your content.
          </p>
        </div>

        {/* ── TWO-COLUMN LAYOUT: input | report ── */}
        <div
          className="grid gap-6 items-start transition-[grid-template-columns] duration-300"
          style={{ gridTemplateColumns: report || loading ? "minmax(0,440px) minmax(0,1fr)" : "minmax(0,640px)", justifyContent: "center" }}
        >
        {/* ── INPUT PANEL ── */}
        <div
          className="rounded-3xl overflow-hidden backdrop-blur-2xl p-7"
          style={{
            background: "rgba(6,4,18,.9)",
            border: "1px solid rgba(108,92,231,.25)",
            boxShadow: "0 0 60px rgba(108,92,231,.10), 0 30px 60px rgba(0,0,0,.5)",
          }}
        >
          <StepLabel num={1} label="Platform" c1="#6C5CE7" c2="#8b5cf6" />
          <div className="flex flex-wrap gap-2 mb-7">
            {PLATFORMS.map((p) => {
              const active = p.id === platform;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className="px-3.5 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-all duration-150"
                  style={{
                    background: active ? `${p.color}18` : "rgba(255,255,255,.03)",
                    borderColor: active ? `${p.color}80` : "rgba(255,255,255,.08)",
                    color: active ? "white" : "rgba(255,255,255,.4)",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <StepLabel num={2} label="Topic or content" c1="#fd79a8" c2="#e84393" />
          <div className="relative mb-2">
            <div
              className="absolute -inset-px rounded-2xl pointer-events-none transition-opacity duration-500"
              style={{
                background: "linear-gradient(135deg,rgba(108,92,231,.6),rgba(34,211,238,.35))",
                opacity: content ? 1 : 0,
                animation: content ? "inputGlow 3s ease infinite" : "none",
              }}
            />
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError("");
              }}
              placeholder="Paste your caption, or just describe the topic — e.g. 'morning routine for better focus'"
              rows={4}
              className="relative block w-full rounded-2xl px-5 py-4 text-sm text-white placeholder-white/20 resize-none leading-relaxed backdrop-blur-xl"
              style={{
                fontFamily: "'DM Sans',sans-serif",
                background: "rgba(12,8,28,.8)",
                border: `1px solid ${content ? "rgba(108,92,231,.6)" : "rgba(255,255,255,.1)"}`,
              }}
            />
          </div>
          {error && (
            <p className="text-red-400 text-xs mb-4" style={{ fontFamily: "'DM Sans',sans-serif" }}>
              ⚠ {error}
            </p>
          )}

          <button
            onClick={analyze}
            disabled={loading}
            className="gen-btn w-full py-4 rounded-2xl border-none text-white text-[15px] font-bold tracking-tight cursor-pointer mt-3 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
            style={{ fontFamily: "'Sora',sans-serif" }}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 shrink-0" style={{ animation: "spin .8s linear infinite" }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,.2)" strokeWidth="2.5" />
                  <path d="M12 3a9 9 0 019 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Finding tags…
              </>
            ) : (
              <>
                <Hash size={16} strokeWidth={2} />
                Get hashtags
              </>
            )}
          </button>
        </div>

        {/* ── LOADING SKELETON / REPORT COLUMN ── */}
        {loading && (
          <div
            className="rounded-3xl p-7 backdrop-blur-2xl flex flex-wrap gap-2"
            style={{ background: "rgba(6,4,18,.9)", border: "1px solid rgba(108,92,231,.25)", animation: "slideIn .4s ease both" }}
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="h-7 rounded-full bg-violet-500/15"
                style={{ width: 60 + ((i * 37) % 70), animation: `pulse 1.3s ease-in-out ${i * 0.06}s infinite` }}
              />
            ))}
          </div>
        )}

        {/* ── REPORT ── */}
        {!loading && report && (
          <div
            className="rounded-3xl overflow-hidden backdrop-blur-2xl"
            style={{
              background: "rgba(6,4,18,.9)",
              border: "1px solid rgba(108,92,231,.25)",
              boxShadow: "0 0 60px rgba(108,92,231,.10), 0 30px 60px rgba(0,0,0,.5)",
              animation: "slideIn .4s ease both",
            }}
          >
            {/* chrome bar */}
            <div
              className="flex items-center justify-between px-5 py-3.5 border-b"
              style={{ borderColor: "rgba(108,92,231,.2)", background: "rgba(108,92,231,.06)" }}
            >
              <div className="flex items-center gap-2.5">
                <Hash size={13} strokeWidth={2} color={platformMeta.color} />
                <span className="text-white/40 text-[11px] tracking-widest uppercase">
                  {platformMeta.label} · {allTags.length} tags
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/25 text-[10.5px]" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                  {selected.size} selected
                </span>
                <CopyBtn text={selectedTags.join(" ")} label={selected.size ? "Copy selected" : "Copy all"} />
              </div>
            </div>

            <div className="px-7 py-6">
              {report.content_summary && (
                <p className="text-white/50 text-[12.5px] italic mb-2" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                  "{report.content_summary}"
                </p>
              )}

              {report.notes && (
                <div
                  className="flex items-start gap-2.5 rounded-xl px-3.5 py-3 border mb-6"
                  style={{ background: "rgba(34,211,238,.05)", borderColor: "rgba(34,211,238,.18)" }}
                >
                  <Info size={14} strokeWidth={2} color="#22d3ee" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p className="text-white/60 text-[11.5px] leading-relaxed" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                    {report.notes}
                    {report.recommended_count && (
                      <span className="text-cyan-300 font-semibold"> Use about {report.recommended_count} on {platformMeta.label}.</span>
                    )}
                  </p>
                </div>
              )}

              {/* tiers */}
              {(["broad", "moderate", "niche"] as const).map((tier) => {
                const tags = grouped[tier];
                if (!tags?.length) return null;
                const meta = TIERS[tier];
                return (
                  <div key={tier} className="mb-6 last:mb-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: meta.color }}>
                        {meta.label}
                      </span>
                      <span className="text-white/20 text-[10px]">{tags.length}</span>
                    </div>
                    <p className="text-white/30 text-[10.5px] mb-3" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                      {meta.blurb}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((h: any) => {
                        const active = selected.has(h.tag);
                        return (
                          <button
                            key={h.tag}
                            onClick={() => toggle(h.tag)}
                            title={h.reason}
                            className="px-3 py-1.5 rounded-full border text-[11.5px] font-medium cursor-pointer transition-all duration-150"
                            style={{
                              background: active ? `${meta.color}22` : "rgba(255,255,255,.03)",
                              borderColor: active ? `${meta.color}90` : "rgba(255,255,255,.08)",
                              color: active ? "white" : "rgba(255,255,255,.5)",
                              fontFamily: "'DM Sans',sans-serif",
                            }}
                          >
                            {h.tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>

        {/* empty state hint */}
        {!loading && !report && (
          <div className="flex items-center gap-2.5 justify-center text-white/25 text-xs mt-6" style={{ fontFamily: "'DM Sans',sans-serif" }}>
            <Sparkles size={13} strokeWidth={1.75} />
            Suggestions are grouped by reach vs. competition — not live trend data.
          </div>
        )}
      </div>
    </div>
  );
}