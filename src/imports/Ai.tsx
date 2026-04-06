import clsx from "clsx";
import svgPaths from "./svg-5y984fxn6c";
import imgProfileImage from "figma:asset/4e8e68f240ea8068ac2d158b227f83881710d90b.png";
import imgProfileImage1 from "figma:asset/59dc65d03dd1f8e742cd8bee01c5dd6c8323a731.png";
import imgProfileImage2 from "figma:asset/6a5de3d06000c07cdf34224adb4289f7e3d8f353.png";
import imgProfileImage3 from "figma:asset/8827eb092c2a9fd7d7000a4920f6b6a8c49e4dd6.png";
import imgProfileImage4 from "figma:asset/c2194421b72d1343d484b0230ac79be121da23bd.png";

function ProfileInfo({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative rounded-bl-[16px] rounded-br-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dfe0e3] border-b border-l border-r border-solid inset-0 pointer-events-none rounded-bl-[16px] rounded-br-[16px]" />
      <div className="content-stretch flex flex-col gap-[2px] items-start pb-[16px] pt-[12px] px-[16px] relative w-full">{children}</div>
    </div>
  );
}
type DeviceStatubarWhiteBgHelperProps = {
  additionalClassNames?: string;
};

function DeviceStatubarWhiteBgHelper({ children, additionalClassNames = "" }: React.PropsWithChildren<DeviceStatubarWhiteBgHelperProps>) {
  return (
    <div className={clsx("col-1 mt-0 relative row-1 size-[17px]", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        {children}
      </svg>
    </div>
  );
}
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div className={additionalClassNames}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 71.8917 62.3539">
        {children}
      </svg>
    </div>
  );
}

function ProfileCard({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start relative">{children}</div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)]" />
    </div>
  );
}

function Button({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[36px] relative rounded-[20px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#0aa4b8] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center pl-[26px] pr-[32px] py-[10px] relative size-full">{children}</div>
      </div>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-full">
      <Button>{children}</Button>
    </div>
  );
}

function Frame2147223144PremiumTag() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#ff5a60] left-[calc(50%+78px)] rounded-[1000px] size-[24px] top-[10px]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center py-[4px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon/Bottom Nav/Premium">
            <div className="absolute inset-[11.46%_5.21%]" data-name="Vector">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.3334 12.3333">
                <path clipRule="evenodd" d={svgPaths.p2275e00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
type ActionTextProps = {
  text: string;
};

function ActionText({ text, children }: React.PropsWithChildren<ActionTextProps>) {
  return (
    <Wrapper>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon/System/Tick Thick">
        <div className="absolute inset-[27.08%_18.75%]" data-name="Vector">
          <div className="absolute inset-[-13.64%_-10%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 9.33334">
              {children}
            </svg>
          </div>
        </div>
      </div>
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#0aa4b8] text-[14px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </Wrapper>
  );
}
type Helper12Props = {
  additionalClassNames?: string;
};

function Helper12({ additionalClassNames = "" }: Helper12Props) {
  return (
    <div className={clsx("absolute flex items-center justify-center", additionalClassNames)}>
      <div className="-scale-y-100 flex-none h-[62.354px] rotate-180 w-[71.892px]">
        <Wrapper1 additionalClassNames="relative size-full">
          <g id="Group 4868492">
            <path d={svgPaths.p2344f9f0} fill="var(--fill-0, #DAF8FF)" id="Vector" />
            <path d={svgPaths.p3466c0c0} fill="var(--fill-0, #DAF8FF)" id="Vector_2" />
            <path d={svgPaths.p2cdcff80} fill="var(--fill-0, #DAF8FF)" id="Vector_3" />
            <path d={svgPaths.p3794580} fill="var(--fill-0, #DAF8FF)" id="Vector_4" />
          </g>
        </Wrapper1>
      </div>
    </div>
  );
}
type Vector5Props = {
  additionalClassNames?: string;
};

function Vector5({ additionalClassNames = "" }: Vector5Props) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.0052 26.6295">
        <path d={svgPaths.p1bb2900} fill="var(--fill-0, #DAF8FF)" id="Vector" />
      </svg>
    </div>
  );
}
type Vector4Props = {
  additionalClassNames?: string;
};

