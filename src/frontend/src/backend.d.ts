import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    savedArticles: Uint32Array;
    readingHistory: Uint32Array;
    favoritePromotions: Array<string>;
    darkMode: boolean;
    rumorAlerts: boolean;
    breakingNewsAlerts: boolean;
}
export interface Article {
    id: number;
    content: string;
    publishDate: Time;
    summary: string;
    imageUrl: string;
    promotion: string;
    category: ArticleCategory;
}
export enum ArticleCategory {
    rumors = "rumors",
    news = "news",
    results = "results",
    events = "events"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteArticle(articleId: number): Promise<void>;
    getAllArticles(): Promise<Array<Article>>;
    getArticleById(articleId: number): Promise<Article | null>;
    getArticlePreviewImage(articleId: number): Promise<string>;
    getArticlesByCategory(category: ArticleCategory): Promise<Array<Article>>;
    getArticlesByPromotion(promotion: string): Promise<Array<Article>>;
    getArticlesByPromotionAndCategory(promotion: string, category: ArticleCategory): Promise<Array<Article>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProfile(): Promise<UserProfile>;
    getReadingHistory(): Promise<Array<Article>>;
    getSavedArticles(): Promise<Array<Article>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveProfile(profile: UserProfile): Promise<void>;
    searchArticles(searchText: string): Promise<Array<Article>>;
    uploadArticle(article: Article): Promise<void>;
}
