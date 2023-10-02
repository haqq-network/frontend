'use client';
import { DownloadPDFButton, Text } from '@haqq/islamic-website-ui-kit';
import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';
import fatwaSign1 from '../../assets/images/autographs/autograph-al-enezy.webp';
import fatwaSign2 from '../../assets/images/autographs/autograph-saleh-yaqubi.webp';
import fatwaSign3 from '../../assets/images/autographs/autograph-hakim-mohamed.webp';
import fatwaSign4 from '../../assets/images/autographs/autograph-mohamed-zoeir.webp';
import fatwaSign5 from '../../assets/images/autographs/autograph-fathiddin-beyanouni.webp';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { localeType } from '../shariah-page/shariah-page';

function LangButton({
  active,
  locale = 'en',
  onClick,
}: {
  active: boolean;
  locale: localeType;
  onClick: () => void;
}) {
  const t = useTranslations('shariah-page.fatwa-block.language-buttons');
  return (
    <div
      className={clsx(
        'rtl:font-handjet cursor-pointer rounded-[8px] px-[12px] py-[8px] font-mono text-[14px] font-[400] uppercase leading-[20px] text-white transition-colors duration-300',
        active
          ? 'bg-islamic-primary-green'
          : 'hover:bg-islamic-primary-green/50 bg-transparent',
      )}
      onClick={onClick}
    >
      {locale === 'ar' ? t('arabic') : t('english')}
    </div>
  );
}

