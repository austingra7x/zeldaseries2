import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX, Sparkles, RefreshCw, Disc, Play, Lock, Unlock, BookOpen, ArrowLeft } from 'lucide-react';

// Ocarina Notes and Frequencies (in Hz)
// A = D4 (293.66), C-Down = F4 (349.23), C-Right = A4 (440.00), C-Left = B4 (493.88), C-Up = F5 (698.46)
const NOTE_FREQS: Record<string, { freq: number; label: string; color: string; hoverColor: string }> = {
  A: { freq: 293.66, label: 'A', color: 'bg-blue-500 text-white border-2 border-blue-300 shadow-md', hoverColor: 'hover:bg-blue-400' },
  CDown: { freq: 349.23, label: '▼', color: 'bg-amber-400 text-amber-950 border-2 border-yellow-200 shadow-md font-extrabold', hoverColor: 'hover:bg-amber-300' },
  CRight: { freq: 440.00, label: '►', color: 'bg-amber-400 text-amber-950 border-2 border-yellow-200 shadow-md font-extrabold', hoverColor: 'hover:bg-amber-300' },
  CLeft: { freq: 493.88, label: '◄', color: 'bg-amber-400 text-amber-950 border-2 border-yellow-200 shadow-md font-extrabold', hoverColor: 'hover:bg-amber-300' },
  CUp: { freq: 698.46, label: '▲', color: 'bg-amber-400 text-amber-950 border-2 border-yellow-200 shadow-md font-extrabold', hoverColor: 'hover:bg-amber-300' },
};

// Recognized Ocarina Song Patterns (using note labels)
export interface OcarinaSong {
  name: string;
  notes: string[]; // e.g. ['A', '▼', '▲', 'A', '▼', '▲']
  game: string;
  description: string;
  // Sequence of notes for Web Audio playback: [freq, durationInSec]
  melody: [number, number][];
}

const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const F4 = 349.23;
const G4 = 392.00;
const A4 = 440.00;
const B4 = 493.88;
const C5 = 523.25;
const D5 = 587.33;
const E5 = 659.25;
const F5 = 698.46;
const G5 = 783.99;
const A5 = 880.00;

export const BONUS_UNLOCK_MAP: Record<string, string> = {
  "Song of Storms": "Hyrule Overworld Main Theme",
  "Sun's Song": "Light World Overworld",
  "Song of Time": "Dark World Theme",
  "Oath to Order": "Gerudo Valley Theme",
  "Sonata of Awakening": "Tal Tal Heights Theme",
  "Saria's Song": "Kokiri Forest Theme",
  "Song of Healing": "Kakariko Village Theme",
  "Song of Soaring": "Great Palace Theme",
};

export const BONUS_TRIGGER_REVERSE_MAP: Record<string, string> = {
  "Hyrule Overworld Main Theme": "Song of Storms",
  "Light World Overworld": "Sun's Song",
  "Dark World Theme": "Song of Time",
  "Gerudo Valley Theme": "Oath to Order",
  "Tal Tal Heights Theme": "Sonata of Awakening",
  "Kokiri Forest Theme": "Saria's Song",
  "Kakariko Village Theme": "Song of Healing",
  "Great Palace Theme": "Song of Soaring",
};

