import React, { useRef, useEffect, useState } from 'react';
import { easeOut, motion, useInView } from 'framer-motion';
import {
  Blue,
  Header,
  IconWrapper,
  Section,
  SubTitle,
  TextWrapper,
  Title,
  Text,
  SwiperContainer,
  BlueCard,
  ImageSection,
  CenteredSlideContainer,
  GlobalStyles,
} from './WhyAirtexnoSection.styled';
import WhyAirtexnoImage1 from '../../assets/icons/WhyAirtexnoImage.png';
import WhyAirtexnoImage2 from '../../assets/icons/2.webp';
import WhyAirtexnoImage4 from '../../assets/icons/4.webp';
import WhyAirtexnoImage3 from '../../assets/icons/3.webp';
import buildung from '../../assets/icons/building-07.svg';
import clock from '../../assets/icons/clock.svg';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import { useMediaQuery } from 'react-responsive';
import { debounce } from 'lodash';
import type SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-coverflow';

const WhyAirtexnoSection: React.FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 743px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 744px) and (max-width: 1023px)',
  });
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const isLargeDesktop = useMediaQuery({ query: '(min-width: 1440px)' });

  const [hasAnimated, setHasAnimated] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);
  const [, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const debouncedResize = debounce(handleResize, 250);
    window.addEventListener('resize', debouncedResize);

    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  useEffect(() => {
    // Примусова ініціалізація після завантаження компонента
    const timer = setTimeout(() => {
      if (swiperInstance) {
        swiperInstance.update();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [swiperInstance]);

  const slides = [
    {
      title: 'Genuine Parts in Stock',
      text: 'We use only original manufacturer parts. With our fully stocked local warehouse, most repairs are done without waiting for delivery.',
      image: WhyAirtexnoImage2,
      icon: clock,
    },
    {
      title: 'Manufacturer-Trained Technicians',
      text: 'Our team is trained to service leading brands like Sub-Zero, Viking, GE Monogram, and more — ensuring expert repairs done right the first time.',
      image: WhyAirtexnoImage1,
      icon: buildung,
    },
    {
      title: 'Genuine Parts in Stock',
      text: 'We use only original manufacturer parts. With our fully stocked local warehouse, most repairs are done without waiting for delivery.',
      image: WhyAirtexnoImage2,
      icon: clock,
    },
    {
      title: 'Fast, Hassle-Free Service',
      text: 'One quick call and our Thousand Oaks team is on the way — no long waits, no hassle.',
      image: WhyAirtexnoImage3,
      icon: buildung,
    },
    {
      title: 'Local & Fair Pricing',
      text: 'As a local Thousand Oaks company, we treat our community like neighbors. With direct access to parts and highly trained techs, we keep our prices fair — without steep markups. While costs keep rising everywhere, we work hard to keep appliance repair affordable.',
      image: WhyAirtexnoImage4,
      icon: buildung,
    },

    {
      title: 'Fast, Hassle-Free Service',
      text: 'One quick call and our Thousand Oaks team is on the way — no long waits, no hassle.',
      image: WhyAirtexnoImage3,
      icon: buildung,
    },
  ];

  const getSlidesPerView = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (isDesktop) return 3;
    if (isLargeDesktop) return 3;
    return 3;
  };

  const slidesPerView = getSlidesPerView();
  const shouldLoop = slides.length > slidesPerView;

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 20,
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

  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  return (
    <>
      <GlobalStyles />
      <Section ref={sectionRef}>
        <TextWrapper>
          <motion.div
            initial='hidden'
            animate={hasAnimated ? 'visible' : 'hidden'}
            variants={textVariants}
          >
            <SubTitle>why airtexno</SubTitle>
          </motion.div>

          <motion.div
            initial='hidden'
            animate={hasAnimated ? 'visible' : 'hidden'}
            variants={textVariants}
            transition={{ delay: 0.1 }}
          >
            <Title>
              Same-Day Appliance Repair <Blue>You Can Rely On</Blue>{' '}
            </Title>
          </motion.div>
        </TextWrapper>

        <ImageSection>
          <SwiperContainer $isLargeDesktop={isLargeDesktop}>
            <Swiper
              onSwiper={setSwiperInstance}
              modules={[Pagination, Autoplay]}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 3,
              }}
              spaceBetween={isLargeDesktop ? 0 : 16}
              loop={shouldLoop}
              slidesPerView={slidesPerView}
              centeredSlides={isLargeDesktop}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                waitForTransition: true,
                pauseOnMouseEnter: true,
              }}
              speed={600}
              className='businessSwiper'
              touchRatio={1.5}
              resistanceRatio={0.5}
              watchSlidesProgress={true}
              updateOnWindowResize={true}
              observer={true}
              observeParents={true}
              preventInteractionOnTransition={true}
              // Додайте ці налаштування:
              initialSlide={0}
              watchOverflow={true}
              normalizeSlideIndex={true}
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <CenteredSlideContainer
                    style={{ backgroundImage: `url(${slide.image})` }}
                    $isLargeDesktop={isLargeDesktop}
                    className='slide-container'
                  >
                    {(slide.title || slide.text || slide.icon) && (
                      <motion.div
                        className='overlay'
                        initial='hidden'
                        animate={hasAnimated ? 'visible' : 'hidden'}
                        variants={cardVariants}
                        whileHover={
                          !isMobile
                            ? {
                                scale: 1.02,
                                transition: { duration: 0.2 },
                              }
                            : {}
                        }
                      >
                        {(slide.title || slide.icon) && (
                          <Header>
                            {slide.title && (
                              <motion.div variants={textVariants}>
                                <BlueCard>{slide.title}</BlueCard>
                              </motion.div>
                            )}
                            {slide.icon && (
                              <motion.div variants={textVariants} transition={{ delay: 0.1 }}>
                                <IconWrapper className='icon-wrapper'>
                                  <img
                                    src={slide.icon}
                                    alt={slide.title || 'icon'}
                                    className='icon-image'
                                    loading='lazy'
                                  />
                                </IconWrapper>
                              </motion.div>
                            )}
                          </Header>
                        )}
                        {slide.text && (
                          <motion.div variants={textVariants} transition={{ delay: 0.2 }}>
                            <Text className='slide-text'>{slide.text}</Text>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </CenteredSlideContainer>
                </SwiperSlide>
              ))}
            </Swiper>
          </SwiperContainer>
        </ImageSection>
      </Section>
    </>
  );
};

export default WhyAirtexnoSection;
