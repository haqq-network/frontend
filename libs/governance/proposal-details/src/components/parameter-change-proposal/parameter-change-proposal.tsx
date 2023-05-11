import { Heading } from '@haqq/shell/ui-kit-next';
import { Metadata } from '../metadata/metadata';
import { ParameterChangeProposalContent } from '@evmos/provider';

export function ParameterChangeProposalDetails({
  content,
}: {
  content: ParameterChangeProposalContent;
}) {
  return (
    <div>
      <div className="mb-[16px] flex flex-row items-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 9V4H9V9H4ZM2 3C2 2.44772 2.44772 2 3 2H10C10.5523 2 11 2.44772 11 3V10C11 10.5523 10.5523 11 10 11H3C2.44772 11 2 10.5523 2 10V3ZM7 13H5V19H10V17H7V13ZM19 10H17V7L13 7V5L19 5V10ZM20 17C20 18.6569 18.6569 20 17 20C15.3431 20 14 18.6569 14 17C14 15.3431 15.3431 14 17 14C18.6569 14 20 15.3431 20 17ZM22 17C22 19.7614 19.7614 22 17 22C14.2386 22 12 19.7614 12 17C12 14.2386 14.2386 12 17 12C19.7614 12 22 14.2386 22 17Z"
            fill="currentColor"
          />
        </svg>

        <Heading level={3} className="ml-[8px]">
          Parameter changes
        </Heading>
      </div>
      <Metadata>{JSON.stringify(content.changes, null, 2)}</Metadata>
    </div>
  );
}
