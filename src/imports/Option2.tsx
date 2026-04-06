import svgPaths from "./svg-09tzabbsqi";

function Wrapper5({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        {children}
      </svg>
    </div>
  );
}

function Wrapper4({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}

function Wrapper3({ children }: React.PropsWithChildren<{}>) {
  return (
    <div style={{ fontVariationSettings: "'wdth' 100" }} className="flex flex-[1_0_0] flex-col font-['Roboto:Regular',sans-serif] font-normal justify-end leading-[0] min-h-px min-w-px relative text-[#41404d] text-[16px]">
      <p className="leading-[24px] whitespace-pre-wrap">{children}</p>
    </div>
  );
}

function Wrapper2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pr-[8px] py-[16px] relative w-full">{children}</div>
      </div>
    </div>
  );
}

function Wrapper1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pr-[4px] py-[16px] relative w-full">{children}</div>
      </div>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pr-[12px] py-[12px] relative w-full">
          <div className="flex flex-[1_0_0] flex-col font-['Roboto:Regular',sans-serif] font-normal justify-end leading-[0] min-h-px min-w-px relative text-[#41404d] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[20px] whitespace-pre-wrap">{children}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
type Text1Props = {
  text: string;
};

function Text1({ text }: Text1Props) {
  return <Wrapper>{text}</Wrapper>;
}

function IconsNavigateNext24Px() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <g id="Vector" />
          <path d={svgPaths.p3a069900} fill="var(--fill-0, #B1B3B9)" id="icon/navigation/expand_less_24px" />
        </g>
      </svg>
    </div>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return <Wrapper3>{text}</Wrapper3>;
}
type IconMenuSettingsProps = {
  className?: string;
  size?: "lg (32)" | "md (24)" | "sm (20)" | "xs (16)";
  type?: "Line" | "Fill";
};