function EnFatwa() {
  return (
    <div className="mt-[30px] flex flex-col gap-y-[16px] md:mt-[34px] md:gap-y-[20px] lg:mt-[38px] lg:gap-y-[24px]">
      <Text size="small">
        In the name of Allah, the most compassionate, the most merciful
      </Text>
      <p className="font-alexandria text-[18px] leading-[26px] lg:text-[22px] lg:leading-[32px] xl:text-[24px] xl:leading-[34px]">
        <strong className="font-[700]">
          The Islamic Shariah view on establishing the “HAQQ Chain” network and
          the issuance of its own currency “Islamic Coin”
        </strong>
      </p>
      <Text size="small">
        Praise be to Allah. Prayers and peace be upon our Prophet, Muhammad, his
        family, and all of his companions, and those who followed them with
        goodwill until the day of judgment, and then:
      </Text>
      <Text size="small">
        The Shariah Authority formed for the purpose of giving the legitimate
        Islamic view on establishing the HAQQ Chain” platform (“The Platform”)
        and issuing its currency known as “Islamic Coin”, has held a number of
        meetings until 22/01/2022 A.D. (19/06/1443 Hijri), to review the White
        Paper of The Platform which is a White Paper in Arabic and English that
        lists The Platform’s blockchain-based features, the technical framework
        used to program “Haqq Chain” platform, the objective of The Platform and
        the mechanism used to issue and distribute its currency “Islamic Coin”,
        as well as information on the Evergreen DAO Endowment Fund to be
        established on The Platform.
      </Text>
      <Text size="small">
        After reviewing a detailed presentation of the platform’s workflow by
        its administrators, and their answers to the Authority’s questions on
        this matter, that included the following:
      </Text>
      <Text size="small">
        <ol className="list-decimal pl-[20px] rtl:pr-[20px]">
          <li>
            HAQQ Chain platform will be built using a technical framework that
            is well-known in the blockchain field, which is the Cosmos technical
            framework.
          </li>
          <li>
            The platform will operate on a “Proof of ownership” basis for
            mining, so that users freeze several their currencies to have
            Authority mining according to specific criteria. This method is more
            energy-efficient than the traditional mining method based on “Proof
            of work.”
          </li>
          <li>
            That the main currency used in “HAQQ Chain” platform is the “Islamic
            Coin” currency, and a certain percentage of these currencies will be
            issued exclusively for a limited number of buyers.
          </li>
          <li>
            That 10% of the currencies issued on the platform will be
            automatically converted to the Evergreen DAO Endowment Fund (An
            independent decentralized entity), which is an endowment
            cryptocurrency fund that invests in projects that serve the
            International Islamic community and is subject to the decisions
            voted on by the miners of HAQQ Chain platform.
          </li>
        </ol>
      </Text>
      <Text size="small">
        After thorough review of the structure of the platform and the white
        paper, and what has been shown to the Authority from the blockchain
        technology and the technical framework used in programming “HAQQ Chain”
        platform that is a safe and tested technology through which financial
        transactions are conducted and users’ funds are protected. After
        reflecting on the types of currencies currently available, which are
        summarized in the following types:
      </Text>
      <Text size="small">
        <ol className="list-decimal pl-[20px] rtl:pr-[20px]">
          <li>
            Currencies with no specific purpose behind their issuance other than
            being a store of value and having a price, where the customer aims
            to save, use in purchases and reservations, get wages through and
            pay taxes using them in a number of countries.
          </li>
          <li>
            Currencies issued with the purpose of using them for a particular
            product or on a specific platform, so that it is the official
            currency through which evaluation and purchase of services and
            products provided on those platforms can be made. Some of these
            currencies can become famous and can have an increase in demand that
            it can have the characteristics of type 1 as well.
          </li>

          <li>
            Currencies issued against another financial asset, such as gold,
            dollars, euros, etc. so that the value of the currency is like the
            value of the financial asset against which it is issued.
          </li>

          <li>
            Non-Fungible Tokens, usually symbolized by NFT. These are currencies
            symbolizing the ownership of NFTs for certain assets, images or
            specific property, where the currency owner shall be the owner of
            the asset, image or associated property.
          </li>
        </ol>
      </Text>
      <Text size="small">
        The Authority has seen that these four types of currencies are
        considered significant financial assets whose value changes as supply
        and demand change, and that each of these currencies has its own
        legitimate provisions, which are not subject to consideration by the
        Authority, and that the “Islamic Coin” currency falls under the second
        type mentioned above, and the consideration of the Shariah Authority is
        strictly limited to the currency of “Islamic Coin” disregarding other
        currencies.
      </Text>
      <Text size="small">
        After studying, considering, and discussing, the Authority decided the
        following:
      </Text>
      <Text size="small">
        First: There is no objection to establish the “HAQQ Chain” Platform and
        issuing the “Islamic Coin” based on the following measures:
      </Text>
      <Text size="small">
        <ol className="list-decimal pl-[20px] rtl:pr-[20px]">
          <li>
            Islamic Coin is a financial asset that may be traded by sale and
            purchase and replaced with legitimate services and goods and is
            considered money of its owners that may not be taken away, and Zakat
            must be paid by its owners after purchase or after mining and
            possession according to the Zakat conditions and measures.
          </li>
          <li>
            To check the software code used to build the “HAQQ chain” platform
            at an accredited software audit company, to ensure the integrity of
            the platform and its ability to protect the funds of its customers.
          </li>
          <li>
            Appoint an Authority committee for the Evergreen DAO Endowment Fund
            to ensure the safety of the Fund’s activities.
          </li>
        </ol>
      </Text>

      <Text size="small">
        Second: The Authority confirms that this view is specific to the white
        paper, which includes details of establishing the “Haqq Chain” Platform,
        the issuance of “Islamic Coin” currency and establishing the “Evergreen
        DAO Endowment Fund” excluding other smart products and contracts to be
        built on the platform, and that the relevant Authority should ensure
        that this platform was established in accordance with this Islamic
        Shariah opinion, and that the entity must obtain the Shariah Authority
        approval for new smart products and contracts before launching them.
      </Text>
      <Text size="small">
        Third: This opinion concerns the legitimate aspect, and the Authority
        does not express an opinion on any legal aspects, economic feasibility,
        or the acceptance of the judicial authorities of this view, and the
        concerned parties are responsible for verifying those aspects.
      </Text>
      <Text size="small">
        Fourth: The Authority warns that investing in cryptocurrency products is
        suitable only for qualified investors, because of the risks involved,
        and needs expertise, follow-up and accurate knowledge of these products,
        and those who deals with these must be financially abundant and has
        surplus to their basic needs and has access to the complex technology
        that form the basis of cryptocurrencies and the like.
      </Text>
      <Text size="small">
        The Authority recommends the appointment of an independent forensic
        reviewer to verify the platform’s compliance with the measures contained
        in this document and its annexes.
      </Text>
      <Text size="small">
        Praise be to Allah, the Lord of the Worlds;{' '}
        <strong className="font-[600]">and may His</strong> blessings and peace
        be upon <strong className="font-[600]">our Prophet Muhammad</strong> and
        upon all{' '}
        <strong className="font-[600]">his Family and Companions.</strong>
      </Text>
    </div>
  );
}

