import React, { useEffect, useRef, useState } from 'react';

// Declare model-viewer custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface ModelViewer3DProps {
  modelUrl: string;
  autoRotate?: boolean;
  onLoaded?: () => void;
  className?: string;
}

export default function ModelViewer3D({
  modelUrl,
  autoRotate = false,
  onLoaded,
  className = '',
}: ModelViewer3DProps) {
  const modelViewerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const mv = modelViewerRef.current;
    if (!mv) return;

    const handleLoad = () => {
      setIsLoading(false);
      if (onLoaded) onLoaded();
    };

    mv.addEventListener('load', handleLoad);
    return () => {
      mv.removeEventListener('load', handleLoad);
    };
  }, [modelUrl, onLoaded]);

  return (
    <div className={`relative h-full w-full select-none ${className}`}>
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        camera-controls
        touch-action="pan-y"
        auto-rotate={autoRotate ? '' : undefined}
        auto-rotate-delay="0"
        rotation-per-second="20deg"
        camera-orbit="15deg 75deg 2.4m"
        min-camera-orbit="auto auto 1.0m"
        max-camera-orbit="auto auto 5.0m"
        interaction-prompt="none"
        shadow-intensity="1.5"
        shadow-softness="0.9"
        environment-image="neutral"
        exposure="1.05"
        tone-mapping="aces"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          outline: 'none',
        }}
      >
        <div slot="progress-bar" style={{ display: 'none' }} />
      </model-viewer>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-transparent transition-opacity duration-300">
          <div className="h-5 w-5 animate-spin rounded-full border border-[#000000]/10 border-t-[#000000]" />
        </div>
      )}
    </div>
  );
}
