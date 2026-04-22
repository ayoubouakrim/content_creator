export interface Content {
    id: number;
    user_id: number;
    title: string;
    body: string;
    meta_description: string;
    platform: string;
    status: ContentStatus;
    content_type: ContentType;
    created_at: string;
    updated_at: string;
}

export type ContentStatus = "draft" | "scheduled" | "published" | "archived";
export type ContentType = "blog_post" | "social_media_post" | "video_script" | "email_newsletter" | "product_description";
