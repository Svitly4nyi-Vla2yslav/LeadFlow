import styled from 'styled-components';

export const MainContainer = styled.div<{ $bg: string }>`
  background-image: url(${({ $bg }) => $bg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100vh;
  height: 1413px; /* щоб було видно фон */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 100px;
  flex-direction: column;
  flex-wrap: nowrap;

  @media screen and (min-width: 768px) {
    height: 1092px;
  }

  @media screen and (min-width: 1440px) {
    height: 800px;
    width: 1440px;
  }
`;

export const TitleServing = styled.h2`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 52px;
  line-height: 90%;
  text-align: center;
  color: var(--white);
  margin: 0 auto;
  max-width: 343px;
  padding-top: 40px;

  @media screen and (min-width: 768px) {
    font-size: 72px;
    min-width: 750px;
  }

  @media screen and (min-width: 1440px) {
  }
`;

export const SubtitleServing = styled.p`
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 16px;
  line-height: 125%;
  text-align: center;
  color: var(--white);
  margin: 0 auto;
  max-width: 343px;
  padding-top: 40px;

  @media screen and (min-width: 768px) {
    font-size: 17px;
  }

  @media screen and (min-width: 1440px) {
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  max-width: 100vw;
  padding: 0 5px;
  padding-top: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 768px) {
  }

  @media screen and (min-width: 1440px) {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
     padding-top: 40px;
  }
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  // flex: 1 1 calc(50% - 12px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 165px;
  height: 164px;

  @media screen and (min-width: 768px) {
    width: 221px;
    height: 164px;
  }

  @media screen and (min-width: 1440px) {
  }
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media screen and (min-width: 768px) {
  }

  @media screen and (min-width: 1440px) {
  }
`;

export const IconWrapper = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: 768px) {
  }

  @media screen and (min-width: 1440px) {
  }
`;

export const County = styled.p`
  color: #3098ee;
  font-family: 'Geist', sans-serif;
  font-size: 14px;
  font-weight: 500;
  @media screen and (min-width: 768px) {
  }

  @media screen and (min-width: 1440px) {
  }
`;

export const City = styled.p`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 32px;
  line-height: 90%;
  color: var(--blue-500);
  @media screen and (min-width: 768px) {
  }

  @media screen and (min-width: 1440px) {
  }
`;
