import { IconButton, Spinner, TextInput } from '@cake-admin/cakeand';
import { Send, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import lenovoLogo from '../../assets/brand/lenovo-logo.png';
import { getConversation, submitQuery } from '../../data/repositories/chatRepository';
import { track } from '../../services/analytics';
import { containerBlur } from '../../styles/surfaces';
import type { ChatMessage } from '../../types/domain';
import { InterpretationLabel } from '../ai/InterpretationLabel';

type MatchChatOverlayProps = {
  matchId: string;
  defaultOpen?: boolean;
  /** Fullscreen watch HUD — glass FAB when closed, elevated dock. */
  variant?: 'dock' | 'fullscreen';
};

/**
 * Floating AI chat on the live stream — Alexandria overlay pattern, cake& controls.
 */
export function MatchChatOverlay({
  matchId,
  defaultOpen = false,
  variant = 'dock',
}: MatchChatOverlayProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fullscreen = variant === 'fullscreen';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const c = await getConversation(matchId, { delayMs: 0 });
        if (!cancelled) {
          setMessages(c.messages.slice(-4));
          setLoaded(true);
        }
      } catch {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  async function send() {
    const q = draft.trim();
    if (!q || sending) return;
    setSending(true);
    track('chat_query_submitted', {
      matchId,
      length: q.length,
      from: fullscreen ? 'live-fullscreen' : 'live-overlay',
    });
    try {
      const { user, assistant } = await submitQuery(q);
      track('ai_answer_rendered', {
        matchId,
        from: fullscreen ? 'live-fullscreen' : 'live-overlay',
      });
      setMessages((prev) => [...prev, user, assistant].slice(-8));
      setDraft('');
    } finally {
      setSending(false);
    }
  }

  return (
    <Dock $fullscreen={fullscreen}>
      {open ? (
        <Panel role="dialog" aria-label="AI match chat">
          <Handle aria-hidden />
          <PanelHeader>
            <PanelTitle>Ask about this match</PanelTitle>
            <IconButton
              label="Close chat"
              icon={<X size={16} />}
              size="sm"
              intent="secondary"
              variant="ghost"
              onClick={() => setOpen(false)}
            />
          </PanelHeader>
          <Thread aria-live="polite">
            {!loaded ? (
              <Muted>Loading…</Muted>
            ) : messages.length === 0 ? (
              <Muted>Ask what just happened, or why a moment mattered.</Muted>
            ) : (
              messages.map((m) => (
                <BubbleRow key={m.id} $role={m.role}>
                  {m.role === 'assistant' ? (
                    <AiAvatar aria-hidden>
                      <Sparkles size={14} strokeWidth={2} />
                    </AiAvatar>
                  ) : null}
                  <Bubble $role={m.role}>
                    {m.isInterpretation ? <InterpretationLabel kind="interpretation" /> : null}
                    <BubbleText>{m.text}</BubbleText>
                    <Meta $assistant={m.role === 'assistant'}>
                      <MetaRole $assistant={m.role === 'assistant'}>
                        {m.role === 'assistant' ? 'AI' : 'You'}
                      </MetaRole>
                      <MetaDot aria-hidden>·</MetaDot>
                      <span>{m.createdAtLabel}</span>
                    </Meta>
                  </Bubble>
                </BubbleRow>
              ))
            )}
            {sending ? (
              <Reasoning>
                <Spinner size="sm" aria-label="Preparing answer" />
                <span>Preparing answer…</span>
              </Reasoning>
            ) : null}
          </Thread>
          <Composer>
            <FieldGrow>
              <TextInput
                aria-label="Send a message"
                size="sm"
                placeholder="Send a message…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void send();
                  }
                }}
              />
            </FieldGrow>
            <SendBtn
              type="button"
              aria-label="Send"
              onClick={() => void send()}
              disabled={!draft.trim() || sending}
            >
              <Send size={16} aria-hidden />
            </SendBtn>
          </Composer>
          <PoweredWrap>
            <PoweredLabel>Powered by</PoweredLabel>
            <LenovoMark src={lenovoLogo} alt="Lenovo" width={48} height={16} />
          </PoweredWrap>
        </Panel>
      ) : null}

      <Fab
        type="button"
        aria-label={open ? 'Hide AI chat' : 'Open AI chat'}
        aria-expanded={open}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) track('match_chat_opened', { matchId, from: fullscreen ? 'fullscreen' : 'dock' });
        }}
      >
        <Sparkles size={24} strokeWidth={2} aria-hidden />
      </Fab>
    </Dock>
  );
}

