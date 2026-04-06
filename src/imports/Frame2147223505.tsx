import imgFemale17 from "figma:asset/9e33756e6f359f29a85dd5427d523e284180440e.png";

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="absolute h-[450px] left-0 top-0 w-[360px]" data-name="Female17">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[106.21%] left-0 max-w-none top-[-3.1%] w-full" src={imgFemale17} />
        </div>
      </div>
      <div className="absolute left-0 size-[64px] top-[487px]" data-name="Female Avatar17">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[159.37%] left-[-10.58%] max-w-none top-[-8.33%] w-[120.05%]" src={imgFemale17} />
        </div>
      </div>
    </div>
  );
}