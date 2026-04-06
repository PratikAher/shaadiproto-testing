import svgPaths from "./svg-sz0246xf93";

function IconProfileContact() {
  return (
    <div className="absolute left-[13px] size-[24px] top-[11px]" data-name="Icon/Profile/Contact">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Profile/Contact">
          <path d={svgPaths.p6595080} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function IconProfileContact1() {
  return (
    <div className="absolute left-[49px] size-[24px] top-[11px]" data-name="Icon/Profile/Contact">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Profile/Contact">
          <path d={svgPaths.p10eef480} fill="var(--fill-0, #41404D)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative size-full">
      <IconProfileContact />
      <IconProfileContact1 />
    </div>
  );
}