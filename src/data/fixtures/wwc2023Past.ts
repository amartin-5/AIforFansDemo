/**
 * Women’s World Cup 2023 — Spain path for the Past / AI Replay demo.
 * Frozen before the semi-final: group → R16 → QF only.
 */
import {
  analysisStreamImage,
  matchCover1,
  matchCover2,
  matchCover3,
  matchCover4,
  watchPitchImage,
} from '../../assets/past';
import type { Competition, Match, Team } from '../../types/domain';
import {
  PAST_MATCH_ID,
  pastMatch,
  spainXi,
  viewingProviders,
} from './demoSpine';

export const WWC_2023_YEAR = 2023;

export const wwc2023Competition: Competition = {
  id: 'wwc-2023',
  name: 'Women’s World Cup 2023',
  shortName: 'WWC 2023',
};

export const wwcOpponentTeams: Record<string, Team> = {
  'costa-rica': {
    id: 'costa-rica',
    name: 'Costa Rica',
    shortName: 'CRC',
    crestKey: 'Costa Rica',
  },
  zambia: {
    id: 'zambia',
    name: 'Zambia',
    shortName: 'ZAM',
    crestKey: 'Zambia',
  },
  japan: {
    id: 'japan',
    name: 'Japan',
    shortName: 'JPN',
    crestKey: 'Japan',
  },
  switzerland: {
    id: 'switzerland',
    name: 'Switzerland',
    shortName: 'SUI',
    crestKey: 'Switzerland',
  },
  australia: {
    id: 'australia',
    name: 'Australia',
    shortName: 'AUS',
    crestKey: 'Australia',
  },
  colombia: {
    id: 'colombia',
    name: 'Colombia',
    shortName: 'COL',
    crestKey: 'Colombia',
  },
};

export type PastMatchLibraryMeta = {
  matchId: string;
  stage: string;
  year: number;
  coverImage: string;
  streamImage: string;
  formHome: Array<'W' | 'D' | 'L'>;
  formAway: Array<'W' | 'D' | 'L'>;
  h2h?: { homeWins: number; draws: number; awayWins: number };
};

function lightMatch(
  partial: Omit<
    Match,
    'viewingProviders' | 'storylines' | 'events' | 'statistics' | 'lineups' | 'insights'
  > &
    Partial<
      Pick<
        Match,
        'viewingProviders' | 'storylines' | 'events' | 'statistics' | 'lineups' | 'insights'
      >
    >,
): Match {
  return {
    viewingProviders: [],
    storylines: [],
    events: [],
    statistics: [],
    lineups: [],
    insights: [],
    ...partial,
  };
}

/** Group · Costa Rica */
export const wwcGroupCostaRica: Match = lightMatch({
  id: 'wwc23-esp-crc',
  competitionId: wwc2023Competition.id,
  homeTeamId: 'spain',
  awayTeamId: 'costa-rica',
  kickoffIso: '2023-07-21T07:30:00Z',
  kickoffLabel: '21 Jul 2023',
  venue: 'Wellington Regional Stadium',
  status: 'full-time',
  score: { home: 3, away: 0 },
  periodLabel: 'Full-time',
  scorersLabel: "Bonmatí 21', González 23', Redondo 81'",
  storylines: [
    {
      id: 'sl-crc',
      title: 'Tournament opener',
      summary: 'Spain opened with control and clinical finishing in Wellington.',
      source: 'ai-interpretation',
    },
  ],
  events: [
    {
      id: 'ev-crc-21',
      matchId: 'wwc23-esp-crc',
      minute: 21,
      type: 'goal',
      teamId: 'spain',
      playerName: 'Aitana Bonmatí',
      label: 'Goal — Bonmatí',
      description: 'Spain’s midfield press turns into the opener.',
    },
    {
      id: 'ev-crc-23',
      matchId: 'wwc23-esp-crc',
      minute: 23,
      type: 'goal',
      teamId: 'spain',
      playerName: 'Esther González',
      label: 'Goal — González',
      description: 'Quick second goal after a transition.',
    },
    {
      id: 'ev-crc-81',
      matchId: 'wwc23-esp-crc',
      minute: 81,
      type: 'goal',
      teamId: 'spain',
      playerName: 'Alba Redondo',
      label: 'Goal — Redondo',
      description: 'Late finish seals a 3–0 start.',
    },
  ],
  statistics: [
    { id: 'st-crc-poss', label: 'Possession', homeValue: 72, awayValue: 28, unit: '%' },
    { id: 'st-crc-shots', label: 'Shots', homeValue: 18, awayValue: 3, unit: 'count' },
    { id: 'st-crc-sot', label: 'Shots on target', homeValue: 9, awayValue: 0, unit: 'count' },
    { id: 'st-crc-pass', label: 'Pass accuracy', homeValue: 89, awayValue: 71, unit: '%' },
  ],
  definingMomentIds: ['ev-crc-21'],
  takeaway: 'Spain’s press and combinations set the tone for the group.',
  nextMeaning: 'A statement win before tougher group tests.',
});

