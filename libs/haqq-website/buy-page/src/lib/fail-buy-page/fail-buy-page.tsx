import { PageTitle } from '@haqq/haqq-website-ui-kit';

export function FailBuyPage() {
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
            d="M18.9985 21.2392L27.3789 29.6196L29.6181 27.3804L21.2377 19L29.6181 10.6196L27.3789 8.3804L18.9985 16.7608L10.6181 8.3804L8.37891 10.6196L16.7593 19L8.37891 27.3804L10.6181 29.6196L18.9985 21.2392Z"
            fill="#FF5454"
          />
        </svg>

        <div className="font-clash mt-[12px] text-[20px] leading-[26px] text-[#ff5454]">
          The operation did not succeed
        </div>
      </div>
    </section>
  );
}
