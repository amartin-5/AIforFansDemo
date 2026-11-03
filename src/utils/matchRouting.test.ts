import { describe, expect, it } from 'vitest';
import { matchdayPathForStatus } from './matchRouting';

describe('matchdayPathForStatus', () => {
  it('routes live and half-time to live companion', () => {
    expect(matchdayPathForStatus('m1', 'live')).toBe('/matchday/m1/live');
    expect(matchdayPathForStatus('m1', 'half-time')).toBe('/matchday/m1/live');
  });

  it('routes full-time and post-match to recap', () => {
    expect(matchdayPathForStatus('m1', 'full-time')).toBe('/matchday/m1/recap');
    expect(matchdayPathForStatus('m1', 'post-match')).toBe('/matchday/m1/recap');
  });

  it('routes upcoming and pre-match to preview', () => {
    expect(matchdayPathForStatus('m1', 'upcoming')).toBe('/matchday/m1/preview');
    expect(matchdayPathForStatus('m1', 'pre-match')).toBe('/matchday/m1/preview');
  });
});
