import { Button } from '@cake-admin/cakeand';
import { GlassCard } from '../../components/GlassCard';
import { Play } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { CakeChart } from '../../charts/CakeChart';
import { createHorizontalBarOption } from '../../charts/options';
import { InterpretationLabel } from '../../components/ai/InterpretationLabel';
import { ChartCard } from '../../components/charts/ChartCard';
import { FormGuide } from '../../components/charts/FormGuide';
import { ContentSection } from '../../components/layout/ContentSection';
import { restingTile } from '../../styles/surfaces';
import { PageScroll } from '../../components/layout/PageScroll';
import { StreamLoginModal } from '../../components/match/StreamLoginModal';
import { TeamIdentity } from '../../components/match/TeamIdentity';
import { WhereToWatchCard } from '../../components/match/WhereToWatchCard';
import { PitchLineup } from '../../components/my-team/PitchLineup';
import { ErrorState } from '../../components/system/ErrorState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import { DEMO_MATCH_ID } from '../../data/fixtures/demoSpine';
import { finalStats, spainPath, swedenPath } from '../../data/spainWwc2023';
import { useMatchLoader } from '../../hooks/useMatchLoader';
import { useStreamingAuth } from '../../hooks/useStreamingAuth';
import { track } from '../../services/analytics';
import type { ViewingProvider } from '../../types/domain';