function ArFatwa() {
  return (
    <div className="mt-[30px] flex flex-col gap-y-[16px] font-[300] md:mt-[34px] md:gap-y-[20px] lg:mt-[38px] lg:gap-y-[24px]">
      <Text size="small">بسم الله الرحمن الرحيم</Text>

      <p className="font-alexandria text-[18px] leading-[26px] lg:text-[22px] lg:leading-[32px] xl:text-[24px] xl:leading-[34px]">
        <strong className="font-[700]">
          الرأي الشرعي لتأسيس شبكة ’الحق تشين’ وإصدار عملة ’إسلاميك كوين’ الخاصة
          بها
        </strong>
      </p>

      <Text size="small">
        الحمد للّه وحده، والـصـلاة والسلام على نبينـا محمد، وعلى آله وصحبـه، ومن
        تبعهم بإحسـان إلى يـوم الديـن، أما بعد: فإن الهيئة الشرعية المُشكّلة
        لغرض إبداء الرأي الشرعي في تأسيس منصة ’الحق تشين’ (’المنصة’) وإصدار عملة
        ’إسلاميك كوين’ الخاصة بها، قد عقدت عدداً من الاجتماعات كان آخرها بتاريخ
        19/06/1443هـ - 22/01/2022، لغرض الاطلاع على ’الورقة البيضاء’ الخاصة
        بمنصة ’الحق تشين’؛ وهي ورقة محررة باللغتين العربية والإنجليزية تتضمن
        خصائص منصة ’الحق تشين’ المعتمدة على تقنية ’البلوك تشين’، وإطار العمل
        الفني المستخدم في برمجة منصة الحق تشين، والهدف من المنصة وآلية توزيع
        وإصدار عملة ’إسلاميك كوين’ الخاصة بهذه المنصة، بالإضافة إلى معلومات عن
        ’صندوق إيفرجرين داو’ الوقفي الذي سيتم تأسيسه في هذه المنصة.
      </Text>
      <Text size="small">
        وبعد الاطلاع على عرض مفصل لعمل المنصة من القائمين عليها، وإجاباتهم عن
        أسئلة الهيئة بهذا الشأن، وقد تضمن العرض النقاط التالية:
      </Text>
      <Text size="small">
        <ol className="list-decimal pl-[20px] rtl:pr-[20px]">
          <li>
            أن منصة ’الحق تشين’ سيتم بناؤها باستخدام إطار عمل فني معروف في مجال
            ’البلوك تشين’ وهو الإطار الفني المتعلق بلغة ’كوزموس’.
          </li>
          <li>
            أن المنصة ستعمل على أساس ’تأكيد الملكية’ للتعدين، بحيث يُجمّد عدداً
            من عملاتهم لتكون لهم صلاحية التعدين وفق معايير معينة، وتعد هذه
            الطريقة أوفر في استهلاك الطاقة من طريقة التعدين التقليدية التي تقوم
            على أساس ’تأكيد العمل’.
          </li>
          <li>
            أن العملة الرئيسية المستخدمة في منصة ’الحق تشين’ هي عملة ’إسلاميك
            كوين’، وستُطرح نسبة معينة من هذه العملات طرحاً خاصاً على عدد محدود
            من المشترين.
          </li>
          <li>
            أن 10% من العملات المصدرة في المنصة سيتم تحويلها تلقائياً لصندوق
            ’إيفرجين داو’ الوقفي (مؤسسة مستقلة لا مركزية) وهو صندوق عملات مشفرة
            وقفي يستثمر في المشروعات التي تخدم المجتمع الإسلامي دولياً، ويخضع
            الصندوق للقرارات التي يصوت عليها المُعدّنون في منصة ’الحق تشين’.
          </li>
        </ol>
      </Text>
      <Text size="small">
        وبعد التأمل في هيكل المنصة وما تضمنته الورقة البيضاء، وما ظهر للهيئة من
        أن تقنية ’البلوك تشين’ وإطار العمل الفني المستخدم في برمجة منصة ’الحق
        تشين’ تُعد تقنية آمنة مُجرّبة يتم من خلالها إجراء التعاملات المالية وحفظ
        أموال المستخدمين المتعاملين فيها. وبعد التأمل في أنواع العملات المتوفرة
        حالياً، والتي تتلخص في الأنواع الآتية:
      </Text>
      <Text size="small">
        <ol className="list-decimal pl-[20px] rtl:pr-[20px]">
          <li>
            عملات ليس لها هدف معين من إصدارها سوى كونها أثماناً ومخزناً للقيمة،
            ويهدف المتعاملون فيها من الاحتفاظ بها أو استخدامها في مشترياتهم
            وحجوزاتهم والحصول على أجورهم من خلالها ودفع ضرائبهم بها في عدد من
            الدول.
          </li>
          <li>
            عملات يتم إصدارها بهدف التعامل بها في منتج معين أو منصة معينة، بحيث
            تكون هي العملة الرئيسية التي يتم من خلالها تقييم وشراء الخدمات
            والمنتجات المقدمة في تلك المنصة أو البرنامج، وقد تشتهر بعض هذه
            العملات ويزيد الطلب عليها لتحمل خصائص النوع الأول أيضاً.
          </li>
          <li>
            عملات يتم إصدارها بمقابل أصل مالي آخر، كالدولار أو الذهب أو اليورو
            وغير ذلك، بحيث تكون قيمة العملة مماثلة لقيمة الأصل المالي الذي أصدرت
            بناء عليه.
          </li>
          <li>
            عملات الرموز غير قابلة للاستبدال، ويرمز لها عادة ب (Non Fungible
            Tokens)NFT ، هي عملات ترمز إلى ملكية لأصول أو صور أو ممتلكات معينة،
            ويكون مالك العملة مالكاً للأصل أو الصورة أو الممتلكات المرتبطة بها.
          </li>
        </ol>
      </Text>
      <Text size="small">
        وما ظهر للهيئة من أن هذه الأنواع الأربعة من العملات تُعد أصولا مالياً
        معتبرة تتغير قيمتها بتغيير العرض والطلب، وأن لكل نوع من تلك العملات
        أحكامها الشرعية الخاصة بها- التي ليست لها محلاً لنظر الهيئة-، وأن عملة
        ’إسلاميك كوين’ تعد من النوع الثاني من أنواع العملات، وأن نظر الهيئة
        الشرعي يقتصر على عملة ’إسلاميك كوين’ دون غيرها من العملات.
      </Text>
      <Text size="small">
        وبعد الدراسة والنظر والمناقشة قررت الهيئة ما يأتي:
      </Text>
      <Text size="small">
        أولاً: لا مانع من تأسيس ’منصةالحق شين’، وإصدار ’عملة إسلاميك كوين’
        بالضوابط الآتية:
      </Text>
      <Text size="small">
        <ol className="list-decimal pl-[20px] rtl:pr-[20px]">
          <li>
            أن عملة ’إسلاميك كوين’ تعتبر أصلاً مالياً يجوز تداوله بالبيع والشراء
            واستبدالها بالخدمات والسلع المشروعة، كما أنها تعتبر أموالاً لأصحابها
            لا يجوز الاعتداء عليها، وتجب الزكاة بقيمتها على ماليكها بعد شرائها
            أو بعد تعدينها وحيازتها بشروط وضوابط الزكاة.
          </li>
          <li>
            تدقيق الأكواد البرمجية المستخدمة في بناء منصة ’الحق تشين’ لدى شركة
            تدقيق برمجي معتمدة، وذلك للتأكد من سلامة المنصة وقدرتها على حماية
            أموال المتعاملين فيها.
          </li>
          <li>
            تعيين لجنة نظارة على صندوق ’إيفرجين داو’ الوقفي للتأكد من سلامة
            أنشطة الصندوق.
          </li>
        </ol>
      </Text>
      <Text size="small">
        ثانياً: تؤكد الهيئة أن هذا الرأي خاص بالورقة البيضاء التي تتضمن تفاصيل
        إنشاء ’منصة الحق تشين’ وإصدار عملة ’إسلاميك كوين’ وتأسيس صندوق ’إيفرجين
        داو الوقفي’ دون غيره من المنتجات والعقود الذكية التي ستبنى على المنصة،
        وأن على الجهة المعنية التأكد من أن تأسيس المنصة قد تم وفقاً لهذا الرأي
        الشرعي، كما يجب الحصول على موافقة الهيئة الشرعية في أي منتجات وعقود ذكية
        جديدة قبل إطلاقها.
      </Text>
      <Text size="small">
        ثالثاً: يختص هذا الرأي بالجانب الشرعي، ولا تبدي الهيئة رأياً في الجوانب
        القانونية أو الجدوى الاقتصادية أو قبول الجهات القضائية لهذا الرأي، وعلى
        أطراف التعامل مسؤولية التحقق من ذلك.
      </Text>
      <Text size="small">
        رابعاً: تنبه الهيئة أن الاستثمار في منتجات العملات الرقمية لا تصلح إلا
        للمستثمرين المؤهلين، لما يكتنفها من مخاطر، كما أنها تحتاج إلى خبرة
        ومتابعة و معرفة دقيقة بهذه المنتجات، فعلى من يدخل فيها أن يكون من ذوي
        الوفرة المالية الفائضة عن حاجاته الأساسية، ومن ذوي الاطلاع على التقنيات
        المعقدة التي تكون أساس العملات المشفرة وما يشبهها. هذا وتوصي الهيئة
        بتعيين مراجع شرعي مستقل للتحقق من التزام المنصة بالضوابط الواردة في هذا
        القرار ومرفقاته. وصلى الله وسلم على نبينا محمد وعلى آله وصحبه.
      </Text>
      <Text size="small" className="font-[600]">
        الهيئة الشرعية د. نظام صالح يعقوبي، د. محمد عبد الحكيم محمد، الشيخ محمد
        فتح الدين بيانوني، د. عصام خلف العنزي، الشيخ محمود محمد زعير.
      </Text>
    </div>
  );
}

