import Image from 'next/image';
import cubesImgData from '../../assets/images/cubes.png';
import { Button, Container, Text } from '@haqq/islamic-ui-kit';

export function JoinCommunityBlock() {
  return (
    <Container>
      <div className="my-[128px] flex w-full flex-col items-center text-center text-white md:my-[164px] lg:my-[200px]">
        <Image src={cubesImgData} alt="" />
        <span className="mt-[16px] text-[28px] font-[600] leading-[32px] md:text-[44px] md:leading-[48px]">
          Join Our Community
        </span>
        <Text isMono className="mt-[8px]">
          Join the Global Islamic Finance Revolution
        </Text>
        <Button className="mt-[42px]">Join our community</Button>
      </div>
    </Container>
  );
}
