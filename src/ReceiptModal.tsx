import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Heart } from 'lucide-react';
import { BakeryItem } from './bakeryItems';
import { playSound, BAKERY_SOUNDS } from './sound';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BakeryItem[];
  onRemoveItem: (id: string) => void;
  onClearReceipt: () => void;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearReceipt,
}: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDownload = () => {
    playSound(BAKERY_SOUNDS.receiptTear);
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 200);
  };

  const handleClose = () => {
    playSound(BAKERY_SOUNDS.softClick);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[16px] bg-black/45 backdrop-blur-md">
          {/* Click outside backdrop */}
          <div className="absolute inset-0" onClick={handleClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25, rotate: -1.2 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="receipt-shadow relative z-10 w-full max-w-[370px] max-h-[90vh] flex flex-col"
          >
            {/* Skeuomorphic Thermal Receipt Paper */}
            <div
              ref={receiptRef}
              className="receipt-paper relative w-full bg-[#fdfcfc] text-[#000000] px-[26px] pt-[30px] pb-[34px] font-mono select-none overflow-y-auto max-h-[85vh] border-t border-b border-[#ebe8e4]"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-[14px] right-[14px] text-[#777169] hover:text-[#000000] transition-colors p-[6px] rounded-full hover:bg-[#f5f3f1]"
                title="Close receipt"
              >
                <X className="h-[15px] w-[15px]" />
              </button>

              {/* Receipt Header */}
              <div className="text-center mb-[18px]">
                <div className="text-[13px] font-[700] tracking-widest uppercase mb-[2px] text-[#000000]">
                  JULIANNA'S DIGITAL BAKERY
                </div>
                <div className="text-[10px] text-[#777169] uppercase tracking-wider mb-[4px]">
                  Personal Archive & Memory Receipt
                </div>
                <div className="text-[10px] text-[#a59f97] tracking-wider mb-[2px]">
                  {currentDate} · {currentTime}
                </div>
                <div className="text-[10px] text-[#a59f97] tracking-widest">
                  MEM-#{Math.floor(1000 + Math.random() * 9000)}
                </div>
              </div>

              {/* Dashed Line Divider */}
              <div className="w-full border-b border-dashed border-[#ebe8e4] my-[14px]" />

              {/* Items List */}
              <div className="flex flex-col gap-[12px] my-[10px] min-h-[100px]">
                {items.length === 0 ? (
                  <div className="py-[32px] text-center text-[12px] text-[#777169] italic flex flex-col items-center gap-[6px]">
                    <span className="font-[600] not-italic text-[#000000]">Your receipt is empty.</span>
                    <span>Apparently nothing looked good enough yet.</span>
                    <span className="text-[11px] text-[#a59f97]">Click "+ Add to receipt" to collect treats.</span>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div key={item.id} className="flex flex-col text-[11px] group pb-[8px] border-b border-dotted border-[#ebe8e4] last:border-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-[8px]">
                          <div className="font-[600] text-[#000000] leading-snug">
                            {String(idx + 1).padStart(2, '0')} {item.name}
                          </div>
                          {item.receiptNote && (
                            <div className="text-[10px] text-[#777169] mt-[2px] leading-tight italic">
                              ↳ {item.receiptNote}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-[8px]">
                          <span className="text-[10px] font-mono text-[#777169]">01</span>
                          <button
                            onClick={() => {
                              playSound(BAKERY_SOUNDS.receiptRemove);
                              onRemoveItem(item.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-[#777169] hover:text-[#000000] text-[10px] transition-opacity p-[2px]"
                            title="Remove from receipt"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Summary / Dry Humorous Receipt Footer */}
              {items.length > 0 && (
                <>
                  <div className="w-full border-b border-dashed border-[#ebe8e4] my-[14px]" />

                  <div className="space-y-[6px] text-[11px] text-[#44403b] mb-[16px]">
                    <div className="flex justify-between font-[600] text-[#000000]">
                      <span>TOTAL SELECTION</span>
                      <span>{items.length} {items.length === 1 ? 'THING' : 'THINGS'} I'D HAPPILY EAT</span>
                    </div>

                    <div className="flex justify-between text-[#777169]">
                      <span>TOTAL</span>
                      <span className="font-[600] text-[#000000]">good choices</span>
                    </div>

                    <div className="flex justify-between text-[#777169]">
                      <span>PAYMENT</span>
                      <span>compliments accepted</span>
                    </div>

                    <div className="flex justify-between text-[#a59f97] text-[10px] pt-[4px]">
                      <span>STATUS</span>
                      <span>NOT ACTUALLY FOR SALE</span>
                    </div>
                  </div>

                  <div className="w-full border-b border-dashed border-[#ebe8e4] my-[14px]" />

                  {/* Micro Footer Note */}
                  <div className="text-center text-[10px] text-[#777169] space-y-[4px] pt-[4px]">
                    <div className="flex items-center justify-center gap-[4px]">
                      <span>thank you for visiting</span>
                      <Heart className="h-[10px] w-[10px] text-[#777169] fill-[#777169]" />
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-[#a59f97]">
                      Baked in real life · Archived on the internet
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-[20px] pt-[10px] flex items-center justify-between gap-[10px]">
                    <button
                      onClick={() => {
                        playSound(BAKERY_SOUNDS.receiptRemove);
                        onClearReceipt();
                      }}
                      className="text-[11px] text-[#777169] hover:text-[#000000] transition-colors uppercase tracking-wider font-[500]"
                    >
                      Clear All
                    </button>

                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="inline-flex items-center gap-[6px] rounded-full border border-[#000000] bg-[#000000] text-[#fdfcfc] px-[16px] py-[6px] text-[11px] font-[500] uppercase tracking-wider hover:bg-[#222222] transition-colors shadow-subtle cursor-pointer"
                    >
                      <Download className="h-[12px] w-[12px]" />
                      <span>Keep the receipt</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
