import svgPaths from "./svg-qpoao03t1y";

export default function Button() {
  return (
    <div className="bg-gradient-to-b from-[#ddbb5c] from-[33.936%] relative rounded-[9999px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.08),0px_3px_14px_0px_rgba(0,0,0,0.06),0px_5px_5px_0px_rgba(0,0,0,0.06)] size-full to-[#cfa230]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[3px] items-center justify-center pl-[26px] pr-[32px] py-[10px] relative size-full">
          <div className="relative shrink-0 size-[20px]" data-name="Icons/Connect_24px">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
              <g id="Vector" />
            </svg>
            <div className="absolute bottom-[21.17%] left-[16.67%] right-[16.67%] top-1/4" data-name="Shape">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 10.7667">
                <path d={svgPaths.p207bdb00} fill="var(--fill-0, #523B00)" id="Shape" />
              </svg>
            </div>
          </div>
          <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#523b00] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Connect Now
          </p>
        </div>
      </div>
    </div>
  );
}