function IconMenuSettings({ className, size = "lg (32)", type = "Line" }: IconMenuSettingsProps) {
  const isFillAndIsLg32OrMd24OrSm20OrXs16 = type === "Fill" && ["lg (32)", "md (24)", "sm (20)", "xs (16)"].includes(size);
  const isFillAndMd24 = type === "Fill" && size === "md (24)";
  const isFillAndSm20 = type === "Fill" && size === "sm (20)";
  const isFillAndXs16 = type === "Fill" && size === "xs (16)";
  const isLineAndIsLg32OrMd24OrSm20OrXs16 = type === "Line" && ["lg (32)", "md (24)", "sm (20)", "xs (16)"].includes(size);
  const isLineAndLg32 = type === "Line" && size === "lg (32)";
  const isLineAndMd24 = type === "Line" && size === "md (24)";
  const isLineAndSm20 = type === "Line" && size === "sm (20)";
  const isLineAndXs16 = type === "Line" && size === "xs (16)";
  return (
    <div className={className || `relative ${size === "xs (16)" && ["Line", "Fill"].includes(type) ? "size-[16px]" : size === "sm (20)" && ["Line", "Fill"].includes(type) ? "size-[20px]" : size === "md (24)" && ["Line", "Fill"].includes(type) ? "size-[24px]" : "size-[32px]"}`}>
      <div className={`absolute ${isFillAndIsLg32OrMd24OrSm20OrXs16 ? "inset-[8.33%_5.21%]" : "inset-[35.42%]"}`} data-name="Vector">
        {isLineAndIsLg32OrMd24OrSm20OrXs16 && (
          <div className="absolute inset-[-10.71%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={isLineAndXs16 ? "0 0 5.66667 5.66667" : isLineAndSm20 ? "0 0 7.08333 7.08333" : isLineAndMd24 ? "0 0 8.5 8.5" : "0 0 11.3333 11.3333"}>
              <path d={isLineAndXs16 ? svgPaths.p3c489480 : isLineAndSm20 ? svgPaths.p21882440 : isLineAndMd24 ? svgPaths.p2fc71100 : svgPaths.p6dee640} id="Vector" stroke="var(--stroke-0, #41404D)" strokeWidth={isLineAndSm20 ? "1.25" : isLineAndMd24 ? "1.5" : isLineAndLg32 ? "2" : undefined} />
            </svg>
          </div>
        )}
        {isFillAndIsLg32OrMd24OrSm20OrXs16 && (
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox={isFillAndXs16 ? "0 0 14.3333 13.3333" : isFillAndSm20 ? "0 0 17.9167 16.6667" : isFillAndMd24 ? "0 0 21.5 20" : "0 0 28.6667 26.6667"}>
            <path clipRule="evenodd" d={isFillAndXs16 ? svgPaths.p12dc7400 : isFillAndSm20 ? svgPaths.p3bd7c300 : isFillAndMd24 ? svgPaths.p3189a800 : svgPaths.p3ad6b570} fill="var(--fill-0, #41404D)" fillRule="evenodd" id="Vector" />
          </svg>
        )}
      </div>
      {isLineAndIsLg32OrMd24OrSm20OrXs16 && (
        <div className="absolute inset-[11.2%_8.33%]" data-name="Vector">
          <div className="absolute inset-[-4.03%_-3.75%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={isLineAndXs16 ? "0 0 14.3333 13.4145" : isLineAndSm20 ? "0 0 17.9167 16.7681" : isLineAndMd24 ? "0 0 21.5 20.1217" : "0 0 28.6667 26.829"}>
              <path d={isLineAndXs16 ? svgPaths.p65f4c00 : isLineAndSm20 ? svgPaths.p20f18400 : isLineAndMd24 ? svgPaths.p235183f0 : svgPaths.p10ab3d80} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeWidth={isLineAndSm20 ? "1.25" : isLineAndMd24 ? "1.5" : isLineAndLg32 ? "2" : undefined} />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
type IconMenuPreferencesProps = {
  className?: string;
  size?: "lg (32)" | "md (24)" | "sm (20)" | "xs (16)";
  type?: "Line" | "Fill";
};

function IconMenuPreferences({ className, size = "lg (32)", type = "Line" }: IconMenuPreferencesProps) {
  const isFillAndMd24 = type === "Fill" && size === "md (24)";
  const isFillAndSm20 = type === "Fill" && size === "sm (20)";
  const isFillAndXs16 = type === "Fill" && size === "xs (16)";
  const isLineAndIsLg32OrMd24OrSm20OrXs16 = type === "Line" && ["lg (32)", "md (24)", "sm (20)", "xs (16)"].includes(size);
  const isLineAndLg32 = type === "Line" && size === "lg (32)";
  const isLineAndMd24 = type === "Line" && size === "md (24)";
  const isLineAndSm20 = type === "Line" && size === "sm (20)";
  const isLineAndXs16 = type === "Line" && size === "xs (16)";
  return (
    <div className={className || `relative ${size === "xs (16)" && ["Line", "Fill"].includes(type) ? "size-[16px]" : size === "sm (20)" && ["Line", "Fill"].includes(type) ? "size-[20px]" : size === "md (24)" && ["Line", "Fill"].includes(type) ? "size-[24px]" : "size-[32px]"}`}>
      {isLineAndIsLg32OrMd24OrSm20OrXs16 && (
        <>
          <div className="absolute inset-[6.52%_12.5%_8.63%_12.5%]">
            <div className="absolute inset-[-3.68%_-4.17%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={isLineAndXs16 ? "0 0 13 14.5755" : isLineAndSm20 ? "0 0 16.25 18.2193" : isLineAndMd24 ? "0 0 19.5 21.8632" : "0 0 26 29.1509"}>
                <g id="Group 1261157879">
                  <path d={isLineAndXs16 ? svgPaths.p4f40900 : isLineAndSm20 ? svgPaths.p101e7200 : isLineAndMd24 ? svgPaths.p8ddc000 : svgPaths.p35d20000} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth={isLineAndSm20 ? "1.25" : isLineAndMd24 ? "1.5" : isLineAndLg32 ? "2" : undefined} />
                </g>
              </svg>
            </div>
          </div>
          <div className="absolute inset-[20.83%_41.2%_60.65%_40.28%]" data-name="Vector">
            <div className="absolute inset-[-16.88%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={isLineAndXs16 ? "0 0 3.96296 3.96293" : isLineAndSm20 ? "0 0 4.9537 4.95367" : isLineAndMd24 ? "0 0 5.94444 5.9444" : "0 0 7.92593 7.92587"}>
                <path d={isLineAndXs16 ? svgPaths.p1972fa00 : isLineAndSm20 ? svgPaths.p185eecf2 : isLineAndMd24 ? svgPaths.p2583d500 : svgPaths.p20ec0400} id="Vector" stroke="var(--stroke-0, #41404D)" strokeWidth={isLineAndSm20 ? "1.25" : isLineAndMd24 ? "1.5" : isLineAndLg32 ? "2" : undefined} />
              </svg>
            </div>
          </div>
          <div className={`absolute ${isLineAndXs16 ? "inset-[47.68%_34.26%_36.11%_33.33%]" : "inset-[47.69%_34.26%_36.11%_33.33%]"}`} data-name="Vector">
            <div className="absolute inset-[-19.29%_-9.64%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={isLineAndXs16 ? "0 0 6.18518 3.59257" : isLineAndSm20 ? "0 0 7.73148 4.49071" : isLineAndMd24 ? "0 0 9.27778 5.38885" : "0 0 12.3704 7.18514"}>
                <path d={isLineAndXs16 ? svgPaths.p20e41980 : isLineAndSm20 ? svgPaths.p23bcec80 : isLineAndMd24 ? svgPaths.p2370800 : svgPaths.p9df47b2} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinejoin="round" strokeWidth={isLineAndSm20 ? "1.25" : isLineAndMd24 ? "1.5" : isLineAndLg32 ? "2" : undefined} />
              </svg>
            </div>
          </div>
        </>
      )}
      {type === "Fill" && ["lg (32)", "md (24)", "sm (20)", "xs (16)"].includes(size) && (
        <div className={`absolute ${isFillAndMd24 ? "inset-[3.4%_9.38%_5.51%_9.37%]" : "inset-[3.4%_9.37%_5.51%_9.37%]"}`} data-name="Subtract">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox={isFillAndXs16 ? "0 0 13 14.5751" : isFillAndSm20 ? "0 0 16.25 18.2193" : isFillAndMd24 ? "0 0 19.5 21.8632" : "0 0 26 29.1503"}>
            <path clipRule="evenodd" d={isFillAndXs16 ? svgPaths.p3e5623f0 : isFillAndSm20 ? svgPaths.p2910f600 : isFillAndMd24 ? svgPaths.p183b9700 : svgPaths.p19861d00} fill="var(--fill-0, #41404D)" fillRule="evenodd" id="Subtract" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default function Option() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start pt-[32px] relative size-full" data-name="option 2">
      <div className="content-stretch flex flex-col gap-[24px] items-start pt-[16px] relative shrink-0 w-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] relative shrink-0 w-[300px]">
          <div className="relative shrink-0 size-[64px]" data-name="Profile Picture Container">
            <div className="absolute bg-[#f1f1f2] left-0 rounded-[177.778px] size-[64px] top-0" data-name="Avatar image New">
              <div className="absolute flex items-center justify-center left-0 size-[64px] top-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
                <div className="-rotate-90 flex-none">
                  <div className="opacity-65 overflow-clip relative rounded-[96px] size-[64px]" data-name="Profile Photo/Male_01">
                    <div className="-translate-x-1/2 absolute flex h-[68.978px] items-center justify-center left-[calc(50%-8.86px)] top-[-2.13px] w-[76.029px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
                      <div className="flex-none rotate-90">
                        <div className="h-[76.029px] relative w-[68.978px]" data-name="Male">
                          <div className="absolute h-[61.776px] left-[6.71px] top-[7.2px] w-[54.918px]">
                            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54.9185 61.7757">
                              <g id="Frame 1707479728">
                                <path d={svgPaths.p16510500} fill="var(--fill-0, #575757)" id="Vector 6" />
                                <path d={svgPaths.p2e04f080} fill="url(#paint0_radial_10125_1350)" id="Ellipse 8700" />
                                <path d={svgPaths.p30a04d00} fill="var(--fill-0, #BDBDBD)" id="Vector 4" />
                                <path d={svgPaths.p1f448c90} fill="url(#paint1_radial_10125_1350)" id="Ellipse 8701" />
                                <path d={svgPaths.p1cfebd70} fill="url(#paint2_radial_10125_1350)" id="Vector 7" />
                                <ellipse cx="39.4062" cy="17.2516" fill="var(--fill-0, #BDBDBD)" id="Ellipse 8702" rx="1.86164" ry="2.63733" />
                                <ellipse cx="15.5132" cy="17.2516" fill="var(--fill-0, #BDBDBD)" id="Ellipse 8703" rx="1.86164" ry="2.63733" />
                              </g>
                              <defs>
                                <radialGradient cx="0" cy="0" gradientTransform="translate(27.4592 45.4861) rotate(90) scale(16.2894 27.4592)" gradientUnits="userSpaceOnUse" id="paint0_radial_10125_1350" r="1">
                                  <stop stopColor="#969696" />
                                  <stop offset="1" stopColor="#5A5A5A" />
                                </radialGradient>
                                <radialGradient cx="0" cy="0" gradientTransform="translate(27.6145 17.2518) rotate(90.7066) scale(12.5798 13.7645)" gradientUnits="userSpaceOnUse" id="paint1_radial_10125_1350" r="1">
                                  <stop offset="0.766417" stopColor="#BDBDBD" />
                                  <stop offset="1" stopColor="#9F9F9F" />
                                </radialGradient>
                                <radialGradient cx="0" cy="0" gradientTransform="translate(37.5433 11.6665) rotate(-143.027) scale(17.2823 26.4135)" gradientUnits="userSpaceOnUse" id="paint2_radial_10125_1350" r="1">
                                  <stop stopColor="#2E2E2E" />
                                  <stop offset="1" stopColor="#575757" />
                                </radialGradient>
                              </defs>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative">
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full">
              <div className="flex flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#41404d] text-[20px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[32px]">Neeha Sharma</p>
              </div>
              <Wrapper4>
                <g id="Frame 7">
                  <path d={svgPaths.p35f5c800} fill="var(--fill-0, #0094FF)" id="Vector" />
                  <g id="Vector_2">
                    <path d={svgPaths.p1517f200} fill="var(--fill-0, white)" />
                    <path d={svgPaths.p1517f200} stroke="var(--stroke-0, white)" />
                  </g>
                </g>
              </Wrapper4>
            </div>
            <div className="bg-[#f9f9fb] content-stretch flex gap-[4px] h-[28px] items-start px-[16px] py-[6px] relative rounded-[15px] shrink-0">
              <div aria-hidden="true" className="absolute border border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-[15px]" />
              <Wrapper5>
                <g id="pencil-edit-02-stroke-rounded 1">
                  <path d={svgPaths.p1dc3a380} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinejoin="round" />
                  <path d={svgPaths.p22035ef0} id="Vector_2" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </Wrapper5>
              <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#41404d] text-[12px] tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Edit Profile
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative w-full">
        <div className="content-stretch flex flex-col items-start px-[16px] relative size-full">
          <div className="content-stretch flex items-center relative shrink-0 w-[268px]" data-name="Get Premium">
            <div aria-hidden="true" className="absolute border-0 border-[#f1f1f2] border-solid inset-0 pointer-events-none" />
            <Wrapper1>
              <div className="bg-gradient-to-r content-stretch flex from-[#ff5a60] items-center justify-center p-[5.6px] relative rounded-[14.769px] shrink-0 size-[24px] to-[#f93961]" data-name="Premium Tag New">
                <Wrapper5>
                  <g id="crown-03-solid-rounded (1) 2">
                    <path clipRule="evenodd" d={svgPaths.p32c63000} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
                    <path d={svgPaths.p1b90ad00} fill="var(--fill-0, white)" id="Vector_2" />
                  </g>
                </Wrapper5>
              </div>
              <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative">
                <Text text="Get Premium" />
                <div className="bg-[#cff6e4] content-stretch flex items-center p-[6px] relative rounded-[24px] shrink-0" data-name="New_Tag">
                  <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#009f46] text-[12px] tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    55% OFF
                  </p>
                </div>
              </div>
            </Wrapper1>
            <IconsNavigateNext24Px />
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-[268px]" data-name="Complete Verification">
            <Wrapper2>
              <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Profile/Blue Tick">
                <div className="absolute inset-[8.33%]" data-name="Vector">
                  <div className="absolute inset-[-3.75%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5 21.5">
                      <path d={svgPaths.p319e4680} id="Vector" stroke="var(--stroke-0, #41404D)" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                <div className="absolute inset-[39.58%_37.5%]" data-name="Vector">
                  <div className="absolute inset-[-15%_-12.5%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.50003 6.50002">
                      <path d={svgPaths.p3f588880} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
              <Text text="Complete Verification" />
              <div className="relative shrink-0 size-[8px]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" fill="var(--fill-0, #FF5A60)" id="Ellipse 8700" r="4" />
                </svg>
              </div>
            </Wrapper2>
            <IconsNavigateNext24Px />
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-[268px]" data-name="My Partner Preference">
            <div aria-hidden="true" className="absolute border-0 border-[#f1f1f2] border-solid inset-0 pointer-events-none" />
            <Wrapper2>
              <IconMenuPreferences className="relative shrink-0 size-[24px]" size="md (24)" />
              <Wrapper3>{`Partner Preferences `}</Wrapper3>
            </Wrapper2>
            <IconsNavigateNext24Px />
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-[268px]" data-name="Settings & Privacy">
            <Wrapper2>
              <IconMenuSettings className="overflow-clip relative shrink-0 size-[24px]" size="md (24)" />
              <Wrapper3>{`Privacy & Settings`}</Wrapper3>
            </Wrapper2>
            <IconsNavigateNext24Px />
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-[268px]" data-name="VIPSHAADI">
            <Wrapper1>
              <div className="relative shrink-0 size-[24px]" data-name="adobe-after-effect">
                <div className="absolute inset-[12.5%_14.38%_15.42%_12.5%]">
                  <div className="absolute inset-[-3.61%_0_0_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5479 17.9248">
                      <g id="Group 1261157892">
                        <path d={svgPaths.p3eee6a80} id="Vector 4" stroke="var(--stroke-0, #41404D)" strokeWidth="1.25" />
                        <path d={svgPaths.pdfb7380} id="Vector 5" stroke="var(--stroke-0, #41404D)" strokeWidth="1.36364" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex-[1_0_0] h-[11.728px] min-h-px min-w-px relative">
                <div className="absolute h-[11.728px] left-0 top-0 w-[90.679px]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 90.6788 11.7275">
                    <g id="Frame 1707479929">
                      <path d={svgPaths.p245a0aa0} fill="var(--fill-0, #41404D)" id="Vector" />
                      <g id="Vector_2">
                        <path d={svgPaths.p1d034700} fill="var(--fill-0, #41404D)" />
                        <path d={svgPaths.pdc98600} fill="var(--fill-0, #41404D)" />
                        <path d={svgPaths.pe3c000} fill="var(--fill-0, #41404D)" />
                        <path d={svgPaths.p3785ee80} fill="var(--fill-0, #41404D)" />
                        <path d={svgPaths.p1fd48200} fill="var(--fill-0, #41404D)" />
                        <path d={svgPaths.p29687db0} fill="var(--fill-0, #41404D)" />
                        <path d={svgPaths.p2884780} fill="var(--fill-0, #41404D)" />
                        <path d={svgPaths.p10105b00} fill="var(--fill-0, #41404D)" />
                        <path d={svgPaths.p199f700} fill="var(--fill-0, #41404D)" />
                        <path d={svgPaths.p267b2e00} fill="var(--fill-0, #41404D)" />
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </Wrapper1>
            <IconsNavigateNext24Px />
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-[268px]" data-name="AstroChat">
            <Wrapper1>
              <Wrapper4>
                <g id="adobe-after-effect">
                  <path d={svgPaths.p2cbf6d00} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinejoin="round" strokeWidth="1.5" />
                  <path clipRule="evenodd" d={svgPaths.p39e34900} fill="var(--fill-0, #41404D)" fillRule="evenodd" id="Vector_2" />
                </g>
              </Wrapper4>
              <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative">
                <Text text="AstroChat" />
              </div>
            </Wrapper1>
            <IconsNavigateNext24Px />
          </div>
        </div>
      </div>
      <div className="bg-white h-[237px] relative shrink-0 w-full">
        <div className="absolute bg-white bottom-0 content-stretch flex flex-col gap-[12px] items-start left-0 pb-[16px] px-[16px] w-[300px]">
          <div className="h-0 relative shrink-0 w-[268px]">
            <div className="absolute inset-[-0.5px_-0.19%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 269 1">
                <path d="M0.5 0.5H268.5" id="Vector 21" stroke="var(--stroke-0, #F1F1F2)" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0" data-name="hygiene list">
            <div className="content-stretch flex flex-col items-start relative shrink-0">
              <div className="bg-white content-stretch flex items-center relative shrink-0 w-[268px]" data-name="Be safe online">
                <Text1 text="Be Safe Online" />
                <IconsNavigateNext24Px />
              </div>
              <div className="bg-white content-stretch flex items-center relative shrink-0 w-[268px]" data-name="Help & Support">
                <Wrapper>{`Help & Support`}</Wrapper>
                <IconsNavigateNext24Px />
              </div>
              <div className="bg-white content-stretch flex items-center relative shrink-0 w-[268px]" data-name="Rate the App">
                <Text1 text="Privacy Policy" />
                <IconsNavigateNext24Px />
              </div>
              <div className="bg-white content-stretch flex items-center relative shrink-0 w-[268px]" data-name="Rate the App">
                <Wrapper>{`Terms & Conditions`}</Wrapper>
                <IconsNavigateNext24Px />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}