import styled from 'styled-components';
import { backgroundImage } from '../assets/template';

/** Full-bleed abstract background from Cake template (blurred + overlay). */
export function AppBackground() {
  return (
    <Root aria-hidden>
      <BlurredLayer>
        <Img src={backgroundImage} alt="" />
        <Overlay />
      </BlurredLayer>
    </Root>
  );
}

const Root = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const BlurredLayer = styled.div`
  position: absolute;
  inset: -20%;
  filter: blur(35px);
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: none;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  /* Figma template: 50% black wash over blurred art — no Cake token for this overlay. */
  background: rgb(0 0 0 / 0.5);
`;
