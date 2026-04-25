import { apiClient } from "@/lib/api-client";

// Define API endpoints for different content types
const API_ENDPOINTS = {
  blog: "/api/content/generate/blog_article",
  social: "/api/content/generate/social_media_post",
  product: "/api/content/generate/product_description",
  youtube: "/api/content/generate/youtube_content",
  tiktok: "/api/content/generate/tiktok_content",
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

/**
 * Alternative version using if-else conditions
 * Uncomment to use instead of switch statement
 */
export const generateContentIfElse = async (
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

    // If-else conditions to determine endpoint and payload
    if (postType === "blog") {
      apiEndpoint = API_ENDPOINTS.blog;
      requestPayload = {
        user_id: 1,
        topic: topic,
        keywords: keywords || [topic],
        tone: tone,
        length: length === "short" ? 500 : length === "medium" ? 1000 : 1500,
      } as BlogArticleRequest;
    } else if (postType === "social") {
      apiEndpoint = API_ENDPOINTS.social;
      requestPayload = {
        topic: topic,
        platform: platforms[0] || "twitter",
        platforms: platforms,
        tone: tone,
        length: length === "short" ? 100 : length === "medium" ? 280 : 500,
      } as SocialMediaPostRequest;
    } else if (postType === "product") {
      apiEndpoint = API_ENDPOINTS.product;
      requestPayload = {
        product_name: productData?.name || topic,
        features: productData?.features || [topic],
        benefits: productData?.benefits || topic,
        target_audience: productData?.audience || "general",
        length: length === "short" ? "short" : length === "medium" ? "medium" : "long",
      } as ProductDescriptionRequest;
    } else if (postType === "youtube") {
      apiEndpoint = API_ENDPOINTS.youtube;
      requestPayload = {
        topic: topic,
        keywords: keywords || [topic],
        tone: tone,
        length: length,
      } as YoutubeContentRequest;
    } else if (postType === "tiktok") {
      apiEndpoint = API_ENDPOINTS.tiktok;
      requestPayload = {
        topic: topic,
        keywords: keywords || [topic],
        tone: tone,
        length: length,
      } as TiktokContentRequest;
    } else {
      throw new Error(`Unsupported content type: ${postType}`);
    }

    console.log(`📤 Sending ${postType} request to ${apiEndpoint}`, requestPayload);
    const response = await apiClient.post(apiEndpoint, requestPayload);
    console.log(`✅ Content generated successfully:`, response);
    return response.data;
  } catch (error) {
    console.error(`❌ Error generating ${postType} content:`, error);
    throw error;
  }
};
