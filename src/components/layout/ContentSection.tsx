import styled from 'styled-components';
import type { ReactNode } from 'react';

type ContentSectionProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function ContentSection({ title, action, children }: ContentSectionProps) {
  return (
    <Section>
      <Header>
        <Title>{title}</Title>
        {action}
      </Header>
      {children}
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-250);
  width: 100%;
  min-width: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-200);
`;

const Title = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.01em;
  color: var(--color-text-icon-primary);
`;
