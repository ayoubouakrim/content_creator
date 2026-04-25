// API Client for Content Creator AI
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TOKEN_STORAGE_KEY = "auth_token";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get token from localStorage
   */
  private getTokenFromStorage(): string | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      console.log(`🔑 Token found in localStorage (${token.length} chars)`);
    }
    return token;
  }

  private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const method = options.method || "GET";

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      // Add authorization token from localStorage if available
      const token = this.getTokenFromStorage();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ API Error:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body });
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}


export const apiClient = new ApiClient();


    
