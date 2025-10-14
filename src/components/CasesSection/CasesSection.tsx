import { useRef, useState } from 'react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/bundle';
import {
  BlueCard,
  BottomSection,
  Container,
  ContentWrapper,
  Header,
  IconButton,
  ReviewText,
  Section,
  SlideImage,
  SlideWrapper,
  StyledSwiper,
  StyledSwiperSlide,
  Subtitle,
  Title,
  TopSection,
  NavigationWrapper,
  SwiperContainer,
} from './CasesSection.styled';

import ReviewImage2 from '../../assets/icons/cases/photo_2025-09-16_22-58-10.jpg';
import ReviewImage1 from '../../assets/icons/cases/Знімок екрана 2025-09-17 200622.png';
import ReviewImage3 from '../../assets/icons/cases/photo_2025-09-16_22-58-06.jpg';
import ReviewImage6 from '../../assets/icons/cases/photo_2025-09-16_22-58-01.jpg';
import ReviewImage4 from '../../assets/icons/cases/photo_2025-09-16_22-58-19.jpg';
import ReviewImage7 from '../../assets/icons/cases/photo_2025-09-16_22-57-47.jpg';
import ReviewImage5 from '../../assets/icons/cases/photo_2025-09-16_22-58-14.jpg';
import { Blue } from '../WhyAirtexnoSection/WhyAirtexnoSection.styled';

export default function CasesSection() {
  const [swiper, setSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const handlePrev = () => {
    if (swiper) {
      swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  const cards = [
    {
      image: ReviewImage3,
      description:
        'A broken washing machine that stopped mid-cycle was fully restored by our team in just one visit. The family can now enjoy clean laundry again without stress.',
      title: 'Quick Fix for a Washing Machine Breakdown',
      type: 'Washing Machine Repair',
    },
    {
      image: ReviewImage2,
      description:
        'We installed a brand-new dishwasher for a busy household, ensuring proper water connections and energy efficiency. The client now saves both time and water daily.',
      title: 'Professional Dishwasher Installation',
      type: 'Dishwasher Installation',
    },
    {
      image: ReviewImage5,
      description:
        'A fridge that was leaking water and not cooling properly was diagnosed and repaired. The customer avoided costly food spoilage and gained reliable performance again.',
      title: 'Refrigerator Leak and Cooling Repair',
      type: 'Refrigerator Repair',
    },
    {
      image: ReviewImage4,
      description:
        'The dryer was overheating and shutting down after a few minutes. Our experts replaced faulty parts and cleaned the vent system, restoring safe and efficient drying.',
      title: 'Dryer Overheating Problem Solved',
      type: 'Dryer Repair',
    },
    {
      image: ReviewImage1,
      description:
        "An oven that wouldn't heat evenly was repaired by recalibrating the thermostat and replacing heating elements. The family can now cook meals perfectly again.",
      title: 'Oven Heating Restored for Perfect Meals',
      type: 'Oven Repair',
    },
    {
      image: ReviewImage7,
      description:
        'We handled a complete installation of a modern washing machine, ensuring proper setup, water connection, and vibration-free operation.',
      title: 'Seamless Washing Machine Installation',
      type: 'Washing Machine Installation',
    },
    {
      image: ReviewImage6,
      description:
        'A freezer full of food was saved when we quickly repaired the compressor and restored full cooling capacity within hours.',
      title: 'Emergency Freezer Repair',
      type: 'Freezer Repair',
    },
    {
      image: ReviewImage1,
      description:
        "A customer's stove stopped working during family dinner preparation. Our team replaced defective wiring and burners, restoring it the same day.",
      title: 'Stove Emergency Fixed Same Day',
      type: 'Stove Repair',
    },
  ];

  return (
    <Section>
      <Header>
        <Subtitle>Our Cases</Subtitle>
        <Title>
          <Blue>Success Stories </Blue> That Bring Your Appliances Back to Life
        </Title>
      </Header>

      <SwiperContainer>
        <StyledSwiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          speed={800} // Зменшено швидкість для більш відчутної реакції
          onSwiper={setSwiper}
          onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
          breakpoints={{
            1440: {
              slidesPerView: 6,
              spaceBetween: 30,
              centeredSlides: true,
            },
          }}
          touchStartPreventDefault={false}
          allowTouchMove={true}
          resistance={true}
          resistanceRatio={0.85}
        >
          {cards.map(({ image, description, title, type }, index) => (
            <StyledSwiperSlide key={index} $isActive={activeIndex === index} $index={index}>
              <SlideWrapper $isActive={activeIndex === index} $index={index}>
                <SlideImage
                  src={image}
                  alt={type}
                  $isActive={activeIndex === index}
                  $index={index}
                />

                <Container $isActive={activeIndex === index} $index={index}>
                  <ContentWrapper>
                    <TopSection>
                      <ReviewText $isActive={activeIndex === index}>{description}</ReviewText>
                    </TopSection>

                    <BottomSection>
                      <BlueCard $isActive={activeIndex === index}>{title}</BlueCard>
                      <ReviewText $isActive={activeIndex === index}>{type}</ReviewText>
                    </BottomSection>
                  </ContentWrapper>
                </Container>
              </SlideWrapper>
            </StyledSwiperSlide>
          ))}
        </StyledSwiper>
      </SwiperContainer>

      <NavigationWrapper>
        <IconButton ref={prevRef} onClick={handlePrev} aria-label="Previous slide">
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
            <path
              d='M15 18L9 12L15 6'
              stroke='white'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </IconButton>

        <IconButton ref={nextRef} onClick={handleNext} aria-label="Next slide">
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
            <path
              d='M9 18L15 12L9 6'
              stroke='white'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </IconButton>
      </NavigationWrapper>
    </Section>
  );
}