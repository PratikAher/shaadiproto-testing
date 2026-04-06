import svgPaths from "./svg-73td7n7p03";
import imgAvatarImageNew from "figma:asset/59dc65d03dd1f8e742cd8bee01c5dd6c8323a731.png";

function BackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[8px] relative shrink-0 w-full">
      <div className="absolute inset-[-125%_0_-225%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 328 36">
          {children}
        </svg>
      </div>
    </div>
  );
}

function BackgroundImage() {
  return (
    <div className="relative shrink-0 size-[4px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
        <path d={svgPaths.p2d5a3780} fill="var(--fill-0, #95959D)" id="Ellipse 2" />
      </svg>
    </div>
  );
}
type IconSystemBlueTickProps = {
  className?: string;
  size?: "lg (32)" | "md (24)" | "sm (20)" | "xs (16)";
  type?: "Line" | "Fill";
};

function IconSystemBlueTick({ className, size = "lg (32)", type = "Line" }: IconSystemBlueTickProps) {
  const isLg32AndIsFillOrLine = size === "lg (32)" && ["Fill", "Line"].includes(type);
  const isLineAndIsXs16OrSm20OrMd24OrLg32 = type === "Line" && ["xs (16)", "sm (20)", "md (24)", "lg (32)"].includes(size);
  const isMd24AndIsFillOrLine = size === "md (24)" && ["Fill", "Line"].includes(type);
  const isSm20AndIsFillOrLine = size === "sm (20)" && ["Fill", "Line"].includes(type);
  return (
    <div className={className || `relative ${isLg32AndIsFillOrLine ? "size-[32px]" : isMd24AndIsFillOrLine ? "size-[24px]" : isSm20AndIsFillOrLine ? "size-[20px]" : "size-[16px]"}`}>
      <div className={`absolute ${isLg32AndIsFillOrLine ? "left-[3.33px] size-[25.333px] top-[3.33px]" : isMd24AndIsFillOrLine ? "left-[2.5px] size-[19px] top-[2.5px]" : isSm20AndIsFillOrLine ? "left-[2.08px] size-[15.833px] top-[2.08px]" : "left-[1.67px] size-[12.667px] top-[1.67px]"}`} data-name="Vector">
        <div className="absolute inset-[-7.89%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={isLg32AndIsFillOrLine ? "0 0 29.3333 29.3333" : isMd24AndIsFillOrLine ? "0 0 22 22" : isSm20AndIsFillOrLine ? "0 0 18.3333 18.3333" : "0 0 14.6667 14.6667"}>
            <path d={isLg32AndIsFillOrLine ? svgPaths.p361ad700 : isMd24AndIsFillOrLine ? svgPaths.p9deb400 : isSm20AndIsFillOrLine ? svgPaths.p250fad00 : svgPaths.p3d3c00} fill={type === "Fill" && ["xs (16)", "sm (20)", "md (24)", "lg (32)"].includes(size) ? "var(--fill-0, #0094FF)" : undefined} id="Vector" stroke={isLineAndIsXs16OrSm20OrMd24OrLg32 ? "var(--stroke-0, #0094FF)" : "var(--stroke-0, white)"} strokeWidth={isLg32AndIsFillOrLine ? "2" : isMd24AndIsFillOrLine ? "1.5" : isSm20AndIsFillOrLine ? "1.25" : undefined} />
          </svg>
        </div>
      </div>
      <div className={`absolute ${isLg32AndIsFillOrLine ? "h-[5.867px] left-[11.73px] top-[12.93px] w-[8.533px]" : isMd24AndIsFillOrLine ? "h-[4.4px] left-[8.8px] top-[9.7px] w-[6.4px]" : isSm20AndIsFillOrLine ? "h-[3.667px] left-[7.33px] top-[8.08px] w-[5.333px]" : "h-[2.933px] left-[5.87px] top-[6.47px] w-[4.267px]"}`} data-name="Vector">
        <div className="absolute inset-[-22.73%_-15.63%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={isLg32AndIsFillOrLine ? "0 0 11.1999 8.53327" : isMd24AndIsFillOrLine ? "0 0 8.39995 6.39995" : isSm20AndIsFillOrLine ? "0 0 6.99996 5.33329" : "0 0 5.59997 4.26663"}>
            <path d={isLg32AndIsFillOrLine ? svgPaths.p427e280 : isMd24AndIsFillOrLine ? svgPaths.p22ab8040 : isSm20AndIsFillOrLine ? svgPaths.p2ca61e60 : svgPaths.p2a4d2180} id="Vector" stroke={isLineAndIsXs16OrSm20OrMd24OrLg32 ? "var(--stroke-0, #0094FF)" : "var(--stroke-0, white)"} strokeLinecap="round" strokeLinejoin="round" strokeWidth={isLg32AndIsFillOrLine ? "2.66667" : isMd24AndIsFillOrLine ? "2" : isSm20AndIsFillOrLine ? "1.66667" : "1.33333"} />
          </svg>
        </div>
      </div>
    </div>
  );
}
type PremiumTagNewProps = {
  className?: string;
  property1?: "Premium" | "Premium Plus" | "New" | "Premium New" | "VIP" | "Select";
};

