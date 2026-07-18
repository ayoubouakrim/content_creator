"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { improveContent } from "@/service/contentService";
import {
  Wand2,
  Copy,
  Check,
  Eye,
  FileEdit,
  PenLine,
  Radio,
  ShoppingBag,
  Play,
  Music2,
} from "lucide-react";

/* ══ CONTENT TYPES — same set/colors used elsewhere ══ */
const CONTENT_TYPES = [
  { id: "blog", label: "Blog Post", Icon: PenLine, color: "#a78bfa" },
  { id: "social", label: "Social Media", Icon: Radio, color: "#fd79a8" },
  { id: "product", label: "Product Drop", Icon: ShoppingBag, color: "#fbbf24" },
  { id: "youtube", label: "YouTube", Icon: Play, color: "#f87171" },
  { id: "tiktok", label: "TikTok", Icon: Music2, color: "#34d399" },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#e1306c" },
  { id: "twitter", label: "X / Twitter", color: "#1d9bf0" },
  { id: "linkedin", label: "LinkedIn", color: "#0a66c2" },
  { id: "facebook", label: "Facebook", color: "#1877f2" },
  { id: "threads", label: "Threads", color: "#a78bfa" },
  { id: "pinterest", label: "Pinterest", color: "#e60023" },
];

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

function CopyBtn({ text }: { text: string }) {
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
      {ok ? "Copied" : "Copy"}
    </button>
  );
}

