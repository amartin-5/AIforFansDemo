import { IconButton } from '@cake-admin/cakeand';
import { ArrowLeft, MessageSquarePlus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageScroll } from '../../components/layout/PageScroll';
import { restingTile } from '../../styles/surfaces';
import { EmptyState } from '../../components/system/EmptyState';
import { ErrorState } from '../../components/system/ErrorState';
import { SkeletonBlock } from '../../components/system/SkeletonBlock';
import {
  getConversationById,
  listChatHistory,
  startNewChat,
} from '../../data/repositories/chatRepository';
import { track } from '../../services/analytics';
import type { ChatHistoryItem } from '../../types/domain';

export function ChatHistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listChatHistory());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function openChat(id: string) {
    track('chat_history_opened', { id });
    await getConversationById(id);
    navigate('/chat');
  }

  async function createNew() {
    track('chat_new_started', { from: 'history' });
    await startNewChat();
    navigate('/chat');
  }

  if (loading) {
    return (
      <PageScroll label="Chat history">
        <SkeletonBlock label="Loading chat history" />
      </PageScroll>
    );
  }

  if (error) {
    return (
      <PageScroll label="Chat history">
        <ErrorState message={error} onRetry={() => void load()} />
      </PageScroll>
    );
  }

  return (
    <PageScroll label="Chat history" compact>
      <Header>
        <IconButton
          label="Back to chat"
          icon={<ArrowLeft size={20} />}
          size="sm"
          intent="secondary"
          variant="ghost"
          onClick={() => navigate('/chat')}
        />
        <Title>Chat history</Title>
        <IconButton
          label="New chat"
          icon={<MessageSquarePlus size={20} />}
          size="sm"
          intent="secondary"
          variant="ghost"
          onClick={() => void createNew()}
        />
      </Header>

      {items.length === 0 ? (
        <EmptyState
          title="No chats yet"
          description="Start a conversation from AI chat, then revisit it here."
        />
      ) : (
        <List role="list">
          {items.map((item) => (
            <Row
              key={item.id}
              type="button"
              role="listitem"
              onClick={() => void openChat(item.id)}
            >
              <RowCopy>
                <RowTitle>{item.title}</RowTitle>
                <RowPreview>{item.preview}</RowPreview>
              </RowCopy>
              <RowMeta>
                <Time>{item.updatedAtLabel}</Time>
                <Count>
                  {item.messageCount} msg{item.messageCount === 1 ? '' : 's'}
                </Count>
              </RowMeta>
            </Row>
          ))}
        </List>
      )}
    </PageScroll>
  );
}

const Header = styled.header`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: var(--space-100);
  padding: var(--space-100) 0 var(--space-300);
`;

const Title = styled.h1`
  margin: 0;
  text-align: center;
  font-family: var(--font-family);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  padding-bottom: var(--space-400);
`;

const Row = styled.button`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-200);
  width: 100%;
  margin: 0;
  padding: var(--space-250) var(--space-300);
  border: none;
  ${restingTile}
  text-align: left;
  cursor: pointer;
  color: inherit;
  font: inherit;

  &:focus-visible {
    outline: 2px solid var(--color-primary-primary);
    outline-offset: 2px;
  }
`;

const RowCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  min-width: 0;
  flex: 1 1 auto;
`;

const RowTitle = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RowPreview = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RowMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-050);
  flex-shrink: 0;
`;

const Time = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-secondary);
`;

const Count = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-placeholder);
`;
