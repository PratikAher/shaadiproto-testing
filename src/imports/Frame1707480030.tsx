import svgPaths from "./svg-scn6adx9ht";

function IconHamburger() {
  return (
    <div className="absolute left-[17px] size-[24px] top-[166px]" data-name="Icon-Hamburger">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon-Hamburger">
          <path d="M4 5H20" id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M4 12H20" id="Vector_2" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M4 19H20" id="Vector_3" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function IconHamburger1() {
  return (
    <div className="absolute left-[95px] size-[24px] top-[166px]" data-name="Icon-Hamburger">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon-Hamburger">
          <path clipRule="evenodd" d={svgPaths.pf113c00} fill="var(--fill-0, #41404D)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p3a38f780} fill="var(--fill-0, #41404D)" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p2ecee280} fill="var(--fill-0, #41404D)" fillRule="evenodd" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function IconSystemNotification() {
  return (
    <div className="absolute left-[17px] size-[24px] top-[92px]" data-name="Icon/System/Notification">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/System/Notification">
          <path d={svgPaths.p5631c00} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p24333600} id="Vector_2" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function IconSystemNotification1() {
  return (
    <div className="absolute left-[95px] size-[24px] top-[92px]" data-name="Icon/System/Notification">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/System/Notification">
          <path d={svgPaths.p1ff6c200} fill="var(--fill-0, #41404D)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function IconSystemSearch() {
  return (
    <div className="absolute left-[17px] size-[24px] top-[18px]" data-name="Icon/System/Search">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/System/Search">
          <path d="M17 17L21 21" id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3ac10b00} id="Vector_2" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function IconSystemSearch1() {
  return (
    <div className="absolute left-[95px] size-[24px] top-[18px]" data-name="Icon/System/Search">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/System/Search">
          <path clipRule="evenodd" d={svgPaths.p1845a800} fill="var(--fill-0, #41404D)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative size-full">
      <IconHamburger />
      <IconHamburger1 />
      <IconSystemNotification />
      <IconSystemNotification1 />
      <IconSystemSearch />
      <IconSystemSearch1 />
    </div>
  );
}