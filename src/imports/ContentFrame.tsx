import svgPaths from "./svg-817z8sta4g";
import imgAvatarImageNew from "figma:asset/59dc65d03dd1f8e742cd8bee01c5dd6c8323a731.png";
import imgAvatarImageNew1 from "figma:asset/6a5de3d06000c07cdf34224adb4289f7e3d8f353.png";
import imgAvatarImageNew2 from "figma:asset/be32c0563b593b887c3838d5fda43eb86c85246f.png";
import imgAvatarImageNew3 from "figma:asset/8827eb092c2a9fd7d7000a4920f6b6a8c49e4dd6.png";
import imgAvatarImageNew4 from "figma:asset/c2194421b72d1343d484b0230ac79be121da23bd.png";

function ProfileInfoContainer1CombinedShape({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute inset-[13.5%_9%_0.1%_9%]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 49.2 51.8385">
        {children}
      </svg>
    </div>
  );
}

function CombinedShape({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute inset-[13.5%_9%_0.1%_9%]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44.28 46.6547">
        {children}
      </svg>
    </div>
  );
}

function Wrapper2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="overflow-clip relative rounded-[inherit] size-full">
      <div className="absolute bg-white inset-0 overflow-clip" data-name="Avatar image Old">
        {children}
      </div>
    </div>
  );
}

function Wrapper1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="overflow-clip relative rounded-[100px] shrink-0 size-[54px]">
      <div className="absolute left-0 rounded-[8999.1px] size-[54px] top-0" data-name="Avatar image New">
        {children}
      </div>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center size-full">
      <div className="content-stretch flex gap-[12px] items-center relative w-full">{children}</div>
    </div>
  );
}

function MessageHeader1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 w-[328px]">
      <Wrapper>{children}</Wrapper>
    </div>
  );
}

function ProfileImageContainer({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="overflow-clip relative rounded-[100px] shrink-0 size-[60px]" data-name="Profile Photo Thumbnail Female">
        <div className="absolute left-0 rounded-[9999px] size-[60px] top-0" data-name="Avatar image New">
          {children}
        </div>
      </div>
      <div className="absolute bottom-[4px] right-[3.28px] size-[12px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <circle cx="6" cy="6" fill="var(--fill-0, #0ED279)" id="Online" r="5.5" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
    </div>
  );
}

function ProfilePhotoThumbnailFemaleImage1() {
  return (
    <Wrapper1>
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8999.1px] size-full" src={imgAvatarImageNew3} />
    </Wrapper1>
  );
}

function ProfileAvatarThumbnailFemale() {
  return (
    <div className="relative rounded-[111.111px] shrink-0 size-[54px]">
      <Wrapper2>
        <CombinedShape>
          <path d={svgPaths.pb2d0bf0} fill="var(--fill-0, white)" id="Combined-Shape" />
        </CombinedShape>
        <CombinedShape>
          <path clipRule="evenodd" d={svgPaths.p1fcd9400} fill="var(--fill-0, #FFDAD8)" fillRule="evenodd" id="Combined-Shape" />
        </CombinedShape>
      </Wrapper2>
      <div aria-hidden="true" className="absolute border-0 border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-[111.111px]" />
    </div>
  );
}

function ProfilePhotoThumbnailFemaleImage() {
  return (
    <Wrapper1>
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8999.1px] size-full" src={imgAvatarImageNew1} />
    </Wrapper1>
  );
}
type MessageTextContainerText2Props = {
  text: string;
};

function MessageTextContainerText2({ text }: MessageTextContainerText2Props) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="flex-[1_0_0] font-['Roboto:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px overflow-hidden relative text-[#72727d] text-[14px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type MessageTextContainerText1Props = {
  text: string;
};

function MessageTextContainerText1({ text }: MessageTextContainerText1Props) {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <p className="flex-[1_0_0] font-['Roboto:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px overflow-hidden relative text-[#72727d] text-[14px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
      <ButtonText text="Reply" />
    </div>
  );
}
type SenderInfoText1Props = {
  text: string;
};

function SenderInfoText1({ text }: SenderInfoText1Props) {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[2px] items-center min-h-px min-w-px relative">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[24px] overflow-hidden relative shrink-0 text-[#41404d] text-[16px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type MessageTextContainerTextProps = {
  text: string;
};

