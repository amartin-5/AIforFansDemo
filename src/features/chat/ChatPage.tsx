import { Badge, IconButton, Spinner } from '@cake-admin/cakeand';
import { History, MessageSquarePlus, Send } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { AppIcon } from '../../components/AppIcon';
import { InterpretationLabel } from '../../components/ai/InterpretationLabel';
import { ErrorState } from '../../components/system/ErrorState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import { DEMO_MATCH_ID, scriptedChatReplies } from '../../data/fixtures/demoSpine';
import { glassFill } from '../../styles/surfaces';
import {
  getConversation,
  startNewChat,
  submitQuery,
} from '../../data/repositories/chatRepository';
import { track } from '../../services/analytics';
import type { ChatConversation, ChatMessage } from '../../types/domain';
import { PoweredByLenovo } from '../auth/AuthBrand';
import { ChatAnalysisCard } from './ChatAnalysisCard';
import { ChatHome } from './ChatHome';
import { VoiceSessionOverlay, type VoiceUiState } from './VoiceSessionOverlay';

type VoiceMode = 'idle' | VoiceUiState;

export function ChatPage() {
  const [params] = useSearchParams();
  const matchId = params.get('matchId') ?? DEMO_MATCH_ID;
  const seededQuery = params.get('q') ?? '';
  const navigate = useNavigate();

  const [convo, setConvo] = useState<ChatConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState(seededQuery);
  const [sending, setSending] = useState(false);
  const [voice, setVoice] = useState<VoiceMode>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState<string | undefined>();
  const threadRef = useRef<HTMLDivElement>(null);
  const voiceTimers = useRef<number[]>([]);

  const clearVoiceTimers = useCallback(() => {
    voiceTimers.current.forEach((id) => window.clearTimeout(id));
    voiceTimers.current = [];
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const c = await getConversation(matchId);
      setConvo(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => () => clearVoiceTimers(), [clearVoiceTimers]);

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [convo?.messages, sending, voice]);

  async function ask(text: string, opts?: { fromVoice?: boolean }) {
    const q = text.trim();
    if (!q || sending) return;
    setSending(true);
    setError(null);
    track('chat_query_submitted', { matchId, length: q.length });
    try {
      const { user, assistant } = await submitQuery(q);
      track('ai_answer_rendered', { matchId });
      setConvo((prev) =>
        prev
          ? {
              ...prev,
              title: prev.messages.length === 0 ? q.slice(0, 42) : prev.title,
              preview: prev.messages.length === 0 ? q : prev.preview,
              updatedAtLabel: 'Just now',
              messages: [...prev.messages, user, assistant],
            }
          : prev,
      );
      setDraft('');
      if (opts?.fromVoice) {
        setVoiceTranscript(assistant.text);
        setVoice('speaking');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to answer');
      if (opts?.fromVoice) setVoice('idle');
    } finally {
      setSending(false);
    }
  }

  function endVoice() {
    clearVoiceTimers();
    setVoice('idle');
    setVoiceTranscript(undefined);
  }

  function openHistory() {
    endVoice();
    navigate('/chat/history');
  }

  async function handleNewChat() {
    endVoice();
    track('chat_new_started', { from: 'chat' });
    setLoading(true);
    try {
      const next = await startNewChat();
      setConvo(next);
      setDraft('');
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to start a new chat');
    } finally {
      setLoading(false);
    }
  }

  function runVoiceAsk() {
    clearVoiceTimers();
    setVoiceTranscript(undefined);
    setVoice('listening');
    voiceTimers.current.push(
      window.setTimeout(() => setVoice('processing'), 1000),
      window.setTimeout(() => {
        void ask('Why did Paralluelo’s goal matter for Spain’s press?', {
          fromVoice: true,
        }).then(() => {
          setVoiceTranscript(scriptedChatReplies.voice);
        });
      }, 1800),
    );
  }

  if (loading) {
    return (
      <ChatShell aria-label="AI Chat">
        <SkeletonBlock label="Loading chat" />
      </ChatShell>
    );
  }

  if (!convo) {
    return (
      <ChatShell aria-label="AI Chat">
        <ErrorState message={error ?? 'Chat unavailable'} onRetry={() => void load()} />
      </ChatShell>
    );
  }

  const isHome = convo.messages.length === 0 && voice === 'idle';
  const voiceActive = voice !== 'idle';

  return (
    <ChatShell aria-label="AI Chat">
      <PageHeader>
        <TitleRow>
          <Title>AI chat</Title>
          <Badge color="primary" tone="subtle" dot={false}>
            Pro
          </Badge>
        </TitleRow>
        <HeaderActions>
          <IconButton
            label="Chat history"
            icon={<History size={18} />}
            size="sm"
            intent="secondary"
            variant="ghost"
            onClick={openHistory}
          />
          <IconButton
            label="New chat"
            icon={<MessageSquarePlus size={18} />}
            size="sm"
            intent="secondary"
            variant="ghost"
            onClick={() => void handleNewChat()}
          />
        </HeaderActions>
      </PageHeader>

      <Main ref={threadRef} data-home={isHome ? 'true' : undefined}>
        {isHome ? (
          <ChatHome
            requests={convo.popularRequests}
            onSelect={(req) => {
              track('suggested_prompt_selected', { matchId, id: req.id });
              void ask(req.prompt);
            }}
          />
        ) : (
          <Thread aria-live="polite">
            {convo.messages.map((m) => (
              <MessageRow key={m.id} message={m} />
            ))}
            {sending && voice === 'idle' ? (
              <Reasoning>
                <Spinner size="sm" aria-label="Preparing answer" />
                <span>Preparing a concise answer…</span>
              </Reasoning>
            ) : null}
            {error ? <ErrorState message={error} onRetry={() => setError(null)} /> : null}
          </Thread>
        )}
      </Main>

      {!voiceActive ? (
        <ComposerDock>
          <Composer>
            <Field
              aria-label="Ask about this match or your team"
              placeholder="Send a message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void ask(draft);
                }
              }}
            />
            <IconButton
              label="Start voice"
              icon={<WaveGlyph />}
              size="lg"
              intent="secondary"
              variant="outline"
              onClick={() => void runVoiceAsk()}
              disabled={sending}
            />
            <IconButton
              label="Send"
              icon={<Send size={18} />}
              size="lg"
              intent="primary"
              variant="fill"
              onClick={() => void ask(draft)}
              disabled={!draft.trim() || sending}
            />
          </Composer>
          <PoweredByLenovo compact />
        </ComposerDock>
      ) : null}

      {voiceActive ? (
        <VoiceSessionOverlay
          state={voice}
          transcript={voiceTranscript}
          onSwitchToKeyboard={endVoice}
          onShowHistory={openHistory}
          onClose={endVoice}
        />
      ) : null}
    </ChatShell>
  );
}

