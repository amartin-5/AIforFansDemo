import {
  Badge,
  Button,
  Card,
  HeroCard,
  IconButton,
  TextInput,
} from '@cake-admin/cakeand';
import {
  CalendarDays,
  CircleHelp,
  History,
  LayoutGrid,
  Mic,
  Radio,
  Search,
  Send,
  Shirt,
  Sparkles,
  Target,
  BarChart2,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { heroBg } from '../../assets/home';
import lenovoLogo from '../../assets/brand/lenovo-logo.png';
import { ContentSection } from '../../components/layout/ContentSection';
import { DEMO_MATCH_ID } from '../../data/fixtures/demoSpine';
import {
  AI_INSIGHTS,
  CHAT_PROMPTS,
  FEATURE_HEROES,
  JOURNEY_STEPS,
  MATCHDAY_FEATURES,
  PAST_FEATURES,
  PAST_LIBRARY,
  QUICK_LINKS,
  TEAM_FEATURES,
  type FeatureTile,
  type FeedModuleId,
  type PromptCard,
} from './homeContent';

function tileIcon(icon: FeatureTile['icon'] | PromptCard['icon']): ReactNode {
  const props = { size: 18, 'aria-hidden': true as const };
  switch (icon) {
    case 'calendar':
      return <CalendarDays {...props} />;
    case 'radio':
      return <Radio {...props} />;
    case 'sparkles':
      return <Sparkles {...props} />;
    case 'replay':
      return <History {...props} />;
    case 'chart':
      return <BarChart2 {...props} />;
    case 'shirt':
      return <Shirt {...props} />;
    case 'goal':
      return <Target {...props} />;
    case 'help':
      return <CircleHelp {...props} />;
    case 'formation':
      return <LayoutGrid {...props} />;
  }
}

function quickIcon(icon: (typeof QUICK_LINKS)[number]['icon']): ReactNode {
  const props = { size: 22, 'aria-hidden': true as const };
  switch (icon) {
    case 'upcoming':
      return <CalendarDays {...props} />;
    case 'matchday':
      return <Radio {...props} />;
    case 'past':
      return <History {...props} />;
    case 'my-team':
      return <Shirt {...props} />;
  }
}

export function HomeIntro() {
  const navigate = useNavigate();

  return (
    <>
      <IntroHero>
        <IntroMedia aria-hidden>
          <IntroBg src={heroBg} alt="" />
          <IntroWash />
        </IntroMedia>
        <IntroBody>
          <AiMark aria-hidden>
            <Sparkles size={40} strokeWidth={1.75} />
          </AiMark>
          <Card>
            <HeroCard
              title={
                <>
                  AI powered football intelligence{' '}
                  <Accent>beyond the pitch.</Accent>
                </>
              }
              body="Your sidekick for Spain’s path — upcoming fixtures, live matchday, AI chat, past replays, and My Team intel."
              actions={
                <Button size="md" onClick={() => navigate('/chat')}>
                  Ask the AI
                </Button>
              }
            />
          </Card>
          <PoweredBy>
            <PoweredLabel>Powered by</PoweredLabel>
            <LenovoMark src={lenovoLogo} alt="Lenovo" />
          </PoweredBy>
        </IntroBody>
      </IntroHero>

      <QuickGrid role="navigation" aria-label="App destinations">
        {QUICK_LINKS.map((link) => (
          <QuickCard
            key={link.id}
            type="button"
            onClick={() => navigate(link.href)}
          >
            <QuickIconWrap>{quickIcon(link.icon)}</QuickIconWrap>
            <QuickLabel>{link.label}</QuickLabel>
          </QuickCard>
        ))}
      </QuickGrid>
    </>
  );
}

function FeatureHeroBlock({
  eyebrow,
  title,
  body,
  cta,
  href,
  image,
  searchPlaceholder,
  onSearch,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  image: string;
  searchPlaceholder?: string;
  onSearch?: (q: string) => void;
}) {
  const navigate = useNavigate();

  return (
    <FeatureHero>
      <FeatureMedia aria-hidden>
        <FeatureImg src={image} alt="" />
        <FeatureWash />
      </FeatureMedia>
      <FeatureContent>
        <Badge color="secondary" tone="subtle" dot={false}>
          {eyebrow}
        </Badge>
        <FeatureTitle>{title}</FeatureTitle>
        <FeatureBody>{body}</FeatureBody>
        <Button
          size="sm"
          intent="primary"
          variant="outline"
          onClick={() => navigate(href)}
        >
          {cta} →
        </Button>
        {searchPlaceholder ? (
          <SearchWrap>
            <TextInput
              aria-label="Ask about this match"
              placeholder={searchPlaceholder}
              startIcon={<Search size={16} />}
              size="md"
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                const value = (e.target as HTMLInputElement).value.trim();
                onSearch?.(value || searchPlaceholder);
              }}
            />
          </SearchWrap>
        ) : null}
      </FeatureContent>
    </FeatureHero>
  );
}

