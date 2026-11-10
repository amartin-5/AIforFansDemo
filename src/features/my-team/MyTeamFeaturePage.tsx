import { Avatar, Button, Switch } from '@cake-admin/cakeand';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CakeChart } from '../../charts/CakeChart';
import { onContainerSurface, restingTile } from '../../styles/surfaces';
import {
  createBarOption,
  createHorizontalBarOption,
  createLineOption,
} from '../../charts/options';
import { InterpretationLabel } from '../../components/ai/InterpretationLabel';
import { ChartCard } from '../../components/charts/ChartCard';
import { FormGuide } from '../../components/charts/FormGuide';
import { MetricTile } from '../../components/charts/MetricTile';
import { ContentSection } from '../../components/layout/ContentSection';
import { PageScroll } from '../../components/layout/PageScroll';
import { TeamIdentity } from '../../components/match/TeamIdentity';
import { PitchLineup } from '../../components/my-team/PitchLineup';
import { ErrorState } from '../../components/system/ErrorState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import { DEMO_MATCH_ID, UPCOMING_MATCH_ID } from '../../data/fixtures/demoSpine';
import {
  finalStats,
  goalsProgress,
  keyPlayers,
  pathRecord,
  spainPath,
  topScorers,
} from '../../data/spainWwc2023';
import { getMatch, resolveTeams } from '../../data/repositories/matchRepository';
import { getCurrentUser, getFavoriteTeamProfile } from '../../data/repositories/userRepository';
import { track } from '../../services/analytics';
import type { Match, TeamProfile, User } from '../../types/domain';

