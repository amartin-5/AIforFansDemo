import { Button, Divider, Switch } from '@cake-admin/cakeand';
import { GlassCard } from '../../components/GlassCard';
import { ChevronRight, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageScroll } from '../../components/layout/PageScroll';
import { ProviderMark } from '../../components/match/ProviderMark';
import { viewingProviders } from '../../data/fixtures/demoSpine';
import { track } from '../../services/analytics';
import type { FanPreferences, User, ViewingProvider } from '../../types/domain';
import { useAccount } from '../auth/AccountContext';
import { TERMINOLOGY_LABEL } from '../auth/terminologyFamiliarity';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAccount();

  if (!user) {
    return (
      <PageScroll label="Settings">
        <Title>Settings</Title>
        <Sub>Sign in to manage preferences.</Sub>
      </PageScroll>
    );
  }

  const prefs = user.preferences;
  const linkedIds = new Set(prefs.preferredProviderIds);
  const linked = viewingProviders.filter((p) => linkedIds.has(p.id) || p.linked);
  const available = viewingProviders.filter((p) => !linkedIds.has(p.id) && !p.linked);

  function patchPrefs(partial: Partial<FanPreferences>, field: string) {
    const next: User = {
      ...user!,
      preferences: {
        ...user!.preferences,
        ...partial,
      },
    };
    updateUser(next);
    track('favorite_team_updated', { field });
  }

  function toggleProvider(provider: ViewingProvider) {
    const ids = new Set(user!.preferences.preferredProviderIds);
    if (ids.has(provider.id)) ids.delete(provider.id);
    else ids.add(provider.id);
    patchPrefs({ preferredProviderIds: [...ids] }, `stream_${provider.id}`);
    track('where_to_watch_selected', {
      provider: provider.id,
      linked: ids.has(provider.id),
    });
  }

  return (
    <PageScroll label="Settings" compact>
      <Header>
        <Title>Settings</Title>
        <Sub>Notifications, streaming, and app preferences.</Sub>
      </Header>

      <GlassCard>
        <SectionPad>
          <SectionTitle>Notifications</SectionTitle>
          <Divider weight="weak" />
          <ToggleRow>
            <DetailCopy>
              <DetailLabel>Match alerts</DetailLabel>
              <DetailValue>Kick-off reminders and live updates</DetailValue>
            </DetailCopy>
            <Switch
              checked={prefs.notificationsEnabled}
              onCheckedChange={(checked) =>
                patchPrefs({ notificationsEnabled: checked }, 'notifications_enabled')
              }
              aria-label="Match alerts"
            />
          </ToggleRow>
          <Divider weight="weak" />
          <ToggleRow>
            <DetailCopy>
              <DetailLabel>Scores in push</DetailLabel>
              <DetailValue>Show scores & results in push alerts</DetailValue>
            </DetailCopy>
            <Switch
              checked={prefs.spoilersInPush ?? false}
              onCheckedChange={(checked) =>
                patchPrefs({ spoilersInPush: checked }, 'spoilers_push')
              }
              aria-label="Show scores and results in push alerts"
            />
          </ToggleRow>
          <Divider weight="weak" />
          <ToggleRow>
            <DetailCopy>
              <DetailLabel>Scores in app</DetailLabel>
              <DetailValue>Show goal scorers & match results</DetailValue>
            </DetailCopy>
            <Switch
              checked={prefs.spoilersInApp ?? true}
              onCheckedChange={(checked) =>
                patchPrefs({ spoilersInApp: checked }, 'spoilers_in_app')
              }
              aria-label="Show goal scorers and match results in app"
            />
          </ToggleRow>
        </SectionPad>
      </GlassCard>

      <GlassCard>
        <SectionPad>
          <SectionTitle>Streaming services</SectionTitle>
          <Divider weight="weak" />
          <Hint>
            <Tv size={14} aria-hidden />
            Linked services unlock in-app watch for available matches.
          </Hint>
          {linked.length > 0 ? (
            <ProviderGroup>
              <GroupLabel>Linked</GroupLabel>
              {linked.map((provider) => (
                <ProviderRow
                  key={provider.id}
                  provider={provider}
                  linked
                  onToggle={() => toggleProvider(provider)}
                />
              ))}
            </ProviderGroup>
          ) : null}
          {available.length > 0 ? (
            <ProviderGroup>
              <GroupLabel>Available to link</GroupLabel>
              {available.map((provider) => (
                <ProviderRow
                  key={provider.id}
                  provider={provider}
                  onToggle={() => toggleProvider(provider)}
                />
              ))}
            </ProviderGroup>
          ) : null}
        </SectionPad>
      </GlassCard>

      <GlassCard>
        <SectionPad>
          <SectionTitle>Playback & feel</SectionTitle>
          <Divider weight="weak" />
          <ToggleRow>
            <DetailCopy>
              <DetailLabel>Autoplay replays</DetailLabel>
              <DetailValue>Play short moment clips when opened</DetailValue>
            </DetailCopy>
            <Switch
              checked={prefs.autoplayReplays ?? true}
              onCheckedChange={(checked) =>
                patchPrefs({ autoplayReplays: checked }, 'autoplay_replays')
              }
              aria-label="Autoplay moment replays"
            />
          </ToggleRow>
          <Divider weight="weak" />
          <ToggleRow>
            <DetailCopy>
              <DetailLabel>Haptics</DetailLabel>
              <DetailValue>Vibrate on key actions</DetailValue>
            </DetailCopy>
            <Switch
              checked={prefs.hapticsEnabled ?? true}
              onCheckedChange={(checked) =>
                patchPrefs({ hapticsEnabled: checked }, 'haptics')
              }
              aria-label="Haptic feedback"
            />
          </ToggleRow>
        </SectionPad>
      </GlassCard>

      <GlassCard>
        <SectionPad>
          <SectionTitle>Privacy</SectionTitle>
          <Divider weight="weak" />
          <ToggleRow>
            <DetailCopy>
              <DetailLabel>Product analytics</DetailLabel>
              <DetailValue>Help improve AI for Fans (no chat text)</DetailValue>
            </DetailCopy>
            <Switch
              checked={prefs.analyticsEnabled ?? true}
              onCheckedChange={(checked) =>
                patchPrefs({ analyticsEnabled: checked }, 'analytics')
              }
              aria-label="Product analytics"
            />
          </ToggleRow>
        </SectionPad>
      </GlassCard>

      <GlassCard>
        <SectionPad>
          <SectionTitle>Account</SectionTitle>
          <Divider weight="weak" />
          <NavRow type="button" onClick={() => navigate('/create-profile')}>
            <DetailCopy>
              <DetailLabel>Edit profile</DetailLabel>
              <DetailValue>
                {user.displayName}
                {prefs.skillLevel
                  ? ` · ${TERMINOLOGY_LABEL[prefs.skillLevel]}`
                  : ''}
              </DetailValue>
            </DetailCopy>
            <ChevronRight size={18} aria-hidden />
          </NavRow>
          <Divider weight="weak" />
          <NavRow type="button" onClick={() => navigate('/profile')}>
            <DetailCopy>
              <DetailLabel>View profile</DetailLabel>
              <DetailValue>Affiliations and identity</DetailValue>
            </DetailCopy>
            <ChevronRight size={18} aria-hidden />
          </NavRow>
        </SectionPad>
      </GlassCard>

      <Button intent="secondary" variant="ghost" fullWidth onClick={() => navigate(-1)}>
        Done
      </Button>
    </PageScroll>
  );
}

