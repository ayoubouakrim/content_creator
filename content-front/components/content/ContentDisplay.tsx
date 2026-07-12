"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  FileBarChart,
  Camera,
  X,
  Share2,
  AtSign,
  Pin,
  Play,
  PenLine,
  Radio,
  ShoppingBag,
  Music2,
} from "lucide-react";

/* ══ PARSERS (unchanged logic) ══ */
function parseBlog(text: string) {
  const titleMatch = text.match(/TITLE:\s*(.+)/i);
  const title = titleMatch ? titleMatch[1].trim() : "Untitled";
  const body = text.replace(/TITLE:\s*.+/i, "").trim();
  return { title, body };
}
function parseYoutube(text: string) {
  const titles: string[] = [];
  [1, 2, 3].forEach((n) => {
    const m = text.match(new RegExp(`TITLE_${n}:\\s*(.+)`, "i"));
    if (m) titles.push(m[1].trim());
  });
  const descMatch = text.match(/DESCRIPTION:\s*([\s\S]*?)(?=TAGS:|$)/i);
  const tagsMatch = text.match(/TAGS:\s*(.+)/i);
  return {
    titles: titles.length ? titles : ["Your video title"],
    description: descMatch ? descMatch[1].trim() : text,
    tags: tagsMatch ? tagsMatch[1].split(",").map((t) => t.trim()) : [],
  };
}
function parseTiktok(text: string) {
  const hookMatch = text.match(/HOOK:\s*([\s\S]*?)(?=CAPTION:|$)/i);
  const captionMatch = text.match(/CAPTION:\s*([\s\S]*?)(?=HASHTAGS:|$)/i);
  const hashtagsMatch = text.match(/HASHTAGS:\s*([\s\S]*?)(?=SCRIPT IDEA:|$)/i);
  const scriptMatch = text.match(/SCRIPT IDEA:\s*([\s\S]*?)$/i);
  return {
    hook: hookMatch ? hookMatch[1].trim() : "",
    caption: captionMatch ? captionMatch[1].trim() : text,
    hashtags: hashtagsMatch ? hashtagsMatch[1].trim() : "",
    script: scriptMatch ? scriptMatch[1].trim() : "",
  };
}
function parseProduct(text: string) {
  const headlineMatch = text.match(/HEADLINE:\s*(.+)/i);
  const ctaMatch = text.match(/CTA:\s*(.+)/i);
  const headline = headlineMatch ? headlineMatch[1].trim() : "";
  const cta = ctaMatch ? ctaMatch[1].trim() : "";
  const body = text.replace(/HEADLINE:\s*.+/i, "").replace(/CTA:\s*.+/i, "").trim();
  return { headline, body, cta };
}

/* ══ META — icon + brand color, matching POST_TYPES / PLATFORMS in ContentStudio ══ */
const PLATFORM_META: Record<string, { icon: any; label: string; color: string }> = {
  instagram: { icon: Camera, label: "Instagram", color: "#e1306c" },
  twitter: { icon: X, label: "X / Twitter", color: "#1d9bf0" },
  linkedin: { icon: Share2, label: "LinkedIn", color: "#0a66c2" },
  facebook: { icon: FileBarChart, label: "Facebook", color: "#1877f2" },
  threads: { icon: AtSign, label: "Threads", color: "#a78bfa" },
  pinterest: { icon: Pin, label: "Pinterest", color: "#e60023" },
};
const TYPE_META: Record<string, { icon: any; label: string; color: string }> = {
  blog: { icon: PenLine, label: "Blog Post", color: "#a78bfa" },
  social: { icon: Radio, label: "Social Media", color: "#fd79a8" },
  product: { icon: ShoppingBag, label: "Product Drop", color: "#fbbf24" },
  youtube: { icon: Play, label: "YouTube", color: "#f87171" },
  tiktok: { icon: Music2, label: "TikTok", color: "#34d399" },
};

/* ══ RICH TEXT (same rendering rules as the generation modal) ══ */
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

/* ══ COPY BTN ══ */
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

