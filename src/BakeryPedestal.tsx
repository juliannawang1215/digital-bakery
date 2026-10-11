import { motion } from 'motion/react';

const STONE = '/display-stone.png';
const PRODUCT = '/shelf/bakery.png';

/** Pâtisserie storefront seated on the museum display stone. */
export default function BakeryPedestal({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onEnter}
      className="group relative mx-auto block w-[min(52vw,440px)] cursor-pointer border-0 bg-transparent p-0 outline-none"
      initial={{ y: 160, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      aria-label="Enter Digital Bakery gallery"
    >
      <div className="relative w-full">
        <img
          src={STONE}
          alt=""
          className="pointer-events-none relative z-0 h-auto w-full select-none"
          draggable={false}
        />
        {/* Product seated on stone lip; keep clear of the exhibit title above */}
        <div
          className="absolute z-10 w-[68%]"
          style={{
            left: '50%',
            top: '22%',
            transform: 'translate(-50%, calc(-100% + 10%))',
          }}
        >
          <img
            src={PRODUCT}
            alt="Digital Bakery — Pâtisserie storefront"
            className="mx-auto h-auto max-h-[min(28vh,230px)] w-full object-contain transition duration-300 group-hover:scale-[1.02]"
            draggable={false}
          />
        </div>
      </div>
      <span className="mt-3 block text-center text-[11px] tracking-[0.18em] text-black/40 transition group-hover:text-black/70">
        CLICK TO ENTER →
      </span>
    </motion.button>
  );
}
