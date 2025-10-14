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
`;
