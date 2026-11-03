import { Button } from '@cake-admin/cakeand';
import styled from 'styled-components';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Wrap role="status">
      <Title>{title}</Title>
      {description ? <Body>{description}</Body> : null}
      {actionLabel && onAction ? (
        <Button intent="secondary" variant="outline" onClick={onAction}>
          {actionLabel}
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
  border-radius: var(--radius-300);
  background: var(--color-surfaces-container-blur);
  border: 1px solid var(--color-stroke-border);
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
