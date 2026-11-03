import { nativeScrollbarStyles } from '@cake-admin/cakeand';
import styled from 'styled-components';
import type { ReactNode } from 'react';

type PageScrollProps = {
  label: string;
  children: ReactNode;
  compact?: boolean;
};

/**
 * Single vertical scroller for content routes.
 * BottomNav is in-flow below this region — do not add nav-height padding here.
 */
export function PageScroll({ label, children, compact }: PageScrollProps) {
  return (
    <Page aria-label={label} $compact={!!compact} data-page-scroll>
      {children}
    </Page>
  );
}

const Page = styled.main<{ $compact: boolean }>`
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${(p) => (p.$compact ? 'var(--space-350)' : 'var(--space-500)')};
  padding: var(--space-350) var(--space-300);
  padding-bottom: calc(var(--space-500) + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
  ${nativeScrollbarStyles}

  /* Cake Card (and similar) use overflow:hidden — do not let flex shrink clip them. */
  & > * {
    flex-shrink: 0;
    min-width: 0;
    max-width: 100%;
  }
`;
