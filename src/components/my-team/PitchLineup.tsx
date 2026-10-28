import { useState } from 'react';
import { Avatar } from '@cake-admin/cakeand';
import styled from 'styled-components';
import { englandXi, spainXi, type Player } from '../../data/spainWwc2023';

type Side = 'spain' | 'england';

export function PitchLineup() {
  const [side, setSide] = useState<Side>('spain');
  const players = side === 'spain' ? spainXi : englandXi;
  const accent = side === 'spain' ? 'spain' : 'england';

  return (
    <Root>
      <ToggleRow role="tablist" aria-label="Lineup side">
        <Toggle
          type="button"
          role="tab"
          aria-selected={side === 'spain'}
          $active={side === 'spain'}
          onClick={() => setSide('spain')}
        >
          Spain XI
        </Toggle>
        <Toggle
          type="button"
          role="tab"
          aria-selected={side === 'england'}
          $active={side === 'england'}
          onClick={() => setSide('england')}
        >
          England XI
        </Toggle>
      </ToggleRow>
      <Pitch aria-label={`${side === 'spain' ? 'Spain' : 'England'} starting lineup`}>
        <Halfway />
        <CenterCircle />
        <PenaltyTop />
        <PenaltyBottom />
        {players.map((p) => (
          <PlayerNode key={`${side}-${p.number}`} $x={p.x} $y={p.y} $accent={accent}>
            <Avatar initials={p.initials} size="sm" alt={p.name} />
            <Shirt>{p.number}</Shirt>
            <PlayerLabel>{p.shortName}</PlayerLabel>
          </PlayerNode>
        ))}
      </Pitch>
      <Legend>
        {players.map((p) => (
          <LegendItem key={`leg-${p.number}`}>
            <Avatar initials={p.initials} size="sm" alt="" />
            <span>
              {p.number} {formatLegend(p)}
            </span>
          </LegendItem>
        ))}
      </Legend>
    </Root>
  );
}

function formatLegend(p: Player) {
  return p.name;
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
  border: 1px solid
    ${(p) =>
      p.$active ? 'var(--color-primary-primary)' : 'var(--color-stroke-border-container-os)'};
  background: ${(p) =>
    p.$active ? 'var(--color-primary-primary-overlay)' : 'transparent'};
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-1000);
  padding: var(--space-100) var(--space-200);
  cursor: pointer;
`;

const Pitch = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-200);
  border: 1px solid var(--color-stroke-border-container-os);
  background: linear-gradient(
    180deg,
    rgba(44, 194, 126, 0.22) 0%,
    rgba(36, 164, 106, 0.12) 50%,
    rgba(44, 194, 126, 0.22) 100%
  );
  overflow: hidden;
`;

const Halfway = styled.div`
  position: absolute;
  left: 8%;
  right: 8%;
  top: 50%;
  height: 1px;
  background: rgba(255, 255, 255, 0.28);
`;

const CenterCircle = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 22%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 50%;
`;

const PenaltyTop = styled.div`
  position: absolute;
  left: 22%;
  right: 22%;
  top: 0;
  height: 14%;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-top: none;
`;

const PenaltyBottom = styled.div`
  position: absolute;
  left: 22%;
  right: 22%;
  bottom: 0;
  height: 14%;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-bottom: none;
`;

const PlayerNode = styled.div<{ $x: number; $y: number; $accent: 'spain' | 'england' }>`
  position: absolute;
  left: ${(p) => p.$x}%;
  top: ${(p) => 100 - p.$y}%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  z-index: 1;

  /* Ring color: Spain red / England blue via cake badge tokens */
  & > *:first-child {
    box-shadow: 0 0 0 2px
      ${(p) =>
        p.$accent === 'spain'
          ? 'var(--color-badge-red)'
          : 'var(--color-badge-blue)'};
    border-radius: 50%;
  }
`;

const Shirt = styled.span`
  position: absolute;
  top: -4px;
  right: -6px;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  border-radius: var(--radius-1000);
  background: var(--color-surfaces-container);
  color: var(--color-text-icon-primary);
  font-size: 9px;
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

const PlayerLabel = styled.span`
  font-family: var(--font-family);
  font-size: 9px;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-icon-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.65);
  white-space: nowrap;
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Legend = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-100);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  font-family: var(--font-family);
  font-size: 10px;
  color: var(--color-text-icon-secondary);
  min-width: 0;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
