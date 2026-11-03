import {
  allMatches,
  demoMatchBase,
  DEMO_MATCH_ID,
  matchForScenario,
  type DemoScenario,
  teams,
  competitions,
  evidenceById,
  replayByEventId,
} from '../fixtures/demoSpine';
import {
  FEATURED_UPCOMING_ID,
  wwc2023UpcomingMatches,
} from '../fixtures/wwc2023Upcoming';
import {
  wwc2023PastMatches,
  wwcOpponentTeams,
  wwc2023Competition,
} from '../fixtures/wwc2023Past';
import type { EvidenceItem, Match, Replay, Team, Competition } from '../../types/domain';

export type RepoOptions = {
  /** Simulated latency in ms */
  delayMs?: number;
  /** Force failure for error-state demos */
  fail?: boolean;
  scenario?: DemoScenario;
};

let forceFail = false;

export function setMatchRepoFail(next: boolean) {
  forceFail = next;
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function gate<T>(value: T, options?: RepoOptions): Promise<T> {
  const delay = options?.delayMs ?? 280;
  if (delay > 0) await wait(delay);
  if (options?.fail || forceFail) {
    throw new Error('Unable to load match data. Please try again.');
  }
  return value;
}

const teamIndex: Record<string, Team> = {
  ...teams,
  ...wwcOpponentTeams,
};

const competitionIndex: Record<string, Competition> = {
  ...competitions,
  [wwc2023Competition.id]: wwc2023Competition,
};

/** Prefer WWC fixtures when ids collide with the older demo spine. */
const matchIndex: Match[] = (() => {
  const byId = new Map<string, Match>();
  for (const m of allMatches) byId.set(m.id, m);
  for (const m of wwc2023PastMatches) byId.set(m.id, m);
  for (const m of wwc2023UpcomingMatches) byId.set(m.id, m);
  return [...byId.values()];
})();

export async function getTeam(id: string, options?: RepoOptions): Promise<Team | undefined> {
  return gate(teamIndex[id], options);
}

export async function getCompetition(
  id: string,
  options?: RepoOptions,
): Promise<Competition | undefined> {
  return gate(competitionIndex[id], options);
}

export async function getMatch(id: string, options?: RepoOptions): Promise<Match | undefined> {
  if (id === DEMO_MATCH_ID && options?.scenario) {
    return gate(matchForScenario(options.scenario), options);
  }
  const found = matchIndex.find((m) => m.id === id);
  return gate(found, options);
}

export async function getDemoMatch(options?: RepoOptions): Promise<Match> {
  const scenario = options?.scenario ?? 'full-time';
  return gate(matchForScenario(scenario), options);
}

/**
 * Upcoming tab feed — future fixtures only (no live / past).
 * Multi-team slate sampled from Women’s World Cup 2023; favoriteTeamId
 * supports “My team” filtering without making Upcoming a team hub.
 */
export async function getHomeFeed(options?: RepoOptions): Promise<{
  featured: Match;
  upcoming: Match[];
  favoriteTeamId: string;
}> {
  const ordered = [...wwc2023UpcomingMatches].sort((a, b) =>
    a.kickoffIso.localeCompare(b.kickoffIso),
  );
  const featured =
    ordered.find((m) => m.id === FEATURED_UPCOMING_ID) ?? ordered[0];
  const upcoming = ordered.filter((m) => m.id !== featured.id);
  return gate(
    {
      featured,
      upcoming,
      favoriteTeamId: 'spain',
    },
    options,
  );
}

/** Matchday tab — today’s live (and same-day) Spain focus. */
export async function getMatchdayFeed(options?: RepoOptions): Promise<{
  live: Match;
  today: Match[];
  favoriteTeamId: string;
}> {
  const live = matchForScenario('live');
  return gate(
    {
      live,
      today: [live],
      favoriteTeamId: 'spain',
    },
    options,
  );
}

export async function listPastMatches(options?: RepoOptions): Promise<Match[]> {
  return gate(
    wwc2023PastMatches.filter((m) => ['full-time', 'post-match'].includes(m.status)),
    options,
  );
}

export async function listUpcomingMatches(options?: RepoOptions): Promise<Match[]> {
  return gate(
    wwc2023UpcomingMatches.filter((m) =>
      ['upcoming', 'pre-match', 'between-matches'].includes(m.status),
    ),
    options,
  );
}

export async function getEvidence(id: string, options?: RepoOptions): Promise<EvidenceItem | undefined> {
  return gate(evidenceById[id as keyof typeof evidenceById], options);
}

export async function getReplayForEvent(
  eventId: string,
  options?: RepoOptions,
): Promise<Replay | undefined> {
  return gate(replayByEventId[eventId as keyof typeof replayByEventId], options);
}

export function resolveTeams(match: Match): { home: Team; away: Team } {
  const home = teamIndex[match.homeTeamId];
  const away = teamIndex[match.awayTeamId];
  if (!home || !away) throw new Error('Missing team in fixture data');
  return { home, away };
}

export function resolveCompetition(match: Match): Competition {
  const byKey = competitionIndex[match.competitionId];
  if (byKey) return byKey;
  const byId = Object.values(competitionIndex).find((c) => c.id === match.competitionId);
  return (
    byId ?? {
      id: match.competitionId,
      name: 'Competition',
      shortName: 'Comp',
    }
  );
}

/** Re-export for callers that still want the spine final. */
export { demoMatchBase };
