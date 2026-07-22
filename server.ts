/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { NewsItem, LoreEntry, UserSubmission, TokenDetails, SidebarBlock } from './src/types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parser with sufficient limit for base64 screenshots
app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client as requested in safety guidelines
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required. Please add it via the Secrets panel in AI Studio.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Robust retry and fallback content generation function to handle 503 errors and rate limits
async function generateContentWithRetry(ai: GoogleGenAI, params: any, retries = 3, initialDelay = 1500): Promise<any> {
  let lastError: any = null;
  let delay = initialDelay;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: any) {
      lastError = error;
      const errMsg = error?.message || String(error);
      console.warn(`Attempt ${i + 1} with ${params.model} failed:`, errMsg);
      
      const isDepleted = 
        error?.status === 429 || 
        error?.statusCode === 429 || 
        error?.code === 429 ||
        errMsg.includes('429') || 
        errMsg.includes('RESOURCE_EXHAUSTED') || 
        errMsg.includes('depleted') || 
        errMsg.includes('quota');

      if (isDepleted) {
        // Stop retrying immediately on quota or prepayment credit exhaustion
        break;
      }

      const is503OrUnavailable = 
        error?.status === 503 || 
        error?.statusCode === 503 || 
        error?.code === 503 ||
        errMsg.includes('503') || 
        errMsg.includes('UNAVAILABLE') || 
        errMsg.includes('high demand');
      
      if (is503OrUnavailable && i < retries - 1) {
        console.log(`Gemini is experiencing transient issues or high demand. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5;
        continue;
      }
      break;
    }
  }

  // Fallback to gemini-3.1-flash-lite if the primary model failed due to a transient issue
  if (params.model === 'gemini-3.5-flash') {
    const lastErrMsg = lastError?.message || String(lastError);
    const isDepleted = 
      lastError?.status === 429 || 
      lastError?.statusCode === 429 || 
      lastError?.code === 429 ||
      lastErrMsg.includes('429') || 
      lastErrMsg.includes('RESOURCE_EXHAUSTED') || 
      lastErrMsg.includes('depleted') || 
      lastErrMsg.includes('quota');

    if (!isDepleted) {
      console.log('Falling back to gemini-3.1-flash-lite due to transient error on gemini-3.5-flash...');
      const fallbackParams = { ...params, model: 'gemini-3.1-flash-lite' };
      try {
        return await ai.models.generateContent(fallbackParams);
      } catch (fallbackError: any) {
        console.error('Fallback model gemini-3.1-flash-lite also failed:', fallbackError?.message || fallbackError);
        throw lastError || fallbackError;
      }
    }
  }

  throw lastError;
}

// Fallback guide generator when API credits/quota are exhausted or offline
function generateFallbackSageGuide(game: string, prompt: string) {
  const cleanPrompt = prompt.trim();
  const gameTitle = game || 'The Legend of Zelda';
  
  let items: Array<{ id: string; item: string; location: string; obtained: boolean }> = [];
  
  if (gameTitle.includes('Ocarina of Time')) {
    items = [
      { id: 'i1', item: 'Master Sword', location: 'Temple of Time Pedestal', obtained: true },
      { id: 'i2', item: 'Hookshot / Longshot', location: 'Dampe\'s Grave / Water Temple', obtained: false },
      { id: 'i3', item: 'Lens of Truth', location: 'Bottom of the Well (Kakariko)', obtained: false },
      { id: 'i4', item: 'Small Dungeon Keys', location: 'Locked Chambers & Defeated Stalfos', obtained: false },
      { id: 'i5', item: 'Bottled Fairy', location: 'Great Fairy Fountain / Graveyard', obtained: false },
    ];
  } else if (gameTitle.includes('Breath of the Wild') || gameTitle.includes('Tears of the Kingdom')) {
    items = [
      { id: 'i1', item: 'Master Sword / Fuse Weapon', location: 'Korok Forest / Dragon Head', obtained: true },
      { id: 'i2', item: 'Sheikah Slate / Purah Pad Runes', location: 'Great Plateau / Lookout Landing', obtained: true },
      { id: 'i3', item: 'Stamina Elixir (x3)', location: 'Cooked with Restless Beetles & Monster Parts', obtained: false },
      { id: 'i4', item: 'Flamebreaker / Snowquill Armor', location: 'Goron City / Rito Village Shop', obtained: false },
      { id: 'i5', item: 'Hearty Radish Skewer (Full Recovery)', location: 'Faron Woods / Sky Islands', obtained: false },
    ];
  } else if (gameTitle.includes('Twilight Princess')) {
    items = [
      { id: 'i1', item: 'Ordon Sword / Master Sword', location: 'Sacred Grove Pedestal', obtained: true },
      { id: 'i2', item: 'Clawshot / Double Clawshot', location: 'Lakebed Temple / City in the Sky', obtained: false },
      { id: 'i3', item: 'Gale Boomerang', location: 'Forest Temple (Defeat Ook)', obtained: false },
      { id: 'i4', item: 'Iron Boots', location: 'Mayor Bo in Ordon Village', obtained: false },
    ];
  } else {
    items = [
      { id: 'i1', item: 'Hero\'s Sword / Shield', location: 'Starting Village / Hyrule Castle', obtained: true },
      { id: 'i2', item: 'Dungeon Compass & Map', location: 'First Floor Treasure Chests', obtained: false },
      { id: 'i3', item: 'Boomerang / Bow & Arrows', location: 'Side Chamber Mini-Boss', obtained: false },
      { id: 'i4', item: 'Boss Key (Big Key)', location: 'Central Puzzle Chamber', obtained: false },
      { id: 'i5', item: 'Red Potion / Fairy', location: 'Hyrule Town Shop / Fairy Fountain', obtained: false },
    ];
  }

  return {
    title: `Royal Archive Walkthrough: ${gameTitle}`,
    walkthrough: `### 📜 Sages' Wisdom for: "${cleanPrompt}"\n\n*The Royal Archives retain ancient wisdom from the Sages of Hyrule to guide your path in **${gameTitle}**:*\n\n1. **Inspect Your Environment**: Look for cracked walls, hidden switches, torch pillars, or magnetic metal objects near your location.\n2. **Equip Essential Tools**: Ensure you have equipped your main dungeon item (**Hookshot**, **Bombs**, **Bow**, or **Sheikah Runes/Ultrahand**) to trigger distant targets or lift heavy barriers.\n3. **Solve Room Mechanisms**: In **${gameTitle}**, if doors remain barred, defeat all enemies in the chamber or ignite all unlit torches using Fire Arrows or Deku Sticks.\n4. **Map & Compass Navigation**: Open your dungeon map. Rooms marked with a small key icon indicate uncollected keys needed to reach the Boss Room.`,
    bossStrategies: `### ⚔️ Combat Strategy & Enemy Weak Points\n\n- **Expose the Weak Point**: Most bosses and mini-bosses in **${gameTitle}** reveal a glowing eye, crystal core, or exposed tail right before executing a heavy attack. Use your ranged weapon or shield parry to interrupt them.\n- **Stun & Strike**: Once the boss is stunned and collapses, rush in with your **Master Sword** and execute a Jump Slash or Spin Attack for maximum damage.\n- **Defensive Care**: Keep your shield raised at all times and maintain distance when the boss enters its enraged second phase. Keep a Bottled Fairy ready!`,
    itemsChecklist: items,
  };
}

// In-Memory Database
const newsDatabase: NewsItem[] = [
  {
    id: 'n1',
    title: 'Legend of Zelda Live-Action Movie: Wes Ball Targets "Live-Action Miyazaki" Vibe',
    summary: 'Director Wes Ball shares exciting updates about the upcoming live-action Zelda film, revealing plans to create a grounded, whimsical adventure inspired by Studio Ghibli.',
    content: `<p>Exciting news has emerged from the development of the upcoming live-action <strong>Legend of Zelda</strong> film. In a recent interview, director <strong>Wes Ball</strong> (known for the <em>Maze Runner</em> trilogy and <em>Kingdom of the Planet of the Apes</em>) discussed his ambitious vision for Hyrule's cinematic debut.</p><h3>The Miyazaki Aesthetic</h3><p>Ball expressed his deep reverence for the franchise, stating that he does not want the movie to feel like a generic <em>Lord of the Rings</em> clone. Instead, he is aiming for a <em>"live-action Miyazaki"</em> aesthetic—a world filled with wonder, rich history, beautiful landscapes, and a serious but whimsical heart.</p><blockquote>"It's going to be awesome. My whole life has led to this moment. I love this franchise. We are working hard to make something truly special for fans and newcomers alike." — Wes Ball</blockquote><h3>Key Production Details</h3><ul><li><strong>Co-Producers:</strong> Shigeru Miyamoto and Avi Arad</li><li><strong>Production Studio:</strong> Nintendo & Sony Pictures Entertainment</li><li><strong>Cinematic Focus:</strong> Physical environments with magical Studio Ghibli-inspired atmosphere</li></ul>`,
    date: '2026-07-15',
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'n2',
    title: 'Casting Rumors Swirl: Who Will Play Link, Zelda, and Ganondorf?',
    summary: 'Hollywood insiders drop potential names for the legendary trio in the upcoming live-action movie. Fans debate physical traits and acting pedigree.',
    content: `<p>As pre-production ramps up for the <strong>Legend of Zelda</strong> live-action adaptation, casting rumors are spreading like wildfire across Hyrule fan communities.</p><h3>The Hero & The Princess</h3><p>Insiders suggest that Nintendo and Sony are searching for an athletic, expressive, relatively fresh face to portray the silent hero <strong>Link</strong>, prioritizing non-verbal physical acting.</p><p>For <strong>Princess Zelda</strong>, names like <em>Saoirse Ronan</em> and <em>Hunter Schafer</em> are frequently discussed in fan-casting circles, with producers reportedly looking for someone who can balance royal grace with active, scientific curiosity.</p><h3>The Demon King</h3><p>As for the menacing <strong>Ganondorf</strong>, fans are clamoring for towering actors with dramatic intensity, with <em>Idris Elba</em> and <em>Jason Momoa</em> leading fan expectations. Wes Ball has hinted that the cast will feature a blend of established talent and exciting newcomers.</p>`,
    date: '2026-07-01',
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'n3',
    title: 'Zelda Symphonic Concert "Echoes of Hyrule" Announces 2026 Tour Dates',
    summary: 'A legendary concert tour featuring live orchestral arrangements of Koji Kondo\'s historic Zelda themes will tour major global arenas later this year.',
    content: `<p>Nintendo has officially announced <strong>"Echoes of Hyrule: The Legend of Zelda Concert Series"</strong> for late 2026.</p><p>The global tour will feature a <strong>90-piece symphony orchestra</strong> performing spectacular arrangements spanning the entire 40-year history of the series, created under the guidance of legendary composer Koji Kondo.</p><h3>Featured Games & Experiences</h3><ul><li>Breathtaking suites from <em>Ocarina of Time</em>, <em>Wind Waker</em>, <em>Breath of the Wild</em>, and <em>Tears of the Kingdom</em></li><li>High-definition gameplay footage projected onto a massive arena screen</li><li>Special VIP packages including replica Ocarina and collectible concert programs</li></ul>`,
    date: '2026-07-18',
    category: 'game',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'n4',
    title: 'Community Spotlight: Fan-Made "Zelda Maker" Level Editor Gains Traction',
    summary: 'An incredibly detailed, non-profit fan project allows players to design their own 2D classic Zelda dungeons and share them with the club.',
    content: `<p>The Zelda fan community has done it again! A group of dedicated developers has released an alpha build of a non-commercial, copyright-friendly level editor inspired by classic 8-bit and 16-bit Zelda games, dubbed <strong>"Hyrule Builder"</strong>.</p><p>The engine allows users to place blocks, trigger switches, arrange puzzles, and customize custom dungeon bosses. Over <strong>5,000 fan dungeons</strong> have already been uploaded by creative players in the first 48 hours.</p>`,
    date: '2026-07-12',
    category: 'community',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'
    ]
  },
];

