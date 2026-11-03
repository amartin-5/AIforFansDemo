import { Badge } from '@cake-admin/cakeand';
import type { MatchStatus } from '../../types/domain';

type MatchStatusBadgeProps = {
  status: MatchStatus;
  periodLabel?: string;
};

function labelFor(status: MatchStatus, periodLabel?: string): string {
  switch (status) {
    case 'live':
      return periodLabel ? `Live · ${periodLabel}` : 'Live';
    case 'half-time':
      return 'Half-time';
    case 'full-time':
      return 'Full-time';
    case 'post-match':
      return 'Post-match';
    case 'pre-match':
      return 'Pre-match';
    case 'upcoming':
      return 'Upcoming';
    case 'between-matches':
      return 'Between matches';
    default:
      return status;
  }
}

function colorFor(status: MatchStatus): 'green' | 'primary' | 'secondary' | 'destructive' {
  switch (status) {
    case 'live':
      return 'destructive';
    case 'half-time':
      return 'primary';
    case 'full-time':
    case 'post-match':
      return 'green';
    default:
      return 'secondary';
  }
}

export function MatchStatusBadge({ status, periodLabel }: MatchStatusBadgeProps) {
  const label = labelFor(status, status === 'live' ? periodLabel : undefined);
  return (
    <Badge color={colorFor(status)} tone="subtle" role="status">
      {label}
    </Badge>
  );
}
