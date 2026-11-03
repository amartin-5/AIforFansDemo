import { Maximize2, Play } from 'lucide-react';
import styled from 'styled-components';
import type { Match, Team } from '../../types/domain';
import { TeamIdentity } from '../match/TeamIdentity';

type AnalysisStreamCardProps = {
  match: Match;
  home: Team;
  away: Team;
  streamImage: string;
  onWatch: () => void;
};

export function AnalysisStreamCard({
  match,
  home,
  away,
  streamImage,
  onWatch,
}: AnalysisStreamCardProps) {
  const score =
    match.score !== undefined ? `${match.score.home} – ${match.score.away}` : 'vs';

  return (
    <Shell>
      <ScoreRow>
        <Side>
          <TeamIdentity team={home} size={28} showName={false} />
          <Code>{home.shortName}</Code>
        </Side>
        <Score aria-label={`${home.name} ${match.score?.home ?? 0}, ${away.name} ${match.score?.away ?? 0}`}>
          {score}
        </Score>
        <Side $end>
          <Code>{away.shortName}</Code>
          <TeamIdentity team={away} size={28} showName={false} />
        </Side>
        <Minute>{match.periodLabel ?? 'FT'}</Minute>
      </ScoreRow>

      <Player type="button" onClick={onWatch} aria-label="Watch match in app">
        <Poster src={streamImage} alt="" />
        <Wash />
        <PlayBadge aria-hidden>
          <Play size={22} fill="currentColor" />
        </PlayBadge>
        <ExpandHint aria-hidden>
          <Maximize2 size={14} />
        </ExpandHint>
        <Caption>Watch in app · AI overlays</Caption>
      </Player>
    </Shell>
  );
}

const Shell = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  width: 100%;
`;

const ScoreRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;
  align-items: center;
  gap: var(--space-150);
  padding: var(--space-150) var(--space-200);
  border-radius: var(--radius-300);
  background: var(--color-surfaces-container-blur);
  border: 1px solid var(--color-stroke-border);
`;

const Side = styled.div<{ $end?: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  justify-content: ${(p) => (p.$end ? 'flex-end' : 'flex-start')};
`;

const Code = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Score = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
  white-space: nowrap;
`;

const Minute = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-icon-secondary);
`;

const Player = styled.button`
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  padding: 0;
  border: none;
  border-radius: var(--radius-300);
  overflow: hidden;
  cursor: pointer;
  background: var(--color-surfaces-on-container);
`;

const Poster = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Wash = styled.div`
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.28);
`;

const PlayBadge = styled.span`
  position: absolute;
  inset: 50% auto auto 50%;
  translate: -50% -50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: var(--radius-1000);
  background: var(--color-surfaces-container-blur);
  color: var(--color-text-icon-primary);
  border: 1px solid var(--color-stroke-border);
`;

const ExpandHint = styled.span`
  position: absolute;
  top: var(--space-200);
  right: var(--space-200);
  display: inline-flex;
  padding: var(--space-100);
  border-radius: var(--radius-100);
  background: var(--color-surfaces-container-blur);
  color: var(--color-text-icon-primary);
`;

const Caption = styled.span`
  position: absolute;
  left: var(--space-200);
  bottom: var(--space-200);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-icon-primary);
`;
