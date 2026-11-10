import { Button } from '@cake-admin/cakeand';
import { GlassCard } from '../../components/GlassCard';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { InterpretationLabel } from '../../components/ai/InterpretationLabel';
import { containerBlur } from '../../styles/surfaces';
import { PageScroll } from '../../components/layout/PageScroll';
import { EmptyState } from '../../components/system/EmptyState';
import { ErrorState } from '../../components/system/ErrorState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import { DEMO_MATCH_ID, replayByEventId } from '../../data/fixtures/demoSpine';
import { getEvidence } from '../../data/repositories/matchRepository';
import { useMatchLoader } from '../../hooks/useMatchLoader';
import { track } from '../../services/analytics';
import type { EvidenceItem, Replay } from '../../types/domain';

export function ReplayPage() {
  const { matchId = DEMO_MATCH_ID, eventId = 'ev-goal-81' } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useMatchLoader(matchId, 'full-time');
  const [replay, setReplay] = useState<Replay | null>(null);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);

  useEffect(() => {
    track('replay_opened', { matchId, eventId });
    track('evidence_opened', { eventId });
    const r = replayByEventId[eventId as keyof typeof replayByEventId] ?? null;
    setReplay(r);
    void (async () => {
      const items: EvidenceItem[] = [];
      const insight = data?.match.insights.find((i) => i.eventId === eventId);
      for (const id of insight?.evidenceIds ?? []) {
        const item = await getEvidence(id, { delayMs: 0 });
        if (item) items.push(item);
      }
      setEvidence(items);
    })();
  }, [matchId, eventId, data]);

  if (loading) {
    return (
      <PageScroll label="Replay and evidence">
        <SkeletonBlock label="Loading evidence" />
      </PageScroll>
    );
  }
  if (error || !data) {
    return (
      <PageScroll label="Replay and evidence">
        <ErrorState message={error ?? 'Missing'} onRetry={() => void reload()} />
      </PageScroll>
    );
  }

  const event = data.match.events.find((e) => e.id === eventId);
  const insight = data.match.insights.find((i) => i.eventId === eventId);

  return (
    <PageScroll label="Replay and evidence" compact>
      <Back type="button" onClick={() => navigate(`/matchday/${matchId}/moment/${eventId}`)}>
        ← Back to explanation
      </Back>
      <Title>Replay / Evidence</Title>
      <GlassCard>
        <Poster role="img" aria-label="Replay placeholder">
          <PosterGrid aria-hidden>
            <span />
            <span />
            <span />
          </PosterGrid>
          <PosterCopy>
            {replay?.available
              ? 'Replay player'
              : (replay?.posterNote ?? 'Evidence unavailable — no fabricated video.')}
          </PosterCopy>
          <AngleChip>360 · demo</AngleChip>
        </Poster>
        <Pad>
          <Meta>
            {replay?.timestampLabel ?? event?.minute ?? '—'}′ · {event?.label}
          </Meta>
          {insight ? (
            <>
              <InterpretationLabel kind="interpretation" />
              <P>{insight.summary}</P>
            </>
          ) : null}
        </Pad>
      </GlassCard>

      {evidence.length === 0 ? (
        <EmptyState
          title="No linked evidence"
          description="When a replay or supporting statistic is available, it will appear here."
        />
      ) : (
        evidence.map((item) => (
          <GlassCard key={item.id}>
            <Pad>
              <InterpretationLabel kind={item.kind === 'statistic' ? 'fact' : 'interpretation'} />
              <H3>{item.label}</H3>
              <P>
                {item.available
                  ? item.note
                  : item.note ?? 'Evidence unavailable in this prototype.'}
              </P>
            </Pad>
          </GlassCard>
        ))
      )}

      <Button fullWidth intent="secondary" variant="outline" onClick={() => navigate(`/matchday/${matchId}/live`)}>
        Return to live timeline
      </Button>
      <Button fullWidth intent="secondary" variant="ghost" onClick={() => navigate(`/matchday/${matchId}/recap`)}>
        Go to recap
      </Button>
    </PageScroll>
  );
}

const Back = styled.button`
  align-self: flex-start;
  min-height: 44px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-primary-primary);
  text-decoration: underline;
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Poster = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  max-height: min(240px, 36vh);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-400);
  text-align: center;
  background:
    radial-gradient(circle at 70% 40%, rgb(0 0 0 / 0.35), transparent 55%),
    var(--color-surfaces-on-container);
  color: var(--color-text-icon-secondary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  border-radius: var(--radius-200) var(--radius-200) 0 0;
  overflow: hidden;
`;

const PosterGrid = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  opacity: 0.35;

  span {
    border-right: 1px solid var(--color-stroke-border);
  }
`;

const PosterCopy = styled.p`
  position: relative;
  z-index: 1;
  margin: 0;
  max-width: 18rem;
`;

const AngleChip = styled.span`
  position: absolute;
  right: var(--space-200);
  bottom: var(--space-200);
  z-index: 1;
  padding: var(--space-100) var(--space-150);
  border-radius: var(--radius-100);
  border: none;
  ${containerBlur}
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-primary);
`;

const Pad = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-150);
  padding: var(--space-300);
`;

const Meta = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const H3 = styled.h3`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const P = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.45;
  color: var(--color-text-icon-secondary);
`;
