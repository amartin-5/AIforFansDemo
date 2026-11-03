import styled from 'styled-components';
import { glassChrome } from '../../styles/surfaces';
import type { Match, Team } from '../../types/domain';
import { MatchStatusBadge } from './MatchStatusBadge';
import { ScoreDisplay } from './ScoreDisplay';
import { TeamIdentity } from './TeamIdentity';

type StickyMatchHeaderProps = {
  match: Match;
  home: Team;
  away: Team;
};

export function StickyMatchHeader({ match, home, away }: StickyMatchHeaderProps) {
  return (
    <Bar>
      <MatchStatusBadge status={match.status} periodLabel={match.periodLabel} />
      <Row>
        <TeamIdentity team={home} size={24} showName={false} />
        <ScoreDisplay
          home={home}
          away={away}
          score={match.score}
          status={match.status}
          periodLabel={match.periodLabel}
          size="sm"
        />
        <TeamIdentity team={away} size={24} showName={false} />
      </Row>
    </Bar>
  );
}

const Bar = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-100);
  padding: var(--space-200) var(--space-300);
  border-bottom: 1px solid transparent;
  ${glassChrome}
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-300);
  width: 100%;
`;
