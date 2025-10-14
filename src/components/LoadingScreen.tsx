import { backOut, motion } from 'framer-motion';
import styled from 'styled-components';
import logoImage from '../assets/icons/Logo.png';

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: transparent;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
`;

const LogoImage = styled(motion.img)`
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  object-fit: contain;

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
  }
`;

// Визначаємо анімаційні варіанти
const rotateVariants = {
  initial: { rotate: 0 },
  animate: { 
    rotate: 360,
    transition: {
      repeat: Infinity,
      ease: backOut, // cubic-bezier for linear
      duration: 2
    }
  }
};

const LoadingScreen = () => {
  return (
    <LoaderContainer>
      <LogoImage
        src={logoImage}
        alt="Loading"
        variants={rotateVariants}
        initial="initial"
        animate="animate"
      />
    </LoaderContainer>
  );
};

export default LoadingScreen;