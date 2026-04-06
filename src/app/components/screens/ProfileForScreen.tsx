import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BackArrowIcon } from '../icons';
import { PictoUser } from '../icons/pictorials';
import { Button } from '../Button';
import { SelectChip } from '../SelectChip';

interface ProfileForScreenProps {
  onBack: () => void;
  onNext?: (selection: string, gender?: string) => void;
}

type Phase = 'loading' | 'form';

const PROFILE_OPTIONS = [
  'Myself',
  'My Son',
  'My Daughter',
  'My Brother',
  'My Sister',
  'My Friend',
  'My Relative',
];

const GENDER_OPTIONS = ['Male', 'Female'];

export const ProfileForScreen = ({ onBack, onNext }: ProfileForScreenProps) => {
  const [phase, setPhase] = useState<Phase>('loading');
  const [selected, setSelected] = useState<string | null>('Myself');
  const [gender, setGender] = useState<string | null>(null);

  // Auto-transition from loading to form after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('form');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (option: string) => {
    setSelected(option);
    setGender(null); // Reset gender when changing selection

    // If NOT "Myself", advance to next screen after a brief delay
    if (option !== 'Myself') {
      setTimeout(() => {
        onNext?.(option);
      }, 400);
    }
  };

  const handleGenderSelect = (g: string) => {
    setGender(g);
    // After selecting gender, advance
    setTimeout(() => {
      onNext?.('Myself', g);
    }, 400);
  };

  const isForm = phase === 'form';

  return (
    <div className="w-full h-full relative bg-transparent font-sans">
      {/* Backdrop overlay — fades out as sheet goes fullscreen */}
      <motion.div
        className="absolute inset-0 bg-black/30 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isForm ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{ pointerEvents: isForm ? 'none' : 'auto' }}
      />

      {/* Single sheet container that transforms from bottom sheet to full page */}
      <motion.div
        className="absolute left-0 right-0 z-20 bg-background flex flex-col overflow-hidden"
        initial={{
          bottom: 0,
          top: 'auto',
          height: '45%',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        animate={{
          height: isForm ? '100%' : '45%',
          borderTopLeftRadius: isForm ? 0 : 28,
          borderTopRightRadius: isForm ? 0 : 28,
        }}
        transition={{
          type: 'spring',
          damping: 32,
          stiffness: 280,
          mass: 0.9,
        }}
        style={{ bottom: 0 }}
      >
        {/* Drag handle — only visible during loading */}
        <motion.div
          className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-border z-10"
          animate={{ opacity: isForm ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Inner content cross-fades between loading and form */}
        <AnimatePresence mode="wait">
          {phase === 'loading' && (
            <motion.div
              key="loading-content"
              className="flex-1 flex flex-col items-center justify-center px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Loader spinner */}
              <div className="mb-6">
                <motion.div
                  className="w-10 h-10"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: 'linear',
                  }}
                >
                  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="var(--color-border)"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M20 4 A16 16 0 0 1 36 20"
                      stroke="var(--color-accent-palette-500)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>
              </div>

              {/* Loading text */}
              <p className="text-muted-foreground text-center text-sm" style={{ lineHeight: '1.6' }}>
                Let's add your details while we
                <br />
                find Matches for you
              </p>
            </motion.div>
          )}

          {phase === 'form' && (
            <motion.div
              key="form-content"
              className="flex-1 flex flex-col overflow-y-auto scrollbar-hide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Back Button */}
              <div className="flex-none pt-4 px-4">
                <Button
                  variant="ghost"
                  size="icon"
                  shape="pill"
                  onClick={onBack}
                  className="text-foreground hover:bg-accent -ml-1"
                >
                  <BackArrowIcon className="w-6 h-6" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 pt-4 pb-8 flex flex-col">
                {/* Person Icon */}
                <motion.div
                  className="flex justify-center mb-6"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-pictorial-orange-bg)' }}
                  >
                    <PictoUser size={40} />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                  className="text-foreground mb-6"
                  style={{ fontSize: '20px', fontWeight: 500, lineHeight: '1.3' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  This Profile is for
                </motion.h1>

                {/* Profile Options */}
                <motion.div
                  className="flex flex-wrap gap-3 mb-8"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {PROFILE_OPTIONS.map((option) => (
                    <SelectChip
                      key={option}
                      label={option}
                      selected={selected === option}
                      onClick={() => handleSelect(option)}
                      size="md"
                      className={
                        selected === option
                          ? ''
                          : 'border-border bg-background text-foreground hover:bg-muted'
                      }
                    />
                  ))}
                </motion.div>

                {/* Gender Section - only if "Myself" selected */}
                <AnimatePresence>
                  {selected === 'Myself' && (
                    <motion.div
                      key="gender-section"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mb-8">
                        <h2
                          className="text-foreground mb-4"
                          style={{ fontSize: '20px', fontWeight: 500 }}
                        >
                          Your Gender
                        </h2>
                        <div className="flex flex-wrap gap-3">
                          {GENDER_OPTIONS.map((g) => (
                            <SelectChip
                              key={g}
                              label={g}
                              selected={gender === g}
                              onClick={() => handleGenderSelect(g)}
                              size="md"
                              className={
                                gender === g
                                  ? ''
                                  : 'border-border bg-background text-foreground hover:bg-muted'
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Warning Notice */}
                <motion.div
                  className="rounded-2xl p-4 flex gap-3"
                  style={{ backgroundColor: 'var(--color-warning-notice-bg)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                >
                  <div className="shrink-0 mt-0.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#F5A623' }}
                    >
                      <span className="text-white text-xs" style={{ fontWeight: 700 }}>!</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs" style={{ lineHeight: '1.6' }}>
                    Shaadi.com is built for genuine match-seekers. Any falsification, commercial use or
                    Profiles by marriage bureaus are strictly prohibited and may be reported to law
                    enforcement.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};