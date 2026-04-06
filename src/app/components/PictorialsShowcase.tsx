import React from 'react';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { PICTORIAL_ICONS, PICTORIAL_COLORS, PICTORIAL_COLORS_HEX } from './icons/pictorials';

interface PictorialsShowcaseProps {
  onBack: () => void;
}

const COLOR_LEGEND = [
  { name: 'Orange', css: PICTORIAL_COLORS.orange, hex: PICTORIAL_COLORS_HEX.orange },
  { name: 'Purple', css: PICTORIAL_COLORS.purple, hex: PICTORIAL_COLORS_HEX.purple },
  { name: 'Green', css: PICTORIAL_COLORS.green, hex: PICTORIAL_COLORS_HEX.green },
  { name: 'Gold', css: PICTORIAL_COLORS.gold, hex: PICTORIAL_COLORS_HEX.gold },
  { name: 'Pink', css: PICTORIAL_COLORS.pink, hex: PICTORIAL_COLORS_HEX.pink },
  { name: 'Blue', css: PICTORIAL_COLORS.blue, hex: PICTORIAL_COLORS_HEX.blue },
];

export const PictorialsShowcase = ({ onBack }: PictorialsShowcaseProps) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Header */}
      <section className="flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur z-40 py-2 -mx-4 px-4 border-b md:static md:bg-transparent md:border-none md:p-0 md:m-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
          <ChevronLeft size={24} />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pictorials</h2>
        </div>
      </section>

      {/* Color Legend */}
      <div className="bg-card p-5 rounded-3xl border shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">Color Palette</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Pictorial icons use a fixed color palette for visual consistency. Each icon has an inherent fill color.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          {COLOR_LEGEND.map((c) => (
            <div key={c.name} className="flex items-center gap-2 bg-secondary/30 rounded-full px-3 py-1.5">
              <div
                className="w-4 h-4 rounded-full shrink-0 ring-1 ring-black/5"
                style={{ backgroundColor: c.css }}
              />
              <span className="text-xs font-medium text-foreground">{c.name}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{c.hex}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Icon Grid */}
      <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-1">All Pictorial Icons</h3>
          <p className="text-sm text-muted-foreground">
            {PICTORIAL_ICONS.length} filled pictorial icons across 6 color categories.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {PICTORIAL_ICONS.map((icon) => {
            const IconComp = icon.component;
            return (
              <div
                key={icon.name}
                className="flex flex-col items-center gap-2.5 p-3 rounded-2xl hover:bg-secondary/30 transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <IconComp size={36} />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] font-medium text-foreground text-center leading-tight">
                    {icon.name}
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {icon.colorName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Size Comparison */}
      <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-1">Size Scale</h3>
          <p className="text-sm text-muted-foreground">
            Pictorial icons at different sizes (20px, 28px, 36px, 48px).
          </p>
        </div>
        <div className="flex items-end gap-8 justify-center py-4">
          {[20, 28, 36, 48].map((s) => (
            <div key={s} className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center" style={{ width: 48, height: 48 }}>
                {React.createElement(PICTORIAL_ICONS[12].component, { size: s })}
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{s}px</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};