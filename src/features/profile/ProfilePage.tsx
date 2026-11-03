import { Avatar, Badge, Button, Card, Divider, IconButton } from '@cake-admin/cakeand';
import { Flag, Pencil, Settings, Share2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageScroll } from '../../components/layout/PageScroll';
import { ErrorState } from '../../components/system/ErrorState';
import { track } from '../../services/analytics';
import { useAccount } from '../auth/AccountContext';
import { TERMINOLOGY_LABEL } from '../auth/terminologyFamiliarity';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAccount();

  if (!user) {
    return (
      <PageScroll label="Profile">
        <ErrorState message="Missing profile" onRetry={() => navigate('/home')} />
      </PageScroll>
    );
  }

  return (
    <PageScroll label="Profile" compact>
      <Hero>
        <HeroTop>
          <IconButton
            label="Settings"
            icon={<Settings size={16} />}
            intent="secondary"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
          />
          <IconButton
            label="Edit profile"
            icon={<Pencil size={16} />}
            intent="secondary"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/create-profile')}
          />
        </HeroTop>
        <AvatarWrap>
          <Avatar size="lg" initials={user.initials} alt={user.displayName} />
        </AvatarWrap>
        <Title>{user.displayName}</Title>
        {user.email ? <Sub>{user.email}</Sub> : null}
        {user.preferences.skillLevel ? (
          <Badge color="primary" tone="subtle" dot={false}>
            Terminology · {TERMINOLOGY_LABEL[user.preferences.skillLevel]}
          </Badge>
        ) : null}
      </Hero>

      <Card>
        <SectionPad>
          <SectionTitle>Team affiliations</SectionTitle>
          <Divider weight="weak" />
          <DetailRow>
            <DetailLeft>
              <IconFrame aria-hidden>
                <Flag size={18} />
              </IconFrame>
              <DetailCopy>
                <DetailLabel>Nationality</DetailLabel>
                <DetailValue>{user.preferences.nationality ?? 'Not set'}</DetailValue>
              </DetailCopy>
            </DetailLeft>
            <Mark aria-hidden>
              {(user.preferences.nationality ?? '?').slice(0, 3).toUpperCase()}
            </Mark>
          </DetailRow>
          <Divider weight="weak" />
          <DetailRow>
            <DetailLeft>
              <IconFrame aria-hidden>
                <Shield size={18} />
              </IconFrame>
              <DetailCopy>
                <DetailLabel>Club team support</DetailLabel>
                <DetailValue>{user.preferences.clubAffiliation ?? 'Not set'}</DetailValue>
              </DetailCopy>
            </DetailLeft>
            <Button intent="secondary" variant="ghost" size="sm" onClick={() => navigate('/my-team')}>
              My Team
            </Button>
          </DetailRow>
        </SectionPad>
      </Card>

      <Actions>
        <Button
          intent="secondary"
          variant="outline"
          fullWidth
          startIcon={<Settings size={16} />}
          onClick={() => navigate('/settings')}
        >
          Settings
        </Button>
        <Button
          intent="primary"
          variant="outline"
          fullWidth
          endIcon={<Share2 size={16} />}
          onClick={() => {
            if (navigator.share) {
              void navigator.share({
                title: 'AI for Fans',
                text: `${user.displayName} on AI for Fans`,
              });
            }
            track('favorite_team_updated', { field: 'share_profile' });
          }}
        >
          Share
        </Button>
      </Actions>
    </PageScroll>
  );
}

const Hero = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-150);
  width: 100%;
  padding: var(--space-100) 0 var(--space-100);
`;

const HeroTop = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-050);
  width: 100%;
`;

const AvatarWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-050);
  border-radius: var(--radius-1000);
  outline: var(--stroke-200) solid var(--color-primary-primary);
  outline-offset: var(--space-050);
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
  text-align: center;
`;

const Sub = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-secondary);
  text-align: center;
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

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  width: 100%;
`;

const DetailLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-200);
  min-width: 0;
`;

const IconFrame = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: var(--radius-150);
  border: var(--stroke-100) solid var(--color-stroke-border);
  background: var(--color-surfaces-on-container);
  color: var(--color-text-icon-secondary);
`;

const DetailCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-025);
  min-width: 0;
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

const Mark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  padding: var(--space-050) var(--space-100);
  border-radius: var(--radius-100);
  background: var(--color-primary-primary-overlay);
  color: var(--color-primary-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  width: 100%;
`;
