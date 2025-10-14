import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const ArticleContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 100px;
  margin-bottom: 100px;
`;

export const BackButton = styled(NavLink)`
  display: inline-block;
  margin-bottom: 20px;
  color: #000000ff;
  text-decoration: none;
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 16px;
  padding-top: 30px;
  &:hover {
    text-decoration: underline;
  }
`;

export const Data = styled.p`
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 14px;
  line-height: 90%;
  text-transform: uppercase;
  text-align: center;
  color: var(--black-500);
  margin-bottom: 30px;
`;

export const ArticleTitle = styled.h1`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 52px;
  line-height: 90%;
  text-align: center;
  color: var(--black-500);
  margin-bottom: 20px;

  @media (min-width: 768px) {
    font-size: 52px;
  }

  @media (min-width: 1440px) {
    font-size: 72px;
  }
`;

export const ArticleImage = styled.img`
  width: 100%;
  width: 343px;
  margin: 0 auto;
  object-fit: cover;
  object-position: top center;
  border-radius: 8px;
  margin-bottom: 30px;

  @media (min-width: 768px) {
    width: 696px;
    height: 438px;
  }

  @media (min-width: 1440px) {
    object-fit: none;
    width: 898px;
    height: 438px;
  }
`;

export const ArticleContent = styled.div`
  line-height: 1.6;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: center;
`;

export const ArticleText = styled.p`
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 17px;
  line-height: 125%;
  color: rgba(0, 0, 0, 0.75);
  max-width: 600px;
  text-align: start;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;
