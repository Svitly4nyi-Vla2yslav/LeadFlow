import 'styled-components';
import type { Theme } from './theme';

declare module 'styled-components' {
  // Підкажемо styled-components, яка у нас тема
  // ТИП Theme ми експортуємо з theme.ts
  export interface DefaultTheme extends Theme {}
}
