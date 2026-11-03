import { CakeProvider } from '@cake-admin/cakeand';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MatchStatusBadge } from './MatchStatusBadge';

afterEach(() => cleanup());

describe('MatchStatusBadge', () => {
  it('exposes a text status for live matches (not color alone)', () => {
    render(
      <CakeProvider mode="dark.a">
        <MatchStatusBadge status="live" periodLabel="58'" />
      </CakeProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent(/Live/i);
    expect(screen.getByRole('status')).toHaveTextContent(/58/);
  });

  it('labels full-time clearly', () => {
    render(
      <CakeProvider mode="dark.a">
        <MatchStatusBadge status="full-time" />
      </CakeProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Full-time');
  });
});
