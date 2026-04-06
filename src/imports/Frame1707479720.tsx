import svgPaths from "./svg-tb2n69jmrm";

function Frame2() {
  return (
    <div className="h-[86.222px] relative w-[76.307px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76.3067 86.2224">
        <g id="Frame 1707479729">
          <path d={svgPaths.p145b2780} fill="url(#paint0_radial_4057_1742)" id="Ellipse 8696" />
          <path d={svgPaths.p30ca4400} fill="var(--fill-0, #BDBDBD)" id="Vector 2" />
          <path d={svgPaths.p3ee66f80} fill="url(#paint1_radial_4057_1742)" id="Ellipse 8697" />
          <path d={svgPaths.p1b388580} fill="url(#paint2_radial_4057_1742)" id="Vector 3" />
          <ellipse cx="54.7511" cy="24.358" fill="var(--fill-0, #BDBDBD)" id="Ellipse 8698" rx="2.58667" ry="3.66444" />
          <ellipse cx="21.5556" cy="24.358" fill="var(--fill-0, #BDBDBD)" id="Ellipse 8699" rx="2.58667" ry="3.66444" />
        </g>
        <defs>
          <radialGradient cx="0" cy="0" gradientTransform="translate(38.1533 63.5891) rotate(90) scale(22.6333 38.1533)" gradientUnits="userSpaceOnUse" id="paint0_radial_4057_1742" r="1">
            <stop stopColor="#969696" />
            <stop offset="1" stopColor="#5A5A5A" />
          </radialGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(38.3689 24.358) rotate(90.7066) scale(17.479 19.1252)" gradientUnits="userSpaceOnUse" id="paint1_radial_4057_1742" r="1">
            <stop offset="0.766417" stopColor="#BDBDBD" />
            <stop offset="1" stopColor="#9F9F9F" />
          </radialGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(37.7222 8.62244) rotate(90) scale(14.0111 19.6694)" gradientUnits="userSpaceOnUse" id="paint2_radial_4057_1742" r="1">
            <stop stopColor="#2C2C2C" />
            <stop offset="1" stopColor="#4F4F4F" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

function ProfilePhotoMale() {
  return (
    <div className="opacity-65 overflow-clip relative rounded-[56px] size-[90px]" data-name="Profile Photo/Male_01">
      <div className="absolute flex h-[76.307px] items-center justify-center left-[-10.57px] top-[6.35px] w-[86.222px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#f1f1f2] relative rounded-[100px] shrink-0 size-[90px]">
      <div className="absolute flex items-center justify-center left-0 size-[90px] top-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <ProfilePhotoMale />
        </div>
      </div>
    </div>
  );
}

function AddIconContainer() {
  return (
    <div className="-translate-x-1/2 absolute bottom-[-22px] left-1/2 size-[36px]" data-name="Add Icon Container">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="Add Icon Container">
          <path d={svgPaths.p76f2200} fill="var(--fill-0, white)" />
          <circle cx="18" cy="18" fill="var(--fill-0, white)" id="Ellipse 47" r="13" />
          <g id="Icon/System/Add-circle-solid-rounded">
            <path d={svgPaths.p2191a180} fill="var(--fill-0, #00BCD5)" id="Vector" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function AvatarContainer() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Avatar Container">
      <Frame />
      <AddIconContainer />
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-center p-[6px] relative rounded-[250px] size-full overflow-visible">
      <div aria-hidden="true" className="absolute border border-[#dfe0e3] border-dashed inset-0 pointer-events-none rounded-[250px]" />
      <AvatarContainer />
    </div>
  );
}