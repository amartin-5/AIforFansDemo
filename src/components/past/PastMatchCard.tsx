import { Button, SimpleCard } from '@cake-admin/cakeand';
import { GlassCard } from '../GlassCard';
import { Calendar, MapPin } from 'lucide-react';
import styled from 'styled-components';
import type { Competition, Match, Team } from '../../types/domain';
import { TeamIdentity } from '../match/TeamIdentity';

type PastMatchCardProps = {
  match: Match;
  home: Team;
  away: Team;
  competition: Competition;
  stage: string;
  coverImage: string;
  onOpen: () => void;
};

export function PastMatchCard({
  match,
  home,
  away,
  competition,
  stage,
  coverImage,
  onOpen,
}: PastMatchCardProps) {
  const score =
    match.score !== undefined
      ? `${home.name} ${match.score.home} – ${match.score.away} ${away.name}`
      : `${home.name} vs ${away.name}`;

  return (
    <GlassCard>
      <SimpleCard
        media={
          <Media>
            <Cover src={coverImage} alt="" />
            <MediaWash />
          </Media>
        }
        title={score}
        body={
          <BodyStack>
            <Stage>
              {competition.shortName} · {stage}
            </Stage>
            <MetaRow>
              <Meta>
                <Calendar size={14} aria-hidden />
                <span>{match.kickoffLabel}</span>
              </Meta>
              {match.venue ? (
                <Meta>
                  <MapPin size={14} aria-hidden />
                  <span>{match.venue}</span>
                </Meta>
              ) : null}
            </MetaRow>
            <CrestRow aria-hidden>
              <TeamIdentity team={home} size={28} showName={false} />
              <TeamIdentity team={away} size={28} showName={false} />
            </CrestRow>
          </BodyStack>
        }
        actions={
          <Button size="sm" intent="secondary" variant="outline" onClick={onOpen}>
            Open analysis
          </Button>
        }
      />
    </GlassCard>
  );
}

const Media = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  width: 100%;
  overflow: hidden;
  background: var(--color-surfaces-on-container);
`;

const Cover = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MediaWash = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    var(--color-surfaces-container),
    transparent 55%
  );
  pointer-events: none;
`;

const BodyStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
`;

const Stage = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-icon-secondary);
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-200);
`;

const Meta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);

  svg {
    color: var(--color-text-icon-secondary);
  }
`;

const CrestRow = styled.div`
  display: flex;
  gap: var(--space-150);
`;
