import { Button, Container, Text } from '@haqq/islamic-ui-kit';
import Image from 'next/image';
import careerStarsImgData from '../../assets/images/career-stars.webp';

export function CareerPage() {
  return (
    <div className="relative">
      <Container className="mt-[32px] flex flex-col pb-[60px] text-white md:mt-[52px] lg:mt-[68px]">
        <div className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
          Career
        </div>
        <Text size="small" className="mt-[32px]">
          Welcome to Islamic Coin's careers page!
        </Text>
        <Text size="small" className="mt-[16px]">
          We are a passionate team of professionals committed to creating
          innovative solutions by combining the power of blockchain technology
          and the principles of Islamic finance. Our mission is to provide the
          global Muslim community with a financial instrument for the Digital
          Age, enabling seamless transactions and interactions while promoting
          innovation and philanthropy. If you share our values and are
          enthusiastic about blockchain technology, we invite you to explore our
          exciting opportunities.
        </Text>
        <Text size="small" className="mt-[16px]">
          We offer various roles that enable you to learn, grow, and make a
          meaningful impact. Join us to build a fairer, more inclusive financial
          future for all. Discover our current openings and apply today!
        </Text>
        <div className="mt-[24px] max-w-[233px]">
          <Button>Discover openings!</Button>
        </div>
      </Container>
      <div className="absolute right-0 top-[-50px] z-[-1] h-[447px] w-[222px]">
        <Image src={careerStarsImgData} alt="" fill />
      </div>
    </div>
  );
}
