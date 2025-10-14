import styled from 'styled-components'; const Card = styled.div`
  background:${({theme})=>theme.colors.card}; border:1px solid ${({theme})=>theme.colors.border}; border-radius:${({theme})=>theme.radius}; padding:16px; backdrop-filter:blur(${({theme})=>theme.blur});`; export default Card;
