import { CakeProvider } from '@cake-admin/cakeand';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

describe('system states', () => {
  it('renders empty copy', () => {
    render(
      <CakeProvider mode="dark.a">
        <EmptyState title="No upcoming matches" description="Check back later." />
      </CakeProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('No upcoming matches');
    expect(screen.getByText('Check back later.')).toBeInTheDocument();
  });

  it('wires error retry', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <CakeProvider mode="dark.a">
        <ErrorState message="Boom" onRetry={onRetry} />
      </CakeProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Boom');
    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
