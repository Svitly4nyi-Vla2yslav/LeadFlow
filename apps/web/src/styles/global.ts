import { createGlobalStyle } from 'styled-components';
export const GlobalStyle = createGlobalStyle`
  *{box-sizing:border-box} html,body,#root{height:100%;min-width:0} html,body{overflow-x:hidden}
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
  h1{font-size:clamp(1.45rem,4vw,2rem);margin:0 0 10px} h2,h3{overflow-wrap:anywhere}
  button,a,input,select,textarea{touch-action:manipulation} button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,summary:focus-visible{outline:2px solid #a5b4fc;outline-offset:2px}
  input,select,textarea{width:100%;min-height:44px;padding:10px 11px;border-radius:9px;border:1px solid rgba(255,255,255,.18);background:rgba(8,10,14,.65);color:inherit;font:inherit}
  textarea{resize:vertical;min-height:82px} option{background:#111827}
  label{display:grid;gap:6px;font-size:13px;color:rgba(255,255,255,.78)}
  .responsive-form,.toolbar{display:flex;gap:9px;flex-wrap:wrap;align-items:end}.responsive-form>*{flex:1 1 150px}.toolbar>input{flex:1 1 260px}.toolbar>select{flex:0 1 190px}.toolbar button{width:auto}
  .checkbox{display:flex;grid-auto-flow:column;align-items:center;gap:7px;white-space:nowrap}.checkbox input{width:auto;min-height:auto}
  .data-table{width:100%;border-collapse:collapse}.data-table th,.data-table td{text-align:left;padding:12px 10px;vertical-align:top;border-top:1px solid rgba(255,255,255,.1)}.data-table th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;opacity:.68}
  .status-pill{display:inline-block;padding:4px 8px;border:1px solid;border-radius:999px;font-size:12px;font-weight:750}
  .detail-grid{display:grid;gap:16px;grid-template-columns:repeat(2,minmax(0,1fr))}.detail-grid> :last-child:nth-child(odd){grid-column:1/-1}
  .field-grid{display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr))}.span-2{grid-column:1/-1}
  .timeline{display:grid;gap:0}.timeline>div{border-left:2px solid rgba(99,102,241,.55);padding:0 0 18px 14px}.timeline small{display:block;opacity:.6;margin-top:3px}.timeline p{margin:7px 0 0;white-space:pre-wrap}
  .call-brief{margin-top:18px;padding:16px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(255,255,255,.035)}.call-brief h4{margin:0 0 12px}.call-brief dl{display:grid;grid-template-columns:minmax(120px,.35fr) 1fr;gap:8px 16px;margin:0}.call-brief dt{font-size:12px;text-transform:uppercase;letter-spacing:.04em;opacity:.6}.call-brief dd{margin:0;white-space:pre-wrap}
  .metric-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}.metric-row span{display:grid;gap:5px;padding:12px;border-radius:10px;background:rgba(255,255,255,.04)}.metric-row strong{font-size:23px}
  .page-stack{display:grid;grid-template-columns:minmax(0,1fr);gap:14px;min-width:0}.page-stack>*{min-width:0}.muted{opacity:.68}.error-text{color:#fca5a5}.success-text{color:#86efac}.mobile-only{display:none}.table-scroll{overflow-x:auto;max-width:100%}
  details>summary{min-height:44px;display:flex;align-items:center;cursor:pointer;list-style:none}details>summary::-webkit-details-marker{display:none}details>summary::after{content:'+';margin-left:auto;font-size:20px;opacity:.65}details[open]>summary::after{content:'−'}.section-body{padding-top:14px}.progressive-form{display:grid;gap:10px}.progressive-form>details{border-top:1px solid rgba(255,255,255,.1)}
  .form-actions,.card-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.form-actions>*{flex:1 1 180px}.secondary-button{margin-top:12px;background:rgba(255,255,255,.1)}
  .mapping-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}.import-preview{display:grid;gap:8px;max-height:260px;overflow:auto;margin:10px 0}.import-preview pre{min-width:0;overflow:auto;margin:0;padding:10px;border-radius:8px;background:rgba(0,0,0,.3);font-size:11px}
  .lead-list-card{max-width:100%;overflow-x:auto;overscroll-behavior-inline:contain}.lead-card{display:grid;gap:10px;padding:14px;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:rgba(255,255,255,.035)}.lead-card p,.lead-card h3{margin:0}.lead-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.phone-link{font-size:17px;font-weight:700}.line-clamp{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.action-link{min-height:44px;display:grid;place-items:center;flex:1;padding:9px 12px;border:1px solid rgba(255,255,255,.18);border-radius:11px;text-align:center}.action-link.primary{background:rgba(99,102,241,.7);color:#fff}.card-action-button{font:inherit;cursor:pointer}.card-action-button:disabled{opacity:.55;cursor:not-allowed}
  .detail-header{display:flex;align-items:end;justify-content:space-between;gap:14px}.detail-header h1{margin:8px 0 0}.technical-id{font-size:12px;opacity:.55}.technical-id code{display:block;overflow-wrap:anywhere;padding-top:5px}.detail-section{scroll-margin-top:76px}.section-heading{margin-bottom:12px}.sticky-actions{display:flex;justify-content:flex-end}.feedback-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:0}.feedback-grid>div{padding:12px;border-radius:10px;background:rgba(255,255,255,.04)}.feedback-grid dt{font-size:12px;opacity:.62}.feedback-grid dd{margin:5px 0 0;white-space:pre-wrap}.call-task-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
  .map-result{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:10px 12px}.map-result>input{width:22px;min-height:22px}
  .nav-label{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  @media(max-width:900px){
    .detail-grid,.field-grid,.feedback-grid{grid-template-columns:1fr}.detail-grid>*,.span-2{grid-column:auto}.call-brief dl{grid-template-columns:1fr}.call-brief dd{margin-bottom:5px}
    .desktop-only{display:none!important}.mobile-only{display:grid}.mobile-lead-list{gap:12px}.lead-list-card{padding:12px}.toolbar{display:grid;grid-template-columns:1fr;width:100%}.toolbar>*{width:100%!important}.checkbox{min-height:44px;white-space:normal}
    .responsive-form{display:grid;grid-template-columns:1fr}.form-actions{display:grid;grid-template-columns:1fr}.detail-header{align-items:stretch;display:grid}.detail-header>button{position:sticky;top:64px;z-index:8}.sticky-actions{position:sticky;z-index:10;bottom:calc(69px + env(safe-area-inset-bottom));display:grid;grid-template-columns:1fr;gap:8px;padding:8px;margin:0 -4px;background:rgba(8,10,14,.92);backdrop-filter:blur(10px)}.sticky-actions button{width:100%}.mapping-grid{grid-template-columns:1fr}
    .data-table th,.data-table td{padding:10px 7px}.call-task-list{grid-template-columns:1fr}
    .map-result{grid-template-columns:auto minmax(0,1fr)}.map-result>button{grid-column:1/-1}
  }
`;
