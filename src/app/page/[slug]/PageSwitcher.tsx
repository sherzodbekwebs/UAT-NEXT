"use client";

import React from 'react';
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

interface PageSwitcherProps {
  slug: string;
}

export default function PageSwitcher({ slug }: PageSwitcherProps) {
  const { lang } = useLanguage();

  // Rus tiliga fokuslangan bo'lsangiz, lang har doim to'g'ri uzatilayotganini tekshiring
  // Agar lang aniqlanmasa 'ru' standart qilib belgilanishi tavsiya etiladi
  const currentLang = lang || 'ru';

  switch (slug) {
    case 'general_information': 
      return <GeneralInfo lang={currentLang} />;
    case 'history': 
      return <CompanyHistory lang={currentLang} />;
    case 'mission_vision': 
      return <MissionVision lang={currentLang} />;
    case 'affiliated_companies': 
      return <AffiliatedCompanies lang={currentLang} />;
    case 'registration_and_trademark_information': 
      return <RegistrationInfo lang={currentLang} />;
    case 'compliance_policy': 
      return <Compliance lang={currentLang} />;
    case 'achievements_and_awards': 
      return <Achievements lang={currentLang} />;
    case 'careers': 
      return <Careers lang={currentLang} />;
    case 'quality_management': 
      return <QualityManagement lang={currentLang} />;
    case 'quality_policy': 
      return <QualityPolicy lang={currentLang} />;
    case 'quality_awards': 
      return <QualityAwards lang={currentLang} />;
    case 'technologies': 
      return <Technologies lang={currentLang} />;
    case 'design_bureau': 
      return <DesignBureau lang={currentLang} />;
    default: 
      // Agar kiritilgan slug mavjud bo'lmasa, API orqali dinamik sahifani qidiradi
      return <DynamicPage slug={slug} lang={currentLang} />;
  }
}