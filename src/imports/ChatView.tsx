import clsx from "clsx";
import svgPaths from "./svg-psnhs5alme";
import imgAvatarImageNew from "figma:asset/59dc65d03dd1f8e742cd8bee01c5dd6c8323a731.png";
import imgProfileCard from "figma:asset/9d9348521c62e828b57d7338ba3c51fe7de17206.png";
type BackgroundImageProps = {
  additionalClassNames?: string;
};

function BackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImageProps>) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.67867 4.66667">
        {children}
      </svg>
    </div>
  );
}
type StateLayer3VectorBackgroundImageProps = {
  additionalClassNames?: string;
};

function StateLayer3VectorBackgroundImage({ additionalClassNames = "" }: StateLayer3VectorBackgroundImageProps) {
  return (
    <BackgroundImage additionalClassNames={additionalClassNames}>
      <path d={svgPaths.p21a1a8f0} fill="var(--fill-0, #41404D)" id="Vector" stroke="var(--stroke-0, #41404D)" strokeWidth="1.33333" />
    </BackgroundImage>
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

export default function ChatView() {
  return (
    <div className="bg-white relative size-full" data-name="Chat View">
      <div className="absolute content-stretch flex flex-col items-start left-0 top-0 w-[360px]" data-name="Header Container">
        <div className="bg-gradient-to-r from-white h-[64px] relative shrink-0 to-white w-full" data-name="Top app bar">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center px-[4px] py-[8px] relative size-full">
              <div className="content-stretch flex flex-col h-[44px] items-center justify-center relative shrink-0" data-name="icon-left">
                <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="container">
                  <div className="content-stretch flex items-center justify-center p-[8px] relative shrink-0" data-name="state-layer">
                    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icons/Back_24px">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="Group">
                          <g id="Vector" />
                          <path d={svgPaths.p355b0700} fill="var(--fill-0, #41404D)" id="Vector_2" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
                <div className="overflow-clip relative rounded-[9999px] shrink-0 size-[40px]" data-name="Profile Photo Thumbnail Female">
                  <div className="absolute left-0 rounded-[9999px] size-[40px] top-0" data-name="Avatar image New">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[9999px] size-full" src={imgAvatarImageNew} />
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                  <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[28px] relative shrink-0 text-[#272631] text-[20px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Anishika R
                  </p>
                  <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#95959d] text-[12px] tracking-[0.2px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Online
                  </p>
                </div>
              </div>
              <div className="content-stretch flex h-[48px] items-center justify-end relative shrink-0" data-name="trailing-icon right">
                <div className="content-stretch flex flex-col h-[44px] items-center justify-center relative shrink-0" data-name="leading-icon Right 1">
                  <div className="content-stretch flex h-[25px] items-center justify-center overflow-clip relative shrink-0" data-name="container">
                    <div className="content-stretch flex items-center justify-center p-[8px] relative shrink-0" data-name="state-layer">
                      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Chat/Video Call">
                        <div className="absolute inset-[16.67%_29.17%_16.67%_8.33%]" data-name="Vector">
                          <div className="absolute inset-[-4.69%_-5%]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 17.5">
                              <path d={svgPaths.p12433580} id="Vector" stroke="var(--stroke-0, #41404D)" strokeWidth="1.5" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute inset-[27.08%_8.33%_27.08%_70.83%]" data-name="Vector">
                          <div className="absolute inset-[-6.83%_-15%]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.50002 12.502">
                              <path d={svgPaths.p240827b0} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeWidth="1.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col h-[44px] items-center justify-center relative shrink-0" data-name="leading-icon Right 2">
                  <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="container">
                    <div className="content-stretch flex items-center justify-center p-[8px] relative shrink-0" data-name="state-layer">
                      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Chat/Call">
                        <div className="absolute inset-[12.5%]" data-name="Vector">
                          <div className="absolute inset-[-4.17%]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.4999 19.5">
                              <path d={svgPaths.p334c9180} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeWidth="1.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col h-[48px] items-center justify-center relative shrink-0" data-name="leading-icon Right 3">
                  <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[44px]" data-name="container">
                    <div className="content-stretch flex items-center justify-center p-[8px] relative shrink-0" data-name="state-layer">
                      <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Icon/System/More 01">
                        <StateLayer3VectorBackgroundImage additionalClassNames="inset-[42.71%_42.7%_42.71%_42.68%]" />
                        <StateLayer3VectorBackgroundImage additionalClassNames="inset-[67.71%_42.74%_17.71%_42.64%]" />
                        <BackgroundImage additionalClassNames="inset-[17.71%_42.67%_67.71%_42.71%]">
                          <path clipRule="evenodd" d={svgPaths.p8c01b00} fill="var(--fill-0, #41404D)" fillRule="evenodd" id="Vector" />
                        </BackgroundImage>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-size-[231.00000344216824px_356.0000053048134px,auto_auto,auto_auto] bg-top-left content-stretch flex flex-col gap-[16px] h-[736px] items-start left-0 p-[16px] top-[64px] w-[360px]" data-name="Profile Card" style={{ backgroundImage: `url('${imgProfileCard}'), linear-gradient(90deg, rgba(212, 247, 255, 0.3) 0%, rgba(212, 247, 255, 0.3) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)` }}>
        <div className="bg-white content-stretch flex flex-col gap-[16px] items-center p-[16px] relative rounded-[16px] shrink-0 w-[328px]" data-name="Upgrade to connect Card">
          <div aria-hidden="true" className="absolute border border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-[16px]" />
          <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex items-center overflow-clip relative rounded-[12px] shrink-0">
              <div className="relative shrink-0 size-[120px]" data-name="Avatar image New">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAvatarImageNew} />
              </div>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative">
              <div className="content-stretch flex gap-[2px] items-center relative shrink-0 w-full">
                <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#41404d] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Anshika R
                </p>
                <div className="flex flex-row items-center self-stretch">
                  <div className="h-full relative shrink-0">
                    <div className="flex flex-row items-center size-full">
                      <div className="content-stretch flex h-full items-center pb-[2px] relative">
                        <IconSystemBlueTick className="overflow-clip relative shrink-0 size-[16px]" size="xs (16)" type="Fill" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[2px] items-start justify-center relative shrink-0 text-[#72727d] text-[14px] text-ellipsis w-full whitespace-nowrap">
                <p className="h-[20px] leading-[20px] overflow-hidden relative shrink-0 w-[168px]" style={{ fontVariationSettings: "'wdth' 100" }}>{`38 yrs, 5' 10"`}</p>
                <p className="h-[20px] leading-[20px] overflow-hidden relative shrink-0 w-[168px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Tulu, Bunt (Shetty)
                </p>
                <p className="h-[20px] leading-[20px] overflow-hidden relative shrink-0 w-[168px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Admin Professional
                </p>
                <p className="h-[20px] leading-[0] overflow-hidden relative shrink-0 w-[168px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <span className="leading-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Lucknow
                  </span>
                  <span className="leading-[20px]">, India</span>
                </p>
              </div>
            </div>
            <div className="absolute bg-[#ff5a60] left-[8px] rounded-[83.333px] size-[20px] top-[8px]" data-name="Premium Tag New">
              <div className="flex flex-row items-center justify-center size-full">
                <div className="content-stretch flex items-center justify-center px-[3.775px] py-[5.444px] relative size-full">
                  <div className="overflow-clip relative shrink-0 size-[10px]" data-name="Icon/Bottom Nav/Premium">
                    <div className="absolute inset-[11.46%_5.21%]" data-name="Vector">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.95838 7.70833">
                        <path clipRule="evenodd" d={svgPaths.p2bf9c600} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-center pt-[12px] relative shrink-0 w-full">
            <div aria-hidden="true" className="absolute border-[#dfe0e3] border-solid border-t inset-0 pointer-events-none" />
            <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#41404d] text-[14px] text-center w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
              This is an Accepted Member.
            </p>
          </div>
        </div>
        <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Date">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#72727d] text-[12px] text-center tracking-[0.2px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            24 Nov 2020
          </p>
        </div>
        <div className="absolute bg-[#fcf8e7] left-[16px] rounded-[12px] top-[548px] w-[328px]" data-name="Safety First">
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-h-px min-w-px relative">
                <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0 w-full">
                  <div className="content-stretch flex items-center relative shrink-0">
                    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]">
                      <div className="h-[13.333px] relative shrink-0 w-[11.354px]" data-name="surface1">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.3544 13.3333">
                          <g id="surface1">
                            <path d={svgPaths.p11730a00} id="Vector" stroke="var(--stroke-0, #41404D)" strokeWidth="1.33333" />
                            <path d={svgPaths.p1cac280} fill="var(--fill-0, #41404D)" id="Vector_2" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#41404d] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <p className="leading-[20px]">Safety First</p>
                  </div>
                </div>
                <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#72727d] text-[14px] text-center w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <p className="leading-[20px]">{`Be respectful to others. Never share financial details & avoid sharing personal details with matches you don’t know.`}</p>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border-[#dfe0e3] border-b border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_6px_12px_0px_rgba(0,0,0,0.08),0px_2px_12px_0px_rgba(0,0,0,0.06),0px_3px_4px_0px_rgba(0,0,0,0.06)]" />
        </div>
      </div>
      <div className="absolute bottom-0 content-stretch flex flex-col items-start left-0 w-[360px]" data-name="Navigation bar">
        <div className="bg-white h-[74px] relative shrink-0 w-full" data-name="Text box">
          <div className="content-stretch flex flex-col items-start px-[12px] py-[13px] relative size-full">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Icon">
              <div className="bg-[#f9f9fb] relative rounded-[100px] shrink-0 size-[40px]" data-name="Icon">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip p-[7px] relative rounded-[inherit] size-full">
                  <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/System/Add">
                    <div className="absolute inset-[16.67%_16.66%_16.66%_16.67%]" data-name="Vector">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.002 16.0019">
                        <path d={svgPaths.p1c338900} fill="var(--fill-0, #41404D)" id="Vector" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div aria-hidden="true" className="absolute border border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-[100px]" />
              </div>
              <div className="bg-[#f9f9fb] flex-[1_0_0] h-[48px] min-h-px min-w-px relative rounded-[100px]" data-name="Input">
                <div aria-hidden="true" className="absolute border border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-[100px]" />
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[10px] items-center pl-[14px] pr-[8px] py-[16px] relative size-full">
                    <div className="flex flex-[1_0_0] flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#95959d] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      <p className="leading-[24px]">Type a message</p>
                    </div>
                    <div className="bg-[#0aa4b8] content-stretch flex items-center justify-center pb-[4px] pl-[4px] pr-[8px] pt-[8px] relative rounded-[100px] shrink-0" data-name="Send button icon">
                      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Icon/Chat/Sent">
                        <div className="absolute inset-[4.17%_6.24%_6.24%_4.17%]" data-name="Vector">
                          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.918 17.918">
                            <path d={svgPaths.p39128400} fill="var(--fill-0, white)" id="Vector" />
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
      </div>
    </div>
  );
}