/**
 * Demo spine frozen mid–Women’s World Cup 2023:
 * live Matchday = Spain vs Sweden semi-final,
 * Upcoming = Final vs England,
 * Past = Spain’s earlier tournament path.
 */
import {
  espnLogo,
  foxLogo,
  fuboLogo,
  paramountLogo,
  peacockLogo,
} from '../../assets/streaming';
import type {
  ChatConversation,
  Competition,
  Match,
  Notification,
  Team,
  TeamProfile,
  User,
  ViewingProvider,
} from '../../types/domain';

/** Live Matchday journey hub — Spain vs Sweden SF. */
export const DEMO_MATCH_ID = 'match-semi-2023';
/** Featured upcoming — Final vs England. */
export const UPCOMING_MATCH_ID = 'match-int-final-2023';
/** Featured past deep-dive — Quarter-final vs Netherlands. */
export const PAST_MATCH_ID = 'wwc23-esp-ned';

export const teams: Record<string, Team> = {
  spain: {
    id: 'spain',
    name: 'Spain',
    shortName: 'ESP',
    crestKey: 'Spain',
  },
  england: {
    id: 'england',
    name: 'England',
    shortName: 'ENG',
    crestKey: 'England',
  },
  sweden: {
    id: 'sweden',
    name: 'Sweden',
    shortName: 'SWE',
    crestKey: 'Sweden',
  },
  netherlands: {
    id: 'netherlands',
    name: 'Netherlands',
    shortName: 'NED',
    crestKey: 'Netherlands',
  },
};

export const competitions: Record<string, Competition> = {
  intlFinal: {
    id: 'intl-final-2023',
    name: 'Women’s World Cup Final',
    shortName: 'Final',
  },
  intlSemi: {
    id: 'intl-semi-2023',
    name: 'Women’s World Cup Semi-final',
    shortName: 'Semi-final',
  },
  friendly: {
    id: 'intl-friendly',
    name: 'International Friendly',
    shortName: 'Friendly',
  },
  wwc2023: {
    id: 'wwc-2023',
    name: 'Women’s World Cup 2023',
    shortName: 'WWC 2023',
  },
};

/** Streaming options for profile / watch gate. */
export const viewingProviders: ViewingProvider[] = [
  { id: 'peacock', name: 'Peacock', available: true, linked: false, mark: 'P', logoSrc: peacockLogo },
  { id: 'paramount', name: 'Paramount+', available: true, linked: false, mark: '+', logoSrc: paramountLogo },
  { id: 'fubo', name: 'fuboTV', available: true, linked: false, mark: 'f', logoSrc: fuboLogo },
  { id: 'fox', name: 'Fox Sports', available: true, linked: false, mark: 'F', logoSrc: foxLogo },
  { id: 'espn', name: 'ESPN+', available: true, linked: false, mark: 'E', logoSrc: espnLogo },
];

export const spainXi = [
  { id: 'esp-23', number: 23, name: 'Cata Coll', shortName: 'Coll', initials: 'CC', teamId: 'spain', x: 50, y: 8 },
  { id: 'esp-2', number: 2, name: 'Ona Batlle', shortName: 'Batlle', initials: 'OB', teamId: 'spain', x: 82, y: 22 },
  { id: 'esp-4', number: 4, name: 'Irene Paredes', shortName: 'Paredes', initials: 'IP', teamId: 'spain', x: 62, y: 20 },
  { id: 'esp-5', number: 5, name: 'Ivana Andrés', shortName: 'Andrés', initials: 'IA', teamId: 'spain', x: 38, y: 20 },
  { id: 'esp-19', number: 19, name: 'Olga Carmona', shortName: 'Carmona', initials: 'OC', teamId: 'spain', x: 18, y: 22 },
  { id: 'esp-3', number: 3, name: 'Teresa Abelleira', shortName: 'Abelleira', initials: 'TA', teamId: 'spain', x: 50, y: 38 },
  { id: 'esp-6', number: 6, name: 'Aitana Bonmatí', shortName: 'Bonmatí', initials: 'AB', teamId: 'spain', x: 68, y: 48 },
  { id: 'esp-11', number: 11, name: 'Alexia Putellas', shortName: 'Putellas', initials: 'AP', teamId: 'spain', x: 32, y: 48 },
  { id: 'esp-8', number: 8, name: 'Mariona Caldentey', shortName: 'Mariona', initials: 'MC', teamId: 'spain', x: 82, y: 68 },
  { id: 'esp-9', number: 9, name: 'Salma Paralluelo', shortName: 'Paralluelo', initials: 'SP', teamId: 'spain', x: 50, y: 78 },
  { id: 'esp-10', number: 10, name: 'Jenni Hermoso', shortName: 'Hermoso', initials: 'JH', teamId: 'spain', x: 18, y: 68 },
];

