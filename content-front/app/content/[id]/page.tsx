"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getContentById, getSEOReportByContentId } from "@/service/contentService";
import {
  Copy,
  Check,
  FileBarChart,
  AlertTriangle,
  Minus,
  TrendingUp,
  Search,
  X,
} from "lucide-react";
import Footer from "@/components/Footer";

/* ══ helpers ══ */
function ringColor(score: number) {
  if (score >= 70) return "#34d399";
  if (score >= 45) return "#fbbf24";
  return "#f87171";
}
function priColor(p: string) {
  return p === "HIGH" ? "#f87171" : p === "MED" ? "#fbbf24" : "#34d399";
}

function RichText({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div>
      {text.split("\n").map((line, i) => {
        if (line.startsWith("## "))
          return (
            <h3 key={i} className="text-violet-300 font-bold text-xs tracking-widest uppercase mt-5 mb-1.5">
              {line.slice(3)}
            </h3>
          );
        if (line.startsWith("# "))
          return (
            <h2 key={i} className="text-white font-extrabold text-lg mt-5 mb-2" style={{ fontFamily: "'Sora',sans-serif" }}>
              {line.slice(2)}
            </h2>
          );
        if (line.startsWith("- ") || line.startsWith("• "))
          return (
            <div key={i} className="flex gap-2 mt-1.5">
              <span className="text-violet-400 text-xs mt-0.5">▸</span>
              <span className="text-white/70 text-[13px] leading-relaxed">{line.slice(2)}</span>
            </div>
          );
        if (line === "") return <div key={i} className="h-2.5" />;
        return (
          <p key={i} className="text-white/70 text-[13px] leading-relaxed my-1">
            {line}
          </p>
        );
      })}
    </div>
  );
}

