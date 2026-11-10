import { Button } from '@cake-admin/cakeand';
import { GlassCard } from '../../components/GlassCard';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { CakeChart } from '../../charts/CakeChart';
import { createHorizontalBarOption } from '../../charts/options';
import { InterpretationLabel } from '../../components/ai/InterpretationLabel';
import { ChartCard } from '../../components/charts/ChartCard';
import { ContentSection } from '../../components/layout/ContentSection';
import { PageScroll } from '../../components/layout/PageScroll';
import { MatchHeroCard } from '../../components/match/MatchHeroCard';
import { ErrorState } from '../../components/system/ErrorState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import { DEMO_MATCH_ID, UPCOMING_MATCH_ID } from '../../data/fixtures/demoSpine';
import { useMatchLoader } from '../../hooks/useMatchLoader';
import { track } from '../../services/analytics';

export function RecapPage() {
  const { matchId = DEMO_MATCH_ID } = useParams();
  const navigate = useNavigate();
  const scenario = matchId === DEMO_MATCH_ID ? 'full-time' : undefined;
  const { data, loading, error, reload } = useMatchLoader(matchId, scenario);

  useEffect(() => {
    track('recap_opened', { matchId });
  }, [matchId]);

  if (loading) {
    return (
      <PageScroll label="Post-match recap">
        <SkeletonBlock label="Loading recap" />
      </PageScroll>
    );
  }
  if (error || !data) {
    return (
      <PageScroll label="Post-match recap">
        <ErrorState message={error ?? 'Missing'} onRetry={() => void reload()} />
      </PageScroll>
    );
  }

  const { match, home, away, competition } = data;
  const moments = match.events.filter((e) => match.definingMomentIds?.includes(e.id));
  const compareOption = useMemo(
    () =>
      createHorizontalBarOption(
        match.statistics.map((s) => s.label),
        [
          { name: home.name, values: match.statistics.map((s) => s.homeValue) },
          { name: away.name, values: match.statistics.map((s) => s.awayValue) },
        ],
      ),
    [match.statistics, home.name, away.name],
  );

  return (
    <PageScroll label="Post-match recap" compact>
      <MatchHeroCard
        editorial
        match={match}
        home={home}
        away={away}
        competition={competition}
      />

      <GlassCard>
        <Pad>
          <InterpretationLabel kind="interpretation" />
          <H2>Match story</H2>
          <P>{match.takeaway}</P>
        </Pad>
      </GlassCard>

      <ContentSection title="Defining moments">
        {moments.map((m) => (
          <GlassCard key={m.id}>
            <Pad>
              <Button
                intent="secondary"
                variant="ghost"
                size="sm"
                onClick={() => {
                  track('defining_moment_opened', { eventId: m.id });
                  navigate(`/matchday/${matchId}/moment/${m.id}`);
                }}
              >
                {m.minute}' — {m.label}
              </Button>
              <P>{m.description}</P>
            </Pad>
          </GlassCard>
        ))}
      </ContentSection>

      <GlassCard>
        <Pad>
          <InterpretationLabel kind="interpretation" />
          <H2>Why the match was won</H2>
          <P>{match.takeaway}</P>
          <H2>What it means next</H2>
          <P>{match.nextMeaning}</P>
        </Pad>
      </GlassCard>

      {match.statistics.length > 0 ? (
        <ChartCard
          title="Match statistics"
          periodLabel="Full-time comparison"
          summary={match.statistics
            .map(
              (s) =>
                `${s.label}: ${home.name} ${s.homeValue}${s.unit === '%' ? '%' : ''} · ${away.name} ${s.awayValue}${s.unit === '%' ? '%' : ''}`,
            )
            .join('. ')}
        >
          <CakeChart
            option={compareOption}
            height={Math.min(260, 80 + match.statistics.length * 36)}
            ariaLabel="Post-match statistics comparison chart"
          />
        </ChartCard>
      ) : null}

      <ContentSection title="Essential statistics">
        <GlassCard>
          <StatsPad>
            {match.statistics.map((s) => (
              <Row key={s.id}>
                <strong>
                  {s.homeValue}
                  {s.unit === '%' ? '%' : ''}
                </strong>
                <span>{s.label}</span>
                <strong>
                  {s.awayValue}
                  {s.unit === '%' ? '%' : ''}
                </strong>
              </Row>
            ))}
          </StatsPad>
        </GlassCard>
      </ContentSection>

      <Button
        fullWidth
        onClick={() => {
          track('next_match_opened', { matchId: UPCOMING_MATCH_ID });
          navigate(`/matchday/${UPCOMING_MATCH_ID}/preview`);
        }}
      >
        Next relevant fixture
      </Button>
      <Button fullWidth intent="secondary" variant="outline" onClick={() => navigate('/my-team')}>
        Go to My Team
      </Button>
    </PageScroll>
  );
}

const Pad = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-150);
  padding: var(--space-300);
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

const StatsPad = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
  padding: var(--space-300);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-100);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);

  span {
    text-align: center;
    font-size: var(--type-size-caption);
    color: var(--color-text-icon-secondary);
  }
  strong:last-child {
    text-align: right;
  }
`;
