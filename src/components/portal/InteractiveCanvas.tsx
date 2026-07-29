import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  RotateCcw, 
  Trash2, 
  Move, 
  Type, 
  Pencil, 
  Sparkles, 
  Palette, 
  Eraser,
  Square,
  Circle,
  Triangle,
  Minus,
  ArrowRight,
  Star,
  Layers,
  Save,
  Check,
  Zap,
  Maximize2
} from 'lucide-react';

export interface ClipArtSticker {
  id: string;
  name: string;
  category: 'characters' | 'items' | 'symbols' | 'creatures';
  iconSvg: React.ReactNode;
  defaultWidth: number;
  defaultHeight: number;
}

export type VectorType = 'line' | 'arrow' | 'rect' | 'circle' | 'triangle' | 'star' | 'polyline';

export interface CanvasElement {
  id: string;
  type: 'sticker' | 'text' | 'drawing' | 'vector';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  zIndex: number;
  // Sticker specific
  stickerId?: string;
  // Text specific
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  // Drawing specific
  points?: { x: number; y: number }[];
  strokeWidth?: number;
  strokeColor?: string;
  // Vector specific
  vectorType?: VectorType;
  fillColor?: string;
  strokeStyle?: 'solid' | 'dashed';
  x2?: number;
  y2?: number;
}

