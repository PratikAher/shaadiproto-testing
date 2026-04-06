import clsx from "clsx";
import svgPaths from "./svg-2y2dfmlocp";
import imgAvatarImageNew from "figma:asset/71c0579d9d1a30d4a1e005193d3ea93884167df3.png";
import imgGroup52 from "figma:asset/5fcec58dae017f1de16b2430c56cf91ecf87e8b7.png";
import imgAvatarImageNew1 from "figma:asset/59dc65d03dd1f8e742cd8bee01c5dd6c8323a731.png";

function BackgroundImage12({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0 w-full">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] min-w-full relative shrink-0 text-[#41404d] text-[14px] text-center w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        {children}
      </p>
      <div className="relative rounded-[20px] shrink-0">
        <div aria-hidden="true" className="absolute border border-[#0aa4b8] border-solid inset-0 pointer-events-none rounded-[20px]" />
        <BackgroundImage10>
          <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#0aa4b8] text-[14px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
            {"Outlined Button"}
          </p>
        </BackgroundImage10>
      </div>
    </div>
  );
}

function ProfileFreeBackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex items-start px-[16px] py-[7px] relative rounded-[15px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#a1db7a] border-solid inset-0 pointer-events-none rounded-[15px]" />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#41404d] text-[12px] tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {children}
      </p>
    </div>
  );
}

