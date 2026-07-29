import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ShoppingBag, 
  Film, 
  Gamepad2, 
  BookMarked, 
  Sparkles, 
  Music, 
  ChevronRight, 
  ArrowLeft, 
  Search, 
  Tag, 
  Calendar, 
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Share2,
  Grid,
  Filter
} from 'lucide-react';
import { Comment, LoreEntry } from '../types';
import { CommentsSection } from './CommentsSection';

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  icon: React.ReactNode;
  itemCountKey: string; // matching category key in LoreEntry
}

export const ARCHIVE_CATEGORIES: CategoryInfo[] = [
  {
    id: 'merchandise',
    name: 'Merchandise',
    description: 'Official figurines, Amiibo series, soundtrack vinyls, apparel, and rare Hyrule collectibles.',
    thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=300&h=300&q=80',
    icon: <ShoppingBag className="w-5 h-5 text-zelda-gold" />,
    itemCountKey: 'merchandise'
  },
  {
    id: 'movie',
    name: 'Live Action Movie',
    description: 'Updates on Sony & Nintendo’s live-action Zelda film, Director Wes Ball notes, casting & sets.',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&h=300&q=80',
    icon: <Film className="w-5 h-5 text-zelda-gold" />,
    itemCountKey: 'movie'
  },
  {
    id: 'games',
    name: 'Games',
    description: 'Comprehensive entry for every official Legend of Zelda game release across 4 decades of history.',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&h=300&q=80',
    icon: <Gamepad2 className="w-5 h-5 text-zelda-gold" />,
    itemCountKey: 'games'
  },
  {
    id: 'publications',
    name: 'Publications',
    description: 'Official books including Hyrule Historia, Zelda Encyclopedia, Creating a Champion & manga series.',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&h=300&q=80',
    icon: <BookMarked className="w-5 h-5 text-zelda-gold" />,
    itemCountKey: 'publications'
  },
  {
    id: 'gamelore',
    name: 'Game Lore',
    description: 'Canonical timeline branches, Master Sword history, Sheikah/Zonai tech, and Goddess mythos.',
    thumbnail: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=300&h=300&q=80',
    icon: <Sparkles className="w-5 h-5 text-zelda-gold" />,
    itemCountKey: 'gamelore'
  },
  {
    id: 'media',
    name: 'Media and Fandom',
    description: 'Symphony of the Goddesses orchestral tours, speedrunning records, documentaries & community events.',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&h=300&q=80',
    icon: <Music className="w-5 h-5 text-zelda-gold" />,
    itemCountKey: 'media'
  }
];

export const OFFICIAL_ZELDA_GAMES = [
  { title: 'The Legend of Zelda (1986)', year: '1986', console: 'NES' },
  { title: 'Zelda II: The Adventure of Link (1987)', year: '1987', console: 'NES' },
  { title: 'The Legend of Zelda: A Link to the Past (1991)', year: '1991', console: 'SNES' },
  { title: 'The Legend of Zelda: Link\'s Awakening (1993)', year: '1993', console: 'Game Boy' },
  { title: 'The Legend of Zelda: Ocarina of Time (1998)', year: '1998', console: 'N64' },
  { title: 'The Legend of Zelda: Majora\'s Mask (2000)', year: '2000', console: 'N64' },
  { title: 'The Legend of Zelda: Oracle of Ages & Seasons (2001)', year: '2001', console: 'GBC' },
  { title: 'The Legend of Zelda: Four Swords (2002)', year: '2002', console: 'GBA' },
  { title: 'The Legend of Zelda: The Wind Waker (2002)', year: '2002', console: 'GameCube' },
  { title: 'The Legend of Zelda: Four Swords Adventures (2004)', year: '2004', console: 'GameCube' },
  { title: 'The Legend of Zelda: The Minish Cap (2004)', year: '2004', console: 'GBA' },
  { title: 'The Legend of Zelda: Twilight Princess (2006)', year: '2006', console: 'GameCube / Wii' },
  { title: 'The Legend of Zelda: Phantom Hourglass (2007)', year: '2007', console: 'DS' },
  { title: 'The Legend of Zelda: Spirit Tracks (2009)', year: '2009', console: 'DS' },
  { title: 'The Legend of Zelda: Skyward Sword (2011)', year: '2011', console: 'Wii' },
  { title: 'The Legend of Zelda: A Link Between Worlds (2013)', year: '2013', console: '3DS' },
  { title: 'The Legend of Zelda: Tri Force Heroes (2015)', year: '2015', console: '3DS' },
  { title: 'The Legend of Zelda: Breath of the Wild (2017)', year: '2017', console: 'Wii U / Switch' },
  { title: 'The Legend of Zelda: Tears of the Kingdom (2023)', year: '2023', console: 'Switch' },
  { title: 'The Legend of Zelda: Echoes of Wisdom (2024)', year: '2024', console: 'Switch' }
];

