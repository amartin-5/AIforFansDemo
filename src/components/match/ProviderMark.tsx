import styled from 'styled-components';
import type { ViewingProvider } from '../../types/domain';

type ProviderMarkProps = {
  provider: Pick<ViewingProvider, 'name' | 'mark' | 'logoSrc'>;
  size?: number;
};

/** Logo tile for a streaming provider; falls back to a letter mark. */
export function ProviderMark({ provider, size = 36 }: ProviderMarkProps) {
  if (provider.logoSrc) {
    return (
      <Logo
        src={provider.logoSrc}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }

  return (
    <Mark aria-hidden style={{ width: size, height: size }}>
      {provider.mark ?? provider.name.slice(0, 1)}
    </Mark>
  );
}

const Logo = styled.img`
  flex-shrink: 0;
  border-radius: var(--radius-150);
  border: 1px solid var(--color-stroke-border);
  object-fit: cover;
  background: var(--color-surfaces-on-container);
`;

const Mark = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-150);
  border: 1px solid var(--color-stroke-border);
  background: var(--color-surfaces-on-container);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;
