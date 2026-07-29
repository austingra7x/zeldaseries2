import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  Award, 
  Calendar, 
  Gamepad2, 
  Clock, 
  Trophy, 
  Heart, 
  Sparkles, 
  Share2, 
  Edit3, 
  CheckCircle, 
  Globe, 
  Plus, 
  Image as ImageIcon, 
  Check, 
  Zap, 
  Crown,
  ExternalLink,
  Flame,
  Star,
  RefreshCw,
  FileText,
  Video,
  Layers,
  Eye,
  X,
  Bookmark
} from 'lucide-react';
import { UserSubmission, TokenDetails } from '../../types';

export interface UserProfileData {
  displayName: string;
  avatarIcon: string;
  avatarBg: string;
  fanSinceYear: number;
  favoriteGame: string;
  isFanClubMember: boolean;
  memberId: string;
  syncedAccounts: {
    google: boolean;
    meta: boolean;
    discord: boolean;
    nintendo: boolean;
  };
  stats: {
    completed100Percent: number;
    speedrunBest: string;
    heartContainers: number;
    korokSeeds: number;
    hoursPlayed: number;
  };
  bio: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageData?: string;
  date: string;
  likes: number;
}

export interface CombinedCreationItem {
  id: string;
  title: string;
  author: string;
  type: string;
  categoryTag: string;
  imageData?: string;
  contentUrl?: string;
  contentBody?: string;
  description?: string;
  date: string;
  likes: number;
  tokenized?: boolean;
  tokenDetails?: TokenDetails;
  source: 'canvas' | 'creator_club';
  rawSubmissionId?: string;
}

export interface UserProfileSectionProps {
  submissions?: UserSubmission[];
  onNavigateToTab?: (tab: 'news' | 'lore' | 'submissions' | 'guide' | 'portal' | 'admin') => void;
  onOpenSubmission?: (id: string) => void;
  onOpenCanvas?: () => void;
}

const DEFAULT_PROFILE: UserProfileData = {
  displayName: 'Hero of Twilight - Austin',
  avatarIcon: '🗡️',
  avatarBg: 'bg-gradient-to-tr from-amber-500 to-emerald-600',
  fanSinceYear: 1998,
  favoriteGame: 'The Legend of Zelda: Ocarina of Time',
  isFanClubMember: true,
  memberId: 'ZFC-98420-HYRULE',
  syncedAccounts: {
    google: true,
    meta: true,
    discord: false,
    nintendo: true,
  },
  stats: {
    completed100Percent: 8,
    speedrunBest: 'OOT Any% - 18m 42s',
    heartContainers: 148,
    korokSeeds: 900,
    hoursPlayed: 1450,
  },
  bio: 'Lifelong Zelda explorer! Mastered all 3D dungeons, collected all 900 Korok seeds in BOTW & TOTK, and active speedrunner.',
};

const ZELDA_GAMES_LIST = [
  'The Legend of Zelda: Ocarina of Time',
  'The Legend of Zelda: Tears of the Kingdom',
  'The Legend of Zelda: Breath of the Wild',
  'The Legend of Zelda: The Wind Waker',
  'The Legend of Zelda: Twilight Princess',
  'The Legend of Zelda: Majora\'s Mask',
  'The Legend of Zelda: A Link to the Past',
  'The Legend of Zelda: Skyward Sword',
  'The Legend of Zelda: Link\'s Awakening',
  'The Legend of Zelda: Echoes of Wisdom',
  'The Legend of Zelda (1986)',
];

const AVATAR_OPTIONS = [
  { icon: '🗡️', label: 'Link' },
  { icon: '👑', label: 'Zelda' },
  { icon: '🔥', label: 'Ganondorf' },
  { icon: '👁️', label: 'Sheik' },
  { icon: '🔱', label: 'Mipha' },
  { icon: '🪨', label: 'Daruk' },
  { icon: '⚡', label: 'Urbosa' },
  { icon: '🪶', label: 'Revali' },
  { icon: '🍃', label: 'Korok' },
  { icon: '🧚', label: 'Navi' },
];

