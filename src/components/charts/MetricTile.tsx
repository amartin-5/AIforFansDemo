import styled from 'styled-components';
import { glassTile } from '../../styles/surfaces';

type MetricTileProps = {
  label: string;
  value: string;
  hint?: string;
};

export function MetricTile({ label, value, hint }: MetricTileProps) {
  return (
    <Tile>
      <Value>{value}</Value>
      <Label>{label}</Label>
      {hint ? <Hint>{hint}</Hint> : null}
    </Tile>
  );
}

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  padding: var(--space-300);
  min-width: 0;
  ${glassTile}
`;

const Value = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Label = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const Hint = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  opacity: 0.8;
`;
