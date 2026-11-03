import {
  analysisStreamImage,
  matchCover1,
  matchCover2,
  matchCover3,
  matchCover4,
} from '../../assets/past';
import { askReplayBg, consultBg, learnBg } from '../../assets/home';
import { DEMO_MATCH_ID, PAST_MATCH_ID } from '../../data/fixtures/demoSpine';

export type QuickLink = {
  id: string;
  label: string;
  icon: 'upcoming' | 'matchday' | 'past' | 'my-team';
  href: string;
};

export type FeatureTile = {
  id: string;
  title: string;
  body: string;
  icon: 'calendar' | 'radio' | 'sparkles' | 'replay' | 'chart' | 'shirt' | 'goal' | 'help' | 'formation';
  href: string;
};

export type LibraryCard = {
  id: string;
  matchId: string;
  title: string;
  meta: string;
  score: string;
  badge: string;
  image: string;
};

export type InsightCard = {
  id: string;
  badge: string;
  title: string;
  body: string;
  href: string;
};

export type PromptCard = {
  id: string;
  question: string;
  hint: string;
  icon: 'goal' | 'formation' | 'help' | 'chart';
};

export const QUICK_LINKS: QuickLink[] = [
  { id: 'upcoming', label: 'Upcoming', icon: 'upcoming', href: '/upcoming' },
  { id: 'matchday', label: 'Matchday', icon: 'matchday', href: '/matchday' },
  { id: 'past', label: 'Past', icon: 'past', href: '/past' },
  { id: 'my-team', label: 'My Team', icon: 'my-team', href: '/my-team' },
];

export const MATCHDAY_FEATURES: FeatureTile[] = [
  {
    id: 'preview',
    title: 'Pre-match briefing',
    body: 'Lineups, form, and why this semi-final matters.',
    icon: 'calendar',
    href: `/matchday/${DEMO_MATCH_ID}/preview`,
  },
  {
    id: 'live',
    title: 'Live match',
    body: 'Score, timeline, and in-game stats.',
    icon: 'radio',
    href: `/matchday/${DEMO_MATCH_ID}/live`,
  },
  {
    id: 'moment',
    title: 'Explain a moment',
    body: 'AI breakdown of Paralluelo’s opener.',
    icon: 'sparkles',
    href: `/matchday/${DEMO_MATCH_ID}/moment/ev-goal-81`,
  },
];

export const PAST_FEATURES: FeatureTile[] = [
  {
    id: 'library',
    title: 'WWC 2023 library',
    body: 'Spain’s path with AI match replay.',
    icon: 'replay',
    href: '/past',
  },
  {
    id: 'analysis',
    title: 'Match analysis',
    body: 'Stats, clips, and decision context.',
    icon: 'chart',
    href: `/past/${PAST_MATCH_ID}`,
  },
  {
    id: 'watch',
    title: 'Watch mode',
    body: 'Immersive recap viewing for past knockouts.',
    icon: 'radio',
    href: `/past/${PAST_MATCH_ID}/watch`,
  },
];

export const TEAM_FEATURES: FeatureTile[] = [
  {
    id: 'lineup',
    title: 'Pitch lineup',
    body: 'See your favorite team’s shape on the pitch.',
    icon: 'shirt',
    href: '/my-team',
  },
  {
    id: 'form',
    title: 'Form & scorers',
    body: 'Recent results and tournament scoring trends.',
    icon: 'chart',
    href: '/my-team',
  },
  {
    id: 'watch',
    title: 'Where to watch',
    body: 'Streaming options tied to your next fixture.',
    icon: 'radio',
    href: '/upcoming',
  },
];

export const PAST_LIBRARY: LibraryCard[] = [
  {
    id: 'qf',
    matchId: PAST_MATCH_ID,
    title: 'Spain vs Netherlands — Quarter-final',
    meta: 'WWC 2023 path',
    score: '2 – 1',
    badge: 'QF',
    image: matchCover1,
  },
  {
    id: 'r16',
    matchId: 'wwc23-esp-sui',
    title: 'Spain vs Switzerland — Round of 16',
    meta: 'WWC 2023 path',
    score: '5 – 1',
    badge: 'R16',
    image: matchCover2,
  },
  {
    id: 'group-jpn',
    matchId: 'wwc23-esp-jpn',
    title: 'Japan vs Spain — Group',
    meta: 'WWC 2023 path',
    score: '4 – 0',
    badge: 'GROUP',
    image: matchCover3,
  },
  {
    id: 'group-zam',
    matchId: 'wwc23-esp-zam',
    title: 'Spain vs Zambia — Group',
    meta: 'WWC 2023 path',
    score: '5 – 0',
    badge: 'GROUP',
    image: matchCover4,
  },
  {
    id: 'group-crc',
    matchId: 'wwc23-esp-crc',
    title: 'Spain vs Costa Rica — Group',
    meta: 'WWC 2023 path',
    score: '3 – 0',
    badge: 'GROUP',
    image: analysisStreamImage,
  },
];

