import {
  Container,
  MarkdownTextProseWrapper,
} from '@haqq/islamic-website-ui-kit';
import fraudCubesImgData from '../../assets/images/fraud-cubes.webp';
import Image from 'next/image';

export function ScamAlertPage() {
  const locale: string = 'en';

  return (
    <section className="gap-y-[24px] overflow-x-clip pb-[60px] pt-[32px] md:pb-[90px] lg:gap-y-[40px] lg:pb-[180px] lg:pt-[80px]">
      <Container className="relative">
        <div className="flex flex-col gap-y-[24px] md:gap-y-[32px] lg:gap-y-[40px]">
          <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            {locale === 'ar' ? 'تنبيه احتيال' : 'Scam Alert'}
          </h1>
        </div>
        <div className="mt-[32px] flex flex-col items-center md:mt-[44px] md:flex-row md:items-start lg:mt-[60px]">
          <div dir={locale === 'ar' ? 'rtl' : 'ltr'} className="md:w-2/3">
            <MarkdownTextProseWrapper>
              {locale === 'ar' ? (
                <div>
                  <h2>مجتمعنا الرائع،</h2>
                  <p>
                    نود أن نلفت انتباهكم إلى ارتفاع عدد العمليات الاحتيالية
                    المتعلقة بعملة إسلاميك كوين (ISLM) في الآونة الأخيرة، والتي
                    تقوم بها عدد من المنصات غير المصرح بها . ومن منطلق حرصنا على
                    حماية جميع أفراد مجتمعنا، إليكم ما يلي:
                  </p>
                  <ul>
                    <li>
                      المواقع الرسمية لإسلاميك كوين وشبكة حق:
                      <ul>
                        <li>
                          <a
                            href="https://haqq.network"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            haqq.network
                          </a>
                          : لجميع مستجدات ومعلومات وأخبار شبكة حق
                        </li>
                        <li>
                          <a
                            href="https://islamiccoin.net"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            islamiccoin.net
                          </a>
                          : مصدر رسمي لجميع مستجدات وأخبار ISLM
                        </li>
                      </ul>
                    </li>
                    <li>
                      حساباتنا الرسمية على شبكات التواصل الاجتماعي:
                      <ul>
                        <li>
                          انستغرام:{' '}
                          <a
                            href="https://www.instagram.com/Islamic.Coin/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            @Islamic.Coin
                          </a>
                        </li>
                        <li>
                          تويتر/إكس:{' '}
                          <a
                            href="https://twitter.com/islamic_coin"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            @islamic_coin
                          </a>{' '}
                          و{' '}
                          <a
                            href="https://twitter.com/the_haqqnetwork"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            @the_haqqnetwork
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <p>
                    الرمز التعريفي المستخدم لتمثيل عملة إسلاميك كوين هو (ISLM)
                  </p>
                  <p>
                    قد يدّعي زيفًا بائع ISLM بأنه جزء من فريق العمل الرسمي لشبكة
                    حق أو إسلاميك كوين أو بأنه ممثلًا عن شبكة حق أو إسلاميك
                    كوين، نؤكد لكم بأن جميع هذه الادِّعاءات باطلة ولا تمت
                    للحقيقة بصلة.
                  </p>
                  <p>
                    لن يقوم مطلقًا أي عضو من أعضاء فريقنا الرسمي باستغلال منصبه
                    لغرض بيع ISLM بطريقة غير مشروعة.
                  </p>
                  <p>
                    عمليات الشراء المشروعة: يُعلن عن عمليات البيع الرسمية لـ
                    ISLM حصريًا على حساباتنا ومواقعنا الرسمية وعلى الحسابات
                    والمواقع الرسمية التابعة لشركائنا، يرجى أخذ الحيطة والحذر من
                    الحسابات والمواقع المزيفة والاحتيالية.
                  </p>
                  <p>
                    يحرص فريقنا على إبقائكم على اطلاع وحمايتكم من الأنشطة
                    الاحتيالية، لذا نرجوا منكم مساعدتنا وإبلاغنا فورًا عند
                    اشتباهكم بوجود نشاط غير مشروع أو عملية احتيالية.
                  </p>
                  <h2>كيف تكتشف العمليات الاحتيالية:</h2>
                  <ul>
                    <li>
                      الرسائل المشبوهه: تلقي رسائل مشبوهه ومُرسلة من عناوين غير
                      رسمية. النطاق الرسمي الخاص بنا هو إما{' '}
                      <a
                        href="https://haqq.network"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        haqq.network
                      </a>{' '}
                      أو{' '}
                      <a
                        href="https://islamiccoin.net"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        islamiccoin.net
                      </a>
                    </li>
                    <li>
                      وعود غير منطقية: تقديم وعود يُصعب تصديقها ككسب عوائد عالية
                      بدون وجود مخاطر
                    </li>
                    <li>
                      المواقع الإلكترونية وحسابات شبكات التواصل الاجتماعي غير
                      الموثّقة: اعتمد فقط على مصادرنا الرسمية للتعرّف إلى آخر
                      المستجدات
                    </li>
                    <li>
                      إضافتك إلى مجموعات على قناة تيليغرام وإخبارك بأنك ستستقبل
                      &quot;توزيعات&quot; (إيردروبس) على محفظة حق الخاصة بك
                    </li>
                  </ul>
                  <p>
                    تحذير! لا يمكن الوثوق بأي منصات وحسابات أخرى، بما في ذلك
                    حسابات شبكات التواصل الاجتماعي التي تدعي زيفًا بأنها رسمية
                    والمواقع والصفحات المزيفة التي تنتحل هويتنا من خلال
                    المبادرات المجتمعية. على الرغم من دعمنا الدائم للمبادرات
                    المجتمعية، إلا أننا لا نقوم بعمليات البيع الرسمية من خلال
                    هذه المنصات المزيفة.
                  </p>

                  <p>
                    إذا كنت مهتمًا بالانضمام إلى البيع المسبق الخاص بنا، فيرجى
                    منك زيارة{' '}
                    <a
                      href="https://republic.com/islamic-coin"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      republic.com/islamic-coin
                    </a>
                  </p>
                  <p>
                    حمايتكم هي أهم أولوياتنا! نتخذ كل ما يلزم حتى نحميكم من
                    التعرّض لعمليات الاحتيال. احرصوا على اعتماد على المنصات
                    الرسمية فقط للقيام بأنشطتكم الاستثمارية وساهموا معنا في بناء
                    مجتمع آمن ومتماسك.
                  </p>
                  <p>شكرًا لكم،</p>
                </div>
              ) : (
                <div>
                  <h2>Dear Community,</h2>
                  <p>
                    We need your attention regarding the ISLM token. Lately,
                    we&apos;ve seen a surge in scams tied to ISLM on
                    unauthorized platforms, and we take this very seriously.
                  </p>
                  <p>Here&apos;s the deal:</p>
                  <ul>
                    <li>
                      Official ISLM and HAQQ Website Channels:
                      <ul>
                        <li>
                          <a
                            href="https://haqq.network"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            haqq.network
                          </a>
                          : The place for HAQQ updates, news, and info
                        </li>
                        <li>
                          <a
                            href="https://islamiccoin.net"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            islamiccoin.net
                          </a>
                          : Another official source for ISLM news and
                          developments
                        </li>
                      </ul>
                    </li>
                    <li>
                      Official Social Media Channels:
                      <ul>
                        <li>
                          Instagram:{' '}
                          <a
                            href="https://www.instagram.com/Islamic.Coin/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            @Islamic.Coin
                          </a>{' '}
                          (Any other spin-off is NOT from us)
                        </li>
                        <li>
                          Twitter:{' '}
                          <a
                            href="https://twitter.com/islamic_coin"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            @islamic_coin
                          </a>{' '}
                          and{' '}
                          <a
                            href="https://twitter.com/the_haqqnetwork"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            @the_haqqnetwork
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <p>(These are the ONLY official Twitter channels)</p>
                  <p>
                    Our cashtag ticker is ISLM - <strong>NOTHING ELSE</strong>
                  </p>
                  <p>
                    Private sellers of ISLM may claim they are part of the
                    official community, we do not solicit tokens through these
                    channels and if claims are made that they are part of the
                    team or represent HAQQ Network or IslamicCoin please be
                    aware that this is categorically false.
                  </p>
                  <p>
                    Our core team will never try to sell you tokens using their
                    position.
                  </p>
                  <p>
                    Only Official Options: Legit buying options for ISLM will be
                    revealed EXCLUSIVELY through our official channels and
                    trusted partners. Beware of any other sources.
                  </p>
                  <p>
                    Our ISLM team is committed to your safety and security.
                    Report suspicious activity to us immediately. We&apos;re
                    here to help you stay safe and informed.
                  </p>
                  <h2>How to Spot Scams:</h2>
                  <ul>
                    <li>
                      Unsolicited Messages: If it&apos;s unsolicited and not
                      from{' '}
                      <a
                        href="https://haqq.network"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        haqq.network
                      </a>{' '}
                      or{' '}
                      <a
                        href="https://islamiccoin.net"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        islamiccoin.net
                      </a>
                      , be cautious.
                    </li>
                    <li>
                      Too-Good-to-Be-True Promises: High returns with no risk?
                      It&apos;s a red flag!
                    </li>
                    <li>
                      Unverified Websites and Social Media: Stick to official
                      sources for ISLM updates.
                    </li>
                    <li>
                      They add you to telegram groups and show they can airdrop
                      you some supply into your HAQQ Wallet
                    </li>
                  </ul>
                  <p>
                    IMPORTANT: NO OTHER PLATFORM CAN BE TRUSTED, including
                    social media claiming to be official channels and domains
                    that have hijacked our brand through community initiatives.
                    Whilst we support the community initiatives we do not
                    endorse them as official channels for the sale of ISLM
                    tokens. We DO NOT endorse these platforms.
                  </p>
                  <p>
                    If you are interested in joining our presale please visit{' '}
                    <a
                      href="https://republic.com/islamic-coin"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      republic.com/islamic-coin
                    </a>
                  </p>
                  <p>
                    Your safety matters most. Stick to the official channels to
                    make wise investments and protect the ISLM community from
                    scams and fraud.
                  </p>
                  <p>Thank you for your vigilance and support!</p>
                  <p>
                    Sincerely, <br />
                    IslamicCoin and HAQQ Network Team
                  </p>
                </div>
              )}
            </MarkdownTextProseWrapper>
          </div>

          <div className="mt-[32px] md:mt-0 md:flex-1">
            <Image
              src={fraudCubesImgData}
              width={502}
              height={764}
              alt=""
              className="pointer-events-none select-none md:absolute md:right-[-385px] md:top-[350px] md:translate-x-[-50%] md:translate-y-[-50%] lg:right-[-295px] xl:right-[-265px]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
