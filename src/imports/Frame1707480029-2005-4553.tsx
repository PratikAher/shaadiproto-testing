import svgPaths from "./svg-mp7s5jko5o";

function IconSystemNavigation() {
  return (
    <div className="absolute left-[18px] size-[24px] top-[66px]" data-name="Icon/System/Navigation">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/System/Navigation">
          <path d={svgPaths.p33276c70} id="Vector" stroke="var(--stroke-0, #41404D)" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function IconSystemNavigation1() {
  return (
    <div className="absolute left-[74px] size-[24px] top-[68px]" data-name="Icon/System/Navigation">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/System/Navigation">
          <path d={svgPaths.p33276c70} fill="var(--fill-0, #41404D)" id="Vector" stroke="var(--stroke-0, #41404D)" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function IconProfileAstro() {
  return (
    <div className="absolute left-[18px] size-[24px] top-[14px]" data-name="Icon/Profile/Astro">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Profile/Astro">
          <path d={svgPaths.p783700} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2f186783} id="Vector_2" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function IconProfileAstro1() {
  return (
    <div className="absolute left-[74px] size-[24px] top-[10px]" data-name="Icon/Profile/Astro">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Profile/Astro">
          <path d={svgPaths.pe6eb80} fill="var(--fill-0, #41404D)" id="Vector" />
          <path d={svgPaths.p2b182000} fill="var(--fill-0, #41404D)" id="Vector_2" />
          <path d={svgPaths.pf60b100} fill="var(--fill-0, #41404D)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative size-full">
      <IconSystemNavigation />
      <IconSystemNavigation1 />
      <IconProfileAstro />
      <IconProfileAstro1 />
    </div>
  );
}