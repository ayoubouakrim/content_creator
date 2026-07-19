import { apiClient } from "@/lib/api-client";

// Define API endpoints for different content types
const API_ENDPOINTS = {
  blog: "/api/content/generate/blog_article",
  social: "/api/content/generate/social_media_post",
  product: "/api/content/generate/product_description",
  youtube: "/api/content/generate/youtube_content",
  tiktok: "/api/content/generate/tiktok_content",
  analyzeSEO: "/api/analyze/seo",
  improveSEO: "/api/content/improve_seo",
};

// Type definitions for requests
interface BlogArticleRequest {
  user_id?: number;
  topic: string;
  keywords: string[];
  tone: string;
  length: number;
}

interface SocialMediaPostRequest {
  topic: string;
  platform: string;
  platforms?: string[];
  tone: string;
  length: number;
}

interface ProductDescriptionRequest {
  product_name: string;
  features: string[];
  benefits: string;
  target_audience: string;
  length: string;
}

interface YoutubeContentRequest {
  topic: string;
  keywords: string[];
  tone: string;
  length: string;
}

interface TiktokContentRequest {
  topic: string;
  keywords: string[];
  tone: string;
  length: string;
}

interface ImproveContentRequest {
  content: string;
  content_type?: string;
  platform?: string;
  target_keyword?: string;
}

interface ImproveContentResponse {
  improved_content: string;
  original_content: string;
  content_type?: string;
  platform?: string;
  target_keyword?: string;
  notes?: string[];
}

/**
 * Generate content based on content type
 * Routes to appropriate API endpoint using switch statement
 */
export const generateContent = async (
  postType: string,
  topic: string,
  platforms: string[],
  length: "short" | "medium" | "long",
  tone: string,
  keywords?: string[],
  productData?: any
) => {
  try {
    let apiEndpoint: string;
    let requestPayload: any;

    // Switch statement to determine endpoint and payload based on content type
    switch (postType) {
      // Blog Post
      case "blog":
        apiEndpoint = API_ENDPOINTS.blog;
        requestPayload = {
          user_id: 1,
          topic: topic,
          keywords: keywords || [topic],
          tone: tone,
          length: length === "short" ? 500 : length === "medium" ? 1000 : 1500,
        } as BlogArticleRequest;
        break;

      // Social Media
      case "social":
        apiEndpoint = API_ENDPOINTS.social;
        requestPayload = {
          topic: topic,
          platform: platforms[0] || "twitter",
          platforms: platforms,
          tone: tone,
          length: length === "short" ? 100 : length === "medium" ? 280 : 500,
        } as SocialMediaPostRequest;
        break;

      // Product Description
      case "product":
        apiEndpoint = API_ENDPOINTS.product;
        requestPayload = {
          product_name: productData?.name || topic,
          features: productData?.features || [topic],
          benefits: productData?.benefits || topic,
          target_audience: productData?.audience || "general",
          length: length === "short" ? "short" : length === "medium" ? "medium" : "long",
        } as ProductDescriptionRequest;
        break;

      // YouTube
      case "youtube":
        apiEndpoint = API_ENDPOINTS.youtube;
        requestPayload = {
          topic: topic,
          keywords: keywords || [topic],
          tone: tone,
          length: length,
        } as YoutubeContentRequest;
        break;

      // TikTok
      case "tiktok":
        apiEndpoint = API_ENDPOINTS.tiktok;
        requestPayload = {
          topic: topic,
          keywords: keywords || [topic],
          tone: tone,
          length: length,
        } as TiktokContentRequest;
        break;

      // Default fallback
      default:
        throw new Error(`Unsupported content type: ${postType}`);
    }

    console.log(`📤 Sending ${postType} request to ${apiEndpoint}`, requestPayload);

    // Make API call to the appropriate endpoint
    const response : any = await apiClient.post(apiEndpoint, requestPayload);

    console.log(`✅ Content generated successfully:`, response);
    // API response structure: { body, title, content_type, etc. }
    return response;
  } catch (error) {
    console.error(`❌ Error generating ${postType} content:`, error);
    throw error;
  }
};


export async function analyzeSEO(
  postType: "blog" | "social" | "product" | "youtube" | "tiktok",
  content: string,
  platform?: string
) {
  try {
    const requestPayload = {
      postType,
      content,
      platform,
    };
    const response = await apiClient.post(API_ENDPOINTS.analyzeSEO, requestPayload);
    return response;
  } catch (error) {
    console.error("❌ Error analyzing SEO:", error);
    throw error;
  }
}

