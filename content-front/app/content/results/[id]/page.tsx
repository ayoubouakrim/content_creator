"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ContentData {
  id: number;
  title: string;
  body: string;
  content_type: string;
  status: string;
  word_count: number;
  topic: string;
  tone: string;
  length: string;
  postType: string;
  generated_at: string;
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load content from localStorage
    if (typeof window !== "undefined" && contentId) {
      const stored = localStorage.getItem(`content_${contentId}`);
      if (stored) {
        setContent(JSON.parse(stored));
      }
      setLoading(false);
    }
  }, [contentId]);

  const copyToClipboard = () => {
    if (content?.body) {
      navigator.clipboard.writeText(content.body);
      alert("Content copied to clipboard!");
    }
  };

  const downloadAsText = () => {
    if (content?.body) {
      const element = document.createElement("a");
      element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(content.body)}`);
      element.setAttribute("download", `${content.title || "content"}.txt`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const downloadAsHTML = () => {
    if (content?.body) {
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${content.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #333; }
    .metadata { background: #f5f5f5; padding: 10px; border-radius: 5px; margin: 20px 0; }
    .content { white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>${content.title}</h1>
  <div class="metadata">
    <p><strong>Type:</strong> ${content.content_type}</p>
    <p><strong>Word Count:</strong> ${content.word_count}</p>
    <p><strong>Generated:</strong> ${new Date(content.generated_at).toLocaleString()}</p>
  </div>
  <div class="content">${content.body}</div>
</body>
</html>`;
      const element = document.createElement("a");
      element.setAttribute("href", `data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
      element.setAttribute("download", `${content.title || "content"}.html`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

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

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Content Not Found</h2>
          <p className="text-gray-300 mb-6">The content you're looking for doesn't exist or has been cleared.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white" style={{ fontFamily: "'Sora',sans-serif" }}>
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{content.title}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {content.content_type.replace(/_/g, " ").toUpperCase()} • {content.word_count} words
            </p>
          </div>
          <button
            onClick={() => router.push("/content/create")}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Type</p>
            <p className="text-white font-semibold mt-1">{content.postType}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Tone</p>
            <p className="text-white font-semibold mt-1 capitalize">{content.tone}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Length</p>
            <p className="text-white font-semibold mt-1 capitalize">{content.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Generated</p>
            <p className="text-white font-semibold mt-1 text-xs">
              {new Date(content.generated_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 mb-8">
          <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
            {content.body}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <button
            onClick={copyToClipboard}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition flex items-center gap-2"
          >
            📋 Copy Content
          </button>
          <button
            onClick={downloadAsText}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition flex items-center gap-2"
          >
            📄 Download TXT
          </button>
          <button
            onClick={downloadAsHTML}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition flex items-center gap-2"
          >
            🌐 Download HTML
          </button>
          <button
            onClick={() => router.push("/content/create")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition flex items-center gap-2"
          >
            ✨ Create Another
          </button>
        </div>
      </div>
    </div>
  );
}
