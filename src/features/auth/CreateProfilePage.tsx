import { Avatar, Button, Dropdown, TextInput } from '@cake-admin/cakeand';
import { GlassCard } from '../../components/GlassCard';
import { ArrowRight, Camera, Check, ChevronRight, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ProviderMark } from '../../components/match/ProviderMark';
import { viewingProviders } from '../../data/fixtures/demoSpine';
import { glassFill } from '../../styles/surfaces';
import { useStreamingAuth } from '../../hooks/useStreamingAuth';
import type { SkillLevel } from '../../types/domain';
import { useAccount } from './AccountContext';
import { AuthBack } from './AuthBack';
import { AuthBrand } from './AuthBrand';
import { AuthShell } from './AuthShell';
import { initialsFromName } from './accountStorage';
import { TERMINOLOGY_LEVELS } from './terminologyFamiliarity';

const NONE = 'none';

const NATIONALITY_OPTIONS = [
  { label: 'None', value: NONE },
  { label: 'Portugal', value: 'Portugal' },
  { label: 'Spain', value: 'Spain' },
  { label: 'England', value: 'England' },
  { label: 'United States', value: 'United States' },
  { label: 'Brazil', value: 'Brazil' },
  { label: 'France', value: 'France' },
];

const CLUB_OPTIONS = [
  { label: 'None', value: NONE },
  { label: 'Real Madrid CF', value: 'Real Madrid CF' },
  { label: 'FC Barcelona', value: 'FC Barcelona' },
  { label: 'Manchester City', value: 'Manchester City' },
  { label: 'Arsenal', value: 'Arsenal' },
];

/** Map club affiliation → demo favorite national team when relevant. */
const CLUB_TO_TEAM: Record<string, string> = {
  'Real Madrid CF': 'spain',
  'FC Barcelona': 'spain',
  Arsenal: 'england',
  'Manchester City': 'england',
};

function emptyOrStored(value: string | undefined, fallback = NONE): string {
  if (!value || value === 'None') return fallback;
  return value;
}

