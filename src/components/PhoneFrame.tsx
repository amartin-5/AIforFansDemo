import type { ReactNode } from 'react';
import styled from 'styled-components';

/** Fixed 393×916 smartphone frame, centered on the page. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <Page>
      <Frame>{children}</Frame>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surfaces-canvas);
  padding: var(--space-500);
  box-sizing: border-box;
`;

const Frame = styled.div`
  width: 393px;
  height: 916px;
  border-radius: var(--radius-400);
  overflow: hidden;
  position: relative;
  background: var(--color-secondary-secondary-press);
  flex-shrink: 0;
  box-shadow: var(--elevation-5);
`;
