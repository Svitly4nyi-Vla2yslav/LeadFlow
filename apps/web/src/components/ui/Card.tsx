import styled from 'styled-components';

// Спільна картка ізолює декоративний шар, бере поверхню й тіні з теми та зберігає довільний дочірній вміст.
// Hover змінює лише рамку й тінь; компонент не керує даними, подіями або локальним станом.
const Card = styled.div`
  position:relative;isolation:isolate;overflow:hidden;background:linear-gradient(145deg,${({theme})=>theme.colors.cardStrong},${({theme})=>theme.colors.card});
  border:1px solid ${({theme})=>theme.colors.border};border-radius:${({theme})=>theme.radius};padding:clamp(16px,2.4vw,24px);
  box-shadow:${({theme})=>theme.shadows.panel};backdrop-filter:blur(${({theme})=>theme.blur}) saturate(135%);-webkit-backdrop-filter:blur(${({theme})=>theme.blur}) saturate(135%);
  transition:transform .28s ease,border-color .28s ease,box-shadow .28s ease;
  &::before{content:'';position:absolute;z-index:-1;inset:0;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,.055),transparent 24%,transparent 72%,rgba(212,175,55,.035))}
  &:hover{border-color:rgba(212,175,55,.22);box-shadow:${({theme})=>theme.shadows.elevated}}
`; export default Card;
