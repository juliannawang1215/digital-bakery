import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Receipt, Volume2, VolumeX } from 'lucide-react';
import { BAKERY_ITEMS, BakeryItem } from './bakeryItems';
import ReceiptModal from './ReceiptModal';
import ParallaxDoorHero from './ParallaxDoorHero';
import BakeryCounter from './BakeryCounter';
import { playSound, BAKERY_SOUNDS, isSoundMuted, toggleSoundMuted } from './sound';

const PORTFOLIO = 'https://julianna-portfolio.vercel.app/';

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(isSoundMuted());

  // Receipt System state persisted with localStorage
  const [pastryBag, setPastryBag] = useState<typeof BAKERY_ITEMS>(() => {
    try {
      const saved = localStorage.getItem('julianna_bakery_receipt');
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        return BAKERY_ITEMS.filter((item) => ids.includes(item.id));
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        'julianna_bakery_receipt',
        JSON.stringify(pastryBag.map((i) => i.id))
      );
    } catch {
      // ignore
    }
  }, [pastryBag]);

  const handleEnterComplete = () => {
    playSound(BAKERY_SOUNDS.doorBell);
    setHasEntered(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const handleToggleReceipt = (item: BakeryItem) => {
    const exists = pastryBag.find((i) => i.id === item.id);
    if (!exists) {
      playSound(BAKERY_SOUNDS.cashRegister);
      setPastryBag([...pastryBag, item]);
      showToast(`Added "${item.name}" to your receipt`);
    } else {
      playSound(BAKERY_SOUNDS.receiptRemove);
      setPastryBag(pastryBag.filter((i) => i.id !== item.id));
      showToast(`Removed from receipt`);
    }
  };

  // ================= 1. ENTRANCE DOOR RITUAL =================
  if (!hasEntered) {
    return <ParallaxDoorHero onEnterComplete={handleEnterComplete} />;
  }

  // ================= 2. 5-CONFECTION WARM BAKERY COUNTER PROTOTYPE =================
  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-[#fdfcfc] text-[#000000] selection:bg-[#ff4704]/15 flex flex-col justify-between select-none">
      {/* ================= FIXED TOP EDITORIAL NAVIGATION ================= */}
      <header className="absolute top-0 inset-x-0 z-40 flex items-center justify-between px-[28px] py-[20px] pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-[10px]">
          <a
            href={PORTFOLIO}
            className="text-[13px] font-[500] text-[#777169] hover:text-[#000000] tracking-[-0.01em] transition-colors"
          >
            Julianna's
          </a>
          <span className="text-[#ebe8e4]">/</span>
          <span className="text-[13px] font-[500] text-[#000000] tracking-[-0.01em]">
            Digital Bakery
          </span>
        </div>

        {/* Action Controls per DESIGN.md (Pill buttons: outline & filled) */}
        <div className="pointer-events-auto flex items-center gap-[10px]">
          {/* Audio Mute / Sound Toggle */}
          <button
            onClick={() => {
              const next = toggleSoundMuted();
              setIsMuted(next);
              if (!next) {
                playSound(BAKERY_SOUNDS.softClick);
              }
            }}
            className="inline-flex items-center gap-[6px] rounded-full border border-[#ebe8e4] bg-[#fdfcfc] hover:bg-[#f5f3f1] hover:border-[#000000] px-[12px] py-[6px] text-[13px] font-[500] text-[#000000] transition-all shadow-subtle cursor-pointer"
            title={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {isMuted ? (
              <>
                <VolumeX className="h-[12px] w-[12px] text-[#777169]" />
                <span className="text-[#777169]">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="h-[12px] w-[12px] text-[#000000]" />
                <span>Sound</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              playSound(BAKERY_SOUNDS.softClick);
              setHasEntered(false);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className="inline-flex items-center gap-[6px] rounded-full border border-[#ebe8e4] bg-[#fdfcfc] hover:bg-[#f5f3f1] hover:border-[#000000] px-[14px] py-[6px] text-[13px] font-[500] text-[#000000] transition-all shadow-subtle cursor-pointer"
          >
            <span>Exit Door</span>
          </button>

          <button
            onClick={() => {
              playSound(BAKERY_SOUNDS.receiptTear);
              setShowReceipt(true);
            }}
            className="inline-flex items-center gap-[6px] rounded-full border border-[#000000] bg-[#000000] text-[#fdfcfc] hover:bg-[#222222] px-[16px] py-[6px] text-[13px] font-[500] transition-all shadow-subtle cursor-pointer"
          >
            <Receipt className="h-[12px] w-[12px]" />
            <span>Receipt ({pastryBag.length})</span>
          </button>
        </div>
      </header>

      {/* ================= 5-CONFECTION WARM BAKERY COUNTER ================= */}
      <main className="relative flex-1 w-full flex flex-col justify-center overflow-hidden">
        <BakeryCounter
          items={BAKERY_ITEMS}
          pastryBag={pastryBag}
          onToggleReceipt={handleToggleReceipt}
        />
      </main>

      {/* ================= SKEUOMORPHIC THERMAL RECEIPT 2.0 MODAL ================= */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        items={pastryBag}
        onRemoveItem={(id) => setPastryBag(pastryBag.filter((i) => i.id !== id))}
        onClearReceipt={() => setPastryBag([])}
      />

      {/* ================= TOAST NOTIFICATION ================= */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[28px] left-1/2 -translate-x-1/2 z-50 rounded-full border border-[#ebe8e4] bg-[#fdfcfc] px-[20px] py-[8px] shadow-subtle text-[13px] font-[500] text-[#000000]"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
