import { IconButton } from '@cake-admin/cakeand';
import { X } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { watchPitchImage } from '../../assets/past';
import { MatchChatOverlay } from '../../components/match/MatchChatOverlay';
import { containerBlur } from '../../styles/surfaces';
import { ErrorState } from '../../components/system/ErrorState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import { DEMO_MATCH_ID } from '../../data/fixtures/demoSpine';
import { useMatchLoader } from '../../hooks/useMatchLoader';
import { useStreamingAuth } from '../../hooks/useStreamingAuth';

/**
 * Immersive live stream — same Stage shell as past rewatch,
 * simplified to HUD + AI chat FAB only.
 */
export function LiveMatchWatchPage() {
  const { matchId = DEMO_MATCH_ID } = useParams();
  const navigate = useNavigate();
  const { isUnlocked } = useStreamingAuth();
  const scenario = matchId === DEMO_MATCH_ID ? 'live' : undefined;
  const { data, loading, error, reload } = useMatchLoader(matchId, scenario);

  if (!isUnlocked) {
    return <Navigate to={`/matchday/${matchId}/live`} replace />;
  }

  if (loading) {
    return (
      <FullScreen role="status" aria-label="Loading live stream">
        <SkeletonBlock label="Loading live stream" />
      </FullScreen>
    );
  }
  if (error || !data) {
    return (
      <FullScreen>
        <ErrorState
          message={error ?? 'Match not found'}
          onRetry={() => void reload()}
        />
      </FullScreen>
    );
  }

  const { match, home, away } = data;
  const score =
    match.score !== undefined ? `${match.score.home} – ${match.score.away}` : 'vs';
  const minuteLabel =
    match.periodLabel ??
    (typeof match.minute === 'number' ? `${match.minute}'` : 'LIVE');

  return (
    <Stage>
      <Poster src={watchPitchImage} alt="" />
      <Wash />

      <HudTop>
        <LiveCluster>
          <LiveBadge role="status">LIVE</LiveBadge>
          <MinuteBadge>{minuteLabel}</MinuteBadge>
        </LiveCluster>
        <ScorePill
          aria-label={`${home.name} ${match.score?.home ?? 0}, ${away.name} ${match.score?.away ?? 0}`}
        >
          <span>{home.shortName}</span>
          <strong>{score}</strong>
          <span>{away.shortName}</span>
        </ScorePill>
        <IconButton
          size="sm"
          variant="ghost"
          label="Exit full screen"
          icon={<X size={18} aria-hidden />}
          onClick={() => navigate(`/matchday/${matchId}/live`)}
        />
      </HudTop>

      <MatchChatOverlay matchId={matchId} variant="fullscreen" />
    </Stage>
  );
}

const FullScreen = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: var(--space-300);
`;

const Stage = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  background: var(--color-surfaces-inverse-container);
`;

const Poster = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Wash = styled.div`
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.22);
  pointer-events: none;
`;

const HudTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-150);
  padding: var(--space-300);
`;

const LiveCluster = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
`;

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-100) var(--space-200);
  border-radius: var(--radius-200);
  background: var(--color-error-error);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-inverse);
  letter-spacing: 0.04em;
`;

const MinuteBadge = styled.span`
  padding: var(--space-100) var(--space-200);
  border-radius: var(--radius-200);
  border: none;
  ${containerBlur}
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const ScorePill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-150);
  padding: var(--space-100) var(--space-200);
  border-radius: var(--radius-300);
  border: none;
  ${containerBlur}
  font-family: var(--font-family);
  color: var(--color-text-icon-primary);

  span {
    font-size: var(--type-size-caption);
    font-weight: var(--font-weight-bold);
  }

  strong {
    font-size: var(--type-size-body);
  }
`;