export const englandXi = [
  { id: 'eng-1', number: 1, name: 'Mary Earps', shortName: 'Earps', initials: 'ME', teamId: 'england', x: 50, y: 8 },
  { id: 'eng-6', number: 6, name: 'Millie Bright', shortName: 'Bright', initials: 'MB', teamId: 'england', x: 50, y: 22 },
  { id: 'eng-5', number: 5, name: 'Alex Greenwood', shortName: 'Greenwood', initials: 'AG', teamId: 'england', x: 28, y: 24 },
  { id: 'eng-16', number: 16, name: 'Jess Carter', shortName: 'Carter', initials: 'JC', teamId: 'england', x: 72, y: 24 },
  { id: 'eng-2', number: 2, name: 'Lucy Bronze', shortName: 'Bronze', initials: 'LB', teamId: 'england', x: 88, y: 42 },
  { id: 'eng-9', number: 9, name: 'Rachel Daly', shortName: 'Daly', initials: 'RD', teamId: 'england', x: 12, y: 42 },
  { id: 'eng-4', number: 4, name: 'Keira Walsh', shortName: 'Walsh', initials: 'KW', teamId: 'england', x: 42, y: 44 },
  { id: 'eng-10', number: 10, name: 'Ella Toone', shortName: 'Toone', initials: 'ET', teamId: 'england', x: 58, y: 44 },
  { id: 'eng-8', number: 8, name: 'Georgia Stanway', shortName: 'Stanway', initials: 'GS', teamId: 'england', x: 50, y: 58 },
  { id: 'eng-18', number: 18, name: 'Chloe Kelly', shortName: 'Kelly', initials: 'CK', teamId: 'england', x: 68, y: 74 },
  { id: 'eng-23', number: 23, name: 'Alessia Russo', shortName: 'Russo', initials: 'AR', teamId: 'england', x: 32, y: 74 },
];

export const swedenXi = [
  { id: 'swe-1', number: 1, name: 'Zecira Musovic', shortName: 'Musovic', initials: 'ZM', teamId: 'sweden', x: 50, y: 8 },
  { id: 'swe-6', number: 6, name: 'Magdalena Eriksson', shortName: 'Eriksson', initials: 'ME', teamId: 'sweden', x: 35, y: 22 },
  { id: 'swe-13', number: 13, name: 'Amanda Ilestedt', shortName: 'Ilestedt', initials: 'AI', teamId: 'sweden', x: 65, y: 22 },
  { id: 'swe-2', number: 2, name: 'Jonna Andersson', shortName: 'Andersson', initials: 'JA', teamId: 'sweden', x: 15, y: 38 },
  { id: 'swe-14', number: 14, name: 'Nathalie Bjorn', shortName: 'Bjorn', initials: 'NB', teamId: 'sweden', x: 85, y: 38 },
  { id: 'swe-16', number: 16, name: 'Filippa Angeldal', shortName: 'Angeldal', initials: 'FA', teamId: 'sweden', x: 42, y: 48 },
  { id: 'swe-23', number: 23, name: 'Elin Rubensson', shortName: 'Rubensson', initials: 'ER', teamId: 'sweden', x: 58, y: 48 },
  { id: 'swe-9', number: 9, name: 'Kosovare Asllani', shortName: 'Asllani', initials: 'KA', teamId: 'sweden', x: 50, y: 60 },
  { id: 'swe-18', number: 18, name: 'Fridolina Rolfo', shortName: 'Rolfo', initials: 'FR', teamId: 'sweden', x: 22, y: 72 },
  { id: 'swe-11', number: 11, name: 'Stina Blackstenius', shortName: 'Blackstenius', initials: 'SB', teamId: 'sweden', x: 50, y: 78 },
  { id: 'swe-19', number: 19, name: 'Johanna Rytting Kaneryd', shortName: 'Kaneryd', initials: 'JK', teamId: 'sweden', x: 78, y: 72 },
];