export function CreateProfilePage() {
  const navigate = useNavigate();
  const { completeProfile, session, user, isAuthenticated, isOnboarded } = useAccount();
  const { linkProvider } = useStreamingAuth();

  const editing = Boolean(isOnboarded && user);

  const [displayName, setDisplayName] = useState(editing ? user!.displayName : '');
  const [nationality, setNationality] = useState(
    editing ? emptyOrStored(user!.preferences.nationality) : NONE,
  );
  const [clubAffiliation, setClubAffiliation] = useState(
    editing ? emptyOrStored(user!.preferences.clubAffiliation) : NONE,
  );
  const [skillLevel, setSkillLevel] = useState<SkillLevel | null>(
    editing ? (user!.preferences.skillLevel ?? null) : null,
  );
  const [selectedProviders, setSelectedProviders] = useState<string[]>(
    editing ? user!.preferences.preferredProviderIds : [],
  );

  useEffect(() => {
    if (!user || !isOnboarded) return;
    setDisplayName(user.displayName);
    setNationality(emptyOrStored(user.preferences.nationality));
    setClubAffiliation(emptyOrStored(user.preferences.clubAffiliation));
    setSkillLevel(user.preferences.skillLevel ?? null);
    setSelectedProviders(user.preferences.preferredProviderIds);
  }, [user, isOnboarded]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const toggleProvider = (id: string) => {
    setSelectedProviders((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const avatarInitials = displayName.trim() ? initialsFromName(displayName) : undefined;

  const handleContinue = () => {
    const club = clubAffiliation === NONE ? '' : clubAffiliation;
    const nation = nationality === NONE ? '' : nationality;
    const favoriteTeamId =
      CLUB_TO_TEAM[club] ??
      (nation === 'Spain' ? 'spain' : nation === 'England' ? 'england' : 'spain');

    const nextUser = completeProfile({
      displayName: displayName.trim() || 'Fan',
      nationality: nation || 'None',
      clubAffiliation: club || 'None',
      favoriteTeamId,
      skillLevel: skillLevel ?? 'beginner',
      preferredProviderIds: selectedProviders,
    });

    if (nextUser.preferences.preferredProviderIds[0]) {
      linkProvider(nextUser.preferences.preferredProviderIds[0]);
    }

    navigate(editing ? '/profile' : '/home', { replace: true });
  };

  const canContinue = Boolean(displayName.trim() && skillLevel);

  return (
    <AuthShell label={editing ? 'Edit profile' : 'Create profile'}>
      <AuthBack
        to={editing ? '/profile' : '/login'}
        label={editing ? 'Back to profile' : 'Back to sign in'}
      />

      <HeaderRow>
        <AuthBrand compact />
        {!editing ? (
          <Steps aria-label="Step 3 of 3">
            <StepDot $active={false} />
            <StepDot $active={false} />
            <StepDot $active />
          </Steps>
        ) : null}
      </HeaderRow>

      <GlassCard>
        <FormPad>
          <FormTitle>{editing ? 'Edit profile' : 'Create profile'}</FormTitle>

          <AvatarBlock>
            <AvatarWrap>
              <Avatar initials={avatarInitials} size="lg" alt={displayName || 'Profile'} />
              <CameraBadge type="button" aria-label="Upload profile picture">
                <Camera size={12} />
              </CameraBadge>
            </AvatarWrap>
            <AvatarHint>Upload profile picture</AvatarHint>
          </AvatarBlock>

          <TextInput
            label="Full name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="None"
            startIcon={<UserRound size={18} />}
            required
          />

          <Dropdown
            label="Nationality / national team"
            options={NATIONALITY_OPTIONS}
            value={nationality}
            onValueChange={setNationality}
            placeholder="None"
          />

          <Dropdown
            label="Club team support / affiliation"
            options={CLUB_OPTIONS}
            value={clubAffiliation}
            onValueChange={setClubAffiliation}
            placeholder="None"
          />

          <Field>
            <FieldLabel id="terminology-label">Terminology familiarity</FieldLabel>
            <FieldHint id="terminology-hint">
              How comfortable are you with soccer terms and jargon?
            </FieldHint>
            <Segment role="group" aria-labelledby="terminology-label" aria-describedby="terminology-hint">
              {TERMINOLOGY_LEVELS.map((level) => (
                <SegBtn
                  key={level.id}
                  type="button"
                  $active={skillLevel === level.id}
                  aria-pressed={skillLevel === level.id}
                  title={level.hint}
                  onClick={() => setSkillLevel(level.id)}
                >
                  {level.label}
                </SegBtn>
              ))}
            </Segment>
          </Field>

          <Field>
            <FieldLabel id="streaming-label">Add your streaming services</FieldLabel>
            <ProviderList role="list" aria-labelledby="streaming-label">
              {viewingProviders.map((provider) => {
                const selected = selectedProviders.includes(provider.id);
                return (
                  <ProviderMain
                    key={provider.id}
                    type="button"
                    role="listitem"
                    $selected={selected}
                    aria-pressed={selected}
                    onClick={() => toggleProvider(provider.id)}
                  >
                    <ProviderLeft>
                      <ProviderMark provider={provider} />
                      <ProviderName>{provider.name}</ProviderName>
                    </ProviderLeft>
                    {selected ? <Check size={18} aria-hidden /> : <ChevronRight size={18} aria-hidden />}
                  </ProviderMain>
                );
              })}
            </ProviderList>
          </Field>

          <Button
            fullWidth
            size="lg"
            endIcon={editing ? undefined : <ArrowRight size={16} />}
            onClick={handleContinue}
            disabled={!canContinue}
          >
            {editing ? 'Save profile' : 'Continue'}
          </Button>

          {session?.email ? <EmailHint>Signed in as {session.email}</EmailHint> : null}
        </FormPad>
      </GlassCard>
    </AuthShell>
  );
}

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: var(--space-200);
`;

const Steps = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
`;

const StepDot = styled.span<{ $active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: var(--radius-1000);
  background: ${(p) =>
    p.$active ? 'var(--color-primary-primary)' : 'var(--color-stroke-border)'};
`;

const FormPad = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-350);
  padding: var(--space-350);
  width: 100%;
  box-sizing: border-box;
`;

const FormTitle = styled.h1`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const AvatarBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-150);
`;

const AvatarWrap = styled.div`
  position: relative;
  display: inline-flex;
`;

const CameraBadge = styled.button`
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 26px;
  height: 26px;
  border-radius: var(--radius-1000);
  border: var(--stroke-200) solid var(--color-surfaces-container);
  background: var(--color-primary-primary);
  color: var(--color-text-icon-on-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: 2px;
  }
`;

const AvatarHint = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  width: 100%;
`;

const FieldLabel = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-secondary);
`;

const FieldHint = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const Segment = styled.div`
  display: flex;
  gap: var(--space-050);
  width: 100%;
  padding: var(--space-050);
  border-radius: var(--radius-200);
  border: 1px solid var(--color-stroke-border);
  background: var(--color-surfaces-on-container);
  box-sizing: border-box;
`;

const SegBtn = styled.button<{ $active?: boolean }>`
  flex: 1 1 0;
  min-width: 0;
  min-height: 36px;
  border: none;
  border-radius: var(--radius-150);
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: ${(p) =>
    p.$active ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)'};
  color: ${(p) =>
    p.$active ? 'var(--color-text-icon-on-primary)' : 'var(--color-text-icon-primary)'};
  background: ${(p) => (p.$active ? 'var(--color-primary-primary)' : 'transparent')};

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: 2px;
  }
`;

const ProviderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
  width: 100%;
`;

const ProviderMain = styled.button<{ $selected?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  min-height: 56px;
  padding: 0 var(--space-300);
  border-radius: var(--radius-200);
  border: ${(p) =>
    p.$selected
      ? 'var(--stroke-200) solid var(--color-primary-primary)'
      : '1px solid var(--color-stroke-border)'};
  background: ${glassFill};
  background-clip: padding-box;
  border: var(--stroke-100) solid var(--color-stroke-border-container-os);
  backdrop-filter: blur(45px) saturate(1.4);
  -webkit-backdrop-filter: blur(45px) saturate(1.4);
  box-shadow: var(--elevation-3);
  color: var(--color-text-icon-primary);
  cursor: pointer;
  font: inherit;
  text-align: left;

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: 2px;
  }
`;

const ProviderLeft = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-200);
  min-width: 0;
`;

const ProviderName = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
`;

const EmailHint = styled.p`
  margin: 0;
  text-align: center;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;
