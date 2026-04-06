import imgPratik from "figma:asset/48e008728bee7339289715457d6d06f3c3e511db.png";
import imgPratikAvatar from "figma:asset/cd5b516c2295b9ad81ec9bea0b10ec52461afc56.png";

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="absolute h-[450px] left-0 top-0 w-[360px]" data-name="Pratik">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPratik} />
      </div>
      <div className="absolute left-[389px] size-[64px] top-0" data-name="Pratik_avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPratikAvatar} />
      </div>
    </div>
  );
}