/**
 * Primary demo match — Spain vs Sweden semi-final at Eden Park.
 * Status overridden by scenario for journey demos.
 * Live freeze: 81′ just after Paralluelo’s opener.
 */
export const demoMatchBase: Match = {
  id: DEMO_MATCH_ID,
  competitionId: 'wwc-2023',
  homeTeamId: 'spain',
  awayTeamId: 'sweden',
  kickoffIso: '2023-08-15T08:00:00Z',
  kickoffLabel: '15 Aug 2023 · 20:00',
  venue: 'Eden Park, Auckland',
  status: 'full-time',
  score: { home: 2, away: 1 },
  minute: 90,
  periodLabel: 'Full-time',
  scorersLabel: "Paralluelo 81' · Blomqvist 88' · Carmona 89'",
  viewingProviders,
  storylines: [
    {
      id: 'sl-sf-stakes',
      title: 'Why this match matters',
      summary:
        'Spain’s first senior World Cup semi-final — a place in the Final against the England–Australia winner.',
      deeper:
        'Spain’s wide overloads versus Sweden’s compact mid-block and set-piece threat define the tactical question.',
      source: 'ai-interpretation',
    },
    {
      id: 'sl-paralluelo',
      title: 'Key player storyline',
      summary:
        'Salma Paralluelo’s timing between the lines is Spain’s clearest separator against Sweden’s deep shape.',
      source: 'ai-interpretation',
    },
  ],
  events: [
    {
      id: 'ev-ko',
      matchId: DEMO_MATCH_ID,
      minute: 0,
      type: 'kick-off',
      label: 'Kick-off',
      description: 'The semi-final begins at Eden Park.',
    },
    {
      id: 'ev-goal-81',
      matchId: DEMO_MATCH_ID,
      minute: 81,
      type: 'goal',
      teamId: 'spain',
      playerName: 'Salma Paralluelo',
      label: 'Goal — Salma Paralluelo',
      description: 'Paralluelo finishes a sharp move to put Spain ahead late.',
    },
    {
      id: 'ev-goal-88',
      matchId: DEMO_MATCH_ID,
      minute: 88,
      type: 'goal',
      teamId: 'sweden',
      playerName: 'Rebecka Blomqvist',
      label: 'Goal — Rebecka Blomqvist',
      description: 'Sweden equalise with two minutes left.',
    },
    {
      id: 'ev-goal-89',
      matchId: DEMO_MATCH_ID,
      minute: 89,
      type: 'goal',
      teamId: 'spain',
      playerName: 'Olga Carmona',
      label: 'Goal — Olga Carmona',
      description: 'Carmona restores the lead almost immediately.',
    },
    {
      id: 'ev-ft',
      matchId: DEMO_MATCH_ID,
      minute: 90,
      type: 'full-time',
      label: 'Full-time',
      description: 'Spain win 2–1 and reach the Final.',
    },
  ],
  statistics: [
    { id: 'st-poss', label: 'Possession', homeValue: 54, awayValue: 46, unit: '%' },
    { id: 'st-shots', label: 'Attempts at goal', homeValue: 13, awayValue: 11, unit: 'count' },
    { id: 'st-pass', label: 'Pass accuracy', homeValue: 84, awayValue: 79, unit: '%' },
    { id: 'st-corners', label: 'Corners', homeValue: 5, awayValue: 4, unit: 'count' },
  ],
  lineups: [
    { teamId: 'spain', formation: '4-3-3', confirmed: true, players: spainXi },
    { teamId: 'sweden', formation: '4-2-3-1', confirmed: true, players: swedenXi },
  ],
  insights: [
    {
      id: 'ins-goal-81',
      matchId: DEMO_MATCH_ID,
      eventId: 'ev-goal-81',
      title: 'Why Paralluelo’s goal mattered',
      summary:
        'Spain’s opener rewarded sustained pressure and forced Sweden to chase with little time left.',
      interpretation: true,
      confidenceLabel: 'Based on match events and basic stats',
      evidenceIds: ['evd-replay-81', 'evd-stat-shots'],
      layers: {
        whatHappened:
          'Paralluelo arrived between Sweden’s centre-backs and finished after a recycled Spain attack.',
        whyItMattered:
          'It was the first goal of a tense semi-final and arrived late enough to stretch Sweden’s block.',
        howItChanged:
          'Sweden had to push numbers forward, which opened the left channel Carmona later punished.',
        whatToWatchNext:
          'Whether Sweden commit both full-backs and leave Spain’s far-side runners free.',
        deeperTactical:
          'Spain’s 4-3-3 overloaded the left half-space; Sweden’s mid-block was pulled open on the weak side after the restart.',
      },
    },
  ],
  definingMomentIds: ['ev-goal-81', 'ev-goal-89', 'ev-ft'],
  turningPointEventId: 'ev-goal-81',
  takeaway:
    'Spain absorbed Sweden’s physical midfield and struck twice in the final ten minutes.',
  nextMeaning: 'Spain reach the Final against England at Stadium Australia.',
};

