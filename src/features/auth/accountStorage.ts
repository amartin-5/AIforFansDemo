import type { User } from '../../types/domain';

const SESSION_KEY = 'aiforfans-account-session';
const PROFILE_KEY = 'aiforfans-account-profile';

export type AccountSession = {
  email: string;
  /** Signed in but may still need profile creation. */
  authenticated: boolean;
  /** Profile form completed — main app unlocked. */
  onboarded: boolean;
};

export function readSession(): AccountSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AccountSession;
    if (!parsed?.email || typeof parsed.authenticated !== 'boolean') return null;
    return {
      email: parsed.email,
      authenticated: parsed.authenticated,
      onboarded: Boolean(parsed.onboarded),
    };
  } catch {
    return null;
  }
}

export function writeSession(session: AccountSession | null) {
  try {
    if (!session) {
      window.localStorage.removeItem(SESSION_KEY);
      return;
    }
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore quota / private mode */
  }
}

/** Normalize legacy flat profiles into the current User shape. */
function normalizeProfile(raw: unknown): User | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  if (typeof data.displayName !== 'string' || typeof data.id !== 'string') return null;

  const prefs =
    data.preferences && typeof data.preferences === 'object'
      ? (data.preferences as User['preferences'])
      : {
          favoriteTeamId:
            typeof data.favoriteTeamId === 'string' ? data.favoriteTeamId : 'spain',
          notificationsEnabled: true,
          preferredProviderIds: [],
          nationality: typeof data.nationality === 'string' ? data.nationality : undefined,
          clubAffiliation:
            typeof data.clubAffiliation === 'string' ? data.clubAffiliation : undefined,
          skillLevel: undefined,
        };

  const displayName = data.displayName;
  const initials =
    typeof data.initials === 'string' && data.initials
      ? data.initials
      : initialsFromName(displayName);

  return {
    id: data.id,
    displayName,
    initials,
    email: typeof data.email === 'string' ? data.email : undefined,
    preferences: {
      favoriteTeamId: prefs.favoriteTeamId || 'spain',
      notificationsEnabled: prefs.notificationsEnabled ?? true,
      preferredProviderIds: Array.isArray(prefs.preferredProviderIds)
        ? prefs.preferredProviderIds.filter((id): id is string => typeof id === 'string')
        : [],
      nationality: prefs.nationality,
      clubAffiliation: prefs.clubAffiliation,
      skillLevel: prefs.skillLevel,
    },
  };
}

export function readProfile(): User | null {
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return normalizeProfile(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeProfile(user: User | null) {
  try {
    if (!user) {
      window.localStorage.removeItem(PROFILE_KEY);
      return;
    }
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}
