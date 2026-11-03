import {
  Chip,
  Dropdown,
  IconButton,
  Modal,
  ModalContent,
  ModalFooter,
} from '@cake-admin/cakeand';
import { SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageScroll } from '../../components/layout/PageScroll';
import { PastMatchCard } from '../../components/past/PastMatchCard';
import { EmptyState } from '../../components/system/EmptyState';
import { ErrorState } from '../../components/system/ErrorState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import { getPastLibraryMeta } from '../../data/fixtures/wwc2023Past';
import {
  listPastMatches,
  resolveCompetition,
  resolveTeams,
} from '../../data/repositories/matchRepository';
import { track } from '../../services/analytics';
import type { Match } from '../../types/domain';

const STAGE_OPTIONS = [
  { value: 'all', label: 'All stages' },
  { value: 'Quarter-final', label: 'Quarter-final' },
  { value: 'Round of 16', label: 'Round of 16' },
  { value: 'Group stage', label: 'Group stage' },
];

const DATE_OPTIONS = [
  { value: 'all', label: 'All dates' },
  { value: '2023-07', label: 'July 2023' },
  { value: '2023-08', label: 'August 2023' },
];

const DEFAULT_TEAM = 'all';
const DEFAULT_DATE = 'all';
const DEFAULT_STAGE = 'all';
/** How many fixtures “Recent” surfaces before opening filters. */
const RECENT_LIMIT = 4;

type FilterDraft = {
  teamId: string;
  dateKey: string;
  stage: string;
};

const EMPTY_FILTERS: FilterDraft = {
  teamId: DEFAULT_TEAM,
  dateKey: DEFAULT_DATE,
  stage: DEFAULT_STAGE,
};

function matchMonthKey(iso: string): string {
  return iso.slice(0, 7);
}

function isCustomFilters(f: FilterDraft): boolean {
  return (
    f.teamId !== DEFAULT_TEAM ||
    f.dateKey !== DEFAULT_DATE ||
    f.stage !== DEFAULT_STAGE
  );
}

function filterSummary(f: FilterDraft, teamLabel: string): string {
  const parts: string[] = [];
  if (f.teamId !== DEFAULT_TEAM) parts.push(teamLabel);
  if (f.dateKey !== DEFAULT_DATE) {
    parts.push(DATE_OPTIONS.find((d) => d.value === f.dateKey)?.label ?? f.dateKey);
  }
  if (f.stage !== DEFAULT_STAGE) parts.push(f.stage);
  return parts.join(' · ');
}