export function PreMatchPage() {
  const { matchId = DEMO_MATCH_ID } = useParams();
  const navigate = useNavigate();
  const scenario = matchId === DEMO_MATCH_ID ? 'pre-match' : undefined;
  const { data, loading, error, reload } = useMatchLoader(matchId, scenario);
  const { isUnlocked, linkProvider, linkedIds } = useStreamingAuth();
  const [providerId, setProviderId] = useState<string>();
  const [deeper, setDeeper] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    track('preview_opened', { matchId });
  }, [matchId]);

  const compareOption = useMemo(
    () =>
      createHorizontalBarOption(
        ['Possession %', 'Pass accuracy %'],
        [
          { name: 'Spain', values: [finalStats.possessionSpain, finalStats.passAccuracySpain] },
          {
            name: 'Sweden',
            values: [finalStats.possessionSweden, finalStats.passAccuracySweden],
          },
        ],
      ),
    [],
  );

  if (loading) {
    return (
      <PageScroll label="Pre-match lineup report">
        <SkeletonBlock label="Loading lineup report" />
      </PageScroll>
    );
  }
  if (error || !data) {
    return (
      <PageScroll label="Pre-match lineup report">
        <ErrorState message={error ?? 'Missing match'} onRetry={() => void reload()} />
      </PageScroll>
    );
  }

  const { match, home, away } = data;
  const why = match.storylines[0];
  const homeLineup = match.lineups.find((l) => l.teamId === home.id);
  const awayLineup = match.lineups.find((l) => l.teamId === away.id);
  // PitchLineup encodes the Spain–Sweden SF XI demo; only show it there.
  const showDemoPitch = matchId === DEMO_MATCH_ID;

  function goLive() {
    if (isUnlocked) {
      navigate(`/matchday/${match.id}/live`);
      return;
    }
    track('stream_login_opened', { matchId: match.id, from: 'preview' });
    setLoginOpen(true);
  }

  function handleProviderSelect(provider: ViewingProvider) {
    linkProvider(provider.id);
    track('stream_provider_linked', { providerId: provider.id, matchId: match.id });
    track('stream_watch_started', { providerId: provider.id, matchId: match.id });
    setLoginOpen(false);
    navigate(`/matchday/${match.id}/live`);
  }

  return (
    <PageScroll label="Pre-match lineup report" compact>
      <StreamLoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        providers={match.viewingProviders}
        linkedIds={linkedIds}
        onSelectProvider={handleProviderSelect}
      />
      <Back type="button" onClick={() => navigate('/upcoming')}>
        ← Upcoming
      </Back>

      <ReportHeader>
        <ReportTitle>Pre-match Lineup Report</ReportTitle>
        <FixtureRow>
          <TeamIdentity team={home} size={28} showName={false} />
          <Vs aria-hidden>vs</Vs>
          <TeamIdentity team={away} size={28} showName={false} />
        </FixtureRow>
        <Kickoff>{match.kickoffLabel}</Kickoff>
      </ReportHeader>

      {why ? (
        <GlassCard>
          <Pad>
            <InterpretationLabel
              kind={why.source === 'fact' ? 'fact' : 'interpretation'}
            />
            <Eyebrow>AI tactical forecast</Eyebrow>
            <H2>{why.title}</H2>
            <P>{why.summary}</P>
            {why.deeper ? (
              <>
                <Button
                  size="sm"
                  intent="secondary"
                  variant="ghost"
                  onClick={() => {
                    setDeeper((v) => !v);
                    if (!deeper) track('explanation_expanded', { matchId });
                  }}
                >
                  {deeper ? 'Hide tactical detail' : 'Show deeper tactical context'}
                </Button>
                {deeper ? <P>{why.deeper}</P> : null}
              </>
            ) : null}
            <Powered>Powered by Lenovo</Powered>
          </Pad>
        </GlassCard>
      ) : null}

      <ContentSection title="Lineups">
        <GlassCard>
          <Pad>
            <InterpretationLabel kind={homeLineup?.confirmed ? 'fact' : 'expected'} />
            <TeamLine>
              <strong>{home.name}</strong>
              <span>
                {homeLineup?.formation ?? 'TBD'} ·{' '}
                {homeLineup?.confirmed ? 'confirmed' : 'expected'}
              </span>
            </TeamLine>
            <TeamLine>
              <strong>{away.name}</strong>
              <span>
                {awayLineup?.formation ?? 'TBD'} ·{' '}
                {awayLineup?.confirmed ? 'confirmed' : 'expected'}
              </span>
            </TeamLine>
          </Pad>
        </GlassCard>
        {showDemoPitch ? (
          <PitchWrap>
            <PitchLineup />
          </PitchWrap>
        ) : null}
      </ContentSection>

      <FormGuide title={`${home.name} recent form`} entries={spainPath} />
      <FormGuide title={`${away.name} recent form`} entries={swedenPath} />

      <ChartCard
        title="Season-stat comparison"
        periodLabel="Reference stats · mock"
        summary={`Spain ${finalStats.possessionSpain}% possession vs Sweden ${finalStats.possessionSweden}%.`}
      >
        <CakeChart
          option={compareOption}
          height={180}
          ariaLabel="Pre-match possession and pass accuracy comparison"
        />
      </ChartCard>

      <WhereToWatchCard
        providers={match.viewingProviders}
        selectedId={providerId}
        onSelect={(id) => {
          setProviderId(id);
          track('where_to_watch_selected', { providerId: id });
        }}
      />

      <Button fullWidth startIcon={<Play size={16} />} onClick={goLive}>
        Watch live in app
      </Button>
      <Button fullWidth intent="secondary" variant="ghost" onClick={goLive}>
        Continue to live companion
      </Button>
    </PageScroll>
  );
}

const Back = styled.button`
  align-self: flex-start;
  min-height: 44px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-primary-primary);
  text-decoration: underline;
`;

const ReportHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-150);
  width: 100%;
  padding-bottom: var(--space-200);
  border-bottom: 1px solid var(--color-stroke-border);
`;

const ReportTitle = styled.h1`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
  text-align: center;
`;

const FixtureRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-150);
`;

const Vs = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-icon-secondary);
`;

const Kickoff = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-icon-primary);
  text-align: center;
`;

const Pad = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-150);
  padding: var(--space-300);
`;

const Eyebrow = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-primary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const H2 = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const P = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.45;
  color: var(--color-text-icon-secondary);
`;

const Powered = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const TeamLine = styled.p`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-secondary);

  strong {
    color: var(--color-text-icon-primary);
    font-weight: var(--font-weight-bold);
  }
`;

const PitchWrap = styled.div`
  width: 100%;
  min-width: 0;
  padding: var(--space-200);
  ${restingTile}
`;
