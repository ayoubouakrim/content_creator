"use client";

import { useState } from "react";

/* ══ SEO REPORT CARD ════════════════════════════════════════════ */
export default function SEOReportCard({ report }: { report: any }) {
  if (!report) return null;

  const score = report.score || 0;
  const scoreColor =
    score >= 70 ? "#60d080" : score >= 45 ? "#f0a040" : "#ff5f5f";

  const wcColor =
    report.word_count_status === "good"
      ? "#60d080"
      : report.word_count_status === "too_short"
      ? "#f0a040"
      : "#ff5f5f";

  const dotColor = (s: string) =>
    s === "good" ? "#60d080" : s === "needs_work" ? "#f0a040" : "#ff5f5f";

  const dotBg = (s: string) =>
    s === "good"
      ? "rgba(96,208,128,.12)"
      : s === "needs_work"
      ? "rgba(240,160,64,.12)"
      : "rgba(255,95,95,.12)";

  const priBg = (p: string) =>
    p === "HIGH"
      ? "rgba(255,95,95,.12)"
      : p === "MED"
      ? "rgba(240,160,64,.12)"
      : "rgba(96,208,128,.12)";

  const priColor = (p: string) =>
    p === "HIGH" ? "#ff5f5f" : p === "MED" ? "#f0a040" : "#60d080";

  const barColor = (pct: number, invert = false) => {
    const good = invert ? pct <= 15 : pct >= 65;
    const mid = invert ? pct <= 25 : pct >= 40;
    return good ? "#60d080" : mid ? "#f0a040" : "#ff5f5f";
  };

  const read = report.readability_score ? {
    flesch_score: report.readability_score,
    avg_sentence_words: report.readability_metrics?.find((m: any) => m.metric_name === "Sentence length")?.value?.match(/\d+/)?.[0] || 0,
    passive_voice_pct: report.readability_metrics?.find((m: any) => m.metric_name === "Passive voice")?.value?.match(/\d+/)?.[0] || 0,
    transition_words_pct: report.readability_metrics?.find((m: any) => m.metric_name === "Transition words")?.value?.match(/\d+/)?.[0] || 0,
    tone: report.readability_metrics?.find((m: any) => m.metric_name === "Tone")?.value || "Neutral",
  } : {};

  const primary = report.primary_keyword ? {
    term: report.primary_keyword.term,
    count: report.primary_keyword.usage_count,
    density_pct: report.primary_keyword.note ? parseFloat(report.primary_keyword.note.match(/\d+\.?\d*/)?.[0] || "0") : 0,
    in_title: true,
    in_first_100_words: true,
  } : null;

  return (
    <div
      className="rounded-2xl border overflow-hidden sticky top-6 flex flex-col"
      style={{
        background: "rgba(10,10,10,0.95)",
        borderColor: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── HEADER ── */}
      <div
        className="flex items-center gap-3 px-5 py-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#c8f060",
            display: "inline-block",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          SEO Report
        </span>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="overflow-y-auto flex-1 p-5 space-y-5">

        {/* POST TITLE + META */}
        {report.post_title && (
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#e8e8e4", lineHeight: 1.3, marginBottom: 4 }}>
              {report.post_title}
            </p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
              {report.niche}
              {report.format && ` · ${report.format}`}
            </p>
          </div>
        )}

        {/* ── SCORE CIRCLE ── */}
        <div className="flex flex-col items-center py-2">
          <div className="relative flex items-center justify-center" style={{ width: 110, height: 110, marginBottom: 10 }}>
            <svg className="absolute inset-0" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke={scoreColor}
                strokeWidth="5"
                strokeDasharray={`${(score / 100) * 327} 327`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
            </svg>
            <div className="text-center z-10">
              <div style={{ fontSize: 30, fontWeight: 700, color: scoreColor, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
                {score}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>/100</div>
            </div>
          </div>
          <p style={{ fontSize: 11, fontWeight: 600, color: scoreColor }}>
            {report.score_label || (score >= 70 ? "Good" : score >= 45 ? "Needs work" : "Poor SEO")}
          </p>
        </div>

        {/* ── SCORE GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {/* Word Count */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
            <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Words</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: wcColor, fontFamily: "'DM Mono', monospace" }}>
              {(report.word_count || 0).toLocaleString()}
            </p>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
              {report.word_count_status === "good" ? "Good length" : report.word_count_status === "too_short" ? "Too short" : "Too long"}
            </p>
          </div>

          {/* Flesch */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
            <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Readability</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: report.readability_score >= 70 ? "#60d080" : report.readability_score >= 45 ? "#f0a040" : "#ff5f5f", fontFamily: "'DM Mono', monospace" }}>
              {report.readability_score ?? "—"}
            </p>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Flesch score</p>
          </div>

          {/* KW Density */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
            <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>KW density</p>
            <p style={{ fontSize: 18, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: (primary?.density_pct ?? 0) >= 0.5 && (primary?.density_pct ?? 0) <= 2.5 ? "#60d080" : "#f0a040" }}>
              {primary?.density_pct ?? 0}%
            </p>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              "{primary?.term ?? "—"}"
            </p>
          </div>

          {/* Tone */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
            <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Tone</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#e8e8e4", marginTop: 4, textTransform: "capitalize" }}>
              {read.tone ?? "—"}
            </p>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
              ~{read.avg_sentence_words ?? "?"} words/sentence
            </p>
          </div>
        </div>

        {/* ── KEYWORDS ── */}
        <div>
          <SectionHeader>Keywords</SectionHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {report.primary_keyword && (
              <KwCard
                badge="Primary"
                badgeColor="#60a8f0"
                term={report.primary_keyword.term}
                meta={`Vol: ${report.primary_keyword.search_volume?.toLocaleString() || "—"} · KD: ${report.primary_keyword.keyword_difficulty ?? "—"}`}
              />
            )}
            {(report.secondary_keywords || []).map((kw: any, i: number) => (
              <KwCard
                key={i}
                badge="Secondary"
                badgeColor="#60d080"
                term={kw.term}
                meta={`Vol: ${kw.search_volume?.toLocaleString() || "—"} · KD: ${kw.keyword_difficulty ?? "—"}`}
              />
            ))}
            {(report.missing_keywords || []).map((kw: any, i: number) => (
              <KwCard
                key={i}
                badge="Missing"
                badgeColor="#ff5f5f"
                term={kw.term}
                meta={kw.note || "Opportunity"}
              />
            ))}
          </div>
        </div>

        {/* ── READABILITY BARS ── */}
        {report.readability_metrics && report.readability_metrics.length > 0 && (
          <div>
            <SectionHeader>Readability</SectionHeader>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
              <Bar label="Flesch score" value={`${report.readability_score}`} pct={report.readability_score} color={barColor(report.readability_score || 0)} />
              {report.readability_metrics.map((metric: any, i: number) => {
                const val = metric.value ? String(metric.value).match(/\d+/)?.[0] : "0";
                return <Bar key={i} label={metric.metric_name} value={`${metric.value}`} pct={parseInt(val || "0") || 0} color={barColor(parseInt(val || "0") || 0)} />;
              })}
            </div>
          </div>
        )}

        {/* ── ON-PAGE ELEMENTS ── */}
        {report.on_page_elements && report.on_page_elements.length > 0 && (
          <div>
            <SectionHeader>On-page elements</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {report.on_page_elements.map((el: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    background: dotBg(el.status),
                    border: `1px solid ${dotColor(el.status)}22`,
                    borderRadius: 8,
                    padding: "9px 12px",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor(el.status), flexShrink: 0, marginTop: 5 }} />
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#e8e8e4" }}>{el.element}</p>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 2, lineHeight: 1.5 }}>{el.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── META SUGGESTION ── */}
        {(report.title_suggestion || report.meta_description_suggestion) && (
          <div>
            <SectionHeader>Suggested meta</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {report.title_suggestion && (
                <div style={{ background: "rgba(96,168,240,0.07)", border: "1px solid rgba(96,168,240,0.2)", borderRadius: 8, padding: "10px 12px" }}>
                  <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#60a8f0", marginBottom: 5 }}>
                    Title tag · {report.title_suggestion.length} chars
                  </p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{report.title_suggestion}</p>
                </div>
              )}
              {report.meta_description_suggestion && (
                <div style={{ background: "rgba(96,168,240,0.07)", border: "1px solid rgba(96,168,240,0.2)", borderRadius: 8, padding: "10px 12px" }}>
                  <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#60a8f0", marginBottom: 5 }}>
                    Meta description · {report.meta_description_suggestion.length} chars
                  </p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{report.meta_description_suggestion}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STRENGTHS / WEAKNESSES ── */}
        {(report.positive_points?.length > 0 || report.negative_points?.length > 0) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <div style={{ background: "rgba(96,208,128,0.05)", border: "1px solid rgba(96,208,128,0.15)", borderRadius: 10, padding: "10px 12px" }}>
              <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#60d080", marginBottom: 8 }}>Strengths</p>
              {(report.positive_points || []).map((p: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                  <span style={{ color: "#60d080", fontSize: 9, marginTop: 2, flexShrink: 0 }}>✓</span>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{p}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,95,95,0.05)", border: "1px solid rgba(255,95,95,0.15)", borderRadius: 10, padding: "10px 12px" }}>
              <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#ff5f5f", marginBottom: 8 }}>Weaknesses</p>
              {(report.negative_points || []).map((p: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                  <span style={{ color: "#ff5f5f", fontSize: 9, marginTop: 2, flexShrink: 0 }}>✗</span>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{p}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RECOMMENDATIONS ── */}
        {report.recommendations && report.recommendations.length > 0 && (
          <div>
            <SectionHeader>Recommendations</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {report.recommendations.map((rec: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    background: priBg(rec.priority),
                    border: `1px solid ${priColor(rec.priority)}22`,
                    borderRadius: 8,
                    padding: "9px 12px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{
                    fontSize: 9, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    padding: "2px 6px", borderRadius: 4, flexShrink: 0,
                    background: `${priColor(rec.priority)}22`,
                    color: priColor(rec.priority),
                    marginTop: 1,
                  }}>
                    {rec.priority}
                  </span>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{rec.title || rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}

/* ── SUB-COMPONENTS ── */

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 9, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.1em",
      color: "rgba(255,255,255,0.3)",
      marginBottom: 8,
      paddingBottom: 6,
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      {children}
    </p>
  );
}

function KwCard({ badge, badgeColor, term, meta, flags }: {
  badge: string; badgeColor: string; term: string; meta: string; flags?: string[];
}) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 8, padding: "9px 12px",
    }}>
      <span style={{
        display: "inline-block", fontSize: 9, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.06em",
        background: `${badgeColor}18`, color: badgeColor,
        padding: "2px 7px", borderRadius: 4, marginBottom: 5,
      }}>
        {badge}
      </span>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#e8e8e4", marginBottom: 3 }}>{term}</p>
      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace" }}>{meta}</p>
      {flags && (
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {flags.map((f, i) => (
            <span key={i} style={{ fontSize: 9, color: f.startsWith("✓") ? "#60d080" : "#ff5f5f" }}>{f}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function Bar({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 4 }}>
        <span style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
        <span style={{ color: "#e8e8e4", fontFamily: "'DM Mono', monospace", fontSize: 10 }}>{value}</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 3, height: 3, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}
