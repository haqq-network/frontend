'use-client';
import { Fragment, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { Container, Select } from '@haqq/islamic-website-ui-kit';

const { Link } = createSharedPathnamesNavigation({
  locales: ['en', 'ar', 'id'],
});

export function ShariahPageMobileNav({
  sections,
  activeSection,
  onSectionSelect,
}: {
  sections: Array<{ id: string; title: string }>;
  activeSection: string;
  onSectionSelect: (newSection: string) => void;
}) {
  const [isBlurred, setBlurred] = useState(false);

  useEffect(() => {
    const offset = 500;

    function handleScroll() {
      if (window.scrollY > offset) {
        setBlurred(true);
      } else {
        setBlurred(false);
      }
    }

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Fragment>
      {isBlurred && (
        <FixedPageNavigation
          sections={sections}
          activeSection={activeSection}
          onSectionSelect={onSectionSelect}
        />
      )}

      <Select
        variants={sections}
        current={activeSection}
        onChange={onSectionSelect}
        className="w-full md:max-w-[360px]"
      />
    </Fragment>
  );
}

function FixedPageNavigation({
  sections,
  activeSection,
  onSectionSelect,
}: {
  sections: Array<{ id: string; title: string }>;
  activeSection: string;
  onSectionSelect: (newSection: string) => void;
}) {
  const [isOpen, setOpen] = useState(false);
  const currentValue = useMemo(() => {
    return sections.find(({ id }) => {
      return id === activeSection;
    });
  }, [activeSection, sections]);

  useEffect(() => {
    setOpen(false);
  }, [activeSection]);

  return (
    <div className="fixed left-0 top-[160px] z-[10] w-full border-b-[1px] border-[#2F2F2F] bg-[#010304CC] backdrop-blur-[6px] min-[370px]:top-[136px] md:top-[112px]">
      <Container>
        <div className="flex flex-col">
          <div
            className="flex h-[52px] flex-row items-center justify-between gap-[6px]"
            onClick={() => {
              setOpen(!isOpen);
            }}
          >
            <div className="rtl:font-handjet ltr:font-vcr py-[14px] text-[16px] uppercase leading-[24px]">
              {currentValue ? (
                <span>{currentValue.title}</span>
              ) : (
                <span className="text-white/50">{sections[0].title}</span>
              )}
            </div>
            <div>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                className={clsx(
                  'mb-[-2px] mr-[-2px]',
                  'transition-transform duration-150 ease-in',
                  isOpen && 'scale-y-[-1]',
                )}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.85156 8.89817L6.14793 7.60181L10.9997 12.4536L15.8516 7.60181L17.1479 8.89817L10.9997 15.0464L4.85156 8.89817Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          {isOpen && (
            <div className="flex flex-col border-t-[1px] border-[#2F2F2F] py-[8px]">
              {sections.map((section) => {
                return (
                  <Link
                    href={`#${section.id}`}
                    key={section.id}
                    className={clsx(
                      'hover:text-islamic-primary-green-hover rtl:font-handjet ltr:font-vcr inline-flex cursor-pointer items-center justify-between gap-x-[8px] uppercase focus:text-white',
                      'transition-colors duration-300',
                      section.id === activeSection
                        ? 'text-islamic-primary-green'
                        : 'text-white',
                    )}
                    onClick={() => {
                      onSectionSelect(section.id);
                    }}
                  >
                    <div className="flex w-full flex-row items-center justify-between gap-[6px] py-[8px]">
                      <div>{section.title}</div>
                      {section.id === activeSection && (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-[0px]"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M13.172 3.52063C13.4981 3.80018 13.5359 4.29119 13.2563 4.61733L6.58967 12.3951C6.44191 12.5675 6.22619 12.6667 5.99914 12.6667C5.77209 12.6667 5.55637 12.5675 5.40861 12.3951L2.74195 9.28399C2.4624 8.95785 2.50017 8.46684 2.82631 8.18729C3.15245 7.90774 3.64346 7.94551 3.92301 8.27165L5.99914 10.6938L12.0753 3.60499C12.3548 3.27885 12.8458 3.24108 13.172 3.52063Z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
