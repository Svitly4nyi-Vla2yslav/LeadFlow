export const theme = {
  colors: {
    bg: '#070809',
    elevated: '#0D0F12',
    card: 'rgba(8, 10, 12, .58)',
    cardStrong: 'rgba(7, 8, 10, .76)',
    panel: 'rgba(18, 20, 24, .68)',
    text: '#F6E7B8',
    subtle: 'rgba(246, 231, 184, .52)',
    textSecondary: 'rgba(246, 231, 184, .78)',
    border: 'rgba(255, 255, 255, .08)',
    borderGold: 'rgba(212, 175, 55, .34)',
    accent: '#D4AF37',
    accentSoft: 'rgba(212, 175, 55, .12)',
    accentStrong: '#F0D77A',
    accentDeep: '#9C7A18',
    accentInk: '#111111',
    success: '#5FCB8A',
    warning: '#E4B95B',
    danger: '#E06A6A',
    info: '#7AAAF7'
  },
  shadows: {
    panel: '0 16px 40px rgba(0, 0, 0, .38), inset 0 1px 0 rgba(255, 255, 255, .04)',
    elevated: '0 24px 64px rgba(0, 0, 0, .48), inset 0 1px 0 rgba(255, 255, 255, .05)',
    glow: '0 12px 28px rgba(0, 0, 0, .35), 0 0 18px rgba(212, 175, 55, .14)'
  },
  blur: '18px',
  radius: '22px',
  radii: { sm: '12px', md: '16px', lg: '22px', xl: '28px' },
  spacing: (n: number) => `${n * 8}px`
} as const;

export type Theme = typeof theme;
