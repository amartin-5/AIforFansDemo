import styled from 'styled-components';
import type { MatchStatus, Score, Team } from '../../types/domain';

type ScoreDisplayProps = {
  home: Team;
  away: Team;
  score?: Score;
  status: MatchStatus;
  periodLabel?: string;
  size?: 'sm' | 'lg';
};

function statusPhrase(status: MatchStatus, periodLabel?: string): string {
  if (periodLabel) return periodLabel;
  switch (status) {
    case 'live':
      return 'Live';
    case 'half-time':
      return 'Half-time';
    case 'full-time':
    case 'post-match':
      return 'Full-time';
    case 'pre-match':
      return 'Pre-match';
    case 'upcoming':
      return 'Upcoming';
    default:
      return status;
  }
}

export function ScoreDisplay({
  home,
  away,
  score,
  status,
  periodLabel,
  size = 'lg',
}: ScoreDisplayProps) {
  const center =
    score !== undefined ? `${score.home} – ${score.away}` : 'vs';
  const aria = score
    ? `${home.name} ${score.home}, ${away.name} ${score.away}, ${statusPhrase(status, periodLabel)}`
    : `${home.name} versus ${away.name}, ${statusPhrase(status, periodLabel)}`;

  return (
    <Wrap aria-label={aria} role="group">
      <ScoreText $size={size}>{center}</ScoreText>
      {periodLabel ? <Period>{periodLabel}</Period> : null}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-050);
  min-width: var(--space-800);
`;

const ScoreText = styled.p<{ $size: 'sm' | 'lg' }>`
  margin: 0;
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: ${(p) =>
    p.$size === 'lg' ? 'var(--type-size-hero)' : 'var(--type-size-title)'};
  line-height: 1.1;
  color: var(--color-text-icon-primary);
  white-space: nowrap;
`;

const Period = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;
