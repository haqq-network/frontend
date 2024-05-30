'use client';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import {
  Container,
  MemberCard,
  MemberModalCard,
  Modal,
  Text,
} from '@haqq/islamic-website-ui-kit';
import { ScrollSpySection } from './scrollspy';
import fatwaStarsImgData from '../../assets/images/fatwa-stars.jpg';
import { FatwaBlock } from '../fatwa-block/fatwa-block';
import { FoundationsBlock } from '../foundations-block/foundations-block';
import { ShariahBlock } from '../shariah-block/shariah-block';
import { ShariahPageMobileNav } from '../shariah-page-mobile-nav/shariah-page-mobile-nav';

const { Link } = createSharedPathnamesNavigation({
  locales: ['en', 'ar', 'id'],
});

export interface Member {
  image: string;
  title: string;
  description: string;
  url?: string;
  role?: string;
}

export type LocaleType = 'ar' | 'en' | 'id';

function MembersContainer({
  members,
  className,
  onMemberSelect,
}: {
  members: Member[];
  className?: string;
  onMemberSelect: (member: Member) => void;
}) {
  return (
    <div
      className={clsx(
        'flex overflow-x-auto',
        'gap-[32px] md:grid md:grid-cols-2 2xl:grid-cols-3',
        className,
      )}
    >
      {members.map((member, idx) => {
        return (
          <MemberCard
            image={member.image}
            title={member.title}
            url={member.url}
            onClick={() => {
              onMemberSelect(member);
            }}
            key={`${member.title}-member-${idx}`}
            role={member.role}
            className="float-left min-w-[200px] snap-center md:float-none md:max-w-none"
          />
        );
      })}
    </div>
  );
}

