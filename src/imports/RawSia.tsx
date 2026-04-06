import svgPaths from "./svg-4b22t52yoi";

function SiaBg() {
  return (
    <div className="absolute left-[13px] size-[88px] top-[19px]" data-name="SIA bg">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 88 88">
        <g id="SIA bg">
          <path d={svgPaths.p178ac180} fill="var(--fill-0, white)" id="Union" />
        </g>
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

export default function RawSia() {
  return (
    <div className="bg-[#1e1e1e] relative size-full" data-name="raw sia">
      <SiaBg />
      <SiaStar />
    </div>
  );
}