import { Button } from '@cake-admin/cakeand';
import styled from 'styled-components';
import { glassSurface } from '../../styles/surfaces';

type OfflineStateProps = {
  onRetry?: () => void;
};

export function OfflineState({ onRetry }: OfflineStateProps) {
  return (
    <Wrap role="status">
      <Title>You appear offline</Title>
      <Body>
        Match updates need a connection. You can still browse saved moments when they are
        available on this device.
      </Body>
      {onRetry ? (
        <Button intent="secondary" variant="outline" onClick={onRetry}>
          Retry connection
        </Button>
      ) : null}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-200);
  padding: var(--space-400);
  ${glassSurface}
`;

const Title = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Body = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.4;
  color: var(--color-text-icon-secondary);
`;
