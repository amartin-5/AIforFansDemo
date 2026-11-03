import { Badge, IconButton } from '@cake-admin/cakeand';
import { History, Keyboard, X } from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import { PoweredByLenovo } from '../auth/AuthBrand';

export type VoiceUiState = 'listening' | 'processing' | 'speaking';

type VoiceSessionOverlayProps = {
  state: VoiceUiState;
  transcript?: string;
  onSwitchToKeyboard: () => void;
  onShowHistory: () => void;
  onClose: () => void;
};

export function VoiceSessionOverlay({
  state,
  transcript,
  onSwitchToKeyboard,
  onShowHistory,
  onClose,
}: VoiceSessionOverlayProps) {
  const statusLabel =
    state === 'listening'
      ? 'Ask AI anything'
      : state === 'processing'
        ? 'Thinking…'
        : 'Speaking…';
  const headline =
    state === 'listening' ? 'Listening…' : state === 'processing' ? 'Processing…' : 'Speaking…';

  return (
    <Overlay role="dialog" aria-modal="true" aria-label="Voice conversation with AI">
      <StatusBlock>
        <StatusRow>
          <AiLabel>AI</AiLabel>
          <Badge color="primary" tone="subtle" dot={false}>
            Voice
          </Badge>
        </StatusRow>
        <LiveRow>
          <LiveDot aria-hidden />
          <LiveText>{statusLabel}</LiveText>
        </LiveRow>
      </StatusBlock>

      <OrbBlock>
        <OrbStage>
          <PulseRing $active={state !== 'processing'} aria-hidden />
          <PulseRing $active={state !== 'processing'} $delay aria-hidden />
          <Orb aria-hidden>
            <Wave>
              <Bar $h={10} />
              <Bar $h={18} />
              <Bar $h={28} />
              <Bar $h={16} />
              <Bar $h={8} />
            </Wave>
          </Orb>
        </OrbStage>
        <Headline>{headline}</Headline>
      </OrbBlock>

      {state === 'speaking' && transcript ? (
        <TranscriptCard>
          <TranscriptText>{transcript}</TranscriptText>
        </TranscriptCard>
      ) : (
        <TranscriptSpacer />
      )}

      <Footer>
        <Controls>
          <IconButton
            label="Switch to keyboard"
            icon={<Keyboard size={20} />}
            size="lg"
            intent="secondary"
            variant="outline"
            onClick={onSwitchToKeyboard}
          />
          <IconButton
            label="Show chat history"
            icon={<History size={20} />}
            size="lg"
            intent="secondary"
            variant="outline"
            onClick={onShowHistory}
          />
          <IconButton
            label="End voice session"
            icon={<X size={20} />}
            size="lg"
            intent="primary"
            variant="fill"
            onClick={onClose}
          />
        </Controls>
        <PoweredByLenovo compact />
      </Footer>
    </Overlay>
  );
}

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.45); opacity: 0; }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-300);
  padding: var(--space-300) var(--space-300) var(--space-200);
  background: color-mix(in srgb, var(--color-surfaces-canvas) 88%, transparent);
  backdrop-filter: blur(16px);
`;

const StatusBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-100);
  flex-shrink: 0;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
`;

const AiLabel = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const LiveRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
`;

const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: var(--radius-1000);
  background: var(--color-success-success);
`;

const LiveText = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-secondary);
`;

const OrbBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-300);
  flex: 1 1 auto;
  justify-content: center;
  min-height: 0;
`;

/** Rings are positioned relative to this stage alone — not the headline. */
const OrbStage = styled.div`
  position: relative;
  width: 148px;
  height: 148px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const PulseRing = styled.div<{ $active?: boolean; $delay?: boolean }>`
  position: absolute;
  inset: 0;
  border-radius: var(--radius-1000);
  border: 2px solid var(--color-primary-primary);
  transform-origin: center center;
  opacity: ${(p) => (p.$active ? 0.45 : 0.18)};
  animation: ${pulse} 2s ease-out infinite;
  animation-delay: ${(p) => (p.$delay ? '0.75s' : '0s')};
  animation-play-state: ${(p) => (p.$active ? 'running' : 'paused')};
  pointer-events: none;
`;

const Orb = styled.div`
  position: relative;
  z-index: 1;
  width: 112px;
  height: 112px;
  border-radius: var(--radius-1000);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-primary);
  box-shadow: 0 0 0 10px var(--color-primary-primary-overlay);
`;

const Wave = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  height: 32px;
`;

const Bar = styled.span<{ $h: number }>`
  width: 3px;
  height: ${(p) => p.$h}px;
  border-radius: var(--radius-50);
  background: var(--color-text-icon-on-primary);
`;

const Headline = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-greeting);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
  text-align: center;
`;

const TranscriptCard = styled.div`
  width: 100%;
  max-height: 26vh;
  overflow-y: auto;
  padding: var(--space-250) var(--space-300);
  border-radius: var(--radius-300);
  border: 1px solid var(--color-stroke-border);
  background: var(--color-surfaces-container-blur);
  backdrop-filter: blur(20px);
  flex-shrink: 0;
`;

const TranscriptSpacer = styled.div`
  width: 100%;
  min-height: 0;
  flex-shrink: 1;
`;

const TranscriptText = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.5;
  color: var(--color-text-icon-primary);
  white-space: pre-wrap;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-200);
  width: 100%;
  flex-shrink: 0;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-400);
`;
