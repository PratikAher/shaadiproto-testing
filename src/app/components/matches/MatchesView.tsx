import React from 'react';
import { Profile, ProfileCard } from './ProfileCard';
import { NEW_PROFILES, DAILY_PROFILES, MY_MATCHES_PROFILES, MORE_MATCHES_PROFILES } from '../../../data/mockProfiles';
import { replaceNameInMessage, type SolutionVariant } from './ConnectMessageSheet';

interface MatchesViewProps {
  currentFilter: string;
  onConnect?: (profile: Profile) => void;
  connectedIds?: Set<string>;
  solutionVariant?: SolutionVariant;
  savedMessage?: string;
  savedMessageFirstName?: string;
  isFirstConnect?: boolean;
  onEditMessage?: (profile: Profile) => void;
  onViewProfile?: (profile: Profile) => void;
  isCurrentUserPremium?: boolean;
  useGreenGradient?: boolean;
  excludeProfileIds?: Set<string>;
  profilePredicate?: (profile: Profile) => boolean;
}

export const MatchesView = ({
  currentFilter,
  onConnect,
  connectedIds = new Set(),
  solutionVariant = '3a',
  savedMessage = '',
  savedMessageFirstName = '',
  isFirstConnect = true,
  onEditMessage,
  onViewProfile,
  isCurrentUserPremium = false,
  useGreenGradient = false,
  excludeProfileIds = new Set(),
  profilePredicate,
}: MatchesViewProps) => {
  const getProfiles = () => {
    switch (currentFilter) {
      case 'new':
        return NEW_PROFILES;
      case 'daily':
        return DAILY_PROFILES;
      case 'matches':
        return MY_MATCHES_PROFILES;
      case 'more':
        return MORE_MATCHES_PROFILES;
      default:
        return DAILY_PROFILES;
    }
  };

  const profiles = getProfiles().filter(
    (p) => !excludeProfileIds.has(p.id) && (profilePredicate ? profilePredicate(p) : true)
  );

  return (
    <div
      className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
      style={{ scrollBehavior: 'smooth' }}
    >
      {profiles.length > 0 ? (
        <>
          {profiles.map((profile) => {
            const profileFirstName = profile.name.split(' ')[0];
            const messageForProfile =
              savedMessage && savedMessageFirstName
                ? replaceNameInMessage(savedMessage, savedMessageFirstName, profileFirstName)
                : savedMessage;

            return (
              <div
                key={profile.id}
                className="w-full h-full snap-start flex items-center justify-center px-2 py-2"
                style={{ scrollSnapStop: 'always' }}
              >
                <ProfileCard
                  profile={profile}
                  onConnect={onConnect}
                  isConnected={connectedIds.has(profile.id)}
                  solutionVariant={solutionVariant}
                  savedMessage={messageForProfile}
                  isFirstConnect={isFirstConnect}
                  onEditMessage={onEditMessage}
                  onViewProfile={onViewProfile}
                  isCurrentUserPremium={isCurrentUserPremium}
                  useGreenGradient={useGreenGradient}
                />
              </div>
            );
          })}

          <div className="w-full h-32 snap-start flex items-center justify-center text-muted-foreground text-sm">
            You've reached the end for today!
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl">👀</span>
          </div>
          <p>No profiles in {currentFilter} yet.</p>
          <p className="text-xs">Check back later!</p>
        </div>
      )}
    </div>
  );
};
