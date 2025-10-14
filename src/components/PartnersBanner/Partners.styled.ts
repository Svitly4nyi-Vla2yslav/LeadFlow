import { motion } from "framer-motion";
import styled from "styled-components";

export const SwiperContainer = styled.div`
  width: 97vw;
  height: 80%;
  background-color: rgba(0, 0, 0, 0);
  backdrop-filter: blur(1px);
  margin: 0px 0;
  padding: 40px 0px;
  /* Запобігаємо скачку контенту на iOS */
  -webkit-overflow-scrolling: touch;
  
  .swiper-wrapper {
    display: flex;
    transition-timing-function: linear !important;
    padding: 0px 0px;
    margin: 0 auto;
    /* Покращуємо продуктивність на мобільних */
    transform: translate3d(0,0,0);
  }

  @media screen and (min-width: 744px){
    width: 100vw;
  }

  @media screen and (min-width: 1440px){
    gap: 50px;
  }
`;

export const Image = styled.img`
  height: 29px;
  width: 100%;
  object-fit: contain;
  padding: 0 auto;
  margin: 0 auto;
  
  /* Покращена оптимізація для мобільних */
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  
  /* Покращена анімація для iOS */
  transition: 
    filter 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.3s ease;
  transform: scale(1);
  
  /* Запобігаємо синім підсвічуванням на iOS */
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  
  &:hover,
  &:focus {
    filter: brightness(0) saturate(100%) invert(44%) sepia(98%) saturate(311%) hue-rotate(173deg) brightness(93%) contrast(89%);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
    transition-duration: 0.1s;
  }

  /* Медіа-запити для кращої реакції на тач */
  @media (hover: none) and (pointer: coarse) {
    &:hover {
      transform: scale(1);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }

  @media screen and (min-width: 1440px) {
    height: 42px;
    
    &:hover,
    &:focus {
      transform: scale(1.08);
    }
  }
`;

export const ShadowLeft = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
  z-index: 10;
  pointer-events: none;
  /* Оптимізація для iOS */
  /* -webkit-backface-visibility: hidden; */
`;

export const ShadowRight = styled(motion.div)`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100px;
  background: linear-gradient(270deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
  z-index: 10;
  pointer-events: none;
  /* Оптимізація для iOS */
  /* -webkit-backface-visibility: hidden; */
`;

export const TitlePartner = styled.h3`
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 14px;
  line-height: 90%;
  text-transform: uppercase;
  text-align: center;
  padding-bottom: 16px;
  color: var(--black-500);
  /* Запобігаємо виділенню тексту на тач-пристроях */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;