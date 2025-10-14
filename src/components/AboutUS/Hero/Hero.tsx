import React from 'react';
import { motion, useScroll, useTransform, easeOut, circOut } from 'framer-motion';
import {
  HeroContainer,
  HeroImage,
  ContentWrapper,
  TextBlock,
  HeroTitle,
  HeroSubtitle,
} from './Hero.styled';
import HeroImages from '../../../assets/icons/about/HeroImage2About.png';

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();

  // Паралакс ефекти для зображення
  const yImage = useTransform(scrollY, [0, 500], [0, 150]);
  const scaleImage = useTransform(scrollY, [0, 400], [1, 1.1]);
  const rotateImage = useTransform(scrollY, [0, 600], [0, -3]);

  // Паралакс для тексту
  const yText = useTransform(scrollY, [0, 300], [0, 50]);
  const opacityText = useTransform(scrollY, [0, 200], [1, 0.8]);

  const titleTypewriterEffect = {
    hidden: {
      opacity: 0,
      x: -100,
      skewX: 15,
    },
    visible: {
      opacity: 1,
      x: 0,
      skewX: 0,
      transition: {
        duration: 1.2,
        ease: easeOut,
        delay: 0.5,
      },
    },
  };

  const subtitleScanEffect = {
    hidden: {
      opacity: 0,
      y: 50,
      scaleY: 0,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: circOut,
        delay: 0.8,
      },
    },
  };

  const contentFloatEffect = {
    hidden: {
      opacity: 0,
      y: 80,
      rotateX: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 1,
        ease: circOut,
        delay: 0.3,
      },
    },
  };

  // Ефект частинок (можна реалізувати через псевдоелементи або додаткові div)
  const particleEffect = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 360,
      transition: {
        duration: 1.5,
        ease: easeOut,
        delay: 1,
      },
    },
  };

  return (
    <HeroContainer id='ap'>
      {/* Ефект частинок */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '8px',
          height: '8px',
          // background: 'rgba(48, 152, 238, 0.6)',
          borderRadius: '50%',
          zIndex: 2,
        }}
        variants={particleEffect}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      />

      <motion.div
        style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '12px',
          height: '12px',
          // background: 'rgba(48, 152, 238, 0.4)',
          borderRadius: '50%',
          zIndex: 2,
        }}
        variants={particleEffect}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.5 }}
      />

      <motion.div
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '20%',
          width: '6px',
          height: '6px',
          // background: 'rgba(48, 152, 238, 0.3)',
          borderRadius: '50%',
          zIndex: 2,
        }}
        variants={particleEffect}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.8 }}
      />

      <motion.div
        style={{
          y: yImage,
          scale: scaleImage,
          rotate: rotateImage,
        }}
      >
        <HeroImage src={HeroImages} alt='Hero Image' />
      </motion.div>

      <motion.div
        style={{
          y: yText,
          opacity: opacityText,
        }}
      >
        <ContentWrapper>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={contentFloatEffect}
          >
            <TextBlock>
              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.3 }}
                variants={subtitleScanEffect}
              >
                <HeroSubtitle>About Our Company and Team</HeroSubtitle>
              </motion.div>

              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.3 }}
                variants={titleTypewriterEffect}
              >
                <HeroTitle>Fast, affordable, and trusted service</HeroTitle>
              </motion.div>
            </TextBlock>
          </motion.div>
        </ContentWrapper>
      </motion.div>

      {/* Додаткові декоративні елементи */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '2px',
          height: '100px',
          // background: 'linear-gradient(to bottom, transparent, #3098EE, transparent)',
          zIndex: 2,
        }}
        initial={{ opacity: 0, height: 0 }}
        whileInView={{ opacity: 1, height: 100 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, delay: 1.2 }}
      />

      <motion.div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: '100px',
          height: '2px',
          // background: 'linear-gradient(to right, transparent, #3098EE, transparent)',
          zIndex: 2,
        }}
        initial={{ opacity: 0, width: 0 }}
        whileInView={{ opacity: 1, width: 100 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, delay: 1.5 }}
      />
    </HeroContainer>
  );
};