export const AI_INSIGHTS: InsightCard[] = [
  {
    id: 'ins-goal',
    badge: 'MOMENT',
    title: 'Why Paralluelo’s goal mattered',
    body: 'Spain’s late opener rewarded pressure and forced Sweden to chase.',
    href: `/matchday/${DEMO_MATCH_ID}/moment/ev-goal-81`,
  },
  {
    id: 'ins-poss',
    badge: 'STATS',
    title: 'Possession in plain language',
    body: 'Spain edged Sweden on the ball — more control, not automatically more chances.',
    href: '/chat?q=Explain%20possession%20in%20plain%20language',
  },
  {
    id: 'ins-shape',
    badge: 'TACTICS',
    title: 'How Spain’s 4-3-3 worked',
    body: 'Four defenders, three midfielders, three attackers — built to overload the flanks.',
    href: '/chat?q=How%20did%20Spain%E2%80%99s%20formation%20work%3F',
  },
  {
    id: 'ins-press',
    badge: 'ANALYSIS',
    title: 'Spain’s high press after 70′',
    body: 'Coordinated pressure pinned Sweden deep once the opener landed.',
    href: `/chat?q=${encodeURIComponent("Spain's high press — why is Sweden struggling after 70′?")}`,
  },
];

export const CHAT_PROMPTS: PromptCard[] = [
  {
    id: 'p1',
    question: 'Why did Paralluelo’s goal matter?',
    hint: 'Match analysis.',
    icon: 'goal',
  },
  {
    id: 'p2',
    question: 'How did Spain’s formation work?',
    hint: 'Tactics & lineup.',
    icon: 'formation',
  },
  {
    id: 'p3',
    question: 'Explain possession in plain language',
    hint: 'Stats decoded.',
    icon: 'help',
  },
  {
    id: 'p4',
    question: "Spain's high press — why is Sweden struggling after 70′?",
    hint: 'Live-style breakdown.',
    icon: 'chart',
  },
];

export const JOURNEY_STEPS = [
  { id: 'preview', label: 'Preview', href: `/matchday/${DEMO_MATCH_ID}/preview` },
  { id: 'live', label: 'Live', href: `/matchday/${DEMO_MATCH_ID}/live` },
  { id: 'moment', label: 'Moment', href: `/matchday/${DEMO_MATCH_ID}/moment/ev-goal-81` },
  { id: 'recap', label: 'Recap', href: `/matchday/${DEMO_MATCH_ID}/recap` },
] as const;

export const FEATURE_HEROES = {
  matchday: {
    eyebrow: 'Matchday',
    title: 'Ask.\nReplay.\nUnderstand.',
    body: 'Follow Spain vs Sweden from pre-match briefing through live stats, moment explain, and full-time recap.',
    cta: 'Open Matchday',
    href: '/matchday',
    searchPlaceholder: 'Why did Paralluelo’s goal matter?',
    image: askReplayBg,
  },
  myTeam: {
    eyebrow: 'My Team',
    title: 'Your Spain\nintel hub',
    body: 'Lineup, form, scorers, and where to watch — built around your favorite team.',
    cta: 'Open My Team',
    href: '/my-team',
    image: learnBg,
  },
  chat: {
    eyebrow: 'AI Chat',
    title: 'Ask about\nthis match',
    body: 'Get plain-language answers on Spain vs Sweden tactics, moments, and stats.',
    cta: 'Start chat',
    href: '/chat',
    image: consultBg,
  },
} as const;

export type FeedModuleId =
  | 'matchday'
  | 'past-library'
  | 'my-team'
  | 'journey'
  | 'insights'
  | 'chat'
  | 'kickoff';

export const FEED_CYCLE: FeedModuleId[] = [
  'matchday',
  'past-library',
  'my-team',
  'journey',
  'insights',
  'chat',
  'kickoff',
];

export type FeedItem = {
  key: string;
  module: FeedModuleId;
  cycle: number;
};
