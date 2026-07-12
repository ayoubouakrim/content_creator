"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ContentDisplay from "@/components/content/ContentDisplay";
import SEOReportCard from "@/components/content/SEOReport";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);

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

  const posts = content.posts || [];
  const isMulti = content.postType === "social" && posts.length > 1;
  const activePost = posts[activeTab] || posts[0];

  return (
    <div className="min-h-screen text-white overflow-x-hidden"
      style={{ fontFamily: "'Sora',sans-serif", background: "radial-gradient(ellipse 120% 80% at 50% -10%,#1a0a3a 0%,#0a1a1a 50%,#060610 100%)" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation:fadeUp .5s ease both }
        ::-webkit-scrollbar { width:3px }
        ::-webkit-scrollbar-thumb { background:rgba(108,92,231,.45); border-radius:2px }
      `}</style>

      <Navbar />

      <div className="relative z-[5] max-w-[1200px] mx-auto px-6 py-8 pb-16">

        <div className="text-center mb-6 fade-up">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">
            <span style={{ background: "linear-gradient(135deg,#c4b5fd 0%,#818cf8 40%,#22d3ee 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Your content is live
            </span>
          </h1>
          <p className="text-white/35 text-sm" style={{ fontFamily: "'DM Sans',sans-serif" }}>
            Topic: <span className="text-white/60 italic">"{content.topic}"</span>
          </p>
        </div>

        {isMulti && (
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {posts.map((post: any, i: number) => (
              <button
                key={post.platform}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContentDisplay content={content} activeIndex={activeTab} />
          {activePost?.seo_report && (
            <SEOReportCard report={activePost.seo_report} />
          )}
        </div>
      </div>
    </div>
  );
}