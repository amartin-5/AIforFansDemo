import { describe, expect, it } from 'vitest';
import { DEMO_MATCH_ID } from '../fixtures/demoSpine';
import {
  getDemoMatch,
  getHomeFeed,
  getMatchdayFeed,
  resolveTeams,
  setMatchRepoFail,
} from './matchRepository';

describe('matchRepository', () => {
  it('keeps Spain–Sweden SF teams consistent across live and full-time scenarios', async () => {
    const live = await getDemoMatch({ scenario: 'live', delayMs: 0 });
    const ft = await getDemoMatch({ scenario: 'full-time', delayMs: 0 });
    expect(live.id).toBe(DEMO_MATCH_ID);
    expect(ft.id).toBe(DEMO_MATCH_ID);
    expect(live.score).toEqual({ home: 1, away: 0 });
    expect(ft.score).toEqual({ home: 2, away: 1 });
    expect(live.homeTeamId).toBe('spain');
    expect(live.awayTeamId).toBe('sweden');
    expect(ft.awayTeamId).toBe('sweden');
  });

  it('returns an upcoming-only multi-team feed (no live featured)', async () => {
    const feed = await getHomeFeed({ delayMs: 0 });
    expect(feed.featured.status).toBe('upcoming');
    expect(feed.favoriteTeamId).toBe('spain');
    const all = [feed.featured, ...feed.upcoming];
    expect(all.length).toBeGreaterThanOrEqual(2);
    expect(
      all.every((m) =>
        ['upcoming', 'pre-match', 'between-matches'].includes(m.status),
      ),
    ).toBe(true);
    const teamsInvolved = new Set(all.flatMap((m) => [m.homeTeamId, m.awayTeamId]));
    expect(teamsInvolved.size).toBeGreaterThan(2);
    const { home, away } = resolveTeams(feed.featured);
    expect(home.name).toBe('Spain');
    expect(away.name).toBe('England');
  });

  it('returns live matchday feed for today', async () => {
    const feed = await getMatchdayFeed({ delayMs: 0 });
    expect(feed.live.status).toBe('live');
    expect(feed.live.homeTeamId).toBe('spain');
    expect(feed.live.awayTeamId).toBe('sweden');
    expect(feed.today.length).toBeGreaterThan(0);
  });

  it('surfaces failures for error-state demos', async () => {
    setMatchRepoFail(true);
    await expect(getHomeFeed({ delayMs: 0 })).rejects.toThrow(/Unable to load/);
    setMatchRepoFail(false);
  });
});
