import React from 'react';
import { Mail, Smartphone, ChevronLeft } from 'lucide-react';
import ShaadiLogo from '../../../imports/ShaadiLogo';
import { Button } from '../Button';

interface OnboardingScreenProps {
  onBack: () => void;
  onSignUp?: () => void;
}

// Google "G" icon — not available in our icon set, so custom SVG is needed
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const OnboardingScreen = ({ onBack, onSignUp }: OnboardingScreenProps) => {
  return (
    <div
      className="w-full h-full flex flex-col font-sans relative"
      style={{
        background: 'linear-gradient(180deg, var(--color-accent-palette-500) 0%, var(--color-accent-palette-700) 100%)',
      }}
    >
      {/* Back Button — using Button component with ghost variant */}
      <div className="flex-none pt-6 px-4">
        <Button
          variant="ghost"
          size="icon-lg"
          shape="pill"
          onClick={onBack}
          className="bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 hover:text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>

      {/* Logo Area — Centered in upper portion */}
      <div className="flex-1 flex items-center justify-center px-12">
        <div className="w-[180px] h-[60px]">
          <ShaadiLogo />
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="flex-none px-5 pb-8 flex flex-col gap-4">
        {/* Tagline */}
        <p className="text-white text-center text-sm font-medium mb-2">
          New to Shaadi.com?
        </p>

        {/* Sign Up with Email — Button component, lg pill, white override */}
        <Button
          variant="outline"
          size="lg"
          shape="pill"
          className="w-full bg-white border-white text-neutral-900 hover:bg-neutral-50 hover:text-neutral-900 justify-start px-5 gap-3"
          onClick={onSignUp}
        >
          <Mail className="w-5 h-5 text-accent-palette-500 shrink-0" />
          <span className="flex-1 text-center pr-8">
            Sign Up with Email
          </span>
        </Button>

        {/* Sign Up with Mobile — Button component */}
        <Button
          variant="outline"
          size="lg"
          shape="pill"
          className="w-full bg-white border-white text-neutral-900 hover:bg-neutral-50 hover:text-neutral-900 justify-start px-5 gap-3"
          onClick={onSignUp}
        >
          <Smartphone className="w-5 h-5 text-accent-palette-500 shrink-0" />
          <span className="flex-1 text-center pr-8">
            Sign Up with Mobile
          </span>
        </Button>

        {/* Sign Up with Google — Button component */}
        <Button
          variant="outline"
          size="lg"
          shape="pill"
          className="w-full bg-white border-white text-neutral-900 hover:bg-neutral-50 hover:text-neutral-900 justify-start px-5 gap-3"
          onClick={onSignUp}
        >
          <span className="shrink-0"><GoogleIcon /></span>
          <span className="flex-1 text-center pr-8">
            Sign Up with Google
          </span>
        </Button>

        {/* Login Row */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-white/80 text-sm">Already have an account?</span>
          <Button
            variant="outline"
            size="sm"
            shape="pill"
            className="border-white text-white bg-transparent hover:bg-white/10 hover:text-white"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};