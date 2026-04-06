import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Lottie from 'lottie-react';
import { Check, Info, Camera, ImagePlus, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '../Button';
import { Chip } from '../Chip';
import { FloatingLabelInput } from '../FloatingLabelInput';
import { FloatingLabelSelect } from '../FloatingLabelSelect';
import {
  PictoUsersGreen,
  PictoLocation,
  PictoProfile,
  PictoQualification,
  PictoProfession,
  PictoProfileEdit,
  PictoSafety,
  PictoUsersPink,
} from '../icons/pictorials';
import { BackArrowIcon } from '../icons';
import { cn } from '../../../utils/cn';
import imgVerification from "figma:asset/6bbde89936d233c2211e11df68bf016b303b28a5.png";
import PhotoUploadAvatar from '../../../imports/Frame1707479720';
import ShaadiLogo from '../../../imports/ShaadiLogo';
import ShaadiComLogo from '../../../imports/Group1';
import findingMatchesAnimationData from '../../../data/findingMatchesLottie';

// ═══════════════════════════════════════════════════════
// Types & Constants
// ═══════════════════════════════════════════════════════

interface RegistrationFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

type Direction = 1 | -1;

const TOTAL_STEPS = 15;
const HEADER_SKIP_STEPS = new Set([8, 9, 10, 11, 12]);
const HEADER_NO_BACK_STEPS = new Set([6, 7, 8, 9, 10, 11, 13]);

const CREATIVE_HOBBIES_MAIN = [
  { emoji: '✍️', label: 'Writing' },
  { emoji: '🍳', label: 'Cooking' },
  { emoji: '🎤', label: 'Singing' },
  { emoji: '📸', label: 'Photography' },
];
const CREATIVE_HOBBIES_MORE = [
  { emoji: '🎸', label: 'Playing instruments' },
  { emoji: '🖌️', label: 'Painting' },
  { emoji: '🛠️', label: 'DIY crafts' },
  { emoji: '💃', label: 'Dancing' },
  { emoji: '🎭', label: 'Acting' },
  { emoji: '📝', label: 'Poetry' },
  { emoji: '🌱', label: 'Gardening' },
  { emoji: '✏️', label: 'Blogging' },
  { emoji: '🎥', label: 'Content creation' },
  { emoji: '✂️', label: 'Designing' },
  { emoji: '🖊️', label: 'Doodling' },
];

const FUN_HOBBIES_MAIN = [
  { emoji: '🎬', label: 'Movies' },
  { emoji: '🎵', label: 'Music' },
  { emoji: '✈️', label: 'Travelling' },
  { emoji: '📖', label: 'Reading' },
];
const FUN_HOBBIES_MORE = [
  { emoji: '⚽', label: 'Sports' },
  { emoji: '📱', label: 'Social media' },
  { emoji: '🎮', label: 'Gaming' },
  { emoji: '📺', label: 'Binge-watching' },
  { emoji: '🚴', label: 'Biking' },
  { emoji: '🎉', label: 'Clubbing' },
  { emoji: '🛍️', label: 'Shopping' },
  { emoji: '🎭', label: 'Theater & Events' },
  { emoji: '🏯', label: 'Anime' },
  { emoji: '🎤', label: 'Stand ups' },
];

const FITNESS_HOBBIES_MAIN = [
  { emoji: '🏃', label: 'Running' },
  { emoji: '🚴‍♂️', label: 'Cycling' },
  { emoji: '🧘', label: 'Yoga & Meditation' },
  { emoji: '🚶', label: 'Walking' },
];
const FITNESS_HOBBIES_MORE = [
  { emoji: '💪', label: 'Working out' },
  { emoji: '🥾', label: 'Trekking' },
  { emoji: '🤸', label: 'Aerobics/Zumba' },
  { emoji: '🏊', label: 'Swimming' },
];

const OTHER_INTERESTS_MAIN = [
  { emoji: '🐾', label: 'Pets' },
  { emoji: '🍔', label: 'Foodie' },
  { emoji: '🌿', label: 'Vegan' },
];
const OTHER_INTERESTS_MORE = [
  { emoji: '📰', label: 'News & Politics' },
  { emoji: '🤝', label: 'Social service' },
];

const slideVariants = {
  enter: (direction: Direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: Direction) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

// ═══════════════════════════════════════════════════════
// Shared sub-components
// ═══════════════════════════════════════════════════════

// ── Date of Birth Input ──

interface DOBInputProps {
  day: string; month: string; year: string;
  onDayChange: (v: string) => void;
  onMonthChange: (v: string) => void;
  onYearChange: (v: string) => void;
}

const DOBInput = ({ day, month, year, onDayChange, onMonthChange, onYearChange }: DOBInputProps) => (
  <div>
    <p className="text-foreground mb-3" style={{ fontSize: '15px', fontWeight: 500 }}>
      Date of birth
    </p>
    <div className="flex gap-3">
      {[
        { label: 'Day', value: day, onChange: onDayChange, placeholder: 'DD', maxLen: 2 },
        { label: 'Month', value: month, onChange: onMonthChange, placeholder: 'MM', maxLen: 2 },
        { label: 'Year', value: year, onChange: onYearChange, placeholder: 'YYYY', maxLen: 4 },
      ].map((field) => (
        <div key={field.label} className="flex-1 relative">
          <input
            type="text"
            inputMode="numeric"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
            placeholder={field.placeholder}
            maxLength={field.maxLen}
            className="peer w-full rounded-[16px] px-5 h-12 bg-transparent text-foreground placeholder:text-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border border-input transition-all"
            style={{ fontSize: '14px' }}
          />
          <label
            className="absolute left-[14px] top-0 -translate-y-1/2 z-10 scale-90 origin-[0] px-2 bg-background text-muted-foreground peer-focus:text-primary transition-colors duration-200"
            style={{ fontSize: '14px' }}
          >
            {field.label}
          </label>
        </div>
      ))}
    </div>
  </div>
);

// ── Pictorial Header ──

const PictorialHeader = ({
  icon: Icon,
  bgColor,
  subtitle,
}: {
  icon: React.FC<{ size?: number; className?: string }>;
  bgColor: string;
  subtitle?: string;
}) => (
  <motion.div
    className="flex flex-col items-center mb-6"
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 0.1, duration: 0.35 }}
  >
    <div
      className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-3"
      style={{ backgroundColor: bgColor }}
    >
      <Icon size={36} />
    </div>
    {subtitle && (
      <p className="text-muted-foreground text-center" style={{ fontSize: '13px', fontWeight: 400 }}>
        {subtitle}
      </p>
    )}
  </motion.div>
);