function MessageRow({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const wide = Boolean(message.analysis);
  return (
    <Row $role={message.role}>
      {!isUser ? (
        <AiAvatar aria-hidden>
          <AppIcon size={20} />
        </AiAvatar>
      ) : null}
      <BubbleCol $align={isUser ? 'end' : 'start'} $wide={wide}>
        {message.analysis ? (
          <ChatAnalysisCard analysis={message.analysis} />
        ) : (
          <Bubble $role={message.role}>
            {message.isInterpretation ? <InterpretationLabel kind="interpretation" /> : null}
            <BubbleText>{message.text}</BubbleText>
          </Bubble>
        )}
        <Meta $align={isUser ? 'end' : 'start'}>
          <MetaRole $ai={!isUser}>{isUser ? 'You' : 'AI'}</MetaRole>
          <MetaDot aria-hidden />
          <span>{message.createdAtLabel}</span>
        </Meta>
      </BubbleCol>
    </Row>
  );
}

function WaveGlyph() {
  return (
    <MiniWave aria-hidden>
      <i />
      <i />
      <i />
      <i />
      <i />
    </MiniWave>
  );
}

const ChatShell = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PageHeader = styled.header`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  padding: var(--space-100) var(--space-250) var(--space-100) var(--space-300);
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-050);
  flex-shrink: 0;
`;

const Main = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
`;

const Thread = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-250);
  padding: var(--space-150) var(--space-300) var(--space-250);
  justify-content: flex-end;
  min-height: 100%;
`;

const Row = styled.div<{ $role: string }>`
  display: flex;
  align-items: flex-start;
  gap: var(--space-150);
  justify-content: ${(p) => (p.$role === 'user' ? 'flex-end' : 'flex-start')};
  width: 100%;
`;

const AiAvatar = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-300);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surfaces-on-container);
`;

const BubbleCol = styled.div<{ $align: 'start' | 'end'; $wide?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(p) => (p.$align === 'end' ? 'flex-end' : 'flex-start')};
  gap: var(--space-050);
  max-width: ${(p) => (p.$wide ? '100%' : 'min(100%, 320px)')};
  flex: ${(p) => (p.$wide ? '1 1 auto' : '0 1 auto')};
  min-width: 0;
`;

