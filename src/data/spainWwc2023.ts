/** Dummy / public WWC 2023 Spain data for the My Team demo (no brand assets). */

export type FormResult = 'W' | 'D' | 'L';

export type Player = {
  number: number;
  name: string;
  shortName: string;
  initials: string;
  /** 0–100 vertical from own goal; 0–100 horizontal left→right */
  x: number;
  y: number;
};

export type KeyPlayer = {
  name: string;
  initials: string;
  role: string;
  team: 'Spain' | 'England';
  goals: number;
  assists: number;
  rating: number;
  note: string;
};

export const finalMatch = {
  title: 'Final lineup report',
  competition: 'Women’s World Cup 2023',
  round: 'Final',
  dateLabel: '20 Aug 2023',
  venue: 'Stadium Australia',
  home: 'Spain',
  away: 'England',
  scoreHome: 1,
  scoreAway: 0,
  scorer: "Carmona 29'",
  insightTitle: 'Match insight',
  insightBody:
    'Spain controlled the Final with high-energy combinations out wide. Olga Carmona’s well-worked finish on 29’ decided the tie; England created less after the break despite Earps’ heroics on Hermoso’s penalty.',
  insightNext:
    'La Roja finish as champions and leading scorers of the tournament (18 goals), completing a unique sweep of U-17, U-20 and senior world titles.',
};

/** Spain Final XI — 4-3-3 (demo positions on pitch). */
export const spainXi: Player[] = [
  { number: 23, name: 'Cata Coll', shortName: 'Coll', initials: 'CC', x: 50, y: 8 },
  { number: 2, name: 'Ona Batlle', shortName: 'Batlle', initials: 'OB', x: 82, y: 22 },
  { number: 4, name: 'Irene Paredes', shortName: 'Paredes', initials: 'IP', x: 62, y: 20 },
  { number: 5, name: 'Ivana Andrés', shortName: 'Andrés', initials: 'IA', x: 38, y: 20 },
  { number: 19, name: 'Olga Carmona', shortName: 'Carmona', initials: 'OC', x: 18, y: 22 },
  { number: 3, name: 'Teresa Abelleira', shortName: 'Abelleira', initials: 'TA', x: 50, y: 38 },
  { number: 6, name: 'Aitana Bonmatí', shortName: 'Bonmatí', initials: 'AB', x: 68, y: 48 },
  { number: 11, name: 'Alexia Putellas', shortName: 'Putellas', initials: 'AP', x: 32, y: 48 },
  { number: 8, name: 'Mariona Caldentey', shortName: 'Mariona', initials: 'MC', x: 82, y: 68 },
  { number: 9, name: 'Salma Paralluelo', shortName: 'Paralluelo', initials: 'SP', x: 50, y: 78 },
  { number: 10, name: 'Jenni Hermoso', shortName: 'Hermoso', initials: 'JH', x: 18, y: 68 },
];

/** England Final XI — 3-4-1-2 (demo positions). */
export const englandXi: Player[] = [
  { number: 1, name: 'Mary Earps', shortName: 'Earps', initials: 'ME', x: 50, y: 8 },
  { number: 6, name: 'Millie Bright', shortName: 'Bright', initials: 'MB', x: 50, y: 22 },
  { number: 5, name: 'Alex Greenwood', shortName: 'Greenwood', initials: 'AG', x: 28, y: 24 },
  { number: 16, name: 'Jess Carter', shortName: 'Carter', initials: 'JC', x: 72, y: 24 },
  { number: 2, name: 'Lucy Bronze', shortName: 'Bronze', initials: 'LB', x: 88, y: 42 },
  { number: 9, name: 'Rachel Daly', shortName: 'Daly', initials: 'RD', x: 12, y: 42 },
  { number: 4, name: 'Keira Walsh', shortName: 'Walsh', initials: 'KW', x: 42, y: 44 },
  { number: 10, name: 'Ella Toone', shortName: 'Toone', initials: 'ET', x: 58, y: 44 },
  { number: 8, name: 'Georgia Stanway', shortName: 'Stanway', initials: 'GS', x: 50, y: 58 },
  { number: 18, name: 'Chloe Kelly', shortName: 'Kelly', initials: 'CK', x: 68, y: 74 },
  { number: 23, name: 'Alessia Russo', shortName: 'Russo', initials: 'AR', x: 32, y: 74 },
];

export const spainPath: { opponent: string; score: string; result: FormResult }[] = [
  { opponent: 'Costa Rica', score: '3–0', result: 'W' },
  { opponent: 'Zambia', score: '5–0', result: 'W' },
  { opponent: 'Japan', score: '0–4', result: 'L' },
  { opponent: 'Switzerland', score: '5–1', result: 'W' },
  { opponent: 'Netherlands', score: '2–1', result: 'W' },
  { opponent: 'Sweden', score: '2–1', result: 'W' },
  { opponent: 'England', score: '1–0', result: 'W' },
];

export const englandPath: { opponent: string; score: string; result: FormResult }[] = [
  { opponent: 'Haiti', score: '1–0', result: 'W' },
  { opponent: 'Denmark', score: '1–0', result: 'W' },
  { opponent: 'China PR', score: '6–1', result: 'W' },
  { opponent: 'Nigeria', score: '0–0*', result: 'D' },
  { opponent: 'Colombia', score: '2–1', result: 'W' },
  { opponent: 'Australia', score: '3–1', result: 'W' },
  { opponent: 'Spain', score: '0–1', result: 'L' },
];

export const topScorers = [
  { name: 'Hermoso', value: 3 },
  { name: 'Bonmatí', value: 3 },
  { name: 'Paralluelo', value: 3 },
  { name: 'Redondo', value: 3 },
  { name: 'Carmona', value: 2 },
  { name: 'Others', value: 4 },
];

export const goalsByRound = [
  { name: 'Group', value: 8 },
  { name: 'R16', value: 5 },
  { name: 'QF', value: 2 },
  { name: 'SF', value: 2 },
  { name: 'Final', value: 1 },
];

/** Cumulative Spain goals through the knockout path (demo line). */
export const goalsProgress = {
  categories: ['Group', 'R16', 'QF', 'SF', 'Final'],
  values: [8, 13, 15, 17, 18],
};

export const finalStats = {
  possessionSpain: 59,
  possessionEngland: 41,
  passAccuracySpain: 87,
  passAccuracyEngland: 82,
};

export const keyPlayers: KeyPlayer[] = [
  {
    name: 'Olga Carmona',
    initials: 'OC',
    role: 'LB · Match winner',
    team: 'Spain',
    goals: 2,
    assists: 1,
    rating: 8.4,
    note: 'Final goal + SF winner',
  },
  {
    name: 'Mary Earps',
    initials: 'ME',
    role: 'GK · Standout',
    team: 'England',
    goals: 0,
    assists: 0,
    rating: 7.9,
    note: 'Penalty save in Final',
  },
];

export function pathRecord(path: { result: FormResult }[]) {
  const wins = path.filter((m) => m.result === 'W').length;
  const draws = path.filter((m) => m.result === 'D').length;
  const losses = path.filter((m) => m.result === 'L').length;
  return { wins, draws, losses, total: path.length };
}
