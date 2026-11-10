import { CalendarDays, History, Radio, Shirt } from 'lucide-react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { stickyChrome } from '../styles/surfaces';
import { AppIcon } from './AppIcon';

export type NavTabId = 'upcoming' | 'matchday' | 'ai-chat' | 'past' | 'my-team';

const TABS: {
  id: NavTabId;
  label: string;
  kind: 'icon' | 'app';
  icon?: ReactNode;
}[] = [
  { id: 'upcoming', label: 'Upcoming', kind: 'icon', icon: <CalendarDays size={20} aria-hidden /> },
  { id: 'matchday', label: 'Matchday', kind: 'icon', icon: <Radio size={20} aria-hidden /> },
  { id: 'ai-chat', label: 'AI Chat', kind: 'app' },
  { id: 'past', label: 'Past', kind: 'icon', icon: <History size={20} aria-hidden /> },
  { id: 'my-team', label: 'My Team', kind: 'icon', icon: <Shirt size={20} aria-hidden /> },
];

type BottomNavProps = {
  /** Null when no primary tab is selected (e.g. Home overview). */
  active: NavTabId | null;
  onChange: (id: NavTabId) => void;
};

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <Bar aria-label="Primary">
      <Wrap>
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <NavItem
              key={tab.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.label}
              onClick={() => onChange(tab.id)}
            >
              {tab.kind === 'app' ? (
                <AppIcon size={32} />
              ) : (
                <IconSlot $active={isActive}>{tab.icon}</IconSlot>
              )}
              <Label $active={isActive}>{tab.label}</Label>
            </NavItem>
          );
        })}
      </Wrap>
      <HomeIndicatorArea>
        <HomeIndicator />
      </HomeIndicatorArea>
    </Bar>
  );
}

const Bar = styled.nav`
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid transparent;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  ${stickyChrome}
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-150) var(--space-100) var(--space-100);
`;

const NavItem = styled.button`
  flex: 1 0 0;
  min-width: 0;
  min-height: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-050);
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  color: inherit;
  font: inherit;
  border-radius: var(--radius-200);
  transition: background 160ms ease;

  &[aria-current='page'] {
    background: var(--color-primary-primary-overlay);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const IconSlot = styled.span<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 28px;
  border-radius: var(--radius-1000);
  color: ${(p) =>
    p.$active
      ? 'var(--color-primary-primary)'
      : 'var(--color-text-icon-secondary)'};
  transition: color 160ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* Figma medium.10 — no cake& type token at 10px; closest caption is 12px. */
const Label = styled.span<{ $active: boolean }>`
  font-family: var(--font-family);
  font-weight: ${(p) =>
    p.$active ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)'};
  font-size: 10px;
  line-height: 1.35;
  letter-spacing: 0.2px;
  text-align: center;
  white-space: nowrap;
  color: ${(p) =>
    p.$active
      ? 'var(--color-text-icon-primary)'
      : 'var(--color-text-icon-secondary)'};
`;

const HomeIndicatorArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 21px;
  width: 100%;
  padding: var(--space-100) 129px;
  box-sizing: border-box;
`;

const HomeIndicator = styled.div`
  width: 100px;
  height: 4px;
  border-radius: var(--radius-1000);
  background: var(--color-stroke-border-container-os);
`;
