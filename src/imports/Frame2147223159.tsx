import clsx from "clsx";
import svgPaths from "./svg-ikwpgt9q2o";
import imgShutterstock20216324664 from "figma:asset/fc5510955d0557485252c8f6ea1d31f990fb90da.png";
import imgShutterstock1956730281 from "figma:asset/9afd46bf9b75c5f5802a0bb764c0c87e22defa61.png";
import imgShutterstock10539682103 from "figma:asset/42412153b870feb52042f07ef6198b62ba172691.png";
import imgProfilePhotoFemale07 from "figma:asset/be32c0563b593b887c3838d5fda43eb86c85246f.png";
import imgProfilePhotoFemale8 from "figma:asset/7d433ee03b4766485525595b2c8b54df105d24d4.png";
type Frame1707480681ProfilePhotoFemaleProps = {
  additionalClassNames?: string;
};

function Frame1707480681ProfilePhotoFemale({ children, additionalClassNames = "" }: React.PropsWithChildren<Frame1707480681ProfilePhotoFemaleProps>) {
  return (
    <div className={clsx("bg-white mr-[-12px] relative rounded-[58.824px] shrink-0 size-[40px]", additionalClassNames)}>
      <div className="overflow-clip relative rounded-[inherit] size-full">{children}</div>
      <div aria-hidden="true" className="absolute border-[1.429px] border-solid border-white inset-0 pointer-events-none rounded-[58.824px] shadow-[0px_0.871px_5.225px_0px_rgba(0,0,0,0.08),0px_1.742px_3.483px_0px_rgba(0,0,0,0.06),0px_0.871px_4.354px_0px_rgba(0,0,0,0.06)]" />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative rounded-[16px] size-full">
      <div className="content-stretch flex flex-col gap-[12px] items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        <div className="content-stretch flex isolate items-center justify-center pr-[12px] relative shrink-0">
          <Frame1707480681ProfilePhotoFemale additionalClassNames="z-[6]">
            <div className="absolute inset-[0_-30%_0_-20%]" data-name="shutterstock_2021632466 4">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgShutterstock20216324664} />
            </div>
          </Frame1707480681ProfilePhotoFemale>
          <Frame1707480681ProfilePhotoFemale additionalClassNames="z-[5]">
            <div className="absolute inset-[0_-30.5%_-1%_-21%]" data-name="shutterstock_195673028 1">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgShutterstock1956730281} />
            </div>
          </Frame1707480681ProfilePhotoFemale>
          <Frame1707480681ProfilePhotoFemale additionalClassNames="z-[4]">
            <div className="absolute inset-[-3.5%_-34%_-47.5%_-49.5%]" data-name="shutterstock_1053968210 3">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgShutterstock10539682103} />
            </div>
          </Frame1707480681ProfilePhotoFemale>
          <div className="mr-[-12px] relative rounded-[58.824px] shrink-0 size-[40px] z-[3]" data-name="Profile Photo/Female_07">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[58.824px] size-full" src={imgProfilePhotoFemale07} />
            <div className="overflow-clip rounded-[inherit] size-full" />
            <div aria-hidden="true" className="absolute border-[1.429px] border-solid border-white inset-0 pointer-events-none rounded-[58.824px] shadow-[0px_0.871px_5.225px_0px_rgba(0,0,0,0.08),0px_1.742px_3.483px_0px_rgba(0,0,0,0.06),0px_0.871px_4.354px_0px_rgba(0,0,0,0.06)]" />
          </div>
          <div className="mr-[-12px] relative rounded-[58.824px] shrink-0 size-[40px] z-[2]" data-name="Profile Photo/Female_07">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[58.824px] size-full" src={imgProfilePhotoFemale8} />
            <div className="overflow-clip rounded-[inherit] size-full" />
            <div aria-hidden="true" className="absolute border-[1.429px] border-solid border-white inset-0 pointer-events-none rounded-[58.824px] shadow-[0px_0.871px_5.225px_0px_rgba(0,0,0,0.08),0px_1.742px_3.483px_0px_rgba(0,0,0,0.06),0px_0.871px_4.354px_0px_rgba(0,0,0,0.06)]" />
          </div>
        </div>
        <div className="content-stretch flex gap-[3px] items-start justify-center relative shrink-0">
          <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#0aa4b8] text-[14px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
            View 5 More
          </p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icons/arrow_forward_24px">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <g id="Group">
                <g id="Vector" />
                <path clipRule="evenodd" d={svgPaths.p20fde180} fill="var(--fill-0, #1395AE)" fillRule="evenodd" id="Mask" />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)]" />
    </div>
  );
}