function PremiumTagNew({ className, property1 = "Premium" }: PremiumTagNewProps) {
  const isNew = property1 === "New";
  const isPremiumNewOrVip = ["Premium New", "VIP"].includes(property1);
  const isPremiumPlusOrPremiumNew = ["Premium Plus", "Premium New"].includes(property1);
  const isSelect = property1 === "Select";
  const isVip = property1 === "VIP";
  return (
    <div className={className || `relative ${isSelect ? "bg-[#976acb] rounded-[16px]" : isVip ? "bg-[#6f3ba9] rounded-[16px]" : isNew ? "bg-[#ff5a60] rounded-[100px]" : isPremiumPlusOrPremiumNew ? "bg-[#ff5a60] rounded-[100px] w-[57px]" : "bg-[#ff5a60] rounded-[100px] size-[24px]"}`}>
      <div className={`flex flex-row items-center size-full ${["Premium Plus", "New", "Premium New", "VIP", "Select"].includes(property1) ? "" : "justify-center"}`}>
        <div className={`content-stretch flex items-center relative ${isSelect ? "pl-[9px] pr-[11px] py-[6px]" : isVip ? "gap-[2px] pl-[9px] pr-[11px] py-[6px]" : isNew ? "px-[16px] py-[6px]" : isPremiumPlusOrPremiumNew ? "gap-[2px] pl-[9px] pr-[11px] py-[6px] w-full" : "justify-center px-[4.53px] py-[6.533px] size-full"}`}>
          {["Premium Plus", "Premium New", "VIP"].includes(property1) && (
            <div className={`content-stretch flex items-center relative shrink-0 ${property1 === "Premium New" ? "" : "pb-px"}`}>
              <div className="overflow-clip relative shrink-0 size-[12px]" data-name="Icon/Bottom Nav/Premium">
                <div className="absolute inset-[11.46%_5.21%]" data-name="Vector">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox={isPremiumNewOrVip ? "0 0 14.3334 12.3333" : "0 0 10.7501 9.25"}>
                    <path clipRule="evenodd" d={isPremiumNewOrVip ? svgPaths.p2275e00 : svgPaths.p16a6f0c0} fill={isPremiumNewOrVip ? "var(--fill-0, #41404D)" : "var(--fill-0, white)"} fillRule="evenodd" id="Vector" />
                  </svg>
                </div>
              </div>
            </div>
          )}
          {["Premium Plus", "New", "Premium New", "VIP"].includes(property1) && (
            <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[12px] text-white tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              {isVip ? "VIP" : ["New", "Premium New"].includes(property1) ? "New" : property1 === "Premium Plus" ? "Plus" : ""}
            </p>
          )}
          {property1 === "Premium" && (
            <div className="overflow-clip relative shrink-0 size-[12px]" data-name="Icon/Bottom Nav/Premium">
              <div className="absolute inset-[11.46%_5.21%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.3334 12.3333">
                  <path clipRule="evenodd" d={svgPaths.p2275e00} fill="var(--fill-0, #41404D)" fillRule="evenodd" id="Vector" />
                </svg>
              </div>
            </div>
          )}
          {isSelect && (
            <>
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icons/Bottom Nav/Active_Premium_24px">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g id="Group">
                    <g id="Vector" />
                    <path clipRule="evenodd" d={svgPaths.peb72e00} fill="var(--fill-0, #FF5A60)" fillRule="evenodd" id="Shape Copy 8" />
                  </g>
                </svg>
              </div>
              <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[12px] text-white tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Select
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
      <div className="content-stretch flex flex-[1_0_0] flex-col h-[517px] items-center min-h-px min-w-px relative">
        <BackgroundImage1>
          <g id="Frame 239">
            <g filter="url(#filter0_ddd_10146_405)" id="Rectangle 19810">
              <path d={svgPaths.p1fa0db00} fill="var(--fill-0, white)" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="36" id="filter0_ddd_10146_405" width="288" x="20" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="3" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_10146_405" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="6" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
              <feBlend in2="effect1_dropShadow_10146_405" mode="normal" result="effect2_dropShadow_10146_405" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="6" />
              <feGaussianBlur stdDeviation="6" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend in2="effect2_dropShadow_10146_405" mode="normal" result="effect3_dropShadow_10146_405" />
              <feBlend in="SourceGraphic" in2="effect3_dropShadow_10146_405" mode="normal" result="shape" />
            </filter>
          </defs>
        </BackgroundImage1>
        <BackgroundImage1>
          <g id="Frame 238">
            <g filter="url(#filter0_ddd_10146_402)" id="Rectangle 19809">
              <path d={svgPaths.p17472000} fill="var(--fill-0, white)" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="36" id="filter0_ddd_10146_402" width="320" x="4" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="3" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_10146_402" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="6" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
              <feBlend in2="effect1_dropShadow_10146_402" mode="normal" result="effect2_dropShadow_10146_402" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="6" />
              <feGaussianBlur stdDeviation="6" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend in2="effect2_dropShadow_10146_402" mode="normal" result="effect3_dropShadow_10146_402" />
              <feBlend in="SourceGraphic" in2="effect3_dropShadow_10146_402" mode="normal" result="shape" />
            </filter>
          </defs>
        </BackgroundImage1>
        <div className="bg-white content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-center justify-center min-h-px min-w-px relative rounded-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.08),0px_1px_11px_0px_rgba(0,0,0,0.06),0px_2px_5px_0px_rgba(0,0,0,0.06)] w-full">
          <div className="content-stretch flex flex-col h-[290px] items-center justify-center pt-[12px] relative shrink-0 w-full">
            <div className="relative shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex items-center justify-between px-[16px] relative w-full">
                  <PremiumTagNew className="bg-[#ff5a60] relative rounded-[100px] shrink-0 w-[57px]" property1="Premium Plus" />
                  <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#95959d] text-[12px] tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    few hours ago
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px relative w-full">
              <div className="relative rounded-[250px] shrink-0 size-[250px]" data-name="Avatar image New">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[250px] size-full" src={imgAvatarImageNew} />
              </div>
            </div>
          </div>
          <div className="relative shrink-0 w-full">
            <div className="flex flex-col items-center justify-center size-full">
              <div className="content-stretch flex flex-col items-center justify-center px-[16px] relative w-full">
                <div className="bg-white relative rounded-[8px] shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border-2 border-[#00bcd5] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[10px] items-center pl-[12px] pr-[8px] py-[8px] relative w-full">
                      <p className="flex-[1_0_0] font-['Roboto:Medium_Italic',sans-serif] font-medium italic leading-[20px] min-h-px min-w-px overflow-hidden relative text-[#51505d] text-[14px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>{`Hi, I liked your profile and would like to get to know you better. Let's connect on Instagram or Whatsapp for better communication??`}</p>
                      <div className="content-stretch flex items-center pr-[9px] relative shrink-0">
                        <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] mr-[-9px] overflow-hidden relative shrink-0 text-[#0aa4b8] text-[14px] text-ellipsis w-[39px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                          more
                        </p>
                        <div className="content-stretch flex items-center mr-[-9px] pt-[3px] relative shrink-0">
                          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icons/navigate_next_24px">
                            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                              <g id="Group">
                                <g id="Vector" />
                                <path d={svgPaths.p33cf2d80} fill="var(--fill-0, #0AA4B8)" id="icon/navigation/expand_less_24px" />
                              </g>
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
          <div className="-translate-x-1/2 absolute left-[calc(50%+31.5px)] size-[11px] top-[292px]" data-name="Subtract">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
              <path d={svgPaths.p14999500} fill="var(--fill-0, #00BCD5)" id="Subtract" />
            </svg>
          </div>
          <div className="content-stretch flex flex-col gap-px items-start opacity-90 relative shrink-0 w-full" data-name="Mini Profile">
            <div className="content-stretch flex gap-[4px] items-center px-[16px] relative shrink-0">
              <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[26px] relative shrink-0 text-[#41404d] text-[18px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Surya N
              </p>
              <IconSystemBlueTick className="overflow-clip relative shrink-0 size-[24px]" size="md (24)" type="Fill" />
            </div>
            <div className="relative shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[8px] items-center px-[16px] relative w-full">
                  <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#72727d] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    29 yrs, 5’2”
                  </p>
                  <BackgroundImage />
                  <p className="flex-[1_0_0] font-['Roboto:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px overflow-hidden relative text-[#72727d] text-[14px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    CxO / Chairman / Director / President with MIPLer
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[8px] items-center px-[16px] relative shrink-0">
              <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#72727d] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Hindi, Brahmin - Gour
              </p>
              <BackgroundImage />
              <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#72727d] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Bengaluru
              </p>
            </div>
            <div className="h-[8px] relative shrink-0 w-full">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 328 8">
                <g id="Frame 228">
                  <line id="Line 8" stroke="var(--stroke-0, #DFE0E3)" x1="16" x2="312" y1="7.5" y2="7.5" />
                </g>
              </svg>
            </div>
          </div>
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex items-center justify-between pb-[12px] px-[32px] relative w-full">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                  <div className="bg-[#f1f1f2] overflow-clip relative rounded-[92.308px] shadow-[0px_3.692px_7.385px_0px_rgba(0,0,0,0.08),0px_0.923px_10.154px_0px_rgba(0,0,0,0.06),0px_1.846px_4.615px_0px_rgba(0,0,0,0.06)] shrink-0 size-[48px]" data-name="Circular Buttons">
                    <div className="absolute inset-[23.08%] overflow-clip" data-name="Icons/close_24px">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.8462 25.8462">
                        <g id="Group">
                          <g id="Vector" />
                          <path d={svgPaths.p25b8b700} fill="var(--fill-0, #B1B3B9)" id="Mask" />
                        </g>
                      </svg>
                    </div>
                  </div>
                  <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#95959d] text-[12px] tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Decline
                  </p>
                </div>
                <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0">
                  <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[#0aa4b8] text-[12px] text-right tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Accept
                  </p>
                  <div className="overflow-clip relative rounded-[92.308px] shadow-[0px_3.692px_7.385px_0px_rgba(0,0,0,0.08),0px_0.923px_10.154px_0px_rgba(0,0,0,0.06),0px_1.846px_4.615px_0px_rgba(0,0,0,0.06)] shrink-0 size-[48px]" data-name="Circular Buttons" style={{ backgroundImage: "linear-gradient(-37.6125deg, rgb(10, 164, 184) 13.336%, rgb(9, 191, 108) 85.792%)" }}>
                    <div className="absolute inset-[17.86%]" data-name="Icons/Connect_24px">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                        <g id="Vector" />
                      </svg>
                      <div className="absolute bottom-[21.17%] left-[16.67%] right-[16.67%] top-1/4" data-name="Shape">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.5714 16.6114">
                          <path d={svgPaths.p3e41cb00} fill="var(--fill-0, white)" id="Shape" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="-translate-x-1/2 absolute h-[2px] left-[calc(50%+32px)] top-[303px] w-[8px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 2">
              <path d="M0 0H6L8 2H0V0Z" fill="var(--fill-0, white)" id="Rectangle 19811" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}