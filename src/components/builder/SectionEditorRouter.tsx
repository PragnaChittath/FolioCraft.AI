import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProfileEditor } from './editors/ProfileEditor';
import { AboutEditor } from './editors/AboutEditor';
import { ProjectsEditor } from './editors/ProjectsEditor';
import { SkillsEditor } from './editors/SkillsEditor';
import { ExperienceEditor } from './editors/ExperienceEditor';
import {
  InternshipsEditor,
  EducationEditor,
  CertificationsEditor,
  CodingProfilesEditor,
  SocialLinksEditor,
  ContactEditor,
} from './editors/OtherEditors';
import { CustomSectionEditor } from './editors/CustomSectionEditor';
import { ThemeCustomizer } from './ThemeCustomizer';

export const SectionEditorRouter: React.FC = () => {
  const { activeSection } = usePortfolio();

  if (activeSection.startsWith('custom-')) {
    return <CustomSectionEditor sectionId={activeSection} />;
  }

  switch (activeSection) {
    case 'theme':
      return <ThemeCustomizer />;
    case 'profile':
      return <ProfileEditor />;
    case 'about':
      return <AboutEditor />;
    case 'projects':
      return <ProjectsEditor />;
    case 'skills':
      return <SkillsEditor />;
    case 'experience':
      return <ExperienceEditor />;
    case 'internships':
      return <InternshipsEditor />;
    case 'education':
      return <EducationEditor />;
    case 'certifications':
      return <CertificationsEditor />;
    case 'codingProfiles':
      return <CodingProfilesEditor />;
    case 'socialLinks':
      return <SocialLinksEditor />;
    case 'contact':
      return <ContactEditor />;
    default:
      return <ProfileEditor />;
  }
};
