import styled from 'styled-components'; import { useTranslation } from 'react-i18next';
const Wrap = styled.div`display:flex;gap:8px;align-items:center;background:${({theme})=>theme.colors.card};border:1px solid ${({theme})=>theme.colors.border};padding:6px 10px;border-radius:999px;`;
const Lang = styled.button<{active?:boolean}>`background:${({active,theme})=>active?theme.colors.accentSoft:'transparent'};color:${({theme})=>theme.colors.text};border:1px solid ${({theme})=>theme.colors.border};border-radius:999px;padding:6px 10px;cursor:pointer;`;
export default function LanguageSwitcher(){ const { i18n } = useTranslation(); const cur = i18n.language as 'de'|'uk'|'ru';
  return (<Wrap>{(['de','uk','ru'] as const).map(l=><Lang key={l} active={cur===l} onClick={()=>i18n.changeLanguage(l)}>{l.toUpperCase()}</Lang>)}</Wrap>);
}
