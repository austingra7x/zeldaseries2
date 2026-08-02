import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  MessageSquare, 
  User, 
  Sparkles, 
  Shield, 
  Heart, 
  Smile, 
  Clock, 
  RefreshCw,
  Check,
  Zap
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  senderName: string;
  avatarIcon: string;
  badge: string;
  text: string;
  timestamp: string;
  timeMs: number;
}

const CHAT_AVATARS = [
  { id: 'hero', name: 'Hero of Time', icon: '🗡️', badge: 'Hero' },
  { id: 'zelda', name: 'Princess Zelda', icon: '👑', badge: 'Royal Scribe' },
  { id: 'goron', name: 'Daruk Goron', icon: '🪨', badge: 'Goron Champion' },
  { id: 'zora', name: 'Mipha Zora', icon: '🔱', badge: 'Zora Princess' },
  { id: 'rito', name: 'Kass Rito', icon: '🪶', badge: 'Rito Bard' },
  { id: 'korok', name: 'Makar Korok', icon: '🍃', badge: 'Forest Spirit' },
  { id: 'sheikah', name: 'Impa Sheikah', icon: '👁️', badge: 'Sheikah Elder' },
  { id: 'ganon', name: 'Demon King', icon: '🔥', badge: 'Gerudo Tyrant' },
];

const QUICK_EMOJIS = ['⚔️', '🛡️', '💎', '🧚', '👑', '🍌', '🌲', '🔮', '💣', '💖'];

const INITIAL_SEED_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    senderName: 'Princess Zelda',
    avatarIcon: '👑',
    badge: 'Royal Scribe',
    text: 'Welcome all travelers to the Hyrule Town Square Chatroom! Share your quest tips and fan creations here!',
    timestamp: 'Just now',
    timeMs: Date.now() - 600000,
  },
  {
    id: 'm2',
    senderName: 'Hero of Time',
    avatarIcon: '🗡️',
    badge: 'Hero',
    text: 'Hey! Listen! Just finished collecting all Heart Pieces in Ocarina of Time! 💖',
    timestamp: '5m ago',
    timeMs: Date.now() - 300000,
  },
  {
    id: 'm3',
    senderName: 'Daruk Goron',
    avatarIcon: '🪨',
    badge: 'Goron Champion',
    text: 'Nice work brother! Now let\'s enjoy some prime Rock Roast!',
    timestamp: '2m ago',
    timeMs: Date.now() - 120000,
  }
];

