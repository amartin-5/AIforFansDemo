import { nativeScrollbarStyles } from '@cake-admin/cakeand';
import { createGlobalStyle } from 'styled-components';

/**
 * App-wide scrollbar matching Cake& Scrollbar / Figma node 25:5837:
 * 4px thumb, radius-50, --color-stroke-border-high (#777777 in dark.a).
 */
export const GlobalScrollbar = createGlobalStyle`
  * {
    ${nativeScrollbarStyles}
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }
`;