const Bubble = styled.div<{ $role: string }>`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  padding: var(--space-150) var(--space-250);
  border-radius: ${(p) =>
    p.$role === 'user'
      ? 'var(--radius-300) var(--radius-50) var(--radius-300) var(--radius-300)'
      : 'var(--radius-50) var(--radius-300) var(--radius-300) var(--radius-300)'};
  background: ${(p) =>
    p.$role === 'user'
      ? 'var(--color-surfaces-on-container)'
      : glassFill};
  backdrop-filter: ${(p) =>
    p.$role === 'user' ? 'none' : 'blur(45px) saturate(1.4)'};
  -webkit-backdrop-filter: ${(p) =>
    p.$role === 'user' ? 'none' : 'blur(45px) saturate(1.4)'};
  box-shadow: ${(p) =>
    p.$role === 'user' ? 'none' : 'var(--elevation-3)'};
`;

const BubbleText = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.45;
  color: var(--color-text-icon-primary);
`;

const Meta = styled.div<{ $align: 'start' | 'end' }>`
  display: flex;
  align-items: center;
  gap: var(--space-075);
  justify-content: ${(p) => (p.$align === 'end' ? 'flex-end' : 'flex-start')};
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const MetaRole = styled.span<{ $ai?: boolean }>`
  font-weight: var(--font-weight-bold);
  color: ${(p) =>
    p.$ai ? 'var(--color-primary-primary)' : 'var(--color-text-icon-primary)'};
`;

const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: var(--radius-1000);
  background: var(--color-text-icon-secondary);
`;

const Reasoning = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-150);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const ComposerDock = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  padding: var(--space-150) var(--space-300) var(--space-100);
  padding-bottom: calc(var(--space-100) + env(safe-area-inset-bottom, 0px));
`;

const Composer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
`;

const Field = styled.input`
  flex: 1 1 auto;
  min-width: 0;
  height: 48px;
  padding: 0 var(--space-300);
  border-radius: var(--radius-1000);
  border: var(--stroke-100) solid var(--color-stroke-border-container-os);
  background: ${glassFill};
  background-clip: padding-box;
  backdrop-filter: blur(45px) saturate(1.4);
  -webkit-backdrop-filter: blur(45px) saturate(1.4);
  box-shadow: var(--elevation-3);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);

  &::placeholder {
    color: var(--color-text-icon-placeholder);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--color-primary-primary);
  }
`;

const MiniWave = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 18px;

  i {
    display: block;
    width: 2px;
    border-radius: var(--radius-50);
    background: currentColor;
  }

  i:nth-child(1) {
    height: 8px;
  }
  i:nth-child(2) {
    height: 14px;
  }
  i:nth-child(3) {
    height: 18px;
  }
  i:nth-child(4) {
    height: 12px;
  }
  i:nth-child(5) {
    height: 6px;
  }
`;
