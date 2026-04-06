import svgPaths from "./svg-43hk8t3qfw";

function IconSystemBack() {
  return (
    <div className="absolute left-[12px] size-[24px] top-[7px]" data-name="Icon/System/Back">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/System/Back">
          <path d={svgPaths.p3e687ec0} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M4 12H20" id="Vector_2" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function IconSystemBack1() {
  return (
    <div className="absolute left-[54px] size-[24px] top-[7px]" data-name="Icon/System/Back">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/System/Back">
          <path d={svgPaths.p3e687ec0} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M4 12H20" id="Vector_2" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative size-full">
      <IconSystemBack />
      <IconSystemBack1 />
    </div>
  );
}