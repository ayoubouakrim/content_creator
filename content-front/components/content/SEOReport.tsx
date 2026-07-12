"use client";

import {
  X,
  Check,
  AlertTriangle,
  Minus,
  TrendingUp,
  Search,
} from "lucide-react";

/* ══ THEME (matches ContentStudio) ══
   violet #6C5CE7 / #8b5cf6 / #a78bfa
   cyan   #22d3ee
   amber  #fbbf24 / #f59e0b
   green  #34d399 / #4ade80
   red    #f87171
   display: 'Sora'   |   ui/body: 'DM Sans'
*/

function ringColor(score: number) {
  if (score >= 70) return "#34d399";
  if (score >= 45) return "#fbbf24";
  return "#f87171";
}

function priColor(p: string) {
  return p === "HIGH" ? "#f87171" : p === "MED" ? "#fbbf24" : "#34d399";
}

export default function SEOReportCard({
  report,
  onClose,
}: {
  report: any;
  onClose: () => void;
}) {
  if (!report) return null;
  const score = report.score || 0;
  const sc = ringColor(score);

  const primary = report.primary_keyword
    ? {
        term: report.primary_keyword.term,
        density_pct: report.primary_keyword.note
          ? parseFloat(report.primary_keyword.note.match(/\d+\.?\d*/)?.[0] || "0")
          : 0,
      }
    : null;

  return (
    <div
      className="rounded-3xl overflow-hidden backdrop-blur-2xl flex flex-col"
      style={{
        background: "rgba(6,4,18,.9)",
        border: "1px solid rgba(108,92,231,.25)",
        boxShadow: "0 0 60px rgba(108,92,231,.10), 0 30px 60px rgba(0,0,0,.5)",
        animation: "slideIn .4s cubic-bezier(.4,0,.2,1) both",
        maxHeight: "calc(100vh - 0px)",
        position: "sticky",
        top: 24,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* chrome bar — matches the transmission terminal header */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b shrink-0"
        style={{ borderColor: "rgba(108,92,231,.2)", background: "rgba(108,92,231,.06)" }}
      >
        <div className="flex items-center gap-2.5">
          <Search size={13} strokeWidth={2} color="#22d3ee" />
          <span className="text-white/40 text-[11px] tracking-widest uppercase">SEO Report</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/30 hover:text-white/70 cursor-pointer transition-colors"
          aria-label="Close report"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 px-6 py-6 space-y-7">
        {/* score ring — gradient stroke, consistent with the app's glow language */}
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
            {report.score_label || (score >= 70 ? "Ready to publish" : score >= 45 ? "Needs a pass" : "Not ready yet")}
          </p>
        </div>

        {/* stat chips — same pill language as the summary tags on the create page */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          <Chip label="Words" value={(report.word_count || 0).toLocaleString()} />
          <Chip label="Readability" value={report.readability_score ?? "—"} />
          <Chip label="Density" value={`${primary?.density_pct ?? 0}%`} />
        </div>

        {/* keywords */}
        <Section title="Keywords" color="#22d3ee">
          <div className="flex flex-col gap-2">
            {report.primary_keyword && (
              <KwRow
                label="Primary"
                color="#22d3ee"
                term={report.primary_keyword.term}
                meta={`Vol ${report.primary_keyword.search_volume?.toLocaleString() ?? "—"} · KD ${
                  report.primary_keyword.keyword_difficulty ?? "—"
                }`}
              />
            )}
            {(report.secondary_keywords || []).map((kw: any, i: number) => (
              <KwRow
                key={i}
                label="Secondary"
                color="#a78bfa"
                term={kw.term}
                meta={`Vol ${kw.search_volume?.toLocaleString() ?? "—"} · KD ${kw.keyword_difficulty ?? "—"}`}
              />
            ))}
            {(report.missing_keywords || []).map((kw: any, i: number) => (
              <KwRow key={i} label="Missing" color="#f87171" term={kw.term} meta={kw.note || "Opportunity"} />
            ))}
          </div>
        </Section>

        {/* on-page checklist */}
        {report.on_page_elements?.length > 0 && (
          <Section title="On-page" color="#a78bfa">
            <div className="flex flex-col gap-2">
              {report.on_page_elements.map((el: any, i: number) => {
                const ok = el.status === "good";
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

        {/* suggested meta */}
        {(report.title_suggestion || report.meta_description_suggestion) && (
          <Section title="Suggested meta" color="#22d3ee">
            <div className="flex flex-col gap-2">
              {report.title_suggestion && (
                <MetaBlock label={`Title · ${report.title_suggestion.length} chars`} text={report.title_suggestion} />
              )}
              {report.meta_description_suggestion && (
                <MetaBlock
                  label={`Description · ${report.meta_description_suggestion.length} chars`}
                  text={report.meta_description_suggestion}
                />
              )}
            </div>
          </Section>
        )}

        {/* strengths / weaknesses */}
        {(report.positive_points?.length > 0 || report.negative_points?.length > 0) && (
          <Section title="Notes" color="#fd79a8">
            <div className="flex flex-col gap-2">
              {(report.positive_points || []).map((p: string, i: number) => (
                <div key={`p${i}`} className="flex gap-2">
                  <Check size={13} strokeWidth={2.5} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p className="text-white/50 text-[11.5px] leading-relaxed">{p}</p>
                </div>
              ))}
              {(report.negative_points || []).map((p: string, i: number) => (
                <div key={`n${i}`} className="flex gap-2">
                  <Minus size={13} strokeWidth={2.5} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p className="text-white/50 text-[11.5px] leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* recommendations */}
        {report.recommendations?.length > 0 && (
          <Section title="Recommendations" color="#fbbf24">
            <div className="flex flex-col gap-2">
              {report.recommendations.map((rec: any, i: number) => {
                const c = priColor(rec.priority);
                return (
                  <div
                    key={i}
                    className="flex gap-2.5 rounded-xl px-3 py-2.5 border"
                    style={{ background: `${c}0f`, borderColor: `${c}30` }}
                  >
                    <TrendingUp size={13} strokeWidth={2.5} color={c} style={{ flexShrink: 0, marginTop: 3 }} />
                    <div>
                      <span
                        className="text-[9px] font-bold tracking-widest uppercase"
                        style={{ color: c }}
                      >
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
  );
}

/* ── SUB-COMPONENTS ── */

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