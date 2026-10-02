import styled from 'styled-components'; const Button = styled.button`
  min-height:46px;background:linear-gradient(135deg,${({theme})=>theme.colors.accentStrong},#b78936);color:${({theme})=>theme.colors.accentInk};
  border:1px solid rgba(255,239,194,.35);border-radius:13px;padding:10px 16px;cursor:pointer;font-weight:750;box-shadow:${({theme})=>theme.shadows.glow};
  transition:transform .18s ease,filter .2s ease,opacity .2s ease;&:hover{filter:brightness(1.06);transform:translateY(-1px)}&:active{transform:translateY(1px)}&:disabled{opacity:.45;cursor:not-allowed;transform:none}&:focus-visible{outline:2px solid ${({theme})=>theme.colors.accent};outline-offset:3px}@media(max-width:560px){width:100%}`; export default Button;
