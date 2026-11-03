import { Badge, Button, Card, Divider } from '@cake-admin/cakeand';
import { ArrowRight, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ScoreDisplay } from '../../components/match/ScoreDisplay';
import { TeamIdentity } from '../../components/match/TeamIdentity';
import {
  competitions,
  matchForScenario,
  pastMatch,
  teams,
  upcomingMatch,
} from '../../data/fixtures/demoSpine';
import { useAccount } from './AccountContext';
import { AuthBrand, PoweredByLenovo } from './AuthBrand';
import { AuthShell } from './AuthShell';

const liveMatch = matchForScenario('live');
const liveCompetition = competitions.wwc2023;
const home = teams[liveMatch.homeTeamId];
const away = teams[liveMatch.awayTeamId];

const schedule = [
  {
    id: upcomingMatch.id,
    date: upcomingMatch.kickoffLabel,
    competition: competitions.wwc2023.name,
    home: teams[upcomingMatch.homeTeamId],
    away: teams[upcomingMatch.awayTeamId],
  },
  {
    id: pastMatch.id,
    date: pastMatch.kickoffLabel,
    competition: competitions.intlSemi.name,
    home: teams[pastMatch.homeTeamId],
    away: teams[pastMatch.awayTeamId],
  },
];

export function WelcomePage() {
  const navigate = useNavigate();
  const { continueFromWelcome } = useAccount();

  const goalEvents = liveMatch.events.filter((e) => e.type === 'goal' || e.type === 'card-yellow').slice(0, 3);

  return (
    <AuthShell label="Welcome">
      <AuthBrand />

      <Card elevation="high">
        <LivePad>
          <LiveTop>
            <LiveMeta>
              <Badge color="destructive" tone="solid" role="status">
                LIVE
              </Badge>
              <Minute>{liveMatch.periodLabel ?? `${liveMatch.minute}'`}</Minute>
            </LiveMeta>
            <Comp>{liveCompetition.name}</Comp>
          </LiveTop>

          <Lockup>
            <TeamIdentity team={home} size={52} />
            <ScoreDisplay
              home={home}
              away={away}
              score={liveMatch.score}
              status={liveMatch.status}
              periodLabel={liveMatch.periodLabel}
            />
            <TeamIdentity team={away} size={52} />
          </Lockup>

          <Divider />

          <Events aria-label="Key moments">
            {goalEvents.map((ev) => (
              <EventRow key={ev.id}>
                <EventMin>{ev.minute}'</EventMin>
                <EventLabel>{ev.playerName ?? ev.label}</EventLabel>
                <EventIcon aria-hidden>
                  <Circle size={10} fill="currentColor" />
                </EventIcon>
              </EventRow>
            ))}
          </Events>

          <Button
            fullWidth
            intent="secondary"
            variant="outline"
            onClick={() => {
              continueFromWelcome();
              navigate('/login');
            }}
          >
            Watch live
          </Button>
        </LivePad>
      </Card>

      <Schedule>
        {schedule.map((item) => (
          <Fixture key={item.id}>
            <FixtureDate>{item.date}</FixtureDate>
            <FixtureBody>
              <TeamIdentity team={item.home} size={40} orientation="vertical" />
              <Kickoff>
                <KickComp>{item.competition}</KickComp>
              </Kickoff>
              <TeamIdentity team={item.away} size={40} orientation="vertical" />
            </FixtureBody>
          </Fixture>
        ))}
      </Schedule>

      <Footer>
        <Button
          fullWidth
          size="lg"
          endIcon={<ArrowRight size={16} />}
          onClick={() => {
            continueFromWelcome();
            navigate('/login');
          }}
        >
          Let’s go
        </Button>
        <PoweredByLenovo />
      </Footer>
    </AuthShell>
  );
}

const LivePad = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  padding: var(--space-350);
`;

const LiveTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
`;

const LiveMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-150);
`;

const Minute = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Comp = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-secondary);
  text-align: right;
`;

const Lockup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  width: 100%;
`;

const Events = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
  width: 100%;
`;

const EventRow = styled.li`
  display: flex;
  align-items: center;
  gap: var(--space-200);
  width: 100%;
`;

const EventMin = styled.span`
  flex-shrink: 0;
  width: 2.5rem;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const EventLabel = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);
`;

const EventIcon = styled.span`
  flex-shrink: 0;
  color: var(--color-text-icon-secondary);
  display: inline-flex;
`;

const Schedule = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-350);
  width: 100%;
`;

const Fixture = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  width: 100%;
`;

const FixtureDate = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const FixtureBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  width: 100%;
`;

const Kickoff = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
`;

const KickComp = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  text-align: center;
`;

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-350);
  width: 100%;
`;
