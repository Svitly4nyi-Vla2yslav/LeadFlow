import React, { useRef } from 'react';
import { motion, useScroll, useTransform, easeOut } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import image1 from '../../assets/icons/Dryer/image1.jpg';
import image2 from '../../assets/icons/Dryer/image2.jpg';
import image3 from '../../assets/icons/Dryer/image3.jpg';
import image4 from '../../assets/icons/Dryer/image4.jpg';
import image5 from '../../assets/icons/Dryer/image5.jpg';
import image6 from '../../assets/icons/Dryer/image6.png'; // Приклад

import { Autoplay, Navigation } from 'swiper/modules';
import { useMediaQuery } from 'react-responsive';

// Дані для слайдів
const slides = [
  {
    img: image1,
    title: 'COMMERCIAL DRYERS',
    description:
      'Commercial dryers are built for heavy loads and frequent use. We provide expert repair for laundromats, hotels, and other businesses to keep operations running smoothly.',
  },
  {
    img: image2,
    title: 'STACKABLE DRYERS',
    description:
      'Stackable dryers are popular for apartments and condos. We fix motor problems, belts, sensors, and any mechanical issues.',
  },
  {
    img: image3,
    title: 'HEAT PUMP & VENTLESS DRYERS',
    description:
      'Modern ventless and heat pump dryers are energy-efficient but require expert care. We handle refrigerant, compressor, and airflow problems.',
  },
  {
    img: image4,
    title: 'WASHER-DRYER COMBO UNITS',
    description:
      'Washer-dryer combos save space but can be complex to repair. We specialize in diagnosing drum, pump, and control board issues.',
  },
  {
    img: image5,
    title: 'GAS DRYERS',
    description:
      'Gas dryers are efficient but require special expertise to service safely. Our team handles gas valve issues, ignition problems, and venting concerns.',
  },
  // Додаємо нові типи холодильників
  {
    img: image6,
    title: 'ELECTRIC DRYERS',
    description:
      'Electric dryers are common in most homes and are easy to install. We quickly diagnose and repair heating issues, wiring problems, and control malfunctions.',
  },
];

const DryerTypes: React.FC = () => {
  const swiperRef = useRef<any>(null);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1439px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1440px)' });

  const slidesPerView = isMobile ? 1 : isTablet ? 2 : isDesktop ? 4 : 2;
  const shouldLoop = slides.length > slidesPerView;

  const { scrollY } = useScroll();

  // Спрощені паралакс ефекти
  const titleY = useTransform(scrollY, [0, 500], [0, 80]);
  const titleScale = useTransform(scrollY, [0, 300], [1, 1.05]);

  // Спрощені анімаційні варіанти
  const frostEffect = {
    hidden: {
      opacity: 0,
      scale: 0.9,
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

  const iceSlideAnimation = {
    hidden: {
      opacity: 0,
      y: 30,
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

  const coolContentReveal = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  const chillButtonEffect = {
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
  };

  const titleFreezeAnimation = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: easeOut,
      },
    },
  };

  return (
    <Wrapper>
      <motion.div
        style={{ y: titleY, scale: titleScale }}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={titleFreezeAnimation}
      >
        <HeaderSection>
          <Subtitle>Dryer Repair</Subtitle>
          <Title>
            WE REPAIR <span> ALL MAJOR DRYER </span> BRANDS AND MODELS.
          </Title>
        </HeaderSection>
      </motion.div>

      <SwiperContainer>
        <Swiper
          modules={[Navigation, Autoplay]}
          onSwiper={swiper => (swiperRef.current = swiper)}
          spaceBetween={20}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            waitForTransition: true,
            pauseOnMouseEnter: true,
          }}
          speed={600}
          loop={shouldLoop}
          slidesPerView={slidesPerView}
          centeredSlides={isMobile}
          touchRatio={1.5}
          touchAngle={45}
          simulateTouch={true}
          allowTouchMove={true}
          resistance={true}
          resistanceRatio={0.85}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.2 }}
                variants={iceSlideAnimation}
              >
                <Card>
                  <motion.div variants={frostEffect}>
                    <Image src={slide.img} alt={slide.title} loading='lazy' decoding='async' />
                  </motion.div>

                  <motion.div variants={coolContentReveal}>
                    <CardText>
                      <CardTitle>{slide.title}</CardTitle>
                      <CardDescription>{slide.description}</CardDescription>
                    </CardText>
                  </motion.div>
                </Card>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        <NavigationContainer>
          <motion.div
            variants={chillButtonEffect}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
          >
            <NavButton onClick={() => swiperRef.current?.slidePrev()}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M15 18L9 12L15 6'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </NavButton>
          </motion.div>

          <motion.div
            variants={chillButtonEffect}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1 }}
          >
            <NavButton onClick={() => swiperRef.current?.slideNext()}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M9 18L15 12L9 6'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </NavButton>
          </motion.div>
        </NavigationContainer>
      </SwiperContainer>
    </Wrapper>
  );
};

