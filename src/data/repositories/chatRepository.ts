import {
  defaultChat,
  demoChatAnalysis,
  scriptedChatReplies,
  seedChatHistory,
} from '../fixtures/demoSpine';
import type {
  ChatConversation,
  ChatHistoryItem,
  ChatMessage,
} from '../../types/domain';

export type RepoOptions = { delayMs?: number; fail?: boolean };

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function blankChat(id = `chat-${Date.now()}`): ChatConversation {
  const base = structuredClone(defaultChat);
  return {
    ...base,
    id,
    title: 'New chat',
    preview: undefined,
    updatedAtLabel: 'Just now',
    messages: [],
  };
}

function titleFromQuery(query: string): string {
  const t = query.trim();
  if (t.length <= 42) return t;
  return `${t.slice(0, 39)}…`;
}

let conversations: ChatConversation[] = [
  structuredClone(defaultChat),
  ...structuredClone(seedChatHistory),
];
let activeId = defaultChat.id;

export function resetChatConversation() {
  conversations = [structuredClone(defaultChat), ...structuredClone(seedChatHistory)];
  activeId = defaultChat.id;
}

function activeConversation(): ChatConversation {
  return conversations.find((c) => c.id === activeId) ?? conversations[0];
}

function upsertActive(next: ChatConversation) {
  const idx = conversations.findIndex((c) => c.id === next.id);
  if (idx >= 0) conversations[idx] = next;
  else conversations = [next, ...conversations];
  activeId = next.id;
}

export async function getConversation(
  matchId?: string,
  options?: RepoOptions,
): Promise<ChatConversation> {
  const delay = options?.delayMs ?? 220;
  if (delay > 0) await wait(delay);
  if (options?.fail) throw new Error('Unable to load chat.');
  const convo = activeConversation();
  return {
    ...convo,
    matchId: matchId ?? convo.matchId,
  };
}

export async function getConversationById(
  id: string,
  options?: RepoOptions,
): Promise<ChatConversation> {
  const delay = options?.delayMs ?? 180;
  if (delay > 0) await wait(delay);
  if (options?.fail) throw new Error('Unable to load chat.');
  const found = conversations.find((c) => c.id === id);
  if (!found) throw new Error('Chat not found.');
  activeId = found.id;
  return structuredClone(found);
}

export async function listChatHistory(options?: RepoOptions): Promise<ChatHistoryItem[]> {
  const delay = options?.delayMs ?? 180;
  if (delay > 0) await wait(delay);
  if (options?.fail) throw new Error('Unable to load chat history.');

  return conversations
    .filter((c) => c.messages.length > 0)
    .map((c) => ({
      id: c.id,
      title: c.title,
      preview:
        c.preview ??
        c.messages.find((m) => m.role === 'user')?.text ??
        'Conversation',
      updatedAtLabel: c.updatedAtLabel,
      messageCount: c.messages.length,
    }));
}

/** Starts a fresh empty homepage chat and makes it active. */
export async function startNewChat(options?: RepoOptions): Promise<ChatConversation> {
  const delay = options?.delayMs ?? 80;
  if (delay > 0) await wait(delay);
  if (options?.fail) throw new Error('Unable to start a new chat.');

  const current = activeConversation();
  // Reuse an already-empty active chat instead of stacking blanks.
  if (current.messages.length === 0) {
    return structuredClone(current);
  }

  const next = blankChat();
  conversations = [next, ...conversations];
  activeId = next.id;
  return structuredClone(next);
}

function pickReply(query: string): Pick<ChatMessage, 'text' | 'analysis'> {
  const q = query.toLowerCase();
  if (q.includes('press') || q.includes('breakdown') || q.includes('collapse')) {
    return {
      text: scriptedChatReplies.press,
      analysis: structuredClone(demoChatAnalysis),
    };
  }
  if (q.includes('paralluelo') || q.includes('goal')) {
    return { text: scriptedChatReplies.paralluelo };
  }
  if (q.includes('carmona')) {
    return { text: scriptedChatReplies.carmona };
  }
  if (q.includes('formation') || q.includes('lineup') || q.includes('4-3-3') || q.includes('433')) {
    return { text: scriptedChatReplies.formation };
  }
  if (q.includes('next') || q.includes('final') || q.includes('friendly')) {
    return { text: scriptedChatReplies.next };
  }
  if (q.includes('possession')) {
    return { text: scriptedChatReplies.possession };
  }
  if (q.includes('offside')) {
    return { text: scriptedChatReplies.offside };
  }
  if (q.includes('brazil') || q.includes('argentina') || q.includes('rival')) {
    return { text: scriptedChatReplies.rivalry };
  }
  return { text: scriptedChatReplies.default };
}

export async function submitQuery(
  text: string,
  options?: RepoOptions,
): Promise<{ user: ChatMessage; assistant: ChatMessage }> {
  const delay = options?.delayMs ?? 600;
  if (delay > 0) await wait(delay);
  if (options?.fail) throw new Error('Unable to get an answer. Try again.');

  const reply = pickReply(text);
  const current = activeConversation();
  const user: ChatMessage = {
    id: `u-${Date.now()}`,
    role: 'user',
    text,
    createdAtLabel: 'Now',
  };
  const assistant: ChatMessage = {
    id: `a-${Date.now()}`,
    role: 'assistant',
    text: reply.text,
    createdAtLabel: 'Now',
    isInterpretation: true,
    linkedMatchId: current.matchId,
    analysis: reply.analysis,
  };

  const isFirst = current.messages.length === 0;
  const next: ChatConversation = {
    ...current,
    title: isFirst ? titleFromQuery(text) : current.title,
    preview: isFirst ? text : current.preview,
    updatedAtLabel: 'Just now',
    messages: [...current.messages, user, assistant],
  };
  upsertActive(next);
  return { user, assistant };
}
