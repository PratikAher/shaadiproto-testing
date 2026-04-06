import svgPaths from "./svg-ozsve112my";

function IconAiEdit() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Icon/AI/Edit">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
        <g id="Icon/AI/Edit">
          <path d={svgPaths.p1dad1af0} fill="var(--fill-0, #41404D)" id="vector" />
        </g>
      </svg>
    </div>
  );
}

export default function SiaFloatingActionButtonFill() {
  return (
    <div className="bg-white content-stretch flex gap-[4px] items-center justify-center pl-[9px] pr-[10px] py-[8px] relative rounded-[100px] size-full" data-name="SIA_FloatingActionButtonFill">
      <div aria-hidden="true" className="absolute border-[#ff5a60] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <IconAiEdit />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#41404d] text-[12px] tracking-[0.2px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Write with SIA
      </p>
    </div>
  );
}