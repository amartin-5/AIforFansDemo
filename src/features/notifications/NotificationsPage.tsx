import {
  Badge,
  Button,
  Chip,
  IconButton,
  Notification,
} from '@cake-admin/cakeand';
import {
  Bell,
  CheckCheck,
  Radio,
  Settings,
  Shirt,
  Sparkles,
  Trophy,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageScroll } from '../../components/layout/PageScroll';
import { EmptyState } from '../../components/system/EmptyState';
import { ErrorState } from '../../components/system/ErrorState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import { getMatch } from '../../data/repositories/matchRepository';
import { getNotifications } from '../../data/repositories/userRepository';
import { fadeRiseIn, glassRim, restingSurface } from '../../styles/surfaces';
import type {
  Notification as NotificationItem,
  NotificationCategory,
  NotificationStatus,
} from '../../types/domain';
import { matchdayPathForStatus } from '../../utils/matchRouting';

const FILTERS: { id: NotificationCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
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
      const next = await getNotifications();
      setItems(next.map((n) => ({ ...n })));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const counts = useMemo(() => {
    const map: Partial<Record<NotificationCategory, number>> = { all: items.length };
    for (const n of items) {
      map[n.category] = (map[n.category] ?? 0) + 1;
    }
    return map;
  }, [items]);

  const visibleFilters = useMemo(
    () => FILTERS.filter((f) => f.id === 'all' || (counts[f.id] ?? 0) > 0),
    [counts],
  );

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((n) => n.category === filter)),
    [filter, items],
  );

  const today = filtered.filter((n) => n.dayGroup === 'today');
  const yesterday = filtered.filter((n) => n.dayGroup === 'yesterday');

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function dismiss(id: string) {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }

  async function openItem(item: NotificationItem) {
    markRead(item.id);
    if (!item.matchId) return;
    try {
      const match = await getMatch(item.matchId, { delayMs: 0 });
      if (!match) {
        navigate(`/matchday/${item.matchId}/preview`);
        return;
      }
      if (item.category === 'live') {
        navigate(`/matchday/${item.matchId}/live`);
        return;
      }
      if (
        item.category === 'results' &&
        (match.status === 'full-time' || match.status === 'post-match')
      ) {
        navigate(`/past/${item.matchId}`);
        return;
      }
      navigate(matchdayPathForStatus(item.matchId, match.status));
    } catch {
      navigate(`/matchday/${item.matchId}/preview`);
    }
  }

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
      <Header>
        <HeaderCopy>
          <Title>Notifications</Title>
          <Sub>
            {unreadCount > 0
              ? `${unreadCount} unread · match alerts & moments`
              : 'You’re caught up'}
          </Sub>
        </HeaderCopy>
        <HeaderActions>
          {unreadCount > 0 ? (
            <IconButton
              label="Mark all as read"
              icon={<CheckCheck size={16} />}
              intent="secondary"
              variant="ghost"
              size="sm"
              onClick={markAllRead}
            />
          ) : null}
          <IconButton
            label="Notification settings"
            icon={<Settings size={16} />}
            intent="secondary"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
          />
        </HeaderActions>
      </Header>

      <Filters role="list" aria-label="Notification filters">
        {visibleFilters.map((f) => {
          const selected = filter === f.id;
          const count = counts[f.id] ?? 0;
          return (
            <ChipWrap key={f.id} role="listitem">
              <Chip
                type={selected ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter(f.id)}
                aria-pressed={selected}
              >
                {f.id === 'all' ? f.label : `${f.label} · ${count}`}
              </Chip>
            </ChipWrap>
          );
        })}
      </Filters>

      {filtered.length === 0 ? (
        <EmptyState
          title="No notifications here"
          description={
            filter === 'all'
              ? 'New match alerts and moments will show up in this feed.'
              : `Nothing in ${FILTERS.find((f) => f.id === filter)?.label ?? 'this filter'} yet.`
          }
          actionLabel={filter === 'all' ? undefined : 'Show all'}
          onAction={filter === 'all' ? undefined : () => setFilter('all')}
        />
      ) : (
        <Feed>
          {today.length > 0 ? (
            <DayGroup
              label="Today"
              items={today}
              onOpen={(item) => void openItem(item)}
              onDismiss={dismiss}
            />
          ) : null}
          {yesterday.length > 0 ? (
            <DayGroup
              label="Yesterday"
              muted
              items={yesterday}
              onOpen={(item) => void openItem(item)}
              onDismiss={dismiss}
            />
          ) : null}
        </Feed>
      )}

      {unreadCount > 0 ? (
        <CatchUp>
          <Button intent="secondary" variant="outline" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        </CatchUp>
      ) : null}
    </PageScroll>
  );
}

