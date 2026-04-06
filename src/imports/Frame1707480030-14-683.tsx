import svgPaths from "./svg-03qh4gm9qh";

function FilterStroke() {
  return (
    <div className="absolute left-[4px] size-[24px] top-[5px]" data-name="Filter Stroke">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Filter Stroke">
          <path d={svgPaths.p149f6700} id="Rectangle 6667346" stroke="var(--stroke-0, #41404D)" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function FilterFilled() {
  return (
    <div className="absolute left-[33px] size-[24px] top-[5px]" data-name="Filter Filled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Filter Filled">
          <path d={svgPaths.p2046b280} fill="var(--fill-0, #41404D)" id="Rectangle 6667346" />
        </g>
      </svg>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative size-full">
      <FilterStroke />
      <FilterFilled />
    </div>
  );
}