import CasesSection from '../../components/CasesSection/CasesSection';
import { ContactForm } from '../../components/ContactComponents/ContactForm';
import ReviewCardContainer from '../../components/Feedback/Feedback';
import { Hero } from '../../components/Hero/Hero';
import NewsAndTips from '../../components/News&Tips/News&Tips';
import Partners from '../../components/PartnersBanner/PartnersBanner';
import ServicesSection from '../../components/ServicesSection/ServicesSection';
import ServingVentura from '../../components/ServingVentura/ServingVentura';
import WhyAirtexnoSection from '../../components/WhyAirtexnoSection/WhyAirtexnoSection';

import { HomeContainer } from './HomePage.styled';
import React from 'react';

const Home: React.FC = () => {
  return (
    <>
      <HomeContainer id="hero">
        <Hero />
        <ServicesSection />
        <WhyAirtexnoSection />
        <CasesSection/>
        <ServingVentura/>
        <Partners/>
        <ReviewCardContainer/>
        <NewsAndTips /> 
        <ContactForm/>
      </HomeContainer>
    </>
  );
};

export default Home;
