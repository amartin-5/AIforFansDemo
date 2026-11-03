/**
 * Upcoming fixtures frozen mid–Women’s World Cup 2023:
 * Final (featured) + remaining knockout slate after Spain’s SF kick-off.
 */
import type { Match } from '../../types/domain';
import {
  englandXi,
  spainXi,
  UPCOMING_MATCH_ID,
  upcomingMatch,
  viewingProviders,
} from './demoSpine';
import { wwc2023Competition } from './wwc2023Past';

function upcoming(
  partial: Omit<
    Match,
    | 'status'
    | 'viewingProviders'
    | 'events'
    | 'statistics'
    | 'insights'
    | 'score'
    | 'minute'
    | 'scorersLabel'
    | 'lineups'
    | 'storylines'
  > &
    Partial<Pick<Match, 'viewingProviders' | 'lineups' | 'storylines'>>,
): Match {
  const spainInvolved =
    partial.homeTeamId === 'spain' || partial.awayTeamId === 'spain';
  const opponentId =
    partial.awayTeamId === 'spain' ? partial.homeTeamId : partial.awayTeamId;
  return {
    status: 'upcoming',
    viewingProviders,
    events: [],
    statistics: [],
    insights: [],
    storylines: [],
    lineups: spainInvolved
      ? [
          { teamId: 'spain', formation: '4-3-3', confirmed: false, players: spainXi },
          {
            teamId: opponentId,
            formation: '4-3-3',
            confirmed: false,
            players: [],
          },
        ]
      : [
          { teamId: partial.homeTeamId, formation: '4-3-3', confirmed: false, players: [] },
          { teamId: partial.awayTeamId, formation: '4-3-3', confirmed: false, players: [] },
        ],
    ...partial,
  };
}

/** Featured — Final · Spain vs England (20 Aug, Stadium Australia). */
export const upcomingFinalEngland: Match = {
  ...upcomingMatch,
  id: UPCOMING_MATCH_ID,
  competitionId: wwc2023Competition.id,
  homeTeamId: 'spain',
  awayTeamId: 'england',
  kickoffIso: '2023-08-20T10:00:00Z',
  kickoffLabel: 'Sun 20 Aug · 20:00',
  venue: 'Stadium Australia, Sydney',
  status: 'upcoming',
  periodLabel: 'Upcoming',
  lineups: [
    { teamId: 'spain', formation: '4-3-3', confirmed: false, players: spainXi },
    { teamId: 'england', formation: '3-4-1-2', confirmed: false, players: englandXi },
  ],
};

/** Other SF — England vs Australia (16 Aug). */
export const upcomingEngVsAus: Match = upcoming({
  id: 'wwc23-up-eng-aus',
  competitionId: wwc2023Competition.id,
  homeTeamId: 'england',
  awayTeamId: 'australia',
  kickoffIso: '2023-08-16T10:00:00Z',
  kickoffLabel: 'Wed 16 Aug · 20:00',
  venue: 'Stadium Australia, Sydney',
  periodLabel: 'Upcoming',
  storylines: [
    {
      id: 'sl-up-eng-aus',
      title: 'Other semi-final',
      summary:
        'England face co-hosts Australia for the second Final berth. Wide transitions and set pieces decide most of these ties.',
      source: 'ai-interpretation',
    },
  ],
  lineups: [
    { teamId: 'england', formation: '3-4-1-2', confirmed: false, players: englandXi },
    { teamId: 'australia', formation: '4-2-3-1', confirmed: false, players: [] },
  ],
});

/** Chronological upcoming slate (tournament freeze). */
export const wwc2023UpcomingMatches: Match[] = [
  upcomingEngVsAus,
  upcomingFinalEngland,
].sort((a, b) => a.kickoffIso.localeCompare(b.kickoffIso));

export const FEATURED_UPCOMING_ID = upcomingFinalEngland.id;
