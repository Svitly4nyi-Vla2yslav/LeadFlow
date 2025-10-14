import styled from 'styled-components'; const Button = styled.button`
  background:${({theme})=>theme.colors.accent}; color:#fff; border:none; border-radius:12px; padding:10px 14px; cursor:pointer; font-weight:600; transition:transform .1s ease, opacity .2s ease; &:hover{opacity:.95} &:active{transform:translateY(1px)} &:disabled{opacity:.5;cursor:not-allowed}`; export default Button;
