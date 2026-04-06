import svgPaths from "./svg-unyd39tp2z";

function SiaBg() {
  return (
    <div className="absolute left-[13px] size-[88px] top-[19px]" data-name="SIA bg">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 88 88">
        <g id="SIA bg">
          <path d={svgPaths.p178ac180} fill="url(#paint0_linear_8027_12853)" id="Union" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8027_12853" x1="0.000721727" x2="100.001" y1="0.000739036" y2="100.001">
            <stop stopColor="#FF5A60" />
            <stop offset="0.33" stopColor="#CC7AFF" />
            <stop offset="0.66" stopColor="#0094FF" />
            <stop offset="1" stopColor="#00BCD5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function SiaStar() {
  return (
    <div className="absolute left-[13px] size-[35.2px] top-[127px]" data-name="SIA star">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.2 35.2">
        <g id="SIA star">
          <path d={svgPaths.p20747d80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-[#1e1e1e] relative size-full">
      <SiaBg />
      <SiaStar />
    </div>
  );
}