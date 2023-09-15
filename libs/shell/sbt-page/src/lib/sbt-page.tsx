import { Container, Heading, ListIcon } from '@haqq/shell-ui-kit';
import { SBTCard, SBTStatus } from './sbt-card';
import { Link } from 'react-router-dom';

const QUESTS: Array<{
  id: string;
  status: SBTStatus;
  img: string;
  title: string;
}> = [
  {
    id: 'challenge-1',
    status: 'not-complete',
    img: 'https://picsum.photos/seed/1/300/200',
    title: 'Confirmation i-am-not-bot',
  },
  {
    id: 'challenge-2',
    status: 'process',
    img: 'https://picsum.photos/seed/2/300/200',
    title: 'Confirmation of sociality',
  },
  {
    id: 'challenge-3',
    status: 'complete',
    img: 'https://picsum.photos/seed/3/300/200',
    title: 'Confirmation of humanity',
  },
];

export function SBTChallengesPage() {
  return (
    <div>
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div className="font-serif text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
            SBT
          </div>
        </Container>
      </div>

      <div className="border-t border-[#ffffff26] py-[100px]">
        <Container>
          <div className="mb-[24px] flex flex-row items-center">
            <ListIcon />
            <Heading level={3} className="mb-[-2px] ml-[8px]">
              SBT List
            </Heading>
          </div>

          {QUESTS.length > 0 ? (
            <div className="grid grid-cols-1 gap-[32px] md:grid-cols-2 xl:grid-cols-3">
              {QUESTS.map(({ id, status, img, title }) => {
                return (
                  <Link to={`/sbt/${id}`} key={id}>
                    <SBTCard status={status} img={img} title={title} />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-[48px] text-center">
              <div className="text-[16px] leading-[24px]">
                No challenges available
              </div>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
