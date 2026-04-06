import svgPaths from "./svg-kf1s4e0cp5";

function IconSystemPhoto() {
  return (
    <div className="absolute h-[25px] left-[19px] top-[12px] w-[24px]" data-name="Icon/System/ Photo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 25">
        <g id="Icon/System/ Photo">
          <path d={svgPaths.p3e1e7900} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p237acf00} id="Vector_2" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p15ab9d80} id="Vector_3" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function IconSystemPhoto1() {
  return (
    <div className="absolute left-[59px] size-[24px] top-[12.5px]" data-name="Icon/System/ Photo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/System/ Photo">
          <path clipRule="evenodd" d={svgPaths.p12622680} fill="var(--fill-0, #41404D)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative size-full">
      <IconSystemPhoto />
      <IconSystemPhoto1 />
    </div>
  );
}