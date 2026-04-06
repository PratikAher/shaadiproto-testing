import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';

export interface InboxTab {
  id: string;
  label: string;
}

interface InboxTabsProps {
  tabs: InboxTab[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const InboxTabs = ({ tabs, selectedId, onSelect }: InboxTabsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const measureIndicator = useCallback(() => {
    const el = tabRefs.current.get(selectedId);
    const container = containerRef.current;
    if (el && container) {
      const containerRect = container.getBoundingClientRect();
      // Measure the text span inside the button for a tighter underline
      const textSpan = el.querySelector('span');
      const target = textSpan || el;
      const targetRect = target.getBoundingClientRect();
      setIndicatorStyle({
        left: targetRect.left - containerRect.left,
        width: targetRect.width,
      });
    }
  }, [selectedId]);

  useEffect(() => {
    measureIndicator();
  }, [measureIndicator, tabs]);

  // Re-measure on window resize (font loading etc.)
  useEffect(() => {
    window.addEventListener('resize', measureIndicator);
    // Also measure after fonts are loaded
    document.fonts?.ready?.then(measureIndicator);
    return () => window.removeEventListener('resize', measureIndicator);
  }, [measureIndicator]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-end w-full border-b border-[#e8e8eb] bg-background"
    >
      {/* Left-aligned tabs with proper padding */}
      <div className="flex items-end pl-4 pr-4 gap-6 overflow-x-auto scrollbar-hide no-scrollbar">
        {tabs.map((tab) => {
          const isActive = selectedId === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
              }}
              onClick={() => onSelect(tab.id)}
              className="relative flex items-center justify-center pb-[10px] pt-[10px]"
            >
              <span
                className="whitespace-nowrap"
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '16px',
                  lineHeight: '20px',
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#41404D' : '#95959D',
                  transition: 'color 0.2s, font-weight 0.2s',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Animated underline indicator — hugs the text label */}
      <motion.div
        className="absolute bottom-0 h-[2.5px] rounded-t-[3.35544px] rounded-b-none bg-[#41404D]"
        animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        transition={{ type: 'spring', stiffness: 400, damping: 34, mass: 0.8 }}
      />
    </div>
  );
};