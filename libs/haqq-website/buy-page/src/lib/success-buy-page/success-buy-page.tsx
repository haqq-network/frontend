import { PageTitle } from '@haqq/haqq-website-ui-kit';

export function SuccessBuyPage() {
  return (
    <section>
      <PageTitle title="Buy crypto" />
      <div className="bg-haqq-black flex flex-col items-center px-[48px] py-[160px] text-center sm:px-[63px] lg:px-[79px]">
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M32.0677 10.226L14.2678 30.5687L5.94922 21.3258L8.30298 19.2075L14.2344 25.7979L29.6845 8.14069L32.0677 10.226Z"
            fill="#01B26E"
          />
        </svg>
        <div className="font-clash mt-[12px] text-[20px] leading-[26px] text-[#01b26e]">
          The operation was successful
        </div>
        <div className="mt-[8px] text-[12px] leading-[18px] text-white/50">
          Now you can close this page
        </div>
      </div>
    </section>
  );
}
