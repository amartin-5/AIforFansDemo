import type { SkillLevel } from '../../types/domain';

/** Familiarity with soccer terminology — stored as SkillLevel for compatibility. */
export const TERMINOLOGY_LEVELS: { id: SkillLevel; label: string; hint: string }[] = [
  { id: 'beginner', label: 'Learning', hint: 'New to most soccer terms' },
  { id: 'amateur', label: 'Familiar', hint: 'Know common terms' },
  { id: 'semi-pro', label: 'Fluent', hint: 'Comfortable with jargon' },
  { id: 'pro', label: 'Expert', hint: 'Deep tactical vocabulary' },
];

export const TERMINOLOGY_LABEL: Record<SkillLevel, string> = {
  beginner: 'Learning',
  amateur: 'Familiar',
  'semi-pro': 'Fluent',
  pro: 'Expert',
};