function BackgroundImage11({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-white content-stretch flex items-center pl-[6px] pr-[16px] py-[3px] relative rounded-[15px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-[15px]" />
      <ProfileFreeIconsHobbiesStandUps24PxBackgroundImage />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#41404d] text-[12px] tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {children}
      </p>
    </div>
  );
}

function BackgroundImage10({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center justify-center size-full">
      <div className="content-stretch flex items-center justify-center px-[32px] py-[10px] relative">{children}</div>
    </div>
  );
}

function BackgroundImage9({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-h-px min-w-px relative">{children}</div>
    </div>
  );
}

function BackgroundImage8({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[16px] relative w-full">{children}</div>
    </div>
  );
}

function BackgroundImage7({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="overflow-clip relative rounded-[inherit] size-full">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        {children}
      </svg>
    </div>
  );
}
type BackgroundImage6Props = {
  additionalClassNames?: string;
};

function BackgroundImage6({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage6Props>) {
  return (
    <div className={clsx("overflow-clip size-[24px]", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">{children}</g>
      </svg>
    </div>
  );
}
type BackgroundImage5Props = {
  additionalClassNames?: string;
};

function BackgroundImage5({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage5Props>) {
  return (
    <div className={clsx("bg-gradient-to-l overflow-clip relative rounded-[16px] shrink-0 size-[32px]", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Group">{children}</g>
      </svg>
    </div>
  );
}

function BackgroundImage4({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center py-[14px] relative w-full">{children}</div>
      </div>
    </div>
  );
}

function BackgroundImage3({ children }: React.PropsWithChildren<{}>) {
  return (
    <BackgroundImage8>
      <BackgroundImage9>{children}</BackgroundImage9>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 300 1">
            <line id="Line 6" stroke="var(--stroke-0, #DFE0E3)" x2="300" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </BackgroundImage8>
  );
}

function ListBackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <BackgroundImage4>
      <ProfileFreeIconsProfileCalendar32PxBackgroundImage />
      <div className="content-stretch flex flex-[1_0_0] flex-col font-['Roboto:Regular',sans-serif] font-normal items-start min-h-px min-w-px relative whitespace-pre-wrap">{children}</div>
    </BackgroundImage4>
  );
}
type ProfileFreeBackgroundImageAndTextProps = {
  text: string;
};

function ProfileFreeBackgroundImageAndText({ text }: ProfileFreeBackgroundImageAndTextProps) {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#41404d] text-[14px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}

function BackgroundImage2() {
  return (
    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 300 1" className="block size-full">
      <line id="Line 7" stroke="url(#paint0_linear_10094_13781)" x2="300" y1="0.5" y2="0.5" />
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_10094_13781" x1="320" x2="-19.5" y1="-56.0011" y2="-56.0011">
          <stop stopColor="white" />
          <stop offset="0.46875" stopColor="#DFE0E3" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ProfileFreeBackgroundImage() {
  return (
    <div className="h-0 relative shrink-0 w-full">
      <div className="absolute inset-[-1px_0_0_0]">
        <BackgroundImage2 />
      </div>
    </div>
  );
}
type BackgroundImage1Props = {
  text: string;
  text1: string;
};

function BackgroundImage1({ text, text1 }: BackgroundImage1Props) {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col font-['Roboto:Regular',sans-serif] font-normal items-start min-h-px min-w-px relative whitespace-pre-wrap">
      <p className="leading-[16px] relative shrink-0 text-[#95959d] text-[12px] tracking-[0.2px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
      <p className="leading-[20px] relative shrink-0 text-[#41404d] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text1}
      </p>
    </div>
  );
}
type ListBackgroundImageProps = {
  text: string;
  text1: string;
};

function ListBackgroundImage({ text, text1 }: ListBackgroundImageProps) {
  return (
    <BackgroundImage4>
      <ProfileFreeIconsProfileCalendar32PxBackgroundImage />
      <BackgroundImage1 text={text} text1={text1} />
    </BackgroundImage4>
  );
}

function ProfileFreeIconsProfileCalendar32PxBackgroundImage() {
  return (
    <BackgroundImage5 additionalClassNames="from-[#a1db7a] to-[#8ec966] to-[98.786%]">
      <g id="Vector" />
      <path d={svgPaths.p11b80700} fill="var(--fill-0, white)" id="Vector_2" />
    </BackgroundImage5>
  );
}
type BackgroundImageAndTextProps = {
  text: string;
};

function BackgroundImageAndText({ text }: BackgroundImageAndTextProps) {
  return <BackgroundImage11>{text}</BackgroundImage11>;
}

function BackgroundImage() {
  return <BackgroundImage11>{`Option 3 `}</BackgroundImage11>;
}

function ProfileFreeIconsHobbiesStandUps24PxBackgroundImage() {
  return (
    <BackgroundImage6 additionalClassNames="relative shrink-0">
      <g id="Vector" />
      <path clipRule="evenodd" d={svgPaths.p377fe80} fill="var(--fill-0, black)" fillRule="evenodd" id="Shape" />
    </BackgroundImage6>
  );
}

function IconsProfileNo32Px({ className }: { className?: string }) {
  return (
    <div className={className || "bg-white relative rounded-[16px] size-[32px]"} data-name="Icons/Profile/No_32px">
      <BackgroundImage7>
        <g id="Group">
          <g id="Vector" />
          <path d={svgPaths.p198fe600} fill="var(--fill-0, #B1B3B9)" id="Shape" />
        </g>
      </BackgroundImage7>
      <div aria-hidden="true" className="absolute border-2 border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function IconsProfileYes32Px({ className }: { className?: string }) {
  return (
    <div className={className || "bg-white relative rounded-[16px] size-[32px]"} data-name="Icons/Profile/Yes_32px">
      <BackgroundImage7>
        <g id="Group">
          <g id="Vector" />
          <path d={svgPaths.p33759200} fill="url(#paint0_linear_10094_13911)" id="Shape" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_10094_13911" x1="10" x2="21.52" y1="15.8" y2="15.8">
            <stop stopColor="#AF7AC0" />
            <stop offset="1" stopColor="#DB83A5" />
          </linearGradient>
        </defs>
      </BackgroundImage7>
      <div aria-hidden="true" className="absolute border-2 border-[#c26bac] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}
type ProfilePhotoThumbnailMaleProps = {
  className?: string;
  property1?: "Huge_250x250" | "xxxLarge_200x200" | "xxLarge_150x150" | "xLarge_120x120" | "Large_90x90" | "Medium_75x75" | "Small_60x60" | "xSmall_40x40" | "xxSmall_30x30";
};

function ProfilePhotoThumbnailMale({ className, property1 = "Huge_250x250" }: ProfilePhotoThumbnailMaleProps) {
  const isLarge90X90 = property1 === "Large_90x90";
  const isMedium75X75 = property1 === "Medium_75x75";
  const isSmall60X60 = property1 === "Small_60x60";
  const isXLarge120X120 = property1 === "xLarge_120x120";
  const isXSmall40X40 = property1 === "xSmall_40x40";
  const isXxLarge150X150 = property1 === "xxLarge_150x150";
  const isXxSmall30X30 = property1 === "xxSmall_30x30";
  const isXxxLarge200X200 = property1 === "xxxLarge_200x200";
  return (
    <div className={className || `overflow-clip relative rounded-[9999px] ${isXxSmall30X30 ? "size-[30px]" : isXSmall40X40 ? "size-[40px]" : isSmall60X60 ? "size-[60px]" : isMedium75X75 ? "size-[75px]" : isLarge90X90 ? "size-[90px]" : isXLarge120X120 ? "size-[120px]" : isXxLarge150X150 ? "size-[150px]" : isXxxLarge200X200 ? "size-[200px]" : "size-[250px]"}`}>
      <div className={`absolute ${isXxSmall30X30 ? "-translate-x-1/2 -translate-y-1/2 left-1/2 rounded-[187.5px] size-[30px] top-1/2" : isXSmall40X40 ? "left-0 rounded-[250px] size-[40px] top-0" : isSmall60X60 ? "left-0 rounded-[250px] size-[60px] top-0" : isMedium75X75 ? "-translate-x-1/2 left-1/2 rounded-[250px] size-[75px] top-0" : isLarge90X90 ? "left-0 rounded-[250px] size-[90px] top-0" : isXLarge120X120 ? "left-0 rounded-[250px] size-[120px] top-0" : isXxLarge150X150 ? "left-0 rounded-[250px] size-[150px] top-0" : isXxxLarge200X200 ? "-translate-x-1/2 -translate-y-1/2 left-1/2 rounded-[250px] size-[200px] top-1/2" : "left-0 rounded-[250px] size-[250px] top-0"}`} data-name="Avatar image New">
        <img alt="" className={`absolute inset-0 max-w-none object-cover pointer-events-none size-full ${isXxSmall30X30 ? "rounded-[187.5px]" : "rounded-[250px]"}`} src={imgAvatarImageNew} />
      </div>
    </div>
  );
}
type ProfileFreeProps = {
  className?: string;
  property1?: "About Profile" | "Contact Details" | "Family Details" | "Basic Details" | "Career & Education" | "Astro Details" | "You & Her" | "Premium Message" | "Variant10" | "Variant11" | "interests";
};

function ProfileFree({ className, property1 = "Premium Message" }: ProfileFreeProps) {
  const isAboutProfile = property1 === "About Profile";
  const isAboutProfileOrFamilyDetails = ["About Profile", "Family Details"].includes(property1);
  const isAstroDetails = property1 === "Astro Details";
  const isBasicDetails = property1 === "Basic Details";
  const isBasicDetailsOrAstroDetails = ["Basic Details", "Astro Details"].includes(property1);
  const isBasicDetailsOrCareerEducationOrAstroDetailsOrInterests = ["Basic Details", "Career & Education", "Astro Details", "interests"].includes(property1);
  const isBasicDetailsOrInterests = ["Basic Details", "interests"].includes(property1);
  const isCareerEducation = property1 === "Career & Education";
  const isContactDetails = property1 === "Contact Details";
  const isFamilyDetails = property1 === "Family Details";
  const isInterests = property1 === "interests";
  const isPremiumMessage = property1 === "Premium Message";
  const isPremiumMessageOrContactDetails = ["Premium Message", "Contact Details"].includes(property1);
  const isVariant10 = property1 === "Variant10";
  const isVariant11 = property1 === "Variant11";
  const isVariant11OrVariant10 = ["Variant11", "Variant10"].includes(property1);
  const isYouHer = property1 === "You & Her";
  return (
    <div className={className || `relative ${isVariant10 ? "h-[196px] rounded-[12px] shadow-[0px_6px_12px_0px_rgba(0,0,0,0.08),0px_2px_12px_0px_rgba(0,0,0,0.06),0px_3px_4px_0px_rgba(0,0,0,0.06)] w-[340px]" : isVariant11 ? "bg-gradient-to-r from-[#f69b33] h-[196px] rounded-[12px] shadow-[0px_6px_12px_0px_rgba(0,0,0,0.08),0px_2px_12px_0px_rgba(0,0,0,0.06),0px_3px_4px_0px_rgba(0,0,0,0.06)] to-[#feae52] w-[340px]" : isYouHer ? "h-[887px] w-[340px]" : ["About Profile", "Basic Details", "Family Details", "Career & Education", "Astro Details", "interests"].includes(property1) ? "bg-white rounded-[12px] shadow-[0px_6px_12px_0px_rgba(0,0,0,0.08),0px_2px_12px_0px_rgba(0,0,0,0.06),0px_3px_4px_0px_rgba(0,0,0,0.06)] w-[340px]" : "bg-white rounded-[12px] shadow-[0px_6px_12px_0px_rgba(0,0,0,0.08),0px_2px_12px_0px_rgba(0,0,0,0.06),0px_3px_4px_0px_rgba(0,0,0,0.06)]"}`} style={isVariant10 ? { backgroundImage: "linear-gradient(270deg, rgb(168, 143, 213) 0%, rgb(148, 119, 203) 100%), linear-gradient(90deg, rgb(253, 170, 76) 0%, rgb(253, 170, 76) 100%)" } : undefined}>
      <div className={isVariant11OrVariant10 ? "absolute h-[63px] left-0 top-0 w-[102px]" : isYouHer ? "absolute bg-white content-stretch flex flex-col gap-[10px] items-start left-0 rounded-[12px] shadow-[0px_6px_12px_0px_rgba(0,0,0,0.08),0px_2px_12px_0px_rgba(0,0,0,0.06),0px_3px_4px_0px_rgba(0,0,0,0.06)] top-0 w-[340px]" : isBasicDetailsOrCareerEducationOrAstroDetailsOrInterests ? "content-stretch flex flex-col gap-[20px] items-start p-[20px] relative w-full" : isAboutProfileOrFamilyDetails ? "content-stretch flex flex-col items-start p-[20px] relative w-full" : "content-stretch flex flex-col items-start relative"}>
        {isBasicDetailsOrCareerEducationOrAstroDetailsOrInterests && (
          <p className={`font-["Roboto:Bold",sans-serif] font-bold leading-[26px] relative shrink-0 text-[#41404d] text-[18px] whitespace-pre-wrap ${isAstroDetails ? "min-w-full w-[min-content]" : "w-full"}`} style={{ fontVariationSettings: "'wdth' 100" }}>
            {isInterests ? "Interests" : isAstroDetails ? "Astro Details" : isCareerEducation ? "Career & Education" : isBasicDetails ? "Basic Details" : ""}
          </p>
        )}
        {["About Profile", "Basic Details", "Family Details", "Career & Education", "Astro Details", "You & Her", "interests"].includes(property1) && (
          <div className={`relative shrink-0 ${isYouHer ? "h-[221px] overflow-clip rounded-[12px] w-[340px]" : isAstroDetails ? "content-stretch flex flex-col gap-[5px] items-start" : isCareerEducation ? "content-stretch flex flex-col items-start w-full" : isFamilyDetails ? "content-stretch flex flex-col gap-[8px] items-start text-[#41404d] w-full whitespace-pre-wrap" : isBasicDetails ? "content-start flex flex-wrap gap-[8px] items-start w-full" : "content-stretch flex flex-col gap-[8px] items-start w-full"}`}>
            {["About Profile", "Family Details", "interests"].includes(property1) && (
              <p className={`relative shrink-0 w-full ${isInterests ? 'font-["Roboto:Medium",sans-serif] font-medium leading-[20px] text-[#72727d] text-[14px] whitespace-pre-wrap' : isFamilyDetails ? 'font-["Roboto:Bold",sans-serif] font-bold leading-[26px] text-[18px]' : 'font-["Roboto:Bold",sans-serif] font-bold leading-[26px] text-[#41404d] text-[18px] whitespace-pre-wrap'}`} style={{ fontVariationSettings: "'wdth' 100" }}>
                {isInterests ? "Her Interests" : isFamilyDetails ? "Family Details" : isAboutProfile ? "About Deepika Panchal" : ""}
              </p>
            )}
            {["Basic Details", "Astro Details", "interests"].includes(property1) && (
              <div className={`relative shrink-0 ${isInterests ? "content-start flex flex-wrap gap-[8px] items-start w-full" : isAstroDetails ? 'font-["Roboto:Regular",sans-serif] font-normal leading-[20px] text-[#41404d] text-[14px] w-[300px] whitespace-pre-wrap' : "content-stretch flex gap-[8px] items-start"}`} style={isAstroDetails ? { fontVariationSettings: "'wdth' 100" } : undefined}>
                {isBasicDetailsOrInterests && (
                  <>
                    <div className={`content-stretch flex relative rounded-[15px] shrink-0 ${isInterests ? "bg-white items-center pl-[6px] pr-[16px] py-[3px]" : "items-start px-[16px] py-[7px]"}`}>
                      <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[15px] ${isInterests ? "border-[#dfe0e3]" : "border-[#a1db7a]"}`} />
                      {isBasicDetails && (
                        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#41404d] text-[12px] tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Created by Parent
                        </p>
                      )}
                      {isInterests && (
                        <>
                          <ProfileFreeIconsHobbiesStandUps24PxBackgroundImage />
                          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#41404d] text-[12px] tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Option 1
                          </p>
                        </>
                      )}
                    </div>
                    <div className={`content-stretch flex relative rounded-[15px] shrink-0 ${isInterests ? "bg-white items-center pl-[6px] pr-[16px] py-[3px]" : "items-start px-[16px] py-[7px]"}`}>
                      <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[15px] ${isInterests ? "border-[#dfe0e3]" : "border-[#a1db7a]"}`} />
                      {isBasicDetails && (
                        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#41404d] text-[12px] tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Profile ID - SH1234949
                        </p>
                      )}
                      {isInterests && (
                        <>
                          <ProfileFreeIconsHobbiesStandUps24PxBackgroundImage />
                          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#41404d] text-[12px] tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Option 2
                          </p>
                        </>
                      )}
                    </div>
                  </>
                )}
                {isAstroDetails && (
                  <>
                    <p className="mb-0">{`She is born in Vadodara on `}</p>
                    <p>05-Jan-1992 at approximately 08:25 am.</p>
                  </>
                )}
                {isInterests && (
                  <>
                    <BackgroundImage />
                    <BackgroundImageAndText text="Option 4" />
                  </>
                )}
              </div>
            )}
            {isAboutProfileOrFamilyDetails && (
              <p className={`font-["Roboto:Regular",sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] w-full ${isFamilyDetails ? "" : "text-[#41404d] whitespace-pre-wrap"}`} style={{ fontVariationSettings: "'wdth' 100" }}>
                Ours is a middle class family, originally from Edappal, with moderate values. He has 4 sisters (4 married). His parents are no more with us.
              </p>
            )}
            {isBasicDetailsOrAstroDetails && (
              <div className={`content-stretch flex items-start relative shrink-0 ${isAstroDetails ? "" : "gap-[8px]"}`}>
                {isBasicDetails && (
                  <>
                    <ProfileFreeBackgroundImage1>29 yrs old</ProfileFreeBackgroundImage1>
                    <ProfileFreeBackgroundImage1>{`Height  - 6’2”`}</ProfileFreeBackgroundImage1>
                  </>
                )}
                {isAstroDetails && (
                  <>
                    <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#41404d] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      View Horocsope
                    </p>
                    <div className="content-stretch flex items-start pt-px relative shrink-0">
                      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Icons/navigate_next_24px">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                          <g id="Group">
                            <g id="Vector" />
                            <path d={svgPaths.p856fc00} fill="var(--fill-0, black)" id="icon/navigation/expand_less_24px" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            {isAboutProfile && (
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex items-center justify-center pt-[8px] px-[10px] relative w-full">
                    <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#41404d] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      View more
                    </p>
                    <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Icons/expand_less_24px">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="Group">
                          <g id="Vector" />
                          <path d={svgPaths.p13b09900} fill="var(--fill-0, black)" id="down" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isCareerEducation && (
              <>
                <ListBackgroundImage1>
                  <p className="leading-[16px] relative shrink-0 text-[#95959d] text-[12px] tracking-[0.2px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Profession
                  </p>
                  <div className="leading-[20px] relative shrink-0 text-[#41404d] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <p className="mb-0">{`UX designer / Web designer in a `}</p>
                    <p>Private company</p>
                  </div>
                </ListBackgroundImage1>
                <ListBackgroundImage text="Company Name" text1="People Interactive Pvt. Ltd." />
                <ListBackgroundImage1>
                  <p className="leading-[16px] relative shrink-0 text-[#95959d] text-[12px] tracking-[0.2px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Annual Income
                  </p>
                  <p className="leading-[20px] relative shrink-0 text-[#41404d] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`INR 15 Lakhs to 20 Lakhs `}</p>
                </ListBackgroundImage1>
                <ListBackgroundImage text="Education Qualification" text1="B-COM - Bachelors in Commerce" />
                <ListBackgroundImage text="Education Qualification" text1="Finance / Commerce" />
                <ListBackgroundImage1>
                  <p className="leading-[16px] relative shrink-0 text-[#95959d] text-[12px] tracking-[0.2px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    College Name
                  </p>
                  <p className="leading-[20px] relative shrink-0 text-[#41404d] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`S.I.E.S college of commerce `}</p>
                </ListBackgroundImage1>
                <ProfileFreeBackgroundImage />
                <div className="content-stretch flex flex-col gap-[10px] items-center pt-[12px] relative shrink-0 w-full">
                  <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] min-w-full relative shrink-0 text-[#41404d] text-[14px] text-center w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>{`To unlock Company & College name`}</p>
                  <div className="bg-white relative rounded-[24px] shrink-0" data-name="Button">
                    <div aria-hidden="true" className="absolute border border-[#0aa4b8] border-solid inset-0 pointer-events-none rounded-[24px]" />
                    <BackgroundImage10>
                      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[#0aa4b8] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Outlined Button
                      </p>
                    </BackgroundImage10>
                  </div>
                </div>
              </>
            )}
            {isYouHer && (
              <>
                <div className="absolute h-[222px] left-0 right-0 top-0" data-name="Group 5 2">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgGroup52} />
                </div>
                <p className="-translate-x-1/2 absolute font-['Roboto:Bold',sans-serif] font-bold leading-[26px] left-[170.5px] text-[18px] text-center text-white top-[21px]" style={{ fontVariationSettings: "'wdth' 100" }}>{`You & her`}</p>
                <div className="absolute left-[80px] overflow-clip rounded-[9999px] size-[90px] top-[59px]" data-name="Profile Photo Thumbnail Female">
                  <div className="absolute left-0 rounded-[9999px] size-[90px] top-0" data-name="Avatar image New">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[9999px] size-full" src={imgAvatarImageNew1} />
                  </div>
                </div>
                <ProfilePhotoThumbnailMale className="absolute left-[170px] overflow-clip rounded-[9999px] size-[90px] top-[59px]" property1="Large_90x90" />
                <div className="absolute inset-[37.1%_43.53%_42.99%_43.53%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
                    <circle cx="22" cy="22" fill="var(--fill-0, white)" id="Ellipse 3" r="22" />
                  </svg>
                </div>
                <div className="absolute inset-[44.8%_47.32%_50.86%_47.06%]" data-name="Path">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.1012 9.6">
                    <path clipRule="evenodd" d={svgPaths.p175dc800} fill="var(--fill-0, #D684A7)" fillRule="evenodd" id="Path" />
                  </svg>
                </div>
              </>
            )}
          </div>
        )}
        {["Basic Details", "Astro Details", "You & Her", "interests"].includes(property1) && (
          <div className={`relative shrink-0 w-full ${isInterests ? "content-stretch flex flex-col gap-[8px] items-start" : isYouHer ? "" : "content-stretch flex flex-col items-start"}`}>
            {isBasicDetailsOrAstroDetails && (
              <>
                <ListBackgroundImage1>
                  <p className="leading-[16px] relative shrink-0 text-[#95959d] text-[12px] tracking-[0.2px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {isAstroDetails ? "Rashi & Nakshatra" : isBasicDetails ? "Birth Date" : ""}
                  </p>
                  <p className="leading-[20px] relative shrink-0 text-[#41404d] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {isAstroDetails ? "Dhanu, Purva Ashadha " : isBasicDetails ? "Born on " : ""}
                  </p>
                </ListBackgroundImage1>
                <ListBackgroundImage1>
                  <p className="leading-[16px] relative shrink-0 text-[#95959d] text-[12px] tracking-[0.2px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {isAstroDetails ? "Mangalik?" : isBasicDetails ? "Marital Status" : ""}
                  </p>
                  <p className="leading-[20px] relative shrink-0 text-[#41404d] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {isAstroDetails ? "Yes" : isBasicDetails ? "Never Married" : ""}
                  </p>
                </ListBackgroundImage1>
              </>
            )}
            {isBasicDetails && (
              <>
                <ListBackgroundImage text="Lives in" text1="Mumbai, Maharashtra, India" />
                <ListBackgroundImage1>
                  <p className="leading-[16px] relative shrink-0 text-[#95959d] text-[12px] tracking-[0.2px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`Religion & Mother tongue`}</p>
                  <p className="leading-[20px] relative shrink-0 text-[#41404d] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Hindu, Gujarati
                  </p>
                </ListBackgroundImage1>
                <ListBackgroundImage text="Community" text1="Vaishnav, Vania - khambat D.M.Adalja Vanik" />
                <ListBackgroundImage text="Diet Preference" text1="Occasionally vegetarian" />
              </>
            )}
            {["Basic Details", "You & Her"].includes(property1) && (
              <div className={`relative w-full ${isYouHer ? "content-stretch flex flex-col items-start p-[20px]" : "h-0 shrink-0"}`}>
                <div className={isYouHer ? "content-stretch flex items-start relative shrink-0 w-full" : "absolute inset-[-1px_0_0_0]"}>
                  {isBasicDetails && <BackgroundImage2 />}
                  {isYouHer && (
                    <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#41404d] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      You Match 6/6 of her Preferences
                    </p>
                  )}
                </div>
                {isYouHer && (
                  <>
                    <BackgroundImage3>
                      <BackgroundImage1 text="Age" text1="Sagittarius, Born on 05-Jan-1992" />
                      <IconsProfileYes32Px className="bg-white relative rounded-[16px] shrink-0 size-[32px]" />
                    </BackgroundImage3>
                    <BackgroundImage3>
                      <BackgroundImage1 text="Height" text1="5’4” to 5’11”" />
                      <IconsProfileYes32Px className="bg-white relative rounded-[16px] shrink-0 size-[32px]" />
                    </BackgroundImage3>
                    <BackgroundImage3>
                      <BackgroundImage1 text="State Living in" text1="Gujarat, Maharahtra" />
                      <IconsProfileYes32Px className="bg-white relative rounded-[16px] shrink-0 size-[32px]" />
                    </BackgroundImage3>
                    <BackgroundImage3>
                      <BackgroundImage1 text="Mother Tongue" text1="Gujarati" />
                      <IconsProfileYes32Px className="bg-white relative rounded-[16px] shrink-0 size-[32px]" />
                    </BackgroundImage3>
                    <BackgroundImage3>
                      <div className="content-stretch flex flex-[1_0_0] flex-col font-['Roboto:Regular',sans-serif] font-normal items-start min-h-px min-w-px relative whitespace-pre-wrap">
                        <p className="leading-[16px] relative shrink-0 text-[#95959d] text-[12px] tracking-[0.2px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Profession
                        </p>
                        <div className="leading-[20px] relative shrink-0 text-[#41404d] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="mb-0">Doctorate, Master, Trade school,</p>
                          <p>Honours</p>
                        </div>
                      </div>
                      <IconsProfileNo32Px className="bg-white relative rounded-[16px] shrink-0 size-[32px]" />
                    </BackgroundImage3>
                    <BackgroundImage8>
                      <BackgroundImage9>
                        <BackgroundImage1 text="Annual Income" text1="INR 10 lakh to 20 lakh" />
                        <IconsProfileNo32Px className="bg-white relative rounded-[16px] shrink-0 size-[32px]" />
                      </BackgroundImage9>
                    </BackgroundImage8>
                    <div className="content-stretch flex items-start pt-[36px] relative shrink-0 w-full">
                      <p className="flex-[1_0_0] font-['Roboto:Bold',sans-serif] font-bold leading-[24px] min-h-px min-w-px relative text-[#41404d] text-[16px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Common between the both of you
                      </p>
                    </div>
                    <BackgroundImage4>
                      <BackgroundImage5 additionalClassNames="from-[#c26bac] to-[#cd6aa6]">
                        <g id="Vector" />
                        <path d={svgPaths.p17686000} fill="var(--fill-0, white)" id="Combined-Shape" />
                      </BackgroundImage5>
                      <ProfileFreeBackgroundImageAndText text="She is a Vegetarian too" />
                    </BackgroundImage4>
                    <BackgroundImage4>
                      <BackgroundImage5 additionalClassNames="from-[#c26bac] to-[#cd6aa6]">
                        <g id="Vector" />
                        <path d={svgPaths.p4374900} fill="var(--fill-0, white)" id="Shape" />
                      </BackgroundImage5>
                      <ProfileFreeBackgroundImageAndText text="He Lives in Mumbai too" />
                    </BackgroundImage4>
                  </>
                )}
              </div>
            )}
            {isInterests && (
              <>
                <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#72727d] text-[14px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Cuisines
                </p>
                <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full">
                  <BackgroundImageAndText text="Option 1" />
                  <BackgroundImageAndText text="Option 2" />
                  <BackgroundImage />
                  <BackgroundImageAndText text="Option 4" />
                </div>
              </>
            )}
          </div>
        )}
        {isPremiumMessageOrContactDetails && (
          <>
            <div className="h-[15px] relative shrink-0 w-full" data-name="Subtract">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 340 15">
                <path d={svgPaths.p302240f0} fill={isContactDetails ? "var(--fill-0, #FF5A60)" : "url(#paint0_linear_10132_4340)"} id="Subtract" />
                {isPremiumMessage && (
                  <defs>
                    <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_10132_4340" x1="35.7377" x2="35.7377" y1="3.15333" y2="15">
                      <stop stopColor="#44AFF8" />
                      <stop offset="1" stopColor="#3493D5" />
                    </linearGradient>
                  </defs>
                )}
              </svg>
            </div>
            <div className={`bg-white content-stretch flex flex-col items-start pb-[20px] pt-[5px] px-[20px] relative rounded-[12px] shrink-0 w-[340px] ${isContactDetails ? "gap-[20px]" : "gap-[10px]"}`}>
              {isPremiumMessage && (
                <div className="content-stretch flex items-center relative shrink-0 w-full">
                  <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icons/Chat_24px">
                    <div className="absolute bottom-[20.83%] left-[20.83%] right-[16.67%] top-1/4">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 13">
                        <g id="Group 1">
                          <path d={svgPaths.p2c1aa080} fill="var(--fill-0, black)" id="Shape" />
                        </g>
                      </svg>
                    </div>
                  </div>
                  <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#399ce0] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    She sent you a message
                  </p>
                </div>
              )}
              <p className={`relative shrink-0 text-[#41404d] whitespace-pre-wrap ${isContactDetails ? 'font-["Roboto:Bold",sans-serif] font-bold leading-[26px] min-w-full text-[18px] w-[min-content]' : 'font-["Roboto:Regular",sans-serif] font-normal leading-[20px] text-[14px] w-full'}`} style={{ fontVariationSettings: "'wdth' 100" }}>
                {isContactDetails ? "Contact Details" : "Ours is a middle class family, originally from Edappal, with moderate values. He has 4 sisters (4 married). His parents are no more with us."}
              </p>
              {isContactDetails && (
                <>
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                    <ListBackgroundImage text="Contact No." text1="Sagittarius, Born on" />
                    <ListBackgroundImage text="Email ID" text1="Never Married" />
                    <ProfileFreeBackgroundImage />
                  </div>
                  <BackgroundImage12>{`To unlock Contact No. & Email ID`}</BackgroundImage12>
                  <BackgroundImage6 additionalClassNames="absolute right-[17px] top-[6px]">
                    <g id="Vector" />
                    <path clipRule="evenodd" d={svgPaths.peb72e00} fill="var(--fill-0, #FF5A60)" fillRule="evenodd" id="Shape Copy 8" />
                  </BackgroundImage6>
                </>
              )}
            </div>
          </>
        )}
        {isVariant11OrVariant10 && (
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102 63">
            <path d={svgPaths.pf1fd070} fill="var(--fill-0, white)" id="Rectangle 18" />
          </svg>
        )}
        {isBasicDetails && <BackgroundImage12>To unlock Birth date</BackgroundImage12>}
      </div>
      {isVariant11OrVariant10 && (
        <>
          <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[26px] left-[20px] text-[#41404d] text-[18px] top-[20px] w-[300px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            {isVariant10 ? "Astro " : isVariant11 ? "Famil" : ""}
          </p>
          <div className="absolute h-[63px] left-0 top-0 w-[102px]" data-name="Rectangle">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102 63">
              <path clipRule="evenodd" d={svgPaths.p31ea5f00} fill={isVariant10 ? "var(--fill-0, #B7A2DC)" : "var(--fill-0, #FFC062)"} fillRule="evenodd" id="Rectangle" />
            </svg>
          </div>
          <div className="-translate-x-1/2 absolute h-[46px] left-[calc(50%-0.5px)] top-[28px] w-[55px]" data-name="Shape 1">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 55 46">
              <g clipPath={isVariant11 ? "url(#clip0_10094_14350)" : undefined} id="Shape 1">
                <path clipRule={isVariant11 ? "evenodd" : undefined} d={isVariant10 ? svgPaths.pd002f0 : svgPaths.p2f20db00} fill="var(--fill-0, white)" fillRule={isVariant11 ? "evenodd" : undefined} id="Shape" />
              </g>
              {isVariant11 && (
                <defs>
                  <clipPath id="clip0_10094_14350">
                    <rect fill="white" height="46" width="55" />
                  </clipPath>
                </defs>
              )}
            </svg>
          </div>
          <div className="-translate-x-1/2 absolute content-stretch flex items-start justify-center left-1/2 px-[20px] py-[10px] top-[68px] w-[340px]">
            <p className="flex-[1_0_0] font-['Roboto:Regular',sans-serif] font-normal leading-[24px] min-h-px min-w-px relative text-[16px] text-center text-white whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              {isVariant10 ? "Add your details to see Pooja M’s Astro details" : isVariant11 ? "Add your details to see Pooja M’s family details" : ""}
            </p>
          </div>
          <div className={`-translate-x-1/2 absolute content-stretch flex items-start justify-center left-[calc(50%-0.5px)] px-[28px] py-[10px] rounded-[20px] top-[138px] ${isVariant10 ? "bg-gradient-to-l from-[#a88fd5] to-[#9477cb]" : "bg-gradient-to-r from-[#f69b33] to-[#feae52]"}`}>
            <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[20px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.08),0px_3px_14px_0px_rgba(0,0,0,0.06),0px_5px_5px_0px_rgba(0,0,0,0.06)]" />
            <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[14px] text-center text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Add Now
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default function ProfileFree1() {
  return <ProfileFree className="relative size-full" property1="You & Her" />;
}