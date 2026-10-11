import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BakeryItem } from './bakeryItems';
import ModelViewer3D from './ModelViewer3D';
import { ChevronLeft, ChevronRight, ArrowLeft, Receipt, Camera, Box } from 'lucide-react';
import BakeMetadata from './BakeMetadata';

interface BakeryShelfProps {
  items: BakeryItem[];
  pastryBag: BakeryItem[];
  onToggleReceipt: (item: BakeryItem) => void;
}

export default function BakeryShelf({
  items,
  pastryBag,
  onToggleReceipt,
}: BakeryShelfProps) {
  // We showcase a curated selection of 7 bakes across the shelf (like the 7 books in Working Volumes)
  const shelfItems = items.slice(0, 7);
  const [activeIndex, setActiveIndex] = useState<number>(3); // Center item focused by default (like Codex)
  const [inspectItem, setInspectItem] = useState<BakeryItem | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'real'>('3d');

  const activeItem = shelfItems[activeIndex];
  const activeNumberStr = String(activeIndex + 1).padStart(2, '0');
  const totalNumberStr = String(shelfItems.length).padStart(2, '0');

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + shelfItems.length) % shelfItems.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % shelfItems.length);
  };

  return (
    <div className="relative w-full h-[100svh] flex flex-col justify-between select-none overflow-hidden bg-[#18181b] text-[#f4f4f5]">
      {/* ================= TOP EDITORIAL HEADER ================= */}
      <div className="pt-[24px] px-[36px] flex items-start justify-between z-20">
        <div>
          <h1 className="font-serif text-[24px] sm:text-[28px] tracking-tight text-[#fafafa] font-[400] leading-none mb-[4px]">
            Working Volumes
          </h1>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a1a1aa]">
            Seven Confections for Making · Edition 01 · 2026
          </span>
        </div>

        <div className="text-right font-mono text-[10px] uppercase tracking-widest text-[#71717a]">
          <span>Butter · Sugar · Flour</span>
        </div>
      </div>

      {/* ================= 3D IMMERSIVE DESSERT SHELF STAGE ================= */}
      <div className="relative flex-1 w-full flex flex-col justify-center items-center px-[20px] z-10">
        {/* The 7 Confections standing directly on the dark architectural shelf without individual trays */}
        <div className="relative w-full max-w-[1360px] h-[48vh] flex items-end justify-center">
          
          {/* Confections Row */}
          <div className="grid grid-cols-7 gap-[8px] sm:gap-[16px] w-full h-full items-end pb-[16px]">
            {shelfItems.map((bake, index) => {
              const isSelected = index === activeIndex;

              return (
                <motion.div
                  key={bake.id}
                  onClick={() => setActiveIndex(index)}
                  animate={{
                    y: isSelected ? -24 : 0,
                    scale: isSelected ? 1.15 : 0.92,
                    opacity: isSelected ? 1 : 0.55,
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative flex flex-col items-center justify-end h-full cursor-pointer"
                >
                  {/* Model directly on shelf */}
                  <div className="relative h-[30vh] sm:h-[36vh] w-full flex items-center justify-center">
                    <ModelViewer3D
                      modelUrl={bake.src}
                      autoRotate={isSelected}
                      className="h-full w-full pointer-events-none"
                    />

                    {/* Active Halo Glow */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeGlow"
                        className="pointer-events-none absolute -bottom-[10px] w-[80%] h-[16px] bg-[#ffffff]/10 rounded-full blur-md"
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ================= ARCHITECTURAL WOODEN SHELF BAR ================= */}
          <div className="absolute -bottom-[6px] inset-x-0 h-[36px] bg-[#222226] border-t border-[#3f3f46] shadow-2xl rounded-sm flex flex-col justify-between">
            {/* Top shelf edge light highlight */}
            <div className="h-[1.5px] w-full bg-[#52525b]/60" />
            {/* Front facing shelf bevel */}
            <div className="h-[8px] w-full bg-[#18181b]/90 border-t border-[#27272a]" />
          </div>
        </div>
      </div>

      {/* ================= BOTTOM METADATA & SCRUBBER STRIP ================= */}
      <div className="pb-[32px] px-[36px] flex items-end justify-between z-20">
        {/* Left: Active Item Details */}
        <div className="flex items-start gap-[20px] max-w-[500px] text-left">
          <span className="font-mono text-[12px] text-[#71717a] tracking-widest pt-[8px]">
            {activeNumberStr} / {totalNumberStr}
          </span>

          <div>
            <h2 className="font-serif text-[38px] sm:text-[46px] text-[#fafafa] font-[400] leading-none mb-[6px]">
              {activeItem.name}
            </h2>
            <p className="font-mono text-[12px] text-[#a1a1aa] tracking-wide">
              {activeItem.flavorNotes.join(' · ')}
            </p>
          </div>
        </div>

        {/* Center: Stepper & OPEN Button */}
        <div className="flex items-center gap-[16px]">
          <button
            onClick={handlePrev}
            className="p-[8px] text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
            title="Previous"
          >
            <ChevronLeft className="h-[18px] w-[18px]" />
          </button>

          <button
            onClick={() => {
              setInspectItem(activeItem);
              setViewMode('3d');
            }}
            className="rounded-full border border-[#3f3f46] bg-[#27272a]/80 hover:bg-[#3f3f46] hover:border-[#71717a] text-[#fafafa] px-[28px] py-[8px] font-mono text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg cursor-pointer"
          >
            OPEN
          </button>

          <button
            onClick={handleNext}
            className="p-[8px] text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
            title="Next"
          >
            <ChevronRight className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Right: Working Volumes Scrubber Indicator */}
        <div className="flex flex-col items-end gap-[6px]">
          <div className="flex items-center gap-[6px]">
            {shelfItems.map((_, i) => (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-[16px] transition-all cursor-pointer rounded-xs ${
                  i === activeIndex
                    ? 'w-[20px] border border-[#fafafa] bg-transparent'
                    : 'w-[12px] border-b border-[#52525b]'
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#71717a]">
            WHEEL · ARROWS · SELECT
          </span>
        </div>
      </div>

      {/* ================= OPEN INSPECT MODAL (FULL HUMAN TOUCH STORY) ================= */}
      <AnimatePresence>
        {inspectItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-[20px] bg-black/60 backdrop-blur-md"
          >
            <div className="absolute inset-0" onClick={() => setInspectItem(null)} />

            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 15 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              className="relative z-10 w-full max-w-[980px] max-h-[90vh] bg-[#18181b] text-[#f4f4f5] rounded-2xl shadow-2xl border border-[#27272a] overflow-hidden flex flex-col lg:flex-row p-[24px] sm:p-[36px] gap-[28px]"
            >
              {/* Back Button */}
              <button
                onClick={() => setInspectItem(null)}
                className="absolute top-[16px] left-[16px] z-30 inline-flex items-center gap-[6px] rounded-full border border-[#3f3f46] bg-[#27272a] px-[12px] py-[5px] font-mono text-[10px] text-[#a1a1aa] hover:border-[#fafafa] hover:text-[#fafafa] transition-all shadow-subtle cursor-pointer"
              >
                <ArrowLeft className="h-[12px] w-[12px]" />
                <span>Back to Shelf</span>
              </button>

              {/* LEFT: 3D MODEL & REAL PHOTO SWITCHER */}
              <div className="flex-1 flex flex-col items-center justify-center min-h-[320px] lg:min-h-[400px] pt-[20px] lg:pt-0">
                <div className="relative h-[34vh] sm:h-[40vh] w-full flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {viewMode === '3d' ? (
                      <motion.div
                        key={`3d-${inspectItem.id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.25 }}
                        className="relative h-full w-full flex items-center justify-center"
                      >
                        <ModelViewer3D
                          modelUrl={inspectItem.src}
                          autoRotate={false}
                          className="h-full w-full cursor-grab active:cursor-grabbing"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`real-${inspectItem.id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="relative h-full w-full flex flex-col items-center justify-center p-[12px]"
                      >
                        <div className="relative max-h-[90%] max-w-[90%] rounded-xl overflow-hidden shadow-lg border border-[#27272a] bg-[#111111] p-[6px]">
                          <img
                            src={inspectItem.realImage || inspectItem.thumbnail}
                            alt={inspectItem.name}
                            className="h-full w-full max-h-[28vh] object-contain rounded-lg"
                          />
                          <div className="mt-[6px] text-center font-mono text-[9px] text-[#71717a]">
                            Kitchen snapshot · {inspectItem.bakedDate}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Switcher Pills */}
                <div className="mt-[12px] inline-flex rounded-full border border-[#27272a] bg-[#222226] p-[3px] font-mono text-[10px]">
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`flex items-center gap-[5px] px-[12px] py-[4px] rounded-full transition-all cursor-pointer ${
                      viewMode === '3d'
                        ? 'bg-[#27272a] text-[#fafafa] font-[500] shadow-sm'
                        : 'text-[#71717a] hover:text-[#fafafa]'
                    }`}
                  >
                    <Box className="h-[11px] w-[11px]" />
                    <span>3D Model</span>
                  </button>

                  <button
                    onClick={() => setViewMode('real')}
                    className={`flex items-center gap-[5px] px-[12px] py-[4px] rounded-full transition-all cursor-pointer ${
                      viewMode === 'real'
                        ? 'bg-[#27272a] text-[#fafafa] font-[500] shadow-sm'
                        : 'text-[#71717a] hover:text-[#fafafa]'
                    }`}
                  >
                    <Camera className="h-[11px] w-[11px] text-[#ff4704]" />
                    <span>Real Photo 📸</span>
                  </button>
                </div>
              </div>

              {/* RIGHT: STORY & METADATA */}
              <div className="flex-1 flex flex-col justify-center space-y-[16px] text-left overflow-y-auto">
                <div>
                  <span className="font-mono text-[10px] text-[#ff4704] uppercase tracking-widest font-[500] block mb-[4px]">
                    {inspectItem.tag} · {inspectItem.category}
                  </span>
                  <h3 className="font-serif text-[28px] sm:text-[36px] text-[#fafafa] leading-tight mb-[4px]">
                    {inspectItem.name}
                  </h3>
                  <p className="font-mono text-[11px] text-[#a1a1aa] tracking-wider mb-[8px]">
                    {inspectItem.flavorNotes.join(' · ')}
                  </p>
                  <p className="text-[12px] text-[#d4d4d8] leading-relaxed">
                    {inspectItem.description}
                  </p>
                </div>

                <BakeMetadata item={inspectItem} />

                <div className="pt-[6px]">
                  <button
                    onClick={() => onToggleReceipt(inspectItem)}
                    className={`w-full flex items-center justify-center gap-[8px] rounded-full px-[18px] py-[9px] font-mono text-[11px] uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
                      pastryBag.some((p) => p.id === inspectItem.id)
                        ? 'border border-[#ff4704] bg-[#ff4704]/20 text-[#ff4704]'
                        : 'border border-[#3f3f46] bg-[#27272a] text-[#fafafa] hover:bg-[#3f3f46]'
                    }`}
                  >
                    <Receipt className="h-[12px] w-[12px]" />
                    <span>
                      {pastryBag.some((p) => p.id === inspectItem.id)
                        ? '✓ In Your Receipt'
                        : '+ Add to Receipt'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
