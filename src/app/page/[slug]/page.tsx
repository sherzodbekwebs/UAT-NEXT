import PageSwitcher from './PageSwitcher';
import { Metadata } from 'next';

const SITE_URL = 'https://uzautotrailer.uz';

// 1. Build vaqtida barcha sluglar uchun sahifa yaratishni aytamiz
export async function generateStaticParams() {
  const slugs = [
    'general_information',
    'history',
    'mission_vision',
    'affiliated_companies',
    'registration_and_trademark_information',
    'compliance_policy',
    'achievements_and_awards',
    'careers',
    'quality_management',
    'quality_policy',
    'quality_awards',
    'technologies',
    'design_bureau'
  ];

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// 2. Professional SEO Metadata (Rus tilida har bir slug uchun alohida)
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  // Sluglarni professional ruscha nomlarga xaritalaymiz
  const slugTitles: { [key: string]: string } = {
    general_information: 'Общая информация о компании',
    history: 'История развития завода',
    mission_vision: 'Миссия и видение компании',
    affiliated_companies: 'Аффилированные компании',
    registration_and_trademark_information: 'Регистрация и товарные знаки',
    compliance_policy: 'Политика соответствия (Комплаенс)',
    achievements_and_awards: 'Достижения и официальные награды',
    careers: 'Карьера и вакансии в UzAuto TRAILER',
    quality_management: 'Система менеджмента качества',
    quality_policy: 'Политика в области качества',
    quality_awards: 'Награды в области качества',
    technologies: 'Производственные технологии',
    design_bureau: 'Конструкторское бюро завода'
  };

  const title = slugTitles[slug] || 'О компании';
  const pageTitle = `${title} | UzAuto TRAILER — Официальный сайт`;

  return {
    title: pageTitle,
    description: `Подробная информация о разделе "${title}" завода UzAuto TRAILER. Узнайте больше о нашей деятельности, стандартах качества и истории развития крупнейшего производителя спецтехники в Узбекистане.`,
    alternates: {
      canonical: `${SITE_URL}/page/${slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: `Раздел "${title}" официального сайта UzAuto TRAILER.`,
      url: `${SITE_URL}/page/${slug}`,
      siteName: 'UzAuto TRAILER',
      images: ['https://uzautotrailer.uz/uzbg1.png'],
      locale: 'ru_RU',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

// 3. Sahifa komponenti
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <PageSwitcher slug={resolvedParams.slug} />;
}