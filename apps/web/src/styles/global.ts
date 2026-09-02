import { createGlobalStyle } from 'styled-components';
export const GlobalStyle = createGlobalStyle`
  *{box-sizing:border-box} html,body,#root{height:100%}
  body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
    color:${({theme})=>theme.colors.text};
    background:
      radial-gradient(1200px 800px at 20% 0%, rgba(99,102,241,.15), transparent),
      radial-gradient(1000px 600px at 80% 100%, rgba(16,185,129,.12), transparent),
      linear-gradient(180deg, rgba(8,10,14,.85), rgba(8,10,14,.95));
    backdrop-filter: blur(${({theme})=>theme.blur});
  }
  ::selection{background:${({theme})=>theme.colors.accentSoft}}
  a{color:#93c5fd;text-decoration:none} a:hover{text-decoration:underline}
  input,select,textarea{width:100%;min-height:40px;padding:9px 11px;border-radius:9px;border:1px solid rgba(255,255,255,.18);background:rgba(8,10,14,.65);color:inherit;font:inherit}
  textarea{resize:vertical;min-height:82px} option{background:#111827}
  label{display:grid;gap:6px;font-size:13px;color:rgba(255,255,255,.78)}
  .responsive-form,.toolbar{display:flex;gap:9px;flex-wrap:wrap;align-items:end}.responsive-form>*{flex:1 1 150px}.toolbar>input{flex:1 1 260px}.toolbar>select{flex:0 1 190px}.toolbar button{width:auto}
  .checkbox{display:flex;grid-auto-flow:column;align-items:center;gap:7px;white-space:nowrap}.checkbox input{width:auto;min-height:auto}
  .data-table{width:100%;border-collapse:collapse}.data-table th,.data-table td{text-align:left;padding:12px 10px;vertical-align:top;border-top:1px solid rgba(255,255,255,.1)}.data-table th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;opacity:.68}
  .status-pill{display:inline-block;padding:4px 8px;border:1px solid;border-radius:999px;font-size:12px;font-weight:750}
  .detail-grid{display:grid;gap:16px;grid-template-columns:repeat(2,minmax(0,1fr))}.detail-grid> :last-child:nth-child(odd){grid-column:1/-1}
  .field-grid{display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr))}.span-2{grid-column:1/-1}
  .timeline{display:grid;gap:0}.timeline>div{border-left:2px solid rgba(99,102,241,.55);padding:0 0 18px 14px}.timeline small{display:block;opacity:.6;margin-top:3px}.timeline p{margin:7px 0 0;white-space:pre-wrap}
  .metric-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}.metric-row span{display:grid;gap:5px;padding:12px;border-radius:10px;background:rgba(255,255,255,.04)}.metric-row strong{font-size:23px}
  @media(max-width:760px){.detail-grid,.field-grid{grid-template-columns:1fr}.detail-grid>*,.span-2{grid-column:auto}.data-table th,.data-table td{padding:10px 7px}}
`;
