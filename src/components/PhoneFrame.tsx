import type { ReactNode } from 'react';
import styled from 'styled-components';

/** Fixed 393×916 smartphone frame, centered and scaled to fit the viewport. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <Page>
      <ScaleWrap>
        <Frame>{children}</Frame>
      </ScaleWrap>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surfaces-canvas);
  padding: var(--space-300);
  box-sizing: border-box;
  overflow: hidden;
`;

/* Scale so the full 916px phone fits in the viewport height. */
const ScaleWrap = styled.div`
  width: 393px;
  height: 916px;
  flex-shrink: 0;
  transform: scale(min(1, (100vh - 24px) / 916));
  transform-origin: center center;
`;

const Frame = styled.div`
  width: 393px;
  height: 916px;
  border-radius: var(--radius-400);
  overflow: hidden;
  position: relative;
  background: var(--color-secondary-secondary-press);
  box-shadow: var(--elevation-5);
`;
