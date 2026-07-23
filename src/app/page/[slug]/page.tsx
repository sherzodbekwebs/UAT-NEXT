import PageSwitcher from './PageSwitcher'; // Switcher-ni alohida faylga olamiz

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

export default function Page({ params }: { params: { slug: string } }) {
  return <PageSwitcher params={params} />;
}