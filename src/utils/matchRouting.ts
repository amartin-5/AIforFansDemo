import type { MatchStatus } from '../types/domain';

/** Map match status to the primary matchday surface. */
export function matchdayPathForStatus(
  matchId: string,
  status: MatchStatus,
): string {
  switch (status) {
    case 'live':
    case 'half-time':
      return `/matchday/${matchId}/live`;
    case 'full-time':
    case 'post-match':
      return `/matchday/${matchId}/recap`;
    case 'upcoming':
    case 'pre-match':
    case 'between-matches':
    default:
      return `/matchday/${matchId}/preview`;
  }
}