function MessageTextContainerText({ text }: MessageTextContainerTextProps) {
  return (
    <div className="content-stretch flex gap-[10px] h-[28px] items-center relative shrink-0 w-full">
      <p className="flex-[1_0_0] font-['Roboto:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px overflow-hidden relative text-[#72727d] text-[14px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
      <UnreadCountContainerText text="1" />
    </div>
  );
}
type MessageTimeContainerTextProps = {
  text: string;
};

function MessageTimeContainerText({ text }: MessageTimeContainerTextProps) {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <p className="col-1 font-['Roboto:Regular',sans-serif] font-normal leading-[16px] ml-0 mt-0 relative row-1 text-[#72727d] text-[12px] text-right tracking-[0.2px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type SenderInfoTextProps = {
  text: string;
};

function SenderInfoText({ text }: SenderInfoTextProps) {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[2px] items-center min-h-px min-w-px relative">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[24px] overflow-hidden relative shrink-0 text-[#41404d] text-[16px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
      <IconSystemBlueTick className="overflow-clip relative shrink-0 size-[16px]" size="xs (16)" type="Fill" />
    </div>
  );
}

function MessageHeaderVector1() {
  return (
    <div className="absolute inset-[12.5%]">
      <div className="absolute inset-[-4.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
          <path d={svgPaths.p9cd1880} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
type MessageHeaderVectorProps = {
  additionalClassNames?: string;
};

function MessageHeaderVector({ additionalClassNames = "" }: MessageHeaderVectorProps) {
  return (
    <div className={additionalClassNames}>
      <div className="absolute inset-[-12.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
          <path d={svgPaths.p92aa270} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
type ButtonTextProps = {
  text: string;
};

function ButtonText({ text }: ButtonTextProps) {
  return (
    <div className="content-stretch flex h-[28px] items-center justify-center px-[16px] py-[10px] relative rounded-[100px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#0aa4b8] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#0aa4b8] text-[12px] text-center tracking-[0.2px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type UnreadCountContainerTextProps = {
  text: string;
};

function UnreadCountContainerText({ text }: UnreadCountContainerTextProps) {
  return (
    <div className="bg-[#0ed279] content-stretch flex flex-col items-center justify-center relative rounded-[100px] shrink-0 size-[24px]">
      <div className="flex flex-col font-['Roboto:Bold',sans-serif] font-bold justify-center leading-[0] overflow-hidden relative shrink-0 text-[16px] text-center text-ellipsis text-white w-full whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[24px] overflow-hidden">{text}</p>
      </div>
    </div>
  );
}
type IconSystemBlueTickProps = {
  className?: string;
  size?: "lg (32)" | "md (24)" | "sm (20)" | "xs (16)";
  type?: "Line" | "Fill";
};

function IconSystemBlueTick({ className, size = "lg (32)", type = "Line" }: IconSystemBlueTickProps) {
  const isLg32AndIsFillOrLine = size === "lg (32)" && ["Fill", "Line"].includes(type);
  const isLineAndIsXs16OrSm20OrMd24OrLg32 = type === "Line" && ["xs (16)", "sm (20)", "md (24)", "lg (32)"].includes(size);
  const isMd24AndIsFillOrLine = size === "md (24)" && ["Fill", "Line"].includes(type);
  const isSm20AndIsFillOrLine = size === "sm (20)" && ["Fill", "Line"].includes(type);
  return (
    <div className={className || `relative ${isLg32AndIsFillOrLine ? "size-[32px]" : isMd24AndIsFillOrLine ? "size-[24px]" : isSm20AndIsFillOrLine ? "size-[20px]" : "size-[16px]"}`}>
      <div className={`absolute ${isLg32AndIsFillOrLine ? "left-[3.33px] size-[25.333px] top-[3.33px]" : isMd24AndIsFillOrLine ? "left-[2.5px] size-[19px] top-[2.5px]" : isSm20AndIsFillOrLine ? "left-[2.08px] size-[15.833px] top-[2.08px]" : "left-[1.67px] size-[12.667px] top-[1.67px]"}`} data-name="Vector">
        <div className="absolute inset-[-7.89%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={isLg32AndIsFillOrLine ? "0 0 29.3333 29.3333" : isMd24AndIsFillOrLine ? "0 0 22 22" : isSm20AndIsFillOrLine ? "0 0 18.3333 18.3333" : "0 0 14.6667 14.6667"}>
            <path d={isLg32AndIsFillOrLine ? svgPaths.p361ad700 : isMd24AndIsFillOrLine ? svgPaths.p9deb400 : isSm20AndIsFillOrLine ? svgPaths.p250fad00 : svgPaths.p3d3c00} fill={type === "Fill" && ["xs (16)", "sm (20)", "md (24)", "lg (32)"].includes(size) ? "var(--fill-0, #0094FF)" : undefined} id="Vector" stroke={isLineAndIsXs16OrSm20OrMd24OrLg32 ? "var(--stroke-0, #0094FF)" : "var(--stroke-0, white)"} strokeWidth={isLg32AndIsFillOrLine ? "2" : isMd24AndIsFillOrLine ? "1.5" : isSm20AndIsFillOrLine ? "1.25" : undefined} />
          </svg>
        </div>
      </div>
      <div className={`absolute ${isLg32AndIsFillOrLine ? "h-[5.867px] left-[11.73px] top-[12.93px] w-[8.533px]" : isMd24AndIsFillOrLine ? "h-[4.4px] left-[8.8px] top-[9.7px] w-[6.4px]" : isSm20AndIsFillOrLine ? "h-[3.667px] left-[7.33px] top-[8.08px] w-[5.333px]" : "h-[2.933px] left-[5.87px] top-[6.47px] w-[4.267px]"}`} data-name="Vector">
        <div className="absolute inset-[-22.73%_-15.63%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={isLg32AndIsFillOrLine ? "0 0 11.1999 8.53327" : isMd24AndIsFillOrLine ? "0 0 8.39995 6.39995" : isSm20AndIsFillOrLine ? "0 0 6.99996 5.33329" : "0 0 5.59997 4.26663"}>
            <path d={isLg32AndIsFillOrLine ? svgPaths.p427e280 : isMd24AndIsFillOrLine ? svgPaths.p22ab8040 : isSm20AndIsFillOrLine ? svgPaths.p2ca61e60 : svgPaths.p2a4d2180} id="Vector" stroke={isLineAndIsXs16OrSm20OrMd24OrLg32 ? "var(--stroke-0, #0094FF)" : "var(--stroke-0, white)"} strokeLinecap="round" strokeLinejoin="round" strokeWidth={isLg32AndIsFillOrLine ? "2.66667" : isMd24AndIsFillOrLine ? "2" : isSm20AndIsFillOrLine ? "1.66667" : "1.33333"} />
          </svg>
        </div>
      </div>
    </div>
  );
}
type IconBottomNavChatProps = {
  className?: string;
  size?: "lg (32)" | "md (24)" | "sm (20)" | "xs (16)";
  type?: "Line" | "Fill";
};

function IconBottomNavChat({ className, size = "lg (32)", type = "Line" }: IconBottomNavChatProps) {
  const isFillAndMd24 = type === "Fill" && size === "md (24)";
  const isFillAndSm20 = type === "Fill" && size === "sm (20)";
  const isFillAndXs16 = type === "Fill" && size === "xs (16)";
  const isLineAndMd24 = type === "Line" && size === "md (24)";
  const isLineAndSm20 = type === "Line" && size === "sm (20)";
  const isLineAndXs16 = type === "Line" && size === "xs (16)";
  return (
    <div className={className || `relative ${size === "xs (16)" && ["Line", "Fill"].includes(type) ? "size-[16px]" : size === "sm (20)" && ["Line", "Fill"].includes(type) ? "size-[20px]" : size === "md (24)" && ["Line", "Fill"].includes(type) ? "size-[24px]" : "size-[32px]"}`}>
      {type === "Line" && ["lg (32)", "md (24)", "sm (20)", "xs (16)"].includes(size) && (
        <div className={`-translate-y-1/2 absolute left-[8.75%] right-[7.92%] top-1/2 ${isLineAndXs16 ? "h-[12px]" : isLineAndSm20 ? "h-[15px]" : isLineAndMd24 ? "h-[18px]" : "h-[24px]"}`} data-name="Vector">
          <div className="absolute inset-[-4.17%_-3.75%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={isLineAndXs16 ? "0 0 14.3333 13" : isLineAndSm20 ? "0 0 17.9167 16.25" : isLineAndMd24 ? "0 0 21.5 19.5" : "0 0 28.6667 26"}>
              <path d={isLineAndXs16 ? svgPaths.p33c12200 : isLineAndSm20 ? svgPaths.p35f6a100 : isLineAndMd24 ? svgPaths.p24910c00 : svgPaths.p32a69b80} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinejoin="round" strokeWidth={isLineAndSm20 ? "1.25" : isLineAndMd24 ? "1.5" : type === "Line" && size === "lg (32)" ? "2" : undefined} />
            </svg>
          </div>
        </div>
      )}
      {type === "Fill" && ["lg (32)", "md (24)", "sm (20)", "xs (16)"].includes(size) && (
        <div className={`-translate-y-1/2 absolute left-[5.62%] top-1/2 ${isFillAndXs16 ? "h-[13px] right-[4.8%]" : isFillAndSm20 ? "h-[16.25px] right-[4.79%]" : isFillAndMd24 ? "h-[19.5px] right-[4.79%]" : "h-[26px] right-[4.79%]"}`} data-name="Subtract">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox={isFillAndXs16 ? "0 0 14.333 12.9999" : isFillAndSm20 ? "0 0 17.918 16.2499" : isFillAndMd24 ? "0 0 21.5 19.5001" : "0 0 28.667 25.9996"}>
            <path d={isFillAndXs16 ? svgPaths.p3420d40 : isFillAndSm20 ? svgPaths.p287f2200 : isFillAndMd24 ? svgPaths.p2e6cc600 : svgPaths.pbc27e00} fill="var(--fill-0, #41404D)" id="Subtract" />
          </svg>
        </div>
      )}
    </div>
  );
}
type MessageHeaderProps = {
  className?: string;
  propertyType?: "Default" | "Incoming Call" | "Missed Call" | "Outgoing Call" | "Online" | "Unread count" | "Reply" | "Full Message";
};

function MessageHeader({ className, propertyType = "Default" }: MessageHeaderProps) {
  const isFullMessage = propertyType === "Full Message";
  const isIncomingCall = propertyType === "Incoming Call";
  const isMissedCall = propertyType === "Missed Call";
  const isOnline = propertyType === "Online";
  const isOutgoingCall = propertyType === "Outgoing Call";
  const isReply = propertyType === "Reply";
  const isUnreadCount = propertyType === "Unread count";
  const isUnreadCountOrReplyOrFullMessage = ["Unread count", "Reply", "Full Message"].includes(propertyType);
  return (
    <div className={className || "relative w-[328px]"}>
      <Wrapper>
        <Wrapper1>
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8999.1px] size-full" src={imgAvatarImageNew} />
        </Wrapper1>
        {["Default", "Unread count", "Reply", "Full Message"].includes(propertyType) && (
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px py-[16px] relative" data-name="Message Content">
            <div aria-hidden="true" className="absolute border-[#dfe0e3] border-b border-solid inset-0 pointer-events-none" />
            <div className={`content-stretch flex items-center relative shrink-0 w-full ${isFullMessage ? "justify-between" : "gap-[8px]"}`} data-name="Message Header">
              <div className="content-stretch flex flex-[1_0_0] gap-[2px] items-center min-h-px min-w-px relative" data-name="Sender Info">
                <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[24px] overflow-hidden relative shrink-0 text-[#41404d] text-[16px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  {isFullMessage ? "Neha Y" : isReply ? "Shweeta T" : isUnreadCount ? "Priya N" : "Aarti P"}
                </p>
                {["Default", "Unread count"].includes(propertyType) && <IconSystemBlueTick className="overflow-clip relative shrink-0 size-[16px]" size="xs (16)" type="Fill" />}
              </div>
              <div className={`content-stretch flex flex-col items-end relative shrink-0 ${isUnreadCountOrReplyOrFullMessage ? "w-[53px]" : ""}`} data-name="Message Time Container">
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Message Time Container">
                  <p className={`col-1 font-["Roboto:Regular",sans-serif] font-normal leading-[16px] ml-0 mt-0 relative row-1 text-[12px] text-right tracking-[0.2px] whitespace-nowrap ${isUnreadCountOrReplyOrFullMessage ? "text-[#72727d]" : "text-[#00b860]"}`} style={{ fontVariationSettings: "'wdth' 100" }}>
                    {isFullMessage ? "21 Jul" : ["Unread count", "Reply"].includes(propertyType) ? "Yesterday" : "6 hours ago"}
                  </p>
                </div>
              </div>
            </div>
            <div className={`content-stretch flex items-center relative shrink-0 w-full ${isFullMessage ? "" : isReply ? "gap-[10px]" : isUnreadCount ? "gap-[10px] h-[28px]" : "h-[28px]"}`} data-name="Message Text Container">
              <p className="flex-[1_0_0] font-['Roboto:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px overflow-hidden relative text-[#72727d] text-[14px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                {isFullMessage ? "Hello, We liked your profile and it seems to be a good match. Please accept our request to take this forward." : isReply ? "Are you available to talk now?" : isUnreadCount ? "Hi... How are you?" : "Hi"}
              </p>
              {isUnreadCount && <UnreadCountContainerText text="1" />}
              {isReply && <ButtonText text="Reply" />}
            </div>
          </div>
        )}
        {["Incoming Call", "Outgoing Call", "Online", "Missed Call"].includes(propertyType) && (
          <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-h-px min-w-px py-[16px] relative">
            <div aria-hidden="true" className="absolute border-[#dfe0e3] border-b border-solid inset-0 pointer-events-none" />
            <div className={`content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative ${isOnline ? "gap-[2px]" : ""}`} data-name="Message Content">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Message Header">
                <div className="content-stretch flex flex-[1_0_0] gap-[2px] items-center min-h-px min-w-px relative" data-name="Sender Info">
                  <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[24px] overflow-hidden relative shrink-0 text-[#41404d] text-[16px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Neha Y
                  </p>
                  {isOnline && <IconSystemBlueTick className="overflow-clip relative shrink-0 size-[16px]" size="xs (16)" type="Fill" />}
                </div>
              </div>
              <div className={`content-stretch flex relative shrink-0 w-full ${isOnline ? 'flex-col font-["Roboto:Regular",sans-serif] font-normal items-start leading-[16px] text-[#72727d] text-[12px] text-ellipsis tracking-[0.2px] whitespace-nowrap' : "gap-[4px] items-center"}`} data-name="Message Text Container">
                {isIncomingCall && (
                  <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon/Chat/Call Incoming">
                    <MessageHeaderVector additionalClassNames="absolute inset-[12.5%_12.5%_62.5%_62.5%]" />
                    <MessageHeaderVector1 />
                  </div>
                )}
                {["Incoming Call", "Online"].includes(propertyType) && (
                  <p className={`overflow-hidden relative ${isOnline ? "shrink-0 w-full" : 'flex-[1_0_0] font-["Roboto:Regular",sans-serif] font-normal leading-[20px] min-h-px min-w-px text-[#72727d] text-[14px] text-ellipsis whitespace-nowrap'}`} style={{ fontVariationSettings: "'wdth' 100" }}>
                    {isOnline ? "27 yrs, 5’ 2”" : isIncomingCall ? "24.28 mins, Jun 21" : ""}
                  </p>
                )}
                {isOutgoingCall && (
                  <>
                    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon/Chat/Call Outgoiing">
                      <div className="absolute flex inset-[12.5%_12.5%_62.5%_62.5%] items-center justify-center">
                        <div className="flex-none rotate-180 size-[4px]">
                          <MessageHeaderVector additionalClassNames="relative size-full" />
                        </div>
                      </div>
                      <MessageHeaderVector1 />
                    </div>
                    <p className="flex-[1_0_0] font-['Roboto:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px overflow-hidden relative text-[#72727d] text-[14px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Outgoing, May 31
                    </p>
                  </>
                )}
                {isOnline && (
                  <p className="overflow-hidden relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Kannada, Bangalore
                  </p>
                )}
                {isMissedCall && (
                  <>
                    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon/Chat/Call Missed">
                      <div className="absolute bottom-[58.33%] left-[54.17%] right-[12.5%] top-1/4" data-name="Vector">
                        <div className="absolute inset-[-18.75%_-9.37%]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.33333 3.66667">
                            <path d={svgPaths.p285f8700} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                      <MessageHeaderVector1 />
                    </div>
                    <p className="flex-[1_0_0] font-['Roboto:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px overflow-hidden relative text-[#e53a41] text-[14px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Missed (8), June 18
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="content-stretch flex items-center justify-center p-[8px] relative shrink-0" data-name="state-layer">
              {["Incoming Call", "Outgoing Call", "Missed Call"].includes(propertyType) && (
                <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Chat/Call">
                  <div className="absolute inset-[12.5%]" data-name="Vector">
                    <div className="absolute inset-[-4.17%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.4999 19.5">
                        <path d={svgPaths.p334c9180} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              {isOnline && (
                <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Chat/Video Call">
                  <div className="absolute inset-[16.67%_29.17%_16.67%_8.33%]" data-name="Vector">
                    <div className="absolute inset-[-4.69%_-5%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 17.5">
                        <path d={svgPaths.p12433580} id="Vector" stroke="var(--stroke-0, #41404D)" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute inset-[27.08%_8.33%_27.08%_70.83%]" data-name="Vector">
                    <div className="absolute inset-[-6.83%_-15%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.50002 12.502">
                        <path d={svgPaths.p240827b0} id="Vector" stroke="var(--stroke-0, #41404D)" strokeLinecap="round" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {isOnline && (
              <div className="content-stretch flex items-center justify-center p-[8px] relative shrink-0" data-name="state-layer">
                <IconBottomNavChat className="relative shrink-0 size-[24px]" size="md (24)" />
              </div>
            )}
          </div>
        )}
      </Wrapper>
    </div>
  );
}

export default function ContentFrame() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] items-start justify-center p-[16px] relative size-full" data-name="Content Frame">
      <div className="content-stretch flex gap-[20px] items-center relative shrink-0" data-name="Profile Container">
        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-name="Profile Info Container">
          <ProfileImageContainer>
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[9999px] size-full" src={imgAvatarImageNew} />
          </ProfileImageContainer>
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] min-w-full overflow-hidden relative shrink-0 text-[#72727d] text-[12px] text-center text-ellipsis tracking-[0.2px] w-[min-content] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Mansi A
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-name="Profile Info Container">
          <div className="relative rounded-[100px] shrink-0 size-[60px]" data-name="Profile Avatar Thumbnail Female">
            <Wrapper2>
              <ProfileInfoContainer1CombinedShape>
                <path d={svgPaths.pe619f70} fill="var(--fill-0, white)" id="Combined-Shape" />
              </ProfileInfoContainer1CombinedShape>
              <ProfileInfoContainer1CombinedShape>
                <path clipRule="evenodd" d={svgPaths.p2fe51970} fill="var(--fill-0, #FFDAD8)" fillRule="evenodd" id="Combined-Shape" />
              </ProfileInfoContainer1CombinedShape>
            </Wrapper2>
            <div aria-hidden="true" className="absolute border border-[#f1f1f2] border-solid inset-[-0.5px] pointer-events-none rounded-[100.5px]" />
          </div>
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] min-w-full overflow-hidden relative shrink-0 text-[#72727d] text-[12px] text-center text-ellipsis tracking-[0.2px] w-[min-content] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Mansi A
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-name="Profile Info Container">
          <ProfileImageContainer>
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[9999px] size-full" src={imgAvatarImageNew1} />
          </ProfileImageContainer>
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] min-w-full overflow-hidden relative shrink-0 text-[#72727d] text-[12px] text-center text-ellipsis tracking-[0.2px] w-[min-content] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Mansi A
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-name="Profile Info Container">
          <ProfileImageContainer>
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[9999px] size-full" src={imgAvatarImageNew2} />
          </ProfileImageContainer>
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] min-w-full overflow-hidden relative shrink-0 text-[#72727d] text-[12px] text-center text-ellipsis tracking-[0.2px] w-[min-content] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Mansi A
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-name="Profile Info Container">
          <ProfileImageContainer>
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[9999px] size-full" src={imgAvatarImageNew3} />
          </ProfileImageContainer>
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] min-w-full overflow-hidden relative shrink-0 text-[#72727d] text-[12px] text-center text-ellipsis tracking-[0.2px] w-[min-content] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Mansi A
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-name="Profile Info Container">
          <ProfileImageContainer>
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[9999px] size-full" src={imgAvatarImageNew4} />
          </ProfileImageContainer>
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] min-w-full overflow-hidden relative shrink-0 text-[#72727d] text-[12px] text-center text-ellipsis tracking-[0.2px] w-[min-content] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Mansi A
          </p>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-[328px]" data-name="Message Container">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Message Container">
          <MessageHeader className="relative shrink-0 w-[328px]" />
          <MessageHeader1>
            <ProfilePhotoThumbnailFemaleImage />
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px py-[16px] relative" data-name="Message Content">
              <div aria-hidden="true" className="absolute border-[#dfe0e3] border-b border-solid inset-0 pointer-events-none" />
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Message Header">
                <SenderInfoText text="Priya N" />
                <div className="content-stretch flex flex-col items-end relative shrink-0 w-[53px]" data-name="Message Time Container">
                  <MessageTimeContainerText text="Yesterday" />
                </div>
              </div>
              <MessageTextContainerText text="Hi... How are you?" />
            </div>
          </MessageHeader1>
          <MessageHeader1>
            <ProfileAvatarThumbnailFemale />
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px py-[16px] relative" data-name="Message Content">
              <div aria-hidden="true" className="absolute border-[#dfe0e3] border-b border-solid inset-0 pointer-events-none" />
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Message Header">
                <SenderInfoText1 text="Shweeta T" />
                <div className="content-stretch flex flex-col items-end relative shrink-0 w-[53px]" data-name="Message Time Container">
                  <MessageTimeContainerText text="Yesterday" />
                </div>
              </div>
              <MessageTextContainerText1 text="Are you available to talk now?" />
            </div>
          </MessageHeader1>
          <MessageHeader1>
            <ProfilePhotoThumbnailFemaleImage1 />
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px py-[16px] relative" data-name="Message Content">
              <div aria-hidden="true" className="absolute border-[#dfe0e3] border-b border-solid inset-0 pointer-events-none" />
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Message Header">
                <SenderInfoText1 text="Neha Y" />
                <div className="content-stretch flex flex-col items-end relative shrink-0 w-[53px]" data-name="Message Time Container">
                  <MessageTimeContainerText text="21 Jul" />
                </div>
              </div>
              <MessageTextContainerText2 text="Hello, We liked your profile and it seems to be a good match. Please accept our request to take this forward." />
            </div>
          </MessageHeader1>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Message Container">
        <MessageHeader className="relative shrink-0 w-[328px]" />
        <MessageHeader1>
          <ProfilePhotoThumbnailFemaleImage />
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px py-[16px] relative" data-name="Message Content">
            <div aria-hidden="true" className="absolute border-[#dfe0e3] border-b border-solid inset-0 pointer-events-none" />
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Message Header">
              <SenderInfoText text="Priya N" />
              <div className="content-stretch flex flex-col items-end relative shrink-0 w-[53px]" data-name="Message Time Container">
                <MessageTimeContainerText text="Yesterday" />
              </div>
            </div>
            <MessageTextContainerText text="Hi... How are you?" />
          </div>
        </MessageHeader1>
        <MessageHeader1>
          <ProfileAvatarThumbnailFemale />
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px py-[16px] relative" data-name="Message Content">
            <div aria-hidden="true" className="absolute border-[#dfe0e3] border-b border-solid inset-0 pointer-events-none" />
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Message Header">
              <SenderInfoText1 text="Shweeta T" />
              <div className="content-stretch flex flex-col items-end relative shrink-0 w-[53px]" data-name="Message Time Container">
                <MessageTimeContainerText text="Yesterday" />
              </div>
            </div>
            <MessageTextContainerText1 text="Are you available to talk now?" />
          </div>
        </MessageHeader1>
        <MessageHeader1>
          <ProfilePhotoThumbnailFemaleImage1 />
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px py-[16px] relative" data-name="Message Content">
            <div aria-hidden="true" className="absolute border-[#dfe0e3] border-b border-solid inset-0 pointer-events-none" />
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Message Header">
              <SenderInfoText1 text="Neha Y" />
              <div className="content-stretch flex flex-col items-end relative shrink-0 w-[53px]" data-name="Message Time Container">
                <MessageTimeContainerText text="21 Jul" />
              </div>
            </div>
            <MessageTextContainerText2 text="Hello, We liked your profile and it seems to be a good match. Please accept our request to take this forward." />
          </div>
        </MessageHeader1>
      </div>
    </div>
  );
}