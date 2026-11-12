import type { ReactNode } from 'react';
import styled from 'styled-components';
import { nativeScrollbarStyles } from '@cake-admin/cakeand';
import { AppBackground } from '../../components/AppBackground';

type AuthShellProps = {
  label: string;
  children: ReactNode;
  /** Optional sticky footer (e.g. Continue) that stays visible while the form scrolls. */
  footer?: ReactNode;
};

/**
 * Full-height auth surface without TopBar / BottomNav.
 * Scroll uses a block wrapper (not flex-on-the-scroller) so bottom padding and
 * long forms aren't clipped inside the phone frame.
 */
export function AuthShell({ label, children, footer }: AuthShellProps) {
  return (
    <Root aria-label={label}>
      <AppBackground />
      <Scroll>
        <Inner $hasFooter={Boolean(footer)}>{children}</Inner>
      </Scroll>
      {footer ? <FooterSlot>{footer}</FooterSlot> : null}
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
  /* Block formatting context — flex on the scroller itself clips bottom padding
     on long forms inside the phone chassis. */
  display: block;
  box-sizing: border-box;
  ${nativeScrollbarStyles}
`;

const Inner = styled.div<{ $hasFooter: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--space-400);
  width: 100%;
  box-sizing: border-box;
  padding: calc(var(--space-400) + env(safe-area-inset-top, 0px)) var(--space-350)
    ${(p) =>
      p.$hasFooter
        ? 'var(--space-400)'
        : 'calc(var(--space-800) + env(safe-area-inset-bottom, 0px))'};
`;

const FooterSlot = styled.div`
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
  padding: var(--space-250) var(--space-350)
    calc(var(--space-400) + env(safe-area-inset-bottom, 0px));
  background: color-mix(in srgb, var(--color-surfaces-canvas) 72%, transparent);
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  border-top: var(--stroke-100) solid
    color-mix(in srgb, var(--color-text-icon-primary) 12%, transparent);
`;
