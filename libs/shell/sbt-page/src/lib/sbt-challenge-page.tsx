import { BackButton, Button, Container } from '@haqq/shell-ui-kit';
import { Fragment, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { SBTCardStatus } from './sbt-card';
import clsx from 'clsx';

export function SBTChallengePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <section>
      <Container>
        <div className="py-[18px] sm:py-[26px] lg:py-[34px]">
          <BackButton
            onClick={() => {
              navigate('/sbt');
            }}
          >
            SBT List
          </BackButton>
        </div>
      </Container>
      <SBTChallengeComponent id={id} />
    </section>
  );
}

function SBTChallengeComponent({ id }: { id: string }) {
  const isTablet = useMediaQuery({
    query: `(max-width: 1023px)`,
  });
  console.log(`get "${id}" challenge info`);

  return (
    <Fragment>
      <Container>
        <div className="flex flex-row gap-[48px] lg:mb-[48px]">
          <div className="flex-1">
            <div className="divide-haqq-border divide-y divide-dashed">
              <div className="flex flex-col gap-[16px] pb-[40px] lg:gap-[28px]">
                <div className="flex flex-col gap-[16px] lg:flex-row lg:items-center">
                  <div className="flex-none">
                    <SBTCardStatus status="not-complete" />
                  </div>
                  <div>
                    <h2 className="font-clash text-[18px] font-[500] leading-[24px] lg:text-[32px] lg:leading-[42px]">
                      Confirmation i-am-not-bot
                    </h2>
                  </div>
                </div>
                <div>
                  <p className="font-guise text-[12px] font-[500] leading-[18px] lg:text-[14px] lg:leading-[22px]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Atque, asperiores error corporis quasi laborum enim. Hic
                    exercitationem voluptas a odio alias iste eius illo
                    laudantium quam autem, placeat in non.
                  </p>
                </div>
              </div>
              <div className="py-[40px]">
                <SbtTasksSteps steps={STEPS} />
              </div>
            </div>
          </div>

          {!isTablet && (
            <div className="hidden flex-1 lg:block lg:w-1/3 lg:flex-none">
              <div className="flex flex-col gap-[20px]">
                <SBTRewardDesktop />
              </div>
            </div>
          )}
        </div>
      </Container>

      {isTablet && (
        <div className="sticky bottom-0 left-0 right-0 z-30">
          <div className="transform-gpu bg-[#FFFFFF07] backdrop-blur">
            <SBTRewardTablet />
          </div>
        </div>
      )}
    </Fragment>
  );
}

function SBTRewardTablet() {
  return (
    <div className="overflow-hidden bg-[#ffffff14]">
      <div className="flex flex-row items-center">
        <div className="h-[100px] w-1/2 lg:h-[180px]">
          <img
            alt=""
            src="https://picsum.photos/200/300"
            className="pointer-events-none h-full w-full select-none object-cover"
          />
        </div>

        <div className="flex flex-col gap-[6px] px-[28px]">
          <div className="text-[12px] font-[500] uppercase leading-[14px] text-[#8E8E8E]">
            Reward
          </div>
          <div className="font-clash mb-[-2px] text-[16px] font-[500] leading-[20px] text-[#8E8E8E] lg:text-[24px] lg:leading-[30px]">
            <span className="text-white">SBT</span> Token
          </div>
        </div>
      </div>
    </div>
  );
}

function SBTRewardDesktop() {
  return (
    <div className="overflow-hidden rounded-[8px] bg-[#ffffff14]">
      <div className="h-[260px] w-full">
        <img
          alt=""
          src="https://picsum.photos/200/300"
          className="pointer-events-none h-full w-full select-none object-cover"
        />
      </div>

      <div className="flex flex-col gap-[6px] px-[28px] py-[32px]">
        <div className="text-[12px] font-[500] uppercase leading-[14px] text-[#8E8E8E]">
          Reward
        </div>
        <div className="font-clash mb-[-2px] text-[24px] font-[500] leading-[30px] text-[#8E8E8E]">
          <span className="text-white">SBT</span> Token
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    title: 'Connecting a mobile wallet',
  },
  {
    title: 'Signing data with wallet',
  },
  {
    title: 'Verification of data signature',
  },
  {
    title: 'Verification using Captcha',
  },
  {
    title: 'Receiving a reward',
  },
];

