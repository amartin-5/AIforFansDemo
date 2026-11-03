import { Button, Card } from '@cake-admin/cakeand';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { InterpretationLabel } from '../../components/ai/InterpretationLabel';
import { ProgressiveExplanation } from '../../components/ai/ProgressiveExplanation';
import { PageScroll } from '../../components/layout/PageScroll';
import { ErrorState } from '../../components/system/ErrorState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import { DEMO_MATCH_ID } from '../../data/fixtures/demoSpine';
import { useMatchLoader } from '../../hooks/useMatchLoader';
import { track } from '../../services/analytics';

export function ExplainMomentPage() {
  const { matchId = DEMO_MATCH_ID, eventId = 'ev-goal-81' } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useMatchLoader(matchId, 'live');

  useEffect(() => {
    track('ai_insight_opened', { matchId, eventId });
  }, [matchId, eventId]);

  if (loading) {
    return (
      <PageScroll label="Explain the moment">
        <SkeletonBlock label="Loading explanation" />
      </PageScroll>
    );
  }
  if (error || !data) {
    return (
      <PageScroll label="Explain the moment">
        <ErrorState message={error ?? 'Missing'} onRetry={() => void reload()} />
      </PageScroll>
    );
  }

  const event = data.match.events.find((e) => e.id === eventId);
  const insight =
    data.match.insights.find((i) => i.eventId === eventId) ?? data.match.insights[0];

  if (!insight || !event) {
    return (
      <PageScroll label="Explain the moment">
        <ErrorState message="No explanation available for this event." />
      </PageScroll>
    );
  }

  return (
    <PageScroll label="Explain the moment" compact>
      <Back type="button" onClick={() => navigate(`/matchday/${matchId}/live`)}>
        ← Back to live timeline
      </Back>

      <PitchCard aria-label={`Pitch context for ${event.label}`}>
        <PitchPlane>
          <Halfway />
          <CenterCircle />
          <EventMark $x={62} $y={38}>
            <MarkPulse />
            <MarkLabel>
              {event.minute}' · {event.label}
            </MarkLabel>
          </EventMark>
        </PitchPlane>
        <PitchCaption>Approximate location for this demo moment</PitchCaption>
      </PitchCard>

      <Card>
        <Pad>
          <Meta>
            {event.minute}' · {event.label}
          </Meta>
          <InterpretationLabel kind="interpretation" />
          <Title>{insight.title}</Title>
          {insight.confidenceLabel ? <Meta>{insight.confidenceLabel}</Meta> : null}
          <ProgressiveExplanation layers={insight.layers} insightId={insight.id} />
        </Pad>
      </Card>
      <Button
        fullWidth
        onClick={() => {
          track('replay_opened', { eventId });
          navigate(`/matchday/${matchId}/replay/${eventId}`);
        }}
      >
        Replay / See evidence
      </Button>
      <Button
        fullWidth
        intent="secondary"
        variant="outline"
        onClick={() => navigate(`/chat?matchId=${matchId}&eventId=${eventId}`)}
      >
        Ask a follow-up
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

const PitchCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
`;

const PitchPlane = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  max-height: min(220px, 32vh);
  border-radius: var(--radius-300);
  border: 1px solid var(--color-stroke-border);
  background:
    linear-gradient(180deg, rgb(0 0 0 / 0.2), transparent 42%),
    var(--color-surfaces-on-container);
  overflow: hidden;
`;

const Halfway = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--color-stroke-border);
  transform: translateX(-50%);
`;

const CenterCircle = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 18%;
  aspect-ratio: 1;
  border: 1px solid var(--color-stroke-border);
  border-radius: 50%;
  transform: translate(-50%, -50%);
`;

const EventMark = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${(p) => p.$x}%;
  top: ${(p) => p.$y}%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-100);
`;

const MarkPulse = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary-primary);
  box-shadow: 0 0 0 6px rgb(0 0 0 / 0.35);
`;

const MarkLabel = styled.span`
  padding: var(--space-100) var(--space-150);
  border-radius: var(--radius-100);
  background: var(--color-surfaces-container-blur);
  border: 1px solid var(--color-stroke-border);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-primary);
  white-space: nowrap;
`;

const PitchCaption = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const Pad = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-200);
  padding: var(--space-300);
`;

const Meta = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;
