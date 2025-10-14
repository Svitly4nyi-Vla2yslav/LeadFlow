import React from 'react';
import { motion, useScroll, useTransform, easeOut } from 'framer-motion';
import ServicesImage from '../../../assets/icons/ServicesImage.png';
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
  Number,
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

const ServicesSection: React.FC = () => {
  const isDesktop = useMediaQuery({ query: '(min-width: 1440px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const { scrollY } = useScroll();

  // Спрощені паралакс ефекти для мобільних пристроїв
  const y = useTransform(scrollY, [0, 500], [0, isMobile ? 50 : 100]);
  const rotate = useTransform(scrollY, [0, 800], [0, isMobile ? -1 : -2]);
  const scale = useTransform(scrollY, [0, 400], [1, isMobile ? 1.02 : 1.05]);

  // Спрощені анімаційні варіанти для кращої продуктивності на мобільних
  const floatingAnimation = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
        delay: 0.1,
      },
    },
  };

  const numberGlowAnimation = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  const textRevealAnimation = {
    hidden: {
      opacity: 0,
      x: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  const cardFlipAnimation = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: easeOut,
      },
    },
  };

  const buttonPulseAnimation = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: easeOut,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.97,
    },
  };

  const image3DEffect = {
    hidden: {
      opacity: 0,
      scale: 1.1,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: easeOut,
      },
    },
  };

  return (
    <Section id='all'>
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        variants={textRevealAnimation}
      >
        <SmallText>Our Service</SmallText>
      </motion.div>

      <ContentWrapper>
        <ServiceBlock>
          <TitleRow>
            <motion.div
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.2 }}
              variants={numberGlowAnimation}
            >
              <Number>01.</Number>
            </motion.div>

            <motion.div
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.2 }}
              variants={textRevealAnimation}
              transition={{ delay: 0.1 }}
            >
              <TitleBlue>Appliance Care & Tune-Ups</TitleBlue>
            </motion.div>
          </TitleRow>

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            variants={textRevealAnimation}
            transition={{ delay: 0.2 }}
          >
            <Title>Professional Installations</Title>
          </motion.div>

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            variants={textRevealAnimation}
            transition={{ delay: 0.3 }}
          >
            <Title>Fast & Reliable Emergency Repairs</Title>
          </motion.div>

          {isDesktop && (
            <InfoBlock>
              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.2 }}
                variants={textRevealAnimation}
                transition={{ delay: 0.4 }}
              >
                <InfoText>Do you want to know more about our service?</InfoText>
              </motion.div>

              <motion.div variants={buttonPulseAnimation} whileTap='tap'>
                <Button to='/fridge#ap'>
                  <ButtonText>Learn more</ButtonText>
                </Button>
              </motion.div>
            </InfoBlock>
          )}
        </ServiceBlock>

        <ImageSection>
          <motion.div
            style={{ y, rotate, scale }}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            variants={image3DEffect}
          >
            <ServiceImage src={ServicesImage} alt='Services Image' />
          </motion.div>

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            variants={cardFlipAnimation}
          >
            <Container>
              <HeaderWrapper>
                <TitleRow>
                  <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.2 }}
                    variants={textRevealAnimation}
                  >
                    <TitleCard>Preventive Care</TitleCard>
                  </motion.div>
                </TitleRow>

                <TextBlock>
                  <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.2 }}
                    variants={textRevealAnimation}
                    transition={{ delay: 0.1 }}
                  >
                    <Description>
                      Preventive Care to Keep Your Appliances Running Longer Regular maintenance
                      keeps your appliances working smoothly, prevents costly breakdowns, and
                      extends their lifespan. We take the time to inspect and fine-tune your
                      appliances, so they perform at their best and last longer.
                    </Description>
                  </motion.div>
                </TextBlock>
              </HeaderWrapper>

              <ButtonRow>
                <motion.div variants={buttonPulseAnimation} whileTap='tap'>
                  <PrimaryButton to='/contact#ap'>
                    <ButtonTextWhite>Contact Us</ButtonTextWhite>
                  </PrimaryButton>
                </motion.div>

                <motion.div
                  variants={buttonPulseAnimation}
                  whileTap='tap'
                  transition={{ delay: 0.05 }}
                >
                  <SecondaryButton>
                    <a href='tel:+18055002705'>
                      <ButtonTextBlack>Call Us</ButtonTextBlack>
                    </a>
                  </SecondaryButton>
                </motion.div>
              </ButtonRow>
            </Container>
          </motion.div>
        </ImageSection>

        {!isDesktop && (
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            variants={floatingAnimation}
          >
            <InfoBlock>
              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.2 }}
                variants={textRevealAnimation}
              >
                <InfoText>Do you want to know more about our service?</InfoText>
              </motion.div>

              <motion.div variants={buttonPulseAnimation} whileTap='tap'>
                <Button to='/fridge#ap'>
                  <ButtonText>Learn more</ButtonText>
                </Button>
              </motion.div>
            </InfoBlock>
          </motion.div>
        )}
      </ContentWrapper>
    </Section>
  );
};

export default ServicesSection;