export function ShariahPage({
  shariahMembers,
  executiveMembers,
  advisoryMembers,
  fatwa,
  locale,
}: {
  shariahMembers: Member[];
  executiveMembers: Member[];
  advisoryMembers: Member[];
  fatwa: string;
  locale: string;
}) {
  const t = useTranslations('shariah-page');
  const sections = useMemo(() => {
    return [
      { id: 'fatwa', title: t('headings.fatwa') },
      { id: 'foundations', title: t('headings.foundations') },
      { id: 'shariah-oracle', title: t('headings.sharia-oracle') },
      { id: 'shariah-board', title: t('headings.shariah-board') },
      { id: 'advisory-board', title: t('headings.advisory-board') },
      { id: 'executive-board', title: t('headings.executive-board') },
    ];
  }, [t]);
  const activeSectionsDefaultState = sections.map(() => {
    return false;
  });
  const { replace } = useRouter();
  const [activeSection, setActiveSection] = useState('fatwa');
  const [boardMember, setBoardMember] = useState<undefined | Member>(undefined);
  const [activeSections, setActiveSections] = useState(
    activeSectionsDefaultState,
  );

  const handleSectionInView = useCallback(
    (id: string, inView: boolean) => {
      const sectionIndex = sections.findIndex(({ id: sectionId }) => {
        return sectionId === id;
      });

      setActiveSections((prevActiveSessions) => {
        const newActiveSessions = [...prevActiveSessions];
        newActiveSessions[sectionIndex] = inView;
        return newActiveSessions;
      });
    },
    [sections],
  );

  useEffect(() => {
    const activeIndex = activeSections.findIndex((inView) => {
      return inView;
    });

    if (activeIndex > 0) {
      setActiveSection(sections[activeIndex].id);
    } else {
      setActiveSection(sections[0].id);
    }
  }, [activeSections, sections]);

  // useEffect(() => {
  //   replace(`#${activeSection}`);
  // }, [activeSection, replace]);

  const handleSectionSelect = useCallback(
    (id: string) => {
      replace(`#${id}`);
      setActiveSection(id);
    },
    [replace],
  );

  return (
    <section className="max-w-full overflow-x-clip py-[32px] md:py-[52px] lg:py-[68px]">
      <Container className="relative">
        <div>
          <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            {t('title')}
          </h1>

          <div className="mt-[18px] max-w-[1000px] md:mt-[28px]">
            <Text size="small" className="text-white/50">
              {t('text')}
            </Text>
          </div>
        </div>

        <div
          className={clsx(
            'flex flex-col pt-[40px] md:pt-[58px] lg:flex-row',
            'md:gap-[32px] lg:gap-[48px] xl:gap-[72px] xl:pr-[72px]',
          )}
        >
          <div className="relative hidden w-[292px] flex-none lg:block">
            <div className="sticky top-[112px] pb-[80px]">
              <ShariahPageDesktopNav
                sections={sections}
                activeSection={activeSection}
              />
            </div>
          </div>
          <div className="md:flex-1">
            <div>
              <div className="lg:hidden">
                <ShariahPageMobileNav
                  sections={sections}
                  activeSection={activeSection}
                  onSectionSelect={handleSectionSelect}
                />
              </div>

              <div className="flex flex-col divide-y-[1px] divide-[#2F2F2F] lg:max-w-[844px]">
                <ScrollSpySection
                  id="fatwa"
                  onSectionInView={handleSectionInView}
                  initialInView
                >
                  {/* <div className="border-b-[1px] border-[#2F2F2F] pb-[32px] pt-[32px] md:pb-[60px] lg:pb-[80px]"> */}
                  <div className="pb-[32px] pt-[32px] md:pb-[60px] lg:pb-[80px]">
                    <FatwaBlock locale={locale as LocaleType} fatwa={fatwa} />
                  </div>
                </ScrollSpySection>
                <ScrollSpySection
                  id="foundations"
                  onSectionInView={handleSectionInView}
                  // threshold={[0.2, 0.5]}
                >
                  <div className="py-[32px] md:py-[60px] lg:py-[80px]">
                    <FoundationsBlock />
                  </div>
                </ScrollSpySection>
                <ScrollSpySection
                  // threshold={[0.2, 0.5]}
                  id="shariah-oracle"
                  onSectionInView={handleSectionInView}
                >
                  <div className="py-[32px] md:py-[60px] lg:py-[80px]">
                    <ShariahBlock />
                  </div>
                </ScrollSpySection>
                <ScrollSpySection
                  // threshold={[0.2, 0.5]}
                  id="shariah-board"
                  onSectionInView={handleSectionInView}
                >
                  <div className="py-[32px] md:py-[60px] lg:py-[80px]">
                    <div className="flex flex-col gap-y-[24px] lg:gap-y-[28px] xl:gap-y-[32px]">
                      <div>
                        <h2 className="text-[22px] font-[600] leading-[24px] md:text-[32px] md:leading-[36px] lg:text-[48px] lg:leading-[54px]">
                          {t('headings.shariah-board')}
                        </h2>
                      </div>

                      <div className="max-w-full flex-1">
                        <MembersContainer
                          members={shariahMembers}
                          onMemberSelect={(member) => {
                            setBoardMember(member);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </ScrollSpySection>
                <ScrollSpySection
                  // threshold={[0.2, 0.5]}
                  id="advisory-board"
                  onSectionInView={handleSectionInView}
                >
                  <div className="py-[32px] md:py-[60px] lg:py-[80px]">
                    <div className="flex flex-col gap-y-[24px] lg:gap-y-[28px] xl:gap-y-[32px]">
                      <h2 className="text-[22px] font-[600] leading-[24px] md:text-[32px] md:leading-[36px] lg:text-[48px] lg:leading-[54px]">
                        {t('headings.advisory-board')}
                      </h2>
                      <MembersContainer
                        members={advisoryMembers}
                        onMemberSelect={(member) => {
                          setBoardMember(member);
                        }}
                      />
                    </div>
                  </div>
                </ScrollSpySection>
                <ScrollSpySection
                  // threshold={[0.2, 0.5]}
                  id="executive-board"
                  onSectionInView={handleSectionInView}
                >
                  <div className="py-[32px] md:py-[60px] lg:py-[80px]">
                    <div className="flex flex-col gap-y-[24px] lg:gap-y-[28px] xl:gap-y-[32px]">
                      <h2 className="text-[22px] font-[600] leading-[24px] md:text-[32px] md:leading-[36px] lg:text-[48px] lg:leading-[54px]">
                        {t('headings.executive-board')}
                      </h2>
                      <MembersContainer
                        members={executiveMembers}
                        onMemberSelect={(member) => {
                          setBoardMember(member);
                        }}
                      />
                    </div>
                  </div>
                </ScrollSpySection>
              </div>
            </div>
          </div>
        </div>

        <div
          className={clsx(
            'absolute z-[-1]',
            'right-[-100px] top-[-80px] h-[400px] w-[236px]',
            'md:right-[-120px] md:top-[-100px] md:h-[742px] md:w-[437px]',
            'lg:right-[-280px] lg:top-[-510px] lg:h-[1483px] lg:w-[874px]',
          )}
        >
          <Image
            src={fatwaStarsImgData}
            alt=""
            fill
            className="opacity-[30%]"
            priority
          />
        </div>
      </Container>

      <Modal
        isOpen={Boolean(boardMember)}
        onClose={() => {
          setBoardMember(undefined);
        }}
      >
        {boardMember && (
          <MemberModalCard
            description={boardMember.description}
            image={boardMember.image}
            title={boardMember.title}
            url={boardMember.url}
            onClick={() => {
              setBoardMember(undefined);
            }}
            role={boardMember.role}
          />
        )}
      </Modal>
    </section>
  );
}

function ShariahPageDesktopNavLink({
  href,
  isActive,
  children,
}: PropsWithChildren<{
  href: string;
  isActive?: boolean;
}>) {
  return (
    <Link
      href={href}
      className={clsx(
        'hover:text-islamic-primary-green-hover font-vcr rtl:font-handjet inline-flex cursor-pointer items-center justify-between gap-x-[8px] uppercase',
        'transition-colors duration-300',
        isActive ? 'text-islamic-primary-green' : 'text-white',
      )}
    >
      <span>{children}</span>

      {isActive && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={clsx(
            'rtl:rotate-180',
            isActive ? 'text-islamic-primary-green' : 'text-transparent',
          )}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.7071 5.29289C14.3166 4.90237 13.6834 4.90237 13.2929 5.29289C12.9024 5.68342 12.9024 6.31658 13.2929 6.70711L17.5858 11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H17.5858L13.2929 17.2929C12.9024 17.6834 12.9024 18.3166 13.2929 18.7071C13.6834 19.0976 14.3166 19.0976 14.7071 18.7071L21.4142 12L14.7071 5.29289Z"
            fill="currentColor"
          />
        </svg>
      )}
    </Link>
  );
}

function ShariahPageDesktopNav({
  sections,
  activeSection,
}: {
  sections: Array<{ id: string; title: string }>;
  activeSection: string;
}) {
  return (
    <nav className="flex flex-col gap-y-[16px] rounded-[20px] bg-[#181E25b3] p-[28px] backdrop-blur">
      {sections.map(({ id, title }) => {
        return (
          <ShariahPageDesktopNavLink
            href={`#${id}`}
            key={`sharia-nav-${id}`}
            isActive={activeSection === id}
          >
            {title}
          </ShariahPageDesktopNavLink>
        );
      })}
    </nav>
  );
}
