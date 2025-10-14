import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const TipsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  @media (min-width: 768px) {
    padding-top: 100px;
  }

  @media (min-width: 1440px) {
  }
`;

export const Titel = styled.h2`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 56px;
  line-height: 90%;
  color: var(--blue-500);
  margin-bottom: 30px;
  span {
    font-family: inherit;
    font-weight: inherit;
    font-size: inherit;
    line-height: inherit;
    color: #4c4c4cff;
  }
  @media (min-width: 768px) {
    font-size: 4.5rem;
  }

  @media (min-width: 1440px) {
  }
`;

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  min-height: 100vh;
  padding: 16px;

  @media (min-width: 768px) {
    gap: 40px;
    padding: 0px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  @media (min-width: 1440px) {
    display: flex;
    gap: 40px;
    padding: 0px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: flex-start;
  }
`;

export const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;
  width: fit-content;
  @media (min-width: 1440px) {
  }
`;

export const StyledArticleCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    width: 332px;
  }

  @media (min-width: 1440px) {
    width: 425px;
  }
`;

export const StyledImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;

  @media (min-width: 375px) {
  }

  @media (min-width: 768px) {
    width: 332px;
  }

  @media (min-width: 1440px) {
    width: 425px;
  }
`;

export const StyledTitle = styled.h3`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 32px;
  line-height: 90%;
  color: var(--black-500);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (min-width: 768px) {
    font-size: 32px;
  }

  @media (min-width: 1440px) {
    font-size: 40px;
  }
`;

export const StyledDescription = styled.p`
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 16px;
  line-height: 125%;
  color: var(--black-500);
  margin: 8px 0 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;
