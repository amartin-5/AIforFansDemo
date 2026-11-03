import styled from 'styled-components';

type FormPillsProps = {
  label: string;
  results: Array<'W' | 'D' | 'L'>;
};

export function FormPills({ label, results }: FormPillsProps) {
  return (
    <Row aria-label={`${label} recent form ${results.join(' ')}`}>
      <Label>{label}</Label>
      <Pills>
        {results.map((r, i) => (
          <Pill key={`${r}-${i}`} $result={r} aria-hidden>
            {r}
          </Pill>
        ))}
      </Pills>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
`;

const Label = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const Pills = styled.div`
  display: flex;
  gap: var(--space-050);
`;

const Pill = styled.span<{ $result: 'W' | 'D' | 'L' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-1000);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-inverse);
  background: ${(p) =>
    p.$result === 'W'
      ? 'var(--color-success-success)'
      : p.$result === 'D'
        ? 'var(--color-text-icon-secondary)'
        : 'var(--color-error-error)'};
`;
