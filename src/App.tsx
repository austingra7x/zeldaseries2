/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  BookOpen, 
  Sparkles, 
  ShieldAlert, 
  Send, 
  Heart, 
  Award, 
  ExternalLink, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  CheckSquare, 
  Square, 
  Plus, 
  RotateCcw, 
  Search, 
  Film,
  User,
  Clock,
  HelpCircle,
  X,
  Volume2,
  AlertCircle,
  Share2,
  MessageSquare,
  Trash2,
  Edit,
  Lock,
  Unlock,
  Shield,
  Wallet,
  ChevronRight,
  Star,
  Images,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewsItem, LoreEntry, UserSubmission, TokenDetails, Comment, SidebarBlock } from './types';
import { CommentsSection } from './components/CommentsSection';
import { NewsContentRenderer } from './components/NewsContentRenderer';
import { NewsGalleryViewer } from './components/NewsGalleryViewer';
import { 
  auth, 
  db, 
  googleProvider, 
  facebookProvider,
  githubProvider,
  twitterProvider,
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInAnonymously
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  where,
  deleteDoc
} from 'firebase/firestore';

export default function App() {
  // Authentication State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Advanced Multi-Auth State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'web3'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authDisplayName, setAuthDisplayName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoadingState, setAuthLoadingState] = useState(false);
  const [web3Address, setWeb3Address] = useState('');
  const [web3Connecting, setWeb3Connecting] = useState(false);

  // Fallback / Seed Data
  const initialNews: NewsItem[] = [
    {
      id: 'n1',
      title: 'Legend of Zelda Live-Action Movie: Wes Ball Targets "Live-Action Miyazaki" Vibe',
      summary: 'Director Wes Ball shares exciting updates about the upcoming live-action Zelda film, revealing plans to create a grounded, whimsical adventure inspired by Studio Ghibli.',
      content: `<p>Exciting news has emerged from the development of the upcoming live-action <strong>Legend of Zelda</strong> film. In a recent interview, director <strong>Wes Ball</strong> (known for the <em>Maze Runner</em> trilogy and <em>Kingdom of the Planet of the Apes</em>) discussed his ambitious vision for Hyrule's cinematic debut.</p><h3>The Miyazaki Aesthetic</h3><p>Ball expressed his deep reverence for the franchise, stating that he does not want the movie to feel like a generic <em>Lord of the Rings</em> clone. Instead, he is aiming for a <em>"live-action Miyazaki"</em> aesthetic—a world filled with wonder, rich history, beautiful landscapes, and a serious but whimsical heart.</p><blockquote>"It's going to be awesome. My whole life has led to this moment. I love this franchise. We are working hard to make something truly special for fans and newcomers alike." — Wes Ball</blockquote><h3>Key Production Details</h3><ul><li><strong>Co-Producers:</strong> Shigeru Miyamoto and Avi Arad</li><li><strong>Production Studio:</strong> Nintendo & Sony Pictures Entertainment</li><li><strong>Cinematic Focus:</strong> Physical environments with magical Studio Ghibli-inspired atmosphere</li></ul>`,
      date: '2026-07-15',
      category: 'movie',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'n2',
      title: 'Casting Rumors Swirl: Who Will Play Link, Zelda, and Ganondorf?',
      summary: 'Hollywood insiders drop potential names for the legendary trio in the upcoming live-action movie. Fans debate physical traits and acting pedigree.',
      content: `<p>As pre-production ramps up for the <strong>Legend of Zelda</strong> live-action adaptation, casting rumors are spreading like wildfire across Hyrule fan communities.</p><h3>The Hero & The Princess</h3><p>Insiders suggest that Nintendo and Sony are searching for an athletic, expressive, relatively fresh face to portray the silent hero <strong>Link</strong>, prioritizing non-verbal physical acting.</p><p>For <strong>Princess Zelda</strong>, names like <em>Saoirse Ronan</em> and <em>Hunter Schafer</em> are frequently discussed in fan-casting circles, with producers reportedly looking for someone who can balance royal grace with active, scientific curiosity.</p><h3>The Demon King</h3><p>As for the menacing <strong>Ganondorf</strong>, fans are clamoring for towering actors with dramatic intensity, with <em>Idris Elba</em> and <em>Jason Momoa</em> leading fan expectations. Wes Ball has hinted that the cast will feature a blend of established talent and exciting newcomers.</p>`,
      date: '2026-07-01',
      category: 'movie',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'n3',
      title: 'Zelda Symphonic Concert "Echoes of Hyrule" Announces 2026 Tour Dates',
      summary: 'A legendary concert tour featuring live orchestral arrangements of Koji Kondo\'s historic Zelda themes will tour major global arenas later this year.',
      content: `<p>Nintendo has officially announced <strong>"Echoes of Hyrule: The Legend of Zelda Concert Series"</strong> for late 2026.</p><p>The global tour will feature a <strong>90-piece symphony orchestra</strong> performing spectacular arrangements spanning the entire 40-year history of the series, created under the guidance of legendary composer Koji Kondo.</p><h3>Featured Games & Experiences</h3><ul><li>Breathtaking suites from <em>Ocarina of Time</em>, <em>Wind Waker</em>, <em>Breath of the Wild</em>, and <em>Tears of the Kingdom</em></li><li>High-definition gameplay footage projected onto a massive arena screen</li><li>Special VIP packages including replica Ocarina and collectible concert programs</li></ul>`,
      date: '2026-07-18',
      category: 'game',
      imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'n4',
      title: 'Community Spotlight: Fan-Made "Zelda Maker" Level Editor Gains Traction',
      summary: 'An incredibly detailed, non-profit fan project allows players to design their own 2D classic Zelda dungeons and share them with the club.',
      content: `<p>The Zelda fan community has done it again! A group of dedicated developers has released an alpha build of a non-commercial, copyright-friendly level editor inspired by classic 8-bit and 16-bit Zelda games, dubbed <strong>"Hyrule Builder"</strong>.</p><p>The engine allows users to place blocks, trigger switches, arrange puzzles, and customize custom dungeon bosses. Over <strong>5,000 fan dungeons</strong> have already been uploaded by creative players in the first 48 hours.</p>`,
      date: '2026-07-12',
      category: 'community',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    }
  ];

  const initialLore: LoreEntry[] = [
    {
      id: 'l1',
      title: 'The Master Sword',
      game: 'Skyward Sword / Ocarina of Time / Breath of the Wild',
      category: 'item',
      description: 'Forged originally as the Goddess Sword by the goddess Hylia, it was tempered by the Hero of the Skies using the three Sacred Flames to become the Master Sword. Known as the Blade of Evil\'s Bane, it is the only weapon capable of repelling demonic entities and sealing the Demon King Ganon. It rests in sacred pedestals across Hyrule\'s history, guarded by the Lost Woods or the Temple of Time.',
      imageUrl: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'l2',
      title: 'Princess Zelda',
      game: 'All Zelda Games',
      category: 'character',
      description: 'The mortal reincarnation of the Goddess Hylia and the princess of the Kingdom of Hyrule. Zelda is the bearer of the Triforce of Wisdom, granting her immense magical capabilities, prophetic dreams, and holy light. Far from a simple damsel in distress, Zelda is often a cunning commander, a skilled archer, a scholar of ancient technologies, or a mysterious disguise-artist (like Sheik or Tetra).',
      imageUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'l3',
      title: 'The Triforce',
      game: 'Ocarina of Time / A Link to the Past / Wind Waker',
      category: 'item',
      description: 'A sacred golden relic left behind by the Golden Goddesses—Din (Power), Nayru (Wisdom), and Farore (Courage)—after they created the realm of Hyrule. The Triforce grants any wish to whoever touches it, regardless of whether their intentions are good or evil. If touched by one who does not possess a balanced heart, it splits into three pieces, seeking those who best embody each specific trait.',
      imageUrl: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'l4',
      title: 'The Lost Woods',
      game: 'Ocarina of Time / Tears of the Kingdom',
      category: 'location',
      description: 'A mysterious, sprawling forest labyrinth that protects the Sacred Pedestal of the Master Sword. Travelers who enter without a guiding spirit or a pure heart find themselves hopelessly lost, eventually transforming into Kokiri forest spirits, skull kids, or wood-like monsters. In several eras, it is watched over by the ancient Great Deku Tree.',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'l5',
      title: 'The Hero of Time',
      game: 'Ocarina of Time / Majora\'s Mask',
      category: 'character',
      description: 'The legendary incarnation of the hero who pulled the Master Sword from the Pedestal of Time, sleeping for seven years until he was old enough to bear its power. Equipped with the Ocarina of Time, he traversed the streams of history to defeat Ganondorf, only to be sent back to his childhood by Zelda. He later embarked on a personal quest in the parallel land of Termina to stop the falling Moon.',
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    }
  ];

  const initialSubmissions: UserSubmission[] = [
    {
      id: 's1',
      author: 'KojiFan99',
      title: 'Orchestral Cover: Gerudo Valley (Classical Guitar & Violin)',
      type: 'video',
      contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'A fully orchestrated acoustic cover of the legendary Gerudo Valley theme. Recorded using custom Spanish guitars, violins, and a custom horn ensemble to capture that classic desert atmosphere!',
      date: '2026-07-16',
      tokenized: true,
      tokenDetails: {
        tokenId: '#ZELDA-0001',
        contractAddress: '0xTriforce8c4d613ff9ad4da788f57c12f1ace009',
        transactionHash: '0x7e44a7f0e3f225ab6823c9de59b9a528e18f2ab3e89a5023fa8c909ee898b92d',
        copyrightLicense: 'CC BY-NC-SA 4.0 (Attribution-NonCommercial-ShareAlike)',
        timestamp: '2026-07-16T14:30:00Z',
        royaltiesPercentage: 10,
        ownerAddress: '0xAustinGrA7X_AustinFanClubAddress',
      },
      likes: 42,
    },
    {
      id: 's2',
      author: 'MidnaArtist',
      title: 'Twilight Princess Landscape - Faron Woods in Oil',
      type: 'art',
      contentUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
      description: 'An oil painting of Faron Woods during the twilight twilight infection. Tried to highlight the eerie yellow twilight particle effects contrasting with the deep blues and greens of the forest canopy.',
      date: '2026-07-10',
      tokenized: false,
      likes: 29,
    },
    {
      id: 's3',
      author: 'HyruleScribe',
      title: 'The Hero\'s Burden: A Psychological Study of Link\'s Silence',
      type: 'literature',
      contentBody: `Link's silence has been a defining trait of The Legend of Zelda for four decades. While originally a technical limitation designed to facilitate player projection, modern entries—most notably Breath of the Wild—have retroactively integrated his silence into the game's actual lore.\n\nIn Zelda's diary, she reveals that Link carries an unbearable weight as the chosen Hero. He chooses to stay quiet because he feels that with so much pressure on his shoulders, it is best to silently endure rather than express his doubts or vulnerabilities. His silence is not a lack of character, but a armor of survival.\n\nThis study explores how this silence affects his relationships with Zelda, the Champions, and his own destiny...`,
      description: 'A deep-dive essay examining the narrative justification of Link\'s iconic quiet nature and its roots in Breath of the Wild lore.',
      date: '2026-07-14',
      tokenized: true,
      tokenDetails: {
        tokenId: '#ZELDA-0002',
        contractAddress: '0xTriforce8c4d613ff9ad4da788f57c12f1ace009',
        transactionHash: '0x8a92f03310b89cd183b92d09ef1b5a03bc58d04212ee56bb78fa9809ef8c8f02',
        copyrightLicense: 'CC0 1.0 Universal (Public Domain Dedication)',
        timestamp: '2026-07-14T09:15:00Z',
        royaltiesPercentage: 0,
        ownerAddress: '0xScribeAddress9921ab02f',
      },
      likes: 56,
    },
    {
      id: 's4',
      author: 'CosplayCrafter',
      title: 'Handcrafted Hylian Shield Replica (Fiberglass & Metal Trim)',
      type: 'memorabilia',
      contentUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80',
      description: 'Just completed this Hylian Shield replica! It weighs about 6 lbs, features a heavy-duty fiberglass base, laser-cut aluminum trim, and hand-painted triforce and crimson loftwing insignias. Includes genuine leather arm straps.',
      date: '2026-07-08',
      tokenized: false,
      likes: 74,
    }
  ];

  const initialSidebarBlocks: SidebarBlock[] = [
    {
      id: 'sb1',
      title: 'Royal Symphony Tour 🎵',
      type: 'text',
      content: 'The Royal Court Orchestra is touring across all provinces of Hyrule, performing classical melodies from the Ocarina of Time and Twilight Princess eras. Safe passage is guaranteed by the Royal Guard.',
      order: 1
    },
    {
      id: 'sb2',
      title: 'Sheikah Sensor Active 📡',
      type: 'html',
      content: `<div class="bg-blue-950/20 border border-blue-500/30 rounded p-3 text-blue-300 font-mono text-[11px] space-y-1">
  <p class="font-bold uppercase tracking-wider text-blue-400">▲ SHEIKAH NETWORK STATUS</p>
  <p>Core Frequency: 433.92 MHz</p>
  <p>Power Level: 94%</p>
  <p class="text-emerald-400">● Safe link to Royal Archives</p>
</div>`,
      order: 2
    },
    {
      id: 'sb3',
      title: 'Ancient Maps Repository 🗺️',
      type: 'link',
      content: 'View Interactive Map of Hyrule',
      linkUrl: 'https://www.zeldadungeon.net/breath-of-the-wild-interactive-map/',
      order: 3
    }
  ];

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<'news' | 'lore' | 'submissions' | 'guide' | 'admin'>('news');
  const [news, setNews] = useState<NewsItem[]>([]);

  // Admin Dashboard State
  const [adminSandbox, setAdminSandbox] = useState<boolean>(false);
  const isUserAdmin = !!user?.email && (user.email === 'AustinGrA7X@gmail.com' || adminSandbox) || adminSandbox;
  const [adminTab, setAdminTab] = useState<'news' | 'lore' | 'submissions' | 'sidebar'>('news');
  const [adminError, setAdminError] = useState<string>('');
  const [adminSuccess, setAdminSuccess] = useState<string>('');

  // Admin Sidebar Block Form State
  const [sidebarBlocks, setSidebarBlocks] = useState<SidebarBlock[]>([]);
  const [adminSidebarId, setAdminSidebarId] = useState<string>('');
  const [adminSidebarTitle, setAdminSidebarTitle] = useState<string>('');
  const [adminSidebarType, setAdminSidebarType] = useState<'text' | 'html' | 'link'>('text');
  const [adminSidebarContent, setAdminSidebarContent] = useState<string>('');
  const [adminSidebarLinkUrl, setAdminSidebarLinkUrl] = useState<string>('');
  const [adminSidebarOrder, setAdminSidebarOrder] = useState<number>(0);
  const [isEditingSidebar, setIsEditingSidebar] = useState<boolean>(false);
  
  // Admin News Form State
  const [adminNewsId, setAdminNewsId] = useState<string>('');
  const [adminNewsTitle, setAdminNewsTitle] = useState<string>('');
  const [adminNewsSummary, setAdminNewsSummary] = useState<string>('');
  const [adminNewsContent, setAdminNewsContent] = useState<string>('');
  const [adminNewsCategory, setAdminNewsCategory] = useState<'game' | 'movie' | 'community'>('movie');
  const [adminNewsImageUrl, setAdminNewsImageUrl] = useState<string>('');
  const [adminNewsGalleryImages, setAdminNewsGalleryImages] = useState<string[]>([]);
  const [customGalleryUrlInput, setCustomGalleryUrlInput] = useState<string>('');
  const [adminNewsDate, setAdminNewsDate] = useState<string>('');
  const [isEditingNews, setIsEditingNews] = useState<boolean>(false);
  const [adminNewsMode, setAdminNewsMode] = useState<'editor' | 'preview'>('editor');
  const newsFileInputRef = useRef<HTMLInputElement>(null);

  const handleInsertHtmlTag = (tagType: string) => {
    let snippet = '';
    switch (tagType) {
      case 'h3':
        snippet = '<h3>Section Heading</h3>\n';
        break;
      case 'p':
        snippet = '<p>Your paragraph content goes here...</p>\n';
        break;
      case 'bold':
        snippet = '<strong>Bold text</strong>';
        break;
      case 'italic':
        snippet = '<em>Italic text</em>';
        break;
      case 'link':
        snippet = '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link text</a>';
        break;
      case 'ul':
        snippet = '<ul>\n  <li>Key point 1</li>\n  <li>Key point 2</li>\n</ul>\n';
        break;
      case 'quote':
        snippet = '<blockquote>"Official quote or statement..."</blockquote>\n';
        break;
      case 'img':
        snippet = '<img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80" alt="News Image" />\n';
        break;
      case 'br':
        snippet = '<br/>\n';
        break;
      default:
        break;
    }
    setAdminNewsContent((prev) => prev + (prev && !prev.endsWith('\n') ? '\n' : '') + snippet);
  };

  // Admin Lore Form State
  const [adminLoreId, setAdminLoreId] = useState<string>('');
  const [adminLoreTitle, setAdminLoreTitle] = useState<string>('');
  const [adminLoreGame, setAdminLoreGame] = useState<string>('');
  const [adminLoreCategory, setAdminLoreCategory] = useState<'character' | 'item' | 'location' | 'era'>('character');
  const [adminLoreDescription, setAdminLoreDescription] = useState<string>('');
  const [adminLoreImageUrl, setAdminLoreImageUrl] = useState<string>('');
  const [isEditingLore, setIsEditingLore] = useState<boolean>(false);
  const [newsFilter, setNewsFilter] = useState<string>('all');
  const [expandedNews, setExpandedNews] = useState<string | null>(null);

  // Comments & Share State
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentsLoading, setCommentsLoading] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [shareNotification, setShareNotification] = useState<{ id: string; message: string } | null>(null);

  // Lore State
  const [lore, setLore] = useState<LoreEntry[]>([]);
  const [loreCategory, setLoreCategory] = useState<string>('all');
  const [loreSearch, setLoreSearch] = useState<string>('');

  // Submissions State
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [subTypeFilter, setSubTypeFilter] = useState<string>('all');
  const [activeCertificate, setActiveCertificate] = useState<TokenDetails | null>(null);
  
  // Submit Creation Form State
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [subType, setSubType] = useState<'art' | 'video' | 'literature' | 'review' | 'memorabilia'>('art');
  const [description, setDescription] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [contentBody, setContentBody] = useState('');
  const [tokenize, setTokenize] = useState(false);
  const [copyrightLicense, setCopyrightLicense] = useState('CC BY-NC-SA 4.0 (Attribution-NonCommercial-ShareAlike)');
  const [royaltiesPercentage, setRoyaltiesPercentage] = useState(10);
  const [isPosting, setIsPosting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // AI Game Guide / Rescue Me State
  const [rescueGame, setRescueGame] = useState('Ocarina of Time');
  const [rescuePrompt, setRescuePrompt] = useState('');
  const [rescueImage, setRescueImage] = useState<string | null>(null);
  const [isRescuing, setIsRescuing] = useState(false);
  const [rescueGuide, setRescueGuide] = useState<any | null>(null);
  const [rescueError, setRescueError] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  // File drag & drop reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loading quotes for the AI rescue assistant
  const loadingQuotes = [
    "Consulting the ancient Stone Tablets in the Temple of Time...",
    "Reawakening the seven legendary Sages of Hyrule...",
    "Analyzing topography with the Sheikah Slate eye...",
    "Decoding King Rhoam's historical transcripts...",
    "Plucking the strings of the Harp of Ages...",
    "Navigating the twists of the Lost Woods...",
    "Consulting the Great Deku Tree's memory database..."
  ];

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (firebaseUser?.displayName) {
        setAuthor(prev => prev || firebaseUser.displayName || '');
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchNews();
    fetchLore();
    fetchSubmissions();
    fetchSidebarBlocks();
  }, [user]);

  // Deep link router for sharing
  useEffect(() => {
    if (news.length === 0 && lore.length === 0 && submissions.length === 0) return;
    
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const idParam = params.get('id');
    
    if (tabParam && ['news', 'lore', 'submissions', 'guide'].includes(tabParam)) {
      setActiveTab(tabParam as any);
      if (tabParam === 'news' && idParam) {
        setExpandedNews(idParam);
        setTimeout(() => {
          const el = document.getElementById(`news-${idParam}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 600);
      } else if (tabParam === 'lore' && idParam) {
        setLoreSearch('');
        setLoreCategory('all');
        setTimeout(() => {
          const el = document.getElementById(`lore-${idParam}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-4', 'ring-zelda-gold', 'ring-offset-2');
            setTimeout(() => {
              el.classList.remove('ring-4', 'ring-zelda-gold', 'ring-offset-2');
            }, 5000);
          }
        }, 600);
      } else if (tabParam === 'submissions' && idParam) {
        setSubTypeFilter('all');
        setTimeout(() => {
          const el = document.getElementById(`submission-${idParam}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-4', 'ring-zelda-gold', 'ring-offset-2');
            setTimeout(() => {
              el.classList.remove('ring-4', 'ring-zelda-gold', 'ring-offset-2');
            }, 5000);
          }
        }, 600);
      }
    }
  }, [news.length, lore.length, submissions.length]);

  // Comments System Helper Functions
  const fetchComments = async (targetId: string) => {
    setCommentsLoading(prev => ({ ...prev, [targetId]: true }));
    try {
      const q = query(
        collection(db, 'comments'),
        where('targetId', '==', targetId)
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[];
      list.sort((a, b) => b.timestamp - a.timestamp);
      setComments(prev => ({ ...prev, [targetId]: list }));
    } catch (e) {
      console.error('Error fetching comments:', e);
    } finally {
      setCommentsLoading(prev => ({ ...prev, [targetId]: false }));
    }
  };

  const handleAddComment = async (targetId: string, targetType: 'news' | 'lore' | 'submission', e: React.FormEvent) => {
    e.preventDefault();
    const commentText = newCommentText[targetId]?.trim();
    if (!commentText) return;

    if (!user) {
      alert("Please authenticate to post your comment.");
      handleLogin();
      return;
    }

    try {
      const commentId = `c_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      const nowStr = new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const newComment: Comment = {
        id: commentId,
        targetId,
        targetType,
        authorName: user.displayName || user.email || 'Anonymous Ally',
        authorId: user.uid,
        authorPhoto: user.photoURL || undefined,
        content: commentText,
        date: nowStr,
        timestamp: Date.now()
      };

      await setDoc(doc(db, 'comments', commentId), newComment);

      setNewCommentText(prev => ({ ...prev, [targetId]: '' }));

      setComments(prev => {
        const existing = prev[targetId] || [];
        return { ...prev, [targetId]: [newComment, ...existing] };
      });
    } catch (err) {
      console.error('Error writing comment:', err);
      handleFirestoreError(err, OperationType.CREATE, `comments`);
    }
  };

  const handleDeleteComment = async (targetId: string, commentId: string) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to retract your comment from this scroll?")) return;

    try {
      await deleteDoc(doc(db, 'comments', commentId));
      setComments(prev => {
        const existing = prev[targetId] || [];
        return { ...prev, [targetId]: existing.filter(c => c.id !== commentId) };
      });
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleShare = async (tab: string, id: string, title: string) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?tab=${tab}&id=${id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareNotification({ id, message: 'Link copied! Share the legend with your allies.' });
      setTimeout(() => {
        setShareNotification(null);
      }, 4000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Royal Hyrule Fan Club - ${title}`,
          text: `Check out this legendary content on the Royal Hyrule Fan Club: "${title}"`,
          url: shareUrl,
        });
      } catch (err) {
        // Ignored
      }
    }
  };

  // Login & Logout Handlers
  const handleLogin = async () => {
    setAuthError('');
    setIsAuthModalOpen(true);
  };

  const handleProviderLogin = async (providerName: 'google' | 'facebook' | 'github' | 'twitter') => {
    setAuthError('');
    setAuthLoadingState(true);
    let provider;
    if (providerName === 'google') provider = googleProvider;
    else if (providerName === 'facebook') provider = facebookProvider;
    else if (providerName === 'github') provider = githubProvider;
    else if (providerName === 'twitter') provider = twitterProvider;
    
    if (!provider) {
      setAuthError('Specified provider was not loaded correctly.');
      setAuthLoadingState(false);
      return;
    }

    try {
      await signInWithPopup(auth, provider);
      setIsAuthModalOpen(false);
    } catch (e: any) {
      console.error(`${providerName} login error:`, e);
      if (e.code === 'auth/operation-not-allowed') {
        setAuthError(`This provider (${providerName}) is currently not enabled in your Firebase project. To enable it, visit Firebase Console -> Authentication -> Sign-in method. You can test immediately using Email & Password, Web3 Wallet connection, or Google Login (if pre-configured)!`);
      } else if (e.code === 'auth/unauthorized-domain') {
        setAuthError(`This domain is not authorized for OAuth operations. To fix this, please visit Firebase Console -> Authentication -> Settings -> Authorized domains, and add this app's URL.`);
      } else if (e.code === 'auth/popup-blocked') {
        setAuthError('The authentication popup was blocked by your browser. Please allow popups for this site.');
      } else {
        setAuthError(e.message || `An error occurred while logging in with ${providerName}.`);
      }
    } finally {
      setAuthLoadingState(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please fill in both email and password.');
      return;
    }
    setAuthLoadingState(true);
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      setIsAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password. Please verify your credentials or create a new account.');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('The email address is badly formatted.');
      } else {
        setAuthError(err.message || 'An error occurred during sign-in.');
      }
    } finally {
      setAuthLoadingState(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authDisplayName.trim()) {
      setAuthError('Please enter a Display Name.');
      return;
    }
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please fill in all fields.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('The password must be at least 6 characters.');
      return;
    }
    setAuthLoadingState(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      await updateProfile(userCredential.user, {
        displayName: authDisplayName,
      });
      setUser({
        ...userCredential.user,
        displayName: authDisplayName
      } as any);
      setIsAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthDisplayName('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('This email is already associated with an account.');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('The password must be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('The email address is badly formatted.');
      } else {
        setAuthError(err.message || 'An error occurred during account creation.');
      }
    } finally {
      setAuthLoadingState(false);
    }
  };

  const handleWeb3Connect = async () => {
    setAuthError('');
    setWeb3Connecting(true);
    try {
      const anyWindow = window as any;
      if (!anyWindow.ethereum) {
        throw new Error('No Web3 wallet extension (e.g. MetaMask) detected in this browser.');
      }
      
      const accounts = await anyWindow.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length === 0) {
        throw new Error('No accounts returned from the wallet.');
      }
      
      const address = accounts[0];
      setWeb3Address(address);
      
      const message = `Welcome to the Royal Hyrule Fan Club!\n\nTo authenticate your hero identity, sign this sacred scroll with your wallet key.\n\nWallet Address: ${address}\nTimestamp: ${Date.now()}`;
      
      const signature = await anyWindow.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });
      
      if (!signature) {
        throw new Error('Signature request declined.');
      }
      
      const userCredential = await signInAnonymously(auth);
      const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
      const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;
      
      await updateProfile(userCredential.user, {
        displayName: `Hero ${shortAddress}`,
        photoURL: avatarUrl,
      });
      
      setUser({
        ...userCredential.user,
        displayName: `Hero ${shortAddress}`,
        photoURL: avatarUrl,
      } as any);
      
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Web3 connection failed. Use our Pocket Ledger fallback below if you are in a restricted environment!');
    } finally {
      setWeb3Connecting(false);
    }
  };

  const handleSimulatedWeb3Connect = async (walletName: string) => {
    setAuthError('');
    setWeb3Connecting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    try {
      const randomHex = Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      const address = `0x${randomHex.substring(0, 4)}...${randomHex.substring(36)}`;
      
      const userCredential = await signInAnonymously(auth);
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${address}`;
      const displayName = `Hero ${walletName} (${address})`;
      
      await updateProfile(userCredential.user, {
        displayName,
        photoURL: avatarUrl,
      });
      
      setUser({
        ...userCredential.user,
        displayName,
        photoURL: avatarUrl,
      } as any);
      
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setAuthError(err.message || 'Simulated Web3 connection failed.');
    } finally {
      setWeb3Connecting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Cycle loading quotes when rescuing is true
  useEffect(() => {
    let interval: any;
    if (isRescuing) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingQuotes.length);
      }, 3500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isRescuing]);

  const fetchNews = async () => {
    try {
      const q = query(collection(db, 'news'));
      const snapshot = await getDocs(q);
      let list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NewsItem[];
      
      if (list.length === 0) {
        list = initialNews;
        if (isUserAdmin) {
          for (const item of initialNews) {
            await setDoc(doc(db, 'news', item.id), item);
          }
        }
      }
      setNews(list);
    } catch (e) {
      console.error('Error fetching news:', e);
      setNews(initialNews);
    }
  };

  const fetchLore = async () => {
    try {
      const q = query(collection(db, 'lore'));
      const snapshot = await getDocs(q);
      let list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LoreEntry[];
      
      if (list.length === 0) {
        list = initialLore;
        if (isUserAdmin) {
          for (const item of initialLore) {
            await setDoc(doc(db, 'lore', item.id), item);
          }
        }
      }
      setLore(list);
    } catch (e) {
      console.error('Error fetching lore:', e);
      setLore(initialLore);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const q = query(collection(db, 'submissions'));
      const snapshot = await getDocs(q);
      let list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserSubmission[];
      
      if (list.length === 0) {
        list = initialSubmissions;
        if (isUserAdmin) {
          for (const item of initialSubmissions) {
            await setDoc(doc(db, 'submissions', item.id), item);
          }
        }
      }
      list.sort((a, b) => b.id.localeCompare(a.id));
      setSubmissions(list);
    } catch (e) {
      console.error('Error fetching submissions:', e);
      setSubmissions(initialSubmissions);
    }
  };

  const fetchSidebarBlocks = async () => {
    try {
      const q = query(collection(db, 'sidebarBlocks'));
      const snapshot = await getDocs(q);
      let list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SidebarBlock[];
      
      if (list.length === 0) {
        try {
          const apiRes = await fetch('/api/sidebarBlocks');
          if (apiRes.ok) {
            const apiData = await apiRes.json();
            if (Array.isArray(apiData) && apiData.length > 0) {
              list = apiData;
            }
          }
        } catch (apiErr) {
          console.warn('API fetch for sidebar blocks failed:', apiErr);
        }

        if (list.length === 0) {
          list = initialSidebarBlocks;
        }

        if (isUserAdmin && user) {
          for (const item of list) {
            try {
              await setDoc(doc(db, 'sidebarBlocks', item.id), item);
            } catch (err) {
              // Ignore seed permission warnings in sandbox
            }
          }
        }
      }
      list.sort((a, b) => a.order - b.order);
      setSidebarBlocks(list);
    } catch (e) {
      console.error('Error fetching sidebar blocks from Firestore, trying API fallback:', e);
      try {
        const apiRes = await fetch('/api/sidebarBlocks');
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (Array.isArray(apiData)) {
            setSidebarBlocks(apiData.sort((a, b) => a.order - b.order));
            return;
          }
        }
      } catch (apiErr) {
        console.warn('API fallback for sidebar blocks failed:', apiErr);
      }
      setSidebarBlocks(initialSidebarBlocks);
    }
  };

  const handleSaveSidebar = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (!adminSidebarTitle.trim()) {
      setAdminError('Subject Title is required.');
      return;
    }
    if (!adminSidebarContent.trim()) {
      setAdminError('Content body is required.');
      return;
    }
    if (adminSidebarType === 'link' && !adminSidebarLinkUrl.trim()) {
      setAdminError('Link URL is required for Link type.');
      return;
    }

    try {
      const blockId = isEditingSidebar ? adminSidebarId : `sb_${Date.now()}`;
      const data: SidebarBlock = {
        id: blockId,
        title: adminSidebarTitle.trim(),
        type: adminSidebarType,
        content: adminSidebarContent.trim(),
        order: Number(adminSidebarOrder) || 0,
      };

      if (adminSidebarType === 'link') {
        data.linkUrl = adminSidebarLinkUrl.trim();
      }

      // 1. Try Firestore write directly if signed in
      let firestoreSuccess = false;
      if (user) {
        try {
          await setDoc(doc(db, 'sidebarBlocks', blockId), data);
          firestoreSuccess = true;
        } catch (fsErr) {
          console.warn('Firestore write for sidebar block rejected (fallback to REST API & local state):', fsErr);
        }
      }

      // 2. Sync with REST API
      try {
        const endpoint = isEditingSidebar ? `/api/sidebarBlocks/${blockId}` : '/api/sidebarBlocks';
        const method = isEditingSidebar ? 'PUT' : 'POST';
        await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (apiErr) {
        console.warn('Backend API sync for sidebar block failed:', apiErr);
      }

      // 3. Update local state immediately
      setSidebarBlocks((prev) => {
        const exists = prev.some((b) => b.id === blockId);
        const updated = exists
          ? prev.map((b) => (b.id === blockId ? data : b))
          : [...prev, data];
        return updated.sort((a, b) => a.order - b.order);
      });

      setAdminSuccess(isEditingSidebar ? 'Sidebar block updated successfully!' : 'New sidebar block created!');
      handleResetSidebarForm();
    } catch (err) {
      console.error('Error saving sidebar block:', err);
      setAdminError('Error saving sidebar block: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleResetSidebarForm = () => {
    setAdminSidebarId('');
    setAdminSidebarTitle('');
    setAdminSidebarType('text');
    setAdminSidebarContent('');
    setAdminSidebarLinkUrl('');
    setAdminSidebarOrder(0);
    setIsEditingSidebar(false);
  };

  const handleEditSidebarClick = (block: SidebarBlock) => {
    setAdminSidebarId(block.id);
    setAdminSidebarTitle(block.title);
    setAdminSidebarType(block.type);
    setAdminSidebarContent(block.content);
    setAdminSidebarLinkUrl(block.linkUrl || '');
    setAdminSidebarOrder(block.order);
    setIsEditingSidebar(true);
    setAdminTab('sidebar');
  };

  const handleDeleteSidebar = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to banish the sidebar block "${title}"?`)) return;
    setAdminError('');
    setAdminSuccess('');
    try {
      if (user) {
        try {
          await deleteDoc(doc(db, 'sidebarBlocks', id));
        } catch (fsErr) {
          console.warn('Firestore delete rejected by rules:', fsErr);
        }
      }

      try {
        await fetch(`/api/sidebarBlocks/${id}`, { method: 'DELETE' });
      } catch (apiErr) {
        console.warn('Backend API delete failed:', apiErr);
      }

      setSidebarBlocks((prev) => prev.filter((b) => b.id !== id));
      setAdminSuccess(`Sidebar block "${title}" has been banished successfully.`);
    } catch (err) {
      console.error('Error deleting sidebar block:', err);
      setAdminError('Error deleting sidebar block: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Like a submission
  const handleLike = async (id: string) => {
    if (!user) {
      alert("Please authenticate to like creations.");
      handleLogin();
      return;
    }
    try {
      const submissionRef = doc(db, 'submissions', id);
      const currentSub = submissions.find(s => s.id === id);
      if (!currentSub) return;
      
      const newLikes = (currentSub.likes || 0) + 1;
      
      try {
        await updateDoc(submissionRef, {
          likes: newLikes
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `submissions/${id}`);
      }

      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, likes: newLikes } : s));
    } catch (e) {
      console.error('Error liking submission:', e);
    }
  };

  // Handle new submission creation
  const handlePostSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!user) {
      setFormError('You must be signed in or authenticated to post submissions.');
      handleLogin();
      return;
    }

    if (!author.trim() || !title.trim() || !description.trim()) {
      setFormError('Please fill in all required fields (Author, Title, and Description).');
      return;
    }

    if (subType === 'literature' && !contentBody.trim()) {
      setFormError('Please write your literature text in the content body.');
      return;
    }

    setIsPosting(true);
    try {
      const newId = `s${submissions.length + 1}_${Date.now()}`;
      const now = new Date().toISOString();

      let tokenDetails: TokenDetails | undefined;
      if (tokenize) {
        tokenDetails = {
          tokenId: `#ZELDA-${Math.floor(1000 + Math.random() * 9000)}`,
          contractAddress: '0xTriforce8c4d613ff9ad4da788f57c12f1ace009',
          transactionHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          copyrightLicense: copyrightLicense || 'CC BY-NC-SA 4.0',
          timestamp: now,
          royaltiesPercentage: Number(royaltiesPercentage) || 0,
          ownerAddress: user.uid,
        };
      }

      const newSubmission: UserSubmission = {
        id: newId,
        author: author.trim(),
        title: title.trim(),
        type: subType,
        description: description.trim(),
        contentUrl: subType !== 'literature' ? contentUrl.trim() : undefined,
        contentBody: subType === 'literature' ? contentBody.trim() : undefined,
        date: now.split('T')[0],
        tokenized: !!tokenize,
        likes: 0,
      };

      if (tokenDetails) {
        newSubmission.tokenDetails = tokenDetails;
      }

      try {
        await setDoc(doc(db, 'submissions', newId), newSubmission);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `submissions/${newId}`);
      }

      await fetchSubmissions();
      setFormSuccess(true);
      setTitle('');
      setDescription('');
      setContentUrl('');
      setContentBody('');
      setTokenize(false);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while posting.');
    } finally {
      setIsPosting(false);
    }
  };

  // Handle Rescue Me execution
  const handleRescueMe = async (e: React.FormEvent) => {
    e.preventDefault();
    setRescueError('');
    setRescueGuide(null);

    if (!rescuePrompt.trim()) {
      setRescueError('Please describe where you are stuck so the Sages can assist you!');
      return;
    }

    setIsRescuing(true);
    try {
      const response = await fetch('/api/rescue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: rescuePrompt,
          game: rescueGame,
          image: rescueImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'The ancient sages are currently unreachable.');
      }

      const data = await response.json();
      setRescueGuide(data);
    } catch (err: any) {
      setRescueError(err.message || 'Could not connect to the sacred database. Try again.');
    } finally {
      setIsRescuing(false);
    }
  };

  // Handle screenshot uploading
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRescueImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Text to speech implementation
  const handleSpeakWalkthrough = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel active speaking
      window.speechSynthesis.cancel();
      // Clean up markdown tags for speech
      const cleanText = text.replace(/[#*`_\[\]()\-]/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText.substring(0, 400)); // Limit length to avoid infinite speaking
      utterance.rate = 1.0;
      utterance.pitch = 0.95; // Slightly deeper sage-like voice
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  // File Drag & Drop Handlers for Screenshot
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRescueImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle checklist items in guide
  const toggleChecklistItem = (itemId: string) => {
    if (!rescueGuide) return;
    setRescueGuide({
      ...rescueGuide,
      itemsChecklist: rescueGuide.itemsChecklist.map((item: any) => 
        item.id === itemId ? { ...item, obtained: !item.obtained } : item
      )
    });
  };

  // Add custom checklist item
  const [customItemText, setCustomItemText] = useState('');
  const addCustomChecklistItem = () => {
    if (!customItemText.trim() || !rescueGuide) return;
    const newItem = {
      id: `custom-${Date.now()}`,
      item: customItemText.trim(),
      location: 'Custom Fan Quest Note',
      obtained: false
    };
    setRescueGuide({
      ...rescueGuide,
      itemsChecklist: [...rescueGuide.itemsChecklist, newItem]
    });
    setCustomItemText('');
  };

  // Admin Variables & Handlers

  const newsImagePresets = [
    { name: 'Wes Ball Miyazaki Vibe', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80' },
    { name: 'Casting Rumors Trio', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80' },
    { name: 'Symphonic Tour Orchestral', url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80' },
    { name: 'Dungeon Level Editor', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Temple of Time Ruins', url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Sacred Grove Triforce', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80' },
  ];

  const loreImagePresets = [
    { name: 'Master Sword Blade', url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Princess Zelda Portrait', url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Gold Triforce Relic', url: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&q=80' },
    { name: 'Lost Woods Forest', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Hero of Time Chronology', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80' },
  ];

  // News Image & Gallery File Upload Handlers
  const handleNewsFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (result) {
            setAdminNewsGalleryImages((prev) => {
              if (!prev.includes(result)) {
                return [...prev, result];
              }
              return prev;
            });
            setAdminNewsImageUrl((prevCover) => (prevCover.trim() ? prevCover : result));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSetCoverImage = (url: string) => {
    setAdminNewsImageUrl(url);
  };

  const handleAddGalleryUrl = () => {
    if (!customGalleryUrlInput.trim()) return;
    const url = customGalleryUrlInput.trim();
    setAdminNewsGalleryImages((prev) => [...prev, url]);
    if (!adminNewsImageUrl.trim()) {
      setAdminNewsImageUrl(url);
    }
    setCustomGalleryUrlInput('');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setAdminNewsGalleryImages((prev) => {
      const removedUrl = prev[indexToRemove];
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (removedUrl === adminNewsImageUrl) {
        setAdminNewsImageUrl(updated[0] || '');
      }
      return updated;
    });
  };

  // Reset Forms
  const handleResetNewsForm = () => {
    setAdminNewsId('');
    setAdminNewsTitle('');
    setAdminNewsSummary('');
    setAdminNewsContent('');
    setAdminNewsCategory('movie');
    setAdminNewsImageUrl('');
    setAdminNewsGalleryImages([]);
    setCustomGalleryUrlInput('');
    setAdminNewsDate('');
    setIsEditingNews(false);
  };

  const handleResetLoreForm = () => {
    setAdminLoreId('');
    setAdminLoreTitle('');
    setAdminLoreGame('');
    setAdminLoreCategory('character');
    setAdminLoreDescription('');
    setAdminLoreImageUrl('');
    setIsEditingLore(false);
  };

  // Add/Edit News Item
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (!adminNewsTitle.trim() || !adminNewsSummary.trim() || !adminNewsContent.trim() || !adminNewsImageUrl.trim()) {
      setAdminError('Please fill in all news fields including a primary cover image.');
      return;
    }

    const id = isEditingNews ? adminNewsId : `n_${Date.now()}`;
    const dateStr = adminNewsDate || new Date().toISOString().split('T')[0];

    // Ensure cover image is included in gallery
    let finalGallery = [...adminNewsGalleryImages];
    if (adminNewsImageUrl.trim() && !finalGallery.includes(adminNewsImageUrl.trim())) {
      finalGallery.unshift(adminNewsImageUrl.trim());
    }

    const itemData: NewsItem = {
      id,
      title: adminNewsTitle.trim(),
      summary: adminNewsSummary.trim(),
      content: adminNewsContent.trim(),
      category: adminNewsCategory,
      imageUrl: adminNewsImageUrl.trim(),
      galleryImages: finalGallery,
      date: dateStr,
    };

    try {
      // 1. Try to save to Firestore directly if signed in
      let firestoreSuccess = false;
      if (user) {
        try {
          await setDoc(doc(db, 'news', id), itemData);
          firestoreSuccess = true;
        } catch (fsErr) {
          console.warn('Firestore write rejected by rules (expected for sandbox modes):', fsErr);
        }
      }

      // 2. Sync to the Backend REST API
      try {
        const endpoint = isEditingNews ? `/api/news/${id}` : '/api/news';
        const method = isEditingNews ? 'PUT' : 'POST';
        const apiRes = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        if (!apiRes.ok && !firestoreSuccess) {
          throw new Error('Failed to save to backend database');
        }
      } catch (apiErr) {
        console.warn('Backend API sync failed:', apiErr);
      }

      // 3. Update client state
      if (isEditingNews) {
        setNews(prev => prev.map(n => n.id === id ? itemData : n));
        setAdminSuccess(`Chronicle "${adminNewsTitle}" successfully engraved and updated!`);
      } else {
        setNews(prev => [itemData, ...prev]);
        setAdminSuccess(`Chronicle "${adminNewsTitle}" successfully added to the library!`);
      }

      handleResetNewsForm();
    } catch (err: any) {
      setAdminError(err.message || 'Failed to engrave chronicle.');
    }
  };

  // Delete News Item
  const handleDeleteNews = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to banish the chronicle "${title}" forever?`)) return;
    setAdminError('');
    setAdminSuccess('');

    try {
      let firestoreSuccess = false;
      if (user) {
        try {
          await deleteDoc(doc(db, 'news', id));
          firestoreSuccess = true;
        } catch (fsErr) {
          console.warn('Firestore delete failed:', fsErr);
        }
      }

      try {
        const apiRes = await fetch(`/api/news/${id}`, { method: 'DELETE' });
        if (!apiRes.ok && !firestoreSuccess) {
          throw new Error('Failed to delete from backend API');
        }
      } catch (apiErr) {
        console.warn('Backend API delete failed:', apiErr);
      }

      setNews(prev => prev.filter(n => n.id !== id));
      setAdminSuccess(`Chronicle "${title}" banished from the kingdom.`);
    } catch (err: any) {
      setAdminError(err.message || 'Failed to delete chronicle.');
    }
  };

  const handleEditNewsClick = (item: NewsItem) => {
    setAdminNewsId(item.id);
    setAdminNewsTitle(item.title);
    setAdminNewsSummary(item.summary);
    setAdminNewsContent(item.content);
    setAdminNewsCategory(item.category);
    setAdminNewsImageUrl(item.imageUrl);
    
    const gallery = item.galleryImages && item.galleryImages.length > 0 
      ? item.galleryImages 
      : (item.imageUrl ? [item.imageUrl] : []);
    setAdminNewsGalleryImages(gallery);

    setAdminNewsDate(item.date);
    setIsEditingNews(true);
    setAdminError('');
    setAdminSuccess('');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Add/Edit Lore Entry
  const handleSaveLore = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (!adminLoreTitle.trim() || !adminLoreGame.trim() || !adminLoreDescription.trim() || !adminLoreImageUrl.trim()) {
      setAdminError('Please fill in all lore fields.');
      return;
    }

    const id = isEditingLore ? adminLoreId : `l_${Date.now()}`;

    const entryData: LoreEntry = {
      id,
      title: adminLoreTitle.trim(),
      game: adminLoreGame.trim(),
      category: adminLoreCategory,
      description: adminLoreDescription.trim(),
      imageUrl: adminLoreImageUrl.trim(),
    };

    try {
      let firestoreSuccess = false;
      if (user) {
        try {
          await setDoc(doc(db, 'lore', id), entryData);
          firestoreSuccess = true;
        } catch (fsErr) {
          console.warn('Firestore write failed:', fsErr);
        }
      }

      try {
        const endpoint = isEditingLore ? `/api/lore/${id}` : '/api/lore';
        const method = isEditingLore ? 'PUT' : 'POST';
        const apiRes = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData),
        });
        if (!apiRes.ok && !firestoreSuccess) {
          throw new Error('Failed to save to backend API');
        }
      } catch (apiErr) {
        console.warn('Backend API sync failed:', apiErr);
      }

      if (isEditingLore) {
        setLore(prev => prev.map(l => l.id === id ? entryData : l));
        setAdminSuccess(`Lore entry "${adminLoreTitle}" successfully compiled and updated!`);
      } else {
        setLore(prev => [entryData, ...prev]);
        setAdminSuccess(`Lore entry "${adminLoreTitle}" successfully added to the Royal Archives!`);
      }

      handleResetLoreForm();
    } catch (err: any) {
      setAdminError(err.message || 'Failed to save lore entry.');
    }
  };

  // Delete Lore Entry
  const handleDeleteLore = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the lore entry "${title}"?`)) return;
    setAdminError('');
    setAdminSuccess('');

    try {
      let firestoreSuccess = false;
      if (user) {
        try {
          await deleteDoc(doc(db, 'lore', id));
          firestoreSuccess = true;
        } catch (fsErr) {
          console.warn('Firestore delete failed:', fsErr);
        }
      }

      try {
        const apiRes = await fetch(`/api/lore/${id}`, { method: 'DELETE' });
        if (!apiRes.ok && !firestoreSuccess) {
          throw new Error('Failed to delete from backend API');
        }
      } catch (apiErr) {
        console.warn('Backend API delete failed:', apiErr);
      }

      setLore(prev => prev.filter(l => l.id !== id));
      setAdminSuccess(`Lore entry "${title}" erased from memory.`);
    } catch (err: any) {
      setAdminError(err.message || 'Failed to delete lore.');
    }
  };

  const handleEditLoreClick = (entry: LoreEntry) => {
    setAdminLoreId(entry.id);
    setAdminLoreTitle(entry.title);
    setAdminLoreGame(entry.game);
    setAdminLoreCategory(entry.category);
    setAdminLoreDescription(entry.description);
    setAdminLoreImageUrl(entry.imageUrl);
    setIsEditingLore(true);
    setAdminError('');
    setAdminSuccess('');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Moderate Submissions (Banish)
  const handleDeleteSubmission = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to moderate and permanently delete the submission "${title}"?`)) return;
    setAdminError('');
    setAdminSuccess('');

    try {
      let firestoreSuccess = false;
      if (user) {
        try {
          await deleteDoc(doc(db, 'submissions', id));
          firestoreSuccess = true;
        } catch (fsErr) {
          console.warn('Firestore delete failed:', fsErr);
        }
      }

      try {
        const apiRes = await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
        if (!apiRes.ok && !firestoreSuccess) {
          throw new Error('Failed to delete submission from backend API');
        }
      } catch (apiErr) {
        console.warn('Backend API delete failed:', apiErr);
      }

      setSubmissions(prev => prev.filter(s => s.id !== id));
      setAdminSuccess(`Submission "${title}" successfully moderated.`);
    } catch (err: any) {
      setAdminError(err.message || 'Failed to moderate submission.');
    }
  };

  // Filtered lists
  const filteredNews = news.filter(item => {
    if (newsFilter === 'all') return true;
    return item.category === newsFilter;
  });

  const filteredLore = lore.filter(item => {
    const matchesCategory = loreCategory === 'all' || item.category === loreCategory;
    const matchesSearch = item.title.toLowerCase().includes(loreSearch.toLowerCase()) || 
                          item.description.toLowerCase().includes(loreSearch.toLowerCase()) ||
                          item.game.toLowerCase().includes(loreSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredSubmissions = submissions.filter(item => {
    if (subTypeFilter === 'all') return true;
    return item.type === subTypeFilter;
  });

  return (
    <div className="min-h-screen bg-zelda-green-deep text-zelda-charcoal font-sans flex flex-col selection:bg-zelda-gold selection:text-white">
      
      {/* HEADER SECTION */}
      <header className="relative bg-zelda-green-forest pt-8 pb-6 px-4 md:px-8 border-b-4 border-zelda-gold shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,134,11,0.12),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand/Title */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="relative animate-float">
              <div className="w-14 h-14 bg-zelda-gold flex items-center justify-center transform rotate-45 shadow-md border-2 border-white/20">
                <div className="transform -rotate-45 font-serif text-2xl font-bold text-white">
                  ▲
                </div>
              </div>
              <div className="absolute -top-1 -right-1 bg-zelda-gold-dark text-white text-[9px] font-bold px-1.5 rounded-full py-0.5 border border-white animate-pulse">
                FAN
              </div>
            </div>

            <div>
              <h1 className="font-serif text-2xl md:text-4xl font-extrabold tracking-wider text-white uppercase">
                The Legend of Zelda
              </h1>
              <p className="font-sans text-xs md:text-sm tracking-widest text-[#EAE2CF] uppercase mt-1 font-semibold">
                Fan Club Platform & AI Rescue Sanctum
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Sandbox Admin Access Controller */}
            <div className="flex items-center gap-3 bg-black/40 border border-zelda-gold/30 rounded-xl px-4 py-2.5 shadow-inner">
              <Shield className={`w-5 h-5 ${adminSandbox ? 'text-zelda-gold animate-pulse' : 'text-gray-500'}`} />
              <div className="text-left">
                <div className="text-[9px] text-gray-400 uppercase tracking-widest font-mono">Sandbox Powers</div>
                <button
                  type="button"
                  onClick={() => {
                    setAdminSandbox(!adminSandbox);
                    if (!adminSandbox) {
                      setAdminSuccess('Sandbox Admin status granted! Welcome to the Royal Archives.');
                    } else {
                      setAdminSuccess('Sandbox Admin status revoked.');
                      if (activeTab === 'admin') {
                        setActiveTab('news');
                      }
                    }
                  }}
                  className={`text-xs font-serif font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    adminSandbox ? 'text-zelda-gold hover:text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {adminSandbox ? 'Admin Mode: ON 👑' : 'Admin Mode: OFF ⚔️'}
                </button>
              </div>
            </div>

            {/* Core App Info Indicator */}
            <div className="hidden lg:flex items-center gap-4 bg-black/20 border border-white/10 rounded-xl px-4 py-2.5">
              <Compass className="w-5 h-5 text-zelda-gold" />
              <div className="text-left">
                <div className="text-[10px] text-gray-300 uppercase tracking-widest font-mono">Live Movie Tracker</div>
                <div className="text-xs font-semibold text-[#EAE2CF] font-serif">Wes Ball Vision &bull; Miyazaki Vibe</div>
              </div>
            </div>

            {/* User Authentication Panel */}
            <div className="flex items-center gap-4 bg-black/20 border border-white/10 rounded-xl px-4 py-2.5">
              {authLoading ? (
                <div className="text-xs text-gray-400 font-mono">Authenticating...</div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-zelda-gold" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zelda-gold flex items-center justify-center font-bold text-white text-sm">
                      {user.displayName ? user.displayName.substring(0, 1) : 'U'}
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-[10px] text-gray-300 uppercase tracking-widest font-mono">Hero Authenticated</div>
                    <div className="text-xs font-semibold text-[#EAE2CF] font-serif max-w-[120px] truncate">{user.displayName || user.email}</div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="ml-2 text-[10px] bg-red-600/35 hover:bg-red-600/60 text-white font-semibold font-serif uppercase tracking-wider py-1 px-2 rounded border border-red-500/30 transition-all cursor-pointer"
                  >
                    Leave
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-gray-300 uppercase tracking-widest font-mono">Join the Sanctuary</div>
                    <button 
                      onClick={handleLogin}
                      className="text-xs font-bold text-[#EAE2CF] font-serif uppercase tracking-widest hover:text-white flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      Authenticate ▲
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-8 flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
          <button 
            id="tab-news"
            onClick={() => { setActiveTab('news'); setExpandedNews(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-serif font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'news' 
                ? 'bg-zelda-gold text-white border-b-2 border-zelda-gold shadow-md font-bold' 
                : 'bg-black/20 hover:bg-black/40 border border-white/10 text-[#F4EFE1]'
            }`}
          >
            <Film className="w-4 h-4" />
            News & Live Movie Hub
          </button>

          <button 
            id="tab-lore"
            onClick={() => setActiveTab('lore')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-serif font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'lore' 
                ? 'bg-zelda-gold text-white border-b-2 border-zelda-gold shadow-md font-bold' 
                : 'bg-black/20 hover:bg-black/40 border border-white/10 text-[#F4EFE1]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Lore Labyrinth
          </button>

          <button 
            id="tab-submissions"
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-serif font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'submissions' 
                ? 'bg-zelda-gold text-white border-b-2 border-zelda-gold shadow-md font-bold' 
                : 'bg-black/20 hover:bg-black/40 border border-white/10 text-[#F4EFE1]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Royal Fan Creator Club
          </button>

          <button 
            id="tab-guide"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-serif font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'guide' 
                ? 'bg-white text-zelda-green-forest shadow-md border-2 border-zelda-gold font-bold' 
                : 'bg-black/20 hover:bg-black/40 border border-white/10 text-[#F4EFE1]'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-zelda-gold" />
            Sheikah Slate AI Guide
          </button>

          {isUserAdmin && (
            <button 
              id="tab-admin"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-serif font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'admin' 
                  ? 'bg-gradient-to-r from-zelda-green-forest to-[#0d1e15] text-[#F4EFE1] border-2 border-zelda-gold shadow-lg font-bold' 
                  : 'bg-yellow-950/20 hover:bg-yellow-950/40 border border-zelda-gold/30 text-zelda-gold'
              }`}
            >
              <Shield className="w-4 h-4 text-zelda-gold" />
              Admin Sanctum 👑
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT SPACE */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8">
        
        {/* TAB 1: NEWS & LIVE MOVIE HUB */}
        {activeTab === 'news' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-8"
          >
            {/* News Filter and Heading */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-b border-zelda-border-sand/40 pb-4">
              <h3 className="font-serif text-xl font-bold tracking-wider text-zelda-charcoal uppercase flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-zelda-green-forest" />
                Latest Chronicles & Press Releases
              </h3>
              
              <div className="flex flex-wrap gap-2 bg-zelda-beige-card p-1 rounded-lg border border-zelda-border-sand">
                {['all', 'movie', 'game', 'community'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewsFilter(cat)}
                    className={`px-3 py-1.5 rounded-md text-xs font-serif uppercase tracking-wider transition-all ${
                      newsFilter === cat 
                        ? 'bg-zelda-gold text-white font-bold' 
                        : 'text-zelda-charcoal/60 hover:text-zelda-charcoal'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* News Layout with Wrapped Sidebar */}
            <div className="flex flex-col xl:flex-row gap-8 items-start w-full max-w-7xl mx-auto">
              {/* Left Column: 3-Column Boxed Chronicles Grid */}
              <div className="flex-grow w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((item) => {
                  const isExpanded = expandedNews === item.id;
                  return (
                    <motion.div 
                      layout
                      key={item.id} 
                      id={`news-${item.id}`}
                      className={`bg-white/60 border border-zelda-border-sand rounded-xl overflow-hidden flex flex-col justify-between hover:border-zelda-gold/60 transition-all duration-300 shadow-md h-full ${
                        isExpanded ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''
                      }`}
                    >
                      {/* Box Image Header */}
                      <div className="relative h-48 w-full overflow-hidden flex-shrink-0 bg-black/10">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-serif font-bold uppercase tracking-wider shadow ${
                          item.category === 'movie' 
                            ? 'bg-zelda-gold text-white' 
                            : item.category === 'game' 
                            ? 'bg-zelda-green-forest text-white' 
                            : 'bg-zelda-green-light text-white'
                        }`}>
                          {item.category === 'movie' ? 'Live Action Movie' : item.category}
                        </span>

                        <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-gray-200 bg-black/75 px-2 py-0.5 rounded shadow">
                          {item.date}
                        </span>

                        {item.galleryImages && item.galleryImages.length > 0 && (
                          <span className="absolute bottom-2.5 left-2.5 text-[10px] font-serif font-bold text-white bg-black/80 backdrop-blur px-2 py-0.5 rounded shadow flex items-center gap-1 border border-white/20">
                            <ImageIcon className="w-3 h-3 text-zelda-gold" />
                            <span>{item.galleryImages.length} {item.galleryImages.length === 1 ? 'Photo' : 'Photos'}</span>
                          </span>
                        )}
                      </div>

                      {/* Box Content Body */}
                      <div className="p-4 md:p-5 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2.5">
                          <h4 className="font-serif text-base md:text-lg font-bold text-zelda-charcoal tracking-wide hover:text-zelda-gold transition-colors line-clamp-2">
                            {item.title}
                          </h4>
                          <NewsContentRenderer
                            content={isExpanded ? item.content : item.summary}
                            isSummary={!isExpanded}
                          />

                          {isExpanded && (
                            <>
                              <NewsGalleryViewer
                                images={
                                  item.galleryImages && item.galleryImages.length > 0
                                    ? item.galleryImages
                                    : (item.imageUrl ? [item.imageUrl] : [])
                                }
                                title={item.title}
                              />

                              <CommentsSection
                                targetId={item.id}
                                targetType="news"
                                user={user}
                                comments={comments}
                                commentsLoading={commentsLoading}
                                newCommentText={newCommentText}
                                setNewCommentText={setNewCommentText}
                                fetchComments={fetchComments}
                                handleAddComment={handleAddComment}
                                handleDeleteComment={handleDeleteComment}
                                handleLogin={handleLogin}
                              />
                            </>
                          )}
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-zelda-border-sand/40 mt-auto">
                          <button
                            onClick={() => setExpandedNews(isExpanded ? null : item.id)}
                            className="flex-grow text-center py-2 bg-white hover:bg-zelda-beige-card border border-zelda-border-sand hover:border-zelda-gold rounded-lg font-serif text-xs text-zelda-charcoal hover:text-zelda-gold uppercase tracking-widest transition-all cursor-pointer font-bold"
                          >
                            {isExpanded ? 'Close Scroll' : 'Read Full Chronicle'}
                          </button>

                          <button
                            onClick={() => handleShare('news', item.id, item.title)}
                            className="px-3 py-2 bg-white hover:bg-zelda-beige-card border border-zelda-border-sand hover:border-zelda-gold rounded-lg text-zelda-charcoal hover:text-zelda-gold transition-all flex items-center justify-center relative cursor-pointer"
                            title="Share this Chronicle"
                          >
                            <Share2 className="w-4 h-4" />
                            {shareNotification?.id === item.id && (
                              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-[9px] rounded py-1 px-2 whitespace-nowrap z-10 font-sans shadow-md">
                                {shareNotification.message}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Column: Sidebar Aligned to Right */}
              <div id="extra-stuff-sidebar" className="w-full xl:w-80 flex-shrink-0 bg-white/50 border border-zelda-border-sand rounded-xl p-5 min-h-[400px] flex flex-col justify-between space-y-6 shadow-md">
                <div className="space-y-4 w-full">
                  <div className="border-b border-zelda-border-sand/40 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-zelda-gold" />
                      <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-zelda-gold">
                        Extra Stuff
                      </h4>
                    </div>
                    {isUserAdmin && (
                      <button
                        onClick={() => {
                          handleResetSidebarForm();
                          setAdminTab('sidebar');
                          setActiveTab('admin');
                          setTimeout(() => {
                            const el = document.getElementById('admin-sidebar-anchor');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }}
                        className="p-1 hover:bg-zelda-gold/10 text-zelda-gold hover:text-zelda-gold-dark rounded transition-colors flex items-center gap-1 text-[10px] font-bold uppercase cursor-pointer"
                        title="Add New Block"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    )}
                  </div>

                  {sidebarBlocks.length === 0 ? (
                    <p className="text-xs text-zelda-charcoal/60 italic leading-relaxed text-center py-16">
                      The sidebar is currently empty. Revisions can be appended by the Royal Scribes.
                    </p>
                  ) : (
                    <div className="space-y-5">
                      {[...sidebarBlocks].sort((a, b) => a.order - b.order).map((block) => (
                        <div key={block.id} className="group relative border-b border-zelda-border-sand/20 pb-4 last:border-0 last:pb-0">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h5 className="font-serif text-xs font-bold text-zelda-charcoal tracking-wide">
                              {block.title}
                            </h5>
                            {isUserAdmin && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => {
                                    handleEditSidebarClick(block);
                                    setActiveTab('admin');
                                    setTimeout(() => {
                                      const el = document.getElementById('admin-sidebar-anchor');
                                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }, 100);
                                  }}
                                  className="p-0.5 text-amber-600 hover:bg-amber-50 rounded cursor-pointer"
                                  title="Edit Block"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSidebar(block.id, block.title)}
                                  className="p-0.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                                  title="Delete Block"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>

                          {block.type === 'text' && (
                            <p className="text-xs text-zelda-charcoal/80 leading-relaxed whitespace-pre-wrap">
                              {block.content}
                            </p>
                          )}

                          {block.type === 'html' && (
                            <div 
                              className="text-xs text-zelda-charcoal/90 leading-normal"
                              dangerouslySetInnerHTML={{ __html: block.content }}
                            />
                          )}

                          {block.type === 'link' && (
                            <a 
                              href={block.linkUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1 text-xs text-zelda-gold hover:text-zelda-gold-dark font-semibold transition-colors underline decoration-dotted"
                            >
                              {block.content}
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="border-t border-zelda-border-sand/30 pt-3 text-center">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">
                    Royal Archives Scribe
                  </span>
                </div>
              </div>
            </div>

            {/* FEATURED FAN CONTENT SECTION BELOW NEWS */}
            <div className="pt-8 border-t border-zelda-border-sand/40 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-zelda-gold" />
                    <h3 className="font-serif text-xl font-bold tracking-wider text-zelda-charcoal uppercase">
                      Royal Fan Creations
                    </h3>
                    <span className="bg-zelda-gold/15 text-zelda-gold text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border border-zelda-gold/30">
                      Community Showcase
                    </span>
                  </div>
                  <p className="text-xs text-zelda-charcoal/70 mt-1">
                    Featured masterpieces, fan fiction, memorabilia, and video reviews crafted by Hyrule club members.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('submissions')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-zelda-gold hover:bg-yellow-600 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Explore All Fan Creations</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Featured Fan Submissions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {submissions.slice(0, 3).map((sub) => (
                  <div 
                    key={sub.id} 
                    className="bg-white/60 border border-zelda-border-sand rounded-xl overflow-hidden flex flex-col justify-between hover:border-zelda-gold/60 transition-all duration-300 shadow-md text-zelda-charcoal group"
                  >
                    <div>
                      {/* Media Header */}
                      {sub.type === 'art' && sub.contentUrl && (
                        <div className="relative h-44 overflow-hidden bg-black flex items-center justify-center">
                          <img 
                            src={sub.contentUrl} 
                            alt={sub.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/75 backdrop-blur text-zelda-gold text-[10px] font-serif font-bold uppercase rounded border border-zelda-gold/30 shadow">
                            🎨 Artwork
                          </span>
                        </div>
                      )}

                      {sub.type === 'video' && (
                        <div className="relative h-44 bg-zelda-beige-card/80 flex flex-col items-center justify-center border-b border-zelda-border-sand p-3">
                          <Video className="w-10 h-10 text-zelda-gold mb-1" />
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-zelda-charcoal/80">Interactive Video / Music</span>
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/75 backdrop-blur text-zelda-gold text-[10px] font-serif font-bold uppercase rounded border border-zelda-gold/30 shadow">
                            🎥 Video / Cover
                          </span>
                        </div>
                      )}

                      {sub.type === 'memorabilia' && sub.contentUrl && (
                        <div className="relative h-44 overflow-hidden bg-black">
                          <img 
                            src={sub.contentUrl} 
                            alt={sub.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/75 backdrop-blur text-zelda-gold text-[10px] font-serif font-bold uppercase rounded border border-zelda-gold/30 shadow">
                            🛡️ Memorabilia
                          </span>
                        </div>
                      )}

                      {sub.type === 'literature' && (
                        <div className="p-4 bg-zelda-beige-card/60 border-b border-zelda-border-sand h-44 overflow-hidden flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2 py-0.5 bg-black/75 text-zelda-gold text-[10px] font-serif font-bold uppercase rounded border border-zelda-gold/30">
                                ✍️ Literature
                              </span>
                              <FileText className="w-4 h-4 text-zelda-gold" />
                            </div>
                            <p className="text-xs text-zelda-charcoal/85 italic font-sans leading-relaxed line-clamp-4">
                              "{sub.contentBody || sub.description}"
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Details */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-zelda-charcoal/70">
                          <span className="font-serif font-bold text-zelda-gold uppercase tracking-wider">
                            By {sub.author}
                          </span>
                          <span className="font-mono text-[10px]">{sub.date}</span>
                        </div>

                        <h4 className="font-serif font-bold text-sm text-zelda-charcoal tracking-wide group-hover:text-zelda-gold transition-colors line-clamp-1">
                          {sub.title}
                        </h4>

                        <p className="text-xs text-zelda-charcoal/80 leading-relaxed line-clamp-2">
                          {sub.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-4 pt-0 flex items-center justify-between border-t border-zelda-border-sand/30 mt-2">
                      <div className="flex items-center gap-1 text-xs text-rose-600 font-bold">
                        <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                        <span>{sub.likes || 0} Likes</span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('submissions');
                          setTimeout(() => {
                            const el = document.getElementById(`submission-${sub.id}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }, 150);
                        }}
                        className="text-xs text-zelda-gold font-serif font-bold uppercase hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Creation</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: LORE LABYRINTH */}
        {activeTab === 'lore' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            {/* Search and Categories bar */}
            <div className="bg-zelda-beige-card border border-zelda-border-sand rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zelda-gold" />
                <input
                  type="text"
                  placeholder="Query the Royal Archives... (character, item, game)"
                  value={loreSearch}
                  onChange={(e) => setLoreSearch(e.target.value)}
                  className="w-full bg-white border border-zelda-border-sand rounded-lg pl-10 pr-4 py-3 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold tracking-wide placeholder-zelda-charcoal/40 shadow-inner"
                />
                {loreSearch && (
                  <button 
                    onClick={() => setLoreSearch('')} 
                    className="absolute right-3 top-3.5 text-zelda-charcoal/50 hover:text-zelda-charcoal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap justify-center gap-2">
                {['all', 'character', 'item', 'location'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setLoreCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-serif uppercase tracking-widest border transition-all ${
                      loreCategory === cat 
                        ? 'bg-zelda-gold border-zelda-gold text-white font-bold shadow-md' 
                        : 'bg-white/40 border-zelda-border-sand text-zelda-charcoal/80 hover:border-zelda-gold/40'
                    }`}
                  >
                    {cat}s
                  </button>
                ))}
              </div>
            </div>

            {/* Lore entries display */}
            {filteredLore.length === 0 ? (
              <div className="text-center py-16 bg-white/30 border border-zelda-border-sand rounded-2xl">
                <AlertCircle className="w-12 h-12 text-zelda-gold/60 mx-auto mb-3" />
                <h4 className="font-serif text-lg text-zelda-charcoal/80">No Records Found</h4>
                <p className="text-zelda-charcoal/60 text-sm mt-1">Try broadening your search query across the Sacred Timeline.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredLore.map((entry) => (
                  <div 
                    key={entry.id}
                    id={`lore-${entry.id}`}
                    className="bg-white/50 border border-zelda-border-sand hover:border-zelda-gold rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-lg"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src={entry.imageUrl} 
                          alt={entry.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                        <span className="absolute top-3 left-3 bg-zelda-green-forest border border-zelda-gold/30 text-white text-[9px] font-serif uppercase tracking-widest px-2.5 py-1 rounded">
                          {entry.category}
                        </span>
                      </div>

                      <div className="p-5 space-y-3">
                        <h4 className="font-serif text-xl font-bold text-zelda-charcoal tracking-wide">
                          {entry.title}
                        </h4>
                        <div className="text-zelda-gold text-xs font-serif italic">
                          Chronicles: {entry.game}
                        </div>
                        <p className="text-zelda-charcoal/80 text-sm leading-relaxed text-justify">
                          {entry.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-5 pt-0 mt-4">
                      <div className="flex items-center justify-between border-t border-zelda-border-sand/40 pt-4 text-[10px] text-zelda-charcoal/50 font-mono">
                        <span>Database Reference</span>
                        <span className="text-zelda-gold font-bold">Verified Archives</span>
                      </div>

                      <div className="flex gap-2 mt-4 pt-1">
                        <button
                          onClick={() => setExpandedComments(prev => ({ ...prev, [entry.id]: !prev[entry.id] }))}
                          className="flex-grow flex items-center justify-center gap-1.5 py-1.5 bg-white hover:bg-zelda-beige-card border border-zelda-border-sand hover:border-zelda-gold rounded-lg font-serif text-xs text-zelda-charcoal hover:text-zelda-gold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{expandedComments[entry.id] ? 'Close Discussions' : 'Alliance Discussions'}</span>
                        </button>

                        <button
                          onClick={() => handleShare('lore', entry.id, entry.title)}
                          className="px-3 py-1.5 bg-white hover:bg-zelda-beige-card border border-zelda-border-sand hover:border-zelda-gold rounded-lg text-zelda-charcoal hover:text-zelda-gold transition-all flex items-center justify-center relative cursor-pointer"
                          title="Share this Lore entry"
                        >
                          <Share2 className="w-4 h-4" />
                          {shareNotification?.id === entry.id && (
                            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-[9px] rounded py-1 px-2 whitespace-nowrap z-10 font-sans shadow-md">
                              {shareNotification.message}
                            </span>
                          )}
                        </button>
                      </div>

                      {expandedComments[entry.id] && (
                        <CommentsSection
                          targetId={entry.id}
                          targetType="lore"
                          user={user}
                          comments={comments}
                          commentsLoading={commentsLoading}
                          newCommentText={newCommentText}
                          setNewCommentText={setNewCommentText}
                          fetchComments={fetchComments}
                          handleAddComment={handleAddComment}
                          handleDeleteComment={handleDeleteComment}
                          handleLogin={handleLogin}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: USER SUBMISSIONS / CREATOR CLUB */}
        {activeTab === 'submissions' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-8"
          >
            {/* Split layout: Form left/top, creations grid right/bottom */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Submission Form Column */}
              <div className="lg:col-span-1 bg-zelda-beige-card border border-zelda-border-sand rounded-2xl p-6 shadow-md h-fit text-zelda-charcoal">
                <div className="flex items-center gap-2.5 mb-5 border-b border-zelda-border-sand pb-3">
                  <Award className="w-5 h-5 text-zelda-gold" />
                  <h3 className="font-serif text-lg font-bold text-zelda-charcoal uppercase tracking-wider">
                    Submit Fan Creation
                  </h3>
                </div>

                {!user ? (
                  <div className="bg-white/40 border border-zelda-border-sand rounded-xl p-6 text-center space-y-4">
                    <User className="w-10 h-10 mx-auto text-zelda-gold" />
                    <h4 className="font-serif font-bold uppercase tracking-wider text-sm text-zelda-charcoal">
                      Sanctuary Access Required
                    </h4>
                    <p className="text-xs text-zelda-charcoal/70 leading-relaxed">
                      To safeguard the Royal Registers from Ganon's corruption, you must authenticate your hero identity to publish masterpieces.
                    </p>
                    <button
                      type="button"
                      onClick={handleLogin}
                      className="w-full py-2.5 bg-zelda-gold hover:bg-yellow-600 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-lg shadow-md transition-colors cursor-pointer"
                    >
                      Authenticate Hero ▲
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePostSubmission} className="space-y-4">
                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1">
                      Creator Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., LinkTheBard"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-white border border-zelda-border-sand rounded-md p-2.5 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1">
                      Creation Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Korok Forest Watercolor"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white border border-zelda-border-sand rounded-md p-2.5 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1">
                      Category
                    </label>
                    <select
                      value={subType}
                      onChange={(e) => setSubType(e.target.value as any)}
                      className="w-full bg-white border border-zelda-border-sand rounded-md p-2.5 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold font-serif"
                    >
                      <option value="art">🎨 Artwork / Painting</option>
                      <option value="video">🎥 Video / Music / Cover</option>
                      <option value="literature">✍️ Literature / Fan Fic</option>
                      <option value="review">⭐ Game Review</option>
                      <option value="memorabilia">🛡️ Memorabilia / Prop Replica</option>
                    </select>
                  </div>

                  {subType !== 'literature' ? (
                    <div>
                      <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1">
                        Media Link / Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="e.g., https://images.unsplash.com/... or youtube"
                        value={contentUrl}
                        onChange={(e) => setContentUrl(e.target.value)}
                        className="w-full bg-white border border-zelda-border-sand rounded-md p-2.5 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold font-mono"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1">
                        Literature Content <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required={subType === 'literature'}
                        rows={4}
                        placeholder="Write your fan fiction, essay, or analysis here..."
                        value={contentBody}
                        onChange={(e) => setContentBody(e.target.value)}
                        className="w-full bg-white border border-zelda-border-sand rounded-md p-2.5 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold resize-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1">
                      Brief Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share inspiration, material details, or review score..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-white border border-zelda-border-sand rounded-md p-2.5 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold resize-none"
                    />
                  </div>

                  {/* Tokenizer Box */}
                  <div className="bg-white/55 border border-zelda-border-sand rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-zelda-gold" />
                        <span className="text-xs font-serif font-bold text-zelda-charcoal uppercase tracking-wider">
                          Triforce IP Tokenizer
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={tokenize}
                        onChange={(e) => setTokenize(e.target.checked)}
                        className="w-4 h-4 accent-zelda-gold rounded cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-zelda-charcoal/75 leading-normal">
                      Verify your ownership in the Royal Hyrule Creator Index. Applies copyright-friendly Creative Commons conditions to your fan-art.
                    </p>

                    {tokenize && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        className="space-y-3 pt-2 border-t border-zelda-border-sand"
                      >
                        <div>
                          <label className="block text-[10px] font-serif uppercase tracking-widest text-zelda-gold mb-1">
                            Copyright License Mode
                          </label>
                          <select
                            value={copyrightLicense}
                            onChange={(e) => setCopyrightLicense(e.target.value)}
                            className="w-full bg-white border border-zelda-border-sand rounded p-1.5 text-xs text-zelda-charcoal"
                          >
                            <option value="CC BY-NC-SA 4.0 (Attribution-NonCommercial-ShareAlike)">CC BY-NC-SA (Recommended)</option>
                            <option value="CC0 1.0 Universal (Public Domain Dedication)">CC0 1.0 (Public Domain)</option>
                            <option value="Zelda Fan-License (Non-Commercial distribution only)">Zelda Fan-License</option>
                            <option value="CC BY-ND 4.0 (Attribution-NoDerivatives)">CC BY-ND (No Derivatives)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-serif uppercase tracking-widest text-zelda-gold mb-1 flex justify-between">
                            <span>Requested Royalty</span>
                            <span>{royaltiesPercentage}%</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="20"
                            step="5"
                            value={royaltiesPercentage}
                            onChange={(e) => setRoyaltiesPercentage(Number(e.target.value))}
                            className="w-full accent-zelda-gold cursor-pointer"
                          />
                          <p className="text-[9px] text-zelda-charcoal/60">Royalty allocated for secondary showcases or prints.</p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 text-xs leading-normal flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {formSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded p-3 text-xs leading-normal">
                      🛡️ Chronicle Registered! Your masterpiece has been entered in the Royal Registers.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPosting}
                    className="w-full py-3 bg-zelda-gold hover:bg-yellow-600 disabled:bg-gray-400 text-white font-serif font-bold text-sm uppercase tracking-widest rounded-lg transition-colors cursor-pointer shadow-md"
                  >
                    {isPosting ? 'Writing Scroll...' : 'Post Masterpiece'}
                  </button>
                </form>
                )}
              </div>

              {/* Submissions Feed Column */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Heading & Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-zelda-border-sand pb-4">
                  <h3 className="font-serif text-xl font-bold tracking-wider text-zelda-charcoal uppercase flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-zelda-gold" />
                    The Royal Art Galleries & Exhibits
                  </h3>

                  <div className="flex flex-wrap gap-1 bg-zelda-beige-card p-1 rounded-lg border border-zelda-border-sand">
                    {['all', 'art', 'video', 'literature', 'memorabilia'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSubTypeFilter(type)}
                        className={`px-3 py-1.5 rounded text-[10px] font-serif uppercase tracking-wider transition-all ${
                          subTypeFilter === type 
                            ? 'bg-zelda-gold text-white font-bold' 
                            : 'text-zelda-charcoal/60 hover:text-zelda-charcoal'
                        }`}
                      >
                        {type}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feed Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSubmissions.map((sub) => (
                    <div 
                      key={sub.id} 
                      id={`submission-${sub.id}`}
                      className="bg-white/50 border border-zelda-border-sand rounded-xl overflow-hidden flex flex-col justify-between hover:border-zelda-gold/40 transition-all duration-300 shadow-md text-zelda-charcoal"
                    >
                      <div>
                        {/* Media Display */}
                        {sub.type === 'art' && sub.contentUrl && (
                          <div className="relative h-44 overflow-hidden bg-black flex items-center justify-center">
                            <img 
                              src={sub.contentUrl} 
                              alt={sub.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover opacity-90 hover:opacity-100" 
                            />
                          </div>
                        )}

                        {sub.type === 'video' && (
                          <div className="h-44 bg-zelda-beige-card/70 flex flex-col items-center justify-center border-b border-zelda-border-sand">
                            <Video className="w-12 h-12 text-zelda-gold mb-2" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-zelda-charcoal/70">Interactive Media Cover</span>
                            {sub.contentUrl && (
                              <a 
                                href={sub.contentUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[10px] text-zelda-gold mt-1 flex items-center gap-1 hover:underline"
                              >
                                {sub.contentUrl} <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}

                        {sub.type === 'memorabilia' && sub.contentUrl && (
                          <div className="relative h-44 overflow-hidden bg-black">
                            <img 
                              src={sub.contentUrl} 
                              alt={sub.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover opacity-90" 
                            />
                          </div>
                        )}

                        {sub.type === 'literature' && (
                          <div className="p-4 bg-zelda-beige-card/50 border-b border-zelda-border-sand max-h-44 overflow-y-auto">
                            <div className="flex items-center gap-2 mb-2 text-xs text-zelda-charcoal/60">
                              <FileText className="w-3.5 h-3.5 text-zelda-gold" />
                              <span>Scroll Text excerpt:</span>
                            </div>
                            <p className="text-xs text-zelda-charcoal/85 italic whitespace-pre-wrap font-sans leading-relaxed">
                              {sub.contentBody && sub.contentBody.length > 250 
                                ? sub.contentBody.substring(0, 250) + '...' 
                                : sub.contentBody}
                            </p>
                          </div>
                        )}

                        {/* Text details */}
                        <div className="p-5 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-serif text-base font-bold text-zelda-charcoal tracking-wide">
                              {sub.title}
                            </h4>
                            {sub.tokenized && (
                              <button
                                onClick={() => setActiveCertificate(sub.tokenDetails || null)}
                                className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-serif font-bold tracking-widest uppercase bg-zelda-gold text-white border border-yellow-600/30 shadow-sm"
                                title="Click to view IP Certificate"
                              >
                                ▲ Tokenized
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-zelda-charcoal/60">
                            <User className="w-3.5 h-3.5 text-zelda-green-forest" />
                            <span>By <strong className="text-zelda-charcoal/80">{sub.author}</strong></span>
                            <span>&bull;</span>
                            <span className="text-[10px]">{sub.date}</span>
                          </div>

                          <p className="text-zelda-charcoal/80 text-xs leading-normal">
                            {sub.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer tools */}
                      <div className="p-4 pt-0 border-t border-zelda-border-sand/40 space-y-4">
                        <div className="flex items-center justify-between pt-4">
                          <button
                            onClick={() => handleLike(sub.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-500/10 text-zelda-charcoal hover:text-red-600 border border-zelda-border-sand hover:border-red-500/20 rounded-md text-xs transition-all cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5 fill-current" />
                            <span>{sub.likes} Courage</span>
                          </button>

                          <div className="flex gap-1.5 items-center">
                            <button
                              onClick={() => setExpandedComments(prev => ({ ...prev, [sub.id]: !prev[sub.id] }))}
                              className="p-2 bg-white hover:bg-zelda-beige-card border border-zelda-border-sand hover:border-zelda-gold rounded-md text-zelda-charcoal hover:text-zelda-gold transition-all flex items-center justify-center cursor-pointer"
                              title="Alliance Discussions"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleShare('submissions', sub.id, sub.title)}
                              className="p-2 bg-white hover:bg-zelda-beige-card border border-zelda-border-sand hover:border-zelda-gold rounded-md text-zelda-charcoal hover:text-zelda-gold transition-all flex items-center justify-center relative cursor-pointer"
                              title="Share this Masterpiece"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              {shareNotification?.id === sub.id && (
                                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-[9px] rounded py-1 px-2 whitespace-nowrap z-10 font-sans shadow-md">
                                  {shareNotification.message}
                                </span>
                              )}
                            </button>

                            <span className="text-[10px] font-serif uppercase tracking-widest text-zelda-gold ml-2">
                              {sub.type}
                            </span>
                          </div>
                        </div>

                        {expandedComments[sub.id] && (
                          <CommentsSection
                            targetId={sub.id}
                            targetType="submission"
                            user={user}
                            comments={comments}
                            commentsLoading={commentsLoading}
                            newCommentText={newCommentText}
                            setNewCommentText={setNewCommentText}
                            fetchComments={fetchComments}
                            handleAddComment={handleAddComment}
                            handleDeleteComment={handleDeleteComment}
                            handleLogin={handleLogin}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: SHEIKAH SLATE AI GAME GUIDE */}
        {activeTab === 'guide' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            {/* Guide introduction */}
            <div className="bg-zelda-green-forest text-white border-2 border-zelda-gold rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-80 h-80 bg-[radial-gradient(circle,rgba(184,134,11,0.12),transparent_60%)] pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-zelda-gold rounded-full animate-ping" />
                    <span className="font-serif text-xs uppercase tracking-widest text-zelda-gold font-bold">
                      Ancient Hyrule Sanctuary
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-white tracking-wide uppercase">
                    Sheikah Slate Rescue Beacon
                  </h2>
                  <p className="text-gray-200 text-sm max-w-2xl leading-relaxed">
                    Stuck in a labyrinth? Confused by a dungeon mechanism? Describe your location, or drop a captured game screenshot, and invoke the legendary wisdom of the Sages. Receive precise directions, boss weak-points, and essential checklist markers.
                  </p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-center min-w-[200px]">
                  <span className="text-[10px] text-gray-300 font-mono block mb-1">COGNITIVE COMPLIANCE</span>
                  <span className="text-xs font-serif font-semibold text-[#EAE2CF]">Gemini 3.5-Flash Active</span>
                </div>
              </div>
            </div>

            {/* Main Form/Guide area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form Input Column */}
              <div className="bg-zelda-beige-card border border-zelda-border-sand rounded-2xl p-6 h-fit space-y-5 text-zelda-charcoal">
                <div className="font-serif font-bold text-zelda-charcoal text-base border-b border-zelda-border-sand pb-3 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-zelda-gold" />
                  ST Stuck Beacon Specifications
                </div>

                <form onSubmit={handleRescueMe} className="space-y-4">
                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1">
                      Choose Legend of Zelda Chapter
                    </label>
                    <select
                      value={rescueGame}
                      onChange={(e) => setRescueGame(e.target.value)}
                      className="w-full bg-white border border-zelda-border-sand rounded-lg p-2.5 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
                    >
                      <option value="The Legend of Zelda (1986)">The Legend of Zelda (1986)</option>
                      <option value="A Link to the Past">A Link to the Past (SNES)</option>
                      <option value="Ocarina of Time">Ocarina of Time (N64)</option>
                      <option value="Majora's Mask">Majora's Mask (N64)</option>
                      <option value="The Wind Waker">The Wind Waker (GameCube)</option>
                      <option value="Twilight Princess">Twilight Princess (Wii/GC)</option>
                      <option value="Skyward Sword">Skyward Sword (Wii/Switch)</option>
                      <option value="Breath of the Wild">Breath of the Wild (Wii U/Switch)</option>
                      <option value="Tears of the Kingdom">Tears of the Kingdom (Switch)</option>
                      <option value="Echoes of Wisdom">Echoes of Wisdom (Switch)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1">
                      Your current bottleneck / dilemma <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe where you are stuck, or what puzzle, boss, or item you are seeking in detail..."
                      value={rescuePrompt}
                      onChange={(e) => setRescuePrompt(e.target.value)}
                      className="w-full bg-white border border-zelda-border-sand rounded-lg p-3 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold placeholder-zelda-charcoal/40"
                    />
                  </div>

                  {/* Screenshot Drag & Drop Area */}
                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1">
                      Upload Screenshot (Optional)
                    </label>
                    
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-zelda-border-sand hover:border-zelda-gold rounded-xl p-4 bg-white/40 flex flex-col items-center justify-center text-center cursor-pointer transition-all gap-2"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="hidden" 
                      />

                      {rescueImage ? (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-zelda-border-sand">
                          <img src={rescueImage} alt="stuck screenshot" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setRescueImage(null); }}
                            className="absolute top-1.5 right-1.5 bg-white border border-zelda-border-sand rounded-full p-1 text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-zelda-gold/60 animate-bounce" />
                          <span className="text-xs text-zelda-charcoal/80 font-serif">Drag screenshot here, or click to explore</span>
                          <span className="text-[10px] text-zelda-charcoal/50 uppercase tracking-widest">Supports PNG, JPG, WEBP</span>
                        </>
                      )}
                    </div>
                  </div>

                  {rescueError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3.5 text-xs flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                      <span>{rescueError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isRescuing}
                    className="w-full py-3 bg-zelda-gold hover:bg-yellow-600 disabled:bg-gray-400 text-white font-serif font-bold text-sm uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    {isRescuing ? (
                      <span className="inline-block animate-spin rounded-full h-4.5 w-4.5 border-2 border-white border-t-transparent" />
                    ) : (
                      <Send className="w-4 h-4 text-white" />
                    )}
                    {isRescuing ? 'Asking ancient sages...' : 'Invoke Ancient Sages'}
                  </button>
                </form>
              </div>

              {/* Guide Output Column */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Initial Blank State */}
                {!isRescuing && !rescueGuide && (
                  <div className="h-full border-2 border-dashed border-zelda-border-sand bg-white/30 rounded-2xl flex flex-col items-center justify-center text-center p-8 py-20">
                    <div className="w-20 h-20 bg-zelda-beige-card rounded-full border border-zelda-border-sand flex items-center justify-center mb-4 text-zelda-gold">
                      ▲
                    </div>
                    <h3 className="font-serif text-lg text-zelda-charcoal uppercase tracking-wider">
                      Sanctum Ready
                    </h3>
                    <p className="text-zelda-charcoal/70 text-xs max-w-md mt-1.5 leading-relaxed">
                      Your query will traverse the Sacred Realm to consult the ancient Sages of Hyrule. Detailed, step-by-step room walkthroughs, tactical advice on weaknesses, and dynamic item check-lists will materialize here.
                    </p>
                  </div>
                )}

                {/* Loading State */}
                {isRescuing && (
                  <div className="border border-zelda-border-sand bg-white/50 rounded-2xl p-8 py-24 text-center space-y-6 flex flex-col items-center justify-center text-zelda-charcoal">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-zelda-gold/25 border-t-zelda-gold rounded-full animate-spin" />
                      <span className="absolute text-xl text-zelda-gold animate-pulse">▲</span>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-serif text-zelda-gold text-base uppercase tracking-widest animate-pulse">
                        Communicating with the Sacred Realm
                      </h4>
                      <p className="text-zelda-charcoal/80 text-sm font-serif italic max-w-md mx-auto">
                        "{loadingQuotes[loadingStep]}"
                      </p>
                    </div>

                    <div className="text-[10px] text-zelda-charcoal/50 uppercase tracking-widest font-mono">
                      Querying model/gemini-3.5-flash &bull; Streaming structured JSON
                    </div>
                  </div>
                )}

                {/* Rescue Guide Formulated Output */}
                {rescueGuide && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="border-2 border-zelda-border-sand bg-white/50 rounded-2xl overflow-hidden shadow-md text-zelda-charcoal"
                  >
                    {/* Header bar */}
                    <div className="bg-zelda-green-forest border-b-2 border-zelda-gold p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
                      <div>
                        <span className="text-[10px] font-serif font-bold text-zelda-gold uppercase tracking-widest block mb-0.5">
                          Sheikah Slate Manifestation
                        </span>
                        <h3 className="text-lg md:text-xl font-serif font-extrabold text-white tracking-wide uppercase">
                          {rescueGuide.title}
                        </h3>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSpeakWalkthrough(rescueGuide.walkthrough)}
                          className="px-3.5 py-1.5 bg-black/20 hover:bg-black/40 text-white border border-white/20 rounded-lg text-xs font-serif uppercase tracking-wider flex items-center gap-1.5 transition-all"
                          title="Speak Walkthrough"
                        >
                          <Volume2 className="w-3.5 h-3.5" /> Speak Guide
                        </button>

                        <button
                          onClick={() => { setRescueGuide(null); setRescuePrompt(''); }}
                          className="px-3 py-1.5 bg-black/20 hover:bg-black/40 text-gray-300 border border-white/10 rounded-lg text-xs font-serif uppercase tracking-wider transition-all"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Walkthrough & Strategies section */}
                    <div className="p-6 space-y-6">
                      
                      {/* Detailed Walkthrough */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-zelda-border-sand pb-2">
                          <Compass className="w-4 h-4 text-zelda-green-forest" />
                          <h4 className="font-serif text-sm font-bold text-zelda-green-forest uppercase tracking-wider">
                            Sacred Escaping Path / Room Steps
                          </h4>
                        </div>
                        <div className="text-zelda-charcoal/90 text-sm leading-relaxed whitespace-pre-wrap font-sans text-justify">
                          {rescueGuide.walkthrough}
                        </div>
                      </div>

                      {/* Boss Strategies */}
                      {rescueGuide.bossStrategies && (
                        <div className="space-y-3 bg-zelda-beige-card border border-zelda-border-sand rounded-xl p-5">
                          <div className="flex items-center gap-2 border-b border-zelda-border-sand/40 pb-2">
                            <ShieldAlert className="w-4 h-4 text-zelda-gold" />
                            <h4 className="font-serif text-sm font-bold text-zelda-charcoal uppercase tracking-wider">
                              Combat, Boss, or Dungeon Mechanics Strategy
                            </h4>
                          </div>
                          <div className="text-zelda-charcoal/95 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                            {rescueGuide.bossStrategies}
                          </div>
                        </div>
                      )}

                      {/* Interactive Item Checklist */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between border-b border-zelda-border-sand/40 pb-2">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-zelda-green-forest" />
                            <h4 className="font-serif text-sm font-bold text-zelda-green-forest uppercase tracking-wider">
                              Essential Hyrule Item Checklist
                            </h4>
                          </div>
                          
                          <span className="text-[10px] text-zelda-charcoal/60 uppercase tracking-wider font-mono">
                            {rescueGuide.itemsChecklist.filter((i: any) => i.obtained).length} of {rescueGuide.itemsChecklist.length} Collected
                          </span>
                        </div>

                        {/* Checklist Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {rescueGuide.itemsChecklist.map((item: any) => (
                            <button
                              key={item.id}
                              onClick={() => toggleChecklistItem(item.id)}
                              className={`p-3 rounded-lg text-left border flex items-start gap-3 transition-all ${
                                item.obtained 
                                  ? 'bg-zelda-beige-card/70 border-zelda-border-sand text-zelda-charcoal/50' 
                                  : 'bg-white border-zelda-border-sand text-zelda-charcoal hover:border-zelda-gold'
                              }`}
                            >
                              <div className="mt-0.5 flex-shrink-0">
                                {item.obtained ? (
                                  <CheckSquare className="w-4 h-4 text-zelda-gold" />
                                ) : (
                                  <Square className="w-4 h-4 text-zelda-charcoal/35" />
                                )}
                              </div>
                              
                              <div>
                                <div className={`text-xs font-serif font-bold tracking-wide ${item.obtained ? 'line-through text-zelda-charcoal/50' : 'text-zelda-gold'}`}>
                                  {item.item}
                                </div>
                                <div className="text-[10px] text-zelda-charcoal/60 mt-0.5 font-mono">
                                  Use/Loc: {item.location}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Add custom item */}
                        <div className="flex gap-2 max-w-md mt-4">
                          <input
                            type="text"
                            placeholder="Add custom dungeon note/item..."
                            value={customItemText}
                            onChange={(e) => setCustomItemText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addCustomChecklistItem()}
                            className="bg-white border border-zelda-border-sand rounded px-3 py-1.5 text-xs text-zelda-charcoal focus:outline-none focus:border-zelda-gold flex-grow"
                          />
                          <button
                            onClick={addCustomChecklistItem}
                            className="bg-zelda-gold hover:bg-yellow-600 text-white px-3 py-1.5 rounded text-xs font-serif font-bold uppercase tracking-widest transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: ADMIN SANCTUM */}
        {activeTab === 'admin' && isUserAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-8"
          >
            {/* Admin Title Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-yellow-950/90 to-[#12221A] border-4 border-zelda-gold rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="absolute right-0 top-0 w-96 h-96 bg-[radial-gradient(circle,rgba(184,134,11,0.12),transparent_60%)] pointer-events-none" />
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-zelda-gold animate-pulse" />
                    <span className="font-serif text-xs uppercase tracking-widest text-zelda-gold font-bold">
                      Royal Hyrule Administration
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-[#F4EFE1] tracking-wide uppercase">
                    Admin Sanctum & Chronicles Portal
                  </h2>
                  <p className="text-gray-300 text-sm max-w-2xl leading-relaxed">
                    Edit, record, or moderate content across the Legend of Zelda Fan Club Portal. All changes are synced to both the local cache, the Express backend API, and secure cloud Firestore storage.
                  </p>
                </div>
                
                <div className="bg-black/30 border border-zelda-gold/30 rounded-xl px-4 py-3 text-center min-w-[180px]">
                  <span className="text-[10px] text-gray-400 font-mono block mb-1">PRIVILEGED ROLE</span>
                  <span className="text-xs font-serif font-semibold text-zelda-gold">Royal Court Scribe</span>
                </div>
              </div>
            </div>

            {/* Admin Sub-tabs Navigation */}
            <div className="flex flex-wrap border-b border-zelda-border-sand/40 pb-px gap-2">
              <button
                onClick={() => setAdminTab('news')}
                className={`px-5 py-2.5 rounded-t-lg font-serif text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer border-t border-x ${
                  adminTab === 'news'
                    ? 'bg-white border-zelda-border-sand text-zelda-gold font-bold'
                    : 'bg-black/10 border-transparent text-zelda-charcoal/60 hover:text-zelda-charcoal'
                }`}
              >
                📰 Manage News & Chronicles
              </button>
              <button
                onClick={() => setAdminTab('lore')}
                className={`px-5 py-2.5 rounded-t-lg font-serif text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer border-t border-x ${
                  adminTab === 'lore'
                    ? 'bg-white border-zelda-border-sand text-zelda-gold font-bold'
                    : 'bg-black/10 border-transparent text-zelda-charcoal/60 hover:text-zelda-charcoal'
                }`}
              >
                📜 Manage Ancient Lore
              </button>
              <button
                onClick={() => setAdminTab('submissions')}
                className={`px-5 py-2.5 rounded-t-lg font-serif text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer border-t border-x ${
                  adminTab === 'submissions'
                    ? 'bg-white border-zelda-border-sand text-zelda-gold font-bold'
                    : 'bg-black/10 border-transparent text-zelda-charcoal/60 hover:text-zelda-charcoal'
                }`}
              >
                🛡️ Moderation Chamber
              </button>
              <button
                onClick={() => setAdminTab('sidebar')}
                className={`px-5 py-2.5 rounded-t-lg font-serif text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer border-t border-x ${
                  adminTab === 'sidebar'
                    ? 'bg-white border-zelda-border-sand text-zelda-gold font-bold'
                    : 'bg-black/10 border-transparent text-zelda-charcoal/60 hover:text-zelda-charcoal'
                }`}
              >
                🔮 Manage Extra Stuff
              </button>
            </div>

            {/* Notifications Panel */}
            {adminError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{adminError}</span>
              </div>
            )}
            {adminSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2 text-xs">
                <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-bounce" />
                <span>{adminSuccess}</span>
              </div>
            )}

            {/* ADMIN SUB-TAB 1: NEWS */}
            {adminTab === 'news' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* News Edit/Create Form */}
                <div className="lg:col-span-1 bg-white border border-zelda-border-sand rounded-2xl p-6 shadow-md h-fit">
                  <div className="border-b border-zelda-border-sand pb-3 mb-5 flex items-center justify-between">
                    <h3 className="font-serif text-sm font-extrabold uppercase tracking-widest text-zelda-gold flex items-center gap-1.5">
                      <Plus className="w-4 h-4" />
                      {isEditingNews ? 'Engrave News Update' : 'Chronicle New Story'}
                    </h3>
                    {isEditingNews && (
                      <button
                        onClick={handleResetNewsForm}
                        className="text-[10px] text-gray-400 hover:text-red-500 uppercase tracking-wider font-mono"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveNews} className="space-y-4 text-left">
                    <div>
                      <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal mb-1">
                        Chronicle Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Nintendo Unveils Breath of the Wild Sequel"
                        value={adminNewsTitle}
                        onChange={(e) => setAdminNewsTitle(e.target.value)}
                        className="w-full bg-white border border-zelda-border-sand rounded p-2 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal mb-1">
                          Category
                        </label>
                        <select
                          value={adminNewsCategory}
                          onChange={(e) => setAdminNewsCategory(e.target.value as any)}
                          className="w-full bg-white border border-zelda-border-sand rounded p-1.5 text-xs text-zelda-charcoal"
                        >
                          <option value="movie">🎥 Live Action Movie</option>
                          <option value="game">🎮 Game News</option>
                          <option value="community">🤝 Community Spotlight</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal mb-1">
                          Date Override
                        </label>
                        <input
                          type="date"
                          value={adminNewsDate}
                          onChange={(e) => setAdminNewsDate(e.target.value)}
                          className="w-full bg-white border border-zelda-border-sand rounded p-1.5 text-xs text-zelda-charcoal font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal mb-1">
                        Brief Summary <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Provide a quick 1-2 sentence teaser summary..."
                        value={adminNewsSummary}
                        onChange={(e) => setAdminNewsSummary(e.target.value)}
                        className="w-full bg-white border border-zelda-border-sand rounded p-2 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal resize-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal">
                          Full Content Post <span className="text-red-500">*</span>
                          <span className="ml-2 px-1.5 py-0.5 bg-zelda-gold/15 text-zelda-gold text-[9px] rounded font-sans font-bold">HTML & Text Supported</span>
                        </label>
                        <div className="flex bg-zelda-beige-card border border-zelda-border-sand rounded p-0.5 text-[10px]">
                          <button
                            type="button"
                            onClick={() => setAdminNewsMode('editor')}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                              adminNewsMode === 'editor'
                                ? 'bg-zelda-gold text-white font-bold'
                                : 'text-zelda-charcoal/70 hover:text-zelda-charcoal'
                            }`}
                          >
                            ✍️ Editor
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdminNewsMode('preview')}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                              adminNewsMode === 'preview'
                                ? 'bg-zelda-gold text-white font-bold'
                                : 'text-zelda-charcoal/70 hover:text-zelda-charcoal'
                            }`}
                          >
                            👁️ Live HTML Preview
                          </button>
                        </div>
                      </div>

                      {adminNewsMode === 'editor' ? (
                        <div className="space-y-1.5">
                          {/* Quick HTML Toolbar */}
                          <div className="flex flex-wrap gap-1 p-1.5 bg-zelda-beige-card/70 border border-zelda-border-sand/60 rounded text-[10px]">
                            <span className="text-zelda-charcoal/60 font-serif self-center mr-1 text-[9px] uppercase tracking-wider">
                              Quick Tags:
                            </span>
                            <button
                              type="button"
                              onClick={() => handleInsertHtmlTag('p')}
                              className="px-1.5 py-0.5 bg-white border border-zelda-border-sand hover:border-zelda-gold rounded text-zelda-charcoal font-mono hover:text-zelda-gold cursor-pointer"
                              title="Paragraph tag <p>"
                            >
                              &lt;p&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertHtmlTag('bold')}
                              className="px-1.5 py-0.5 bg-white border border-zelda-border-sand hover:border-zelda-gold rounded font-bold text-zelda-charcoal hover:text-zelda-gold cursor-pointer"
                              title="Bold tag <strong>"
                            >
                              &lt;strong&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertHtmlTag('italic')}
                              className="px-1.5 py-0.5 bg-white border border-zelda-border-sand hover:border-zelda-gold rounded italic text-zelda-charcoal hover:text-zelda-gold cursor-pointer"
                              title="Italic tag <em>"
                            >
                              &lt;em&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertHtmlTag('h3')}
                              className="px-1.5 py-0.5 bg-white border border-zelda-border-sand hover:border-zelda-gold rounded text-zelda-charcoal font-serif font-bold hover:text-zelda-gold cursor-pointer"
                              title="Heading 3 <h3>"
                            >
                              &lt;h3&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertHtmlTag('link')}
                              className="px-1.5 py-0.5 bg-white border border-zelda-border-sand hover:border-zelda-gold rounded text-zelda-charcoal hover:text-zelda-gold cursor-pointer"
                              title="Link tag <a>"
                            >
                              &lt;a&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertHtmlTag('ul')}
                              className="px-1.5 py-0.5 bg-white border border-zelda-border-sand hover:border-zelda-gold rounded text-zelda-charcoal hover:text-zelda-gold cursor-pointer"
                              title="Bullet List <ul>"
                            >
                              &lt;ul&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertHtmlTag('quote')}
                              className="px-1.5 py-0.5 bg-white border border-zelda-border-sand hover:border-zelda-gold rounded text-zelda-charcoal hover:text-zelda-gold cursor-pointer"
                              title="Quote tag <blockquote>"
                            >
                              &lt;quote&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertHtmlTag('img')}
                              className="px-1.5 py-0.5 bg-white border border-zelda-border-sand hover:border-zelda-gold rounded text-zelda-charcoal hover:text-zelda-gold cursor-pointer"
                              title="Image tag <img>"
                            >
                              &lt;img&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertHtmlTag('br')}
                              className="px-1.5 py-0.5 bg-white border border-zelda-border-sand hover:border-zelda-gold rounded font-mono text-zelda-charcoal hover:text-zelda-gold cursor-pointer"
                              title="Line break <br/>"
                            >
                              &lt;br/&gt;
                            </button>
                          </div>

                          <textarea
                            required
                            rows={8}
                            placeholder="Write the full chronicle or news body. Plain text and HTML markup (p, h3, a, ul, b, img, etc.) are fully supported..."
                            value={adminNewsContent}
                            onChange={(e) => setAdminNewsContent(e.target.value)}
                            className="w-full bg-white border border-zelda-border-sand rounded p-2 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal font-mono resize-y"
                          />
                        </div>
                      ) : (
                        <div className="bg-white border border-zelda-border-sand rounded p-4 min-h-[160px] max-h-[300px] overflow-y-auto">
                          {adminNewsContent.trim() ? (
                            <NewsContentRenderer content={adminNewsContent} />
                          ) : (
                            <p className="text-xs text-gray-400 italic">No content entered yet. Switch to Editor mode to write your news entry.</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Cover Image & Upload Gallery Section */}
                    <div className="space-y-3 pt-2 border-t border-zelda-border-sand/40">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal font-bold">
                            Primary Cover Image <span className="text-red-500">*</span>
                          </label>
                          {adminNewsImageUrl && (
                            <span className="text-[10px] text-emerald-600 font-mono flex items-center gap-1 font-bold">
                              <Check className="w-3 h-3" /> Cover Selected
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="e.g., https://images.unsplash.com/... or upload below"
                          value={adminNewsImageUrl}
                          onChange={(e) => setAdminNewsImageUrl(e.target.value)}
                          className="w-full bg-white border border-zelda-border-sand rounded p-2 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal font-mono"
                        />
                      </div>

                      {/* Image Presets Picker */}
                      <div className="space-y-1">
                        <span className="block text-[9px] font-serif uppercase tracking-widest text-zelda-gold font-bold">
                          Quick Presets:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {newsImagePresets.map((preset, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setAdminNewsImageUrl(preset.url);
                                if (!adminNewsGalleryImages.includes(preset.url)) {
                                  setAdminNewsGalleryImages((prev) => [...prev, preset.url]);
                                }
                              }}
                              className="px-1.5 py-0.5 bg-zelda-beige-card border border-zelda-border-sand/60 hover:border-zelda-gold rounded text-[9px] text-zelda-charcoal/80 transition-all cursor-pointer"
                            >
                              🖼️ {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Image Upload & Gallery Builder */}
                      <div className="bg-zelda-beige-card/60 border border-zelda-border-sand rounded-xl p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal font-bold flex items-center gap-1.5">
                            <Images className="w-4 h-4 text-zelda-gold" />
                            <span>News Photo Gallery ({adminNewsGalleryImages.length})</span>
                          </label>
                          <span className="text-[9px] font-mono text-zelda-charcoal/60">Upload local files or add URLs</span>
                        </div>

                        {/* File Upload Trigger */}
                        <div className="flex gap-2">
                          <input
                            type="file"
                            ref={newsFileInputRef}
                            accept="image/*"
                            multiple
                            onChange={handleNewsFileUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => newsFileInputRef.current?.click()}
                            className="flex-1 py-2 px-3 bg-white hover:bg-zelda-beige-card border-2 border-dashed border-zelda-gold/60 hover:border-zelda-gold rounded-lg text-xs font-serif font-bold text-zelda-charcoal hover:text-zelda-gold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                          >
                            <Upload className="w-4 h-4 text-zelda-gold" />
                            <span>Upload Local Images</span>
                          </button>
                        </div>

                        {/* Custom Image URL Addition */}
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Paste external photo URL..."
                            value={customGalleryUrlInput}
                            onChange={(e) => setCustomGalleryUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddGalleryUrl();
                              }
                            }}
                            className="flex-grow bg-white border border-zelda-border-sand rounded px-2 py-1 text-xs text-zelda-charcoal font-mono"
                          />
                          <button
                            type="button"
                            onClick={handleAddGalleryUrl}
                            className="px-2.5 py-1 bg-zelda-gold hover:bg-yellow-600 text-white font-serif font-bold text-xs rounded uppercase tracking-wider cursor-pointer"
                          >
                            Add
                          </button>
                        </div>

                        {/* Gallery Thumbnails List */}
                        {adminNewsGalleryImages.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2 pt-1 max-h-48 overflow-y-auto">
                            {adminNewsGalleryImages.map((imgUrl, idx) => {
                              const isCover = imgUrl === adminNewsImageUrl;
                              return (
                                <div
                                  key={idx}
                                  className={`relative group h-20 rounded-lg overflow-hidden border-2 bg-black/10 flex items-center justify-center ${
                                    isCover ? 'border-zelda-gold ring-2 ring-zelda-gold/40' : 'border-zelda-border-sand'
                                  }`}
                                >
                                  <img
                                    src={imgUrl}
                                    alt={`Gallery upload ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />

                                  {isCover && (
                                    <span className="absolute top-1 left-1 bg-zelda-gold text-white text-[8px] font-serif font-bold uppercase px-1 py-0.5 rounded shadow">
                                      ★ Cover
                                    </span>
                                  )}

                                  {/* Overlay Actions */}
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 p-1">
                                    {!isCover && (
                                      <button
                                        type="button"
                                        onClick={() => handleSetCoverImage(imgUrl)}
                                        className="p-1 bg-zelda-gold text-white rounded text-[9px] hover:bg-yellow-600 cursor-pointer"
                                        title="Make Cover Image"
                                      >
                                        <Star className="w-3 h-3 fill-white" />
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveGalleryImage(idx)}
                                      className="p-1 bg-red-600 text-white rounded text-[9px] hover:bg-red-700 cursor-pointer"
                                      title="Remove from Gallery"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-[10px] text-zelda-charcoal/60 italic text-center py-1">
                            No gallery images added yet. Upload files or paste URLs above to create a photo gallery for this chronicle.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-zelda-border-sand/40">
                      <button
                        type="submit"
                        className="flex-grow py-2 bg-zelda-gold hover:bg-yellow-600 text-white font-serif font-bold text-xs uppercase tracking-wider rounded transition-colors shadow cursor-pointer"
                      >
                        {isEditingNews ? 'Engrave Updates ▲' : 'Publish Chronicle 📰'}
                      </button>
                      <button
                        type="button"
                        onClick={handleResetNewsForm}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded text-xs uppercase font-mono cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </form>
                </div>

                {/* News Records List */}
                <div className="lg:col-span-2 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-zelda-border-sand pb-3">
                    <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-zelda-charcoal">
                      Engraved Chronicles Library ({news.length})
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400">Chronological Order</span>
                  </div>

                  <div className="space-y-3 max-h-[640px] overflow-y-auto pr-2">
                    {news.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-zelda-border-sand/60 rounded-xl p-4 flex gap-4 hover:border-zelda-gold/50 transition-all"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-16 rounded object-cover border border-zelda-border-sand flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-zelda-gold/15 text-zelda-gold text-[9px] rounded font-serif uppercase tracking-widest font-bold">
                              {item.category}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">{item.date}</span>
                          </div>
                          <h5 className="font-serif font-bold text-sm text-zelda-charcoal truncate mt-1">
                            {item.title}
                          </h5>
                          <p className="text-xs text-zelda-charcoal/70 line-clamp-1 mt-0.5 font-sans">
                            {item.summary}
                          </p>
                        </div>

                        <div className="flex flex-col gap-1.5 justify-center flex-shrink-0">
                          <button
                            onClick={() => handleEditNewsClick(item)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-xs flex items-center justify-center cursor-pointer"
                            title="Edit Chronicle"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNews(item.id, item.title)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-xs flex items-center justify-center cursor-pointer"
                            title="Banish Chronicle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN SUB-TAB 2: LORE */}
            {adminTab === 'lore' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lore Edit/Create Form */}
                <div className="lg:col-span-1 bg-white border border-zelda-border-sand rounded-2xl p-6 shadow-md h-fit">
                  <div className="border-b border-zelda-border-sand pb-3 mb-5 flex items-center justify-between">
                    <h3 className="font-serif text-sm font-extrabold uppercase tracking-widest text-zelda-gold flex items-center gap-1.5">
                      <Plus className="w-4 h-4" />
                      {isEditingLore ? 'Update Ancient Lore' : 'Record New Lore Entry'}
                    </h3>
                    {isEditingLore && (
                      <button
                        onClick={handleResetLoreForm}
                        className="text-[10px] text-gray-400 hover:text-red-500 uppercase tracking-wider font-mono"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveLore} className="space-y-4 text-left">
                    <div>
                      <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal mb-1">
                        Lore Subject Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., The Sacred Realm"
                        value={adminLoreTitle}
                        onChange={(e) => setAdminLoreTitle(e.target.value)}
                        className="w-full bg-white border border-zelda-border-sand rounded p-2 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal mb-1">
                          Category
                        </label>
                        <select
                          value={adminLoreCategory}
                          onChange={(e) => setAdminLoreCategory(e.target.value as any)}
                          className="w-full bg-white border border-zelda-border-sand rounded p-1.5 text-xs text-zelda-charcoal font-serif"
                        >
                          <option value="character">👤 Character</option>
                          <option value="item">🛡️ Ancient Relic / Item</option>
                          <option value="location">🏔️ Sacred Location</option>
                          <option value="era">⏳ Historical Era</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal mb-1">
                          Timeline Chronicle / Game <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Ocarina of Time"
                          value={adminLoreGame}
                          onChange={(e) => setAdminLoreGame(e.target.value)}
                          className="w-full bg-white border border-zelda-border-sand rounded p-1.5 text-xs text-zelda-charcoal"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal mb-1">
                        Chronological Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Compile the historic lore summary, legend, or analysis body..."
                        value={adminLoreDescription}
                        onChange={(e) => setAdminLoreDescription(e.target.value)}
                        className="w-full bg-white border border-zelda-border-sand rounded p-2 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal resize-y"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal mb-1">
                        Illustrative Image URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="e.g., https://images.unsplash.com/..."
                        value={adminLoreImageUrl}
                        onChange={(e) => setAdminLoreImageUrl(e.target.value)}
                        className="w-full bg-white border border-zelda-border-sand rounded p-2 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal font-mono"
                      />
                    </div>

                    {/* Image Presets Picker */}
                    <div className="space-y-1.5">
                      <span className="block text-[9px] font-serif uppercase tracking-widest text-zelda-gold">
                        Or select a gorgeous preset image:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {loreImagePresets.map((preset, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setAdminLoreImageUrl(preset.url)}
                            className="px-1.5 py-0.5 bg-zelda-beige-card border border-zelda-border-sand/60 hover:border-zelda-gold rounded text-[9px] text-zelda-charcoal/80 transition-all cursor-pointer"
                          >
                            ⚔️ {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-zelda-border-sand/40">
                      <button
                        type="submit"
                        className="flex-grow py-2 bg-zelda-gold hover:bg-yellow-600 text-white font-serif font-bold text-xs uppercase tracking-wider rounded transition-colors shadow cursor-pointer"
                      >
                        {isEditingLore ? 'Engrave Updates ▲' : 'Engrave Lore 📜'}
                      </button>
                      <button
                        type="button"
                        onClick={handleResetLoreForm}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded text-xs uppercase font-mono cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </form>
                </div>

                {/* Lore Records List */}
                <div className="lg:col-span-2 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-zelda-border-sand pb-3">
                    <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-zelda-charcoal">
                      Engraved Lore Database ({lore.length})
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400">Sacred Archives</span>
                  </div>

                  <div className="space-y-3 max-h-[640px] overflow-y-auto pr-2">
                    {lore.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-white border border-zelda-border-sand/60 rounded-xl p-4 flex gap-4 hover:border-zelda-gold/50 transition-all"
                      >
                        <img
                          src={entry.imageUrl}
                          alt={entry.title}
                          className="w-16 h-16 rounded object-cover border border-zelda-border-sand flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-zelda-green-forest/15 text-zelda-green-forest text-[9px] rounded font-serif uppercase tracking-widest font-bold">
                              {entry.category}
                            </span>
                            <span className="text-[10px] font-mono text-zelda-gold italic">{entry.game}</span>
                          </div>
                          <h5 className="font-serif font-bold text-sm text-zelda-charcoal truncate mt-1">
                            {entry.title}
                          </h5>
                          <p className="text-xs text-zelda-charcoal/70 line-clamp-1 mt-0.5 font-sans">
                            {entry.description}
                          </p>
                        </div>

                        <div className="flex flex-col gap-1.5 justify-center flex-shrink-0">
                          <button
                            onClick={() => handleEditLoreClick(entry)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-xs flex items-center justify-center cursor-pointer"
                            title="Edit Lore Entry"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLore(entry.id, entry.title)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-xs flex items-center justify-center cursor-pointer"
                            title="Banish Lore Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN SUB-TAB 3: MODERATION CHAMBER */}
            {adminTab === 'submissions' && (
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-zelda-border-sand pb-3">
                  <div>
                    <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-zelda-charcoal">
                      Submission Moderation Panel
                    </h4>
                    <p className="text-xs text-zelda-charcoal/60 mt-0.5">Banish inappropriate user creations or copyrighted materials immediately</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-950/15 border border-zelda-gold/30 rounded text-zelda-gold text-[10px] font-bold">
                    🛡️ ACTIVE SANCTUARY MODERATION
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {submissions.length === 0 ? (
                    <div className="col-span-2 text-center py-10 bg-white/40 border border-zelda-border-sand rounded-xl">
                      <p className="text-sm text-zelda-charcoal/60 italic">No user submissions to moderate.</p>
                    </div>
                  ) : (
                    submissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-white border border-zelda-border-sand rounded-xl p-5 flex flex-col justify-between hover:border-zelda-gold/40 transition-all shadow-sm"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-gray-400">ID: {sub.id} &bull; {sub.date}</span>
                            <span className="px-2 py-0.5 bg-zelda-gold/10 text-zelda-gold text-[10px] font-serif uppercase tracking-widest font-bold rounded">
                              {sub.type}
                            </span>
                          </div>

                          <div className="flex gap-3">
                            {sub.contentUrl && (
                              <img
                                src={sub.contentUrl}
                                alt={sub.title}
                                className="w-16 h-16 rounded object-cover border border-zelda-border-sand/60 flex-shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div className="min-w-0">
                              <h5 className="font-serif font-bold text-sm text-zelda-charcoal truncate">
                                {sub.title}
                              </h5>
                              <p className="text-xs text-zelda-gold font-serif mt-0.5">
                                Author: <strong>{sub.author}</strong>
                              </p>
                              <p className="text-xs text-zelda-charcoal/70 line-clamp-2 mt-1">
                                {sub.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-zelda-border-sand/40">
                          <div className="text-[10px] font-mono text-gray-400">
                            Likes: {sub.likes} | IP Tokenized: {sub.tokenized ? '✅' : '❌'}
                          </div>
                          <button
                            onClick={() => handleDeleteSubmission(sub.id, sub.title)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded font-serif text-xs uppercase font-bold tracking-wider cursor-pointer transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Banish Submission
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ADMIN SUB-TAB 4: MANAGE SIDEBAR / EXTRA STUFF */}
            {adminTab === 'sidebar' && (
              <div id="admin-sidebar-anchor" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Block Edit/Create Form */}
                <div className="lg:col-span-1 bg-white border border-zelda-border-sand rounded-2xl p-6 shadow-md h-fit">
                  <div className="border-b border-zelda-border-sand pb-3 mb-5 flex items-center justify-between">
                    <h3 className="font-serif text-sm font-extrabold uppercase tracking-widest text-zelda-gold flex items-center gap-1.5">
                      <Plus className="w-4 h-4" />
                      {isEditingSidebar ? 'Update Sidebar Block' : 'Create Sidebar Block'}
                    </h3>
                    {isEditingSidebar && (
                      <button
                        onClick={handleResetSidebarForm}
                        className="text-[10px] text-gray-400 hover:text-red-500 uppercase tracking-wider font-mono cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveSidebar} className="space-y-4 text-left">
                    <div>
                      <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal mb-1">
                        Subject Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Important Announcement"
                        value={adminSidebarTitle}
                        onChange={(e) => setAdminSidebarTitle(e.target.value)}
                        className="w-full bg-white border border-zelda-border-sand rounded p-2 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal mb-1">
                          Block Type
                        </label>
                        <select
                          value={adminSidebarType}
                          onChange={(e) => {
                            setAdminSidebarType(e.target.value as any);
                            if (e.target.value !== 'link') {
                              setAdminSidebarLinkUrl('');
                            }
                          }}
                          className="w-full bg-white border border-zelda-border-sand rounded p-1.5 text-xs text-zelda-charcoal font-serif"
                        >
                          <option value="text">📝 Plain Text</option>
                          <option value="html">💻 Custom HTML / Code</option>
                          <option value="link">🔗 External Link</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal mb-1">
                          Display Order <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="e.g., 1"
                          value={adminSidebarOrder}
                          onChange={(e) => setAdminSidebarOrder(Number(e.target.value))}
                          className="w-full bg-white border border-zelda-border-sand rounded p-1.5 text-xs text-zelda-charcoal font-mono"
                        />
                      </div>
                    </div>

                    {adminSidebarType === 'link' && (
                      <div>
                        <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal mb-1">
                          Link URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          required={adminSidebarType === 'link'}
                          placeholder="e.g., https://zelda.com"
                          value={adminSidebarLinkUrl}
                          onChange={(e) => setAdminSidebarLinkUrl(e.target.value)}
                          className="w-full bg-white border border-zelda-border-sand rounded p-2 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal font-mono"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal mb-1">
                        {adminSidebarType === 'link' ? 'Link Text Label' : adminSidebarType === 'html' ? 'Custom HTML/CSS Code' : 'Text Content'} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={6}
                        placeholder={adminSidebarType === 'html' ? "e.g., <div class='p-2 bg-yellow-100 rounded border border-yellow-300'><strong>Alert:</strong> Blood Moon rising!</div>" : adminSidebarType === 'link' ? "e.g., Visit Nintendo Zelda Portal" : "Enter paragraph description..."}
                        value={adminSidebarContent}
                        onChange={(e) => setAdminSidebarContent(e.target.value)}
                        className="w-full bg-white border border-zelda-border-sand rounded p-2 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal font-mono resize-y"
                      />
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-zelda-border-sand/40">
                      <button
                        type="submit"
                        className="flex-grow py-2 bg-zelda-gold hover:bg-yellow-600 text-white font-serif font-bold text-xs uppercase tracking-wider rounded transition-colors shadow cursor-pointer"
                      >
                        {isEditingSidebar ? 'Engrave Updates ▲' : 'Engrave Block 🔮'}
                      </button>
                      <button
                        type="button"
                        onClick={handleResetSidebarForm}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded text-xs uppercase font-mono cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </form>
                </div>

                {/* Sidebar Blocks List */}
                <div className="lg:col-span-2 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-zelda-border-sand pb-3">
                    <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-zelda-charcoal">
                      Engraved Sidebar Blocks ({sidebarBlocks.length})
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400">Order ascending</span>
                  </div>

                  <div className="space-y-3 max-h-[640px] overflow-y-auto pr-2">
                    {sidebarBlocks.map((block) => (
                      <div
                        key={block.id}
                        className="bg-white border border-zelda-border-sand/60 rounded-xl p-4 flex justify-between items-start hover:border-zelda-gold/50 transition-all"
                      >
                        <div className="flex-grow min-w-0 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-zelda-gold/15 text-zelda-gold text-[9px] rounded font-serif uppercase tracking-widest font-bold">
                              {block.type}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">Order: {block.order}</span>
                          </div>
                          <h5 className="font-serif font-bold text-sm text-zelda-charcoal mt-1">
                            {block.title}
                          </h5>
                          {block.type === 'link' && (
                            <p className="text-[10px] text-blue-500 font-mono mt-0.5 truncate">
                              Url: {block.linkUrl}
                            </p>
                          )}
                          <p className="text-xs text-zelda-charcoal/70 line-clamp-2 mt-1.5 bg-gray-50 p-2 rounded border border-gray-100 font-mono">
                            {block.content}
                          </p>
                        </div>

                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleEditSidebarClick(block)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-xs flex items-center justify-center cursor-pointer"
                            title="Edit Block"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSidebar(block.id, block.title)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-xs flex items-center justify-center cursor-pointer"
                            title="Banish Block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-zelda-green-forest border-t-4 border-zelda-gold py-12 px-4 text-center text-xs text-white">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Live-Action Movie Special Feature Panel */}
          <div className="relative overflow-hidden bg-[#1A1A1A]/80 border-2 border-zelda-gold/60 rounded-2xl p-6 md:p-8 shadow-2xl text-left max-w-5xl mx-auto">
            <div className="absolute right-0 top-0 w-96 h-96 bg-[radial-gradient(circle,rgba(184,134,11,0.15),transparent_60%)] pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-zelda-green-forest/30 blur-3xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
              <div className="space-y-4 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-serif uppercase tracking-widest bg-zelda-gold/20 text-zelda-gold border border-zelda-gold/30">
                  <Film className="w-3.5 h-3.5" /> Upcoming Live-Action Movie
                </span>
                <h2 className="text-xl md:text-3xl font-serif font-extrabold text-zelda-gold tracking-wide">
                  Live-Action Zelda Film Tracker
                </h2>
                <p className="text-gray-300 leading-relaxed text-xs md:text-sm">
                  Co-produced by <strong className="text-white">Shigeru Miyamoto</strong> & <strong className="text-white">Avi Arad</strong>, directed by <strong className="text-white">Wes Ball</strong>. Early whispers point to practical epic scales, visual splendor modeled directly on Miyazaki animations, and an original narrative drawing from multiple timeline branches.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-black/40 border border-white/10 rounded-lg p-2.5">
                    <div className="text-[9px] text-zelda-gold uppercase tracking-widest font-semibold">Current Phase</div>
                    <div className="text-xs font-serif font-bold text-white mt-0.5">Pre-Production / Script</div>
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-lg p-2.5">
                    <div className="text-[9px] text-zelda-gold uppercase tracking-widest font-semibold">Aesthetic Goal</div>
                    <div className="text-xs font-serif font-bold text-white mt-0.5">Live Miyazaki Feel</div>
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-lg p-2.5 col-span-2 sm:col-span-1">
                    <div className="text-[9px] text-zelda-gold uppercase tracking-widest font-semibold">Studio Partner</div>
                    <div className="text-xs font-serif font-bold text-white mt-0.5">Sony Pictures & Nintendo</div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto bg-black/60 border border-zelda-gold/30 rounded-xl p-4 text-center min-w-[220px]">
                <div className="font-serif text-[10px] uppercase tracking-widest text-zelda-gold mb-2">Movie Hype Status</div>
                <div className="text-3xl font-black font-serif text-white tracking-widest mb-0.5 animate-pulse">98.4%</div>
                <div className="text-[9px] text-gray-400 uppercase tracking-wider">Fan Registry Enthusiasm</div>
                <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col gap-1">
                  <span className="text-[11px] text-gray-300 italic">"Ghibli meets Hyrule is our absolute dream come true!"</span>
                  <span className="text-[8px] text-zelda-gold font-bold tracking-widest uppercase">— Fan Club Consensus</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="flex justify-center gap-1 text-zelda-gold mb-4">
              <span>▲</span>
              <span>▲</span>
              <span>▲</span>
            </div>
            <p className="font-serif uppercase tracking-widest text-[#EAE2CF] text-[10px]">
              Hyrule Fan Alliance &bull; Non-Profit Interactive Tribute
            </p>
            <p className="max-w-2xl mx-auto leading-relaxed text-gray-300 mt-2">
              The Legend of Zelda, Link, Zelda, Triforce, and all associated locations, items, and logos are registered trademarks of Nintendo Co., Ltd. This platform operates under non-commercial, copyright-friendly fair use criteria to foster community creations, educational study of narrative structure, and accessibility assistance.
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL: PARCHMENT IP CERTIFICATE OF AUTHENTICITY */}
      <AnimatePresence>
        {activeCertificate && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#F4EADA] text-[#3D2F15] border-[12px] border-double border-[#8C6B30] rounded-2xl p-6 md:p-8 max-w-xl w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              {/* Decorative Triforce Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                <span className="text-[350px]">▲</span>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setActiveCertificate(null)}
                className="absolute top-4 right-4 text-[#8C6B30] hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-4">
                <div className="text-[#8C6B30] tracking-[0.2em] font-serif font-black text-xs uppercase">
                  Royal Hyrule Registry of Intellectual Assets
                </div>
                
                <h3 className="font-serif text-xl md:text-2xl font-black uppercase border-b-2 border-dashed border-[#8C6B30]/40 pb-4">
                  Certificate of Authenticity & Fan Tokenization
                </h3>

                <div className="py-2 text-sm leading-relaxed space-y-4">
                  <p className="italic font-serif">
                    "Let it be known to all travelers of Hyrule, Termina, and the surrounding seas that this creation has been registered in the Royal Archive."
                  </p>

                  <div className="bg-amber-100/50 rounded-lg p-4 text-left border border-[#8C6B30]/20 space-y-2.5 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block font-serif">Verified Creator</span>
                      <strong className="text-sm font-serif font-bold text-black">{activeCertificate.ownerAddress.startsWith('0xFanClubMember_') ? activeCertificate.ownerAddress.split('_')[1] : 'Anonymous Scribe'}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block font-serif">Asset Registry Token ID</span>
                      <strong className="text-[#8C6B30] font-bold text-sm">{activeCertificate.tokenId}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block font-serif">License Parameters</span>
                      <span className="font-serif font-semibold text-black leading-normal block mt-0.5">{activeCertificate.copyrightLicense}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-[#8C6B30]/15 pt-2.5">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block font-serif">Royalties Percentage</span>
                        <span className="font-serif font-bold text-black">{activeCertificate.royaltiesPercentage}% on secondaries</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block font-serif">Time Sealed</span>
                        <span className="text-black font-sans text-[11px]">{activeCertificate.timestamp.split('T')[0]}</span>
                      </div>
                    </div>

                    <div className="border-t border-[#8C6B30]/15 pt-2.5">
                      <span className="text-[10px] text-gray-500 uppercase block font-serif">Cryptographic Hash</span>
                      <span className="text-[9px] break-all leading-normal text-gray-700 block mt-0.5">{activeCertificate.transactionHash}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block font-serif">Verification Smart Contract</span>
                      <span className="text-[9px] break-all text-gray-700 block mt-0.5">{activeCertificate.contractAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-center gap-1.5 text-[#8C6B30]">
                  <span className="text-lg">▲</span>
                  <span className="text-lg">▲</span>
                  <span className="text-lg">▲</span>
                </div>
                
                <p className="text-[9px] text-[#8C6B30]/60 uppercase tracking-widest font-serif pt-1">
                  Sealed under the crest of Courage, Wisdom, and Power
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* MULTI-AUTHENTICATION & WEB3 AUTHENTICATION MODAL */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#FAF6EE] text-[#1E251C] rounded-2xl border-4 border-zelda-gold shadow-2xl overflow-hidden font-sans"
            >
              {/* Gold Triforce Border Trim */}
              <div className="h-2 bg-gradient-to-r from-zelda-gold via-[#EAE2CF] to-zelda-gold" />
              
              {/* Close Button */}
              <button 
                onClick={() => { setIsAuthModalOpen(false); setAuthError(''); }}
                className="absolute top-4 right-4 text-zelda-green-forest hover:text-black transition-colors p-1 rounded-full hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-8 space-y-6">
                {/* Modal Header */}
                <div className="text-center space-y-1">
                  <div className="text-zelda-gold text-lg tracking-[0.25em] font-serif font-black animate-pulse">
                    ▲ ▲ ▲
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-black uppercase text-zelda-green-forest tracking-wider">
                    Hero Authentication
                  </h3>
                  <p className="text-xs text-zelda-charcoal/70 max-w-sm mx-auto">
                    Authenticate your identity to join the alliance, leave comments, and chronicle your masterpieces.
                  </p>
                </div>

                {/* Tab selector */}
                <div className="flex border-b border-zelda-border-sand/40">
                  <button
                    onClick={() => { setAuthModalMode(authModalMode === 'web3' ? 'signin' : authModalMode); setAuthError(''); }}
                    className={`flex-1 py-2.5 text-center font-serif font-semibold text-xs uppercase tracking-wider transition-colors border-b-2 ${
                      authModalMode !== 'web3'
                        ? 'border-zelda-green-forest text-zelda-green-forest font-bold'
                        : 'border-transparent text-gray-500 hover:text-zelda-charcoal'
                    }`}
                  >
                    Scribe Identity
                  </button>
                  <button
                    onClick={() => { setAuthModalMode('web3'); setAuthError(''); }}
                    className={`flex-1 py-2.5 text-center font-serif font-semibold text-xs uppercase tracking-wider transition-colors border-b-2 ${
                      authModalMode === 'web3'
                        ? 'border-zelda-green-forest text-zelda-green-forest font-bold'
                        : 'border-transparent text-gray-500 hover:text-zelda-charcoal'
                    }`}
                  >
                    Web3 Wallet Connection
                  </button>
                </div>

                {/* Error Banner */}
                {authError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 text-xs flex items-start gap-2.5 leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <span className="font-medium">{authError}</span>
                  </div>
                )}

                {/* Tab Contents: Scribe (Email & Social) */}
                {authModalMode !== 'web3' ? (
                  <div className="space-y-5">
                    {/* SOCIAL AUTHENTICATION PANEL */}
                    <div className="space-y-2.5">
                      <div className="text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal/60 font-semibold mb-1">
                        Fast-Travel Social Login
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Google */}
                        <button
                          onClick={() => handleProviderLogin('google')}
                          disabled={authLoadingState}
                          className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg bg-white text-xs font-medium hover:bg-gray-50 text-gray-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.66-.66-1.16-1.43-1.35-2.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                          Google
                        </button>

                        {/* Facebook */}
                        <button
                          onClick={() => handleProviderLogin('facebook')}
                          disabled={authLoadingState}
                          className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg bg-white text-xs font-medium hover:bg-gray-50 text-gray-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                          <svg className="w-4 h-4 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Facebook
                        </button>

                        {/* GitHub */}
                        <button
                          onClick={() => handleProviderLogin('github')}
                          disabled={authLoadingState}
                          className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg bg-white text-xs font-medium hover:bg-gray-50 text-gray-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                          <svg className="w-4 h-4 fill-black shrink-0" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                          GitHub
                        </button>

                        {/* Twitter */}
                        <button
                          onClick={() => handleProviderLogin('twitter')}
                          disabled={authLoadingState}
                          className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg bg-white text-xs font-medium hover:bg-gray-50 text-gray-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                          <svg className="w-4 h-4 fill-black shrink-0" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                          Twitter / X
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <div className="h-px bg-zelda-border-sand/40 flex-1" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-zelda-charcoal/50 font-serif">or use royal registry mail</span>
                      <div className="h-px bg-zelda-border-sand/40 flex-1" />
                    </div>

                    {/* EMAIL AUTHENTICATION FORM */}
                    {authModalMode === 'signin' ? (
                      <form onSubmit={handleEmailSignIn} className="space-y-4">
                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-[10px] font-serif uppercase tracking-widest text-zelda-charcoal font-bold mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="e.g., link@hyrule.org"
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                              className="w-full bg-white border border-zelda-border-sand/60 rounded-lg p-2.5 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-serif uppercase tracking-widest text-zelda-charcoal font-bold mb-1">
                              Passphrase / Password
                            </label>
                            <input
                              type="password"
                              required
                              placeholder="Enter secret word"
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              className="w-full bg-white border border-zelda-border-sand/60 rounded-lg p-2.5 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal font-sans"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={authLoadingState}
                          className="w-full py-2.5 bg-zelda-green-forest hover:bg-zelda-green-forest/90 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {authLoadingState ? 'Decrypting Scroll...' : 'Enter Sanctum ▲'}
                        </button>

                        <div className="text-center text-xs">
                          <span className="text-gray-500">New traveler? </span>
                          <button
                            type="button"
                            onClick={() => { setAuthModalMode('signup'); setAuthError(''); }}
                            className="text-zelda-green-forest font-semibold hover:underline font-serif uppercase tracking-wider text-[10px]"
                          >
                            Create Scribe Identity ▲
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleEmailSignUp} className="space-y-4">
                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-[10px] font-serif uppercase tracking-widest text-zelda-charcoal font-bold mb-1">
                              Hero Display Name
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g., Hero of Winds"
                              value={authDisplayName}
                              onChange={(e) => setAuthDisplayName(e.target.value)}
                              className="w-full bg-white border border-zelda-border-sand/60 rounded-lg p-2.5 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-serif uppercase tracking-widest text-zelda-charcoal font-bold mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="e.g., zelda@hyrule.gov"
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                              className="w-full bg-white border border-zelda-border-sand/60 rounded-lg p-2.5 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-serif uppercase tracking-widest text-zelda-charcoal font-bold mb-1">
                              Passphrase / Password (min 6 characters)
                            </label>
                            <input
                              type="password"
                              required
                              placeholder="Choose secure password"
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              className="w-full bg-white border border-zelda-border-sand/60 rounded-lg p-2.5 text-xs focus:outline-none focus:border-zelda-gold text-zelda-charcoal font-sans"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={authLoadingState}
                          className="w-full py-2.5 bg-zelda-gold hover:bg-[#A6802C] text-white font-serif font-bold text-xs uppercase tracking-widest rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {authLoadingState ? 'Engraving Seal...' : 'Engrave Identity ▲'}
                        </button>

                        <div className="text-center text-xs">
                          <span className="text-gray-500">Already registered? </span>
                          <button
                            type="button"
                            onClick={() => { setAuthModalMode('signin'); setAuthError(''); }}
                            className="text-zelda-green-forest font-semibold hover:underline font-serif uppercase tracking-wider text-[10px]"
                          >
                            Return to Sanctum ▲
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  /* Web3 Wallet Tab contents */
                  <div className="space-y-6">
                    <div className="bg-black/5 rounded-xl p-4 border border-zelda-gold/15 space-y-2 text-center">
                      <div className="w-12 h-12 bg-zelda-gold/10 text-zelda-gold rounded-full flex items-center justify-center mx-auto border border-zelda-gold/25">
                        <Wallet className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif font-bold text-sm uppercase text-zelda-green-forest tracking-wider">
                        Decentralized Key Authentication
                      </h4>
                      <p className="text-xs text-zelda-charcoal/80 leading-relaxed max-w-sm mx-auto">
                        Connect your Web3 Web Wallet (MetaMask, Coinbase, etc.) to securely sign in with your cryptographic address. No password or email needed!
                      </p>
                    </div>

                    <button
                      onClick={handleWeb3Connect}
                      disabled={web3Connecting}
                      className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                    >
                      <img src="https://api.dicebear.com/7.x/identicon/svg?seed=metamask" alt="MetaMask" className="w-4 h-4 rounded-full" />
                      {web3Connecting ? 'Connecting Ledger...' : 'Connect MetaMask Wallet ▲'}
                    </button>

                    <div className="flex items-center justify-center gap-3">
                      <div className="h-px bg-zelda-border-sand/40 flex-1" />
                      <span className="text-[9px] uppercase font-bold tracking-widest text-zelda-charcoal/50 font-serif">or connect pocket simulation</span>
                      <div className="h-px bg-zelda-border-sand/40 flex-1" />
                    </div>

                    {/* Pocket simulation fallback option if MetaMask is not loaded or for easy testing */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSimulatedWeb3Connect('Triforce Ledger')}
                        disabled={web3Connecting}
                        className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-zelda-gold/30 bg-amber-50/50 hover:bg-amber-100/50 text-center transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Wallet className="w-5 h-5 text-zelda-gold" />
                        <span className="text-[10px] font-serif font-bold text-zelda-green-forest uppercase tracking-wider">Triforce Wallet</span>
                        <span className="text-[8px] text-gray-500 font-mono">Simulated Web3</span>
                      </button>

                      <button
                        onClick={() => handleSimulatedWeb3Connect('Kokiri Shield')}
                        disabled={web3Connecting}
                        className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-zelda-gold/30 bg-amber-50/50 hover:bg-amber-100/50 text-center transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Shield className="w-5 h-5 text-zelda-green-forest" />
                        <span className="text-[10px] font-serif font-bold text-zelda-green-forest uppercase tracking-wider">Kokiri Shield</span>
                        <span className="text-[8px] text-gray-500 font-mono">Simulated Web3</span>
                      </button>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-[10px] font-serif leading-normal text-center">
                      ℹ️ **Iframe Restrictions Note**: Web browsers often restrict MetaMask popup access within sandboxed previews. If MetaMask fails to open, click **Triforce Wallet** or **Kokiri Shield** above to fully test the Web3 workflow instantly!
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
