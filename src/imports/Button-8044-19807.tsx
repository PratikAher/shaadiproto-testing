import svgPaths from "./svg-vpsohqxhfz";

function Text() {
  return (
    <div className="absolute h-[15.997px] left-[27.99px] overflow-clip top-[3.99px] w-[250.823px]" data-name="Text">
      <p className="absolute font-['Roboto:Light',sans-serif] font-light leading-[16px] left-0 text-[12px] text-[rgba(255,255,255,0.9)] top-[calc(50%-8px)] tracking-[0.2px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Hi Shreya, I came across your profile ...
      </p>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[15.997px] left-[286.81px] top-[3.99px] w-[21.289px]" data-name="Text">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[16px] left-0 text-[12px] text-[rgba(255,255,255,0.85)] top-[calc(50%-8px)] tracking-[0.2px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Edit
      </p>
    </div>
  );
}

function Container() {
  return <div className="absolute h-[24.983px] left-[-0.5px] rounded-[12px] top-[-0.5px] w-[317.096px]" data-name="Container" />;
}

function Icon() {
  return (
    <div className="h-[11.994px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[3.85%_3.49%]" data-name="Vector">
        <div className="absolute inset-[-3.97%_-3.94%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.0359 11.9501">
            <path d={svgPaths.p24798f00} id="Vector" stroke="var(--stroke-0, white)" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="0.878658" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[8px] size-[11.994px] top-[5.99px]" data-name="Container">
      <Icon />
    </div>
  );
}

export default function Button() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] border-[0.5px] border-[rgba(255,255,255,0.2)] border-solid relative rounded-[14px] size-full" data-name="Button">
      <Text />
      <Text1 />
      <Container />
      <Container1 />
    </div>
  );
}