const CLIPART_LIBRARY: ClipArtSticker[] = [
  {
    id: 'triforce',
    name: 'Relic Triforce',
    category: 'symbols',
    defaultWidth: 100,
    defaultHeight: 90,
    iconSvg: (
      <svg viewBox="0 0 100 90" className="w-full h-full drop-shadow-md">
        <polygon points="50,5 5,85 95,85" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
        <polygon points="50,85 27.5,45 72.5,45" fill="#FEF3C7" />
        <polygon points="50,5 27.5,45 72.5,45" fill="#FBBF24" />
        <polygon points="27.5,45 5,85 50,85" fill="#D97706" />
        <polygon points="72.5,45 50,85 95,85" fill="#B45309" />
      </svg>
    )
  },
  {
    id: 'master-sword',
    name: 'Master Sword',
    category: 'items',
    defaultWidth: 70,
    defaultHeight: 140,
    iconSvg: (
      <svg viewBox="0 0 80 160" className="w-full h-full drop-shadow-lg">
        <polygon points="37,10 43,10 45,100 35,100" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
        <polygon points="40,5 43,10 37,10" fill="#CBD5E1" />
        <line x1="40" y1="10" x2="40" y2="95" stroke="#94A3B8" strokeWidth="2" />
        <path d="M 20 100 C 30 110, 50 110, 60 100 C 65 105, 70 105, 68 112 C 55 118, 25 118, 12 112 C 10 105, 15 105, 20 100 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
        <circle cx="40" cy="106" r="4" fill="#F59E0B" />
        <rect x="36" y="115" width="8" height="28" rx="2" fill="#1E40AF" stroke="#1E3A8A" />
        <circle cx="40" cy="148" r="6" fill="#F59E0B" stroke="#B45309" />
      </svg>
    )
  },
  {
    id: 'hylian-shield',
    name: 'Hylian Shield',
    category: 'items',
    defaultWidth: 100,
    defaultHeight: 120,
    iconSvg: (
      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
        <path d="M 10 10 L 90 10 L 85 70 Q 50 115 50 115 Q 50 115 15 70 Z" fill="#1E3A8A" stroke="#94A3B8" strokeWidth="4" />
        <path d="M 15 15 L 85 15 L 80 68 Q 50 108 50 108 Q 50 108 20 68 Z" fill="#2563EB" />
        <path d="M 50 45 L 35 55 L 42 62 L 30 75 L 45 70 L 50 85 L 55 70 L 70 75 L 58 62 L 65 55 Z" fill="#DC2626" />
        <polygon points="50,22 42,35 58,35" fill="#F59E0B" />
      </svg>
    )
  },
  {
    id: 'heart-container',
    name: 'Heart Container',
    category: 'items',
    defaultWidth: 90,
    defaultHeight: 90,
    iconSvg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M 50 88 C 20 65, 5 45, 15 25 C 23 8, 42 12, 50 28 C 58 12, 77 8, 85 25 C 95 45, 80 65, 50 88 Z" fill="#EF4444" stroke="#F59E0B" strokeWidth="5" />
        <path d="M 50 80 C 25 60, 12 42, 20 27 C 26 15, 40 18, 50 32 C 60 18, 74 15, 80 27 C 88 42, 75 60, 50 80 Z" fill="#DC2626" />
        <circle cx="35" cy="28" r="5" fill="#FCA5A5" opacity="0.8" />
      </svg>
    )
  },
  {
    id: 'rupee-green',
    name: 'Green Rupee',
    category: 'items',
    defaultWidth: 60,
    defaultHeight: 100,
    iconSvg: (
      <svg viewBox="0 0 60 100" className="w-full h-full drop-shadow-md">
        <polygon points="30,5 55,28 55,72 30,95 5,72 5,28" fill="#10B981" stroke="#047857" strokeWidth="3" />
        <polygon points="30,12 48,32 48,68 30,88 12,68 12,32" fill="#34D399" />
        <polygon points="30,12 48,32 30,50 12,32" fill="#A7F3D0" />
      </svg>
    )
  },
  {
    id: 'korok-leaf',
    name: 'Forest Korok',
    category: 'creatures',
    defaultWidth: 100,
    defaultHeight: 100,
    iconSvg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M 50 10 C 25 25, 10 50, 20 80 C 45 95, 75 85, 85 60 C 90 35, 70 15, 50 10 Z" fill="#65A30D" stroke="#3F6212" strokeWidth="3" />
        <circle cx="38" cy="45" r="5" fill="#1E293B" />
        <circle cx="62" cy="45" r="5" fill="#1E293B" />
        <path d="M 45 62 Q 50 68 55 62" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 50 10 L 50 85" stroke="#4D7C0F" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: 'majoras-mask',
    name: 'Majoras Mask',
    category: 'symbols',
    defaultWidth: 110,
    defaultHeight: 100,
    iconSvg: (
      <svg viewBox="0 0 120 110" className="w-full h-full drop-shadow-xl">
        <path d="M 60 10 C 25 10, 10 35, 15 65 Q 60 105 60 105 Q 60 105 105 65 C 110 35, 95 10, 60 10 Z" fill="#7E22CE" stroke="#581C87" strokeWidth="4" />
        <circle cx="38" cy="50" r="16" fill="#F59E0B" stroke="#DC2626" strokeWidth="4" />
        <circle cx="82" cy="50" r="16" fill="#F59E0B" stroke="#DC2626" strokeWidth="4" />
        <circle cx="38" cy="50" r="6" fill="#000" />
        <circle cx="82" cy="50" r="6" fill="#000" />
        <polygon points="20,15 5,0 30,22" fill="#E11D48" />
        <polygon points="100,15 115,0 90,22" fill="#E11D48" />
        <polygon points="60,5 60,-12 60,15" stroke="#2563EB" strokeWidth="4" />
      </svg>
    )
  },
  {
    id: 'navi-fairy',
    name: 'Navi Fairy',
    category: 'creatures',
    defaultWidth: 90,
    defaultHeight: 90,
    iconSvg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
        <circle cx="50" cy="50" r="22" fill="#60A5FA" filter="drop-shadow(0 0 10px #3B82F6)" />
        <circle cx="50" cy="50" r="14" fill="#BFDBFE" />
        <ellipse cx="25" cy="35" rx="20" ry="10" fill="#E0F2FE" opacity="0.85" transform="rotate(-25 25 35)" />
        <ellipse cx="75" cy="35" rx="20" ry="10" fill="#E0F2FE" opacity="0.85" transform="rotate(25 75 35)" />
        <ellipse cx="28" cy="58" rx="15" ry="7" fill="#E0F2FE" opacity="0.7" transform="rotate(15 28 58)" />
        <ellipse cx="72" cy="58" rx="15" ry="7" fill="#E0F2FE" opacity="0.7" transform="rotate(-15 72 58)" />
      </svg>
    )
  }
];

const CANVAS_BACKGROUNDS = [
  { id: 'hyrule-field', label: '🌿 Hyrule Field', class: 'bg-gradient-to-b from-sky-200 via-amber-50 to-emerald-200' },
  { id: 'temple-time', label: '🏛️ Temple of Time', class: 'bg-gradient-to-b from-amber-100 via-stone-200 to-amber-200' },
  { id: 'lost-woods', label: '🌲 Lost Woods', class: 'bg-gradient-to-b from-emerald-950 via-teal-900 to-emerald-900 text-white' },
  { id: 'parchment', label: '📜 Royal Parchment', class: 'bg-[#F9F3E5] border-amber-300' },
  { id: 'dark-world', label: '🌌 Dark Realm', class: 'bg-gradient-to-b from-purple-950 via-indigo-950 to-black text-white' },
];

