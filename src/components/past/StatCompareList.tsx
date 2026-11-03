import styled from 'styled-components';
import type { MatchStatistic, Team } from '../../types/domain';

type StatCompareListProps = {
  statistics: MatchStatistic[];
  home: Team;
  away: Team;
};

export function StatCompareList({ statistics, home, away }: StatCompareListProps) {
  return (
    <List aria-label={`${home.name} versus ${away.name} statistics`}>
      {statistics.map((stat) => {
        const total = Math.max(stat.homeValue + stat.awayValue, 1);
        const homePct = (stat.homeValue / total) * 100;
        const awayPct = (stat.awayValue / total) * 100;
        const unit = stat.unit === '%' ? '%' : '';
        return (
          <Row key={stat.id}>
            <Values>
              <strong>
                {stat.homeValue}
                {unit}
              </strong>
              <Label>{stat.label}</Label>
              <strong>
                {stat.awayValue}
                {unit}
              </strong>
            </Values>
            <Bars aria-hidden>
              <HomeBar style={{ width: `${homePct}%` }} />
              <AwayBar style={{ width: `${awayPct}%` }} />
            </Bars>
          </Row>
        );
      })}
    </List>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-250);
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
`;

const Values = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-100);
  align-items: baseline;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);

  strong:last-child {
    text-align: right;
  }
`;

const Label = styled.span`
  text-align: center;
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const Bars = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-100);
  height: 6px;
`;

const HomeBar = styled.div`
  justify-self: end;
  height: 100%;
  border-radius: var(--radius-100);
  background: var(--color-primary-primary);
  max-width: 100%;
`;

const AwayBar = styled.div`
  justify-self: start;
  height: 100%;
  border-radius: var(--radius-100);
  background: var(--color-info-info);
  max-width: 100%;
`;
