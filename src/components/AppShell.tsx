import { useEffect } from 'react';
import {
  MemoryRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import styled from 'styled-components';
import { AccountProvider, useAccount } from '../features/auth/AccountContext';
import { CreateProfilePage } from '../features/auth/CreateProfilePage';
import { LoginPage } from '../features/auth/LoginPage';
import { WelcomePage } from '../features/auth/WelcomePage';
import { ChatHistoryPage } from '../features/chat/ChatHistoryPage';
import { ChatPage } from '../features/chat/ChatPage';
import { ExplainMomentPage } from '../features/matchday/ExplainMomentPage';
import { LiveMatchPage } from '../features/matchday/LiveMatchPage';
import { LiveMatchWatchPage } from '../features/matchday/LiveMatchWatchPage';
import { MatchdayHubPage } from '../features/matchday/MatchdayHubPage';
import { PreMatchPage } from '../features/matchday/PreMatchPage';
import { RecapPage } from '../features/matchday/RecapPage';
import { ReplayPage } from '../features/matchday/ReplayPage';
import { MyTeamFeaturePage } from '../features/my-team/MyTeamFeaturePage';
import { NotificationsPage } from '../features/notifications/NotificationsPage';
import { PastMatchAnalysisPage } from '../features/past/PastMatchAnalysisPage';
import { PastMatchWatchPage } from '../features/past/PastMatchWatchPage';
import { PastPage } from '../features/past/PastPage';
import { HomePage } from '../features/home/HomePage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { UpcomingPage } from '../features/upcoming/UpcomingPage';
import { track } from '../services/analytics';
import { AppBackground } from './AppBackground';
import { BottomNav, type NavTabId } from './BottomNav';
import { PhoneFrame } from './PhoneFrame';
import { TopBar } from './TopBar';

const TAB_PATH: Record<NavTabId, string> = {
  upcoming: '/upcoming',
  matchday: '/matchday',
  'ai-chat': '/chat',
  past: '/past',
  'my-team': '/my-team',
};

const AUTH_PATHS = new Set(['/welcome', '/login', '/create-profile']);

function tabFromPath(pathname: string): NavTabId | null {
  if (pathname.startsWith('/home')) return null;
  if (pathname.startsWith('/matchday')) return 'matchday';
  if (pathname.startsWith('/chat')) return 'ai-chat';
  if (pathname.startsWith('/past')) return 'past';
  if (pathname.startsWith('/my-team')) return 'my-team';
  if (pathname.startsWith('/upcoming')) return 'upcoming';
  return null;
}

function RequireOnboarded({ children }: { children: React.ReactNode }) {
  const { isOnboarded, isAuthenticated } = useAccount();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace state={{ from: location.pathname }} />;
  }
  if (!isOnboarded) {
    return <Navigate to="/create-profile" replace />;
  }
  return children;
}

function ShellRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOnboarded } = useAccount();
  const onAuthScreen = AUTH_PATHS.has(location.pathname);
  const immersiveWatch =
    /\/past\/[^/]+\/watch$/.test(location.pathname) ||
    /\/matchday\/[^/]+\/watch$/.test(location.pathname);
  const active = tabFromPath(location.pathname);

  useEffect(() => {
    track('destination_viewed', { path: location.pathname });
  }, [location.pathname]);

  return (
    <Shell>
      {!onAuthScreen ? <AppBackground /> : null}
      <AppContent>
        {!onAuthScreen && isOnboarded && !immersiveWatch ? <TopBar /> : null}
        <Routes>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-profile" element={<CreateProfilePage />} />

          <Route
            path="/"
            element={
              <Navigate to={isOnboarded ? '/home' : '/welcome'} replace />
            }
          />
          <Route
            path="/home"
            element={
              <RequireOnboarded>
                <HomePage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/upcoming"
            element={
              <RequireOnboarded>
                <UpcomingPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/matchday"
            element={
              <RequireOnboarded>
                <MatchdayHubPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/matchday/:matchId/preview"
            element={
              <RequireOnboarded>
                <PreMatchPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/matchday/:matchId/live"
            element={
              <RequireOnboarded>
                <LiveMatchPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/matchday/:matchId/watch"
            element={
              <RequireOnboarded>
                <LiveMatchWatchPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/matchday/:matchId/moment/:eventId"
            element={
              <RequireOnboarded>
                <ExplainMomentPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/matchday/:matchId/replay/:eventId"
            element={
              <RequireOnboarded>
                <ReplayPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/matchday/:matchId/recap"
            element={
              <RequireOnboarded>
                <RecapPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/chat/history"
            element={
              <RequireOnboarded>
                <ChatHistoryPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/chat"
            element={
              <RequireOnboarded>
                <ChatPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/past"
            element={
              <RequireOnboarded>
                <PastPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/past/:matchId/watch"
            element={
              <RequireOnboarded>
                <PastMatchWatchPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/past/:matchId"
            element={
              <RequireOnboarded>
                <PastMatchAnalysisPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/my-team"
            element={
              <RequireOnboarded>
                <MyTeamFeaturePage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/notifications"
            element={
              <RequireOnboarded>
                <NotificationsPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireOnboarded>
                <ProfilePage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireOnboarded>
                <SettingsPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="*"
            element={<Navigate to={isOnboarded ? '/home' : '/welcome'} replace />}
          />
        </Routes>
        {!onAuthScreen && isOnboarded && !immersiveWatch ? (
          <BottomNav active={active} onChange={(id) => navigate(TAB_PATH[id])} />
        ) : null}
      </AppContent>
    </Shell>
  );
}

export function AppShell() {
  useEffect(() => {
    track('app_opened');
  }, []);

  return (
    <PhoneFrame>
      <AccountProvider>
        <MemoryRouter initialEntries={['/']}>
          <ShellRoutes />
        </MemoryRouter>
      </AccountProvider>
    </PhoneFrame>
  );
}

const Shell = styled.div`
  position: relative;
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const AppContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
  max-height: 100%;
  width: 100%;
  overflow: hidden;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
`;
