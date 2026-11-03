import {
  currentUser,
  notifications,
  spainTeamProfile,
} from '../fixtures/demoSpine';
import { readProfile } from '../../features/auth/accountStorage';
import type { Notification, TeamProfile, User } from '../../types/domain';

export type RepoOptions = { delayMs?: number; fail?: boolean };

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function gate<T>(value: T, options?: RepoOptions): Promise<T> {
  const delay = options?.delayMs ?? 200;
  if (delay > 0) await wait(delay);
  if (options?.fail) throw new Error('Unable to load profile data.');
  return value;
}

export async function getCurrentUser(options?: RepoOptions): Promise<User> {
  return gate(readProfile() ?? currentUser, options);
}

export async function getNotifications(options?: RepoOptions): Promise<Notification[]> {
  return gate(notifications, options);
}

export async function getFavoriteTeamProfile(options?: RepoOptions): Promise<TeamProfile> {
  return gate(spainTeamProfile, options);
}
