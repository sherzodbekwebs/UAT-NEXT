"use client";

import { useLanguage } from '@/context/LanguageContext';
import DynamicPage from '@/components/DynamicPage/DynamicPage';

// Komponentlarni import qilish
import GeneralInfo from '@/components/GeneralInfo/GeneralInfo';
import CompanyHistory from '@/components/History/History';
import MissionVision from '@/components/MissionVision/MissionVision';
import AffiliatedCompanies from '@/components/AffiliatedCompanies/AffiliatedCompanies';
import RegistrationInfo from '@/components/RegistrationInfo/RegistrationInfo';
import Compliance from '@/components/Compliance/Compliance';
import Careers from '@/components/Careers/Careers';
import Achievements from '@/components/Achievements/Achievements';
import QualityManagement from '@/components/QualityManagement/QualityManagement';
import QualityPolicy from '@/components/QualityPolicy/QualityPolicy';
import QualityAwards from '@/components/QualityAwards/QualityAwards';
import Technologies from '@/components/Technologies/Technologies';
import DesignBureau from '@/components/DesignBureau/DesignBureau';

// { slug } prop-ni qabul qilishini yozing
export default function PageSwitcher({ slug }: { slug: string }) {
  const { lang } = useLanguage();

  switch (slug) {
    case 'general_information': return <GeneralInfo lang={lang} />;
    case 'history': return <CompanyHistory lang={lang} />;
    case 'mission_vision': return <MissionVision lang={lang} />;
    case 'affiliated_companies': return <AffiliatedCompanies lang={lang} />;
    case 'registration_and_trademark_information': return <RegistrationInfo lang={lang} />;
    case 'compliance_policy': return <Compliance lang={lang} />;
    case 'achievements_and_awards': return <Achievements lang={lang} />;
    case 'careers': return <Careers lang={lang} />;
    case 'quality_management': return <QualityManagement lang={lang} />;
    case 'quality_policy': return <QualityPolicy lang={lang} />;
    case 'quality_awards': return <QualityAwards lang={lang} />;
    case 'technologies': return <Technologies lang={lang} />;
    case 'design_bureau': return <DesignBureau lang={lang} />;
    default: return <DynamicPage slug={slug} lang={lang} />;
  }
}