import { IconButton } from '@cake-admin/cakeand';
import {
  BarChart3,
  Eye,
  Maximize2,
  RefreshCw,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { ErrorState } from '../../components/system/ErrorState';
import { containerBlur } from '../../styles/surfaces';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import { getPastLibraryMeta } from '../../data/fixtures/wwc2023Past';
import { useMatchLoader } from '../../hooks/useMatchLoader';
import { track } from '../../services/analytics';

type OverlayMode = 'overlay' | 'detailed' | '360';

const MODES: { id: OverlayMode; label: string; icon: typeof Eye }[] = [
  { id: 'overlay', label: 'Overlay', icon: Eye },
  { id: 'detailed', label: 'Detailed', icon: BarChart3 },
  { id: '360', label: '360°', icon: RefreshCw },
];

export function PastMatchWatchPage() {
  const { matchId = '' } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useMatchLoader(matchId);
  const [mode, setMode] = useState<OverlayMode>('overlay');
  const meta = matchId ? getPastLibraryMeta(matchId) : undefined;

  const focusEvent = useMemo(() => {
    if (!data) return undefined;
    const fromQuery = params.get('moment');
    if (fromQuery) {
      return data.match.events.find((e) => e.id === fromQuery);
    }
    const tip = data.match.turningPointEventId;
    return (
      data.match.events.find((e) => e.id === tip) ??
      data.match.events.find((e) => e.type === 'goal')
    );
  }, [data, params]);

  if (loading) {
    return (
      <FullScreen role="status" aria-label="Loading watch player">
        <SkeletonBlock label="Loading watch player" />
      </FullScreen>
    );
  }
  if (error || !data || !meta) {
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
    focusEvent != null
      ? `${focusEvent.minute}'`
      : (match.periodLabel ?? 'FT');

  return (
    <Stage>
      <Poster src={meta.streamImage} alt="" />
      <Wash />

      <HudTop>
        <MinuteBadge>{minuteLabel}</MinuteBadge>
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
          label="Close watch"
          icon={<X size={18} aria-hidden />}
          onClick={() => navigate(`/past/${matchId}`)}
        />
      </HudTop>

      <ModeRail aria-label="Watch overlay modes">
        {MODES.map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <ModeBtn
              key={m.id}
              type="button"
              $active={active}
              aria-pressed={active}
              onClick={() => {
                setMode(m.id);
                track('replay_opened', { matchId, eventId: m.id });
              }}
            >
              <Icon size={20} aria-hidden />
              {m.label}
            </ModeBtn>
          );
        })}
      </ModeRail>

      {mode === 'overlay' || mode === 'detailed' ? (
        <TacticalLayer $detailed={mode === 'detailed'} aria-hidden>
          <PassLane />
          <Radar />
          {mode === 'detailed' ? (
            <>
              <PlayerDot $x={22} $y={48} $home>
                19
              </PlayerDot>
              <PlayerDot $x={38} $y={42} $home>
                6
              </PlayerDot>
              <PlayerDot $x={48} $y={55} $home>
                10
              </PlayerDot>
              <PlayerDot $x={62} $y={40}>
                4
              </PlayerDot>
              <PlayerDot $x={70} $y={52}>
                8
              </PlayerDot>
              <PlayerDot $x={78} $y={46}>
                9
              </PlayerDot>
            </>
          ) : (
            <>
              <PlayerDot $x={40} $y={50} $home>
                19
              </PlayerDot>
              <PlayerDot $x={58} $y={44}>
                6
              </PlayerDot>
            </>
          )}
          {focusEvent ? (
            <Callout $x={42} $y={38}>
              <strong>{focusEvent.playerName ?? focusEvent.label}</strong>
              <span>{focusEvent.label}</span>
            </Callout>
          ) : null}
        </TacticalLayer>
      ) : (
        <AngleHint role="status">
          <Maximize2 size={18} aria-hidden />
          360° angle — demo placeholder (no fabricated video stream)
        </AngleHint>
      )}

      <FooterNote>Powered by Lenovo · cake&</FooterNote>
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

const ModeRail = styled.div`
  position: absolute;
  left: var(--space-300);
  top: 50%;
  translate: 0 -50%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  width: 76px;
  padding: var(--space-100);
  border-radius: var(--radius-300);
  border: none;
  ${containerBlur}
`;

const ModeBtn = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-050);
  width: 100%;
  min-height: 56px;
  padding: var(--space-150) var(--space-050);
  border-radius: var(--radius-200);
  border: 1px solid
    ${(p) => (p.$active ? 'var(--color-primary-primary)' : 'transparent')};
  background: ${(p) =>
    p.$active ? 'var(--color-surfaces-primary)' : 'transparent'};
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
`;

const TacticalLayer = styled.div<{ $detailed: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: ${(p) => (p.$detailed ? 1 : 0.95)};
`;

const PassLane = styled.div`
  position: absolute;
  left: 28%;
  top: 42%;
  width: 36%;
  height: 2px;
  background: repeating-linear-gradient(
    90deg,
    var(--color-text-icon-primary) 0 8px,
    transparent 8px 14px
  );
  rotate: -18deg;
  transform-origin: left center;
  opacity: 0.85;
`;

const Radar = styled.div`
  position: absolute;
  left: 36%;
  top: 46%;
  width: 72px;
  height: 72px;
  border-radius: var(--radius-1000);
  border: 2px solid var(--color-warning-warn);
  box-shadow: 0 0 0 10px color-mix(in srgb, var(--color-warning-warn) 18%, transparent);
  opacity: 0.7;
`;

const PlayerDot = styled.span<{ $x: number; $y: number; $home?: boolean }>`
  position: absolute;
  left: ${(p) => p.$x}%;
  top: ${(p) => p.$y}%;
  translate: -50% -50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-100);
  border: 1px solid var(--color-text-icon-inverse);
  background: ${(p) =>
    p.$home ? 'var(--color-info-info)' : 'var(--color-text-icon-inverse)'};
  color: ${(p) =>
    p.$home ? 'var(--color-text-icon-inverse)' : 'var(--color-text-icon-primary)'};
  font-family: var(--font-family);
  font-size: 9px;
  font-weight: var(--font-weight-bold);
`;

const Callout = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${(p) => p.$x}%;
  top: ${(p) => p.$y}%;
  translate: -50% -120%;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-100) var(--space-200);
  border-radius: var(--radius-200);
  background: var(--color-error-error);
  color: var(--color-text-icon-inverse);
  font-family: var(--font-family);
  max-width: 160px;

  strong {
    font-size: var(--type-size-caption);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  span {
    font-size: 10px;
    opacity: 0.9;
  }
`;

const AngleHint = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-150);
  max-width: 220px;
  padding: var(--space-300);
  border-radius: var(--radius-300);
  border: none;
  ${containerBlur}
  text-align: center;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-primary);
`;

const FooterNote = styled.p`
  position: absolute;
  left: 50%;
  bottom: var(--space-400);
  translate: -50% 0;
  z-index: 2;
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  white-space: nowrap;
`;
