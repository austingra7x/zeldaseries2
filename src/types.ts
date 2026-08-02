/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AppUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: 'game' | 'movie' | 'community';
  imageUrl: string;
  galleryImages?: string[];
  // SEO & E-E-A-T Metadata
  seoTitle?: string;
  metaDescription?: string;
  focusKeywords?: string[];
  canonicalUrl?: string;
  jsonLdSchema?: string;
  authorByline?: string;
  eeatScore?: number;
  eeatDetails?: {
    score: number;
    expertiseNotes: string;
    factCheckStatus: string;
    citationSources: string[];
    editorialDisclosure?: string;
  };
  rssReferenceUrl?: string;
  rssSourceTitle?: string;
  rssPublishDate?: string;
  likes?: number;
}

export interface RssFeedItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  snippet: string;
  source: string;
  guid?: string;
}

export interface GeneratedSeoNews {
  title: string;
  seoTitle: string;
  summary: string;
  metaDescription: string;
  focusKeywords: string[];
  category: 'game' | 'movie' | 'community';
  contentHtml: string;
  imageUrl: string;
  galleryImages: string[];
  canonicalUrl: string;
  jsonLdSchema: string;
  authorByline: string;
  eeatDetails: {
    score: number;
    expertiseNotes: string;
    factCheckStatus: string;
    citationSources: string[];
    editorialDisclosure: string;
  };
  rssReferenceUrl: string;
  rssSourceTitle: string;
  rssPublishDate: string;
}

export type ArchiveCategoryType = 'merchandise' | 'movie' | 'games' | 'publications' | 'gamelore' | 'media';

export interface LoreEntry {
  id: string;
  title: string;
  game?: string;
  category: ArchiveCategoryType | 'character' | 'item' | 'location' | 'era' | string;
  subCategory?: string;
  description: string;
  imageUrl: string;
  galleryImages?: string[];
  releaseYear?: string;
  externalLink?: string;
}

export type SubmissionType = 'art' | 'video' | 'literature' | 'review' | 'memorabilia' | 'fangame' | 'theory' | 'nft' | 'avatar';

export interface TokenDetails {
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
  copyrightLicense: string;
  timestamp: string;
  royaltiesPercentage: number;
  ownerAddress: string;
}

export interface UserSubmission {
  id: string;
  author: string;
  title: string;
  type: SubmissionType;
  contentUrl?: string;
  galleryImages?: string[];
  contentBody?: string; // For literature/reviews
  description: string;
  date: string;
  tokenized: boolean;
  tokenDetails?: TokenDetails;
  likes: number;
}

export interface GuideStep {
  title: string;
  instruction: string;
}

export interface InteractiveChecklistItem {
  id: string;
  item: string;
  location: string;
  obtained: boolean;
}

export interface RescueGuideResponse {
  title: string;
  walkthrough: string; // Markdown formatted detailed walkthrough
  bossStrategies: string; // Markdown formatted boss tactics
  itemsChecklist: InteractiveChecklistItem[];
}

export interface Comment {
  id: string;
  targetId: string;
  targetType: 'news' | 'lore' | 'submission';
  authorName: string;
  authorId: string;
  authorPhoto?: string;
  content: string;
  date: string;
  timestamp: number;
}

export interface SidebarBlock {
  id: string;
  title: string;
  type: 'text' | 'html' | 'link' | 'movie-tracker';
  content: string;
  linkUrl?: string;
  order: number;
}

