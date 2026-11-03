import type { ReactNode } from 'react';
import styled from 'styled-components';

/**
 * Fluid mobile shell (Cake Template ~430px).
 * No transform scaling — short viewports scroll instead of clipping.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <Viewport>
      <Column>{children}</Column>
    </Viewport>
  );
}

const Viewport = styled.div`
  height: 100dvh;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  background: var(--color-surfaces-canvas);
  box-sizing: border-box;
  overflow: hidden;
`;

const Column = styled.div`
  position: relative;
  width: 100%;
  max-width: 430px;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-secondary-secondary-press);
  box-shadow: var(--elevation-5);

  @media (min-width: 480px) {
    height: calc(100% - var(--space-400));
    max-height: calc(100% - var(--space-400));
    margin: var(--space-200) 0;
    border-radius: var(--radius-400);
  }
`;
