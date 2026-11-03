import { Modal, ModalContent } from '@cake-admin/cakeand';
import { ChevronRight } from 'lucide-react';
import styled from 'styled-components';
import type { ViewingProvider } from '../../types/domain';
import { ProviderMark } from './ProviderMark';

type StreamLoginModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providers: ViewingProvider[];
  onSelectProvider: (provider: ViewingProvider) => void;
  /** Runtime-linked provider ids (demo entitlement + profile). */
  linkedIds?: string[];
};

/**
 * Gate for watching live / post-match in app — link a streaming service first.
 * Content from Alexandria "Catch the action"; visuals via cake& Modal + tokens.
 */
export function StreamLoginModal({
  open,
  onOpenChange,
  providers,
  onSelectProvider,
  linkedIds = [],
}: StreamLoginModalProps) {
  const withLink = providers.map((p) => ({
    ...p,
    linked: Boolean(p.linked) || linkedIds.includes(p.id),
  }));
  const linked = withLink.filter((p) => p.available && p.linked);
  const available = withLink.filter((p) => p.available && !p.linked);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Catch the action"
      subtitle="Add your streaming service to your profile to watch the match live."
      showClose
    >
      <ModalContent descriptionAsDialogDescription={false}>
        <Stack>
          {linked.length > 0 ? (
            <Group>
              <GroupLabel>Logged in</GroupLabel>
              <List role="list">
                {linked.map((p) => (
                  <ProviderRow
                    key={p.id}
                    type="button"
                    role="listitem"
                    onClick={() => onSelectProvider(p)}
                  >
                    <Left>
                      <ProviderMark provider={p} />
                      <Name>{p.name}</Name>
                    </Left>
                    <ChevronRight size={18} aria-hidden />
                  </ProviderRow>
                ))}
              </List>
            </Group>
          ) : null}

          {available.length > 0 ? (
            <Group>
              <GroupLabel>Also available on</GroupLabel>
              <List role="list">
                {available.map((p) => (
                  <ProviderRow
                    key={p.id}
                    type="button"
                    role="listitem"
                    $secondary
                    onClick={() => onSelectProvider(p)}
                  >
                    <Left>
                      <ProviderMark provider={p} />
                      <Name>{p.name}</Name>
                    </Left>
                    <ChevronRight size={18} aria-hidden />
                  </ProviderRow>
                ))}
              </List>
            </Group>
          ) : null}
        </Stack>
      </ModalContent>
    </Modal>
  );
}

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-400);
  width: 100%;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  width: 100%;
`;

const GroupLabel = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
  width: 100%;
`;

const ProviderRow = styled.button<{ $secondary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  width: 100%;
  min-height: 56px;
  padding: 0 var(--space-300);
  border-radius: var(--radius-200);
  border: ${(p) =>
    p.$secondary
      ? '1px solid var(--color-stroke-border)'
      : 'var(--stroke-200) solid var(--color-stroke-border-high)'};
  background: var(--color-surfaces-container-blur);
  color: var(--color-text-icon-primary);
  cursor: pointer;
  font: inherit;
  text-align: left;

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: 2px;
  }
`;

const Left = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-200);
  min-width: 0;
`;

const Name = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;
