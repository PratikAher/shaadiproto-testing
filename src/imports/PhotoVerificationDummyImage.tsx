import imgPhotoVerificationDummyImage from "figma:asset/6bbde89936d233c2211e11df68bf016b303b28a5.png";

export default function PhotoVerificationDummyImage() {
  return (
    <div className="relative size-full" data-name="Photo verification dummy image.">
      <div className="absolute h-[248px] left-0 top-0 w-[186px]" data-name="Photo verification dummy image.">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPhotoVerificationDummyImage} />
      </div>
    </div>
  );
}