export function PastPage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** `recent` is the default preset; `custom` when filter settings are applied. */
  const [preset, setPreset] = useState<'recent' | 'custom'>('recent');
  const [applied, setApplied] = useState<FilterDraft>(EMPTY_FILTERS);
  const [draft, setDraft] = useState<FilterDraft>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listPastMatches();
      setMatches(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const teamOptions = useMemo(() => {
    const byId = new Map<string, string>();
    for (const m of matches) {
      const { home, away } = resolveTeams(m);
      byId.set(home.id, home.name);
      byId.set(away.id, away.name);
    }
    return [
      { value: 'all', label: 'All teams' },
      ...[...byId.entries()]
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([value, label]) => ({ value, label })),
    ];
  }, [matches]);

  const sortedMatches = useMemo(
    () =>
      [...matches].sort(
        (a, b) => new Date(b.kickoffIso).getTime() - new Date(a.kickoffIso).getTime(),
      ),
    [matches],
  );

  const filtered = useMemo(() => {
    if (preset === 'recent') {
      return sortedMatches.slice(0, RECENT_LIMIT);
    }

    return sortedMatches.filter((m) => {
      const meta = getPastLibraryMeta(m.id);
      if (!meta) return false;
      if (applied.stage !== 'all' && meta.stage !== applied.stage) return false;
      if (applied.dateKey !== 'all' && matchMonthKey(m.kickoffIso) !== applied.dateKey) {
        return false;
      }
      if (
        applied.teamId !== 'all' &&
        m.homeTeamId !== applied.teamId &&
        m.awayTeamId !== applied.teamId
      ) {
        return false;
      }
      return true;
    });
  }, [sortedMatches, preset, applied]);

  const appliedTeamLabel =
    teamOptions.find((t) => t.value === applied.teamId)?.label ?? 'Team';

  const openFilterSettings = () => {
    setDraft(preset === 'custom' ? applied : EMPTY_FILTERS);
    setFilterOpen(true);
  };

  const applyFilters = () => {
    if (!isCustomFilters(draft)) {
      setApplied(EMPTY_FILTERS);
      setPreset('recent');
    } else {
      setApplied(draft);
      setPreset('custom');
    }
    setFilterOpen(false);
  };

  const resetToRecent = () => {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPreset('recent');
    setFilterOpen(false);
  };

  if (loading) {
    return (
      <PageScroll label="Past">
        <SkeletonBlock label="Loading past matches" />
      </PageScroll>
    );
  }
  if (error) {
    return (
      <PageScroll label="Past">
        <ErrorState message={error} onRetry={() => void load()} />
      </PageScroll>
    );
  }

  return (
    <PageScroll label="Past">
      <Header>
        <TitleBlock>
          <Eyebrow>AI match replay</Eyebrow>
          <Title>Past matches</Title>
          <Sub>
            Women’s World Cup 2023 — browse recent results, then refine by team, date, or
            stage.
          </Sub>
        </TitleBlock>

        <Toolbar>
          <PresetRow role="list" aria-label="Filter preset">
            <Chip
              size="sm"
              type={preset === 'recent' ? 'primary' : 'secondary'}
              onClick={() => {
                setPreset('recent');
                setApplied(EMPTY_FILTERS);
              }}
            >
              Recent
            </Chip>
            {preset === 'custom' ? (
              <Chip
                size="sm"
                type="primary"
                onClick={openFilterSettings}
                onRemove={resetToRecent}
                removeLabel="Clear custom filters"
              >
                {filterSummary(applied, appliedTeamLabel) || 'Custom'}
              </Chip>
            ) : null}
          </PresetRow>

          <IconButton
            label="Open filter settings"
            icon={<SlidersHorizontal size={18} aria-hidden />}
            intent="secondary"
            variant={preset === 'custom' ? 'tonal' : 'outline'}
            size="sm"
            onClick={openFilterSettings}
          />
        </Toolbar>
      </Header>

      <ResultsHeader>
        {preset === 'recent' ? 'Most recent' : 'Filtered results'} ({filtered.length})
      </ResultsHeader>

      {filtered.length === 0 ? (
        <EmptyState
          title="No matches match these filters"
          description="Open filter settings and adjust team, date, or stage — or return to Recent."
        />
      ) : (
        <List>
          {filtered.map((m) => {
            const sides = resolveTeams(m);
            const competition = resolveCompetition(m);
            const meta = getPastLibraryMeta(m.id)!;
            return (
              <PastMatchCard
                key={m.id}
                match={m}
                home={sides.home}
                away={sides.away}
                competition={competition}
                stage={meta.stage}
                coverImage={meta.coverImage}
                onOpen={() => {
                  track('recap_opened', { matchId: m.id, from: 'past' });
                  navigate(`/past/${m.id}`);
                }}
              />
            );
          })}
        </List>
      )}

      <Modal
        open={filterOpen}
        onOpenChange={setFilterOpen}
        title="Filter matches"
        footer={
          <ModalFooter
            checkbox={false}
            secondaryActionLabel="Clear filter"
            onSecondaryAction={resetToRecent}
            primaryActionLabel="Apply filters"
            onPrimaryAction={applyFilters}
          />
        }
      >
        <ModalContent description="Set team, date, and stage. Apply replaces the Recent preset.">
          <FilterFields>
            <Dropdown
              label="Team"
              options={teamOptions}
              value={draft.teamId}
              onValueChange={(teamId) => setDraft((d) => ({ ...d, teamId }))}
              placeholder="All teams"
            />
            <Dropdown
              label="Date"
              options={DATE_OPTIONS}
              value={draft.dateKey}
              onValueChange={(dateKey) => setDraft((d) => ({ ...d, dateKey }))}
              placeholder="All dates"
            />
            <Dropdown
              label="Stage"
              options={STAGE_OPTIONS}
              value={draft.stage}
              onValueChange={(stage) => setDraft((d) => ({ ...d, stage }))}
              placeholder="All stages"
            />
          </FilterFields>
        </ModalContent>
      </Modal>
    </PageScroll>
  );
}

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
`;

const Eyebrow = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-primary-primary);
`;

const Title = styled.h1`
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
  line-height: 1.45;
  color: var(--color-text-icon-secondary);
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
`;

const PresetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
`;

const ResultsHeader = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-icon-secondary);
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
`;

const FilterFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-250);
  width: 100%;
  padding-block: var(--space-100);
`;
