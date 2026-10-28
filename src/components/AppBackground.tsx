import styled from 'styled-components';
import { backgroundImage } from '../assets/template';

/** Full-bleed abstract blue background from Figma (blurred + 50% black overlay). */
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

/* Figma: oversized blurred image centered with horizontal offset */
const BlurredLayer = styled.div`
  position: absolute;
  left: calc(50% + 96.5px);
  top: 50%;
  width: 2906px;
  height: 1538px;
  transform: translate(-50%, -50%);
  filter: blur(35px);
`;

const Img = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: none;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
`;
