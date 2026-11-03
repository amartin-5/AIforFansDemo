import { beforeEach, describe, expect, it } from 'vitest';
import { clearAnalyticsBuffer, getAnalyticsBuffer, track } from './analytics';

describe('analytics', () => {
  beforeEach(() => {
    clearAnalyticsBuffer();
  });

  it('records named events without storing free text payloads as required', () => {
    track('app_opened');
    track('destination_viewed', { path: '/upcoming' });
    track('chat_query_submitted', { matchId: 'm1', length: 12 });

    const buf = getAnalyticsBuffer();
    expect(buf).toHaveLength(3);
    expect(buf[0]?.name).toBe('app_opened');
    expect(buf[2]?.props).toEqual({ matchId: 'm1', length: 12 });
    expect(JSON.stringify(buf)).not.toMatch(/Why did Paralluelo/);
  });
});
