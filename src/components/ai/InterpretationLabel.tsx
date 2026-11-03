import { Badge } from '@cake-admin/cakeand';
import styled from 'styled-components';

type InterpretationLabelProps = {
  kind?: 'interpretation' | 'fact' | 'expected';
};

const copy = {
  interpretation: 'AI interpretation',
  fact: 'Match data',
  expected: 'Expected — not confirmed',
} as const;

export function InterpretationLabel({ kind = 'interpretation' }: InterpretationLabelProps) {
  return (
    <Wrap>
      <Badge
        color={kind === 'fact' ? 'green' : kind === 'expected' ? 'secondary' : 'primary'}
        tone="subtle"
        dot={false}
      >
        {copy[kind]}
      </Badge>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: inline-flex;
`;
