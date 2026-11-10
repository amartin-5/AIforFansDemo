import { Badge } from '@cake-admin/cakeand';
import styled from 'styled-components';
import { CakeChart } from '../../charts/CakeChart';
import { createLineOption, createRadarOption } from '../../charts/options';
import { restingTile } from '../../styles/surfaces';
import type { ChatAnalysisPayload } from '../../types/domain';

type ChatAnalysisCardProps = {
  analysis: ChatAnalysisPayload;
};

export function ChatAnalysisCard({ analysis }: ChatAnalysisCardProps) {
  const lineOption = createLineOption(
    analysis.intensity.categories,
    'Press intensity',
    analysis.intensity.values,
  );
  const radarOption = createRadarOption(
    analysis.profile.indicators,
    analysis.profile.values,
    '2nd half',
  );

  return (
    <Card role="region" aria-label="AI match analysis">
      <Header>
        <Title>{analysis.title}</Title>
        <Badge color="primary" tone="subtle" dot={false}>
          {analysis.confidenceLabel}
        </Badge>
      </Header>

      <KpiRow>
        {analysis.kpis.map((kpi) => (
          <Kpi key={kpi.label} $tone={kpi.tone}>
            <KpiLabel>{kpi.label}</KpiLabel>
            <KpiValue $tone={kpi.tone}>{kpi.value}</KpiValue>
            <KpiHint>{kpi.hint}</KpiHint>
          </Kpi>
        ))}
      </KpiRow>

      <Section>
        <SectionLabel>Key factors</SectionLabel>
        <FactorList>
          {analysis.factors.map((factor) => (
            <Factor key={factor.label}>
              <FactorMeta>
                <FactorName>{factor.label}</FactorName>
                <FactorPct>{factor.value}%</FactorPct>
              </FactorMeta>
              <Track>
                <Fill $tone={factor.tone} style={{ width: `${factor.value}%` }} />
              </Track>
            </Factor>
          ))}
        </FactorList>
      </Section>

      <Section>
        <SectionLabel>Press intensity / minute</SectionLabel>
        <CakeChart option={lineOption} height={140} ariaLabel="Press intensity over time" />
      </Section>

      <Section>
        <SectionLabel>Performance profile — 2nd half</SectionLabel>
        <CakeChart option={radarOption} height={180} ariaLabel="Performance radar profile" />
      </Section>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  width: 100%;
  padding: var(--space-300);
  border: none;
  ${restingTile}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
`;

const Title = styled.h3`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const KpiRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-100);
`;

const Kpi = styled.div<{ $tone: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-050);
  padding: var(--space-150) var(--space-100);
  border-radius: var(--radius-200);
  background: ${(p) =>
    p.$tone === 'info'
      ? 'var(--color-info-info-overlay)'
      : p.$tone === 'success'
        ? 'var(--color-success-success-overlay)'
        : 'var(--color-primary-primary-overlay)'};
`;

const KpiLabel = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  text-align: center;
`;

const KpiValue = styled.span<{ $tone: string }>`
  font-family: var(--font-family);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-bold);
  line-height: 1.1;
  color: ${(p) =>
    p.$tone === 'info'
      ? 'var(--color-info-info)'
      : p.$tone === 'success'
        ? 'var(--color-success-success)'
        : 'var(--color-primary-primary)'};
`;

const KpiHint = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  text-align: center;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
`;

const SectionLabel = styled.h4`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-icon-secondary);
`;

const FactorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
`;

const Factor = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-075);
`;

const FactorMeta = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-100);
`;

const FactorName = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-primary);
`;

const FactorPct = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-secondary);
  flex-shrink: 0;
`;

const Track = styled.div`
  height: 8px;
  border-radius: var(--radius-1000);
  background: var(--color-surfaces-on-container);
  overflow: hidden;
`;

const Fill = styled.div<{ $tone: string }>`
  height: 100%;
  border-radius: var(--radius-1000);
  background: ${(p) =>
    p.$tone === 'info'
      ? 'var(--color-info-info)'
      : p.$tone === 'warning'
        ? 'var(--color-warning-warn)'
        : 'var(--color-primary-primary)'};
  transition: width 400ms ease;
`;
