import { Heading, AboveTitle } from '@haqq/website/ui-kit';

function SideLines({ className }: { className?: string }) {
  return (
    <svg
      width="80"
      height="599"
      viewBox="0 0 80 599"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line y1="19.5" x2="80" y2="19.5" stroke="#0D0D0E" strokeOpacity="0.24" />
      <line
        y1="50.5557"
        x2="40"
        y2="50.5557"
        stroke="#0D0D0E"
        strokeOpacity="0.3"
      />
      <line
        y1="81.6111"
        x2="40"
        y2="81.6111"
        stroke="#0D0D0E"
        strokeOpacity="0.4"
      />
      <line
        y1="112.667"
        x2="40"
        y2="112.667"
        stroke="#0D0D0E"
        strokeOpacity="0.5"
      />
      <line
        y1="143.722"
        x2="40"
        y2="143.722"
        stroke="#0D0D0E"
        strokeOpacity="0.6"
      />
      <line
        y1="174.778"
        x2="40"
        y2="174.778"
        stroke="#0D0D0E"
        strokeOpacity="0.7"
      />
      <line
        y1="205.833"
        x2="40"
        y2="205.833"
        stroke="#0D0D0E"
        strokeOpacity="0.8"
      />
      <line
        y1="236.889"
        x2="40"
        y2="236.889"
        stroke="#0D0D0E"
        strokeOpacity="0.9"
      />
      <line y1="267.944" x2="40" y2="267.944" stroke="#0D0D0E" />
      <line y1="299" x2="80" y2="299" stroke="#0D0D0E" />
      <line y1="330.056" x2="40" y2="330.056" stroke="#0D0D0E" />
      <line y1="361.111" x2="40" y2="361.111" stroke="#0D0D0E" />
      <line
        y1="392.167"
        x2="40"
        y2="392.167"
        stroke="#0D0D0E"
        strokeOpacity="0.8"
      />
      <line
        y1="423.222"
        x2="40"
        y2="423.222"
        stroke="#0D0D0E"
        strokeOpacity="0.7"
      />
      <line
        y1="454.278"
        x2="40"
        y2="454.278"
        stroke="#0D0D0E"
        strokeOpacity="0.6"
      />
      <line
        y1="485.333"
        x2="40"
        y2="485.333"
        stroke="#0D0D0E"
        strokeOpacity="0.5"
      />
      <line
        y1="516.389"
        x2="40"
        y2="516.389"
        stroke="#0D0D0E"
        strokeOpacity="0.4"
      />
      <line
        y1="547.444"
        x2="40"
        y2="547.444"
        stroke="#0D0D0E"
        strokeOpacity="0.3"
      />
      <line
        y1="578.5"
        x2="80"
        y2="578.5"
        stroke="#0D0D0E"
        strokeOpacity="0.24"
      />
    </svg>
  );
}

export function MissionBlock() {
  return (
    <div className="bg-white text-haqq-black px-[16px] sm:px-[63px] lg:pl-[79px] lg:pr-[80px] h-[326px] sm:h-[464px] lg:h-[600px] flex flex-col items-center justify-center relative snap-start">
      <AboveTitle className="text-[#A4A4A4] mb-[16px] sm:mb-[24px]">
        Mission
      </AboveTitle>
      <div className="text-center mx-[44px] sm:max-w-xs lg:max-w-3xl">
        <Heading level={2} className="">
          Crypto has lost its path – <nobr>grid-driven</nobr> practices in
          crypto prevent mass adoption. HAQQ's mission is to make Web3 projects
          accessible to everyone.
        </Heading>
      </div>

      <SideLines className="absolute top-0 left-[16px] sm:left-[63px] lg:left-[80px] h-full w-auto" />
      <SideLines className="absolute top-0 right-[16px] sm:right-[63px] lg:right-[80px] h-full w-auto scale-x-[-1]" />
    </div>
  );
}
