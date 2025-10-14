export const theme = {
  colors:{ bg:'rgba(10,12,16,.6)', card:'rgba(255,255,255,.06)', text:'rgba(255,255,255,.92)', subtle:'rgba(255,255,255,.65)', border:'rgba(255,255,255,.12)', accent:'rgba(99,102,241,.9)', accentSoft:'rgba(99,102,241,.25)'},
  blur:'16px', radius:'16px', spacing:(n:number)=>`${n*8}px`
} as const;
export type Theme = typeof theme;
