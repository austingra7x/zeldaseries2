/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Check,
  ArrowLeft,
  Calendar,
  UserCheck,
  Printer,
  Globe,
  Menu,
  Layers,
  Gamepad2,
  Eye,
  Edit3,
  Code,
  Tag,
  Info,
  Mail,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewsItem, LoreEntry, UserSubmission, SubmissionType, TokenDetails, Comment, SidebarBlock } from './types';
import { CommentsSection } from './components/CommentsSection';
import { NewsContentRenderer } from './components/NewsContentRenderer';
import { CreationContentRenderer } from './components/CreationContentRenderer';
import { NewsGalleryViewer } from './components/NewsGalleryViewer';
import { RssNewsGeneratorSection } from './components/RssNewsGeneratorSection';
import { FooterPageViews, FooterPageType } from './components/FooterPageViews';
import { ArchivesSection } from './components/ArchivesSection';
import { OcarinaSidebarWidget } from './components/OcarinaSidebarWidget';
import { FanPortalSection } from './components/portal/FanPortalSection';
import { UserRolesManager } from './components/admin/UserRolesManager';
import { AppUser } from './types';

export default function App() {
  // Authentication State with Session Persistence
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('hyrule_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(false);

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
      date: '2026-07-25',
      category: 'movie',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
      likes: 88,
    },
    {
      id: 'n2',
      title: 'Zelda Symphonic Concert "Echoes of Hyrule" Announces 2026 Tour Dates',
      summary: 'A legendary concert tour featuring live orchestral arrangements of Koji Kondo\'s historic Zelda themes will tour major global arenas later this year.',
      content: `<p>Nintendo has officially announced <strong>"Echoes of Hyrule: The Legend of Zelda Concert Series"</strong> for late 2026.</p><p>The global tour will feature a <strong>90-piece symphony orchestra</strong> performing spectacular arrangements spanning the entire 40-year history of the series, created under the guidance of legendary composer Koji Kondo.</p><h3>Featured Games & Experiences</h3><ul><li>Breathtaking suites from <em>Ocarina of Time</em>, <em>Wind Waker</em>, <em>Breath of the Wild</em>, and <em>Tears of the Kingdom</em></li><li>High-definition gameplay footage projected onto a massive arena screen</li><li>Special VIP packages including replica Ocarina and collectible concert programs</li></ul>`,
      date: '2026-07-22',
      category: 'game',
      imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
      likes: 64,
    },
    {
      id: 'n3',
      title: 'Casting Rumors Swirl: Who Will Play Link, Zelda, and Ganondorf?',
      summary: 'Hollywood insiders drop potential names for the legendary trio in the upcoming live-action movie. Fans debate physical traits and acting pedigree.',
      content: `<p>As pre-production ramps up for the <strong>Legend of Zelda</strong> live-action adaptation, casting rumors are spreading like wildfire across Hyrule fan communities.</p><h3>The Hero & The Princess</h3><p>Insiders suggest that Nintendo and Sony are searching for an athletic, expressive, relatively fresh face to portray the silent hero <strong>Link</strong>, prioritizing non-verbal physical acting.</p><p>For <strong>Princess Zelda</strong>, names like <em>Saoirse Ronan</em> and <em>Hunter Schafer</em> are frequently discussed in fan-casting circles, with producers reportedly looking for someone who can balance royal grace with active, scientific curiosity.</p><h3>The Demon King</h3><p>As for the menacing <strong>Ganondorf</strong>, fans are clamoring for towering actors with dramatic intensity, with <em>Idris Elba</em> and <em>Jason Momoa</em> leading fan expectations. Wes Ball has hinted that the cast will feature a blend of established talent and exciting newcomers.</p>`,
      date: '2026-07-18',
      category: 'movie',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      likes: 42,
    },
    {
      id: 'n4',
      title: 'Community Spotlight: Fan-Made "Zelda Maker" Level Editor Gains Traction',
      summary: 'An incredibly detailed, non-profit fan project allows players to design their own 2D classic Zelda dungeons and share them with the club.',
      content: `<p>The Zelda fan community has done it again! A group of dedicated developers has released an alpha build of a non-commercial, copyright-friendly level editor inspired by classic 8-bit and 16-bit Zelda games, dubbed <strong>"Hyrule Builder"</strong>.</p><p>The engine allows users to place blocks, trigger switches, arrange puzzles, and customize custom dungeon bosses. Over <strong>5,000 fan dungeons</strong> have already been uploaded by creative players in the first 48 hours.</p>`,
      date: '2026-07-15',
      category: 'community',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      likes: 51,
    },
    {
      id: 'n5',
      title: 'Echoes of Wisdom Expansion Speculation: New Rift Mysteries Uncovered',
      summary: 'Data analysts examine recent gameplay updates and lore hints suggesting new rift challenges coming to the Wisdom timeline.',
      content: `<p>Recent deep-dives into <em>The Legend of Zelda: Echoes of Wisdom</em> have revealed hidden dialogue triggers and lingering rift anchors. Scribes speculate an upcoming content patch or Master Quest difficulty mode may be announced during the next Direct broadcast.</p>`,
      date: '2026-07-10',
      category: 'game',
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      likes: 37,
    },
    {
      id: 'n6',
      title: 'Tears of the Kingdom Speedrun Record Broken at Summer Games Done Quick',
      summary: 'Runner "HylianSwift" smashes the TOTK Any% speedrun record live on stage, completing the game in under 42 minutes using innovative recall glitches.',
      content: `<p>At SGDQ 2026, speedrunner <strong>HylianSwift</strong> set a new world record for <em>Tears of the Kingdom</em> Any% glitch-inclusive category. Utilizing precise Recall launches and Ultrahand weapon dupes, the runner reached Ganondorf's lair in record time, raising over $20,000 for charity in a single run.</p>`,
      date: '2026-07-05',
      category: 'community',
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      likes: 95,
    },
    {
      id: 'n7',
      title: 'Official Zelda Artbook "Creating a Champion: Deluxe Volume" Announced',
      summary: 'Dark Horse Comics and Nintendo collaborate on an expanded 500-page hardcover encyclopedia documenting unseen concept sketches from Breath of the Wild and Tears of the Kingdom.',
      content: `<p>Dark Horse Comics has officially unveiled <strong>The Legend of Zelda: Creating a Champion - Royal Legacy Edition</strong>. This massive 500-page tome contains developer commentaries, early Zonai architecture blueprints, and unused character designs for the Four Champions.</p>`,
      date: '2026-06-28',
      category: 'game',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      likes: 48,
    },
    {
      id: 'n8',
      title: 'Zelda Series Reaches 160 Million Lifetime Sales Milestone',
      summary: 'Nintendo reports monumental sales figures across four decades of Zelda releases, cementing it as one of gaming history\'s most influential sagas.',
      content: `<p>In its latest financial briefing, Nintendo confirmed that <em>The Legend of Zelda</em> franchise has officially surpassed <strong>160 million total units sold worldwide</strong> since its debut on the Famicom in 1986. <em>Breath of the Wild</em> and <em>Tears of the Kingdom</em> account for over 50 million copies combined.</p>`,
      date: '2026-06-20',
      category: 'game',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      likes: 72,
    },
    {
      id: 'n9',
      title: 'Live-Action Zelda Film Sets Filming Location in New Zealand National Parks',
      summary: 'Scouting reports confirm Sony and Nintendo have secured permits to film Hyrule\'s sprawling landscapes in Fiordland National Park and Glenorchy.',
      content: `<p>Production scouts for the live-action movie have locked in breathtaking filming locations across New Zealand. The lush temperate forests and towering peaks of Fiordland will serve as the real-world backdrop for Faron Woods and Death Mountain.</p>`,
      date: '2026-06-12',
      category: 'movie',
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      likes: 61,
    },
    {
      id: 'n10',
      title: 'Retrospective: 28 Years of Ocarina of Time and Its Architectural Legacy',
      summary: 'A deep-dive analytical piece exploring how Ocarina of Time established 3D camera locking, targeting, and non-linear dungeon design standards.',
      content: `<p>Nearly three decades after its 1998 release on Nintendo 64, <em>Ocarina of Time</em> remains a landmark achievement in game design. From Z-targeting to ambient day-night cycles, this retrospective explores how Nintendo EAD created a timeless masterpiece.</p>`,
      date: '2026-06-01',
      category: 'game',
      imageUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80',
      likes: 83,
    }
  ];

  const initialLore: LoreEntry[] = [
    {
      id: 'l1',
      title: 'The Master Sword (Blade of Evil\'s Bane)',
      game: 'Skyward Sword / Ocarina of Time / Breath of the Wild',
      category: 'gamelore',
      description: 'Forged originally as the Goddess Sword by the goddess Hylia, it was tempered by the Hero of the Skies using the three Sacred Flames to become the Master Sword. Known as the Blade of Evil\'s Bane, it is the only weapon capable of repelling demonic entities and sealing the Demon King Ganon. It rests in sacred pedestals across Hyrule\'s history, guarded by the Lost Woods or the Temple of Time.',
      imageUrl: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800&q=80',
      releaseYear: '1991',
    },
    {
      id: 'l2',
      title: 'Princess Zelda & Goddess Hylia Mythos',
      game: 'All Zelda Games',
      category: 'gamelore',
      description: 'The mortal reincarnation of the Goddess Hylia and the princess of the Kingdom of Hyrule. Zelda is the bearer of the Triforce of Wisdom, granting her immense magical capabilities, prophetic dreams, and holy light. Far from a simple damsel in distress, Zelda is often a cunning commander, a skilled archer, a scholar of ancient technologies, or a mysterious disguise-artist (like Sheik or Tetra).',
      imageUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80',
      releaseYear: '1986',
    },
    {
      id: 'l3',
      title: 'The Sacred Triforce & Divine Relic',
      game: 'Ocarina of Time / A Link to the Past / Wind Waker',
      category: 'gamelore',
      description: 'A sacred golden relic left behind by the Golden Goddesses—Din (Power), Nayru (Wisdom), and Farore (Courage)—after they created the realm of Hyrule. The Triforce grants any wish to whoever touches it, regardless of whether their intentions are good or evil. If touched by one who does not possess a balanced heart, it splits into three pieces, seeking those who best embody each specific trait.',
      imageUrl: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&q=80',
      releaseYear: '1986',
    },
    {
      id: 'l4',
      title: 'The Legend of Zelda: Tears of the Kingdom',
      game: 'The Legend of Zelda: Tears of the Kingdom (2023)',
      category: 'games',
      subCategory: 'The Legend of Zelda: Tears of the Kingdom (2023)',
      description: 'In this sequel to Breath of the Wild, Link explores both the vast land of Hyrule and the mysterious sky islands floating above. Equipped with new Zonai abilities like Ultrahand, Fuse, Recall, and Ascend, Link must piece together the mystery of the Upheaval and defeat the resurrected Demon King Ganondorf.',
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      releaseYear: '2023',
    },
    {
      id: 'l5',
      title: 'The Legend of Zelda: Ocarina of Time',
      game: 'The Legend of Zelda: Ocarina of Time (1998)',
      category: 'games',
      subCategory: 'The Legend of Zelda: Ocarina of Time (1998)',
      description: 'The monumental 3D entry that redefined action-adventure gaming. Link travels seven years into the future using the Master Sword and the Ocarina of Time to awaken the Seven Sages and rescue Hyrule from Ganondorf\'s dark reign.',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      releaseYear: '1998',
    },
    {
      id: 'l6',
      title: 'Official Link Figma Action Figure (TOTK DX Edition)',
      game: 'Tears of the Kingdom Merchandise',
      category: 'merchandise',
      description: 'A premium articulated action figure produced by Good Smile Company featuring Link in his Zonai tunic, complete with the decayed Master Sword, Hylian Shield, Paraglider, and Ultrahand effect pieces.',
      imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80',
      releaseYear: '2024',
    },
    {
      id: 'l7',
      title: 'Live-Action Zelda Film Production Blueprint & Script',
      game: 'Nintendo & Sony Live-Action Movie',
      category: 'movie',
      description: 'Official production details and director statements regarding the live-action movie adaptation directed by Wes Ball and co-produced by Shigeru Miyamoto and Avi Arad.',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
      releaseYear: '2026',
    },
    {
      id: 'l8',
      title: 'Hyrule Historia (Official Collector\'s Tome)',
      game: 'Official Timeline Encyclopedia',
      category: 'publications',
      description: 'The definitive collector\'s book published by Dark Horse Comics, revealing the official split Zelda timeline for the first time along with executive producer interviews and full-color concept art.',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      releaseYear: '2011',
    },
    {
      id: 'l9',
      title: 'Symphony of the Goddesses Global Tour Archives',
      game: 'Live Orchestra Media',
      category: 'media',
      description: 'Historical archive of the official world orchestral tour performing Koji Kondo\'s four-movement symphonies with live game footage.',
      imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
      releaseYear: '2026',
    },
    {
      id: 'l10',
      title: 'Speedrunning Archives & Any% World Records',
      game: 'Community Archives',
      category: 'fandom',
      description: 'A historical record of speedrunning milestones across Ocarina of Time, Wind Waker, Breath of the Wild, and Tears of the Kingdom.',
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      releaseYear: '2025',
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
    },
    {
      id: 's5',
      author: 'GanonDev',
      title: 'Zelda 2D Retro Dungeon Maker (Fan Game Web Demo)',
      type: 'fangame',
      contentUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      contentBody: `<h3>🎮 Retro Hyrule Dungeon Builder</h3><p>An interactive browser-based 2D dungeon editor built with HTML5 canvas and retro chiptune audio! Create custom tilemaps, place rupees, spawn Stalfos, and test your own labyrinth puzzles.</p><p><b>Controls:</b> Arrow keys to move, Space to swing sword, Z/X to place tiles in editor mode.</p>`,
      description: 'Playable web fan game demo built in HTML5 with custom pixel art & chiptunes.',
      date: '2026-07-20',
      tokenized: true,
      tokenDetails: {
        tokenId: '#ZELDA-0005',
        contractAddress: '0xTriforce8c4d613ff9ad4da788f57c12f1ace009',
        transactionHash: '0x3a92f03310b89cd183b92d09ef1b5a03bc58d04212ee56bb78fa9809ef8c8f05',
        copyrightLicense: 'Zelda Fan-License',
        timestamp: '2026-07-20T11:00:00Z',
        royaltiesPercentage: 5,
        ownerAddress: '0xGanonDevAddress1122',
      },
      likes: 88,
    },
    {
      id: 's6',
      author: 'SheikahTheorist',
      title: 'The Zonai & Sheikah Connection: Ancient Tech Timeline Unveiled',
      type: 'theory',
      contentUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80',
      contentBody: `<h2>🔮 Deep Lore Theory: How the Zonai Taught the Sheikah</h2><p>In <i>Tears of the Kingdom</i>, we learn that Rauru and Mineru brought Secret Stones to Hyrule. But did you notice the striking visual similarities between Zonai Construct eyes and Sheikah Shrine guardians?</p><h3>Key Proof Points:</h3><ul><li><b>Energy Flux Alignment:</b> Zonai energy charges emit the exact same blue-green wavelength as Sheikah blue flame.</li><li><b>Dragon Motif Runes:</b> The spiraling green dragon energy on Zonai shrines mirrors the ancient Sheikah eye teardrop logo when inverted.</li></ul><blockquote style="border-left: 3px solid #b8860b; padding-left: 10px; font-style: italic;">"The technology of the heavens gave birth to the wisdom of the earth." — Royal Sheikah Slate Inscription</blockquote>`,
      description: 'A comprehensive theory detailing how Zonai constructs evolved into Sheikah technology over 10,000 years.',
      date: '2026-07-21',
      tokenized: false,
      likes: 64,
    },
    {
      id: 's7',
      author: 'TriforceCollector',
      title: 'Genesis Master Sword NFT Certificate #001',
      type: 'nft',
      contentUrl: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&q=80',
      contentBody: `<h3>💎 Verified Digital Collectible</h3><p>Registered on the Royal Hyrule Ledger with cryptographic proof of authenticity. Includes full 3D model asset rights and commercial fan art license.</p>`,
      description: 'Rare verified digital NFT collectible commemorating the 40th Anniversary of the Master Sword.',
      date: '2026-07-22',
      tokenized: true,
      tokenDetails: {
        tokenId: '#ZELDA-0007',
        contractAddress: '0xTriforce8c4d613ff9ad4da788f57c12f1ace009',
        transactionHash: '0x99ff00112233445566778899aabbccddeeff00112233445566778899aabbccdd',
        copyrightLicense: 'CC BY-NC-SA 4.0 (Attribution-NonCommercial-ShareAlike)',
        timestamp: '2026-07-22T16:20:00Z',
        royaltiesPercentage: 10,
        ownerAddress: '0xTriforceCollector99',
      },
      likes: 112,
    },
    {
      id: 's8',
      author: 'KorokCustoms',
      title: 'Golden Korok Forest Hero Avatar Pack',
      type: 'avatar',
      contentUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
      contentBody: `<h3>👤 High-Res Profile Avatar & Icon Asset</h3><p>Custom stylized avatar set featuring Hylian heroes, Korok companions, and Sheikah warrior badges. Free to use for Discord, Twitter, and Hyrule Alliance profiles!</p>`,
      description: 'Custom profile avatars and vector icons designed for Zelda community members.',
      date: '2026-07-23',
      tokenized: false,
      likes: 45,
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
  const [activeTab, setActiveTab] = useState<'news' | 'lore' | 'submissions' | 'guide' | 'portal' | 'admin' | 'about' | 'contact' | 'privacy' | 'sitemap'>('news');
  const [creatorSubTab, setCreatorSubTab] = useState<'feed' | 'submit' | 'all'>('feed');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [news, setNews] = useState<NewsItem[]>([]);

  // Editable AI Game Guide Page State
  const [guideTitle, setGuideTitle] = useState<string>('AI Game Guide');
  const [guideSubtitle, setGuideSubtitle] = useState<string>('Interactive Legend of Zelda walkthrough and guide assistant.');
  const [guideIframeUrl, setGuideIframeUrl] = useState<string>('https://loz.base44.app/embed/guide');
  const [guideIframeHeight, setGuideIframeHeight] = useState<number>(650);
  const [guideIframeMaxWidth, setGuideIframeMaxWidth] = useState<string>('500px');
  const [guideIframeBorder, setGuideIframeBorder] = useState<string>('4px solid #2B1B17');
  const [guideCustomContent, setGuideCustomContent] = useState<string>('');
  const [isEditingGuide, setIsEditingGuide] = useState<boolean>(false);
  const [guideSaving, setGuideSaving] = useState<boolean>(false);
  const [guideSaveSuccess, setGuideSaveSuccess] = useState<boolean>(false);

  // Admin Dashboard State
  const [adminSandbox, setAdminSandbox] = useState<boolean>(false);
  const isUserAdmin = !!user?.email && (user.email === 'AustinGrA7X@gmail.com' || adminSandbox) || adminSandbox;
  const [adminTab, setAdminTab] = useState<'news' | 'lore' | 'submissions' | 'sidebar' | 'rss-generator' | 'roles'>('news');
  const [adminError, setAdminError] = useState<string>('');
  const [adminSuccess, setAdminSuccess] = useState<string>('');

  // Admin Sidebar Block Form State
  const [sidebarBlocks, setSidebarBlocks] = useState<SidebarBlock[]>([]);
  const [adminSidebarId, setAdminSidebarId] = useState<string>('');
  const [adminSidebarTitle, setAdminSidebarTitle] = useState<string>('');
  const [adminSidebarType, setAdminSidebarType] = useState<'text' | 'html' | 'link' | 'movie-tracker'>('text');
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
  const [newsCurrentPage, setNewsCurrentPage] = useState<number>(1);
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
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  
  // Submit Creation Form State
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [subType, setSubType] = useState<SubmissionType>('art');
  const [description, setDescription] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [creationGalleryImages, setCreationGalleryImages] = useState<string[]>([]);
  const [customCreationGalleryUrl, setCustomCreationGalleryUrl] = useState<string>('');
  const [contentBody, setContentBody] = useState('');
  const [tokenize, setTokenize] = useState(false);
  const [copyrightLicense, setCopyrightLicense] = useState('CC BY-NC-SA 4.0 (Attribution-NonCommercial-ShareAlike)');
  const [royaltiesPercentage, setRoyaltiesPercentage] = useState(10);
  const [isPosting, setIsPosting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // HTML Preview and File Drag & Drop State for Fan Creations
  const [htmlPreviewMode, setHtmlPreviewMode] = useState(false);
  const [isDraggingCreationFile, setIsDraggingCreationFile] = useState(false);
  const creationFileInputRef = useRef<HTMLInputElement>(null);

  // AWS & MongoDB Integration Status State
  const [awsStatusInfo, setAwsStatusInfo] = useState<{
    status?: string;
    provider?: string;
    region?: string;
    rawRegion?: string;
    newsTable?: string;
    submissionsTable?: string;
    s3Bucket?: string;
    mongoAtlas?: {
      clusterName?: string;
      dbName?: string;
      isConfigured?: boolean;
      status?: string;
      lastError?: { message: string; timestamp?: string } | null;
    };
    lastError?: { message: string; code?: string; table?: string; timestamp?: string } | null;
  } | null>(null);

  // File drag & drop reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to compress uploaded images via Canvas before converting to base64
  const compressImageFile = (file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onerror = () => resolve('');
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return resolve('');
        
        const img = new Image();
        img.onerror = () => resolve(dataUrl);
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const mimeType = file.type === 'image/png' || file.type === 'image/webp' ? file.type : 'image/jpeg';
          try {
            const compressed = canvas.toDataURL(mimeType, quality);
            resolve(compressed || dataUrl);
          } catch {
            resolve(dataUrl);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  // Image Upload Processing for Fan Creations (Multi-image Gallery)
  const processCreationImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setFormError('Image file size must be under 20MB.');
      return;
    }
    try {
      const result = await compressImageFile(file);
      if (result) {
        setContentUrl((prev) => prev || result);
        setCreationGalleryImages((prev) => (prev.includes(result) ? prev : [...prev, result]));
        setFormError('');
      }
    } catch (err) {
      console.warn('Image processing error:', err);
    }
  };

  const handleCreationFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => processCreationImageFile(file));
    }
  };

  const handleCreationDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingCreationFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processCreationImageFile(e.dataTransfer.files[0]);
    }
  };

  const insertHtmlSnippet = (startTag: string, endTag: string = '') => {
    setContentBody(prev => `${prev}${startTag}${endTag}`);
  };

  const saveUserSession = (newUser: AppUser | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('hyrule_user_session', JSON.stringify(newUser));
      if (newUser.displayName) {
        setAuthor(prev => prev || newUser.displayName || '');
      }
    } else {
      localStorage.removeItem('hyrule_user_session');
    }
  };

  // Auth state listener for session persistence
  useEffect(() => {
    if (user?.displayName) {
      setAuthor(prev => prev || user.displayName || '');
    }
  }, [user]);

  const fetchAwsStatus = async () => {
    try {
      const res = await fetch('/api/aws/status');
      if (res.ok) {
        const data = await res.json();
        setAwsStatusInfo(data);
      }
    } catch (e) {
      console.warn('Error fetching AWS status:', e);
    }
  };

  // Fetch initial data & subscribe to real-time updates for news and submissions
  useEffect(() => {
    fetchNews();
    fetchLore();
    fetchSubmissions();
    fetchSidebarBlocks();
    fetchGuideSettings();
    fetchAwsStatus();

    // Periodic backend API sync (synced with AWS DynamoDB)
    const interval = setInterval(() => {
      fetchNews();
      fetchSubmissions();
      fetchAwsStatus();
    }, 15000);

    return () => clearInterval(interval);
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
        setSelectedSubmissionId(idParam);
      }
    }
  }, [news, lore, submissions]);

  // Dynamic SEO & Document Metadata Synchronization for Full-Width News Articles or Submissions
  useEffect(() => {
    if (activeTab === 'news' && expandedNews) {
      const article = news.find(n => n.id === expandedNews);
      if (article) {
        document.title = `${article.title} | Hyrule Hub Chronicles`;
      }
    } else if (activeTab === 'submissions' && selectedSubmissionId) {
      const sub = submissions.find(s => s.id === selectedSubmissionId);
      if (sub) {
        document.title = `${sub.title} by ${sub.author} | Creator Club`;
      }
    } else {
      document.title = 'The Legend of Zelda - Hyrule Hub';
      const schemaScript = document.getElementById('news-article-jsonld');
      if (schemaScript) schemaScript.remove();
    }
  }, [expandedNews, selectedSubmissionId, activeTab, news, submissions]);

  // Handle browser back/forward history buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const idParam = params.get('id');
      if (tabParam === 'news') {
        setActiveTab('news');
        setExpandedNews(idParam || null);
      } else if (tabParam === 'submissions') {
        setActiveTab('submissions');
        setSelectedSubmissionId(idParam || null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openNewsArticle = (id: string) => {
    setExpandedNews(id);
    const newUrl = `${window.location.pathname}?tab=news&id=${id}`;
    window.history.pushState({ tab: 'news', id }, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeNewsArticle = () => {
    setExpandedNews(null);
    const newUrl = `${window.location.pathname}?tab=news`;
    window.history.pushState({ tab: 'news' }, '', newUrl);
    document.title = 'The Legend of Zelda - Hyrule Hub';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSubmissionPage = (id: string) => {
    setSelectedSubmissionId(id);
    const newUrl = `${window.location.pathname}?tab=submissions&id=${id}`;
    window.history.pushState({ tab: 'submissions', id }, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeSubmissionPage = () => {
    setSelectedSubmissionId(null);
    const newUrl = `${window.location.pathname}?tab=submissions`;
    window.history.pushState({ tab: 'submissions' }, '', newUrl);
    document.title = 'The Legend of Zelda - Hyrule Hub';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSpeakArticle = (text: string, title: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/<[^>]*>/g, ' ');
      const utterance = new SpeechSynthesisUtterance(`${title}. ${cleanText.substring(0, 600)}`);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser environment.");
    }
  };

  // Comments System Helper Functions
  const fetchComments = useCallback(async (targetId: string) => {
    setCommentsLoading(prev => ({ ...prev, [targetId]: true }));
    try {
      const res = await fetch(`/api/comments/${targetId}`);
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list)) {
          setComments(prev => ({ ...prev, [targetId]: list }));
          return;
        }
      }
      const saved = localStorage.getItem(`hyrule_comments_${targetId}`);
      if (saved) {
        setComments(prev => ({ ...prev, [targetId]: JSON.parse(saved) }));
      }
    } catch (e) {
      console.warn('Error fetching comments:', e);
      const saved = localStorage.getItem(`hyrule_comments_${targetId}`);
      if (saved) {
        try {
          setComments(prev => ({ ...prev, [targetId]: JSON.parse(saved) }));
        } catch (err) {}
      }
    } finally {
      setCommentsLoading(prev => ({ ...prev, [targetId]: false }));
    }
  }, []);

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
        authorName: user.displayName || (user.email ? user.email.split('@')[0] : 'Hero of Hyrule'),
        authorId: user.uid,
        authorPhoto: user.photoURL || undefined,
        content: commentText,
        date: nowStr,
        timestamp: Date.now()
      };

      try {
        await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newComment),
        });
      } catch (err) {
        console.warn('Backend API comment save error, storing locally:', err);
      }

      setNewCommentText(prev => ({ ...prev, [targetId]: '' }));

      setComments(prev => {
        const existing = prev[targetId] || [];
        const updated = [newComment, ...existing];
        localStorage.setItem(`hyrule_comments_${targetId}`, JSON.stringify(updated));
        return { ...prev, [targetId]: updated };
      });
    } catch (err) {
      console.error('Error writing comment:', err);
    }
  };

  const handleDeleteComment = async (targetId: string, commentId: string) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to retract your comment from this scroll?")) return;

    try {
      fetch(`/api/comments/${commentId}`, { method: 'DELETE' }).catch(() => {});
      setComments(prev => {
        const existing = prev[targetId] || [];
        const updated = existing.filter(c => c.id !== commentId);
        localStorage.setItem(`hyrule_comments_${targetId}`, JSON.stringify(updated));
        return { ...prev, [targetId]: updated };
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
    try {
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${providerName}_${Date.now()}`;
      const providerLabel = providerName.charAt(0).toUpperCase() + providerName.slice(1);
      const newUser: AppUser = {
        uid: `usr_${providerName}_${Date.now()}`,
        displayName: `Hero (${providerLabel})`,
        email: `hero@hyrule.${providerName}`,
        photoURL: avatarUrl,
      };
      saveUserSession(newUser);
      setIsAuthModalOpen(false);
    } catch (e: any) {
      console.error(`${providerName} login error:`, e);
      setAuthError(e.message || `An error occurred while logging in with ${providerName}.`);
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
      const cleanEmail = authEmail.trim().toLowerCase();
      const displayName = cleanEmail.split('@')[0];
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`;
      const newUser: AppUser = {
        uid: `usr_${Date.now()}`,
        email: cleanEmail,
        displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        photoURL: avatarUrl,
      };
      saveUserSession(newUser);
      setIsAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'An error occurred during sign-in.');
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
      const cleanEmail = authEmail.trim().toLowerCase();
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`;
      const newUser: AppUser = {
        uid: `usr_${Date.now()}`,
        email: cleanEmail,
        displayName: authDisplayName.trim(),
        photoURL: avatarUrl,
      };
      saveUserSession(newUser);
      setIsAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthDisplayName('');
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'An error occurred during account creation.');
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
      
      const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
      const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;
      const newUser: AppUser = {
        uid: `w3_${address}`,
        displayName: `Hero ${shortAddress}`,
        photoURL: avatarUrl,
      };
      saveUserSession(newUser);
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
      
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${address}`;
      const displayName = `Hero ${walletName} (${address})`;
      const newUser: AppUser = {
        uid: `sim_w3_${address}`,
        displayName,
        photoURL: avatarUrl,
      };
      saveUserSession(newUser);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setAuthError(err.message || 'Simulated Web3 connection failed.');
    } finally {
      setWeb3Connecting(false);
    }
  };

  const handleLogout = async () => {
    saveUserSession(null);
  };

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const list = await res.json();
        setNews(Array.isArray(list) && list.length > 0 ? list : initialNews);
      } else {
        setNews(initialNews);
      }
    } catch (e) {
      console.error('Error fetching news from API:', e);
      setNews(initialNews);
    }
  };

  const fetchLore = async () => {
    try {
      const res = await fetch('/api/lore');
      if (res.ok) {
        const list = await res.json();
        setLore(Array.isArray(list) && list.length > 0 ? list : initialLore);
      } else {
        setLore(initialLore);
      }
    } catch (e) {
      console.error('Error fetching lore from API:', e);
      setLore(initialLore);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions');
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          list.sort((a: UserSubmission, b: UserSubmission) => b.id.localeCompare(a.id));
          setSubmissions(list);
        } else {
          setSubmissions(initialSubmissions);
        }
      } else {
        setSubmissions(initialSubmissions);
      }
    } catch (e) {
      console.error('Error fetching submissions from API:', e);
      setSubmissions(initialSubmissions);
    }
  };

  const fetchSidebarBlocks = async () => {
    try {
      const apiRes = await fetch('/api/sidebarBlocks');
      if (apiRes.ok) {
        const apiData = await apiRes.json();
        if (Array.isArray(apiData) && apiData.length > 0) {
          apiData.sort((a: SidebarBlock, b: SidebarBlock) => a.order - b.order);
          setSidebarBlocks(apiData);
          return;
        }
      }
    } catch (apiErr) {
      console.warn('API fetch for sidebar blocks failed:', apiErr);
    }
    setSidebarBlocks(initialSidebarBlocks);
  };

  const fetchGuideSettings = async () => {
    const saved = localStorage.getItem('hyrule_guide_settings');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.guideTitle) setGuideTitle(data.guideTitle);
        if (data.guideSubtitle !== undefined) setGuideSubtitle(data.guideSubtitle);
        if (data.guideIframeUrl) setGuideIframeUrl(data.guideIframeUrl);
        if (data.guideIframeHeight) setGuideIframeHeight(Number(data.guideIframeHeight) || 650);
        if (data.guideIframeMaxWidth) setGuideIframeMaxWidth(data.guideIframeMaxWidth);
        if (data.guideIframeBorder) setGuideIframeBorder(data.guideIframeBorder);
        if (data.guideCustomContent !== undefined) setGuideCustomContent(data.guideCustomContent);
      } catch (err) {
        // ignore error
      }
    }
  };

  const handleSaveGuideSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuideSaving(true);
    const payload = {
      guideTitle: guideTitle.trim() || 'AI Game Guide',
      guideSubtitle: guideSubtitle.trim(),
      guideIframeUrl: guideIframeUrl.trim() || 'https://loz.base44.app/embed/guide',
      guideIframeHeight: Number(guideIframeHeight) || 650,
      guideIframeMaxWidth: guideIframeMaxWidth || '500px',
      guideIframeBorder: guideIframeBorder || '4px solid #2B1B17',
      guideCustomContent: guideCustomContent.trim(),
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('hyrule_guide_settings', JSON.stringify(payload));
    } catch (err) {
      console.warn('Saving guide settings to localStorage failed:', err);
    } finally {
      setGuideSaveSuccess(true);
      setTimeout(() => setGuideSaveSuccess(false), 3000);
      setGuideSaving(false);
      setIsEditingGuide(false);
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

      // Sync with REST API
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

      // Update local state immediately
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
      await fetch(`/api/sidebarBlocks/${id}`, { method: 'DELETE' });
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
      const currentSub = submissions.find(s => s.id === id);
      if (!currentSub) return;
      
      const newLikes = (currentSub.likes || 0) + 1;
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, likes: newLikes } : s));

      await fetch(`/api/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentSub, likes: newLikes }),
      }).catch(() => {});
    } catch (e) {
      console.error('Error liking submission:', e);
    }
  };

  // Like a news article
  const handleLikeNews = async (id: string) => {
    if (!user) {
      alert("Please authenticate to express Courage & honor for news chronicles.");
      handleLogin();
      return;
    }
    try {
      const currentArticle = news.find(n => n.id === id);
      if (!currentArticle) return;
      
      const newLikes = (currentArticle.likes || 0) + 1;
      setNews(prev => prev.map(n => n.id === id ? { ...n, likes: newLikes } : n));

      await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentArticle, likes: newLikes }),
      });
    } catch (e) {
      console.error('Error liking news item:', e);
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

      const finalGalleryImages = creationGalleryImages.length > 0 
        ? creationGalleryImages 
        : (contentUrl.trim() ? [contentUrl.trim()] : undefined);

      const newSubmission: UserSubmission = {
        id: newId,
        author: author.trim(),
        title: title.trim(),
        type: subType,
        description: description.trim(),
        contentUrl: contentUrl.trim() || (finalGalleryImages ? finalGalleryImages[0] : undefined),
        galleryImages: finalGalleryImages,
        contentBody: contentBody.trim() || undefined,
        date: now.split('T')[0],
        tokenized: !!tokenize,
        likes: 0,
      };

      if (tokenDetails) {
        newSubmission.tokenDetails = tokenDetails;
      }

      let savedSubmission = newSubmission;
      try {
        const apiRes = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSubmission),
        });

        if (apiRes.ok) {
          const resData = await apiRes.json().catch(() => newSubmission);
          savedSubmission = resData;
        } else {
          console.warn('Server API storage warning, saving submission locally:', apiRes.status);
        }
      } catch (err) {
        console.warn('Server submission post error:', err);
      }

      setSubmissions((prev) => [savedSubmission, ...prev.filter((s) => s.id !== savedSubmission.id)]);
      setFormSuccess(true);
      setTitle('');
      setDescription('');
      setContentUrl('');
      setCreationGalleryImages([]);
      setCustomCreationGalleryUrl('');
      setContentBody('');
      setTokenize(false);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while posting.');
    } finally {
      setIsPosting(false);
    }
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
  const handleNewsFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (const file of Array.from(files) as File[]) {
        const result = await compressImageFile(file);
        if (result) {
          setAdminNewsGalleryImages((prev) => {
            if (!prev.includes(result)) {
              return [...prev, result];
            }
            return prev;
          });
          setAdminNewsImageUrl((prevCover) => (prevCover.trim() ? prevCover : result));
        }
      }
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

    if (!adminNewsTitle.trim() || !adminNewsSummary.trim() || !adminNewsContent.trim()) {
      setAdminError('Please fill in required news fields: Title, Summary, and Content Body.');
      return;
    }

    const id = isEditingNews ? adminNewsId : `n_${Date.now()}`;
    const dateStr = adminNewsDate || new Date().toISOString().split('T')[0];
    const coverUrl = adminNewsImageUrl.trim() || (adminNewsGalleryImages.length > 0 ? adminNewsGalleryImages[0] : newsImagePresets[0].url);

    // Ensure cover image is included in gallery
    let finalGallery = [...adminNewsGalleryImages];
    if (coverUrl && !finalGallery.includes(coverUrl)) {
      finalGallery.unshift(coverUrl);
    }

    const existingLikes = news.find(n => n.id === id)?.likes || 0;

    const itemData: NewsItem = {
      id,
      title: adminNewsTitle.trim(),
      summary: adminNewsSummary.trim(),
      content: adminNewsContent.trim(),
      category: adminNewsCategory,
      imageUrl: coverUrl,
      galleryImages: finalGallery,
      date: dateStr,
      likes: existingLikes,
    };

    try {
      // Save to Backend REST API (Synced with AWS DynamoDB)
      const endpoint = isEditingNews ? `/api/news/${id}` : '/api/news';
      const method = isEditingNews ? 'PUT' : 'POST';
      const apiRes = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });

      const contentType = apiRes.headers.get('content-type') || '';
      if (!apiRes.ok || !contentType.includes('application/json')) {
        throw new Error('Backend response non-JSON or not OK');
      }

      const savedData = await apiRes.json().catch(() => itemData);

      // Update client state
      if (isEditingNews) {
        setNews(prev => prev.map(n => n.id === id ? savedData : n));
        setAdminSuccess(`Chronicle "${adminNewsTitle}" successfully engraved and updated!`);
      } else {
        setNews(prev => [savedData, ...prev.filter(n => n.id !== savedData.id)]);
        setAdminSuccess(`Chronicle "${adminNewsTitle}" successfully added to the library!`);
      }

      handleResetNewsForm();
    } catch (err: any) {
      // Fallback state update ensures editing always completes smoothly
      if (isEditingNews) {
        setNews(prev => prev.map(n => n.id === id ? itemData : n));
        setAdminSuccess(`Chronicle "${adminNewsTitle}" successfully engraved and updated!`);
      } else {
        setNews(prev => [itemData, ...prev.filter(n => n.id !== itemData.id)]);
        setAdminSuccess(`Chronicle "${adminNewsTitle}" successfully added to the library!`);
      }
      handleResetNewsForm();
    }
  };

  // Publish AI-Generated RSS SEO News Entry directly
  const handlePublishGeneratedNews = async (newsData: any): Promise<boolean> => {
    try {
      const id = newsData.id || `n_${Date.now()}`;
      const finalCover = newsData.imageUrl || (newsData.galleryImages && newsData.galleryImages[0]) || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80';
      const itemData: NewsItem = {
        id,
        title: newsData.title,
        summary: newsData.summary,
        content: newsData.contentHtml || newsData.content || newsData.summary || '',
        category: newsData.category || 'movie',
        imageUrl: finalCover,
        galleryImages: newsData.galleryImages || [finalCover],
        date: new Date().toISOString().split('T')[0],
        seoTitle: newsData.seoTitle,
        metaDescription: newsData.metaDescription,
        focusKeywords: newsData.focusKeywords,
        canonicalUrl: newsData.canonicalUrl,
        jsonLdSchema: newsData.jsonLdSchema,
        authorByline: newsData.authorByline,
        eeatScore: newsData.eeatDetails?.score || 95,
        eeatDetails: newsData.eeatDetails,
        rssReferenceUrl: newsData.rssReferenceUrl,
        rssSourceTitle: newsData.rssSourceTitle,
        rssPublishDate: newsData.rssPublishDate,
        likes: 0,
      };

      const apiRes = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });

      const savedData = apiRes.ok ? await apiRes.json().catch(() => itemData) : itemData;

      setNews(prev => [savedData, ...prev.filter(n => n.id !== savedData.id)]);
      setAdminSuccess(`Real-time SEO story "${newsData.title}" successfully published!`);
      return true;
    } catch (err) {
      console.error('Error publishing generated news:', err);
      return false;
    }
  };

  // Delete News Item
  const handleDeleteNews = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to banish the chronicle "${title}" forever?`)) return;
    setAdminError('');
    setAdminSuccess('');

    try {
      await fetch(`/api/news/${id}`, { method: 'DELETE' });
    } catch (err) {
      // Ignore network errors and continue with state deletion
    } finally {
      setNews(prev => prev.filter(n => n.id !== id));
      setAdminSuccess(`Chronicle "${title}" banished from the kingdom.`);
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
      const endpoint = isEditingLore ? `/api/lore/${id}` : '/api/lore';
      const method = isEditingLore ? 'PUT' : 'POST';
      const apiRes = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData),
      });
      const contentType = apiRes.headers.get('content-type') || '';
      if (!apiRes.ok || !contentType.includes('application/json')) {
        throw new Error('Backend response non-JSON or not OK');
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
      if (isEditingLore) {
        setLore(prev => prev.map(l => l.id === id ? entryData : l));
        setAdminSuccess(`Lore entry "${adminLoreTitle}" successfully compiled and updated!`);
      } else {
        setLore(prev => [entryData, ...prev]);
        setAdminSuccess(`Lore entry "${adminLoreTitle}" successfully added to the Royal Archives!`);
      }
      handleResetLoreForm();
    }
  };

  // Delete Lore Entry
  const handleDeleteLore = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the lore entry "${title}"?`)) return;
    setAdminError('');
    setAdminSuccess('');

    try {
      await fetch(`/api/lore/${id}`, { method: 'DELETE' });
    } catch (err) {
      // Ignore network errors and continue with state deletion
    } finally {
      setLore(prev => prev.filter(l => l.id !== id));
      setAdminSuccess(`Lore entry "${title}" erased from memory.`);
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
      const apiRes = await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
      if (!apiRes.ok) {
        throw new Error('Failed to delete submission from backend API');
      }

      setSubmissions(prev => prev.filter(s => s.id !== id));
      setAdminSuccess(`Submission "${title}" successfully moderated.`);
    } catch (err: any) {
      setAdminError(err.message || 'Failed to moderate submission.');
    }
  };

  // Filtered lists with global search support
  const filteredNews = news
    .filter(item => {
      const matchesCategory = newsFilter === 'all' || item.category === newsFilter;
      const query = globalSearch.trim().toLowerCase();
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) ||
        (item.summary && item.summary.toLowerCase().includes(query)) ||
        (item.content && item.content.toLowerCase().includes(query)) ||
        (item.authorByline && item.authorByline.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredLore = lore.filter(item => {
    const matchesCategory = loreCategory === 'all' || item.category === loreCategory;
    const query = globalSearch.trim().toLowerCase();
    const matchesLocalSearch = !loreSearch || 
      item.title.toLowerCase().includes(loreSearch.toLowerCase()) || 
      item.description.toLowerCase().includes(loreSearch.toLowerCase()) ||
      item.game.toLowerCase().includes(loreSearch.toLowerCase());
    const matchesGlobalSearch = !query ||
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query) ||
      item.game.toLowerCase().includes(query);
    return matchesCategory && matchesLocalSearch && matchesGlobalSearch;
  });

  const filteredSubmissions = submissions.filter(item => {
    const matchesCategory = subTypeFilter === 'all' || item.type === subTypeFilter;
    const query = globalSearch.trim().toLowerCase();
    const matchesSearch = !query ||
      item.title.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      (item.contentBody && item.contentBody.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zelda-green-deep text-zelda-charcoal font-sans flex flex-col selection:bg-zelda-gold selection:text-white">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-zelda-green-forest/95 backdrop-blur-md border-b-2 border-zelda-gold/60 shadow-xl py-3 px-4 md:px-8 transition-all">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,134,11,0.15),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-between gap-4">
          
          {/* Brand / Title Logo */}
          <div 
            onClick={() => { setActiveTab('news'); setExpandedNews(null); }}
            className="flex items-center gap-3 cursor-pointer group text-left flex-shrink-0"
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-zelda-gold to-yellow-600 flex items-center justify-center transform rotate-45 shadow-lg border border-yellow-200/40 group-hover:scale-105 transition-transform">
                <div className="transform -rotate-45 font-serif text-lg md:text-xl font-extrabold text-white">
                  ▲
                </div>
              </div>
              <div className="absolute -top-1 -right-1 bg-amber-600 text-white text-[8px] font-mono font-bold px-1 rounded-full border border-white/60 shadow">
                FAN
              </div>
            </div>

            <div className="hidden sm:block">
              <h1 className="font-serif text-base sm:text-lg md:text-2xl font-extrabold tracking-wider text-white uppercase leading-tight group-hover:text-amber-200 transition-colors">
                The Legend of Zelda
              </h1>
              <p className="font-sans text-[10px] md:text-xs tracking-widest text-[#EAE2CF]/80 uppercase font-medium">
                Fan Club & AI Sanctum
              </p>
            </div>
          </div>

          {/* Header Global Search Bar */}
          <div className="flex-1 max-w-sm lg:max-w-md mx-2 md:mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zelda-gold pointer-events-none" />
              <input
                type="text"
                placeholder="Search news, lore, fan creations..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full bg-black/40 hover:bg-black/50 focus:bg-black/80 border border-white/20 focus:border-zelda-gold/80 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-gray-300/70 focus:outline-none transition-all shadow-inner font-sans tracking-wide"
              />
              {globalSearch && (
                <button 
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Right Controls (Sandbox Toggle + Auth Status) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Sandbox Admin Toggle */}
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-serif font-semibold tracking-wider transition-all cursor-pointer ${
                adminSandbox 
                  ? 'bg-amber-950/50 border-zelda-gold text-zelda-gold shadow-md' 
                  : 'bg-black/30 border-white/10 text-gray-300 hover:border-white/30 hover:text-white'
              }`}
            >
              <Shield className={`w-4 h-4 ${adminSandbox ? 'text-zelda-gold animate-pulse' : 'text-gray-400'}`} />
              <span>{adminSandbox ? 'Admin: ON 👑' : 'Admin: OFF ⚔️'}</span>
            </button>

            {/* Auth Button/Panel */}
            <div className="flex items-center bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#EAE2CF]">
              {authLoading ? (
                <span className="text-gray-400 font-mono text-[11px]">Loading...</span>
              ) : user ? (
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full border border-zelda-gold" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-zelda-gold flex items-center justify-center font-bold text-white text-[11px]">
                      {user.displayName ? user.displayName.substring(0, 1) : 'U'}
                    </div>
                  )}
                  <span className="font-serif max-w-[100px] truncate font-medium text-white">{user.displayName || (user.email ? user.email.split('@')[0] : 'Hero of Hyrule')}</span>
                  <button 
                    onClick={handleLogout}
                    className="ml-1 text-[10px] bg-red-600/30 hover:bg-red-600/60 text-red-200 font-semibold font-serif uppercase tracking-wider py-0.5 px-2 rounded border border-red-500/30 transition-all cursor-pointer"
                  >
                    Leave
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="flex items-center gap-1.5 font-serif font-bold text-[#EAE2CF] hover:text-white uppercase tracking-wider text-xs cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-zelda-gold" />
                  <span>Authenticate ▲</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-black/30 hover:bg-black/50 border border-white/20 rounded-xl text-white transition-all cursor-pointer focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-zelda-gold" /> : <Menu className="w-6 h-6 text-zelda-gold" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Link Strip */}
        <div className="hidden md:block max-w-7xl mx-auto mt-2.5 pt-2 border-t border-white/10">
          <nav className="bg-black/30 backdrop-blur border border-white/10 rounded-2xl p-1.5 flex items-center justify-between gap-1 shadow-inner">
            <button 
              id="tab-news"
              onClick={() => { setActiveTab('news'); setExpandedNews(null); }}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'news' 
                  ? 'bg-gradient-to-r from-zelda-gold to-yellow-600 text-white shadow-md border border-yellow-300/40' 
                  : 'text-[#EAE2CF] hover:bg-white/10 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4 text-amber-200" />
              <span>News & Chronicles</span>
            </button>

            <button 
              id="tab-lore"
              onClick={() => setActiveTab('lore')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'lore' 
                  ? 'bg-gradient-to-r from-zelda-gold to-yellow-600 text-white shadow-md border border-yellow-300/40' 
                  : 'text-[#EAE2CF] hover:bg-white/10 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-200" />
              <span>Archives</span>
            </button>

            <button 
              id="tab-submissions"
              onClick={() => setActiveTab('submissions')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'submissions' 
                  ? 'bg-gradient-to-r from-zelda-gold to-yellow-600 text-white shadow-md border border-yellow-300/40' 
                  : 'text-[#EAE2CF] hover:bg-white/10 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Creator Club</span>
            </button>

            <button 
              id="tab-guide"
              onClick={() => setActiveTab('guide')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'guide' 
                  ? 'bg-gradient-to-r from-zelda-gold to-yellow-600 text-white shadow-md border border-yellow-300/40' 
                  : 'text-[#EAE2CF] hover:bg-white/10 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-200" />
              <span>AI Game Guide</span>
            </button>

            <button 
              id="tab-portal"
              onClick={() => setActiveTab('portal')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'portal' 
                  ? 'bg-gradient-to-r from-zelda-gold to-yellow-600 text-white shadow-md border border-yellow-300/40' 
                  : 'text-[#EAE2CF] hover:bg-white/10 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-amber-200" />
              <span>Fan Portal</span>
            </button>

            {isUserAdmin && (
              <button 
                id="tab-admin"
                onClick={() => setActiveTab('admin')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === 'admin' 
                    ? 'bg-gradient-to-r from-emerald-800 to-emerald-950 text-white border border-zelda-gold shadow-lg' 
                    : 'text-zelda-gold hover:bg-amber-950/40'
                }`}
              >
                <Shield className="w-4 h-4 text-zelda-gold" />
                <span>Admin Sanctum 👑</span>
              </button>
            )}
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden pt-3 border-t border-white/10 mt-2"
            >
              <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-3 space-y-2 text-left">
                <nav className="flex flex-col gap-1.5">
                  <button 
                    id="tab-news-mobile"
                    onClick={() => { setActiveTab('news'); setExpandedNews(null); setMobileMenuOpen(false); }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'news' 
                        ? 'bg-zelda-gold text-white shadow-md' 
                        : 'bg-white/5 text-[#EAE2CF] hover:bg-white/10'
                    }`}
                  >
                    <Film className="w-4 h-4 text-amber-200" />
                    <span>News & Chronicles</span>
                  </button>

                  <button 
                    id="tab-lore-mobile"
                    onClick={() => { setActiveTab('lore'); setMobileMenuOpen(false); }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'lore' 
                        ? 'bg-zelda-gold text-white shadow-md' 
                        : 'bg-white/5 text-[#EAE2CF] hover:bg-white/10'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-amber-200" />
                    <span>Archives</span>
                  </button>

                  <button 
                    id="tab-submissions-mobile"
                    onClick={() => { setActiveTab('submissions'); setMobileMenuOpen(false); }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'submissions' 
                        ? 'bg-zelda-gold text-white shadow-md' 
                        : 'bg-white/5 text-[#EAE2CF] hover:bg-white/10'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Creator Club</span>
                  </button>

                  <button 
                    id="tab-guide-mobile"
                    onClick={() => { setActiveTab('guide'); setMobileMenuOpen(false); }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'guide' 
                        ? 'bg-zelda-gold text-white shadow-md' 
                        : 'bg-white/5 text-[#EAE2CF] hover:bg-white/10'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-amber-200" />
                    <span>AI Game Guide</span>
                  </button>

                  <button 
                    id="tab-portal-mobile"
                    onClick={() => { setActiveTab('portal'); setMobileMenuOpen(false); }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'portal' 
                        ? 'bg-zelda-gold text-white shadow-md' 
                        : 'bg-white/5 text-[#EAE2CF] hover:bg-white/10'
                    }`}
                  >
                    <Gamepad2 className="w-4 h-4 text-amber-200" />
                    <span>Fan Portal</span>
                  </button>

                  {isUserAdmin && (
                    <button 
                      id="tab-admin-mobile"
                      onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                      className={`w-full min-h-[44px] flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === 'admin' 
                          ? 'bg-emerald-900 text-white border border-zelda-gold shadow-md' 
                          : 'bg-amber-950/30 text-zelda-gold border border-zelda-gold/30'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-zelda-gold" />
                      <span>Admin Sanctum 👑</span>
                    </button>
                  )}
                </nav>

                {/* Mobile Controls Panel (Admin Switch & Auth) */}
                <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[11px] font-mono text-gray-300 uppercase">Admin Sandbox</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminSandbox(!adminSandbox);
                        if (!adminSandbox) {
                          setAdminSuccess('Sandbox Admin status granted!');
                        } else {
                          setAdminSuccess('Sandbox Admin status revoked.');
                          if (activeTab === 'admin') setActiveTab('news');
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-serif font-bold uppercase tracking-wider cursor-pointer ${
                        adminSandbox ? 'bg-zelda-gold text-white' : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      {adminSandbox ? 'ON 👑' : 'OFF ⚔️'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-xl border border-white/5">
                    {user ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full border border-zelda-gold" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-zelda-gold flex items-center justify-center font-bold text-white text-[10px]">
                              {user.displayName ? user.displayName.substring(0, 1) : 'U'}
                            </div>
                          )}
                          <span className="text-xs text-white max-w-[140px] truncate">{user.displayName || (user.email ? user.email.split('@')[0] : 'Hero of Hyrule')}</span>
                        </div>
                        <button 
                          onClick={handleLogout}
                          className="text-[10px] bg-red-600/40 text-red-100 font-serif uppercase tracking-wider px-2 py-1 rounded border border-red-500/30 cursor-pointer"
                        >
                          Leave
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs text-gray-300">Sanctum Account</span>
                        <button 
                          onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }}
                          className="text-xs font-bold text-zelda-gold hover:text-white uppercase tracking-wider cursor-pointer"
                        >
                          Authenticate ▲
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN CONTENT SPACE */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8">
        
        {/* TAB 1: NEWS & LIVE MOVIE HUB */}
        {activeTab === 'news' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-8 w-full"
          >
            {/* FULL-WIDTH SEO OPTIMIZED PAGE VIEW WHEN ARTICLE IS SELECTED */}
            {expandedNews && news.find(n => n.id === expandedNews) ? (() => {
              const selectedArticle = news.find(n => n.id === expandedNews)!;
              return (
                <motion.article 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full max-w-5xl mx-auto space-y-8 bg-white/85 backdrop-blur-md border-2 border-zelda-gold/50 rounded-3xl p-6 md:p-10 shadow-2xl text-zelda-charcoal relative overflow-hidden"
                >
                  {/* Top Navigation & Action Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zelda-border-sand pb-4">
                    <button
                      onClick={closeNewsArticle}
                      className="px-4 py-2 bg-zelda-beige-card hover:bg-zelda-border-sand/40 border border-zelda-border-sand text-zelda-charcoal rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-zelda-gold"
                    >
                      <ArrowLeft className="w-4 h-4 text-zelda-gold" />
                      <span>Return to Chronicles Index</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-md text-xs font-serif font-bold uppercase tracking-wider shadow-sm ${
                        selectedArticle.category === 'movie' 
                          ? 'bg-zelda-gold text-white' 
                          : selectedArticle.category === 'game' 
                          ? 'bg-zelda-green-forest text-white' 
                          : 'bg-zelda-green-light text-white'
                      }`}>
                        {selectedArticle.category === 'movie' ? 'Live Action Movie' : selectedArticle.category}
                      </span>

                      <button
                        onClick={() => handleLikeNews(selectedArticle.id)}
                        className="px-3.5 py-1.5 bg-white hover:bg-rose-50 text-zelda-charcoal hover:text-rose-600 border border-zelda-border-sand hover:border-rose-400 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                        title="Express Courage & Honor for this Chronicle"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current text-rose-600" />
                        <span>{selectedArticle.likes || 0} Courage</span>
                      </button>

                      <button
                        onClick={() => handleSpeakArticle(selectedArticle.content || selectedArticle.summary, selectedArticle.title)}
                        className="px-3 py-1.5 bg-black/5 hover:bg-black/10 border border-zelda-border-sand rounded-xl text-xs font-serif font-semibold text-zelda-charcoal flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Listen to Article with Audio Reader"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-zelda-gold" />
                        <span className="hidden sm:inline">Listen</span>
                      </button>

                      <button
                        onClick={() => handleShare('news', selectedArticle.id, selectedArticle.title)}
                        className="px-3.5 py-1.5 bg-zelda-gold hover:bg-yellow-600 text-white rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer relative"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Link</span>
                        {shareNotification?.id === selectedArticle.id && (
                          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] rounded py-1 px-2.5 whitespace-nowrap z-20 font-sans shadow-lg">
                            {shareNotification.message}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => window.print()}
                        className="p-2 bg-black/5 hover:bg-black/10 border border-zelda-border-sand text-zelda-charcoal rounded-xl transition-all cursor-pointer"
                        title="Print / Save Article"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Article Title & Metadata Header */}
                  <div className="space-y-4 text-left">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-serif text-zelda-charcoal/70">
                      <span className="flex items-center gap-1.5 font-mono text-zelda-gold font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        {selectedArticle.date}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-zelda-green-forest" />
                        {selectedArticle.authorByline || 'Hyrule Scribing Office'}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        Est. 4 min read
                      </span>
                      <span>&bull;</span>
                      <button 
                        onClick={() => handleLikeNews(selectedArticle.id)}
                        className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold cursor-pointer transition-transform hover:scale-105"
                        title="Express Courage & Honor"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current text-rose-600" />
                        <span>{selectedArticle.likes || 0} Courage</span>
                      </button>
                      {selectedArticle.eeatScore && (
                        <>
                          <span>&bull;</span>
                          <span className="bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-300 flex items-center gap-1">
                            <Shield className="w-3 h-3 text-emerald-600" />
                            E-E-A-T Score: {selectedArticle.eeatScore}/100
                          </span>
                        </>
                      )}
                    </div>

                    <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-extrabold text-zelda-charcoal tracking-tight leading-tight">
                      {selectedArticle.title}
                    </h1>

                    <p className="text-base md:text-lg text-zelda-charcoal/80 font-serif italic border-l-4 border-zelda-gold pl-4 py-1 bg-amber-50/40 rounded-r-lg">
                      {selectedArticle.summary}
                    </p>
                  </div>

                  {/* High-Resolution Hero Banner Image */}
                  {selectedArticle.imageUrl && (
                    <div className="relative w-full max-h-[500px] overflow-hidden rounded-2xl border-2 border-zelda-border-sand shadow-lg bg-black">
                      <img 
                        src={selectedArticle.imageUrl} 
                        alt={selectedArticle.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover max-h-[500px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-3 right-3 text-[10px] font-mono text-white/90 bg-black/75 px-3 py-1 rounded-md backdrop-blur border border-white/20">
                        High-Res Media Asset
                      </span>
                    </div>
                  )}

                  {/* SEO Metadata & Transparency Audit Bar */}
                  <div className="p-4 md:p-5 bg-gradient-to-r from-emerald-950/10 via-amber-50/50 to-emerald-950/10 border border-emerald-600/30 rounded-2xl space-y-3 text-xs text-zelda-charcoal">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-600/20 pb-2">
                      <span className="font-serif font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider text-xs">
                        <Globe className="w-4 h-4 text-emerald-700" />
                        SEO & Structured Data Verification (Schema.org NewsArticle)
                      </span>
                      <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-semibold">
                        Canonical Deep Link Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                      <div>
                        <span className="font-semibold text-emerald-950">Canonical Page URL: </span>
                        <span className="font-mono text-[11px] text-zelda-gold select-all break-all font-bold">
                          {window.location.origin}?tab=news&amp;id={selectedArticle.id}
                        </span>
                      </div>
                      
                      {selectedArticle.authorByline && (
                        <div>
                          <span className="font-semibold text-emerald-950">Verified Author Credential: </span>
                          <span className="text-gray-700">{selectedArticle.authorByline}</span>
                        </div>
                      )}
                    </div>

                    {selectedArticle.focusKeywords && selectedArticle.focusKeywords.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="font-semibold text-emerald-950 font-serif">Focus Keywords: </span>
                        {selectedArticle.focusKeywords.map((kw, idx) => (
                          <span key={idx} className="bg-emerald-100/80 border border-emerald-300 text-emerald-900 font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}

                    {selectedArticle.rssReferenceUrl && (
                      <div className="pt-1 text-[11px] font-mono text-gray-600 flex items-center gap-1.5">
                        <span className="font-semibold text-emerald-900">External Syndication Source:</span>
                        <a
                          href={selectedArticle.rssReferenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zelda-gold hover:underline font-bold flex items-center gap-1"
                        >
                          {selectedArticle.rssSourceTitle || 'Google News Feed Reference'}
                          <ExternalLink className="w-3 h-3 text-zelda-gold" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Full Article Content Reader */}
                  <div className="w-full max-w-4xl mx-auto py-4 text-left border-t border-b border-zelda-border-sand/60">
                    <NewsContentRenderer
                      content={selectedArticle.content || selectedArticle.summary}
                      isSummary={false}
                    />
                  </div>

                  {/* Gallery Section */}
                  {selectedArticle.galleryImages && selectedArticle.galleryImages.length > 0 && (
                    <div className="space-y-4 text-left pt-2">
                      <h3 className="font-serif text-lg font-bold text-zelda-charcoal uppercase tracking-wider flex items-center gap-2 border-b border-zelda-border-sand pb-2">
                        <ImageIcon className="w-5 h-5 text-zelda-gold" />
                        Chronicle High-Resolution Media Gallery ({selectedArticle.galleryImages.length})
                      </h3>
                      <NewsGalleryViewer
                        images={selectedArticle.galleryImages}
                        title={selectedArticle.title}
                      />
                    </div>
                  )}

                  {/* Discussion & Comments */}
                  <div className="pt-6 border-t border-zelda-border-sand text-left space-y-4">
                    <h3 className="font-serif text-xl font-bold text-zelda-charcoal uppercase tracking-wider flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-zelda-green-forest" />
                      Royal Fan Discussion & Community Reactions
                    </h3>
                    <CommentsSection
                      targetId={selectedArticle.id}
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
                  </div>

                  {/* Bottom Related Articles Grid */}
                  <div className="pt-8 border-t border-zelda-border-sand text-left space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl font-bold text-zelda-charcoal uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-zelda-gold" />
                        More Chronicles from Hyrule
                      </h3>
                      <button
                        onClick={closeNewsArticle}
                        className="text-xs font-serif text-zelda-gold font-bold uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        View All <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {news.filter(n => n.id !== selectedArticle.id).slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => openNewsArticle(item.id)}
                          className="bg-white border border-zelda-border-sand hover:border-zelda-gold rounded-xl overflow-hidden flex flex-col justify-between p-4 cursor-pointer transition-all duration-300 shadow-md group hover:-translate-y-1"
                        >
                          <div className="space-y-3">
                            <div className="relative h-36 rounded-lg overflow-hidden bg-black/10">
                              <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              />
                              <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur text-white text-[9px] font-serif font-bold uppercase rounded">
                                {item.category}
                              </span>
                            </div>

                            <h4 className="font-serif text-sm font-bold text-zelda-charcoal group-hover:text-zelda-gold transition-colors line-clamp-2">
                              {item.title}
                            </h4>

                            <p className="text-xs text-zelda-charcoal/70 line-clamp-2 font-sans">
                              {item.summary}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-zelda-border-sand/40 mt-3 flex items-center justify-between text-[10px] font-serif font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1 text-rose-600">
                              <Heart className="w-3 h-3 fill-current" />
                              <span>{item.likes || 0} Courage</span>
                            </span>
                            <span className="flex items-center gap-0.5 text-zelda-gold">
                              <span>Read Article</span>
                              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.article>
              );
            })() : (
              /* STANDARD NEWS GRID VIEW (WHEN NO ARTICLE IS OPEN) */
              <>
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
                        onClick={() => { setNewsFilter(cat); setNewsCurrentPage(1); }}
                        className={`px-3 py-1.5 rounded-md text-xs font-serif uppercase tracking-wider transition-all cursor-pointer ${
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
                  {/* Left Column: Reorganized News Feed */}
                  <div className="flex-grow w-full space-y-8">
                    {(() => {
                      const NEWS_PER_PAGE = 20;
                      const totalNewsPages = Math.ceil(filteredNews.length / NEWS_PER_PAGE) || 1;
                      const paginatedNews = filteredNews.slice((newsCurrentPage - 1) * NEWS_PER_PAGE, newsCurrentPage * NEWS_PER_PAGE);

                      // Top 6 entries with thumbnails (shown on Page 1)
                      const thumbnailNewsItems = newsCurrentPage === 1 ? paginatedNews.slice(0, 6) : [];
                      // Remaining entries on Page 1 or all entries on subsequent pages
                      const archiveNewsItems = newsCurrentPage === 1 ? paginatedNews.slice(6) : paginatedNews;

                      if (filteredNews.length === 0) {
                        return (
                          <div className="bg-white/50 border border-zelda-border-sand rounded-2xl p-12 text-center text-zelda-charcoal/70 space-y-3">
                            <BookOpen className="w-10 h-10 mx-auto text-zelda-gold/60" />
                            <h4 className="font-serif text-base font-bold uppercase">No Chronicles Found</h4>
                            <p className="text-xs text-zelda-charcoal/60">No news entries match the selected category or search query.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-8">
                          {/* TOP 6 FEATURED ENTRIES WITH THUMBNAILS (3-COL GRID) */}
                          {thumbnailNewsItems.length > 0 && (
                            <div className="space-y-4">
                              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-zelda-gold flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-zelda-gold" />
                                <span>Latest Chronicles ({thumbnailNewsItems.length})</span>
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {thumbnailNewsItems.map((item) => (
                                  <div 
                                    key={item.id} 
                                    id={`news-${item.id}`}
                                    className="bg-white/70 border border-zelda-border-sand rounded-xl overflow-hidden flex flex-col justify-between hover:border-zelda-gold/80 transition-all duration-300 shadow-md h-full group hover:-translate-y-1"
                                  >
                                    {/* Box Image Header */}
                                    <div 
                                      onClick={() => openNewsArticle(item.id)}
                                      className="relative h-48 w-full overflow-hidden flex-shrink-0 bg-black/10 cursor-pointer"
                                    >
                                      <img 
                                        src={item.imageUrl} 
                                        alt={item.title} 
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
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

                                      {item.eeatScore && (
                                        <span className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1 shadow">
                                          <Shield className="w-3 h-3 text-emerald-400" />
                                          <span>E-E-A-T {item.eeatScore}/100</span>
                                        </span>
                                      )}

                                      <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-gray-200 bg-black/75 px-2 py-0.5 rounded shadow flex items-center gap-1">
                                        <Heart className="w-3 h-3 text-rose-400 fill-rose-500" />
                                        <span className="font-bold">{item.likes || 0}</span>
                                        <span>&bull;</span>
                                        <span>{item.date}</span>
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
                                        <h4 
                                          onClick={() => openNewsArticle(item.id)}
                                          className="font-serif text-base md:text-lg font-bold text-zelda-charcoal tracking-wide group-hover:text-zelda-gold transition-colors line-clamp-2 cursor-pointer"
                                        >
                                          {item.title}
                                        </h4>
                                        <NewsContentRenderer
                                          content={item.summary}
                                          isSummary={true}
                                        />
                                      </div>

                                      <div className="flex gap-2 pt-3 border-t border-zelda-border-sand/40 mt-auto">
                                        <button
                                          onClick={() => handleLikeNews(item.id)}
                                          className="px-3 py-2 bg-white hover:bg-rose-50 border border-zelda-border-sand hover:border-rose-400 rounded-lg text-zelda-charcoal hover:text-rose-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                          title="Express Courage"
                                        >
                                          <Heart className="w-3.5 h-3.5 fill-current text-rose-600" />
                                          <span className="text-xs font-serif font-bold">{item.likes || 0}</span>
                                        </button>

                                        <button
                                          onClick={() => openNewsArticle(item.id)}
                                          className="flex-grow text-center py-2 bg-zelda-gold hover:bg-yellow-600 text-white border border-zelda-gold rounded-lg font-serif text-xs uppercase tracking-widest transition-all cursor-pointer font-bold shadow-sm flex items-center justify-center gap-1.5"
                                        >
                                          <span>Read Full Chronicle</span>
                                          <ChevronRight className="w-3.5 h-3.5" />
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
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* CONTINUED CHRONICLES (TITLE LINKS + SMALL EXCERPTS) */}
                          {archiveNewsItems.length > 0 && (
                            <div className="space-y-4 pt-2">
                              <div className="border-b border-zelda-border-sand pb-3 flex items-center justify-between">
                                <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-zelda-charcoal flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-zelda-gold" />
                                  <span>Archived Hyrule Chronicles ({archiveNewsItems.length})</span>
                                </h4>
                                <span className="text-[10px] font-mono text-zelda-charcoal/60">
                                  Title Links & Excerpts
                                </span>
                              </div>

                              <div className="space-y-3">
                                {archiveNewsItems.map((item) => (
                                  <div 
                                    key={item.id} 
                                    id={`news-${item.id}`}
                                    className="bg-white/80 border border-zelda-border-sand hover:border-zelda-gold rounded-xl p-4 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                                  >
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                                        <span className={`px-2 py-0.5 rounded font-serif font-bold uppercase tracking-wider text-white ${
                                          item.category === 'movie' ? 'bg-zelda-gold' : item.category === 'game' ? 'bg-zelda-green-forest' : 'bg-zelda-green-light'
                                        }`}>
                                          {item.category === 'movie' ? 'Live Action Movie' : item.category}
                                        </span>
                                        <span className="text-zelda-charcoal/60">{item.date}</span>
                                        {item.authorByline && (
                                          <span className="text-zelda-gold font-bold hidden sm:inline">&bull; By {item.authorByline}</span>
                                        )}
                                      </div>

                                      <h4 
                                        onClick={() => openNewsArticle(item.id)}
                                        className="font-serif text-base font-bold text-zelda-charcoal group-hover:text-zelda-gold transition-colors cursor-pointer line-clamp-1"
                                      >
                                        {item.title}
                                      </h4>

                                      <p className="text-xs text-zelda-charcoal/80 line-clamp-2 font-sans leading-relaxed">
                                        {item.summary.replace(/<[^>]*>/g, '')}
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zelda-border-sand/40">
                                      <button
                                        onClick={() => handleLikeNews(item.id)}
                                        className="px-3 py-1.5 bg-amber-50/60 hover:bg-rose-50 border border-zelda-border-sand hover:border-rose-400 rounded-lg text-zelda-charcoal hover:text-rose-600 text-xs font-serif font-bold transition-all flex items-center gap-1 cursor-pointer"
                                        title="Express Courage"
                                      >
                                        <Heart className="w-3 h-3 text-rose-600 fill-current" />
                                        <span>{item.likes || 0}</span>
                                      </button>

                                      <button
                                        onClick={() => openNewsArticle(item.id)}
                                        className="px-3.5 py-1.5 bg-zelda-gold hover:bg-yellow-600 text-white font-serif text-xs uppercase font-bold tracking-wider rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                                      >
                                        <span>Read</span>
                                        <ChevronRight className="w-3 h-3" />
                                      </button>

                                      <button
                                        onClick={() => handleShare('news', item.id, item.title)}
                                        className="p-1.5 bg-white border border-zelda-border-sand hover:border-zelda-gold rounded-lg text-zelda-charcoal hover:text-zelda-gold transition-all relative cursor-pointer"
                                        title="Share"
                                      >
                                        <Share2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* PAGINATION CONTROLS (20 ENTRIES PER PAGE) */}
                          {totalNewsPages > 1 && (
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-zelda-border-sand bg-white/80 p-4 rounded-xl shadow-xs">
                              <button
                                disabled={newsCurrentPage === 1}
                                onClick={() => { setNewsCurrentPage(p => Math.max(p - 1, 1)); window.scrollTo({ top: 350, behavior: 'smooth' }); }}
                                className="px-4 py-2 bg-white border border-zelda-border-sand rounded-lg text-xs font-serif font-bold uppercase tracking-wider text-zelda-charcoal disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zelda-gold hover:text-white transition-all cursor-pointer shadow-xs"
                              >
                                &larr; Previous Page
                              </button>

                              <div className="flex items-center gap-1.5 text-xs font-serif">
                                <span className="text-zelda-charcoal/70 mr-1">Page</span>
                                {Array.from({ length: totalNewsPages }, (_, i) => i + 1).map((pageNum) => (
                                  <button
                                    key={pageNum}
                                    onClick={() => { setNewsCurrentPage(pageNum); window.scrollTo({ top: 350, behavior: 'smooth' }); }}
                                    className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                                      newsCurrentPage === pageNum
                                        ? 'bg-zelda-gold text-white shadow-md'
                                        : 'bg-white text-zelda-charcoal border border-zelda-border-sand hover:bg-amber-50'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                ))}
                                <span className="text-zelda-charcoal/70 ml-1">of {totalNewsPages}</span>
                              </div>

                              <button
                                disabled={newsCurrentPage === totalNewsPages}
                                onClick={() => { setNewsCurrentPage(p => Math.min(p + 1, totalNewsPages)); window.scrollTo({ top: 350, behavior: 'smooth' }); }}
                                className="px-4 py-2 bg-white border border-zelda-border-sand rounded-lg text-xs font-serif font-bold uppercase tracking-wider text-zelda-charcoal disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zelda-gold hover:text-white transition-all cursor-pointer shadow-xs"
                              >
                                Next Page &rarr;
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right Column: Sidebar Aligned to Right */}
                  <div id="extra-stuff-sidebar" className="w-full xl:w-80 flex-shrink-0 bg-white/50 border border-zelda-border-sand rounded-xl p-5 min-h-[400px] flex flex-col justify-between space-y-6 shadow-md">
                    {/* Interactive Ocarina Music Player Sidebar Widget */}
                    <OcarinaSidebarWidget />

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

                              {block.type === 'movie-tracker' && (
                                <div className="relative overflow-hidden bg-[#1A1A1A]/90 border border-zelda-gold/60 rounded-xl p-4 shadow-lg text-left mt-2">
                                  <div className="absolute right-0 top-0 w-32 h-32 bg-[radial-gradient(circle,rgba(184,134,11,0.2),transparent_70%)] pointer-events-none" />
                                  <div className="space-y-3 relative z-10">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold font-serif uppercase tracking-widest bg-zelda-gold/20 text-zelda-gold border border-zelda-gold/30">
                                      <Film className="w-3 h-3" /> Upcoming Live-Action Movie
                                    </span>
                                    {block.title !== 'Live-Action Zelda Film Tracker' && (
                                      <h2 className="text-sm font-serif font-extrabold text-zelda-gold tracking-wide">
                                        {block.title}
                                      </h2>
                                    )}
                                    <p className="text-gray-300 leading-snug text-[10px]">
                                      {block.content}
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                      <div className="bg-black/40 border border-white/10 rounded p-1.5">
                                        <div className="text-[8px] text-zelda-gold uppercase tracking-widest font-semibold">Current Phase</div>
                                        <div className="text-[9px] font-serif font-bold text-white mt-0.5">Pre-Production</div>
                                      </div>
                                      <div className="bg-black/40 border border-white/10 rounded p-1.5">
                                        <div className="text-[8px] text-zelda-gold uppercase tracking-widest font-semibold">Aesthetic Goal</div>
                                        <div className="text-[9px] font-serif font-bold text-white mt-0.5">Live Miyazaki Feel</div>
                                      </div>
                                      <div className="bg-black/40 border border-white/10 rounded p-1.5 col-span-2">
                                        <div className="text-[8px] text-zelda-gold uppercase tracking-widest font-semibold">Studio Partner</div>
                                        <div className="text-[9px] font-serif font-bold text-white mt-0.5">Sony Pictures & Nintendo</div>
                                      </div>
                                    </div>
                                    <div className="w-full bg-black/60 border border-zelda-gold/30 rounded-lg p-2 text-center mt-2">
                                      <div className="font-serif text-[8px] uppercase tracking-widest text-zelda-gold mb-1">Movie Hype Status</div>
                                      <div className="text-lg font-black font-serif text-white tracking-widest mb-0.5 animate-pulse">98.4%</div>
                                      <div className="text-[8px] text-gray-400 uppercase tracking-wider">Fan Registry Enthusiasm</div>
                                    </div>
                                  </div>
                                </div>
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

                    {/* Royal Fan Creations Widget in Sidebar (Below Extra Stuff) */}
                    <div className="pt-4 border-t-2 border-zelda-gold/40 space-y-4">
                      <div className="flex items-center justify-between pb-1 border-b border-zelda-border-sand/40">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-zelda-gold" />
                          <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-zelda-gold">
                            Royal Fan Creations
                          </h4>
                        </div>
                        <button
                          onClick={() => setActiveTab('submissions')}
                          className="text-[10px] font-serif font-bold text-zelda-gold hover:underline uppercase flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>View All ({submissions.length})</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Compact News-Entry Styled Fan Creation Cards */}
                      <div className="space-y-3.5">
                        {submissions.slice(0, 3).map((sub) => (
                          <div 
                            key={sub.id}
                            onClick={() => {
                              openSubmissionPage(sub.id);
                              setTimeout(() => {
                                const el = document.getElementById(`submission-${sub.id}`);
                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }, 150);
                            }}
                            className="bg-white/80 border border-zelda-border-sand rounded-xl overflow-hidden shadow-sm hover:border-zelda-gold hover:shadow-md transition-all duration-300 group cursor-pointer"
                          >
                            {/* Media Box Header */}
                            {(sub.type === 'art' || sub.type === 'memorabilia') && sub.contentUrl ? (
                              <div className="relative h-28 w-full overflow-hidden bg-black">
                                <img 
                                  src={sub.contentUrl} 
                                  alt={sub.title} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur text-white text-[9px] font-serif font-bold uppercase rounded border border-white/20">
                                  {sub.type === 'art' ? '🎨 Art' : '🛡️ Replica'}
                                </span>
                                <span className="absolute bottom-1.5 right-2 text-[9px] font-mono text-amber-300 font-bold flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded">
                                  <Heart className="w-3 h-3 fill-amber-300 text-amber-300" />
                                  {sub.likes || 0}
                                </span>
                              </div>
                            ) : sub.type === 'video' ? (
                              <div className="relative h-24 bg-gradient-to-br from-zelda-green-forest to-emerald-950 flex flex-col items-center justify-center border-b border-zelda-border-sand/40 p-2 text-white">
                                <Video className="w-7 h-7 text-zelda-gold mb-1 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-serif uppercase tracking-wider font-bold">Interactive Media Cover</span>
                                <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-zelda-gold text-[9px] font-serif font-bold uppercase rounded border border-zelda-gold/30">
                                  🎥 Video
                                </span>
                              </div>
                            ) : (
                              <div className="p-3 bg-amber-50/70 border-b border-zelda-border-sand/40 relative">
                                <span className="px-2 py-0.5 bg-black/80 text-zelda-gold text-[9px] font-serif font-bold uppercase rounded border border-zelda-gold/30">
                                  ✍️ Literature
                                </span>
                                <p className="text-[11px] text-zelda-charcoal/80 italic line-clamp-2 mt-1.5 font-sans">
                                  "{sub.contentBody || sub.description}"
                                </p>
                              </div>
                            )}

                            {/* Text Body */}
                            <div className="p-3 space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-zelda-charcoal/70">
                                <span className="font-serif font-bold text-zelda-gold uppercase">By {sub.author}</span>
                                <span className="font-mono text-[9px]">{sub.date}</span>
                              </div>
                              <h5 className="font-serif text-xs font-bold text-zelda-charcoal group-hover:text-zelda-gold transition-colors line-clamp-1">
                                {sub.title}
                              </h5>
                              <p className="text-[11px] text-zelda-charcoal/75 line-clamp-2 leading-tight">
                                {sub.description}
                              </p>
                              <div className="pt-2 flex items-center justify-between text-[10px] font-serif font-bold text-zelda-gold uppercase tracking-wider border-t border-zelda-border-sand/30 mt-2">
                                <span>View Masterpiece</span>
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick CTA button */}
                      <button
                        onClick={() => setActiveTab('submissions')}
                        className="w-full py-2 bg-gradient-to-r from-zelda-gold to-yellow-600 hover:from-yellow-600 hover:to-zelda-gold text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-yellow-300/30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Post Fan Creation</span>
                      </button>
                    </div>
                  </div>
                </div>
            </>
            )}
          </motion.div>
        )}

        {/* TAB 2: ARCHIVES */}
        {activeTab === 'lore' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            <ArchivesSection 
              entries={lore} 
              currentUser={user} 
              onOpenAuth={() => handleLogin()} 
              comments={comments}
              commentsLoading={commentsLoading}
              newCommentText={newCommentText}
              setNewCommentText={setNewCommentText}
              fetchComments={fetchComments}
              handleAddComment={handleAddComment}
              handleDeleteComment={handleDeleteComment}
            />
          </motion.div>
        )}

        {/* TAB 3: USER SUBMISSIONS / CREATOR CLUB */}
        {activeTab === 'submissions' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-8"
          >
            {selectedSubmissionId && submissions.some(s => s.id === selectedSubmissionId) ? (
              /* DEDICATED SINGLE-PAGE CREATION VIEW */
              (() => {
                const currentSub = submissions.find(s => s.id === selectedSubmissionId)!;
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8 max-w-5xl mx-auto"
                  >
                    {/* Top Breadcrumb Navigation & Controls */}
                    <div className="bg-zelda-beige-card border-2 border-zelda-gold/60 rounded-2xl p-4 md:p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
                      <button
                        onClick={closeSubmissionPage}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-zelda-beige-card border border-zelda-border-sand hover:border-zelda-gold text-zelda-charcoal hover:text-zelda-gold rounded-xl font-serif text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                      >
                        <ArrowLeft className="w-4 h-4 text-zelda-gold" />
                        <span>← Back to Creator Club Feed</span>
                      </button>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 bg-zelda-gold text-white text-xs font-serif font-bold uppercase rounded-lg shadow">
                          {currentSub.type === 'art' && '🎨 Artwork Showcase Page'}
                          {currentSub.type === 'video' && '🎥 Video / Music Page'}
                          {currentSub.type === 'literature' && '✍️ Literature Parchment Page'}
                          {currentSub.type === 'review' && '⭐ Game Review Page'}
                          {currentSub.type === 'memorabilia' && '🛡️ Replica Masterpiece Page'}
                          {currentSub.type === 'fangame' && '🎮 Fan Game Demo Page'}
                          {currentSub.type === 'theory' && '🔮 Lore Theory Hypothesis Page'}
                          {currentSub.type === 'nft' && '💎 Digital NFT Collectible Page'}
                          {currentSub.type === 'avatar' && '👤 Profile Avatar & Icon Page'}
                        </span>

                        {currentSub.tokenized && (
                          <button
                            onClick={() => setActiveCertificate(currentSub.tokenDetails || null)}
                            className="bg-black/90 text-amber-300 border border-zelda-gold/60 px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow hover:bg-black cursor-pointer"
                          >
                            <Award className="w-4 h-4 text-zelda-gold" />
                            <span>Tokenized IP Certificate</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleLike(currentSub.id)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-rose-50 text-zelda-charcoal hover:text-rose-600 border border-zelda-border-sand hover:border-rose-400 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer shadow-sm"
                        >
                          <Heart className="w-4 h-4 fill-current text-rose-600" />
                          <span>{currentSub.likes || 0} Courage</span>
                        </button>

                        <button
                          onClick={() => handleShare('submissions', currentSub.id, currentSub.title)}
                          className="p-2 bg-white hover:bg-zelda-beige-card border border-zelda-border-sand hover:border-zelda-gold rounded-xl text-zelda-charcoal hover:text-zelda-gold transition-all flex items-center justify-center relative cursor-pointer shadow-sm"
                          title="Share Creation Page"
                        >
                          <Share2 className="w-4 h-4" />
                          {shareNotification?.id === currentSub.id && (
                            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] rounded py-1.5 px-3 whitespace-nowrap z-20 font-sans shadow-lg">
                              {shareNotification.message}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Main Creation Display Stage */}
                    <div className="bg-zelda-beige-card border border-zelda-border-sand rounded-2xl overflow-hidden shadow-xl text-zelda-charcoal">
                      {/* Gallery or Media Showcase Container */}
                      {((currentSub.galleryImages && currentSub.galleryImages.length > 0) || (currentSub.contentUrl && currentSub.type !== 'video')) ? (
                        <div className="bg-black/95 p-4 md:p-6">
                          <NewsGalleryViewer 
                            images={
                              currentSub.galleryImages && currentSub.galleryImages.length > 0 
                                ? currentSub.galleryImages 
                                : [currentSub.contentUrl!]
                            } 
                            title={currentSub.title} 
                          />
                        </div>
                      ) : currentSub.type === 'video' ? (
                        <div className="bg-gradient-to-br from-zelda-green-forest via-[#0a1811] to-black p-8 md:p-12 text-white text-center flex flex-col items-center justify-center min-h-[350px] relative border-b border-zelda-gold/30">
                          <div className="w-20 h-20 rounded-2xl bg-zelda-gold/20 border-2 border-zelda-gold flex items-center justify-center mb-4 shadow-xl">
                            <Video className="w-10 h-10 text-zelda-gold animate-pulse" />
                          </div>
                          <h3 className="font-serif text-2xl font-bold uppercase tracking-wider text-amber-200">
                            {currentSub.title}
                          </h3>
                          <p className="text-xs text-gray-300 max-w-md mt-2 font-sans">
                            Interactive Hyrule Video & Audio Recording Showcase
                          </p>
                          {currentSub.contentUrl && (
                            <a
                              href={currentSub.contentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-zelda-gold hover:bg-yellow-600 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all border border-amber-300/40"
                            >
                              <span>Watch Full Video Showcase</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      ) : null}

                      {/* Content Body / Text Scroll Container */}
                      {currentSub.contentBody && (
                        <div className="bg-[#fcf8ee] border-b-2 border-zelda-border-sand/60 p-8 md:p-12 relative">
                          <div className="max-w-3xl mx-auto space-y-6">
                            <div className="flex items-center justify-between border-b border-zelda-border-sand/60 pb-4">
                              <span className="text-xs font-serif font-bold uppercase text-zelda-gold tracking-widest flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-zelda-gold" />
                                <span>Royal Parchment Scroll #</span>
                                <span className="font-mono text-zelda-charcoal">{currentSub.id}</span>
                              </span>
                              <span className="text-xs font-mono text-zelda-charcoal/60">{currentSub.date}</span>
                            </div>
                            <div className="text-sm md:text-base">
                              <CreationContentRenderer content={currentSub.contentBody} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Creation Info & Details Body */}
                      <div className="p-6 md:p-10 space-y-8">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zelda-charcoal/70">
                            <span className="font-serif font-bold text-zelda-gold uppercase tracking-wider text-sm flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-zelda-green-forest" />
                              Created by <span className="text-zelda-charcoal">{currentSub.author}</span>
                            </span>
                            <span className="font-mono text-xs text-zelda-charcoal/60">Published: {currentSub.date}</span>
                          </div>

                          <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-zelda-charcoal tracking-wide uppercase">
                            {currentSub.title}
                          </h1>
                        </div>

                        {/* Description & Author Notes */}
                        <div className="bg-white/80 border border-zelda-border-sand rounded-xl p-5 md:p-6 space-y-2 text-zelda-charcoal">
                          <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-zelda-gold">
                            Creator's Inspiration & Notes
                          </h4>
                          <p className="text-xs md:text-sm text-zelda-charcoal/90 font-sans leading-relaxed">
                            {currentSub.description}
                          </p>
                        </div>

                        {/* Tokenized IP Certificate Banner */}
                        {currentSub.tokenized && currentSub.tokenDetails && (
                          <div className="bg-gradient-to-r from-amber-950/90 via-black to-amber-950/90 border-2 border-zelda-gold/80 rounded-2xl p-6 text-amber-100 shadow-xl space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zelda-gold/40">
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-zelda-gold/20 border border-zelda-gold/60 rounded-xl text-zelda-gold">
                                  <Award className="w-6 h-6" />
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                                    Royal Register of Intellectual Property
                                  </span>
                                  <h4 className="font-serif font-bold text-base uppercase text-white tracking-wider">
                                    Triforce IP Ownership Certificate
                                  </h4>
                                </div>
                              </div>

                              <button
                                onClick={() => setActiveCertificate(currentSub.tokenDetails || null)}
                                className="px-4 py-2 bg-zelda-gold hover:bg-yellow-600 text-white font-serif text-xs font-bold uppercase tracking-wider rounded-xl shadow cursor-pointer transition-colors"
                              >
                                Inspect Full Certificate
                              </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                              <div>
                                <span className="text-gray-400 text-[10px] uppercase block">Token Hash</span>
                                <span className="text-amber-300 truncate block">{currentSub.tokenDetails.tokenId}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 text-[10px] uppercase block">License Type</span>
                                <span className="text-amber-300 block">{currentSub.tokenDetails.licenseType}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 text-[10px] uppercase block">Royalty Share</span>
                                <span className="text-amber-300 block">{currentSub.tokenDetails.royaltyRate}%</span>
                              </div>
                              <div>
                                <span className="text-gray-400 text-[10px] uppercase block">Mint Timestamp</span>
                                <span className="text-amber-300 block">{currentSub.tokenDetails.mintDate}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Interactive Alliance Discussions Section */}
                        <div className="pt-4 border-t border-zelda-border-sand/60">
                          <h3 className="font-serif text-lg font-bold text-zelda-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-zelda-gold" />
                            <span>Alliance Discussions & Feedback</span>
                          </h3>

                          <CommentsSection
                            targetId={currentSub.id}
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
                        </div>
                      </div>
                    </div>

                    {/* Explore More Creations Grid */}
                    <div className="bg-zelda-beige-card border border-zelda-border-sand rounded-2xl p-6 shadow-md space-y-4">
                      <h3 className="font-serif text-base font-bold text-zelda-charcoal uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-zelda-gold" />
                        <span>Explore More Creations from Hyrule Club</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {submissions
                          .filter(s => s.id !== currentSub.id)
                          .slice(0, 3)
                          .map(otherSub => (
                            <div
                              key={otherSub.id}
                              onClick={() => openSubmissionPage(otherSub.id)}
                              className="bg-white border border-zelda-border-sand hover:border-zelda-gold rounded-xl p-3.5 space-y-2 cursor-pointer transition-all hover:shadow-md group"
                            >
                              <div className="flex items-center justify-between text-[10px] text-zelda-charcoal/60">
                                <span className="font-serif font-bold text-zelda-gold uppercase">
                                  By {otherSub.author}
                                </span>
                                <span>{otherSub.date}</span>
                              </div>
                              <h4 className="font-serif text-xs font-bold text-zelda-charcoal group-hover:text-zelda-gold transition-colors line-clamp-1">
                                {otherSub.title}
                              </h4>
                              <p className="text-[11px] text-zelda-charcoal/70 line-clamp-2 font-sans">
                                {otherSub.description}
                              </p>
                              <div className="text-[10px] font-serif font-bold text-zelda-gold uppercase flex items-center gap-1 pt-1">
                                <span>Open Creation Page</span>
                                <ChevronRight className="w-3 h-3" />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })()
            ) : (
              /* CREATOR CLUB MAIN FEED AND SUBMIT PORTAL */
              <>
                {/* Top Sub-Header Navigation Banner */}
            <div className="bg-zelda-beige-card border-2 border-zelda-gold/60 rounded-2xl p-4 md:p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 text-zelda-charcoal">
              <div>
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-6 h-6 text-zelda-gold" />
                  <h2 className="font-serif text-xl md:text-2xl font-bold tracking-wider uppercase text-zelda-charcoal">
                    Royal Fan Creator Club
                  </h2>
                </div>
                <p className="text-xs text-zelda-charcoal/80 mt-1 font-sans">
                  Publish fan art, prop replicas, video covers, fan fiction, and game reviews to the Hyrule archives.
                </p>
              </div>

              {/* Section Sub-Tabs Controller */}
              <div className="flex flex-wrap items-center bg-white/90 p-1.5 rounded-xl border border-zelda-border-sand shadow-inner gap-1">
                <button
                  onClick={() => setCreatorSubTab('feed')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    creatorSubTab === 'feed'
                      ? 'bg-zelda-gold text-white shadow-md'
                      : 'text-zelda-charcoal/70 hover:text-zelda-charcoal hover:bg-black/5'
                  }`}
                >
                  <Film className="w-4 h-4 text-amber-200" />
                  <span>Latest Feed & Categories</span>
                </button>

                <button
                  onClick={() => setCreatorSubTab('submit')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    creatorSubTab === 'submit'
                      ? 'bg-zelda-gold text-white shadow-md'
                      : 'text-zelda-charcoal/70 hover:text-zelda-charcoal hover:bg-black/5'
                  }`}
                >
                  <Plus className="w-4 h-4 text-amber-200" />
                  <span>Submit Fan Creation</span>
                </button>

                <button
                  onClick={() => setCreatorSubTab('all')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    creatorSubTab === 'all'
                      ? 'bg-zelda-green-forest text-white shadow-md border border-zelda-gold/40'
                      : 'text-zelda-charcoal/70 hover:text-zelda-charcoal hover:bg-black/5'
                  }`}
                  title="View Both Sections Stacked"
                >
                  <Layers className="w-4 h-4" />
                  <span className="hidden sm:inline">Both Sections</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: SUBMIT FAN CREATION PORTAL */}
            {(creatorSubTab === 'submit' || creatorSubTab === 'all') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zelda-beige-card border border-zelda-border-sand rounded-2xl p-6 md:p-8 shadow-md text-zelda-charcoal space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zelda-border-sand">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zelda-gold/20 border border-zelda-gold/60 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-zelda-gold" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-zelda-gold tracking-widest block">
                        Section 1 of Creator Club
                      </span>
                      <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-zelda-charcoal">
                        Submit Fan Creation
                      </h3>
                    </div>
                  </div>

                  {creatorSubTab === 'submit' && (
                    <button
                      onClick={() => setCreatorSubTab('feed')}
                      className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-zelda-gold hover:underline uppercase cursor-pointer"
                    >
                      <span>Explore Creations Feed ({submissions.length})</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {!user ? (
                  <div className="bg-white/60 border border-zelda-border-sand rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-inner">
                    <User className="w-12 h-12 mx-auto text-zelda-gold" />
                    <h4 className="font-serif font-bold uppercase tracking-wider text-base text-zelda-charcoal">
                      Sanctuary Hero Authentication Required
                    </h4>
                    <p className="text-xs text-zelda-charcoal/80 leading-relaxed font-sans">
                      To protect the Royal Registers from Ganon's corruption, authenticate your hero identity before publishing fan creations.
                    </p>
                    <button
                      type="button"
                      onClick={handleLogin}
                      className="px-6 py-3 bg-zelda-gold hover:bg-yellow-600 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-colors cursor-pointer"
                    >
                      Authenticate Hero ▲
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePostSubmission} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1.5">
                          Creator Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., LinkTheBard"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          className="w-full bg-white border border-zelda-border-sand rounded-xl p-3 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1.5">
                          Creation Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Korok Forest Watercolor"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-white border border-zelda-border-sand rounded-xl p-3 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1.5">
                          Creation Category
                        </label>
                        <select
                          value={subType}
                          onChange={(e) => setSubType(e.target.value as any)}
                          className="w-full bg-white border border-zelda-border-sand rounded-xl p-3 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold font-serif shadow-sm cursor-pointer"
                        >
                          <option value="art">🎨 Artwork / Painting</option>
                          <option value="video">🎥 Video / Music / Cover</option>
                          <option value="literature">✍️ Literature / Fan Fic</option>
                          <option value="review">⭐ Game Review</option>
                          <option value="memorabilia">🛡️ Memorabilia / Prop Replica</option>
                          <option value="fangame">🎮 Fan Game / Playable Demo</option>
                          <option value="theory">🔮 Theory / Lore Hypothesis</option>
                          <option value="nft">💎 NFT / Digital Collectible</option>
                          <option value="avatar">👤 Avatar / Profile Icon</option>
                        </select>
                      </div>
                    </div>

                    {/* Image Upload & Multi-Image Gallery Area */}
                    <div className="bg-white/80 border border-zelda-border-sand rounded-2xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-serif font-bold uppercase tracking-wider text-zelda-charcoal flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-zelda-gold" />
                          <span>Creation Images & Gallery Upload</span>
                        </label>
                        <span className="text-[10px] font-mono text-zelda-charcoal/60 bg-zelda-gold/10 px-2 py-0.5 rounded border border-zelda-gold/20">
                          Multi-Image Gallery Enabled
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                        {/* Drag & Drop File Upload Box */}
                        <div 
                          onDragOver={(e) => { e.preventDefault(); setIsDraggingCreationFile(true); }}
                          onDragLeave={() => setIsDraggingCreationFile(false)}
                          onDrop={handleCreationDrop}
                          onClick={() => creationFileInputRef.current?.click()}
                          className={`lg:col-span-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[110px] ${
                            isDraggingCreationFile 
                              ? 'border-zelda-gold bg-amber-100/60 shadow-md scale-102' 
                              : 'border-zelda-border-sand hover:border-zelda-gold bg-amber-50/40 hover:bg-amber-100/30'
                          }`}
                        >
                          <input 
                            ref={creationFileInputRef} 
                            type="file" 
                            accept="image/*" 
                            multiple
                            className="hidden" 
                            onChange={handleCreationFileUpload} 
                          />
                          <Upload className="w-6 h-6 text-zelda-gold mb-1 animate-bounce" />
                          <p className="text-xs font-serif font-bold text-zelda-charcoal">
                            Click or Drag Images Here
                          </p>
                          <p className="text-[10px] text-zelda-charcoal/60 mt-0.5">
                            PNG, JPG, WEBP, GIF (Max 20MB per image, multiple files allowed)
                          </p>
                        </div>

                        {/* Direct URL Input & Add to Gallery */}
                        <div className="lg:col-span-2 space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                              value={customCreationGalleryUrl}
                              onChange={(e) => setCustomCreationGalleryUrl(e.target.value)}
                              className="flex-1 bg-white border border-zelda-border-sand rounded-xl p-2.5 text-xs text-zelda-charcoal focus:outline-none focus:border-zelda-gold font-mono shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (customCreationGalleryUrl.trim()) {
                                  const url = customCreationGalleryUrl.trim();
                                  setCreationGalleryImages(prev => prev.includes(url) ? prev : [...prev, url]);
                                  if (!contentUrl) setContentUrl(url);
                                  setCustomCreationGalleryUrl('');
                                }
                              }}
                              className="px-4 py-2 bg-zelda-gold hover:bg-yellow-600 text-white font-serif text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow"
                            >
                              Add Image
                            </button>
                          </div>

                          {/* Gallery Images List / Thumbnails */}
                          {creationGalleryImages.length > 0 && (
                            <div className="space-y-2 pt-1 border-t border-zelda-border-sand/40">
                              <span className="text-[10px] font-serif font-bold text-zelda-gold uppercase tracking-wider block">
                                Selected Gallery Images ({creationGalleryImages.length}):
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {creationGalleryImages.map((imgUrl, idx) => (
                                  <div key={idx} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-zelda-gold/50 bg-black/10 shadow-xs">
                                    <img 
                                      src={imgUrl} 
                                      alt={`Gallery asset ${idx + 1}`} 
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCreationGalleryImages(prev => prev.filter((_, i) => i !== idx));
                                        if (contentUrl === imgUrl) {
                                          setContentUrl(creationGalleryImages.find((_, i) => i !== idx) || '');
                                        }
                                      }}
                                      className="absolute top-0.5 right-0.5 bg-black/80 text-white rounded-full p-0.5 hover:bg-red-600 opacity-90 group-hover:opacity-100 transition-opacity"
                                      title="Remove from gallery"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Full Width Text Body Area with HTML Support */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-zelda-gold/10 p-2.5 rounded-xl border border-zelda-gold/30">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-zelda-gold" />
                          <label className="text-xs font-serif font-bold uppercase tracking-wider text-zelda-charcoal">
                            Creation Content Body & Lore Text
                          </label>
                          <span className="text-[10px] font-mono text-white bg-zelda-gold px-2 py-0.5 rounded font-bold uppercase shadow-xs">
                            HTML Allowed &lt;html&gt;
                          </span>
                        </div>

                        {/* Write vs Preview Toggle */}
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-zelda-border-sand shadow-xs">
                          <button
                            type="button"
                            onClick={() => setHtmlPreviewMode(false)}
                            className={`px-3 py-1 rounded text-[11px] font-serif font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                              !htmlPreviewMode ? 'bg-zelda-gold text-white shadow-xs' : 'text-zelda-charcoal/70 hover:text-zelda-charcoal'
                            }`}
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Write</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setHtmlPreviewMode(true)}
                            className={`px-3 py-1 rounded text-[11px] font-serif font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                              htmlPreviewMode ? 'bg-zelda-gold text-white shadow-xs' : 'text-zelda-charcoal/70 hover:text-zelda-charcoal'
                            }`}
                          >
                            <Eye className="w-3 h-3" />
                            <span>Live HTML Preview</span>
                          </button>
                        </div>
                      </div>

                      {!htmlPreviewMode ? (
                        <div className="space-y-2">
                          {/* HTML Formatting Quick Snippet Toolbar */}
                          <div className="flex flex-wrap items-center gap-1 bg-white p-2 rounded-xl border border-zelda-border-sand text-xs">
                            <span className="text-[10px] font-mono text-zelda-charcoal/60 uppercase mr-1 font-bold">Quick HTML:</span>
                            <button
                              type="button"
                              onClick={() => insertHtmlSnippet('<b>', '</b>')}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-zelda-charcoal font-bold rounded border border-zelda-border-sand text-[11px] cursor-pointer"
                              title="Bold text"
                            >
                              &lt;b&gt;Bold&lt;/b&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => insertHtmlSnippet('<i>', '</i>')}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-zelda-charcoal italic rounded border border-zelda-border-sand text-[11px] cursor-pointer"
                              title="Italic text"
                            >
                              &lt;i&gt;Italic&lt;/i&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => insertHtmlSnippet('<h3>', '</h3>')}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-zelda-gold font-bold rounded border border-zelda-border-sand text-[11px] cursor-pointer"
                              title="Heading 3"
                            >
                              &lt;h3&gt;Heading&lt;/h3&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => insertHtmlSnippet('<p>', '</p>')}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-zelda-charcoal rounded border border-zelda-border-sand text-[11px] cursor-pointer"
                              title="Paragraph"
                            >
                              &lt;p&gt;Paragraph&lt;/p&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => insertHtmlSnippet('<a href="https://">', '</a>')}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-zelda-gold underline rounded border border-zelda-border-sand text-[11px] cursor-pointer"
                              title="Hyperlink"
                            >
                              &lt;a&gt;Link&lt;/a&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => insertHtmlSnippet('<img src="https://" alt="Image" />')}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-zelda-charcoal rounded border border-zelda-border-sand text-[11px] cursor-pointer"
                              title="Embed image"
                            >
                              &lt;img&gt;Image&lt;/img&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => insertHtmlSnippet('<ul>\n  <li>', '</li>\n</ul>')}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-zelda-charcoal rounded border border-zelda-border-sand text-[11px] cursor-pointer"
                              title="Unordered list"
                            >
                              &lt;ul&gt;List&lt;/ul&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => insertHtmlSnippet('<blockquote>', '</blockquote>')}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-zelda-charcoal italic rounded border border-zelda-border-sand text-[11px] cursor-pointer"
                              title="Blockquote"
                            >
                              &lt;blockquote&gt;Quote&lt;/blockquote&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => insertHtmlSnippet('<mark>', '</mark>')}
                              className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-zelda-charcoal rounded border border-zelda-border-sand text-[11px] cursor-pointer"
                              title="Highlight"
                            >
                              &lt;mark&gt;Highlight&lt;/mark&gt;
                            </button>
                            <button
                              type="button"
                              onClick={() => insertHtmlSnippet('<code>', '</code>')}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-zelda-charcoal font-mono rounded border border-zelda-border-sand text-[11px] cursor-pointer"
                              title="Code snippet"
                            >
                              &lt;code&gt;Code&lt;/code&gt;
                            </button>
                          </div>

                          <textarea
                            rows={8}
                            placeholder="Write literature, theory hypotheses, fan game guide, or custom HTML formatting here..."
                            value={contentBody}
                            onChange={(e) => setContentBody(e.target.value)}
                            className="w-full bg-white border border-zelda-border-sand rounded-xl p-3.5 text-sm font-mono text-zelda-charcoal focus:outline-none focus:border-zelda-gold shadow-sm"
                          />
                        </div>
                      ) : (
                        <div className="w-full bg-[#fcf8ee] border-2 border-zelda-border-sand/80 rounded-xl p-6 min-h-[220px] shadow-inner space-y-3">
                          <div className="flex items-center justify-between border-b border-zelda-border-sand/60 pb-2">
                            <span className="text-[10px] font-mono font-bold uppercase text-zelda-gold tracking-widest">
                              Live HTML Render Preview
                            </span>
                            <span className="text-[10px] font-mono text-zelda-charcoal/60">
                              Royal Scroll Format
                            </span>
                          </div>
                          {contentBody.trim() ? (
                            <CreationContentRenderer content={contentBody} />
                          ) : (
                            <p className="text-xs text-zelda-charcoal/50 italic font-sans py-6 text-center">
                              No text or HTML code entered yet. Click "Write" above to add content.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Brief Description / Notes (Full Width) */}
                    <div>
                      <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1.5">
                        Brief Summary / Creator Notes <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Share inspiration, material details, review score, or summary..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-white border border-zelda-border-sand rounded-xl p-3 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold resize-none shadow-sm"
                      />
                    </div>

                    {/* Triforce IP Tokenizer Box */}
                    <div className="bg-white/70 border border-zelda-border-sand rounded-2xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-zelda-gold" />
                          <div>
                            <h4 className="text-xs font-serif font-bold text-zelda-charcoal uppercase tracking-wider">
                              Triforce IP Tokenizer & Digital Certificate
                            </h4>
                            <p className="text-[11px] text-zelda-charcoal/70">
                              Verify ownership in the Royal Hyrule Creator Index with Creative Commons metadata.
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={tokenize}
                          onChange={(e) => setTokenize(e.target.checked)}
                          className="w-5 h-5 accent-zelda-gold rounded cursor-pointer"
                        />
                      </div>

                      {tokenize && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-zelda-border-sand"
                        >
                          <div>
                            <label className="block text-[10px] font-serif uppercase tracking-widest text-zelda-gold mb-1">
                              Copyright License Mode
                            </label>
                            <select
                              value={copyrightLicense}
                              onChange={(e) => setCopyrightLicense(e.target.value)}
                              className="w-full bg-white border border-zelda-border-sand rounded-lg p-2 text-xs text-zelda-charcoal"
                            >
                              <option value="CC BY-NC-SA 4.0 (Attribution-NonCommercial-ShareAlike)">CC BY-NC-SA (Recommended)</option>
                              <option value="CC0 1.0 Universal (Public Domain Dedication)">CC0 1.0 (Public Domain)</option>
                              <option value="Zelda Fan-License (Non-Commercial distribution only)">Zelda Fan-License</option>
                              <option value="CC BY-ND 4.0 (Attribution-NoDerivatives)">CC BY-ND (No Derivatives)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-serif uppercase tracking-widest text-zelda-gold mb-1 flex justify-between">
                              <span>Requested Royalty Rate</span>
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
                            <p className="text-[10px] text-zelda-charcoal/60 mt-1">Royalty allocated for secondary showcases or prints.</p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {formError && (
                      <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 text-xs leading-normal flex items-center gap-2.5">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {formSuccess && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs leading-normal font-serif">
                        🛡️ Chronicle Registered! Your masterpiece has been entered in the Royal Registers.
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      <button
                        type="submit"
                        disabled={isPosting}
                        className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-zelda-gold to-yellow-600 hover:from-yellow-600 hover:to-zelda-gold disabled:bg-gray-400 text-white font-serif font-bold text-sm uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg border border-yellow-300/30 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isPosting ? 'Writing Scroll...' : 'Post Fan Creation'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCreatorSubTab('feed')}
                        className="text-xs font-serif font-bold text-zelda-charcoal/70 hover:text-zelda-gold uppercase cursor-pointer"
                      >
                        Cancel & View Feed
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}

            {/* SECTION 2: CREATIONS FEED & CATEGORIES */}
            {(creatorSubTab === 'feed' || creatorSubTab === 'all') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Section Header & Categories Bar */}
                <div className="bg-zelda-beige-card border border-zelda-border-sand rounded-2xl p-5 md:p-6 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-zelda-charcoal">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-zelda-gold" />
                      <span className="text-[10px] font-mono font-bold uppercase text-zelda-gold tracking-widest block">
                        Section 2 of Creator Club
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold tracking-wider text-zelda-charcoal uppercase">
                      Latest Fan Creations Feed
                    </h3>
                  </div>

                  {/* Categories Pills Bar */}
                  <div className="flex flex-wrap gap-1.5 bg-white/80 p-1.5 rounded-xl border border-zelda-border-sand shadow-inner w-full lg:w-auto">
                    {[
                      { id: 'all', label: 'All Masterpieces', icon: '📜' },
                      { id: 'art', label: 'Artwork', icon: '🎨' },
                      { id: 'video', label: 'Video / Music', icon: '🎥' },
                      { id: 'literature', label: 'Literature', icon: '✍️' },
                      { id: 'review', label: 'Reviews', icon: '⭐' },
                      { id: 'memorabilia', label: 'Replicas', icon: '🛡️' },
                      { id: 'fangame', label: 'Fan Games', icon: '🎮' },
                      { id: 'theory', label: 'Theories', icon: '🔮' },
                      { id: 'nft', label: 'NFTs', icon: '💎' },
                      { id: 'avatar', label: 'Avatars', icon: '👤' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSubTypeFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-serif uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                          subTypeFilter === cat.id 
                            ? 'bg-zelda-gold text-white font-bold shadow-md' 
                            : 'text-zelda-charcoal/70 hover:text-zelda-charcoal hover:bg-black/5'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submissions Feed Grid in News Entries Format */}
                {filteredSubmissions.length === 0 ? (
                  <div className="bg-white/50 border border-zelda-border-sand rounded-2xl p-12 text-center text-zelda-charcoal/70 space-y-3">
                    <Sparkles className="w-10 h-10 mx-auto text-zelda-gold/60" />
                    <h4 className="font-serif text-base font-bold uppercase">No Creations Found in this Category</h4>
                    <p className="text-xs text-zelda-charcoal/60">Be the first hero to submit a masterpiece under this classification!</p>
                    <button
                      onClick={() => setCreatorSubTab('submit')}
                      className="px-4 py-2 bg-zelda-gold text-white font-serif text-xs font-bold uppercase rounded-lg shadow cursor-pointer mt-2"
                    >
                      Post Fan Creation Now
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSubmissions.map((sub) => (
                      <div 
                        key={sub.id} 
                        id={`submission-${sub.id}`}
                        className="bg-white/80 border border-zelda-border-sand rounded-2xl overflow-hidden flex flex-col justify-between hover:border-zelda-gold transition-all duration-300 shadow-md h-full group hover:-translate-y-1"
                      >
                        <div>
                          {/* Media Header Box in News Entry Format */}
                          {sub.contentUrl && sub.type !== 'video' ? (
                            <div 
                              onClick={() => openSubmissionPage(sub.id)}
                              className="relative h-52 w-full overflow-hidden flex-shrink-0 bg-black/10 cursor-pointer"
                            >
                              <img 
                                src={sub.contentUrl} 
                                alt={sub.title} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                              
                              <span className="absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-serif font-bold uppercase tracking-wider shadow bg-zelda-gold text-white flex items-center gap-1">
                                {sub.type === 'art' && '🎨 Artwork'}
                                {sub.type === 'memorabilia' && '🛡️ Replica'}
                                {sub.type === 'fangame' && '🎮 Fan Game'}
                                {sub.type === 'theory' && '🔮 Theory'}
                                {sub.type === 'nft' && '💎 NFT'}
                                {sub.type === 'avatar' && '👤 Avatar'}
                                {sub.type === 'review' && '⭐ Review'}
                                {sub.type === 'literature' && '✍️ Literature'}
                              </span>

                              {sub.tokenized && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setActiveCertificate(sub.tokenDetails || null); }}
                                  className="absolute top-3 right-3 bg-black/80 backdrop-blur text-amber-300 border border-zelda-gold/60 px-2 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1 shadow hover:bg-black cursor-pointer z-10"
                                  title="Click to view IP Certificate"
                                >
                                  <Award className="w-3 h-3 text-zelda-gold" />
                                  <span>Tokenized IP</span>
                                </button>
                              )}

                              {sub.galleryImages && sub.galleryImages.length > 1 && (
                                <span className="absolute bottom-2.5 left-2.5 text-[10px] font-serif font-bold text-white bg-zelda-gold/90 border border-amber-300/60 px-2 py-0.5 rounded shadow flex items-center gap-1 z-10">
                                  <ImageIcon className="w-3 h-3" />
                                  <span>{sub.galleryImages.length} Photos</span>
                                </span>
                              )}

                              <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-gray-200 bg-black/75 px-2 py-0.5 rounded shadow">
                                {sub.date}
                              </span>
                            </div>
                          ) : sub.type === 'video' ? (
                            <div 
                              onClick={() => openSubmissionPage(sub.id)}
                              className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-zelda-green-forest via-[#0d1e15] to-black flex flex-col items-center justify-center p-4 border-b border-zelda-border-sand/40 text-white cursor-pointer"
                            >
                              <div className="w-12 h-12 rounded-full bg-zelda-gold/20 border border-zelda-gold flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Video className="w-6 h-6 text-zelda-gold" />
                              </div>
                              <span className="text-xs font-serif font-bold uppercase tracking-wider text-white text-center">Interactive Video / Music Cover</span>
                              {sub.contentUrl && (
                                <a 
                                  href={sub.contentUrl} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[10px] font-mono text-amber-300 mt-2 flex items-center gap-1 hover:underline bg-black/60 px-2.5 py-1 rounded border border-white/10 z-10"
                                >
                                  <span>Watch Media Link</span> <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              <span className="absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-serif font-bold uppercase tracking-wider shadow bg-zelda-gold text-white">
                                🎥 Video
                              </span>
                              <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-gray-200 bg-black/75 px-2 py-0.5 rounded shadow">
                                {sub.date}
                              </span>
                            </div>
                          ) : (
                            <div 
                              onClick={() => openSubmissionPage(sub.id)}
                              className="p-4 bg-amber-50/80 border-b border-zelda-border-sand/40 h-52 overflow-y-auto space-y-2 relative cursor-pointer"
                            >
                              <div className="flex items-center justify-between border-b border-zelda-border-sand/40 pb-2">
                                <span className="px-2.5 py-1 bg-zelda-gold text-white text-[10px] font-serif font-bold uppercase rounded shadow flex items-center gap-1">
                                  {sub.type === 'literature' && '✍️ Literature'}
                                  {sub.type === 'theory' && '🔮 Lore Theory'}
                                  {sub.type === 'review' && '⭐ Review'}
                                  {sub.type === 'fangame' && '🎮 Fan Game'}
                                  {sub.type === 'nft' && '💎 NFT'}
                                  {sub.type === 'avatar' && '👤 Avatar'}
                                  {sub.type === 'art' && '🎨 Artwork'}
                                  {sub.type === 'memorabilia' && '🛡️ Replica'}
                                </span>
                                <FileText className="w-4 h-4 text-zelda-gold" />
                              </div>
                              <div className="text-xs text-zelda-charcoal/90 font-sans leading-relaxed pt-1 line-clamp-6">
                                <CreationContentRenderer content={sub.contentBody || sub.description} />
                              </div>
                            </div>
                          )}

                          {/* Card Content Details */}
                          <div className="p-4 md:p-5 space-y-2.5">
                            <div className="flex items-center justify-between text-xs text-zelda-charcoal/70">
                              <span className="font-serif font-bold text-zelda-gold uppercase tracking-wider flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5 text-zelda-green-forest" />
                                By {sub.author}
                              </span>
                              <span className="font-mono text-[10px] text-zelda-charcoal/60">{sub.date}</span>
                            </div>

                            <h4 
                              onClick={() => openSubmissionPage(sub.id)}
                              className="font-serif text-base font-bold text-zelda-charcoal tracking-wide group-hover:text-zelda-gold transition-colors line-clamp-2 cursor-pointer"
                            >
                              {sub.title}
                            </h4>

                            <p className="text-xs text-zelda-charcoal/80 font-sans leading-relaxed line-clamp-3">
                              {sub.description}
                            </p>

                            <button
                              type="button"
                              onClick={() => openSubmissionPage(sub.id)}
                              className="w-full py-2 px-3 bg-zelda-gold/10 hover:bg-zelda-gold hover:text-white border border-zelda-gold/40 text-zelda-charcoal text-xs font-serif font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs mt-1"
                            >
                              <span>View Creation Page</span>
                              <ChevronRight className="w-4 h-4 text-zelda-gold group-hover:text-white" />
                            </button>
                          </div>
                        </div>

                        {/* Card Footer Actions in News Style */}
                        <div className="p-4 pt-0 border-t border-zelda-border-sand/40 mt-auto space-y-3">
                          <div className="flex items-center justify-between pt-3">
                            <button
                              onClick={() => handleLike(sub.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-rose-50 text-zelda-charcoal hover:text-rose-600 border border-zelda-border-sand hover:border-rose-400 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer shadow-sm"
                            >
                              <Heart className="w-3.5 h-3.5 fill-current text-rose-600" />
                              <span>{sub.likes || 0} Courage</span>
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setExpandedComments(prev => ({ ...prev, [sub.id]: !prev[sub.id] }))}
                                className="px-2.5 py-1.5 bg-white hover:bg-zelda-beige-card border border-zelda-border-sand hover:border-zelda-gold rounded-lg text-xs font-serif font-bold text-zelda-charcoal hover:text-zelda-gold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                                title="Alliance Discussions"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Discussions</span>
                              </button>

                              <button
                                onClick={() => handleShare('submissions', sub.id, sub.title)}
                                className="p-1.5 bg-white hover:bg-zelda-beige-card border border-zelda-border-sand hover:border-zelda-gold rounded-lg text-zelda-charcoal hover:text-zelda-gold transition-all flex items-center justify-center relative cursor-pointer shadow-sm"
                                title="Share Masterpiece"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                {shareNotification?.id === sub.id && (
                                  <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-[9px] rounded py-1 px-2 whitespace-nowrap z-10 font-sans shadow-md">
                                    {shareNotification.message}
                                  </span>
                                )}
                              </button>
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
                )}
              </motion.div>
            )}
              </>
            )}
          </motion.div>
        )}

        {/* TAB 4: AI GAME GUIDE */}
        {activeTab === 'guide' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6 flex flex-col items-center justify-center py-4"
          >
            {/* Success toast notification */}
            {guideSaveSuccess && (
              <div className="bg-emerald-900/90 text-emerald-100 border border-emerald-500 rounded-xl px-5 py-3 shadow-lg flex items-center gap-3 text-sm font-serif animate-bounce">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>AI Game Guide page configuration updated successfully!</span>
              </div>
            )}

            <div className="bg-zelda-beige-card border-2 border-zelda-gold rounded-2xl p-6 md:p-8 shadow-xl w-full max-w-4xl flex flex-col items-center justify-center text-center space-y-6">
              
              {/* Header with Title, Subtitle, and Edit Toggle */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zelda-border-sand pb-4 w-full">
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2.5 bg-zelda-gold/15 rounded-xl border border-zelda-gold/30 text-zelda-gold">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif font-extrabold text-zelda-charcoal uppercase tracking-wide">
                      {guideTitle}
                    </h2>
                    {guideSubtitle && (
                      <p className="text-xs md:text-sm text-zelda-charcoal/70 font-serif mt-0.5">
                        {guideSubtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Edit Page Button */}
                <button
                  onClick={() => setIsEditingGuide(!isEditingGuide)}
                  className={`px-4 py-2 rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isEditingGuide
                      ? 'bg-zelda-charcoal text-white hover:bg-black'
                      : 'bg-zelda-gold hover:bg-yellow-600 text-white'
                  }`}
                >
                  {isEditingGuide ? (
                    <>
                      <X className="w-3.5 h-3.5" /> Close Editor
                    </>
                  ) : (
                    <>
                      <Edit className="w-3.5 h-3.5" /> Edit Page
                    </>
                  )}
                </button>
              </div>

              {/* EDIT MODE FORM */}
              {isEditingGuide && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleSaveGuideSettings}
                  className="w-full text-left bg-white/80 border-2 border-zelda-gold/60 rounded-xl p-5 md:p-6 space-y-5 shadow-inner"
                >
                  <div className="flex items-center justify-between border-b border-zelda-border-sand pb-2">
                    <h3 className="text-sm font-serif font-bold text-zelda-charcoal uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-zelda-gold" />
                      Edit Page Configuration
                    </h3>
                    <span className="text-[10px] font-mono uppercase bg-zelda-gold/20 text-zelda-gold font-bold px-2.5 py-0.5 rounded-md">
                      Live Editor
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1 font-bold">
                        Page Title
                      </label>
                      <input 
                        type="text"
                        value={guideTitle}
                        onChange={(e) => setGuideTitle(e.target.value)}
                        placeholder="e.g., AI Game Guide"
                        className="w-full bg-white border border-zelda-border-sand rounded-lg px-3 py-2 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1 font-bold">
                        Frame Max Width
                      </label>
                      <select 
                        value={guideIframeMaxWidth}
                        onChange={(e) => setGuideIframeMaxWidth(e.target.value)}
                        className="w-full bg-white border border-zelda-border-sand rounded-lg px-3 py-2 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
                      >
                        <option value="500px">Compact (500px)</option>
                        <option value="650px">Medium (650px)</option>
                        <option value="800px">Wide (800px)</option>
                        <option value="100%">Full Width (100%)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1 font-bold">
                      Page Subtitle / Description
                    </label>
                    <input 
                      type="text"
                      value={guideSubtitle}
                      onChange={(e) => setGuideSubtitle(e.target.value)}
                      placeholder="e.g., Interactive Legend of Zelda walkthrough and guide assistant."
                      className="w-full bg-white border border-zelda-border-sand rounded-lg px-3 py-2 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1 font-bold">
                      Embedded Guide URL (iframe src)
                    </label>
                    <input 
                      type="url"
                      value={guideIframeUrl}
                      onChange={(e) => setGuideIframeUrl(e.target.value)}
                      placeholder="https://loz.base44.app/embed/guide"
                      className="w-full bg-white border border-zelda-border-sand rounded-lg px-3 py-2 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold font-mono text-xs"
                      required
                    />
                    
                    {/* Quick Preset buttons */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[10px] uppercase font-serif text-zelda-charcoal/60 font-bold">Presets:</span>
                      <button
                        type="button"
                        onClick={() => setGuideIframeUrl('https://loz.base44.app/embed/guide')}
                        className="text-[11px] bg-zelda-beige-card hover:bg-zelda-border-sand border border-zelda-border-sand px-2.5 py-1 rounded text-zelda-charcoal font-serif transition-colors"
                      >
                        Hyrule Hub Guide
                      </button>
                      <button
                        type="button"
                        onClick={() => setGuideIframeUrl('https://www.zeldadungeon.net/breath-of-the-wild-interactive-map/')}
                        className="text-[11px] bg-zelda-beige-card hover:bg-zelda-border-sand border border-zelda-border-sand px-2.5 py-1 rounded text-zelda-charcoal font-serif transition-colors"
                      >
                        Interactive Zelda Map
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1 font-bold">
                        Frame Height (px)
                      </label>
                      <input 
                        type="number"
                        min="300"
                        max="1400"
                        value={guideIframeHeight}
                        onChange={(e) => setGuideIframeHeight(Number(e.target.value))}
                        className="w-full bg-white border border-zelda-border-sand rounded-lg px-3 py-2 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1 font-bold">
                        Frame Border Style
                      </label>
                      <select 
                        value={guideIframeBorder}
                        onChange={(e) => setGuideIframeBorder(e.target.value)}
                        className="w-full bg-white border border-zelda-border-sand rounded-lg px-3 py-2 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
                      >
                        <option value="4px solid #2B1B17">Thick Dark Wood (4px solid #2B1B17)</option>
                        <option value="3px solid #B8860B">Hyrule Gold (3px solid #B8860B)</option>
                        <option value="2px dashed #B8860B">Dashed Gold (2px dashed #B8860B)</option>
                        <option value="1px solid #D4C3A3">Sand Border (1px solid #D4C3A3)</option>
                        <option value="none">No Border</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1 font-bold">
                      Custom Page Notes / Additional Information (Optional)
                    </label>
                    <textarea 
                      rows={2}
                      value={guideCustomContent}
                      onChange={(e) => setGuideCustomContent(e.target.value)}
                      placeholder="Add custom tips, notes, or instructions for visitors here..."
                      className="w-full bg-white border border-zelda-border-sand rounded-lg p-2.5 text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-zelda-border-sand">
                    <button
                      type="button"
                      onClick={() => setIsEditingGuide(false)}
                      className="px-4 py-2 border border-zelda-border-sand hover:bg-zelda-beige-card rounded-lg text-xs font-serif uppercase tracking-wider text-zelda-charcoal transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={guideSaving}
                      className="px-5 py-2 bg-zelda-gold hover:bg-yellow-600 disabled:opacity-50 text-white rounded-lg text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      {guideSaving ? (
                        <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Save Page Changes
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Custom Page Notes if set */}
              {guideCustomContent && (
                <div className="w-full bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-left text-xs md:text-sm text-amber-950 font-serif leading-relaxed">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block mb-1">
                    Adventurer's Note
                  </span>
                  {guideCustomContent}
                </div>
              )}

              {/* Embedded Frame View */}
              <div className="w-full flex justify-center pt-2">
                <iframe 
                  src={guideIframeUrl} 
                  width="100%" 
                  height={guideIframeHeight} 
                  frameBorder="0" 
                  style={{ border: guideIframeBorder, maxWidth: guideIframeMaxWidth }} 
                  title={guideTitle}
                />
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB: FAN PORTAL */}
        {activeTab === 'portal' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <FanPortalSection 
              submissions={submissions}
              onNavigateToTab={setActiveTab}
              onOpenSubmission={openSubmissionPage}
            />
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

            {/* AWS & MongoDB Integration Status Banner */}
            <div className="bg-gradient-to-r from-amber-950/10 via-amber-900/5 to-slate-900/10 border border-amber-500/30 rounded-xl p-4 text-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-lg border border-amber-500/20 font-bold text-base flex items-center gap-1">
                    ☁️ 🍃
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2 flex-wrap">
                      Cloud Persistence: Vercel, AWS & MongoDB Atlas
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-sans font-semibold border border-emerald-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                      </span>
                      <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded-md font-mono border border-emerald-700">
                        Atlas Cluster: {awsStatusInfo?.mongoAtlas?.clusterName || 'atlas-bole-candle'}
                      </span>
                    </h4>
                    <p className="text-gray-600 text-[11px] mt-0.5">
                      Platform: <span className="font-semibold text-emerald-900">Vercel Serverless</span> &bull; Storage: <span className="font-semibold text-amber-900">AWS DynamoDB</span> ({awsStatusInfo?.newsTable || 'ZeldaNews'}, {awsStatusInfo?.submissionsTable || 'ZeldaSubmissions'}) &bull; <span className="font-semibold text-amber-900">AWS S3</span> ({awsStatusInfo?.s3Bucket || 'Active'}) &bull; 
                      <span className="font-semibold text-emerald-800 ml-1">MongoDB Atlas:</span> <span className="font-mono text-emerald-900 font-bold">{awsStatusInfo?.mongoAtlas?.clusterName || 'atlas-bole-candle'}</span> ({awsStatusInfo?.mongoAtlas?.dbName || 'zelda_db'})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <div className="bg-white/90 border border-amber-200 px-3 py-1.5 rounded-md text-gray-600">
                    AWS Region: <span className="font-bold text-amber-900">{awsStatusInfo?.region || 'us-west-2'}</span>
                    {awsStatusInfo?.rawRegion && awsStatusInfo.rawRegion !== awsStatusInfo.region && (
                      <span className="text-[10px] text-gray-400 ml-1">({awsStatusInfo.rawRegion})</span>
                    )}
                  </div>
                </div>
              </div>

              {/* AWS IAM Permission Diagnostic Alert if AccessDenied occurs */}
              {awsStatusInfo?.lastError && (
                <div className="bg-amber-50/90 border border-amber-300 rounded-lg p-3 text-[11px] text-amber-900 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 text-sm font-bold">⚠️</span>
                    <div>
                      <span className="font-bold text-amber-950">AWS IAM Permission Advisory:</span> {awsStatusInfo.lastError.message}
                      <p className="text-[10px] text-amber-800/80 mt-0.5">
                        The AWS connection is active. (MongoDB Atlas cluster <code className="font-mono bg-amber-100 px-1 rounded">{awsStatusInfo?.mongoAtlas?.clusterName || 'atlas-bole-candle'}</code> is also ready).
                      </p>
                    </div>
                  </div>
                  <details className="text-[10px] bg-amber-100/60 rounded border border-amber-200 p-2">
                    <summary className="font-mono font-semibold cursor-pointer text-amber-900 hover:underline">
                      📋 View Recommended AWS IAM Policy JSON
                    </summary>
                    <pre className="mt-2 bg-slate-900 text-amber-300 p-2.5 rounded font-mono text-[10px] overflow-x-auto leading-relaxed">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:UpdateItem"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::*/*"
    }
  ]
}`}
                    </pre>
                  </details>
                </div>
              )}
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
              <button
                onClick={() => setAdminTab('rss-generator')}
                className={`px-5 py-2.5 rounded-t-lg font-serif text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer border-t border-x ${
                  adminTab === 'rss-generator'
                    ? 'bg-white border-zelda-border-sand text-zelda-gold font-bold shadow-sm'
                    : 'bg-black/10 border-transparent text-zelda-charcoal/60 hover:text-zelda-charcoal'
                }`}
              >
                📡 Real-Time RSS News Generator (SEO & E-E-A-T)
              </button>
              <button
                onClick={() => setAdminTab('roles')}
                className={`px-5 py-2.5 rounded-t-lg font-serif text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer border-t border-x ${
                  adminTab === 'roles'
                    ? 'bg-white border-zelda-border-sand text-zelda-gold font-bold shadow-sm'
                    : 'bg-black/10 border-transparent text-zelda-charcoal/60 hover:text-zelda-charcoal'
                }`}
              >
                👥 Roles & Permissions
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
                          <option value="movie-tracker">🎥 Live Action Movie Widget</option>
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

            {/* ADMIN SUB-TAB 5: REAL-TIME RSS NEWS GENERATOR */}
            {adminTab === 'rss-generator' && (
              <RssNewsGeneratorSection onPublishNews={handlePublishGeneratedNews} />
            )}

            {/* ADMIN SUB-TAB 6: USER ROLES & PERMISSIONS */}
            {adminTab === 'roles' && (
              <UserRolesManager currentAdminEmail={user?.email} />
            )}
          </motion.div>
        )}

        {/* FOOTER PAGES: ABOUT, CONTACT, PRIVACY, SITEMAP STANDALONE PAGE VIEWS */}
        {['about', 'contact', 'privacy', 'sitemap'].includes(activeTab) && (
          <FooterPageViews
            activeTab={activeTab as FooterPageType}
            onNavigateTab={(tab, subTab) => {
              setActiveTab(tab);
              if (subTab) setCreatorSubTab(subTab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateFooter={(page) => {
              setActiveTab(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleLogin}
          />
        )}

      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-zelda-green-forest border-t-4 border-zelda-gold py-12 px-4 text-center text-xs text-white">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Footer Navigation Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-10 gap-y-3 pb-6 border-b border-white/15">
            <button
              onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`font-serif font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5 py-1.5 px-3 rounded-lg ${
                activeTab === 'about' ? 'text-zelda-gold bg-white/15 border border-zelda-gold/50' : 'text-[#EAE2CF] hover:text-zelda-gold hover:bg-white/5'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-zelda-gold" />
              <span>About Us</span>
            </button>
            <span className="text-zelda-gold/40 hidden sm:inline">&bull;</span>
            <button
              onClick={() => { setActiveTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`font-serif font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5 py-1.5 px-3 rounded-lg ${
                activeTab === 'contact' ? 'text-zelda-gold bg-white/15 border border-zelda-gold/50' : 'text-[#EAE2CF] hover:text-zelda-gold hover:bg-white/5'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-zelda-gold" />
              <span>Contact Us</span>
            </button>
            <span className="text-zelda-gold/40 hidden sm:inline">&bull;</span>
            <button
              onClick={() => { setActiveTab('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`font-serif font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5 py-1.5 px-3 rounded-lg ${
                activeTab === 'privacy' ? 'text-zelda-gold bg-white/15 border border-zelda-gold/50' : 'text-[#EAE2CF] hover:text-zelda-gold hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-zelda-gold" />
              <span>Privacy Policy</span>
            </button>
            <span className="text-zelda-gold/40 hidden sm:inline">&bull;</span>
            <button
              onClick={() => { setActiveTab('sitemap'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`font-serif font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5 py-1.5 px-3 rounded-lg ${
                activeTab === 'sitemap' ? 'text-zelda-gold bg-white/15 border border-zelda-gold/50' : 'text-[#EAE2CF] hover:text-zelda-gold hover:bg-white/5'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-zelda-gold" />
              <span>Site Map</span>
            </button>
          </div>

          <div className="pt-2">
            <div className="flex justify-center gap-1 text-zelda-gold mb-4">
              <span>▲</span>
              <span>▲</span>
              <span>▲</span>
            </div>
            <p className="font-serif uppercase tracking-widest text-[#EAE2CF] text-[10px] font-bold">
              Hyrule Fan Alliance &bull; Non-Profit Interactive Tribute
            </p>
            <p className="max-w-2xl mx-auto leading-relaxed text-gray-300 mt-2 text-[11px]">
              The Legend of Zelda, Link, Zelda, Triforce, and all associated locations, items, and logos are registered trademarks of Nintendo Co., Ltd. This platform operates under non-commercial, copyright-friendly fair use criteria to foster community creations, educational study of narrative structure, and accessibility assistance.
            </p>
            <div className="mt-4 text-[10px] text-gray-400 font-mono">
              &copy; 2026 Hyrule Fan Alliance &bull; All Rights Reserved
            </div>
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
