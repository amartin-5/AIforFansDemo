import { ChevronRight } from 'lucide-react';
import styled from 'styled-components';
import { glassTile, interactiveLift } from '../../styles/surfaces';
import type { Competition, Match, Team } from '../../types/domain';
import { TeamIdentity } from './TeamIdentity';

type UpcomingMatchRowProps = {
  match: Match;
  home: Team;
  away: Team;
  competition: Competition;
  onOpen: () => void;
};

/** Compact menu row for the Upcoming list — opens pre-match on activate. */
export function UpcomingMatchRow({
  match,
  home,
  away,
  competition,
  onOpen,
}: UpcomingMatchRowProps) {
  return (
    <Row type="button" onClick={onOpen}>
      <Meta>
        <Kickoff>{match.kickoffLabel}</Kickoff>
        <Comp>{competition.shortName}</Comp>
      </Meta>
      <Lockup>
        <TeamIdentity team={home} size={28} orientation="horizontal" />
        <Vs aria-hidden>vs</Vs>
        <TeamIdentity team={away} size={28} orientation="horizontal" />
      </Lockup>
      {match.venue ? <Venue>{match.venue}</Venue> : null}
      <Cue>
        Lineup
        <ChevronRight size={16} aria-hidden />
      </Cue>
    </Row>
  );
}

const Row = styled.button`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-150);
  width: 100%;
  min-height: 44px;
  margin: 0;
  padding: var(--space-300);
  cursor: pointer;
  text-align: left;
  color: inherit;
  ${glassTile}
  ${interactiveLift}
`;

const Meta = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-200);
`;

const Kickoff = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Comp = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Lockup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-150);
  min-width: 0;
`;

const Vs = styled.span`
  flex-shrink: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-secondary);
  text-transform: uppercase;
`;

const Venue = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const Cue = styled.span`
  display: inline-flex;
  align-items: center;
  align-self: flex-end;
  gap: var(--space-050);
  min-height: 44px;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-primary);
  text-decoration: underline;
`;
