"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ContentDisplay from "@/components/content/ContentDisplay";
import SEOReportCard from "@/components/content/SEOReport";

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

  const { topic, seo_report } = content;

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

      <div className="relative z-[5] max-w-[1400px] mx-auto px-6 py-12 pb-28">

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

        {/* 2-Column Layout: Content (50%) + SEO Report (50%) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Content Display */}
          <ContentDisplay content={content} />

          {/* Right Column: SEO Report */}
          {seo_report && (
            <div>
              <SEOReportCard report={seo_report}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}