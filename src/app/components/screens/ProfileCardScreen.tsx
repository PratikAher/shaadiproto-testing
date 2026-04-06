import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { ProfileCard } from '../matches/ProfileCard';
import { MOCK_PROFILES } from '../../../data/mockProfiles';
import { cn } from '../../../utils/cn';
import { Chip } from '../Chip';

interface ProfileCardScreenProps {
  onBack: () => void;
}

type CardVariant = 'default' | 'premium' | 'verified';

export const ProfileCardScreen = ({ onBack }: ProfileCardScreenProps) => {
  const [activeVariant, setActiveVariant] = useState<CardVariant>('default');

  // Base profile to modify
  const baseProfile = MOCK_PROFILES[0];

  // Generate profile based on variant
  const getProfileForVariant = () => {
    const profile = { ...baseProfile };
    
    // All variants show online, mutuals, and astro
    profile.isOnline = true;

    switch (activeVariant) {
      case 'default':
        profile.isPremium = false;
        profile.verified = { id: false, selfie: false };
        profile.isVerified = false;
        break;
      case 'premium':
        profile.isPremium = true;
        profile.verified = { id: false, selfie: false };
        profile.isVerified = false;
        break;
      case 'verified':
        profile.isPremium = false;
        profile.verified = { id: true, selfie: true };
        profile.isVerified = true;
        break;
    }
    return profile;
  };

  const variants: { id: CardVariant; label: string }[] = [
    { id: 'default', label: 'Default' },
    { id: 'premium', label: 'Premium' },
    { id: 'verified', label: 'Verified' },
  ];

  return (
    <div className="w-full h-full bg-background flex flex-col font-sans">
      {/* Header */}
      <div className="flex-none z-50 pt-6 pb-2 bg-background">
        <div className="flex flex-col gap-6">
            {/* Top Bar */}
            <div className="px-5 flex items-center gap-3">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-accent transition-colors shrink-0 -ml-2"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="font-bold text-xl tracking-tight text-foreground">Profile Card Variants</h2>
            </div>

            {/* Scrollable Tabs using Chips */}
            <div className="flex gap-2 overflow-x-auto px-5 pb-2 scrollbar-hide items-center">
                {variants.map((variant) => (
                    <Chip
                        key={variant.id}
                        label={variant.label}
                        selected={activeVariant === variant.id}
                        onClick={() => setActiveVariant(variant.id)}
                    />
                ))}
            </div>
        </div>
      </div>
      
      {/* Card Container */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center p-4 pb-8 bg-background">
         <div className="w-full h-full max-w-md relative rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-black/5 bg-black">
             <ProfileCard profile={getProfileForVariant()} />
         </div>
      </div>
    </div>
  );
};