function CopyBtn({ text }: { text?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => {
        if (text) navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 2000);
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

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color }}>
          {title}
        </span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,${color}40,transparent)` }} />
      </div>
      {children}
    </div>
  );
}
function Chip({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 bg-white/4 text-white/50 tracking-wide">
      <span className="text-white/25">{label}</span> <span className="text-white font-semibold">{value}</span>
    </span>
  );
}
function KwRow({ label, color, term, meta }: { label: string; color: string; term: string; meta: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-2.5 border border-white/8 bg-white/[0.02]">
      <div>
        <p className="text-white text-[12px] font-semibold">{term}</p>
        <span className="text-[9.5px] font-bold tracking-widest uppercase" style={{ color }}>
          {label}
        </span>
      </div>
      <p className="text-white/30 text-[10px]">{meta}</p>
    </div>
  );
}
function MetaBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-xl px-3 py-2.5 border" style={{ background: "rgba(34,211,238,.05)", borderColor: "rgba(34,211,238,.18)" }}>
      <p className="text-[9.5px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "#22d3ee" }}>
        {label}
      </p>
      <p className="text-white/60 text-[11.5px] leading-relaxed">{text}</p>
    </div>
  );
}

/* ══ PAGE ══ */
export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const [item, setItem] = useState<any>(null);
  const [seoReport, setSeoReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    if (!contentId) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const contentRes = await getContentById(parseInt(contentId));
        const contentData = (contentRes as any)?.data ?? contentRes;

        if (!contentData) {
          setError("Content not found.");
          setLoading(false);
          return;
        }
        setItem(contentData);

        try {
          const seoRes = await getSEOReportByContentId(parseInt(contentId));
          setSeoReport((seoRes as any)?.data ?? seoRes ?? null);
        } catch (seoErr) {
          console.warn("No SEO report found for this content:", seoErr);
        }
      } catch (err) {
        setError("Error loading content");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contentId]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white"
        style={{ background: "radial-gradient(ellipse 120% 80% at 50% -10%,#1a0a3a 0%,#0d0e2e 50%,#060610 100%)" }}
      >
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-400 rounded-full mx-auto mb-4" style={{ animation: "spin .8s linear infinite" }} />
          <p className="text-white/40 text-sm" style={{ fontFamily: "'DM Sans',sans-serif" }}>Loading content…</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white"
        style={{ background: "radial-gradient(ellipse 120% 80% at 50% -10%,#1a0a3a 0%,#0d0e2e 50%,#060610 100%)" }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Sora',sans-serif" }}>
            ⚠ {error || "Content not found"}
          </h2>
          <button
            onClick={() => router.push("/content/create")}
            className="px-6 py-3 rounded-xl font-semibold cursor-pointer border-none text-white"
            style={{ background: "linear-gradient(135deg,#6C5CE7,#8b5cf6)" }}
          >
            Create new content
          </button>
        </div>
      </div>
    );
  }

  const score = seoReport?.score ?? 0;
  const sc = ringColor(score);
  const showReportColumn = reportOpen && !!seoReport;

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ fontFamily: "'Sora',sans-serif", background: "radial-gradient(ellipse 120% 80% at 50% -10%,#1a0a3a 0%,#0d0e2e 50%,#060610 100%)" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes ringPulse { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
        .fade-up { animation:fadeUp .5s ease both }
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

      <div className="relative z-[5] max-w-[1200px] mx-auto px-6 py-10 pb-20">
        <div className="text-center mb-8 fade-up">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">
            <span
              style={{
                background: "linear-gradient(135deg,#c4b5fd 0%,#818cf8 40%,#22d3ee 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {item.title || "Untitled content"}
            </span>
          </h1>
          <p className="text-white/35 text-sm capitalize" style={{ fontFamily: "'DM Sans',sans-serif" }}>
            {item.platform} · {item.status}
          </p>
        </div>

        <div
          className="grid gap-6 items-start transition-[grid-template-columns] duration-300"
          style={{ gridTemplateColumns: showReportColumn ? "minmax(0,1fr) 400px" : "minmax(0,1fr)" }}
        >
          {/* content card */}
          <div
            className="rounded-3xl overflow-hidden backdrop-blur-2xl"
            style={{
              background: "rgba(6,4,18,.9)",
              border: "1px solid rgba(108,92,231,.25)",
              boxShadow: "0 0 60px rgba(108,92,231,.10), 0 30px 60px rgba(0,0,0,.5)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-3.5 border-b flex-wrap gap-2"
              style={{ borderColor: "rgba(108,92,231,.2)", background: "rgba(108,92,231,.06)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  {["#f87171", "#fbbf24", "#4ade80"].map((c) => (
                    <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <span className="text-white/40 text-[11px] tracking-widest uppercase">{item.platform}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400" style={{ animation: "ringPulse 1.5s ease-out infinite" }} />
              </div>
              <div className="flex items-center gap-2">
                {seoReport && (
                  <button
                    onClick={() => setReportOpen((v) => !v)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide border cursor-pointer transition-all duration-200 flex items-center gap-1.5"
                    style={{
                      background: reportOpen ? "rgba(108,92,231,.22)" : "rgba(108,92,231,.08)",
                      borderColor: "rgba(108,92,231,.5)",
                      color: "#c4b5fd",
                    }}
                  >
                    <FileBarChart size={12} strokeWidth={2} />
                    {reportOpen ? "Hide report" : "SEO report"}
                  </button>
                )}
                <CopyBtn text={item.body} />
              </div>
            </div>

            <div className="px-7 py-7">
              <RichText text={item.body} />
            </div>
          </div>

          {/* SEO report card */}
          {showReportColumn && (
            <div
              className="rounded-3xl overflow-hidden backdrop-blur-2xl flex flex-col"
              style={{
                background: "rgba(6,4,18,.9)",
                border: "1px solid rgba(108,92,231,.25)",
                boxShadow: "0 0 60px rgba(108,92,231,.10), 0 30px 60px rgba(0,0,0,.5)",
                animation: "slideIn .4s cubic-bezier(.4,0,.2,1) both",
                position: "sticky",
                top: 24,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-3.5 border-b shrink-0"
                style={{ borderColor: "rgba(108,92,231,.2)", background: "rgba(108,92,231,.06)" }}
              >
                <div className="flex items-center gap-2.5">
                  <Search size={13} strokeWidth={2} color="#22d3ee" />
                  <span className="text-white/40 text-[11px] tracking-widest uppercase">SEO Report</span>
                </div>
                <button
                  onClick={() => setReportOpen(false)}
                  className="text-white/30 hover:text-white/70 cursor-pointer transition-colors"
                  aria-label="Close report"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-6 py-6 space-y-7">
                <div className="flex flex-col items-center py-1">
                  <div className="relative flex items-center justify-center" style={{ width: 108, height: 108 }}>
                    <svg className="absolute inset-0" viewBox="0 0 120 120">
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6C5CE7" />
                          <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                      </defs>
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6" />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="url(#scoreGrad)"
                        strokeWidth="6"
                        strokeDasharray={`${(score / 100) * 327} 327`}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                        style={{ filter: "drop-shadow(0 0 8px rgba(108,92,231,.5))" }}
                      />
                    </svg>
                    <div className="text-center z-10">
                      <div className="font-extrabold text-white" style={{ fontFamily: "'Sora',sans-serif", fontSize: 30, lineHeight: 1 }}>
                        {score}
                      </div>
                      <div className="text-white/25 text-[10px] mt-0.5">/100</div>
                    </div>
                  </div>
                  <p className="text-xs font-semibold mt-2" style={{ color: sc }}>
                    {seoReport.score_label || (score >= 70 ? "Ready to publish" : score >= 45 ? "Needs a pass" : "Not ready yet")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 justify-center">
                  <Chip label="Words" value={(seoReport.word_count || 0).toLocaleString()} />
                  <Chip label="Readability" value={seoReport.readability_score ?? "—"} />
                  <Chip label="Density" value={`${seoReport.keyword_density ?? 0}%`} />
                </div>

                <Section title="Keywords" color="#22d3ee">
                  <div className="flex flex-col gap-2">
                    {seoReport.primary_keyword && (
                      <KwRow
                        label="Primary"
                        color="#22d3ee"
                        term={seoReport.primary_keyword.term}
                        meta={`Vol ${seoReport.primary_keyword.search_volume?.toLocaleString() ?? "—"} · KD ${
                          seoReport.primary_keyword.keyword_difficulty ?? "—"
                        }`}
                      />
                    )}
                    {(seoReport.secondary_keywords || []).map((kw: any, i: number) => (
                      <KwRow
                        key={i}
                        label="Secondary"
                        color="#a78bfa"
                        term={kw.term}
                        meta={`Vol ${kw.search_volume?.toLocaleString() ?? "—"} · KD ${kw.keyword_difficulty ?? "—"}`}
                      />
                    ))}
                    {(seoReport.missing_keywords || []).map((kw: any, i: number) => (
                      <KwRow key={i} label="Missing" color="#f87171" term={kw.term} meta={kw.note || "Opportunity"} />
                    ))}
                  </div>
                </Section>

                {seoReport.on_page_elements?.length > 0 && (
                  <Section title="On-page" color="#a78bfa">
                    <div className="flex flex-col gap-2">
                      {seoReport.on_page_elements.map((el: any, i: number) => {
                        const ok = el.status === "good" || el.status === "pass";
                        return (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 rounded-xl px-3 py-2.5 border"
                            style={{
                              background: ok ? "rgba(52,211,153,.06)" : "rgba(251,191,36,.06)",
                              borderColor: ok ? "rgba(52,211,153,.2)" : "rgba(251,191,36,.2)",
                            }}
                          >
                            {ok ? (
                              <Check size={14} strokeWidth={2.5} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} />
                            ) : (
                              <AlertTriangle size={14} strokeWidth={2.5} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
                            )}
                            <div>
                              <p className="text-white text-[11.5px] font-semibold">{el.element}</p>
                              <p className="text-white/40 text-[10.5px] mt-0.5 leading-relaxed">{el.suggestion}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Section>
                )}

                {(seoReport.title_suggestion || seoReport.meta_description_suggestion) && (
                  <Section title="Suggested meta" color="#22d3ee">
                    <div className="flex flex-col gap-2">
                      {seoReport.title_suggestion && (
                        <MetaBlock label={`Title · ${seoReport.title_suggestion.length} chars`} text={seoReport.title_suggestion} />
                      )}
                      {seoReport.meta_description_suggestion && (
                        <MetaBlock
                          label={`Description · ${seoReport.meta_description_suggestion.length} chars`}
                          text={seoReport.meta_description_suggestion}
                        />
                      )}
                    </div>
                  </Section>
                )}

                {(seoReport.positive_points?.length > 0 || seoReport.negative_points?.length > 0) && (
                  <Section title="Notes" color="#fd79a8">
                    <div className="flex flex-col gap-2">
                      {(seoReport.positive_points || []).map((p: string, i: number) => (
                        <div key={`p${i}`} className="flex gap-2">
                          <Check size={13} strokeWidth={2.5} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} />
                          <p className="text-white/50 text-[11.5px] leading-relaxed">{p}</p>
                        </div>
                      ))}
                      {(seoReport.negative_points || []).map((p: string, i: number) => (
                        <div key={`n${i}`} className="flex gap-2">
                          <Minus size={13} strokeWidth={2.5} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />
                          <p className="text-white/50 text-[11.5px] leading-relaxed">{p}</p>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {seoReport.recommendations?.length > 0 && (
                  <Section title="Recommendations" color="#fbbf24">
                    <div className="flex flex-col gap-2">
                      {seoReport.recommendations.map((rec: any, i: number) => {
                        const c = priColor(rec.priority);
                        return (
                          <div
                            key={i}
                            className="flex gap-2.5 rounded-xl px-3 py-2.5 border"
                            style={{ background: `${c}0f`, borderColor: `${c}30` }}
                          >
                            <TrendingUp size={13} strokeWidth={2.5} color={c} style={{ flexShrink: 0, marginTop: 3 }} />
                            <div>
                              <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: c }}>
                                {rec.priority}
                              </span>
                              <p className="text-white/70 text-[11.5px] leading-relaxed mt-0.5">{rec.title || rec.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Section>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}