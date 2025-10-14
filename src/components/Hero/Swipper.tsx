import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// Імпортуйте ваші 31 картинку
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
import i20 from '../../assets/icons/partners/2.svg';
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

const images = [
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

const Container = styled.div`
  height: 611px;
  max-width: 400px;
  overflow: hidden;
  position: relative;
  margin-top: 100px;
  margin-left: 60px;

  mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 15%,
    black 85%,
    transparent 100%
  );
`;

const SlideImage = styled.img`
  height: 32px;
  max-width: min-content;
  /* width: auto; */
  object-fit: contain;
  filter: brightness(1) invert(1);
  transition: all 0.3s ease;
  overflow: visible;
`;
const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: 100%;
  overflow: visible;

  .swiper-wrapper {
    transition-timing-function: linear;
    align-items: center;
    overflow: visible;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px !important;
    transition: all 0.3s ease;
    overflow: visible;

    /* Стилі для різних позицій слайдів */
    &-active {
      transform: scale(0.9);
      opacity: 1;
      overflow: visible;
    }

    &-prev,
    &-next {
      transform: scale(0.8);
      opacity: 0.7;
    }

    &-prev + .swiper-slide-prev,
    &-next + .swiper-slide-next {
      transform: scale(0.6);
      opacity: 0.5;
    }

    /* Далекі слайди */
    &:not(.swiper-slide-active):not(.swiper-slide-prev):not(.swiper-slide-next) {
      transform: scale(0.8);
      opacity: 0.3;
    }
  }
`;

const AutoVerticalSwiper: React.FC = () => {
  return (
    <Container>
      <StyledSwiper
        direction='vertical'
        slidesPerView={10}
        spaceBetween={0}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: true,
        }}
        speed={4000}
        modules={[Autoplay]}
        grabCursor={false}
        allowTouchMove={false}
      >
        {images.map(image => (
          <SwiperSlide key={image.id}>
            <SlideImage
              src={image.imageUrl}
              alt={`Partner ${image.id}`}
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </Container>
  );
};

export default AutoVerticalSwiper;
