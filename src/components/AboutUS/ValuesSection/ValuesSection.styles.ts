import styled from 'styled-components';

export const Container = styled.section`
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3rem;
  max-width: 100vw;
  min-height: 100vh;
  overflow: auto;
  margin: 0 auto;

  /* Mobile First (375px) */
  @media (max-width: 375px) {
    padding: 0 1rem;
  }

  /* Tablet (768px) */
  @media (min-width: 768px) {
    gap: 3.5rem;
    padding: 0 2rem;
  }

  /* Desktop (1440px) */
  @media (min-width: 1440px) {
    gap: 4rem;
    width: 100%;
    max-width: 1440px;
    padding: 0 2.5rem;
  }
`;

export const SectionTitle = styled.p`
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 14px;
  line-height: 90%;
  text-transform: uppercase;
  color: var(--black-500);
  width: 100%;
  margin-bottom: 16px;
  
  @media (max-width: 767px) {
    font-size: 13px;
    margin-bottom: 12px;
  }

  @media (min-width: 768px) {
    font-size: 0.875rem;
    margin-bottom: 20px;  
  }

  @media (min-width: 1440px) {
    font-size: 0.875rem;
    margin-bottom: 24px;
  }
`;

export const SectionSubtitle = styled.p`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 52px;
  line-height: 90%;
  color: var(--black-500);
  width: 100%;

  span {
    font-family: var(--second-family);
    font-weight: 400;
    font-size: 52px;
    line-height: 90%;
    color: var(--blue-500);
  }

  @media (max-width: 767px) {
    font-size: 32px;
    
    span {
      font-size: 32px;
    }
  }

  @media (min-width: 768px) {
    font-size: 4.5rem;
    
    span {
      font-size: 4.5rem;
    }
  }

  @media (min-width: 1440px) {
    font-size: 4.5rem;
    
    span {
      font-size: 4.5rem;   
    }
  }
`;

export const ValuesGrid = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
  width: 100%;

  @media (max-width: 767px) {
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    gap: 2.5rem;
  }

  @media (min-width: 1440px) {
    gap: 2rem;
  }
`;

export const ValueCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  width: 100%;

  @media (max-width: 767px) {
    gap: 1rem;
  }

  @media (min-width: 768px) {
    gap: 1.25rem;
  }

  @media (min-width: 1440px) {
    gap: 1.25rem;
  }
`;

export const Divider = styled.div`
  background: rgba(33, 33, 33, 0.5);
  width: 100%;
  height: 1px;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  width: 100%;

  @media (max-width: 767px) {
    gap: 1rem;
  }

  /* Tablet layout */
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 2rem;
  }

  /* Desktop layout */
  @media (min-width: 1440px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0;
  }
`;

export const NumberContainer = styled.div`
  @media (min-width: 768px) {
    flex-shrink: 0;
  }

  @media (min-width: 1440px) {
    margin-right: 5.25rem;
  }
`;

export const Number = styled.p`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 32px;
  line-height: 90%;
  color: var(--black-500);
  width: fit-content;

  @media (max-width: 767px) {
    font-size: 28px;
  }

  @media (min-width: 768px) {
    font-size: 2.375rem;
  }

  @media (min-width: 1440px) {
    font-size: 2.375rem;
  }
`;

export const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (max-width: 767px) {
    gap: 0.8rem;
  }

  @media (min-width: 768px) {
    width: 45%;
    gap: 1rem;
  }

  @media (min-width: 1440px) {
    width: 45%;
    flex-shrink: 0;
    gap: 1rem;
  }
`;

export const Title = styled.p`
  font-family: var(--second-family);
  font-weight: 400;
  font-size: 38px;
  line-height: 90%;
  color: var(--blue-500);
  width: 100%;

  span {
    font-size: inherit;
    color: var(--black-500);
  }

  @media (max-width: 767px) {
    font-size: 28px;
    line-height: 1.1;
  }

  @media (min-width: 768px) {
    font-size: 2.375rem;
  }

  @media (min-width: 1440px) {
    font-size: 2.375rem;
  }
`;

export const Description = styled.p`
  color: #242424;
  font-family: 'Geist', sans-serif;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.2em;
  width: 100%;

  @media (max-width: 767px) {
    font-size: 14px;
    line-height: 1.3;
  }

  @media (min-width: 768px) {
    font-size: 1.0625rem;
    line-height: 1.25em;
  }

  @media (min-width: 1440px) {
    font-size: 1.0625rem;
    line-height: 1.25em;
  }
`;

export const ValueImage = styled.img`
  border-radius: 0.5rem;
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;

  @media (max-width: 767px) {
    height: 250px;
  }

  @media (min-width: 768px) {
    width: 75%;
    height: 250px;
  }

  @media (min-width: 1440px) {
    width: 100%;
    height: 300px;
  }
`;