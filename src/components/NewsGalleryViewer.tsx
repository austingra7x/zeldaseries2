import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewsGalleryViewerProps {
  images: string[];
  title: string;
}

export const NewsGalleryViewer: React.FC<NewsGalleryViewerProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImg = images[currentIndex] || images[0];

  return (
    <div className="space-y-3 my-4 bg-zelda-beige-card/50 border border-zelda-border-sand/80 rounded-xl p-3.5 shadow-sm">
      {/* Gallery Header Bar */}
      <div className="flex items-center justify-between text-xs font-serif font-bold text-zelda-charcoal uppercase tracking-wider border-b border-zelda-border-sand/40 pb-2">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-zelda-gold" />
          <span>Chronicle Image Gallery</span>
          <span className="bg-zelda-gold/15 text-zelda-gold text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
            {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
          </span>
        </div>

        {images.length > 1 && (
          <span className="text-[11px] font-mono text-zelda-charcoal/60">
            {currentIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Main Image Stage */}
      <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden bg-black/90 group flex items-center justify-center border border-zelda-border-sand/50 shadow-inner">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImg + currentIndex}
            src={currentImg}
            alt={`${title} - Gallery image ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full object-contain cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* Navigation Arrows for Main Display */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-zelda-gold text-white p-2 rounded-full transition-all border border-white/20 shadow-md cursor-pointer opacity-90 group-hover:opacity-100"
              title="Previous Photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-zelda-gold text-white p-2 rounded-full transition-all border border-white/20 shadow-md cursor-pointer opacity-90 group-hover:opacity-100"
              title="Next Photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Expand / Lightbox Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          type="button"
          className="absolute bottom-2.5 right-2.5 bg-black/75 hover:bg-zelda-gold text-white px-2.5 py-1.5 rounded-lg text-xs font-serif font-bold flex items-center gap-1.5 transition-all border border-white/20 shadow-lg cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Enlarge Gallery</span>
        </button>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin scrollbar-thumb-zelda-gold/40">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'border-zelda-gold ring-2 ring-zelda-gold/40 scale-105 shadow-md'
                  : 'border-zelda-border-sand/60 opacity-60 hover:opacity-100 hover:border-zelda-gold/60'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {currentIndex === idx && (
                <div className="absolute inset-0 bg-zelda-gold/10 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Bar */}
            <div
              className="w-full max-w-6xl flex items-center justify-between text-white border-b border-white/10 pb-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-zelda-gold uppercase tracking-wider truncate">
                  {title}
                </h4>
                <p className="text-xs text-gray-400 font-mono">
                  Photograph {currentIndex + 1} of {images.length}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 bg-white/10 hover:bg-red-600 rounded-full text-white transition-colors cursor-pointer"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Center Image */}
            <div
              className="relative flex-grow flex items-center justify-center my-4 w-full max-w-6xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImg}
                alt={`${title} enlarged`}
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    type="button"
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-zelda-gold text-white p-3 rounded-full border border-white/20 transition-all cursor-pointer shadow-xl"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    type="button"
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-zelda-gold text-white p-3 rounded-full border border-white/20 transition-all cursor-pointer shadow-xl"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Bottom Thumbnails */}
            {images.length > 1 && (
              <div
                className="w-full max-w-4xl flex items-center justify-center gap-2 overflow-x-auto py-2"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-14 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      currentIndex === idx
                        ? 'border-zelda-gold scale-110 ring-2 ring-zelda-gold'
                        : 'border-gray-600 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Lightbox thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
