import Image from 'next/image';
import cubesImgData from '../../assets/images/cubes.png';
import { Button, Heading, Text } from '@haqq/islamic-ui-kit';

export function JoinCommunityBlock() {
  return (
    <div className="flex w-full flex-col items-center text-center text-white">
      <Image src={cubesImgData} alt="" />
      <Heading level={3} className="mt-[16px]">
        Join Our Community
      </Heading>
      <Text isMono className="mt-[8px]">
        Join the Global Islamic Finance Revolution
      </Text>
      <Button className="mt-[42px]">Join our community</Button>
    </div>
  );
}