function DayGroup({
  label,
  muted,
  items,
  onOpen,
  onDismiss,
}: {
  label: string;
  muted?: boolean;
  items: NotificationItem[];
  onOpen: (item: NotificationItem) => void;
  onDismiss: (id: string) => void;
}) {
  return (
    <Group>
      <GroupLabel $muted={muted}>{label}</GroupLabel>
      <List aria-live="polite">
        {items.map((item) => (
          <NotificationRow
            key={item.id}
            item={item}
            onOpen={() => onOpen(item)}
            onDismiss={() => onDismiss(item.id)}
          />
        ))}
      </List>
    </Group>
  );
}

function NotificationRow({
  item,
  onOpen,
  onDismiss,
}: {
  item: NotificationItem;
  onOpen: () => void;
  onDismiss: () => void;
}) {
  const action = actionLabelFor(item);
  const status = statusFor(item);

  return (
    <GlassNotification
      status={status}
      icon={iconFor(item)}
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
      primaryActionLabel={item.matchId ? action : undefined}
      onPrimaryAction={item.matchId ? () => onOpen() : undefined}
      onDismiss={() => onDismiss()}
      dismissLabel={`Dismiss ${item.title}`}
    />
  );
}

function statusFor(item: NotificationItem): NotificationStatus {
  if (item.status) return item.status;
  switch (item.category) {
    case 'live':
      return 'info';
    case 'results':
      return 'success';
    case 'my-players':
      return 'warning';
    default:
      return 'neutral';
  }
}

function actionLabelFor(item: NotificationItem): string {
  if (item.category === 'live') return 'Watch live';
  if (item.category === 'results') return 'Open match';
  if (item.title.toLowerCase().includes('lineup')) return 'View lineup';
  if (item.title.toLowerCase().includes('moment')) return 'Open moment';
  return 'Open';
}

function iconFor(item: NotificationItem): ReactNode {
  const props = { size: 18, 'aria-hidden': true as const };
  switch (item.category) {
    case 'live':
      return <Radio {...props} />;
    case 'results':
      return <Trophy {...props} />;
    case 'my-players':
      return <Shirt {...props} />;
    case 'my-teams':
      return item.title.toLowerCase().includes('moment') ? (
        <Sparkles {...props} />
      ) : (
        <Bell {...props} />
      );
    default:
      return <Bell {...props} />;
  }
}

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-200);
  width: 100%;
  ${fadeRiseIn}
`;

const HeaderCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  min-width: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-050);
  flex-shrink: 0;
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.02em;
  color: var(--color-text-icon-primary);
`;

const Sub = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const Filters = styled.div`
  display: flex;
  gap: var(--space-150);
  width: 100%;
  overflow-x: auto;
  padding-bottom: var(--space-050);
  -webkit-overflow-scrolling: touch;
  ${fadeRiseIn}
  animation-delay: 60ms;

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
  gap: var(--space-350);
  width: 100%;
  ${fadeRiseIn}
  animation-delay: 100ms;
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
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${(p) =>
    p.$muted ? 'var(--color-text-icon-secondary)' : 'var(--color-primary-primary)'};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  width: 100%;
`;

/** Cake Notification defaults to opaque on-container — restyle to Hello PC glass. */
const GlassNotification = styled(Notification)`
  && {
    ${restingSurface}
  }
`;

const MetaPill = styled.span`
  display: flex;
  width: fit-content;
  margin-top: var(--space-150);
  padding: var(--space-100) var(--space-200);
  border-radius: var(--radius-1000);
  border: var(--stroke-100) solid ${glassRim};
  background: var(--color-primary-primary-overlay);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
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

const CatchUp = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: var(--space-100);
`;
