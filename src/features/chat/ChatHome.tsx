import { Badge } from '@cake-admin/cakeand';
import {
  Award,
  HelpCircle,
  PieChart,
  Swords,
  Trophy,
  Waypoints,
} from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import { AppIcon } from '../../components/AppIcon';
import {
  containerBlur,
  interactiveLift,
  restingTile,
} from '../../styles/surfaces';
import type { ChatPopularRequest } from '../../types/domain';

const ICON_MAP = {
  trophy: Trophy,
  help: HelpCircle,
  chart: PieChart,
  tactics: Waypoints,
  award: Award,
  upset: Swords,
} as const;

type ChatHomeProps = {
  requests: ChatPopularRequest[];
  onSelect: (request: ChatPopularRequest) => void;
};

export function ChatHome({ requests, onSelect }: ChatHomeProps) {
  return (
    <Home>
      <Hero>
        <OrbStage>
          <PulseRing />
          <PulseRing $delay />
          <OrbCore>
            <AppIcon size={72} />
          </OrbCore>
        </OrbStage>

        <HeroCopy>
          <LivePill>
            <Badge color="green" tone="subtle" dot>
              Ready when you are
            </Badge>
          </LivePill>
          <HeroTitle>
            Kickoff the
            <br />
            conversation
          </HeroTitle>
          <HeroSub>
            Plain-language answers on tactics, moments, records, and what just
            happened.
          </HeroSub>
        </HeroCopy>
      </Hero>

      <Popular>
        <PopularHead>
          <PopularLabel>Popular requests</PopularLabel>
          <PopularHint>Swipe for more</PopularHint>
        </PopularHead>
        <Carousel>
          {requests.map((req, i) => (
            <PromptCard
              key={req.id}
              request={req}
              index={i}
              onSelect={() => onSelect(req)}
            />
          ))}
        </Carousel>
      </Popular>
    </Home>
  );
}

function PromptCard({
  request,
  index,
  onSelect,
}: {
  request: ChatPopularRequest;
  index: number;
  onSelect: () => void;
}) {
  const Icon = ICON_MAP[request.icon];
  return (
    <CardButton type="button" onClick={onSelect} style={{ animationDelay: `${80 + index * 40}ms` }}>
      <IconSlot>
        <Icon size={20} aria-hidden />
      </IconSlot>
      <CardTitle>{request.prompt}</CardTitle>
      <CardCategory>{request.category}</CardCategory>
    </CardButton>
  );
}

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const pulse = keyframes`
  0% { transform: scale(0.92); opacity: 0.55; }
  100% { transform: scale(1.35); opacity: 0; }
`;

const rise = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Home = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-700);
  padding: var(--space-500) 0 var(--space-300);
  overflow: hidden;
`;

const Hero = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-600);
  padding: var(--space-400) var(--space-400) var(--space-200);
  flex: 1 1 auto;
  min-height: 0;
  animation: ${rise} 480ms ease-out both;
`;

const OrbStage = styled.div`
  position: relative;
  width: 148px;
  height: 148px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  animation: ${float} 5.5s ease-in-out infinite;
`;

const PulseRing = styled.div<{ $delay?: boolean }>`
  position: absolute;
  inset: 0;
  border-radius: var(--radius-1000);
  border: 2px solid var(--color-primary-primary);
  transform-origin: center;
  animation: ${pulse} 2.4s ease-out infinite;
  animation-delay: ${(p) => (p.$delay ? '1.1s' : '0s')};
  pointer-events: none;
`;

const OrbCore = styled.div`
  position: relative;
  z-index: 1;
  width: 96px;
  height: 96px;
  border-radius: var(--radius-1000);
  display: flex;
  align-items: center;
  justify-content: center;
  ${containerBlur}
  box-shadow:
    0 0 0 10px var(--color-primary-primary-overlay),
    var(--elevation-3);
  overflow: hidden;
`;

const HeroCopy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-250);
  text-align: center;
  max-width: 19.5rem;
`;

const LivePill = styled.div`
  display: inline-flex;
`;

const HeroTitle = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-hero);
  font-weight: var(--font-weight-bold);
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--color-text-icon-primary);
`;

const HeroSub = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.45;
  color: var(--color-text-icon-secondary);
`;

const Popular = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-250);
  padding-bottom: var(--space-100);
  animation: ${rise} 560ms ease-out both;
  animation-delay: 120ms;
`;

const PopularHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-200);
  padding: 0 var(--space-300);
`;

const PopularLabel = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-icon-secondary);
`;

const PopularHint = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-placeholder);
`;

const Carousel = styled.div`
  display: flex;
  gap: var(--space-200);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  padding: 0 var(--space-300) var(--space-100);
  scroll-padding-inline: var(--space-300);

  &::-webkit-scrollbar {
    height: 0;
  }
`;

const CardButton = styled.button`
  flex: 0 0 168px;
  width: 168px;
  min-height: 168px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-150);
  padding: var(--space-250);
  border: none;
  ${restingTile}
  ${interactiveLift}
  text-align: left;
  cursor: pointer;
  color: inherit;
  font: inherit;
  opacity: 0;
  animation: ${rise} 420ms ease-out forwards;
`;

const IconSlot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-200);
  background: linear-gradient(
    145deg,
    var(--color-primary-primary-overlay) 0%,
    var(--color-info-info-overlay) 100%
  );
  color: var(--color-primary-primary);
  box-shadow: inset 0 0 0 1px var(--color-stroke-border);
`;

const CardTitle = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  line-height: 1.4;
  color: var(--color-text-icon-primary);
`;

const CardCategory = styled.span`
  margin-top: auto;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;
