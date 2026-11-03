import { Avatar } from '@cake-admin/cakeand';
import { useState } from 'react';
import styled from 'styled-components';
import type { Lineup, Team } from '../../types/domain';

type PastPitchLineupProps = {
  home: Team;
  away: Team;
  homeLineup?: Lineup;
  awayLineup?: Lineup;
};

export function PastPitchLineup({ home, away, homeLineup, awayLineup }: PastPitchLineupProps) {
  const [side, setSide] = useState<'home' | 'away'>('home');
  const lineup = side === 'home' ? homeLineup : awayLineup;
  const team = side === 'home' ? home : away;
  const players = lineup?.players ?? [];

  return (
    <Root>
      <ToggleRow role="tablist" aria-label="Lineup side">
        <Toggle
          type="button"
          role="tab"
          aria-selected={side === 'home'}
          $active={side === 'home'}
          onClick={() => setSide('home')}
        >
          {home.shortName}
          {homeLineup?.formation ? ` · ${homeLineup.formation}` : ''}
        </Toggle>
        <Toggle
          type="button"
          role="tab"
          aria-selected={side === 'away'}
          $active={side === 'away'}
          onClick={() => setSide('away')}
        >
          {away.shortName}
          {awayLineup?.formation ? ` · ${awayLineup.formation}` : ''}
        </Toggle>
      </ToggleRow>

      {players.length === 0 ? (
        <Empty>Starting XI unavailable for this side in the demo.</Empty>
      ) : (
        <Pitch aria-label={`${team.name} starting lineup`}>
          <Halfway />
          <CenterCircle />
          {players.map((p) => (
            <PlayerNode key={p.id} $x={p.x} $y={p.y} $home={side === 'home'}>
              <Avatar initials={p.initials} size="sm" alt={p.name} />
              <Shirt>{p.number}</Shirt>
              <PlayerLabel>{p.shortName}</PlayerLabel>
            </PlayerNode>
          ))}
        </Pitch>
      )}
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  width: 100%;
`;

const ToggleRow = styled.div`
  display: flex;
  gap: var(--space-100);
`;

const Toggle = styled.button<{ $active: boolean }>`
  flex: 1;
  min-height: 44px;
  border: 1px solid
    ${(p) => (p.$active ? 'var(--color-primary-primary)' : 'var(--color-stroke-border)')};
  border-radius: var(--radius-200);
  background: ${(p) =>
    p.$active ? 'var(--color-surfaces-primary)' : 'var(--color-surfaces-container-blur)'};
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
`;

const Empty = styled.p`
  margin: 0;
  padding: var(--space-400);
  text-align: center;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-secondary);
  border-radius: var(--radius-300);
  border: 1px dashed var(--color-stroke-border);
`;

const Pitch = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-300);
  border: 1px solid var(--color-stroke-border);
  background:
    linear-gradient(180deg, rgb(0 0 0 / 0.15), transparent 40%),
    var(--color-surfaces-on-container);
  overflow: hidden;
`;

const Halfway = styled.div`
  position: absolute;
  left: 8%;
  right: 8%;
  top: 50%;
  height: 1px;
  background: var(--color-stroke-border);
`;

const CenterCircle = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 22%;
  aspect-ratio: 1;
  translate: -50% -50%;
  border: 1px solid var(--color-stroke-border);
  border-radius: var(--radius-1000);
`;

const PlayerNode = styled.div<{ $x: number; $y: number; $home: boolean }>`
  position: absolute;
  left: ${(p) => p.$x}%;
  top: ${(p) => p.$y}%;
  translate: -50% -50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 56px;
`;

const Shirt = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const PlayerLabel = styled.span`
  font-family: var(--font-family);
  font-size: 10px;
  color: var(--color-text-icon-secondary);
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
