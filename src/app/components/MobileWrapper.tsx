import React from 'react';
import { cn } from '../../utils/cn';

interface MobileWrapperProps {
  children: React.ReactNode;
  disableScroll?: boolean; // Kept for API compatibility, but we enforce specific behavior
}

export const MobileWrapper: React.FC<MobileWrapperProps> = ({ children }) => {
  return (
    // Outer Container: 
    // - Mobile: Fixed inset-0 to force viewport size, preventing body scroll
    // - Desktop: Flex container centered
    <div
      className="fixed inset-0 z-0 w-full h-screen bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center font-sans md:relative md:inset-auto md:min-h-screen md:h-auto md:py-8 overflow-hidden"
      style={{ height: '100dvh' }}
    >
      
      {/* Phone Frame */}
      <div 
        className="
          w-full h-full
          md:w-[375px] md:h-[812px] md:max-h-[90vh]
          bg-background 
          md:rounded-[3rem] md:border-[8px] md:border-neutral-800 md:shadow-2xl
          flex flex-col relative overflow-hidden
          transform transition-all
        "
      >
        {/* Screen Content Container 
            We enforce overflow-hidden here so the App component controls scrolling internally
        */}
        <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col bg-background">
          {children}
        </div>
      </div>
    </div>
  );
};