export function FanChatRoom() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('zelda_chat_messages_local_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SEED_MESSAGES;
  });

  const [selectedAvatar, setSelectedAvatar] = useState(CHAT_AVATARS[0]);
  const [customName, setCustomName] = useState('Hylian Champion');
  const [inputMessage, setInputMessage] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Post Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsPosting(true);

    const newMessage: ChatMessage = {
      id: `local-msg-${Date.now()}`,
      senderName: customName.trim() || selectedAvatar.name,
      avatarIcon: selectedAvatar.icon,
      badge: selectedAvatar.badge,
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeMs: Date.now(),
    };

    // Immediate local update
    setMessages(prev => {
      const next = [...prev, newMessage];
      localStorage.setItem('zelda_chat_messages_local_v1', JSON.stringify(next));
      return next;
    });

    setIsPosting(false);
  };

  const addQuickEmoji = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
  };

  const sendQuickPreset = (presetText: string) => {
    setInputMessage(presetText);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-amber-950 border border-emerald-400/40 rounded-2xl p-5 text-emerald-100 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-300" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-300 font-bold">
              Real-Time Community Square
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-yellow-200">
            Hyrule Town Square Chatroom
          </h2>
          <p className="text-xs text-emerald-100/90 font-serif mt-0.5">
            Connect live with fellow Zelda enthusiasts across the world. Discuss theories, game secrets, and lore!
          </p>
        </div>

        {/* Avatar Profile Setup */}
        <div className="bg-black/30 border border-emerald-400/30 rounded-xl p-3 space-y-2 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-200">
            <span>Your Chat Identity:</span>
            <span className="px-1.5 py-0.2 bg-amber-400/20 text-yellow-200 rounded text-[10px] font-mono">
              {selectedAvatar.icon} {selectedAvatar.badge}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs pb-1">
            {CHAT_AVATARS.map(av => (
              <button
                key={av.id}
                onClick={() => setSelectedAvatar(av)}
                className={`p-1.5 rounded-lg text-lg transition-all cursor-pointer ${
                  selectedAvatar.id === av.id ? 'bg-amber-400 text-amber-950 scale-110 shadow-md ring-2 ring-amber-300' : 'bg-black/40 hover:bg-black/60'
                }`}
                title={`${av.name} (${av.badge})`}
              >
                {av.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat feed box */}
      <div className="bg-white/95 border border-zelda-border-sand rounded-2xl shadow-xl overflow-hidden flex flex-col h-[520px]">
        
        {/* Top Info Bar */}
        <div className="bg-amber-100/80 border-b border-zelda-border-sand p-3.5 px-5 flex items-center justify-between text-xs font-serif font-bold text-zelda-charcoal">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Castle Town Market Square Feed</span>
          </div>
          <span className="text-[10px] font-mono text-zelda-charcoal/60">
            {messages.length} Messages Active
          </span>
        </div>

        {/* Message scroll area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-amber-50/30">
          {messages.map((msg) => {
            const isMe = msg.senderName === customName || msg.senderName === selectedAvatar.name;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 max-w-2xl ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar Icon */}
                <div className="w-9 h-9 rounded-full bg-amber-200 border border-amber-400 flex items-center justify-center text-xl flex-shrink-0 shadow-xs">
                  {msg.avatarIcon}
                </div>

                <div className={`space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  <div className="flex items-center gap-2 text-[10px] font-mono justify-end font-bold">
                    <span className="text-zelda-charcoal font-serif">{msg.senderName}</span>
                    <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-serif text-[8px] uppercase">
                      {msg.badge}
                    </span>
                    <span className="text-zelda-charcoal/50 font-normal">{msg.timestamp}</span>
                  </div>

                  <div className={`p-3 rounded-2xl text-xs md:text-sm font-sans leading-relaxed shadow-xs inline-block max-w-lg ${
                    isMe
                      ? 'bg-zelda-gold text-white rounded-tr-none'
                      : 'bg-white border border-zelda-border-sand text-zelda-charcoal rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-white border-t border-zelda-border-sand space-y-2">
          
          {/* Quick Presets & Emojis */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1 overflow-x-auto max-w-md">
              <span className="text-[10px] font-serif font-bold text-zelda-charcoal/60 mr-1">Zelda Emojis:</span>
              {QUICK_EMOJIS.map((emoji, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => addQuickEmoji(emoji)}
                  className="px-1.5 py-0.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded text-sm transition-all cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 text-[10px] font-serif">
              <span className="text-zelda-charcoal/60">Presets:</span>
              <button
                type="button"
                onClick={() => sendQuickPreset('Hey! Listen! 🧚')}
                className="px-2 py-0.5 bg-amber-100 text-amber-900 hover:bg-amber-200 rounded font-bold cursor-pointer"
              >
                "Hey! Listen!"
              </button>
              <button
                type="button"
                onClick={() => sendQuickPreset('It\'s dangerous to go alone! Take this. 🗡️')}
                className="px-2 py-0.5 bg-amber-100 text-amber-900 hover:bg-amber-200 rounded font-bold cursor-pointer"
              >
                "Take this 🗡️"
              </button>
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter custom username..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-32 md:w-40 bg-amber-50/60 border border-zelda-border-sand rounded-xl p-2 text-xs font-serif text-zelda-charcoal focus:outline-none focus:border-zelda-gold flex-shrink-0"
            />

            <input
              type="text"
              required
              placeholder="Type your message to Hyrule Town Square..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-amber-50/40 border border-zelda-border-sand rounded-xl p-2 md:p-2.5 text-xs md:text-sm text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
            />

            <button
              type="submit"
              disabled={isPosting || !inputMessage.trim()}
              className="px-4 py-2 md:py-2.5 bg-zelda-gold hover:bg-yellow-600 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer flex-shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Post</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