/** Group · Zambia */
export const wwcGroupZambia: Match = lightMatch({
  id: 'wwc23-esp-zam',
  competitionId: wwc2023Competition.id,
  homeTeamId: 'spain',
  awayTeamId: 'zambia',
  kickoffIso: '2023-07-26T07:30:00Z',
  kickoffLabel: '26 Jul 2023',
  venue: 'Eden Park',
  status: 'full-time',
  score: { home: 5, away: 0 },
  periodLabel: 'Full-time',
  scorersLabel: "Abelleira 9', Hermoso p. 13', Redondo 42', García 69', 75'",
  storylines: [
    {
      id: 'sl-zam',
      title: 'Attacking depth',
      summary: 'Spain’s forwards rotated freely; five different phases produced goals.',
      source: 'ai-interpretation',
    },
  ],
  events: [
    {
      id: 'ev-zam-9',
      matchId: 'wwc23-esp-zam',
      minute: 9,
      type: 'goal',
      teamId: 'spain',
      playerName: 'Teresa Abelleira',
      label: 'Goal — Abelleira',
      description: 'Early strike from distance.',
    },
    {
      id: 'ev-zam-13',
      matchId: 'wwc23-esp-zam',
      minute: 13,
      type: 'goal',
      teamId: 'spain',
      playerName: 'Jenni Hermoso',
      label: 'Penalty — Hermoso',
      description: 'Hermoso converts from the spot.',
    },
  ],
  statistics: [
    { id: 'st-zam-poss', label: 'Possession', homeValue: 68, awayValue: 32, unit: '%' },
    { id: 'st-zam-shots', label: 'Shots', homeValue: 22, awayValue: 4, unit: 'count' },
    { id: 'st-zam-sot', label: 'Shots on target', homeValue: 12, awayValue: 1, unit: 'count' },
    { id: 'st-zam-pass', label: 'Pass accuracy', homeValue: 88, awayValue: 74, unit: '%' },
  ],
  definingMomentIds: ['ev-zam-9'],
  takeaway: 'Spain’s attacking rotation overwhelmed Zambia’s block.',
});

/** Group · Japan (loss) */
export const wwcGroupJapan: Match = lightMatch({
  id: 'wwc23-esp-jpn',
  competitionId: wwc2023Competition.id,
  homeTeamId: 'japan',
  awayTeamId: 'spain',
  kickoffIso: '2023-07-31T07:00:00Z',
  kickoffLabel: '31 Jul 2023',
  venue: 'Wellington Regional Stadium',
  status: 'full-time',
  score: { home: 4, away: 0 },
  periodLabel: 'Full-time',
  scorersLabel: "Miyazawa 12', 29', Ueki 27', Tanaka 82'",
  storylines: [
    {
      id: 'sl-jpn',
      title: 'Group wake-up call',
      summary: 'Japan’s transitions exposed Spain after rotation; the loss reshaped knockout urgency.',
      source: 'ai-interpretation',
    },
  ],
  events: [
    {
      id: 'ev-jpn-12',
      matchId: 'wwc23-esp-jpn',
      minute: 12,
      type: 'goal',
      teamId: 'japan',
      playerName: 'Hinata Miyazawa',
      label: 'Goal — Miyazawa',
      description: 'Japan punish a turnover in midfield.',
    },
  ],
  statistics: [
    { id: 'st-jpn-poss', label: 'Possession', homeValue: 44, awayValue: 56, unit: '%' },
    { id: 'st-jpn-shots', label: 'Shots', homeValue: 11, awayValue: 9, unit: 'count' },
    { id: 'st-jpn-sot', label: 'Shots on target', homeValue: 7, awayValue: 2, unit: 'count' },
    { id: 'st-jpn-pass', label: 'Pass accuracy', homeValue: 83, awayValue: 86, unit: '%' },
  ],
  definingMomentIds: ['ev-jpn-12'],
  takeaway: 'Possession without intensity left Spain open to Japan’s counters.',
});

