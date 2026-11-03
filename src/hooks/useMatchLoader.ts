import { useCallback, useEffect, useState } from 'react';
import {
  getMatch,
  resolveCompetition,
  resolveTeams,
  type RepoOptions,
} from '../data/repositories/matchRepository';
import type { Competition, Match, Team } from '../types/domain';
import type { DemoScenario } from '../data/fixtures/demoSpine';

export type LoadedMatch = {
  match: Match;
  home: Team;
  away: Team;
  competition: Competition;
};

export function useMatchLoader(matchId: string | undefined, scenario?: DemoScenario) {
  const [data, setData] = useState<LoadedMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!matchId) {
      setError('Missing match');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const opts: RepoOptions = scenario ? { scenario } : {};
      const match = await getMatch(matchId, opts);
      if (!match) throw new Error('Match not found');
      const sides = resolveTeams(match);
      setData({
        match,
        home: sides.home,
        away: sides.away,
        competition: resolveCompetition(match),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load match');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [matchId, scenario]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, reload: load };
}
