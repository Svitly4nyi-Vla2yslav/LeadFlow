import React, { useRef } from 'react';
import { motion, easeOut } from 'framer-motion';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Navigation } from 'swiper/modules';
import { useMediaQuery } from 'react-responsive';
import { NavLink } from 'react-router-dom';

import image from '../../assets/icons/news&tips/News Article 2 Image Container (3).png';
import image1 from '../../assets/icons/equipment/Image3.png';
import image2 from '../../assets/icons/news&tips/t1.webp';
import image3 from '../../assets/icons/news&tips/bosch-dishwasher-door-open.jpg';
import image4 from '../../assets/icons/news&tips/tips.png';
import image5 from '../../assets/icons/news&tips/News Article 2 Image Container (7).png';

interface Article {
  id: number;
  image: string;
  title: string;
  description: string;
  path: string;
}

const articles: Article[] = [
  {
    id: 1,
    image: image5,
    title: 'HOW TO MAINTAIN YOUR REFRIGERATOR AND AVOID COSTLY REPAIRS',
    description:
      'Keep your fridge running smoothly with easy maintenance tips to prevent expensive breakdowns.',
    path: '/tips/refrigerator-maintenance#ap',
  },
  {
    id: 2,
    image: image1,
    title: 'TOP 5 SIGNS YOUR OVEN OR RANGE NEEDS REPAIR',
    description:
      'Gas range clicking? Oven not heating evenly? Discover common signs your oven needs professional attention.',
    path: '/tips/oven-repair-signs#ap',
  },
  {
    id: 3,
    image: image2,
    title: 'WASHER & DRYER MAINTENANCE TIPS EVERY HOMEOWNER SHOULD KNOW',
    description:
      'Extend the life of your laundry appliances with simple maintenance practices to avoid breakdowns.',
    path: '/tips/laundry-appliance-maintenance#ap',
  },
  {
    id: 4,
    image: image3,
    title: 'DISHWASHER NOT DRAINING? COMMON CAUSES AND EASY FIXES',
    description:
      'Learn how to troubleshoot and fix common dishwasher drainage problems quickly and effectively.',
    path: '/tips/dishwasher-drainage#ap',
  },
  {
    id: 5,
    image: image4,
    title: 'WHEN TO REPLACE VS. REPAIR YOUR APPLIANCE: EXPERT ADVICE',
    description:
      'Make smart decisions about whether to repair or replace your appliances based on cost, age, and efficiency.',
    path: '/tips/repair-vs-replace#ap',
  },
  {
    id: 6,
    image: image,
    title: 'WHY OEM PARTS MATTER IN APPLIANCE REPAIR',
    description:
      'Discover the importance of using genuine manufacturer parts for reliable and long-lasting appliance repairs.',
    path: '/tips/oem-parts#ap',
  },
];

// Анімаційні варіанти для заголовків
const titleVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOut,
    },
  },
};

// Анімаційні варіанти для карток
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: easeOut,
    },
  },
  hover: {
    y: -10,
    scale: 1.02,
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    transition: {
      duration: 0.3,
      ease: easeOut,
    },
  },
};

// Анімаційні варіанти для зображень
const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.4,
    },
  },
};

