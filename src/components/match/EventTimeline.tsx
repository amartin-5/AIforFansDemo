import styled from 'styled-components';
import type { MatchEvent } from '../../types/domain';

type EventTimelineProps = {
  events: MatchEvent[];
  selectedId?: string;
  onSelect?: (event: MatchEvent) => void;
};

export function EventTimeline({ events, selectedId, onSelect }: EventTimelineProps) {
  return (
    <List aria-label="Match event timeline">
      {events.map((event) => {
        const selected = event.id === selectedId;
        return (
          <Item
            key={event.id}
            type="button"
            $selected={selected}
            aria-current={selected ? 'true' : undefined}
            onClick={() => onSelect?.(event)}
          >
            <Minute>
              {event.minute}
              {event.addedTime ? `+${event.addedTime}` : ""}'
            </Minute>
            <Body>
              <Label>{event.label}</Label>
              <Desc>{event.description}</Desc>
            </Body>
          </Item>
        );
      })}
    </List>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
`;

const Item = styled.button<{ $selected: boolean }>`
  display: flex;
  gap: var(--space-200);
  align-items: flex-start;
  width: 100%;
  min-height: 44px;
  text-align: left;
  padding: var(--space-200);
  border-radius: var(--radius-200);
  border: 1px solid
    ${(p) => (p.$selected ? 'var(--color-primary-primary)' : 'var(--color-stroke-border)')};
  background: ${(p) =>
    p.$selected
      ? 'var(--color-surfaces-primary)'
      : 'var(--color-surfaces-container-blur)'};
  cursor: pointer;
  color: inherit;
  font: inherit;
`;

const Minute = styled.span`
  flex-shrink: 0;
  min-width: 2.5rem;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Body = styled.span`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  min-width: 0;
`;

const Label = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Desc = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;
