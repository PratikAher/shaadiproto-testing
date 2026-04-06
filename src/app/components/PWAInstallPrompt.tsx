import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../utils/cn';
import { X, Download } from 'lucide-react';

// ═══════════════════════════════════════════════════════
// Types for the BeforeInstallPromptEvent
// (not in TS's built-in lib.dom because it's non-standard)
// ═══════════════════════════════════════════════════════
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

// Extend Window to include the event
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

// ═══════════════════════════════════════════════════════
// PWA Install Prompt Component
// ═══════════════════════════════════════════════════════
// Shows a small banner when the app is installable.
// Listens for `beforeinstallprompt` to capture the deferred
// prompt, and `appinstalled` to hide after install.
// ═══════════════════════════════════════════════════════

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const dismissedRef = useRef(false);

  // Check if already running as installed PWA
  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }
  }, []);

  // Listen for the install prompt event
  useEffect(() => {
    if (isInstalled) return;

    const handleBeforeInstall = (e: BeforeInstallPromptEvent) => {
      // Prevent the default mini-infobar on mobile
      e.preventDefault();
      // Stash the event for later use
      setDeferredPrompt(e);
      // Show our custom banner (unless user dismissed it already)
      if (!dismissedRef.current) {
        setIsVisible(true);
      }
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      setShowSuccess(true);
      // Hide success toast after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, [isInstalled]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    // Show the native install prompt
    await deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsVisible(false);
      setDeferredPrompt(null);
    }
    // If dismissed, keep the banner available
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    dismissedRef.current = true;
  }, []);

  return (
    <>
      {/* Install banner */}
      <AnimatePresence>
        {isVisible && !isInstalled && (
          <motion.div
            className="absolute top-0 left-0 right-0 z-[100]"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div
              className="mx-3 mt-2 rounded-2xl border shadow-lg overflow-hidden"
              style={{
                backgroundColor: 'var(--color-card)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center gap-3 px-3.5 py-3">
                {/* App icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#0AA4B8' }}
                >
                  <svg width="22" height="22" viewBox="0 0 512 512" fill="none">
                    <path d="M 152 170 L 180 280 Q 180 380 256 400 Q 332 380 332 280 L 360 170 Q 340 220 300 250 Q 256 230 212 250 Q 172 220 152 170 Z" fill="white"/>
                    <ellipse cx="220" cy="300" rx="16" ry="20" fill="#0AA4B8"/>
                    <ellipse cx="292" cy="300" rx="16" ry="20" fill="#0AA4B8"/>
                    <path d="M 256 325 L 248 338 Q 256 344 264 338 Z" fill="#FF8FAB"/>
                  </svg>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-foreground truncate"
                    style={{ fontSize: '13px', fontWeight: 600, lineHeight: '18px' }}
                  >
                    Install MeowUI
                  </p>
                  <p
                    className="text-muted-foreground truncate"
                    style={{ fontSize: '11px', fontWeight: 400, lineHeight: '15px' }}
                  >
                    Add to home screen for the full experience
                  </p>
                </div>

                {/* Install button */}
                <button
                  type="button"
                  onClick={handleInstall}
                  className="shrink-0 h-8 px-3.5 rounded-full flex items-center gap-1.5 text-white active:scale-95 transition-transform"
                  style={{
                    backgroundColor: '#0AA4B8',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  <Download size={13} strokeWidth={2.5} />
                  Install
                </button>

                {/* Dismiss */}
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="absolute bottom-24 left-0 right-0 z-[100] flex justify-center px-6"
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div
              className="rounded-full px-5 py-2.5 shadow-lg flex items-center gap-2"
              style={{ backgroundColor: '#0AA4B8' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5L6.5 12L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>
                App installed successfully!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
