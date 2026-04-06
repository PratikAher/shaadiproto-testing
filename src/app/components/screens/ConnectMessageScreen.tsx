import React, { useState, useCallback } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../Button';
import { ConnectMessageSheet, type SolutionVariant } from '../matches/ConnectMessageSheet';
import { MOCK_PROFILES } from '../../../data/mockProfiles';
import type { Profile } from '../matches/ProfileCard';

interface ConnectMessageScreenProps {
  onBack: () => void;
}

export const ConnectMessageScreen = ({ onBack }: ConnectMessageScreenProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(true);
  const [variant, setVariant] = useState<SolutionVariant>('3');

  const demoProfile: Profile = MOCK_PROFILES[0];

  const handleSend = useCallback((message: string, autoSend: boolean) => {
    setIsSheetOpen(false);
    setTimeout(() => setIsSheetOpen(true), 800);
  }, []);

  return (
    <div className="relative w-full h-full bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="relative z-50 shrink-0 bg-background px-4 flex items-center gap-2" style={{ height: 'calc(env(safe-area-inset-top, 0px) + 64px)', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
          <ChevronLeft size={24} />
        </Button>
        <div>
          <h1 className="font-medium text-lg tracking-tight">Connect Message</h1>
          <p className="text-xs text-muted-foreground">Bottom sheet preview</p>
        </div>
      </header>

      {/* Controls */}
      <div className="flex-1 px-4 pt-4 space-y-4">
        <div className="bg-card p-4 rounded-2xl border space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Variant</p>
            <div className="flex gap-2">
              {(['1.2b', '3'] as SolutionVariant[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    variant === v
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="default"
            size="default"
            onClick={() => setIsSheetOpen(true)}
            className="w-full"
          >
            Open Sheet
          </Button>
        </div>
      </div>

      {/* Sheet overlay */}
      <ConnectMessageSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSend={handleSend}
        profile={demoProfile}
        savedMessage=""
        isFirstConnect={true}
        variant={variant}
        showStats={true}
        showSubtitle={true}
      />
    </div>
  );
};
