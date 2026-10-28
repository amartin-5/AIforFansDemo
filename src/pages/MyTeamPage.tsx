import { useMemo } from 'react';
import { Avatar, Badge, Card, nativeScrollbarStyles } from '@cake-admin/cakeand';
import styled from 'styled-components';
import { CakeChart } from '../charts/CakeChart';
import {
  createBarOption,
  createGaugeOption,
  createLineOption,
  createPieOption,
} from '../charts/options';
import { PitchLineup } from '../components/my-team/PitchLineup';
import { TeamCrest } from '../components/TeamCrest';
import {
  englandPath,
  finalMatch,
  finalStats,
  goalsByRound,
  goalsProgress,
  keyPlayers,
  pathRecord,
  spainPath,
  topScorers,
} from '../data/spainWwc2023';

export function MyTeamPage() {
  const spainRecord = pathRecord(spainPath);
  const englandRecord = pathRecord(englandPath);
  const spainTotal = spainRecord.wins + spainRecord.draws + spainRecord.losses;

  const barOption = useMemo(
    () =>
      createBarOption(
        topScorers.map((s) => s.name),
        topScorers.map((s) => s.value),
      ),
    [],
  );

  const pieOption = useMemo(() => createPieOption(goalsByRound), []);

  const lineOption = useMemo(
    () =>
      createLineOption(
        goalsProgress.categories,
        'Spain goals',
        goalsProgress.values,
      ),
    [],
  );

  const possessionOption = useMemo(
    () =>
      createGaugeOption(
        'Possession',
        finalStats.possessionSpain,
        '#7586ff',
      ),
    [],
  );

  const passOption = useMemo(
    () =>
      createGaugeOption(
        'Pass accuracy',
        finalStats.passAccuracySpain,
        '#2cc27e',
      ),
    [],
  );

  return (
    <Page aria-label="My Team">
      <HeaderBlock>
        <TitlePill>
          <Title>{finalMatch.title}</Title>
        </TitlePill>
        <Subtitle>
          {finalMatch.home} vs {finalMatch.away} · {finalMatch.round} ·{' '}
          {finalMatch.dateLabel}
        </Subtitle>
      </HeaderBlock>

      <Card>
        <CardPad>
          <MatchLockup>
            <TeamCol>
              <TeamCrest team="Spain" size={52} />
              <TeamName>{finalMatch.home}</TeamName>
            </TeamCol>
            <ScoreBlock>
              <Score>
                {finalMatch.scoreHome} – {finalMatch.scoreAway}
              </Score>
              <Scorer>{finalMatch.scorer}</Scorer>
              <Badge color="green" tone="subtle" dot={false}>
                Champions
              </Badge>
            </ScoreBlock>
            <TeamCol>
              <TeamCrest team="England" size={52} />
              <TeamName>{finalMatch.away}</TeamName>
            </TeamCol>
          </MatchLockup>
          <Venue>
            {finalMatch.venue} · {finalMatch.competition}
          </Venue>
        </CardPad>
      </Card>

      <Card>
        <CardPad>
          <InsightHead>
            <InsightTitle>{finalMatch.insightTitle}</InsightTitle>
            <Badge color="primary" tone="subtle">
              Final
            </Badge>
          </InsightHead>
          <BodyText>{finalMatch.insightBody}</BodyText>
          <NextLabel>Key takeaway</NextLabel>
          <BodyText>{finalMatch.insightNext}</BodyText>
        </CardPad>
      </Card>

      <Card>
        <CardPad>
          <SectionTitle>Starting lineup</SectionTitle>
          <PitchLineup />
        </CardPad>
      </Card>

      <Card>
        <CardPad>
          <SectionTitle>Tournament path</SectionTitle>
          <H2HLabels>
            <span>
              Spain {spainRecord.wins}W {spainRecord.draws}D {spainRecord.losses}L
            </span>
            <span>
              England {englandRecord.wins}W {englandRecord.draws}D{' '}
              {englandRecord.losses}L
            </span>
          </H2HLabels>
          <Segmented
            role="img"
            aria-label={`Spain path: ${spainRecord.wins} wins, ${spainRecord.draws} draws, ${spainRecord.losses} losses`}
          >
            <Seg $flex={spainRecord.wins / spainTotal} $tone="win" />
            <Seg $flex={spainRecord.draws / spainTotal || 0.001} $tone="draw" />
            <Seg $flex={spainRecord.losses / spainTotal} $tone="loss" />
          </Segmented>
          <FormRow>
            <FormTeam>
              <FormLabel>Spain</FormLabel>
              <Dots>
                {spainPath.map((m) => (
                  <Dot key={m.opponent} $result={m.result} title={`${m.opponent} ${m.score}`} />
                ))}
              </Dots>
            </FormTeam>
            <FormTeam>
              <FormLabel>England</FormLabel>
              <Dots>
                {englandPath.map((m) => (
                  <Dot key={m.opponent} $result={m.result} title={`${m.opponent} ${m.score}`} />
                ))}
              </Dots>
            </FormTeam>
          </FormRow>
        </CardPad>
      </Card>

      <KeyGrid>
        {keyPlayers.map((p) => (
          <Card key={p.name}>
            <CardPad>
              <KeyHead>
                <Avatar initials={p.initials} size="md" alt={p.name} />
                <div>
                  <KeyName>{p.name}</KeyName>
                  <KeyRole>{p.role}</KeyRole>
                </div>
              </KeyHead>
              <StatRow>
                <Stat>
                  <StatVal>{p.goals}</StatVal>
                  <StatLbl>Goals</StatLbl>
                </Stat>
                <Stat>
                  <StatVal>{p.assists}</StatVal>
                  <StatLbl>Assists</StatLbl>
                </Stat>
                <Stat>
                  <StatVal>{p.rating.toFixed(1)}</StatVal>
                  <StatLbl>Rating</StatLbl>
                </Stat>
              </StatRow>
              <KeyNote>{p.note}</KeyNote>
            </CardPad>
          </Card>
        ))}
      </KeyGrid>

      <Card>
        <CardPad>
          <SectionTitle>Top scorers — Spain</SectionTitle>
          <CakeChart option={barOption} height={210} />
        </CardPad>
      </Card>

      <Card>
        <CardPad>
          <SectionTitle>Goals by round</SectionTitle>
          <CakeChart option={pieOption} height={230} />
        </CardPad>
      </Card>

      <Card>
        <CardPad>
          <SectionTitle>Cumulative goals</SectionTitle>
          <CakeChart option={lineOption} height={210} />
        </CardPad>
      </Card>

      <GaugeGrid>
        <Card>
          <CardPad>
            <SectionTitle>Final possession</SectionTitle>
            <CakeChart option={possessionOption} height={160} />
            <GaugeSub>
              ESP {finalStats.possessionSpain}% · ENG {finalStats.possessionEngland}%
            </GaugeSub>
          </CardPad>
        </Card>
        <Card>
          <CardPad>
            <SectionTitle>Pass accuracy</SectionTitle>
            <CakeChart option={passOption} height={160} />
            <GaugeSub>
              ESP {finalStats.passAccuracySpain}% · ENG {finalStats.passAccuracyEngland}%
            </GaugeSub>
          </CardPad>
        </Card>
      </GaugeGrid>
    </Page>
  );
}