function Autograph({ name, image }: { name: string; image: StaticImageData }) {
  return (
    <div className="flex w-fit flex-col items-start justify-between gap-y-[8px] md:gap-y-[12px]">
      <span className="rtl:font-handjet font-mono text-[12px] uppercase leading-[18px] md:text-[13px] md:leading-[20px] lg:text-[14px]">
        {name}
      </span>
      <div className="relative h-[62px] w-[170px]">
        <Image src={image.src} alt={name} fill />
      </div>
    </div>
  );
}

function AutographsBlock() {
  const t = useTranslations('shariah-page');
  return (
    <div className="mt-[28px] flex flex-col gap-y-[20px] md:mt-[32px] lg:mt-[36px]">
      <h4 className="rtl:font-handjet font-mono text-[17px] uppercase leading-[26px] md:text-[18px] lg:text-[20px] lg:leading-[28px]">
        {t('autographs-block.title')}
      </h4>

      <div className="grid grid-cols-1 gap-x-[32px] gap-y-[20px] sm:grid-cols-2">
        <Autograph
          image={fatwaSign1}
          name={t('autographs-block.members.first')}
        />
        <Autograph
          image={fatwaSign2}
          name={t('autographs-block.members.second')}
        />
        <Autograph
          image={fatwaSign3}
          name={t('autographs-block.members.third')}
        />
        <Autograph
          image={fatwaSign4}
          name={t('autographs-block.members.fourth')}
        />
        <Autograph
          image={fatwaSign5}
          name={t('autographs-block.members.fifth')}
        />
      </div>
    </div>
  );
}