const loreDatabase: LoreEntry[] = [
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
  },
];

const submissionsDatabase: UserSubmission[] = [
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
];

const sidebarDatabase: SidebarBlock[] = [
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
  <p>Active Towers: 15 / 15</p>
  <p className="text-emerald-400 font-bold mt-1">● ALL SYSTEMS OPERATIONAL</p>
</div>`,
    order: 2
  }
];

// API Routes

// Sidebar Blocks Routes
app.get('/api/sidebarBlocks', (req, res) => {
  res.json(sidebarDatabase.sort((a, b) => a.order - b.order));
});

app.post('/api/sidebarBlocks', (req, res) => {
  const { id, title, type, content, linkUrl, order } = req.body;
  if (!title || !type || !content) {
    return res.status(400).json({ error: 'Missing required fields for sidebar block' });
  }
  const newBlock: SidebarBlock = {
    id: id || `sb_${Date.now()}`,
    title,
    type,
    content,
    linkUrl: linkUrl || undefined,
    order: Number(order) || 0,
  };
  const index = sidebarDatabase.findIndex(b => b.id === newBlock.id);
  if (index >= 0) {
    sidebarDatabase[index] = newBlock;
  } else {
    sidebarDatabase.push(newBlock);
  }
  res.json(newBlock);
});

app.put('/api/sidebarBlocks/:id', (req, res) => {
  const { id } = req.params;
  const { title, type, content, linkUrl, order } = req.body;
  const index = sidebarDatabase.findIndex(b => b.id === id);
  const updatedBlock: SidebarBlock = {
    id,
    title: title || (index >= 0 ? sidebarDatabase[index].title : 'Untitled Block'),
    type: type || (index >= 0 ? sidebarDatabase[index].type : 'text'),
    content: content || (index >= 0 ? sidebarDatabase[index].content : ''),
    linkUrl: linkUrl !== undefined ? linkUrl : (index >= 0 ? sidebarDatabase[index].linkUrl : undefined),
    order: Number(order) ?? (index >= 0 ? sidebarDatabase[index].order : 0),
  };

  if (index >= 0) {
    sidebarDatabase[index] = updatedBlock;
  } else {
    sidebarDatabase.push(updatedBlock);
  }
  res.json(updatedBlock);
});

app.delete('/api/sidebarBlocks/:id', (req, res) => {
  const { id } = req.params;
  const index = sidebarDatabase.findIndex(b => b.id === id);
  if (index >= 0) {
    sidebarDatabase.splice(index, 1);
  }
  res.json({ success: true, id });
});

// Get all News
app.get('/api/news', (req, res) => {
  res.json(newsDatabase);
});

// Create News Item (Admin)
app.post('/api/news', (req, res) => {
  const { title, summary, content, category, imageUrl, galleryImages } = req.body;
  if (!title || !summary || !content || !category || !imageUrl) {
    return res.status(400).json({ error: 'Missing required fields for news' });
  }
  const newItem: NewsItem = {
    id: `n${newsDatabase.length + 1}_${Date.now()}`,
    title,
    summary,
    content,
    date: new Date().toISOString().split('T')[0],
    category,
    imageUrl,
    galleryImages: Array.isArray(galleryImages) ? galleryImages : [imageUrl]
  };
  newsDatabase.unshift(newItem);
  res.status(201).json(newItem);
});

// Edit News Item (Admin)
app.put('/api/news/:id', (req, res) => {
  const { id } = req.params;
  const { title, summary, content, category, imageUrl, galleryImages, date } = req.body;
  const index = newsDatabase.findIndex(n => n.id === id);
  if (index === -1) {
    // If not found in memory but editing, try to create or return error
    return res.status(404).json({ error: 'News item not found in memory database' });
  }
  
  newsDatabase[index] = {
    ...newsDatabase[index],
    title: title ?? newsDatabase[index].title,
    summary: summary ?? newsDatabase[index].summary,
    content: content ?? newsDatabase[index].content,
    category: category ?? newsDatabase[index].category,
    imageUrl: imageUrl ?? newsDatabase[index].imageUrl,
    galleryImages: Array.isArray(galleryImages) ? galleryImages : newsDatabase[index].galleryImages,
    date: date ?? newsDatabase[index].date,
  };
  res.json(newsDatabase[index]);
});

// Delete News Item (Admin)
app.delete('/api/news/:id', (req, res) => {
  const { id } = req.params;
  const index = newsDatabase.findIndex(n => n.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'News item not found in memory database' });
  }
  const deleted = newsDatabase.splice(index, 1);
  res.json({ success: true, deleted: deleted[0] });
});

// Get all Lore
app.get('/api/lore', (req, res) => {
  res.json(loreDatabase);
});

// Create Lore Entry (Admin)
app.post('/api/lore', (req, res) => {
  const { title, game, category, description, imageUrl } = req.body;
  if (!title || !game || !category || !description || !imageUrl) {
    return res.status(400).json({ error: 'Missing required fields for lore' });
  }
  const newEntry: LoreEntry = {
    id: `l${loreDatabase.length + 1}_${Date.now()}`,
    title,
    game,
    category,
    description,
    imageUrl
  };
  loreDatabase.unshift(newEntry);
  res.status(201).json(newEntry);
});

// Edit Lore Entry (Admin)
app.put('/api/lore/:id', (req, res) => {
  const { id } = req.params;
  const { title, game, category, description, imageUrl } = req.body;
  const index = loreDatabase.findIndex(l => l.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Lore entry not found in memory database' });
  }
  
  loreDatabase[index] = {
    ...loreDatabase[index],
    title: title ?? loreDatabase[index].title,
    game: game ?? loreDatabase[index].game,
    category: category ?? loreDatabase[index].category,
    description: description ?? loreDatabase[index].description,
    imageUrl: imageUrl ?? loreDatabase[index].imageUrl,
  };
  res.json(loreDatabase[index]);
});

// Delete Lore Entry (Admin)
app.delete('/api/lore/:id', (req, res) => {
  const { id } = req.params;
  const index = loreDatabase.findIndex(l => l.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Lore entry not found in memory database' });
  }
  const deleted = loreDatabase.splice(index, 1);
  res.json({ success: true, deleted: deleted[0] });
});

// Get User Submissions
app.get('/api/submissions', (req, res) => {
  res.json(submissionsDatabase);
});

// Delete User Submission (Admin Moderation)
app.delete('/api/submissions/:id', (req, res) => {
  const { id } = req.params;
  const index = submissionsDatabase.findIndex(s => s.id === id);
  if (index === -1) {
    // If not found in memory, still return ok to allow client handling
    return res.status(204).json({ message: 'Submission already removed from memory' });
  }
  const deleted = submissionsDatabase.splice(index, 1);
  res.json({ success: true, deleted: deleted[0] });
});

// Create User Submission
app.post('/api/submissions', (req, res) => {
  const { author, title, type, contentUrl, contentBody, description, tokenize, copyrightLicense, royaltiesPercentage } = req.body;

  if (!author || !title || !type || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const id = `s${submissionsDatabase.length + 1}`;
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
      ownerAddress: `0xFanClubMember_${author.replace(/\s+/g, '')}_Address`,
    };
  }

  const newSubmission: UserSubmission = {
    id,
    author,
    title,
    type,
    contentUrl,
    contentBody,
    description,
    date: now.split('T')[0],
    tokenized: !!tokenize,
    tokenDetails,
    likes: 0,
  };

  submissionsDatabase.unshift(newSubmission);
  res.status(201).json(newSubmission);
});

// Tokenize an existing submission
app.post('/api/submissions/:id/tokenize', (req, res) => {
  const { id } = req.params;
  const { copyrightLicense, royaltiesPercentage } = req.body;

  const submission = submissionsDatabase.find((s) => s.id === id);
  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  if (submission.tokenized) {
    return res.status(400).json({ error: 'Submission is already tokenized' });
  }

  const now = new Date().toISOString();
  submission.tokenized = true;
  submission.tokenDetails = {
    tokenId: `#ZELDA-${Math.floor(1000 + Math.random() * 9000)}`,
    contractAddress: '0xTriforce8c4d613ff9ad4da788f57c12f1ace009',
    transactionHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    copyrightLicense: copyrightLicense || 'CC BY-NC-SA 4.0',
    timestamp: now,
    royaltiesPercentage: Number(royaltiesPercentage) || 0,
    ownerAddress: `0xFanClubMember_${submission.author.replace(/\s+/g, '')}_Address`,
  };

  res.json(submission);
});

