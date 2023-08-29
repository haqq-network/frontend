import { useState } from 'react';

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        d="M6 12H18 M12 6L12 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        d="M6 12H18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FAQArticle({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setOpen] = useState(false);

  return (
    <div
      className="flex flex-col space-y-[16px] py-[16px]"
      onClick={() => {
        setOpen(!isOpen);
      }}
    >
      <div className="flex w-full cursor-pointer items-center justify-between text-[24px] font-bold text-white">
        <span>{question}</span>
        {isOpen ? <MinusIcon /> : <PlusIcon />}
      </div>
      {isOpen && <div className="whitespace-pre-wrap">{answer}</div>}
    </div>
  );
}

export function FAQBlock() {
  return (
    <section className="w-full py-[40px] sm:py-[70px] sm:pb-[140px]">
      <div className="container mx-auto max-w-[980px] px-[20px] sm:px-[40px]">
        <h2 className="mb-[50px] text-center text-[38px] font-extrabold leading-[52px] sm:mb-[64px] sm:text-[48px] sm:leading-[64px]">
          FAQ
        </h2>

        <div className="flex flex-col divide-y divide-gray-200/10">
          <FAQArticle
            question="What coins does HAQQ Wallet support?"
            answer={
              'The Wallet has been developed for the HAQQ Network and currently only supports Islamic Coin (ISLM), HAQQ’s native currency.'
            }
          />
          <FAQArticle
            question="Can I connect a hardware wallet?"
            answer="Yes, we support Ledger Nano X"
          />
          <FAQArticle
            question="Does wallet support NFTs?"
            answer="No, but we plan to add support for NFTs soon."
          />
          <FAQArticle
            question="Why hasn’t my balance updated?"
            answer="This is typically caused by a bad network connection. We recommend trying a different network."
          />
        </div>
      </div>
    </section>
  );
}
