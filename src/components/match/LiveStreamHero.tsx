import { Maximize2 } from 'lucide-react';
import styled from 'styled-components';
import { watchPitchImage } from '../../assets/past';
import type { Competition, Match, Team } from '../../types/domain';
import { TeamIdentity } from './TeamIdentity';

type LiveStreamHeroProps = {
  match: Match;
  home: Team;
  away: Team;
  competition: Competition;
  onExpand?: () => void;
};

/**
 * Compact in-app live stream header — score strip + media plane.
 * Fullscreen opens the immersive live watch route (same Stage as past rewatch).
 */
export function LiveStreamHero({
  match,
  home,
  away,
  competition,
  onExpand,
}: LiveStreamHeroProps) {
  const score =
    match.score !== undefined ? `${match.score.home} – ${match.score.away}` : 'vs';
  const minute =
    match.periodLabel ??
    (typeof match.minute === 'number' ? `${match.minute}′` : undefined);

  return (
    <Shell>
      <ScoreRow>
        <LiveMark role="status">LIVE</LiveMark>
        <Center>
          <TeamIdentity team={home} size={22} showName={false} />
          <ScorePill
            aria-label={`${home.name} ${match.score?.home ?? 0}, ${away.name} ${match.score?.away ?? 0}, ${competition.name}`}
          >
            {score}
          </ScorePill>
          <TeamIdentity team={away} size={22} showName={false} />
        </Center>
        <Minute>{minute ?? '—'}</Minute>
      </ScoreRow>

      {onExpand ? (
        <Player type="button" onClick={onExpand} aria-label="Expand stream">
          <PlayerMedia competition={competition} showExpand />
        </Player>
      ) : (
        <PlayerStatic>
          <PlayerMedia competition={competition} />
        </PlayerStatic>
      )}
    </Shell>
  );
}

function PlayerMedia({
  competition,
  showExpand = false,
}: {
  competition: Competition;
  showExpand?: boolean;
}) {
  return (
    <>
      <Poster src={watchPitchImage} alt="" />
      <PlayerWash />
      <PlayerHud>
        <CompBadge>{competition.shortName || competition.name}</CompBadge>
        {showExpand ? (
          <ExpandHint aria-hidden>
            <Maximize2 size={14} />
          </ExpandHint>
        ) : null}
      </PlayerHud>
    </>
  );
}

const Shell = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  width: 100%;
`;

const ScoreRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-150);
  width: 100%;
`;

const LiveMark = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-error-error);
  letter-spacing: 0.06em;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-150);
`;

const ScorePill = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  min-height: 28px;
  padding: 0 var(--space-150);
  border-radius: var(--radius-100);
  background: var(--color-surfaces-container-blur);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--color-stroke-border);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Minute = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-secondary);
  text-align: right;
`;

const playerBox = `
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 2 / 1;
  max-height: 148px;
  padding: 0;
  border-radius: var(--radius-200);
  overflow: hidden;
  border: 1px solid var(--color-stroke-border);
  background: var(--color-surfaces-inverse-container);

  @media (max-height: 700px) {
    max-height: 120px;
  }
`;

const Player = styled.button`
  ${playerBox}
  cursor: pointer;
  color: inherit;
  text-align: left;

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: 2px;
  }
`;

const PlayerStatic = styled.div`
  ${playerBox}
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const PlayerWash = styled.div`
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.28);
  pointer-events: none;
`;

const PlayerHud = styled.div`
  position: absolute;
  inset: var(--space-150);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  pointer-events: none;
`;

const CompBadge = styled.span`
  display: inline-flex;
  align-items: center;
  max-width: 70%;
  padding: var(--space-050) var(--space-150);
  border-radius: var(--radius-100);
  background: var(--color-surfaces-container-blur);
  backdrop-filter: blur(16px);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ExpandHint = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-150);
  background: var(--color-surfaces-container-blur);
  color: var(--color-text-icon-primary);
  backdrop-filter: blur(16px);
`;
