import svgPaths from "./svg-g7g6khwjyf";

function IconSystemBlueTick() {
  return (
    <div className="absolute left-[48px] size-[24px] top-[7px]" data-name="Icon/System/Blue Tick">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/System/Blue Tick">
          <path d={svgPaths.p23214400} fill="var(--fill-0, #0094FF)" id="Vector" stroke="var(--stroke-0, white)" strokeWidth="1.5" />
          <path d={svgPaths.p32b6b9a0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconSystemBlueTick1() {
  return (
    <div className="absolute left-[9px] size-[24px] top-[7px]" data-name="Icon/System/Blue Tick">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/System/Blue Tick">
          <path d={svgPaths.p23214400} id="Vector" stroke="var(--stroke-0, #0094FF)" strokeWidth="1.5" />
          <path d={svgPaths.p32b6b9a0} id="Vector_2" stroke="var(--stroke-0, #0094FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative size-full">
      <IconSystemBlueTick />
      <IconSystemBlueTick1 />
    </div>
  );
}