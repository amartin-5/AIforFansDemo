/** Domain types for AI for Fans — mock-friendly, API-replaceable. */

export type MatchStatus =
  | 'upcoming'
  | 'pre-match'
  | 'live'
  | 'half-time'
  | 'full-time'
  | 'post-match'
  | 'between-matches';

export type FormResult = 'W' | 'D' | 'L';

export type EventType =
  | 'goal'
  | 'card-yellow'
  | 'card-red'
  | 'substitution'
  | 'penalty'
  | 'var'
  | 'kick-off'
  | 'half-time'
  | 'full-time'
  | 'other';

export type CrestKey =
  | 'Spain'
  | 'England'
  | 'Sweden'
  | 'Netherlands'
  | 'Japan'
  | 'Australia'
  | 'Colombia'
  | 'Costa Rica'
  | 'Switzerland'
  | 'Zambia';

export type Team = {
  id: string;
  name: string;
  shortName: string;
  /** Key into TeamCrest asset map — prefer crest over letter fallback */
  crestKey?: CrestKey;
  /** Geometric fallback when no crest asset is available */
  crestColorToken?: string;
};

export type Player = {
  id: string;
  number: number;
  name: string;
  shortName: string;
  initials: string;
  teamId: string;
  /** Pitch map 0–100 */
  x: number;
  y: number;
};

export type Competition = {
  id: string;
  name: string;
  shortName: string;
};

export type Score = {
  home: number;
  away: number;
};

export type ViewingProvider = {
  id: string;
  name: string;
  available: boolean;
  /** Already linked on the fan profile — can unlock in-app watch without a new login. */
  linked?: boolean;
  /** Short mark when no logo asset is available. */
  mark?: string;
  /** Local logo asset URL (imported PNG). */
  logoSrc?: string;
};

export type Storyline = {
  id: string;
  title: string;
  summary: string;
  deeper?: string;
  source: 'fact' | 'ai-interpretation';
};

export type MatchEvent = {
  id: string;
  matchId: string;
  minute: number;
  addedTime?: number;
  type: EventType;
  teamId?: string;
  playerName?: string;
  label: string;
  description: string;
};

export type MatchStatistic = {
  id: string;
  label: string;
  homeValue: number;
  awayValue: number;
  unit?: '%' | 'count';
};

export type Lineup = {
  teamId: string;
  formation: string;
  confirmed: boolean;
  players: Player[];
};

export type Formation = {
  teamId: string;
  shape: string;
  players: Player[];
};

export type AIExplanationLayer = {
  whatHappened: string;
  whyItMattered: string;
  howItChanged: string;
  whatToWatchNext: string;
  deeperTactical?: string;
};

export type EvidenceItem = {
  id: string;
  kind: 'replay' | 'statistic' | 'diagram' | 'unavailable';
  label: string;
  available: boolean;
  note?: string;
};

export type Replay = {
  id: string;
  eventId: string;
  title: string;
  timestampLabel: string;
  available: boolean;
  posterNote?: string;
};

export type AIInsight = {
  id: string;
  matchId: string;
  eventId?: string;
  title: string;
  summary: string;
  layers: AIExplanationLayer;
  confidenceLabel?: string;
  evidenceIds: string[];
  interpretation: true;
};

export type Fixture = {
  id: string;
  competitionId: string;
  homeTeamId: string;
  awayTeamId: string;
  kickoffIso: string;
  kickoffLabel: string;
  venue?: string;
  status: MatchStatus;
  score?: Score;
};

export type Match = Fixture & {
  minute?: number;
  periodLabel?: string;
  scorersLabel?: string;
  storylines: Storyline[];
  events: MatchEvent[];
  statistics: MatchStatistic[];
  lineups: Lineup[];
  insights: AIInsight[];
  viewingProviders: ViewingProvider[];
  definingMomentIds?: string[];
  turningPointEventId?: string;
  takeaway?: string;
  nextMeaning?: string;
};

export type SkillLevel = 'beginner' | 'amateur' | 'semi-pro' | 'pro';

export type FanPreferences = {
  favoriteTeamId: string;
  notificationsEnabled: boolean;
  preferredProviderIds: string[];
  /** National team affinity from profile creation. */
  nationality?: string;
  /** Club affiliation from profile creation. */
  clubAffiliation?: string;
  skillLevel?: SkillLevel;
  /** Show scores & results in push alerts. */
  spoilersInPush?: boolean;
  /** Show goal scorers & match results in-app. */
  spoilersInApp?: boolean;
  /** Haptic feedback on key actions. */
  hapticsEnabled?: boolean;
  /** Autoplay short moment replays in feed. */
  autoplayReplays?: boolean;
  /** Anonymous product analytics. */
  analyticsEnabled?: boolean;
};

export type NotificationCategory =
  | 'all'
  | 'live'
  | 'transfers'
  | 'results'
  | 'my-teams'
  | 'my-players';

export type NotificationStatus = 'info' | 'success' | 'warning' | 'error' | 'neutral';

export type User = {
  id: string;
  displayName: string;
  initials: string;
  email?: string;
  preferences: FanPreferences;
};

export type ChatPopularRequest = {
  id: string;
  prompt: string;
  category: string;
  icon: 'trophy' | 'help' | 'chart' | 'tactics' | 'award' | 'upset';
};

export type ChatAnalysisKpi = {
  label: string;
  value: string;
  hint: string;
  tone: 'primary' | 'info' | 'success';
};

export type ChatAnalysisFactor = {
  label: string;
  value: number;
  tone: 'primary' | 'info' | 'warning';
};

export type ChatAnalysisPayload = {
  title: string;
  confidenceLabel: string;
  kpis: ChatAnalysisKpi[];
  factors: ChatAnalysisFactor[];
  intensity: { categories: string[]; values: number[] };
  profile: { indicators: string[]; values: number[] };
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  createdAtLabel: string;
  isInterpretation?: boolean;
  linkedEventId?: string;
  linkedMatchId?: string;
  /** Structured rich answer — Alexandria “complex chat” pattern */
  analysis?: ChatAnalysisPayload;
};

export type ChatConversation = {
  id: string;
  matchId?: string;
  teamId?: string;
  title: string;
  /** Short preview for history lists — usually the first user ask. */
  preview?: string;
  updatedAtLabel: string;
  messages: ChatMessage[];
  suggestedPrompts: string[];
  popularRequests: ChatPopularRequest[];
};

export type ChatHistoryItem = {
  id: string;
  title: string;
  preview: string;
  updatedAtLabel: string;
  messageCount: number;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  timeLabel: string;
  read: boolean;
  matchId?: string;
  category: Exclude<NotificationCategory, 'all'>;
  dayGroup: 'today' | 'yesterday';
  status?: NotificationStatus;
  /** Compact score strip, e.g. "ESP 1 - 0 ENG · 34'" */
  scoreLabel?: string;
  /** Secondary tag under the body, e.g. "Final · Matchday" */
  tag?: string;
};

export type SavedMoment = {
  id: string;
  matchId: string;
  eventId: string;
  title: string;
  minuteLabel: string;
};

export type FormEntry = {
  opponent: string;
  score: string;
  result: FormResult;
};

export type TeamProfile = {
  team: Team;
  nextMatchId?: string;
  recentForm: FormEntry[];
  standingPlaceholder?: string;
  storyline?: Storyline;
  recentResults: FormEntry[];
  savedMoments: SavedMoment[];
};
