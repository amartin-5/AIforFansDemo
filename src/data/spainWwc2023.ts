/** Public WWC 2023 Spain data for the My Team / preview demos (no brand assets). */

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
  team: 'Spain' | 'Sweden';
  goals: number;
  assists: number;
  rating: number;
  note: string;
};

/** Featured live match briefing — Spain vs Sweden SF. */
export const featuredMatch = {
  title: 'Semi-final lineup report',
  competition: 'Women’s World Cup 2023',
  round: 'Semi-final',
  dateLabel: '15 Aug 2023',
  venue: 'Eden Park, Auckland',
  home: 'Spain',
  away: 'Sweden',
  scoreHome: 1,
  scoreAway: 0,
  scorer: "Paralluelo 81'",
  insightTitle: 'Match insight',
  insightBody:
    'Spain are absorbing Sweden’s physical midfield and finding late runners between the lines. Salma Paralluelo’s 81′ finish forced Sweden to chase with little time left.',
  insightNext:
    'A win books Spain’s first senior World Cup Final — against the England–Australia winner at Stadium Australia on 20 Aug.',
};

/** @deprecated Prefer featuredMatch — kept for older imports. */
export const finalMatch = featuredMatch;

/** Spain SF XI — 4-3-3 (demo positions on pitch). */
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

/** Sweden SF XI — 4-2-3-1 (demo positions). */
export const swedenXi: Player[] = [
  { number: 1, name: 'Zecira Musovic', shortName: 'Musovic', initials: 'ZM', x: 50, y: 8 },
  { number: 6, name: 'Magdalena Eriksson', shortName: 'Eriksson', initials: 'ME', x: 35, y: 22 },
  { number: 13, name: 'Amanda Ilestedt', shortName: 'Ilestedt', initials: 'AI', x: 65, y: 22 },
  { number: 2, name: 'Jonna Andersson', shortName: 'Andersson', initials: 'JA', x: 15, y: 38 },
  { number: 14, name: 'Nathalie Bjorn', shortName: 'Bjorn', initials: 'NB', x: 85, y: 38 },
  { number: 16, name: 'Filippa Angeldal', shortName: 'Angeldal', initials: 'FA', x: 42, y: 48 },
  { number: 23, name: 'Elin Rubensson', shortName: 'Rubensson', initials: 'ER', x: 58, y: 48 },
  { number: 9, name: 'Kosovare Asllani', shortName: 'Asllani', initials: 'KA', x: 50, y: 60 },
  { number: 18, name: 'Fridolina Rolfo', shortName: 'Rolfo', initials: 'FR', x: 22, y: 72 },
  { number: 11, name: 'Stina Blackstenius', shortName: 'Blackstenius', initials: 'SB', x: 50, y: 78 },
  { number: 19, name: 'Johanna Rytting Kaneryd', shortName: 'Kaneryd', initials: 'JK', x: 78, y: 72 },
];

/** @deprecated Prefer swedenXi — England XI kept for Final upcoming surfaces. */
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

/** Spain path completed before the live SF. */
export const spainPath: { opponent: string; score: string; result: FormResult }[] = [
  { opponent: 'Costa Rica', score: '3–0', result: 'W' },
  { opponent: 'Zambia', score: '5–0', result: 'W' },
  { opponent: 'Japan', score: '0–4', result: 'L' },
  { opponent: 'Switzerland', score: '5–1', result: 'W' },
  { opponent: 'Netherlands', score: '2–1', result: 'W' },
];

export const swedenPath: { opponent: string; score: string; result: FormResult }[] = [
  { opponent: 'South Africa', score: '2–1', result: 'W' },
  { opponent: 'Italy', score: '5–0', result: 'W' },
  { opponent: 'Argentina', score: '2–0', result: 'W' },
  { opponent: 'United States', score: '0–0*', result: 'D' },
  { opponent: 'Japan', score: '2–1', result: 'W' },
];

/** @deprecated Prefer swedenPath. */
export const englandPath = swedenPath;

export const topScorers = [
  { name: 'Hermoso', value: 3 },
  { name: 'Bonmatí', value: 3 },
  { name: 'Paralluelo', value: 2 },
  { name: 'Redondo', value: 3 },
  { name: 'Carmona', value: 1 },
  { name: 'Others', value: 3 },
];

export const goalsByRound = [
  { name: 'Group', value: 8 },
  { name: 'R16', value: 5 },
  { name: 'QF', value: 2 },
  { name: 'SF', value: 1 },
];

/** Cumulative Spain goals through the knockout path (demo line, live SF freeze). */
export const goalsProgress = {
  categories: ['Group', 'R16', 'QF', 'SF'],
  values: [8, 13, 15, 16],
};

/** Live SF snapshot stats (Spain vs Sweden). */
export const finalStats = {
  possessionSpain: 54,
  possessionEngland: 46,
  possessionSweden: 46,
  passAccuracySpain: 84,
  passAccuracyEngland: 79,
  passAccuracySweden: 79,
};

export const keyPlayers: KeyPlayer[] = [
  {
    name: 'Salma Paralluelo',
    initials: 'SP',
    role: 'FW · Match swing',
    team: 'Spain',
    goals: 2,
    assists: 0,
    rating: 8.6,
    note: 'QF winner + SF opener',
  },
  {
    name: 'Kosovare Asllani',
    initials: 'KA',
    role: 'AM · Creator',
    team: 'Sweden',
    goals: 1,
    assists: 2,
    rating: 7.4,
    note: 'Links Sweden’s mid-block to the front',
  },
];

export function pathRecord(path: { result: FormResult }[]) {
  const wins = path.filter((m) => m.result === 'W').length;
  const draws = path.filter((m) => m.result === 'D').length;
  const losses = path.filter((m) => m.result === 'L').length;
  return { wins, draws, losses, total: path.length };
}