function TileRail({ tiles }: { tiles: FeatureTile[] }) {
  const navigate = useNavigate();

  return (
    <HScroll>
      {tiles.map((tile) => (
        <TileCard
          key={tile.id}
          type="button"
          onClick={() => navigate(tile.href)}
        >
          <TileIcon>{tileIcon(tile.icon)}</TileIcon>
          <TileTitle>{tile.title}</TileTitle>
          <TileBody>{tile.body}</TileBody>
        </TileCard>
      ))}
    </HScroll>
  );
}

function MatchdayModule() {
  const navigate = useNavigate();
  const hero = FEATURE_HEROES.matchday;

  return (
    <Module>
      <FeatureHeroBlock
        {...hero}
        onSearch={(q) => navigate(`/chat?q=${encodeURIComponent(q)}`)}
      />
      <TileRail tiles={MATCHDAY_FEATURES} />
    </Module>
  );
}

function PastLibraryModule() {
  const navigate = useNavigate();

  return (
    <Module>
      <Eyebrow>Past</Eyebrow>
      <ContentSection
        title="WWC 2023 — Spain’s path"
        action={
          <ViewLink type="button" onClick={() => navigate('/past')}>
            View →
          </ViewLink>
        }
      >
        <HScroll>
          {PAST_LIBRARY.map((item) => (
            <ReplayCardButton
              key={item.id}
              type="button"
              onClick={() => navigate(`/past/${item.matchId}`)}
            >
              <ReplayImg src={item.image} alt="" />
              <ReplayWash />
              <ReplayTop>
                <Badge color="primary" tone="solid" dot={false}>
                  {item.badge}
                </Badge>
                <Duration>{item.score}</Duration>
              </ReplayTop>
              <ReplayBottom>
                <ReplayTitle>{item.title}</ReplayTitle>
                <ReplayMeta>
                  <span>{item.meta}</span>
                  <span>Open analysis</span>
                </ReplayMeta>
              </ReplayBottom>
            </ReplayCardButton>
          ))}
        </HScroll>
      </ContentSection>
      <TileRail tiles={PAST_FEATURES} />
    </Module>
  );
}

function MyTeamModule() {
  return (
    <Module>
      <FeatureHeroBlock {...FEATURE_HEROES.myTeam} />
      <TileRail tiles={TEAM_FEATURES} />
    </Module>
  );
}

function JourneyModule() {
  const navigate = useNavigate();

  return (
    <Module>
      <Card>
        <ContinuePad>
          <ContinueHead>
            <div>
              <Eyebrow>Demo journey</Eyebrow>
              <ContinueTitle>Spain vs Sweden — Semi-final</ContinueTitle>
            </div>
            <ViewLink type="button" onClick={() => navigate('/matchday')}>
              View →
            </ViewLink>
          </ContinueHead>
          <Journey>
            {JOURNEY_STEPS.map((step, i) => (
              <JourneyStep
                key={step.id}
                type="button"
                $active={i <= 1}
                onClick={() => navigate(step.href)}
              >
                <JourneyDot $active={i <= 1} />
                <span>{step.label}</span>
              </JourneyStep>
            ))}
          </Journey>
          <JourneyCopy>
            Walk the same match from pre-match briefing through live, moment
            explain, and full-time recap.
          </JourneyCopy>
          <Button
            size="md"
            fullWidth
            variant="tonal"
            onClick={() => navigate(`/matchday/${DEMO_MATCH_ID}/preview`)}
          >
            Resume from preview
          </Button>
        </ContinuePad>
      </Card>
    </Module>
  );
}

