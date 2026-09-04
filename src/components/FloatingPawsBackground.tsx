import React, { useMemo } from 'react';

interface PawParticle {
  id: number;
  top: string;
  left: string;
  size: number;
  colorType: 'gold' | 'champagne';
  animClass: 'animate-paw-1' | 'animate-paw-2' | 'animate-paw-3';
  delay: string;
  initialRotate: number;
  opacity: number;
  hasSparkle?: boolean;
}

export const FloatingPawsBackground: React.FC = () => {
  // Curated, non-crowded list of golden and champagne floating paw particles
  const particles = useMemo<PawParticle[]>(() => [
    { id: 1, top: '8%', left: '7%', size: 18, colorType: 'gold', animClass: 'animate-paw-1', delay: '-2s', initialRotate: 15, opacity: 0.65, hasSparkle: true },
    { id: 2, top: '14%', left: '88%', size: 15, colorType: 'champagne', animClass: 'animate-paw-2', delay: '-5s', initialRotate: -20, opacity: 0.6 },
    { id: 3, top: '22%', left: '22%', size: 14, colorType: 'champagne', animClass: 'animate-paw-3', delay: '-8s', initialRotate: 25, opacity: 0.5 },
    { id: 4, top: '28%', left: '76%', size: 20, colorType: 'gold', animClass: 'animate-paw-1', delay: '-11s', initialRotate: -12, opacity: 0.7, hasSparkle: true },
    { id: 5, top: '38%', left: '9%', size: 16, colorType: 'champagne', animClass: 'animate-paw-2', delay: '-3s', initialRotate: 18, opacity: 0.55 },
    { id: 6, top: '44%', left: '92%', size: 19, colorType: 'gold', animClass: 'animate-paw-3', delay: '-7s', initialRotate: -15, opacity: 0.65 },
    { id: 7, top: '52%', left: '16%', size: 22, colorType: 'gold', animClass: 'animate-paw-1', delay: '-13s', initialRotate: -8, opacity: 0.6, hasSparkle: true },
    { id: 8, top: '58%', left: '82%', size: 15, colorType: 'champagne', animClass: 'animate-paw-2', delay: '-4s', initialRotate: 22, opacity: 0.55 },
    { id: 9, top: '67%', left: '6%', size: 17, colorType: 'gold', animClass: 'animate-paw-3', delay: '-9s', initialRotate: 12, opacity: 0.65 },
    { id: 10, top: '73%', left: '89%', size: 21, colorType: 'champagne', animClass: 'animate-paw-1', delay: '-1s', initialRotate: -25, opacity: 0.7, hasSparkle: true },
    { id: 11, top: '81%', left: '24%', size: 14, colorType: 'champagne', animClass: 'animate-paw-2', delay: '-6s', initialRotate: 16, opacity: 0.5 },
    { id: 12, top: '86%', left: '72%', size: 18, colorType: 'gold', animClass: 'animate-paw-3', delay: '-10s', initialRotate: -10, opacity: 0.6 },
    { id: 13, top: '93%', left: '12%', size: 16, colorType: 'gold', animClass: 'animate-paw-1', delay: '-14s', initialRotate: 30, opacity: 0.65 },
    { id: 14, top: '95%', left: '84%', size: 15, colorType: 'champagne', animClass: 'animate-paw-2', delay: '-7s', initialRotate: -18, opacity: 0.55, hasSparkle: true },
  ], []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-1 select-none" 
      aria-hidden="true"
    >
      {/* Reusable SVG Gradients and Filters */}
      <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
        <defs>
          {/* Gold Gradient */}
          <linearGradient id="paw-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="45%" stopColor="#E8B84A" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>

          {/* Champagne Gradient */}
          <linearGradient id="paw-champagne-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#F9EEDB" />
            <stop offset="85%" stopColor="#E6CCA4" />
            <stop offset="100%" stopColor="#D4B07B" />
          </linearGradient>

          {/* Sparkle Star Gradient */}
          <linearGradient id="paw-sparkle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFDE82" />
          </linearGradient>
        </defs>
      </svg>

      {/* Particles Container */}
      {particles.map((p) => {
        const isGold = p.colorType === 'gold';
        const fillUrl = isGold ? 'url(#paw-gold-grad)' : 'url(#paw-champagne-grad)';

        return (
          <div
            key={p.id}
            className={`absolute ${p.animClass} will-change-transform`}
            style={{
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
              opacity: p.opacity,
            }}
          >
            <div 
              style={{ 
                transform: `rotate(${p.initialRotate}deg)`,
                width: p.size,
                height: p.size,
              }}
              className="relative flex items-center justify-center transition-opacity"
            >
              {/* Pet Paw Print SVG */}
              <svg
                viewBox="0 0 24 24"
                width={p.size}
                height={p.size}
                className="drop-shadow-[0_0_6px_rgba(232,184,74,0.45)] dark:drop-shadow-[0_0_8px_rgba(249,238,219,0.55)]"
                fill={fillUrl}
              >
                {/* Central main pad */}
                <path d="M12 11.2c-2.4 0-4.3 1.7-4.3 3.8 0 1.7 1.4 3.5 4.3 3.5 2.9 0 4.3-1.8 4.3-3.5 0-2.1-1.9-3.8-4.3-3.8z" />
                {/* 4 toe pads */}
                <ellipse cx="6.5" cy="8.8" rx="1.6" ry="2.2" transform="rotate(-22 6.5 8.8)" />
                <ellipse cx="10.1" cy="6.2" rx="1.6" ry="2.3" transform="rotate(-7 10.1 6.2)" />
                <ellipse cx="13.9" cy="6.2" rx="1.6" ry="2.3" transform="rotate(7 13.9 6.2)" />
                <ellipse cx="17.5" cy="8.8" rx="1.6" ry="2.2" transform="rotate(22 17.5 8.8)" />
              </svg>

              {/* Sparkling star companion for depth and brilliance */}
              {p.hasSparkle && (
                <div 
                  className="absolute -top-1.5 -right-1.5 animate-star-twinkle"
                  style={{ animationDelay: p.delay }}
                >
                  <svg 
                    viewBox="0 0 16 16" 
                    width={p.size * 0.55} 
                    height={p.size * 0.55} 
                    fill="url(#paw-sparkle-grad)"
                    className="drop-shadow-[0_0_4px_rgba(255,248,231,0.9)]"
                  >
                    <path d="M8 0 C8 4 12 8 16 8 C12 8 8 12 8 16 C8 12 4 8 0 8 C4 8 8 4 8 0 Z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