// Анімаційні варіанти для тексту
const textVariants = {
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

const NewsAndTips: React.FC = () => {
  const swiperRef = useRef<any>(null);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });
  const slidesPerView = isMobile ? 1 : isTablet ? 2 : 3;
  const shouldLoop = articles.length > slidesPerView;

  // Функції для навігації
  const handlePrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <Wrapper>
      <HeaderSection>
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
        >
          <Subtitle>NEWS &amp; TIPS</Subtitle>
        </motion.div>

        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
          transition={{ delay: 0.1 }}
        >
          <Title>
            APPLIANCE <span>ADVICE</span> REPAIR <span>TIPS</span> BLOG
          </Title>
        </motion.div>
      </HeaderSection>

      <SwiperContainer>
        <Swiper
          modules={[Navigation, Autoplay]}
          onSwiper={swiper => (swiperRef.current = swiper)}
          spaceBetween={20}
          autoplay={{
            delay: 3000, // Нормальна затримка
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={1000} // Нормальна швидкість
          loop={shouldLoop}
          slidesPerView={slidesPerView}
          centeredSlides={isMobile}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          // Додайте ці параметри для покращеної роботи
          allowTouchMove={true}
          grabCursor={true}
        >
          {articles.map((article, _index) => (
            <SwiperSlide key={article.id}>
              <StyledNavLink to={article.path}>
                <motion.div
                  variants={cardVariants}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card>
                    <motion.div variants={imageVariants} whileHover='hover'>
                      <Image
                        src={article.image}
                        alt={article.title}
                        loading='lazy'
                        decoding='async'
                      />
                    </motion.div>

                    <CardText>
                      <motion.div variants={textVariants}>
                        <CardTitle>{article.title}</CardTitle>
                      </motion.div>

                      <motion.div variants={textVariants}>
                        <CardDescription>{article.description}</CardDescription>
                      </motion.div>
                    </CardText>
                  </Card>
                </motion.div>
              </StyledNavLink>
            </SwiperSlide>
          ))}
        </Swiper>

        <NavigationContainer>
          <NavButton
            onClick={handlePrevClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='swiper-button-prev' // Додайте клас для навігації
          >
            {/* <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
              <path
                d='M15 18L9 12L15 6'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg> */}
          </NavButton>

          <NavButton
            onClick={handleNextClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='swiper-button-next' // Додайте клас для навігації
          >
            {/* <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
              <path
                d='M9 18L15 12L9 6'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg> */}
          </NavButton>
        </NavigationContainer>
      </SwiperContainer>
    </Wrapper>
  );
};

export default NewsAndTips;

// ================= styled-components =================

export const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  display: block;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
`;

const SwiperContainer = styled.div`
  width: 100%;
  padding: 20px 0;
  position: relative;

  .swiper-slide {
    width: 100%;
    -webkit-tap-highlight-color: transparent;
  }

  /* Стилі для стандартних кнопок навігації Swiper */
  .swiper-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: transparent;
    &:hover {
      background-color: #dbdbd8;
      transform: none;
      box-shadow: none;
    }
  }
  .swiper-button-prev:after,
  .swiper-button-next:after {
    font-family: swiper-icons;
    font-size: 20px;
    height: 20px;
    text-transform: none !important;
    letter-spacing: 0;
    font-variant: initial;
    line-height: 1;
    /* color: transparent; */
  }
`;

export const NavigationContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  width: 100%;
  justify-content: flex-end;
  position: absolute;
`;

const NavButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background-color: #dbdbd8;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;

  &:hover,
  &:focus,
  &:active {
    background-color: #3098ee;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(48, 152, 238, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(48, 152, 238, 0.2);
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
  min-height: 100vh;
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
  font-size: 32px;
  line-height: 90%;
  color: var(--black-500);
  width: 40%;
  span {
    color: var(--blue-500);
  }

  @media screen and (min-width: 768px) {
    font-size: 52px;
  }

  @media screen and (min-width: 1440px) {
    font-size: 72px;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: fit-content;
  margin: 0 auto;
  cursor: pointer;
  border-radius: 10px;
  padding: 10px;

  @media screen and (min-width: 768px) {
    /* max-width: 322px; */
  }

  @media screen and (min-width: 1440px) {
    /* max-width: 380px; */
  }
`;

const Image = styled.img`
  border-radius: 8px;
  width: 100%;
  height: 250px;
  object-fit: cover;

  @media screen and (min-width: 768px) {
    height: 300px;
  }

  @media screen and (min-width: 1440px) {
    height: 350px;
  }
`;

const CardText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px 0;
`;

const CardTitle = styled.p`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 18px;
  line-height: 110%;
  color: var(--black-500);

  @media screen and (min-width: 768px) {
    font-size: 20px;
  }

  @media screen and (min-width: 1440px) {
    font-size: 24px;
  }
`;

const CardDescription = styled.p`
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: var(--black-500);

  @media screen and (min-width: 768px) {
    font-size: 15px;
  }

  @media screen and (min-width: 1440px) {
    font-size: 16px;
  }
`;