const Page = styled.main`
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--space-500) var(--space-200) var(--space-300);
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  ${nativeScrollbarStyles}

  /* Cake& Card is overflow:hidden + flex-shrink:1 — prevent collapse in a
     fixed-height column by locking section height to content. */
  & > * {
    flex-shrink: 0;
    width: 100%;
  }
`;

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
`;

const TitlePill = styled.div`
  align-self: flex-start;
  backdrop-filter: blur(60px);
  background: rgba(0, 0, 0, 0.25);
  border-radius: var(--radius-150);
  padding: var(--space-100) var(--space-200);
  box-shadow: 0 8px 36px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: var(--type-size-title);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const Subtitle = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  letter-spacing: 0.2px;
`;

const CardPad = styled.div`
  padding: var(--space-500);
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
`;

const MatchLockup = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-200);
`;

const TeamCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-100);
`;

const TeamName = styled.span`
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: var(--type-size-helper);
  color: var(--color-text-icon-primary);
  text-align: center;
`;

const ScoreBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-100);
`;

const Score = styled.div`
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: var(--type-size-page);
  color: var(--color-text-icon-primary);
  line-height: 1.2;
`;

const Scorer = styled.span`
  font-family: var(--font-family);
  font-size: 10px;
  color: var(--color-text-icon-secondary);
`;

const Venue = styled.p`
  margin: 0;
  text-align: center;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const InsightHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
`;

const InsightTitle = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);
`;

const BodyText = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  line-height: 1.45;
  color: var(--color-text-icon-secondary);
`;

const NextLabel = styled.span`
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-primary);
`;

const H2HLabels = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--space-200);
  font-family: var(--font-family);
  font-size: 10px;
  color: var(--color-text-icon-secondary);
`;

const Segmented = styled.div`
  display: flex;
  width: 100%;
  height: 12px;
  border-radius: var(--radius-1000);
  overflow: hidden;
  background: var(--color-surfaces-on-container);
`;

const Seg = styled.div<{ $flex: number; $tone: 'win' | 'draw' | 'loss' }>`
  flex: ${(p) => p.$flex};
  background: ${(p) =>
    p.$tone === 'win'
      ? 'var(--color-badge-green)'
      : p.$tone === 'draw'
        ? 'var(--color-badge-yellow)'
        : 'var(--color-badge-red)'};
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
`;

const FormTeam = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
`;

const FormLabel = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-icon-primary);
  min-width: 64px;
`;

const Dots = styled.div`
  display: flex;
  gap: var(--space-050);
`;

const Dot = styled.span<{ $result: 'W' | 'D' | 'L' }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) =>
    p.$result === 'W'
      ? 'var(--color-badge-green)'
      : p.$result === 'D'
        ? 'var(--color-badge-yellow)'
        : 'var(--color-badge-red)'};
`;

const KeyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-200);
`;

const KeyHead = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
`;

const KeyName = styled.div`
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-primary);
`;

const KeyRole = styled.div`
  font-family: var(--font-family);
  font-size: 10px;
  color: var(--color-text-icon-secondary);
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--space-050);
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const StatVal = styled.span`
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: var(--type-size-subject);
  color: var(--color-text-icon-primary);
`;

const StatLbl = styled.span`
  font-family: var(--font-family);
  font-size: 9px;
  color: var(--color-text-icon-secondary);
`;

const KeyNote = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: 10px;
  color: var(--color-text-icon-secondary);
`;

const GaugeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-200);
`;

const GaugeSub = styled.p`
  margin: 0;
  text-align: center;
  font-family: var(--font-family);
  font-size: 10px;
  color: var(--color-text-icon-secondary);
`;
