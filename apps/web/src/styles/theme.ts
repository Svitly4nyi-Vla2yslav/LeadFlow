export const theme = {
  colors:{
    bg:'#050505', card:'rgba(22,21,18,.74)', cardStrong:'rgba(28,26,21,.88)',
    text:'#f6f0e2', subtle:'#aaa396', border:'rgba(226,190,108,.20)',
    accent:'#e5c477', accentStrong:'#f4dda0', accentInk:'#171208',
    accentSoft:'rgba(229,196,119,.13)', success:'#9fd0ad', danger:'#e59b8f'
  },
  shadows:{ panel:'0 24px 70px rgba(0,0,0,.34), inset 0 1px rgba(255,255,255,.045)', glow:'0 12px 34px rgba(190,145,55,.18)' },
  blur:'24px', radius:'20px', spacing:(n:number)=>`${n*8}px`
} as const;
export type Theme = typeof theme;
