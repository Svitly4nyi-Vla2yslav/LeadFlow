import React from 'react';
import { easeOut, motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import { useMediaQuery } from 'react-responsive';
import { SwiperContainer, Image, ShadowLeft, ShadowRight, TitlePartner } from './Partners.styled';
import i1 from '../../assets/icons/partners/1.svg';
import i2 from '../../assets/icons/partners/2.svg';
import i3 from '../../assets/icons/partners/3.svg';
import i4 from '../../assets/icons/partners/4.svg';
import i5 from '../../assets/icons/partners/5.svg';
import i6 from '../../assets/icons/partners/6.svg';
import i7 from '../../assets/icons/partners/7.svg';
import i8 from '../../assets/icons/partners/8.svg';
import i9 from '../../assets/icons/partners/9.svg';
import i10 from '../../assets/icons/partners/10.svg';
import i11 from '../../assets/icons/partners/11.svg';
import i12 from '../../assets/icons/partners/12.svg';
import i13 from '../../assets/icons/partners/13.svg';
import i14 from '../../assets/icons/partners/14.svg';
import i15 from '../../assets/icons/partners/15.svg';
import i16 from '../../assets/icons/partners/16.svg';
import i17 from '../../assets/icons/partners/17.svg';
import i18 from '../../assets/icons/partners/18.svg';
import i19 from '../../assets/icons/partners/19.svg';
import i20 from '../../assets/icons/partners/20.svg';
import i21 from '../../assets/icons/partners/21.svg';
import i22 from '../../assets/icons/partners/22.svg';
import i23 from '../../assets/icons/partners/23.svg';
import i24 from '../../assets/icons/partners/24.svg';
import i25 from '../../assets/icons/partners/25.svg';
import i26 from '../../assets/icons/partners/26.svg';
import i27 from '../../assets/icons/partners/27.svg';
import i28 from '../../assets/icons/partners/28.svg';
import i29 from '../../assets/icons/partners/29.svg';
import i30 from '../../assets/icons/partners/30.svg';
import i31 from '../../assets/icons/partners/31.svg';

const Partners: React.FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 743px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 744px) and (max-width: 1023px)',
  });
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  const partners = [
    { id: 1, imageUrl: i1 },
    { id: 2, imageUrl: i2 },
    { id: 3, imageUrl: i3 },
    { id: 4, imageUrl: i4 },
    { id: 5, imageUrl: i5 },
    { id: 6, imageUrl: i6 },
    { id: 7, imageUrl: i7 },
    { id: 8, imageUrl: i8 },
    { id: 9, imageUrl: i9 },
    { id: 10, imageUrl: i10 },
    { id: 11, imageUrl: i11 },
    { id: 12, imageUrl: i12 },
    { id: 13, imageUrl: i13 },
    { id: 14, imageUrl: i14 },
    { id: 15, imageUrl: i15 },
    { id: 16, imageUrl: i16 },
    { id: 17, imageUrl: i17 },
    { id: 18, imageUrl: i18 },
    { id: 19, imageUrl: i19 },
    { id: 20, imageUrl: i20 },
    { id: 21, imageUrl: i21 },
    { id: 22, imageUrl: i22 },
    { id: 23, imageUrl: i23 },
    { id: 24, imageUrl: i24 },
    { id: 25, imageUrl: i25 },
    { id: 26, imageUrl: i26 },
    { id: 27, imageUrl: i27 },
    { id: 28, imageUrl: i28 },
    { id: 29, imageUrl: i29 },
    { id: 30, imageUrl: i30 },
    { id: 31, imageUrl: i31 },
  ];

  const slidesPerView = isMobile ? 2 : isTablet ? 4 : isDesktop ? 5 : 5;
  const shouldLoop = partners.length > slidesPerView;

  // Анімаційні варіанти для заголовка
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

  // Анімаційні варіанти для логотипів
  const logoVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
    hover: {
      scale: 1.1,
      y: -5,
      transition: {
        duration: 0.3,
        ease: easeOut,
      },
    },
  };

 return (
    <div>
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={titleVariants}
      >
        <TitlePartner>Quality Service for Major & Luxury Brands</TitlePartner>
      </motion.div>

      <SwiperContainer>
        <ShadowLeft />
        <Swiper
          loop={shouldLoop}
          slidesPerView={slidesPerView}
          spaceBetween={20}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            waitForTransition: true,
            pauseOnMouseEnter: true,
          }}
          speed={4000}
          modules={[Autoplay]}
          className='mySwiper'
          style={{ width: '100%', paddingBottom: '20px' }}
          // Додаємо важливі параметри для тачскріну
          touchRatio={1}
          touchAngle={45}
          shortSwipes={true}
          resistance={true}
          resistanceRatio={0.85}
        >
          {partners.map((partner, index) => (
            <SwiperSlide
              key={partner.id}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'auto',
                paddingTop: 10,
                // Додаємо для кращої реакції на тач
                touchAction: 'pan-y',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
              }}
            >
              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.2 }}
                variants={logoVariants}
                transition={{ delay: index * 0.05 }}
                whileHover='hover'
                // Оптимізація для iOS
                style={{ 
                  WebkitTransform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <Image 
                  src={partner.imageUrl} 
                  alt={`Partner ${partner.id}`} 
                  loading='lazy'
                  decoding='async'
                  // Важливі атрибути для iOS
                  onDragStart={(e) => e.preventDefault()}
                  draggable="false"
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Другий слайдер */}
        <Swiper
          loop={shouldLoop}
          slidesPerView={slidesPerView}
          spaceBetween={20}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            waitForTransition: true,
            pauseOnMouseEnter: true,
            reverseDirection: true,
          }}
          speed={4000}
          modules={[Autoplay]}
          className='mySwiper'
          style={{ width: '100%' }}
          // Такі ж параметри для тачскріну
          touchRatio={1}
          touchAngle={45}
          shortSwipes={true}
          resistance={true}
          resistanceRatio={0.85}
        >
          {partners.map((partner, index) => (
            <SwiperSlide
              key={partner.id + 100}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'auto',
                paddingTop: 10,
                // Додаємо для кращої реакції на тач
                touchAction: 'pan-y',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
              }}
            >
              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.2 }}
                variants={logoVariants}
                transition={{ delay: index * 0.05 + 0.1 }}
                whileHover='hover'
                // Оптимізація для iOS
                style={{ 
                  WebkitTransform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <Image 
                  src={partner.imageUrl} 
                  alt={`Partner ${partner.id}`} 
                  loading='lazy'
                  decoding='async'
                  onDragStart={(e) => e.preventDefault()}
                  draggable="false"
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        <ShadowRight />
      </SwiperContainer>
    </div>
  );
};

export default Partners;