export async function getHashtags(content: string, platform: string) {
  try {
    const requestPayload = { content, platform };
    const response = await apiClient.post("/api/content/hashtags", requestPayload);
    return response;
  } catch (error) {
    console.error("❌ Error generating related hashtags:", error);
    throw error;
  }
}

export async function improveContent(
  contentType: string,
  content: string,
  platform?: string,
  targetKeyword?: string
): Promise<ImproveContentResponse> {
  try {
    const requestPayload: ImproveContentRequest = {
      content,
      content_type: contentType,
      platform,
      target_keyword: targetKeyword,
    };
    const response = await apiClient.post<ImproveContentResponse>(API_ENDPOINTS.improveSEO, requestPayload);
    return response;
  } catch (error) {
    console.error("❌ Error improving content:", error);
    throw error;
  }
}

// ========== SAVE HELPERS ==========

export async function saveContent(
  title: string,
  body: string,
  content_type: string,                 // blog | social | product | youtube | tiktok
  platform?: string | null,
  meta_description?: string | null,
  seo_report?: Record<string, any> | null,
) {
  try {
    const user_id = localStorage.getItem("user_id");
    const payload = { title, body, content_type, platform, meta_description, seo_report, user_id };
    const response = await apiClient.post("/api/content/save", payload);
    return response;
  } catch (error) {
    console.error("❌ Error saving content:", error);
    throw error;
  }
}

export async function saveSEOReport(
  score: number,
  scoreLabel: string,
  rawContent?: string,
  postTitle?: string,
  niche?: string,
  format?: string,
  wordCount?: number,
  wordCountTarget?: string,
  wordCountStatus?: string,
  readabilityScore?: number,
  readabilityLevel?: string,
  readabilityMetrics?: any,
  keywordDensity?: number,
  primaryKeyword?: any,
  secondaryKeywords?: any,
  missingKeywords?: any,
  onPageElements?: any,
  titleSuggestion?: string,
  metaDescriptionSuggestion?: string,
  positivePoints?: any,
  negativePoints?: any,
  recommendations?: any
): Promise<{ id: number; status: string }> {
  try {
    const response = await apiClient.post("/api/content/save/seo-report", {
      score,
      score_label: scoreLabel,
      raw_content: rawContent,
      post_title: postTitle,
      niche,
      format,
      word_count: wordCount,
      word_count_target: wordCountTarget,
      word_count_status: wordCountStatus,
      readability_score: readabilityScore,
      readability_level: readabilityLevel,
      readability_metrics: readabilityMetrics,
      keyword_density: keywordDensity,
      primary_keyword: primaryKeyword,
      secondary_keywords: secondaryKeywords,
      missing_keywords: missingKeywords,
      on_page_elements: onPageElements,
      title_suggestion: titleSuggestion,
      meta_description_suggestion: metaDescriptionSuggestion,
      positive_points: positivePoints,
      negative_points: negativePoints,
      recommendations,
    });
    return response;
  } catch (error) {
    console.error("❌ Error saving SEO report:", error);
    throw error;
  }
}

export async function saveHashtagAnalysis(
  rawContent: string,
  platform: string,
  hashtags: any,
  contentSummary?: string,
  recommendedCount?: number,
  notes?: string
): Promise<{ id: number; status: string }> {
  try {
    const response = await apiClient.post("/api/content/save/hashtags", {
      raw_content: rawContent,
      platform,
      hashtags,
      content_summary: contentSummary,
      recommended_count: recommendedCount,
      notes,
    });
    return response;
  } catch (error) {
    console.error("❌ Error saving hashtags:", error);
    throw error;
  }
}

export async function saveContentImprovement(
  originalContent: string,
  improvedContent: string,
  contentType?: string,
  platform?: string,
  targetKeyword?: string,
  notes?: string[]
): Promise<{ id: number; status: string }> {
  try {
    const response = await apiClient.post("/api/content/save/improvement", {
      original_content: originalContent,
      improved_content: improvedContent,
      content_type: contentType,
      platform,
      target_keyword: targetKeyword,
      notes,
    });
    return response;
  } catch (error) {
    console.error("❌ Error saving improvement:", error);
    throw error;
  }
}