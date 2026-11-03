import { Chip, ContentSwitcher } from '@cake-admin/cakeand';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageScroll } from '../../components/layout/PageScroll';
import { UpcomingMatchRow } from '../../components/match/UpcomingMatchRow';
import { EmptyState } from '../../components/system/EmptyState';
import { ErrorState } from '../../components/system/ErrorState';
import { OfflineState } from '../../components/system/OfflineState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import {
  getHomeFeed,
  resolveCompetition,
  resolveTeams,
} from '../../data/repositories/matchRepository';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { track } from '../../services/analytics';
import type { Match } from '../../types/domain';

type ScopeFilter = 'all' | 'my-team';

type MonthFilter = 'all' | '2023-08';

const MONTH_FILTERS: { id: MonthFilter; label: string }[] = [
  { id: 'all', label: 'All dates' },
  { id: '2023-08', label: 'Aug’23' },
];

type Feed = {
  featured: Match;
  upcoming: Match[];
  favoriteTeamId: string;
};

/**
 * Upcoming = browsable future fixture menu.
 * Pre-match lineup lives one click deeper (preview route).
 * Favorite-team depth stays on My Team.
 */
export function UpcomingPage() {
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<ScopeFilter>('all');
  const [month, setMonth] = useState<MonthFilter>('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHomeFeed();
      setFeed(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setFeed(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const schedule = useMemo(() => {
    if (!feed) return [] as Match[];
    return [feed.featured, ...feed.upcoming].filter(
      (m, i, arr) => arr.findIndex((x) => x.id === m.id) === i,
    );
  }, [feed]);

  const filtered = useMemo(() => {
    if (!feed) return [] as Match[];
    return schedule.filter((m) => {
      if (scope === 'my-team') {
        const involvesFav =
          m.homeTeamId === feed.favoriteTeamId ||
          m.awayTeamId === feed.favoriteTeamId;
        if (!involvesFav) return false;
      }
      if (month !== 'all' && !m.kickoffIso.startsWith(month)) return false;
      return true;
    });
  }, [feed, schedule, scope, month]);

  if (!online) {
    return (
      <PageScroll label="Upcoming">
        <OfflineState onRetry={() => void load()} />
      </PageScroll>
    );
  }

  if (loading) {
    return (
      <PageScroll label="Upcoming">
        <SkeletonBlock label="Loading upcoming matches" />
      </PageScroll>
    );
  }

  if (error) {
    return (
      <PageScroll label="Upcoming">
        <ErrorState message={error} onRetry={() => void load()} />
      </PageScroll>
    );
  }

  if (!feed) {
    return (
      <PageScroll label="Upcoming">
        <EmptyState
          title="No upcoming matches"
          description="When fixtures are available, they will appear here."
        />
      </PageScroll>
    );
  }

  function openLineup(match: Match) {
    track('match_opened', { matchId: match.id, from: 'upcoming-menu' });
    navigate(`/matchday/${match.id}/preview`);
  }

  return (
    <PageScroll label="Upcoming" compact>
      <Header>
        <Heading>Upcoming</Heading>
        <Sub>Browse future fixtures — open a match for the pre-match lineup report</Sub>
      </Header>

      <FilterBar>
        <ContentSwitcher
          aria-label="Fixture scope"
          size="sm"
          intent="secondary"
          value={scope}
          onValueChange={(v) => setScope(v as ScopeFilter)}
          options={[
            { value: 'all', label: 'All matches' },
            { value: 'my-team', label: 'My team' },
          ]}
        />
        <ChipRow role="list" aria-label="Date filters">
          {MONTH_FILTERS.map((f) => (
            <Chip
              key={f.id}
              size="sm"
              type={month === f.id ? 'primary' : 'secondary'}
              onClick={() => setMonth(f.id)}
              aria-pressed={month === f.id}
            >
              {f.label}
            </Chip>
          ))}
        </ChipRow>
      </FilterBar>

      <ResultsCount>
        {filtered.length} match{filtered.length === 1 ? '' : 'es'}
        {scope === 'my-team' ? ' · Spain' : ''}
      </ResultsCount>

      {filtered.length === 0 ? (
        <EmptyState
          title="No matches in this filter"
          description="Try All matches or clear the date filter. Team-only detail lives on My Team."
        />
      ) : (
        <MenuList role="list">
          {filtered.map((m) => {
            const sides = resolveTeams(m);
            const competition = resolveCompetition(m);
            return (
              <li key={m.id}>
                <UpcomingMatchRow
                  match={m}
                  home={sides.home}
                  away={sides.away}
                  competition={competition}
                  onOpen={() => openLineup(m)}
                />
              </li>
            );
          })}
        </MenuList>
      )}
    </PageScroll>
  );
}

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
`;

const Heading = styled.h1`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Sub = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-secondary);
`;

const FilterBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  width: 100%;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-100);
`;

const ResultsCount = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-icon-secondary);
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  width: 100%;
`;