function Vector4({ additionalClassNames = "" }: Vector4Props) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.6875 24.3144">
        <path d={svgPaths.p328e6d80} fill="var(--fill-0, #DAF8FF)" id="Vector" />
      </svg>
    </div>
  );
}
type Helper11Props = {
  additionalClassNames?: string;
};

function Helper11({ additionalClassNames = "" }: Helper11Props) {
  return (
    <div className={clsx("absolute flex items-center justify-center", additionalClassNames)}>
      <div className="flex-none h-[27.246px] rotate-[-19.05deg] w-[24.465px]">
        <div className="relative size-full" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.4654 27.2455">
            <path d={svgPaths.p12a4880} fill="var(--fill-0, #DAF8FF)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}
type Vector3Props = {
  additionalClassNames?: string;
};

function Vector3({ additionalClassNames = "" }: Vector3Props) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.5555 27.3666">
        <path d={svgPaths.p3840a672} fill="var(--fill-0, #DAF8FF)" id="Vector" />
      </svg>
    </div>
  );
}
type Vector2Props = {
  additionalClassNames?: string;
};

function Vector2({ additionalClassNames = "" }: Vector2Props) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.9872 31.3008">
        <path d={svgPaths.p3eb7ab00} fill="var(--fill-0, #DAF8FF)" id="Vector" />
      </svg>
    </div>
  );
}
type Vector1Props = {
  additionalClassNames?: string;
};

function Vector1({ additionalClassNames = "" }: Vector1Props) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56.4215 31.0607">
        <path d={svgPaths.p34bae800} fill="var(--fill-0, #DAF8FF)" id="Vector" />
      </svg>
    </div>
  );
}
type VectorProps = {
  additionalClassNames?: string;
};

function Vector({ additionalClassNames = "" }: VectorProps) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48.96 64.32">
        <path d={svgPaths.p31d91480} fill="var(--fill-0, #DAF8FF)" id="Vector" />
      </svg>
    </div>
  );
}
type Helper10Props = {
  additionalClassNames?: string;
};

function Helper10({ additionalClassNames = "" }: Helper10Props) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42.0718 64.3313">
        <g id="Group 4868482">
          <path d={svgPaths.p2246de00} fill="var(--fill-0, #DAF8FF)" id="Vector" />
          <path d={svgPaths.p39601400} fill="var(--fill-0, #DAF8FF)" id="Vector_2" />
          <path d={svgPaths.p810a600} fill="var(--fill-0, #DAF8FF)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}
type Helper9Props = {
  additionalClassNames?: string;
};

function Helper9({ additionalClassNames = "" }: Helper9Props) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48.8141 57.6773">
        <g id="Group 4868489">
          <path d={svgPaths.p13f3d800} fill="var(--fill-0, #DAF8FF)" id="Vector" />
          <path d={svgPaths.p3b46e900} fill="var(--fill-0, #DAF8FF)" id="Vector_2" />
          <path d={svgPaths.p7258ea0} fill="var(--fill-0, #DAF8FF)" id="Vector_3" />
          <path d={svgPaths.pf0f0500} fill="var(--fill-0, #DAF8FF)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}
type Helper8Props = {
  additionalClassNames?: string;
};

function Helper8({ additionalClassNames = "" }: Helper8Props) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.7132 67.2023">
        <g id="Group 4868490">
          <path d={svgPaths.p33107880} fill="var(--fill-0, #DAF8FF)" id="Vector" />
          <path d={svgPaths.pb693700} fill="var(--fill-0, #DAF8FF)" id="Vector_2" />
          <path d={svgPaths.p37f50000} fill="var(--fill-0, #DAF8FF)" id="Vector_3" />
          <path d={svgPaths.p2b3e8480} fill="var(--fill-0, #DAF8FF)" id="Vector_4" />
          <path d={svgPaths.p1e1f3080} fill="var(--fill-0, #DAF8FF)" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}
type Helper7Props = {
  additionalClassNames?: string;
};

