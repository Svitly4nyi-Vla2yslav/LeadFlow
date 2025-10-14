import React from 'react';
import { AboutContainer } from './AboutUs.styled';
import { TeamMember } from '../../components/AboutUS/TeamMember/TeamMember';
import { Hero } from '../../components/AboutUS/Hero/Hero';
import OurMission from '../../components/AboutUS/OurMission/OurMission';
import ValuesSection from '../../components/AboutUS/ValuesSection/ValuesSection';
import TeamSection from '../../components/AboutUS/TeamSection/TeamSection';

const AboutUs: React.FC = () => {
  return (
    <AboutContainer>
      <Hero />
      <OurMission />
      <ValuesSection />
      <TeamSection />
      <TeamMember />
    </AboutContainer>
  );
};

export default AboutUs;
