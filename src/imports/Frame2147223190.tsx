import svgPaths from "./svg-inhm1ntcrk";

function Icon() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.5%_7.91%_12.5%_8.76%]" data-name="Vector">
        <div className="absolute inset-[-4.17%_-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.75 9.75001">
            <path d={svgPaths.pdcde400} id="Vector" stroke="var(--stroke-0, white)" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="0.75" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 size-[12px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Frame() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[3px] items-center relative w-full">
        <Container />
        <p className="flex-[1_0_0] font-['Roboto:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px overflow-hidden relative text-[12px] text-[rgba(255,255,255,0.7)] text-center text-ellipsis tracking-[0.2px] whitespace-nowrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
          Hey Shena! Something about your profile really stood out to...
        </p>
      </div>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex gap-[7.999px] items-center px-[8.522px] py-[4.522px] relative rounded-[12px] size-full">
      <div aria-hidden="true" className="absolute border-[0.522px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Frame />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#26d0ce] text-[12px] text-center tracking-[0.2px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Edit
      </p>
    </div>
  );
}