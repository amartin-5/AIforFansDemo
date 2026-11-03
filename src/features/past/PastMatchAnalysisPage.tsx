import {
  Button,
  Card,
  HorizontalTabItem,
  HorizontalTabs,
  HorizontalTabsContent,
  HorizontalTabsList,
} from '@cake-admin/cakeand';
import { ArrowLeft, Play } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AIInsightCard } from '../../components/ai/AIInsightCard';
import { InterpretationLabel } from '../../components/ai/InterpretationLabel';
import { ContentSection } from '../../components/layout/ContentSection';
import { PageScroll } from '../../components/layout/PageScroll';
import { EventTimeline } from '../../components/match/EventTimeline';
import { AnalysisStreamCard } from '../../components/past/AnalysisStreamCard';
import { FormPills } from '../../components/past/FormPills';
import { PastPitchLineup } from '../../components/past/PastPitchLineup';
import { StatCompareList } from '../../components/past/StatCompareList';
import { ErrorState } from '../../components/system/ErrorState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import { getPastLibraryMeta } from '../../data/fixtures/wwc2023Past';
import { resolveCompetition } from '../../data/repositories/matchRepository';
import { useMatchLoader } from '../../hooks/useMatchLoader';
import { track } from '../../services/analytics';

export function PastMatchAnalysisPage() {
  const { matchId = '' } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useMatchLoader(matchId);
  const [tab, setTab] = useState('overview');
  const [insightEventId, setInsightEventId] = useState<string | undefined>();

  const meta = matchId ? getPastLibraryMeta(matchId) : undefined;

  const goalEvents = useMemo(
    () => data?.match.events.filter((e) => e.type === 'goal') ?? [],
    [data],
  );

  const activeInsight = useMemo(() => {
    if (!data) return undefined;
    const eventId = insightEventId ?? data.match.turningPointEventId ?? goalEvents[0]?.id;
    return (
      data.match.insights.find((i) => i.eventId === eventId) ??
      data.match.insights[0]
    );
  }, [data, insightEventId, goalEvents]);

  if (loading) {
    return (
      <PageScroll label="Match analysis">
        <SkeletonBlock label="Loading analysis" />
      </PageScroll>
    );
  }
  if (error || !data || !meta) {
    return (
      <PageScroll label="Match analysis">
        <ErrorState
          message={error ?? 'Match not found in the WWC 2023 library'}
          onRetry={() => void reload()}
        />
      </PageScroll>
    );
  }

  const { match, home, away } = data;
  const competition = resolveCompetition(match);
  const homeLineup = match.lineups.find((l) => l.teamId === home.id);
  const awayLineup = match.lineups.find((l) => l.teamId === away.id);
  const quickEvents = match.events.filter((e) =>
    ['goal', 'card-yellow', 'card-red', 'penalty'].includes(e.type),
  );

  return (
    <PageScroll label="Match analysis" compact>
      <BackRow>
        <Back type="button" onClick={() => navigate('/past')}>
          <ArrowLeft size={16} aria-hidden />
          Past
        </Back>
        <Title>
          {competition.shortName} · {meta.stage}
        </Title>
      </BackRow>

      <AnalysisStreamCard
        match={match}
        home={home}
        away={away}
        streamImage={meta.streamImage}
        onWatch={() => {
          track('replay_opened', { matchId, eventId: 'watch' });
          navigate(`/past/${matchId}/watch`);
        }}
      />

      <HorizontalTabs value={tab} onValueChange={setTab}>
        <HorizontalTabsList aria-label="Match analysis sections" scrollButtons="auto">
          <HorizontalTabItem value="overview">Overview</HorizontalTabItem>
          <HorizontalTabItem value="stats">Stats</HorizontalTabItem>
          <HorizontalTabItem value="lineup">Lineup</HorizontalTabItem>
          <HorizontalTabItem value="insights">Insights</HorizontalTabItem>
        </HorizontalTabsList>

        <HorizontalTabsContent value="overview">
          <Panel>
            <ContentSection title="Match events">
              {quickEvents.length === 0 ? (
                <Muted>No key events logged for this fixture.</Muted>
              ) : (
                <EventTimeline events={quickEvents} />
              )}
            </ContentSection>

            {match.statistics.length > 0 ? (
              <Card>
                <Pad>
                  <SectionTitle>Match statistics</SectionTitle>
                  <StatCompareList statistics={match.statistics} home={home} away={away} />
                </Pad>
              </Card>
            ) : null}

            {match.takeaway ? (
              <Card>
                <Pad>
                  <InterpretationLabel kind="interpretation" />
                  <SectionTitle>
                    {home.shortName} vs {away.shortName}
                  </SectionTitle>
                  <Body>{match.takeaway}</Body>
                  {match.nextMeaning ? <Body>{match.nextMeaning}</Body> : null}
                </Pad>
              </Card>
            ) : null}

            {match.storylines.map((s) => (
              <Card key={s.id}>
                <Pad>
                  <InterpretationLabel
                    kind={s.source === 'fact' ? 'fact' : 'interpretation'}
                  />
                  <SectionTitle>{s.title}</SectionTitle>
                  <Body>{s.summary}</Body>
                </Pad>
              </Card>
            ))}

            <ContentSection title="Match timeline">
              <EventTimeline
                events={match.events}
                onSelect={(ev) => {
                  if (ev.type === 'goal') {
                    setTab('insights');
                    setInsightEventId(ev.id);
                  }
                }}
              />
            </ContentSection>

            <Button
              fullWidth
              endIcon={<Play size={16} aria-hidden />}
              onClick={() => navigate(`/past/${matchId}/watch`)}
            >
              Watch match in app
            </Button>
          </Panel>
        </HorizontalTabsContent>

        <HorizontalTabsContent value="stats">
          <Panel>
            <Card>
              <Pad>
                <SectionTitle>Head-to-head</SectionTitle>
                {meta.h2h ? (
                  <H2H>
                    <H2HCell>
                      <strong>{meta.h2h.homeWins}</strong>
                      <span>{home.shortName} wins</span>
                    </H2HCell>
                    <H2HCell>
                      <strong>{meta.h2h.draws}</strong>
                      <span>Draws</span>
                    </H2HCell>
                    <H2HCell>
                      <strong>{meta.h2h.awayWins}</strong>
                      <span>{away.shortName} wins</span>
                    </H2HCell>
                  </H2H>
                ) : (
                  <Muted>Limited head-to-head sample in this demo.</Muted>
                )}
                <FormStack>
                  <FormPills label={home.shortName} results={meta.formHome} />
                  <FormPills label={away.shortName} results={meta.formAway} />
                </FormStack>
              </Pad>
            </Card>

            <Card>
              <Pad>
                <SectionTitle>Match comparison</SectionTitle>
                {match.statistics.length === 0 ? (
                  <Muted>Statistics unavailable for this fixture.</Muted>
                ) : (
                  <StatCompareList statistics={match.statistics} home={home} away={away} />
                )}
              </Pad>
            </Card>
          </Panel>
        </HorizontalTabsContent>

        <HorizontalTabsContent value="lineup">
          <Panel>
            <Card>
              <Pad>
                <SectionTitle>Starting XIs</SectionTitle>
                <PastPitchLineup
                  home={home}
                  away={away}
                  homeLineup={homeLineup}
                  awayLineup={awayLineup}
                />
              </Pad>
            </Card>
          </Panel>
        </HorizontalTabsContent>

        <HorizontalTabsContent value="insights">
          <Panel>
            <ContentSection title="AI goal breakdown">
              {goalEvents.length === 0 ? (
                <Muted>No goals to break down for this match.</Muted>
              ) : (
                <GoalRail role="tablist" aria-label="Goals">
                  {goalEvents.map((g) => {
                    const selected =
                      (insightEventId ?? activeInsight?.eventId ?? goalEvents[0]?.id) ===
                      g.id;
                    const code =
                      g.teamId === home.id
                        ? home.shortName
                        : g.teamId === away.id
                          ? away.shortName
                          : '';
                    return (
                      <GoalChip
                        key={g.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        $active={selected}
                        onClick={() => setInsightEventId(g.id)}
                      >
                        <span>{code}</span>
                        <strong>
                          {g.minute}'
                        </strong>
                      </GoalChip>
                    );
                  })}
                </GoalRail>
              )}
            </ContentSection>

            {activeInsight ? (
              <>
                <AIInsightCard insight={activeInsight} />
                <Card>
                  <Pad>
                    <InterpretationLabel kind="interpretation" />
                    <SectionTitle>Why did this happen?</SectionTitle>
                    <Body>{activeInsight.layers.whyItMattered}</Body>
                    {activeInsight.layers.deeperTactical ? (
                      <Body>{activeInsight.layers.deeperTactical}</Body>
                    ) : null}
                    <Button
                      size="sm"
                      intent="secondary"
                      variant="outline"
                      endIcon={<Play size={14} aria-hidden />}
                      onClick={() =>
                        navigate(
                          `/past/${matchId}/watch?moment=${activeInsight.eventId ?? ''}`,
                        )
                      }
                    >
                      Watch this moment
                    </Button>
                  </Pad>
                </Card>
              </>
            ) : match.takeaway ? (
              <Card>
                <Pad>
                  <InterpretationLabel kind="interpretation" />
                  <SectionTitle>Match insight</SectionTitle>
                  <Body>{match.takeaway}</Body>
                </Pad>
              </Card>
            ) : (
              <Muted>Insights are being prepared for this fixture.</Muted>
            )}
          </Panel>
        </HorizontalTabsContent>
      </HorizontalTabs>
    </PageScroll>
  );
}

const BackRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-200);
`;

const Back = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
  min-height: 44px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-primary);
`;

