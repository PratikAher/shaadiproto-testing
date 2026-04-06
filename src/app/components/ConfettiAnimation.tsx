import React, { useCallback } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// ═══════════════════════════════════════════════════════
// Confetti Animation — uses DotLottie player with hosted .lottie URL
// layout.fit = 'cover' forces animation to fill entire visible area
// ═══════════════════════════════════════════════════════

interface ConfettiAnimationProps {
  onComplete?: () => void;
}

export const ConfettiAnimation = ({ onComplete }: ConfettiAnimationProps) => {
  const handleComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  return (
    <DotLottieReact
      src="https://lottie.host/8e4188da-a2d8-4bf0-8e92-c678cf4360c8/yIUrvjOzMU.lottie"
      autoplay
      loop={false}
      speed={1}
      layout={{
        fit: 'cover',
        align: [0.5, 0.5],
      }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50,
      }}
      onComplete={handleComplete}
    />
  );
};