export default DryerTypes;

// ================= styled-components =================

const SwiperContainer = styled.div`
  width: 100%;
  padding: 20px 0;

  .swiper-slide {
    width: 100%;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .swiper-slide:active {
    cursor: grabbing;
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export const NavigationContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
  width: 100%;
  justify-content: flex-end;
`;

export const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background-color: #dbdbd8;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  touch-action: manipulation;

  &:hover,
  &:focus,
  &:active {
    background-color: #3098ee;
    animation: ${pulseAnimation} 0.6s ease;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 767px) {
    width: 44px;
    height: 44px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  overflow: hidden;
  margin: 0 auto;
  padding: 0 16px;

  @media screen and (min-width: 768px) {
    padding: 0 32px;
  }

  @media screen and (min-width: 1440px) {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 60px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const Subtitle = styled.p`
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 14px;
  line-height: 90%;
  text-transform: uppercase;
  color: var(--black-500);

  @media screen and (min-width: 768px) {
    font-size: 17px;
  }
`;

const Title = styled.p`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 52px;
  line-height: 90%;
  color: var(--black-500);

  span {
    color: var(--blue-500);
  }

  @media screen and (min-width: 768px) {
    font-size: 72px;
    min-width: 750px;

    span {
      font-size: 72px;
    }
  }

  @media (max-width: 767px) {
    font-size: 32px;

    span {
      font-size: 32px;
    }
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: fit-content;
  margin: 0 auto;
  position: relative;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  @media screen and (min-width: 768px) {
    max-width: 322px;
  }

  @media screen and (min-width: 1440px) {
    width: fit-content;
  }
`;

const Image = styled.img`
  border-radius: 8px;
  width: 100%;
  height: auto;
  aspect-ratio: 2/3;
  object-fit: cover;
  transition: all 0.3s ease;

  @media (max-width: 767px) {
    max-width: 100%;
    height: auto;
  }
`;

const CardText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: absolute;
  bottom: 1px;
  background: var(--white);
  padding: 12px;
  margin: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  width: calc(100% - 16px);
  box-sizing: border-box;

  @media (max-width: 767px) {
    padding: 10px;
    margin: 20px 6px;
    width: calc(100% - 12px);
  }
  @media screen and (min-width: 1440px) {
    margin: 20px 6px;
  }
`;

const CardTitle = styled.p`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 24px;
  line-height: 90%;
  color: var(--black-500);

  @media screen and (min-width: 1440px) {
    font-size: 32px;
  }

  @media (max-width: 767px) {
    font-size: 20px;
  }
`;

const CardDescription = styled.p`
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  color: var(--black-500);

  @media screen and (min-width: 1440px) {
    font-size: 16px;
  }

  @media (max-width: 767px) {
    font-size: 12px;
    line-height: 120%;
  }
`;
