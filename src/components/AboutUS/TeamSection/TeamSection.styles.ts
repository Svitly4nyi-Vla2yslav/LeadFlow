import styled from 'styled-components';

export const ImageWrapp = styled.div`
  position: relative;
  border-radius: 8px;
`;

export const TextInfo = styled.div`
  position: absolute;
  border-radius: 8px;
  bottom: 10px;
  left: 0;
  right: 0;
  margin: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 1);
  h2 {
    font-family: var(--second-family);
    font-weight: 400;
    font-size: 28px;
    line-height: 90%;
    color: var(--blue-500);
  }
  p {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 16px;
    line-height: 125%;
    color: var(--black-500);
  }

  span {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 13px;
    line-height: 125%;
    color: #000;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3rem;
  width: 100%;
  min-height: 100vh;
  padding: 1rem;
  margin: 0 auto;
  overflow: visible; // Змінено з auto на visible

  @media (min-width: 768px) {
    gap: 3.5rem;
  }

  @media (min-width: 1440px) {
    display: flex;
    gap: 4rem;
    max-width: 1440px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

export const Title = styled.p`
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 14px;
  line-height: 90%;
  text-transform: uppercase;
  text-align: center;
  color: var(--black-500);
  margin-bottom: 16px;

  @media (min-width: 768px) {
    margin-bottom: 20px;
    font-size: 1rem;
  }
`;

export const Subtitle = styled.p`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 52px;
  line-height: 90%;
  text-align: center;
  color: var(--black-500);

  span {
    font-family: inherit;
    font-weight: inherit;
    font-size: inherit;
    line-height: 90%;
    text-align: center;
    color: var(--blue-500);
  }

  @media (min-width: 768px) {
    font-size: 4.5rem;
  }

  @media (min-width: 1440px) {
    font-size: 4.5rem;
  }
`;

export const ImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1.5rem;
  width: 100%;

  @media (min-width: 768px) {
  }

  @media (min-width: 1440px) {
    flex-direction: row;
  }
`;

export const ImageRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  @media (min-width: 1440px) {
  }
`;

export const TeamImage = styled.img`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
 width: 322px;
height: 485px;
  /* max-width: none; */
  object-fit: cover;

  @media (min-width: 768px) {
    height: 485px;
  }

  @media (min-width: 1440px) {
    height: 485px;
  }
`;