/* ══ MAIN ══ */
export default function ContentDisplay({
  content,
  activeIndex = 0,
  reportOpen,
  onToggleReport,
}: {
  content: any;
  activeIndex?: number;
  reportOpen: boolean;
  onToggleReport: () => void;
}) {
  const { postType, posts = [] } = content;
  const activePost = posts[activeIndex] || posts[0];
  const text = activePost?.content || "";
  const hasReport = !!activePost?.seo_report;

  const typeMeta = TYPE_META[postType] ?? { icon: PenLine, label: postType, color: "#a78bfa" };
  const platformMeta = postType === "social" && activePost ? PLATFORM_META[activePost.platform] : null;
  const Icon = platformMeta?.icon ?? typeMeta.icon;
  const label = platformMeta?.label ?? typeMeta.label;
  const accent = platformMeta?.color ?? typeMeta.color;

  const blog = postType === "blog" ? parseBlog(text) : null;
  const yt = postType === "youtube" ? parseYoutube(text) : null;
  const [ytSelected, setYtSelected] = useState(0);
  const tk = postType === "tiktok" ? parseTiktok(text) : null;
  const pr = postType === "product" ? parseProduct(text) : null;

  return (
    <div
      className="rounded-3xl overflow-hidden backdrop-blur-2xl"
      style={{
        background: "rgba(6,4,18,.9)",
        border: "1px solid rgba(108,92,231,.25)",
        boxShadow: "0 0 60px rgba(108,92,231,.10), 0 30px 60px rgba(0,0,0,.5)",
      }}
    >
      {/* chrome bar — same language as the generation terminal */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b"
        style={{ borderColor: "rgba(108,92,231,.2)", background: "rgba(108,92,231,.06)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            {["#f87171", "#fbbf24", "#4ade80"].map((c) => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <Icon size={13} strokeWidth={2} color={accent} />
          <span className="text-white/40 text-[11px] tracking-widest uppercase">{label}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-teal-400" style={{ animation: "ringPulse 1.5s ease-out infinite" }} />
        </div>
        <div className="flex items-center gap-2">
          {hasReport && (
            <button
              onClick={onToggleReport}
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
          <CopyBtn text={text} />
        </div>
      </div>

      {/* body */}
      <div className="px-7 py-7">
        {postType === "blog" && blog && (
          <>
            <h1 className="text-white font-extrabold text-2xl leading-tight mb-4" style={{ fontFamily: "'Sora',sans-serif" }}>
              {blog.title}
            </h1>
            <RichText text={blog.body} />
          </>
        )}

        {postType === "social" && <RichText text={text} />}

        {postType === "youtube" && yt && (
          <>
            <p className="text-white/25 text-[10px] tracking-widest uppercase mb-2">Title options</p>
            <div className="mb-5">
              {yt.titles.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setYtSelected(i)}
                  className="block w-full text-left rounded-xl px-3 py-2.5 mb-1.5 border cursor-pointer transition-all"
                  style={{
                    background: ytSelected === i ? "rgba(248,113,113,.1)" : "rgba(255,255,255,.02)",
                    borderColor: ytSelected === i ? "rgba(248,113,113,.4)" : "rgba(255,255,255,.06)",
                  }}
                >
                  <span className="text-white font-semibold text-[13px]">{t}</span>
                </button>
              ))}
            </div>
            <p className="text-white/25 text-[10px] tracking-widest uppercase mb-2">Description</p>
            <RichText text={yt.description} />
            {yt.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {yt.tags.map((tag, i) => (
                  <span key={i} className="text-[10.5px] px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        {postType === "tiktok" && tk && (
          <>
            {tk.hook && (
              <div className="mb-4">
                <p className="text-[10px] tracking-widest uppercase mb-1.5" style={{ color: "#34d399" }}>
                  3-second hook
                </p>
                <p className="text-white font-bold text-base leading-snug" style={{ fontFamily: "'Sora',sans-serif" }}>
                  {tk.hook}
                </p>
              </div>
            )}
            <RichText text={tk.caption} />
            {tk.hashtags && <p className="text-teal-300/70 text-[11.5px] mt-2">{tk.hashtags}</p>}
            {tk.script && (
              <div className="mt-5 pt-4 border-t border-white/8">
                <p className="text-white/25 text-[10px] tracking-widest uppercase mb-2">Script idea</p>
                <RichText text={tk.script} />
              </div>
            )}
          </>
        )}

        {postType === "product" && pr && (
          <>
            {pr.headline && (
              <h1 className="text-white font-extrabold text-xl mb-4" style={{ fontFamily: "'Sora',sans-serif" }}>
                {pr.headline}
              </h1>
            )}
            <RichText text={pr.body} />
            {pr.cta && (
              <button
                className="mt-5 px-5 py-3 rounded-xl font-bold text-sm text-black cursor-pointer border-none"
                style={{ background: "linear-gradient(135deg,#fbbf24,#f59e0b)", fontFamily: "'Sora',sans-serif" }}
              >
                {pr.cta}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}