import { MarkdownText, PageTitle } from '@haqq/haqq-website-ui-kit';

export function PrivacyPolicyPage({
  privacyPolicy,
}: {
  privacyPolicy: string;
}) {
  return (
    <section>
      <PageTitle title="Privacy Policy" />

      <div className="flex bg-white px-[16px] py-[48px] sm:px-[63px] md:py-[68px] lg:px-[79px] lg:py-[100px]">
        <article className="mx-auto max-w-5xl">
          <MarkdownText isBlack>{privacyPolicy}</MarkdownText>
        </article>
      </div>
    </section>
  );
}
