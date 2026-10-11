import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BakeryItem } from './bakeryItems';
import ModelViewer3D from './ModelViewer3D';
import { Receipt, Camera, Box } from 'lucide-react';
import BakeMetadata from './BakeMetadata';
import { playSound, BAKERY_SOUNDS } from './sound';

interface BakeryCounterProps {
  items: BakeryItem[];
  pastryBag: BakeryItem[];
  onToggleReceipt: (item: BakeryItem) => void;
}

export default function BakeryCounter({
  items,
  pastryBag,
  onToggleReceipt,
}: BakeryCounterProps) {
  // Triple the 25 items array to enable seamless infinite wrapping/looping
  const loopedItems = [...items, ...items, ...items];
  const itemWidth = 380;

  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<BakeryItem | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'real'>('3d');

  // Dragging state
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);

  // Initialize scroll position to center loop on mount
  useEffect(() => {
    const el = scrollTrackRef.current;
    if (!el) return;
    const singleSetWidth = items.length * itemWidth;
    el.scrollLeft = singleSetWidth;
  }, [items.length]);

  // Infinite Seamless Loop on Scroll
  const handleScroll = () => {
    const el = scrollTrackRef.current;
    if (!el) return;

    const singleSetWidth = items.length * itemWidth;
    if (el.scrollLeft <= 20) {
      el.scrollLeft += singleSetWidth;
    } else if (el.scrollLeft >= singleSetWidth * 2 - 20) {
      el.scrollLeft -= singleSetWidth;
    }
  };

  // Wheel horizontal scrolling
  const handleWheel = (e: React.WheelEvent) => {
    const el = scrollTrackRef.current;
    if (!el) return;
    el.scrollLeft += e.deltaY + e.deltaX;
  };

  // Drag to pan gesture
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollTrackRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const el = scrollTrackRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none overflow-hidden bg-[#fdfcfc]">
      {/* ================= COUNTER INTRO HEADER ================= */}
      <div className="pt-[130px] px-[28px] text-center max-w-[1000px] mx-auto z-20 pointer-events-none">
        <h2 className="font-[300] text-[28px] sm:text-[36px] md:text-[40px] text-[#000000] tracking-[-0.02em] leading-[1.12] mb-[6px] pointer-events-auto sm:whitespace-nowrap">
          Baked in my oven, remembered on the internet.
        </h2>
        <p className="text-[14px] text-[#777169] tracking-[-0.01em] pointer-events-auto">
          Every bake carries a story, a recipient, and at least one small imperfection.
        </p>
      </div>

      {/* ================= 25-CONFECTION INFINITE HORIZONTAL SCROLL ================= */}
      <div className="relative flex-1 w-full flex items-center justify-center z-10 overflow-visible">
        
        {/* Carousel Scroll Track */}
        <div
          ref={scrollTrackRef}
          onScroll={handleScroll}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative w-full h-full flex items-center overflow-x-auto overflow-y-visible no-scrollbar cursor-grab active:cursor-grabbing z-10 py-[10px]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex items-center gap-[36px] sm:gap-[56px] px-[80px] overflow-visible">
            {loopedItems.map((bake, idx) => {
              const currentKey = `${bake.id}-${idx}`;
              const isHovered = hoveredId === currentKey;
              const hasAnyHover = hoveredId !== null;

              return (
                <motion.div
                  key={currentKey}
                  onMouseEnter={() => setHoveredId(currentKey)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    playSound(BAKERY_SOUNDS.paperUnfold);
                    setSelectedItem(bake);
                    setViewMode('3d');
                  }}
                  animate={{
                    opacity: hasAnyHover ? (isHovered ? 1 : 0.4) : 1, // other cakes 40% opaque
                    scale: isHovered ? 1.08 : 1,
                    y: isHovered ? -16 : 0,
                  }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="group relative flex-shrink-0 w-[280px] sm:w-[340px] md:w-[380px] flex flex-col items-center justify-center cursor-pointer overflow-visible"
                >
                  {/* 2X Giant 3D Model Frame */}
                  <div className="relative h-[52vh] sm:h-[62vh] md:h-[68vh] w-full flex items-center justify-center overflow-visible">
                    {/* Title directly touching the upper boundary of cake */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="pointer-events-none absolute top-[24%] inset-x-0 z-50 flex flex-col items-center text-center px-[6px]"
                        >
                          <h3 className="text-[17px] font-[500] text-[#000000] leading-tight tracking-[-0.01em]">
                            {bake.name}
                          </h3>
                          <p className="text-[12px] text-[#777169] tracking-normal mt-[2px]">
                            {bake.flavorNotes.join(' · ')}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <ModelViewer3D
                      modelUrl={bake.src}
                      autoRotate={true}
                      className="h-full w-full pointer-events-none"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>


      {/* ================= FOCUSED INSPECT MODAL (TORN PAPER MEMORY NOTE) ================= */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-[16px] sm:p-[28px] bg-black/50 backdrop-blur-sm select-none"
          >
            {/* Backdrop click to dismiss */}
            <div
              className="absolute inset-0"
              onClick={() => {
                playSound(BAKERY_SOUNDS.paperClose);
                setSelectedItem(null);
              }}
            />

            {/* Drop-shadow wrapper for the irregularly clipped paper */}
            <motion.div
              initial={{ scale: 0.92, y: 25, rotate: -1.0 }}
              animate={{ scale: 1, y: 0, rotate: -0.3 }}
              exit={{ scale: 0.92, y: 20, rotate: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="relative z-10 w-full max-w-[1060px] max-h-[95vh] flex flex-col items-center justify-center p-[4px]"
            >
              {/* Real Deckle Paper Photographic Layer (Transparent Background & Drop Shadow) */}
              <div className="absolute inset-0 z-0 pointer-events-none filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.38)] drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
                <img
                  src="/assets/deckle-paper-transparent.png?v=2"
                  alt="Watercolor Deckle Paper"
                  className="w-full h-full object-fill select-none"
                />
              </div>

              {/* Content Box with >= 80px Spacing from Paper Edges & >= 64px Column Gap */}
              <div className="relative z-10 w-full h-full text-[#1c1a17] p-[48px] sm:p-[80px] flex flex-col lg:flex-row gap-[36px] lg:gap-[64px] overflow-y-auto max-h-[92vh]">
                
                {/* Hand-drawn 'X' Close in Top Right (within 80px margin area) */}
                <button
                  onClick={() => {
                    playSound(BAKERY_SOUNDS.paperClose);
                    setSelectedItem(null);
                  }}
                  className="absolute top-[20px] right-[24px] sm:top-[28px] sm:right-[32px] z-30 font-serif text-[26px] text-[#443e37] hover:text-[#000000] hover:scale-110 transition-transform p-[6px] cursor-pointer opacity-80"
                  title="Close note"
                >
                  ✕
                </button>

                {/* LEFT: 3D MODEL & REAL PHOTO SWITCHER */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-[280px] lg:min-h-[380px]">
                  <div className="relative h-[34vh] sm:h-[40vh] w-full flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {viewMode === '3d' ? (
                        <motion.div
                          key={`3d-${selectedItem.id}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.25 }}
                          className="relative h-full w-full flex items-center justify-center"
                        >
                          <ModelViewer3D
                            modelUrl={selectedItem.src}
                            autoRotate={false}
                            className="h-full w-full cursor-grab active:cursor-grabbing"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key={`real-${selectedItem.id}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.25 }}
                          className="relative h-full w-full flex flex-col items-center justify-center p-[8px]"
                        >
                          {/* Polarized taped photo on paper */}
                          <div className="relative max-h-[92%] max-w-[92%] rounded-[8px] shadow-subtle border border-[#ebe8e4] bg-[#ffffff] p-[8px] rotate-[1deg]">
                            <img
                              src={selectedItem.realImage || selectedItem.thumbnail}
                              alt={selectedItem.name}
                              className="h-full w-full max-h-[28vh] object-contain rounded-xs"
                            />
                            <div className="mt-[6px] text-center text-[11px] text-[#777169]">
                              Kitchen snapshot · {selectedItem.bakedDate}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Switcher Tab Pills Styled per DESIGN.md */}
                  <div className="mt-[16px] inline-flex rounded-full border border-[#ebe8e4] bg-[#f5f3f1] p-[3px] text-[12px]">
                    <button
                      onClick={() => {
                        playSound(BAKERY_SOUNDS.softClick);
                        setViewMode('3d');
                      }}
                      className={`flex items-center gap-[6px] px-[14px] py-[5px] rounded-full transition-all cursor-pointer ${
                        viewMode === '3d'
                          ? 'bg-[#fdfcfc] text-[#000000] font-[500] shadow-subtle'
                          : 'text-[#777169] hover:text-[#000000]'
                      }`}
                    >
                      <Box className="h-[12px] w-[12px]" />
                      <span>3D Model</span>
                    </button>

                    <button
                      onClick={() => {
                        playSound(BAKERY_SOUNDS.softClick);
                        setViewMode('real');
                      }}
                      className={`flex items-center gap-[6px] px-[14px] py-[5px] rounded-full transition-all cursor-pointer ${
                        viewMode === 'real'
                          ? 'bg-[#fdfcfc] text-[#000000] font-[500] shadow-subtle'
                          : 'text-[#777169] hover:text-[#000000]'
                      }`}
                    >
                      <Camera className="h-[12px] w-[12px]" />
                      <span>Real Photo 📸</span>
                    </button>
                  </div>
                </div>

                {/* RIGHT: HONEST RECIPE & METADATA STORY */}
                <div className="flex-1 flex flex-col justify-center space-y-[16px] text-left">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.2em] font-[500] text-[#777169] block mb-[4px]">
                      {selectedItem.tag} · {selectedItem.category}
                    </span>
                    <h3 className="font-mynerve text-[34px] sm:text-[44px] text-[#000000] leading-[1.15] mb-[4px]">
                      {selectedItem.name}
                    </h3>
                    <p className="text-[12px] text-[#777169] tracking-normal mb-[8px]">
                      {selectedItem.flavorNotes.join(' · ')}
                    </p>
                    <p className="text-[13px] text-[#44403b] leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </div>

                  <BakeMetadata item={selectedItem} />

                  {/* Bottom Actions & Handwritten Signature */}
                  <div className="pt-[8px] flex items-center justify-between gap-[16px]">
                    <button
                      onClick={() => onToggleReceipt(selectedItem)}
                      className={`flex items-center justify-center gap-[8px] rounded-full px-[18px] py-[8px] text-[13px] font-[500] transition-all shadow-subtle cursor-pointer ${
                        pastryBag.some((p) => p.id === selectedItem.id)
                          ? 'border border-[#ebe8e4] bg-[#fdfcfc] hover:bg-[#f5f3f1] hover:border-[#000000] text-[#000000]'
                          : 'border border-[#000000] bg-[#000000] text-[#fdfcfc] hover:bg-[#222222]'
                      }`}
                    >
                      <Receipt className="h-[13px] w-[13px]" />
                      <span>
                        {pastryBag.some((p) => p.id === selectedItem.id)
                          ? '✓ In Your Receipt'
                          : '+ Add to Receipt'}
                      </span>
                    </button>

                    {/* Handwritten Personal Signoff */}
                    <div className="text-right">
                      <span className="font-mynerve text-[24px] text-[#000000] tracking-wide block">
                        Julianna ☕
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
