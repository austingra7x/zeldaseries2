/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: 'game' | 'movie' | 'community';
  imageUrl: string;
  galleryImages?: string[];
}

export interface LoreEntry {
  id: string;
  title: string;
  game: string;
  category: 'character' | 'item' | 'location' | 'era';
  description: string;
  imageUrl: string;
}

export type SubmissionType = 'art' | 'video' | 'literature' | 'review' | 'memorabilia';

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
  type: 'text' | 'html' | 'link';
  content: string;
  linkUrl?: string;
  order: number;
}

