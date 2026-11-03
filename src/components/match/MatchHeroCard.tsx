import { Button } from '@cake-admin/cakeand';
import styled from 'styled-components';
import { backgroundImage } from '../../assets/template';
import type { Competition, Match, Team } from '../../types/domain';
import { MatchStatusBadge } from './MatchStatusBadge';
import { ScoreDisplay } from './ScoreDisplay';
import { TeamIdentity } from './TeamIdentity';

type MatchHeroCardProps = {
  match: Match;
  home: Team;
  away: Team;
  competition: Competition;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  /** Editorial media plane matching Figma Matchday hero proportions */
  editorial?: boolean;
};

export function MatchHeroCard({
  match,
  home,
  away,
  competition,
  primaryActionLabel,
  onPrimaryAction,
  editorial = false,
}: MatchHeroCardProps) {
  if (editorial) {
    return (
      <Editorial>
        <HeroMedia aria-hidden>
          <HeroImg src={backgroundImage} alt="" />
          <HeroWash />
        </HeroMedia>
        <HeroContent>
          <TopRow>
            <Comp>{competition.name}</Comp>
            <MatchStatusBadge status={match.status} periodLabel={match.periodLabel} />
          </TopRow>
          <Lockup>
            <TeamIdentity team={home} size={56} />
            <ScoreDisplay
              home={home}
              away={away}
              score={match.score}
              status={match.status}
              periodLabel={match.periodLabel}
            />
            <TeamIdentity team={away} size={56} />
          </Lockup>
          <Meta>
            {match.kickoffLabel}
            {match.venue ? ` · ${match.venue}` : ''}
          </Meta>
          {match.scorersLabel ? <Scorers>{match.scorersLabel}</Scorers> : null}
        </HeroContent>
        {primaryActionLabel && onPrimaryAction ? (
          <ActionPad>
            <Button fullWidth size="md" onClick={onPrimaryAction}>
              {primaryActionLabel}
            </Button>
          </ActionPad>
        ) : null}
      </Editorial>
    );
  }

  return (
    <PlainCard>
      <Pad>
        <TopRow>
          <Comp>{competition.name}</Comp>
          <MatchStatusBadge status={match.status} periodLabel={match.periodLabel} />
        </TopRow>
        <Lockup>
          <TeamIdentity team={home} size={52} />
          <ScoreDisplay
            home={home}
            away={away}
            score={match.score}
            status={match.status}
            periodLabel={match.periodLabel}
          />
          <TeamIdentity team={away} size={52} />
        </Lockup>
        <Meta>
          {match.kickoffLabel}
          {match.venue ? ` · ${match.venue}` : ''}
        </Meta>
        {match.scorersLabel ? <Scorers>{match.scorersLabel}</Scorers> : null}
        {primaryActionLabel && onPrimaryAction ? (
          <Button fullWidth size="md" onClick={onPrimaryAction}>
            {primaryActionLabel}
          </Button>
        ) : null}
      </Pad>
    </PlainCard>
  );
}

const PlainCard = styled.div`
  width: 100%;
  border-radius: var(--radius-300);
  border: 1px solid var(--color-stroke-border);
  background: var(--color-surfaces-container-blur);
  overflow: hidden;
`;

const Editorial = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-300);
  border: 1px solid var(--color-stroke-border);
  overflow: hidden;
  background: var(--color-surfaces-container-blur);
`;

const HeroMedia = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 210px;
  overflow: hidden;

  @media (max-height: 700px) {
    max-height: 160px;
  }

  @media (max-height: 600px) {
    max-height: 120px;
  }
`;

const HeroImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const HeroWash = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    var(--color-surfaces-inverse-container) 0%,
    transparent 70%
  );
  opacity: 0.85;
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-250);
  padding: var(--space-300);
  margin-top: calc(-1 * var(--space-600));
  position: relative;
  z-index: 1;
`;

const ActionPad = styled.div`
  padding: 0 var(--space-300) var(--space-300);
`;

const Pad = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  padding: var(--space-350);
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
`;

const Comp = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Lockup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
`;

const Meta = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-helper);
  color: var(--color-text-icon-secondary);
  text-align: center;
`;

const Scorers = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-primary);
  text-align: center;
`;
