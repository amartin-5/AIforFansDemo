import { useCallback, useState } from 'react';
import { readProfile } from '../features/auth/accountStorage';

const STORAGE_KEY = 'aiforfans-stream-provider';

function readStored(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function preferredFromProfile(): string[] {
  return readProfile()?.preferences.preferredProviderIds ?? [];
}

/**
 * Demo streaming entitlement — selecting a provider in the login gate unlocks in-app watch.
 * Also honors providers saved on the fan profile during onboarding.
 */
export function useStreamingAuth() {
  const [linkedProviderId, setLinkedProviderId] = useState<string | null>(() => readStored());
  const [preferredIds, setPreferredIds] = useState<string[]>(() => preferredFromProfile());

  const refreshPreferred = useCallback(() => {
    setPreferredIds(preferredFromProfile());
  }, []);

  const linkedIds = [
    ...new Set([
      ...(linkedProviderId ? [linkedProviderId] : []),
      ...preferredIds,
    ]),
  ];

  const isUnlocked = linkedIds.length > 0;

  const linkProvider = useCallback((providerId: string) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, providerId);
    } catch {
      /* ignore quota / private mode */
    }
    setLinkedProviderId(providerId);
    setPreferredIds(preferredFromProfile());
  }, []);

  const clearLink = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setLinkedProviderId(null);
    setPreferredIds(preferredFromProfile());
  }, []);

  return {
    isUnlocked,
    linkedProviderId,
    linkedIds,
    linkProvider,
    clearLink,
    refreshPreferred,
  };
}
