import { Button } from '@cake-admin/cakeand';
import { GlassCard } from '../../components/GlassCard';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { CakeChart } from '../../charts/CakeChart';
import { createHorizontalBarOption } from '../../charts/options';
import { AIInsightCard } from '../../components/ai/AIInsightCard';
import { ChartCard } from '../../components/charts/ChartCard';
import { ContentSection } from '../../components/layout/ContentSection';
import { PageScroll } from '../../components/layout/PageScroll';
import { EventTimeline } from '../../components/match/EventTimeline';
import { LiveStreamHero } from '../../components/match/LiveStreamHero';
import { MatchChatOverlay } from '../../components/match/MatchChatOverlay';
import { StreamLoginModal } from '../../components/match/StreamLoginModal';
import { StreamProviderPicker } from '../../components/match/StreamProviderPicker';
import { ErrorState } from '../../components/system/ErrorState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import { DEMO_MATCH_ID } from '../../data/fixtures/demoSpine';
import { useMatchLoader } from '../../hooks/useMatchLoader';
import { restingSurface } from '../../styles/surfaces';
import { useStreamingAuth } from '../../hooks/useStreamingAuth';
import { track } from '../../services/analytics';
import type { MatchEvent, ViewingProvider } from '../../types/domain';

export function LiveMatchPage() {
  const { matchId = DEMO_MATCH_ID } = useParams();
  const navigate = useNavigate();
  const scenario = matchId === DEMO_MATCH_ID ? 'live' : undefined;
  const { data, loading, error, reload } = useMatchLoader(matchId, scenario);
  const { isUnlocked, linkProvider, linkedIds, linkedProviderId } = useStreamingAuth();
  const [selected, setSelected] = useState<MatchEvent | null>(null);
  const [loginOpen, setLoginOpen] = useState(!isUnlocked);
  const [preferredProviderId, setPreferredProviderId] = useState<string | undefined>();

  const liveCompare = useMemo(() => {
    if (!data) return null;
    const { match, home, away } = data;
    const cats = match.statistics.map((s) => s.label);
    return createHorizontalBarOption(cats, [
      { name: home.name, values: match.statistics.map((s) => s.homeValue) },
      { name: away.name, values: match.statistics.map((s) => s.awayValue) },
    ]);
  }, [data]);

  if (loading) {
    return (
      <PageScroll label="Live match">
        <SkeletonBlock label="Loading live match" />
      </PageScroll>
    );
  }
  if (error || !data) {
    return (
      <PageScroll label="Live match">
        <ErrorState message={error ?? 'Missing match'} onRetry={() => void reload()} />
      </PageScroll>
    );
  }

  const { match, home, away, competition } = data;
  const insight = match.insights[0];
  const providers = match.viewingProviders;
  const availableProviders = providers.filter((p) => p.available);
  const streamValue =
    preferredProviderId ??
    linkedProviderId ??
    linkedIds[0] ??
    availableProviders[0]?.id;

  function handleProviderSelect(provider: ViewingProvider) {
    linkProvider(provider.id);
    setPreferredProviderId(provider.id);
    track('stream_provider_linked', { providerId: provider.id, matchId });
    track('stream_watch_started', { providerId: provider.id, matchId });
    setLoginOpen(false);
  }

  function requestWatch() {
    if (isUnlocked) return;
    track('stream_login_opened', { matchId, from: 'live' });
    setLoginOpen(true);
  }

  return (
    <Column>
      <StreamLoginModal
        open={loginOpen}
        onOpenChange={(open) => {
          setLoginOpen(open);
          if (open) track('stream_login_opened', { matchId, from: 'live' });
        }}
        providers={providers}
        linkedIds={linkedIds}
        onSelectProvider={handleProviderSelect}
      />

      {!isUnlocked ? (
        <PageScroll label="Live match locked">
          <Back type="button" onClick={() => navigate('/matchday')}>
            ← Matchday
          </Back>
          <LockCard>
            <LockTitle>Watch requires a linked stream</LockTitle>
            <LockBody>
              Add a streaming service to your profile to watch this match live in the app,
              then follow along with AI chat on top of the stream.
            </LockBody>
            <Button fullWidth onClick={requestWatch}>
              Catch the action
            </Button>
            <Button
              fullWidth
              intent="secondary"
              variant="outline"
              onClick={() => navigate(`/chat?matchId=${matchId}`)}
            >
              Ask AI without watching
            </Button>
          </LockCard>
        </PageScroll>
      ) : (
        <WatchShell>
          <TopPad>
            <TopRow>
              <Back type="button" onClick={() => navigate('/matchday')}>
                ← Matchday
              </Back>
              {availableProviders.length > 0 ? (
                <StreamProviderPicker
                  providers={availableProviders}
                  value={streamValue}
                  onChange={(id) => {
                    setPreferredProviderId(id);
                    linkProvider(id);
                    track('where_to_watch_selected', {
                      providerId: id,
                      from: 'live-stream',
                    });
                  }}
                />
              ) : null}
            </TopRow>
            <LiveStreamHero
              match={match}
              home={home}
              away={away}
              competition={competition}
              onExpand={() => navigate(`/matchday/${matchId}/watch`)}
            />
          </TopPad>

          <PageScroll label="Live match companion" compact>
            <Updated role="status">In-app stream · updated just now</Updated>

            <ContentSection title="Event timeline">
              <EventTimeline
                events={match.events}
                selectedId={selected?.id}
                onSelect={(ev) => {
                  setSelected(ev);
                  track('timeline_event_selected', { eventId: ev.id, matchId });
                }}
              />
            </ContentSection>

            {liveCompare ? (
              <ChartCard
                title="Live team comparison"
                periodLabel="Essential match statistics"
                summary={match.statistics
                  .map(
                    (s) =>
                      `${s.label}: ${home.name} ${s.homeValue}${s.unit === '%' ? '%' : ''} · ${away.name} ${s.awayValue}${s.unit === '%' ? '%' : ''}`,
                  )
                  .join('. ')}
              >
                <CakeChart
                  option={liveCompare}
                  height={Math.min(260, 80 + match.statistics.length * 36)}
                  ariaLabel="Live horizontal bar comparison of match statistics"
                />
              </ChartCard>
            ) : null}

            <ContentSection title="Essential statistics">
              <GlassCard>
                <StatsPad>
                  {match.statistics.map((s) => (
                    <StatRow key={s.id}>
                      <span>
                        {s.homeValue}
                        {s.unit === '%' ? '%' : ''}
                      </span>
                      <StatLabel>{s.label}</StatLabel>
                      <span>
                        {s.awayValue}
                        {s.unit === '%' ? '%' : ''}
                      </span>
                    </StatRow>
                  ))}
                </StatsPad>
              </GlassCard>
            </ContentSection>

            {insight ? (
              <AIInsightCard
                insight={insight}
                onOpen={() => {
                  track('ai_insight_opened', { insightId: insight.id });
                  navigate(`/matchday/${matchId}/moment/${insight.eventId ?? 'ev-goal-81'}`);
                }}
              />
            ) : null}
          </PageScroll>

          <MatchChatOverlay matchId={matchId} />
        </WatchShell>
      )}
    </Column>
  );
}

const Column = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const WatchShell = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const TopPad = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  padding: var(--space-100) var(--space-300) 0;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  width: 100%;
  min-height: 36px;
`;

const Back = styled.button`
  flex-shrink: 0;
  min-height: 36px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-primary-primary);
  text-decoration: underline;
`;

const LockCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-250);
  padding: var(--space-400);
  ${restingSurface}
`;

const LockTitle = styled.h1`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const LockBody = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.45;
  color: var(--color-text-icon-secondary);
`;

const Updated = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const StatsPad = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
  padding: var(--space-300);
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-100);
  align-items: center;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);

  span:first-child {
    text-align: left;
    font-weight: var(--font-weight-bold);
  }
  span:last-child {
    text-align: right;
    font-weight: var(--font-weight-bold);
  }
`;

const StatLabel = styled.span`
  text-align: center;
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;
