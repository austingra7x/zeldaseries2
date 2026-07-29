import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckSquare, 
  Square, 
  Search, 
  Download, 
  Upload, 
  Printer, 
  Share2, 
  RotateCcw, 
  Plus, 
  Check, 
  Heart, 
  Shield, 
  Sparkles, 
  BookOpen, 
  Award,
  Trash2,
  X,
  ChevronDown
} from 'lucide-react';
import { ZELDA_GAMES_QUEST_DATA, GameQuestData, QuestCheckitem } from './questData';

const LOCAL_STORAGE_KEY = 'zelda_quest_tracker_data_v1';

export function QuestTracker() {
  const [selectedGameId, setSelectedGameId] = useState<string>('oot');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'heart' | 'item' | 'upgrade' | 'quest'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom items added by user per game: { [gameId]: QuestCheckitem[] }
  const [customItems, setCustomItems] = useState<Record<string, QuestCheckitem[]>>({});
  
  // Completed items set: Set of item IDs
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return new Set(parsed.completedIds || []);
      }
    } catch (e) {
      console.error("Failed loading quest tracker state", e);
    }
    return new Set<string>();
  });

  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [isAddCustomModalOpen, setIsAddCustomModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemLocation, setNewItemLocation] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'heart' | 'item' | 'upgrade' | 'quest'>('quest');

  // Sync to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        completedIds: Array.from(completedIds),
        customItems,
      }));
    } catch (e) {
      console.error("Failed saving quest tracker state", e);
    }
  }, [completedIds, customItems]);

  const currentGame = useMemo(() => {
    return ZELDA_GAMES_QUEST_DATA.find(g => g.id === selectedGameId) || ZELDA_GAMES_QUEST_DATA[0];
  }, [selectedGameId]);

  // Combine standard game items + custom items for selected game
  const allGameItems = useMemo(() => {
    const defaultItems = currentGame.items;
    const customs = customItems[currentGame.id] || [];
    return [...defaultItems, ...customs];
  }, [currentGame, customItems]);

  // Filter items by category & search query
  const filteredItems = useMemo(() => {
    return allGameItems.filter(item => {
      const matchesCategory = activeCategoryFilter === 'all' || item.category === activeCategoryFilter;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allGameItems, activeCategoryFilter, searchQuery]);

  // Stats calculation
  const totalCount = allGameItems.length;
  const completedCount = allGameItems.filter(item => completedIds.has(item.id)).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Toggle item completion
  const toggleItem = (itemId: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // Add custom quest item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: QuestCheckitem = {
      id: `custom-${selectedGameId}-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      location: newItemLocation.trim() || 'Custom User Quest',
    };

    setCustomItems(prev => ({
      ...prev,
      [selectedGameId]: [...(prev[selectedGameId] || []), newItem]
    }));

    setNewItemName('');
    setNewItemLocation('');
    setIsAddCustomModalOpen(false);
  };

  // Remove custom item
  const handleRemoveCustomItem = (itemId: string) => {
    setCustomItems(prev => ({
      ...prev,
      [selectedGameId]: (prev[selectedGameId] || []).filter(item => item.id !== itemId)
    }));
    setCompletedIds(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  // Reset progress for current game
  const handleResetGameProgress = () => {
    if (window.confirm(`Are you sure you want to reset all progress for ${currentGame.title}?`)) {
      setCompletedIds(prev => {
        const next = new Set(prev);
        allGameItems.forEach(item => next.delete(item.id));
        return next;
      });
    }
  };

  // Export JSON backup
  const handleExportData = () => {
    const dataToExport = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      completedIds: Array.from(completedIds),
      customItems,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Zelda_Quest_Tracker_${selectedGameId}_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.completedIds)) {
          setCompletedIds(new Set(parsed.completedIds));
          if (parsed.customItems) {
            setCustomItems(parsed.customItems);
          }
          alert('Successfully imported quest tracker data!');
        } else {
          alert('Invalid file format. Please upload a valid Quest Tracker JSON file.');
        }
      } catch (err) {
        alert('Failed to read file. Please ensure it is valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Copy share summary
  const handleShareSummary = () => {
    const summaryText = `🗡️ Hyrule Quest Progress [${currentGame.title}]: ${completedCount}/${totalCount} completed (${progressPercent}% Progress)! Tracked on Hyrule Scribing Portal.`;
    navigator.clipboard.writeText(summaryText);
    setShareNotice('Copied summary to clipboard!');
    setTimeout(() => setShareNotice(null), 3000);
  };

  // Print layout handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="bg-gradient-to-r from-amber-950/90 via-emerald-950/80 to-amber-950/90 border border-amber-400/40 rounded-2xl p-5 md:p-6 text-amber-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                Local Save & Printable Checklist
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-yellow-200 tracking-wide">
              Master Quest & Checklist Tracker
            </h2>
            <p className="text-xs md:text-sm text-emerald-100/90 font-serif leading-relaxed max-w-2xl">
              Track your Heart Pieces, Key Equipment, Upgrades, Bottles, and Main Story Objectives across classic Zelda adventures. Saved automatically on your device.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportData}
              className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 rounded-xl text-xs font-serif font-bold text-amber-200 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download backup JSON"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Export JSON</span>
            </button>

            <label className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 rounded-xl text-xs font-serif font-bold text-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-300" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 rounded-xl text-xs font-serif font-bold text-yellow-200 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Print formatted checklist"
            >
              <Printer className="w-4 h-4 text-yellow-300" />
              <span>Print Checklist</span>
            </button>

            <button
              onClick={handleShareSummary}
              className="px-3.5 py-2 bg-amber-400 hover:bg-yellow-500 text-amber-950 font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer relative"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Summary</span>
            </button>
          </div>
        </div>

        {shareNotice && (
          <div className="mt-3 py-1.5 px-3 bg-amber-400/20 border border-amber-300/40 rounded-lg text-xs font-serif text-amber-200 animate-pulse text-center">
            {shareNotice}
          </div>
        )}
      </div>

      {/* Game Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ZELDA_GAMES_QUEST_DATA.map(game => {
          const isSelected = game.id === selectedGameId;
          const gameItems = [...game.items, ...(customItems[game.id] || [])];
          const gameCompleted = gameItems.filter(i => completedIds.has(i.id)).length;
          const gamePercent = gameItems.length > 0 ? Math.round((gameCompleted / gameItems.length) * 100) : 0;

          return (
            <button
              key={game.id}
              onClick={() => setSelectedGameId(game.id)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between min-h-[100px] cursor-pointer ${
                isSelected 
                  ? 'bg-gradient-to-b from-amber-100 to-amber-200/90 border-amber-500 shadow-md ring-2 ring-amber-400/60' 
                  : 'bg-white/80 hover:bg-amber-50/60 border-zelda-border-sand/70 hover:border-zelda-gold'
              }`}
            >
              <div>
                <p className={`text-[9px] font-mono font-bold uppercase tracking-wider ${isSelected ? 'text-amber-800' : 'text-zelda-charcoal/60'}`}>
                  {game.subtitle}
                </p>
                <h4 className={`font-serif text-xs font-bold leading-tight mt-0.5 line-clamp-2 ${isSelected ? 'text-amber-950' : 'text-zelda-charcoal'}`}>
                  {game.title}
                </h4>
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className={isSelected ? 'text-amber-900 font-bold' : 'text-zelda-charcoal/70'}>
                    {gameCompleted}/{gameItems.length}
                  </span>
                  <span className={`font-bold ${gamePercent === 100 ? 'text-emerald-700' : isSelected ? 'text-amber-900' : 'text-zelda-gold'}`}>
                    {gamePercent}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${gamePercent === 100 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                    style={{ width: `${gamePercent}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Checklist Card */}
      <div className="bg-white/90 border border-zelda-border-sand rounded-2xl shadow-lg p-5 md:p-6 space-y-5">
        
        {/* Game Header & Progress Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zelda-border-sand pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-mono font-bold rounded uppercase">
                {currentGame.subtitle}
              </span>
              <span className="text-xs text-zelda-charcoal/60 font-serif">Interactive Checklist</span>
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-zelda-charcoal">
              {currentGame.title}
            </h3>
          </div>

          {/* Progress gauge */}
          <div className="w-full md:w-72 bg-amber-50 border border-zelda-border-sand rounded-xl p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-serif font-bold">
              <span className="text-zelda-charcoal">Completion Progress</span>
              <span className={progressPercent === 100 ? 'text-emerald-600 font-extrabold' : 'text-zelda-gold'}>
                {completedCount} / {totalCount} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-amber-200/60 rounded-full overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-500 shadow-xs ${
                  progressPercent === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-400 to-amber-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { key: 'all', label: 'All Items' },
              { key: 'heart', label: '💖 Heart Pieces' },
              { key: 'item', label: '🗡️ Equipment & Gear' },
              { key: 'upgrade', label: '🏹 Upgrades & Bottles' },
              { key: 'quest', label: '📜 Quests & Dungeons' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveCategoryFilter(tab.key as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategoryFilter === tab.key
                    ? 'bg-zelda-gold text-white shadow-xs'
                    : 'bg-amber-50 hover:bg-amber-100 text-zelda-charcoal border border-zelda-border-sand/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-zelda-charcoal/50 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search quests or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-amber-50/50 border border-zelda-border-sand rounded-xl text-xs font-sans text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
              />
            </div>

            <button
              onClick={() => setIsAddCustomModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-serif font-bold flex items-center gap-1 whitespace-nowrap shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Quest</span>
            </button>
          </div>
        </div>

        {/* Checklist Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center text-zelda-charcoal/60 font-serif italic border-2 border-dashed border-zelda-border-sand rounded-xl">
            No items found matching your filters or search query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredItems.map((item) => {
              const isChecked = completedIds.has(item.id);
              const isCustom = item.id.startsWith('custom-');

              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-amber-50/80 border-emerald-500/60 text-zelda-charcoal/70'
                      : 'bg-white hover:bg-amber-50/50 border-zelda-border-sand hover:border-zelda-gold'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isChecked ? (
                      <div className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded border-2 border-zelda-border-sand bg-white hover:border-zelda-gold transition-colors" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className={`font-serif text-xs font-bold ${isChecked ? 'line-through text-emerald-900/70' : 'text-zelda-charcoal'}`}>
                        {item.name}
                      </h5>
                      <span className={`text-[8px] font-mono uppercase font-bold px-1.5 py-0.2 rounded border flex-shrink-0 ${
                        item.category === 'heart' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                        item.category === 'item' ? 'bg-amber-100 text-amber-900 border-amber-200' :
                        item.category === 'upgrade' ? 'bg-teal-100 text-teal-900 border-teal-200' :
                        'bg-blue-100 text-blue-900 border-blue-200'
                      }`}>
                        {item.category}
                      </span>
                    </div>

                    <p className={`text-[11px] font-sans ${isChecked ? 'text-zelda-charcoal/50' : 'text-zelda-charcoal/70'}`}>
                      📍 {item.location}
                    </p>
                  </div>

                  {isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCustomItem(item.id);
                      }}
                      className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
                      title="Delete custom quest item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Reset & Game stats */}
        <div className="pt-3 border-t border-zelda-border-sand flex items-center justify-between text-xs font-serif text-zelda-charcoal/70">
          <span>Total items tracked for this realm: <strong>{totalCount}</strong></span>
          <button
            onClick={handleResetGameProgress}
            className="text-rose-700 hover:text-rose-900 underline flex items-center gap-1 cursor-pointer font-bold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset {currentGame.title} Progress</span>
          </button>
        </div>
      </div>

      {/* Modal to add custom quest item */}
      {isAddCustomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-zelda-gold rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsAddCustomModalOpen(false)}
              className="absolute top-4 right-4 text-zelda-charcoal/60 hover:text-zelda-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold text-zelda-charcoal flex items-center gap-2">
                <Plus className="w-5 h-5 text-zelda-gold" />
                <span>Add Custom Quest for {currentGame.title}</span>
              </h4>
              <p className="text-xs text-zelda-charcoal/70 font-sans">
                Track personal achievements, secret sidequests, or missing collectibles.
              </p>
            </div>

            <form onSubmit={handleAddCustomItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal font-bold mb-1">
                  Quest / Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Biggoron Sword Trading Step #3"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-amber-50/50 border border-zelda-border-sand rounded-xl p-2.5 text-xs text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal font-bold mb-1">
                  Category
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="w-full bg-amber-50/50 border border-zelda-border-sand rounded-xl p-2.5 text-xs text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
                >
                  <option value="quest">📜 Main / Side Quest</option>
                  <option value="heart">💖 Heart Piece / Container</option>
                  <option value="item">🗡️ Equipment / Key Item</option>
                  <option value="upgrade">🏹 Upgrade / Bottle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal font-bold mb-1">
                  Location / Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Talk to Biggoron on Death Mountain Summit"
                  value={newItemLocation}
                  onChange={(e) => setNewItemLocation(e.target.value)}
                  className="w-full bg-amber-50/50 border border-zelda-border-sand rounded-xl p-2.5 text-xs text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomModalOpen(false)}
                  className="px-4 py-2 border border-zelda-border-sand rounded-xl text-xs font-serif text-zelda-charcoal hover:bg-amber-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zelda-gold hover:bg-yellow-600 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                >
                  Save Custom Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
