import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView, easeOut } from 'framer-motion';
import ServicesImage from '../../assets/icons/1.webp';
import {
  Section,
  SmallText,
  ContentWrapper,
  ServiceBlock,
  TitleRow,
  TitleBlue,
  Title,
  ServiceImage,
  InfoBlock,
  InfoText,
  ButtonText,
  Button,
  ButtonRow,
  ButtonTextBlack,
  ButtonTextWhite,
  Container,
  Description,
  HeaderWrapper,
  PrimaryButton,
  SecondaryButton,
  TextBlock,
  ImageSection,
  TitleCard,
} from './ServicesSection.styled';
import { useMediaQuery } from 'react-responsive';

// Анімаційні варіанти - оптимізовані для мобільних пристроїв
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

const fadeInLeft = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: easeOut,
    },
  },
};

const fadeInRight = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: easeOut,
    },
  },
};

const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: easeOut,
    },
  },
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ServicesSection: React.FC = () => {
  const isDesktop = useMediaQuery({ query: '(min-width: 1440px)' });
  const [hasAnimated, setHasAnimated] = useState(false);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-20%' });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  // Анімації для паралакс ефекту - обмежена для мобільних пристроїв
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 300], [0, isDesktop ? -50 : -20], {
    clamp: false,
  });

  return (
    <Section ref={sectionRef}>
      <motion.div initial='hidden' animate={hasAnimated ? 'visible' : 'hidden'} variants={fadeInUp}>
        <SmallText>Our Service</SmallText>
      </motion.div>

      <ContentWrapper>
        <ServiceBlock>
          <motion.div
            initial='hidden'
            animate={hasAnimated ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInLeft}>
              <TitleRow>
                <TitleBlue>Refrigerator Repair </TitleBlue>
              </TitleRow>
            </motion.div>

            <motion.div variants={fadeInLeft}>
              <Title>& Maintenance</Title>
            </motion.div>
          </motion.div>

          {isDesktop && (
            <motion.div
              initial='hidden'
              animate={hasAnimated ? 'visible' : 'hidden'}
              variants={fadeInUp}
            >
              <InfoBlock>
                <InfoText>Do you want to know more about our service?</InfoText>
                <Button to='/fridge#ap'>
                  <ButtonText>Learn more</ButtonText>
                </Button>
              </InfoBlock>
            </motion.div>
          )}
        </ServiceBlock>

        <ImageSection>
          <motion.div
            style={{ y: imageY }}
            initial='hidden'
            animate={hasAnimated ? 'visible' : 'hidden'}
            variants={scaleIn}
          >
            <ServiceImage src={ServicesImage} alt='Services Image' loading='lazy' />
          </motion.div>

          <motion.div
            initial='hidden'
            animate={hasAnimated ? 'visible' : 'hidden'}
            variants={fadeInRight}
          >
            <Container>
              <HeaderWrapper>
                <motion.div variants={fadeInRight}>
                  <TitleRow>
                    <TitleCard>Regular Maintenance Matters</TitleCard>
                  </TitleRow>
                </motion.div>

                <motion.div variants={fadeInRight}>
                  <TextBlock>
                    <Description>
                      Most refrigerator problems happen because regular service is skipped. Keep
                      your fridge running longer and more efficiently with routine maintenance.
                      Proudly serving Thousand Oaks & nearby cities
                    </Description>
                  </TextBlock>
                </motion.div>
              </HeaderWrapper>

              <motion.div variants={fadeInRight}>
                <ButtonRow>
                  <PrimaryButton to='/contact#ap'>
                    <ButtonTextWhite>Contact Us</ButtonTextWhite>
                  </PrimaryButton>
                  <SecondaryButton>
                    <a href='tel:+18055002705'>
                      <ButtonTextBlack>Call Us</ButtonTextBlack>
                    </a>
                  </SecondaryButton>
                </ButtonRow>
              </motion.div>
            </Container>
          </motion.div>
        </ImageSection>

        {!isDesktop && (
          <motion.div
            initial='hidden'
            animate={hasAnimated ? 'visible' : 'hidden'}
            variants={fadeInUp}
          >
            <InfoBlock>
              <InfoText>Do you want to know more about our service?</InfoText>
              <Button to='/fridge#ap'>
                <ButtonText>Learn more</ButtonText>
              </Button>
            </InfoBlock>
          </motion.div>
        )}
      </ContentWrapper>
    </Section>
  );
};

export default ServicesSection;