interface ArchivesSectionProps {
  entries: LoreEntry[];
  currentUser: any;
  onOpenAuth: () => void;
  comments?: Record<string, Comment[]>;
  commentsLoading?: Record<string, boolean>;
  newCommentText?: Record<string, string>;
  setNewCommentText?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  fetchComments?: (targetId: string) => Promise<void>;
  handleAddComment?: (targetId: string, targetType: 'news' | 'lore' | 'submission', e: React.FormEvent) => Promise<void>;
  handleDeleteComment?: (targetId: string, commentId: string) => Promise<void>;
}

export const ArchivesSection: React.FC<ArchivesSectionProps> = ({
  entries,
  currentUser,
  onOpenAuth,
  comments,
  commentsLoading,
  newCommentText,
  setNewCommentText,
  fetchComments,
  handleAddComment,
  handleDeleteComment,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGameSubcategory, setSelectedGameSubcategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<LoreEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Count items per category
  const getItemCount = (catId: string) => {
    return entries.filter(e => {
      if (catId === 'games') {
        return e.category === 'games' || e.category === 'character' || e.category === 'item' || e.category === 'location' || e.category === 'era' || e.game;
      }
      return e.category === catId;
    }).length;
  };

  // Filtered items
  const filteredEntries = entries.filter(e => {
    const matchesSearch = searchQuery.trim() === '' || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.game && e.game.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (!selectedCategory) return true;

    if (selectedCategory === 'games') {
      const isGameRelated = e.category === 'games' || e.category === 'character' || e.category === 'item' || e.category === 'location' || e.category === 'era' || Boolean(e.game);
      if (!isGameRelated) return false;
      if (selectedGameSubcategory) {
        return (e.subCategory && e.subCategory.toLowerCase() === selectedGameSubcategory.toLowerCase()) ||
               (e.game && e.game.toLowerCase().includes(selectedGameSubcategory.toLowerCase())) ||
               (e.title.toLowerCase().includes(selectedGameSubcategory.toLowerCase()));
      }
      return true;
    }

    return e.category === selectedCategory;
  });

  const activeCatObj = ARCHIVE_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="w-full space-y-8">
      {/* SECTION HEADER & BREADCRUMBS */}
      <div className="bg-zelda-green-forest border-2 border-zelda-gold rounded-2xl p-5 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {selectedItem || selectedCategory ? (
            <button
              onClick={() => {
                if (selectedItem) setSelectedItem(null);
                else if (selectedGameSubcategory) setSelectedGameSubcategory(null);
                else setSelectedCategory(null);
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-serif font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div className="p-2.5 bg-zelda-gold/20 rounded-xl text-zelda-gold border border-zelda-gold/40">
              <BookOpen className="w-5 h-5" />
            </div>
          )}

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-[#EAE2CF]">
              <span className="text-zelda-gold">▲</span>
              <span>Archives Sanctuary</span>
              {selectedCategory && (
                <>
                  <span className="text-zelda-gold/60">&raquo;</span>
                  <span className="text-zelda-gold">{activeCatObj?.name || selectedCategory}</span>
                </>
              )}
              {selectedGameSubcategory && (
                <>
                  <span className="text-zelda-gold/60">&raquo;</span>
                  <span className="text-white truncate max-w-[180px]">{selectedGameSubcategory}</span>
                </>
              )}
              {selectedItem && (
                <>
                  <span className="text-zelda-gold/60">&raquo;</span>
                  <span className="text-white truncate max-w-[180px]">{selectedItem.title}</span>
                </>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-serif font-bold text-white tracking-wide">
              {selectedItem ? selectedItem.title : selectedCategory ? (activeCatObj?.name || 'Category Archives') : 'Royal Hyrule Archives'}
            </h1>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px] sm:min-w-[280px]">
          <Search className="w-4 h-4 text-zelda-gold absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search archives & lore..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/20 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-zelda-gold font-sans"
          />
        </div>
      </div>

      {/* VIEW LEVEL 1: DETAILED ITEM VIEW */}
      {selectedItem ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FBF7EE] text-zelda-charcoal border-2 border-zelda-gold/60 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8"
        >
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="aspect-square w-full rounded-2xl overflow-hidden border-2 border-zelda-gold/40 shadow-lg relative bg-black/5">
                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-zelda-green-forest/90 text-zelda-gold text-[10px] font-serif font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-zelda-gold/40">
                  {selectedItem.category}
                </div>
              </div>

              {/* Gallery thumbnails if available */}
              {selectedItem.galleryImages && selectedItem.galleryImages.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-serif font-bold uppercase tracking-wider text-zelda-green-forest">
                    Archive Image Gallery ({selectedItem.galleryImages.length + 1} Photos)
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <button
                      onClick={() => setSelectedItem({ ...selectedItem, imageUrl: selectedItem.imageUrl })}
                      className="w-16 h-16 rounded-xl border-2 border-zelda-gold overflow-hidden flex-shrink-0 cursor-pointer"
                    >
                      <img src={selectedItem.imageUrl} className="w-full h-full object-cover" />
                    </button>
                    {selectedItem.galleryImages.map((gImg, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedItem({ ...selectedItem, imageUrl: gImg })}
                        className="w-16 h-16 rounded-xl border border-zelda-border-sand overflow-hidden flex-shrink-0 hover:border-zelda-gold transition-colors cursor-pointer"
                      >
                        <img src={gImg} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-zelda-gold uppercase tracking-widest mb-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Category: {selectedItem.category}</span>
                  {selectedItem.releaseYear && <span>&bull; Released {selectedItem.releaseYear}</span>}
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zelda-green-forest uppercase tracking-wide">
                  {selectedItem.title}
                </h2>
                {selectedItem.game && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 text-zelda-charcoal rounded-lg border border-zelda-gold/30 text-xs font-serif font-semibold">
                    <Gamepad2 className="w-3.5 h-3.5 text-zelda-gold" />
                    <span>Canonical Game: {selectedItem.game}</span>
                  </div>
                )}
              </div>

              <div className="p-6 bg-white rounded-2xl border border-zelda-border-sand shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-sm uppercase text-zelda-green-forest tracking-wider border-b border-zelda-border-sand/40 pb-2">
                  Archival Records & Details
                </h3>
                <p className="text-sm text-zelda-charcoal/90 leading-relaxed whitespace-pre-line font-sans">
                  {selectedItem.description}
                </p>

                {selectedItem.externalLink && (
                  <a
                    href={selectedItem.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zelda-gold hover:bg-yellow-600 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                  >
                    <span>View Official Product / Reference</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Item Comments */}
              <div className="pt-4 border-t border-zelda-border-sand">
                <CommentsSection
                  targetId={selectedItem.id}
                  targetType="lore"
                  currentUser={currentUser}
                  onOpenAuth={onOpenAuth}
                  comments={comments}
                  commentsLoading={commentsLoading}
                  newCommentText={newCommentText}
                  setNewCommentText={setNewCommentText}
                  fetchComments={fetchComments}
                  handleAddComment={handleAddComment}
                  handleDeleteComment={handleDeleteComment}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          {/* CATEGORIES GRID WITH 100px x 100px THUMBNAILS */}
          {!selectedCategory && searchQuery.trim() === '' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zelda-gold/30">
                <h2 className="text-lg font-serif font-bold text-zelda-green-forest uppercase tracking-wider flex items-center gap-2">
                  <Grid className="w-5 h-5 text-zelda-gold" />
                  <span>Select Archive Category</span>
                </h2>
                <span className="text-xs font-serif text-gray-500">{ARCHIVE_CATEGORIES.length} Main Collections</span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ARCHIVE_CATEGORIES.map((cat) => {
                  const count = getItemCount(cat.id);
                  return (
                    <motion.div
                      key={cat.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="bg-[#FBF7EE] border-2 border-zelda-gold/50 hover:border-zelda-gold rounded-2xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center gap-4 group"
                    >
                      {/* 100px x 100px EXACT THUMBNAIL */}
                      <div className="w-[100px] h-[100px] min-w-[100px] min-h-[100px] rounded-xl overflow-hidden border border-zelda-gold/40 shadow-xs relative bg-black/10 flex-shrink-0">
                        <img 
                          src={cat.thumbnail} 
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1 right-1 bg-zelda-green-forest text-zelda-gold text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border border-zelda-gold/30 shadow-xs">
                          {count} {count === 1 ? 'item' : 'items'}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 text-zelda-green-forest font-serif font-bold text-base group-hover:text-zelda-gold transition-colors truncate">
                          {cat.icon}
                          <span className="truncate">{cat.name}</span>
                        </div>
                        <p className="text-xs text-zelda-charcoal/80 font-sans line-clamp-3 leading-tight">
                          {cat.description}
                        </p>
                        <div className="pt-1 flex items-center text-[10px] font-serif font-bold uppercase tracking-wider text-zelda-gold group-hover:translate-x-1 transition-transform">
                          <span>Browse Collection</span>
                          <ChevronRight className="w-3 h-3 ml-0.5" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-CATEGORY LIST FOR GAMES */}
          {selectedCategory === 'games' && !selectedItem && (
            <div className="bg-[#FBF7EE] border-2 border-zelda-gold/50 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zelda-border-sand">
                <div>
                  <h3 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-zelda-gold" />
                    <span>Official Legend of Zelda Game Releases</span>
                  </h3>
                  <p className="text-xs text-zelda-charcoal/70 font-sans mt-0.5">
                    Filter archives by specific canonical game title across all Nintendo generations.
                  </p>
                </div>
                {selectedGameSubcategory && (
                  <button
                    onClick={() => setSelectedGameSubcategory(null)}
                    className="px-3 py-1 bg-white border border-zelda-border-sand text-xs font-serif font-bold text-zelda-charcoal rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <button
                  onClick={() => setSelectedGameSubcategory(null)}
                  className={`px-3 py-1.5 rounded-xl font-serif font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                    selectedGameSubcategory === null
                      ? 'bg-zelda-gold text-white shadow-md'
                      : 'bg-white text-zelda-charcoal border border-zelda-border-sand hover:border-zelda-gold'
                  }`}
                >
                  All Zelda Games ({OFFICIAL_ZELDA_GAMES.length})
                </button>

                {OFFICIAL_ZELDA_GAMES.map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedGameSubcategory(g.title)}
                    className={`px-3 py-1.5 rounded-xl font-serif font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                      selectedGameSubcategory === g.title
                        ? 'bg-zelda-gold text-white shadow-md'
                        : 'bg-white text-zelda-charcoal border border-zelda-border-sand hover:border-zelda-gold'
                    }`}
                  >
                    <span>{g.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ITEM LISTINGS / GRID */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-zelda-gold" />
                <span>
                  {selectedCategory ? `${activeCatObj?.name || selectedCategory} Items` : searchQuery ? 'Search Results' : 'All Archival Items'}
                </span>
                <span className="text-xs font-mono bg-zelda-gold/20 text-zelda-gold px-2 py-0.5 rounded-full border border-zelda-gold/40">
                  {filteredEntries.length} Records
                </span>
              </h3>

              {selectedCategory && (
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedGameSubcategory(null); }}
                  className="text-xs font-serif font-bold text-zelda-gold hover:underline cursor-pointer"
                >
                  View All Categories
                </button>
              )}
            </div>

            {filteredEntries.length === 0 ? (
              <div className="bg-[#FBF7EE] border border-zelda-border-sand rounded-2xl p-8 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-zelda-gold mx-auto opacity-50" />
                <h4 className="font-serif font-bold text-base text-zelda-green-forest uppercase">
                  No Archival Records Found
                </h4>
                <p className="text-xs text-zelda-charcoal/70 max-w-md mx-auto">
                  No items match your selected category or search criteria. Try selecting another collection or clearing your search filters.
                </p>
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedGameSubcategory(null); setSearchQuery(''); }}
                  className="px-4 py-2 bg-zelda-gold text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-yellow-600 transition-colors cursor-pointer"
                >
                  Reset All Archives
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntries.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white border border-zelda-border-sand hover:border-zelda-gold rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col group"
                  >
                    <div className="aspect-video w-full relative bg-black/10 overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-zelda-green-forest/90 text-zelda-gold text-[10px] font-serif font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-zelda-gold/30">
                        {item.category}
                      </div>
                      {item.game && (
                        <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-sans truncate px-2 py-1 rounded-md border border-white/10">
                          {item.game}
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-zelda-green-forest group-hover:text-zelda-gold transition-colors line-clamp-2 uppercase tracking-wide">
                          {item.title}
                        </h4>
                        <p className="text-xs text-zelda-charcoal/80 font-sans line-clamp-3 mt-1.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-zelda-border-sand/60 flex items-center justify-between text-xs font-serif font-bold text-zelda-gold">
                        <span>Open Item Section</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
