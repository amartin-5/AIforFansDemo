import { Chip } from '@cake-admin/cakeand';
import styled from 'styled-components';
import type { ViewingProvider } from '../../types/domain';

type WhereToWatchCardProps = {
  providers: ViewingProvider[];
  selectedId?: string;
  onSelect?: (id: string) => void;
};

export function WhereToWatchCard({ providers, selectedId, onSelect }: WhereToWatchCardProps) {
  return (
    <Section>
      <Header>
        <Title>Streaming services</Title>
        <Hint>Link a service to watch in app</Hint>
      </Header>
      <Row role="list">
        {providers.map((p) => {
          const selected = selectedId === p.id;
          return (
            <ChipWrap key={p.id} role="listitem">
              <Chip
                type={selected ? 'primary' : 'secondary'}
                size="sm"
                disabled={!p.available}
                onClick={() => p.available && onSelect?.(p.id)}
                aria-pressed={selected}
              >
                {p.name}
                {!p.available ? ' · n/a' : ''}
              </Chip>
            </ChipWrap>
          );
        })}
      </Row>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
`;

const Title = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Hint = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-100);
`;

const ChipWrap = styled.div`
  display: inline-flex;
`;
