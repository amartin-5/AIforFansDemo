import { Button, Card } from '@cake-admin/cakeand';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ContentSection } from '../../components/layout/ContentSection';
import { PageScroll } from '../../components/layout/PageScroll';
import { FixtureCard } from '../../components/match/FixtureCard';
import { MatchHeroCard } from '../../components/match/MatchHeroCard';
import { StreamLoginModal } from '../../components/match/StreamLoginModal';
import { ErrorState } from '../../components/system/ErrorState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import { DEMO_MATCH_ID } from '../../data/fixtures/demoSpine';
import {
  getMatchdayFeed,
  resolveCompetition,
  resolveTeams,
} from '../../data/repositories/matchRepository';
import { useStreamingAuth } from '../../hooks/useStreamingAuth';
import { track } from '../../services/analytics';
import type { Match, ViewingProvider } from '../../types/domain';

type Feed = {
  live: Match;
  today: Match[];
  favoriteTeamId: string;
};

/** Matchday hub — today + live only; watch is login-gated. */
export function MatchdayHubPage() {
  const navigate = useNavigate();
  const { isUnlocked, linkProvider, linkedIds } = useStreamingAuth();
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMatchdayFeed();
      setFeed(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
      setFeed(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function goLive(from: string) {
    const path = `/matchday/${DEMO_MATCH_ID}/live`;
    if (isUnlocked) {
      track('match_opened', { matchId: DEMO_MATCH_ID, from });
      navigate(path);
      return;
    }
    setPendingPath(path);
    track('stream_login_opened', { matchId: DEMO_MATCH_ID, from });
    setLoginOpen(true);
  }

  function handleProviderSelect(provider: ViewingProvider) {
    linkProvider(provider.id);
    track('stream_provider_linked', {
      providerId: provider.id,
      matchId: DEMO_MATCH_ID,
    });
    setLoginOpen(false);
    const path = pendingPath ?? `/matchday/${DEMO_MATCH_ID}/live`;
    track('stream_watch_started', { providerId: provider.id, matchId: DEMO_MATCH_ID });
    track('match_opened', { matchId: DEMO_MATCH_ID, from: 'matchday-hub' });
    navigate(path);
    setPendingPath(null);
  }

  if (loading) {
    return (
      <PageScroll label="Matchday">
        <SkeletonBlock label="Loading matchday" />
      </PageScroll>
    );
  }
  if (error || !feed) {
    return (
      <PageScroll label="Matchday">
        <ErrorState message={error ?? 'No match'} onRetry={() => void load()} />
      </PageScroll>
    );
  }

  const { live } = feed;
  const { home, away } = resolveTeams(live);
  const competition = resolveCompetition(live);

  return (
    <PageScroll label="Matchday" compact>
      <StreamLoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        providers={live.viewingProviders}
        linkedIds={linkedIds}
        onSelectProvider={handleProviderSelect}
      />

      <Intro>
        <Eyebrow>Today</Eyebrow>
        <Title>Matchday</Title>
        <Sub>Live and same-day Spain focus — Women’s World Cup 2023 semi-final as the sample</Sub>
      </Intro>

      <MatchHeroCard
        editorial
        match={live}
        home={home}
        away={away}
        competition={competition}
      />

      <Button fullWidth onClick={() => goLive('matchday-hub')}>
        Watch live in app
      </Button>

      <ContentSection title="Today’s matches">
        <Grid>
          {feed.today.map((m) => {
            const sides = resolveTeams(m);
            return (
              <FixtureCard
                key={m.id}
                match={m}
                home={sides.home}
                away={sides.away}
                actionLabel="Watch →"
                onOpen={() => goLive('matchday-today-card')}
              />
            );
          })}
        </Grid>
      </ContentSection>

      <Card>
        <Pad>
          <Hint>Same match, journey states for the demo</Hint>
          <Actions>
            <Button
              variant="outline"
              intent="secondary"
              onClick={() => navigate(`/matchday/${DEMO_MATCH_ID}/preview`)}
            >
              Pre-match
            </Button>
            <Button
              variant="outline"
              intent="secondary"
              onClick={() => goLive('matchday-hub-live')}
            >
              Live companion
            </Button>
            <Button
              variant="outline"
              intent="secondary"
              onClick={() => navigate(`/matchday/${DEMO_MATCH_ID}/recap`)}
            >
              Recap
            </Button>
          </Actions>
        </Pad>
      </Card>
    </PageScroll>
  );
}

const Intro = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
`;

const Eyebrow = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Sub = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-secondary);
`;

const Pad = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  padding: var(--space-300);
`;

const Hint = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-100);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-200);
  width: 100%;
`;
