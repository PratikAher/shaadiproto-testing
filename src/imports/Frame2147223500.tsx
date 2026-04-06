import imgPratik from "figma:asset/7c4407219d08f9337334922964d5ffa55e379ee9.png";

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="absolute h-[450px] left-0 top-0 w-[360px]" data-name="Pratik">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[142.22%] left-0 max-w-none top-[-21.11%] w-full" src={imgPratik} />
        </div>
      </div>
      <div className="absolute left-[394.13px] size-[64px] top-0" data-name="Pratik_avatar">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[224.8%] left-[-20.16%] max-w-none top-[-44.21%] w-[126.45%]" src={imgPratik} />
        </div>
      </div>
    </div>
  );
}