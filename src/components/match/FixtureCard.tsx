import styled from 'styled-components';
import { glassTile } from '../../styles/surfaces';
import type { Match, Team } from '../../types/domain';
import { TeamIdentity } from './TeamIdentity';

type FixtureCardProps = {
  match: Match;
  home: Team;
  away: Team;
  onOpen?: () => void;
  actionLabel?: string;
};

export function FixtureCard({
  match,
  home,
  away,
  onOpen,
  actionLabel = 'Lineup →',
}: FixtureCardProps) {
  const isLive = match.status === 'live' || match.status === 'half-time';

  return (
    <Card>
      {isLive ? (
        <LiveLabel role="status">LIVE</LiveLabel>
      ) : (
        <Time>{match.kickoffLabel}</Time>
      )}
      <Row>
        <TeamIdentity team={home} size={28} orientation="vertical" />
        <Vs aria-hidden>vs</Vs>
        <TeamIdentity team={away} size={28} orientation="vertical" />
      </Row>
      {onOpen ? (
        <LinkBtn type="button" onClick={onOpen}>
          {actionLabel}
        </LinkBtn>
      ) : null}
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  padding: var(--space-300);
  min-width: 0;
  ${glassTile}
`;

const LiveLabel = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-error-error);
  text-align: center;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Time = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-icon-primary);
  text-align: center;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-100);
`;

const Vs = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-secondary);
  text-transform: uppercase;
`;

const LinkBtn = styled.button`
  align-self: flex-end;
  min-height: 44px;
  padding: 0 var(--space-100);
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-primary);
  text-decoration: underline;
`;
