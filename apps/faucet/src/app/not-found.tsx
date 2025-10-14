import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="font-clash text-[48px] font-[500] uppercase leading-none lg:text-[80px]">
        404
      </h1>
      <p className="text-center text-[14px] leading-[22px] lg:text-[18px] lg:leading-[28px]">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="rounded-[8px] bg-[#04D484] px-[24px] py-[12px] font-[600] text-black transition-colors hover:bg-[#04D484]/80"
      >
        Go back home
      </Link>
    </div>
  );
}
