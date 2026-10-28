import { useState } from 'react';
import styled from 'styled-components';
import { MyTeamPage } from '../pages/MyTeamPage';
import { AppBackground } from './AppBackground';
import { BottomNav, type NavTabId } from './BottomNav';
import { PhoneFrame } from './PhoneFrame';
import { TopBar } from './TopBar';

export function AppShell() {
  const [activeTab, setActiveTab] = useState<NavTabId>('my-team');

  return (
    <PhoneFrame>
      <Shell>
        <AppBackground />
        <AppContent>
          <TopBar />
          {activeTab === 'my-team' ? (
            <MyTeamPage />
          ) : (
            <EmptyMain aria-label="Content" />
          )}
          <BottomNav active={activeTab} onChange={setActiveTab} />
        </AppContent>
      </Shell>
    </PhoneFrame>
  );
}

const Shell = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const AppContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
`;

const EmptyMain = styled.main`
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
`;