export function FatwaBlock({ locale }: { locale: localeType }) {
  const [lang, setLang] = useState<localeType>(locale);

  const t = useTranslations('shariah-page');

  return (
    <div>
      <h2 className="text-[22px] font-[600] leading-[24px] md:text-[32px] md:leading-[36px] lg:text-[48px] lg:leading-[54px]">
        {t('fatwa-block.title')}
      </h2>

      <div className="mt-[16px] md:mt-[20px] lg:mt-[24px]">
        <Text size="small">{t('fatwa-block.subtitle')}</Text>
      </div>

      <div className="mt-[24px] flex gap-x-[16px] md:mt-[28px] lg:mt-[32px]">
        <DownloadPDFButton language="en" url="/assets/fatwa-en.pdf" />
        <DownloadPDFButton language="ar" url="/assets/fatwa-ar.pdf" />
      </div>

      <div className="mt-[40px] flex w-fit items-center gap-x-[8px] rounded-[10px] bg-[#2F2F2F] p-[6px] md:mt-[48px] lg:mt-[60px]">
        <LangButton
          active={lang === 'en'}
          locale="en"
          onClick={() => {
            setLang('en');
          }}
        />
        <LangButton
          active={lang === 'ar'}
          locale="ar"
          onClick={() => {
            setLang('ar');
          }}
        />
      </div>

      {lang === 'en' ? <EnFatwa /> : <ArFatwa />}

      <AutographsBlock />
    </div>
  );
}
