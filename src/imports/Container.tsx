import svgPaths from "./svg-4xjmmghtl6";
import imgAvatarImageNew from "figma:asset/c2194421b72d1343d484b0230ac79be121da23bd.png";

function Container2() {
  return <div className="bg-[#e4e4e7] h-[3.995px] rounded-[17509800px] shrink-0 w-[39.994px]" data-name="Container" />;
}

function Container1() {
  return (
    <div className="h-[19.985px] relative shrink-0 w-[360.066px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center pr-[0.008px] pt-[11.994px] relative size-full">
        <Container2 />
      </div>
    </div>
  );
}

function AvatarImageNew() {
  return (
    <div className="relative shrink-0 size-[64px]" data-name="Avatar image New">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAvatarImageNew} />
    </div>
  );
}

function Frame() {
  return (
    <div className="relative rounded-[5332.801px] shrink-0">
      <div className="content-stretch flex items-center overflow-clip relative rounded-[inherit]">
        <AvatarImageNew />
      </div>
      <div aria-hidden="true" className="absolute border-[0.533px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[5332.801px]" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 text-center w-full">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[28px] overflow-hidden relative shrink-0 text-[#41404d] text-[20px] text-ellipsis w-full whitespace-nowrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Connect with Radhika
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#72727d] text-[14px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        First messages matter. Make it personal.
      </p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[8px] items-center left-[calc(50%-0.03px)] top-[35.39px] w-[328px]">
      <Frame />
      <Frame1 />
    </div>
  );
}

function IconsConnect24Px() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons/Connect_24px">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icons/Connect_24px">
          <path d={svgPaths.p2f553b00} fill="var(--fill-0, white)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex gap-[3px] h-[48px] items-center justify-center left-[0.01px] px-[16px] py-[10px] rounded-[66px] top-[377.39px] w-[320px]" data-name="Button" style={{ backgroundImage: "linear-gradient(-6.59229deg, rgb(10, 164, 184) 13.336%, rgb(9, 191, 108) 85.792%)" }}>
      <IconsConnect24Px />
      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[16px] text-white" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Connect With Message
      </p>
    </div>
  );
}

function Paragraph() {
  return <div className="absolute h-[15.394px] left-0 top-[402.26px] w-[320.08px]" data-name="Paragraph" />;
}

function IconSystemArrowLeft() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon/System/ArrowLeft">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon/System/ArrowLeft">
          <path d="M12.5 5L7.5 10.0001L12.5 15" id="Vector" stroke="var(--stroke-0, #72727D)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="16" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function IconSystemArrowRight() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon/System/Arrow Right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon/System/Arrow Right">
          <path d="M7.50004 5L12.5 10L7.5 15" id="Vector" stroke="var(--stroke-0, #B1B3B9)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="16" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function InputWithIconContainer() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end p-[6px] relative rounded-[220px] shrink-0" data-name="Input with Icon Container">
      <IconSystemArrowLeft />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#72727d] text-[12px] tracking-[0.2px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        2/2
      </p>
      <IconSystemArrowRight />
    </div>
  );
}

function IconAiEdit() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Icon/AI/Edit">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
        <g id="Icon/AI/Edit">
          <path d={svgPaths.p1dad1af0} fill="var(--fill-0, #41404D)" id="vector" />
        </g>
      </svg>
    </div>
  );
}

function SiaFloatingActionButtonFill() {
  return (
    <div className="bg-white content-stretch flex gap-[4px] h-[32px] items-center justify-center pl-[9px] pr-[10px] py-[8px] relative rounded-[100px] shrink-0" data-name="SIA_FloatingActionButtonFill">
      <div aria-hidden="true" className="absolute border-[#ff5a60] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <IconAiEdit />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#41404d] text-[12px] tracking-[0.2px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Write with SIA
      </p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <InputWithIconContainer />
      <SiaFloatingActionButtonFill />
    </div>
  );
}

function DashBlink() {
  return (
    <div className="-translate-y-1/2 absolute h-[16px] left-[13px] top-[calc(50%-57px)] w-[2px]" data-name="dash_blink">
      <div className="absolute bg-[#00bcd5] h-[16px] left-0 top-0 w-[1.4px]" />
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-[#f9f9fb] content-stretch flex flex-col gap-[10px] h-[164px] items-end justify-end left-[0.01px] pb-[12px] pl-[14px] pr-[12px] pt-[14px] rounded-[16px] top-[173.39px] w-[320px]" data-name="Input">
      <div aria-hidden="true" className="absolute border border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="flex-[1_0_0] font-['Roboto:Regular',sans-serif] font-normal leading-[24px] min-h-px min-w-px relative text-[#95959d] text-[16px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Say something nice...
      </p>
      <Frame3 />
      <DashBlink />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[3px] items-center justify-center left-[249.01px] px-[6px] py-[2px] rounded-[6px] top-[342.39px]">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#95959d] text-[10px] text-center tracking-[0.2px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        3 credits left
      </p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[3px] items-center justify-center left-[0.01px] px-[6px] py-[2px] rounded-[6px] top-[342.39px]">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#95959d] text-[10px] text-center tracking-[0.2px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        240/700
      </p>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[450.147px] relative shrink-0 w-full" data-name="Container">
      <Frame4 />
      <Button />
      <Paragraph />
      <p className="-translate-x-1/2 absolute font-['Roboto:Regular',sans-serif] font-normal leading-[15.4px] left-[160.3px] text-[#95959d] text-[11px] text-center top-[432.39px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Your note personalizes for each profile automatically
      </p>
      <Input />
      <Frame2 />
      <Frame5 />
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[360.066px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip px-[19.993px] relative rounded-[inherit] size-full">
        <Container4 />
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-tl-[28px] rounded-tr-[28px] size-full" data-name="Container">
      <Container1 />
      <Container3 />
    </div>
  );
}