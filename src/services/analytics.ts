/** Mock analytics sink — no PII, no full chat text. */

export type AnalyticsEventName =
  | 'app_opened'
  | 'destination_viewed'
  | 'match_opened'
  | 'preview_opened'
  | 'where_to_watch_selected'
  | 'stream_login_opened'
  | 'stream_provider_linked'
  | 'stream_watch_started'
  | 'match_chat_opened'
  | 'reminder_created'
  | 'timeline_event_selected'
  | 'ai_insight_opened'
  | 'explanation_expanded'
  | 'replay_opened'
  | 'suggested_prompt_selected'
  | 'chat_query_submitted'
  | 'chat_new_started'
  | 'chat_history_opened'
  | 'ai_answer_rendered'
  | 'evidence_opened'
  | 'recap_opened'
  | 'defining_moment_opened'
  | 'next_match_opened'
  | 'favorite_team_updated'
  | 'auth_welcome_continued'
  | 'auth_sign_in'
  | 'auth_sign_up'
  | 'auth_profile_completed'
  | 'auth_sign_out';

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

type AnalyticsRecord = {
  name: AnalyticsEventName;
  props?: AnalyticsProps;
  at: number;
};

const buffer: AnalyticsRecord[] = [];

export function track(name: AnalyticsEventName, props?: AnalyticsProps): void {
  const entry = { name, props, at: Date.now() };
  buffer.push(entry);
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', name, props ?? {});
  }
}

export function getAnalyticsBuffer(): readonly AnalyticsRecord[] {
  return buffer;
}

export function clearAnalyticsBuffer(): void {
  buffer.length = 0;
}