// ── Continue Button ──

const ContinueButton = ({ isValid, onClick, label = 'Continue' }: {
  isValid: boolean; onClick: () => void; label?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.25, duration: 0.3 }}
  >
    <Button
      variant="default"
      size="lg"
      shape="pill"
      className="w-full"
      onClick={isValid ? onClick : undefined}
      disabled={!isValid}
    >
      {label}
    </Button>
  </motion.div>
);

// ── Preference Section Row ──

const PreferenceRow = ({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) => (
  <button
    type="button"
    className={cn(
      'w-full flex items-center justify-between py-3.5 px-4 text-left',
      !isLast && 'border-b border-border'
    )}
  >
    <div className="flex-1 min-w-0">
      <p className="text-muted-foreground" style={{ fontSize: '11px', fontWeight: 400 }}>{label}</p>
      <p className="text-foreground truncate" style={{ fontSize: '14px', fontWeight: 500 }}>{value}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
  </button>
);

// ── Finding Matches Animation ──

const FindingMatchesScreen = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onDone();
    }, 6000);

    return () => {
      clearTimeout(timeout);
    };
  }, [onDone]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background">
      <motion.div
        className="w-[200px] h-[200px]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Lottie
          animationData={findingMatchesAnimationData}
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </motion.div>
      <motion.p
        className="text-muted-foreground mt-4"
        style={{ fontSize: '14px', fontWeight: 400 }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
      >
        Finding Matches for you
      </motion.p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════

export const RegistrationFlow = ({ onBack, onComplete }: RegistrationFlowProps) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);

  // ── Steps 0–5 state ──
  const [firstName, setFirstName] = useState('Pratik');
  const [lastName, setLastName] = useState('Aher');
  const [dobDay, setDobDay] = useState('15');
  const [dobMonth, setDobMonth] = useState('01');
  const [dobYear, setDobYear] = useState('1999');

  const [religion, setReligion] = useState('Hindu');
  const [community, setCommunity] = useState('Marathi');
  const [livingIn, setLivingIn] = useState('India');

  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');
  const [subCommunity, setSubCommunity] = useState('96 Kuli Maratha');
  const [notParticular, setNotParticular] = useState(false);

  const [maritalStatus, setMaritalStatus] = useState('Never Married');
  const [height, setHeight] = useState('5ft 7in - 170cm');
  const [diet, setDiet] = useState('Occasionally Non-Veg');

  const [qualification, setQualification] = useState('B.Tech');
  const [college, setCollege] = useState('');

  const [income, setIncome] = useState('INR 10 Lakh to 15 Lakh');
  const [companyType, setCompanyType] = useState('Private Company');
  const [workAs, setWorkAs] = useState('Product Designer');
  const [companyName, setCompanyName] = useState('');

  // ── Step 7: About Yourself ──
  const [aboutMe, setAboutMe] = useState(
    "Hey! I'm an engineer-turned Product Designer currently working between Mumbai and Pune. I'm a curious, adventure-loving person who enjoys deep conversations, cooking, bike rides, playing badminton, trying new creative projects, and spending time with friends. I speak Marathi, Hindi, and English, and I value genuine connection, clarity, and mutual respect. I'm hoping to meet someone who is kind, career-driven, empathetic, and excited to grow together as a team."
  );
  const [dontAddSearch, setDontAddSearch] = useState(false);

  // ── Step 8: Verify Mobile ──
  const [otp, setOtp] = useState('');
  const otpInputRef = useRef<HTMLInputElement>(null);

  // ── Step 10: Hobbies ──
  const [selectedHobbies, setSelectedHobbies] = useState<Set<string>>(new Set());
  const [showMoreCreative, setShowMoreCreative] = useState(false);
  const [showMoreFun, setShowMoreFun] = useState(false);
  const [showMoreFitness, setShowMoreFitness] = useState(false);
  const [showMoreOther, setShowMoreOther] = useState(false);

  // ── Step 11–12: Family ──
  const [motherProfession, setMotherProfession] = useState('Employed');
  const [fatherProfession, setFatherProfession] = useState('Employed');
  const [brothers, setBrothers] = useState('1');
  const [sisters, setSisters] = useState('0');
  const [familyLocation, setFamilyLocation] = useState('Jalgaon, Maharashtra');
  const [liveWithFamily, setLiveWithFamily] = useState('');
  const [financialStatus, setFinancialStatus] = useState('High');
  const [familyType, setFamilyType] = useState('Nuclear');

  // ── Helpers ──

  const toggleHobby = useCallback((label: string) => {
    setSelectedHobbies((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label); else next.add(label);
      return next;
    });
  }, []);

  const isStepValid = useCallback(() => {
    switch (step) {
      case 0: return firstName.trim() !== '' && lastName.trim() !== '' && dobDay !== '' && dobMonth !== '' && dobYear !== '';
      case 1: return religion !== '' && community !== '' && livingIn !== '';
      case 2: return state !== '' && city !== '' && subCommunity !== '';
      case 3: return maritalStatus !== '' && height !== '' && diet !== '';
      case 4: return qualification !== '';
      case 5: return income !== '' && companyType !== '' && workAs !== '';
      case 6: return true;
      case 7: return aboutMe.trim() !== '';
      case 8: return otp.length === 6;
      case 9: return true;
      case 10: return selectedHobbies.size >= 1;
      case 11: return true;
      case 12: return true;
      case 13: return true;
      default: return false;
    }
  }, [step, firstName, lastName, dobDay, dobMonth, dobYear, religion, community, livingIn, state, city, subCommunity, maritalStatus, height, diet, qualification, income, companyType, workAs, aboutMe, otp, selectedHobbies]);

  const goForward = useCallback(() => {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      onComplete();
    }
  }, [step, onComplete]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    } else {
      onBack();
    }
  }, [step, onBack]);

  const valid = isStepValid();

  // ═══════════════════════════════════════════════════════
  // Step Renderer
  // ═══════════════════════════════════════════════════════

  const renderStep = () => {
    switch (step) {

      // ─── Step 0: Your name ───
      case 0:
        return (
          <div className="flex-1 flex flex-col px-6 pt-2 pb-8">
            <div className="flex flex-col items-center mb-6"><div className="w-[72px] h-[72px] mb-3" /></div>
            <motion.h1 className="text-foreground mb-8" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '1.3' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
              Your name
            </motion.h1>
            <motion.div className="space-y-5 flex-1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }}>
              <FloatingLabelInput label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <FloatingLabelInput label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <DOBInput day={dobDay} month={dobMonth} year={dobYear} onDayChange={setDobDay} onMonthChange={setDobMonth} onYearChange={setDobYear} />
            </motion.div>
            <ContinueButton isValid={valid} onClick={goForward} />
          </div>
        );

      // ─── Step 1: Profile for ───
      case 1:
        return (
          <div className="flex-1 flex flex-col px-6 pt-2 pb-8">
            <PictorialHeader icon={PictoUsersGreen} bgColor="var(--color-pictorial-green-bg)" subtitle="Tell us about yourself" />
            <motion.h1 className="text-foreground mb-6" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '1.3' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
              Your religion
            </motion.h1>
            <motion.div className="space-y-5 flex-1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }}>
              <FloatingLabelSelect label="Religion" value={religion} required options={['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other']} onChange={setReligion} />
              <FloatingLabelSelect label="Community" value={community} required options={['Kannada', 'Tamil', 'Telugu', 'Malayalam', 'Marathi', 'Gujarati', 'Bengali', 'Punjabi', 'Other']} onChange={setCommunity} />
              <FloatingLabelSelect label="Living in" value={livingIn} required options={['India', 'USA', 'UK', 'Canada', 'Australia', 'UAE', 'Germany', 'Other']} onChange={setLivingIn} />
            </motion.div>
            <ContinueButton isValid={valid} onClick={goForward} />
          </div>
        );

      // ─── Step 2: State / City / Sub-community ───
      case 2:
        return (
          <div className="flex-1 flex flex-col px-6 pt-2 pb-8 overflow-y-auto scrollbar-hide">
            <PictorialHeader icon={PictoLocation} bgColor="var(--color-pictorial-pink-bg)" subtitle="Now let's build your Profile" />
            <motion.h1 className="text-foreground mb-6" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '1.3' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
              State
            </motion.h1>
            <motion.div className="space-y-5 flex-1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
              <FloatingLabelSelect label="State you live in" value={state} options={['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana', 'Delhi', 'Gujarat', 'Rajasthan', 'Uttar Pradesh']} onChange={setState} />
              <div>
                <h2 className="text-foreground mb-4" style={{ fontSize: '20px', fontWeight: 500 }}>City</h2>
                <FloatingLabelSelect label="City you live in" value={city} options={['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane', 'Bangalore', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata']} onChange={setCity} />
              </div>
              <div>
                <h2 className="text-foreground mb-4" style={{ fontSize: '20px', fontWeight: 500 }}>Sub-community</h2>
                <FloatingLabelSelect label="Your Sub-community" value={subCommunity} options={['96 Kuli Maratha', 'Deshastha Maratha', 'CKP', 'Vokkaliga', 'Lingayat', 'Brahmin', 'Reddy', 'Nair', 'Other']} onChange={setSubCommunity} />
              </div>
              <label className="flex items-start gap-3 cursor-pointer py-1">
                <button type="button" onClick={() => setNotParticular(!notParticular)}
                  className="shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                  style={{ borderColor: notParticular ? '#0AA4B8' : 'var(--color-border)', backgroundColor: notParticular ? '#0AA4B8' : 'transparent' }}>
                  {notParticular && <Check className="w-3 h-3 text-white" />}
                </button>
                <span className="text-muted-foreground" style={{ fontSize: '12px', lineHeight: '1.5' }}>
                  Not particular about my partner's community<br />(Caste no bar)
                </span>
              </label>
            </motion.div>
            <div className="pt-4"><ContinueButton isValid={valid} onClick={goForward} /></div>
          </div>
        );

      // ─── Step 3: Marital status / Height / Diet ───
      case 3:
        return (
          <div className="flex-1 flex flex-col px-6 pt-2 pb-8">
            <PictorialHeader icon={PictoProfile} bgColor="var(--color-pictorial-purple-bg)" />
            <motion.h1 className="text-foreground mb-6" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '1.3' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
              Marital status
            </motion.h1>
            <motion.div className="space-y-5 flex-1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
              <FloatingLabelSelect label="Your Marital status" value={maritalStatus} required options={['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Annulled']} onChange={setMaritalStatus} />
              <div>
                <h2 className="text-foreground mb-4" style={{ fontSize: '20px', fontWeight: 500 }}>Height</h2>
                <FloatingLabelSelect label="Your height" value={height} required options={[
                  '4ft 10in - 147cm', '4ft 11in - 150cm', '5ft 0in - 152cm',
                  '5ft 1in - 155cm', '5ft 2in - 157cm', '5ft 3in - 160cm',
                  '5ft 4in - 162cm', '5ft 5in - 165cm', '5ft 6in - 167cm',
                  '5ft 7in - 170cm', '5ft 8in - 172cm', '5ft 9in - 175cm',
                  '5ft 10in - 177cm', '5ft 11in - 180cm', '6ft 0in - 182cm',
                  '6ft 1in - 185cm', '6ft 2in - 187cm',
                ]} onChange={setHeight} />
              </div>
              <div>
                <h2 className="text-foreground mb-4" style={{ fontSize: '20px', fontWeight: 500 }}>Diet</h2>
                <FloatingLabelSelect label="Your Diet" value={diet} required options={['Veg', 'Non-Veg', 'Occasionally Non-Veg', 'Eggetarian', 'Jain', 'Vegan']} onChange={setDiet} />
              </div>
            </motion.div>
            <div className="pt-4"><ContinueButton isValid={valid} onClick={goForward} /></div>
          </div>
        );

      // ─── Step 4: Highest qualification ───
      case 4:
        return (
          <div className="flex-1 flex flex-col px-6 pt-2 pb-8">
            <PictorialHeader icon={PictoQualification} bgColor="var(--color-pictorial-blue-bg)" />
            <motion.h1 className="text-foreground mb-6" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '1.3' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
              Highest qualification
            </motion.h1>
            <motion.div className="space-y-5 flex-1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
              <FloatingLabelSelect label="Your qualification" value={qualification} required options={[
                'B.Tech', 'B.E.', 'B.Arch', 'B.Sc', 'B.Com', 'B.A.',
                'BBA', 'BCA', 'MBBS', 'BDS', 'LLB',
                'M.Tech', 'M.E.', 'M.Sc', 'M.Com', 'M.A.',
                'MBA', 'MCA', 'MD', 'MS', 'LLM',
                'Ph.D', 'Diploma', 'Other',
              ]} onChange={setQualification} />
              <div>
                <h2 className="text-foreground mb-4" style={{ fontSize: '20px', fontWeight: 500 }}>College</h2>
                <FloatingLabelInput label="College you attended" value={college} onChange={(e) => setCollege(e.target.value)} />
              </div>
            </motion.div>
            <div className="pt-4"><ContinueButton isValid={valid} onClick={goForward} /></div>
          </div>
        );

      // ─── Step 5: Annual income / Work details ───
      case 5:
        return (
          <div className="flex-1 flex flex-col px-6 pt-2 pb-8 overflow-y-auto scrollbar-hide">
            <PictorialHeader icon={PictoProfession} bgColor="var(--color-pictorial-green-bg)" />
            <motion.h1 className="text-foreground mb-6" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '1.3' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
              Annual income
            </motion.h1>
            <motion.div className="space-y-5 flex-1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
              <div>
                <FloatingLabelSelect label="Your annual income" value={income} required options={[
                  'INR 0 to 1 Lakh', 'INR 1 Lakh to 2 Lakh', 'INR 2 Lakh to 4 Lakh',
                  'INR 4 Lakh to 7 Lakh', 'INR 7 Lakh to 10 Lakh', 'INR 10 Lakh to 15 Lakh',
                  'INR 15 Lakh to 20 Lakh', 'INR 20 Lakh to 30 Lakh', 'INR 30 Lakh to 50 Lakh',
                  'INR 50 Lakh to 1 Crore', 'INR 1 Crore and above',
                ]} onChange={setIncome} />
                <button type="button" className="flex items-center gap-1 text-primary mt-2" style={{ fontSize: '12px', fontWeight: 500 }}>
                  Why is income required?<Info className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <h2 className="text-foreground mb-4" style={{ fontSize: '20px', fontWeight: 500 }}>Work details</h2>
                <div className="space-y-5">
                  <FloatingLabelSelect label="You work with" value={companyType} required options={[
                    'Private Company', 'Government / Public Sector', 'Defence / Civil Services',
                    'Business / Self Employed', 'Not Working', 'Other',
                  ]} onChange={setCompanyType} />
                  <FloatingLabelSelect label="You work as" value={workAs} required options={[
                    'Product Designer', 'Architect', 'Software Engineer', 'Doctor', 'Lawyer', 'Teacher',
                    'Accountant', 'Civil Engineer', 'Designer', 'Manager', 'Analyst',
                    'Consultant', 'Entrepreneur', 'Other',
                  ]} onChange={setWorkAs} />
                  <FloatingLabelInput label="Your current company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
              </div>
            </motion.div>
            <div className="pt-4"><ContinueButton isValid={valid} onClick={goForward} /></div>
          </div>
        );

      // ══════════════════════════════════════════════════
      // NEW SCREENS (Steps 6–13)
      // ═══════════════════════════════════════════════════

      // ─── Step 6: Add Photos ───
      case 6:
        return (
          <div className="flex-1 flex flex-col px-6 pt-2 pb-8">
            <motion.div className="flex-1 flex flex-col items-center"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}>

              {/* Figma avatar – square container for concentric dashed/avatar circles */}
              <div className="w-[120px] h-[120px] mt-4 mb-10 overflow-visible">
                <PhotoUploadAvatar />
              </div>

              <h1 className="text-foreground text-center" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '1.4' }}>
                Add Photos
              </h1>
              <p className="text-foreground text-center mb-1" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '1.4' }}>
                to complete your Profile
              </p>
              <p className="text-muted-foreground text-center mb-8" style={{ fontSize: '12px', fontWeight: 300 }}>
                Photo increases your chances of finding a match
              </p>

              <div className="w-full space-y-3 mb-6">
                <Button variant="default" size="lg" shape="pill" className="w-full"
                  onClick={goForward}>
                  <ImagePlus className="w-5 h-5 mr-2" /> Add from Gallery
                </Button>
                <Button variant="outline" size="lg" shape="pill" className="w-full"
                  onClick={goForward}>
                  <Camera className="w-5 h-5 mr-2" /> Use Camera
                </Button>
              </div>
            </motion.div>

            {/* Skip at bottom */}
            <button type="button" onClick={goForward}
              className="text-center text-muted-foreground py-2"
              style={{ fontSize: '12px', fontWeight: 300 }}>
              Add photos later
            </button>
          </div>
        );

      // ─── Step 7: About Yourself ───
      case 7:
        return (
          <div className="flex-1 flex flex-col px-6 pt-2 pb-8 overflow-y-auto scrollbar-hide">
            <PictorialHeader icon={PictoProfileEdit} bgColor="var(--color-pictorial-orange-bg)" subtitle="We have added a short description about you" />

            <motion.h1 className="text-foreground mb-4" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '1.3' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
              About yourself
            </motion.h1>

            <motion.div className="flex-1 space-y-4"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
              <div>
                <textarea
                  value={aboutMe}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) setAboutMe(e.target.value);
                  }}
                  rows={7}
                  className="w-full rounded-[16px] border border-input bg-transparent px-5 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none transition-all"
                  style={{ fontSize: '14px', lineHeight: '1.6' }}
                />
                {/* Helper text + character count */}
                <div className="flex items-center justify-between mt-2 px-1">
                  <p className="text-muted-foreground" style={{ fontSize: '12px', fontWeight: 400 }}>
                    Edit the text above to make it more personal
                  </p>
                  <p className="text-muted-foreground shrink-0 ml-2" style={{ fontSize: '12px', fontWeight: 400 }}>
                    {aboutMe.length}/1000
                  </p>
                </div>
              </div>

              {/* Checkbox with background + info icon */}
              <div className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-3.5">
                <button type="button" onClick={() => setDontAddSearch(!dontAddSearch)}
                  className="shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                  style={{ borderColor: dontAddSearch ? '#0AA4B8' : 'var(--color-border)', backgroundColor: dontAddSearch ? '#0AA4B8' : 'transparent' }}>
                  {dontAddSearch && <Check className="w-3 h-3 text-white" />}
                </button>
                <span className="flex-1 text-muted-foreground" style={{ fontSize: '12px', lineHeight: '1.5' }}>
                  Do not add my Profile to Shaadi.com's affiliated Matchmaking services
                </span>
                <Info className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </motion.div>

            <div className="pt-4"><ContinueButton isValid={valid} onClick={goForward} /></div>
          </div>
        );

      // ─── Step 8: Verify Mobile Number ───
      case 8:
        return (
          <div className="flex-1 flex flex-col px-6 pt-2 pb-8">
            <PictorialHeader icon={PictoSafety} bgColor="var(--color-pictorial-gold-bg)" />

            <motion.h1 className="text-foreground text-center mb-4" style={{ fontSize: '20px', fontWeight: 500 }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              Verify Mobile Number
            </motion.h1>

            <motion.p className="text-muted-foreground text-center mb-1" style={{ fontSize: '13px' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              We'll send a verification code to
            </motion.p>
            <motion.div className="flex items-center justify-center gap-2 mb-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <span className="text-foreground" style={{ fontSize: '14px', fontWeight: 600 }}>+91 8668XXXXXX</span>
              <button type="button" className="text-primary" style={{ fontSize: '13px', fontWeight: 600 }}>Edit</button>
            </motion.div>

            {/* OTP boxes with hidden input for system keyboard */}
            <motion.div
              className="flex gap-2.5 justify-center mb-4 cursor-text relative"
              onClick={() => otpInputRef.current?.focus()}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <input
                ref={otpInputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="absolute opacity-0 w-0 h-0"
                autoFocus
              />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}
                  className={cn(
                    'w-11 h-12 rounded-xl border-2 flex items-center justify-center transition-colors',
                    i < otp.length ? 'border-primary bg-primary/5' : i === otp.length ? 'border-primary' : 'border-border'
                  )}>
                  <span className="text-foreground" style={{ fontSize: '20px', fontWeight: 600 }}>
                    {otp[i] || ''}
                  </span>
                </div>
              ))}
            </motion.div>

            <p className="text-center text-muted-foreground mb-4" style={{ fontSize: '12px' }}>
              Didn't get the code(s)? Resend in 30s
            </p>

            <div className="mt-auto">
              <ContinueButton isValid={otp.length === 6} onClick={goForward} label="Verify" />
            </div>
          </div>
        );

      // ─── Step 9: Verify Your Profile ───
      case 9:
        return (
          <div className="flex-1 flex flex-col px-6 pt-2 pb-8">
            {/* Header + subheader above image */}
            <motion.div className="text-center mb-6"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="text-foreground text-center mb-1" style={{ fontSize: '20px', fontWeight: 500 }}>
                Verify your Profile
              </h1>
              <p className="text-muted-foreground text-center" style={{ fontSize: '13px', fontWeight: 400 }}>
                Verified Profiles get better Matches
              </p>
            </motion.div>

            {/* Image – centered */}
            <motion.div className="flex-1 flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.35 }}>
              <div className="w-[186px] h-[248px] rounded-2xl overflow-hidden">
                <img src={imgVerification} alt="Verification" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Bottom CTA – anchored to bottom */}
            <div className="space-y-3 pt-4">
              <Button variant="default" size="lg" shape="pill"
                className="w-full"
                onClick={goForward}>
                <Camera className="w-5 h-5 mr-2" /> Take a Selfie
              </Button>
              <p className="text-muted-foreground text-center" style={{ fontSize: '12px' }}>
                Verification Selfies are <span style={{ fontWeight: 700 }}>NOT</span> shown to other members
              </p>
            </div>
          </div>
        );

      // ─── Step 10: Hobbies & Interests ───
      case 10:
        return (
          <div className="flex-1 relative overflow-hidden">
            {/* Scrollable content */}
            <div className="h-full overflow-y-auto scrollbar-hide px-4 pt-4 pb-20">
              <motion.div className="text-center mb-6"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h1 className="text-foreground mb-1" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '1.4' }}>
                  Add your hobbies & interests
                </h1>
                <p className="text-muted-foreground" style={{ fontSize: '13px', fontWeight: 400 }}>
                  This will help find better Matches
                </p>
              </motion.div>

              <motion.div className="space-y-4 pb-2"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>

                {/* Creative section card */}
                <div className="border border-border rounded-2xl p-3 shadow-sm">
                  <h2 className="text-foreground mb-3" style={{ fontSize: '15px', fontWeight: 600 }}>Creative</h2>
                  <div className="flex flex-wrap gap-2">
                    {CREATIVE_HOBBIES_MAIN.map((h) => (
                      <Chip key={h.label} label={h.label}
                        iconLeft={<span style={{ fontSize: '16px' }}>{h.emoji}</span>}
                        selected={selectedHobbies.has(h.label)}
                        onClick={() => toggleHobby(h.label)} />
                    ))}
                    {showMoreCreative && CREATIVE_HOBBIES_MORE.map((h) => (
                      <Chip key={h.label} label={h.label}
                        iconLeft={<span style={{ fontSize: '16px' }}>{h.emoji}</span>}
                        selected={selectedHobbies.has(h.label)}
                        onClick={() => toggleHobby(h.label)} />
                    ))}
                  </div>
                  <button type="button" onClick={() => setShowMoreCreative(!showMoreCreative)}
                    className="text-muted-foreground mt-3 flex items-center justify-center gap-1 w-full"
                    style={{ fontSize: '13px', fontWeight: 500 }}>
                    {showMoreCreative ? 'View less' : 'View more'}{showMoreCreative ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Fun section card */}
                <div className="border border-border rounded-2xl p-3 shadow-sm">
                  <h2 className="text-foreground mb-3" style={{ fontSize: '15px', fontWeight: 600 }}>Fun</h2>
                  <div className="flex flex-wrap gap-2">
                    {FUN_HOBBIES_MAIN.map((h) => (
                      <Chip key={h.label} label={h.label}
                        iconLeft={<span style={{ fontSize: '16px' }}>{h.emoji}</span>}
                        selected={selectedHobbies.has(h.label)}
                        onClick={() => toggleHobby(h.label)} />
                    ))}
                    {showMoreFun && FUN_HOBBIES_MORE.map((h) => (
                      <Chip key={h.label} label={h.label}
                        iconLeft={<span style={{ fontSize: '16px' }}>{h.emoji}</span>}
                        selected={selectedHobbies.has(h.label)}
                        onClick={() => toggleHobby(h.label)} />
                    ))}
                  </div>
                  <button type="button" onClick={() => setShowMoreFun(!showMoreFun)}
                    className="text-muted-foreground mt-3 flex items-center justify-center gap-1 w-full"
                    style={{ fontSize: '13px', fontWeight: 500 }}>
                    {showMoreFun ? 'View less' : 'View more'}{showMoreFun ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Fitness section card */}
                <div className="border border-border rounded-2xl p-3 shadow-sm">
                  <h2 className="text-foreground mb-3" style={{ fontSize: '15px', fontWeight: 600 }}>Fitness</h2>
                  <div className="flex flex-wrap gap-2">
                    {FITNESS_HOBBIES_MAIN.map((h) => (
                      <Chip key={h.label} label={h.label}
                        iconLeft={<span style={{ fontSize: '16px' }}>{h.emoji}</span>}
                        selected={selectedHobbies.has(h.label)}
                        onClick={() => toggleHobby(h.label)} />
                    ))}
                    {showMoreFitness && FITNESS_HOBBIES_MORE.map((h) => (
                      <Chip key={h.label} label={h.label}
                        iconLeft={<span style={{ fontSize: '16px' }}>{h.emoji}</span>}
                        selected={selectedHobbies.has(h.label)}
                        onClick={() => toggleHobby(h.label)} />
                    ))}
                  </div>
                  <button type="button" onClick={() => setShowMoreFitness(!showMoreFitness)}
                    className="text-muted-foreground mt-3 flex items-center justify-center gap-1 w-full"
                    style={{ fontSize: '13px', fontWeight: 500 }}>
                    {showMoreFitness ? 'View less' : 'View more'}{showMoreFitness ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Other interests section card */}
                <div className="border border-border rounded-2xl p-3 shadow-sm">
                  <h2 className="text-foreground mb-3" style={{ fontSize: '15px', fontWeight: 600 }}>Other Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {OTHER_INTERESTS_MAIN.map((h) => (
                      <Chip key={h.label} label={h.label}
                        iconLeft={<span style={{ fontSize: '16px' }}>{h.emoji}</span>}
                        selected={selectedHobbies.has(h.label)}
                        onClick={() => toggleHobby(h.label)} />
                    ))}
                    {showMoreOther && OTHER_INTERESTS_MORE.map((h) => (
                      <Chip key={h.label} label={h.label}
                        iconLeft={<span style={{ fontSize: '16px' }}>{h.emoji}</span>}
                        selected={selectedHobbies.has(h.label)}
                        onClick={() => toggleHobby(h.label)} />
                    ))}
                  </div>
                  <button type="button" onClick={() => setShowMoreOther(!showMoreOther)}
                    className="text-muted-foreground mt-3 flex items-center justify-center gap-1 w-full"
                    style={{ fontSize: '13px', fontWeight: 500 }}>
                    {showMoreOther ? 'View less' : 'View more'}{showMoreOther ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Sticky CTA at bottom – always visible, no background */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-8">
              <ContinueButton
                isValid={selectedHobbies.size >= 1}
                onClick={goForward}
                label={selectedHobbies.size >= 1 ? `Save & continue (${selectedHobbies.size})` : 'Save & continue'}
              />
            </div>
          </div>
        );

      // ─── Step 11: Family Details — Screen 1 ───
      case 11:
        return (
          <div className="flex-1 flex flex-col px-6 pt-2 pb-8 overflow-y-auto scrollbar-hide">
            {/* Pictorial without subtitle */}
            <PictorialHeader icon={PictoUsersPink} bgColor="var(--color-pictorial-pink-bg)" />

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h1 className="text-foreground mb-1" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '1.3' }}>
                Add family details
              </h1>
              <p className="text-muted-foreground mb-6" style={{ fontSize: '13px', fontWeight: 400 }}>
                These details help find better matches for you
              </p>
            </motion.div>

            <motion.div className="space-y-5 flex-1"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <FloatingLabelSelect label="Mother's Profession" value={motherProfession}
                options={['Employed', 'Business', 'Homemaker', 'Retired', 'Not Employed', 'Other']}
                onChange={setMotherProfession} />
              <FloatingLabelSelect label="Father's Profession" value={fatherProfession}
                options={['Employed', 'Business', 'Retired', 'Not Employed', 'Other']}
                onChange={setFatherProfession} />
              <FloatingLabelSelect label="No. of Brothers" value={brothers}
                options={['0', '1', '2', '3', '4', '5+']}
                onChange={setBrothers} />
              <FloatingLabelSelect label="No. of Sisters" value={sisters}
                options={['0', '1', '2', '3', '4', '5+']}
                onChange={setSisters} />
            </motion.div>

            <div className="pt-4"><ContinueButton isValid={true} onClick={goForward} /></div>
          </div>
        );

      // ─── Step 12: Family Details — Screen 2 ───
      case 12:
        return (
          <div className="flex-1 flex flex-col px-6 pt-2 pb-8 overflow-y-auto scrollbar-hide">
            {/* Pictorial without subtitle */}
            <PictorialHeader icon={PictoUsersPink} bgColor="var(--color-pictorial-pink-bg)" />

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h1 className="text-foreground mb-1" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '1.3' }}>
                Add family details
              </h1>
              <p className="text-muted-foreground mb-6" style={{ fontSize: '13px', fontWeight: 400 }}>
                Let's complete the remaining details
              </p>
            </motion.div>

            <motion.div className="space-y-5 flex-1"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <FloatingLabelInput label="Your Family's Location" value={familyLocation}
                onChange={(e) => setFamilyLocation(e.target.value)} />
              <FloatingLabelSelect label="You live with your family?" value={liveWithFamily}
                options={['Yes', 'No']}
                onChange={setLiveWithFamily} />
              <FloatingLabelSelect label="Your Family's Financial Status" value={financialStatus}
                options={['Elite', 'High', 'Middle']}
                onChange={setFinancialStatus} />
              <FloatingLabelSelect label="Family Type" value={familyType}
                options={['Nuclear', 'Joint', 'Other']}
                onChange={setFamilyType} />
            </motion.div>

            <div className="pt-4"><ContinueButton isValid={true} onClick={goForward} /></div>
          </div>
        );

      // ─── Step 13: Recommended Partner Preferences ───
      case 13:
        return (
          <div className="flex-1 flex flex-col px-6 pt-2 pb-8 overflow-y-auto scrollbar-hide">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              {/* User avatar circle */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-[#0AA4B8] flex items-center justify-center">
                  <span className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>PA</span>
                </div>
              </div>

              <h1 className="text-foreground text-center mb-2" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '1.3' }}>
                Recommended Partner Preferences
              </h1>
              <p className="text-muted-foreground text-center mb-1" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                We have set these Preferences to show you the best Matches for your Profile
              </p>
              <p className="text-primary text-center mb-6" style={{ fontSize: '12px', fontWeight: 500 }}>
                Tap on the field to edit
              </p>
            </motion.div>

            <motion.div className="flex-1 space-y-5"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {/* Basic Details */}
              <div>
                <h2 className="text-foreground mb-2" style={{ fontSize: '15px', fontWeight: 600 }}>Basic Details</h2>
                <div className="border border-border rounded-2xl overflow-hidden">
                  <PreferenceRow label="Age" value="22 to 28" />
                  <PreferenceRow label="Height" value="5ft to 5ft 8in" />
                  <PreferenceRow label="Marital Status" value="Never Married" isLast />
                </div>
              </div>

              {/* Community */}
              <div>
                <h2 className="text-foreground mb-2" style={{ fontSize: '15px', fontWeight: 600 }}>Community</h2>
                <div className="border border-border rounded-2xl overflow-hidden">
                  <PreferenceRow label="Religion" value="Hindu" />
                  <PreferenceRow label="Community" value="Marathi, 96 Kuli Maratha" />
                  <PreferenceRow label="Mother Tongue" value="Marathi" isLast />
                </div>
              </div>
            </motion.div>

            {/* Confirm & Continue */}
            <div className="pt-5">
              <Button variant="default" size="lg" shape="pill"
                className="w-full"
                onClick={goForward}>
                Confirm & Continue
              </Button>
            </div>
          </div>
        );

      // ─── Step 14: Finding Matches ───
      case 14:
        return <FindingMatchesScreen onDone={onComplete} />;

      default:
        return null;
    }
  };

  // ═══════════════════════════════════════════════════════
  // Layout Shell
  // ═══════════════════════════════════════════════════════

  return (
    <div className="w-full h-full flex flex-col bg-background font-sans relative overflow-hidden">
      {/* Header: Back + optional center logo + optional Skip */}
      {step !== 14 && (
      <div className="flex-none pt-4 px-4 z-30 relative flex items-center justify-between">
        {!HEADER_NO_BACK_STEPS.has(step) ? (
          <Button
            variant="ghost"
            size="icon"
            shape="pill"
            onClick={goBack}
            className="text-foreground hover:bg-accent -ml-1"
          >
            <BackArrowIcon className="w-6 h-6" />
          </Button>
        ) : (
          <div className="w-10 h-10" />
        )}

        {HEADER_SKIP_STEPS.has(step) && (
          <button
            type="button"
            onClick={goForward}
            className="px-2 py-1 text-muted-foreground"
            style={{ fontSize: '14px', fontWeight: 400 }}
          >
            Skip
          </button>
        )}
      </div>
      )}
      {/* Step content with slide transitions */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 35,
              mass: 0.8,
            }}
            className="absolute inset-0 flex flex-col"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};