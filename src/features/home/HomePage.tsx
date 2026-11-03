import { Spinner } from '@cake-admin/cakeand';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { PageScroll } from '../../components/layout/PageScroll';
import { track } from '../../services/analytics';
import { HomeFeedModule, HomeIntro } from './HomeModules';
import { FEED_CYCLE, type FeedItem } from './homeContent';

const INITIAL_CYCLES = 1;
const LOAD_MORE_CYCLES = 1;
const MAX_CYCLES = 6;

function buildFeed(cycles: number): FeedItem[] {
  const items: FeedItem[] = [];
  for (let cycle = 0; cycle < cycles; cycle += 1) {
    for (const module of FEED_CYCLE) {
      items.push({
        key: `${module}-${cycle}`,
        module,
        cycle,
      });
    }
  }
  return items;
}

export function HomePage() {
  const [cycles, setCycles] = useState(INITIAL_CYCLES);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const feed = buildFeed(cycles);
  const canLoadMore = cycles < MAX_CYCLES;

  const loadMore = useCallback(() => {
    if (!canLoadMore || loadingMore) return;
    setLoadingMore(true);
    window.setTimeout(() => {
      setCycles((c) => Math.min(MAX_CYCLES, c + LOAD_MORE_CYCLES));
      setLoadingMore(false);
      track('destination_viewed', { path: '/home', infinite: true });
    }, 350);
  }, [canLoadMore, loadingMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !canLoadMore) return;

    const root = node.closest('[data-page-scroll]');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      {
        root: root instanceof Element ? root : null,
        rootMargin: '240px 0px',
        threshold: 0,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [canLoadMore, loadMore, cycles]);

  return (
    <PageScroll label="Home" compact>
      <HomeIntro />
      {feed.map((item) => (
        <HomeFeedModule key={item.key} module={item.module} />
      ))}
      <Sentinel ref={sentinelRef} aria-hidden={!loadingMore}>
        {loadingMore ? (
          <LoadMore>
            <Spinner size="sm" />
            <span>Loading more insights…</span>
          </LoadMore>
        ) : canLoadMore ? (
          <Hint>Scroll for more of what’s in the app</Hint>
        ) : (
          <Hint>End of overview — try Upcoming, Matchday, Past, My Team, or AI Chat</Hint>
        )}
      </Sentinel>
    </PageScroll>
  );
}

const Sentinel = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: var(--space-300) 0 var(--space-200);
`;

const LoadMore = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-150);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const Hint = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  text-align: center;
`;
