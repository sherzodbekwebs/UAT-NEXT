import PageSwitcher from './PageSwitcher';

// 1. Vercelga build vaqtida mana shu sluglar uchun sahifa yaratishni aytamiz
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

// 2. Paramsni qabul qilamiz va Switcherga uzatamiz
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <PageSwitcher slug={resolvedParams.slug} />;
}