const Dock = styled.div<{ $fullscreen: boolean }>`
  position: absolute;
  right: ${(p) => (p.$fullscreen ? 'var(--space-400)' : 'var(--space-300)')};
  bottom: ${(p) => (p.$fullscreen ? 'var(--space-400)' : 'var(--space-300)')};
  z-index: ${(p) => (p.$fullscreen ? 90 : 5)};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-200);
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  width: min(320px, calc(100% - var(--space-100)));
  max-height: min(320px, 48dvh);
  border-radius: var(--radius-300);
  border: none;
  /* Temporary floating panel — Hello PC container blur recipe. */
  ${containerBlur}
  color: var(--color-text-icon-primary);
  overflow: hidden;
`;

const Handle = styled.div`
  align-self: center;
  width: 32px;
  height: 3px;
  margin-top: var(--space-100);
  border-radius: var(--radius-50);
  background: var(--color-stroke-border-high);
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-100);
  padding: var(--space-100) var(--space-150) var(--space-100) var(--space-250);
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Thread = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
  padding: var(--space-100) var(--space-200) var(--space-150);
`;

const Muted = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  line-height: 1.4;
  color: var(--color-text-icon-secondary);
`;

const BubbleRow = styled.div<{ $role: string }>`
  display: flex;
  align-items: flex-start;
  gap: var(--space-150);
  align-self: ${(p) => (p.$role === 'user' ? 'flex-end' : 'flex-start')};
  max-width: 100%;
`;

const AiAvatar = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: var(--radius-200);
  background: var(--color-primary-primary-overlay);
  color: var(--color-primary-primary);
`;

const Bubble = styled.div<{ $role: string }>`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  max-width: ${(p) => (p.$role === 'assistant' ? '240px' : '92%')};
  padding: var(--space-150) var(--space-200);
  border-radius: ${(p) =>
    p.$role === 'user'
      ? 'var(--radius-200) var(--radius-50) var(--radius-200) var(--radius-200)'
      : 'var(--radius-50) var(--radius-200) var(--radius-200) var(--radius-200)'};
  background: var(--color-surfaces-on-container);
  border: 1px solid var(--color-stroke-border);
`;

const BubbleText = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  line-height: 1.4;
  color: var(--color-text-icon-primary);
`;

const Meta = styled.div<{ $assistant: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--space-050);
  justify-content: ${(p) => (p.$assistant ? 'flex-start' : 'flex-end')};
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const MetaRole = styled.span<{ $assistant: boolean }>`
  font-weight: var(--font-weight-bold);
  color: ${(p) =>
    p.$assistant ? 'var(--color-primary-primary)' : 'var(--color-text-icon-primary)'};
`;

const MetaDot = styled.span`
  opacity: 0.7;
`;

const Reasoning = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const Composer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: var(--space-100);
  padding: var(--space-150) var(--space-200) var(--space-100);
  border-top: 1px solid var(--color-stroke-border);
`;

const FieldGrow = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

const SendBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  margin-bottom: 2px;
  border: none;
  border-radius: var(--radius-1000);
  background: var(--color-primary-primary);
  color: var(--color-text-icon-on-primary);
  cursor: pointer;

  &:disabled {
    background: var(--color-disabled-disabled);
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: 2px;
  }
`;

const PoweredWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-075);
  padding: var(--space-050) var(--space-200) var(--space-150);
`;

const PoweredLabel = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const LenovoMark = styled.img`
  display: block;
  width: 40px;
  height: 14px;
  object-fit: contain;
`;

const Fab = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border: none;
  border-radius: var(--radius-1000);
  background: var(--color-primary-primary);
  color: var(--color-text-icon-on-primary);
  cursor: pointer;
  box-shadow: var(--elevation-3);
  overflow: hidden;

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: 3px;
  }
`;
