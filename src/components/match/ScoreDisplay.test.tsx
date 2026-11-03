import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScoreDisplay } from './ScoreDisplay';
import type { Team } from '../../types/domain';

const home: Team = { id: 'spain', name: 'Spain', shortName: 'ESP', crestKey: 'Spain' };
const away: Team = {
  id: 'england',
  name: 'England',
  shortName: 'ENG',
  crestKey: 'England',
};

describe('ScoreDisplay', () => {
  it('provides an accessible score summary', () => {
    render(
      <ScoreDisplay
        home={home}
        away={away}
        score={{ home: 1, away: 0 }}
        status="full-time"
        periodLabel="Full-time"
      />,
    );
    expect(screen.getByRole('group')).toHaveAttribute(
      'aria-label',
      expect.stringMatching(/Spain 1.*England 0.*Full-time/i),
    );
  });
});