export default function ImproveSEOPage() {
  const [postType, setPostType] = useState("blog");
  const [platform, setPlatform] = useState("instagram");
  const [content, setContent] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [improvedContent, setImprovedContent] = useState("");
  const [view, setView] = useState<"improved" | "original">("improved");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasResult = loading || !!improvedContent;
  const type = CONTENT_TYPES.find((t) => t.id === postType)!;

  const improve = async () => {
    if (!content.trim()) {
      setError("Paste your content first.");
      return;
    }
    setError("");
    setLoading(true);
    setImprovedContent("");
    setView("improved");
    try {
      const data = await improveContent(
        postType,
        content,
        postType === "social" ? platform : undefined,
        targetKeyword || undefined
      );
      setImprovedContent(data?.improved_content ?? "");
    } catch (err) {
      console.error("❌ Improve error:", err);
      setError("Couldn't improve this content. Try again.");
    } finally {
      setLoading(false);
    }
  };

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

      <div className="relative z-5 max-w-300 mx-auto px-6 py-10 pb-24">
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
              Improve content
            </span>
          </h1>
          <p className="text-white/35 text-sm mt-2" style={{ fontFamily: "'DM Sans',sans-serif" }}>
            Paste your content, get a rewritten, better version back.
          </p>
        </div>

        {/* ── TWO-COLUMN: input beside result ── */}
        <div
          className="grid gap-6 items-start transition-[grid-template-columns] duration-300"
          style={{
            gridTemplateColumns: hasResult ? "minmax(0,420px) minmax(0,1fr)" : "minmax(0,640px)",
            justifyContent: "center",
          }}
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
            <StepLabel num={1} label="Content type" c1="#6C5CE7" c2="#8b5cf6" />
            <div className="grid grid-cols-5 gap-2 mb-7">
              {CONTENT_TYPES.map((t) => {
                const active = t.id === postType;
                return (
                  <button
                    key={t.id}
                    onClick={() => setPostType(t.id)}
                    className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border cursor-pointer transition-all duration-150"
                    style={{
                      background: active ? `${t.color}18` : "rgba(255,255,255,.03)",
                      borderColor: active ? `${t.color}80` : "rgba(255,255,255,.07)",
                      boxShadow: active ? `0 0 18px ${t.color}30` : "none",
                    }}
                  >
                    <t.Icon size={18} strokeWidth={1.75} color={active ? t.color : "rgba(255,255,255,.4)"} />
                    <span
                      className="text-[9.5px] font-semibold text-center leading-tight"
                      style={{ color: active ? "white" : "rgba(255,255,255,.35)", fontFamily: "'DM Sans',sans-serif" }}
                    >
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {postType === "social" && (
              <>
                <StepLabel num={2} label="Platform" c1="#22d3ee" c2="#0984e3" />
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
              </>
            )}

            <StepLabel num={postType === "social" ? 3 : 2} label="Target keyword" c1="#fbbf24" c2="#f59e0b" />
            <input
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="Optional — e.g. 'home workout routine'"
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 mb-7"
              style={{
                fontFamily: "'DM Sans',sans-serif",
                background: "rgba(12,8,28,.8)",
                border: "1px solid rgba(255,255,255,.1)",
              }}
            />

            <StepLabel num={postType === "social" ? 4 : 3} label="Your content" c1="#fd79a8" c2="#e84393" />
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
                placeholder="Paste the content you want improved…"
                rows={9}
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
              onClick={improve}
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
                  Rewriting…
                </>
              ) : (
                <>
                  <Wand2 size={16} strokeWidth={2} />
                  Improve content
                </>
              )}
            </button>
          </div>

          {/* ── LOADING SKELETON ── */}
          {loading && (
            <div
              className="rounded-3xl p-7 backdrop-blur-2xl flex flex-col gap-3"
              style={{ background: "rgba(6,4,18,.9)", border: "1px solid rgba(108,92,231,.25)", animation: "slideIn .4s ease both" }}
            >
              {[92, 78, 85, 60, 70, 50, 88, 65].map((w, i) => (
                <div
                  key={i}
                  className="h-2.5 rounded-full bg-violet-500/20"
                  style={{ width: `${w}%`, animation: `pulse 1.4s ease-in-out ${i * 0.1}s infinite` }}
                />
              ))}
            </div>
          )}

          {/* ── RESULT — content only, no score/report ── */}
          {!loading && improvedContent && (
            <div
              className="rounded-3xl overflow-hidden backdrop-blur-2xl"
              style={{
                background: "rgba(6,4,18,.9)",
                border: "1px solid rgba(108,92,231,.25)",
                boxShadow: "0 0 60px rgba(108,92,231,.10), 0 30px 60px rgba(0,0,0,.5)",
                animation: "slideIn .4s ease both",
              }}
            >
              {/* chrome bar — just a view toggle + copy, no score badges */}
              <div
                className="flex items-center justify-between px-5 py-3.5 border-b"
                style={{ borderColor: "rgba(108,92,231,.2)", background: "rgba(108,92,231,.06)" }}
              >
                <div className="flex items-center gap-2.5">
                  <type.Icon size={13} strokeWidth={2} color={type.color} />
                  <span className="text-white/40 text-[11px] tracking-widest uppercase">{type.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setView("improved")}
                      className="px-3 py-1.5 text-[11px] font-semibold cursor-pointer flex items-center gap-1.5"
                      style={{
                        background: view === "improved" ? "rgba(108,92,231,.25)" : "transparent",
                        color: view === "improved" ? "white" : "rgba(255,255,255,.4)",
                      }}
                    >
                      <FileEdit size={12} strokeWidth={2} /> Improved
                    </button>
                    <button
                      onClick={() => setView("original")}
                      className="px-3 py-1.5 text-[11px] font-semibold cursor-pointer flex items-center gap-1.5"
                      style={{
                        background: view === "original" ? "rgba(108,92,231,.25)" : "transparent",
                        color: view === "original" ? "white" : "rgba(255,255,255,.4)",
                      }}
                    >
                      <Eye size={12} strokeWidth={2} /> Original
                    </button>
                  </div>
                  <CopyBtn text={view === "improved" ? improvedContent : content} />
                </div>
              </div>

              <div className="px-7 py-6">
                {(view === "improved" ? improvedContent : content)
                  .split("\n")
                  .map((line: string, i: number) =>
                    line.trim() === "" ? (
                      <div key={i} className="h-2.5" />
                    ) : (
                      <p key={i} className="text-white/75 text-[13.5px] leading-relaxed my-1">
                        {line}
                      </p>
                    )
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}