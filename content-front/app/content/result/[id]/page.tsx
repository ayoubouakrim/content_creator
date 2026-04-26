"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

/* ══ PLATFORM DATA ═════════════════════════════════════════════ */
const PLATFORM_META = {
  instagram: { color:"#e1306c", bg:"#1a0010", label:"Instagram",  handle:"@yourcreator" },
  twitter:   { color:"#1d9bf0", bg:"#00101a", label:"X / Twitter", handle:"@yourcreator" },
  linkedin:  { color:"#0a66c2", bg:"#000d1a", label:"LinkedIn",    handle:"Your Name" },
  facebook:  { color:"#1877f2", bg:"#00091a", label:"Facebook",    handle:"Your Page" },
  threads:   { color:"#a78bfa", bg:"#0d0018", label:"Threads",     handle:"@yourcreator" },
  pinterest: { color:"#e60023", bg:"#1a0003", label:"Pinterest",   handle:"Your Board" },
};

/* ══ PARSE HELPERS ═════════════════════════════════════════════ */
function parseSocialPosts(text: string, platforms: string[]) {
  const posts: Record<string, string> = {};
  const blocks = text.split("---").map((b: string) => b.trim()).filter(Boolean);
  blocks.forEach((block: string) => {
    const platformLine = block.match(/^PLATFORM:\s*(.+)/im);
    if (platformLine) {
      const name = platformLine[1].trim().toLowerCase();
      const content = block.replace(/^PLATFORM:\s*.+/im, "").trim();
      const matched = platforms.find((p: string) =>
        name.includes(p) || p.includes(name.split(" ")[0])
      );
      if (matched) posts[matched] = content;
    }
  });
  // fallback: if parsing fails, assign same text to all
  if (Object.keys(posts).length === 0) {
    platforms.forEach((p: string) => { posts[p] = text; });
  }
  return posts;
}

function parseBlog(text: string) {
  const titleMatch = text.match(/TITLE:\s*(.+)/i);
  const title = titleMatch ? titleMatch[1].trim() : "Untitled";
  const body = text.replace(/TITLE:\s*.+/i, "").trim();
  return { title, body };
}

