import styled from 'styled-components';
import { TeamCrest } from '../TeamCrest';
import type { Team } from '../../types/domain';

type TeamIdentityProps = {
  team: Team;
  size?: number;
  showName?: boolean;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
};

export function TeamIdentity({
  team,
  size = 48,
  showName = true,
  orientation = 'vertical',
  className,
}: TeamIdentityProps) {
  return (
    <Wrap className={className} $orientation={orientation}>
      {team.crestKey ? (
        <TeamCrest team={team.crestKey} size={size} />
      ) : (
        <GeoCrest
          style={{ width: size, height: size }}
          aria-hidden
          $token={team.crestColorToken ?? 'var(--color-primary-primary)'}
        >
          {team.shortName.slice(0, 2)}
        </GeoCrest>
      )}
      {showName ? <Name>{team.name}</Name> : null}
    </Wrap>
  );
}

const Wrap = styled.div<{ $orientation: 'vertical' | 'horizontal' }>`
  display: flex;
  flex-direction: ${(p) => (p.$orientation === 'vertical' ? 'column' : 'row')};
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
`;

const GeoCrest = styled.div<{ $token: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-200);
  background: ${(p) => p.$token};
  color: var(--color-text-icon-on-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
`;

const Name = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;
