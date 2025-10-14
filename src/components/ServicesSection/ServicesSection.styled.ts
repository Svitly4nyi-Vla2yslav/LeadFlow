import { NavLink } from 'react-router';
import { styled } from 'styled-components';

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  overflow: hidden;
  position: relative;

  @media screen and (min-width: 768px) {
    padding: 1.5rem;
  }

  @media screen and (min-width: 1440px) {
    margin: 0 auto;
    max-width: 1440px;
    padding: 2rem;
  }
`;

export const SmallText = styled.p`
  color: #242424;
  font-family: 'Geist', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 0.9em;
  width: 100%;

  @media screen and (min-width: 768px) {
    font-size: 14px;
    text-transform: uppercase;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
  width: 100%;

  @media screen and (min-width: 1440px) {
    flex-direction: row;
    gap: 3rem;
  }
`;

export const ServiceBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;

  @media screen and (min-width: 1440px) {
    gap: 0.25rem;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;

  @media screen and (min-width: 768px) {
    gap: 0.75rem;
  }
`;

export const Number = styled.p`
  color: #242424;
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 28px;
  line-height: 90%;

  @media screen and (min-width: 768px) {
    font-size: 56px;
  }
`;

export const TitleBlue = styled.p`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 28px;
  line-height: 90%;
  color: var(--blue-500);

  @media screen and (min-width: 768px) {
    font-size: 56px;
  }
`;

export const Title = styled.p`
  color: #242424;
  font-family: var(--second-family);
  font-size: 28px;
  font-weight: 400;
  line-height: 0.9em;
  width: 100%;

  @media screen and (min-width: 768px) {
    font-size: 56px;
  }
`;

export const TitleCard = styled.p`
  color: #242424;
  font-family: var(--second-family);
  font-size: 28px;
  font-weight: 400;
  line-height: 0.9em;
  width: 100%;

  @media screen and (min-width: 768px) {
    font-size: 38px;
  }
`;

export const ServiceImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  object-position: center;
  border-radius: 0.5rem;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;

  /* Покращена продуктивність для iOS */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;

  @media screen and (min-width: 768px) {
    max-height: 500px;
  }

  @media screen and (min-width: 1440px) {
    max-width: 563px;
    max-height: 647px;
  }
`;

export const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;

  @media screen and (min-width: 1440px) {
    padding-top: 40%;
  }
`;

export const InfoText = styled.p`
  color: #242424;
  font-family: 'Geist', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4em;
  width: 100%;
`;

export const Button = styled(NavLink)`
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  padding: 0.75rem 1.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #242424;
  width: fit-content;
  background: transparent;
  transition: all 0.2s ease;
  text-decoration: none;

  /* Покращена доступність для тач-пристроїв */
  -webkit-tap-highlight-color: transparent;
  min-height: 44px;
  min-width: 44px;

  &:hover,
  &:focus {
    background-color: #242424;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ButtonText = styled.p`
  color: #242424;
  font-family: 'Geist', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.25em;
  transition: color 0.2s ease;

  ${Button}:hover &, ${Button}:focus & {
    color: white;
  }
`;

export const Container = styled.div`
  display: flex;
  padding: 1rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  border-radius: 0.5rem;
  background: #fff;
  margin: 1rem;
  width: calc(100% - 2rem);
  box-sizing: border-box;

  @media screen and (min-width: 768px) {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    max-width: 400px;
  }

  @media screen and (min-width: 1440px) {
    position: absolute;
    /* left: 50%;
        transform: translateX(-50%); */
    bottom: 1px;
    right: auto;
    max-width: 500px;
    /* width: 88%; */
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
`;

export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
`;

export const Description = styled.p`
  color: var(--black-500);
  font-family: var(--font-family);
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.4em;
  width: 100%;

  @media screen and (min-width: 768px) {
    font-size: 1rem;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  flex-wrap: wrap;
`;

export const PrimaryButton = styled(NavLink)`
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  padding: 0.75rem 1.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  background: #3098ee;
  border: none;
  transition: all 0.2s ease;
  text-decoration: none;

  /* Покращена доступність для тач-пристроїв */
  -webkit-tap-highlight-color: transparent;
  min-height: 44px;
  min-width: 44px;

  &:hover,
  &:focus {
    background: #1a7bc9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SecondaryButton = styled.button`
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  padding: 0.75rem 1.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--black-500);
  border-radius: 0.5rem;
  background: transparent;
  transition: all 0.2s ease;

  /* Покращена доступність для тач-пристроїв */
  -webkit-tap-highlight-color: transparent;
  min-height: 44px;
  min-width: 44px;

  &:hover,
  &:focus {
    background-color: #242424;
    border-color: #242424;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ButtonTextWhite = styled.p`
  color: #fff;
  font-family: 'Geist', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.25em;
`;

export const ButtonTextBlack = styled(ButtonTextWhite)`
  color: #242424;
  transition: color 0.2s ease;

  ${SecondaryButton}:hover &, ${SecondaryButton}:focus & {
    color: white;
  }
`;

export const ImageSection = styled.div`
  position: relative;
  width: 100%;

  @media screen and (min-width: 768px) {
    max-width: 100%;
  }
`;

// Додаємо глобальні стилі для усунення горизонтального скролу
export const GlobalStyles = styled.div`
  * {
    box-sizing: border-box;
  }

  html,
  body {
    overflow-x: hidden;
    width: 100%;
    position: relative;
  }

  /* Усунення горизонтального скролу на iOS */
  @supports (-webkit-touch-callout: none) {
    body {
      position: fixed;
      width: 100%;
      height: 100%;
    }
  }
`;
