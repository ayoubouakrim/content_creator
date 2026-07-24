"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ContentDisplay from "@/components/content/ContentDisplay";
import SEOReportCard from "@/components/content/SEOReport";
import Footer from "@/components/Footer";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);

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

  if (error || !content) {
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

  const posts = content.posts || [];
  const isMulti = content.postType === "social" && posts.length > 1;
  const activePost = posts[activeTab] || posts[0];
  const showReportColumn = reportOpen && activePost?.seo_report;

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

      {/* grid bg, matches create page */}
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
              Your content is live
            </span>
          </h1>
          <p className="text-white/35 text-sm" style={{ fontFamily: "'DM Sans',sans-serif" }}>
            Topic: <span className="text-white/60 italic">"{content.topic}"</span>
          </p>
        </div>

        {isMulti && (
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {posts.map((post: any, i: number) => (
              <button
                key={post.platform}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize cursor-pointer ${
                  i === activeTab
                    ? "bg-violet-500/20 border-violet-400/60 text-white"
                    : "bg-white/5 border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                {post.platform}
              </button>
            ))}
          </div>
        )}

        {/* two-column grid — SEO column only exists once opened */}
        <div
          className="grid gap-6 items-start transition-[grid-template-columns] duration-300"
          style={{ gridTemplateColumns: showReportColumn ? "minmax(0,1fr) 400px" : "minmax(0,1fr)" }}
        >
          <ContentDisplay
            content={content}
            activeIndex={activeTab}
            reportOpen={!!showReportColumn}
            onToggleReport={() => setReportOpen((v) => !v)}
          />
          {showReportColumn && (
            <SEOReportCard report={activePost.seo_report} onClose={() => setReportOpen(false)} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}