// Like a submission
app.post('/api/submissions/:id/like', (req, res) => {
  const { id } = req.params;
  const submission = submissionsDatabase.find((s) => s.id === id);
  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  submission.likes += 1;
  res.json({ success: true, likes: submission.likes });
});

// AI Driven Game Guide ("Rescue Me" endpoint)
app.post('/api/rescue', async (req, res) => {
  const { prompt, game, image } = req.body;

  if (!prompt || !game) {
    return res.status(400).json({ error: 'Missing prompt or game specification' });
  }

  try {
    const ai = getGeminiClient();

    let userContentParts: any[] = [];

    // If an image was submitted, include it as inlineData
    if (image && image.startsWith('data:')) {
      const commaIndex = image.indexOf(',');
      const mimeType = image.substring(5, image.indexOf(';'));
      const base64Data = image.substring(commaIndex + 1);

      userContentParts.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }

    userContentParts.push({
      text: `Game: ${game}\nSituation/Stuck at: ${prompt}\n\nPlease generate a highly detailed guide rescue walk-through. Format the walkthrough and bossStrategies sections using elegant markdown headers, bullet points, and clean lists.`,
    });

    const systemInstruction = `You are the Ultimate Legendary Companion AI Guide, an ancient Sage of Hyrule who knows every dungeon, boss, item, secret, and timeline across all Legend of Zelda games.
Your task is to analyze the user's situation and generate a detailed step-by-step dungeon walkthrough, boss strategy, and an interactive checklist of recommended/required items to escape.
Format your response exactly as a JSON object matching the requested schema. Make the walkthrough and boss strategies detailed, actionable, and filled with authentic Zelda lore, character advice, and secrets.
The itemsChecklist must contain real items from that game (like hookshot, bow, fire arrows, iron boots, etc.) that are helpful for this dungeon, along with their location.`;

    const response = await generateContentWithRetry(ai, {
      model: 'gemini-3.5-flash',
      contents: {
        parts: userContentParts,
      },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'An encouraging, epic title for the rescue operation (e.g., escaping the Water Temple)',
            },
            walkthrough: {
              type: Type.STRING,
              description: 'A detailed step-by-step escape walkthrough or dungeon route in markdown format.',
            },
            bossStrategies: {
              type: Type.STRING,
              description: 'Strategic guide for defeating the local boss, mini-boss, or clearing the puzzle obstacles, in markdown format.',
            },
            itemsChecklist: {
              type: Type.ARRAY,
              description: 'An array of key items helpful in this area to keep track of.',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: 'A unique short id (e.g., item1, item2)' },
                  item: { type: Type.STRING, description: 'Name of the item' },
                  location: { type: Type.STRING, description: 'Where to find it or how to use it here' },
                  obtained: { type: Type.BOOLEAN, description: 'Set to false initially' },
                },
                required: ['id', 'item', 'location', 'obtained'],
              },
            },
          },
          required: ['title', 'walkthrough', 'bossStrategies', 'itemsChecklist'],
        },
      },
    });

    if (!response.text) {
      throw new Error('Gemini API returned an empty response.');
    }

    const result = JSON.parse(response.text.trim());
    res.json(result);
  } catch (error: any) {
    console.warn('Gemini Game Guide fallback engaged due to API error:', error?.message || error);
    const fallback = generateFallbackSageGuide(game, prompt);
    res.json(fallback);
  }
});

// Configure Vite or Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zelda Fan Club Platform running on http://localhost:${PORT}`);
  });
}

startServer();
