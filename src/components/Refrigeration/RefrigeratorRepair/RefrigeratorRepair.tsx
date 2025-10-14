import React, { useRef } from 'react';
import { motion, useScroll, useTransform, easeOut } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import image1 from '../../../assets/icons/frigde/1.png';
import image2 from '../../../assets/icons/frigde/2.png';
import image3 from '../../../assets/icons/frigde/3.png';
import image4 from '../../../assets/icons/frigde/IMG_2543.png';
import image5 from '../../../assets/icons/frigde/5.png';
// Додайте імпорт зображень для нових типів холодильників
import image6 from '../../../assets/icons/frigde/IceMakers.avif'; // Приклад
import image7 from '../../../assets/icons/frigde/Bar&BeverageRefrigerators.webp'; // Приклад
import image8 from '../../../assets/icons/frigde/MiniFridges.webp'; // Приклад
import { Autoplay, Navigation } from 'swiper/modules';
import { useMediaQuery } from 'react-responsive';

// Дані для слайдів
const slides = [
  {
    img: image1,
    title: 'Built-In Refrigerators',
    description:
      'High-end models seamlessly integrated into your kitchen. We specialize in servicing premium brands like Sub-Zero, Viking, Thermador, and Monogram.',
  },
  {
    img: image2,
    title: 'Freezers',
    description:
      'From upright and chest freezers to commercial units — we fix cooling issues, thermostat problems, and compressor failures.',
  },
  {
    img: image3,
    title: 'French Door & Side-by-Side Refrigerators',
    description:
      'Modern models with large capacity and dual-door convenience. We repair cooling imbalances, ice maker failures, and electronic control issues.',
  },
  {
    img: image4,
    title: 'Wine Coolers',
    description:
      'Repairs for temperature fluctuations, thermostat malfunctions, and compressor failures to keep your wine collection safe.',
  },
  {
    img: image5,
    title: 'Two-compressor refrigerators',
    description:
      'Advanced appliances with independent systems for cooling and freezing, ensuring flexibility and reliability.',
  },
  // Додаємо нові типи холодильників
  {
    img: image6,
    title: 'Ice Makers',
    description:
      'Standalone ice machines and built-in refrigerator ice makers — we fix leaks, clogs, and ice production problems.',
  },
  {
    img: image7,
    title: 'Bar & Beverage Refrigerators',
    description:
      'Compact drink fridges for home bars, offices, or entertainment spaces. We repair cooling, fan, and control board issues.',
  },
  {
    img: image8,
    title: 'Mini Fridges',
    description:
      'Small refrigerators for dorms, offices, and apartments. Quick repair solutions for cooling loss, leaks, and electrical faults.',
  },
];

const RefrigeratorRepair: React.FC = () => {
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
          <Subtitle>Refrigerator Repair</Subtitle>
          <Title>
            We repair <span> all types </span> of refrigerators
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
                    <Image 
                      src={slide.img} 
                      alt={slide.title}
                      loading='lazy'
                      decoding='async'
                    />
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

export default RefrigeratorRepair;

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
  background-color: #DBDBD8;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  touch-action: manipulation;

  &:hover,
  &:focus,
  &:active {
    background-color: #3098EE;
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