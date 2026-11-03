import { createGlobalStyle } from 'styled-components';

/**
 * Hide scrollbars app-wide while keeping scroll / swipe / wheel behavior.
 */
export const GlobalScrollbar = createGlobalStyle`
  * {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  *::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;
