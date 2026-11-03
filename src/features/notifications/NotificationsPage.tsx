import { Badge, Chip, Notification } from '@cake-admin/cakeand';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageScroll } from '../../components/layout/PageScroll';
import { EmptyState } from '../../components/system/EmptyState';
import { ErrorState } from '../../components/system/ErrorState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import { getNotifications } from '../../data/repositories/userRepository';
import type { Notification as NotificationItem, NotificationCategory } from '../../types/domain';

const FILTERS: { id: NotificationCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'transfers', label: 'Transfers' },
  { id: 'results', label: 'Results' },
  { id: 'my-teams', label: 'My teams' },
  { id: 'my-players', label: 'My players' },
];

export function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NotificationCategory>('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await getNotifications());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((n) => n.category === filter)),
    [filter, items],
  );

  const today = filtered.filter((n) => n.dayGroup === 'today');
  const yesterday = filtered.filter((n) => n.dayGroup === 'yesterday');

  if (loading) {
    return (
      <PageScroll label="Notifications">
        <SkeletonBlock label="Loading notifications" />
      </PageScroll>
    );
  }
  if (error) {
    return (
      <PageScroll label="Notifications">
        <ErrorState message={error} onRetry={() => void load()} />
      </PageScroll>
    );
  }

  return (
    <PageScroll label="Notifications" compact>
      <Title>Notifications</Title>

      <Filters role="list" aria-label="Notification filters">
        {FILTERS.map((f) => {
          const selected = filter === f.id;
          return (
            <ChipWrap key={f.id} role="listitem">
              <Chip
                type={selected ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter(f.id)}
                aria-pressed={selected}
              >
                {f.label}
              </Chip>
            </ChipWrap>
          );
        })}
      </Filters>

      {filtered.length === 0 ? (
        <EmptyState title="No notifications" />
      ) : (
        <Feed>
          {today.length > 0 ? (
            <Group>
              <GroupLabel>Today</GroupLabel>
              {today.map((n) => (
                <NotificationCard key={n.id} item={n} onOpen={() => openItem(n, navigate)} />
              ))}
            </Group>
          ) : null}
          {yesterday.length > 0 ? (
            <Group>
              <GroupLabel $muted>Yesterday</GroupLabel>
              {yesterday.map((n) => (
                <NotificationCard key={n.id} item={n} onOpen={() => openItem(n, navigate)} />
              ))}
            </Group>
          ) : null}
        </Feed>
      )}
    </PageScroll>
  );
}

function openItem(
  item: NotificationItem,
  navigate: ReturnType<typeof useNavigate>,
) {
  if (item.matchId) navigate(`/matchday/${item.matchId}/preview`);
}

function NotificationCard({
  item,
  onOpen,
}: {
  item: NotificationItem;
  onOpen: () => void;
}) {
  return (
    <Notification
      status={item.status ?? 'info'}
      title={item.title}
      description={
        <>
          {item.body}
          {item.scoreLabel ? <MetaPill>{item.scoreLabel}</MetaPill> : null}
          {item.tag ? (
            <TagWrap>
              <Badge color="secondary" tone="subtle" dot={false}>
                {item.tag}
              </Badge>
            </TagWrap>
          ) : null}
        </>
      }
      timestamp={item.timeLabel}
      unread={!item.read}
      secondaryActionLabel={item.matchId ? 'View match' : undefined}
      onSecondaryAction={item.matchId ? () => onOpen() : undefined}
      primaryActionLabel={item.matchId ? 'Open' : undefined}
      onPrimaryAction={item.matchId ? () => onOpen() : undefined}
    />
  );
}

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Filters = styled.div`
  display: flex;
  gap: var(--space-150);
  width: 100%;
  overflow-x: auto;
  padding-bottom: var(--space-050);
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ChipWrap = styled.div`
  display: inline-flex;
  flex-shrink: 0;
`;

const Feed = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  width: 100%;
`;

const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  width: 100%;
`;

const GroupLabel = styled.h2<{ $muted?: boolean }>`
  margin: 0;
  padding: 0 var(--space-100);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) =>
    p.$muted ? 'var(--color-text-icon-secondary)' : 'var(--color-primary-primary)'};
`;

const MetaPill = styled.span`
  display: flex;
  width: fit-content;
  margin-top: var(--space-150);
  padding: var(--space-100) var(--space-200);
  border-radius: var(--radius-150);
  border: var(--stroke-100) solid var(--color-stroke-border);
  background: var(--color-surfaces-on-container);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const TagWrap = styled.span`
  display: flex;
  width: fit-content;
  margin-top: var(--space-150);
`;
