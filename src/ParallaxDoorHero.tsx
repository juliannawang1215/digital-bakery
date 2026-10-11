import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface ParallaxDoorHeroProps {
  onEnterComplete: () => void;
}

export const BobbingDots = () => {
  return (
    <div className="flex space-x-2 items-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 bg-[#000000] rounded-full"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

// oil-motion standard smoothDamp spring physics
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const smoothDamp = (
  current: number,
  target: number,
  velocity: number,
  smoothTime: number,
  maxSpeed: number,
  deltaTime: number,
): [number, number] => {
  const safeTime = Math.max(0.0001, smoothTime);
  const omega = 2 / safeTime;
  const x = omega * deltaTime;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const originalTarget = target;
  const maxChange = maxSpeed * safeTime;
  const change = clamp(current - target, -maxChange, maxChange);
  const limitedTarget = current - change;
  const temp = (velocity + omega * change) * deltaTime;
  let nextVelocity = (velocity - omega * temp) * decay;
  let nextPosition = limitedTarget + (change + temp) * decay;

  if ((originalTarget - current > 0) === (nextPosition > originalTarget)) {
    nextPosition = originalTarget;
    nextVelocity = 0;
  }
  return [nextPosition, nextVelocity];
};

export default function ParallaxDoorHero({ onEnterComplete }: ParallaxDoorHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // oil-motion frame & time state
  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  // 320vh scroll track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Strict 1:1 scroll binding -> targetTime with oil-motion physics
  // Skip the initial ~0.8s closing artifact from Kling video, starting cleanly when the door begins opening
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const video = videoRef.current;
    if (video && video.duration && !Number.isNaN(video.duration)) {
      const startTime = 0.8; // Skip initial closing frames
      const endTime = video.duration;
      const effectiveDuration = Math.max(0.1, endTime - startTime);
      
      const mapped = startTime + (latest / 0.85) * effectiveDuration;
      targetTimeRef.current = clamp(mapped, startTime, endTime);
    }

    if (latest >= 0.9) {
      onEnterComplete();
    }
  });

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    let animationFrameId: number;
    let lastTime = performance.now();

    // Auto fit Retina resolution (DPR 2x / 3x)
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth * dpr;
      const h = window.innerHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
        }
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Helper to draw video with aspect-fill cover + watermark cropping at full native clarity
    const drawVideoCropped = (v: HTMLVideoElement, c: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      const vw = v.videoWidth;
      const vh = v.videoHeight;
      if (vw <= 0 || vh <= 0) return;
      
      // Crop 6% off top/sides and 11% off the bottom to completely cut out the Kling watermark in the bottom-right corner
      const cropX = vw * 0.05;
      const cropY = vh * 0.03;
      const cropW = vw * 0.88;
      const cropH = vh * 0.86; // Cuts off bottom 11%

      // Aspect cover geometry
      const cw = c.width;
      const ch = c.height;
      const scale = Math.max(cw / cropW, ch / cropH);
      const drawW = cropW * scale;
      const drawH = cropH * scale;
      const drawX = (cw - drawW) / 2;
      const drawY = (ch - drawH) / 2;
      
      context.drawImage(v, cropX, cropY, cropW, cropH, drawX, drawY, drawW, drawH);
    };

    const handleLoadedData = () => {
      video.pause();
      video.currentTime = 0.8;
      targetTimeRef.current = 0.8;
      currentTimeRef.current = 0.8;
      velocityRef.current = 0;

      resizeCanvas();
      if (ctx && video.videoWidth > 0) {
        drawVideoCropped(video, canvas, ctx);
      }
      setIsReady(true);
    };

    if (video.readyState >= 2) {
      handleLoadedData();
    } else {
      video.addEventListener('loadeddata', handleLoadedData);
    }

    // High-performance oil-motion 60fps RAF loop with smoothDamp
    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (!ctx || video.readyState < 2) return;

      const deltaTime = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;

      const target = targetTimeRef.current;
      const current = currentTimeRef.current;
      const diff = Math.abs(target - current);

      if (diff > 0.0005 || Math.abs(velocityRef.current) > 0.0005) {
        // smoothTime = 0.12 for natural, responsive mass feel
        const [nextPos, nextVel] = smoothDamp(
          current,
          target,
          velocityRef.current,
          0.12,
          15.0,
          deltaTime,
        );

        currentTimeRef.current = nextPos;
        velocityRef.current = nextVel;

        video.currentTime = nextPos;
        drawVideoCropped(video, canvas, ctx);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  // Visual Transforms
  const videoOpacity = useTransform(scrollYProgress, [0.75, 0.88], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 0.85], [1.0, 1.04]);

  // Direction A: Flour Light Aperture expansion (Warm glowing iris expansion)
  const apertureScale = useTransform(scrollYProgress, [0.6, 0.9], [0.1, 3.2]);
  const apertureOpacity = useTransform(scrollYProgress, [0.6, 0.78, 0.9], [0, 0.9, 1]);

  // Warm mist lateral diffusion
  const mistLeftX = useTransform(scrollYProgress, [0.62, 0.9], ['-40%', '0%']);
  const mistRightX = useTransform(scrollYProgress, [0.62, 0.9], ['40%', '0%']);
  const mistOpacity = useTransform(scrollYProgress, [0.62, 0.82, 0.92], [0, 0.85, 1]);

  // Entrance hint badge fade out on scroll
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const hintY = useTransform(scrollYProgress, [0, 0.15], [0, -10]);

  return (
    <div ref={containerRef} className="relative h-[320vh] w-full bg-[#fdfcfc]">
      {/* Sticky Fullscreen Viewport Window (100vw × 100vh) */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#fdfcfc]">
        
        {/* Native Hardware Video Source (New Kling Video) */}
        <video
          ref={videoRef}
          src="/assets/door-walkin-kling.mp4"
          playsInline
          muted
          preload="auto"
          className="hidden"
        />

        {/* Pure 60fps Direct Canvas Surface with crop to completely hide watermarks */}
        <motion.div
          style={{ opacity: videoOpacity, scale: videoScale }}
          className="pointer-events-none absolute inset-0 flex h-full w-full items-center justify-center select-none will-change-transform overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Direction A: Radial Flour Light Aperture */}
        <motion.div
          style={{
            scale: apertureScale,
            opacity: apertureOpacity,
          }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
        >
          <div
            className="h-[60vw] w-[60vw] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(253, 252, 252, 1) 25%, rgba(253, 252, 252, 0.85) 50%, rgba(251, 249, 246, 0) 75%)',
              filter: 'blur(32px)',
            }}
          />
        </motion.div>

        {/* Ambient Warm Mist lateral clouds */}
        <motion.div
          style={{ x: mistLeftX, opacity: mistOpacity }}
          className="pointer-events-none absolute -bottom-[15%] -left-[10%] h-[70vh] w-[75vw] rounded-full bg-gradient-to-tr from-[#ffffff] via-[#fdfcfc] to-[#f7f5f2] blur-3xl will-change-transform"
        />
        <motion.div
          style={{ x: mistRightX, opacity: mistOpacity }}
          className="pointer-events-none absolute -top-[15%] -right-[10%] h-[70vh] w-[75vw] rounded-full bg-gradient-to-bl from-[#ffffff] via-[#fdfcfc] to-[#f7f5f2] blur-3xl will-change-transform"
        />

        {/* Scroll To Enter Indicator Badge */}
        <motion.div
          style={{ opacity: hintOpacity, y: hintY }}
          className="pointer-events-none absolute bottom-[32px] inset-x-0 z-30 flex flex-col items-center justify-center gap-[6px]"
        >
          <span className="text-[11px] tracking-[0.2em] uppercase font-[500] text-[#44403b] bg-[#fdfcfc]/90 backdrop-blur-md px-[16px] py-[6px] rounded-full border border-[#ebe8e4] shadow-subtle">
            Scroll to open & enter
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-[14px] w-[14px] text-[#777169]" />
          </motion.div>
        </motion.div>

        {/* Instant Micro BobbingDots Overlay during initial frame ready */}
        <AnimatePresence>
          {!isReady && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#fdfcfc]/90 backdrop-blur-md"
            >
              <div className="flex flex-col items-center gap-[14px]">
                <BobbingDots />
                <span className="text-[12px] uppercase tracking-[0.2em] font-[500] text-[#777169]">
                  Julianna's Pâtisserie
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
