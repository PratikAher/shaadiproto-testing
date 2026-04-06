import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Detects whether the mobile virtual keyboard is open.
 *
 * Strategy (layered for maximum compatibility):
 *
 * 1. **VisualViewport API** (primary, iOS 13+ / Android Chrome 62+):
 *    When the keyboard opens, `window.visualViewport.height` shrinks while
 *    `window.innerHeight` stays the same. A difference > 100px = keyboard is up.
 *
 * 2. **Focus-based fallback** (secondary):
 *    If VisualViewport is unavailable or the app runs inside an iframe/phone
 *    simulator, we track focus on text inputs. When a text input is focused
 *    on a touch device, the keyboard is almost certainly visible.
 *
 * Returns `isKeyboardVisible` boolean only — callers use it to toggle safe-area padding.
 */
export function useKeyboardVisible(): { isKeyboardVisible: boolean } {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const focusedRef = useRef(false);

  // ── Strategy 1: VisualViewport resize ──────────────────────────────────
  const handleViewportResize = useCallback(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    // The difference between the full window height and visual viewport height
    // roughly equals the keyboard height. Threshold of 100px avoids false
    // positives from browser toolbar show/hide.
    const heightDiff = window.innerHeight - vv.height;
    const threshold = 100;

    if (heightDiff > threshold) {
      setIsKeyboardVisible(true);
    } else if (!focusedRef.current) {
      // Only set false if no text input is focused (avoids flicker)
      setIsKeyboardVisible(false);
    }
  }, []);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    vv.addEventListener('resize', handleViewportResize);
    vv.addEventListener('scroll', handleViewportResize);

    return () => {
      vv.removeEventListener('resize', handleViewportResize);
      vv.removeEventListener('scroll', handleViewportResize);
    };
  }, [handleViewportResize]);

  // ── Strategy 2: Focus-based detection ──────────────────────────────────
  // Works on touch devices where focusing a text input always opens the keyboard.
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  useEffect(() => {
    if (!isTouchDevice) return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        const inputType = (target as HTMLInputElement).type;
        // These input types don't open keyboard
        if (inputType === 'checkbox' || inputType === 'radio' || inputType === 'range' || inputType === 'file') return;

        focusedRef.current = true;
        setIsKeyboardVisible(true);
      }
    };

    const handleFocusOut = () => {
      focusedRef.current = false;
      // Small delay to let VisualViewport settle before removing keyboard state
      setTimeout(() => {
        if (!focusedRef.current) {
          setIsKeyboardVisible(false);
        }
      }, 150);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [isTouchDevice]);

  return { isKeyboardVisible };
}