export const evidenceById = {
  'evd-replay-81': {
    id: 'evd-replay-81',
    kind: 'replay' as const,
    label: 'Replay — Paralluelo 81′',
    available: false,
    note: 'Evidence unavailable in this prototype — placeholder only.',
  },
  'evd-stat-shots': {
    id: 'evd-stat-shots',
    kind: 'statistic' as const,
    label: 'Attempts at goal comparison',
    available: true,
    note: 'Spain 13 — Sweden 11',
  },
};

export const replayByEventId = {
  'ev-goal-81': {
    id: 'rep-81',
    eventId: 'ev-goal-81',
    title: 'Paralluelo goal — 81′',
    timestampLabel: "81'",
    available: false,
    posterNote: 'Video evidence is not available in this prototype.',
  },
};

/** Upcoming Final — Spain vs England at Stadium Australia. */
export const upcomingMatch: Match = {
  id: UPCOMING_MATCH_ID,
  competitionId: 'wwc-2023',
  homeTeamId: 'spain',
  awayTeamId: 'england',
  kickoffIso: '2023-08-20T10:00:00Z',
  kickoffLabel: 'Sun 20 Aug · 20:00',
  venue: 'Stadium Australia, Sydney',
  status: 'upcoming',
  periodLabel: 'Upcoming',
  viewingProviders,
  storylines: [
    {
      id: 'sl-final',
      title: 'First World Cup final',
      summary:
        'Spain’s first senior World Cup final against a side that reached consecutive major finals.',
      deeper:
        'Watch Carmona’s far-post arrivals and Spain’s left-side overloads versus England’s compact mid-block.',
      source: 'ai-interpretation',
    },
    {
      id: 'sl-final-key',
      title: 'Key player storyline',
      summary: 'Olga Carmona’s late runs from left-back remain Spain’s clearest separator in big knockout ties.',
      source: 'ai-interpretation',
    },
  ],
  events: [],
  statistics: [],
  lineups: [
    { teamId: 'spain', formation: '4-3-3', confirmed: false, players: spainXi },
    { teamId: 'england', formation: '3-4-1-2', confirmed: false, players: englandXi },
  ],
  insights: [],
};

/** Alias for older imports — QF content lives in wwc2023Past. */
export const pastMatch: Match = {
  id: PAST_MATCH_ID,
  competitionId: 'wwc-2023',
  homeTeamId: 'spain',
  awayTeamId: 'netherlands',
  kickoffIso: '2023-08-11T07:30:00Z',
  kickoffLabel: '11 Aug 2023',
  venue: 'Wellington Regional Stadium',
  status: 'post-match',
  score: { home: 2, away: 1 },
  scorersLabel: "Hermoso 81' · van de Donk 85' · Paralluelo 111'",
  periodLabel: 'Full-time (AET)',
  viewingProviders: [],
  storylines: [
    {
      id: 'sl-qf',
      title: 'Extra-time quality',
      summary: 'A cagey quarter-final decided by Spain’s depth after 90 minutes.',
      source: 'ai-interpretation',
    },
  ],
  events: [
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
    { id: 'st-s-poss', label: 'Possession', homeValue: 58, awayValue: 42, unit: '%' },
  ],
  lineups: [],
  insights: [],
  definingMomentIds: ['ev-ned-111'],
  takeaway: 'Spain’s bench depth decided a tight knockout tie.',
};