function Helper7({ additionalClassNames = "" }: Helper7Props) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58.7475 100.8">
        <g id="Group 4868480">
          <path d={svgPaths.paa53580} fill="var(--fill-0, #DAF8FF)" id="Vector" />
          <path d={svgPaths.p7b69780} fill="var(--fill-0, #DAF8FF)" id="Vector_2" />
          <path d={svgPaths.p3d273b00} fill="var(--fill-0, #DAF8FF)" id="Vector_3" />
          <path d={svgPaths.p270adc00} fill="var(--fill-0, #DAF8FF)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}
type Helper6Props = {
  additionalClassNames?: string;
};

function Helper6({ additionalClassNames = "" }: Helper6Props) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 61.4096 72.2071">
        <g id="Group 4868481">
          <path d={svgPaths.p29d39340} fill="var(--fill-0, #DAF8FF)" id="Vector" />
          <path d={svgPaths.p8723100} fill="var(--fill-0, #DAF8FF)" id="Vector_2" />
          <path d={svgPaths.pb924c00} fill="var(--fill-0, #DAF8FF)" id="Vector_3" />
          <path d={svgPaths.pc5bac80} fill="var(--fill-0, #DAF8FF)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}
type Helper5Props = {
  additionalClassNames?: string;
};

function Helper5({ additionalClassNames = "" }: Helper5Props) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60.5532 47.1509">
        <g id="Group 4868479">
          <path d={svgPaths.p2853e900} fill="var(--fill-0, #DAF8FF)" id="Vector" />
          <path d={svgPaths.p1a34c700} fill="var(--fill-0, #DAF8FF)" id="Vector_2" />
          <path d={svgPaths.p19f5ed00} fill="var(--fill-0, #DAF8FF)" id="Vector_3" />
          <path d={svgPaths.p259dcf00} fill="var(--fill-0, #DAF8FF)" id="Vector_4" />
          <path d={svgPaths.p1166b880} fill="var(--fill-0, #DAF8FF)" id="Vector_5" />
          <path d={svgPaths.p2160be00} fill="var(--fill-0, #DAF8FF)" id="Vector_6" />
        </g>
      </svg>
    </div>
  );
}
type Helper4Props = {
  additionalClassNames?: string;
};

function Helper4({ additionalClassNames = "" }: Helper4Props) {
  return (
    <div style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties} className={clsx("absolute flex h-[74.631px] items-center justify-center w-[82.55px]", additionalClassNames)}>
      <div className="flex-none rotate-[-23.82deg] skew-x-[0.01deg]">
        <div className="h-[51.851px] relative w-[67.34px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 67.34 51.8515">
            <g id="Group 4868427">
              <path d={svgPaths.p376b1ff0} fill="var(--fill-0, #DAF8FF)" id="Vector" />
              <path d={svgPaths.p10b0bc00} fill="var(--fill-0, #DAF8FF)" id="Vector_2" />
              <path d={svgPaths.p264f8df0} fill="var(--fill-0, #DAF8FF)" id="Vector_3" />
              <path d={svgPaths.p22a34600} fill="var(--fill-0, #DAF8FF)" id="Vector_4" />
              <path d={svgPaths.p37981700} fill="var(--fill-0, #DAF8FF)" id="Vector_5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
type Helper3Props = {
  additionalClassNames?: string;
};

function Helper3({ additionalClassNames = "" }: Helper3Props) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 59.52 62.1795">
        <g id="Group 4868488">
          <path d={svgPaths.p5237a80} fill="var(--fill-0, #DAF8FF)" id="Vector" />
          <path d={svgPaths.p36d03500} fill="var(--fill-0, #DAF8FF)" id="Vector_2" />
          <path d={svgPaths.p1e5f4400} fill="var(--fill-0, #DAF8FF)" id="Vector_3" />
          <path d={svgPaths.p36409180} fill="var(--fill-0, #DAF8FF)" id="Vector_4" />
          <path d={svgPaths.p29e7bbc0} fill="var(--fill-0, #DAF8FF)" id="Vector_5" />
          <path d={svgPaths.p6c9ce70} fill="var(--fill-0, #DAF8FF)" id="Vector_6" />
          <path d={svgPaths.p2c751400} fill="var(--fill-0, #DAF8FF)" id="Vector_7" />
        </g>
      </svg>
    </div>
  );
}
type Helper2Props = {
  additionalClassNames?: string;
};

