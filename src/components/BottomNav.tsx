import styled from 'styled-components';
import { accountCircleIcon } from '../assets/template';
import { AppIcon } from './AppIcon';

export type NavTabId = 'upcoming' | 'matchday' | 'ai-chat' | 'past' | 'my-team';

const TABS: { id: NavTabId; label: string; kind: 'icon' | 'app' }[] = [
  { id: 'upcoming', label: 'Upcoming', kind: 'icon' },
  { id: 'matchday', label: 'Matchday', kind: 'icon' },
  { id: 'ai-chat', label: 'AI Chat', kind: 'app' },
  { id: 'past', label: 'Past', kind: 'icon' },
  { id: 'my-team', label: 'My Team', kind: 'icon' },
];

type BottomNavProps = {
  active: NavTabId;
  onChange: (id: NavTabId) => void;
};

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <Bar>
      <Wrap>
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <NavItem
              key={tab.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onChange(tab.id)}
            >
              {tab.kind === 'app' ? (
                <AppIcon size={32} />
              ) : (
                /* Figma placeholder — same account_circle for all side tabs until finals */
                <IconImg src={accountCircleIcon} alt="" width={20} height={20} />
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
  z-index: 1;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid var(--color-stroke-border);
  background: var(--color-surfaces-container-blur);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 11px var(--space-100);
`;

const NavItem = styled.button`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-025);
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  color: inherit;
  font: inherit;
`;

const IconImg = styled.img`
  display: block;
  flex-shrink: 0;
`;

/* Figma medium.10 — no cake& type token at 10px; closest caption is 12px. */
const Label = styled.span<{ $active: boolean }>`
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  font-size: 10px;
  line-height: 1.35;
  letter-spacing: 0.2px;
  text-align: center;
  white-space: nowrap;
  color: var(--color-text-icon-inverse);
  opacity: ${(p) => (p.$active ? 1 : 0.85)};
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
  background: var(--color-stroke-border);
`;
