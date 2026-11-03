import { Accordion, AccordionItem } from '@cake-admin/cakeand';
import styled from 'styled-components';
import type { AIExplanationLayer } from '../../types/domain';
import { track } from '../../services/analytics';

type ProgressiveExplanationProps = {
  layers: AIExplanationLayer;
  insightId?: string;
};

export function ProgressiveExplanation({ layers, insightId }: ProgressiveExplanationProps) {
  return (
    <Stack>
      <Block>
        <Label>What happened</Label>
        <Text>{layers.whatHappened}</Text>
      </Block>
      <Block>
        <Label>Why it mattered</Label>
        <Text>{layers.whyItMattered}</Text>
      </Block>
      <Block>
        <Label>How it changed the match</Label>
        <Text>{layers.howItChanged}</Text>
      </Block>
      <Block>
        <Label>What to watch next</Label>
        <Text>{layers.whatToWatchNext}</Text>
      </Block>
      {layers.deeperTactical ? (
        <Accordion
          type="single"
          collapsible
          onValueChange={(v) => {
            if (v === 'deeper') track('explanation_expanded', { insightId });
          }}
        >
          <AccordionItem value="deeper" title="Deeper tactical analysis">
            <Text>{layers.deeperTactical}</Text>
          </AccordionItem>
        </Accordion>
      ) : null}
    </Stack>
  );
}

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
`;

const Block = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
`;

const Label = styled.h3`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-helper);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Text = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.45;
  color: var(--color-text-icon-secondary);
`;
