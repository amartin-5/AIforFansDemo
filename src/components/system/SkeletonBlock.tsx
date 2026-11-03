import { Spinner } from '@cake-admin/cakeand';
import styled from 'styled-components';

type SkeletonBlockProps = {
  label?: string;
  lines?: number;
};

export function SkeletonBlock({ label = 'Loading', lines = 3 }: SkeletonBlockProps) {
  return (
    <Wrap aria-busy="true" aria-label={label}>
      <Spinner size="md" aria-label={label} />
      <Bars>
        {Array.from({ length: lines }).map((_, i) => (
          <Bar key={i} $width={i === lines - 1 ? '70%' : '100%'} />
        ))}
      </Bars>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-300);
  padding: var(--space-500) var(--space-400);
`;

const Bars = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
`;

const Bar = styled.div<{ $width: string }>`
  height: var(--space-250);
  width: ${(p) => p.$width};
  border-radius: var(--radius-100);
  background: var(--color-surfaces-on-container);
  opacity: 0.7;

  @media (prefers-reduced-motion: no-preference) {
    animation: pulse 1.2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.45;
    }
    50% {
      opacity: 0.85;
    }
  }
`;