export const OCARINA_SONGS: Record<string, OcarinaSong> = {
  storms: {
    name: "Song of Storms",
    notes: ['A', '▼', '▲', 'A', '▼', '▲'],
    game: "Ocarina of Time",
    description: "Summons wind and rain, causing windmills to spin fiercely and grottoes to open.",
    melody: [
      [D4, 0.2], [F4, 0.2], [D5, 0.6],
      [D4, 0.2], [F4, 0.2], [D5, 0.6],
      [E5, 0.4], [F5, 0.2], [E5, 0.2], [F5, 0.2], [E5, 0.2], [C5, 0.2], [A4, 0.4],
      [A4, 0.4], [D4, 0.4], [F4, 0.2], [G4, 0.2], [A4, 0.8]
    ]
  },
  lullaby: {
    name: "Zelda's Lullaby",
    notes: ['◄', '▲', '►', '◄', '▲', '►'],
    game: "Ocarina of Time",
    description: "The sacred melody of the Royal Family of Hyrule, proving royal status.",
    melody: [
      [B4, 0.6], [D5, 0.3], [A4, 0.9],
      [B4, 0.6], [D5, 0.3], [A4, 0.9],
      [B4, 0.6], [D5, 0.3], [A5, 0.6], [G5, 0.3], [D5, 0.6],
      [C5, 0.3], [B4, 0.3], [A4, 0.9]
    ]
  },
  time: {
    name: "Song of Time",
    notes: ['►', 'A', '▼', '►', 'A', '▼'],
    game: "Ocarina of Time",
    description: "Opens the Door of Time inside the Temple of Time to reveal the Master Sword.",
    melody: [
      [A4, 0.6], [D4, 1.0], [F4, 0.6],
      [A4, 0.6], [D4, 1.0], [F4, 0.6],
      [A4, 0.3], [C5, 0.3], [B4, 0.6], [G4, 0.6],
      [F4, 0.3], [G4, 0.3], [A4, 0.6], [D4, 0.6],
      [C4, 0.3], [E4, 0.3], [D4, 1.0]
    ]
  },
  epona: {
    name: "Epona's Song",
    notes: ['▲', '◄', '►', '▲', '◄', '►'],
    game: "Ocarina of Time / Majora's Mask",
    description: "Calls Link's faithful steed Epona from anywhere across the vast fields.",
    melody: [
      [F5, 0.3], [B4, 0.3], [A4, 0.8],
      [F5, 0.3], [B4, 0.3], [A4, 0.8],
      [F5, 0.3], [B4, 0.3], [A4, 0.4], [B4, 0.4], [A4, 0.8]
    ]
  },
  saria: {
    name: "Saria's Song",
    notes: ['▼', '►', '◄', '▼', '►', '◄'],
    game: "Ocarina of Time",
    description: "A cheerful tune taught by Saria that telepathically connects friends and brings joy.",
    melody: [
      [F4, 0.2], [A4, 0.2], [B4, 0.4],
      [F4, 0.2], [A4, 0.2], [B4, 0.4],
      [F4, 0.2], [A4, 0.2], [B4, 0.2], [E5, 0.2], [D5, 0.4],
      [B4, 0.2], [C5, 0.2], [B4, 0.2], [G4, 0.2], [E4, 0.8]
    ]
  },
  sun: {
    name: "Sun's Song",
    notes: ['►', '▼', '▲', '►', '▼', '▲'],
    game: "Ocarina of Time",
    description: "Taught by the Royal Composers to instantly turn night into day and day into night.",
    melody: [
      [A4, 0.2], [F4, 0.2], [F5, 0.5],
      [A4, 0.2], [F4, 0.2], [F5, 0.5],
      [A4, 0.2], [B4, 0.2], [C5, 0.2], [D5, 0.2], [E5, 0.2], [F5, 0.8]
    ]
  },
  oath: {
    name: "Oath to Order",
    notes: ['►', '▼', 'A', '▼', '►', '▲'],
    game: "Majora's Mask",
    description: "An ancient prayer echoing across Termina, calling the Four Giants to stop the falling moon.",
    melody: [
      [A4, 0.6], [D4, 0.6], [F4, 0.6], [D4, 0.6], [A4, 0.6], [F5, 1.0]
    ]
  },
  sonata: {
    name: "Sonata of Awakening",
    notes: ['▲', '◄', '▲', '◄', 'A', '►', 'A'],
    game: "Majora's Mask",
    description: "A lively Deku melody that awakens sleepers and reveals hidden ancient Deku Palaces.",
    melody: [
      [F5, 0.2], [B4, 0.2], [F5, 0.2], [B4, 0.2], [D4, 0.2], [A4, 0.2], [D4, 0.6]
    ]
  },
  healing: {
    name: "Song of Healing",
    notes: ['◄', '►', '▼', '◄', '►', '▼'],
    game: "Majora's Mask",
    description: "A soothing, melancholic tune taught by the Happy Mask Salesman that turns curses into masks.",
    melody: [
      [B4, 0.4], [A4, 0.4], [F4, 0.4], [B4, 0.4], [A4, 0.4], [F4, 0.4],
      [B4, 0.3], [A4, 0.3], [E4, 0.3], [D4, 0.8]
    ]
  },
  soaring: {
    name: "Song of Soaring",
    notes: ['▼', '◄', '▲', '▼', '◄', '▲'],
    game: "Majora's Mask",
    description: "Taught by Kaepora Gaebora to instantly warp to any activated Owl Statue across Termina.",
    melody: [
      [F4, 0.3], [B4, 0.3], [F5, 0.3], [F4, 0.3], [B4, 0.3], [F5, 0.3], [A5, 0.8]
    ]
  },
  gerudo: {
    name: "Gerudo Valley Theme",
    notes: [], // Bonus theme
    game: "Ocarina of Time",
    description: "The fiery flamenco guitar anthem echoing through the desert canyons of Gerudo Fortress.",
    melody: [
      [F4, 0.2], [A4, 0.2], [D5, 0.4],
      [F4, 0.2], [A4, 0.2], [D5, 0.4],
      [F4, 0.2], [A4, 0.2], [D5, 0.3], [C5, 0.3], [B4, 0.3], [A4, 0.6],
      [G4, 0.3], [A4, 0.8]
    ]
  },
  lightworld: {
    name: "Light World Overworld",
    notes: [], // Bonus theme
    game: "A Link to the Past",
    description: "The triumphant brass fanfare echoing across Hyrule's golden fields.",
    melody: [
      [C5, 0.3], [D5, 0.3], [E5, 0.6], [G5, 0.6],
      [F5, 0.3], [E5, 0.3], [D5, 0.6],
      [C5, 0.3], [D5, 0.3], [E5, 0.8]
    ]
  },
  darkworld: {
    name: "Dark World Theme",
    notes: [], // Bonus theme
    game: "A Link to the Past",
    description: "The ominous march of the shadowed land transformed by Ganon's evil wish.",
    melody: [
      [D4, 0.3], [F4, 0.3], [A4, 0.3], [C5, 0.3],
      [B4, 0.6], [G4, 0.6],
      [F4, 0.3], [G4, 0.3], [A4, 0.8]
    ]
  },
  taltal: {
    name: "Tal Tal Heights Theme",
    notes: [], // Bonus theme
    game: "Link's Awakening",
    description: "The energetic, march-like mountain anthem from Koholint Island's northern heights.",
    melody: [
      [C5, 0.25], [G4, 0.25], [C5, 0.25], [E5, 0.25], [G5, 0.5], [F5, 0.25], [E5, 0.25],
      [D5, 0.5], [G4, 0.5], [D5, 0.5], [F5, 0.5], [E5, 0.5], [D5, 0.5], [C5, 0.9]
    ]
  },
  kokiri: {
    name: "Kokiri Forest Theme",
    notes: [], // Bonus theme
    game: "Ocarina of Time",
    description: "The cheerful, carefree woodwind melody echoing under the canopy of the Kokiri Forest.",
    melody: [
      [G4, 0.3], [C5, 0.3], [E5, 0.3], [G5, 0.6],
      [A5, 0.3], [G5, 0.3], [F5, 0.3], [E5, 0.6],
      [D5, 0.3], [E5, 0.3], [F5, 0.3], [D5, 0.6], [C5, 0.9]
    ]
  },
  kakariko: {
    name: "Kakariko Village Theme",
    notes: [], // Bonus theme
    game: "Ocarina of Time / A Link to the Past",
    description: "A gentle, comforting acoustic melody welcoming weary travellers to Kakariko Village.",
    melody: [
      [D4, 0.4], [F4, 0.4], [A4, 0.4], [D5, 0.8],
      [C5, 0.4], [B4, 0.4], [A4, 0.8],
      [G4, 0.4], [A4, 0.4], [F4, 0.8], [D4, 1.0]
    ]
  },
  greatpalace: {
    name: "Great Palace Theme",
    notes: [], // Bonus theme
    game: "Zelda II: The Adventure of Link",
    description: "The fast-paced, heroic dungeon anthem guarding the Triforce of Courage.",
    melody: [
      [A4, 0.2], [A4, 0.2], [C5, 0.2], [D5, 0.2], [E5, 0.4], [D5, 0.2], [C5, 0.2],
      [A4, 0.4], [G4, 0.2], [A4, 0.6], [E5, 0.4], [D5, 0.4], [A4, 0.9]
    ]
  },
  overworld: {
    name: "Hyrule Overworld Main Theme",
    notes: [], // Bonus theme
    game: "The Legend of Zelda",
    description: "The iconic triumphant anthem echoing across the Kingdom of Hyrule.",
    melody: [
      // Fanfare Intro
      [A4, 0.4], [E4, 0.6], [A4, 0.2], [B4, 0.2], [C5, 0.2], [D5, 0.2],
      [E5, 0.8], [E5, 0.2], [F5, 0.2], [G5, 0.4], [A5, 0.8],
      // Main Theme A Section
      [A5, 0.35], [G5, 0.18], [F5, 0.18], [G5, 0.35], [A5, 0.7],
      [F5, 0.35], [E5, 0.18], [D5, 0.18], [E5, 0.35], [F5, 0.7],
      [D5, 0.35], [C5, 0.18], [B4, 0.18], [C5, 0.35], [D5, 0.7],
      [E5, 0.45], [E4, 0.45], [A4, 0.9],
      // Main Theme B Section (Hero's Journey Ascending Phrase)
      [A4, 0.3], [C5, 0.3], [E5, 0.3], [A5, 0.6],
      [G5, 0.3], [F5, 0.3], [E5, 0.3], [D5, 0.6],
      [C5, 0.3], [B4, 0.3], [A4, 1.0]
    ]
  }
};