const FALLBACK_CREATOR_SUBMISSIONS: UserSubmission[] = [
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
    title: "The Hero's Burden: A Psychological Study of Link's Silence",
    type: 'literature',
    contentBody: `Link's silence has been a defining trait of The Legend of Zelda for four decades. While originally a technical limitation designed to facilitate player projection, modern entries—most notably Breath of the Wild—have retroactively integrated his silence into the game's actual lore.\n\nIn Zelda's diary, she reveals that Link carries an unbearable weight as the chosen Hero. He chooses to stay quiet because he feels that with so much pressure on his shoulders, it is best to silently endure rather than express his doubts or vulnerabilities. His silence is not a lack of character, but an armor of survival.`,
    description: "A deep-dive essay examining the narrative justification of Link's iconic quiet nature and its roots in Breath of the Wild lore.",
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
    description: 'Just completed this Hylian Shield replica! It weighs about 6 lbs, features a heavy-duty fiberglass base, laser-cut aluminum trim, and hand-painted triforce and crimson loftwing insignias.',
    date: '2026-07-08',
    tokenized: true,
    tokenDetails: {
      tokenId: '#ZELDA-0003',
      contractAddress: '0xTriforce8c4d613ff9ad4da788f57c12f1ace009',
      transactionHash: '0x3f12a991b88e001923ab9018e772f10928a3f81e9202021ef9a810f22910fa',
      copyrightLicense: 'CC BY 4.0',
      timestamp: '2026-07-08T18:00:00Z',
      royaltiesPercentage: 5,
      ownerAddress: '0xCosplayShieldsMaster',
    },
    likes: 81,
  }
];

