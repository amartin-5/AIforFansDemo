import styled from 'styled-components';
import { restingSurface } from '../../styles/surfaces';
import type { FormEntry } from '../../types/domain';

type FormGuideProps = {
  title: string;
  entries: FormEntry[];
};

export function FormGuide({ title, entries }: FormGuideProps) {
  const lastFive = entries.slice(-5);
  const summary = lastFive
    .map((e) => `${e.result} vs ${e.opponent} (${e.score})`)
    .join('; ');

  return (
    <Section aria-label={`${title}. ${summary}`}>
      <Title>{title}</Title>
      <List>
        {lastFive.map((e, i) => (
          <Item key={`${e.opponent}-${i}`}>
            <Pill $result={e.result} aria-hidden>
              {e.result}
            </Pill>
            <Text>
              <strong>{e.opponent}</strong>
              <span>
                {e.score}
              </span>
            </Text>
          </Item>
        ))}
      </List>
      <SrOnly>{summary}</SrOnly>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  padding: var(--space-350);
  ${restingSurface}
`;

const Title = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: var(--space-200);
  min-height: 44px;
`;

const Pill = styled.span<{ $result: string }>`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-1000);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
  background: ${(p) =>
    p.$result === 'W'
      ? 'var(--color-success-success-overlay)'
      : p.$result === 'L'
        ? 'var(--color-error-error-overlay)'
        : 'var(--color-surfaces-on-container)'};
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-025);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);
  min-width: 0;

  span {
    font-size: var(--type-size-caption);
    color: var(--color-text-icon-secondary);
  }
`;

const SrOnly = styled.p`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