export function MyTeamFeaturePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<TeamProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, u] = await Promise.all([getFavoriteTeamProfile(), getCurrentUser()]);
      setProfile(p);
      setUser(u);
      if (p.nextMatchId) {
        const m = await getMatch(p.nextMatchId);
        setNextMatch(m ?? null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const spainRecord = useMemo(() => pathRecord(spainPath), []);
  const barOption = useMemo(
    () =>
      createBarOption(
        topScorers.map((s) => s.name),
        topScorers.map((s) => s.value),
      ),
    [],
  );
  const lineOption = useMemo(
    () =>
      createLineOption(goalsProgress.categories, 'Spain goals', goalsProgress.values),
    [],
  );
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
      <PageScroll label="My Team">
        <SkeletonBlock label="Loading your team" />
      </PageScroll>
    );
  }
  if (error || !profile || !user) {
    return (
      <PageScroll label="My Team">
        <ErrorState message={error ?? 'Missing team'} onRetry={() => void load()} />
      </PageScroll>
    );
  }

  const nextSides = nextMatch ? resolveTeams(nextMatch) : null;

  return (
    <PageScroll label="My Team" compact>
      <Hero>
        <TeamIdentity team={profile.team} size={64} orientation="horizontal" />
        <HeroText>
          <Eyebrow>Women’s World Cup 2023 path</Eyebrow>
          <Title>My Team</Title>
          <Sub>
            {spainRecord.wins}W · {spainRecord.draws}D · {spainRecord.losses}L · Semi-final live
          </Sub>
        </HeroText>
        {profile.storyline ? (
          <Story>
            <InterpretationLabel kind="interpretation" />
            <StoryTitle>{profile.storyline.title}</StoryTitle>
            <StoryBody>{profile.storyline.summary}</StoryBody>
          </Story>
        ) : null}
      </Hero>

      {nextMatch && nextSides ? (
        <Section>
          <SectionTitle>Next fixture</SectionTitle>
          <NextCard>
            <NextMeta>
              {nextMatch.kickoffLabel}
              {nextMatch.venue ? ` · ${nextMatch.venue}` : ''}
            </NextMeta>
            <NextLockup>
              <TeamIdentity team={nextSides.home} size={40} />
              <Vs>vs</Vs>
              <TeamIdentity team={nextSides.away} size={40} />
            </NextLockup>
            <Button
              size="sm"
              onClick={() => {
                track('next_match_opened', { matchId: nextMatch.id });
                navigate(`/matchday/${nextMatch.id}/preview`);
              }}
            >
              Open pre-match briefing
            </Button>
          </NextCard>
        </Section>
      ) : null}

      <ContentSection title="Season snapshot">
        <MetricGrid>
          <MetricTile label="Path wins" value={String(spainRecord.wins)} hint="Tournament path" />
          <MetricTile label="Draws" value={String(spainRecord.draws)} />
          <MetricTile label="Losses" value={String(spainRecord.losses)} />
          <MetricTile
            label="Goals (path)"
            value={String(goalsProgress.values.at(-1) ?? 0)}
            hint="Cumulative"
          />
          <MetricTile
            label="Possession"
            value={`${finalStats.possessionSpain}%`}
            hint="SF vs SWE"
          />
          <MetricTile
            label="Pass accuracy"
            value={`${finalStats.passAccuracySpain}%`}
            hint="SF vs SWE"
          />
        </MetricGrid>
      </ContentSection>

      <FormGuide title="Recent form" entries={profile.recentForm} />

      <ChartCard
        title="Performance trend"
        periodLabel="Goals by round · mock historical"
        summary={`Spain cumulative goals rose from ${goalsProgress.values[0]} in the group stage to ${goalsProgress.values.at(-1)} through the semi-final.`}
      >
        <CakeChart
          option={lineOption}
          height={200}
          ariaLabel="Line chart of Spain cumulative goals by round"
        />
      </ChartCard>

      <ChartCard
        title="Team comparison"
        periodLabel="Semi-final · Spain vs Sweden"
        summary={`Spain held ${finalStats.possessionSpain}% possession and ${finalStats.passAccuracySpain}% pass accuracy versus Sweden ${finalStats.possessionSweden}% / ${finalStats.passAccuracySweden}%.`}
      >
        <CakeChart
          option={compareOption}
          height={180}
          ariaLabel="Horizontal bar comparison of possession and pass accuracy"
        />
      </ChartCard>

      <ContentSection title="Player spotlight">
        <PlayerGrid>
          {keyPlayers.map((p) => (
            <PlayerCard key={p.name}>
              <PlayerHead>
                <Avatar initials={p.initials} size="md" alt={p.name} />
                <div>
                  <PlayerName>{p.name}</PlayerName>
                  <PlayerRole>{p.role}</PlayerRole>
                </div>
              </PlayerHead>
              <StatRow>
                <span>
                  <strong>{p.goals}</strong> goals
                </span>
                <span>
                  <strong>{p.assists}</strong> assists
                </span>
                <span>
                  <strong>{p.rating.toFixed(1)}</strong> demo rating
                </span>
              </StatRow>
              <PlayerNote>{p.note}</PlayerNote>
            </PlayerCard>
          ))}
        </PlayerGrid>
      </ContentSection>

      <ChartCard
        title="Top scorers — Spain"
        periodLabel="Tournament totals · mock"
        summary={`Leading scorers: ${topScorers
          .slice(0, 3)
          .map((s) => `${s.name} ${s.value}`)
          .join(', ')}.`}
      >
        <CakeChart
          option={barOption}
          height={210}
          ariaLabel="Bar chart of Spain top scorers"
        />
      </ChartCard>

      <Section>
        <SectionTitle>Formation — Semi-final XI</SectionTitle>
        <PitchWrap>
          <PitchLineup />
        </PitchWrap>
      </Section>

      <ContentSection title="Saved moments">
        {profile.savedMoments.map((sm) => (
          <MomentRow key={sm.id}>
            <span>
              {sm.minuteLabel} · {sm.title}
            </span>
            <Button
              size="sm"
              intent="secondary"
              variant="outline"
              onClick={() => navigate(`/matchday/${sm.matchId}/moment/${sm.eventId}`)}
            >
              Open
            </Button>
          </MomentRow>
        ))}
        <Button
          intent="secondary"
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/matchday/${DEMO_MATCH_ID}/recap`)}
        >
          Open semi-final recap
        </Button>
      </ContentSection>

      <ContentSection title="Preferences">
        <Prefs>
          <SwitchRow>
            <span>Match notifications</span>
            <Switch
              checked={user.preferences.notificationsEnabled}
              onCheckedChange={() =>
                track('favorite_team_updated', { field: 'notifications' })
              }
              aria-label="Match notifications"
            />
          </SwitchRow>
          <Button
            size="sm"
            intent="secondary"
            variant="outline"
            onClick={() => navigate(`/matchday/${UPCOMING_MATCH_ID}/preview`)}
          >
            Reminder for next fixture
          </Button>
        </Prefs>
      </ContentSection>
    </PageScroll>
  );
}

const Hero = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-250);
`;

const HeroText = styled.div`
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

const Story = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-100);
  width: 100%;
  padding: var(--space-250);
  border: none;
  ${onContainerSurface}
`;

const StoryTitle = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const StoryBody = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.45;
  color: var(--color-text-icon-secondary);
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  width: 100%;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-icon-primary);
`;

const NextCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  padding: var(--space-300);
  border: none;
  ${restingTile}
`;

const NextMeta = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const NextLockup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
`;

const Vs = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-secondary);
  text-transform: uppercase;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-150);
  width: 100%;
`;

const PlayerGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
`;

const PlayerCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
  padding: var(--space-300);
  border: none;
  ${restingTile}
`;

const PlayerHead = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-200);
`;

const PlayerName = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const PlayerRole = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const StatRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-200);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const PlayerNote = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const PitchWrap = styled.div`
  width: 100%;
  min-width: 0;
  border: none;
  padding: var(--space-200);
  ${restingTile}
`;

const MomentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  min-height: 44px;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);
`;

const Prefs = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  padding: var(--space-300);
  border: none;
  ${restingTile}
`;

const SwitchRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-300);
  width: 100%;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);
`;