function SbtTasksSteps({ steps }: { steps: Array<{ title: string }> }) {
  const [currentStep, setCurrentStep] = useState(0);
  const stepProgress = useMemo(() => {
    return new Array(steps.length).fill(null).map((_, index) => {
      return (
        <div
          key={`progress-step-${index}`}
          className={clsx(
            'h-[4px] w-[20px] lg:w-[40px]',
            index < currentStep ? 'bg-islamic-primary-green' : 'bg-[#FFFFFF14]',
          )}
        ></div>
      );
    });
  }, [currentStep, steps.length]);

  return (
    <div className="flex flex-col gap-[40px]">
      <div className="flex flex-col gap-[12px]">
        <div className="font-guise text-[14px] font-[500] leading-[22px] lg:text-[18px] lg:leading-[28px]">
          You finish{' '}
          <span
            className={clsx(currentStep > 0 && 'text-islamic-primary-green')}
          >
            {currentStep}
          </span>{' '}
          from {steps.length}
        </div>

        <div className="flex flex-row gap-[6px] lg:gap-[10px]">
          {stepProgress}
        </div>
      </div>

      <div className="divide-y divide-[#FFFFFF3D] rounded-[8px] border border-[#FFFFFF3D]">
        {steps.map(({ title }, index) => {
          return (
            <Step
              key={`step-${index}`}
              // onClick={() => {
              //   setCurrentStep(index + 1);
              // }}
              onVerify={() => {
                setCurrentStep(index + 1);
              }}
              title={title}
              index={index + 1}
              isFinished={currentStep > index}
              isCurrent={currentStep === index}
            />
          );
        })}
      </div>
    </div>
  );
}

function Step({
  index,
  title,
  isFinished,
  isCurrent,
  onVerify,
}: {
  index: number;
  title: string;
  isFinished: boolean;
  isCurrent: boolean;
  onVerify: () => void;
}) {
  return (
    <div
      className={clsx(
        'flex cursor-pointer flex-row items-center gap-[16px] hover:bg-[#FFFFFF14]',
        'px-[12px] py-[16px]',
        'lg:px-[28px] lg:py-[22px]',
        'transition-colors duration-75 ease-in',
        'min-h-[85px]',
      )}
    >
      <div
        className={clsx(
          'flex flex-row items-center gap-[12px]',
          isFinished ? 'text-islamic-primary-green' : 'text-[#868687]',
        )}
      >
        <div
          className={clsx(
            'relative ml-[10px] h-[16px] w-[16px] border-[2px] lg:ml-[20px]',
            'border-current',
            isFinished && 'bg-current',
          )}
        >
          <div className="absolute left-[-10px] top-[50%] h-[1px] w-[10px] bg-current lg:left-[-20px] lg:w-[20px]" />
        </div>
        <div className="font-clash w-[26px] text-[14px] font-[500] leading-[18px] text-current lg:text-[20px] lg:leading-[26px]">
          {index}
        </div>
      </div>
      <div className="flex-1">
        <div
          className={clsx(
            'text-[14px] leading-[18px]',
            'font-clash lg:text-[20px] lg:leading-[26px]',
            'transition-colors duration-75 ease-in',
            isFinished && 'text-islamic-primary-green',
          )}
        >
          {title}
        </div>
      </div>
      <div>
        {isFinished ? (
          <CheckIcon />
        ) : isCurrent ? (
          <Button variant={2} onClick={onVerify}>
            Verify
          </Button>
        ) : (
          <ArrowIcon />
        )}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
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
        d="M20.2526 6.45849L9.01053 19.3065L3.7567 13.4689L5.24329 12.131L8.98946 16.2934L18.7474 5.14148L20.2526 6.45849Z"
        fill="#01B26E"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
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
        d="M14.7426 9.96442L14.7426 16.0355L16.7426 16.0355L16.7426 6.55021L7.25735 6.55021L7.25735 8.55021L13.3284 8.55021L5.13603 16.7426L6.55025 18.1568L14.7426 9.96442Z"
        fill="white"
      />
    </svg>
  );
}
