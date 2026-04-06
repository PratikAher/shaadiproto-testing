import svgPaths from "./svg-7o18xmjk8i";

export default function NavigationBar() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Navigation bar">
      <div className="bg-white h-[74px] relative shrink-0 w-full" data-name="Text box">
        <div className="content-stretch flex flex-col items-start px-[12px] py-[13px] relative size-full">
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Icon">
            <div className="bg-[#f9f9fb] relative rounded-[100px] shrink-0 size-[40px]" data-name="Icon">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip p-[7px] relative rounded-[inherit] size-full">
                <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/System/Add">
                  <div className="absolute inset-[16.67%_16.66%_16.66%_16.67%]" data-name="Vector">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.002 16.0019">
                      <path d={svgPaths.p1c338900} fill="var(--fill-0, #41404D)" id="Vector" />
                    </svg>
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-[100px]" />
            </div>
            <div className="bg-[#f9f9fb] flex-[1_0_0] h-[48px] min-h-px min-w-px relative rounded-[100px]" data-name="Input">
              <div aria-hidden="true" className="absolute border border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-[100px]" />
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[10px] items-center pl-[14px] pr-[8px] py-[16px] relative size-full">
                  <div className="flex flex-[1_0_0] flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#95959d] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <p className="leading-[24px]">Type a message</p>
                  </div>
                  <div className="bg-[#0aa4b8] content-stretch flex items-center justify-center pb-[4px] pl-[4px] pr-[8px] pt-[8px] relative rounded-[100px] shrink-0" data-name="Send button icon">
                    <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Icon/Chat/Sent">
                      <div className="absolute inset-[4.17%_6.24%_6.24%_4.17%]" data-name="Vector">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.918 17.918">
                          <path d={svgPaths.p39128400} fill="var(--fill-0, white)" id="Vector" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}