/** R16 · Switzerland */
export const wwcR16Switzerland: Match = lightMatch({
  id: 'wwc23-esp-sui',
  competitionId: wwc2023Competition.id,
  homeTeamId: 'spain',
  awayTeamId: 'switzerland',
  kickoffIso: '2023-08-05T08:30:00Z',
  kickoffLabel: '5 Aug 2023',
  venue: 'Eden Park',
  status: 'full-time',
  score: { home: 5, away: 1 },
  periodLabel: 'Full-time',
  scorersLabel: "Bonmatí 5', Redondo 17', 76' · Codina 45' · Hermoso 56' · Aigbogun 11' og",
  storylines: [
    {
      id: 'sl-sui',
      title: 'Knockout response',
      summary: 'Spain answered the Japan loss with relentless wide combinations.',
      source: 'ai-interpretation',
    },
  ],
  events: [
    {
      id: 'ev-sui-5',
      matchId: 'wwc23-esp-sui',
      minute: 5,
      type: 'goal',
      teamId: 'spain',
      playerName: 'Aitana Bonmatí',
      label: 'Goal — Bonmatí',
      description: 'Early control goal.',
    },
  ],
  statistics: [
    { id: 'st-sui-poss', label: 'Possession', homeValue: 66, awayValue: 34, unit: '%' },
    { id: 'st-sui-shots', label: 'Shots', homeValue: 19, awayValue: 6, unit: 'count' },
    { id: 'st-sui-sot', label: 'Shots on target', homeValue: 10, awayValue: 2, unit: 'count' },
    { id: 'st-sui-pass', label: 'Pass accuracy', homeValue: 90, awayValue: 76, unit: '%' },
  ],
  definingMomentIds: ['ev-sui-5'],
  takeaway: 'Spain’s intensity returned when the knockout rounds began.',
});

/** QF · Netherlands — featured past deep-dive (PAST_MATCH_ID) */
export const wwcQfNetherlands: Match = {
  ...pastMatch,
  id: PAST_MATCH_ID,
  competitionId: wwc2023Competition.id,
  homeTeamId: 'spain',
  awayTeamId: 'netherlands',
  kickoffIso: '2023-08-11T07:30:00Z',
  kickoffLabel: '11 Aug 2023',
  venue: 'Wellington Regional Stadium',
  status: 'full-time',
  score: { home: 2, away: 1 },
  periodLabel: 'Full-time (AET)',
  scorersLabel: "Hermoso 81' · van de Donk 85' · Paralluelo 111'",
  storylines: [
    {
      id: 'sl-ned',
      title: 'Extra-time quality',
      summary: 'A cagey quarter-final decided by Spain’s depth after 90 minutes.',
      source: 'ai-interpretation',
    },
  ],
  events: [
    {
      id: 'ev-ned-81',
      matchId: PAST_MATCH_ID,
      minute: 81,
      type: 'goal',
      teamId: 'spain',
      playerName: 'Jenni Hermoso',
      label: 'Goal — Hermoso',
      description: 'Spain finally break the deadlock late.',
    },
    {
      id: 'ev-ned-85',
      matchId: PAST_MATCH_ID,
      minute: 85,
      type: 'goal',
      teamId: 'netherlands',
      playerName: 'Daniëlle van de Donk',
      label: 'Goal — van de Donk',
      description: 'Netherlands equalise to force extra time.',
    },
    {
      id: 'ev-ned-111',
      matchId: PAST_MATCH_ID,
      minute: 111,
      type: 'goal',
      teamId: 'spain',
      playerName: 'Salma Paralluelo',
      label: 'Goal — Paralluelo',
      description: 'Extra-time winner from the substitute.',
    },
  ],
  statistics: [
    { id: 'st-ned-poss', label: 'Possession', homeValue: 58, awayValue: 42, unit: '%' },
    { id: 'st-ned-shots', label: 'Shots', homeValue: 14, awayValue: 10, unit: 'count' },
    { id: 'st-ned-sot', label: 'Shots on target', homeValue: 6, awayValue: 4, unit: 'count' },
    { id: 'st-ned-pass', label: 'Pass accuracy', homeValue: 85, awayValue: 80, unit: '%' },
  ],
  lineups: [
    { teamId: 'spain', formation: '4-3-3', confirmed: true, players: spainXi },
    { teamId: 'netherlands', formation: '4-3-3', confirmed: true, players: [] },
  ],
  insights: [
    {
      id: 'ins-ned-111',
      matchId: PAST_MATCH_ID,
      eventId: 'ev-ned-111',
      title: 'Paralluelo decides it',
      summary: 'Fresh legs and a direct run beat a tired Dutch back line in extra time.',
      interpretation: true,
      confidenceLabel: 'Based on match events',
      evidenceIds: [],
      layers: {
        whatHappened: 'Paralluelo finished a break after Netherlands pushed for a second equaliser.',
        whyItMattered: 'It put Spain into the semi-finals of a senior World Cup for the first time.',
        howItChanged: 'Netherlands had to chase again; Spain managed the clock.',
        whatToWatchNext: 'Whether Spain keep rotating attackers to protect midfield energy versus Sweden.',
      },
    },
  ],
  definingMomentIds: ['ev-ned-111', 'ev-ned-81'],
  turningPointEventId: 'ev-ned-111',
  takeaway: 'Spain’s bench depth decided a tight knockout tie.',
  nextMeaning: 'A first World Cup semi-final against Sweden.',
  viewingProviders,
};