export type DemoScenario = 'upcoming-home' | 'pre-match' | 'live' | 'full-time';

/** Override demo match status for journey screens while keeping teams fixed. */
export function matchForScenario(scenario: DemoScenario): Match {
  switch (scenario) {
    case 'upcoming-home':
      return {
        ...demoMatchBase,
        status: 'pre-match',
        score: undefined,
        minute: undefined,
        periodLabel: 'Kick-off soon',
        scorersLabel: undefined,
        events: [],
      };
    case 'pre-match':
      return {
        ...demoMatchBase,
        status: 'pre-match',
        score: undefined,
        minute: undefined,
        periodLabel: 'Pre-match',
        scorersLabel: undefined,
        events: [],
      };
    case 'live':
      return {
        ...demoMatchBase,
        status: 'live',
        score: { home: 1, away: 0 },
        minute: 81,
        periodLabel: "81'",
        scorersLabel: "Paralluelo 81'",
        events: demoMatchBase.events.filter((e) => e.minute <= 81),
      };
    case 'full-time':
    default:
      return { ...demoMatchBase, status: 'full-time' };
  }
}

export const allMatches: Match[] = [demoMatchBase, upcomingMatch, pastMatch];

export const currentUser: User = {
  id: 'user-1',
  displayName: 'Alex Giovani',
  initials: 'AG',
  email: 'alex@example.com',
  preferences: {
    favoriteTeamId: 'spain',
    notificationsEnabled: true,
    preferredProviderIds: ['peacock', 'paramount'],
    nationality: 'Portugal',
    clubAffiliation: 'Real Madrid CF',
    skillLevel: 'pro',
    spoilersInPush: false,
    spoilersInApp: true,
    hapticsEnabled: true,
    autoplayReplays: true,
    analyticsEnabled: true,
  },
};

export const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'Spain vs Sweden — Goal! Paralluelo 81′',
    body: 'Salma Paralluelo finishes late. Spain lead the Women’s World Cup semi-final.',
    timeLabel: 'Now',
    read: false,
    matchId: DEMO_MATCH_ID,
    category: 'live',
    dayGroup: 'today',
    status: 'error',
    scoreLabel: 'ESP 1 - 0 SWE · 81′',
  },
  {
    id: 'n2',
    title: 'Kick-off reminder',
    body: 'Spain vs Sweden — semi-final is live at Eden Park. Catch up on the feed.',
    timeLabel: '12m ago',
    read: false,
    matchId: DEMO_MATCH_ID,
    category: 'my-teams',
    dayGroup: 'today',
    status: 'info',
  },
  {
    id: 'n3',
    title: 'Final locked in — 20 Aug',
    body: 'Stadium Australia hosts the Women’s World Cup Final on Sunday. Spain await the England–Australia winner.',
    timeLabel: '2h ago',
    read: true,
    matchId: UPCOMING_MATCH_ID,
    category: 'results',
    dayGroup: 'today',
    status: 'success',
    tag: 'WWC 2023 Final',
  },
  {
    id: 'n4',
    title: 'Spain lineup confirmed',
    body: 'Starting XI named for the semi-final — Bonmatí and Putellas both start.',
    timeLabel: 'Yesterday',
    read: false,
    matchId: DEMO_MATCH_ID,
    category: 'my-players',
    dayGroup: 'yesterday',
    status: 'warning',
  },
  {
    id: 'n5',
    title: 'Moment saved',
    body: 'Paralluelo 81′ added to your moments.',
    timeLabel: 'Yesterday',
    read: true,
    matchId: DEMO_MATCH_ID,
    category: 'my-teams',
    dayGroup: 'yesterday',
    status: 'neutral',
  },
];