function InsightsModule() {
  const navigate = useNavigate();

  return (
    <Module>
      <Eyebrow>AI insights</Eyebrow>
      <ContentSection
        title="Moments worth understanding"
        action={
          <ViewLink type="button" onClick={() => navigate('/chat')}>
            Ask AI →
          </ViewLink>
        }
      >
        <TermStack>
          {AI_INSIGHTS.map((insight) => (
            <InsightButton
              key={insight.id}
              type="button"
              onClick={() => navigate(insight.href)}
            >
              <Card>
                <TermPad>
                  <Badge color="secondary" tone="subtle" dot={false}>
                    {insight.badge}
                  </Badge>
                  <TermTitle>{insight.title}</TermTitle>
                  <TermBody>{insight.body}</TermBody>
                </TermPad>
              </Card>
            </InsightButton>
          ))}
        </TermStack>
      </ContentSection>
    </Module>
  );
}

function ChatModule() {
  return (
    <Module>
      <FeatureHeroBlock {...FEATURE_HEROES.chat} />
    </Module>
  );
}

function KickoffModule() {
  const navigate = useNavigate();

  return (
    <Module>
      <KickoffHead>
        <KickoffTitle>Kickoff the conversation</KickoffTitle>
        <KickoffSub>Ask about Spain vs Sweden — tactics, moments, and stats.</KickoffSub>
      </KickoffHead>
      <Composer>
        <TextInput
          aria-label="Send a message"
          placeholder="Ask about this match…"
          size="md"
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            const value = (e.target as HTMLInputElement).value.trim();
            if (!value) return;
            navigate(`/chat?q=${encodeURIComponent(value)}`);
          }}
        />
        <IconButton
          label="Voice input"
          icon={<Mic size={18} />}
          intent="secondary"
          variant="outline"
          size="md"
          onClick={() => navigate('/chat')}
        />
        <IconButton
          label="Send"
          icon={<Send size={18} />}
          intent="primary"
          variant="fill"
          size="md"
          onClick={() => navigate('/chat')}
        />
      </Composer>
      <HScroll>
        {CHAT_PROMPTS.map((p) => (
          <PromptCardButton
            key={p.id}
            type="button"
            onClick={() => navigate(`/chat?q=${encodeURIComponent(p.question)}`)}
          >
            <TileIcon>{tileIcon(p.icon)}</TileIcon>
            <TileTitle>{p.question}</TileTitle>
            <TileBody>{p.hint}</TileBody>
          </PromptCardButton>
        ))}
      </HScroll>
    </Module>
  );
}

export function HomeFeedModule({ module }: { module: FeedModuleId }) {
  switch (module) {
    case 'matchday':
      return <MatchdayModule />;
    case 'past-library':
      return <PastLibraryModule />;
    case 'my-team':
      return <MyTeamModule />;
    case 'journey':
      return <JourneyModule />;
    case 'insights':
      return <InsightsModule />;
    case 'chat':
      return <ChatModule />;
    case 'kickoff':
      return <KickoffModule />;
  }
}

const Accent = styled.span`
  color: var(--color-primary-primary);
`;

const IntroHero = styled.section`
  position: relative;
  width: 100%;
  border-radius: var(--radius-400);
  overflow: hidden;
  border: 1px solid var(--color-stroke-border);
  background: var(--color-surfaces-container-blur);
`;

const IntroMedia = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const IntroBg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const IntroWash = styled.div`
  position: absolute;
  inset: 0;
  /* dark.a: inverse-container is light — use canvas + overlay-scrim for dark media washes */
  background:
    linear-gradient(
      to top,
      var(--color-surfaces-canvas) 8%,
      transparent 72%
    ),
    var(--color-overlay-scrim);
`;

const IntroBody = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-250);
  padding: var(--space-400) var(--space-300) var(--space-300);
`;

const AiMark = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-200);
  background: var(--color-surfaces-on-container);
  border: 1px solid var(--color-stroke-border);
  color: var(--color-text-icon-primary);
`;

const PoweredBy = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-200);
`;

const PoweredLabel = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const LenovoMark = styled.img`
  height: 16px;
  width: auto;
  display: block;
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-150);
  width: 100%;
`;

const QuickCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-100);
  min-height: 78px;
  padding: var(--space-150);
  border-radius: var(--radius-300);
  border: 1px solid var(--color-stroke-border);
  background: var(--color-surfaces-container-blur);
  color: var(--color-text-icon-primary);
  cursor: pointer;
  font: inherit;
`;

const QuickIconWrap = styled.span`
  display: inline-flex;
  color: var(--color-primary-primary);
`;

const QuickLabel = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  text-align: center;
  line-height: 1.25;
`;

const Module = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-250);
  width: 100%;
  min-width: 0;
`;

