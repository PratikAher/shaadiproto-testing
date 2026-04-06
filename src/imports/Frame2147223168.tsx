import svgPaths from "./svg-5gq4uxh03u";

function IconAiRetry() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Icon/AI/Retry">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
        <g id="Icon/AI/Retry">
          <path d={svgPaths.p200fd400} fill="var(--fill-0, #41404D)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function SiaFloatingActionButtonFill() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[4px] h-[28px] items-center justify-center left-[176px] pl-[9px] pr-[10px] py-[8px] rounded-[100px] top-[89px]" data-name="SIA_FloatingActionButtonFill">
      <div aria-hidden="true" className="absolute border-[#ff5a60] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <IconAiRetry />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#41404d] text-[12px] tracking-[0.2px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Retry
      </p>
    </div>
  );
}

function Sia() {
  return (
    <div className="absolute left-[39px] size-[88px] top-[48px]" data-name="Sia 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 88 88">
        <g id="Sia 1">
          <g id="Subtract">
            <path d={svgPaths.p32da7d00} fill="var(--fill-0, #272631)" />
            <path d={svgPaths.p32da7d00} fill="url(#paint0_linear_8012_20638)" />
          </g>
          <path d={svgPaths.p234cda80} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8012_20638" x1="83.9842" x2="67.7262" y1="21.641" y2="85.5923">
            <stop stopColor="#FF4596" />
            <stop offset="0.5" stopColor="#9472FA" />
            <stop offset="1" stopColor="#0DD2F5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function IconAiEdit() {
  return (
    <div className="absolute left-[159px] size-[32px] top-[23px]" data-name="Icon/AI/Edit">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon/AI/Edit">
          <path d={svgPaths.p1680f680} fill="var(--fill-0, #41404D)" id="vector" />
        </g>
      </svg>
    </div>
  );
}

function IconAiRetry1() {
  return (
    <div className="absolute left-[203px] size-[32px] top-[23px]" data-name="Icon/AI/Retry">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon/AI/Retry">
          <path d={svgPaths.p102f0010} fill="var(--fill-0, #41404D)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative size-full">
      <SiaFloatingActionButtonFill />
      <Sia />
      <div className="absolute h-[28px] left-[43px] top-[171px] w-[69px]" style={{ backgroundImage: "linear-gradient(157.913deg, rgb(255, 90, 96) 5.0007%, rgb(204, 122, 255) 36.25%, rgb(0, 148, 255) 77.5%, rgb(0, 188, 213) 120%)" }} />
      <div className="absolute h-[28px] left-[150px] top-[171px] w-[69px]" style={{ backgroundImage: "linear-gradient(157.913deg, rgb(255, 112, 122) 5.0007%, rgb(217, 145, 255) 36.25%, rgb(51, 173, 255) 77.5%, rgb(47, 224, 245) 120%)" }} />
      <IconAiEdit />
      <IconAiRetry1 />
    </div>
  );
}