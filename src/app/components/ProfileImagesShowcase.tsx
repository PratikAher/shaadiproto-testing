import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from './Button';
import { MOCK_PROFILES } from '../../data/mockProfiles';

/**
 * ProfileImagesShowcase — Design system audit page.
 * Shows every profile's full image + avatar side-by-side so we can
 * visually verify the correct assets are mapped.
 */

interface ProfileImagesShowcaseProps {
  onBack: () => void;
}

// Distribution labels for quick reference
const getDistributionLabel = (index: number): string => {
  const labels: Record<number, string> = {
    0: 'New', 3: 'New', 6: 'New',
    16: 'Daily (1st)', 12: 'Daily', 14: 'Daily', 15: 'Daily',
    8: 'Daily (VIP)', 17: 'Daily', 18: 'Daily', 19: 'Daily',
    21: 'Daily', 11: 'Daily (VIP)',
    22: 'My Matches', 23: 'My Matches', 24: 'My Matches', 25: 'My Matches',
    26: 'My Matches', 27: 'My Matches', 28: 'My Matches', 29: 'My Matches',
    30: 'My Matches', 31: 'My Matches',
    33: 'More', 34: 'More', 35: 'More', 36: 'More',
    37: 'More', 38: 'More', 39: 'More', 13: 'More (VIP)',
    2: 'Inbox', 5: 'Inbox', 7: 'Inbox', 9: 'Inbox',
    20: 'Inbox', 10: 'Inbox', 32: 'Inbox',
    1: 'Chat Only', 4: 'Chat Only',
  };
  return labels[index] || '—';
};

// Profiles that had their avatar imports fixed (mismatched → corrected)
const AVATAR_FIXED_INDICES = new Set([16, 17, 18, 19, 20, 21]); // profiles 16-21 had wrong avatar hashes
const AVATAR_NAMED_INDICES = new Set([31, 32, 33, 34, 35, 36, 37, 38, 39, 40]); // profiles 31-40 got proper named avatar imports (were using full as avatar)

// Check if avatar and full appear to be the same URL
const isSameImage = (full?: string, avatar?: string): boolean => {
  if (!full || !avatar) return false;
  return full === avatar;
};