function Helper2({ additionalClassNames = "" }: Helper2Props) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52.0944 50.8145">
        <g id="Group 4868483">
          <path d={svgPaths.p2568b080} fill="var(--fill-0, #DAF8FF)" id="Vector" />
          <path d={svgPaths.p204fcff0} fill="var(--fill-0, #DAF8FF)" id="Vector_2" />
          <path d={svgPaths.p91a6900} fill="var(--fill-0, #DAF8FF)" id="Vector_3" />
          <path d={svgPaths.p35b07fd1} fill="var(--fill-0, #DAF8FF)" id="Vector_4" />
          <path d={svgPaths.p330cb8c0} fill="var(--fill-0, #DAF8FF)" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}
type Helper1Props = {
  additionalClassNames?: string;
};

function Helper1({ additionalClassNames = "" }: Helper1Props) {
  return (
    <Wrapper1 additionalClassNames={clsx("absolute", additionalClassNames)}>
      <g id="Group 4868491">
        <path d={svgPaths.p2344f9f0} fill="var(--fill-0, #DAF8FF)" id="Vector" />
        <path d={svgPaths.p3466c0c0} fill="var(--fill-0, #DAF8FF)" id="Vector_2" />
        <path d={svgPaths.p2cdcff80} fill="var(--fill-0, #DAF8FF)" id="Vector_3" />
        <path d={svgPaths.p23509d00} fill="var(--fill-0, #DAF8FF)" id="Vector_4" />
      </g>
    </Wrapper1>
  );
}
type HelperProps = {
  additionalClassNames?: string;
};

function Helper({ additionalClassNames = "" }: HelperProps) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 61.4456 71.8798">
        <g id="Group 4868485">
          <g id="Group 4868484">
            <path d={svgPaths.p33bd2530} fill="var(--fill-0, #DAF8FF)" id="Vector" />
            <path d={svgPaths.p362c1580} fill="var(--fill-0, #DAF8FF)" id="Vector_2" />
            <path d={svgPaths.p26f69500} fill="var(--fill-0, #DAF8FF)" id="Vector_3" />
          </g>
          <path d={svgPaths.p27773d80} fill="var(--fill-0, #DAF8FF)" id="Vector_4" />
          <path d={svgPaths.p2bfaf300} fill="var(--fill-0, #DAF8FF)" id="Vector_5" />
          <path d={svgPaths.p1c9ef800} fill="var(--fill-0, #DAF8FF)" id="Vector_6" />
          <path d={svgPaths.p3fdb2200} fill="var(--fill-0, #DAF8FF)" id="Vector_7" />
          <path d={svgPaths.p2d9fb800} fill="var(--fill-0, #DAF8FF)" id="Vector_8" />
          <path d={svgPaths.p251bfd00} fill="var(--fill-0, #DAF8FF)" id="Vector_9" />
          <path d={svgPaths.p2dac7400} fill="var(--fill-0, #DAF8FF)" id="Vector_10" />
          <path d={svgPaths.p1684f980} fill="var(--fill-0, #DAF8FF)" id="Vector_11" />
          <path d={svgPaths.p198f7770} fill="var(--fill-0, #DAF8FF)" id="Vector_12" />
          <path d={svgPaths.p167f3f00} fill="var(--fill-0, #DAF8FF)" id="Vector_13" />
          <path d={svgPaths.p33299e00} fill="var(--fill-0, #DAF8FF)" id="Vector_14" />
          <path d={svgPaths.p159d8f00} fill="var(--fill-0, #DAF8FF)" id="Vector_15" />
          <path d={svgPaths.p6ca5400} fill="var(--fill-0, #DAF8FF)" id="Vector_16" />
          <path d={svgPaths.p17fdddc0} fill="var(--fill-0, #DAF8FF)" id="Vector_17" />
          <path d={svgPaths.p14ba0d00} fill="var(--fill-0, #DAF8FF)" id="Vector_18" />
          <path d={svgPaths.p2ae8b8c0} fill="var(--fill-0, #DAF8FF)" id="Vector_19" />
        </g>
      </svg>
    </div>
  );
}
type DeviceStatubarWhiteBgProps = {
  className?: string;
  statusBar?: "White Bg" | "Black Elements" | "White Elements" | "Black BG";
};

