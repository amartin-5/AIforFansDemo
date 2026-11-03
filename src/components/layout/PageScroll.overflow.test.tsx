import { CakeProvider } from '@cake-admin/cakeand';
import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { ChartCard } from '../charts/ChartCard';
import { PhoneFrame } from '../PhoneFrame';
import { PageScroll } from './PageScroll';

afterEach(() => cleanup());

function Shell({ children }: { children: ReactNode }) {
  return (
    <CakeProvider mode="dark.a">
      <PhoneFrame>{children}</PhoneFrame>
    </CakeProvider>
  );
}

describe('responsive shell overflow smoke', () => {
  it('renders PageScroll as a labeled main region', () => {
    render(
      <Shell>
        <PageScroll label="My Team" compact>
          <div>Team notebook</div>
        </PageScroll>
      </Shell>,
    );
    expect(screen.getByRole('main', { name: 'My Team' })).toBeInTheDocument();
  });

  it('ChartCard exposes a text summary', () => {
    render(
      <Shell>
        <ChartCard
          title="Goals"
          periodLabel="Tournament"
          summary="Spain scored 18 goals across the path."
        >
          <div data-testid="chart-slot" />
        </ChartCard>
      </Shell>,
    );
    expect(screen.getByText('Spain scored 18 goals across the path.')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
  });

  it('PhoneFrame source contract: fluid shell (no scale helper class)', () => {
    const { container } = render(
      <Shell>
        <PageScroll label="Upcoming">
          <p>Content</p>
        </PageScroll>
      </Shell>,
    );
    expect(container.querySelector('[style*="scale"]')).toBeNull();
    expect(screen.getByRole('main', { name: 'Upcoming' })).toBeInTheDocument();
  });
});