function ProviderRow({
  provider,
  linked = false,
  onToggle,
}: {
  provider: ViewingProvider;
  linked?: boolean;
  onToggle: () => void;
}) {
  return (
    <ProviderButton type="button" $linked={linked} onClick={onToggle}>
      <ProviderLeft>
        <ProviderMark provider={provider} />
        <ProviderName>{provider.name}</ProviderName>
      </ProviderLeft>
      <LinkState>{linked ? 'Unlink' : 'Link'}</LinkState>
    </ProviderButton>
  );
}

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  width: 100%;
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Sub = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-secondary);
`;

const SectionPad = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-250);
  padding: var(--space-400);
  width: 100%;
  box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-icon-primary);
`;

const Hint = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-100);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  width: 100%;
`;

const DetailCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-025);
  min-width: 0;
  flex: 1;
`;

const DetailLabel = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-icon-secondary);
`;

const DetailValue = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-icon-primary);
`;

const ProviderGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
  width: 100%;
`;

const GroupLabel = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-icon-secondary);
`;

const ProviderButton = styled.button<{ $linked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  width: 100%;
  min-height: 56px;
  padding: 0 var(--space-250);
  border-radius: var(--radius-200);
  border: var(--stroke-100) solid
    ${(p) =>
      p.$linked ? 'var(--color-stroke-border)' : 'var(--color-stroke-border-low)'};
  background: var(--color-surfaces-on-container);
  color: var(--color-text-icon-secondary);
  cursor: pointer;
  text-align: left;
  font: inherit;
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
  color: var(--color-text-icon-primary);
`;

const LinkState = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-primary);
  flex-shrink: 0;
`;

const NavRow = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-icon-secondary);
  cursor: pointer;
  text-align: left;
  font: inherit;
  min-height: 44px;
`;