const Title = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  padding-top: var(--space-300);
`;

const Pad = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-200);
  padding: var(--space-300);
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Body = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.45;
  color: var(--color-text-icon-secondary);
`;

const Muted = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-secondary);
`;

const H2H = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-100);
`;

const H2HCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-050);
  padding: var(--space-200);
  border-radius: var(--radius-200);
  background: var(--color-surfaces-on-container);

  strong {
    font-family: var(--font-family);
    font-size: var(--type-size-page);
    color: var(--color-text-icon-primary);
  }

  span {
    font-family: var(--font-family);
    font-size: var(--type-size-caption);
    color: var(--color-text-icon-secondary);
    text-align: center;
  }
`;

const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
`;

const GoalRail = styled.div`
  display: flex;
  gap: var(--space-100);
  overflow-x: auto;
  padding-bottom: var(--space-100);
`;

const GoalChip = styled.button<{ $active: boolean }>`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-050);
  min-width: 56px;
  min-height: 44px;
  padding: var(--space-150) var(--space-200);
  border: none;
  border-bottom: 3px solid
    ${(p) => (p.$active ? 'var(--color-primary-primary)' : 'transparent')};
  background: transparent;
  cursor: pointer;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);

  span {
    font-size: var(--type-size-caption);
    color: var(--color-text-icon-secondary);
  }

  strong {
    font-size: var(--type-size-body);
  }
`;