/**
 * Chronological Spain WWC 2023 path through the quarter-final
 * (library order: newest first). SF + Final are live / upcoming.
 */
export const wwc2023PastMatches: Match[] = [
  wwcQfNetherlands,
  wwcR16Switzerland,
  wwcGroupJapan,
  wwcGroupZambia,
  wwcGroupCostaRica,
];

const covers = [matchCover1, matchCover2, matchCover3, matchCover4];

export const pastLibraryMeta: PastMatchLibraryMeta[] = [
  {
    matchId: PAST_MATCH_ID,
    stage: 'Quarter-final',
    year: WWC_2023_YEAR,
    coverImage: covers[0],
    streamImage: watchPitchImage,
    formHome: ['W', 'L', 'W', 'W', 'W'],
    formAway: ['W', 'W', 'D', 'W', 'W'],
    h2h: { homeWins: 1, draws: 0, awayWins: 1 },
  },
  {
    matchId: 'wwc23-esp-sui',
    stage: 'Round of 16',
    year: WWC_2023_YEAR,
    coverImage: covers[1],
    streamImage: analysisStreamImage,
    formHome: ['W', 'W', 'L', 'W', 'W'],
    formAway: ['W', 'D', 'W', 'W', 'L'],
  },
  {
    matchId: 'wwc23-esp-jpn',
    stage: 'Group stage',
    year: WWC_2023_YEAR,
    coverImage: covers[2],
    streamImage: watchPitchImage,
    formHome: ['W', 'W', 'W', 'W', 'W'],
    formAway: ['W', 'W', 'W', 'W', 'W'],
  },
  {
    matchId: 'wwc23-esp-zam',
    stage: 'Group stage',
    year: WWC_2023_YEAR,
    coverImage: covers[3],
    streamImage: analysisStreamImage,
    formHome: ['W', 'W', 'W', 'W', 'W'],
    formAway: ['L', 'L', 'D', 'L', 'W'],
  },
  {
    matchId: 'wwc23-esp-crc',
    stage: 'Group stage',
    year: WWC_2023_YEAR,
    coverImage: covers[0],
    streamImage: watchPitchImage,
    formHome: ['W', 'W', 'W', 'W', 'W'],
    formAway: ['L', 'D', 'L', 'L', 'L'],
  },
];

export function getPastLibraryMeta(matchId: string): PastMatchLibraryMeta | undefined {
  return pastLibraryMeta.find((m) => m.matchId === matchId);
}
