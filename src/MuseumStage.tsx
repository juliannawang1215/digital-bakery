/** Fixed museum atmosphere — light cement wall, floor, spotlights. */
export default function MuseumStage() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #d8d8d6 0%, #d0d0ce 36%, #c8c8c6 68%, #bfbfbd 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent 0, transparent 72px, rgba(0,0,0,0.06) 72px, rgba(0,0,0,0.06) 73px, rgba(255,255,255,0.25) 74px, transparent 75px)',
        }}
      />
      <div className="museum-spot absolute left-[12%] top-0 h-[72%] w-[38%] -translate-x-1/2" />
      <div className="museum-spot absolute left-1/2 top-0 h-[78%] w-[44%] -translate-x-1/2" />
      <div className="museum-spot absolute left-[88%] top-0 h-[72%] w-[38%] -translate-x-1/2" />
      <div
        className="absolute inset-x-0 bottom-0 h-[28%]"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(160,160,158,0.35) 18%, #b0b0ae 55%, #a3a3a1 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 72% 68% at 50% 42%, transparent 35%, rgba(90,90,88,0.08) 72%, rgba(70,70,68,0.18) 100%)',
        }}
      />
    </div>
  );
}
