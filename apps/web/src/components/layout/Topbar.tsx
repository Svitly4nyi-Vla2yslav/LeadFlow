import styled from 'styled-components'; import LanguageSwitcher from '../LanguageSwitcher';
const Bar = styled.header`display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid ${({theme})=>theme.colors.border};background:rgba(0,0,0,.25);backdrop-filter:blur(10px);`;
export default function Topbar(){ return (<Bar><div/>{<LanguageSwitcher/>}</Bar>); }
