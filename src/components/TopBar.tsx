import {
  Avatar,
  Counter,
  Divider,
  IconButton,
  MenuContainer,
  MenuItem,
} from '@cake-admin/cakeand';
import {
  Bell,
  CircleHelp,
  Info,
  LogOut,
  Settings,
  UserRound,
} from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { notifications } from '../data/fixtures/demoSpine';
import { useAccount } from '../features/auth/AccountContext';
import { stickyChrome } from '../styles/surfaces';
import { AppIcon } from './AppIcon';

export function TopBar() {
  const navigate = useNavigate();
  const { user, isOnboarded, signOut } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!menuOpen) return;

    // Use click (not mousedown) so MenuItem onClick can fire before the menu unmounts.
    // Defer attach so the opening click does not immediately close the menu.
    function onDocClick(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }

    const timer = window.setTimeout(() => {
      document.addEventListener('click', onDocClick);
    }, 0);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  function go(path: string) {
    setMenuOpen(false);
    navigate(path);
  }

  function handleLogOut() {
    setMenuOpen(false);
    signOut();
    navigate('/welcome', { replace: true });
  }

  return (
    <Bar>
      <Brand type="button" aria-label="AI for Fans home" onClick={() => navigate('/home')}>
        <AppIcon size={32} />
      </Brand>
      <Actions ref={wrapRef}>
        <MenuAnchor>
          {isOnboarded && user ? (
            <AccountTrigger
              type="button"
              aria-label="Account menu"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? menuId : undefined}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Avatar size="sm" initials={user.initials} alt={user.displayName} />
            </AccountTrigger>
          ) : (
            <IconButton
              label="Account menu"
              icon={<UserRound size={20} />}
              intent="secondary"
              variant="ghost"
              size="sm"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? menuId : undefined}
              onClick={() => setMenuOpen((open) => !open)}
            />
          )}
          {menuOpen ? (
            <MenuPop id={menuId}>
              <MenuContainer role="menu" aria-label="Account menu" width={240}>
                {user ? (
                  <MenuIdentity>
                    <Avatar size="sm" initials={user.initials} alt={user.displayName} />
                    <div>
                      <IdentityName>{user.displayName}</IdentityName>
                      {user.email ? <IdentityEmail>{user.email}</IdentityEmail> : null}
                    </div>
                  </MenuIdentity>
                ) : null}
                <MenuItem
                  leftSlot={<UserRound size={16} />}
                  showRightSlot={false}
                  onClick={() => go('/profile')}
                >
                  View Profile
                </MenuItem>
                <MenuItem
                  leftSlot={<Settings size={16} />}
                  showRightSlot={false}
                  onClick={() => go('/settings')}
                >
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem
                  leftSlot={<CircleHelp size={16} />}
                  showRightSlot={false}
                  onClick={() => setMenuOpen(false)}
                >
                  Help & Support
                </MenuItem>
                <MenuItem
                  leftSlot={<Info size={16} />}
                  showRightSlot={false}
                  onClick={() => setMenuOpen(false)}
                >
                  About the App
                </MenuItem>
                <Divider />
                <LogoutItem
                  leftSlot={<LogOut size={16} />}
                  showRightSlot={false}
                  onClick={handleLogOut}
                >
                  Log Out
                </LogoutItem>
              </MenuContainer>
            </MenuPop>
          ) : null}
        </MenuAnchor>
        <BellWrap>
          <IconButton
            label="Notifications"
            icon={<Bell size={20} />}
            intent="secondary"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/notifications')}
          />
          {unread > 0 ? (
            <BellBadge aria-hidden>
              <Counter count={unread > 9 ? '9+' : unread} status="destructive" popout />
            </BellBadge>
          ) : null}
        </BellWrap>
      </Actions>
    </Bar>
  );
}

const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: calc(var(--space-200) + env(safe-area-inset-top, 0px)) var(--space-350)
    var(--space-150);
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  border-bottom: 1px solid transparent;
  ${stickyChrome}
`;

const Brand = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  position: relative;
`;

const MenuAnchor = styled.div`
  position: relative;
`;

const AccountTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  border-radius: var(--radius-1000);

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: 2px;
  }
`;

const MenuPop = styled.div`
  position: absolute;
  top: calc(100% + var(--space-100));
  right: 0;
  z-index: 20;
`;

const MenuIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-200);
  padding: var(--space-200) var(--space-300);
`;

const IdentityName = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const IdentityEmail = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const LogoutItem = styled(MenuItem)`
  color: var(--color-error-error);

  svg {
    color: var(--color-error-error);
  }
`;

const BellWrap = styled.div`
  position: relative;
`;

const BellBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  pointer-events: none;
  transform: translate(25%, -25%);
`;
