import svgPaths from "./svg-8biddavakc";

export default function Vip() {
  return (
    <div className="bg-[#5b318b] content-stretch flex gap-[3px] items-center justify-center px-[8px] py-[4px] relative rounded-[1000px] size-full" data-name="VIP">
      <div className="relative shrink-0 size-[13px]" data-name="crown-03-solid-rounded (1) 2">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
          <g id="crown-03-solid-rounded (1) 2">
            <path clipRule="evenodd" d={svgPaths.p19187500} fill="var(--fill-0, white)" fillOpacity="0.9" fillRule="evenodd" id="Vector" />
            <path d={svgPaths.p6f02d80} fill="var(--fill-0, white)" fillOpacity="0.9" id="Vector_2" />
          </g>
        </svg>
      </div>
      <div className="flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[14px] justify-center leading-[0] relative shrink-0 text-[12px] text-shadow-[0px_2px_5px_rgba(0,0,0,0.06),0px_1px_11px_rgba(0,0,0,0.06),0px_4px_8px_rgba(0,0,0,0.08)] text-white tracking-[0.2px] w-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[16px] whitespace-pre-wrap">VIP</p>
      </div>
    </div>
  );
}