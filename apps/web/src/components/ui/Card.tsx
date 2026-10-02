import styled from 'styled-components'; const Card = styled.div`
  position:relative;overflow:hidden;background:linear-gradient(145deg,${({theme})=>theme.colors.cardStrong},${({theme})=>theme.colors.card});
  border:1px solid ${({theme})=>theme.colors.border};border-radius:${({theme})=>theme.radius};padding:clamp(16px,2.4vw,24px);
  box-shadow:${({theme})=>theme.shadows.panel};backdrop-filter:blur(${({theme})=>theme.blur});
  transition:transform .24s ease,border-color .24s ease,box-shadow .24s ease;
  &::before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,.035),transparent 25%,transparent 72%,rgba(229,196,119,.025))}
  &:hover{border-color:rgba(226,190,108,.3)}
`; export default Card;
