import React, { useState } from 'react';
import { 
  Palette, 
  MessageSquare, 
  CheckSquare, 
  Sparkles, 
  Compass, 
  Shield, 
  Award,
  Crown,
  User
} from 'lucide-react';
import { InteractiveCanvas } from './InteractiveCanvas';
import { FanChatRoom } from './FanChatRoom';
import { QuestTracker } from './QuestTracker';
import { UserProfileSection } from './UserProfileSection';
import { UserSubmission } from '../../types';

export type PortalSubTab = 'profile' | 'quest' | 'canvas' | 'chat';

export interface FanPortalSectionProps {
  submissions?: UserSubmission[];
  onNavigateToTab?: (tab: 'news' | 'lore' | 'submissions' | 'guide' | 'portal' | 'admin') => void;
  onOpenSubmission?: (id: string) => void;
}

export function FanPortalSection({ submissions, onNavigateToTab, onOpenSubmission }: FanPortalSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<PortalSubTab>('profile');

  return (
    <div className="space-y-6">
      {/* Master Top Sub-Navigation Tabs */}
      <div className="bg-white/80 border border-zelda-border-sand rounded-2xl p-2 md:p-3 shadow-md flex flex-wrap items-center justify-between gap-3">
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-zelda-charcoal">
              Hyrule Fan Portal & Guild Hub
            </h3>
            <p className="text-[10px] font-mono text-zelda-charcoal/60">
              User Public Profile &bull; Quest Trackers &bull; Interactive Canvas &bull; Fan Chat
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'profile'
                ? 'bg-zelda-gold text-white shadow-md ring-2 ring-yellow-400'
                : 'bg-amber-50 hover:bg-amber-100 text-zelda-charcoal border border-zelda-border-sand/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Public Profile & Fan Club</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quest')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'quest'
                ? 'bg-zelda-gold text-white shadow-md'
                : 'bg-amber-50 hover:bg-amber-100 text-zelda-charcoal border border-zelda-border-sand/60'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Master Quest Tracker</span>
          </button>

          <button
            onClick={() => setActiveSubTab('canvas')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'canvas'
                ? 'bg-zelda-gold text-white shadow-md'
                : 'bg-amber-50 hover:bg-amber-100 text-zelda-charcoal border border-zelda-border-sand/60'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Interactive Art Canvas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'chat'
                ? 'bg-zelda-gold text-white shadow-md'
                : 'bg-amber-50 hover:bg-amber-100 text-zelda-charcoal border border-zelda-border-sand/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Town Square Chatroom</span>
          </button>
        </div>
      </div>

      {/* View Rendering */}
      <div>
        {activeSubTab === 'profile' && (
          <UserProfileSection 
            submissions={submissions}
            onNavigateToTab={onNavigateToTab}
            onOpenSubmission={onOpenSubmission}
            onOpenCanvas={() => setActiveSubTab('canvas')}
          />
        )}
        {activeSubTab === 'quest' && <QuestTracker />}
        {activeSubTab === 'canvas' && <InteractiveCanvas />}
        {activeSubTab === 'chat' && <FanChatRoom />}
      </div>
    </div>
  );
}
