import clsx from 'clsx';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react/jsx-runtime';
import {
  Container,
  Member,
  MembersContainer,
} from '@haqq/islamic-website-ui-kit';
import teamPageBgImageData from '../../assets/images/team-page-bg.svg';

function TeamPageBg() {
  return (
    <div
      className={clsx(
        'absolute z-[-1] h-[380px] w-[400px] md:h-[954px] md:w-[1000px]',
        'right-[145px] top-[-130px] rtl:left-[-145px] rtl:scale-x-[-1]',
        'md:right-[-600px] md:top-[-300px] rtl:md:left-[-600px]',
        'xl:right-[-360px] xl:top-[-320px] rtl:xl:left-[-360px]',
      )}
    >
      <Image src={teamPageBgImageData} fill alt="" />
    </div>
  );
}

export function TeamPage({
  founders,
  team,
}: {
  founders?: Member[];
  team?: Member[];
}) {
  const t = useTranslations('team-page');
  return (
    <section className="overflow-x-clip">
      <Container className="relative">
        <div className="pb-[60px] pt-[32px] text-white md:pt-[52px] lg:pb-[200px] lg:pt-[68px]">
          <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            {t('title.founders')}
          </h1>

          {founders && (
            <MembersContainer
              members={founders}
              className="my-[32px] lg:my-[100px]"
            />
          )}

          {team && team.length && (
            <Fragment>
              <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
                {t('title.team')}
              </h1>

              <MembersContainer
                members={team}
                className="mt-[32px] lg:mt-[100px]"
              />
            </Fragment>
          )}

          <TeamPageBg />
        </div>
      </Container>
    </section>
  );
}