export const OcarinaSidebarWidget: React.FC = () => {
  const [viewMode, setViewMode] = useState<'ocarina' | 'library'>('ocarina');
  const [noteHistory, setNoteHistory] = useState<string[]>([]);
  const [playedSong, setPlayedSong] = useState<OcarinaSong | null>(null);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [activeNoteKey, setActiveNoteKey] = useState<string | null>(null);
  const [unlockedSongs, setUnlockedSongs] = useState<string[]>([]);
  const [unlockBanner, setUnlockBanner] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const melodyTimeoutRef = useRef<number[]>([]);

  // Initialize or get Web Audio Context safely
  const getAudioContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtxRef.current = new AudioCtxClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play a single ocarina pitch tone
  const playNoteTone = (freq: number, durationSec: number = 0.4) => {
    if (soundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Flute / Ocarina sound synthesis setup: sine wave with slight vibrato
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Subtle vibrato
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.value = 5.5; // Hz
      vibratoGain.gain.value = freq * 0.015; // pitch bend depth
      vibrato.connect(osc.frequency);
      vibrato.start();

      // Envelope
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.05); // Attack
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec); // Decay/Release

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationSec);

      setTimeout(() => {
        try {
          vibrato.stop();
          vibrato.disconnect();
          osc.disconnect();
          gain.disconnect();
        } catch (_) {}
      }, durationSec * 1000 + 100);
    } catch (e) {
      console.warn('Audio tone error:', e);
    }
  };

  // Check if current note history matches any secret song
  useEffect(() => {
    if (noteHistory.length === 0) return;

    for (const key of Object.keys(OCARINA_SONGS)) {
      const song = OCARINA_SONGS[key];
      if (song.notes.length === 0) continue;

      const len = song.notes.length;
      if (noteHistory.length >= len) {
        const recentNotes = noteHistory.slice(noteHistory.length - len);
        const isMatch = song.notes.every((val, index) => val === recentNotes[index]);

        if (isMatch) {
          // Unlocked secret song + paired bonus theme!
          setPlayedSong(song);
          const bonusTheme = BONUS_UNLOCK_MAP[song.name];
          setUnlockedSongs(prev => {
            const next = new Set(prev);
            next.add(song.name);
            if (bonusTheme) next.add(bonusTheme);
            return Array.from(next);
          });

          if (bonusTheme) {
            setUnlockBanner(`Unlocked "${song.name}" & Bonus Theme "${bonusTheme}"!`);
          } else {
            setUnlockBanner(`Unlocked "${song.name}"!`);
          }
          setTimeout(() => setUnlockBanner(null), 5000);

          playMelody(song.melody);
          setNoteHistory([]); // Reset history after discovery
          break;
        }
      }
    }
  }, [noteHistory]);

  // Play full song melody sequence
  const playMelody = (melody: [number, number][]) => {
    // Clear any existing timers
    melodyTimeoutRef.current.forEach(t => clearTimeout(t));
    melodyTimeoutRef.current = [];

    setIsPlayingMelody(true);
    let delay = 0;

    melody.forEach(([freq, dur], idx) => {
      const t = window.setTimeout(() => {
        playNoteTone(freq, dur);
        if (idx === melody.length - 1) {
          const endTimer = window.setTimeout(() => {
            setIsPlayingMelody(false);
          }, dur * 1000 + 200);
          melodyTimeoutRef.current.push(endTimer);
        }
      }, delay * 1000);
      melodyTimeoutRef.current.push(t);
      delay += dur;
    });
  };

  // Play a random song from all available songs
  const playRandomSong = () => {
    const keys = Object.keys(OCARINA_SONGS);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const song = OCARINA_SONGS[randomKey];
    setPlayedSong(song);

    const bonusTheme = BONUS_UNLOCK_MAP[song.name];
    setUnlockedSongs(prev => {
      const next = new Set(prev);
      next.add(song.name);
      if (bonusTheme) next.add(bonusTheme);
      return Array.from(next);
    });

    playMelody(song.melody);
  };

  const handleNoteClick = (keyName: string) => {
    const noteData = NOTE_FREQS[keyName];
    if (!noteData) return;

    setActiveNoteKey(keyName);
    setTimeout(() => setActiveNoteKey(null), 250);

    playNoteTone(noteData.freq, 0.45);

    setNoteHistory(prev => {
      const updated = [...prev, noteData.label];
      // Keep last 12 notes max
      return updated.slice(-12);
    });
  };

  const clearNotes = () => {
    setNoteHistory([]);
  };

  const allSongs = Object.values(OCARINA_SONGS);
  const totalSongsCount = allSongs.length;
  const unlockedCount = unlockedSongs.length;

  return (
    <div className="bg-gradient-to-br from-[#1b4325] via-[#286338] to-[#143d20] border-2 border-amber-400 rounded-2xl p-4 shadow-xl text-white relative overflow-hidden group">
      {/* Background Triforce / Golden Forest Glow Aura */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-400/25 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/40 transition-all duration-700" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-amber-400/40 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-400/20 border border-amber-300/60 rounded-lg shadow-sm backdrop-blur-sm">
            <Disc className={`w-4 h-4 text-amber-300 ${isPlayingMelody ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1 drop-shadow-sm">
              <span>{viewMode === 'library' ? 'Song Library' : 'Ocarina of Time'}</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
            </h4>
            <p className="text-[9px] text-emerald-100 font-serif">
              {viewMode === 'library' 
                ? `${unlockedCount} of ${totalSongsCount} Songs Discovered`
                : 'Play secret songs to unlock music'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode(viewMode === 'ocarina' ? 'library' : 'ocarina')}
            className="p-1.5 bg-amber-400/20 hover:bg-amber-400/40 border border-amber-300/50 text-amber-200 hover:text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-serif font-bold uppercase"
            title={viewMode === 'ocarina' ? "Open Song Library" : "Back to Ocarina"}
          >
            {viewMode === 'ocarina' ? (
              <>
                <BookOpen className="w-3.5 h-3.5 text-yellow-300" />
                <span className="hidden sm:inline">Library</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-3.5 h-3.5 text-yellow-300" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-1.5 text-emerald-200 hover:text-amber-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title={soundMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
          </button>
        </div>
      </div>

      {/* VIEWMODE: LIBRARY */}
      {viewMode === 'library' ? (
        <div className="my-3 space-y-2 relative z-10 max-h-80 overflow-y-auto pr-1">
          <div className="text-[10px] text-emerald-100 font-serif mb-2 flex items-center justify-between border-b border-amber-400/20 pb-1">
            <span>Discovered Melodies & Themes:</span>
            <span className="text-amber-300 font-bold font-mono">{unlockedCount} / {totalSongsCount}</span>
          </div>

          {allSongs.map((song, idx) => {
            const isOcarinaSong = song.notes.length > 0;
            const isUnlocked = unlockedSongs.includes(song.name) || isOcarinaSong;
            const isBonusThemeUnlocked = unlockedSongs.includes(song.name);
            const triggerSong = BONUS_TRIGGER_REVERSE_MAP[song.name];
            const unlockedBonus = BONUS_UNLOCK_MAP[song.name];

            return (
              <div 
                key={idx}
                className={`p-2.5 rounded-xl border transition-all ${
                  (isOcarinaSong || isBonusThemeUnlocked)
                    ? 'bg-amber-400/15 border-amber-300/50 hover:bg-amber-400/25' 
                    : 'bg-black/40 border-white/10 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      {(isOcarinaSong || isBonusThemeUnlocked) ? (
                        <Unlock className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-red-300/80 flex-shrink-0" />
                      )}
                      <h5 className={`font-serif text-xs font-bold ${(isOcarinaSong || isBonusThemeUnlocked) ? 'text-yellow-200' : 'text-gray-300'}`}>
                        {song.name}
                      </h5>
                    </div>

                    <p className="text-[8px] text-amber-300/80 uppercase font-mono mt-0.5 flex items-center gap-1.5">
                      <span>{song.game}</span>
                      {!isOcarinaSong && (
                        <span className="px-1 py-0.2 bg-yellow-400/20 text-yellow-300 rounded text-[7px] border border-amber-400/30 font-serif">
                          Bonus Theme
                        </span>
                      )}
                    </p>

                    <p className="text-[9px] text-emerald-100/90 font-serif mt-1 italic leading-tight">
                      {(!isOcarinaSong && !isBonusThemeUnlocked)
                        ? `🔒 Locked — Play "${triggerSong}" on the Ocarina to unlock!`
                        : song.description
                      }
                    </p>

                    {/* Note sequence or Unlock trigger info */}
                    <div className="mt-1.5 flex items-center gap-1 flex-wrap">
                      {isOcarinaSong ? (
                        <>
                          {song.notes.map((n, i) => (
                            <span 
                              key={i} 
                              className="px-1.5 py-0.2 rounded text-[9px] font-bold font-serif bg-amber-400/30 text-yellow-200 border border-amber-400/40"
                            >
                              {n}
                            </span>
                          ))}
                          {unlockedBonus && (
                            <span className="text-[8px] text-amber-300/90 font-serif ml-1">
                              → Unlocks: <strong className="text-yellow-200">{unlockedBonus}</strong>
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[8px] text-amber-300/80 font-mono">
                          {isBonusThemeUnlocked 
                            ? `✓ Unlocked via ${triggerSong}` 
                            : `Requires: ${triggerSong}`
                          }
                        </span>
                      )}
                    </div>
                  </div>

                  {(isOcarinaSong || isBonusThemeUnlocked) && (
                    <button
                      onClick={() => {
                        setPlayedSong(song);
                        if (!unlockedSongs.includes(song.name)) {
                          setUnlockedSongs(prev => [...prev, song.name]);
                        }
                        playMelody(song.melody);
                      }}
                      disabled={isPlayingMelody}
                      className="p-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-lg shadow transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center flex-shrink-0 mt-1"
                      title="Play Song Melody"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEWMODE: OCARINA PLAYER */
        <>
          {/* Note Display Staff / History */}
          <div className="my-3 bg-black/45 border border-amber-400/40 rounded-xl p-2.5 min-h-[44px] flex items-center justify-between gap-2 shadow-inner backdrop-blur-sm relative z-10">
            <div className="flex items-center gap-1.5 flex-wrap flex-grow">
              {noteHistory.length === 0 ? (
                <span className="text-[10px] text-emerald-200/90 font-serif italic pl-1">
                  Press C-Buttons or A to play...
                </span>
              ) : (
                noteHistory.map((note, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400/30 border-2 border-amber-300 text-yellow-200 font-extrabold text-xs font-serif shadow-md animate-bounce"
                    style={{ animationDuration: '0.4s' }}
                  >
                    {note}
                  </span>
                ))
              )}
            </div>

            {noteHistory.length > 0 && (
              <button
                onClick={clearNotes}
                className="text-[9px] text-emerald-200 hover:text-red-300 font-serif uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/30 hover:bg-black/50 border border-white/10 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Ocarina Interactive Buttons Layout */}
          <div className="py-2 flex flex-col items-center justify-center relative z-10">
            {/* C-Up */}
            <div className="mb-1">
              <button
                onClick={() => handleNoteClick('CUp')}
                className={`w-9 h-9 rounded-full ${NOTE_FREQS.CUp.color} ${NOTE_FREQS.CUp.hoverColor} font-bold text-sm shadow-md active:scale-90 transition-transform flex items-center justify-center cursor-pointer ${activeNoteKey === 'CUp' ? 'ring-2 ring-white scale-110' : ''}`}
                title="C-Up (F5)"
              >
                ▲
              </button>
            </div>

            {/* C-Left, A (Center), C-Right */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNoteClick('CLeft')}
                className={`w-9 h-9 rounded-full ${NOTE_FREQS.CLeft.color} ${NOTE_FREQS.CLeft.hoverColor} font-bold text-sm shadow-md active:scale-90 transition-transform flex items-center justify-center cursor-pointer ${activeNoteKey === 'CLeft' ? 'ring-2 ring-white scale-110' : ''}`}
                title="C-Left (B4)"
              >
                ◄
              </button>

              <button
                onClick={() => handleNoteClick('A')}
                className={`w-10 h-10 rounded-full ${NOTE_FREQS.A.color} ${NOTE_FREQS.A.hoverColor} font-bold text-xs shadow-lg active:scale-90 transition-transform flex items-center justify-center cursor-pointer border-2 ${activeNoteKey === 'A' ? 'ring-2 ring-white scale-110' : ''}`}
                title="A Button (D4)"
              >
                A
              </button>

              <button
                onClick={() => handleNoteClick('CRight')}
                className={`w-9 h-9 rounded-full ${NOTE_FREQS.CRight.color} ${NOTE_FREQS.CRight.hoverColor} font-bold text-sm shadow-md active:scale-90 transition-transform flex items-center justify-center cursor-pointer ${activeNoteKey === 'CRight' ? 'ring-2 ring-white scale-110' : ''}`}
                title="C-Right (A4)"
              >
                ►
              </button>
            </div>

            {/* C-Down */}
            <div className="mt-1">
              <button
                onClick={() => handleNoteClick('CDown')}
                className={`w-9 h-9 rounded-full ${NOTE_FREQS.CDown.color} ${NOTE_FREQS.CDown.hoverColor} font-bold text-sm shadow-md active:scale-90 transition-transform flex items-center justify-center cursor-pointer ${activeNoteKey === 'CDown' ? 'ring-2 ring-white scale-110' : ''}`}
                title="C-Down (F4)"
              >
                ▼
              </button>
            </div>
          </div>

          {/* Secret Songs Cheat Sheet & Active Track Info */}
          <div className="mt-3 pt-3 border-t border-amber-400/30 space-y-2 relative z-10">
            {playedSong ? (
              <div className="bg-amber-400/20 border border-amber-300/60 rounded-xl p-2.5 space-y-1 text-center animate-fade-in backdrop-blur-sm">
                <div className="flex items-center justify-center gap-1.5 text-yellow-200 font-serif font-bold text-xs">
                  <Music className="w-3.5 h-3.5 animate-bounce" />
                  <span>Playing: {playedSong.name}</span>
                </div>
                <p className="text-[9px] text-emerald-100 italic font-serif">"{playedSong.description}"</p>
                <div className="text-[8px] text-amber-300 uppercase tracking-widest font-mono font-bold">
                  Game: {playedSong.game}
                </div>
              </div>
            ) : (
              <div className="text-[9px] text-emerald-100 text-center font-serif">
                <span className="text-amber-300 font-bold uppercase tracking-wider">Secret Song Tips:</span>
                <div className="mt-1 flex items-center justify-center gap-1.5 flex-wrap text-yellow-200 font-mono text-[8px] font-semibold max-h-20 overflow-y-auto pr-0.5">
                  <span title="Song of Storms" className="bg-black/30 px-1.5 py-0.5 rounded border border-amber-400/30">Storms: A ▼ ▲ A ▼ ▲</span>
                  <span title="Zelda's Lullaby" className="bg-black/30 px-1.5 py-0.5 rounded border border-amber-400/30">Lullaby: ◄ ▲ ► ◄ ▲ ►</span>
                  <span title="Song of Time" className="bg-black/30 px-1.5 py-0.5 rounded border border-amber-400/30">Time: ► A ▼ ► A ▼</span>
                  <span title="Epona's Song" className="bg-black/30 px-1.5 py-0.5 rounded border border-amber-400/30">Epona: ▲ ◄ ► ▲ ◄ ►</span>
                  <span title="Saria's Song" className="bg-black/30 px-1.5 py-0.5 rounded border border-amber-400/30">Saria: ▼ ► ◄ ▼ ► ◄</span>
                  <span title="Sun's Song" className="bg-black/30 px-1.5 py-0.5 rounded border border-amber-400/30">Sun: ► ▼ ▲ ► ▼ ▲</span>
                </div>
              </div>
            )}

            {/* Navigation & Random Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={playRandomSong}
                disabled={isPlayingMelody}
                className="py-2 px-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-emerald-950 font-serif font-bold text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md border border-amber-200 disabled:opacity-50 rounded-xl"
              >
                <Music className="w-3 h-3" />
                <span>Random Song</span>
              </button>

              <button
                onClick={() => setViewMode('library')}
                className="py-2 px-2 bg-black/40 hover:bg-black/60 text-amber-300 font-serif font-bold text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md border border-amber-400/40 rounded-xl"
              >
                <BookOpen className="w-3 h-3" />
                <span>Song Library</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
