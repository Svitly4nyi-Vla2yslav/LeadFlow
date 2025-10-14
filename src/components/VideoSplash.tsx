import { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import logo from '../assets/icons/logo-big.svg';
import introVideo from '../assets/video/Sub_Zero_Refrigerator_Cinematic_Reveal.webm';
import LoadingScreen from './LoadingScreen';

// Анімація появи з темряви
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Анімація затемнення
const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

// Анімація лого
const scaleLogo = keyframes`
  0% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
`;

// Анімація кнопки
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Контейнер заставки
const PreloaderWrapper = styled.div<{ $hide: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: manipulation;
  ${({ $hide }) =>
    $hide &&
    css`
      animation: ${fadeOut} 1s forwards;
      pointer-events: none;
    `}
`;

// Контейнер для кнопки пропуску
const SkipButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100000;
  
  @media (max-width: 480px) {
    top: 15px;
    right: 15px;
  }
`;

// Стиль кнопки пропуску
const SkipButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    animation: ${pulse} 0.5s ease;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 13px;
  }
`;

// Відео
const Video = styled.video<{ $visible: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  ${({ $visible }) =>
    $visible &&
    css`
      animation: ${fadeIn} 1.5s forwards;
    `}
`;

// Лого
const LogoContainer = styled.div<{ $show: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  opacity: 0;
  ${({ $show }) =>
    $show &&
    css`
      animation: ${scaleLogo} 2s forwards;
    `}
`;

const LogoImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;

  @media screen and (min-width: 744px) {
    /* max-width: 80%;
    max-height: 80%; */
  }

  @media screen and (min-width: 1440px) {
    /* max-width: 70%;
    max-height: 70%; */
  }
`;

type Props = { onComplete: () => void };

const VideoPreloader: React.FC<Props> = ({ onComplete }) => {
  const [showVideo, setShowVideo] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [hide, setHide] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const skipPreloader = () => {
    setShowVideo(false);
    setShowLogo(false);
    setHide(true);
    setTimeout(onComplete, 100);
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    // Оптимізація завантаження відео
    video.preload = 'auto';
    video.playsInline = true;
    video.muted = true;

    // Обробка завантаження відео
    const handleLoadedData = () => {
      setIsVideoLoaded(true);
    };

    // Коли відео закінчилося
    const handleEnded = () => {
      setShowVideo(false);
      setShowLogo(true);

      // Ховаємо через 3с (анімація лого)
      setTimeout(() => {
        setHide(true);
        setTimeout(onComplete, 1000);
      }, 3000);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('ended', handleEnded);

    // Спроба автопрогравання для iOS
    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log('Autoplay prevented:', error);
      }
    };

    playVideo();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  return (
    <PreloaderWrapper $hide={hide}>
      <SkipButtonContainer>
        <SkipButton onClick={skipPreloader} aria-label="Skip intro">
          Skip
        </SkipButton>
      </SkipButtonContainer>
      
      {showVideo && (
        <Video 
          ref={videoRef} 
          $visible={showVideo} 
          autoPlay 
          muted 
          playsInline
          preload="auto"
          onError={() => {
            console.error('Video loading failed');
            skipPreloader();
          }}
        >
          <source src={introVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </Video>
      )}
      
      {showLogo && (
        <LogoContainer $show={showLogo}>
          <LogoImage src={logo} alt="Logo" />
        </LogoContainer>
      )}
      
      {/* Індикатор завантаження */}
      {!isVideoLoaded && showVideo && (
        <LoadingScreen/>
      )}
    </PreloaderWrapper>
  );
};

export default VideoPreloader;