export const ProfileImagesShowcase: React.FC<ProfileImagesShowcaseProps> = ({ onBack }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Sticky header */}
      <section className="flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur z-40 py-2 -mx-4 px-4 border-b md:static md:bg-transparent md:border-none md:p-0 md:m-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
          <ChevronLeft size={24} />
        </Button>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, lineHeight: '28px' }}>Profile Images</h2>
          <p style={{ fontSize: 13, lineHeight: '18px', color: '#72727d' }}>
            {MOCK_PROFILES.length} profiles — Full &amp; Avatar audit
          </p>
        </div>
      </section>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 px-1">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
          <span className="w-2 h-2 rounded-full bg-red-500" /> Same / Missing avatar
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
          <span className="w-2 h-2 rounded-full bg-green-500" /> Unique avatar
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
          <span className="w-2 h-2 rounded-full bg-blue-500" /> Avatar fixed
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}>
          <span className="w-2 h-2 rounded-full bg-purple-500" /> Avatar named
        </span>
      </div>

      {/* Profile Cards */}
      <div className="flex flex-col gap-3">
        {MOCK_PROFILES.map((profile, index) => {
          const fullUrl = profile.photos?.full || profile.imageUrl || '';
          const avatarUrl = profile.photos?.avatar || profile.avatarUrl || '';
          const same = isSameImage(fullUrl, avatarUrl);
          const firstName = profile.name.split(' ')[0];
          const lastInitial = profile.name.split(' ')[1]?.charAt(0) || '';
          const distLabel = getDistributionLabel(index);
          const wasFixed = AVATAR_FIXED_INDICES.has(index);
          const wasNamed = AVATAR_NAMED_INDICES.has(index);

          return (
            <div
              key={profile.id}
              className="rounded-2xl overflow-hidden"
              style={{
                border: wasFixed ? '2px solid #2563eb' : wasNamed ? '2px solid #7c3aed' : same ? '2px solid #ef4444' : '1px solid #dfe0e3',
                backgroundColor: wasFixed ? '#eff6ff' : wasNamed ? '#faf5ff' : same ? '#fef2f2' : '#fff',
              }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid #eee' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="shrink-0 flex items-center justify-center rounded-md"
                    style={{
                      width: 28, height: 28,
                      fontSize: 12, fontWeight: 700,
                      backgroundColor: wasFixed ? '#dbeafe' : wasNamed ? '#f3e8ff' : '#f3f4f6',
                      color: wasFixed ? '#2563eb' : wasNamed ? '#7c3aed' : '#41404d',
                    }}
                  >
                    {index}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate" style={{ fontSize: 14, fontWeight: 600, lineHeight: '20px', color: '#41404d' }}>
                        {firstName} {lastInitial}
                      </p>
                      {wasFixed && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded-full" style={{ fontSize: 9, fontWeight: 700, backgroundColor: '#2563eb', color: '#fff' }}>
                          AVATAR FIXED
                        </span>
                      )}
                      {wasNamed && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded-full" style={{ fontSize: 9, fontWeight: 700, backgroundColor: '#7c3aed', color: '#fff' }}>
                          AVATAR NAMED
                        </span>
                      )}
                    </div>
                    <p className="truncate" style={{ fontSize: 11, lineHeight: '16px', color: '#72727d' }}>
                      {profile.id} · {profile.isPremium ? '★ Premium' : 'Free'}{profile.isVip ? ' · VIP' : ''}
                    </p>
                  </div>
                </div>
                <span
                  className="shrink-0 px-2 py-0.5 rounded-full"
                  style={{
                    fontSize: 11, fontWeight: 500, lineHeight: '16px',
                    backgroundColor: distLabel.includes('VIP') ? '#fef3c7' :
                      distLabel === 'Chat Only' ? '#dbeafe' :
                      distLabel === 'Inbox' ? '#fce7f3' :
                      '#f3f4f6',
                    color: '#41404d',
                  }}
                >
                  {distLabel}
                </span>
              </div>

              {/* Images row */}
              <div className="flex gap-3 p-3">
                {/* Full Image */}
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div
                    className="w-full rounded-xl overflow-hidden bg-neutral-100"
                    style={{ aspectRatio: '3/4' }}
                  >
                    {fullUrl ? (
                      <img src={fullUrl} alt={`${profile.name} full`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ color: '#95959d', fontSize: 12 }}>
                        No image
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#72727d' }}>Full</span>
                </div>

                {/* Avatar Image */}
                <div className="flex flex-col items-center gap-1.5" style={{ width: 100 }}>
                  <div
                    className="rounded-full overflow-hidden bg-neutral-100 shrink-0"
                    style={{ width: 80, height: 80 }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={`${profile.name} avatar`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ color: '#95959d', fontSize: 11 }}>
                        None
                      </div>
                    )}
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    color: wasFixed ? '#2563eb' : wasNamed ? '#7c3aed' : same ? '#ef4444' : '#72727d',
                  }}>
                    {wasFixed ? 'Fixed!' : wasNamed ? 'Named' : same ? 'Same as full!' : 'Avatar'}
                  </span>
                  {/* Status indicator */}
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full"
                    style={{
                      fontSize: 10, fontWeight: 600,
                      backgroundColor: wasFixed ? '#dbeafe' : wasNamed ? '#f3e8ff' : same ? '#fee2e2' : '#dcfce7',
                      color: wasFixed ? '#2563eb' : wasNamed ? '#7c3aed' : same ? '#dc2626' : '#16a34a',
                    }}
                  >
                    {wasFixed ? 'PERSON MATCHED' : wasNamed ? 'PROPERLY NAMED' : same ? 'NEEDS CROP' : 'OK'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  );
};