function parseYoutube(text: string) {
  const titles: string[] = [];
  [1,2,3].forEach((n: number) => {
    const m = text.match(new RegExp(`TITLE_${n}:\\s*(.+)`, "i"));
    if (m) titles.push(m[1].trim());
  });
  const descMatch = text.match(/DESCRIPTION:\s*([\s\S]*?)(?=TAGS:|$)/i);
  const tagsMatch = text.match(/TAGS:\s*(.+)/i);
  return {
    titles: titles.length ? titles : ["Your Video Title"],
    description: descMatch ? descMatch[1].trim() : text,
    tags: tagsMatch ? tagsMatch[1].split(",").map((t: string)=>t.trim()) : [],
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
  const body = text
    .replace(/HEADLINE:\s*.+/i, "")
    .replace(/CTA:\s*.+/i, "")
    .trim();
  return { headline, body, cta };
}

/* ══ COPY BUTTON ═══════════════════════════════════════════════ */
function CopyBtn({ text, light = false }: { text?: string; light?: boolean }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={()=>{if(text)navigator.clipboard.writeText(text);setOk(true);setTimeout(()=>setOk(false),2000);}}
      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border cursor-pointer transition-all duration-200 ${
        ok
          ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
          : light
            ? "bg-black/10 border-black/20 text-black/50 hover:bg-black/20"
            : "bg-white/8 border-white/15 text-white/50 hover:bg-white/15 hover:text-white/80"
      }`}
      style={{ fontFamily:"'DM Sans',sans-serif" }}>
      {ok ? "✓ Copied" : "⎘ Copy"}
    </button>
  );
}

/* ══ BLOG RENDERER ═════════════════════════════════════════════ */
function BlogCard({ text }: { text: string }) {
  const { title, body } = parseBlog(text);
  const lines = body.split("\n");
  return (
    <div className="max-w-[720px] mx-auto">
      {/* Medium-style header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background:"linear-gradient(135deg,#6C5CE7,#a78bfa)" }}>C</div>
        <div>
          <p className="text-white/80 font-semibold text-sm" style={{ fontFamily:"'DM Sans',sans-serif" }}>Your Creator</p>
          <p className="text-white/30 text-xs" style={{ fontFamily:"'DM Sans',sans-serif" }}>Published just now · 5 min read</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-violet-500/20 border border-violet-400/30 text-violet-300 cursor-pointer transition-all hover:bg-violet-500/30"
            style={{ fontFamily:"'DM Sans',sans-serif" }}>Follow</button>
          <CopyBtn text={text}/>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-white font-extrabold text-3xl leading-tight tracking-tight mb-4"
        style={{ fontFamily:"'Sora',sans-serif" }}>{title}</h1>

      {/* Subtitle bar */}
      <div className="flex items-center gap-4 pb-6 mb-6 border-b border-white/10">
        <span className="text-white/30 text-xs" style={{ fontFamily:"'DM Sans',sans-serif" }}>Content Studio · AI-Generated</span>
        <div className="flex gap-1.5 ml-auto">
          {["♡ Like","💬 Comment","🔖 Save"].map(a=>(
            <button key={a} className="text-xs text-white/30 bg-white/5 border border-white/8 rounded-full px-3 py-1 hover:text-white/60 cursor-pointer transition-colors"
              style={{ fontFamily:"'DM Sans',sans-serif" }}>{a}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="prose prose-invert max-w-none">
        {lines.map((line: string, i: number) => {
          if (line.startsWith("## "))
            return <h2 key={i} className="text-white font-bold text-xl mt-8 mb-3 tracking-tight" style={{ fontFamily:"'Sora',sans-serif" }}>{line.slice(3)}</h2>;
          if (line.startsWith("# "))
            return <h1 key={i} className="text-white font-extrabold text-2xl mt-8 mb-3" style={{ fontFamily:"'Sora',sans-serif" }}>{line.slice(2)}</h1>;
          if (line.startsWith("- ") || line.startsWith("• "))
            return <div key={i} className="flex gap-3 my-2"><span className="text-violet-400 mt-1">•</span><span className="text-white/70 text-sm leading-relaxed" style={{ fontFamily:"'DM Sans',sans-serif" }}>{line.slice(2)}</span></div>;
          if (line === "") return <div key={i} className="h-4"/>;
          return <p key={i} className="text-white/65 text-sm leading-loose mb-2" style={{ fontFamily:"'DM Sans',sans-serif" }}>{line}</p>;
        })}
      </div>

      {/* Footer claps row */}
      <div className="flex items-center gap-4 mt-10 pt-6 border-t border-white/10">
        <button className="flex items-center gap-2 text-white/40 text-sm hover:text-white/70 cursor-pointer transition-colors bg-transparent border-none" style={{ fontFamily:"'DM Sans',sans-serif" }}>
          <span className="text-lg">👏</span> Clap
        </button>
        <button className="flex items-center gap-2 text-white/40 text-sm hover:text-white/70 cursor-pointer transition-colors bg-transparent border-none" style={{ fontFamily:"'DM Sans',sans-serif" }}>
          <span className="text-lg">💬</span> Respond
        </button>
        <button className="flex items-center gap-2 text-white/40 text-sm hover:text-white/70 cursor-pointer transition-colors bg-transparent border-none" style={{ fontFamily:"'DM Sans',sans-serif" }}>
          <span className="text-lg">🔗</span> Share
        </button>
      </div>
    </div>
  );
}

/* ══ INSTAGRAM CARD ════════════════════════════════════════════ */
function InstagramCard({ content }: { content: string }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const lines = content.split("\n");
  const caption = lines.filter((l: string) => !l.startsWith("#")).join(" ").trim();
  const hashtags = lines.filter((l: string) => l.includes("#")).join(" ");

  return (
    <div className="w-full max-w-[400px] mx-auto rounded-2xl overflow-hidden border border-white/10"
      style={{ background:"#0a0a0a", fontFamily:"'DM Sans',sans-serif" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
        <div className="w-8 h-8 rounded-full p-[2px]" style={{ background:"linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)" }}>
          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-xs font-bold text-white">C</div>
        </div>
        <div className="flex-1">
          <p className="text-white text-xs font-bold">yourcreator</p>
          <p className="text-white/40 text-[10px]">Sponsored</p>
        </div>
        <span className="text-white/40 text-lg cursor-pointer">···</span>
      </div>

      {/* Image placeholder */}
      <div className="w-full aspect-square flex items-center justify-center relative overflow-hidden"
        style={{ background:"linear-gradient(135deg,#1a0030,#0d001a,#00101a)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage:"radial-gradient(circle at 30% 70%,#e1306c,transparent 50%),radial-gradient(circle at 70% 30%,#833ab4,transparent 50%)" }}/>
        <div className="text-center z-10">
          <p className="text-6xl mb-3">📸</p>
          <p className="text-white/30 text-xs">Your image here</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={()=>setLiked(v=>!v)} className="text-2xl bg-transparent border-none cursor-pointer transition-transform hover:scale-110 active:scale-90">
            {liked ? "❤️" : "🤍"}
          </button>
          <span className="text-xl cursor-pointer">💬</span>
          <span className="text-xl cursor-pointer">↗</span>
          <button onClick={()=>setSaved(v=>!v)} className="ml-auto text-xl bg-transparent border-none cursor-pointer">
            {saved ? "🔖" : "🏷️"}
          </button>
        </div>
        <p className="text-white text-xs font-bold mb-1">{liked?"1,234":"1,233"} likes</p>
        <div className="text-xs text-white/80 leading-relaxed mb-1">
          <span className="font-bold text-white">yourcreator </span>{caption.slice(0,120)}{caption.length>120?"…":""}
        </div>
        {hashtags && <p className="text-[#e1306c] text-xs">{hashtags.slice(0,80)}</p>}
        <p className="text-white/25 text-[10px] mt-2 uppercase tracking-wide">2 minutes ago</p>
      </div>

      <div className="px-4 pb-3 flex justify-end">
        <CopyBtn text={content}/>
      </div>
    </div>
  );
}

/* ══ TWITTER CARD ══════════════════════════════════════════════ */
function TwitterCard({ content }: { content: string }) {
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  return (
    <div className="w-full max-w-[520px] mx-auto rounded-2xl border border-white/10 overflow-hidden"
      style={{ background:"#000", fontFamily:"'DM Sans',sans-serif" }}>
      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center text-sm font-bold text-white shrink-0">C</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-bold text-sm">Your Creator</span>
              <span className="text-white/40 text-xs">@yourcreator · now</span>
              <div className="ml-auto w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] font-black">𝕏</span>
              </div>
            </div>
            <p className="text-white/85 text-sm leading-relaxed whitespace-pre-line">{content}</p>
          </div>
        </div>
      </div>

      {/* Engagement */}
      <div className="px-4 py-3 border-t border-white/8">
        <div className="flex gap-6">
          {[
            { icon:"💬", val:"24", label:"Reply" },
            { icon:retweeted?"🔁":"↩", val:retweeted?"1.2K":"1.1K", label:"Repost", fn:()=>setRetweeted(v=>!v), active:retweeted, activeColor:"#00b894" },
            { icon:liked?"❤️":"🤍", val:liked?"4.6K":"4.5K", label:"Like", fn:()=>setLiked(v=>!v), active:liked, activeColor:"#e1306c" },
            { icon:"📊", val:"18K", label:"Views" },
          ].map(a=>(
            <button key={a.label} onClick={a.fn}
              className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-xs transition-colors group"
              style={{ color:a.active?a.activeColor:"rgba(255,255,255,.4)" }}>
              <span className="text-base group-hover:scale-110 transition-transform inline-block">{a.icon}</span>
              <span>{a.val}</span>
            </button>
          ))}
          <div className="ml-auto">
            <CopyBtn text={content}/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ LINKEDIN CARD ═════════════════════════════════════════════ */
function LinkedInCard({ content }: { content: string }) {
  const [reacted, setReacted] = useState(false);
  return (
    <div className="w-full max-w-[560px] mx-auto rounded-2xl border border-white/10 overflow-hidden"
      style={{ background:"#1b1f23", fontFamily:"'DM Sans',sans-serif" }}>
      <div className="p-4">
        <div className="flex gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-sky-700 flex items-center justify-center text-base font-bold text-white shrink-0">C</div>
          <div>
            <p className="text-white font-semibold text-sm">Your Creator</p>
            <p className="text-white/40 text-xs">Content Creator • 2nd</p>
            <p className="text-white/25 text-[10px]">Just now · 🌐</p>
          </div>
          <button className="ml-auto text-sky-400 text-xs font-semibold border border-sky-500/40 rounded-full px-3 py-1 hover:bg-sky-500/10 cursor-pointer transition-colors bg-transparent">
            + Follow
          </button>
        </div>

        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line mb-3">{content}</p>
      </div>

      <div className="px-4 pb-2 flex items-center justify-between text-white/30 text-xs border-t border-white/8 pt-2">
        <span>👍 ❤️ 💡 · 847 reactions</span>
        <span>94 comments</span>
      </div>

      <div className="flex border-t border-white/8">
        {[
          { icon:reacted?"👍":"👍", label:reacted?"Liked":"Like", fn:()=>setReacted(v=>!v) },
          { icon:"💬", label:"Comment" },
          { icon:"🔄", label:"Repost" },
          { icon:"↗", label:"Send" },
        ].map(a=>(
          <button key={a.label} onClick={a.fn}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-white/40 hover:bg-white/5 cursor-pointer transition-colors border-none bg-transparent"
            style={{ color:a.label==="Liked"?"#0a66c2":undefined }}>
            <span>{a.icon}</span><span>{a.label}</span>
          </button>
        ))}
        <div className="flex items-center px-3">
          <CopyBtn text={content}/>
        </div>
      </div>
    </div>
  );
}

/* ══ FACEBOOK CARD ═════════════════════════════════════════════ */
function FacebookCard({ content }: { content: string }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="w-full max-w-[520px] mx-auto rounded-2xl border border-white/10 overflow-hidden"
      style={{ background:"#242526", fontFamily:"'DM Sans',sans-serif" }}>
      <div className="p-4">
        <div className="flex gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">C</div>
          <div>
            <p className="text-white font-semibold text-sm">Your Page</p>
            <p className="text-white/40 text-[10px]">Just now · 🌐</p>
          </div>
          <div className="ml-auto flex gap-2 items-center">
            <button className="text-xs bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-md px-3 py-1 cursor-pointer hover:bg-blue-600/30 transition-colors">+ Follow</button>
            <span className="text-white/30 cursor-pointer">···</span>
          </div>
        </div>
        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{content}</p>
      </div>

      <div className="px-4 pb-2 flex justify-between text-white/30 text-xs">
        <span>👍 ❤️ 😮 &nbsp;1.2K</span>
        <span>84 Comments · 23 Shares</span>
      </div>

      <div className="flex border-t border-white/10 mx-2">
        {[
          { icon:liked?"👍":"👍", label:liked?"Liked":"Like", fn:()=>setLiked(v=>!v) },
          { icon:"💬", label:"Comment" },
          { icon:"↗", label:"Share" },
        ].map(a=>(
          <button key={a.label} onClick={a.fn}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs cursor-pointer hover:bg-white/5 transition-colors border-none bg-transparent"
            style={{ color:a.label==="Liked"?"#1877f2":"rgba(255,255,255,.4)" }}>
            <span>{a.icon}</span><span className="font-medium">{a.label}</span>
          </button>
        ))}
        <div className="flex items-center px-3">
          <CopyBtn text={content}/>
        </div>
      </div>
    </div>
  );
}

/* ══ THREADS CARD ══════════════════════════════════════════════ */
function ThreadsCard({ content }: { content: string }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="w-full max-w-[460px] mx-auto rounded-2xl border border-white/10 overflow-hidden"
      style={{ background:"#101010", fontFamily:"'DM Sans',sans-serif" }}>
      <div className="p-4">
        <div className="flex gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-sm font-bold text-white shrink-0">C</div>
            <div className="w-px flex-1 bg-white/10 mt-1"/>
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-bold text-sm">yourcreator</span>
              <span className="text-white/30 text-xs">· now</span>
              <span className="ml-auto text-white/20 text-base cursor-pointer">···</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{content}</p>
            <div className="flex gap-4 mt-3">
              <button onClick={()=>setLiked(v=>!v)} className="flex items-center gap-1 text-xs text-white/40 bg-transparent border-none cursor-pointer hover:text-white/70 transition-colors">
                <span className="text-base">{liked?"❤️":"🤍"}</span> {liked?124:123}
              </button>
              <button className="flex items-center gap-1 text-xs text-white/40 bg-transparent border-none cursor-pointer hover:text-white/70 transition-colors">
                <span className="text-base">💬</span> 18
              </button>
              <button className="flex items-center gap-1 text-xs text-white/40 bg-transparent border-none cursor-pointer hover:text-white/70 transition-colors">
                <span className="text-base">🔁</span> 34
              </button>
              <button className="flex items-center gap-1 text-xs text-white/40 bg-transparent border-none cursor-pointer hover:text-white/70 transition-colors">
                <span className="text-base">↗</span>
              </button>
              <div className="ml-auto">
                <CopyBtn text={content}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ PINTEREST CARD ════════════════════════════════════════════ */
function PinterestCard({ content }: { content: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="w-full max-w-[320px] mx-auto rounded-2xl overflow-hidden border border-white/10"
      style={{ background:"#1a0003", fontFamily:"'DM Sans',sans-serif" }}>
      <div className="w-full aspect-[3/4] relative flex items-end justify-end"
        style={{ background:"linear-gradient(160deg,#2d0008,#1a0003,#0d0012)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage:"radial-gradient(circle at 50% 30%,#e60023,transparent 60%)" }}/>
        <div className="absolute inset-0 flex items-center justify-center"><span className="text-7xl opacity-30">📌</span></div>
        <button onClick={()=>setSaved(v=>!v)}
          className="m-3 px-4 py-2 rounded-full text-sm font-bold cursor-pointer border-none transition-all"
          style={{ background:saved?"#6C5CE7":"#e60023", color:"white" }}>
          {saved?"Saved ✓":"Save"}
        </button>
      </div>
      <div className="p-4">
        <p className="text-white text-sm font-semibold mb-2 leading-snug">{content.slice(0, 80)}{content.length>80?"…":""}</p>
        <p className="text-white/40 text-xs mb-3 leading-relaxed">{content.slice(80,180)}</p>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white">C</div>
          <span className="text-white/50 text-xs">yourcreator</span>
          <div className="ml-auto">
            <CopyBtn text={content}/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ YOUTUBE RENDERER ══════════════════════════════════════════ */
function YoutubeCard({ text }: { text: string }) {
  const { titles, description, tags } = parseYoutube(text);
  const [selectedTitle, setSelectedTitle] = useState(0);
  const [subbed, setSubbed] = useState(false);
  return (
    <div className="max-w-[760px] mx-auto" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      {/* Player mock */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden relative flex items-center justify-center mb-4"
        style={{ background:"linear-gradient(160deg,#1a0005,#0d0010,#00040d)" }}>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage:"radial-gradient(circle at 30% 50%,#f87171,transparent 50%),radial-gradient(circle at 70% 50%,#7c3aed,transparent 50%)" }}/>
        <button className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl cursor-pointer hover:scale-110 transition-transform z-10 border-none">▶</button>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div className="h-full w-1/3 bg-red-600 rounded-r"/>
        </div>
        {/* Time */}
        <div className="absolute bottom-3 right-4 text-white/60 text-xs">2:34 / 10:12</div>
      </div>

      {/* Title selector */}
      <div className="mb-3">
        <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Choose your title</p>
        {titles.map((t,i)=>(
          <button key={i} onClick={()=>setSelectedTitle(i)}
            className="w-full text-left px-4 py-3 rounded-xl mb-1.5 border cursor-pointer transition-all duration-200"
            style={{ background:selectedTitle===i?"rgba(248,113,113,.12)":"rgba(255,255,255,.03)",
              borderColor:selectedTitle===i?"rgba(248,113,113,.5)":"rgba(255,255,255,.08)" }}>
            <span className="text-white font-semibold text-sm">{t}</span>
          </button>
        ))}
      </div>

      {/* Channel row */}
      <div className="flex items-center gap-3 py-4 border-t border-b border-white/10 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center font-bold text-white text-sm">C</div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">Your Channel</p>
          <p className="text-white/40 text-xs">12.4K subscribers</p>
        </div>
        <button onClick={()=>setSubbed(v=>!v)}
          className="px-4 py-2 rounded-full text-sm font-bold cursor-pointer border-none transition-all"
          style={{ background:subbed?"rgba(255,255,255,.1)":"#e60023", color:"white" }}>
          {subbed?"Subscribed ✓":"Subscribe"}
        </button>
        <CopyBtn text={text}/>
      </div>

      {/* Description box */}
      <div className="rounded-xl p-4 border border-white/8 mb-4" style={{ background:"rgba(255,255,255,.04)" }}>
        <div className="flex gap-3 text-xs text-white/40 mb-3" style={{ fontFamily:"'DM Sans',sans-serif" }}>
          <span>234K views</span><span>·</span><span>Just now</span>
        </div>
        <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{description}</p>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string, i: number)=>(
            <span key={i} className="text-xs px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══ TIKTOK RENDERER ═══════════════════════════════════════════ */
function TiktokCard({ text }: { text: string }) {
  const { hook, caption, hashtags, script } = parseTiktok(text);
  return (
    <div className="max-w-[380px] mx-auto" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      {/* Phone frame */}
      <div className="relative mx-auto w-[340px] rounded-[36px] overflow-hidden border-2 border-white/15"
        style={{ background:"#000", minHeight:580 }}>

        {/* Video area */}
        <div className="relative w-full" style={{ height:440, background:"linear-gradient(160deg,#001a10,#0d001a,#001010)" }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage:"radial-gradient(circle at 40% 60%,#34d399,transparent 50%),radial-gradient(circle at 60% 30%,#6366f1,transparent 50%)" }}/>

          {/* Right action bar */}
          <div className="absolute right-3 bottom-16 flex flex-col items-center gap-5">
            {[
              { icon:"❤️", val:"42K" },
              { icon:"💬", val:"1.2K" },
              { icon:"🔖", val:"8.4K" },
              { icon:"↗", val:"Share" },
            ].map(a=>(
              <div key={a.icon} className="flex flex-col items-center gap-0.5 cursor-pointer">
                <span className="text-2xl">{a.icon}</span>
                <span className="text-white text-[10px] font-bold">{a.val}</span>
              </div>
            ))}
            {/* Music disc */}
            <div className="w-9 h-9 rounded-full border-2 border-white/30 flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,#34d399,#6366f1)", animation:"spin 4s linear infinite" }}>
              <div className="w-3 h-3 rounded-full bg-black"/>
            </div>
          </div>

          {/* Hook overlay */}
          {hook && (
            <div className="absolute top-6 left-4 right-16">
              <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <p className="text-[10px] text-teal-400 uppercase tracking-widest mb-1 font-bold">3-Second Hook</p>
                <p className="text-white text-xs font-semibold leading-snug">"{hook}"</p>
              </div>
            </div>
          )}

          {/* Bottom caption overlay */}
          <div className="absolute bottom-3 left-3 right-14">
            <p className="text-white text-xs font-bold mb-1">@yourcreator</p>
            <p className="text-white/80 text-xs leading-relaxed line-clamp-3">{caption.slice(0,100)}</p>
            <p className="text-teal-300 text-[10px] mt-1">{hashtags.slice(0,60)}</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-around py-3 border-t border-white/10"
          style={{ background:"#111" }}>
          {["🏠","🔍","＋","📮","👤"].map(i=>(
            <span key={i} className="text-xl cursor-pointer">{i}</span>
          ))}
        </div>
      </div>

      {/* Script idea below */}
      {script && (
        <div className="mt-5 rounded-xl p-4 border border-teal-500/20" style={{ background:"rgba(52,211,153,.06)" }}>
          <p className="text-teal-400 text-[10px] font-bold uppercase tracking-widest mb-2">Script Idea</p>
          <p className="text-white/70 text-xs leading-relaxed">{script}</p>
        </div>
      )}

      <div className="flex justify-end mt-3">
        <CopyBtn text={text}/>
      </div>
    </div>
  );
}

/* ══ PRODUCT RENDERER ══════════════════════════════════════════ */
function ProductCard({ text }: { text: string }) {
  const { headline, body, cta } = parseProduct(text);
  const lines = body.split("\n").filter(Boolean);
  return (
    <div className="max-w-[640px] mx-auto" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      {/* Product header */}
      <div className="rounded-2xl overflow-hidden mb-5">
        <div className="w-full h-48 flex items-center justify-center relative"
          style={{ background:"linear-gradient(135deg,#1a1000,#0d0a00,#1a0a00)" }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage:"radial-gradient(circle at 50% 50%,#fbbf24,transparent 60%)" }}/>
          <span className="text-7xl z-10">🛍️</span>
        </div>
      </div>

      {/* Content card */}
      <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background:"rgba(255,255,255,.03)" }}>
        <div className="p-6">
          {headline && <h2 className="text-white font-extrabold text-2xl tracking-tight mb-4 leading-tight" style={{ fontFamily:"'Sora',sans-serif" }}>{headline}</h2>}

          {/* Benefits */}
          <div className="flex flex-col gap-2 mb-5">
            {lines.filter((l: string)=>l.startsWith("-")||l.startsWith("•")).map((l: string, i: number)=>(
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-amber-400 text-[10px]">✓</span>
                </div>
                <span className="text-white/70 text-sm leading-relaxed">{l.slice(2)}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          {lines.filter((l: string)=>!l.startsWith("-")&&!l.startsWith("•")).map((l: string, i: number)=>(
            <p key={i} className="text-white/55 text-sm leading-relaxed mb-2">{l}</p>
          ))}
        </div>

        {/* CTA bar */}
        <div className="p-4 border-t border-white/8 flex items-center gap-3" style={{ background:"rgba(251,191,36,.05)" }}>
          {cta && (
            <button className="flex-1 py-3 rounded-xl font-bold text-sm text-black cursor-pointer border-none transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background:"linear-gradient(135deg,#fbbf24,#f59e0b)", fontFamily:"'Sora',sans-serif" }}>
              {cta}
            </button>
          )}
          <CopyBtn text={text}/>
        </div>
      </div>
    </div>
  );
}

/* ══ PLATFORM DEFINITIONS ══════════════════════════════════════ */
const PLATFORMS = [
  { id: "instagram", label: "IG", icon: "📷" },
  { id: "twitter",   label: "X",  icon: "𝕏" },
  { id: "linkedin",  label: "in", icon: "💼" },
  { id: "facebook",  label: "f",  icon: "📘" },
  { id: "threads",   label: "@",  icon: "🧵" },
  { id: "pinterest", label: "P",  icon: "📌" },
];

const POST_TYPES = {
  blog:    { icon: "✍️",  label: "Blog Article" },
  social:  { icon: "📱", label: "Social Media" },
  youtube: { icon: "▶️",  label: "YouTube" },
  tiktok:  { icon: "🎵", label: "TikTok" },
  product: { icon: "🛍️", label: "Product" },
};

/* ══ RESULTS PAGE ══════════════════════════════════════════════ */
export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && contentId) {
      try {
        const stored = localStorage.getItem(`content_${contentId}`);
        if (stored) {
          setContent(JSON.parse(stored));
        } else {
          setError("Content not found. Please generate new content.");
        }
      } catch (err) {
        setError("Error loading content");
        console.error(err);
      }
      setLoading(false);
    }
  }, [contentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">⚠️ {error || "Content Not Found"}</h2>
          <button
            onClick={() => router.push("/content/create")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
          >
            Create New Content
          </button>
        </div>
      </div>
    );
  }

  const { body: text, content_type: postType, topic, tone, length, postType: postTypeField, platforms = [] } = content;
  const contentType = postTypeField || postType || "blog";
  const activeType = POST_TYPES[contentType as keyof typeof POST_TYPES] || POST_TYPES.blog;

  const PLATFORM_COMPONENTS = {
    instagram: InstagramCard,
    twitter:   TwitterCard,
    linkedin:  LinkedInCard,
    facebook:  FacebookCard,
    threads:   ThreadsCard,
    pinterest: PinterestCard,
  };

  const socialPosts = contentType === "social" ? parseSocialPosts(text, platforms) : {};

  return (
    <div className="min-h-screen text-white overflow-x-hidden"
      style={{ fontFamily:"'Sora',sans-serif", background:"radial-gradient(ellipse 120% 80% at 50% -10%,#1a0a3a 0%,#0a1a1a 50%,#060610 100%)" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin      { to { transform:rotate(360deg) } }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ringPulse { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(2.2);opacity:0} }
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .fade-up { animation:fadeUp .5s ease both }
        ::-webkit-scrollbar       { width:3px }
        ::-webkit-scrollbar-thumb { background:rgba(108,92,231,.45); border-radius:2px }
        .line-clamp-3 { display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden }
      `}</style>

      {/* Grid */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundImage:"linear-gradient(rgba(108,92,231,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(108,92,231,.04) 1px,transparent 1px)", backgroundSize:"48px 48px" }} />
      <div className="fixed top-[10%] left-[5%] w-[480px] h-[480px] rounded-full pointer-events-none z-0" style={{ background:"radial-gradient(circle,rgba(108,92,231,.10) 0%,transparent 70%)" }}/>
      <div className="fixed bottom-[10%] right-[5%] w-[380px] h-[380px] rounded-full pointer-events-none z-0" style={{ background:"radial-gradient(circle,rgba(0,206,201,.07) 0%,transparent 70%)" }}/>

      {/* Nav */}
      <Navbar />

      <div className="relative z-[5] max-w-[900px] mx-auto px-6 py-12 pb-28">

        {/* Header */}
        <div className="text-center mb-12 fade-up">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-400/20 rounded-full px-4 py-1.5 mb-5">
            <span className="text-teal-400 text-xs font-semibold uppercase tracking-widest">Content Ready</span>
            <span className="text-teal-300">✓</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            <span style={{ background:"linear-gradient(135deg,#c4b5fd 0%,#818cf8 40%,#22d3ee 80%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Your content is live
            </span>
          </h1>
          <p className="text-white/35 text-sm" style={{ fontFamily:"'DM Sans',sans-serif" }}>
            Topic: <span className="text-white/60 italic">"{topic}"</span>
          </p>
        </div>

        {/* ── BLOG ── */}
        {contentType === "blog" && (
          <div className="fade-up rounded-3xl border border-white/10 overflow-hidden p-8" style={{ background:"rgba(6,4,18,.8)", backdropFilter:"blur(20px)" }}>
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/8">
              <span className="text-2xl">✍️</span>
              <span className="text-white/50 text-xs font-semibold uppercase tracking-widest" style={{ fontFamily:"'DM Sans',sans-serif" }}>Medium-style Article</span>
            </div>
            <BlogCard text={text}/>
          </div>
        )}

        {/* ── SOCIAL MEDIA — one card per platform ── */}
        {contentType === "social" && (
          <div className="flex flex-col gap-10">
            {platforms.map((pid, i) => {
              const PlatformCard = PLATFORM_COMPONENTS[pid];
              const meta = PLATFORM_META[pid] || {};
              const content = socialPosts[pid] || text;
              if (!PlatformCard) return null;
              return (
                <div key={pid} className="fade-up" style={{ animationDelay:`${i*0.1}s` }}>
                  {/* Platform label */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-white"
                      style={{ background:meta.color }}>
                      {PLATFORMS.find(p=>p.id===pid)?.label}
                    </div>
                    <span className="font-bold text-sm" style={{ color:meta.color, fontFamily:"'DM Sans',sans-serif" }}>{meta.label}</span>
                    <div className="flex-1 h-px" style={{ background:`linear-gradient(90deg,${meta.color}44,transparent)` }}/>
                  </div>
                  <PlatformCard content={content}/>
                </div>
              );
            })}
          </div>
        )}

        {/* ── YOUTUBE ── */}
        {contentType === "youtube" && (
          <div className="fade-up rounded-3xl border border-white/10 overflow-hidden p-8" style={{ background:"rgba(6,4,18,.8)", backdropFilter:"blur(20px)" }}>
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/8">
              <span className="text-2xl">▶️</span>
              <span className="text-white/50 text-xs font-semibold uppercase tracking-widest" style={{ fontFamily:"'DM Sans',sans-serif" }}>YouTube Preview</span>
            </div>
            <YoutubeCard text={text}/>
          </div>
        )}

        {/* ── TIKTOK ── */}
        {contentType === "tiktok" && (
          <div className="fade-up rounded-3xl border border-white/10 overflow-hidden p-8" style={{ background:"rgba(6,4,18,.8)", backdropFilter:"blur(20px)" }}>
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/8">
              <span className="text-2xl">🎵</span>
              <span className="text-white/50 text-xs font-semibold uppercase tracking-widest" style={{ fontFamily:"'DM Sans',sans-serif" }}>TikTok Preview</span>
            </div>
            <TiktokCard text={text}/>
          </div>
        )}

        {/* ── PRODUCT ── */}
        {contentType === "product" && (
          <div className="fade-up rounded-3xl border border-white/10 overflow-hidden p-8" style={{ background:"rgba(6,4,18,.8)", backdropFilter:"blur(20px)" }}>
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/8">
              <span className="text-2xl">🛍️</span>
              <span className="text-white/50 text-xs font-semibold uppercase tracking-widest" style={{ fontFamily:"'DM Sans',sans-serif" }}>Product Listing</span>
            </div>
            <ProductCard text={text}/>
          </div>
        )}

        {/* Back button */}
        <div className="text-center mt-12">
          <button onClick={() => router.push("/content/create")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/15 bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-200 cursor-pointer text-sm font-semibold"
            style={{ fontFamily:"'DM Sans',sans-serif" }}>
            ← Create Another
          </button>
        </div>
      </div>
    </div>
  );
}