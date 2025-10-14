import styled, { keyframes} from 'styled-components';

// Анімації
const ringAnimation = keyframes`
  0% {
    transform: rotate(0);
  }
  15% {
    transform: rotate(15deg);
  }
  30% {
    transform: rotate(-10deg);
  }
  45% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0);
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(48, 152, 238, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(48, 152, 238, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(48, 152, 238, 0);
  }
`;

const bounceAnimation = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-8px);
  }
  70% {
    transform: translateY(-4px);
  }
  90% {
    transform: translateY(-2px);
  }
`;


export const CallText = styled.p`
  color: #fff;
  font-family: 'Geist', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25em;
  transition: all 0.3s ease;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;

  @media screen and (min-width: 768px) {
    font-size: 1.1rem;
  }

  @media screen and (min-width: 1440px) {
    font-size: 1.2rem;
  }
`;
// Стилізовані компоненти
export const CallButton = styled.button`
  cursor: pointer;
  display: flex;
  padding: 12px 24px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3098ee, #2580d6, #3098ee);
  background-size: 200% 200%;
  width: fit-content;
  border: none;
  margin-bottom: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    animation:
      ${pulseAnimation} 1s ease,
      ${bounceAnimation} 0.6s ease;
    background-position: 100% 50%;
    transform: translateY(-3px);
    box-shadow:
      0 8px 25px rgba(48, 152, 238, 0.4),
      0 4px 15px rgba(48, 152, 238, 0.3);

    &::before {
      left: 100%;
    }

    svg {
      animation: ${ringAnimation} 1s ease;
    }

    ${CallText} {
      transform: translateX(2px);
    }
  }

  &:active {
    transform: translateY(1px);
    box-shadow:
      0 4px 12px rgba(48, 152, 238, 0.3),
      0 2px 6px rgba(48, 152, 238, 0.2);
  }

  svg {
    transition: all 0.3s ease;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  &:hover svg {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  }

  // Медіа-запити
  @media screen and (min-width: 768px) {
    padding: 14px 28px;
    gap: 12px;

    &:hover {
      transform: translateY(-4px);
    }
  }

  @media screen and (min-width: 1440px) {
    padding: 16px 32px;
    gap: 14px;

    &:hover {
      transform: translateY(-5px);
    }

    &:hover ${CallText} {
      transform: translateX(3px);
    }
  }
`;

export const Container = styled.div`
  display: flex;
  padding: 0px;
  align-items: flex-start;
  gap: 8px;
  border-radius: 12px;
  margin: 0 auto;
  /* margin-bottom: 44px; */
  flex-direction: column;
  flex-wrap: wrap;
  @media screen and (min-width: 1440px) {
    display: flex;
    max-width: 1440px;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 218px;
    margin-top: 48px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  margin-bottom: 40px;
  background: #d1dfedff;
  padding: 16px;
  border-radius: 8px;
  @media screen and (min-width: 744px) {
  }

  @media screen and (min-width: 1440px) {
    width: 396px;
  }
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
`;

export const Avatar = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 36px;
`;

export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const Heading = styled.p`
  color: #242424;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.25rem; /* 36px */
  font-weight: 400;
  line-height: 1em;
  width: 100%;
  padding-bottom: 16px;
`;

export const SubHeading = styled.p`
  color: #242424;
  font-family: 'Geist', sans-serif;
  font-size: 1rem; /* 16px */
  font-weight: 400;
  line-height: 1.25em;
  width: 100%;
`;

export const BottomSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
`;

export const IconWrapper = styled.div`
  position: relative;
  width: 44px;
  height: 44px;
`;

export const CircleBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 44px;
  height: 44px;
  background: #c6e6ff;
  border-radius: 100px;
`;

export const EmailText = styled.p`
  color: #242424;
  font-family: 'Geist', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.2em;
  width: fit-content;

  a {
    color: #3098ee;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

//! -------------------- frequently------------------------------------------------------

export const FrequentlyWrapper = styled.div`
  display: flex;
  margin: 0 auto;
  // margin-top: 100px;
  width: 100%;
  height: 100%;
  /* margin-bottom: 100px; */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (min-width: 1440px) {
    width: 100%;
    max-width: 645px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 2px;
    align-content: flex-end;
  }
`;

export const FrequentlyTitle = styled.h2`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 52px;
  line-height: 90%;
  color: var(--black-500);
  margin-bottom: 48px;
`;

export const FrequentlyText = styled.p`
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 16px;
  text-align: center;
  color: var(--white-80);
  margin-bottom: 26px;
`;

export const QuestionItem = styled.div`
  position: relative;
  border-top: 1px solid var(--white-320);
  padding: 16px;
  width: 343px;
  display: flex;
  flex-direction: column;
  gap: none;
  // height: 271px;
  overflow: hidden;
  transition:
    box-shadow 0.4s ease,
    border 0.4s ease;

  &:hover {
    border-bottom: 1px solid var(--white-320);
    // border-radius: 16px;
    text-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
  }

  @media screen and (min-width: 744px) {
    width: 696px;
  }

  @media screen and (min-width: 1440px) {
    width: 100%;
    max-width: 650px;
  }
`;

export const QuestionButton = styled.button`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;

  border: none;
  border-radius: 16px;
  padding: 14px;
  width: 100%;
  height: auto;
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 18px;
  line-height: 120%;
  color: #000;
  text-align: left;
  background: transparent;

  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    text-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
  }

  @media screen and (min-width: 744px) {
  }

  @media screen and (min-width: 1440px) {
  }
`;

interface AnswerTextProps {
  $isOpen: boolean;
}

export const AnswerText = styled.div<AnswerTextProps>`
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 16px;
  line-height: 125%;
  color: var(--black-500);
  transform: scaleY(${({ $isOpen }) => ($isOpen ? 1 : 0)});
  transform-origin: top;
  height: auto;
  max-height: ${({ $isOpen }) => ($isOpen ? '1000px' : '0')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  overflow: hidden;
  transition:
    transform 0.4s ease,
    opacity 0.3s ease,
    max-height 0.4s ease;
  margin-top: ${({ $isOpen }) => ($isOpen ? '12px' : '0')};
  will-change: transform, opacity, max-height;

  @media screen and (min-width: 744px) {
  }

  @media screen and (min-width: 1440px) {
  }
`;

interface XIconStyledProps {
  $rotate?: boolean;
}

export const XIcon = styled.img.attrs<XIconStyledProps>(() => ({}))<XIconStyledProps>`
  width: 14px;
  height: 15px;
  transition: transform 0.6s ease;

  ${({ $rotate }) =>
    $rotate &&
    `
        transform: rotate(136deg);
      `}

  @media screen and (min-width: 744px) {
  }

  @media screen and (min-width: 1440px) {
  }
`;

export const ContainerF = styled.div`
  @media screen and (min-width: 1440px) {
    min-width: 650px;
    width: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    flex-wrap: nowrap;
  }
`;

export const ContentContainer = styled.div`
  @media screen and (min-width: 1440px) {
    width: 100%;
    max-width: 650px;

    flex-shrink: 0; /* Забороняємо звуження */
  }
`;
