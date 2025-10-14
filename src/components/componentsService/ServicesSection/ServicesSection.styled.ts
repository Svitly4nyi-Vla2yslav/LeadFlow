import { NavLink } from 'react-router';
import { styled } from 'styled-components';

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  min-width: 100vw;
  overflow: auto;
  padding: 1rem;
  padding-top: 100px;

  @media screen and (max-width: 767px) {
    padding-top: 80px;
    gap: 0.8rem;
  }

  @media screen and (min-width: 1440px) {
    margin: 0 auto;
    padding-top: 100px;
    width: 100%;
    max-width: 1440px;
  }
`;

export const SmallText = styled.p`
  color: #242424;
  font-family: 'Geist', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 0.9em;
  width: 100%;

  @media screen and (max-width: 767px) {
    font-size: 0.8rem;
  }

  @media screen and (min-width: 768px) {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 14px;
    line-height: 90%;
    text-transform: uppercase;
    color: var(--black-500);
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3rem;
  width: auto;

  @media screen and (max-width: 767px) {
    gap: 2rem;
  }

  @media screen and (min-width: 1440px) {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }
`;

export const ServiceBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  width: 100%;

  @media screen and (max-width: 767px) {
    gap: 0.2rem;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 100%;

  @media screen and (max-width: 767px) {
    gap: 0.2rem;
  }
`;

export const Number = styled.p`
  color: #242424;
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 35px;
  line-height: 90%;

  @media screen and (max-width: 767px) {
    font-size: 28px;
  }

  @media screen and (min-width: 768px) {
    font-family: var(--second-family);
    font-weight: 400;
    font-size: 56px;
    line-height: 90%;
    color: var(--black-500);
  }
`;

export const TitleBlue = styled.p`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 35px;
  line-height: 90%;
  color: var(--blue-500);

  @media screen and (max-width: 767px) {
    font-size: 28px;
  }

  @media screen and (min-width: 768px) {
    font-size: 56px;
  }
`;

export const Title = styled.p`
  color: #242424;
  font-family: var(--second-family);
  font-size: 35px;
  font-weight: 400;
  line-height: 0.9em;
  width: 100%;

  @media screen and (max-width: 767px) {
    font-size: 28px;
  }

  @media screen and (min-width: 768px) {
    font-size: 56px;
  }
`;

export const TitleCard = styled.p`
  color: #242424;
  font-family: var(--second-family);
  font-size: 35px;
  font-weight: 400;
  line-height: 0.9em;
  width: 100%;

  @media screen and (max-width: 767px) {
    font-size: 28px;
  }

  @media screen and (min-width: 768px) {
    font-family: var(--second-family);
    font-weight: 400;
    font-size: 38px;
    line-height: 90%;
    color: var(--black-500);
  }
`;

export const ServiceImage = styled.img`
  display: block;
  width: 100%;
  height: 647px;
  object-fit: cover;
  object-position: left center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;

  /* Фокус для доступності */
  &:focus {
    outline: 2px solid var(--blue-500);
    outline-offset: 2px;
  }

  @media screen and (max-width: 767px) {
    height: 400px;
    object-position: center center;
  }

  @media screen and (min-width: 768px) {
    width: 100%;
    height: min-content;
    object-position: center center;
  }

  @media screen and (min-width: 1440px) {
    max-width: 563px;
  }
`;

export const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;

  @media screen and (max-width: 767px) {
    gap: 0.8rem;
  }

  @media screen and (min-width: 1440px) {
    padding-top: 40%;
  }
`;

export const InfoText = styled.p`
  color: #242424;
  font-family: 'Geist', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.25em;
  width: 100%;

  @media screen and (max-width: 767px) {
    font-size: 0.9rem;
  }
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
  position: absolute;
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  border-radius: 4px;
  background: #fff;
  bottom: 0%;
  overflow: auto;
  margin: 0 auto;
  margin: 16px;

  @media screen and (max-width: 767px) {
    position: relative;
    margin: 12px 0;
    gap: 16px;
  }

  @media screen and (min-width: 1440px) {
    max-width: 537px;
    margin: 12px;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;

  @media screen and (max-width: 767px) {
    gap: 6px;
  }
`;

export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;

  @media screen and (max-width: 767px) {
    gap: 6px;
  }
`;

export const Description = styled.p`
  color: var(--black-500);
  font-family: var(--font-family);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.25em;
  width: 100%;

  @media screen and (max-width: 767px) {
    font-size: 0.9rem;
    line-height: 1.3em;
  }

  @media screen and (min-width: 768px) {
    font-size: 17px;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  @media screen and (max-width: 767px) {
    gap: 10px;
  }
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
  height: 100%;

  @media screen and (max-width: 767px) {
    display: flex;
    flex-direction: column;
  }

  @media screen and (min-width: 768px) {
    max-width: 768px;
  }
`;