export const spainTeamProfile: TeamProfile = {
  team: teams.spain,
  nextMatchId: UPCOMING_MATCH_ID,
  standingPlaceholder: 'Standing data unavailable in this prototype',
  recentForm: [
    { opponent: 'Netherlands', score: '2–1', result: 'W' },
    { opponent: 'Switzerland', score: '5–1', result: 'W' },
    { opponent: 'Japan', score: '0–4', result: 'L' },
  ],
  storyline: {
    id: 'tp-spain',
    title: 'Squad storyline',
    summary: 'Wide combinations and late runners from full-back remain Spain’s clearest edge in the knockout rounds.',
    source: 'ai-interpretation',
  },
  recentResults: [
    { opponent: 'Netherlands', score: '2–1', result: 'W' },
    { opponent: 'Switzerland', score: '5–1', result: 'W' },
    { opponent: 'Japan', score: '0–4', result: 'L' },
  ],
  savedMoments: [
    {
      id: 'sm-1',
      matchId: DEMO_MATCH_ID,
      eventId: 'ev-goal-81',
      title: 'Paralluelo opener',
      minuteLabel: "81'",
    },
  ],
};

const chatPopularRequests: ChatConversation['popularRequests'] = [
  {
    id: 'pr-record',
    prompt: 'Who holds the record for most Women’s World Cup goals?',
    category: 'Records & milestones.',
    icon: 'trophy',
  },
  {
    id: 'pr-offside',
    prompt: 'Explain the offside rule in simple terms',
    category: 'Rules explained clearly.',
    icon: 'help',
  },
  {
    id: 'pr-upsets',
    prompt: 'What are the biggest upsets in Women’s World Cup history?',
    category: 'Iconic underdog moments.',
    icon: 'upset',
  },
  {
    id: 'pr-compare',
    prompt: 'Compare Bonmatí and Putellas as midfield creators',
    category: 'Head-to-head comparisons.',
    icon: 'chart',
  },
  {
    id: 'pr-ballon',
    prompt: 'Which players have won the Ballon d’Or Féminin the most?',
    category: 'Awards & achievements.',
    icon: 'award',
  },
  {
    id: 'pr-433',
    prompt: 'Break down the 4-3-3 formation for me',
    category: 'Tactics & strategy.',
    icon: 'tactics',
  },
  {
    id: 'pr-press',
    prompt: 'Spain’s high press — why is Sweden struggling after 70′?',
    category: 'Match analysis.',
    icon: 'chart',
  },
];

const chatSuggestedPrompts = [
  'Why did Paralluelo’s goal matter?',
  'How did Spain’s formation work?',
  'What should I watch in the Final?',
  'Explain possession in plain language',
];

export const defaultChat: ChatConversation = {
  id: 'chat-active',
  matchId: DEMO_MATCH_ID,
  teamId: 'spain',
  title: 'New chat',
  updatedAtLabel: 'Just now',
  suggestedPrompts: chatSuggestedPrompts,
  popularRequests: chatPopularRequests,
  messages: [],
};