function DeviceStatubarWhiteBg({ className, statusBar = "White Bg" }: DeviceStatubarWhiteBgProps) {
  const isBlackBgOrWhiteElements = ["Black BG", "White Elements"].includes(statusBar);
  const isBlackElements = statusBar === "Black Elements";
  return (
    <div className={className || `h-[26px] relative w-[360px] ${["Black Elements", "White Elements"].includes(statusBar) ? "" : statusBar === "Black BG" ? "bg-black" : "bg-white"}`}>
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between leading-[0] px-[18px] py-[10px] relative size-full">
          <div className={`flex flex-col font-["Roboto:Medium",sans-serif] font-medium justify-center relative shrink-0 text-[14px] whitespace-nowrap ${isBlackElements ? "text-[#272631]" : isBlackBgOrWhiteElements ? "text-white tracking-[0.14px]" : "text-[#1f1f1f] tracking-[0.14px]"}`} style={isBlackElements ? { fontVariationSettings: "'wdth' 100" } : { fontVariationSettings: "'wdth' 100", fontFeatureSettings: "'ss02', 'dlig', 'lnum', 'pnum'" }}>
            <p className="leading-[20px]">9:30</p>
          </div>
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="right icons">
            <DeviceStatubarWhiteBgHelper additionalClassNames="ml-0">
              <g id="Wifi">
                <g id="Path" />
                <g id="Rectangle" />
                <g id="Path_2" />
                <path d={svgPaths.p34567080} fill={isBlackElements ? "var(--fill-0, #95959D)" : isBlackBgOrWhiteElements ? "var(--fill-0, white)" : "var(--fill-0, #1F1F1F)"} id="Path_3" opacity={isBlackElements ? "0.5" : "0.3"} />
              </g>
            </DeviceStatubarWhiteBgHelper>
            <DeviceStatubarWhiteBgHelper additionalClassNames="ml-[34.78%]">
              <g id="Signal">
                <g id="Path" />
                <path d={svgPaths.p112c6500} fill={isBlackElements ? "var(--fill-0, #41404D)" : isBlackBgOrWhiteElements ? "var(--fill-0, white)" : "var(--fill-0, #1F1F1F)"} id="Path_2" />
              </g>
            </DeviceStatubarWhiteBgHelper>
            <div className="col-1 h-[15px] ml-[38px] mt-px relative row-1 w-[8px]" data-name="Battery">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 15">
                <g id="Battery">
                  <path d={svgPaths.p2dfd100} fill={isBlackElements ? "var(--fill-0, #95959D)" : isBlackBgOrWhiteElements ? "var(--fill-0, white)" : "var(--fill-0, #1F1F1F)"} fillOpacity={statusBar === "White Bg" ? "0.3" : undefined} id="Base" opacity={["Black BG", "Black Elements", "White Elements"].includes(statusBar) ? "0.3" : undefined} />
                  <path d={svgPaths.p2657cc00} fill={isBlackElements ? "var(--fill-0, #41404D)" : isBlackBgOrWhiteElements ? "var(--fill-0, white)" : "var(--fill-0, #1F1F1F)"} id="Charge" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Ai() {
  return (
    <div className="bg-[#f2fdff] relative size-full" data-name="AI">
      <div className="-translate-x-1/2 absolute h-[780px] left-1/2 overflow-clip top-0 w-[360px]" data-name="OBJECTS">
        <div className="absolute contents left-0 top-0">
          <Vector additionalClassNames="inset-[67.57%_83.74%_24.18%_2.66%]" />
          <Vector1 additionalClassNames="inset-[4.53%_84.33%_91.49%_0]" />
          <Vector2 additionalClassNames="inset-[30.43%_1.31%_65.56%_89.25%]" />
          <Vector3 additionalClassNames="inset-[48.12%_84.89%_48.37%_7.73%]" />
          <Helper11 additionalClassNames="inset-[29.42%_44.18%_66.26%_46.93%]" />
          <Vector4 additionalClassNames="inset-[26.69%_87.87%_70.19%_4.99%]" />
          <Vector5 additionalClassNames="inset-[45.17%_38.41%_51.42%_55.2%]" />
          <Helper additionalClassNames="inset-[0_34.4%_90.78%_48.53%]" />
          <Helper1 additionalClassNames="inset-[33.97%_61.63%_58.04%_18.4%]" />
          <Helper2 additionalClassNames="inset-[49.72%_56.73%_43.76%_28.8%]" />
          <Helper3 additionalClassNames="inset-[37.17%_13.34%_54.86%_70.13%]" />
          <Helper12 additionalClassNames="inset-[7.51%_-7.17%_84.5%_87.2%]" />
          <div className="absolute contents h-[112.941px] left-[216.46px] top-[114.24px] w-[112.043px]">
            <Helper4 additionalClassNames="left-[231.2px] top-[133.39px]" />
          </div>
          <Helper5 additionalClassNames="inset-[61.66%_59.45%_32.29%_23.73%]" />
          <Helper6 additionalClassNames="inset-[66.97%_2.94%_23.77%_80%]" />
          <Helper7 additionalClassNames="inset-[56.37%_23.95%_30.71%_59.73%]" />
          <Helper8 additionalClassNames="inset-[14.77%_51.81%_76.62%_41.6%]" />
          <Helper9 additionalClassNames="inset-[11.45%_77.11%_81.16%_9.33%]" />
          <Helper10 additionalClassNames="inset-[52.18%_-6.08%_39.57%_94.4%]" />
        </div>
        <div className="absolute contents right-[0.2px] top-[574px]">
          <Vector additionalClassNames="inset-[143.34%_90.96%_-51.58%_-4.56%]" />
          <Vector1 additionalClassNames="inset-[80.29%_91.55%_15.72%_-7.22%]" />
          <Vector2 additionalClassNames="inset-[106.19%_8.53%_-10.21%_82.02%]" />
          <Vector3 additionalClassNames="inset-[123.89%_92.11%_-27.4%_0.51%]" />
          <Helper11 additionalClassNames="inset-[105.18%_51.4%_-9.51%_39.71%]" />
          <Vector4 additionalClassNames="inset-[102.46%_95.1%_-5.58%_-2.23%]" />
          <Vector5 additionalClassNames="inset-[120.94%_45.63%_-24.35%_47.98%]" />
          <Helper additionalClassNames="inset-[73.59%_41.62%_17.19%_41.31%]" />
          <Helper1 additionalClassNames="inset-[109.74%_68.85%_-17.73%_11.18%]" />
          <Helper2 additionalClassNames="inset-[125.49%_63.95%_-32.01%_21.58%]" />
          <Helper3 additionalClassNames="inset-[112.94%_20.56%_-20.91%_62.91%]" />
          <Helper12 additionalClassNames="inset-[82.25%_0.05%_9.75%_79.98%]" />
          <div className="absolute contents h-[112.941px] left-[190.46px] top-[689.24px] w-[112.043px]">
            <Helper4 additionalClassNames="left-[205.21px] top-[708.39px]" />
          </div>
          <Helper5 additionalClassNames="inset-[137.43%_66.67%_-43.48%_16.51%]" />
          <Helper6 additionalClassNames="inset-[142.74%_10.17%_-52%_72.78%]" />
          <Helper7 additionalClassNames="inset-[132.14%_31.17%_-45.06%_52.51%]" />
          <Helper8 additionalClassNames="inset-[88.49%_59.04%_2.9%_34.38%]" />
          <Helper9 additionalClassNames="inset-[87.22%_84.33%_5.39%_2.11%]" />
          <Helper10 additionalClassNames="inset-[127.95%_1.14%_-36.2%_87.18%]" />
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[10px] items-start left-[16px] top-[76px] w-[328px]" data-name="Message">
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Received Message">
          <div className="content-stretch flex gap-[8px] items-end relative shrink-0" data-name="Component 1">
            <div className="bg-white content-stretch flex flex-col gap-[4px] items-end p-[12px] relative rounded-br-[16px] rounded-tl-[16px] rounded-tr-[16px] shrink-0 w-[265px]" data-name="Message Container">
              <div aria-hidden="true" className="absolute border border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-br-[16px] rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)]" />
              <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[0] relative shrink-0 text-[#41404d] text-[0px] text-[14px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                <span className="leading-[20px]">{`Welcome to Shaadi.com, `}</span>
                <span className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Pratik! 👋 😊
                </span>
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-end relative shrink-0 w-[310px]" data-name="Component 2">
            <div className="bg-white content-stretch flex flex-col gap-[4px] items-end p-[12px] relative rounded-br-[16px] rounded-tl-[16px] rounded-tr-[16px] shrink-0 w-[298px]" data-name="Message Container">
              <div aria-hidden="true" className="absolute border border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-br-[16px] rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)]" />
              <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#41404d] text-[14px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                Here are 5 handpicked Matches just for you.
              </p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[8px] items-end relative shrink-0" data-name="Component 4">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-[328px]">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[16px] items-center relative w-full">
                    <ProfileCard>
                      <div className="relative shrink-0 size-[200px]" data-name="Profile Image">
                        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgProfileImage} />
                      </div>
                      <ProfileInfo>
                        <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#41404d] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Sarita P
                        </p>
                        <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal items-start leading-[20px] relative shrink-0 text-[#72727d] text-[14px] text-ellipsis w-full whitespace-nowrap" data-name="Details">
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`26 yrs, 5'2", Kannada,`}</p>
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Brahmin - Smartha,
                          </p>
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Bengaluru, Karnataka
                          </p>
                        </div>
                        <Wrapper>
                          <div className="relative shrink-0 size-[16px]" data-name="IconMenu/Chat">
                            <div className="-translate-y-1/2 absolute h-[12px] left-[8.75%] right-[7.92%] top-1/2" data-name="Vector">
                              <div className="absolute inset-[-4.17%_-3.75%]">
                                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.3333 13">
                                  <path d={svgPaths.p33c12200} id="Vector" stroke="var(--stroke-0, #0AA4B8)" strokeLinejoin="round" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#0aa4b8] text-[14px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Shaadi Chat
                          </p>
                        </Wrapper>
                      </ProfileInfo>
                    </ProfileCard>
                    <ProfileCard>
                      <div className="relative shrink-0 size-[200px]" data-name="Profile Image">
                        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgProfileImage1} />
                      </div>
                      <ProfileInfo>
                        <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#41404d] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Ananya R
                        </p>
                        <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal items-start leading-[20px] relative shrink-0 text-[#72727d] text-[14px] text-ellipsis w-full whitespace-nowrap" data-name="Details">
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`25 years old, 5'3",`}</p>
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Brahmin,
                          </p>
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Mumbai, Maharashtra
                          </p>
                        </div>
                        <ActionText text="Connect Now">
                          <path d="M1 5.33334L4 8.33334L11 1" id="Vector" stroke="var(--stroke-0, #0AA4B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </ActionText>
                      </ProfileInfo>
                      <Frame2147223144PremiumTag />
                    </ProfileCard>
                    <ProfileCard>
                      <div className="relative shrink-0 size-[200px]" data-name="Profile Image">
                        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgProfileImage2} />
                      </div>
                      <ProfileInfo>
                        <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#41404d] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Priya S
                        </p>
                        <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal items-start leading-[20px] relative shrink-0 text-[#72727d] text-[14px] text-ellipsis w-full whitespace-nowrap" data-name="Details">
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`27 years old, 5'4",`}</p>
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Brahmin - Iyer,
                          </p>
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Mangaluru, Karnataka
                          </p>
                        </div>
                        <ActionText text="Connect Now">
                          <path d="M1 5.33334L4 8.33334L11 1" id="Vector" stroke="var(--stroke-0, #0AA4B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </ActionText>
                      </ProfileInfo>
                    </ProfileCard>
                    <ProfileCard>
                      <div className="relative shrink-0 size-[200px]" data-name="Profile Image">
                        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgProfileImage3} />
                      </div>
                      <ProfileInfo>
                        <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#41404d] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Neha T
                        </p>
                        <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal items-start leading-[20px] relative shrink-0 text-[#72727d] text-[14px] text-ellipsis w-full whitespace-nowrap" data-name="Details">
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`24 years old, 5'5",`}</p>
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Brahmin - Vadama,
                          </p>
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Udupi, Karnataka
                          </p>
                        </div>
                        <ActionText text="Connect Now">
                          <path d="M1 5.33334L4 8.33334L11 1" id="Vector" stroke="var(--stroke-0, #0AA4B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </ActionText>
                      </ProfileInfo>
                    </ProfileCard>
                    <ProfileCard>
                      <div className="relative shrink-0 size-[200px]" data-name="Profile Image">
                        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgProfileImage4} />
                      </div>
                      <ProfileInfo>
                        <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#41404d] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Lakshmi K
                        </p>
                        <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal items-start leading-[20px] relative shrink-0 text-[#72727d] text-[14px] text-ellipsis w-full whitespace-nowrap" data-name="Details">
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`29 years old, 5'6",`}</p>
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Brahmin
                          </p>
                          <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Bangalore, Karnataka
                          </p>
                        </div>
                        <ActionText text="Connect Now">
                          <path d="M1 5.33334L4 8.33334L11 1" id="Vector" stroke="var(--stroke-0, #0AA4B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </ActionText>
                      </ProfileInfo>
                      <Frame2147223144PremiumTag />
                    </ProfileCard>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Received Message">
          <div className="content-stretch flex gap-[8px] items-end relative shrink-0" data-name="Component 2">
            <div className="bg-white content-stretch flex flex-col gap-[8px] items-end p-[12px] relative rounded-br-[16px] rounded-tl-[16px] rounded-tr-[16px] shrink-0 w-[265px]" data-name="Message Container">
              <div aria-hidden="true" className="absolute border border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-br-[16px] rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)]" />
              <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#41404d] text-[14px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                Would like to Connect with Sarita and 4 more Matches?
              </p>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                <div className="bg-[#0aa4b8] relative rounded-[20px] shrink-0 w-full" data-name="Button">
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="content-stretch flex gap-[4px] items-center justify-center pl-[26px] pr-[32px] py-[10px] relative w-full">
                      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[14px] text-center text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Yes, Let’s Connect
                      </p>
                    </div>
                  </div>
                </div>
                <Button>
                  <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#0aa4b8] text-[14px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Show Me More
                  </p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeviceStatubarWhiteBg className="absolute h-[26px] left-0 top-0 w-[360px]" statusBar="Black Elements" />
      <div className="absolute left-0 top-0 w-[360px]" data-name="Top">
        <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
          <div className="bg-white h-[64px] relative shrink-0 w-full" data-name="Top app bar">
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex gap-[4px] items-center px-[16px] py-[8px] relative size-full">
                <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
                  <div className="relative shrink-0 size-[40px]" data-name="Sia 6">
                    <div className="absolute left-[1.82px] size-[36.363px] top-[1.82px]" data-name="Subtract">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36.3631 36.3631">
                        <g id="Subtract">
                          <path d={svgPaths.p1f875600} fill="var(--fill-0, #272631)" />
                          <path d={svgPaths.p1f875600} fill="url(#paint0_linear_10161_2127)" />
                        </g>
                        <defs>
                          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_10161_2127" x1="36.3562" x2="28.9662" y1="8.01841" y2="37.0872">
                            <stop stopColor="#FF4596" />
                            <stop offset="0.5" stopColor="#9472FA" />
                            <stop offset="1" stopColor="#0DD2F5" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Vector">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <path d={svgPaths.p3b0a2300} fill="var(--fill-0, white)" id="Vector" />
                      </svg>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative whitespace-pre-wrap">
                    <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[28px] relative shrink-0 text-[#272631] text-[20px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                      SIA
                    </p>
                    <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#95959d] text-[12px] tracking-[0.2px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`Your matchmaking companion `}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-[#f1f1f2] border-b border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}