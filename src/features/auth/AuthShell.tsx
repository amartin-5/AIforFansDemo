import type { ReactNode } from 'react';
import styled from 'styled-components';
import { nativeScrollbarStyles } from '@cake-admin/cakeand';
import { AppBackground } from '../../components/AppBackground';

type AuthShellProps = {
  label: string;
  children: ReactNode;
};

/** Full-height auth surface without TopBar / BottomNav. */
export function AuthShell({ label, children }: AuthShellProps) {
  return (
    <Root aria-label={label}>
      <AppBackground />
      <Scroll>{children}</Scroll>
    </Root>
  );
}

const Root = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Scroll = styled.div`
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  gap: var(--space-400);
  padding: calc(var(--space-400) + env(safe-area-inset-top, 0px)) var(--space-350)
    calc(var(--space-500) + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
  ${nativeScrollbarStyles}
`;
