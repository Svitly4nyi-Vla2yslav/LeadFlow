import styled from 'styled-components'; import { useTranslation } from 'react-i18next';
const Wrap = styled.div`display:flex;gap:8px;align-items:center;background:${({theme})=>theme.colors.card};border:1px solid ${({theme})=>theme.colors.border};padding:6px 10px;border-radius:999px;backdrop-filter:blur(18px);@media(max-width:400px){gap:4px;padding:4px 6px}`;
const Lang = styled.button<{$active?:boolean}>`min-width:44px;min-height:44px;background:${({$active,theme})=>$active?theme.colors.accentSoft:'transparent'};color:${({$active,theme})=>$active?theme.colors.accentStrong:theme.colors.subtle};border:1px solid ${({$active,theme})=>$active?theme.colors.borderGold:theme.colors.border};border-radius:999px;padding:6px 8px;cursor:pointer;transition:.18s ease;&:hover{color:${({theme})=>theme.colors.text};background:rgba(255,255,255,.035)}`;
export default function LanguageSwitcher(){ const { i18n, t } = useTranslation(); const cur = i18n.language as 'de'|'uk'|'ru';
  const change = (language: 'de'|'uk'|'ru') => { localStorage.setItem('leadflow.language', language); document.documentElement.lang = language; void i18n.changeLanguage(language); };
  return (<Wrap aria-label={t('language.select')}>{(['de','uk','ru'] as const).map(l=><Lang key={l} $active={cur===l} aria-pressed={cur===l} aria-label={t(`language.${l}`)} onClick={()=>change(l)}>{l.toUpperCase()}</Lang>)}</Wrap>);
}