const FeatureHero = styled.article`
  position: relative;
  width: 100%;
  min-height: 280px;
  border-radius: var(--radius-400);
  overflow: hidden;
  border: 1px solid var(--color-stroke-border);
  background: var(--color-surfaces-canvas);
`;

const FeatureMedia = styled.div`
  position: absolute;
  inset: 0;
`;

const FeatureImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const FeatureWash = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      var(--color-surfaces-canvas) 14%,
      transparent 70%
    ),
    var(--color-overlay-scrim);
`;

const FeatureContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-200);
  padding: var(--space-400) var(--space-300) var(--space-300);
  min-height: 280px;
  justify-content: flex-end;
`;

const FeatureTitle = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-bold);
  line-height: 1.1;
  color: var(--color-text-icon-primary);
  white-space: pre-line;
  text-transform: uppercase;
  letter-spacing: -0.02em;
`;

const FeatureBody = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.4;
  color: var(--color-text-icon-secondary);
  max-width: 36ch;
`;

const SearchWrap = styled.div`
  width: 100%;
  margin-top: var(--space-100);
`;

const HScroll = styled.div`
  display: flex;
  gap: var(--space-200);
  width: 100%;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  padding-bottom: var(--space-100);
  scroll-snap-type: x mandatory;

  & > * {
    scroll-snap-align: start;
    flex: 0 0 auto;
  }
`;

const TileCard = styled.button`
  width: 168px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-150);
  padding: var(--space-250);
  border-radius: var(--radius-300);
  border: 1px solid var(--color-stroke-border);
  background: var(--color-surfaces-container-blur);
  color: inherit;
  cursor: pointer;
  text-align: left;
  font: inherit;
`;

const TileIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-200);
  background: var(--color-primary-primary-overlay);
  color: var(--color-primary-primary);
`;

const TileTitle = styled.h3`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-helper);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
  line-height: 1.3;
`;

const TileBody = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  line-height: 1.35;
`;

const ViewLink = styled.button`
  min-height: 44px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-primary-primary);
  text-decoration: underline;
`;

const Eyebrow = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-primary-primary);
`;

const ReplayCardButton = styled.button`
  position: relative;
  width: 272px;
  height: 158px;
  border: none;
  padding: 0;
  border-radius: var(--radius-300);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  background: var(--color-surfaces-canvas);
`;

const ReplayImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ReplayWash = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      var(--color-surfaces-canvas) 0%,
      transparent 58%
    ),
    var(--color-overlay-scrim);
`;

const ReplayTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-200);
  z-index: 1;
`;

const Duration = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-icon-primary);
  background: var(--color-surfaces-container-blur);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-100);
  padding: var(--space-050) var(--space-150);
`;

const ReplayBottom = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  padding: var(--space-200);
`;

const ReplayTitle = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-helper);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const ReplayMeta = styled.span`
  display: flex;
  justify-content: space-between;
  gap: var(--space-200);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const ContinuePad = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  padding: var(--space-350);
`;

const ContinueHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-200);
`;

const ContinueTitle = styled.h3`
  margin: var(--space-100) 0 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const Journey = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--space-100);
  width: 100%;
`;

const JourneyStep = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-100);
  flex: 1;
  min-height: 44px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: ${(p) =>
    p.$active
      ? 'var(--color-text-icon-primary)'
      : 'var(--color-text-icon-secondary)'};
  text-align: center;
`;

const JourneyDot = styled.span<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: var(--radius-1000);
  background: ${(p) =>
    p.$active
      ? 'var(--color-primary-primary)'
      : 'var(--color-surfaces-on-container)'};
`;

const JourneyCopy = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.45;
  color: var(--color-text-icon-secondary);
`;

const TermStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
`;

const InsightButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
`;

const TermPad = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-150);
  padding: var(--space-300);
`;

const TermTitle = styled.h3`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const TermBody = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.45;
  color: var(--color-text-icon-secondary);
`;

const KickoffHead = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-100);
  text-align: center;
  padding-top: var(--space-300);
`;

const KickoffTitle = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const KickoffSub = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-secondary);
`;

const Composer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: var(--space-150);
  align-items: end;
  width: 100%;
`;

const PromptCardButton = styled.button`
  width: 168px;
  min-height: 154px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-150);
  padding: var(--space-250);
  border-radius: var(--radius-300);
  border: 1px solid var(--color-stroke-border);
  background: var(--color-surfaces-container-blur);
  color: inherit;
  cursor: pointer;
  text-align: left;
  font: inherit;
`;