export function UserProfileSection({ 
  submissions, 
  onNavigateToTab, 
  onOpenSubmission, 
  onOpenCanvas 
}: UserProfileSectionProps) {
  // Load profile from local state
  const [profile, setProfile] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem('zelda_user_public_profile_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PROFILE;
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('zelda_user_artwork_gallery');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'default-1',
        title: 'Master Sword in the Lost Woods',
        date: '2026-07-20',
        likes: 42,
      },
      {
        id: 'default-2',
        title: 'Sheikah Shrine Crest Inscription',
        date: '2026-07-25',
        likes: 28,
      }
    ];
  });

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'creator_club' | 'canvas' | 'tokenized'>('all');
  const [activeModalItem, setActiveModalItem] = useState<CombinedCreationItem | null>(null);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('zelda_user_gallery_liked');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfileData>(profile);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync state back to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zelda_user_public_profile_v1', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  // Save profile edit
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editForm);
    setIsEditing(false);
    setNotification('Profile details updated successfully!');
    setTimeout(() => setNotification(null), 3000);
  };

  // Toggle Fan Club Membership Subscription
  const handleToggleFanClub = () => {
    const updatedStatus = !profile.isFanClubMember;
    const nextProfile = {
      ...profile,
      isFanClubMember: updatedStatus,
      memberId: updatedStatus ? `ZFC-${Math.floor(10000 + Math.random() * 90000)}-HYRULE` : profile.memberId
    };
    setProfile(nextProfile);
    setEditForm(nextProfile);

    if (updatedStatus) {
      setNotification('🎉 Congratulations! You are now a verified Zelda Fan Club Member!');
    } else {
      setNotification('Subscription updated.');
    }
    setTimeout(() => setNotification(null), 3500);
  };

  // Social Profile Sync Handler
  const handleSocialSync = (network: 'google' | 'meta' | 'discord' | 'nintendo') => {
    const currentlySynced = profile.syncedAccounts[network];
    const nextSynced = {
      ...profile.syncedAccounts,
      [network]: !currentlySynced,
    };

    const nextProfile = {
      ...profile,
      syncedAccounts: nextSynced,
      isFanClubMember: true,
    };

    setProfile(nextProfile);
    setEditForm(nextProfile);

    const netName = network.toUpperCase();
    if (!currentlySynced) {
      setNotification(`Successfully connected ${netName} profile! Verified "Zelda Fan" Badge granted!`);
    } else {
      setNotification(`Disconnected ${netName} integration.`);
    }
    setTimeout(() => setNotification(null), 3500);
  };

  // Combine Canvas creations and Creator Club Submissions
  const creatorSubmissionsList = (submissions && submissions.length > 0) ? submissions : FALLBACK_CREATOR_SUBMISSIONS;

  const combinedItems: CombinedCreationItem[] = [
    // 1. Interactive Canvas Artworks
    ...galleryItems.map(item => ({
      id: item.id,
      title: item.title,
      author: profile.displayName,
      type: 'canvas',
      categoryTag: 'Interactive Canvas',
      imageData: item.imageData,
      date: item.date,
      likes: item.likes + (likedItems[item.id] ? 1 : 0),
      source: 'canvas' as const,
      description: 'Custom artwork created using the Hyrule Interactive Art Canvas vector & drawing tools.'
    })),
    // 2. Creator Club Submissions
    ...creatorSubmissionsList.map(sub => ({
      id: `cc-${sub.id}`,
      title: sub.title,
      author: sub.author,
      type: sub.type || 'art',
      categoryTag: `Creator Club (${(sub.type || 'art').toUpperCase()})`,
      imageData: (sub.type === 'art' || sub.type === 'memorabilia' || sub.type === 'nft') 
        ? sub.contentUrl 
        : (sub.galleryImages?.[0] || sub.contentUrl),
      contentUrl: sub.contentUrl,
      contentBody: sub.contentBody,
      description: sub.description,
      date: sub.date,
      likes: sub.likes + (likedItems[`cc-${sub.id}`] ? 1 : 0),
      tokenized: sub.tokenized,
      tokenDetails: sub.tokenDetails,
      source: 'creator_club' as const,
      rawSubmissionId: sub.id
    }))
  ];

  const filteredCombinedItems = combinedItems.filter(item => {
    if (selectedFilter === 'creator_club') return item.source === 'creator_club';
    if (selectedFilter === 'canvas') return item.source === 'canvas';
    if (selectedFilter === 'tokenized') return item.tokenized === true;
    return true;
  });

  const handleToggleLike = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = {
      ...likedItems,
      [itemId]: !likedItems[itemId]
    };
    setLikedItems(nextState);
    try {
      localStorage.setItem('zelda_user_gallery_liked', JSON.stringify(nextState));
    } catch (err) {
      console.error(err);
    }
  };

  const getItemTypeBadge = (type: string, source: 'canvas' | 'creator_club') => {
    if (source === 'canvas') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider bg-amber-500 text-amber-950 flex items-center gap-1 shadow-xs">
          🎨 Canvas
        </span>
      );
    }
    switch (type) {
      case 'art':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
            🖼️ Fan Art
          </span>
        );
      case 'video':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider bg-rose-600 text-white flex items-center gap-1 shadow-xs">
            🎬 Video
          </span>
        );
      case 'literature':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider bg-purple-600 text-white flex items-center gap-1 shadow-xs">
            📜 Literature
          </span>
        );
      case 'memorabilia':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider bg-blue-600 text-white flex items-center gap-1 shadow-xs">
            🛡️ Replica
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider bg-yellow-600 text-white flex items-center gap-1 shadow-xs">
            ✨ Submission
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="py-2.5 px-4 bg-emerald-800 text-emerald-100 border border-emerald-500 rounded-xl text-xs font-serif text-center animate-pulse shadow-lg">
          {notification}
        </div>
      )}

      {/* Main Profile Header Hero Card */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-emerald-950 border-2 border-amber-400/50 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-amber-100">
        
        {/* Decorative Crest Watermark */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 90" className="w-80 h-80 fill-yellow-400">
            <polygon points="50,5 5,85 95,85" />
          </svg>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 relative z-10">
          
          {/* Avatar & Main Info */}
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            
            {/* Avatar Circle with Gold Border */}
            <div className="relative group">
              <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full ${profile.avatarBg} p-1 shadow-xl flex items-center justify-center border-4 border-amber-400 text-4xl md:text-5xl ring-4 ring-amber-500/30`}>
                <span>{profile.avatarIcon}</span>
              </div>
              
              {/* Badge Overlay */}
              {profile.isFanClubMember && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-amber-600 text-amber-950 px-2 py-0.5 rounded-full text-[10px] font-serif font-black uppercase tracking-wider shadow-lg flex items-center gap-1 border border-yellow-200 animate-bounce">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-950 fill-amber-300" />
                  <span>Zelda Fan</span>
                </div>
              )}
            </div>

            {/* Profile Meta */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-yellow-200">
                  {profile.displayName}
                </h2>

                {/* Custom Verified "Zelda Fan" Badge */}
                {profile.isFanClubMember && (
                  <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 font-serif text-xs font-bold rounded-full border border-yellow-200 shadow-md flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-900 fill-amber-800" />
                    <span>Verified Zelda Fan</span>
                  </span>
                )}
              </div>

              <p className="text-xs font-serif text-amber-100/90 max-w-xl">
                {profile.bio}
              </p>

              {/* Fan Since & Favorite Game Tags */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 bg-black/40 border border-amber-400/40 rounded-xl text-amber-200 flex items-center gap-1.5 font-serif">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fan Since <strong>{profile.fanSinceYear}</strong></span>
                </span>

                <span className="px-2.5 py-1 bg-black/40 border border-amber-400/40 rounded-xl text-amber-200 flex items-center gap-1.5 font-serif line-clamp-1">
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fav Game: <strong>{profile.favoriteGame}</strong></span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Edit Profile & Certificate */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setEditForm(profile); setIsEditing(!isEditing); }}
              className="px-4 py-2 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-200 font-serif font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Close Editor' : 'Edit Profile'}</span>
            </button>

            {profile.isFanClubMember && (
              <button
                onClick={() => setShowCertificateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-yellow-400 hover:to-amber-600 text-amber-950 font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>View Fan Certificate</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Edit Form Modal */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white/95 border-2 border-zelda-gold rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-in">
          <h3 className="font-serif text-lg font-bold text-zelda-charcoal flex items-center gap-2 border-b border-zelda-border-sand pb-2">
            <Edit3 className="w-5 h-5 text-zelda-gold" />
            <span>Customize Public Profile Data</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-serif">
            {/* Display Name */}
            <div className="space-y-1">
              <label className="block font-bold text-zelda-charcoal">Public Display Name</label>
              <input
                type="text"
                required
                value={editForm.displayName}
                onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                className="w-full p-2.5 bg-amber-50/50 border border-zelda-border-sand rounded-xl focus:border-zelda-gold focus:outline-none"
              />
            </div>

            {/* Fan Since Year */}
            <div className="space-y-1">
              <label className="block font-bold text-zelda-charcoal">Zelda Fan Since (Year)</label>
              <input
                type="number"
                min="1986"
                max="2026"
                value={editForm.fanSinceYear}
                onChange={(e) => setEditForm({ ...editForm, fanSinceYear: Number(e.target.value) })}
                className="w-full p-2.5 bg-amber-50/50 border border-zelda-border-sand rounded-xl focus:border-zelda-gold focus:outline-none"
              />
            </div>

            {/* Favorite Game */}
            <div className="space-y-1">
              <label className="block font-bold text-zelda-charcoal">Favorite Zelda Game</label>
              <select
                value={editForm.favoriteGame}
                onChange={(e) => setEditForm({ ...editForm, favoriteGame: e.target.value })}
                className="w-full p-2.5 bg-amber-50/50 border border-zelda-border-sand rounded-xl focus:border-zelda-gold focus:outline-none"
              >
                {ZELDA_GAMES_LIST.map((game) => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </select>
            </div>

            {/* Avatar Selection */}
            <div className="space-y-1 md:col-span-2 lg:col-span-3">
              <label className="block font-bold text-zelda-charcoal">Choose Avatar Symbol</label>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av.label}
                    type="button"
                    onClick={() => setEditForm({ ...editForm, avatarIcon: av.icon })}
                    className={`px-3 py-1.5 rounded-xl border font-bold text-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                      editForm.avatarIcon === av.icon ? 'bg-zelda-gold text-white border-yellow-300 shadow-md' : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <span>{av.icon}</span>
                    <span className="text-xs font-serif">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1 md:col-span-2 lg:col-span-3">
              <label className="block font-bold text-zelda-charcoal">Bio / Traveler Notes</label>
              <textarea
                rows={2}
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="w-full p-2.5 bg-amber-50/50 border border-zelda-border-sand rounded-xl focus:border-zelda-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-serif font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-zelda-gold hover:bg-yellow-600 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* Grid Row 1: Fan Club Subscription & Social Sync */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Fan Club Membership Subscription Box */}
        <div className="bg-gradient-to-br from-amber-50 via-amber-100/60 to-yellow-100 border border-amber-300/80 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-amber-300/60 pb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif text-lg font-bold text-amber-950">
                Royal Hyrule Fan Club Membership
              </h3>
            </div>
            
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider ${
              profile.isFanClubMember ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-800'
            }`}>
              {profile.isFanClubMember ? 'Active Member' : 'Not Subscribed'}
            </span>
          </div>

          <p className="text-xs text-amber-900/90 font-serif leading-relaxed">
            Subscribe to the official Zelda Fan Club to unlock the custom verified <strong>"Zelda Fan" Badge</strong>, issue your printable Fan Certificate, and participate in community quests!
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs font-mono text-amber-900">
              <span className="font-bold">Member ID:</span> {profile.memberId}
            </div>

            <button
              onClick={handleToggleFanClub}
              className={`px-5 py-2.5 font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${
                profile.isFanClubMember
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-yellow-500 hover:to-amber-600 text-white ring-2 ring-yellow-300'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{profile.isFanClubMember ? 'Cancel Fan Club Subscription' : 'Subscribe to Fan Club (Free)'}</span>
            </button>
          </div>
        </div>

        {/* Social Profile Sync Box */}
        <div className="bg-white/95 border border-zelda-border-sand rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2 border-b border-zelda-border-sand pb-3">
            <Globe className="w-5 h-5 text-zelda-gold" />
            <div>
              <h3 className="font-serif text-lg font-bold text-zelda-charcoal">
                Social Profile Sync & Verification
              </h3>
              <p className="text-[10px] font-mono text-zelda-charcoal/60">
                Sync with Meta / Google / Discord / Nintendo to auto-verify your profile
              </p>
            </div>
          </div>

          {/* Sync Buttons */}
          <div className="grid grid-cols-2 gap-2.5 text-xs font-serif">
            {/* Google */}
            <button
              onClick={() => handleSocialSync('google')}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                profile.syncedAccounts.google
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold">Google</span>
              </div>
              {profile.syncedAccounts.google ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <span className="text-[10px] text-stone-500 underline">Sync</span>
              )}
            </button>

            {/* Meta / Facebook */}
            <button
              onClick={() => handleSocialSync('meta')}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                profile.syncedAccounts.meta
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold">Meta / Facebook</span>
              </div>
              {profile.syncedAccounts.meta ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <span className="text-[10px] text-stone-500 underline">Sync</span>
              )}
            </button>

            {/* Discord */}
            <button
              onClick={() => handleSocialSync('discord')}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                profile.syncedAccounts.discord
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold">Discord</span>
              </div>
              {profile.syncedAccounts.discord ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <span className="text-[10px] text-stone-500 underline">Sync</span>
              )}
            </button>

            {/* Nintendo Switch */}
            <button
              onClick={() => handleSocialSync('nintendo')}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                profile.syncedAccounts.nintendo
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold">Nintendo Switch</span>
              </div>
              {profile.syncedAccounts.nintendo ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <span className="text-[10px] text-stone-500 underline">Sync</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Zelda Game Stats Dashboard */}
      <div className="bg-white/95 border border-zelda-border-sand rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-zelda-border-sand pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-zelda-gold" />
            <h3 className="font-serif text-lg font-bold text-zelda-charcoal">
              Zelda Game Achievements & Statistics
            </h3>
          </div>

          <span className="text-xs font-serif text-zelda-gold font-bold">
            Traveler Achievements
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* 100% Completed */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-center space-y-1">
            <span className="text-xl md:text-2xl font-bold font-serif text-amber-900">
              {profile.stats.completed100Percent}
            </span>
            <span className="block text-[10px] font-serif uppercase tracking-wider text-amber-800 font-bold">
              Games 100% Cleared
            </span>
          </div>

          {/* Speedrun Record */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 text-center space-y-1">
            <span className="text-xs font-bold font-mono text-emerald-900 line-clamp-1">
              {profile.stats.speedrunBest}
            </span>
            <span className="block text-[10px] font-serif uppercase tracking-wider text-emerald-800 font-bold">
              Personal Best Speedrun
            </span>
          </div>

          {/* Heart Containers */}
          <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3.5 text-center space-y-1">
            <span className="text-xl md:text-2xl font-bold font-serif text-rose-900 flex items-center justify-center gap-1">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-600" />
              {profile.stats.heartContainers}
            </span>
            <span className="block text-[10px] font-serif uppercase tracking-wider text-rose-800 font-bold">
              Hearts Collected
            </span>
          </div>

          {/* Korok Seeds */}
          <div className="bg-lime-50/80 border border-lime-200 rounded-xl p-3.5 text-center space-y-1">
            <span className="text-xl md:text-2xl font-bold font-serif text-lime-900">
              🍃 {profile.stats.korokSeeds}
            </span>
            <span className="block text-[10px] font-serif uppercase tracking-wider text-lime-800 font-bold">
              Korok Seeds Found
            </span>
          </div>

          {/* Hours Played */}
          <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-3.5 text-center space-y-1 col-span-2 md:col-span-1">
            <span className="text-xl md:text-2xl font-bold font-serif text-sky-900 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-sky-600" />
              {profile.stats.hoursPlayed}h
            </span>
            <span className="block text-[10px] font-serif uppercase tracking-wider text-sky-800 font-bold">
              Total Hours Played
            </span>
          </div>
        </div>
      </div>

      {/* Grid Row 3: Creations & Contributions Gallery (Combined Creator Club & Canvas) */}
      <div className="bg-white/95 border border-zelda-border-sand rounded-2xl p-6 shadow-md space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zelda-border-sand pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-zelda-gold" />
              <h3 className="font-serif text-lg font-bold text-zelda-charcoal">
                Creations & Contributions Gallery ({filteredCombinedItems.length})
              </h3>
            </div>
            <p className="text-xs text-zelda-charcoal/60 font-serif">
              Showcasing Creator Club entries, fan art, literature, replicas, and interactive canvas artwork.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-2">
            {onOpenCanvas && (
              <button
                onClick={onOpenCanvas}
                className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-serif font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-amber-300"
              >
                <ImageIcon className="w-4 h-4 text-amber-700" />
                <span>Open Canvas</span>
              </button>
            )}

            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('submissions')}
                className="px-3.5 py-2 bg-zelda-gold hover:bg-yellow-600 text-white font-serif font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Submit to Creator Club</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl font-serif text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'all'
                ? 'bg-amber-950 text-amber-200 shadow-sm ring-2 ring-amber-400'
                : 'bg-amber-50 hover:bg-amber-100 text-stone-700 border border-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Contributions ({combinedItems.length})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('creator_club')}
            className={`px-3.5 py-1.5 rounded-xl font-serif text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'creator_club'
                ? 'bg-amber-950 text-amber-200 shadow-sm ring-2 ring-amber-400'
                : 'bg-amber-50 hover:bg-amber-100 text-stone-700 border border-stone-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Creator Club Showcase ({combinedItems.filter(i => i.source === 'creator_club').length})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('canvas')}
            className={`px-3.5 py-1.5 rounded-xl font-serif text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'canvas'
                ? 'bg-amber-950 text-amber-200 shadow-sm ring-2 ring-amber-400'
                : 'bg-amber-50 hover:bg-amber-100 text-stone-700 border border-stone-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Canvas Art ({combinedItems.filter(i => i.source === 'canvas').length})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('tokenized')}
            className={`px-3.5 py-1.5 rounded-xl font-serif text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'tokenized'
                ? 'bg-amber-950 text-amber-200 shadow-sm ring-2 ring-amber-400'
                : 'bg-amber-50 hover:bg-amber-100 text-stone-700 border border-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>Tokenized NFTs ({combinedItems.filter(i => i.tokenized).length})</span>
          </button>
        </div>

        {/* Gallery Grid */}
        {filteredCombinedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCombinedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group bg-amber-50/40 hover:bg-amber-50/90 border border-amber-200/80 hover:border-amber-400 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
              >
                <div>
                  {/* Media Thumbnail Container */}
                  <div className="relative h-44 w-full bg-stone-900 overflow-hidden flex items-center justify-center">
                    {item.imageData ? (
                      <img
                        src={item.imageData}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : item.type === 'video' ? (
                      <div className="w-full h-full bg-gradient-to-tr from-stone-950 via-rose-950 to-amber-950 flex flex-col items-center justify-center p-4 text-center text-white space-y-2">
                        <Video className="w-10 h-10 text-rose-400 animate-pulse" />
                        <span className="font-serif text-xs font-bold line-clamp-2 px-2">{item.title}</span>
                      </div>
                    ) : item.type === 'literature' ? (
                      <div className="w-full h-full bg-gradient-to-tr from-amber-950 via-stone-900 to-purple-950 flex flex-col items-center justify-center p-4 text-center text-amber-100 space-y-2">
                        <FileText className="w-10 h-10 text-purple-300" />
                        <span className="font-serif text-xs italic line-clamp-3 px-2 text-amber-200/90">
                          "{item.contentBody?.substring(0, 110)}..."
                        </span>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-amber-900 to-emerald-950 flex items-center justify-center text-amber-200 p-4 text-center font-serif text-sm font-bold">
                        <span>🎨 {item.title}</span>
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                      {getItemTypeBadge(item.type, item.source)}
                      {item.tokenized && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 flex items-center gap-1 shadow-xs border border-yellow-200">
                          <Sparkles className="w-3 h-3 fill-amber-950" /> NFT
                        </span>
                      )}
                    </div>

                    {/* Hover Overlay Icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3.5 py-1.5 bg-amber-400 text-amber-950 font-serif font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5">
                        <Eye className="w-4 h-4" /> View Entry
                      </span>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif font-bold text-sm text-zelda-charcoal group-hover:text-amber-800 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      
                      {/* Like Button */}
                      <button
                        onClick={(e) => handleToggleLike(item.id, e)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-xs font-serif ${
                          likedItems[item.id] 
                            ? 'bg-rose-50 border-rose-300 text-rose-600 font-bold' 
                            : 'bg-white border-stone-200 hover:bg-stone-100 text-stone-600'
                        }`}
                        title="Like this creation"
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedItems[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{item.likes}</span>
                      </button>
                    </div>

                    {item.description && (
                      <p className="text-xs text-stone-600 font-serif line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {item.tokenDetails && (
                      <div className="bg-amber-100/60 border border-amber-300/60 rounded-xl p-2 text-[10px] font-mono text-amber-950 flex items-center justify-between">
                        <span className="font-bold">{item.tokenDetails.tokenId}</span>
                        <span className="text-amber-900/80 line-clamp-1">{item.tokenDetails.copyrightLicense}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="px-4 pb-3 pt-1 border-t border-amber-200/50 flex items-center justify-between text-[11px] font-serif text-stone-500">
                  <span className="font-bold text-amber-900">By {item.author}</span>
                  <span className="font-mono text-[10px]">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-amber-50/50 border border-dashed border-amber-300 rounded-2xl p-6 space-y-3">
            <Sparkles className="w-8 h-8 text-amber-600 mx-auto animate-pulse" />
            <p className="text-sm font-serif text-amber-950 font-bold">
              No creations found in this category filter.
            </p>
            <p className="text-xs text-amber-900/80 font-serif max-w-md mx-auto">
              Visit the Interactive Canvas to draw custom vector art or submit your creations to the Royal Creator Club!
            </p>
          </div>
        )}
      </div>

      {/* Creation Item Detail Lightbox Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF6EC] border-4 border-amber-500 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative my-8 animate-fade-in text-amber-950">
            
            {/* Close Modal Button */}
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold flex items-center justify-center cursor-pointer shadow-md transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 border-b border-amber-300 pb-4 pr-10">
              <div className="flex flex-wrap items-center gap-2">
                {getItemTypeBadge(activeModalItem.type, activeModalItem.source)}
                {activeModalItem.tokenized && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 border border-yellow-200 shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-amber-950" /> Verified IP Asset
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl font-bold text-amber-950">
                {activeModalItem.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs font-serif text-amber-900">
                <span>By <strong className="text-amber-950">{activeModalItem.author}</strong></span>
                <span>&bull;</span>
                <span>Published <strong className="font-mono text-[11px]">{activeModalItem.date}</strong></span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-rose-700 font-bold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  {activeModalItem.likes} Likes
                </span>
              </div>
            </div>

            {/* Media Body View */}
            <div className="space-y-4">
              {activeModalItem.imageData ? (
                <div className="rounded-2xl overflow-hidden border-2 border-amber-300/80 shadow-md bg-stone-900 flex justify-center max-h-96">
                  <img
                    src={activeModalItem.imageData}
                    alt={activeModalItem.title}
                    className="max-h-96 w-auto object-contain"
                  />
                </div>
              ) : activeModalItem.type === 'video' ? (
                <div className="bg-gradient-to-br from-stone-950 via-rose-950 to-amber-950 border-2 border-rose-400/50 rounded-2xl p-8 text-center text-amber-100 space-y-4 shadow-xl">
                  <Video className="w-16 h-16 text-rose-400 mx-auto animate-pulse" />
                  <h3 className="font-serif text-lg font-bold">{activeModalItem.title}</h3>
                  <p className="text-xs text-amber-200/80 max-w-md mx-auto">{activeModalItem.description}</p>
                  {activeModalItem.contentUrl && (
                    <a
                      href={activeModalItem.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                    >
                      <ExternalLink className="w-4 h-4" /> Watch Video Media
                    </a>
                  )}
                </div>
              ) : activeModalItem.type === 'literature' && activeModalItem.contentBody ? (
                <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-6 font-serif text-xs leading-relaxed space-y-3 max-h-80 overflow-y-auto shadow-inner text-amber-950 whitespace-pre-wrap">
                  {activeModalItem.contentBody}
                </div>
              ) : (
                <div className="bg-amber-100/50 border border-amber-200 rounded-2xl p-6 text-center text-xs font-serif text-amber-900">
                  {activeModalItem.description || 'No additional media preview available.'}
                </div>
              )}

              {/* Description */}
              {activeModalItem.description && (
                <p className="text-xs font-serif leading-relaxed text-amber-900 bg-amber-100/40 p-4 rounded-xl border border-amber-200">
                  {activeModalItem.description}
                </p>
              )}

              {/* Blockchain / Token Details Card if Tokenized */}
              {activeModalItem.tokenDetails && (
                <div className="bg-amber-950 text-amber-100 border-2 border-yellow-400/60 rounded-2xl p-5 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-amber-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="font-serif font-bold text-xs text-yellow-300 uppercase tracking-wider">
                        Verified Blockchain Token & License
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-yellow-400">
                      {activeModalItem.tokenDetails.tokenId}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
                    <div>
                      <span className="text-amber-400 font-bold block">License Type:</span>
                      <span className="text-amber-200">{activeModalItem.tokenDetails.copyrightLicense}</span>
                    </div>
                    <div>
                      <span className="text-amber-400 font-bold block">Creator Royalties:</span>
                      <span className="text-amber-200">{activeModalItem.tokenDetails.royaltiesPercentage}%</span>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <span className="text-amber-400 font-bold block">Contract Address:</span>
                      <span className="text-amber-300 text-[10px] break-all">{activeModalItem.tokenDetails.contractAddress}</span>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <span className="text-amber-400 font-bold block">Transaction Hash:</span>
                      <span className="text-amber-300 text-[10px] break-all">{activeModalItem.tokenDetails.transactionHash}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Action Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-amber-300 pt-4">
              <button
                onClick={(e) => handleToggleLike(activeModalItem.id, e)}
                className={`px-4 py-2 rounded-xl font-serif font-bold text-xs flex items-center gap-2 cursor-pointer transition-all border ${
                  likedItems[activeModalItem.id]
                    ? 'bg-rose-600 text-white border-rose-700 shadow-md'
                    : 'bg-amber-200 hover:bg-amber-300 text-amber-950 border-amber-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${likedItems[activeModalItem.id] ? 'fill-white' : ''}`} />
                <span>{likedItems[activeModalItem.id] ? 'Liked Entry' : 'Like Creation'} ({activeModalItem.likes})</span>
              </button>

              <div className="flex items-center gap-2">
                {activeModalItem.rawSubmissionId && onOpenSubmission && (
                  <button
                    onClick={() => {
                      const id = activeModalItem.rawSubmissionId!;
                      setActiveModalItem(null);
                      onOpenSubmission(id);
                    }}
                    className="px-4 py-2 bg-amber-950 hover:bg-stone-900 text-yellow-300 font-serif font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 border border-yellow-400/50"
                  >
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span>View in Creator Club Feed</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2 bg-stone-300 hover:bg-stone-400 text-stone-900 font-serif font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Fan Certificate Printable Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6EC] border-4 border-amber-500 rounded-3xl p-6 md:p-10 max-w-2xl w-full text-center space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            {/* Official Certificate Border Frame */}
            <div className="border-2 border-dashed border-amber-700/60 p-6 space-y-4">
              <div className="flex justify-center">
                <Crown className="w-12 h-12 text-amber-600 animate-pulse" />
              </div>

              <h3 className="font-serif text-xs uppercase tracking-widest text-amber-800 font-bold">
                Royal Kingdom of Hyrule
              </h3>

              <h1 className="font-serif text-2xl md:text-3xl font-black text-amber-950 tracking-wider uppercase">
                Official Zelda Fan Certificate
              </h1>

              <p className="text-xs font-serif italic text-amber-900">
                This ancient scroll hereby certifies that
              </p>

              <div className="font-serif text-2xl font-bold text-yellow-800 border-b-2 border-yellow-600/50 pb-1 max-w-sm mx-auto">
                {profile.displayName}
              </div>

              <p className="text-xs font-serif text-amber-950 leading-relaxed max-w-md mx-auto">
                Is a duly registered and verified member of the Royal Zelda Fan Club, having demonstrated true courage, wisdom, and devotion to the legend since the year <strong>{profile.fanSinceYear}</strong>.
              </p>

              <div className="flex items-center justify-between text-[11px] font-mono text-amber-900 pt-4 border-t border-amber-300">
                <div>
                  <span className="font-bold">Member Code:</span> {profile.memberId}
                </div>
                <div>
                  <span className="font-bold">Verified:</span> Royal Seal Approved
                </div>
              </div>
            </div>

            <button
              onClick={() => { window.print(); }}
              className="px-6 py-2.5 bg-amber-500 hover:bg-yellow-600 text-amber-950 font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
            >
              Print Official Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