/** Seeded past chats for the history screen. */
export const seedChatHistory: ChatConversation[] = [
  {
    id: 'chat-hist-1',
    matchId: DEMO_MATCH_ID,
    teamId: 'spain',
    title: 'Paralluelo’s opener',
    preview: 'Why did Paralluelo’s goal matter?',
    updatedAtLabel: 'Today',
    suggestedPrompts: chatSuggestedPrompts,
    popularRequests: chatPopularRequests,
    messages: [
      {
        id: 'hist1-u',
        role: 'user',
        text: 'Why did Paralluelo’s goal matter?',
        createdAtLabel: '10:14',
      },
      {
        id: 'hist1-a',
        role: 'assistant',
        text: 'Paralluelo’s 81′ goal rewarded late pressure. It forced Sweden to chase, which opened space Spain could manage carefully.',
        createdAtLabel: '10:14',
        isInterpretation: true,
        linkedMatchId: DEMO_MATCH_ID,
      },
    ],
  },
  {
    id: 'chat-hist-2',
    matchId: DEMO_MATCH_ID,
    teamId: 'spain',
    title: 'Formation breakdown',
    preview: 'Break down the 4-3-3 formation for me',
    updatedAtLabel: 'Yesterday',
    suggestedPrompts: chatSuggestedPrompts,
    popularRequests: chatPopularRequests,
    messages: [
      {
        id: 'hist2-u',
        role: 'user',
        text: 'Break down the 4-3-3 formation for me',
        createdAtLabel: '18:02',
      },
      {
        id: 'hist2-a',
        role: 'assistant',
        text: 'Spain used a 4-3-3. In plain language: four defenders, three midfielders, three attackers — designed to overload the flanks.',
        createdAtLabel: '18:02',
        isInterpretation: true,
        linkedMatchId: DEMO_MATCH_ID,
      },
    ],
  },
  {
    id: 'chat-hist-3',
    teamId: 'spain',
    title: 'Offside explained',
    preview: 'Explain the offside rule in simple terms',
    updatedAtLabel: 'Mon',
    suggestedPrompts: chatSuggestedPrompts,
    popularRequests: chatPopularRequests,
    messages: [
      {
        id: 'hist3-u',
        role: 'user',
        text: 'Explain the offside rule in simple terms',
        createdAtLabel: '12:40',
      },
      {
        id: 'hist3-a',
        role: 'assistant',
        text: 'A player is offside if, when the ball is played, they are nearer the opponent’s goal line than both the ball and the second-last opponent — and then become involved in play. Level is onside.',
        createdAtLabel: '12:40',
        isInterpretation: true,
      },
    ],
  },
];

export const scriptedChatReplies: Record<string, string> = {
  default:
    'Spain are controlling territory against Sweden’s mid-block. The late opener from Paralluelo is the clearest swing so far.',
  carmona:
    'Carmona’s left-side deliveries and late runs are Spain’s clearest threat — the same pattern that decided the quarter-final path.',
  paralluelo:
    'Paralluelo’s 81′ goal rewarded late pressure. It forced Sweden to chase, which opened space Spain can manage carefully.',
  formation:
    'Spain used a 4-3-3. In plain language: four defenders, three midfielders, three attackers — designed to overload the flanks.',
  next: 'Next up is the Final at Stadium Australia on 20 Aug — Spain vs England if both semi-finals hold.',
  possession:
    'Possession is the share of time a team has the ball. Spain have edged Sweden so far — more of the ball, not automatically more chances.',
  offside:
    'A player is offside if, when the ball is played, they are nearer the opponent’s goal line than both the ball and the second-last opponent — and then become involved in play. Level is onside.',
  rivalry:
    'Spain vs Sweden in knockout football is often decided by set pieces and late runners — physical Nordic structure versus Spanish combinations.',
  press:
    'Analysis complete — Spain’s press stayed coordinated through the first hour, then Sweden’s shape changes forced longer recovery runs.',
  voice:
    'Spain’s left-side press after Paralluelo’s goal pinned Sweden deep. Three factors mattered most: fatigue in midfield coverage, Sweden shifting wider to escape, and a few mistimed pressing triggers that opened central lanes.',
};

export const demoChatAnalysis = {
  title: 'Analysis complete:',
  confidenceLabel: 'High confidence',
  kpis: [
    { label: 'Press success', value: '72%', hint: '↑ from 58%', tone: 'primary' as const },
    { label: 'Intensity', value: '5.4', hint: 'PPDA', tone: 'info' as const },
    { label: 'Recovery', value: '2.8s', hint: 'avg sprint', tone: 'success' as const },
  ],
  factors: [
    {
      label: 'Physical fatigue — midfield coverage gaps',
      value: 72,
      tone: 'primary' as const,
    },
    {
      label: 'Tactical shift — Sweden stretched wider',
      value: 58,
      tone: 'info' as const,
    },
    {
      label: 'Pressing triggers mistimed — 3 false starts',
      value: 44,
      tone: 'warning' as const,
    },
  ],
  intensity: {
    categories: ["45'", "55'", "65'", "75'"],
    values: [68, 82, 54, 41],
  },
  profile: {
    indicators: ['Pressing', 'Transition', 'Possession', 'Aerial', 'Set piece', 'Tracking'],
    values: [92, 78, 64, 42, 38, 55],
  },
};
