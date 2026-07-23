"use client";

import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DynamicPage from '@/components/DynamicPage/DynamicPage';

// Statik komponentlarni import qilish (Yo'llarni sidebaringizga qarab yozdim)
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




export default function PageSwitcher({ params }: { params: { slug: string } }) {
  const { lang } = useLanguage();
  const slug = params.slug;

  // Navbar linklaridagi sluglarga qarab komponentni tanlash
  switch (slug) {
    case 'general_information':
      return <GeneralInfo lang={lang} />;
    case 'history':
      return <CompanyHistory lang={lang} />;
    case 'mission_vision':
      return <MissionVision lang={lang} />;
    case 'affiliated_companies':
      return <AffiliatedCompanies lang={lang} />;
    case 'registration_and_trademark_information':
      return <RegistrationInfo lang={lang} />;
    case 'compliance_policy':
      return <Compliance lang={lang} />;
    case 'achievements_and_awards':
      return <Achievements lang={lang} />;
    case 'careers':
      return <Careers lang={lang} />;
    case 'quality_management':
      return <QualityManagement lang={lang} />;
    case 'quality_policy':
      return <QualityPolicy lang={lang} />;
    case 'quality_awards':
      return <QualityAwards lang={lang} />;
    case 'technologies':
      return <Technologies lang={lang} />;
    case 'design_bureau':
      return <DesignBureau lang={lang} />;

    default:
      // Agar yuqoridagilarning birortasi bo'lmasa, API-dan (DynamicPage) qidiradi
      return <DynamicPage slug={slug} lang={lang} />;
  }
}