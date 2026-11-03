import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { SkillLevel, User } from '../../types/domain';
import { track } from '../../services/analytics';
import {
  initialsFromName,
  readProfile,
  readSession,
  writeProfile,
  writeSession,
  type AccountSession,
} from './accountStorage';

export type ProfileDraft = {
  displayName: string;
  nationality: string;
  clubAffiliation: string;
  favoriteTeamId: string;
  skillLevel: SkillLevel;
  preferredProviderIds: string[];
};

type AccountContextValue = {
  session: AccountSession | null;
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  continueFromWelcome: () => void;
  signIn: (email: string, _password: string) => { onboarded: boolean };
  startSignUp: (email: string) => void;
  completeProfile: (draft: ProfileDraft) => User;
  updateUser: (next: User) => void;
  signOut: () => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

function buildUser(
  email: string,
  draft: ProfileDraft,
  existing?: User | null,
): User {
  const prev = existing?.preferences;
  return {
    id: existing?.id ?? `user-${Date.now()}`,
    displayName: draft.displayName.trim() || 'Fan',
    initials: initialsFromName(draft.displayName.trim() || 'Fan'),
    email,
    preferences: {
      favoriteTeamId: draft.favoriteTeamId,
      notificationsEnabled: prev?.notificationsEnabled ?? true,
      preferredProviderIds: draft.preferredProviderIds,
      nationality: draft.nationality,
      clubAffiliation: draft.clubAffiliation,
      skillLevel: draft.skillLevel,
      spoilersInPush: prev?.spoilersInPush ?? false,
      spoilersInApp: prev?.spoilersInApp ?? true,
      hapticsEnabled: prev?.hapticsEnabled ?? true,
      autoplayReplays: prev?.autoplayReplays ?? true,
      analyticsEnabled: prev?.analyticsEnabled ?? true,
    },
  };
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AccountSession | null>(() => readSession());
  const [user, setUser] = useState<User | null>(() => readProfile());

  const continueFromWelcome = useCallback(() => {
    track('auth_welcome_continued');
  }, []);

  const signIn = useCallback((email: string, _password: string) => {
    const next: AccountSession = {
      email: email.trim(),
      authenticated: true,
      onboarded: false,
    };
    const existing = readProfile();
    if (existing) {
      next.onboarded = true;
      setUser(existing);
    }
    writeSession(next);
    setSession(next);
    track('auth_sign_in');
    return { onboarded: next.onboarded };
  }, []);

  const startSignUp = useCallback((email: string) => {
    const next: AccountSession = {
      email: email.trim() || 'fan@example.com',
      authenticated: true,
      onboarded: false,
    };
    writeSession(next);
    setSession(next);
    track('auth_sign_up');
  }, []);

  const completeProfile = useCallback(
    (draft: ProfileDraft) => {
      const email = session?.email ?? user?.email ?? 'fan@example.com';
      const nextUser = buildUser(email, draft, user);
      const nextSession: AccountSession = {
        email,
        authenticated: true,
        onboarded: true,
      };
      writeProfile(nextUser);
      writeSession(nextSession);
      setUser(nextUser);
      setSession(nextSession);
      track('auth_profile_completed', {
        skillLevel: draft.skillLevel,
        providers: draft.preferredProviderIds.length,
      });
      return nextUser;
    },
    [session?.email, user],
  );

  const updateUser = useCallback((next: User) => {
    writeProfile(next);
    setUser(next);
  }, []);

  const signOut = useCallback(() => {
    writeSession(null);
    writeProfile(null);
    setSession(null);
    setUser(null);
    track('auth_sign_out');
  }, []);

  const value = useMemo<AccountContextValue>(
    () => ({
      session,
      user,
      isAuthenticated: Boolean(session?.authenticated),
      isOnboarded: Boolean(session?.authenticated && session?.onboarded),
      continueFromWelcome,
      signIn,
      startSignUp,
      completeProfile,
      updateUser,
      signOut,
    }),
    [
      session,
      user,
      continueFromWelcome,
      signIn,
      startSignUp,
      completeProfile,
      updateUser,
      signOut,
    ],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}
