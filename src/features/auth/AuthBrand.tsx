import styled from 'styled-components';
import { AppIcon } from '../../components/AppIcon';
import lenovoLogo from '../../assets/brand/lenovo-logo.png';

type AuthBrandProps = {
  compact?: boolean;
};

export function AuthBrand({ compact = false }: AuthBrandProps) {
  return (
    <Brand>
      <Row>
        <AppIcon size={compact ? 36 : 44} />
        <Title>AI for Fans</Title>
      </Row>
      {!compact ? <Tagline>Football intelligence</Tagline> : null}
    </Brand>
  );
}

export function PoweredByLenovo({ compact = false }: { compact?: boolean }) {
  return (
    <Powered $compact={compact}>
      <PoweredLabel $compact={compact}>Powered by</PoweredLabel>
      <LenovoImg
        $compact={compact}
        src={lenovoLogo}
        alt="Lenovo"
        width={compact ? 48 : 80}
        height={compact ? 16 : 27}
      />
    </Powered>
  );
}

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-100);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-200);
`;

const Title = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
  letter-spacing: 0.02em;
`;

const Tagline = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-secondary);
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Powered = styled.div<{ $compact?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => (p.$compact ? 'var(--space-075)' : 'var(--space-200)')};
  width: 100%;
`;

const PoweredLabel = styled.span<{ $compact?: boolean }>`
  font-family: var(--font-family);
  font-size: ${(p) =>
    p.$compact ? 'var(--type-size-caption)' : 'var(--type-size-body)'};
  color: var(--color-text-icon-secondary);
`;

const LenovoImg = styled.img<{ $compact?: boolean }>`
  display: block;
  width: ${(p) => (p.$compact ? '48px' : '80px')};
  height: ${(p) => (p.$compact ? '16px' : '27px')};
  object-fit: contain;
`;
