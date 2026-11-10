import { Badge } from '@cake-admin/cakeand';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { restingSurface } from '../../styles/surfaces';

type ChartCardProps = {
  title: string;
  periodLabel?: string;
  summary: string;
  children: ReactNode;
  mock?: boolean;
};

export function ChartCard({
  title,
  periodLabel,
  summary,
  children,
  mock = true,
}: ChartCardProps) {
  return (
    <Card>
      <Head>
        <Titles>
          <Title>{title}</Title>
          {periodLabel ? <Period>{periodLabel}</Period> : null}
        </Titles>
        {mock ? (
          <Badge color="secondary" tone="subtle" dot={false}>
            Mock data
          </Badge>
        ) : null}
      </Head>
      <ChartWrap>{children}</ChartWrap>
      <Summary>{summary}</Summary>
    </Card>
  );
}

const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-250);
  padding: var(--space-350);
  width: 100%;
  min-width: 0;
  ${restingSurface}
`;

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-200);
`;

const Titles = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  min-width: 0;
`;

const Title = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Period = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const ChartWrap = styled.div`
  width: 100%;
  min-width: 0;
`;

const Summary = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  line-height: 1.4;
  color: var(--color-text-icon-secondary);
`;