export function InteractiveCanvas() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeBg, setActiveBg] = useState(CANVAS_BACKGROUNDS[0]);
  
  // Tools: select, text, draw, eraser, vector
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'draw' | 'eraser' | 'vector'>('select');
  const [activeVectorType, setActiveVectorType] = useState<VectorType>('rect');
  
  // Custom Inputs
  const [textInput, setTextInput] = useState('Hero of Time');
  const [textColor, setTextColor] = useState('#B45309');
  const [fontSize, setFontSize] = useState(24);
  
  // Drawing & Vector styling
  const [drawColor, setDrawColor] = useState('#D97706');
  const [fillColor, setFillColor] = useState('#FBBF24');
  const [drawWidth, setDrawWidth] = useState(4);
  const [strokeStyle, setStrokeStyle] = useState<'solid' | 'dashed'>('solid');

  // Drawing & Vector creation state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);

  // Dragging state for canvas element
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Confirmation UI state for reset
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Add Sticker
  const handleAddSticker = (sticker: ClipArtSticker) => {
    const newElement: CanvasElement = {
      id: `elem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: 'sticker',
      stickerId: sticker.id,
      x: 180 + Math.random() * 60,
      y: 120 + Math.random() * 60,
      width: sticker.defaultWidth,
      height: sticker.defaultHeight,
      rotation: 0,
      scale: 1,
      zIndex: elements.length + 1,
    };
    setElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
    setActiveTool('select');
  };

  // Add Text
  const handleAddText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const newElement: CanvasElement = {
      id: `elem-${Date.now()}`,
      type: 'text',
      text: textInput,
      color: textColor,
      fontSize: fontSize,
      fontFamily: 'serif',
      x: 200,
      y: 150,
      width: 200,
      height: 60,
      rotation: 0,
      scale: 1,
      zIndex: elements.length + 1,
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
    setActiveTool('select');
  };

  // Mouse Down on Canvas (Start Draw / Vector / Erase)
  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (!canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'eraser') {
      // Erase element if clicked near or clicked element
      return;
    }

    if (activeTool === 'draw') {
      setIsDrawing(true);
      setCurrentStroke([{ x, y }]);
    } else if (activeTool === 'vector') {
      setIsDrawing(true);
      setStartPos({ x, y });
      setCurrentPos({ x, y });
    }
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'draw') {
      setCurrentStroke(prev => [...prev, { x, y }]);
    } else if (activeTool === 'vector') {
      setCurrentPos({ x, y });
    }
  };

  const handleMouseUpCanvas = () => {
    if (!isDrawing) return;

    if (activeTool === 'draw' && currentStroke.length > 1) {
      const newElement: CanvasElement = {
        id: `draw-${Date.now()}`,
        type: 'drawing',
        x: 0,
        y: 0,
        width: 600,
        height: 480,
        rotation: 0,
        scale: 1,
        zIndex: elements.length + 1,
        points: currentStroke,
        strokeColor: drawColor,
        strokeWidth: drawWidth,
      };
      setElements(prev => [...prev, newElement]);
    } else if (activeTool === 'vector') {
      const width = Math.abs(currentPos.x - startPos.x);
      const height = Math.abs(currentPos.y - startPos.y);

      // Don't add tiny accidental clicks
      if (width > 5 || height > 5 || activeVectorType === 'line' || activeVectorType === 'arrow') {
        const minX = Math.min(startPos.x, currentPos.x);
        const minY = Math.min(startPos.y, currentPos.y);

        const newElement: CanvasElement = {
          id: `vec-${Date.now()}`,
          type: 'vector',
          vectorType: activeVectorType,
          x: activeVectorType === 'line' || activeVectorType === 'arrow' ? startPos.x : minX,
          y: activeVectorType === 'line' || activeVectorType === 'arrow' ? startPos.y : minY,
          x2: currentPos.x,
          y2: currentPos.y,
          width: Math.max(20, width),
          height: Math.max(20, height),
          rotation: 0,
          scale: 1,
          zIndex: elements.length + 1,
          strokeColor: drawColor,
          fillColor: fillColor,
          strokeWidth: drawWidth,
          strokeStyle: strokeStyle,
        };
        setElements(prev => [...prev, newElement]);
        setSelectedElementId(newElement.id);
      }
    }

    setIsDrawing(false);
    setCurrentStroke([]);
  };

  // Element Click in Eraser mode
  const handleElementClickInEraser = (e: React.MouseEvent, elemId: string) => {
    if (activeTool === 'eraser') {
      e.stopPropagation();
      setElements(prev => prev.filter(item => item.id !== elemId));
      if (selectedElementId === elemId) setSelectedElementId(null);
    }
  };

  // Element Drag Handlers
  const handleElementMouseDown = (e: React.MouseEvent, elem: CanvasElement) => {
    if (activeTool === 'eraser') {
      handleElementClickInEraser(e, elem.id);
      return;
    }
    if (activeTool === 'draw' || activeTool === 'vector') return;

    e.stopPropagation();
    setSelectedElementId(elem.id);
    setDraggingId(elem.id);

    if (canvasContainerRef.current) {
      const rect = canvasContainerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - elem.x,
        y: e.clientY - rect.top - elem.y,
      });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDrawing) {
      handleMouseMoveCanvas(e);
      return;
    }

    if (draggingId && canvasContainerRef.current) {
      const rect = canvasContainerRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;

      setElements(prev =>
        prev.map(item =>
          item.id === draggingId ? { ...item, x: newX, y: newY } : item
        )
      );
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDrawing) {
      handleMouseUpCanvas();
    }
    setDraggingId(null);
  };

  // Selected element controls
  const selectedElement = elements.find(e => e.id === selectedElementId);

  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (!selectedElementId) return;
    setElements(prev =>
      prev.map(item => (item.id === selectedElementId ? { ...item, ...updates } : item))
    );
  };

  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    setElements(prev => prev.filter(item => item.id !== selectedElementId));
    setSelectedElementId(null);
  };

  // Robust Reset Canvas without blocked native confirms
  const handleExecuteReset = () => {
    setElements([]);
    setSelectedElementId(null);
    setShowResetConfirm(false);
    setNotification('Canvas cleared cleanly!');
    setTimeout(() => setNotification(null), 3000);
  };

  // Save Artwork into User Profile Local Gallery
  const handleSaveToProfileGallery = () => {
    if (!canvasContainerRef.current || elements.length === 0) return;
    try {
      const width = canvasContainerRef.current.clientWidth || 700;
      const height = canvasContainerRef.current.clientHeight || 450;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill background
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(0, 0, width, height);

      // Render drawings
      elements.forEach(elem => {
        if (elem.type === 'drawing' && elem.points && elem.points.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = elem.strokeColor || '#D97706';
          ctx.lineWidth = elem.strokeWidth || 4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.moveTo(elem.points[0].x, elem.points[0].y);
          for (let i = 1; i < elem.points.length; i++) {
            ctx.lineTo(elem.points[i].x, elem.points[i].y);
          }
          ctx.stroke();
        } else if (elem.type === 'text' && elem.text) {
          ctx.font = `${elem.fontSize || 24}px serif`;
          ctx.fillStyle = elem.color || '#B45309';
          ctx.fillText(elem.text, elem.x, elem.y + (elem.fontSize || 24));
        }
      });

      const dataUrl = canvas.toDataURL('image/png');

      // Save to local storage gallery items
      const existing = localStorage.getItem('zelda_user_artwork_gallery');
      const gallery = existing ? JSON.parse(existing) : [];
      gallery.unshift({
        id: `art-${Date.now()}`,
        title: `Hylian Masterpiece #${gallery.length + 1}`,
        imageData: dataUrl,
        date: new Date().toLocaleDateString(),
        likes: 12 + Math.floor(Math.random() * 20),
      });

      localStorage.setItem('zelda_user_artwork_gallery', JSON.stringify(gallery));

      setNotification('Saved to your Public Profile Gallery!');
      setTimeout(() => setNotification(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  // Export Canvas as PNG
  const handleExportPng = async () => {
    if (!canvasContainerRef.current) return;
    try {
      const width = canvasContainerRef.current.clientWidth || 700;
      const height = canvasContainerRef.current.clientHeight || 450;

      const canvas = document.createElement('canvas');
      canvas.width = width * 2; // HiDPI
      canvas.height = height * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(2, 2);

      // Fill background
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(0, 0, width, height);

      // Render elements
      elements.forEach(elem => {
        if (elem.type === 'drawing' && elem.points && elem.points.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = elem.strokeColor || '#D97706';
          ctx.lineWidth = elem.strokeWidth || 4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.moveTo(elem.points[0].x, elem.points[0].y);
          for (let i = 1; i < elem.points.length; i++) {
            ctx.lineTo(elem.points[i].x, elem.points[i].y);
          }
          ctx.stroke();
        } else if (elem.type === 'text' && elem.text) {
          ctx.font = `${elem.fontSize || 24}px serif`;
          ctx.fillStyle = elem.color || '#B45309';
          ctx.fillText(elem.text, elem.x, elem.y + (elem.fontSize || 24));
        }
      });

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Zelda_Fan_Artwork_${Date.now()}.png`;
      a.click();

      setNotification('Artwork downloaded as PNG image!');
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {
      console.error("Export error", e);
    }
  };

  // Vector Shape SVG Renderer Helper
  const renderVectorShape = (elem: CanvasElement) => {
    const { vectorType, width, height, strokeColor, fillColor, strokeWidth, strokeStyle, x2, y2 } = elem;
    const dash = strokeStyle === 'dashed' ? '6,6' : undefined;

    switch (vectorType) {
      case 'line':
        return (
          <line
            x1="0"
            y1="0"
            x2={x2 ? x2 - elem.x : width}
            y2={y2 ? y2 - elem.y : height}
            stroke={strokeColor || '#D97706'}
            strokeWidth={strokeWidth || 3}
            strokeDasharray={dash}
          />
        );
      case 'arrow':
        const dx = (x2 ? x2 - elem.x : width);
        const dy = (y2 ? y2 - elem.y : height);
        return (
          <g>
            <defs>
              <marker id={`arrow-${elem.id}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeColor || '#D97706'} />
              </marker>
            </defs>
            <line
              x1="0"
              y1="0"
              x2={dx}
              y2={dy}
              stroke={strokeColor || '#D97706'}
              strokeWidth={strokeWidth || 3}
              strokeDasharray={dash}
              markerEnd={`url(#arrow-${elem.id})`}
            />
          </g>
        );
      case 'rect':
        return (
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill={fillColor || '#FBBF24'}
            stroke={strokeColor || '#B45309'}
            strokeWidth={strokeWidth || 3}
            strokeDasharray={dash}
            rx="4"
          />
        );
      case 'circle':
        return (
          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={width / 2}
            ry={height / 2}
            fill={fillColor || '#FBBF24'}
            stroke={strokeColor || '#B45309'}
            strokeWidth={strokeWidth || 3}
            strokeDasharray={dash}
          />
        );
      case 'triangle':
        return (
          <polygon
            points={`${width / 2},0 0,${height} ${width},${height}`}
            fill={fillColor || '#FBBF24'}
            stroke={strokeColor || '#B45309'}
            strokeWidth={strokeWidth || 3}
            strokeDasharray={dash}
          />
        );
      case 'star':
        return (
          <polygon
            points={`${width/2},0 ${width*0.65},${height*0.35} ${width},${height*0.35} ${width*0.75},${height*0.6} ${width*0.85},${height} ${width/2},${height*0.75} ${width*0.15},${height} ${width*0.25},${height*0.6} 0,${height*0.35} ${width*0.35},${height*0.35}`}
            fill={fillColor || '#FBBF24'}
            stroke={strokeColor || '#B45309'}
            strokeWidth={strokeWidth || 3}
            strokeDasharray={dash}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-emerald-950 border border-amber-400/40 rounded-2xl p-5 text-amber-100 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
              Interactive Design & Vector Studio
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-yellow-200">
            Hylian Fan Art & Vector Canvas
          </h2>
          <p className="text-xs text-amber-100/80 font-serif mt-0.5">
            Clip art stickers, vector shape tools (lines, arrows, rectangles, stars), eraser, and custom inscriptions!
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Reset Confirmation Button */}
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 rounded-xl text-xs font-serif font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Canvas</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-rose-950/90 border border-rose-500 p-1.5 rounded-xl animate-fade-in">
              <span className="text-[10px] text-rose-200 font-serif font-bold px-1">Clear All?</span>
              <button
                onClick={handleExecuteReset}
                className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-1 bg-black/40 hover:bg-black/60 text-rose-200 rounded text-xs cursor-pointer"
              >
                No
              </button>
            </div>
          )}

          <button
            onClick={handleSaveToProfileGallery}
            className="px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-400/50 text-white font-serif font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save to Public Profile Gallery</span>
          </button>

          <button
            onClick={handleExportPng}
            className="px-4 py-2 bg-amber-400 hover:bg-yellow-500 text-amber-950 font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="py-2 px-4 bg-emerald-800 text-emerald-100 border border-emerald-500 rounded-xl text-xs font-serif text-center animate-pulse shadow-md">
          {notification}
        </div>
      )}

      {/* Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Toolbar */}
        <div className="lg:col-span-1 space-y-4 bg-white/90 border border-zelda-border-sand rounded-2xl p-4 shadow-md">
          <h4 className="font-serif text-sm font-bold text-zelda-charcoal uppercase tracking-wider border-b border-zelda-border-sand pb-2 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-zelda-gold" />
            <span>Studio Tools & Library</span>
          </h4>

          {/* Master Tool Switcher */}
          <div className="grid grid-cols-5 gap-1 bg-amber-50 p-1 rounded-xl border border-zelda-border-sand/60">
            <button
              onClick={() => setActiveTool('select')}
              title="Move & Select Tool"
              className={`py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center justify-center ${
                activeTool === 'select' ? 'bg-zelda-gold text-white shadow-xs' : 'text-zelda-charcoal hover:bg-amber-100/50'
              }`}
            >
              <Move className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTool('draw')}
              title="Freehand Draw"
              className={`py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center justify-center ${
                activeTool === 'draw' ? 'bg-zelda-gold text-white shadow-xs' : 'text-zelda-charcoal hover:bg-amber-100/50'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTool('vector')}
              title="Vector Shapes Tool"
              className={`py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center justify-center ${
                activeTool === 'vector' ? 'bg-zelda-gold text-white shadow-xs' : 'text-zelda-charcoal hover:bg-amber-100/50'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTool('text')}
              title="Text Inscription"
              className={`py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center justify-center ${
                activeTool === 'text' ? 'bg-zelda-gold text-white shadow-xs' : 'text-zelda-charcoal hover:bg-amber-100/50'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTool('eraser')}
              title="Eraser Tool"
              className={`py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center justify-center ${
                activeTool === 'eraser' ? 'bg-rose-600 text-white shadow-xs' : 'text-zelda-charcoal hover:bg-amber-100/50'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Background Selector */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal font-bold">
              Canvas Realm Background
            </label>
            <select
              value={activeBg.id}
              onChange={(e) => setActiveBg(CANVAS_BACKGROUNDS.find(b => b.id === e.target.value) || CANVAS_BACKGROUNDS[0])}
              className="w-full bg-amber-50/60 border border-zelda-border-sand rounded-xl p-2 text-xs font-serif text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
            >
              {CANVAS_BACKGROUNDS.map(bg => (
                <option key={bg.id} value={bg.id}>{bg.label}</option>
              ))}
            </select>
          </div>

          {/* Vector Shape Tools Settings */}
          {activeTool === 'vector' && (
            <div className="space-y-3 pt-2 border-t border-zelda-border-sand">
              <span className="block text-xs font-serif font-bold text-zelda-charcoal">
                Vector Shape Tool
              </span>

              {/* Vector Types Grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'rect', label: 'Rectangle', icon: <Square className="w-3.5 h-3.5" /> },
                  { id: 'circle', label: 'Circle', icon: <Circle className="w-3.5 h-3.5" /> },
                  { id: 'triangle', label: 'Triangle', icon: <Triangle className="w-3.5 h-3.5" /> },
                  { id: 'star', label: 'Star', icon: <Star className="w-3.5 h-3.5" /> },
                  { id: 'line', label: 'Line', icon: <Minus className="w-3.5 h-3.5" /> },
                  { id: 'arrow', label: 'Arrow', icon: <ArrowRight className="w-3.5 h-3.5" /> },
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveVectorType(v.id as VectorType)}
                    className={`p-2 rounded-xl text-[10px] font-serif font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      activeVectorType === v.id
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-amber-50 hover:bg-amber-100 text-zelda-charcoal border border-amber-200'
                    }`}
                  >
                    {v.icon}
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>

              {/* Color & Stroke */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-zelda-charcoal">Stroke Color:</span>
                  <input
                    type="color"
                    value={drawColor}
                    onChange={(e) => setDrawColor(e.target.value)}
                    className="w-7 h-7 rounded border border-amber-300 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-zelda-charcoal">Fill Color:</span>
                  <input
                    type="color"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    className="w-7 h-7 rounded border border-amber-300 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-zelda-charcoal">Stroke Width:</span>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={drawWidth}
                    onChange={(e) => setDrawWidth(Number(e.target.value))}
                    className="w-24 accent-amber-600"
                  />
                  <span className="font-mono text-[10px]">{drawWidth}px</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-zelda-charcoal">Stroke Style:</span>
                  <select
                    value={strokeStyle}
                    onChange={(e) => setStrokeStyle(e.target.value as 'solid' | 'dashed')}
                    className="bg-amber-50 border border-amber-200 rounded px-2 py-0.5 text-[10px]"
                  >
                    <option value="solid">Solid Line</option>
                    <option value="dashed">Dashed Line</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Conditional Tool Panel for Text */}
          {activeTool === 'text' && (
            <form onSubmit={handleAddText} className="space-y-2.5 pt-2 border-t border-zelda-border-sand">
              <label className="block text-xs font-serif font-bold text-zelda-charcoal">
                Add Custom Inscription
              </label>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text..."
                className="w-full bg-amber-50/50 border border-zelda-border-sand rounded-xl p-2 text-xs text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
              />
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded border border-zelda-border-sand cursor-pointer"
                />
                <input
                  type="number"
                  min="12"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-20 bg-amber-50/50 border border-zelda-border-sand rounded-xl p-1.5 text-xs text-center"
                />
                <button
                  type="submit"
                  className="flex-1 bg-zelda-gold text-white font-serif font-bold text-xs py-2 rounded-xl uppercase tracking-wider hover:bg-yellow-600 transition-all cursor-pointer"
                >
                  Add Text
                </button>
              </div>
            </form>
          )}

          {/* Conditional Tool Panel for Freehand Draw */}
          {activeTool === 'draw' && (
            <div className="space-y-2.5 pt-2 border-t border-zelda-border-sand">
              <label className="block text-xs font-serif font-bold text-zelda-charcoal">
                Brush Color & Size
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={drawColor}
                  onChange={(e) => setDrawColor(e.target.value)}
                  className="w-8 h-8 rounded border border-zelda-border-sand cursor-pointer"
                />
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={drawWidth}
                  onChange={(e) => setDrawWidth(Number(e.target.value))}
                  className="flex-1 accent-amber-600"
                />
                <span className="text-xs font-mono font-bold text-zelda-charcoal">{drawWidth}px</span>
              </div>
            </div>
          )}

          {/* Eraser info */}
          {activeTool === 'eraser' && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs text-rose-900 font-serif">
              <div className="flex items-center gap-1.5 font-bold">
                <Eraser className="w-4 h-4 text-rose-600" />
                <span>Eraser Active</span>
              </div>
              <p className="text-[11px] text-rose-800">
                Click on any sticker, text, or drawn path directly on the canvas to erase it instantly!
              </p>
            </div>
          )}

          {/* Clip Art Stickers Grid */}
          <div className="space-y-2 pt-2 border-t border-zelda-border-sand">
            <span className="block text-xs font-serif font-bold text-zelda-charcoal">
              Clip Art Stickers (Click to Add)
            </span>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {CLIPART_LIBRARY.map(sticker => (
                <button
                  key={sticker.id}
                  onClick={() => handleAddSticker(sticker)}
                  className="p-2 bg-amber-50/60 hover:bg-amber-100 border border-zelda-border-sand/80 hover:border-zelda-gold rounded-xl transition-all flex flex-col items-center justify-center gap-1 group cursor-pointer"
                >
                  <div className="w-9 h-9 transition-transform group-hover:scale-110">
                    {sticker.iconSvg}
                  </div>
                  <span className="text-[10px] font-serif font-bold text-zelda-charcoal/80 group-hover:text-zelda-gold line-clamp-1">
                    {sticker.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Canvas Area */}
        <div className="lg:col-span-3 space-y-4">
          
          <div
            ref={canvasContainerRef}
            onMouseDown={handleMouseDownCanvas}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            className={`w-full min-h-[460px] h-[480px] rounded-2xl border-2 border-amber-400/60 shadow-xl relative overflow-hidden select-none cursor-${
              activeTool === 'draw' || activeTool === 'vector' ? 'crosshair' : activeTool === 'eraser' ? 'pointer' : 'default'
            } ${activeBg.class}`}
          >
            {/* SVG Vector & Draw Layer */}
            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
              {/* Existing Drawing Paths & Vectors */}
              {elements.map(elem => {
                if (elem.type === 'drawing' && elem.points && elem.points.length > 1) {
                  const pathData = elem.points.reduce((acc, point, index) => {
                    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
                  }, '');
                  return (
                    <path
                      key={elem.id}
                      d={pathData}
                      stroke={elem.strokeColor || '#D97706'}
                      strokeWidth={elem.strokeWidth || 4}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={activeTool === 'eraser' ? 'pointer-events-auto hover:stroke-rose-600 cursor-pointer' : ''}
                      onClick={(e) => handleElementClickInEraser(e, elem.id)}
                    />
                  );
                }

                if (elem.type === 'vector') {
                  return (
                    <g
                      key={elem.id}
                      transform={`translate(${elem.x}, ${elem.y}) rotate(${elem.rotation})`}
                      className={activeTool === 'eraser' ? 'pointer-events-auto cursor-pointer hover:opacity-70' : ''}
                      onClick={(e) => handleElementClickInEraser(e, elem.id)}
                    >
                      {renderVectorShape(elem)}
                    </g>
                  );
                }

                return null;
              })}

              {/* Live drawing stroke preview */}
              {isDrawing && activeTool === 'draw' && currentStroke.length > 1 && (
                <path
                  d={currentStroke.reduce((acc, point, index) => (
                    index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`
                  ), '')}
                  stroke={drawColor}
                  strokeWidth={drawWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Live vector creation preview */}
              {isDrawing && activeTool === 'vector' && (
                <g transform={`translate(${Math.min(startPos.x, currentPos.x)}, ${Math.min(startPos.y, currentPos.y)})`}>
                  {renderVectorShape({
                    id: 'temp',
                    type: 'vector',
                    vectorType: activeVectorType,
                    x: Math.min(startPos.x, currentPos.x),
                    y: Math.min(startPos.y, currentPos.y),
                    x2: currentPos.x,
                    y2: currentPos.y,
                    width: Math.abs(currentPos.x - startPos.x),
                    height: Math.abs(currentPos.y - startPos.y),
                    rotation: 0,
                    scale: 1,
                    zIndex: 99,
                    strokeColor: drawColor,
                    fillColor: fillColor,
                    strokeWidth: drawWidth,
                    strokeStyle: strokeStyle,
                  })}
                </g>
              )}
            </svg>

            {/* Elements Layer (Stickers, Text) */}
            {elements.map(elem => {
              if (elem.type === 'drawing' || elem.type === 'vector') return null;

              const isSelected = selectedElementId === elem.id;
              const sticker = elem.stickerId ? CLIPART_LIBRARY.find(s => s.id === elem.stickerId) : null;

              return (
                <div
                  key={elem.id}
                  onMouseDown={(e) => handleElementMouseDown(e, elem)}
                  style={{
                    position: 'absolute',
                    left: `${elem.x}px`,
                    top: `${elem.y}px`,
                    width: `${elem.width * elem.scale}px`,
                    height: elem.type === 'text' ? 'auto' : `${elem.height * elem.scale}px`,
                    transform: `rotate(${elem.rotation}deg)`,
                    zIndex: elem.zIndex,
                  }}
                  className={`transition-shadow ${
                    activeTool === 'eraser' 
                      ? 'hover:opacity-60 ring-2 ring-rose-500 cursor-pointer' 
                      : 'cursor-grab active:cursor-grabbing'
                  } ${isSelected ? 'ring-2 ring-amber-500 rounded-lg shadow-2xl' : ''}`}
                >
                  {elem.type === 'sticker' && sticker && (
                    <div className="w-full h-full pointer-events-none">
                      {sticker.iconSvg}
                    </div>
                  )}

                  {elem.type === 'text' && (
                    <div
                      style={{
                        color: elem.color || '#B45309',
                        fontSize: `${elem.fontSize || 24}px`,
                        fontFamily: elem.fontFamily || 'serif',
                      }}
                      className="font-bold drop-shadow-md whitespace-nowrap"
                    >
                      {elem.text}
                    </div>
                  )}
                </div>
              );
            })}

            {elements.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-amber-900/60 pointer-events-none">
                <Sparkles className="w-12 h-12 text-amber-500/50 mb-2 animate-bounce" />
                <h4 className="font-serif text-lg font-bold text-amber-900">Hyrule Creative Canvas Empty</h4>
                <p className="text-xs max-w-sm mt-1 font-serif">
                  Add stickers, draw freehand, create vector shapes, or write ancient text inscriptions!
                </p>
              </div>
            )}
          </div>

          {/* Selected Element Controls Bar */}
          {selectedElement && activeTool !== 'eraser' && (
            <div className="bg-amber-100/90 border border-amber-400/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-950">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Selected Element Controls ({selectedElement.type})</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                {/* Scale */}
                <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-300">
                  <span className="font-serif font-bold text-amber-900">Scale:</span>
                  <button
                    onClick={() => updateSelectedElement({ scale: Math.max(0.3, selectedElement.scale - 0.1) })}
                    className="p-1 hover:bg-amber-200 rounded font-mono font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-amber-900">{Math.round(selectedElement.scale * 100)}%</span>
                  <button
                    onClick={() => updateSelectedElement({ scale: Math.min(3, selectedElement.scale + 0.1) })}
                    className="p-1 hover:bg-amber-200 rounded font-mono font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Rotation */}
                <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-300">
                  <span className="font-serif font-bold text-amber-900">Rotate:</span>
                  <button
                    onClick={() => updateSelectedElement({ rotation: (selectedElement.rotation - 15) % 360 })}
                    className="p-1 hover:bg-amber-200 rounded font-mono font-bold"
                  >
                    ↺
                  </button>
                  <span className="font-mono font-bold text-amber-900">{selectedElement.rotation}°</span>
                  <button
                    onClick={() => updateSelectedElement({ rotation: (selectedElement.rotation + 15) % 360 })}
                    className="p-1 hover:bg-amber-200 rounded font-mono font-bold"
                  >
                    ↻
                  </button>
                </div>

                {/* Delete button */}
                <button
                  onClick={deleteSelectedElement}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-serif font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Element</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
