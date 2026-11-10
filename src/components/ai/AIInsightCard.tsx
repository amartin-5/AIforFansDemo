import { Button } from '@cake-admin/cakeand';
import styled from 'styled-components';
import { accentSurface } from '../../styles/surfaces';
import type { AIInsight } from '../../types/domain';
import { InterpretationLabel } from './InterpretationLabel';

type AIInsightCardProps = {
  insight: AIInsight;
  onOpen?: () => void;
};

export function AIInsightCard({ insight, onOpen }: AIInsightCardProps) {
  return (
    <Surface>
      <Pad>
        <InterpretationLabel kind="interpretation" />
        <Title>{insight.title}</Title>
        <Body>{insight.summary}</Body>
        {insight.confidenceLabel ? <Meta>{insight.confidenceLabel}</Meta> : null}
        {onOpen ? (
          <Button intent="secondary" variant="outline" size="sm" onClick={onOpen}>
            Explain this moment
          </Button>
        ) : null}
      </Pad>
    </Surface>
  );
}

const Surface = styled.div`
  ${accentSurface}
`;

const Pad = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-200);
  padding: var(--space-350);
`;

const Title = styled.h3`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Body = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.45;
  color: var(--color-text-icon-secondary);
`;

const Meta = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;
